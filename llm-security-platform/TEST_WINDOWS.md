# 🪟 Guide de Test pour Windows (PowerShell)

## Guide spécifique pour tester la plateforme sous Windows

---

## 🚀 Test Rapide (PowerShell)

### Méthode 1 : Script automatique

```powershell
# Ouvrir PowerShell dans le répertoire du projet
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Exécuter le test rapide
python quick_test.py
```

### Méthode 2 : Test de validation

```powershell
python test_platform.py
```

---

## 📋 Installation et Vérification

### Vérifier Python

```powershell
# Vérifier la version de Python
python --version

# Doit afficher : Python 3.11.x ou supérieur
```

### Installer les dépendances

```powershell
# Créer un environnement virtuel (recommandé)
python -m venv venv

# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Si erreur de politique d'exécution :
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Installer les dépendances principales
pip install -r requirements.txt

# Installer les dépendances des modules
cd orchestrator
pip install -r requirements.txt
cd ..

cd analyzer
pip install -r requirements.txt
cd ..

cd runners
pip install -r requirements.txt
cd ..
```

### Vérifier les imports

```powershell
python -c "from orchestrator.orchestrator import LLMSecurityOrchestrator; from analyzer.analyzer import LLMSecurityAnalyzer; print('✅ Imports OK')"
```

---

## 🧪 Tests Étape par Étape

### Test 1 : Validation de la structure

```powershell
# Exécuter le test de validation
python test_platform.py

# Résultat attendu :
# ✅ Structure des fichiers - RÉUSSI
# ✅ Imports Python - RÉUSSI
# ✅ Configuration - RÉUSSI
# ...
```

### Test 2 : Test de l'orchestrateur

```powershell
cd orchestrator

# Test simple avec mock
python -c "from orchestrator import LLMSecurityOrchestrator; orch = LLMSecurityOrchestrator(); print(f'✅ {len(orch.test_plugins)} tests chargés')"
```

### Test 3 : Scan de sécurité (mode démo)

```powershell
cd orchestrator

# Scan avec mock LLM (pas besoin de LM Studio)
python orchestrator.py "You are a helpful assistant" --demo
```

### Test 4 : Analyse des résultats

```powershell
cd ..\analyzer

# Analyser le dernier scan
$lastScan = Get-ChildItem ..\orchestrator\results\security_analysis_*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
python analyzer.py $lastScan.FullName
```

---

## 🎯 Tests avec LM Studio

### Étape 1 : Installer LM Studio

1. Télécharger depuis https://lmstudio.ai/
2. Installer LM Studio
3. Démarrer l'application

### Étape 2 : Configurer LM Studio

1. Dans LM Studio, aller dans l'onglet "Local Server"
2. Cliquer sur "Start Server"
3. Vérifier que le serveur écoute sur `http://localhost:11434`

### Étape 3 : Charger un modèle

1. Aller dans l'onglet "Models"
2. Télécharger un modèle (ex: llama-2-7b, mistral-7b)
3. Charger le modèle dans le serveur

### Étape 4 : Vérifier la connexion

```powershell
# Tester la connexion avec curl (si installé)
curl http://localhost:11434/api/tags

# Ou avec PowerShell
Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get
```

### Étape 5 : Exécuter un scan réel

```powershell
cd orchestrator

# Scan avec LM Studio
python orchestrator.py "You are a helpful AI assistant"

# Attendre la fin du scan (2-5 minutes)
```

### Étape 6 : Analyser les résultats

```powershell
cd ..\analyzer

# Analyser le dernier scan
$lastScan = Get-ChildItem ..\orchestrator\results\security_analysis_*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
python analyzer.py $lastScan.FullName
```

---

## 🐳 Tests avec Docker Desktop

### Prérequis

1. Installer Docker Desktop pour Windows
2. Démarrer Docker Desktop
3. Vérifier que Docker fonctionne :

```powershell
docker --version
docker-compose --version
```

### Test 1 : Build de l'image

```powershell
cd runners

# Build de l'image Docker
docker build -t llm-security-runner:latest -f Dockerfile ..
```

### Test 2 : Démarrer un runner

```powershell
# Démarrer le runner
docker-compose up -d runner-1

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f runner-1
```

### Test 3 : Exécuter un scan via Docker

```powershell
# Exécuter un scan dans le container
docker-compose exec runner-1 python /app/runners/runner.py --target-prompt "Test prompt" --model llama2
```

### Test 4 : Arrêter les runners

```powershell
docker-compose down
```

---

## 📊 Vérification des Résultats

### Lister les fichiers générés

```powershell
# Résultats des scans
Get-ChildItem orchestrator\results\ | Sort-Object LastWriteTime -Descending

# Rapports d'analyse
Get-ChildItem analyzer\reports\ | Sort-Object LastWriteTime -Descending

# Logs
Get-ChildItem logs\ | Sort-Object LastWriteTime -Descending
```

### Afficher un résultat JSON

```powershell
# Afficher le dernier scan (formaté)
$lastScan = Get-ChildItem orchestrator\results\security_analysis_*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Get-Content $lastScan.FullName | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Afficher un rapport CSV

```powershell
# Afficher les premières lignes du dernier rapport
$lastReport = Get-ChildItem analyzer\reports\analysis_report_*.csv | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Get-Content $lastReport.FullName -Head 20
```

### Afficher les logs

```powershell
# Logs de l'orchestrateur
Get-Content logs\orchestrator.log -Tail 50

# Logs immuables
Get-ChildItem logs\immutable\ | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content
```

---

## 🔍 Tests des Composants

### Test du Logger Immuable

```powershell
python -c @"
from logger.immutable_logger import SecurityAuditLogger
logger = SecurityAuditLogger('./test_logs')
logger.log_scan_start('test-model', {'test': 'config'})
verification = logger.verify_integrity()
print(f'✅ Logs valides: {verification[\"valid\"]}')
"@
```

### Test du RBAC

```powershell
python -c @"
from security.rbac import RBACManager
rbac = RBACManager()
rbac.add_user('test_user', 'security_analyst')
has_perm = rbac.check_permission('test_user', 'run_scan')
print(f'✅ Permission vérifiée: {has_perm}')
"@
```

### Test du Secrets Manager

```powershell
python -c @"
from security.secrets_manager import SecretsManager
secrets = SecretsManager(backend='environment')
print('✅ Secrets Manager OK')
"@
```

---

## 🛠️ Dépannage Windows

### Problème : Erreur de politique d'exécution

**Symptôme :**
```
.\venv\Scripts\Activate.ps1 : Impossible de charger le fichier...
```

**Solution :**
```powershell
# Autoriser l'exécution de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Puis réessayer
.\venv\Scripts\Activate.ps1
```

### Problème : Module non trouvé

**Symptôme :**
```
ModuleNotFoundError: No module named 'orchestrator'
```

**Solution :**
```powershell
# Ajouter au PYTHONPATH
$env:PYTHONPATH = "$PWD\orchestrator;$PWD\analyzer;$env:PYTHONPATH"

# Ou installer en mode développement
pip install -e .
```

### Problème : Encodage des fichiers

**Symptôme :**
```
UnicodeDecodeError: 'charmap' codec can't decode...
```

**Solution :**
```powershell
# Définir l'encodage UTF-8
$env:PYTHONIOENCODING = "utf-8"

# Ou dans le code Python, toujours utiliser :
# open(file, 'r', encoding='utf-8')
```

### Problème : Port déjà utilisé

**Symptôme :**
```
Error: Port 11434 is already in use
```

**Solution :**
```powershell
# Trouver le processus utilisant le port
Get-NetTCPConnection -LocalPort 11434 | Select-Object OwningProcess

# Arrêter le processus
Stop-Process -Id <ProcessID>
```

### Problème : Docker non accessible

**Symptôme :**
```
Error: Cannot connect to the Docker daemon
```

**Solution :**
1. Ouvrir Docker Desktop
2. Attendre que Docker démarre complètement
3. Vérifier : `docker ps`

### Problème : Permissions de fichiers

**Symptôme :**
```
PermissionError: [WinError 5] Access is denied
```

**Solution :**
```powershell
# Créer les répertoires avec les bonnes permissions
New-Item -ItemType Directory -Force -Path logs, results, runner_results

# Vérifier les permissions
Get-Acl logs | Format-List
```

---

## ⚡ Scripts PowerShell Utiles

### Script de test complet

Créer un fichier `test_all.ps1` :

```powershell
# test_all.ps1 - Script de test complet

Write-Host "🧪 Test de la plateforme LLM Security" -ForegroundColor Cyan
Write-Host "=" * 70

# Test 1 : Validation
Write-Host "`n✓ Test 1 : Validation de la plateforme..." -ForegroundColor Yellow
python test_platform.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec de la validation" -ForegroundColor Red
    exit 1
}

# Test 2 : Scan rapide
Write-Host "`n✓ Test 2 : Scan rapide..." -ForegroundColor Yellow
python quick_test.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec du scan rapide" -ForegroundColor Red
    exit 1
}

# Test 3 : Scan avec orchestrateur
Write-Host "`n✓ Test 3 : Scan avec orchestrateur..." -ForegroundColor Yellow
cd orchestrator
python orchestrator.py "Test prompt" --demo
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec du scan" -ForegroundColor Red
    exit 1
}
cd ..

# Test 4 : Analyse
Write-Host "`n✓ Test 4 : Analyse des résultats..." -ForegroundColor Yellow
cd analyzer
$lastScan = Get-ChildItem ..\orchestrator\results\security_analysis_*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
python analyzer.py $lastScan.FullName
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec de l'analyse" -ForegroundColor Red
    exit 1
}
cd ..

Write-Host "`n✅ Tous les tests sont réussis !" -ForegroundColor Green
Write-Host "=" * 70
```

Exécuter le script :

```powershell
.\test_all.ps1
```

### Script de nettoyage

Créer un fichier `cleanup.ps1` :

```powershell
# cleanup.ps1 - Nettoyage des fichiers de test

Write-Host "🧹 Nettoyage des fichiers de test..." -ForegroundColor Cyan

# Supprimer les résultats de test
Remove-Item -Path "test_results" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test_logs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "orchestrator\results\*" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "analyzer\reports\*" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
```

Exécuter le script :

```powershell
.\cleanup.ps1
```

---

## ✅ Checklist de Test Windows

### Installation
- [ ] Python 3.11+ installé
- [ ] Environnement virtuel créé et activé
- [ ] Dépendances installées
- [ ] Imports fonctionnels

### Tests de base
- [ ] `python quick_test.py` réussi
- [ ] `python test_platform.py` réussi
- [ ] Configuration chargée

### Tests avec mock
- [ ] Scan avec mock LLM réussi
- [ ] Analyse des résultats OK
- [ ] Fichiers générés

### Tests avec LM Studio (optionnel)
- [ ] LM Studio installé et démarré
- [ ] Modèle chargé
- [ ] Connexion vérifiée
- [ ] Scan réel réussi

### Tests Docker (optionnel)
- [ ] Docker Desktop installé
- [ ] Image buildée
- [ ] Runner démarré
- [ ] Scan via Docker réussi

---

## 📚 Ressources

### Documentation
- [COMMENT_TESTER.md](COMMENT_TESTER.md) - Guide rapide
- [GUIDE_TEST.md](GUIDE_TEST.md) - Guide complet
- [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md) - Déploiement

### Liens utiles
- Python pour Windows : https://www.python.org/downloads/windows/
- LM Studio : https://lmstudio.ai/
- Docker Desktop : https://www.docker.com/products/docker-desktop/

---

## 🎯 Commandes Rapides

```powershell
# Test rapide (5 min)
python quick_test.py

# Test complet (15 min)
python test_platform.py
cd orchestrator && python orchestrator.py "Test" --demo
cd ..\analyzer && python analyzer.py ..\orchestrator\results\*.json

# Vérifier les résultats
Get-ChildItem orchestrator\results\ | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Voir les logs
Get-Content logs\orchestrator.log -Tail 50

# Nettoyer
Remove-Item test_results, test_logs -Recurse -Force
```

---

**🚀 Vous êtes prêt à tester la plateforme sous Windows !**

Pour toute question, consultez la documentation complète ou ouvrez une issue sur GitHub.
