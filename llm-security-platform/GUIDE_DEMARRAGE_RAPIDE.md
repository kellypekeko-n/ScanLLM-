# 🚀 Guide de Démarrage Rapide - Tests

## Bienvenue !

Ce guide vous aide à démarrer rapidement avec les tests de la plateforme LLM Security.

---

## ⚡ En 3 Étapes

### Étape 1 : Exécuter le test rapide (2 minutes)

```bash
python quick_test.py
```

### Étape 2 : Vérifier le résultat

✅ **Succès ?** → Vous êtes prêt ! Passez à l'étape 3.  
❌ **Échec ?** → Consultez la section [Dépannage](#dépannage-rapide) ci-dessous.

### Étape 3 : Choisir votre parcours

Utilisez l'arbre de décision ci-dessous pour choisir le guide approprié.

---

## 🌳 Arbre de Décision

```
┌─────────────────────────────────────┐
│   Quel est votre objectif ?         │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
   Tester          Déployer
   rapidement      en production
       │               │
       │               └──────────────────────────┐
       │                                          │
       ├─── Système d'exploitation ?             │
       │                                          │
   ┌───┴────┐                                     │
   │        │                                     │
Windows   Linux/Mac                               │
   │        │                                     │
   │        │                                     │
   ▼        ▼                                     ▼
TEST_     COMMENT_                        PHASE1_
WINDOWS   TESTER.md                       DEPLOYMENT_
.md                                       GUIDE.md
           │
           │
           ├─── Niveau d'expérience ?
           │
       ┌───┴────┐
       │        │
   Débutant  Avancé
       │        │
       │        │
       ▼        ▼
   COMMENT_  GUIDE_
   TESTER    TEST.md
   .md
```

---

## 📋 Guide Rapide par Profil

### 👤 Profil 1 : Débutant sur Windows

**Votre situation :**
- Première utilisation de la plateforme
- Vous utilisez Windows
- Vous voulez tester rapidement

**Votre parcours :**
1. ✅ Exécuter `python quick_test.py`
2. 📖 Lire **[TEST_WINDOWS.md](TEST_WINDOWS.md)**
3. 🧪 Suivre les exemples PowerShell
4. ✅ Vérifier les résultats

**Temps estimé :** 15-30 minutes

---

### 👤 Profil 2 : Débutant sur Linux/Mac

**Votre situation :**
- Première utilisation de la plateforme
- Vous utilisez Linux ou Mac
- Vous voulez tester rapidement

**Votre parcours :**
1. ✅ Exécuter `python quick_test.py`
2. 📖 Lire **[COMMENT_TESTER.md](COMMENT_TESTER.md)**
3. 🧪 Suivre les exemples Bash
4. ✅ Vérifier les résultats

**Temps estimé :** 15-30 minutes

---

### 👤 Profil 3 : Utilisateur Intermédiaire

**Votre situation :**
- Vous connaissez déjà la plateforme
- Vous voulez tester en profondeur
- Vous voulez comprendre tous les composants

**Votre parcours :**
1. ✅ Exécuter `python test_platform.py`
2. 📖 Lire **[GUIDE_TEST.md](GUIDE_TEST.md)**
3. 🧪 Tester chaque composant individuellement
4. 🐳 Tester avec Docker
5. 🔒 Exécuter les tests de sécurité

**Temps estimé :** 2-4 heures

---

### 👤 Profil 4 : Administrateur Système

**Votre situation :**
- Vous devez déployer en production
- Vous avez besoin de la configuration complète
- Vous voulez configurer le CI/CD et l'alerting

**Votre parcours :**
1. ✅ Exécuter tous les tests de validation
2. 📖 Lire **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)**
3. 🔧 Configurer l'environnement de production
4. 🐳 Déployer avec Docker Compose
5. 🔄 Configurer le CI/CD Azure DevOps
6. 🔔 Mettre en place l'alerting

**Temps estimé :** 1 journée

---

## 🎯 Commandes Essentielles

### Test rapide (5 min)
```bash
python quick_test.py
```

### Test complet (15 min)
```bash
python test_platform.py
```

### Scan avec mock (5 min)
```bash
cd orchestrator
python orchestrator.py "Test prompt" --demo
```

### Scan avec LLM réel (10 min)
```bash
# 1. Démarrer LM Studio
# 2. Exécuter le scan
cd orchestrator
python orchestrator.py "You are a helpful assistant"
```

### Analyse des résultats (2 min)
```bash
cd analyzer
python analyzer.py ../orchestrator/results/*.json
```

---

## 🔍 Dépannage Rapide

### ❌ Erreur : Module non trouvé

**Symptôme :**
```
ModuleNotFoundError: No module named 'orchestrator'
```

**Solution :**
```bash
# Ajouter au PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)/orchestrator:$(pwd)/analyzer"

# Ou sur Windows PowerShell
$env:PYTHONPATH = "$PWD\orchestrator;$PWD\analyzer;$env:PYTHONPATH"
```

---

### ❌ Erreur : LM Studio non accessible

**Symptôme :**
```
Connection refused to http://localhost:11434
```

**Solution :**
1. Vérifier que LM Studio est démarré
2. Vérifier que le serveur écoute sur le port 11434
3. Tester la connexion : `curl http://localhost:11434/api/tags`

---

### ❌ Erreur : Timeout

**Symptôme :**
```
Timeout after 30 seconds
```

**Solution :**
Augmenter le timeout dans `config.yaml` :
```yaml
llm:
  timeout: 60  # Augmenter à 60 secondes
```

---

### ❌ Erreur : Permissions

**Symptôme :**
```
PermissionError: Access denied
```

**Solution :**
```bash
# Créer les répertoires nécessaires
mkdir -p logs results runner_results
chmod -R 755 logs results runner_results
```

---

## 📚 Documentation Complète

### Guides de test

| Guide | Quand l'utiliser | Durée |
|-------|------------------|-------|
| **[INDEX_TESTS.md](INDEX_TESTS.md)** | Vue d'ensemble de tous les guides | 5 min |
| **[COMMENT_TESTER.md](COMMENT_TESTER.md)** | Test rapide et simple | 5-30 min |
| **[TEST_WINDOWS.md](TEST_WINDOWS.md)** | Utilisation sous Windows | 10-30 min |
| **[GUIDE_TEST.md](GUIDE_TEST.md)** | Guide complet et détaillé | 1-2 heures |
| **[PHASE1_DEPLOYMENT_GUIDE.md](PHASE1_DEPLOYMENT_GUIDE.md)** | Déploiement en production | 2-4 heures |

### Documentation principale

| Document | Description |
|----------|-------------|
| **[README.md](README.md)** | Vue d'ensemble du projet |
| **[PLATFORM_SUMMARY.md](PLATFORM_SUMMARY.md)** | Résumé de la plateforme |
| **[PHASE1_COMPLETION_SUMMARY.md](PHASE1_COMPLETION_SUMMARY.md)** | Résumé Phase 1 |
| **[RESUME_DOCUMENTATION_TESTS.md](RESUME_DOCUMENTATION_TESTS.md)** | Résumé de la doc de test |

---

## ✅ Checklist de Démarrage

### Avant de commencer
- [ ] Python 3.11+ installé
- [ ] Dépendances installées (`pip install -r requirements.txt`)
- [ ] Environnement virtuel activé (recommandé)

### Premier test
- [ ] `python quick_test.py` exécuté
- [ ] Tous les tests sont passés
- [ ] Résultats vérifiés dans `test_results/`

### Choix du parcours
- [ ] Profil identifié (débutant/intermédiaire/avancé)
- [ ] Guide approprié sélectionné
- [ ] Documentation lue

### Tests avancés (optionnel)
- [ ] LM Studio installé et configuré
- [ ] Scan avec LLM réel réussi
- [ ] Docker testé (si nécessaire)

---

## 🎓 Parcours Recommandés

### Parcours Express (30 minutes)

**Objectif :** Valider rapidement l'installation

```bash
# 1. Test rapide
python quick_test.py

# 2. Test de validation
python test_platform.py

# 3. Scan avec mock
cd orchestrator && python orchestrator.py "Test" --demo

# 4. Vérifier les résultats
ls -lh results/
```

---

### Parcours Standard (2 heures)

**Objectif :** Maîtriser les tests de base

```bash
# 1. Tests de validation
python quick_test.py
python test_platform.py

# 2. Lire la documentation
# Lire COMMENT_TESTER.md ou TEST_WINDOWS.md

# 3. Tests manuels
cd orchestrator
python orchestrator.py "Test prompt" --demo

# 4. Analyse
cd ../analyzer
python analyzer.py ../orchestrator/results/*.json

# 5. Vérifier les logs
tail -50 ../logs/orchestrator.log
```

---

### Parcours Complet (4 heures)

**Objectif :** Maîtriser tous les aspects

```bash
# 1. Validation complète
python quick_test.py
python test_platform.py

# 2. Lire la documentation
# Lire GUIDE_TEST.md complet

# 3. Tests avec LLM réel
# Démarrer LM Studio
cd orchestrator
python orchestrator.py "You are a helpful assistant"

# 4. Tests Docker
cd ../runners
docker build -t llm-security-runner:latest -f Dockerfile ..
docker-compose up -d

# 5. Tests de sécurité
safety check -r ../orchestrator/requirements.txt
bandit -r ../orchestrator/ ../analyzer/

# 6. Vérification d'intégrité
python -c "from logger.immutable_logger import SecurityAuditLogger; print(SecurityAuditLogger().verify_integrity())"
```

---

## 🎯 Objectifs par Niveau

### Niveau 1 : Débutant
**Objectif :** Valider que la plateforme fonctionne

**Critères de réussite :**
- ✅ `python quick_test.py` réussi
- ✅ Fichiers de résultats générés
- ✅ Logs créés

**Temps :** 30 minutes

---

### Niveau 2 : Intermédiaire
**Objectif :** Comprendre et tester tous les composants

**Critères de réussite :**
- ✅ Tous les tests unitaires réussis
- ✅ Scan avec mock réussi
- ✅ Analyse des résultats OK
- ✅ Compréhension du VulnerabilityIndex

**Temps :** 2 heures

---

### Niveau 3 : Avancé
**Objectif :** Maîtriser la plateforme et tester en conditions réelles

**Critères de réussite :**
- ✅ Scan avec LLM réel réussi
- ✅ Tests Docker réussis
- ✅ Tests de sécurité effectués
- ✅ Intégrité des logs vérifiée

**Temps :** 4 heures

---

### Niveau 4 : Expert
**Objectif :** Déployer en production

**Critères de réussite :**
- ✅ Environnement de production configuré
- ✅ Runners Docker déployés
- ✅ CI/CD configuré
- ✅ Alerting opérationnel
- ✅ Tests en conditions réelles réussis

**Temps :** 1 journée

---

## 💡 Conseils

### Pour réussir rapidement

1. **Commencez simple** - Utilisez `quick_test.py` d'abord
2. **Lisez la doc appropriée** - Choisissez le guide selon votre niveau
3. **Testez progressivement** - Ne sautez pas d'étapes
4. **Vérifiez les résultats** - Consultez les logs et fichiers générés
5. **Consultez le dépannage** - Si problème, cherchez la solution dans les guides

### Pour éviter les erreurs

1. **Environnement virtuel** - Utilisez toujours un venv
2. **Dépendances à jour** - Installez toutes les dépendances
3. **Configuration correcte** - Vérifiez config.yaml
4. **Permissions** - Assurez-vous d'avoir les droits nécessaires
5. **Logs** - Consultez les logs en cas d'erreur

### Pour aller plus loin

1. **Testez avec LLM réel** - Installez LM Studio
2. **Utilisez Docker** - Testez l'isolation
3. **Configurez l'alerting** - Intégrez JIRA/Teams
4. **Automatisez** - Mettez en place le CI/CD
5. **Contribuez** - Partagez vos retours et améliorations

---

## 📞 Besoin d'Aide ?

### Documentation
- **[INDEX_TESTS.md](INDEX_TESTS.md)** - Index de tous les guides
- **[RESUME_DOCUMENTATION_TESTS.md](RESUME_DOCUMENTATION_TESTS.md)** - Résumé complet

### Support
- GitHub Issues - Pour les bugs
- GitHub Discussions - Pour les questions
- Email - support@llm-security-platform.com

### Ressources
- [LM Studio](https://lmstudio.ai/) - Pour tester avec un LLM réel
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Pour les tests Docker

---

## 🎉 Prêt à Commencer !

Vous avez maintenant toutes les informations pour démarrer rapidement.

### Votre prochaine action

```bash
# Exécutez cette commande maintenant :
python quick_test.py
```

**Résultat attendu :**
```
✅ Tous les modules importés avec succès
✅ Orchestrateur initialisé - 6 tests chargés
✅ Scan complété - Score global: 7.85/10
✅ Analyse complétée - VulnerabilityIndex: 0.7850
🎉 La plateforme LLM Security Phase 1 est opérationnelle !
```

---

**🚀 Bonne chance avec vos tests !**

**Dernière mise à jour :** 19 octobre 2025  
**Version :** 1.0.0 (Phase 1)
