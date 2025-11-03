# 🔍 System Scan (Trivy-Style) - Implémentation

## 📋 Vue d'Ensemble

Le module **"Scan a System"** fonctionne maintenant comme **Trivy** - il scanne un système et génère une liste de CVE au format JSON, **sans utiliser les 7 tests prédéfinis**.

---

## 🎯 Différences entre les Deux Types de Scan

### 1. **Test a Prompt** (`/scan`)
```
Type: Scan de sécurité LLM
Tests: 7 tests prédéfinis
  - Prompt Injection
  - Jailbreak Detection
  - Toxicity Analysis
  - PII Leakage
  - Hallucination Detection
  - Safety Bypass
  - Structural Probe

Output:
  - Score de sécurité /10
  - Niveau de risque
  - Vulnérabilités détectées
  - Recommandations
  - Rapports de conformité (NIST/OWASP)
  
Export:
  - CSV
  - PDF
```

### 2. **Scan a System** (`/scan-system`) ⭐ NOUVEAU
```
Type: Scan système (Trivy-style)
Tests: Analyse CVE du système
  - Scan des composants
  - Détection de vulnérabilités connues
  - Mapping CVE/CVSS
  - Analyse de sévérité

Output:
  - Liste de CVE détectés
  - Scores CVSS
  - Composants affectés
  - Versions corrigées
  - Références NVD/OWASP
  
Export:
  - JSON standard
  - Format Trivy JSON
```

---

## 📦 Fichiers Créés

### 1. **systemScanService.js**
Service pour scanner les systèmes type Trivy.

**Fonctions**:
- `scanSystem(config)` - Lance un scan système
- `exportSystemScanJSON(results)` - Export JSON standard
- `exportTrivyFormat(results)` - Export format Trivy
- `generateMockCVEs()` - Génère des CVE (temporaire)

**Format de Sortie**:
```json
{
  "scan_id": "sys_1730659200000",
  "system_name": "miss yoyo",
  "endpoint": "https://api.example.com",
  "model": "gpt-3.5-turbo",
  "scan_date": "2025-11-03T19:00:00.000Z",
  "scan_type": "system",
  "summary": {
    "total_vulnerabilities": 5,
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1
  },
  "vulnerabilities": [
    {
      "cve_id": "CVE-2024-1234",
      "title": "LLM Prompt Injection Vulnerability",
      "description": "...",
      "severity": "CRITICAL",
      "cvss_score": 9.8,
      "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      "affected_component": "LLM Input Handler",
      "fixed_version": "N/A",
      "references": [...],
      "cwe": "CWE-20: Improper Input Validation",
      "published_date": "2024-01-15",
      "last_modified": "2024-02-20"
    }
  ],
  "metadata": {
    "scanner": "LLM Security Platform (Trivy-style)",
    "version": "1.0.0",
    "scan_duration": "3.2s"
  }
}
```

### 2. **SystemScanResults.jsx**
Composant React pour afficher les résultats du scan système.

**Sections**:
- Header avec infos système
- Cartes de résumé (Total, Critical, High, Medium, Low)
- Boutons d'export (JSON, Trivy Format, New Scan)
- Liste détaillée des CVE:
  - CVE ID
  - Titre et description
  - Sévérité avec badge coloré
  - Score CVSS
  - Composant affecté
  - Version corrigée
  - CWE
  - Vecteur CVSS
  - Dates (publié/modifié)
  - Références (NVD, OWASP)
- Métadonnées du scan

### 3. **ScanSystem.jsx** (Modifié)
Page de scan système mise à jour.

**Changements**:
- Utilise `systemScanService` au lieu de `apiService`
- Affiche `SystemScanResults` après le scan
- Cache le formulaire quand les résultats sont affichés
- Sauvegarde dans localStorage avec `type: 'system'`

---

## 🔄 Flux de Fonctionnement

```
1. Homepage
   ↓
2. Cliquer sur "Scan a System"
   ↓
3. Remplir le formulaire:
   - System Name (requis)
   - Endpoint (optionnel)
   - Model (optionnel)
   - API Key (optionnel)
   ↓
4. Cliquer sur "Launch Scan"
   ↓
5. Scan système lancé (3s)
   ↓
6. CVE générés et analysés
   ↓
7. Résultats affichés:
   - Résumé des vulnérabilités
   - Liste détaillée des CVE
   - Boutons d'export
   ↓
8. Export possible:
   - JSON standard
   - Format Trivy
   ↓
9. Sauvegardé dans historique
```

---

## 📊 Format Trivy JSON

Le format Trivy est compatible avec l'outil Trivy d'Aqua Security:

```json
{
  "SchemaVersion": 2,
  "ArtifactName": "miss yoyo",
  "ArtifactType": "llm-system",
  "Metadata": {
    "OS": {
      "Family": "llm",
      "Name": "miss yoyo"
    },
    "ImageConfig": {
      "architecture": "llm",
      "created": "2025-11-03T19:00:00.000Z"
    }
  },
  "Results": [
    {
      "Target": "miss yoyo",
      "Class": "llm-vuln",
      "Type": "llm",
      "Vulnerabilities": [
        {
          "VulnerabilityID": "CVE-2024-1234",
          "PkgName": "LLM Input Handler",
          "InstalledVersion": "current",
          "FixedVersion": "N/A",
          "Severity": "CRITICAL",
          "Title": "LLM Prompt Injection Vulnerability",
          "Description": "...",
          "References": [...],
          "PrimaryURL": "https://nvd.nist.gov/vuln/detail/CVE-2024-1234",
          "CVSS": {
            "nvd": {
              "V3Vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
              "V3Score": 9.8
            }
          },
          "CweIDs": ["CWE-20: Improper Input Validation"],
          "PublishedDate": "2024-01-15",
          "LastModifiedDate": "2024-02-20"
        }
      ]
    }
  ]
}
```

---

## 🎨 Interface Utilisateur

### Cartes de Résumé
```
┌─────────┬──────────┬──────┬────────┬─────┐
│  Total  │ Critical │ High │ Medium │ Low │
│    5    │    1     │  2   │   1    │  1  │
└─────────┴──────────┴──────┴────────┴─────┘
```

### Boutons d'Export
```
[📥 Download JSON] [📄 Download Trivy Format] [🔄 New Scan]
```

### Liste CVE
```
🔴 CVE-2024-1234                    [CRITICAL] CVSS: 9.8
   LLM Prompt Injection Vulnerability
   
   Description: The system is vulnerable to...
   
   ┌─────────────────────┬──────────────┬────────────┐
   │ Affected Component  │ Fixed Version│    CWE     │
   │ LLM Input Handler   │     N/A      │  CWE-20    │
   └─────────────────────┴──────────────┴────────────┘
   
   CVSS Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
   
   Published: 15/01/2024 | Last Modified: 20/02/2024
   
   References: 🔗 NVD  🔗 OWASP
```

---

## 🧪 Test de la Fonctionnalité

```powershell
# Démarrer le frontend
cd frontend
npm start
```

**Étapes**:
1. Va sur http://localhost:3000
2. Clique sur "Scan a System"
3. Remplis:
   - System Name: "miss yoyo"
   - Endpoint: (optionnel)
   - Model: (optionnel)
4. Clique sur "Launch Scan"
5. Attends 3 secondes (simulation)
6. **Résultats affichés!** ✅
7. Clique sur "Download JSON" → Fichier téléchargé
8. Clique sur "Download Trivy Format" → Format Trivy téléchargé
9. Va sur "/history" → Scan sauvegardé avec type "system"

---

## 🔮 Intégration Backend (À Faire)

Pour l'instant, le scan utilise des CVE mockés. Pour une vraie intégration:

### Endpoint Backend Requis
```python
@app.route('/api/scan/system', methods=['POST'])
def scan_system():
    """
    Scanne un système et retourne les CVE
    """
    data = request.json
    system_name = data.get('name')
    endpoint = data.get('base_url')
    model = data.get('model')
    api_key = data.get('api_key')
    
    # 1. Analyser le système
    # 2. Interroger base CVE (NVD API)
    # 3. Mapper aux composants
    # 4. Calculer scores CVSS
    # 5. Retourner résultats
    
    return jsonify({
        'scan_id': f'sys_{int(time.time())}',
        'system_name': system_name,
        'vulnerabilities': [...],
        'summary': {...},
        'metadata': {...}
    })
```

### API NVD (National Vulnerability Database)
```python
import requests

def query_nvd_api(cpe_name):
    """
    Interroge l'API NVD pour récupérer les CVE
    """
    url = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
    params = {
        'cpeName': cpe_name,
        'resultsPerPage': 100
    }
    headers = {
        'apiKey': 'YOUR_NVD_API_KEY'
    }
    
    response = requests.get(url, params=params, headers=headers)
    return response.json()
```

---

## 📈 Avantages de Cette Approche

### ✅ Séparation Claire
- **Test a Prompt**: Tests de sécurité LLM
- **Scan a System**: Analyse CVE type Trivy

### ✅ Format Standard
- JSON compatible avec outils existants
- Format Trivy pour intégration CI/CD

### ✅ Extensible
- Facile d'ajouter de nouveaux CVE
- Intégration future avec NVD API

### ✅ Professionnel
- Interface claire et détaillée
- Export multiple formats
- Métadonnées complètes

---

## 🎯 Prochaines Étapes

### Court Terme
1. Intégrer vraie API NVD
2. Ajouter scan de dépendances
3. Détection automatique de composants

### Moyen Terme
1. Scan de containers Docker
2. Scan de code source
3. Intégration GitHub Actions

### Long Terme
1. Base de données CVE locale
2. Machine Learning pour détection
3. Scan en temps réel

---

## 📝 Notes Importantes

### CVE Mockés
Les CVE actuels sont des exemples. En production:
- Utiliser API NVD officielle
- Mettre à jour régulièrement
- Vérifier les scores CVSS

### Performance
- Scan actuel: 3 secondes (simulé)
- Scan réel: Dépend de la taille du système
- Optimiser avec cache et parallélisation

### Sécurité
- Ne pas exposer les API keys
- Valider toutes les entrées
- Rate limiting sur les scans

---

## 🏆 Résultat Final

**Le module "Scan a System" fonctionne maintenant comme Trivy!** 🎉

- ✅ Scan système indépendant
- ✅ Génération de CVE
- ✅ Format JSON standard
- ✅ Format Trivy compatible
- ✅ Interface professionnelle
- ✅ Export multiple formats
- ✅ Sauvegarde dans historique

**Prêt pour la production (avec intégration API NVD)!** 🚀

---

**Date**: 3 Novembre 2025  
**Version**: 2.1.0  
**Status**: ✅ FONCTIONNEL (CVE mockés)
