# Script de conversion JSON vers CSV
# Convertit les resultats de scan en fichiers CSV pour Excel

Write-Host "Conversion des resultats JSON vers CSV..." -ForegroundColor Green
Write-Host ""

# Fonction pour convertir un fichier JSON en CSV
function Convert-ScanToCSV {
    param(
        [string]$JsonFile,
        [string]$CsvFile
    )
    
    Write-Host "Traitement de: $JsonFile" -ForegroundColor Yellow
    
    try {
        # Lire le fichier JSON
        $data = Get-Content $JsonFile | ConvertFrom-Json
        
        # Creer un tableau pour les resultats
        $results = @()
        
        # Informations generales
        $generalInfo = [PSCustomObject]@{
            Type = "General"
            Nom = "Score Global"
            Valeur = $data.analysis.overall_security_score
            Details = "Score de securite global"
            Severite = $data.analysis.risk_level
            Priorite = $data.analysis.priority
        }
        $results += $generalInfo
        
        # Ajouter les metriques
        $metrics = [PSCustomObject]@{
            Type = "Metriques"
            Nom = "Tests Completes"
            Valeur = $data.analysis.detailed_metrics.completed_tests
            Details = "Nombre de tests executes avec succes"
            Severite = "Info"
            Priorite = "N/A"
        }
        $results += $metrics
        
        $avgScore = [PSCustomObject]@{
            Type = "Metriques"
            Nom = "Score Moyen"
            Valeur = $data.analysis.detailed_metrics.average_score
            Details = "Score moyen de tous les tests"
            Severite = "Info"
            Priorite = "N/A"
        }
        $results += $avgScore
        
        # Ajouter les resultats par test
        foreach ($testName in $data.analysis.test_summary.PSObject.Properties.Name) {
            $test = $data.analysis.test_summary.$testName
            
            $testResult = [PSCustomObject]@{
                Type = "Test"
                Nom = $testName
                Valeur = $test.score
                Details = "Vulnerabilites: $($test.vulnerability_count)"
                Severite = if ($test.score -lt 5) { "High" } elseif ($test.score -lt 7) { "Medium" } else { "Low" }
                Priorite = if ($test.score -lt 5) { "P1" } elseif ($test.score -lt 7) { "P2" } else { "P3" }
            }
            $results += $testResult
        }
        
        # Ajouter les vulnerabilites
        if ($data.analysis.vulnerabilities.Count -gt 0) {
            foreach ($vuln in $data.analysis.vulnerabilities) {
                $vulnResult = [PSCustomObject]@{
                    Type = "Vulnerabilite"
                    Nom = $vuln.type
                    Valeur = "N/A"
                    Details = $vuln.description
                    Severite = $vuln.severity
                    Priorite = if ($vuln.severity -eq "critical") { "P1" } elseif ($vuln.severity -eq "high") { "P2" } else { "P3" }
                }
                $results += $vulnResult
            }
        }
        
        # Ajouter les recommandations
        if ($data.analysis.recommendations.Count -gt 0) {
            foreach ($rec in $data.analysis.recommendations) {
                $recResult = [PSCustomObject]@{
                    Type = "Recommandation"
                    Nom = $rec.category
                    Valeur = "N/A"
                    Details = $rec.description
                    Severite = $rec.priority
                    Priorite = if ($rec.priority -eq "high") { "P1" } elseif ($rec.priority -eq "medium") { "P2" } else { "P3" }
                }
                $results += $recResult
            }
        }
        
        # Exporter vers CSV
        $results | Export-Csv -Path $CsvFile -NoTypeInformation -Encoding UTF8
        Write-Host "CSV cree: $CsvFile" -ForegroundColor Green
        
    }
    catch {
        Write-Host "Erreur lors de la conversion de $JsonFile : $_" -ForegroundColor Red
    }
}

# Convertir tous les fichiers JSON de test
$jsonFiles = Get-ChildItem -Filter "test*.json"

if ($jsonFiles.Count -eq 0) {
    Write-Host "Aucun fichier JSON trouve. Executez d'abord test_scan.ps1" -ForegroundColor Red
    exit
}

foreach ($file in $jsonFiles) {
    $csvFile = $file.Name -replace '\.json$', '.csv'
    Convert-ScanToCSV -JsonFile $file.Name -CsvFile $csvFile
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Conversion terminee!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers CSV crees:" -ForegroundColor Cyan
Get-ChildItem -Filter "test*.csv" | ForEach-Object { Write-Host "- $($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "Pour ouvrir dans Excel:" -ForegroundColor Yellow
Write-Host "Invoke-Item test1_demo.csv" -ForegroundColor Gray
