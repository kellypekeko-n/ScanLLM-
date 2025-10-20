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

# Ajouter le chemin pour les imports
sys.path.insert(0, str(Path(__file__).parent))

from orchestrator.orchestrator import LLMSecurityOrchestrator
from analyzer.analyzer import LLMSecurityAnalyzer

app = Flask(__name__)

# Configuration
CONFIG_FILE = os.getenv('CONFIG_FILE', 'demo_config.yaml')

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
    try:
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
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                'error': 'Missing required field: prompt'
            }), 400
        
        prompt = data['prompt']
        demo = data.get('demo', False)
        
        # Initialiser l'orchestrateur
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
    try:
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
