#!/usr/bin/env python3
"""
Orchestrator for safe LLM vulnerability scanning (research/defensive).
- Modular: tests are plugins in orchestrator/tests/
- Logs JSON results per test into RESULTS_DIR
- Designed to call local LM Studio endpoints or any LLM REST endpoint
- No offensive payloads included. All tests are "measurement" style.
"""

import os
import sys
import time
import uuid
import json
import glob
import hashlib
import logging
import importlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Any, List
import requests

# --------------------
# CONFIG (env or config.yaml)
# --------------------
LM_ENDPOINT = os.environ.get("LM_ENDPOINT", "http://localhost:11434")  # LM Studio default
RESULTS_DIR = os.environ.get("RESULTS_DIR", "./results")
MODELS_ENV = os.environ.get("MODELS", "llama3.2").split(",")  # comma-separated
MAX_WORKERS = int(os.environ.get("MAX_WORKERS", "4"))
TESTS_DIR = os.path.join(os.path.dirname(__file__), "tests")

# Runtime metadata
RUN_ID = str(uuid.uuid4())
TIMESTAMP = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

# --------------------
# Logging
# --------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger("orchestrator")

# Ensure results dir exists
os.makedirs(RESULTS_DIR, exist_ok=True)

# --------------------
# Helper functions
# --------------------
def sha256_hexdigest(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def save_result(result: Dict[str, Any]):
    """
    Save a single JSON result file named by model/test/timestamp.
    """
    model_id = result.get("model_id", "unknown")
    test_type = result.get("test_type", "unknown")
    ts = int(time.time())
    fname = f"{RESULTS_DIR}/{model_id}__{test_type}__{ts}__{uuid.uuid4().hex}.json"
    with open(fname, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    logger.debug(f"Saved result {fname}")
    return fname

def call_model_predict(model_id: str, input_text: str, timeout: int = 30) -> Dict[str, Any]:
    """
    Generic call to LM endpoint. Adapt depending on LM Studio or other API.
    This function expects a JSON response or fallback to text.
    """
    # NOTE: This is a simple POST structure for LM Studio v1. Adapt if needed.
    url = f"{LM_ENDPOINT}/v1/models/{model_id}/predict"
    payload = {"input": input_text}
    try:
        r = requests.post(url, json=payload, timeout=timeout)
        r.raise_for_status()
        # Try JSON
        try:
            return {"status": "ok", "body": r.json()}
        except Exception:
            return {"status": "ok", "body": {"text": r.text}}
    except Exception as e:
        logger.error(f"Model call error for {model_id}: {e}")
        return {"status": "error", "error": str(e)}

# --------------------
# Plugin loader
# Each test plugin must expose: run(model_id, lm_call) -> Dict result
# --------------------
def discover_test_plugins(tests_dir: str) -> List:
    sys.path.insert(0, tests_dir)
    plugin_files = glob.glob(os.path.join(tests_dir, "*.py"))
    plugins = []
    for f in plugin_files:
        name = os.path.basename(f)[:-3]
        if name.startswith("_"):
            continue
        try:
            mod = importlib.import_module(name)
            if hasattr(mod, "run") and hasattr(mod, "TEST_TYPE"):
                plugins.append(mod)
                logger.info(f"Loaded test plugin: {name} ({getattr(mod,'TEST_TYPE')})")
            else:
                logger.warning(f"Skipping {name}: no run() or TEST_TYPE")
        except Exception as e:
            logger.exception(f"Failed to import plugin {name}: {e}")
    return plugins

# --------------------
# Runner orchestration
# --------------------
def run_tests_on_model(model_id: str, plugins: List, results: List[Dict[str, Any]]):
    logger.info(f"Starting tests for model {model_id}")
    for plugin in plugins:
        test_type = getattr(plugin, "TEST_TYPE", plugin.__name__)
        test_id = f"{test_type}__{uuid.uuid4().hex[:8]}"
        input_text = getattr(plugin, "TEST_INPUT", "Please summarize the following safely.")
        # Each plugin implements run(model_id, lm_call) and returns dict with metrics
        try:
            res = plugin.run(model_id=model_id, lm_call=call_model_predict)
            # Validate structure
            metadata = {
                "run_id": RUN_ID,
                "timestamp": TIMESTAMP,
                "model_id": model_id,
                "test_type": test_type,
                "test_id": test_id,
                "input_hash": sha256_hexdigest(input_text),
                "input_meta": {"length": len(input_text)}
            }
            full = {**metadata, **res}
            fname = save_result(full)
            results.append(full)
            logger.info(f"Completed {test_type} on {model_id} -> saved {fname}")
        except Exception as e:
            logger.exception(f"Error running {test_type} on {model_id}: {e}")
            err_result = {
                "run_id": RUN_ID,
                "timestamp": TIMESTAMP,
                "model_id": model_id,
                "test_type": test_type,
                "test_id": test_id,
                "error": str(e)
            }
            save_result(err_result)
            results.append(err_result)

def main():
    # Discover plugins
    plugins = discover_test_plugins(TESTS_DIR)
    if not plugins:
        logger.warning("No test plugins found. Add plugins under orchestrator/tests/")
        return

    models = [m.strip() for m in MODELS_ENV if m.strip()]
    if not models:
        logger.error("No models configured. Set MODELS env variable or config file.")
        return

    all_results = []
    # Use ThreadPoolExecutor to parallelize models x tests (bounded by MAX_WORKERS)
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for model in models:
            futures.append(executor.submit(run_tests_on_model, model, plugins, all_results))
        for fut in as_completed(futures):
            try:
                fut.result()
            except Exception as e:
                logger.exception(f"Unhandled exception in worker: {e}")

    logger.info(f"Scan run completed. RunID={RUN_ID}. Results files in {RESULTS_DIR}")

if __name__ == "__main__":
    main()
