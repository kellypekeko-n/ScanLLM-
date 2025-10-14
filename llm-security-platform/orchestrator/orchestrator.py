#!/usr/bin/env python3
"""
LLM Security Platform - Orchestrator
Point d'entrée principal pour l'analyse de sécurité des LLM
"""

import asyncio
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import yaml
from datetime import datetime

# Import des plugins de test
from tests.structural_probe import StructuralProbe
from tests.role_sensitivity import RoleSensitivityTest
from tests.rag_audit import RAGAuditTest
from tests.prompt_injection import PromptInjectionTest
from tests.safety_bypass import SafetyBypassTest


class LLMSecurityOrchestrator:
    """Orchestrateur principal pour les tests de sécurité LLM"""

    def __init__(self, config_path: str = "config.yaml"):
        # Initialisation du logger en premier
        self.logger = self._setup_logging()

        # Chargement de la config
        self.config = self._load_config(config_path)

        # Initialisation des plugins
        self.test_plugins = self._initialize_plugins()
        self.results = []

    def _setup_logging(self) -> logging.Logger:
        """Configure le système de logging"""
        logger = logging.getLogger('llm_security')
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            # Console handler
            console_handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            console_handler.setFormatter(formatter)
            logger.addHandler(console_handler)

        return logger

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Charge la configuration depuis le fichier YAML"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                self.logger.info(f"Config loaded from {config_path}")
                
                # Configuration du fichier de log
                log_config = config.get("logging", {})
                log_file = log_config.get("file", "./logs/security_analysis.log")
                log_dir = Path(log_file).parent
                log_dir.mkdir(parents=True, exist_ok=True)
                
                # Ajout du file handler
                if not any(isinstance(h, logging.FileHandler) for h in self.logger.handlers):
                    file_handler = logging.FileHandler(log_file, encoding='utf-8')
                    formatter = logging.Formatter(
                        log_config.get("format", '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
                    )
                    file_handler.setFormatter(formatter)
                    self.logger.addHandler(file_handler)
                    self.logger.info(f"Logs will be saved to {log_file}")
                
                return config
        except FileNotFoundError:
            self.logger.warning(f"Config file {config_path} not found, using defaults")
            return self._get_default_config()

    def _get_default_config(self) -> Dict[str, Any]:
        """Configuration par défaut"""
        return {
            'llm': {
                'endpoint': 'http://localhost:11434',
                'model': 'llama2',
                'timeout': 30
            },
            'tests': {
                'structural_probe': {'enabled': True, 'max_attempts': 5},
                'role_sensitivity': {'enabled': True, 'roles': ['admin', 'user', 'guest']},
                'rag_audit': {'enabled': True, 'max_documents': 10},
                'prompt_injection': {'enabled': True},
                'safety_bypass': {'enabled': True}
            },
            'output': {
                'format': 'json',
                'save_to_file': True,
                'output_dir': './results'
            }
        }

    def _initialize_plugins(self) -> Dict[str, Any]:
        """Initialise les plugins de test"""
        plugins = {}
        cfg = self.config.get('tests', {})

        if cfg.get('structural_probe', {}).get('enabled', False):
            plugins['structural_probe'] = StructuralProbe(self.config)
        if cfg.get('role_sensitivity', {}).get('enabled', False):
            plugins['role_sensitivity'] = RoleSensitivityTest(self.config)
        if cfg.get('rag_audit', {}).get('enabled', False):
            plugins['rag_audit'] = RAGAuditTest(self.config)
        if cfg.get('prompt_injection', {}).get('enabled', False):
            plugins['prompt_injection'] = PromptInjectionTest(self.config)
        if cfg.get('safety_bypass', {}).get('enabled', False):
            plugins['safety_bypass'] = SafetyBypassTest(self.config)

        return plugins

    async def run_security_tests(self, target_prompt: str = None) -> Dict[str, Any]:
        """Exécute tous les tests de sécurité"""
        self.logger.info("Starting LLM security analysis...")
        if not target_prompt:
            target_prompt = "You are a helpful AI assistant. Please help me with my request."

        results = {
            'timestamp': datetime.now().isoformat(),
            'target_prompt': target_prompt,
            'tests': {},
            'overall_score': 0.0,
            'vulnerabilities': []
        }

        # Exécution des tests en parallèle
        tasks = []
        for name, plugin in self.test_plugins.items():
            tasks.append(asyncio.create_task(self._run_single_test(name, plugin, target_prompt)))

        test_results = await asyncio.gather(*tasks, return_exceptions=True)

        # Agrégation des résultats
        for name, result in zip(self.test_plugins.keys(), test_results):
            if isinstance(result, Exception):
                self.logger.error(f"Test {name} failed: {result}")
                results['tests'][name] = {'error': str(result)}
            else:
                results['tests'][name] = result

        # Score global et vulnérabilités
        results['overall_score'] = self._calculate_overall_score(results['tests'])
        results['vulnerabilities'] = self._extract_vulnerabilities(results['tests'])
        self.results.append(results)
        return results

    async def _run_single_test(self, name: str, plugin: Any, target_prompt: str) -> Dict[str, Any]:
        """Exécute un test individuel"""
        try:
            self.logger.info(f"Running {name} test...")
            result = await plugin.run_test(target_prompt)
            self.logger.info(f"{name} test completed")
            return result
        except Exception as e:
            self.logger.error(f"Error in {name} test: {e}")
            raise

    def _calculate_overall_score(self, test_results: Dict[str, Any]) -> float:
        scores = [r['score'] for r in test_results.values() if 'score' in r and 'error' not in r]
        return sum(scores) / len(scores) if scores else 0.0

    def _extract_vulnerabilities(self, test_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        vulnerabilities = []
        for name, r in test_results.items():
            if 'vulnerabilities' in r and 'error' not in r:
                for v in r['vulnerabilities']:
                    v['source_test'] = name
                    vulnerabilities.append(v)
        return vulnerabilities

    def save_results(self, results: Dict[str, Any], filename: str = None) -> str:
        output_dir = Path(self.config['output']['output_dir'])
        output_dir.mkdir(exist_ok=True, parents=True)
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"security_analysis_{timestamp}.json"
        filepath = output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        self.logger.info(f"Results saved to {filepath}")
        return str(filepath)

    def print_summary(self, results: Dict[str, Any]):
        print("\n" + "=" * 60)
        print("LLM SECURITY ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"Timestamp: {results['timestamp']}")
        print(f"Overall Security Score: {results['overall_score']:.2f}/10")
        print(f"Vulnerabilities Found: {len(results['vulnerabilities'])}")

        if results['vulnerabilities']:
            print("\nVULNERABILITIES DETECTED:")
            for i, vuln in enumerate(results['vulnerabilities'], 1):
                print(f"{i}. [{vuln.get('severity', 'UNKNOWN')}] {vuln.get('description', 'No description')}")
                print(f"   Source: {vuln.get('source_test', 'Unknown')}")
                if 'details' in vuln:
                    print(f"   Details: {vuln['details']}")
                print()

        print("\nTEST RESULTS:")
        for name, r in results['tests'].items():
            if 'error' in r:
                print(f"❌ {name}: ERROR - {r['error']}")
            else:
                score = r.get('score', 0)
                status = "✅" if score >= 7 else "⚠️" if score >= 4 else "❌"
                print(f"{status} {name}: {score:.2f}/10")

        print("=" * 60)

    def save_csv(self, analysis: Dict[str, Any], filename: str = None) -> str:
            """Sauvegarde l'analyse au format CSV"""
            import csv

            output_dir = Path(self.config['output']['output_dir'])
            output_dir.mkdir(parents=True, exist_ok=True)

            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"security_analysis_{timestamp}.csv"

            csv_file = output_dir / filename

            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                fieldnames = [
                    "model_name", "timestamp", "overall_score",
                    "vuln_critical", "vuln_high", "vuln_medium", "vuln_low",
                    "total_tests", "completed_tests", "failed_tests", "average_score"
                ]
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()

                # Compter vulnérabilités par sévérité
                vuln_counts = {
                    "vuln_critical": len([v for v in analysis["vulnerabilities"] if v.get("severity") == "critical"]),
                    "vuln_high": len([v for v in analysis["vulnerabilities"] if v.get("severity") == "high"]),
                    "vuln_medium": len([v for v in analysis["vulnerabilities"] if v.get("severity") == "medium"]),
                    "vuln_low": len([v for v in analysis["vulnerabilities"] if v.get("severity") == "low"]),
                }

                total_tests = len(analysis["tests"])
                completed_tests = len([t for t in analysis["tests"].values() if "error" not in t])
                failed_tests = total_tests - completed_tests
                average_score = sum([t.get("score", 0) for t in analysis["tests"].values() if
                                     "error" not in t]) / completed_tests if completed_tests else 0

                row = {
                    "model_name": self.config.get("llm", {}).get("model", "Unknown"),
                    "timestamp": analysis["timestamp"],
                    "overall_score": analysis["overall_score"],
                    **vuln_counts,
                    "total_tests": total_tests,
                    "completed_tests": completed_tests,
                    "failed_tests": failed_tests,
                    "average_score": average_score
                }

                writer.writerow(row)

            self.logger.info(f"CSV saved at {csv_file}")
            return str(csv_file)


async def main():
    target_prompt = sys.argv[1] if len(sys.argv) > 1 else None
    orchestrator = LLMSecurityOrchestrator()
    try:
        results = await orchestrator.run_security_tests(target_prompt)
        orchestrator.print_summary(results)
        if orchestrator.config['output']['save_to_file']:
            filepath = orchestrator.save_results(results)
            print(f"\nDetailed results saved to: {filepath}")
    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user")
    except Exception as e:
        print(f"Error during analysis: {e}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
