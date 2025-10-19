# LLM Security Platform - Guide de Déploiement Phase 1

## 📋 Vue d'ensemble Phase 1

La Phase 1 (Production-lite) inclut tous les composants essentiels pour un déploiement en production :

### ✅ Composants implémentés

**Tests de sécurité complets (6/6)**
- ✅ Structural Probe - Robustesse structurelle
- ✅ Role Sensitivity - Sensibilité aux rôles
- ✅ RAG Audit - Audit de récupération RAG
- ✅ Prompt Injection - Détection d'injection de prompts
- ✅ Safety Bypass - Détection de contournement de sécurité
- ✅ **Extraction Probe** - Détection de fuite de données (NOUVEAU)
- ✅ **Fingerprinting** - Détection de facilité d'empreinte (NOUVEAU)

**Infrastructure de sécurité**
- ✅ **Logger immuable** avec hash chaining pour traçabilité complète
- ✅ **Alerting & Ticketing** (JIRA, ServiceNow, Teams, Slack)
- ✅ **RBAC** - Contrôle d'accès basé sur les rôles
- ✅ **Secrets Manager** - Gestion sécurisée des secrets (Azure Key Vault, HashiCorp Vault)
- ✅ **Runners containerisés** avec isolation réseau
- ✅ **Pipeline CI/CD** Azure DevOps complet

**Scoring et analyse**
- ✅ Calcul du VulnerabilityIndex avec formule pondérée
- ✅ Classement par criticité (P1-P5)
- ✅ Export CSV enrichi
- ✅ Recommandations de remédiation

---

## 🚀 Installation et Déploiement

### Prérequis

**Système**
- Python 3.11+
- Docker & Docker Compose (pour runners isolés)
- Git

**Services externes (optionnels)**
- LM Studio ou endpoint LLM compatible
- Azure Key Vault ou HashiCorp Vault (pour secrets)
- JIRA/ServiceNow (pour ticketing)
- Teams/Slack (pour alertes)

### 1. Installation locale

```bash
# Cloner le repository
git clone <repo-url>
cd llm-security-platform

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Installer les dépendances des modules
cd orchestrator && pip install -r requirements.txt && cd ..
cd analyzer && pip install -r requirements.txt && cd ..
cd runners && pip install -r requirements.txt && cd ..
```

### 2. Configuration

#### A. Configuration de base

Copiez et éditez le fichier de configuration :

```bash
cp config.yaml config.local.yaml
```

Éditez `config.local.yaml` pour ajuster :
- Endpoint LLM (`llm.endpoint`)
- Modèle à tester (`llm.model`)
- Répertoires de sortie
- Niveaux de logging

#### B. Configuration des secrets

**Option 1 : Variables d'environnement (recommandé pour dev)**

```bash
# Créer un fichier .env
cat > .env << EOF
LLM_SECURITY_LLM_ENDPOINT=http://localhost:11434
LLM_SECURITY_LLM_MODEL=llama2
LLM_SECURITY_JIRA_URL=https://your-jira.atlassian.net
LLM_SECURITY_JIRA_USERNAME=your-email@example.com
LLM_SECURITY_JIRA_API_TOKEN=your-api-token
LLM_SECURITY_TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
LLM_SECURITY_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
EOF

# Charger les variables
source .env  # Windows: utiliser set ou PowerShell
```

**Option 2 : Azure Key Vault (recommandé pour production)**

```bash
# Installer les dépendances Azure
pip install azure-keyvault-secrets azure-identity

# Configurer dans config.yaml
security:
  secrets:
    backend: "azure_keyvault"
    vault_url: "https://your-vault.vault.azure.net/"
```

**Option 3 : HashiCorp Vault**

```bash
# Installer hvac
pip install hvac

# Configurer dans config.yaml
security:
  secrets:
    backend: "hashicorp_vault"
    vault_url: "http://localhost:8200"
    token: "your-vault-token"
    mount_point: "secret"
```

#### C. Configuration RBAC

Créez le fichier de configuration RBAC :

```bash
cat > security/rbac_config.json << EOF
{
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
EOF
```

### 3. Démarrage de LM Studio (ou endpoint LLM)

```bash
# Télécharger et installer LM Studio depuis https://lmstudio.ai/
# Démarrer le serveur local sur le port 11434
# Charger un modèle (ex: llama2, mistral, etc.)
```

### 4. Exécution d'un scan de sécurité

#### Scan simple

```bash
cd orchestrator
python orchestrator.py "You are a helpful AI assistant"
```

#### Scan avec configuration personnalisée

```bash
python orchestrator.py "Test prompt" --config ../config.local.yaml
```

#### Analyse des résultats

```bash
cd analyzer
python analyzer.py ../orchestrator/results/security_analysis_*.json
```

### 5. Déploiement avec runners containerisés

#### A. Build des images Docker

```bash
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
```

#### B. Démarrage avec Docker Compose

**Single runner:**
```bash
docker-compose up -d runner-1
```

**Multi-workers:**
```bash
docker-compose --profile multi-worker up -d
```

#### C. Vérification des logs

```bash
docker-compose logs -f runner-1
```

#### D. Arrêt des runners

```bash
docker-compose down
```

---

## 🔧 Configuration avancée

### Activation de l'alerting

#### JIRA

1. Créer un API token dans JIRA
2. Configurer dans `config.yaml`:

```yaml
alerting:
  enabled: true
  channels:
    jira:
      enabled: true
      jira_url: "https://your-jira.atlassian.net"
      username: "your-email@example.com"
      api_token: "${JIRA_API_TOKEN}"
      project_key: "SEC"
```

3. Définir la variable d'environnement:
```bash
export LLM_SECURITY_JIRA_API_TOKEN="your-token"
```

#### Microsoft Teams

1. Créer un webhook entrant dans Teams
2. Configurer dans `config.yaml`:

```yaml
alerting:
  channels:
    teams:
      enabled: true
      webhook_url: "${TEAMS_WEBHOOK_URL}"
```

#### Slack

1. Créer une application Slack et un webhook
2. Configurer dans `config.yaml`:

```yaml
alerting:
  channels:
    slack:
      enabled: true
      webhook_url: "${SLACK_WEBHOOK_URL}"
```

### Activation du logging immuable

Le logging immuable est activé par défaut. Configuration:

```yaml
logging:
  immutable_logs: true
  immutable_log_dir: "./logs/immutable"

advanced:
  hash_chaining:
    enabled: true
    algorithm: "SHA-256"
```

**Vérification de l'intégrité des logs:**

```python
from logger.immutable_logger import SecurityAuditLogger

audit_logger = SecurityAuditLogger()
verification = audit_logger.verify_integrity()

print(f"Logs valides: {verification['valid']}")
print(f"Entrées vérifiées: {verification['verified_entries']}")
```

### Scheduling automatique

Créer un fichier de schedule:

```bash
cat > config/scan_schedule.json << EOF
[
  {
    "model_name": "llama2",
    "target_prompt": "You are a helpful assistant",
    "delay": 10
  },
  {
    "model_name": "gpt-4",
    "target_prompt": "You are an AI assistant",
    "delay": 10
  }
]
EOF
```

Exécuter avec le runner:

```bash
cd runners
python runner.py --schedule ../config/scan_schedule.json
```

---

## 📊 Pipeline CI/CD Azure DevOps

### Configuration du pipeline

1. **Créer un projet Azure DevOps**

2. **Importer le pipeline**
   - Aller dans Pipelines > New Pipeline
   - Sélectionner "Azure Repos Git" ou "GitHub"
   - Sélectionner "Existing Azure Pipelines YAML file"
   - Choisir `/infra/azure-pipelines.yml`

3. **Configurer les variables**
   - `python.version`: '3.11'
   - `llm.endpoint`: 'http://localhost:11434'
   - `test.timeout`: 300

4. **Configurer les agents auto-hébergés (optionnel)**

Pour tester avec un vrai LLM:
- Créer un pool d'agents auto-hébergés
- Installer LM Studio sur les agents
- Décommenter la section `LLMTest` dans le pipeline

### Déclenchement du pipeline

**Automatique:**
- Push vers `main` ou `develop`
- Pull Request vers `main` ou `develop`

**Manuel:**
- Via l'interface Azure DevOps
- Cliquer sur "Run pipeline"

---

## 🔒 Sécurité et conformité

### Isolation des tests

Les tests sont exécutés dans des environnements isolés:

**Niveau 1 : Process isolation**
- Tests exécutés dans des processus séparés
- Timeout configurables
- Rate limiting

**Niveau 2 : Container isolation (recommandé)**
- Docker containers avec réseau restreint
- Capacités limitées (cap_drop: ALL)
- Read-only filesystem
- No new privileges

**Niveau 3 : VM isolation (Phase 2)**
- Machines virtuelles dédiées
- Réseau complètement isolé

### Traçabilité et audit

**Logs immuables:**
- Hash chaining SHA-256
- Séquence numérotée
- Vérification d'intégrité

**Audit RBAC:**
- Tous les accès sont enregistrés
- Piste d'audit complète
- Filtrage par utilisateur/période

**Export de rapports d'audit:**

```python
from logger.immutable_logger import SecurityAuditLogger

audit_logger = SecurityAuditLogger()
audit_logger.export_audit_report(
    output_path="./audit_reports/audit_2024.json",
    start_time="2024-01-01T00:00:00",
    end_time="2024-12-31T23:59:59"
)
```

### Chiffrement

**At-rest:**
- Résultats chiffrés avec AES-256-GCM
- Secrets stockés dans Key Vault

**In-transit:**
- TLS 1.3 pour toutes les communications
- Certificats validés

---

## 📈 Monitoring et métriques

### Métriques disponibles

- **VulnerabilityIndex** par modèle
- **Nombre de vulnérabilités** par sévérité
- **Durée des scans**
- **Taux de succès des tests**
- **Performance des runners**

### Export des métriques

```python
from analyzer.analyzer import LLMSecurityAnalyzer

analyzer = LLMSecurityAnalyzer()
analysis = analyzer.analyze_results(results)

print(f"Vulnerability Index: {analysis['vulnerability_index']:.4f}")
print(f"Risk Level: {analysis['risk_level']}")
print(f"Priority: {analysis['priority']}")
```

### Dashboards (Phase 2)

- Kibana pour visualisation des logs
- Grafana pour métriques temps réel
- Elasticsearch pour recherche avancée

---

## 🧪 Tests et validation

### Tests unitaires

```bash
# Installer pytest
pip install pytest pytest-asyncio

# Exécuter les tests
pytest orchestrator/tests/ -v
pytest analyzer/tests/ -v
```

### Tests d'intégration

```bash
# Test complet end-to-end
python test_platform.py
```

### Validation de la configuration

```bash
# Vérifier la configuration
python -c "
import yaml
with open('config.yaml', 'r') as f:
    config = yaml.safe_load(f)
    print('Configuration valide')
    print(f'Tests activés: {len([t for t in config[\"tests\"].values() if t.get(\"enabled\")])}')
"
```

---

## 🐛 Dépannage

### Problème : LM Studio non accessible

**Solution:**
```bash
# Vérifier que LM Studio est démarré
curl http://localhost:11434/api/tags

# Vérifier la configuration
cat config.yaml | grep endpoint
```

### Problème : Timeout des tests

**Solution:**
```yaml
# Augmenter le timeout dans config.yaml
llm:
  timeout: 60  # Augmenter à 60 secondes
```

### Problème : Erreurs de permissions

**Solution:**
```bash
# Vérifier les permissions des répertoires
chmod -R 755 logs/ results/ runner_results/

# Créer les répertoires manquants
mkdir -p logs/immutable logs/rbac_audit results runner_results
```

### Problème : Docker containers ne démarrent pas

**Solution:**
```bash
# Vérifier les logs Docker
docker-compose logs runner-1

# Reconstruire l'image
docker-compose build --no-cache

# Vérifier les ressources
docker stats
```

---

## 📚 Ressources additionnelles

### Documentation

- [README.md](README.md) - Vue d'ensemble du projet
- [PLATFORM_SUMMARY.md](PLATFORM_SUMMARY.md) - Résumé de la plateforme
- [Architecture détaillée](docs/architecture.md) (à créer)

### Support

- Issues GitHub pour les bugs
- Discussions pour les questions
- Email: support@llm-security-platform.com

### Roadmap Phase 2

- Multi-tenant avec isolation complète
- Intégration SOC dédié IA
- Conformité ISO27001/GDPR automatisée
- HSM pour gestion des clés
- Dashboard temps réel avancé
- ML pour détection d'anomalies

---

## ✅ Checklist de déploiement

### Pré-déploiement

- [ ] Python 3.11+ installé
- [ ] Docker installé (si utilisation de runners)
- [ ] LM Studio configuré et démarré
- [ ] Variables d'environnement définies
- [ ] Configuration RBAC créée
- [ ] Secrets configurés (Key Vault ou variables)

### Déploiement

- [ ] Dépendances installées
- [ ] Configuration validée
- [ ] Tests unitaires passés
- [ ] Scan de sécurité exécuté avec succès
- [ ] Résultats analysés et exportés
- [ ] Logs immuables vérifiés

### Post-déploiement

- [ ] Alerting configuré et testé
- [ ] Pipeline CI/CD configuré
- [ ] Runners containerisés démarrés
- [ ] Monitoring activé
- [ ] Documentation à jour
- [ ] Formation des utilisateurs

---

## 🎯 Prochaines étapes

1. **Tester la plateforme** avec vos modèles LLM
2. **Configurer l'alerting** pour votre équipe
3. **Déployer les runners** en production
4. **Intégrer au pipeline CI/CD**
5. **Former les équipes** à l'utilisation
6. **Planifier la Phase 2** (Multi-tenant, SOC)

---

**Félicitations ! Votre plateforme LLM Security Phase 1 est prête pour la production. 🚀**
