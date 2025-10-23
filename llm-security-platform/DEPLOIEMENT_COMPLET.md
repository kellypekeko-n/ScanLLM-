# Guide de Deploiement Complet

Date: 23 octobre 2025

---

## Etape 1: Deployer le Backend (API)

### 1.1 Preparer les Fichiers

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"

# Ajouter tous les nouveaux fichiers
git add llm-security-platform/analyzer/csv_exporter.py
git add llm-security-platform/data/solutions_database.py
git add llm-security-platform/app.py
git add llm-security-platform/WORKFLOW_COMPLET_INTEGRE.md
git add llm-security-platform/DEPLOIEMENT_COMPLET.md
git add llm-security-platform/frontend_src/

# Commiter
git commit -m "Phase 2 Complete: CSV Export, Solutions Database, Frontend Interface"

# Pusher
git push origin main
```

### 1.2 Verifier le Deploiement

Attendez 2-3 minutes puis testez:

```powershell
# Test 1: Health check
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health

# Test 2: Nouveaux endpoints
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/api/solutions

# Test 3: Export CSV
$body = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json

$scan = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
$result = $scan.Content | ConvertFrom-Json

# Exporter en CSV
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

## Etape 2: Deployer le Frontend

### 2.1 Creer le Projet React

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Creer React app
npx create-react-app frontend

cd frontend

# Installer dependances
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2.2 Copier les Fichiers

```powershell
# Retour au dossier parent
cd ..

# Copier tous les fichiers frontend
Copy-Item -Path "frontend_src\*" -Destination "frontend\src\" -Recurse -Force
```

### 2.3 Configurer Tailwind

Editez `frontend/tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
        danger: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' }
      }
    },
  },
  plugins: [],
}
```

### 2.4 Tester Localement

```powershell
cd frontend
npm start
```

Ouvrez http://localhost:3000

### 2.5 Build pour Production

```powershell
npm run build
```

Les fichiers seront dans `frontend/build/`

---

## Etape 3: Deployer sur Azure Static Web Apps

### 3.1 Installer Azure Static Web Apps CLI

```powershell
npm install -g @azure/static-web-apps-cli
```

### 3.2 Creer une Azure Static Web App

```powershell
# Se connecter a Azure
az login

# Creer le Static Web App
az staticwebapp create `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG `
  --location "East US" `
  --source https://github.com/kellypekeko-n/ScanLLM- `
  --branch main `
  --app-location "/llm-security-platform/frontend" `
  --output-location "build" `
  --login-with-github
```

### 3.3 Deployer

```powershell
cd frontend

# Build
npm run build

# Deployer
az staticwebapp deploy `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG `
  --source ./build
```

---

## Etape 4: Configurer CORS

Pour que le frontend puisse communiquer avec le backend:

### 4.1 Ajouter CORS dans Flask

Editez `app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://llm-security-frontend.azurestaticapps.net"
        ]
    }
})
```

### 4.2 Installer flask-cors

Ajoutez dans `requirements.txt`:

```
flask-cors==4.0.0
```

### 4.3 Redployer le Backend

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"
git add llm-security-platform/app.py
git add llm-security-platform/requirements.txt
git commit -m "Add CORS support for frontend"
git push origin main
```

---

## Etape 5: Tester l'Application Complete

### 5.1 URLs

- **Backend API:** https://llm-security-plateform.azurewebsites.net
- **Frontend Web:** https://llm-security-frontend.azurestaticapps.net

### 5.2 Tests

1. **Ouvrir le frontend**
   ```
   https://llm-security-frontend.azurestaticapps.net
   ```

2. **Cliquer sur "Commencer un Scan"**

3. **Remplir le formulaire:**
   - Nom: Test System
   - Prompt: You are a helpful assistant
   - Cocher "Mode Demo"

4. **Cliquer sur "Lancer le Scan"**

5. **Attendre les resultats (8-10 secondes)**

6. **Voir les vulnerabilites detectees**

7. **Cliquer sur "Voir les solutions"**

8. **Voir le code Python pret a copier**

9. **Cliquer sur "Telecharger CSV"**

10. **Ouvrir le CSV dans Excel**

---

## Etape 6: Monitoring et Logs

### 6.1 Voir les Logs Backend

```powershell
az webapp log tail `
  --name LLm-security-plateform `
  --resource-group LLM-Security-RG
```

### 6.2 Voir les Logs Frontend

```powershell
az staticwebapp show `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG
```

### 6.3 Application Insights

Ouvrez le portail Azure:
1. Allez dans Application Insights
2. Cliquez sur "Application map"
3. Voyez les requetes en temps reel

---

## Etape 7: Configuration des Variables d'Environnement

### 7.1 Backend

```powershell
az webapp config appsettings set `
  --name LLm-security-plateform `
  --resource-group LLM-Security-RG `
  --settings `
    ENVIRONMENT=production `
    CORS_ORIGINS=https://llm-security-frontend.azurestaticapps.net
```

### 7.2 Frontend

Creez `.env.production` dans `frontend/`:

```
REACT_APP_API_URL=https://llm-security-plateform.azurewebsites.net
```

---

## Etape 8: Automatiser avec GitHub Actions

### 8.1 Workflow Frontend

Creez `.github/workflows/frontend-deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
    paths:
      - 'llm-security-platform/frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd llm-security-platform/frontend
          npm install
      
      - name: Build
        run: |
          cd llm-security-platform/frontend
          npm run build
      
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/llm-security-platform/frontend"
          output_location: "build"
```

---

## Troubleshooting

### Probleme 1: CORS Error

**Symptome:** Erreur "Access-Control-Allow-Origin" dans la console

**Solution:**
1. Verifier que flask-cors est installe
2. Verifier que l'URL du frontend est dans CORS_ORIGINS
3. Redemarrer le backend

### Probleme 2: Frontend ne charge pas

**Symptome:** Page blanche

**Solution:**
1. Ouvrir la console du navigateur (F12)
2. Verifier les erreurs JavaScript
3. Verifier que l'API_URL est correcte

### Probleme 3: CSV ne se telecharge pas

**Symptome:** Erreur 500 lors de l'export CSV

**Solution:**
1. Verifier que csv_exporter.py est deploye
2. Verifier les logs du backend
3. Tester l'endpoint directement avec PowerShell

---

## Commandes Utiles

### Redemarrer le Backend

```powershell
az webapp restart `
  --name LLm-security-plateform `
  --resource-group LLM-Security-RG
```

### Redemarrer le Frontend

```powershell
az staticwebapp restart `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG
```

### Voir le Status

```powershell
# Backend
az webapp show `
  --name LLm-security-plateform `
  --resource-group LLM-Security-RG `
  --query "state"

# Frontend
az staticwebapp show `
  --name llm-security-frontend `
  --resource-group LLM-Security-RG `
  --query "status"
```

---

## Checklist de Deploiement

### Backend
- [x] Code pousse sur GitHub
- [x] GitHub Actions execute
- [x] Application deployee
- [x] Health check OK
- [x] API endpoints fonctionnels
- [x] CORS configure
- [x] Rate limiting actif
- [x] Application Insights configure

### Frontend
- [ ] Projet React cree
- [ ] Dependances installees
- [ ] Fichiers copies
- [ ] Tailwind configure
- [ ] Build reussi
- [ ] Deploye sur Azure
- [ ] CORS fonctionne
- [ ] API accessible

### Tests
- [ ] Page d'accueil charge
- [ ] Formulaire de scan fonctionne
- [ ] Scan s'execute
- [ ] Resultats s'affichent
- [ ] Solutions s'affichent
- [ ] CSV se telecharge
- [ ] Navigation fonctionne

---

Fin du document
