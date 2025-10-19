# 🧪 Guide de Test - LLM Security Platform

## Vue d'ensemble

Ce guide vous explique comment tester la plateforme LLM Security de manière complète, depuis les tests unitaires jusqu'aux tests d'intégration en production.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Tests de validation de la plateforme](#tests-de-validation-de-la-plateforme)
3. [Tests unitaires](#tests-unitaires)
4. [Tests d'intégration](#tests-dintégration)
5. [Tests avec LLM réel](#tests-avec-llm-réel)
6. [Tests avec Docker](#tests-avec-docker)
7. [Tests de sécurité](#tests-de-sécurité)
8. [Tests de performance](#tests-de-performance)
9. [Validation des résultats](#validation-des-résultats)
10. [Dépannage](#dépannage)

---

## Prérequis

### Installation de base

```bash
# 1. Vérifier Python
python --version  # Doit être 3.11+

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Installer les dépendances des modules
cd orchestrator && pip install -r requirements.txt && cd ..
cd analyzer && pip install -r requirements.txt && cd ..
cd runners && pip install -r requirements.txt && cd ..
```

### Dépendances de test

```bash
# Installer pytest et outils de test
pip install pytest pytest-asyncio pytest-cov pytest-mock
pip install safety bandit flake8
```

---

## Tests de validation de la plateforme

### Test 1 : Validation de la structure

Ce test vérifie que tous les fichiers nécessaires sont présents.

```bash
python test_platform.py
```

**Résultat attendu :**
```
🛡️ LLM Security Platform - Test de la plateforme Python
======================================================================
✅ Structure des fichiers - RÉUSSI
✅ Imports Python - RÉUSSI
✅ Configuration - RÉUSSI
✅ Orchestrateur - RÉUSSI
✅ Analyzer - RÉUSSI
📊 Résultats: 5/5 tests réussis
🎉 Tous les tests sont réussis ! La plateforme Python est prête.
```

### Test 2 : Validation de la configuration

```bash
# Vérifier la configuration principale
python -c "
import yaml
with open('orchestrator/config.yaml', 'r') as f:
    config = yaml.safe_load(f)
    print('✅ Configuration valide')
    tests_enabled = [t for t in config['tests'].values() if t.get('enabled')]
    print(f'✅ Tests activés: {len(tests_enabled)}')
"
```

### Test 3 : Validation des imports

```bash
# Tester tous les imports Python
python -c "
from orchestrator.orchestrator import LLMSecurityOrchestrator
from analyzer.analyzer import LLMSecurityAnalyzer
from analyzer.scoring import VulnerabilityScoring
print('✅ Tous les imports fonctionnent')
"
```

---

## Tests unitaires

### Test des modules individuels

#### 1. Test de l'orchestrateur

```bash
cd orchestrator
python -c "
from orchestrator import LLMSecurityOrchestrator
orchestrator = LLMSecurityOrchestrator()
plugins = orchestrator._initialize_plugins()
print(f'✅ Orchestrateur OK - {len(plugins)} plugins chargés')
"
```

#### 2. Test de l'analyzer

```bash
cd analyzer
python -c "
from analyzer import LLMSecurityAnalyzer
from scoring import VulnerabilityScoring

analyzer = LLMSecurityAnalyzer()
scoring = VulnerabilityScoring()

# Test avec données fictives
test_results = {
    'prompt_injection': {'score': 8.5},
    'safety_bypass': {'score': 7.2},
    'rag_audit': {'score': 6.8},
    'structural_probe': {'score': 9.1},
    'role_sensitivity': {'score': 7.5}
}

vi = scoring.calculate_vulnerability_index(test_results)
print(f'✅ Analyzer OK - VulnerabilityIndex: {vi:.4f}')
"
```

#### 3. Test du logger immuable

```bash
python -c "
from logger.immutable_logger import ImmutableLogger, SecurityAuditLogger

# Test ImmutableLogger
logger = ImmutableLogger(log_dir='./test_logs')
logger.log('test', {'message': 'Test log entry'})
verification = logger.verify_integrity()
print(f'✅ ImmutableLogger OK - Logs valides: {verification[\"valid\"]}')

# Test SecurityAuditLogger
audit_logger = SecurityAuditLogger(log_dir='./test_logs')
audit_logger.log_scan_start('test-model', 'test-prompt')
print('✅ SecurityAuditLogger OK')
"
```

#### 4. Test du RBAC

```bash
python -c "
from security.rbac import RBACManager

rbac = RBACManager()
rbac.add_user('test_user', 'security_analyst')
has_permission = rbac.check_permission('test_user', 'run_scan')
print(f'✅ RBAC OK - Permission vérifiée: {has_permission}')
"
```

#### 5. Test du Secrets Manager

```bash
python -c "
from security.secrets_manager import SecretsManager

# Test avec backend environment
secrets = SecretsManager(backend='environment')
print('✅ SecretsManager OK')
"
```

#### 6. Test de l'alerting

```bash
python -c "
from alerting.alerting import AlertingManager

config = {
    'alerting': {
        'enabled': False,  # Désactivé pour le test
        'channels': {}
    }
}

alerting = AlertingManager(config)
print('✅ AlertingManager OK')
"
```

---

## Tests d'intégration

### Test 1 : Scan complet avec mock LLM

Ce test exécute un scan complet sans avoir besoin d'un LLM réel.

```bash
# Créer un fichier de test
cat > test_scan.py << 'EOF'
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent / "orchestrator"))

async def mock_llm_call(prompt, **kwargs):
    """Mock LLM qui retourne des réponses prédictibles"""
    return {
        'response': 'This is a mock response',
        'model': 'mock-model',
        'timestamp': '2024-01-01T00:00:00'
    }

async def test_scan():
    from orchestrator import LLMSecurityOrchestrator
    
    orchestrator = LLMSecurityOrchestrator()
    
    # Remplacer la fonction LLM par le mock
    orchestrator._call_llm = mock_llm_call
    
    # Exécuter le scan
    results = await orchestrator.run_security_scan(
        target_prompt="You are a helpful assistant",
        model_name="mock-model"
    )
    
    print(f"✅ Scan terminé")
    print(f"   - Tests exécutés: {len(results.get('tests', {}))}")
    print(f"   - Durée: {results.get('metadata', {}).get('duration', 0):.2f}s")
    
    return results

if __name__ == "__main__":
    results = asyncio.run(test_scan())
    print("\n✅ Test d'intégration réussi")
EOF

python test_scan.py
```

### Test 2 : Pipeline complet (Scan + Analyse)

```bash
# Script de test du pipeline complet
cat > test_pipeline.py << 'EOF'
import asyncio
import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent / "orchestrator"))
sys.path.append(str(Path(__file__).parent / "analyzer"))

async def test_full_pipeline():
    from orchestrator import LLMSecurityOrchestrator
    from analyzer import LLMSecurityAnalyzer
    from scoring import VulnerabilityScoring
    
    print("🔄 Test du pipeline complet...")
    
    # 1. Scan (avec mock)
    print("\n1️⃣ Exécution du scan...")
    orchestrator = LLMSecurityOrchestrator()
    
    # Mock LLM
    async def mock_llm(prompt, **kwargs):
        return {'response': 'Mock response', 'model': 'mock'}
    
    orchestrator._call_llm = mock_llm
    
    scan_results = await orchestrator.run_security_scan(
        target_prompt="Test prompt",
        model_name="test-model"
    )
    print(f"✅ Scan terminé - {len(scan_results.get('tests', {}))} tests")
    
    # 2. Analyse
    print("\n2️⃣ Analyse des résultats...")
    analyzer = LLMSecurityAnalyzer()
    analysis = analyzer.analyze_results(scan_results)
    print(f"✅ Analyse terminée")
    print(f"   - VulnerabilityIndex: {analysis.get('vulnerability_index', 0):.4f}")
    print(f"   - Risk Level: {analysis.get('risk_level', 'N/A')}")
    print(f"   - Priority: {analysis.get('priority', 'N/A')}")
    
    # 3. Export
    print("\n3️⃣ Export des résultats...")
    output_file = Path("test_results.json")
    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    print(f"✅ Résultats exportés vers {output_file}")
    
    return True

if __name__ == "__main__":
    success = asyncio.run(test_full_pipeline())
    if success:
        print("\n🎉 Pipeline complet testé avec succès !")
    else:
        print("\n❌ Erreur dans le pipeline")
        sys.exit(1)
EOF

python test_pipeline.py
```

---

## Tests avec LLM réel

### Prérequis : Démarrer LM Studio

1. **Télécharger LM Studio** : https://lmstudio.ai/
2. **Installer et démarrer** le serveur local
3. **Charger un modèle** (ex: llama2, mistral, etc.)
4. **Vérifier l'endpoint** : http://localhost:11434

### Test 1 : Vérifier la connexion LLM

```bash
# Tester la connexion à LM Studio
curl http://localhost:11434/api/tags

# Ou avec Python
python -c "
import requests
try:
    response = requests.get('http://localhost:11434/api/tags', timeout=5)
    if response.status_code == 200:
        print('✅ LM Studio accessible')
    else:
        print('❌ LM Studio non accessible')
except Exception as e:
    print(f'❌ Erreur: {e}')
"
```

### Test 2 : Scan simple avec LLM réel

```bash
cd orchestrator
python orchestrator.py "You are a helpful AI assistant"
```

**Résultat attendu :**
```
🛡️ LLM Security Platform - Orchestrator
========================================
🎯 Target Prompt: You are a helpful AI assistant
🤖 Model: llama2
📋 Tests activés: 6

🔄 Exécution des tests...
✅ [1/6] Structural Probe - Terminé (45.2s)
✅ [2/6] Role Sensitivity - Terminé (38.7s)
✅ [3/6] RAG Audit - Terminé (52.1s)
✅ [4/6] Prompt Injection - Terminé (41.3s)
✅ [5/6] Safety Bypass - Terminé (39.8s)
✅ [6/6] Extraction Probe - Terminé (43.5s)

📊 Résultats sauvegardés: ./results/security_analysis_20241019_184500.json
✅ Scan terminé avec succès !
```

### Test 3 : Analyse des résultats

```bash
cd analyzer
python analyzer.py ../orchestrator/results/security_analysis_*.json
```

**Résultat attendu :**
```
📊 LLM Security Analyzer
========================

📁 Fichier: security_analysis_20241019_184500.json
🤖 Modèle: llama2

📈 Scores par test:
  • Prompt Injection: 8.5/10
  • Safety Bypass: 7.2/10
  • RAG Audit: 6.8/10
  • Structural Probe: 9.1/10
  • Role Sensitivity: 7.5/10
  • Extraction Probe: 8.0/10

🎯 VulnerabilityIndex: 0.7850
⚠️ Risk Level: HIGH
🔴 Priority: P2

📄 Rapport CSV exporté: ./reports/analysis_report_20241019_184500.csv
✅ Analyse terminée !
```

### Test 4 : Scan avec configuration personnalisée

```bash
# Créer une configuration de test
cat > test_config.yaml << 'EOF'
llm:
  endpoint: "http://localhost:11434"
  model: "llama2"
  timeout: 30

tests:
  structural_probe:
    enabled: true
    max_attempts: 3
  
  prompt_injection:
    enabled: true
    max_attempts: 5

output:
  output_dir: "./test_results"
  save_to_file: true
EOF

# Exécuter avec cette configuration
cd orchestrator
python orchestrator.py "Test prompt" --config ../test_config.yaml
```

---

## Tests avec Docker

### Test 1 : Build de l'image Docker

```bash
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
```

**Vérifier le build :**
```bash
docker images | grep llm-security-runner
```

### Test 2 : Démarrer un runner unique

```bash
# Démarrer le runner
docker-compose up -d runner-1

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f runner-1
```

### Test 3 : Tester le runner

```bash
# Exécuter un scan via le runner
docker-compose exec runner-1 python /app/runners/runner.py \
  --target-prompt "You are a helpful assistant" \
  --model llama2
```

### Test 4 : Multi-runners

```bash
# Démarrer plusieurs runners
docker-compose --profile multi-worker up -d

# Vérifier tous les runners
docker-compose ps

# Voir les logs de tous les runners
docker-compose logs -f
```

### Test 5 : Arrêter les runners

```bash
docker-compose down
```

---

## Tests de sécurité

### Test 1 : Scan des dépendances

```bash
# Installer safety
pip install safety

# Scanner les dépendances
safety check -r orchestrator/requirements.txt
safety check -r analyzer/requirements.txt
safety check -r runners/requirements.txt
```

### Test 2 : Scan du code avec Bandit

```bash
# Installer bandit
pip install bandit

# Scanner le code
bandit -r orchestrator/ -f json -o bandit_orchestrator.json
bandit -r analyzer/ -f json -o bandit_analyzer.json
bandit -r security/ -f json -o bandit_security.json
bandit -r logger/ -f json -o bandit_logger.json
bandit -r alerting/ -f json -o bandit_alerting.json

# Voir les résultats
cat bandit_*.json
```

### Test 3 : Vérification de l'intégrité des logs

```bash
python -c "
from logger.immutable_logger import SecurityAuditLogger

audit_logger = SecurityAuditLogger()

# Vérifier l'intégrité
verification = audit_logger.verify_integrity()

print(f'Logs valides: {verification[\"valid\"]}')
print(f'Entrées vérifiées: {verification[\"verified_entries\"]}')
print(f'Entrées invalides: {verification[\"invalid_entries\"]}')

if verification['valid']:
    print('✅ Intégrité des logs vérifiée')
else:
    print('❌ Intégrité des logs compromise')
"
```

### Test 4 : Test du RBAC

```bash
python -c "
from security.rbac import RBACManager

rbac = RBACManager()

# Ajouter des utilisateurs de test
rbac.add_user('admin_test', 'admin')
rbac.add_user('analyst_test', 'security_analyst')
rbac.add_user('viewer_test', 'viewer')

# Tester les permissions
tests = [
    ('admin_test', 'run_scan', True),
    ('analyst_test', 'run_scan', True),
    ('viewer_test', 'run_scan', False),
    ('admin_test', 'delete_results', True),
    ('analyst_test', 'delete_results', False),
]

for user, permission, expected in tests:
    result = rbac.check_permission(user, permission)
    status = '✅' if result == expected else '❌'
    print(f'{status} {user} - {permission}: {result}')
"
```

---

## Tests de performance

### Test 1 : Temps d'exécution des tests

```bash
# Script de benchmark
cat > benchmark.py << 'EOF'
import asyncio
import time
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent / "orchestrator"))

async def benchmark_scan():
    from orchestrator import LLMSecurityOrchestrator
    
    orchestrator = LLMSecurityOrchestrator()
    
    # Mock LLM rapide
    async def mock_llm(prompt, **kwargs):
        await asyncio.sleep(0.1)  # Simuler latence
        return {'response': 'Mock', 'model': 'mock'}
    
    orchestrator._call_llm = mock_llm
    
    start = time.time()
    results = await orchestrator.run_security_scan(
        target_prompt="Test",
        model_name="test"
    )
    duration = time.time() - start
    
    print(f"⏱️ Durée totale: {duration:.2f}s")
    print(f"📊 Tests exécutés: {len(results.get('tests', {}))}")
    print(f"⚡ Temps moyen par test: {duration / len(results.get('tests', {})):.2f}s")

asyncio.run(benchmark_scan())
EOF

python benchmark.py
```

### Test 2 : Charge avec multi-runners

```bash
# Démarrer plusieurs scans en parallèle
for i in {1..5}; do
  docker-compose exec runner-1 python /app/runners/runner.py \
    --target-prompt "Test $i" \
    --model llama2 &
done

wait
echo "✅ Tous les scans parallèles terminés"
```

---

## Validation des résultats

### Vérifier les fichiers de sortie

```bash
# Lister les résultats
ls -lh orchestrator/results/

# Vérifier le format JSON
python -c "
import json
from pathlib import Path

results_dir = Path('orchestrator/results')
for result_file in results_dir.glob('security_analysis_*.json'):
    with open(result_file) as f:
        data = json.load(f)
    print(f'✅ {result_file.name}')
    print(f'   - Tests: {len(data.get(\"tests\", {}))}')
    print(f'   - Modèle: {data.get(\"metadata\", {}).get(\"model\", \"N/A\")}')
"
```

### Vérifier les rapports CSV

```bash
# Lister les rapports
ls -lh analyzer/reports/

# Afficher un rapport
head -20 analyzer/reports/analysis_report_*.csv
```

### Vérifier les logs

```bash
# Logs de l'orchestrateur
tail -50 logs/orchestrator.log

# Logs immuables
python -c "
from logger.immutable_logger import ImmutableLogger
import json

logger = ImmutableLogger()
logs = logger.read_logs(limit=10)

for log in logs:
    print(f'{log[\"timestamp\"]} - {log[\"level\"]} - {log[\"message\"]}')
"
```

---

## Dépannage

### Problème : LM Studio non accessible

**Symptôme :**
```
❌ Erreur: Connection refused to http://localhost:11434
```

**Solution :**
```bash
# 1. Vérifier que LM Studio est démarré
curl http://localhost:11434/api/tags

# 2. Vérifier le port dans la configuration
cat orchestrator/config.yaml | grep endpoint

# 3. Redémarrer LM Studio
```

### Problème : Timeout des tests

**Symptôme :**
```
❌ Test timeout after 30 seconds
```

**Solution :**
```yaml
# Augmenter le timeout dans config.yaml
llm:
  timeout: 60  # Augmenter à 60 secondes
```

### Problème : Erreurs d'import

**Symptôme :**
```
ModuleNotFoundError: No module named 'orchestrator'
```

**Solution :**
```bash
# Vérifier les chemins Python
export PYTHONPATH="${PYTHONPATH}:$(pwd)/orchestrator:$(pwd)/analyzer"

# Ou installer en mode développement
pip install -e .
```

### Problème : Permissions Docker

**Symptôme :**
```
❌ Permission denied: '/app/results'
```

**Solution :**
```bash
# Créer les répertoires avec les bonnes permissions
mkdir -p results logs runner_results
chmod -R 777 results logs runner_results

# Reconstruire l'image
docker-compose build --no-cache
```

### Problème : Résultats manquants

**Symptôme :**
```
❌ No results found in ./results/
```

**Solution :**
```bash
# Vérifier la configuration de sortie
python -c "
import yaml
with open('orchestrator/config.yaml') as f:
    config = yaml.safe_load(f)
    print(f'Output dir: {config[\"output\"][\"output_dir\"]}')
    print(f'Save to file: {config[\"output\"][\"save_to_file\"]}')
"

# Créer le répertoire si nécessaire
mkdir -p orchestrator/results
```

---

## Checklist de test complète

### Tests de base
- [ ] Structure des fichiers validée
- [ ] Imports Python fonctionnels
- [ ] Configuration chargée correctement
- [ ] Orchestrateur initialisé
- [ ] Analyzer initialisé

### Tests unitaires
- [ ] Logger immuable testé
- [ ] RBAC testé
- [ ] Secrets Manager testé
- [ ] Alerting Manager testé
- [ ] Scoring testé

### Tests d'intégration
- [ ] Scan avec mock LLM réussi
- [ ] Pipeline complet (scan + analyse) réussi
- [ ] Export des résultats validé

### Tests avec LLM réel
- [ ] Connexion LM Studio vérifiée
- [ ] Scan simple réussi
- [ ] Analyse des résultats réussie
- [ ] Scan avec config personnalisée réussi

### Tests Docker
- [ ] Image Docker buildée
- [ ] Runner unique démarré
- [ ] Multi-runners testés
- [ ] Logs Docker vérifiés

### Tests de sécurité
- [ ] Scan des dépendances effectué
- [ ] Scan Bandit effectué
- [ ] Intégrité des logs vérifiée
- [ ] RBAC testé

### Tests de performance
- [ ] Benchmark des temps d'exécution
- [ ] Tests de charge parallèles

### Validation
- [ ] Fichiers de résultats vérifiés
- [ ] Rapports CSV vérifiés
- [ ] Logs vérifiés

---

## Prochaines étapes

Une fois tous les tests réussis :

1. **Déployer en production** - Suivre le [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)
2. **Configurer l'alerting** - Intégrer JIRA/Teams/Slack
3. **Mettre en place le CI/CD** - Configurer Azure DevOps
4. **Former les équipes** - Documentation et formation
5. **Planifier Phase 2** - Multi-tenant et SOC

---

**🎉 Félicitations ! Vous savez maintenant comment tester complètement la plateforme LLM Security.**

Pour toute question, consultez la documentation ou ouvrez une issue sur GitHub.
