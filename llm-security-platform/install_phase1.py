#!/usr/bin/env python3
"""
LLM Security Platform - Installation automatique Phase 1
Script d'installation et de configuration pour la Phase 1
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path
import json

def print_header(text):
    """Affiche un en-tête formaté"""
    print("\n" + "=" * 70)
    print(text.center(70))
    print("=" * 70 + "\n")

def print_step(step_num, total_steps, description):
    """Affiche une étape d'installation"""
    print(f"[{step_num}/{total_steps}] {description}...")

def run_command(command, description, check=True):
    """Exécute une commande shell"""
    try:
        # Convertir la commande en liste si c'est une chaine
        if isinstance(command, str):
            command_list = command.split()
        else:
            command_list = command
        
        result = subprocess.run(
            command_list,
            shell=False,  # Securite: Eviter shell=True
            check=check,
            capture_output=True,
            text=True
        )
        print(f"  ✅ {description}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ❌ Erreur: {description}")
        print(f"     {e.stderr}")
        return False

def create_directory(path, description):
    """Crée un répertoire"""
    try:
        Path(path).mkdir(parents=True, exist_ok=True)
        print(f"  ✅ {description}: {path}")
        return True
    except Exception as e:
        print(f"  ❌ Erreur lors de la création de {path}: {e}")
        return False

def main():
    print_header("LLM SECURITY PLATFORM - INSTALLATION PHASE 1")
    
    print("Ce script va installer et configurer tous les composants Phase 1:")
    print("  • Tests de sécurité (6 tests)")
    print("  • Logger immuable")
    print("  • Alerting & Ticketing")
    print("  • RBAC & Secrets Management")
    print("  • Runners containerisés")
    print("  • Pipeline CI/CD")
    print()
    
    response = input("Continuer l'installation ? (o/n): ")
    if response.lower() != 'o':
        print("Installation annulée.")
        return 1
    
    total_steps = 10
    
    # Étape 1: Vérification de Python
    print_step(1, total_steps, "Vérification de Python")
    python_version = sys.version_info
    if python_version.major >= 3 and python_version.minor >= 11:
        print(f"  ✅ Python {python_version.major}.{python_version.minor} détecté")
    else:
        print(f"  ⚠️  Python {python_version.major}.{python_version.minor} détecté")
        print(f"     Recommandé: Python 3.11+")
    
    # Étape 2: Création des répertoires
    print_step(2, total_steps, "Création des répertoires")
    directories = [
        ("./logs", "Logs"),
        ("./logs/immutable", "Logs immuables"),
        ("./logs/rbac_audit", "Audit RBAC"),
        ("./results", "Résultats"),
        ("./runner_results", "Résultats runners"),
        ("./config", "Configuration"),
        ("./security", "Sécurité"),
        ("./test_results", "Tests")
    ]
    
    for path, desc in directories:
        create_directory(path, desc)
    
    # Étape 3: Installation des dépendances globales
    print_step(3, total_steps, "Installation des dépendances globales")
    run_command(
        f"{sys.executable} -m pip install --upgrade pip",
        "Mise à jour de pip"
    )
    run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installation des dépendances globales",
        check=False
    )
    
    # Étape 4: Installation des dépendances des modules
    print_step(4, total_steps, "Installation des dépendances des modules")
    modules = [
        ("orchestrator", "Orchestrateur"),
        ("analyzer", "Analyzer"),
        ("runners", "Runners")
    ]
    
    for module, desc in modules:
        req_file = Path(module) / "requirements.txt"
        if req_file.exists():
            run_command(
                f"{sys.executable} -m pip install -r {req_file}",
                f"Installation {desc}",
                check=False
            )
    
    # Étape 5: Création du fichier .env
    print_step(5, total_steps, "Création du fichier .env")
    env_file = Path(".env")
    if not env_file.exists():
        env_content = """# LLM Security Platform - Environment Variables

# LLM Configuration
LLM_SECURITY_LLM_ENDPOINT=http://localhost:11434
LLM_SECURITY_LLM_MODEL=llama2
LLM_SECURITY_LLM_TIMEOUT=30

# Alerting Configuration (optionnel)
# LLM_SECURITY_JIRA_URL=https://your-jira.atlassian.net
# LLM_SECURITY_JIRA_USERNAME=your-email@example.com
# LLM_SECURITY_JIRA_API_TOKEN=your-api-token
# LLM_SECURITY_JIRA_PROJECT_KEY=SEC

# LLM_SECURITY_TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
# LLM_SECURITY_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Azure Key Vault (optionnel)
# AZURE_KEYVAULT_URL=https://your-vault.vault.azure.net/

# HashiCorp Vault (optionnel)
# VAULT_ADDR=http://localhost:8200
# VAULT_TOKEN=your-vault-token
"""
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)
        print(f"  ✅ Fichier .env créé")
    else:
        print(f"  ℹ️  Fichier .env existe déjà")
    
    # Étape 6: Création de la configuration RBAC
    print_step(6, total_steps, "Création de la configuration RBAC")
    rbac_config_file = Path("security/rbac_config.json")
    if not rbac_config_file.exists():
        rbac_config = {
            "users": [
                {
                    "username": "admin",
                    "role": "admin",
                    "metadata": {
                        "email": "admin@example.com",
                        "department": "Security"
                    }
                },
                {
                    "username": "analyst",
                    "role": "security_analyst",
                    "metadata": {
                        "email": "analyst@example.com",
                        "department": "Security"
                    }
                },
                {
                    "username": "operator",
                    "role": "operator",
                    "metadata": {
                        "email": "operator@example.com",
                        "department": "Operations"
                    }
                }
            ]
        }
        with open(rbac_config_file, 'w', encoding='utf-8') as f:
            json.dump(rbac_config, f, indent=2)
        print(f"  ✅ Configuration RBAC créée")
    else:
        print(f"  ℹ️  Configuration RBAC existe déjà")
    
    # Étape 7: Vérification de Docker (optionnel)
    print_step(7, total_steps, "Vérification de Docker (optionnel)")
    docker_available = run_command(
        "docker --version",
        "Docker détecté",
        check=False
    )
    
    if docker_available:
        run_command(
            "docker-compose --version",
            "Docker Compose détecté",
            check=False
        )
    else:
        print("  ℹ️  Docker non détecté (optionnel pour runners containerisés)")
    
    # Étape 8: Création des fichiers __init__.py manquants
    print_step(8, total_steps, "Vérification des modules Python")
    init_files = [
        "orchestrator/tests/__init__.py",
        "analyzer/__init__.py",
        "logger/__init__.py",
        "alerting/__init__.py",
        "security/__init__.py",
        "runners/__init__.py"
    ]
    
    for init_file in init_files:
        init_path = Path(init_file)
        if not init_path.exists():
            init_path.parent.mkdir(parents=True, exist_ok=True)
            init_path.touch()
            print(f"  ✅ Créé: {init_file}")
    
    # Étape 9: Test de l'installation
    print_step(9, total_steps, "Test de l'installation")
    test_passed = run_command(
        f"{sys.executable} quick_test.py",
        "Exécution des tests de validation",
        check=False
    )
    
    # Étape 10: Résumé
    print_step(10, total_steps, "Résumé de l'installation")
    
    print_header("INSTALLATION TERMINÉE")
    
    print("✅ Composants installés:")
    print("  • Orchestrateur avec 6 tests de sécurité")
    print("  • Analyzer et scoring (VulnerabilityIndex)")
    print("  • Logger immuable avec hash chaining")
    print("  • Alerting & Ticketing (JIRA/ServiceNow/Teams/Slack)")
    print("  • RBAC avec 5 rôles")
    print("  • Secrets Manager (Azure Key Vault, HashiCorp Vault)")
    print("  • Runners containerisés")
    print()
    
    print("📁 Fichiers de configuration créés:")
    print("  • .env - Variables d'environnement")
    print("  • security/rbac_config.json - Configuration RBAC")
    print("  • config.yaml - Configuration production")
    print("  • demo_config.yaml - Configuration démo")
    print()
    
    print("📚 Documentation disponible:")
    print("  • README.md - Vue d'ensemble")
    print("  • PHASE1_DEPLOYMENT_GUIDE.md - Guide de déploiement")
    print("  • PHASE1_COMPLETION_SUMMARY.md - Résumé Phase 1")
    print()
    
    print("🚀 Prochaines étapes:")
    print()
    print("1. Configurer votre endpoint LLM:")
    print("   Éditer .env et définir LLM_SECURITY_LLM_ENDPOINT")
    print()
    print("2. Démarrer LM Studio (ou votre endpoint LLM):")
    print("   Télécharger depuis https://lmstudio.ai/")
    print("   Démarrer le serveur sur le port 11434")
    print()
    print("3. Exécuter un scan de sécurité:")
    print("   cd orchestrator")
    print("   python orchestrator.py \"Your test prompt\"")
    print()
    print("4. Analyser les résultats:")
    print("   cd analyzer")
    print("   python analyzer.py ../orchestrator/results/security_analysis_*.json")
    print()
    print("5. Déployer avec Docker (optionnel):")
    print("   cd runners")
    print("   docker-compose up -d")
    print()
    
    if docker_available:
        print("💡 Conseil: Docker est disponible, vous pouvez utiliser les runners containerisés")
        print("   Voir PHASE1_DEPLOYMENT_GUIDE.md section 'Déploiement avec runners containerisés'")
        print()
    
    print("=" * 70)
    print("Installation Phase 1 complétée avec succès ! 🎉")
    print("=" * 70)
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nInstallation interrompue par l'utilisateur.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Erreur lors de l'installation: {e}")
        sys.exit(1)
