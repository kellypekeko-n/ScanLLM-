@echo off
echo LLM Security Platform - Lanceur Windows
echo.
echo 1. Demo
echo 2. Test
echo 3. Analyze
echo.
set /p choice="Choisissez une option (1-3): "

if "%choice%"=="1" python launcher.py demo
if "%choice%"=="2" python launcher.py test
if "%choice%"=="3" python launcher.py analyze
pause
