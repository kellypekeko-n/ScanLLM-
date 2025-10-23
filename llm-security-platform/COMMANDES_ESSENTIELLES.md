# Commandes Essentielles - LLM Security Platform

Guide rapide des commandes les plus importantes

---

## Deploiement Automatique (Recommande)

### Tout Deployer en Une Commande

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"
.\deploy_all.ps1
```

Ce script fait tout automatiquement:
- Deploie le backend sur Azure
- Cree le projet React
- Copie les fichiers frontend
- Configure Tailwind
- Build le frontend

---

## Deploiement Manuel

### Backend

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"

# Ajouter et commiter
git add llm-security-platform/
git commit -m "Phase 2 Complete"
git push origin main

# Attendre 2-3 minutes puis verifier
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
```

### Frontend

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Creer React app
npx create-react-app frontend
cd frontend

# Installer dependances
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copier les fichiers
cd ..
Copy-Item -Path "frontend_src\*" -Destination "frontend\src\" -Recurse -Force

# Demarrer en local
cd frontend
npm start
```

---

## Tests Rapides

### Test 1: Health Check

```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
```

### Test 2: Scan Complet

```powershell
$body = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json

$scan = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
$result = $scan.Content | ConvertFrom-Json

Write-Host "Score: $($result.analysis.overall_security_score)/10"
Write-Host "Vulnerabilites: $($result.analysis.vulnerabilities.Count)"
```

### Test 3: Recuperer les Solutions

```powershell
$solutions = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/solutions/prompt_injection
$data = $solutions.Content | ConvertFrom-Json

Write-Host "Solutions disponibles: $($data.solutions.Count)"
$data.solutions | ForEach-Object {
    Write-Host "- $($_.title)"
}
```

### Test 4: Export CSV

```powershell
# D'abord faire un scan
$body = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json

$scan = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
$result = $scan.Content | ConvertFrom-Json

# Puis exporter en CSV
$csvBody = @{
    scan_results = $result
    system_name = "Test System"
    scan_id = "SCAN-TEST-001"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/export/csv -Method POST -Body $csvBody -ContentType "application/json" -OutFile "scan_report.csv"

# Ouvrir le CSV
Invoke-Item scan_report.csv
```

---

## Gestion Azure

### Redemarrer le Backend

```powershell
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Voir les Logs

```powershell
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Voir le Status

```powershell
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "state"
```

---

## Frontend Local

### Demarrer le Serveur de Developpement

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform\frontend"
npm start
```

Ouvre automatiquement http://localhost:3000

### Build pour Production

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform\frontend"
npm run build
```

Les fichiers seront dans `build/`

---

## Deploiement Frontend sur Azure

### Option 1: Azure Static Web Apps CLI

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform\frontend"

# Build
npm run build

# Deployer
az staticwebapp deploy --name llm-security-frontend --resource-group LLM-Security-RG --source ./build
```

### Option 2: Creer une Nouvelle Static Web App

```powershell
az staticwebapp create `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG `
  --location "East US" `
  --source https://github.com/kellypekeko-n/ScanLLM- `
  --branch main `
  --app-location "/llm-security-platform/frontend" `
  --output-location "build"
```

---

## Workflow Complet de Test

### Test de Bout en Bout

```powershell
# 1. Verifier le backend
Write-Host "1. Test du backend..." -ForegroundColor Cyan
$health = Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
Write-Host "Backend: OK" -ForegroundColor Green

# 2. Lancer un scan
Write-Host "2. Lancement du scan..." -ForegroundColor Cyan
$body = @{
    prompt = "You are a helpful customer service assistant"
    demo = $false
} | ConvertTo-Json

$scan = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
$result = $scan.Content | ConvertFrom-Json
Write-Host "Scan: OK - Score: $($result.analysis.overall_security_score)/10" -ForegroundColor Green

# 3. Recuperer les solutions
Write-Host "3. Recuperation des solutions..." -ForegroundColor Cyan
$vulnType = $result.analysis.vulnerabilities[0].type
$solutions = Invoke-WebRequest -Uri "https://llm-security-plateform.azurewebsites.net/api/solutions/$vulnType"
$solutionsData = $solutions.Content | ConvertFrom-Json
Write-Host "Solutions: OK - $($solutionsData.solutions.Count) solutions disponibles" -ForegroundColor Green

# 4. Exporter en CSV
Write-Host "4. Export CSV..." -ForegroundColor Cyan
$csvBody = @{
    scan_results = $result
    system_name = "Test System"
    scan_id = "SCAN-TEST-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/export/csv -Method POST -Body $csvBody -ContentType "application/json" -OutFile "test_report.csv"
Write-Host "CSV: OK - Fichier cree: test_report.csv" -ForegroundColor Green

# 5. Ouvrir le CSV
Write-Host "5. Ouverture du CSV..." -ForegroundColor Cyan
Invoke-Item test_report.csv

Write-Host ""
Write-Host "Tous les tests ont reussi!" -ForegroundColor Green
```

---

## Nettoyage

### Supprimer les Fichiers Temporaires

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Supprimer les fichiers CSV de test
Remove-Item *.csv -ErrorAction SilentlyContinue

# Supprimer node_modules (si besoin de reinstaller)
Remove-Item frontend\node_modules -Recurse -Force -ErrorAction SilentlyContinue

# Supprimer le build
Remove-Item frontend\build -Recurse -Force -ErrorAction SilentlyContinue
```

---

## Troubleshooting

### Probleme: Backend ne repond pas

```powershell
# Verifier le status
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "state"

# Redemarrer
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG

# Voir les logs
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Probleme: Frontend ne build pas

```powershell
cd frontend

# Reinstaller les dependances
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# Rebuild
npm run build
```

### Probleme: CORS Error

```powershell
# Verifier que flask-cors est installe
# Ajouter dans requirements.txt:
# flask-cors==4.0.0

# Puis redployer
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"
git add llm-security-platform/requirements.txt
git commit -m "Add flask-cors"
git push origin main
```

---

## URLs Importantes

- **Backend API:** https://llm-security-plateform.azurewebsites.net
- **API Documentation:** https://llm-security-plateform.azurewebsites.net/
- **Health Check:** https://llm-security-plateform.azurewebsites.net/health
- **GitHub Repo:** https://github.com/kellypekeko-n/ScanLLM-
- **Azure Portal:** https://portal.azure.com

---

## Documentation

- `DEPLOIEMENT_COMPLET.md` - Guide de deploiement complet
- `PHASE2_COMPLETE_SUMMARY.md` - Resume de la Phase 2
- `WORKFLOW_COMPLET_INTEGRE.md` - Workflow utilisateur complet
- `FRONTEND_SETUP.md` - Setup du frontend
- `QUICK_START_FRONTEND.md` - Demarrage rapide frontend

---

## Support

### En cas de probleme:

1. Verifier les logs Azure
2. Consulter la documentation
3. Tester les endpoints individuellement
4. Verifier les variables d'environnement
5. Redemarrer les services

---

Fin du document
