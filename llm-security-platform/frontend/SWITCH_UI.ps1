#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Bascule entre l'ancienne et la nouvelle interface utilisateur
.DESCRIPTION
    Script pour activer/désactiver la nouvelle UI en renommant les fichiers
.PARAMETER Mode
    'new' pour activer la nouvelle UI, 'old' pour revenir à l'ancienne
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('new', 'old')]
    [string]$Mode
)

$ErrorActionPreference = "Stop"

$frontendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $frontendDir

Write-Host "🔄 Basculement vers l'interface $Mode..." -ForegroundColor Cyan
Write-Host ""

if ($Mode -eq 'new') {
    Write-Host "📦 Activation de la nouvelle UI..." -ForegroundColor Yellow
    
    # Sauvegarder l'ancienne Home si elle existe
    if (Test-Path "src\pages\Home.jsx") {
        if (-not (Test-Path "src\pages\HomeOld.jsx")) {
            Write-Host "   Sauvegarde de l'ancienne Home.jsx..." -ForegroundColor Gray
            Move-Item "src\pages\Home.jsx" "src\pages\HomeOld.jsx" -Force
        } else {
            Write-Host "   Suppression de l'ancienne Home.jsx..." -ForegroundColor Gray
            Remove-Item "src\pages\Home.jsx" -Force
        }
    }
    
    # Activer la nouvelle Home
    if (Test-Path "src\pages\HomeNew.jsx") {
        Write-Host "   Activation de HomeNew.jsx..." -ForegroundColor Gray
        Copy-Item "src\pages\HomeNew.jsx" "src\pages\Home.jsx" -Force
    } else {
        Write-Host "   ❌ Erreur: HomeNew.jsx introuvable!" -ForegroundColor Red
        exit 1
    }
    
    # Sauvegarder l'ancienne Navbar si elle existe
    if (Test-Path "src\components\Navbar.jsx") {
        if (-not (Test-Path "src\components\NavbarOld.jsx")) {
            Write-Host "   Sauvegarde de l'ancienne Navbar.jsx..." -ForegroundColor Gray
            Move-Item "src\components\Navbar.jsx" "src\components\NavbarOld.jsx" -Force
        } else {
            Write-Host "   Suppression de l'ancienne Navbar.jsx..." -ForegroundColor Gray
            Remove-Item "src\components\Navbar.jsx" -Force
        }
    }
    
    # Activer la nouvelle Navbar
    if (Test-Path "src\components\NavbarNew.jsx") {
        Write-Host "   Activation de NavbarNew.jsx..." -ForegroundColor Gray
        Copy-Item "src\components\NavbarNew.jsx" "src\components\Navbar.jsx" -Force
    } else {
        Write-Host "   ❌ Erreur: NavbarNew.jsx introuvable!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "✅ Nouvelle UI activée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Fichiers actifs:" -ForegroundColor Cyan
    Write-Host "   • src\pages\Home.jsx (copie de HomeNew.jsx)" -ForegroundColor White
    Write-Host "   • src\components\Navbar.jsx (copie de NavbarNew.jsx)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Nouvelles fonctionnalités disponibles:" -ForegroundColor Cyan
    Write-Host "   • Design Trivy-style" -ForegroundColor White
    Write-Host "   • Support FR/EN" -ForegroundColor White
    Write-Host "   • Page Scanner un Système" -ForegroundColor White
    Write-Host "   • Historique des scans" -ForegroundColor White
    Write-Host "   • Guide d'utilisation" -ForegroundColor White
    Write-Host "   • Paramètres" -ForegroundColor White
    Write-Host ""
    
} elseif ($Mode -eq 'old') {
    Write-Host "📦 Retour à l'ancienne UI..." -ForegroundColor Yellow
    
    # Restaurer l'ancienne Home
    if (Test-Path "src\pages\HomeOld.jsx") {
        Write-Host "   Restauration de HomeOld.jsx..." -ForegroundColor Gray
        Copy-Item "src\pages\HomeOld.jsx" "src\pages\Home.jsx" -Force
    } else {
        Write-Host "   ⚠️  Attention: HomeOld.jsx introuvable!" -ForegroundColor Yellow
        Write-Host "   L'ancienne version n'a pas été sauvegardée." -ForegroundColor Yellow
    }
    
    # Restaurer l'ancienne Navbar
    if (Test-Path "src\components\NavbarOld.jsx") {
        Write-Host "   Restauration de NavbarOld.jsx..." -ForegroundColor Gray
        Copy-Item "src\components\NavbarOld.jsx" "src\components\Navbar.jsx" -Force
    } else {
        Write-Host "   ⚠️  Attention: NavbarOld.jsx introuvable!" -ForegroundColor Yellow
        Write-Host "   L'ancienne version n'a pas été sauvegardée." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "✅ Ancienne UI restaurée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Fichiers actifs:" -ForegroundColor Cyan
    Write-Host "   • src\pages\Home.jsx (copie de HomeOld.jsx)" -ForegroundColor White
    Write-Host "   • src\components\Navbar.jsx (copie de NavbarOld.jsx)" -ForegroundColor White
    Write-Host ""
}

Write-Host "🔄 Redémarrez le serveur de développement pour voir les changements:" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
