@echo off
title LLM Security Platform - Lanceur Windows
color 0A

echo.
echo    ╔══════════════════════════════════════════════════════════════╗
echo    ║                                                              ║
echo    ║        🛡️  LLM Security Platform - Lanceur Windows        ║
echo    ║                                                              ║
echo    ║  Plateforme de cybersécurité spécialisée pour les LLM       ║
echo    ║                                                              ║
echo    ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 Options disponibles:
echo.
echo    1. 🚀 Installation complète
echo    2. 🧪 Test de la plateforme
echo    3. 🎬 Démonstration
echo    4. 🔍 Analyse de sécurité
echo    5. 📊 Rapport de vulnérabilités
echo    6. ❓ Aide
echo    7. 🚪 Quitter
echo.

set /p choice="Choisissez une option (1-7): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto test
if "%choice%"=="3" goto demo
if "%choice%"=="4" goto analyze
if "%choice%"=="5" goto report
if "%choice%"=="6" goto help
if "%choice%"=="7" goto exit
goto invalid

:install
echo.
echo 🚀 Installation de la plateforme...
python install.py
pause
goto menu

:test
echo.
echo 🧪 Test de la plateforme...
python test_platform.py
pause
goto menu

:demo
echo.
echo 🎬 Lancement de la démonstration...
python demo.py
pause
goto menu

:analyze
echo.
echo 🔍 Analyse de sécurité...
echo Entrez le prompt à analyser:
set /p prompt="Prompt: "
python orchestrator/orchestrator.py "%prompt%"
pause
goto menu

:report
echo.
echo 📊 Génération du rapport...
python analyzer/analyzer.py orchestrator/results/security_analysis_*.json
pause
goto menu

:help
echo.
echo ❓ Aide - LLM Security Platform
echo.
echo Cette plateforme permet de:
echo   • Scanner les modèles LLM pour détecter les vulnérabilités
echo   • Classifier les modèles par niveau de risque
echo   • Générer des rapports de sécurité détaillés
echo   • Fournir des recommandations de remédiation
echo.
echo Prérequis:
echo   • Python 3.10+
echo   • LM Studio (optionnel pour la démo)
echo.
echo Commandes disponibles:
echo   • python install.py     - Installation complète
echo   • python test_platform.py - Test de la plateforme
echo   • python demo.py        - Démonstration
echo   • python orchestrator/orchestrator.py "prompt" - Analyse
echo.
pause
goto menu

:invalid
echo.
echo ❌ Option invalide. Veuillez choisir entre 1 et 7.
pause
goto menu

:menu
cls
goto start

:exit
echo.
echo 👋 Au revoir !
echo.
pause
exit

:start
goto :eof
