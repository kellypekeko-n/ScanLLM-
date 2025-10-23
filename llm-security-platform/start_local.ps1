param(
  [string]$Port = "8000"
)

$ErrorActionPreference = "Stop"

# Backend
if (-not (Test-Path ".\.venv")) {
  py -3 -m venv .venv
}
.\.venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt
pip install -r orchestrator\requirements.txt
pip install -r analyzer\requirements.txt
pip install -r runners\requirements.txt
pip install flask flask-cors

# Démarrage backend dans une nouvelle fenêtre
$env:PORT=$Port
Start-Process -WindowStyle Minimized powershell -ArgumentList "-NoExit","-Command","cd `"$PWD`"; .\.venv\Scripts\Activate.ps1; $env:PORT=$env:PORT; python .\app.py"

# Frontend
cd .\frontend
Set-Content -Path .\.env -Value "REACT_APP_API_URL=http://127.0.0.1:$Port"

# Démarrer le frontend
npm start
