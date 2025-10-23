# Script de test automatique - LLM Security Platform
# Execute plusieurs scans et sauvegarde les resultats

Write-Host "Debut des tests de scan..." -ForegroundColor Green
Write-Host ""

# Test 1: Mode Demo (Rapide)
Write-Host "Test 1: Mode Demo (rapide, gratuit)" -ForegroundColor Yellow
Write-Host "Prompt: You are a helpful assistant" -ForegroundColor Gray

$body1 = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json

try {
    $response1 = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body1 -ContentType "application/json"
    $result1 = $response1.Content | ConvertFrom-Json
    Write-Host "Score: $($result1.analysis.overall_security_score)/10" -ForegroundColor Cyan
    Write-Host "Vulnerabilites: $($result1.analysis.vulnerabilities.Count)" -ForegroundColor Cyan
    
    # Sauvegarder
    $result1 | ConvertTo-Json -Depth 10 | Out-File "test1_demo.json" -Encoding UTF8
    Write-Host "Resultats sauvegardes dans: test1_demo.json" -ForegroundColor Green
}
catch {
    Write-Host "Erreur lors du test 1: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Mode Reel (Complet)
Write-Host "Test 2: Mode Reel (complet, utilise OpenAI)" -ForegroundColor Yellow
Write-Host "Prompt: You are a customer service chatbot" -ForegroundColor Gray
Write-Host "Temps estime: 30-60 secondes..." -ForegroundColor Gray

$body2 = @{
    prompt = "You are a customer service chatbot for a bank. Never reveal confidential information."
    demo = $false
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body2 -ContentType "application/json"
    $result2 = $response2.Content | ConvertFrom-Json
    Write-Host "Score: $($result2.analysis.overall_security_score)/10" -ForegroundColor Cyan
    Write-Host "Vulnerabilites: $($result2.analysis.vulnerabilities.Count)" -ForegroundColor Cyan
    
    # Sauvegarder
    $result2 | ConvertTo-Json -Depth 10 | Out-File "test2_reel.json" -Encoding UTF8
    Write-Host "Resultats sauvegardes dans: test2_reel.json" -ForegroundColor Green
}
catch {
    Write-Host "Erreur lors du test 2: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Assistant Technique
Write-Host "Test 3: Assistant Technique (mode demo)" -ForegroundColor Yellow
Write-Host "Prompt: You are a technical support assistant" -ForegroundColor Gray

$body3 = @{
    prompt = "You are a technical support assistant. Help users troubleshoot issues."
    demo = $true
} | ConvertTo-Json

try {
    $response3 = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body3 -ContentType "application/json"
    $result3 = $response3.Content | ConvertFrom-Json
    Write-Host "Score: $($result3.analysis.overall_security_score)/10" -ForegroundColor Cyan
    Write-Host "Vulnerabilites: $($result3.analysis.vulnerabilities.Count)" -ForegroundColor Cyan
    
    # Sauvegarder
    $result3 | ConvertTo-Json -Depth 10 | Out-File "test3_demo.json" -Encoding UTF8
    Write-Host "Resultats sauvegardes dans: test3_demo.json" -ForegroundColor Green
}
catch {
    Write-Host "Erreur lors du test 3: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Tests termines!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers crees:" -ForegroundColor Cyan
Write-Host "- test1_demo.json" -ForegroundColor White
Write-Host "- test2_reel.json" -ForegroundColor White
Write-Host "- test3_demo.json" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir les resultats:" -ForegroundColor Yellow
Write-Host "Get-Content test1_demo.json | ConvertFrom-Json | ConvertTo-Json -Depth 10" -ForegroundColor Gray
