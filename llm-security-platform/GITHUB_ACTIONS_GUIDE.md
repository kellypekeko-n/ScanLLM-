# 🚀 Guide GitHub Actions - LLM Security Platform

## 📋 Workflows Créés

### 1. **build.yml** - Build et Tests
- **Déclenchement :** Push sur main/develop, PR, manuel
- **Actions :** Installation des dépendances, tests rapides
- **Durée :** ~2-3 minutes

### 2. **security-scan.yml** - Scan de Sécurité
- **Déclenchement :** Push, PR, quotidien (minuit), manuel
- **Actions :** Scan complet, analyse, vérifications de sécurité
- **Durée :** ~5-10 minutes

### 3. **docker-build.yml** - Build Docker
- **Déclenchement :** Push, tags, PR, manuel
- **Actions :** Build et push de l'image Docker
- **Durée :** ~3-5 minutes

---

## 🔧 Résolution du Problème "requirements.txt not found"

### Problème
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

### Cause
Le workflow cherchait `requirements.txt` dans le mauvais répertoire ou le fichier n'existait pas.

### Solution Appliquée

**1. Vérification des fichiers requirements.txt**
```
✅ requirements.txt (racine)
✅ orchestrator/requirements.txt
✅ analyzer/requirements.txt
✅ runners/requirements.txt
```

**2. Workflow corrigé avec vérifications**
```yaml
- name: Install global dependencies
  run: |
    python -m pip install --upgrade pip
    if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

- name: Install orchestrator dependencies
  run: |
    if [ -f orchestrator/requirements.txt ]; then 
      pip install -r orchestrator/requirements.txt
    fi
```

---

## 🎯 Configuration GitHub Actions

### Étape 1 : Vérifier les fichiers

```powershell
# Vérifier que tous les fichiers requirements.txt existent
Test-Path requirements.txt
Test-Path orchestrator\requirements.txt
Test-Path analyzer\requirements.txt
Test-Path runners\requirements.txt
```

**Résultat attendu :** Tous doivent retourner `True`

---

### Étape 2 : Configurer les Secrets GitHub

1. Allez sur votre repo GitHub
2. Settings → Secrets and variables → Actions
3. Ajoutez ces secrets (optionnels) :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `LLM_ENDPOINT` | Endpoint LLM | `http://localhost:11434` |
| `LLM_MODEL` | Modèle LLM | `llama2` |
| `JIRA_URL` | URL JIRA | `https://your-jira.atlassian.net` |
| `JIRA_USERNAME` | Email JIRA | `your-email@example.com` |
| `JIRA_API_TOKEN` | Token API JIRA | `your-api-token` |

---

### Étape 3 : Pousser les workflows

```powershell
# Ajouter les fichiers
git add .github/workflows/

# Commit
git commit -m "Add GitHub Actions workflows"

# Push
git push origin main
```

---

### Étape 4 : Vérifier l'exécution

1. Allez sur GitHub → Actions
2. Vous devriez voir 3 workflows :
   - ✅ Build and Test
   - ✅ LLM Security Scan
   - ✅ Docker Build

---

## 📊 Workflows Détaillés

### Build and Test (build.yml)

**Matrice de tests :**
- Python 3.11
- Python 3.12

**Étapes :**
1. Checkout du code
2. Installation de Python
3. Installation des dépendances
4. Vérification de l'installation
5. Exécution de `quick_test.py`
6. Upload des résultats

**Durée estimée :** 2-3 minutes

---

### LLM Security Scan (security-scan.yml)

**Étapes :**
1. Checkout du code
2. Installation de Python 3.11
3. Cache des dépendances pip
4. Installation des dépendances
5. Exécution de `quick_test.py`
6. Exécution de `test_platform.py`
7. Scan de sécurité (mode démo)
8. Analyse des résultats
9. Vérifications de sécurité (safety, bandit)
10. Upload des résultats
11. Création d'issue en cas d'échec

**Durée estimée :** 5-10 minutes

**Déclencheurs :**
- Push sur main/develop
- Pull Request
- Quotidien à minuit (UTC)
- Manuel

---

### Docker Build (docker-build.yml)

**Étapes :**
1. Checkout du code
2. Configuration de Docker Buildx
3. Connexion au registry GitHub
4. Extraction des métadonnées
5. Build et push de l'image
6. Test de l'image (sur PR)

**Durée estimée :** 3-5 minutes

**Images créées :**
- `ghcr.io/[username]/llm-security-runner:main`
- `ghcr.io/[username]/llm-security-runner:develop`
- `ghcr.io/[username]/llm-security-runner:v1.0.0` (sur tags)
- `ghcr.io/[username]/llm-security-runner:sha-[commit]`

---

## 🐛 Dépannage

### Erreur : "requirements.txt not found"

**Solution :**
```powershell
# Vérifier que le fichier existe
ls requirements.txt

# Si absent, le créer
Copy-Item requirements.txt.example requirements.txt
```

---

### Erreur : "Permission denied"

**Solution :**
Vérifier que le token GitHub a les permissions nécessaires :
- Settings → Actions → General
- Workflow permissions → Read and write permissions

---

### Erreur : "Module not found"

**Solution :**
Vérifier que toutes les dépendances sont dans les fichiers requirements.txt :
```powershell
# Vérifier le contenu
Get-Content requirements.txt
Get-Content orchestrator\requirements.txt
Get-Content analyzer\requirements.txt
```

---

### Workflow ne se déclenche pas

**Solution :**
1. Vérifier que les workflows sont dans `.github/workflows/`
2. Vérifier la syntaxe YAML
3. Vérifier les branches configurées dans `on:`

---

### Tests échouent en CI mais pas en local

**Solution :**
1. Vérifier les variables d'environnement
2. Vérifier les chemins (Linux vs Windows)
3. Ajouter `continue-on-error: true` pour les tests non critiques

---

## 🎯 Utilisation des Workflows

### Déclencher manuellement un workflow

1. GitHub → Actions
2. Sélectionner le workflow
3. Run workflow → Choisir la branche → Run workflow

---

### Voir les résultats

1. GitHub → Actions
2. Cliquer sur un run
3. Voir les logs de chaque étape
4. Télécharger les artifacts (résultats, logs)

---

### Télécharger les artifacts

Les artifacts sont conservés 30 jours (scan results) ou 7 jours (logs).

**Contenu des artifacts :**
- `security-scan-results/` - Résultats des scans
- `logs/` - Logs de la plateforme
- `test-results-*/` - Résultats des tests par version Python

---

## 📈 Badges GitHub

Ajoutez ces badges à votre README.md :

```markdown
![Build](https://github.com/[username]/[repo]/actions/workflows/build.yml/badge.svg)
![Security Scan](https://github.com/[username]/[repo]/actions/workflows/security-scan.yml/badge.svg)
![Docker](https://github.com/[username]/[repo]/actions/workflows/docker-build.yml/badge.svg)
```

---

## 🔒 Sécurité

### Secrets à ne JAMAIS commiter

- ❌ Tokens API (JIRA, GitHub, etc.)
- ❌ Mots de passe
- ❌ Clés privées
- ❌ Endpoints privés

### Utiliser GitHub Secrets

```yaml
env:
  JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
  LLM_ENDPOINT: ${{ secrets.LLM_ENDPOINT }}
```

---

## 📊 Monitoring

### Voir l'historique des runs

```
GitHub → Actions → Workflow → Runs
```

### Statistiques

- Taux de réussite
- Durée moyenne
- Tendances

---

## 🎯 Bonnes Pratiques

### 1. Cache des dépendances
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

### 2. Matrice de tests
```yaml
strategy:
  matrix:
    python-version: ['3.11', '3.12']
```

### 3. Continue on error pour tests non critiques
```yaml
- name: Run optional test
  run: python test.py
  continue-on-error: true
```

### 4. Upload des artifacts
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: results
    path: results/
```

---

## 📚 Ressources

### Documentation GitHub Actions
- [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)

### Actions utilisées
- [actions/checkout@v4](https://github.com/actions/checkout)
- [actions/setup-python@v5](https://github.com/actions/setup-python)
- [actions/cache@v3](https://github.com/actions/cache)
- [actions/upload-artifact@v4](https://github.com/actions/upload-artifact)
- [docker/build-push-action@v5](https://github.com/docker/build-push-action)

---

## ✅ Checklist de Configuration

### Avant de pousser
- [ ] Tous les fichiers requirements.txt existent
- [ ] Les workflows sont dans `.github/workflows/`
- [ ] La syntaxe YAML est valide
- [ ] Les secrets sont configurés (si nécessaire)
- [ ] Les permissions sont correctes

### Après le premier push
- [ ] Les workflows se déclenchent
- [ ] Les tests passent
- [ ] Les artifacts sont uploadés
- [ ] Les badges fonctionnent

---

## 🎉 Résumé

**Workflows créés :**
- ✅ `build.yml` - Build et tests
- ✅ `security-scan.yml` - Scan de sécurité complet
- ✅ `docker-build.yml` - Build Docker

**Problème résolu :**
- ✅ Erreur "requirements.txt not found"

**Prochaines étapes :**
1. Pousser les workflows sur GitHub
2. Vérifier l'exécution
3. Configurer les secrets (optionnel)
4. Ajouter les badges au README

---

**Commandes pour pousser :**
```powershell
git add .github/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

**Dernière mise à jour :** 19 octobre 2025  
**Version :** 1.0.0 (Phase 1)
