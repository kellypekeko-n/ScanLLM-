# 📚 Index des Guides de Test

## Vue d'ensemble des ressources de test disponibles

---

## 🎯 Quel guide utiliser ?

### Vous voulez tester rapidement (5 minutes)
👉 **[COMMENT_TESTER.md](COMMENT_TESTER.md)** - Guide rapide et concis

**Commande :**
```bash
python quick_test.py
```

---

### Vous utilisez Windows
👉 **[TEST_WINDOWS.md](TEST_WINDOWS.md)** - Guide spécifique Windows avec PowerShell

**Commande PowerShell :**
```powershell
python quick_test.py
```

---

### Vous voulez un guide complet et détaillé
👉 **[GUIDE_TEST.md](GUIDE_TEST.md)** - Guide exhaustif avec tous les types de tests

**Contenu :**
- Tests unitaires
- Tests d'intégration
- Tests avec LLM réel
- Tests Docker
- Tests de sécurité
- Tests de performance
- Dépannage complet

---

### Vous voulez déployer en production
👉 **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)** - Guide de déploiement complet

**Contenu :**
- Installation complète
- Configuration avancée
- Déploiement Docker
- Pipeline CI/CD
- Sécurité et conformité
- Monitoring

---

## 📋 Guides Disponibles

| Guide | Description | Durée | Niveau |
|-------|-------------|-------|--------|
| **[COMMENT_TESTER.md](COMMENT_TESTER.md)** | Guide rapide de test | 5-30 min | Débutant |
| **[TEST_WINDOWS.md](TEST_WINDOWS.md)** | Guide Windows/PowerShell | 10-30 min | Débutant |
| **[GUIDE_TEST.md](GUIDE_TEST.md)** | Guide complet et détaillé | 1-2 heures | Intermédiaire |
| **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)** | Guide de déploiement | 2-4 heures | Avancé |
| **[PHASE1_COMPLETION_SUMMARY.md](PHASE1_COMPLETION_SUMMARY.md)** | Résumé Phase 1 | 10 min | Tous |

---

## 🚀 Scripts de Test Disponibles

### Scripts Python

| Script | Description | Commande |
|--------|-------------|----------|
| **quick_test.py** | Test rapide automatique | `python quick_test.py` |
| **test_platform.py** | Test de validation complet | `python test_platform.py` |
| **orchestrator/orchestrator.py** | Exécution de scan | `python orchestrator.py "prompt"` |
| **analyzer/analyzer.py** | Analyse des résultats | `python analyzer.py results.json` |

### Scripts PowerShell (Windows)

Créez ces scripts dans le répertoire racine :

**test_all.ps1** - Test complet automatique
```powershell
# Voir TEST_WINDOWS.md pour le contenu
.\test_all.ps1
```

**cleanup.ps1** - Nettoyage des fichiers de test
```powershell
# Voir TEST_WINDOWS.md pour le contenu
.\cleanup.ps1
```

---

## 🎓 Parcours d'Apprentissage

### Niveau 1 : Débutant (30 minutes)

1. **Lire** [COMMENT_TESTER.md](COMMENT_TESTER.md)
2. **Exécuter** `python quick_test.py`
3. **Vérifier** les résultats dans `test_results/`

### Niveau 2 : Intermédiaire (2 heures)

1. **Lire** [GUIDE_TEST.md](GUIDE_TEST.md) - Section "Tests unitaires"
2. **Exécuter** `python test_platform.py`
3. **Tester** chaque composant individuellement
4. **Exécuter** un scan avec mock : `cd orchestrator && python orchestrator.py "Test" --demo`
5. **Analyser** les résultats : `cd analyzer && python analyzer.py ../orchestrator/results/*.json`

### Niveau 3 : Avancé (4 heures)

1. **Lire** [GUIDE_TEST.md](GUIDE_TEST.md) - Toutes les sections
2. **Installer** LM Studio
3. **Exécuter** un scan réel avec LLM
4. **Tester** avec Docker
5. **Exécuter** les tests de sécurité (safety, bandit)
6. **Vérifier** l'intégrité des logs
7. **Tester** la performance

### Niveau 4 : Production (1 journée)

1. **Lire** [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)
2. **Configurer** l'environnement de production
3. **Déployer** avec Docker Compose
4. **Configurer** le CI/CD Azure DevOps
5. **Mettre en place** l'alerting (JIRA/Teams/Slack)
6. **Configurer** les secrets (Azure Key Vault)
7. **Tester** en conditions réelles

---

## 📊 Matrice de Test

### Tests par Composant

| Composant | Test Unitaire | Test Intégration | Test Production |
|-----------|---------------|------------------|-----------------|
| **Orchestrateur** | ✅ `test_platform.py` | ✅ `quick_test.py` | ✅ Scan réel |
| **Analyzer** | ✅ `test_platform.py` | ✅ `quick_test.py` | ✅ Analyse réelle |
| **Logger** | ✅ Test intégrité | ✅ `quick_test.py` | ✅ Audit logs |
| **RBAC** | ✅ Test permissions | ✅ `quick_test.py` | ✅ Multi-users |
| **Secrets** | ✅ Test backend | ✅ `quick_test.py` | ✅ Key Vault |
| **Alerting** | ✅ Test config | ✅ Mock alerts | ✅ JIRA/Teams |
| **Runners** | ✅ Test isolation | ✅ Docker local | ✅ Multi-runners |

### Tests par Scénario

| Scénario | Guide | Durée | Commande |
|----------|-------|-------|----------|
| **Test rapide** | COMMENT_TESTER.md | 5 min | `python quick_test.py` |
| **Test dev** | COMMENT_TESTER.md | 15 min | `python test_platform.py` |
| **Test avec mock** | GUIDE_TEST.md | 30 min | `python orchestrator.py "Test" --demo` |
| **Test avec LLM** | GUIDE_TEST.md | 30 min | `python orchestrator.py "Test"` |
| **Test Docker** | GUIDE_TEST.md | 1 heure | `docker-compose up` |
| **Test sécurité** | GUIDE_TEST.md | 1 heure | `safety check && bandit -r .` |
| **Test production** | PHASE1_DEPLOYMENT_GUIDE.md | 4 heures | Voir guide |

---

## 🔍 Trouver une Information Spécifique

### Comment tester sans LLM réel ?
📖 [COMMENT_TESTER.md](COMMENT_TESTER.md#test-rapide-5-minutes) - Section "Test Rapide"

### Comment installer sur Windows ?
📖 [TEST_WINDOWS.md](TEST_WINDOWS.md#installation-et-vérification) - Section "Installation"

### Comment tester avec Docker ?
📖 [GUIDE_TEST.md](GUIDE_TEST.md#tests-avec-docker) - Section "Tests avec Docker"

### Comment vérifier l'intégrité des logs ?
📖 [GUIDE_TEST.md](GUIDE_TEST.md#tests-de-sécurité) - Section "Tests de sécurité"

### Comment configurer LM Studio ?
📖 [GUIDE_TEST.md](GUIDE_TEST.md#tests-avec-llm-réel) - Section "Tests avec LLM réel"

### Comment déployer en production ?
📖 [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md#installation-et-déploiement) - Section "Installation"

### Comment configurer l'alerting ?
📖 [PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md#configuration-avancée) - Section "Activation de l'alerting"

### Comment résoudre un problème ?
📖 [GUIDE_TEST.md](GUIDE_TEST.md#dépannage) - Section "Dépannage"
📖 [TEST_WINDOWS.md](TEST_WINDOWS.md#dépannage-windows) - Section "Dépannage Windows"

---

## ⚡ Commandes Rapides

### Tests de base

```bash
# Test rapide (5 min)
python quick_test.py

# Test complet (15 min)
python test_platform.py

# Scan avec mock (5 min)
cd orchestrator && python orchestrator.py "Test prompt" --demo

# Analyse (1 min)
cd analyzer && python analyzer.py ../orchestrator/results/*.json
```

### Tests avancés

```bash
# Scan avec LLM réel (5-10 min)
cd orchestrator && python orchestrator.py "You are a helpful assistant"

# Tests de sécurité (5 min)
safety check -r orchestrator/requirements.txt
bandit -r orchestrator/ analyzer/ security/

# Vérification d'intégrité (1 min)
python -c "from logger.immutable_logger import SecurityAuditLogger; print(SecurityAuditLogger().verify_integrity())"
```

### Tests Docker

```bash
# Build et démarrage (5 min)
cd runners
docker build -t llm-security-runner:latest -f Dockerfile ..
docker-compose up -d

# Vérification (1 min)
docker-compose ps
docker-compose logs -f runner-1

# Arrêt (1 min)
docker-compose down
```

---

## 📱 Support et Aide

### Documentation
- **README.md** - Vue d'ensemble du projet
- **PLATFORM_SUMMARY.md** - Résumé de la plateforme
- **PHASE1_COMPLETION_SUMMARY.md** - Résumé Phase 1

### Guides de test
- **COMMENT_TESTER.md** - Guide rapide
- **TEST_WINDOWS.md** - Guide Windows
- **GUIDE_TEST.md** - Guide complet

### Guides de déploiement
- **PHASE1_DEPLOYMENT_GUIDE.md** - Déploiement complet

### Aide en ligne
- GitHub Issues - Pour signaler des bugs
- GitHub Discussions - Pour poser des questions
- Email - support@llm-security-platform.com

---

## ✅ Checklist Globale

### Avant de commencer
- [ ] Python 3.11+ installé
- [ ] Dépendances installées
- [ ] Configuration vérifiée
- [ ] Documentation lue

### Tests de base
- [ ] `python quick_test.py` réussi
- [ ] `python test_platform.py` réussi
- [ ] Imports fonctionnels
- [ ] Configuration chargée

### Tests fonctionnels
- [ ] Scan avec mock réussi
- [ ] Analyse des résultats OK
- [ ] Fichiers générés
- [ ] Logs créés

### Tests avancés (optionnel)
- [ ] Scan avec LLM réel réussi
- [ ] Tests Docker réussis
- [ ] Tests de sécurité effectués
- [ ] Intégrité vérifiée

### Déploiement (optionnel)
- [ ] Configuration production
- [ ] Runners Docker déployés
- [ ] CI/CD configuré
- [ ] Alerting configuré

---

## 🎯 Recommandations

### Pour débuter
1. Commencez par **[COMMENT_TESTER.md](COMMENT_TESTER.md)**
2. Exécutez `python quick_test.py`
3. Si Windows, consultez **[TEST_WINDOWS.md](TEST_WINDOWS.md)**

### Pour approfondir
1. Lisez **[GUIDE_TEST.md](GUIDE_TEST.md)**
2. Testez chaque composant individuellement
3. Exécutez un scan complet avec LLM

### Pour déployer
1. Lisez **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)**
2. Suivez la checklist de déploiement
3. Configurez le monitoring et l'alerting

---

## 📈 Progression Suggérée

```
Jour 1 : Tests de base
├── Lire COMMENT_TESTER.md (15 min)
├── Exécuter quick_test.py (5 min)
├── Exécuter test_platform.py (10 min)
└── Scan avec mock (10 min)

Jour 2 : Tests avancés
├── Lire GUIDE_TEST.md (30 min)
├── Installer LM Studio (15 min)
├── Scan avec LLM réel (30 min)
└── Tests de sécurité (30 min)

Jour 3 : Docker et CI/CD
├── Tests Docker (1 heure)
├── Configuration CI/CD (1 heure)
└── Tests d'intégration (1 heure)

Jour 4 : Production
├── Lire PHASE1_DEPLOYMENT_GUIDE.md (1 heure)
├── Configuration production (2 heures)
└── Déploiement final (1 heure)
```

---

## 🎉 Conclusion

Vous avez maintenant accès à une documentation complète pour tester la plateforme LLM Security à tous les niveaux :

✅ **Tests rapides** - COMMENT_TESTER.md  
✅ **Tests Windows** - TEST_WINDOWS.md  
✅ **Tests complets** - GUIDE_TEST.md  
✅ **Déploiement** - PHASE1_DEPLOYMENT_GUIDE.md  

**Commencez par le guide qui correspond à votre niveau et à vos besoins !**

---

**Dernière mise à jour :** 19 octobre 2025  
**Version :** 1.0.0 (Phase 1)
