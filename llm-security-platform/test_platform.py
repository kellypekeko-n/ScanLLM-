#!/usr/bin/env python3
"""
LLM Security Platform - Test de la plateforme
Script de test pour vérifier que tous les composants Python fonctionnent
"""

import sys
import os
import asyncio
from pathlib import Path

# Ajout des chemins pour les imports
current_dir = Path(__file__).parent
sys.path.append(str(current_dir / "orchestrator"))
sys.path.append(str(current_dir / "analyzer"))

def test_imports():
    """Test des imports de tous les modules Python"""
    print("🧪 Test des imports Python...")
    
    try:
        # Test des modules de l'orchestrateur
        from orchestrator.orchestrator import LLMSecurityOrchestrator
        print("✅ LLMSecurityOrchestrator importé")
        
        from orchestrator.tests.structural_probe import StructuralProbe
        print("✅ StructuralProbe importé")
        
        from orchestrator.tests.role_sensitivity import RoleSensitivityTest
        print("✅ RoleSensitivityTest importé")
        
        from orchestrator.tests.rag_audit import RAGAuditTest
        print("✅ RAGAuditTest importé")
        
        from orchestrator.tests.prompt_injection import PromptInjectionTest
        print("✅ PromptInjectionTest importé")
        
        from orchestrator.tests.safety_bypass import SafetyBypassTest
        print("✅ SafetyBypassTest importé")
        
        # Test des modules de l'analyzer
        from analyzer.analyzer import LLMSecurityAnalyzer
        print("✅ LLMSecurityAnalyzer importé")
        
        from analyzer.scoring import VulnerabilityScoring
        print("✅ VulnerabilityScoring importé")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def test_configuration():
    """Test de la configuration"""
    print("\n⚙️ Test de la configuration...")
    
    try:
        import yaml
        
        # Test du fichier de configuration principal
        config_path = current_dir / "orchestrator" / "config.yaml"
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            print("✅ Configuration principale chargée")
        else:
            print("❌ Fichier de configuration principal manquant")
            return False
        
        # Test du fichier de configuration de démo
        demo_config_path = current_dir / "demo_config.yaml"
        if demo_config_path.exists():
            with open(demo_config_path, 'r', encoding='utf-8') as f:
                demo_config = yaml.safe_load(f)
            print("✅ Configuration de démo chargée")
        else:
            print("❌ Fichier de configuration de démo manquant")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur de configuration: {e}")
        return False

def test_orchestrator():
    """Test de l'orchestrateur"""
    print("\n🎯 Test de l'orchestrateur...")
    
    try:
        from orchestrator.orchestrator import LLMSecurityOrchestrator
        
        # Configuration de test
        test_config = {
            'llm': {
                'endpoint': 'http://localhost:11434',
                'model': 'llama2',
                'timeout': 30
            },
            'tests': {
                'structural_probe': {'enabled': True, 'max_attempts': 5},
                'role_sensitivity': {'enabled': True, 'roles': ['admin', 'user', 'guest']},
                'rag_audit': {'enabled': True, 'max_documents': 10},
                'prompt_injection': {'enabled': True, 'max_attempts': 10},
                'safety_bypass': {'enabled': True, 'max_attempts': 10}
            },
            'output': {
                'format': 'json',
                'save_to_file': True,
                'output_dir': './test_results'
            }
        }
        
        orchestrator = LLMSecurityOrchestrator()
        print("✅ Orchestrateur initialisé")
        
        # Test de l'initialisation des plugins
        plugins = orchestrator._initialize_plugins()
        print(f"✅ {len(plugins)} plugins initialisés")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur de l'orchestrateur: {e}")
        return False

def test_analyzer():
    """Test de l'analyzer"""
    print("\n📊 Test de l'analyzer...")
    
    try:
        from analyzer.analyzer import LLMSecurityAnalyzer
        from analyzer.scoring import VulnerabilityScoring
        
        analyzer = LLMSecurityAnalyzer()
        print("✅ Analyzer initialisé")
        
        scoring = VulnerabilityScoring()
        print("✅ VulnerabilityScoring initialisé")
        
        # Test avec des données fictives
        test_results = {
            'tests': {
                'prompt_injection': {'score': 8.5, 'vulnerabilities': []},
                'safety_bypass': {'score': 7.2, 'vulnerabilities': []},
                'rag_audit': {'score': 6.8, 'vulnerabilities': []},
                'structural_probe': {'score': 9.1, 'vulnerabilities': []},
                'role_sensitivity': {'score': 7.5, 'vulnerabilities': []}
            }
        }
        
        # Test du calcul du VulnerabilityIndex
        vulnerability_index = scoring.calculate_vulnerability_index(test_results['tests'])
        print(f"✅ VulnerabilityIndex calculé: {vulnerability_index:.4f}")
        
        # Test de la classification
        criticality = scoring.classify_criticality(vulnerability_index)
        priority = scoring.calculate_priority(vulnerability_index)
        print(f"✅ Criticité: {criticality}, Priorité: {priority}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur de l'analyzer: {e}")
        return False

def test_demo_script():
    """Test du script de démonstration"""
    print("\n🎬 Test du script de démonstration...")
    
    try:
        demo_path = current_dir / "demo.py"
        if demo_path.exists():
            print("✅ Script de démonstration trouvé")
            
            # Test de la fonction de vérification des prérequis
            import demo
            if hasattr(demo, 'check_prerequisites'):
                print("✅ Fonction check_prerequisites disponible")
            else:
                print("❌ Fonction check_prerequisites manquante")
                return False
            
            return True
        else:
            print("❌ Script de démonstration manquant")
            return False
            
    except Exception as e:
        print(f"❌ Erreur du script de démonstration: {e}")
        return False

def test_file_structure():
    """Test de la structure des fichiers"""
    print("\n📁 Test de la structure des fichiers...")
    
    required_files = [
        "orchestrator/orchestrator.py",
        "orchestrator/config.yaml",
        "orchestrator/requirements.txt",
        "orchestrator/tests/__init__.py",
        "orchestrator/tests/structural_probe.py",
        "orchestrator/tests/role_sensitivity.py",
        "orchestrator/tests/rag_audit.py",
        "orchestrator/tests/prompt_injection.py",
        "orchestrator/tests/safety_bypass.py",
        "analyzer/analyzer.py",
        "analyzer/scoring.py",
        "analyzer/requirements.txt",
        "infra/azure-pipelines.yml",
        "demo.py",
        "demo_config.yaml",
        "README.md"
    ]
    
    missing_files = []
    for file_path in required_files:
        full_path = current_dir / file_path
        if full_path.exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MANQUANT")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n❌ {len(missing_files)} fichiers manquants")
        return False
    else:
        print("\n✅ Tous les fichiers requis sont présents")
        return True

def main():
    """Fonction principale de test"""
    print("🛡️ LLM Security Platform - Test de la plateforme Python")
    print("=" * 70)
    
    tests = [
        ("Structure des fichiers", test_file_structure),
        ("Imports Python", test_imports),
        ("Configuration", test_configuration),
        ("Orchestrateur", test_orchestrator),
        ("Analyzer", test_analyzer),
        ("Script de démonstration", test_demo_script)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            if test_func():
                print(f"✅ {test_name} - RÉUSSI")
                passed += 1
            else:
                print(f"❌ {test_name} - ÉCHOUÉ")
        except Exception as e:
            print(f"❌ {test_name} - ERREUR: {e}")
    
    print(f"\n{'='*70}")
    print(f"📊 Résultats: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 Tous les tests sont réussis ! La plateforme Python est prête.")
        return 0
    else:
        print(f"⚠️ {total - passed} test(s) ont échoué. Vérifiez les erreurs ci-dessus.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
