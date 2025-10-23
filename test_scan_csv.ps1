# Script de test avec export CSV automatique
# Execute des scans et sauvegarde les resultats en JSON et CSV

Write-Host "Debut des tests de scan avec export CSV..." -ForegroundColor Green
Write-Host ""

# Fonction pour convertir les resultats en CSV
function Export-ScanResultsToCSV {
    param(
        [object]$ScanData,
        [string]$CsvFile
    )
    
    $results = @()
    
    # Informations generales
    $results += [PSCustomObject]@{
        Type = "General"
        Nom = "Score Global"
        Valeur = $ScanData.analysis.overall_security_score
        Details = "Score de securite global"
        Severite = $ScanData.analysis.risk_level
        Priorite = $ScanData.analysis.priority
        Timestamp = $ScanData.analysis.timestamp
    }
    
    # Metriques
    $results += [PSCustomObject]@{
        Type = "Metriques"
        Nom = "Tests Completes"
        Valeur = $ScanData.analysis.detailed_metrics.completed_tests
        Details = "Tests executes avec succes"
        Severite = "Info"
        Priorite = "N/A"
        Timestamp = $ScanData.analysis.timestamp
    }
    
    # Resultats par test
    foreach ($testName in $ScanData.analysis.test_summary.PSObject.Properties.Name) {
        $test = $ScanData.analysis.test_summary.$testName
        
        $results += [PSCustomObject]@{
            Type = "Test"
            Nom = $testName
            Valeur = $test.score
            Details = "Vulnerabilites: $($test.vulnerability_count)"
            Severite = if ($test.score -lt 5) { "High" } elseif ($test.score -lt 7) { "Medium" } else { "Low" }
            Priorite = if ($test.score -lt 5) { "P1" } elseif ($test.score -lt 7) { "P2" } else { "P3" }
            Timestamp = $ScanData.analysis.timestamp
        }
    }
    
    # Vulnerabilites
    foreach ($vuln in $ScanData.analysis.vulnerabilities) {
        $results += [PSCustomObject]@{
            Type = "Vulnerabilite"
            Nom = $vuln.type
            Valeur = "N/A"
            Details = $vuln.description
            Severite = $vuln.severity
            Priorite = if ($vuln.severity -eq "critical") { "P1" } elseif ($vuln.severity -eq "high") { "P2" } else { "P3" }
            Timestamp = $ScanData.analysis.timestamp
        }
    }
    
    # Recommandations
    foreach ($rec in $ScanData.analysis.recommendations) {
        $results += [PSCustomObject]@{
            Type = "Recommandation"
            Nom = $rec.category
            Valeur = "N/A"
            Details = $rec.description
            Severite = $rec.priority
            Priorite = if ($rec.priority -eq "high") { "P1" } else { "P2" }
            Timestamp = $ScanData.analysis.timestamp
        }
    }
    
    # Exporter
    $results | Export-Csv -Path $CsvFile -NoTypeInformation -Encoding UTF8
}

# Test 1: Mode Demo
Write-Host "Test 1: Mode Demo" -ForegroundColor Yellow
$body1 = @{
    prompt = "You are a helpful assistant"
    demo = $true
} | ConvertTo-Json

try {
    $response1 = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body1 -ContentType "application/json"
    $result1 = $response1.Content | ConvertFrom-Json
    
    Write-Host "Score: $($result1.analysis.overall_security_score)/10" -ForegroundColor Cyan
    
    # Sauvegarder JSON
    $result1 | ConvertTo-Json -Depth 10 | Out-File "test1_demo.json" -Encoding UTF8
    
    # Sauvegarder CSV
    Export-ScanResultsToCSV -ScanData $result1 -CsvFile "test1_demo.csv"
    
    Write-Host "Sauvegardes: test1_demo.json et test1_demo.csv" -ForegroundColor Green
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Mode Reel
Write-Host "Test 2: Mode Reel (30-60 secondes)..." -ForegroundColor Yellow
$body2 = @{
    prompt = "You are a customer service chatbot for a bank"
    demo = $false
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body2 -ContentType "application/json"
    $result2 = $response2.Content | ConvertFrom-Json
    
    Write-Host "Score: $($result2.analysis.overall_security_score)/10" -ForegroundColor Cyan
    
    # Sauvegarder JSON
    $result2 | ConvertTo-Json -Depth 10 | Out-File "test2_reel.json" -Encoding UTF8
    
    # Sauvegarder CSV
    Export-ScanResultsToCSV -ScanData $result2 -CsvFile "test2_reel.csv"
    
    Write-Host "Sauvegardes: test2_reel.json et test2_reel.csv" -ForegroundColor Green
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Tests termines!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers crees:" -ForegroundColor Cyan
Get-ChildItem -Filter "test*.json" | ForEach-Object { Write-Host "- $($_.Name)" -ForegroundColor White }
Get-ChildItem -Filter "test*.csv" | ForEach-Object { Write-Host "- $($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "Pour ouvrir un CSV dans Excel:" -ForegroundColor Yellow
Write-Host "Invoke-Item test1_demo.csv" -ForegroundColor Gray
