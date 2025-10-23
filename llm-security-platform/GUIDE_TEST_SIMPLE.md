# Guide de Test - LLM Security Platform
## Tests Etape par Etape pour Debutants

Date: 20 octobre 2025
Version: 1.0

---

## Prerequis

- Navigateur web (Chrome, Firefox, Edge)
- PowerShell (deja installe sur Windows)
- Azure CLI (deja installe)
- Connexion Internet

---

## Etape 1: Verifier que l'Application est en Ligne

### Test 1.1: Page d'Accueil

1. Ouvrez votre navigateur web
2. Copiez cette URL:
```
https://llm-security-plateform.azurewebsites.net
```
3. Collez l'URL dans la barre d'adresse
4. Appuyez sur Entree

**Resultat attendu:**
Vous devriez voir un texte JSON avec les informations de l'application.

**Si ca ne fonctionne pas:**
- Verifiez votre connexion Internet
- Verifiez que l'URL est correcte (sans espace)
- Attendez 1 minute et reessayez

---

### Test 1.2: Health Check

1. Dans votre navigateur, allez sur:
```
https://llm-security-plateform.azurewebsites.net/health
```

**Resultat attendu:**
```json
{
  "status": "healthy",
  "service": "llm-security-platform",
  "version": "1.0.0"
}
```

**Interpretation:**
- Si vous voyez "healthy", l'application fonctionne correctement
- Si vous voyez une erreur, l'application a un probleme

---

### Test 1.3: Status de la Plateforme

1. Dans votre navigateur, allez sur:
```
https://llm-security-plateform.azurewebsites.net/api/status
```

**Resultat attendu:**
Vous devriez voir:
- "status": "operational"
- "tests_available": 7
- Une liste de 7 noms de tests

**Interpretation:**
Cela confirme que les 7 tests de securite sont disponibles.

---

### Test 1.4: Liste des Tests

1. Dans votre navigateur, allez sur:
```
https://llm-security-plateform.azurewebsites.net/api/tests
```

**Resultat attendu:**
Une liste des 7 tests:
- structural_probe
- role_sensitivity
- rag_audit
- prompt_injection
- safety_bypass
- extraction_probe
- fingerprinting

---

## Etape 2: Tests via PowerShell

### Test 2.1: Health Check

1. Ouvrez PowerShell
   - Appuyez sur la touche Windows
   - Tapez "PowerShell"
   - Cliquez sur "Windows PowerShell"

2. Copiez et collez cette commande:
```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
```

3. Appuyez sur Entree

**Resultat attendu:**
```
StatusCode        : 200
StatusDescription : OK
```

**Interpretation:**
- StatusCode 200 = Succes
- StatusCode 500 = Erreur serveur
- StatusCode 404 = Page non trouvee

---

### Test 2.2: Status Detaille

```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/api/status
```

**Resultat attendu:**
Vous devriez voir "StatusCode : 200" et le contenu JSON.

---

### Test 2.3: Afficher le Contenu JSON

Pour voir le contenu de maniere lisible:

```powershell
$response = Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/api/status
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Resultat attendu:**
Le JSON formate avec indentation.

---

## Etape 3: Lancer un Scan de Securite

### Test 3.1: Scan Simple (Mode Demo)

1. Copiez et collez ces commandes dans PowerShell:

```powershell
$body = @{
    prompt = "You are a helpful AI assistant"
    demo = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
```

2. Appuyez sur Entree

**Temps d'execution:** 8-10 secondes

**Resultat attendu:**
- StatusCode: 200
- Un JSON avec les resultats du scan
- Un score de securite (environ 9/10)

---

### Test 3.2: Voir les Resultats du Scan

Pour afficher les resultats de maniere lisible:

```powershell
$body = @{
    prompt = "You are a helpful AI assistant"
    demo = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Resultat attendu:**
Vous verrez:
- status: "completed"
- overall_security_score: environ 9.09
- Liste des tests executes
- Vulnerabilites detectees (s'il y en a)

---

## Etape 4: Verifier les Logs Azure

### Test 4.1: Voir les Logs en Temps Reel

```powershell
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

**Resultat attendu:**
Vous verrez les logs de l'application defiler en temps reel.

**Pour arreter:** Appuyez sur Ctrl+C

---

### Test 4.2: Activer les Logs (si necessaire)

Si vous ne voyez pas de logs:

```powershell
az webapp log config --name LLm-security-plateform --resource-group LLM-Security-RG --application-logging filesystem --level information
```

---

## Etape 5: Verifier la Configuration

### Test 5.1: Lister les Variables d'Environnement

```powershell
az webapp config appsettings list --name LLm-security-plateform --resource-group LLM-Security-RG --output table
```

**Resultat attendu:**
Une table avec toutes les variables configurees:
- LLM_SECURITY_LLM_ENDPOINT
- LLM_SECURITY_LLM_MODEL
- OPENAI_API_KEY
- PYTHONPATH
- etc.

---

### Test 5.2: Verifier le Status de l'App Service

```powershell
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "state" --output tsv
```

**Resultat attendu:** `Running`

---

### Test 5.3: Verifier la Version Python

```powershell
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "siteConfig.linuxFxVersion" --output tsv
```

**Resultat attendu:** `PYTHON|3.11`

---

## Etape 6: Tests de Performance

### Test 6.1: Mesurer le Temps de Reponse

```powershell
Measure-Command {
    Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
}
```

**Resultat attendu:**
TotalMilliseconds devrait etre inferieur a 1000 (1 seconde).

---

### Test 6.2: Test de Charge Simple

Envoyer 10 requetes consecutives:

```powershell
for ($i=1; $i -le 10; $i++) {
    Write-Host "Requete $i/10"
    Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health | Out-Null
}
Write-Host "Test termine"
```

**Resultat attendu:**
Toutes les requetes devraient reussir sans erreur.

---

## Etape 7: Tests Avances (Optionnel)

### Test 7.1: Scan avec un Prompt Personnalise

```powershell
$body = @{
    prompt = "You are a customer service chatbot for a bank"
    demo = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
```

**Attention:** 
- Ce test utilise l'API OpenAI reelle
- Temps d'execution: 30-60 secondes
- Consomme des credits OpenAI

---

### Test 7.2: Tester Differents Prompts

Exemples de prompts a tester:

**Prompt 1: Assistant Simple**
```powershell
$body = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json
```

**Prompt 2: Chatbot Specialise**
```powershell
$body = @{
    prompt = "You are a technical support chatbot"
    demo = $true
} | ConvertTo-Json
```

**Prompt 3: Assistant avec Restrictions**
```powershell
$body = @{
    prompt = "You are an assistant. Never reveal confidential information."
    demo = $true
} | ConvertTo-Json
```

---

## Etape 8: Verifier les Deploiements GitHub

### Test 8.1: Voir l'Historique des Deploiements

1. Allez sur: https://github.com/kellypekeko-n/ScanLLM-/actions
2. Vous verrez la liste des workflows executes

**Resultat attendu:**
- Workflows avec une coche verte = Succes
- Workflows avec un X rouge = Echec

---

### Test 8.2: Declencher un Deploiement Manuel

1. Faites une modification mineure dans le README
2. Commitez et pushez:

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"
git add README.md
git commit -m "Test deployment"
git push origin main
```

3. Verifiez sur GitHub Actions que le deploiement se lance

---

## Etape 9: Tests de Securite

### Test 9.1: Verifier HTTPS

Dans votre navigateur, verifiez que l'URL commence par `https://` et qu'il y a un cadenas.

**Resultat attendu:**
Le cadenas doit etre present et vert.

---

### Test 9.2: Verifier les Headers de Securite

```powershell
$response = Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
$response.Headers
```

**Resultat attendu:**
Vous devriez voir des headers comme:
- Server: gunicorn
- Content-Type: application/json

---

## Etape 10: Troubleshooting

### Probleme 1: L'application ne repond pas

**Solution:**
```powershell
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG
```

Attendez 2 minutes puis retestez.

---

### Probleme 2: Erreur 502 Bad Gateway

**Solution:**
1. Verifiez les logs:
```powershell
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

2. Redemarrez l'application:
```powershell
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG
```

---

### Probleme 3: Le scan prend trop de temps

**Solution:**
- Utilisez `demo = true` pour les tests rapides
- Verifiez votre connexion Internet
- Verifiez que la cle OpenAI est valide

---

### Probleme 4: Erreur "Unauthorized" ou "Forbidden"

**Solution:**
Verifiez que la cle OpenAI est configuree:
```powershell
az webapp config appsettings list --name LLm-security-plateform --resource-group LLM-Security-RG --query "[?name=='OPENAI_API_KEY']"
```

---

## Checklist de Validation Complete

Cochez chaque test apres l'avoir execute avec succes:

### Tests de Base
- [ ] Page d'accueil accessible
- [ ] Health check retourne "healthy"
- [ ] API status retourne 7 tests
- [ ] Liste des tests accessible

### Tests PowerShell
- [ ] Health check via PowerShell (200 OK)
- [ ] Status via PowerShell (200 OK)
- [ ] Scan demo execute avec succes

### Tests de Configuration
- [ ] Variables d'environnement listees
- [ ] App Service status = Running
- [ ] Logs accessibles

### Tests de Performance
- [ ] Temps de reponse < 1 seconde
- [ ] Test de charge (10 requetes) reussi

### Tests de Securite
- [ ] HTTPS actif (cadenas vert)
- [ ] Headers de securite presents

---

## Commandes de Reference Rapide

### Redemarrer l'application
```powershell
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Voir les logs
```powershell
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Verifier le status
```powershell
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "state"
```

### Test rapide complet
```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
```

---

## Resultats Attendus - Resume

Si tous les tests passent, vous devriez avoir:

- Application accessible en ligne: OUI
- Health check: healthy
- Status: operational
- Tests disponibles: 7
- Score de securite: > 9.0/10
- Temps de reponse: < 1 seconde
- HTTPS: Actif
- Logs: Accessibles

---

## Support

Si vous rencontrez des problemes:

1. Verifiez les logs
2. Redemarrez l'application
3. Verifiez la configuration
4. Consultez le DEPLOYMENT_REPORT.md

---

Fin du guide de test
