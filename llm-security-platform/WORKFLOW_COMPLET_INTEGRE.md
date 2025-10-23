# Workflow Complet Integre - LLM Security Platform

Date: 23 octobre 2025

---

## Vision Complete

Plateforme SaaS complete pour scanner, surveiller et securiser les systemes utilisant des LLM avec interface web moderne.

---

## Workflow Utilisateur Complet

### Etape 1: Arrivee sur la Plateforme

```
Utilisateur → https://llm-security-platform.com
   │
   ├─ Page d'accueil moderne
   ├─ Presentation des fonctionnalites
   ├─ "Comment ca fonctionne" en 4 etapes
   └─ CTA: "Commencer un Scan"
```

**Interface:**
```
┌────────────────────────────────────────────────────────────┐
│  LLM Security Platform                                     │
│  Scannez, surveillez et securisez vos systemes LLM        │
│                                                            │
│  [Commencer un Scan]  [Voir les Solutions]                │
│                                                            │
│  ✓ 7 Tests de Securite                                    │
│  ✓ Solutions avec Code                                    │
│  ✓ Mapping NIST/CVE/OWASP                                 │
└────────────────────────────────────────────────────────────┘
```

---

### Etape 2: Creation de Compte / Connexion (Phase 3)

```
Utilisateur clique sur "Commencer"
   │
   ├─ Nouveau? → Formulaire d'inscription
   │   ├─ Email
   │   ├─ Mot de passe
   │   └─ Confirmation
   │
   └─ Deja inscrit? → Formulaire de connexion
       ├─ Email
       └─ Mot de passe
```

**API Endpoint (Phase 3):**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

### Etape 3: Ajouter un Systeme a Scanner

```
Utilisateur connecte → Dashboard
   │
   └─ Clic sur "Ajouter un Systeme"
```

**Formulaire:**
```
┌─────────────────────────────────────┐
│ Ajouter un Systeme                  │
├─────────────────────────────────────┤
│                                     │
│ Nom: *                              │
│ [Production Chatbot            ]    │
│                                     │
│ System Prompt: *                    │
│ [You are a helpful assistant...     │
│  ...                           ]    │
│                                     │
│ Endpoint (optionnel):               │
│ [https://api.example.com/llm   ]    │
│                                     │
│ API Key (optionnel):                │
│ [**********************         ]    │
│                                     │
│ Modele:                             │
│ [GPT-3.5-turbo ▼]                   │
│                                     │
│ [Tester la Connexion]               │
│ [Lancer le Scan Maintenant]         │
│ [Sauvegarder et Scanner Plus Tard]  │
│                                     │
└─────────────────────────────────────┘
```

**API Endpoint:**
```
POST /api/systems
Body: {
  "name": "Production Chatbot",
  "prompt": "You are a helpful assistant...",
  "endpoint": "https://api.example.com/llm",
  "api_key": "sk-...",
  "model": "gpt-3.5-turbo",
  "scan_now": true
}
```

---

### Etape 4: Scan en Cours

```
Systeme ajoute → Scan demarre automatiquement
   │
   ├─ Execution des 7 tests de securite
   ├─ Affichage de la progression en temps reel
   └─ Duree: 30-60 secondes (mode reel) ou 8-10 secondes (mode demo)
```

**Interface:**
```
┌─────────────────────────────────────┐
│ Scan en cours...                    │
│ ████████████░░░░░░░░ 60%           │
│                                     │
│ ✓ Prompt Injection - Termine        │
│ ✓ Safety Bypass - Termine           │
│ ✓ Role Sensitivity - Termine        │
│ ✓ Extraction Probe - Termine        │
│ ⏳ RAG Audit - En cours...          │
│ ⏳ Structural Probe - En attente    │
│ ⏳ Fingerprinting - En attente      │
│                                     │
│ Temps ecoule: 35s / ~60s            │
└─────────────────────────────────────┘
```

**Backend:**
```
1. Execute les 7 tests en parallele
2. Collecte les resultats
3. Calcule le score global
4. Detecte les vulnerabilites
```

---

### Etape 5: Resultats du Scan

```
Scan termine → Affichage des resultats
   │
   ├─ Score global de securite
   ├─ Niveau de risque
   ├─ Liste des vulnerabilites
   ├─ Resultats par test
   └─ Recommandations
```

**Interface:**
```
┌─────────────────────────────────────┐
│ Resultats du Scan                   │
│ Systeme: Production Chatbot         │
├─────────────────────────────────────┤
│                                     │
│ Score de Securite: 7.5/10 ⚠️       │
│ Niveau de Risque: MEDIUM            │
│ Priorite: P2                        │
│                                     │
│ Tests: 7  Vulnerabilites: 3         │
│                                     │
│ Vulnerabilites Detectees:           │
│                                     │
│ 🔴 PROMPT INJECTION (HIGH)          │
│    CWE-77 | CVE-2023-29374          │
│    [Voir les solutions →]           │
│                                     │
│ 🟡 DATA LEAKAGE (MEDIUM)            │
│    CWE-200 | CVE-2024-12345         │
│    [Voir les solutions →]           │
│                                     │
│ 🟢 RATE LIMITING (LOW)              │
│    CWE-770 | CVE-2023-45678         │
│    [Voir les solutions →]           │
│                                     │
│ [Telecharger CSV]                   │
│ [Activer la Surveillance]           │
│ [Nouveau Scan]                      │
│                                     │
└─────────────────────────────────────┘
```

---

### Etape 6: Analyse et Enrichissement (Automatique)

```
Resultats bruts → Enrichissement automatique
   │
   ├─ Mapping vers NIST AI RMF
   ├─ Lookup CVE dans MITRE
   ├─ Classification OWASP Top 10 for LLM
   ├─ Scoring CVSS
   └─ Recuperation des solutions
```

**Backend Process:**
```python
# 1. Mapping NIST
for vuln in vulnerabilities:
    vuln['nist_ai_rmf'] = nist_mapper.get_mapping(vuln.type)
    vuln['nist_csf'] = nist_mapper.get_csf_mapping(vuln.type)

# 2. CVE Lookup
    vuln['cve'] = cve_lookup.search(vuln.type, model_name)
    vuln['cvss_score'] = cvss_calculator.calculate(vuln)

# 3. OWASP Classification
    vuln['owasp_category'] = owasp_mapper.classify(vuln.type)

# 4. Solutions
    vuln['solutions'] = solutions_db.get_solutions(vuln.type)
```

---

### Etape 7: Generation du Rapport CSV

```
Utilisateur clique sur "Telecharger CSV"
   │
   └─ Generation du rapport enrichi
```

**Format CSV:**
```csv
Scan_ID,Timestamp,System_Name,Vulnerability_ID,Type,Severity,Priority,CWE,CVE,CVSS_Score,OWASP_Category,NIST_AI_RMF,NIST_CSF,Description,Details,Impact,Remediation,Solution_Count,Status,Assigned_To,Due_Date
SCAN-20251023-001,2025-10-23T15:30:00,Production Chatbot,VULN-PROMPT_INJECTION-20251023,prompt_injection,High,P1,CWE-77,CVE-2023-29374,7.5,LLM01,GOVERN-1.2,PR.DS-5,Attacker can manipulate LLM behavior,...,Injection detected,Unauthorized access; Data leakage,Implement input validation,3,Open,,2025-10-30
```

**API Endpoint:**
```
POST /api/export/csv
Body: {
  "scan_results": {...},
  "system_name": "Production Chatbot",
  "scan_id": "SCAN-20251023-001"
}
Response: CSV file download
```

---

### Etape 8: Solutions Proposees

```
Utilisateur clique sur "Voir les solutions"
   │
   └─ Affichage des solutions detaillees
```

**Interface:**
```
┌─────────────────────────────────────┐
│ Solutions: Prompt Injection         │
│ Severite: HIGH                      │
│ CWE: CWE-77 | OWASP: LLM01          │
├─────────────────────────────────────┤
│                                     │
│ Impact Potentiel:                   │
│ • Contournement des restrictions    │
│ • Execution de commandes non auth.  │
│ • Acces a des donnees sensibles     │
│                                     │
│ 💡 Solution 1: Validation d'Input   │
│ Difficulte: Medium                  │
│ Temps: 2-4 heures                   │
│                                     │
│ [▼ Voir le code Python]             │
│                                     │
│ def sanitize_input(text):           │
│     # Validation code...            │
│     return sanitized_text           │
│                                     │
│ [Copier le code]                    │
│                                     │
│ 💡 Solution 2: Prompt Templates     │
│ [▼ Voir le code]                    │
│                                     │
│ 💡 Solution 3: Content Filter       │
│ [▼ Voir le code]                    │
│                                     │
│ Checklist de Prevention:            │
│ ☐ Valider tous les inputs           │
│ ☐ Utiliser des templates            │
│ ☐ Implementer un content filter     │
│ ☐ Logger les tentatives             │
│                                     │
│ [Marquer comme resolu]              │
│                                     │
└─────────────────────────────────────┘
```

---

### Etape 9: Activer la Surveillance Automatique

```
Utilisateur clique sur "Activer la Surveillance"
   │
   └─ Configuration de la surveillance
```

**Interface:**
```
┌─────────────────────────────────────┐
│ 🔔 Activer la Surveillance          │
├─────────────────────────────────────┤
│                                     │
│ Frequence de scan:                  │
│ ○ Horaire                           │
│ ● Quotidien                         │
│ ○ Hebdomadaire                      │
│ ○ Mensuel                           │
│                                     │
│ Heure d'execution:                  │
│ [02:00 ▼]                           │
│                                     │
│ Alertes:                            │
│ ☑ Email                             │
│   [user@example.com            ]    │
│                                     │
│ ☑ Slack                             │
│   [#security-alerts            ]    │
│                                     │
│ ☐ Microsoft Teams                   │
│   [Webhook URL                 ]    │
│                                     │
│ Conditions d'alerte:                │
│ ☑ Nouvelle vulnerabilite detectee   │
│ ☑ Score < 7.0                       │
│ ☑ Vulnerabilite critique            │
│                                     │
│ [Activer la Surveillance]           │
│                                     │
└─────────────────────────────────────┘
```

**API Endpoint:**
```
POST /api/monitoring/schedule
Body: {
  "system_id": "sys-123",
  "frequency": "daily",
  "time": "02:00",
  "alerts": {
    "email": ["user@example.com"],
    "slack": ["#security-alerts"],
    "teams": []
  },
  "conditions": {
    "new_vulnerability": true,
    "score_threshold": 7.0,
    "critical_only": false
  }
}
```

---

### Etape 10: Alertes Automatiques (Phase 3)

```
Scan automatique detecte une vulnerabilite
   │
   ├─ Email si vulnerabilite critique
   ├─ Slack si score < 7.0
   └─ Teams pour nouvelles vulnerabilites
```

**Email Template:**
```
Subject: [CRITICAL] Nouvelle Vulnerabilite Detectee - Production Chatbot

Bonjour,

Une nouvelle vulnerabilite CRITIQUE a ete detectee lors du scan automatique:

Systeme: Production Chatbot
Scan ID: SCAN-20251024-020015
Score: 6.5/10 (etait 8.5/10)

Vulnerabilites:
• Prompt Injection (HIGH) - CVE-2023-29374
  Impact: Contournement des restrictions
  Action: Implementer la validation d'input

Rapport complet: https://platform.com/scans/SCAN-20251024-020015

Cordialement,
LLM Security Platform
```

---

### Etape 11: Creation de Tickets JIRA (Phase 3)

```
Vulnerabilite HIGH detectee
   │
   └─ Creation automatique de ticket JIRA
```

**JIRA Ticket:**
```
Project: SEC
Type: Bug
Priority: High
Summary: [LLM Security] Prompt Injection Vulnerability - Production Chatbot

Description:
Vulnerabilite detectee lors du scan automatique du 2025-10-24.

Systeme: Production Chatbot
Scan ID: SCAN-20251024-020015
CVE: CVE-2023-29374
CVSS: 7.5

Impact:
- Contournement des restrictions
- Execution de commandes non autorisees
- Acces a des donnees sensibles

Solutions:
1. Implementer la validation d'input (2-4h)
2. Utiliser des prompt templates (1-2h)
3. Activer le content filtering (3-5h)

Rapport: https://platform.com/scans/SCAN-20251024-020015

Assignee: security-team
Due Date: 2025-10-31
```

**API Endpoint:**
```
POST /api/integrations/jira/create-ticket
Body: {
  "vulnerability": {...},
  "system": {...},
  "scan_id": "SCAN-20251024-020015"
}
```

---

### Etape 12: Dashboard de Monitoring

```
Utilisateur accede au Dashboard
   │
   └─ Vue d'ensemble de tous les systemes
```

**Interface:**
```
┌────────────────────────────────────────────────────────────┐
│  Dashboard                                                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Mes Systemes (3)                                          │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Production Chatbot              8.5/10 ✓             │ │
│  │ Dernier scan: Il y a 2 heures                        │ │
│  │ Vulnerabilites: 1 (LOW)                              │ │
│  │ [Voir details] [Scanner maintenant]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Staging API                     9.2/10 ✓             │ │
│  │ Dernier scan: Il y a 5 heures                        │ │
│  │ Vulnerabilites: 0                                    │ │
│  │ [Voir details] [Scanner maintenant]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Dev Environment                 6.1/10 ⚠️            │ │
│  │ Dernier scan: Il y a 1 jour                          │ │
│  │ Vulnerabilites: 5 (2 HIGH, 3 MEDIUM)                │ │
│  │ [Voir details] [Scanner maintenant]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Graphique: Evolution des Scores]                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 10 ┤                                                │   │
│  │  9 ┤     ╭─────╮                                    │   │
│  │  8 ┤ ╭───╯     ╰───╮                                │   │
│  │  7 ┤ │             ╰───╮                            │   │
│  │  6 ┤ │                 ╰───                         │   │
│  │    └─────────────────────────────────────────────   │   │
│  │    Oct 20  Oct 21  Oct 22  Oct 23  Oct 24          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  [Graphique: Vulnerabilites par Temps]                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 10 ┤                                                │   │
│  │  8 ┤ ■                                              │   │
│  │  6 ┤ ■ ■                                            │   │
│  │  4 ┤ ■ ■ ■                                          │   │
│  │  2 ┤ ■ ■ ■ ■                                        │   │
│  │  0 ┤ ■ ■ ■ ■ ■                                      │   │
│  │    └─────────────────────────────────────────────   │   │
│  │    Oct 20  Oct 21  Oct 22  Oct 23  Oct 24          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Complets

### Phase 1 (COMPLETE)
```
GET  /                          - Home page info
GET  /health                    - Health check
GET  /api/status                - Platform status
GET  /api/tests                 - List available tests
POST /api/scan                  - Run security scan
GET  /api/solutions             - List all solutions
GET  /api/solutions/<type>      - Get solutions for vulnerability
POST /api/export/csv            - Export scan to CSV
```

### Phase 2 (EN COURS)
```
POST /api/systems               - Add system to monitor
GET  /api/systems               - List all systems
GET  /api/systems/<id>          - Get system details
PUT  /api/systems/<id>          - Update system
DELETE /api/systems/<id>        - Delete system
```

### Phase 3 (PLANIFIE)
```
POST /api/auth/register         - Register user
POST /api/auth/login            - Login user
GET  /api/auth/me               - Get current user

POST /api/monitoring/schedule   - Schedule automatic scans
GET  /api/monitoring/schedules  - List schedules
PUT  /api/monitoring/schedule/<id> - Update schedule
DELETE /api/monitoring/schedule/<id> - Delete schedule

GET  /api/scans                 - List all scans
GET  /api/scans/<id>            - Get scan details
GET  /api/scans/compare         - Compare scans

POST /api/integrations/jira     - Create JIRA ticket
POST /api/integrations/slack    - Send Slack alert
POST /api/integrations/teams    - Send Teams alert
```

---

## Technologies Stack

### Backend
- Python 3.11+
- Flask (API REST)
- PostgreSQL (Database)
- Redis (Cache + Rate Limiting)
- Celery (Task Queue)
- Azure Functions (Scheduler)

### Frontend
- React 18.2.0
- React Router 6.20.0
- Axios 1.6.0
- Tailwind CSS 3.3.0
- Chart.js (Graphiques)

### Infrastructure
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Application Insights (Monitoring)
- GitHub Actions (CI/CD)

---

Fin du document
