#!/usr/bin/env python3
"""
LLM Security Platform - Script d'installation
Script d'installation automatique de la plateforme Python
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_banner():
    """Affiche la bannière d'installation"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║        🛡️  LLM Security Platform - Installation           ║
    ║                                                              ║
    ║  Installation automatique de la plateforme Python            ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python_version():
    """Vérifie la version de Python"""
    print("🐍 Vérification de la version Python...")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 10):
        print(f"❌ Python {version.major}.{version.minor} détecté")
        print("   Version requise: Python 3.10+")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
    return True

def install_dependencies():
    """Installe les dépendances Python"""
    print("\n📦 Installation des dépendances...")
    
    # Dépendances principales
    dependencies = [
        "aiohttp>=3.8.0",
        "pyyaml>=6.0",
        "requests>=2.28.0",
        "colorama>=0.4.6",
        "rich>=13.0.0"
    ]
    
    # Dépendances optionnelles pour l'analyse
    optional_dependencies = [
        "matplotlib>=3.6.0",
        "seaborn>=0.12.0",
        "pandas>=1.5.0",
        "numpy>=1.24.0"
    ]
    
    # Dépendances de développement
    dev_dependencies = [
        "pytest>=7.0.0",
        "pytest-asyncio>=0.21.0",
        "black>=22.0.0",
        "flake8>=5.0.0"
    ]
    
    all_deps = dependencies + optional_dependencies + dev_dependencies
    
    try:
        for dep in all_deps:
            print(f"   Installation de {dep}...")
            result = subprocess.run([
                sys.executable, "-m", "pip", "install", dep
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"   ✅ {dep} installé")
            else:
                print(f"   ⚠️ {dep} - Erreur (optionnel): {result.stderr}")
        
        print("✅ Installation des dépendances terminée")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'installation: {e}")
        return False

def create_directories():
    """Crée les répertoires nécessaires"""
    print("\n📁 Création des répertoires...")
    
    directories = [
        "orchestrator/results",
        "analyzer/results", 
        "demo_results",
        "logs",
        "data"
    ]
    
    for directory in directories:
        dir_path = Path(directory)
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"   ✅ {directory}")
    
    return True

def setup_environment():
    """Configure l'environnement"""
    print("\n⚙️ Configuration de l'environnement...")
    
    # Variables d'environnement
    env_vars = {
        "LLM_SECURITY_PLATFORM_HOME": str(Path.cwd()),
        "LLM_ENDPOINT": "http://localhost:11434",
        "LLM_MODEL": "llama2",
        "SECURITY_TIMEOUT": "30"
    }
    
    # Création du fichier .env
    env_file = Path(".env")
    with open(env_file, "w") as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    print("   ✅ Fichier .env créé")
    
    # Création du fichier de configuration local
    local_config = {
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}",
        "platform": platform.system(),
        "architecture": platform.machine(),
        "installation_date": str(Path.cwd()),
        "status": "installed"
    }
    
    import json
    config_file = Path("installation_config.json")
    with open(config_file, "w") as f:
        json.dump(local_config, f, indent=2)
    
    print("   ✅ Configuration locale créée")
    return True

def run_tests():
    """Lance les tests de la plateforme"""
    print("\n🧪 Lancement des tests...")
    
    try:
        result = subprocess.run([
            sys.executable, "test_platform.py"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Tous les tests sont réussis")
            return True
        else:
            print("⚠️ Certains tests ont échoué")
            print("   Sortie:", result.stdout)
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        return False

def create_launcher_scripts():
    """Crée les scripts de lancement"""
    print("\n🚀 Création des scripts de lancement...")
    
    # Script de lancement principal
    launcher_content = '''#!/usr/bin/env python3
"""
LLM Security Platform - Lanceur principal
"""

import sys
import os
from pathlib import Path

# Ajout des chemins
sys.path.append(str(Path(__file__).parent / "orchestrator"))
sys.path.append(str(Path(__file__).parent / "analyzer"))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python launcher.py <command>")
        print("Commands: demo, test, analyze")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "demo":
        import demo
        demo.main()
    elif command == "test":
        import test_platform
        test_platform.main()
    elif command == "analyze":
        print("Analyze command - À implémenter")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
'''
    
    launcher_path = Path("launcher.py")
    with open(launcher_path, "w") as f:
        f.write(launcher_content)
    
    print("   ✅ launcher.py créé")
    
    # Script batch pour Windows
    if platform.system() == "Windows":
        batch_content = '''@echo off
echo LLM Security Platform - Lanceur Windows
echo.
echo 1. Demo
echo 2. Test
echo 3. Analyze
echo.
set /p choice="Choisissez une option (1-3): "

if "%choice%"=="1" python launcher.py demo
if "%choice%"=="2" python launcher.py test
if "%choice%"=="3" python launcher.py analyze
pause
'''
        batch_path = Path("launcher.bat")
        with open(batch_path, "w") as f:
            f.write(batch_content)
        
        print("   ✅ launcher.bat créé")
    
    return True

def main():
    """Fonction principale d'installation"""
    print_banner()
    
    print("🛡️ Installation de la plateforme LLM Security Platform")
    print("=" * 70)
    
    # Étapes d'installation
    steps = [
        ("Vérification Python", check_python_version),
        ("Installation dépendances", install_dependencies),
        ("Création répertoires", create_directories),
        ("Configuration environnement", setup_environment),
        ("Création scripts de lancement", create_launcher_scripts),
        ("Tests de la plateforme", run_tests)
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        print(f"\n{'='*20} {step_name} {'='*20}")
        try:
            if step_func():
                print(f"✅ {step_name} - RÉUSSI")
                success_count += 1
            else:
                print(f"❌ {step_name} - ÉCHOUÉ")
        except Exception as e:
            print(f"❌ {step_name} - ERREUR: {e}")
    
    print(f"\n{'='*70}")
    print(f"📊 Installation: {success_count}/{len(steps)} étapes réussies")
    
    if success_count == len(steps):
        print("\n🎉 Installation terminée avec succès !")
        print("\n📋 Prochaines étapes:")
        print("   1. Installez LM Studio (http://lmstudio.ai/)")
        print("   2. Lancez LM Studio et démarrez un serveur local")
        print("   3. Exécutez: python launcher.py demo")
        print("   4. Ou exécutez: python demo.py")
        return 0
    else:
        print(f"\n⚠️ {len(steps) - success_count} étape(s) ont échoué.")
        print("   Vérifiez les erreurs ci-dessus et réessayez.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
