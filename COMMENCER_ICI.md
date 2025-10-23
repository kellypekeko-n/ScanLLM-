# Commencer Ici - Guide Rapide

## Votre Application est Deployee et Fonctionnelle

URL de l'application: https://llm-security-plateform.azurewebsites.net

---

## Etape 1: Tester l'Application (5 minutes)

### Test 1: Ouvrir dans le Navigateur

1. Ouvrez votre navigateur
2. Allez sur: https://llm-security-plateform.azurewebsites.net/health
3. Vous devriez voir: "status": "healthy"

### Test 2: Lancer un Scan Simple

Ouvrez PowerShell et executez:

```powershell
$body = @{
    prompt = "You are a helpful AI assistant"
    demo = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri https://llm-security-plateform.azurewebsites.net/api/scan -Method POST -Body $body -ContentType "application/json"
```

Resultat: Vous verrez un score de securite (environ 9/10)

---

## Etape 2: Nettoyer les Fichiers Inutiles (2 minutes)

Executez le script de nettoyage:

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM"
.\cleanup.ps1
```

Cela supprimera:
- Dossiers cache Python
- Environnement virtuel local
- Logs et resultats temporaires
- Fichiers Python inutilises

---

## Etape 3: Consulter la Documentation

### Pour les Tests Detailles
Ouvrez: `llm-security-platform\GUIDE_TEST_SIMPLE.md`

### Pour le Rapport de Deploiement
Ouvrez: `llm-security-platform\DEPLOYMENT_REPORT.md`

### Pour le Guide de Demarrage
Ouvrez: `llm-security-platform\GUIDE_DEMARRAGE_RAPIDE.md`

---

## Commandes Utiles

### Redemarrer l'Application
```powershell
az webapp restart --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Voir les Logs
```powershell
az webapp log tail --name LLm-security-plateform --resource-group LLM-Security-RG
```

### Verifier le Status
```powershell
az webapp show --name LLm-security-plateform --resource-group LLM-Security-RG --query "state"
```

---

## Endpoints Disponibles

1. Page d'accueil: https://llm-security-plateform.azurewebsites.net/
2. Health check: https://llm-security-plateform.azurewebsites.net/health
3. Status: https://llm-security-plateform.azurewebsites.net/api/status
4. Tests: https://llm-security-plateform.azurewebsites.net/api/tests
5. Scan: https://llm-security-plateform.azurewebsites.net/api/scan (POST)

---

## Prochaines Etapes

1. Tester tous les endpoints (voir GUIDE_TEST_SIMPLE.md)
2. Nettoyer les fichiers inutiles (executer cleanup.ps1)
3. Lire le rapport de deploiement (DEPLOYMENT_REPORT.md)
4. Planifier la Phase 2 (monitoring, securite, dashboard)

---

## Besoin d'Aide?

Consultez les guides dans le dossier `llm-security-platform/`:
- GUIDE_TEST_SIMPLE.md - Tests etape par etape
- DEPLOYMENT_REPORT.md - Rapport complet
- PHASE1_DEPLOYMENT_GUIDE.md - Guide technique
- GUIDE_DEMARRAGE_RAPIDE.md - Demarrage rapide

---

Fin du guide
