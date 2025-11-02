#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Démarre l'application LLM Security Platform avec la nouvelle UI
.DESCRIPTION
    Lance le backend Flask et le frontend React avec la nouvelle interface utilisateur
#>

param(
    [string]$BackendPort = "8000",
    [string]$FrontendPort = "3000"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Démarrage de LLM Security Platform (Nouvelle UI)" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Dossier racine
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

# ====== BACKEND ======
Write-Host "📦 Configuration du backend..." -ForegroundColor Yellow

if (-not (Test-Path ".\.venv")) {
    Write-Host "   Création de l'environnement virtuel..." -ForegroundColor Gray
    py -3 -m venv .venv
}

Write-Host "   Activation de l'environnement virtuel..." -ForegroundColor Gray
.\.venv\Scripts\Activate.ps1

Write-Host "   Installation des dépendances..." -ForegroundColor Gray
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
pip install --quiet -r orchestrator\requirements.txt
pip install --quiet -r analyzer\requirements.txt
pip install --quiet flask flask-cors

Write-Host "   ✓ Backend configuré" -ForegroundColor Green
Write-Host ""

# Démarrer le backend dans une nouvelle fenêtre
Write-Host "🔧 Démarrage du backend sur le port $BackendPort..." -ForegroundColor Yellow
$env:PORT = $BackendPort
$backendCmd = "cd `"$rootDir`"; .\.venv\Scripts\Activate.ps1; `$env:PORT='$BackendPort'; python .\app.py"
Start-Process -WindowStyle Normal powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Host "   ✓ Backend démarré (nouvelle fenêtre)" -ForegroundColor Green
Write-Host ""

# Attendre que le backend démarre
Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# ====== FRONTEND ======
Write-Host "🎨 Configuration du frontend..." -ForegroundColor Yellow

$frontendDir = Join-Path $rootDir "frontend"
Set-Location $frontendDir

# Vérifier si node_modules existe
if (-not (Test-Path ".\node_modules")) {
    Write-Host "   Installation des dépendances npm (première fois)..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "   Dépendances npm déjà installées" -ForegroundColor Gray
}

# Configurer l'URL du backend
$envContent = "REACT_APP_API_URL=http://127.0.0.1:$BackendPort"
Set-Content -Path ".\.env" -Value $envContent -Encoding UTF8
Write-Host "   ✓ Configuration API: http://127.0.0.1:$BackendPort" -ForegroundColor Green
Write-Host ""

# Démarrer le frontend
Write-Host "🌐 Démarrage du frontend sur le port $FrontendPort..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✨ Application prête!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:$FrontendPort" -ForegroundColor White
Write-Host "   Backend:  http://localhost:$BackendPort" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Nouvelles fonctionnalités:" -ForegroundColor Cyan
Write-Host "   • Design Trivy-style (fond sombre)" -ForegroundColor White
Write-Host "   • Support FR/EN (toggle en haut à droite)" -ForegroundColor White
Write-Host "   • Page Scanner un Système (/scan-system)" -ForegroundColor White
Write-Host "   • Historique des scans (/history)" -ForegroundColor White
Write-Host "   • Guide d'utilisation (/about)" -ForegroundColor White
Write-Host "   • Paramètres (/settings)" -ForegroundColor White
Write-Host "   • Composant Feedback après scan" -ForegroundColor White
Write-Host ""
Write-Host "⌨️  Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

npm start
