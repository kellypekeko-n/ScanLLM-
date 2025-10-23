#!/usr/bin/env python3
"""
LLM Security Platform - Web API
API REST pour la plateforme de sécurité LLM
"""

from flask import Flask, request, jsonify
import asyncio
import sys
import os
from pathlib import Path
import logging
from datetime import datetime, timedelta
from collections import defaultdict
import threading

# Ajouter le chemin pour les imports
sys.path.insert(0, str(Path(__file__).parent))

# Import lazy pour éviter les erreurs au démarrage
def get_orchestrator():
    """Import lazy de l'orchestrateur"""
    from orchestrator.orchestrator import LLMSecurityOrchestrator
    return LLMSecurityOrchestrator

def get_analyzer():
    """Import lazy de l'analyseur"""
    from analyzer.analyzer import LLMSecurityAnalyzer
    return LLMSecurityAnalyzer

# Application Insights
try:
    from opencensus.ext.azure.log_exporter import AzureLogHandler
    from opencensus.ext.azure.trace_exporter import AzureExporter
    from opencensus.ext.flask.flask_middleware import FlaskMiddleware
    from opencensus.trace.samplers import ProbabilitySampler
    
    APPINSIGHTS_ENABLED = True
except ImportError:
    APPINSIGHTS_ENABLED = False
    print("Application Insights SDK not installed. Monitoring disabled.")

app = Flask(__name__)

# Configuration
CONFIG_FILE = os.getenv('CONFIG_FILE', 'demo_config.yaml')

# Rate Limiting Configuration
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.lock = threading.Lock()
    
    def is_allowed(self, key, max_requests, time_window_seconds):
        """Verifie si la requete est autorisee"""
        with self.lock:
            now = datetime.now()
            cutoff = now - timedelta(seconds=time_window_seconds)
            
            # Nettoyer les anciennes requetes
            self.requests[key] = [req_time for req_time in self.requests[key] if req_time > cutoff]
            
            # Verifier la limite
            if len(self.requests[key]) >= max_requests:
                return False
            
            # Ajouter la nouvelle requete
            self.requests[key].append(now)
            return True
    
    def get_remaining(self, key, max_requests, time_window_seconds):
        """Retourne le nombre de requetes restantes"""
        with self.lock:
            now = datetime.now()
            cutoff = now - timedelta(seconds=time_window_seconds)
            self.requests[key] = [req_time for req_time in self.requests[key] if req_time > cutoff]
            return max(0, max_requests - len(self.requests[key]))

rate_limiter = RateLimiter()

# Configure Application Insights
if APPINSIGHTS_ENABLED:
    connection_string = os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING')
    if connection_string:
        # Configure tracing
        middleware = FlaskMiddleware(
            app,
            exporter=AzureExporter(connection_string=connection_string),
            sampler=ProbabilitySampler(rate=1.0)
        )
        
        # Configure logging
        logger = logging.getLogger(__name__)
        logger.addHandler(AzureLogHandler(connection_string=connection_string))
        logger.setLevel(logging.INFO)
        
        app.logger.info("Application Insights configured successfully")
    else:
        app.logger.warning("APPLICATIONINSIGHTS_CONNECTION_STRING not set")

@app.route('/')
def home():
    """Page d'accueil"""
    return jsonify({
        'name': 'LLM Security Platform',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            '/': 'Home',
            '/health': 'Health check',
            '/api/scan': 'POST - Run security scan',
            '/api/status': 'GET - Platform status'
        }
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'llm-security-platform',
        'version': '1.0.0'
    }), 200

@app.route('/api/status')
def status():
    """Status de la plateforme"""
    # Rate Limiting: 100 requetes par heure par IP
    client_ip = request.remote_addr or 'unknown'
    if not rate_limiter.is_allowed(f"status_{client_ip}", 100, 3600):
        return jsonify({'error': 'Rate limit exceeded'}), 429
    
    try:
        LLMSecurityOrchestrator = get_orchestrator()
        orchestrator = LLMSecurityOrchestrator(CONFIG_FILE)
        return jsonify({
            'status': 'operational',
            'tests_available': len(orchestrator.test_plugins),
            'test_names': list(orchestrator.test_plugins.keys()),
            'config_file': CONFIG_FILE
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/scan', methods=['POST'])
def scan():
    """
    Lancer un scan de sécurité
    
    Body JSON:
    {
        "prompt": "Your system prompt to test",
        "demo": true
    }
    """
    # Rate Limiting: 10 scans par heure par IP
    client_ip = request.remote_addr or 'unknown'
    max_requests = 10
    time_window = 3600  # 1 heure en secondes
    
    if not rate_limiter.is_allowed(f"scan_{client_ip}", max_requests, time_window):
        remaining = rate_limiter.get_remaining(f"scan_{client_ip}", max_requests, time_window)
        return jsonify({
            'error': 'Rate limit exceeded',
            'message': f'Maximum {max_requests} scans per hour. Please try again later.',
            'remaining': remaining,
            'retry_after': time_window
        }), 429
    
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                'error': 'Missing required field: prompt'
            }), 400
        
        prompt = data['prompt']
        demo = data.get('demo', False)
        
        # Initialiser l'orchestrateur
        LLMSecurityOrchestrator = get_orchestrator()
        LLMSecurityAnalyzer = get_analyzer()
        orchestrator = LLMSecurityOrchestrator(CONFIG_FILE)
        
        # Exécuter le scan (de manière synchrone pour Flask)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        results = loop.run_until_complete(
            orchestrator.run_security_tests(prompt)
        )
        loop.close()
        
        # Analyser les résultats
        analyzer = LLMSecurityAnalyzer()
        analysis = analyzer.analyze_results(results)
        
        return jsonify({
            'status': 'completed',
            'scan_results': results,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/tests')
def list_tests():
    """Liste des tests disponibles"""
    # Rate Limiting: 100 requetes par heure par IP
    client_ip = request.remote_addr or 'unknown'
    if not rate_limiter.is_allowed(f"tests_{client_ip}", 100, 3600):
        return jsonify({'error': 'Rate limit exceeded'}), 429
    
    try:
        LLMSecurityOrchestrator = get_orchestrator()
        orchestrator = LLMSecurityOrchestrator(CONFIG_FILE)
        return jsonify({
            'tests': list(orchestrator.test_plugins.keys()),
            'count': len(orchestrator.test_plugins)
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Pour le développement local
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
