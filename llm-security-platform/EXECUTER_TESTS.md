# ⚡ Comment Exécuter les Tests

## 🎯 Méthode Recommandée

### Option 1 : Test rapide (RECOMMANDÉ)

```powershell
cd llm-security-platform
python quick_test.py
```

**Pourquoi cette méthode ?**
- ✅ Plus simple
- ✅ Plus rapide
- ✅ Affichage clair et formaté
- ✅ Pas besoin de pytest

---

### Option 2 : Avec pytest (pour développeurs)

```powershell
cd llm-security-platform
pytest -v
```

**Note :** Cette méthode peut avoir des problèmes car `quick_test.py` n'est pas conçu comme un test pytest traditionnel.

---

## 🔧 Problèmes Résolus

### Erreur 1 : `NameError: name 'csv_file' is not defined`
✅ **Corrigé** - Les variables sont maintenant initialisées correctement

### Erreur 2 : Import de `scoring`
✅ **Corrigé** - Utilisation d'import relatif dans `analyzer/analyzer.py`

---

## ✅ Tests Disponibles

### 1. Test Rapide Complet
```powershell
python quick_test.py
```

**Tests effectués :**
- ✅ Vérification des imports
- ✅ Configuration
- ✅ Orchestrateur
- ✅ Scan de sécurité
- ✅ Analyse des résultats
- ✅ Scoring
- ✅ Logger immuable
- ✅ RBAC
- ✅ Secrets Manager
- ✅ Sauvegarde des résultats

---

### 2. Test de Validation
```powershell
python test_platform.py
```

**Tests effectués :**
- ✅ Structure des fichiers
- ✅ Imports Python
- ✅ Configuration
- ✅ Orchestrateur
- ✅ Analyzer

---

## 📊 Résultat Attendu

Après avoir exécuté `python quick_test.py`, vous devriez voir :

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
  ✅ Tests chargés: 7

✓ Test 4: Exécution d'un scan de sécurité...
  ✅ Scan complété
  ✅ Score global: X.XX/10

...

🎉 La plateforme LLM Security Phase 1 est opérationnelle !
```

---

## 🛠️ En Cas de Problème

### Problème : Module non trouvé

**Solution :**
```powershell
# Assurez-vous d'être dans le bon répertoire
cd llm-security-platform

# Vérifiez que l'environnement virtuel est activé
.\.venv\Scripts\Activate.ps1

# Réinstallez les dépendances si nécessaire
pip install -r requirements.txt
```

---

### Problème : Erreur de configuration

**Solution :**
```powershell
# Vérifiez que demo_config.yaml existe
ls demo_config.yaml

# Si absent, copiez depuis config.yaml
cp config.yaml demo_config.yaml
```

---

### Problème : Timeout ou scan trop long

**Solution :**
Le scan peut prendre 2-3 minutes car il teste réellement les composants. C'est normal !

---

## 📚 Documentation

Pour plus d'informations sur les tests :
- **[COMMENT_COMMENCER.md](COMMENT_COMMENCER.md)** - Guide de démarrage
- **[COMMENT_TESTER.md](COMMENT_TESTER.md)** - Guide de test complet
- **[TEST_WINDOWS.md](TEST_WINDOWS.md)** - Guide Windows spécifique

---

## 🎯 Commandes Essentielles

```powershell
# Test rapide (RECOMMANDÉ)
python quick_test.py

# Test de validation
python test_platform.py

# Scan avec mock LLM
cd orchestrator
python orchestrator.py "Test prompt" --demo

# Voir les résultats
ls test_results\
```

---

**✅ Les erreurs sont maintenant corrigées. Vous pouvez exécuter les tests !**

**Commande recommandée :**
```powershell
python quick_test.py
```
