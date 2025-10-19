# ⚡ Commandes Rapides - Référence

## Guide de référence rapide pour tester la plateforme

---

## 🚀 Tests Rapides

### Test automatique complet (5 min)
```bash
python quick_test.py
```

### Test de validation (15 min)
```bash
python test_platform.py
```

---

## 🧪 Tests de Base

### Scan avec mock LLM (pas besoin de LM Studio)
```bash
cd orchestrator
python orchestrator.py "You are a helpful assistant" --demo
```

### Scan avec LLM réel (nécessite LM Studio)
```bash
cd orchestrator
python orchestrator.py "You are a helpful assistant"
```

### Analyse des résultats
```bash
cd analyzer
python analyzer.py ../orchestrator/results/security_analysis_*.json
```

---

## 🔍 Vérifications

### Vérifier les imports
```bash
python -c "from orchestrator.orchestrator import LLMSecurityOrchestrator; from analyzer.analyzer import LLMSecurityAnalyzer; print('✅ Imports OK')"
```

### Vérifier la configuration
```bash
python -c "import yaml; config = yaml.safe_load(open('orchestrator/config.yaml')); print(f'✅ Config OK - {len([t for t in config[\"tests\"].values() if t.get(\"enabled\")])} tests activés')"
```

### Vérifier LM Studio
```bash
curl http://localhost:11434/api/tags
```

---

## 📊 Résultats

### Lister les résultats
```bash
# Linux/Mac
ls -lh orchestrator/results/

# Windows PowerShell
Get-ChildItem orchestrator\results\ | Sort-Object LastWriteTime -Descending
```

### Afficher le dernier résultat
```bash
# Linux/Mac
cat orchestrator/results/security_analysis_*.json | jq .

# Windows PowerShell
$lastScan = Get-ChildItem orchestrator\results\security_analysis_*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Get-Content $lastScan.FullName | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Afficher les logs
```bash
# Linux/Mac
tail -50 logs/orchestrator.log

# Windows PowerShell
Get-Content logs\orchestrator.log -Tail 50
```

---

## 🐳 Docker

### Build de l'image
```bash
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
```

### Démarrer un runner
```bash
docker-compose up -d runner-1
```

### Voir les logs
```bash
docker-compose logs -f runner-1
```

### Arrêter les runners
```bash
docker-compose down
```

---

## 🔒 Tests de Sécurité

### Scan des dépendances
```bash
pip install safety
safety check -r orchestrator/requirements.txt
```

### Scan du code
```bash
pip install bandit
bandit -r orchestrator/ analyzer/ security/ logger/ alerting/
```

### Vérifier l'intégrité des logs
```bash
python -c "from logger.immutable_logger import SecurityAuditLogger; result = SecurityAuditLogger().verify_integrity(); print(f'✅ Logs valides: {result[\"valid\"]}')"
```

---

## 🧪 Tests par Composant

### Test du Logger
```bash
python -c "from logger.immutable_logger import SecurityAuditLogger; logger = SecurityAuditLogger('./test_logs'); logger.log_scan_start('test-model', {'test': 'config'}); print('✅ Logger OK')"
```

### Test du RBAC
```bash
python -c "from security.rbac import RBACManager; rbac = RBACManager(); rbac.add_user('test_user', 'security_analyst'); print(f'✅ RBAC OK - Permission: {rbac.check_permission(\"test_user\", \"run_scan\")}')"
```

### Test du Secrets Manager
```bash
python -c "from security.secrets_manager import SecretsManager; secrets = SecretsManager(backend='environment'); print('✅ Secrets Manager OK')"
```

### Test de l'Alerting
```bash
python -c "from alerting.alerting import AlertingManager; config = {'alerting': {'enabled': False, 'channels': {}}}; alerting = AlertingManager(config); print('✅ Alerting Manager OK')"
```

---

## 🛠️ Dépannage

### Ajouter au PYTHONPATH (Linux/Mac)
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)/orchestrator:$(pwd)/analyzer"
```

### Ajouter au PYTHONPATH (Windows PowerShell)
```powershell
$env:PYTHONPATH = "$PWD\orchestrator;$PWD\analyzer;$env:PYTHONPATH"
```

### Créer les répertoires nécessaires
```bash
# Linux/Mac
mkdir -p logs results runner_results
chmod -R 755 logs results runner_results

# Windows PowerShell
New-Item -ItemType Directory -Force -Path logs, results, runner_results
```

### Augmenter le timeout
Éditer `orchestrator/config.yaml` :
```yaml
llm:
  timeout: 60  # Augmenter à 60 secondes
```

---

## 📦 Installation

### Installation complète
```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement (Linux/Mac)
source venv/bin/activate

# Activer l'environnement (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt

# Installer les dépendances des modules
cd orchestrator && pip install -r requirements.txt && cd ..
cd analyzer && pip install -r requirements.txt && cd ..
cd runners && pip install -r requirements.txt && cd ..
```

---

## 🎯 Scénarios Complets

### Scénario 1 : Test rapide (5 min)
```bash
python quick_test.py
```

### Scénario 2 : Test avec mock (15 min)
```bash
# 1. Test de validation
python test_platform.py

# 2. Scan avec mock
cd orchestrator
python orchestrator.py "Test prompt" --demo

# 3. Analyse
cd ../analyzer
python analyzer.py ../orchestrator/results/*.json
```

### Scénario 3 : Test avec LLM réel (30 min)
```bash
# 1. Démarrer LM Studio sur http://localhost:11434
# 2. Charger un modèle (ex: llama2)

# 3. Vérifier la connexion
curl http://localhost:11434/api/tags

# 4. Exécuter le scan
cd orchestrator
python orchestrator.py "You are a helpful assistant"

# 5. Analyser les résultats
cd ../analyzer
python analyzer.py ../orchestrator/results/*.json

# 6. Vérifier les logs
tail -50 ../logs/orchestrator.log
```

### Scénario 4 : Test Docker (1 heure)
```bash
# 1. Build de l'image
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..

# 2. Démarrer le runner
docker-compose up -d runner-1

# 3. Vérifier le statut
docker-compose ps

# 4. Voir les logs
docker-compose logs -f runner-1

# 5. Exécuter un scan
docker-compose exec runner-1 python /app/runners/runner.py \
  --target-prompt "Test prompt" \
  --model llama2

# 6. Arrêter
docker-compose down
```

---

## 📚 Documentation

### Guides disponibles

| Guide | Commande pour ouvrir |
|-------|---------------------|
| Guide de démarrage rapide | `cat GUIDE_DEMARRAGE_RAPIDE.md` |
| Index des tests | `cat INDEX_TESTS.md` |
| Comment tester | `cat COMMENT_TESTER.md` |
| Guide Windows | `cat TEST_WINDOWS.md` |
| Guide complet | `cat GUIDE_TEST.md` |
| Déploiement | `cat PHASE1_DEPLOYMENT_GUIDE.md` |

---

## ⚙️ Configuration

### Variables d'environnement essentielles
```bash
# Linux/Mac
export LLM_SECURITY_LLM_ENDPOINT="http://localhost:11434"
export LLM_SECURITY_LLM_MODEL="llama2"

# Windows PowerShell
$env:LLM_SECURITY_LLM_ENDPOINT = "http://localhost:11434"
$env:LLM_SECURITY_LLM_MODEL = "llama2"
```

### Fichier .env
```bash
cat > .env << EOF
LLM_SECURITY_LLM_ENDPOINT=http://localhost:11434
LLM_SECURITY_LLM_MODEL=llama2
LLM_SECURITY_JIRA_URL=https://your-jira.atlassian.net
LLM_SECURITY_JIRA_USERNAME=your-email@example.com
LLM_SECURITY_JIRA_API_TOKEN=your-api-token
EOF
```

---

## 🔧 Maintenance

### Nettoyer les résultats de test
```bash
# Linux/Mac
rm -rf test_results test_logs orchestrator/results/* analyzer/reports/*

# Windows PowerShell
Remove-Item -Path test_results, test_logs -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path orchestrator\results\* -Force -ErrorAction SilentlyContinue
Remove-Item -Path analyzer\reports\* -Force -ErrorAction SilentlyContinue
```

### Mettre à jour les dépendances
```bash
pip install --upgrade -r requirements.txt
cd orchestrator && pip install --upgrade -r requirements.txt && cd ..
cd analyzer && pip install --upgrade -r requirements.txt && cd ..
cd runners && pip install --upgrade -r requirements.txt && cd ..
```

### Vérifier la version
```bash
python --version
pip list | grep -E "pyyaml|requests|aiohttp"
```

---

## 📊 Monitoring

### Vérifier l'espace disque
```bash
# Linux/Mac
du -sh logs/ results/ runner_results/

# Windows PowerShell
Get-ChildItem logs, results, runner_results -Recurse | Measure-Object -Property Length -Sum
```

### Compter les scans effectués
```bash
# Linux/Mac
ls -1 orchestrator/results/ | wc -l

# Windows PowerShell
(Get-ChildItem orchestrator\results\).Count
```

### Statistiques des logs
```bash
# Linux/Mac
wc -l logs/orchestrator.log

# Windows PowerShell
(Get-Content logs\orchestrator.log).Count
```

---

## 🎯 Commandes par Objectif

### Je veux tester rapidement
```bash
python quick_test.py
```

### Je veux valider l'installation
```bash
python test_platform.py
```

### Je veux tester un modèle LLM
```bash
cd orchestrator
python orchestrator.py "Your prompt here"
```

### Je veux analyser des résultats
```bash
cd analyzer
python analyzer.py ../orchestrator/results/*.json
```

### Je veux vérifier la sécurité
```bash
safety check -r orchestrator/requirements.txt
bandit -r orchestrator/ analyzer/
```

### Je veux tester avec Docker
```bash
cd runners
docker-compose up -d
```

### Je veux voir les logs
```bash
tail -f logs/orchestrator.log
```

### Je veux nettoyer
```bash
rm -rf test_results test_logs
```

---

## 💡 Astuces

### Alias utiles (Linux/Mac)
```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
alias llm-test="python quick_test.py"
alias llm-scan="cd orchestrator && python orchestrator.py"
alias llm-analyze="cd analyzer && python analyzer.py"
alias llm-logs="tail -f logs/orchestrator.log"
```

### Alias PowerShell (Windows)
```powershell
# Ajouter à $PROFILE
function llm-test { python quick_test.py }
function llm-scan { cd orchestrator; python orchestrator.py $args }
function llm-analyze { cd analyzer; python analyzer.py $args }
function llm-logs { Get-Content logs\orchestrator.log -Tail 50 -Wait }
```

---

## 📞 Support

### Besoin d'aide ?
- **Documentation** : Consultez les guides dans le répertoire
- **Issues** : GitHub Issues pour les bugs
- **Questions** : GitHub Discussions
- **Email** : support@llm-security-platform.com

### Ressources
- [LM Studio](https://lmstudio.ai/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python](https://www.python.org/)

---

**💡 Conseil :** Ajoutez cette page à vos favoris pour un accès rapide aux commandes !

**Dernière mise à jour :** 19 octobre 2025  
**Version :** 1.0.0 (Phase 1)
