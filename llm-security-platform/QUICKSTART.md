# 🚀 Guide de Démarrage Rapide - LLM Security Platform Phase 1

## Installation en 5 minutes

### Option 1 : Installation automatique (Recommandé)

```bash
# 1. Cloner le repository
git clone <repo-url>
cd llm-security-platform

# 2. Exécuter le script d'installation
python install_phase1.py

# 3. Suivre les instructions à l'écran
```

### Option 2 : Installation manuelle

```bash
# 1. Installer les dépendances
pip install -r requirements.txt
pip install -r orchestrator/requirements.txt
pip install -r analyzer/requirements.txt

# 2. Créer les répertoires
mkdir -p logs/immutable logs/rbac_audit results runner_results

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

---

## Configuration minimale

### 1. Endpoint LLM

Éditez `.env`:

```bash
LLM_SECURITY_LLM_ENDPOINT=http://localhost:11434
LLM_SECURITY_LLM_MODEL=llama2
```

### 2. Démarrer LM Studio

1. Télécharger [LM Studio](https://lmstudio.ai/)
2. Charger un modèle (ex: llama2, mistral)
3. Démarrer le serveur local (port 11434)

---

## Premier scan en 3 commandes

```bash
# 1. Aller dans le répertoire orchestrator
cd orchestrator

# 2. Exécuter un scan
python orchestrator.py "You are a helpful AI assistant"

# 3. Analyser les résultats
cd ../analyzer
python analyzer.py ../orchestrator/results/security_analysis_*.json
```

**Résultat attendu :**
- Score global de sécurité (0-10)
- VulnerabilityIndex (0-1)
- Liste des vulnérabilités détectées
- Recommandations de remédiation

---

## Test rapide de validation

```bash
# Exécuter le script de test
python quick_test.py
```

Ce script valide :
- ✅ Imports des modules
- ✅ Configuration
- ✅ Orchestrateur
- ✅ Exécution d'un scan
- ✅ Analyse et scoring
- ✅ Logger immuable
- ✅ RBAC
- ✅ Secrets Manager
- ✅ Sauvegarde des résultats

---

## Utilisation de base

### Scan simple

```bash
cd orchestrator
python orchestrator.py "Your test prompt"
```

### Scan avec configuration personnalisée

```bash
python orchestrator.py "Test prompt" --config ../config.yaml
```

### Analyse des résultats

```bash
cd analyzer
python analyzer.py ../orchestrator/results/security_analysis_20241014_120000.json
```

### Export CSV

Les résultats sont automatiquement exportés en CSV dans `./results/`

---

## Déploiement Docker (Optionnel)

### Build et démarrage

```bash
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
docker-compose up -d
```

### Vérification

```bash
docker-compose logs -f runner-1
docker-compose ps
```

### Arrêt

```bash
docker-compose down
```

---

## Configuration avancée (Optionnel)

### Activer l'alerting JIRA

```bash
# Dans .env
LLM_SECURITY_JIRA_URL=https://your-jira.atlassian.net
LLM_SECURITY_JIRA_USERNAME=your-email@example.com
LLM_SECURITY_JIRA_API_TOKEN=your-api-token
LLM_SECURITY_JIRA_PROJECT_KEY=SEC
```

```yaml
# Dans config.yaml
alerting:
  enabled: true
  channels:
    jira:
      enabled: true
```

### Activer Teams/Slack

```bash
# Dans .env
LLM_SECURITY_TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
LLM_SECURITY_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### Utiliser Azure Key Vault

```bash
# Installer les dépendances
pip install azure-keyvault-secrets azure-identity

# Dans config.yaml
security:
  secrets:
    backend: "azure_keyvault"
    vault_url: "https://your-vault.vault.azure.net/"
```

---

## Structure des résultats

### Fichier JSON

```json
{
  "timestamp": "2024-10-14T12:00:00",
  "model_name": "llama2",
  "overall_score": 7.5,
  "vulnerability_index": 0.35,
  "risk_level": "medium",
  "priority": "P3",
  "tests": {
    "prompt_injection": {
      "score": 8.2,
      "vulnerabilities": []
    },
    "extraction_probe": {
      "score": 6.8,
      "vulnerabilities": [...]
    }
  },
  "vulnerabilities": [...],
  "recommendations": [...]
}
```

### Fichier CSV

| Colonne | Description |
|---------|-------------|
| model_name | Nom du modèle testé |
| timestamp | Date et heure du scan |
| vulnerability_index | Indice de vulnérabilité (0-1) |
| criticality | Niveau de criticité |
| priority | Priorité (P1-P5) |
| total_vulnerabilities | Nombre total de vulnérabilités |
| critical_vulnerabilities | Nombre de vulnérabilités critiques |

---

## Commandes utiles

### Vérifier la configuration

```bash
python -c "
import yaml
with open('config.yaml', 'r') as f:
    config = yaml.safe_load(f)
    print(f'Tests activés: {sum(1 for t in config[\"tests\"].values() if t.get(\"enabled\"))}')
"
```

### Vérifier l'intégrité des logs

```python
from logger.immutable_logger import SecurityAuditLogger

audit_logger = SecurityAuditLogger()
verification = audit_logger.verify_integrity()
print(f"Logs valides: {verification['valid']}")
```

### Lister les utilisateurs RBAC

```python
from security.rbac import RBACManager

rbac = RBACManager("security/rbac_config.json")
users = rbac.list_users()
for user in users:
    print(f"{user['username']}: {user['role']}")
```

---

## Dépannage rapide

### Problème : LM Studio non accessible

```bash
# Vérifier que le serveur est démarré
curl http://localhost:11434/api/tags

# Si erreur, vérifier le port dans config.yaml
```

### Problème : Timeout des tests

```yaml
# Dans config.yaml, augmenter le timeout
llm:
  timeout: 60  # Au lieu de 30
```

### Problème : Erreurs d'import

```bash
# Réinstaller les dépendances
pip install --force-reinstall -r requirements.txt
```

### Problème : Permissions des fichiers

```bash
# Windows PowerShell
icacls logs /grant Everyone:F /T
icacls results /grant Everyone:F /T

# Linux/Mac
chmod -R 755 logs/ results/
```

---

## Prochaines étapes

1. **Tester avec vos modèles**
   - Configurer votre endpoint LLM
   - Exécuter des scans sur vos modèles

2. **Configurer l'alerting**
   - Activer JIRA/Teams/Slack
   - Définir les seuils d'alerte

3. **Déployer en production**
   - Utiliser les runners Docker
   - Configurer le pipeline CI/CD

4. **Explorer la documentation**
   - [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md) - Guide complet
   - [PHASE1_COMPLETION_SUMMARY.md](PHASE1_COMPLETION_SUMMARY.md) - Résumé Phase 1
   - [README.md](README.md) - Documentation générale

---

## Support

- **Documentation** : Voir les fichiers MD du projet
- **Issues** : GitHub Issues pour les bugs
- **Questions** : Discussions GitHub

---

## Ressources

- [LM Studio](https://lmstudio.ai/) - Endpoint LLM local
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) - Gestion des secrets
- [HashiCorp Vault](https://www.vaultproject.io/) - Alternative pour secrets
- [JIRA](https://www.atlassian.com/software/jira) - Ticketing
- [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/) - Alertes
- [Slack](https://slack.com/) - Alertes

---

**🎉 Vous êtes prêt à scanner vos modèles LLM !**

Pour une documentation complète, consultez [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)
