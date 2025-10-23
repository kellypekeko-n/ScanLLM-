# Script de Deploiement Complet - LLM Security Platform
# Deploie le backend et le frontend sur Azure

Write-Host "========================================" -ForegroundColor Green
Write-Host "  LLM Security Platform - Deploiement  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$projectRoot = "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"
$platformDir = "$projectRoot\llm-security-platform"
$frontendDir = "$platformDir\frontend"

# Fonction pour afficher les etapes
function Show-Step {
    param([string]$message)
    Write-Host ""
    Write-Host ">>> $message" -ForegroundColor Cyan
    Write-Host ""
}

# Fonction pour verifier les erreurs
function Check-Error {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur detectee! Arret du deploiement." -ForegroundColor Red
        exit 1
    }
}

# Etape 1: Deployer le Backend
Show-Step "Etape 1/6: Deploiement du Backend"

cd $projectRoot

Write-Host "Ajout des fichiers au Git..." -ForegroundColor Yellow
git add llm-security-platform/

Write-Host "Commit des changements..." -ForegroundColor Yellow
git commit -m "Phase 2 Complete: CSV Export, Solutions Database, Frontend Interface"

Write-Host "Push vers GitHub..." -ForegroundColor Yellow
git push origin main
Check-Error

Write-Host "Backend deploye avec succes!" -ForegroundColor Green
Write-Host "Attente de 30 secondes pour le deploiement Azure..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Etape 2: Verifier le Backend
Show-Step "Etape 2/6: Verification du Backend"

Write-Host "Test du health check..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "https://llm-security-plateform.azurewebsites.net/health" -UseBasicParsing
    if ($health.StatusCode -eq 200) {
        Write-Host "Backend operationnel!" -ForegroundColor Green
    }
} catch {
    Write-Host "Attention: Backend pas encore pret. Attendez 1-2 minutes." -ForegroundColor Yellow
}

# Etape 3: Creer le Projet React (si n'existe pas)
Show-Step "Etape 3/6: Creation du Projet React"

if (-not (Test-Path $frontendDir)) {
    Write-Host "Creation du projet React..." -ForegroundColor Yellow
    cd $platformDir
    npx create-react-app frontend
    Check-Error
    
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    cd $frontendDir
    npm install axios react-router-dom
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Attention: Erreur lors de l'initialisation de Tailwind, mais on continue..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Projet React deja existant." -ForegroundColor Green
}

# Etape 4: Copier les Fichiers Frontend
Show-Step "Etape 4/6: Copie des Fichiers Frontend"

Write-Host "Copie des fichiers depuis frontend_src..." -ForegroundColor Yellow
cd $platformDir
Copy-Item -Path "frontend_src\*" -Destination "frontend\src\" -Recurse -Force
Write-Host "Fichiers copies avec succes!" -ForegroundColor Green

# Etape 5: Configurer Tailwind
Show-Step "Etape 5/6: Configuration de Tailwind CSS"

$tailwindConfig = @"
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
"@

Write-Host "Ecriture de tailwind.config.js..." -ForegroundColor Yellow
$tailwindConfig | Out-File -FilePath "$frontendDir\tailwind.config.js" -Encoding UTF8
Write-Host "Tailwind configure!" -ForegroundColor Green

# Etape 6: Build du Frontend
Show-Step "Etape 6/6: Build du Frontend"

cd $frontendDir

Write-Host "Build de l'application React..." -ForegroundColor Yellow
npm run build
Check-Error

Write-Host "Build termine avec succes!" -ForegroundColor Green

# Resume
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deploiement Termine!                 " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Backend API:" -ForegroundColor Cyan
Write-Host "  https://llm-security-plateform.azurewebsites.net" -ForegroundColor White
Write-Host ""

Write-Host "Frontend (local):" -ForegroundColor Cyan
Write-Host "  Pour tester localement:" -ForegroundColor White
Write-Host "  cd $frontendDir" -ForegroundColor Gray
Write-Host "  npm start" -ForegroundColor Gray
Write-Host ""

Write-Host "Frontend (production):" -ForegroundColor Cyan
Write-Host "  Les fichiers sont dans: $frontendDir\build" -ForegroundColor White
Write-Host "  Pour deployer sur Azure Static Web Apps:" -ForegroundColor White
Write-Host "  az staticwebapp deploy --name llm-security-frontend --resource-group LLM-Security-RG --source $frontendDir\build" -ForegroundColor Gray
Write-Host ""

Write-Host "Tests a effectuer:" -ForegroundColor Cyan
Write-Host "  1. Tester le backend: Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health" -ForegroundColor Gray
Write-Host "  2. Tester le frontend local: cd $frontendDir && npm start" -ForegroundColor Gray
Write-Host "  3. Tester un scan complet (voir DEPLOIEMENT_COMPLET.md)" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - DEPLOIEMENT_COMPLET.md - Guide de deploiement" -ForegroundColor Gray
Write-Host "  - PHASE2_COMPLETE_SUMMARY.md - Resume de la Phase 2" -ForegroundColor Gray
Write-Host "  - WORKFLOW_COMPLET_INTEGRE.md - Workflow complet" -ForegroundColor Gray
Write-Host ""

Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "  1. Tester l'interface web localement" -ForegroundColor Gray
Write-Host "  2. Deployer le frontend sur Azure" -ForegroundColor Gray
Write-Host "  3. Commencer la Phase 3 (Monitoring)" -ForegroundColor Gray
Write-Host ""

Write-Host "Deploiement termine avec succes!" -ForegroundColor Green
