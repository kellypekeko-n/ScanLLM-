# Phase 2: Export CSV et Integration NIST/CVE

Date: 23 octobre 2025

---

## Objectifs Phase 2

1. Export CSV enrichi avec toutes les metriques
2. Mapping vers NIST AI Risk Management Framework
3. Lookup CVE automatique
4. Classification selon OWASP Top 10 for LLM
5. Recommandations de remediation

---

## Composants a Developper

### 1. CSV Exporter (Priorite 1)

**Fichier:** `analyzer/csv_exporter.py`

**Fonctionnalites:**
- Export des vulnerabilites au format CSV
- Colonnes: ID, Type, Severity, CWE, CVE, NIST_Ref, Description, Remediation, Priority, Status
- Support de l'export par lot
- Historique des exports

**API Endpoint:**
```
POST /api/export/csv
Body: { "scan_id": "...", "format": "detailed" }
Response: CSV file download
```

---

### 2. NIST Mapper (Priorite 1)

**Fichier:** `analyzer/nist_mapper.py`

**Fonctionnalites:**
- Mapping vers NIST AI RMF
- Mapping vers NIST Cybersecurity Framework
- Classification des risques selon NIST
- Recommandations NIST

**Base de donnees:**
```json
{
  "prompt_injection": {
    "nist_ai_rmf": "GOVERN-1.2",
    "nist_csf": "PR.DS-5",
    "description": "Input validation and sanitization"
  },
  "data_leakage": {
    "nist_ai_rmf": "MAP-2.3",
    "nist_csf": "PR.DS-1",
    "description": "Data protection and privacy"
  }
}
```

---

### 3. CVE Lookup (Priorite 2)

**Fichier:** `analyzer/cve_lookup.py`

**Fonctionnalites:**
- Recherche CVE dans la base MITRE
- Cache local des CVE
- Mise a jour periodique
- Scoring CVSS

**API Utilisee:**
- NIST NVD API: https://nvd.nist.gov/developers
- MITRE CVE API: https://cve.mitre.org/

**Exemple:**
```python
cve_info = lookup_cve("prompt_injection", "gpt-3.5-turbo")
# Retourne: CVE-2023-XXXX avec score CVSS 7.5
```

---

### 4. OWASP LLM Mapper (Priorite 2)

**Fichier:** `analyzer/owasp_mapper.py`

**Fonctionnalites:**
- Mapping vers OWASP Top 10 for LLM Applications
- Classification des vulnerabilites
- Recommandations OWASP

**OWASP Top 10 for LLM:**
1. LLM01: Prompt Injection
2. LLM02: Insecure Output Handling
3. LLM03: Training Data Poisoning
4. LLM04: Model Denial of Service
5. LLM05: Supply Chain Vulnerabilities
6. LLM06: Sensitive Information Disclosure
7. LLM07: Insecure Plugin Design
8. LLM08: Excessive Agency
9. LLM09: Overreliance
10. LLM10: Model Theft

---

### 5. Vulnerability Database (Priorite 1)

**Fichier:** `analyzer/vulnerability_database.json`

**Structure:**
```json
{
  "vulnerabilities": [
    {
      "id": "LLMSEC-001",
      "name": "Prompt Injection",
      "cwe": "CWE-77",
      "owasp": "LLM01",
      "nist_ai_rmf": "GOVERN-1.2",
      "nist_csf": "PR.DS-5",
      "severity": "High",
      "description": "Attacker can manipulate LLM behavior through crafted prompts",
      "remediation": "Implement input validation and prompt sanitization",
      "references": [
        "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        "https://nvd.nist.gov/vuln/detail/CVE-2023-XXXX"
      ]
    }
  ]
}
```

---

## Format CSV Final

### Colonnes du Rapport CSV

| Colonne | Description | Exemple |
|---------|-------------|---------|
| Scan_ID | ID unique du scan | SCAN-20251023-001 |
| Timestamp | Date et heure | 2025-10-23 15:30:00 |
| Vulnerability_ID | ID de la vulnerabilite | LLMSEC-001 |
| Type | Type de vulnerabilite | Prompt Injection |
| Severity | Severite | High |
| Priority | Priorite | P1 |
| CWE | Common Weakness Enumeration | CWE-77 |
| CVE | Common Vulnerabilities and Exposures | CVE-2023-XXXX |
| CVSS_Score | Score CVSS | 7.5 |
| OWASP_Category | Categorie OWASP | LLM01 |
| NIST_AI_RMF | Reference NIST AI RMF | GOVERN-1.2 |
| NIST_CSF | Reference NIST CSF | PR.DS-5 |
| Description | Description detaillee | Attacker can manipulate... |
| Impact | Impact potentiel | Data leakage, unauthorized access |
| Remediation | Recommandations | Implement input validation |
| Status | Statut | Open / In Progress / Closed |
| Assigned_To | Assigne a | Security Team |
| Due_Date | Date limite | 2025-11-01 |

---

## API Endpoints a Ajouter

### 1. Export CSV
```
POST /api/export/csv
Body: {
  "scan_id": "SCAN-20251023-001",
  "format": "detailed",  // ou "summary"
  "include_remediation": true
}
Response: CSV file download
```

### 2. Get NIST Mapping
```
GET /api/vulnerability/{vuln_id}/nist
Response: {
  "nist_ai_rmf": "GOVERN-1.2",
  "nist_csf": "PR.DS-5",
  "description": "..."
}
```

### 3. Get CVE Info
```
GET /api/vulnerability/{vuln_id}/cve
Response: {
  "cve_id": "CVE-2023-XXXX",
  "cvss_score": 7.5,
  "description": "...",
  "references": [...]
}
```

### 4. Get OWASP Mapping
```
GET /api/vulnerability/{vuln_id}/owasp
Response: {
  "owasp_category": "LLM01",
  "name": "Prompt Injection",
  "description": "..."
}
```

---

## Exemple de Workflow Complet

```
1. Client envoie un prompt a scanner
   POST /api/scan
   Body: { "prompt": "You are a helpful assistant" }

2. Plateforme execute les 7 tests
   - Prompt Injection
   - Safety Bypass
   - Role Sensitivity
   - Extraction Probe
   - RAG Audit
   - Structural Probe
   - Fingerprinting

3. Analyzer analyse les resultats
   - Score global: 9.03/10
   - Vulnerabilites detectees: 2
   - Niveau de risque: CRITICAL

4. NIST Mapper enrichit les vulnerabilites
   - Mapping vers NIST AI RMF
   - Mapping vers NIST CSF

5. CVE Lookup recherche les CVE
   - CVE-2023-XXXX pour prompt injection
   - CVE-2024-YYYY pour data leakage

6. OWASP Mapper classifie
   - LLM01: Prompt Injection
   - LLM06: Sensitive Information Disclosure

7. CSV Exporter genere le rapport
   - Fichier CSV avec toutes les colonnes
   - Pret pour Excel/JIRA/ServiceNow

8. Client telecharge le rapport CSV
   GET /api/export/csv?scan_id=SCAN-20251023-001
```

---

## Technologies a Utiliser

### 1. Pour CVE Lookup
- NIST NVD API
- MITRE CVE API
- Cache Redis pour les resultats

### 2. Pour Export CSV
- Python csv module
- pandas pour manipulation avancee
- openpyxl pour export Excel (optionnel)

### 3. Pour Mapping NIST/OWASP
- Base de donnees JSON locale
- Mise a jour periodique depuis les sources officielles

---

## Estimation du Temps

| Tache | Temps Estime | Priorite |
|-------|--------------|----------|
| CSV Exporter | 4-6 heures | P1 |
| NIST Mapper | 6-8 heures | P1 |
| Vulnerability Database | 4-6 heures | P1 |
| CVE Lookup | 8-10 heures | P2 |
| OWASP Mapper | 4-6 heures | P2 |
| Tests et Integration | 6-8 heures | P1 |
| Documentation | 4-6 heures | P2 |
| **TOTAL** | **36-50 heures** | **~1 semaine** |

---

## Prochaines Etapes

1. Creer la base de donnees de vulnerabilites
2. Implementer le CSV Exporter
3. Implementer le NIST Mapper
4. Tester l'integration complete
5. Deployer sur Azure

---

Fin du document
