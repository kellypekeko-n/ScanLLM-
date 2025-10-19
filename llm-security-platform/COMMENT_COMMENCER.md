# 🚀 Comment Commencer - Guide Ultra-Rapide

## Vous voulez tester la plateforme ? Suivez ces 3 étapes !

---

## ⚡ Étape 1 : Test Rapide (2 minutes)

### Exécutez cette commande :

```bash
python quick_test.py
```

### Résultat attendu :

```
✅ Tous les modules importés avec succès
✅ Orchestrateur initialisé - 6 tests chargés
✅ Scan complété - Score global: 7.85/10
✅ Analyse complétée - VulnerabilityIndex: 0.7850
🎉 La plateforme LLM Security Phase 1 est opérationnelle !
```

---

## 📖 Étape 2 : Choisir Votre Guide (1 minute)

### Quel est votre profil ?

#### 👤 Je suis débutant sur Windows
👉 Lisez **[TEST_WINDOWS.md](TEST_WINDOWS.md)**

#### 👤 Je suis débutant sur Linux/Mac
👉 Lisez **[COMMENT_TESTER.md](COMMENT_TESTER.md)**

#### 👤 Je veux tout comprendre
👉 Lisez **[GUIDE_TEST.md](GUIDE_TEST.md)**

#### 👤 Je veux une vue d'ensemble
👉 Lisez **[INDEX_TESTS.md](INDEX_TESTS.md)**

#### 👤 Je veux juste les commandes
👉 Lisez **[COMMANDES_RAPIDES.md](COMMANDES_RAPIDES.md)**

---

## 🎯 Étape 3 : Tester Plus en Profondeur

### Option A : Test avec mock LLM (5 minutes)

```bash
cd orchestrator
python orchestrator.py "You are a helpful assistant" --demo
```

### Option B : Test avec LLM réel (15 minutes)

```bash
# 1. Démarrer LM Studio sur http://localhost:11434
# 2. Charger un modèle (ex: llama2)
# 3. Exécuter le scan
cd orchestrator
python orchestrator.py "You are a helpful assistant"
```

### Analyser les résultats

```bash
cd analyzer
python analyzer.py ../orchestrator/results/*.json
```

---

## 🌳 Arbre de Décision Rapide

```
Vous voulez...
│
├─ Tester rapidement (5 min)
│  └─ python quick_test.py
│
├─ Comprendre comment tester
│  ├─ Windows → TEST_WINDOWS.md
│  └─ Linux/Mac → COMMENT_TESTER.md
│
├─ Tout comprendre en détail
│  └─ GUIDE_TEST.md
│
├─ Avoir une vue d'ensemble
│  └─ INDEX_TESTS.md
│
└─ Juste les commandes
   └─ COMMANDES_RAPIDES.md
```

---

## 📚 Documentation Disponible

| Guide | Quand l'utiliser | Temps |
|-------|------------------|-------|
| **[GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)** | Point d'entrée complet | 10 min |
| **[COMMENT_TESTER.md](COMMENT_TESTER.md)** | Guide rapide | 15-30 min |
| **[TEST_WINDOWS.md](TEST_WINDOWS.md)** | Utilisateurs Windows | 15-30 min |
| **[GUIDE_TEST.md](GUIDE_TEST.md)** | Guide exhaustif | 1-2 heures |
| **[INDEX_TESTS.md](INDEX_TESTS.md)** | Vue d'ensemble | 10 min |
| **[COMMANDES_RAPIDES.md](COMMANDES_RAPIDES.md)** | Référence rapide | 5 min |

---

## ❓ Questions Fréquentes

### Q : Je n'ai pas de LLM installé, puis-je tester ?
**R :** Oui ! Utilisez le mode démo : `python quick_test.py`

### Q : Quel guide lire en premier ?
**R :** **[GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)**

### Q : Combien de temps pour tester ?
**R :** 5 minutes pour le test rapide, 30 minutes pour un test complet

### Q : J'ai une erreur, où trouver de l'aide ?
**R :** Section "Dépannage" dans **[GUIDE_TEST.md](GUIDE_TEST.md)** ou **[TEST_WINDOWS.md](TEST_WINDOWS.md)**

### Q : Comment tester avec un vrai LLM ?
**R :** Installez LM Studio et suivez **[GUIDE_TEST.md](GUIDE_TEST.md)** - Section "Tests avec LLM réel"

---

## 🎯 Commandes Essentielles

```bash
# Test rapide
python quick_test.py

# Test complet
python test_platform.py

# Scan avec mock
cd orchestrator && python orchestrator.py "Test" --demo

# Scan avec LLM réel
cd orchestrator && python orchestrator.py "Test"

# Analyse
cd analyzer && python analyzer.py ../orchestrator/results/*.json

# Voir les résultats
ls -lh orchestrator/results/

# Voir les logs
tail -50 logs/orchestrator.log
```

---

## 💡 Conseil

**Commencez toujours par :**
```bash
python quick_test.py
```

**Puis consultez :**
**[GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)**

---

## 🆘 Besoin d'Aide ?

### Documentation
- **[GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)** - Guide complet de démarrage
- **[INDEX_TESTS.md](INDEX_TESTS.md)** - Index de tous les guides

### Support
- GitHub Issues - Pour les bugs
- GitHub Discussions - Pour les questions
- Email - support@llm-security-platform.com

---

## ✅ Checklist de Démarrage

- [ ] J'ai exécuté `python quick_test.py`
- [ ] Tous les tests sont passés
- [ ] J'ai choisi mon guide selon mon profil
- [ ] J'ai lu le guide approprié
- [ ] J'ai testé avec les exemples

---

**🚀 Vous êtes prêt ! Commencez maintenant avec :**

```bash
python quick_test.py
```

**Puis lisez : [GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)**

---

**Dernière mise à jour :** 19 octobre 2025  
**Version :** 1.0.0 (Phase 1)
