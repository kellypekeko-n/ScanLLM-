# 🧪 Comment Tester la Plateforme LLM Security

## Guide Rapide de Test

Ce document explique de manière simple et directe comment tester la plateforme.

---

## 🚀 Test Rapide (5 minutes)

### Option 1 : Script de test automatique

Le moyen le plus rapide de tester la plateforme :

```bash
python quick_test.py
```

Ce script va automatiquement :
- ✅ Vérifier tous les imports
- ✅ Initialiser l'orchestrateur
- ✅ Exécuter un scan de sécurité
- ✅ Analyser les résultats
- ✅ Tester tous les composants (logger, RBAC, secrets)
- ✅ Générer un rapport

**Résultat attendu :**
```
======================================================================
LLM SECURITY PLATFORM - QUICK TEST
======================================================================

✓ Test 1: Vérification des imports...
  ✅ Tous les modules importés avec succès

✓ Test 2: Vérification de la configuration...
  ✅ Fichier de configuration trouvé: demo_config.yaml

✓ Test 3: Initialisation de l'orchestrateur...
  ✅ Orchestrateur initialisé
  ✅ Tests chargés: 6

✓ Test 4: Exécution d'un scan de sécurité...
  ✅ Scan complété
  ✅ Score global: 7.85/10

...

🎉 La plateforme LLM Security Phase 1 est opérationnelle !
```

### Option 2 : Test de validation complet

Pour un test plus approfondi :

```bash
python test_platform.py
```

---

## 📝 Tests Manuels Étape par Étape

### Étape 1 : Vérifier l'installation

```bash
# Vérifier Python
python --version  # Doit afficher 3.11 ou supérieur

# Vérifier les dépendances
pip list | grep -E "pyyaml|requests|aiohttp"
```

### Étape 2 : Tester les imports

```bash
python -c "
from orchestrator.orchestrator import LLMSecurityOrchestrator
from analyzer.analyzer import LLMSecurityAnalyzer
print('✅ Imports OK')
"
```

### Étape 3 : Tester l'orchestrateur

```bash
cd orchestrator
python -c "
from orchestrator import LLMSecurityOrchestrator
orch = LLMSecurityOrchestrator()
print(f'✅ Orchestrateur OK - {len(orch.test_plugins)} tests chargés')
"
```

### Étape 4 : Exécuter un scan simple

**Sans LLM réel (mode démo) :**

```bash
cd orchestrator
python orchestrator.py "You are a helpful assistant" --demo
```

**Avec LM Studio (LLM réel) :**

```bash
# 1. Démarrer LM Studio sur http://localhost:11434
# 2. Charger un modèle (ex: llama2)
# 3. Exécuter le scan
cd orchestrator
python orchestrator.py "You are a helpful assistant"
```

### Étape 5 : Analyser les résultats

```bash
cd analyzer
python analyzer.py ../orchestrator/results/security_analysis_*.json
```

---

## 🎯 Tests par Composant

### Test du Logger Immuable

```bash
python -c "
from logger.immutable_logger import SecurityAuditLogger

logger = SecurityAuditLogger('./test_logs')
logger.log_scan_start('test-model', {'test': 'config'})

# Vérifier l'intégrité
verification = logger.verify_integrity()
print(f'✅ Logs valides: {verification[\"valid\"]}')
"
```

### Test du RBAC

```bash
python -c "
from security.rbac import RBACManager

rbac = RBACManager()
rbac.add_user('test_user', 'security_analyst')
has_perm = rbac.check_permission('test_user', 'run_scan')
print(f'✅ Permission vérifiée: {has_perm}')
"
```

### Test du Secrets Manager

```bash
python -c "
from security.secrets_manager import SecretsManager

secrets = SecretsManager(backend='environment')
print('✅ Secrets Manager OK')
"
```

### Test de l'Alerting

```bash
python -c "
from alerting.alerting import AlertingManager

config = {'alerting': {'enabled': False, 'channels': {}}}
alerting = AlertingManager(config)
print('✅ Alerting Manager OK')
"
```

---

## 🐳 Tests avec Docker

### Test 1 : Build de l'image

```bash
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
```

### Test 2 : Démarrer un runner

```bash
docker-compose up -d runner-1
docker-compose logs -f runner-1
```

### Test 3 : Exécuter un scan via Docker

```bash
docker-compose exec runner-1 python /app/runners/runner.py \
  --target-prompt "Test prompt" \
  --model llama2
```

### Test 4 : Arrêter le runner

```bash
docker-compose down
```

---

## 📊 Vérifier les Résultats

### Fichiers générés

Après un scan, vérifiez ces fichiers :

```bash
# Résultats du scan
ls -lh orchestrator/results/
cat orchestrator/results/security_analysis_*.json | jq .

# Rapports d'analyse
ls -lh analyzer/reports/
head analyzer/reports/analysis_report_*.csv

# Logs
ls -lh logs/
tail logs/orchestrator.log
```

### Interpréter les résultats

**VulnerabilityIndex (VI) :**
- `VI < 0.2` : ✅ Risque minimal (P5)
- `0.2 ≤ VI < 0.4` : ⚠️ Risque faible (P4)
- `0.4 ≤ VI < 0.6` : ⚠️ Risque moyen (P3)
- `0.6 ≤ VI < 0.8` : 🔴 Risque élevé (P2)
- `VI ≥ 0.8` : 🔴 Risque critique (P1)

**Scores par test :**
- `Score < 3` : ✅ Bon
- `3 ≤ Score < 6` : ⚠️ Moyen
- `Score ≥ 6` : 🔴 Problématique

---

## 🔍 Tests de Sécurité

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

### Vérification de l'intégrité

```bash
python -c "
from logger.immutable_logger import SecurityAuditLogger

audit = SecurityAuditLogger()
result = audit.verify_integrity()

if result['valid']:
    print('✅ Intégrité vérifiée')
else:
    print('❌ Intégrité compromise')
    print(f'Entrées invalides: {result[\"invalid_entries\"]}')
"
```

---

## ⚡ Tests de Performance

### Benchmark simple

```bash
time python orchestrator/orchestrator.py "Test prompt" --demo
```

### Benchmark avec plusieurs scans

```bash
for i in {1..5}; do
  echo "Scan $i..."
  python orchestrator/orchestrator.py "Test $i" --demo
done
```

---

## 🛠️ Dépannage Rapide

### Problème : Module non trouvé

```bash
# Solution : Ajouter au PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)/orchestrator:$(pwd)/analyzer"
```

### Problème : LM Studio non accessible

```bash
# Vérifier la connexion
curl http://localhost:11434/api/tags

# Vérifier la configuration
cat orchestrator/config.yaml | grep endpoint
```

### Problème : Timeout

```yaml
# Augmenter le timeout dans config.yaml
llm:
  timeout: 60  # Augmenter à 60 secondes
```

### Problème : Permissions

```bash
# Créer les répertoires nécessaires
mkdir -p logs results runner_results
chmod -R 755 logs results runner_results
```

---

## ✅ Checklist de Test Rapide

Cochez au fur et à mesure :

### Tests de base
- [ ] `python quick_test.py` réussi
- [ ] `python test_platform.py` réussi
- [ ] Imports Python fonctionnels
- [ ] Configuration chargée

### Tests fonctionnels
- [ ] Scan avec mock LLM réussi
- [ ] Analyse des résultats OK
- [ ] Fichiers de sortie générés
- [ ] Logs créés

### Tests des composants
- [ ] Logger immuable testé
- [ ] RBAC testé
- [ ] Secrets Manager testé
- [ ] Alerting testé

### Tests optionnels
- [ ] Scan avec LM Studio réussi
- [ ] Docker build réussi
- [ ] Runner Docker testé
- [ ] Scan de sécurité effectué

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **[GUIDE_TEST.md](GUIDE_TEST.md)** - Guide de test complet et détaillé
- **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)** - Guide de déploiement
- **[PHASE1_COMPLETION_SUMMARY.md](PHASE1_COMPLETION_SUMMARY.md)** - Résumé de la Phase 1
- **[README.md](README.md)** - Vue d'ensemble du projet

---

## 🎯 Scénarios de Test Recommandés

### Scénario 1 : Test de développement (5 min)

```bash
# Test rapide sans LLM
python quick_test.py
```

### Scénario 2 : Test d'intégration (15 min)

```bash
# 1. Test de la plateforme
python test_platform.py

# 2. Scan avec mock
cd orchestrator
python orchestrator.py "Test prompt" --demo

# 3. Analyse
cd ../analyzer
python analyzer.py ../orchestrator/results/*.json
```

### Scénario 3 : Test complet avec LLM (30 min)

```bash
# 1. Démarrer LM Studio
# 2. Exécuter un scan réel
cd orchestrator
python orchestrator.py "You are a helpful assistant"

# 3. Analyser les résultats
cd ../analyzer
python analyzer.py ../orchestrator/results/*.json

# 4. Vérifier les logs
tail -50 ../logs/orchestrator.log

# 5. Vérifier l'intégrité
python -c "
from logger.immutable_logger import SecurityAuditLogger
audit = SecurityAuditLogger()
print(audit.verify_integrity())
"
```

### Scénario 4 : Test de production (1 heure)

```bash
# 1. Tests unitaires
pytest orchestrator/tests/ -v
pytest analyzer/tests/ -v

# 2. Tests d'intégration
python test_platform.py

# 3. Scan de sécurité
safety check -r orchestrator/requirements.txt
bandit -r orchestrator/ analyzer/

# 4. Tests Docker
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
docker-compose up -d
docker-compose logs -f

# 5. Test de charge
for i in {1..10}; do
  docker-compose exec runner-1 python /app/runners/runner.py \
    --target-prompt "Test $i" --model llama2 &
done
wait

# 6. Vérification finale
docker-compose down
```

---

## 🎉 Résumé

### Pour tester rapidement (5 min)
```bash
python quick_test.py
```

### Pour tester complètement (30 min)
```bash
# 1. Validation
python test_platform.py

# 2. Scan
cd orchestrator && python orchestrator.py "Test prompt"

# 3. Analyse
cd ../analyzer && python analyzer.py ../orchestrator/results/*.json
```

### Pour tester en production (1 heure)
Suivez le **Scénario 4** ci-dessus.

---

**🚀 Vous êtes prêt à tester la plateforme !**

Pour toute question, consultez le [GUIDE_TEST.md](GUIDE_TEST.md) ou ouvrez une issue sur GitHub.
