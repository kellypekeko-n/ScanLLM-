param(
  [string]$Port = "8000",
  [string]$FrontendDir = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

# Dossier du script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptDir

# -------- Backend --------
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

# Démarrer le backend dans une nouvelle fenêtre
$env:PORT = $Port
Start-Process -WindowStyle Minimized powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$scriptDir`"; .\.venv\Scripts\Activate.ps1; $env:PORT=$env:PORT; python .\app.py"
)

# -------- Frontend --------
if ([string]::IsNullOrWhiteSpace($FrontendDir)) {
  $pkg = Get-ChildItem -Path . -Recurse -Filter package.json | Select-Object -First 1
  if ($pkg) { $FrontendDir = $pkg.DirectoryName } else { throw 'package.json introuvable. Spécifiez -FrontendDir.' }
}
S


















et-Location -Path $FrontendDir

if (Test-Path ".\package-lock.json") { npm ci } else { npm install }

# Config API URL backend local
$envLine = "REACT_APP_API_URL=http://127.0.0.1:$Port"
if (Test-Path .\.env) {
  $current = Get-Content .\.env -ErrorAction SilentlyContinue
  if (-not ($current -match '^REACT_APP_API_URL=')) {
    Add-Content -Path .\.env -Value $envLine
  } else {
 










   ($current -replace '^REACT_APP_API_URL=.*', $envLine) | Set-Content -Path .\.env -Encoding utf8
  }
} else {
  Set-Content -Path .\.env -Value $envLine -Encoding utf8
}

# Démarrer le frontend
npm start
