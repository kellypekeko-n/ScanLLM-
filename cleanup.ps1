# Script de Nettoyage - LLM Security Platform
# Supprime les fichiers et dossiers inutiles

Write-Host "Debut du nettoyage..." -ForegroundColor Green

# Dossiers a supprimer
$foldersToDelete = @(
    "__pycache__",
    ".pytest_cache",
    ".venv",
    ".vs",
    "logs",
    "results",
    "test_results"
)

# Fichiers a supprimer
$filesToDelete = @(
    "python orchestrator.py",
    "main.py",
    "run_test.py"
)

# Supprimer les dossiers
foreach ($folder in $foldersToDelete) {
    $path = Join-Path $PSScriptRoot $folder
    if (Test-Path $path) {
        Write-Host "Suppression du dossier: $folder" -ForegroundColor Yellow
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Supprimer les fichiers
foreach ($file in $filesToDelete) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        Write-Host "Suppression du fichier: $file" -ForegroundColor Yellow
        Remove-Item -Path $path -Force -ErrorAction SilentlyContinue
    }
}

# Supprimer les fichiers .pyc recursifs
Write-Host "Suppression des fichiers .pyc..." -ForegroundColor Yellow
Get-ChildItem -Path $PSScriptRoot -Filter "*.pyc" -Recurse -Force | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "Nettoyage termine!" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers et dossiers supprimes:" -ForegroundColor Cyan
Write-Host "- Dossiers cache Python (__pycache__, .pytest_cache)" -ForegroundColor White
Write-Host "- Environnement virtuel (.venv)" -ForegroundColor White
Write-Host "- Dossiers de logs et resultats" -ForegroundColor White
Write-Host "- Fichiers Python inutilises" -ForegroundColor White
