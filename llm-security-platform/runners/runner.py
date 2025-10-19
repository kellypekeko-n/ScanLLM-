"""
LLM Security Platform - Isolated Runner
Worker isolé pour l'exécution des tests de sécurité
"""

import asyncio
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import signal

# Ajouter le chemin parent pour les imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from orchestrator.orchestrator import LLMSecurityOrchestrator


class IsolatedRunner:
    """Runner isolé pour l'exécution des tests de sécurité"""
    
    def __init__(self, config_path: str, output_dir: str = "./runner_results"):
        self.logger = logging.getLogger('isolated_runner')
        self.config_path = config_path
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Orchestrateur
        self.orchestrator = None
        
        # État du runner
        self.running = False
        self.current_task = None
        
        # Gestion des signaux
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Gère les signaux d'arrêt"""
        self.logger.info(f"Received signal {signum}, shutting down gracefully...")
        self.running = False
        
        if self.current_task:
            self.current_task.cancel()
    
    async def initialize(self):
        """Initialise le runner"""
        try:
            self.orchestrator = LLMSecurityOrchestrator(self.config_path)
            self.logger.info("Runner initialized successfully")
            return True
        except Exception as e:
            self.logger.error(f"Failed to initialize runner: {e}")
            return False
    
    async def run_scan(self, model_name: str, target_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Exécute un scan de sécurité"""
        self.logger.info(f"Starting security scan for model: {model_name}")
        
        scan_result = {
            'model_name': model_name,
            'status': 'running',
            'started_at': datetime.now().isoformat(),
            'completed_at': None,
            'results': None,
            'error': None
        }
        
        try:
            # Exécute les tests de sécurité
            results = await self.orchestrator.run_security_tests(target_prompt)
            results['model_name'] = model_name
            
            scan_result['status'] = 'completed'
            scan_result['completed_at'] = datetime.now().isoformat()
            scan_result['results'] = results
            
            # Sauvegarde les résultats
            self._save_results(model_name, results)
            
            self.logger.info(f"Security scan completed for model: {model_name}")
            
        except Exception as e:
            self.logger.error(f"Error during security scan: {e}")
            scan_result['status'] = 'failed'
            scan_result['error'] = str(e)
            scan_result['completed_at'] = datetime.now().isoformat()
        
        return scan_result
    
    def _save_results(self, model_name: str, results: Dict[str, Any]):
        """Sauvegarde les résultats du scan"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"scan_{model_name}_{timestamp}.json"
        filepath = self.output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Results saved to {filepath}")
    
    async def run_scheduled_scans(self, schedule: List[Dict[str, Any]]):
        """Exécute des scans planifiés"""
        self.running = True
        
        self.logger.info(f"Starting scheduled scans: {len(schedule)} models")
        
        for scan_config in schedule:
            if not self.running:
                self.logger.info("Runner stopped, cancelling remaining scans")
                break
            
            model_name = scan_config.get('model_name')
            target_prompt = scan_config.get('target_prompt')
            
            self.logger.info(f"Processing scan for: {model_name}")
            
            self.current_task = asyncio.create_task(
                self.run_scan(model_name, target_prompt)
            )
            
            try:
                await self.current_task
            except asyncio.CancelledError:
                self.logger.info(f"Scan cancelled for: {model_name}")
                break
            
            # Délai entre les scans
            delay = scan_config.get('delay', 5)
            if delay > 0 and self.running:
                await asyncio.sleep(delay)
        
        self.logger.info("Scheduled scans completed")
    
    async def run_continuous(self, interval: int = 3600):
        """Exécute le runner en mode continu"""
        self.running = True
        
        self.logger.info(f"Starting continuous runner (interval: {interval}s)")
        
        while self.running:
            try:
                # Exécute un scan
                await self.run_scan("default_model")
                
                # Attend l'intervalle
                await asyncio.sleep(interval)
                
            except asyncio.CancelledError:
                self.logger.info("Continuous runner cancelled")
                break
            except Exception as e:
                self.logger.error(f"Error in continuous runner: {e}")
                await asyncio.sleep(60)  # Attend 1 minute avant de réessayer
        
        self.logger.info("Continuous runner stopped")


class RunnerManager:
    """Gestionnaire de runners pour orchestration multi-workers"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('runner_manager')
        self.runners: List[IsolatedRunner] = []
    
    async def create_runner(self, config_path: str, output_dir: str) -> IsolatedRunner:
        """Crée un nouveau runner"""
        runner = IsolatedRunner(config_path, output_dir)
        
        if await runner.initialize():
            self.runners.append(runner)
            self.logger.info(f"Runner created: {len(self.runners)} total runners")
            return runner
        else:
            raise Exception("Failed to initialize runner")
    
    async def run_parallel_scans(self, models: List[str], 
                                config_path: str,
                                max_workers: int = 3) -> List[Dict[str, Any]]:
        """Exécute des scans en parallèle sur plusieurs modèles"""
        self.logger.info(f"Starting parallel scans for {len(models)} models with {max_workers} workers")
        
        # Crée les runners
        runners = []
        for i in range(min(max_workers, len(models))):
            output_dir = f"./runner_results/worker_{i}"
            runner = await self.create_runner(config_path, output_dir)
            runners.append(runner)
        
        # Distribue les modèles aux runners
        tasks = []
        for i, model_name in enumerate(models):
            runner = runners[i % len(runners)]
            task = asyncio.create_task(runner.run_scan(model_name))
            tasks.append(task)
        
        # Attend la completion de tous les scans
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        self.logger.info("Parallel scans completed")
        return results
    
    def shutdown_all(self):
        """Arrête tous les runners"""
        self.logger.info("Shutting down all runners")
        
        for runner in self.runners:
            runner.running = False
        
        self.runners.clear()


async def main():
    """Point d'entrée principal pour le runner"""
    import argparse
    
    parser = argparse.ArgumentParser(description='LLM Security Platform - Isolated Runner')
    parser.add_argument('--config', type=str, default='config.yaml',
                       help='Path to configuration file')
    parser.add_argument('--model', type=str, default='default_model',
                       help='Model name to scan')
    parser.add_argument('--prompt', type=str, default=None,
                       help='Target prompt for testing')
    parser.add_argument('--output', type=str, default='./runner_results',
                       help='Output directory for results')
    parser.add_argument('--continuous', action='store_true',
                       help='Run in continuous mode')
    parser.add_argument('--interval', type=int, default=3600,
                       help='Interval for continuous mode (seconds)')
    parser.add_argument('--schedule', type=str, default=None,
                       help='Path to schedule file (JSON)')
    
    args = parser.parse_args()
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Crée le runner
    runner = IsolatedRunner(args.config, args.output)
    
    if not await runner.initialize():
        print("Failed to initialize runner")
        return 1
    
    try:
        if args.schedule:
            # Mode planifié
            with open(args.schedule, 'r', encoding='utf-8') as f:
                schedule = json.load(f)
            
            await runner.run_scheduled_scans(schedule)
            
        elif args.continuous:
            # Mode continu
            await runner.run_continuous(args.interval)
            
        else:
            # Mode single scan
            result = await runner.run_scan(args.model, args.prompt)
            
            print("\n" + "="*60)
            print("SCAN RESULT")
            print("="*60)
            print(json.dumps(result, indent=2, ensure_ascii=False))
            print("="*60)
    
    except KeyboardInterrupt:
        print("\nRunner interrupted by user")
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
