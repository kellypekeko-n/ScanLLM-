# Phase 3: Monitoring Continu et Veille de Securite

Date: 23 octobre 2025

---

## Objectifs Phase 3

1. Monitoring continu des systemes utilisant des LLM
2. Scans automatiques periodiques
3. Dashboard de visualisation
4. Alertes en temps reel
5. Historique et tendances
6. Integration avec JIRA/ServiceNow

---

## Architecture de Monitoring

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring System                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Scheduler   │   │  Dashboard   │   │   Alerting   │
│              │   │              │   │              │
│ - Cron Jobs  │   │ - Metrics    │   │ - Email      │
│ - Azure Func │   │ - Charts     │   │ - Slack      │
│ - Queue      │   │ - History    │   │ - Teams      │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## Composants a Developper

### 1. Scheduler (Priorite 1)

**Fichier:** `monitoring/scheduler.py`

**Fonctionnalites:**
- Scans automatiques periodiques
- Configuration des frequences (horaire, quotidien, hebdomadaire)
- Gestion de la queue de scans
- Retry automatique en cas d'echec

**Configuration:**
```yaml
monitoring:
  schedules:
    - name: "Production LLM"
      target: "https://api.example.com/llm"
      frequency: "daily"
      time: "02:00"
      tests: ["all"]
    
    - name: "Dev LLM"
      target: "https://dev.example.com/llm"
      frequency: "weekly"
      day: "monday"
      time: "08:00"
      tests: ["prompt_injection", "safety_bypass"]
```

**Implementation:**
- Azure Functions (Timer Trigger)
- OU Celery + Redis
- OU APScheduler (simple)

---

### 2. Dashboard Web (Priorite 1)

**Fichier:** `dashboard/app.py`

**Fonctionnalites:**
- Vue d'ensemble des systemes surveilles
- Graphiques de tendances
- Historique des scans
- Comparaison des scores
- Export des rapports

**Technologies:**
- Frontend: React ou Vue.js
- Backend: Flask API
- Base de donnees: PostgreSQL ou MongoDB
- Visualisation: Chart.js ou Plotly

**Pages:**
1. **Overview** - Vue d'ensemble
2. **Systems** - Liste des systemes surveilles
3. **Scans** - Historique des scans
4. **Vulnerabilities** - Liste des vulnerabilites
5. **Reports** - Rapports et exports
6. **Settings** - Configuration

---

### 3. Alerting System (Priorite 2)

**Fichier:** `monitoring/alerting.py`

**Fonctionnalites:**
- Alertes email
- Alertes Slack
- Alertes Microsoft Teams
- Webhooks personnalises
- Regles d'alerte configurables

**Configuration:**
```yaml
alerting:
  rules:
    - name: "Critical Vulnerability"
      condition: "severity == 'critical'"
      channels: ["email", "slack"]
      recipients: ["security-team@example.com"]
    
    - name: "Score Drop"
      condition: "score < 7.0"
      channels: ["teams"]
      recipients: ["#security-alerts"]
    
    - name: "New Vulnerability"
      condition: "new_vulnerability == true"
      channels: ["email", "slack", "teams"]
      recipients: ["security-team@example.com"]
```

**Exemple d'alerte:**
```
Subject: [CRITICAL] New Vulnerability Detected

System: Production LLM API
Scan ID: SCAN-20251023-001
Score: 6.5/10 (was 9.0/10)

New Vulnerabilities:
- Prompt Injection (HIGH) - CVE-2023-XXXX
- Data Leakage (CRITICAL) - CVE-2024-YYYY

Action Required: Review and remediate within 24 hours

View Report: https://dashboard.example.com/scans/SCAN-20251023-001
```

---

### 4. Historical Database (Priorite 1)

**Fichier:** `monitoring/database.py`

**Schema:**
```sql
-- Table: systems
CREATE TABLE systems (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    endpoint VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Table: scans
CREATE TABLE scans (
    id UUID PRIMARY KEY,
    system_id UUID REFERENCES systems(id),
    scan_date TIMESTAMP,
    overall_score DECIMAL(4,2),
    risk_level VARCHAR(50),
    status VARCHAR(50),
    duration_seconds INTEGER
);

-- Table: vulnerabilities
CREATE TABLE vulnerabilities (
    id UUID PRIMARY KEY,
    scan_id UUID REFERENCES scans(id),
    type VARCHAR(100),
    severity VARCHAR(50),
    cwe VARCHAR(20),
    cve VARCHAR(50),
    owasp_category VARCHAR(20),
    nist_reference VARCHAR(50),
    description TEXT,
    remediation TEXT,
    status VARCHAR(50),
    assigned_to VARCHAR(255),
    due_date DATE
);

-- Table: metrics
CREATE TABLE metrics (
    id UUID PRIMARY KEY,
    scan_id UUID REFERENCES scans(id),
    test_name VARCHAR(100),
    score DECIMAL(4,2),
    details JSONB
);
```

---

### 5. Trend Analysis (Priorite 2)

**Fichier:** `monitoring/trends.py`

**Fonctionnalites:**
- Analyse des tendances de securite
- Comparaison historique
- Predictions de risques
- Recommandations proactives

**Metriques:**
- Evolution du score global
- Nombre de vulnerabilites par periode
- Temps moyen de remediation
- Taux de recurrence des vulnerabilites

**Exemple:**
```python
trends = analyze_trends(system_id="prod-llm", period="30days")
# Retourne:
{
    "score_trend": "decreasing",  # Score en baisse
    "vulnerability_trend": "increasing",  # Plus de vulnerabilites
    "risk_level": "high",
    "prediction": "Score will drop below 7.0 in 7 days",
    "recommendations": [
        "Schedule immediate security review",
        "Update prompt templates",
        "Implement additional input validation"
    ]
}
```

---

### 6. Integration JIRA/ServiceNow (Priorite 3)

**Fichier:** `integrations/ticketing.py`

**Fonctionnalites:**
- Creation automatique de tickets
- Mise a jour du statut
- Assignation automatique
- Suivi des SLA

**Exemple JIRA:**
```python
# Creer un ticket JIRA automatiquement
ticket = create_jira_ticket(
    project="SEC",
    issue_type="Bug",
    summary="[HIGH] Prompt Injection Vulnerability Detected",
    description=f"""
    System: Production LLM API
    Scan ID: SCAN-20251023-001
    CVE: CVE-2023-XXXX
    CVSS Score: 7.5
    
    Description:
    {vulnerability.description}
    
    Remediation:
    {vulnerability.remediation}
    
    Report: {report_url}
    """,
    priority="High",
    assignee="security-team"
)
```

---

## API Endpoints a Ajouter

### 1. Systems Management
```
GET    /api/systems                    # Liste des systemes
POST   /api/systems                    # Ajouter un systeme
GET    /api/systems/{id}               # Details d'un systeme
PUT    /api/systems/{id}               # Modifier un systeme
DELETE /api/systems/{id}               # Supprimer un systeme
```

### 2. Scheduling
```
GET    /api/schedules                  # Liste des schedules
POST   /api/schedules                  # Creer un schedule
GET    /api/schedules/{id}             # Details d'un schedule
PUT    /api/schedules/{id}             # Modifier un schedule
DELETE /api/schedules/{id}             # Supprimer un schedule
POST   /api/schedules/{id}/run         # Executer maintenant
```

### 3. Scans History
```
GET    /api/scans                      # Historique des scans
GET    /api/scans/{id}                 # Details d'un scan
GET    /api/scans/{id}/vulnerabilities # Vulnerabilites d'un scan
GET    /api/scans/compare              # Comparer 2 scans
```

### 4. Metrics & Trends
```
GET    /api/metrics/overview           # Vue d'ensemble
GET    /api/metrics/trends             # Tendances
GET    /api/metrics/system/{id}        # Metriques d'un systeme
GET    /api/metrics/comparison         # Comparaison multi-systemes
```

### 5. Alerts
```
GET    /api/alerts                     # Liste des alertes
POST   /api/alerts                     # Creer une regle d'alerte
GET    /api/alerts/{id}                # Details d'une alerte
PUT    /api/alerts/{id}                # Modifier une alerte
DELETE /api/alerts/{id}                # Supprimer une alerte
POST   /api/alerts/test                # Tester une alerte
```

---

## Dashboard UI Mockup

### Page 1: Overview
```
┌────────────────────────────────────────────────────────────┐
│  LLM Security Platform - Dashboard                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Systems Monitored: 5        Active Scans: 2              │
│  Total Vulnerabilities: 12   Critical: 3                  │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Production   │  │ Staging      │  │ Development  │   │
│  │ Score: 8.5   │  │ Score: 9.2   │  │ Score: 7.1   │   │
│  │ Status: OK   │  │ Status: OK   │  │ Status: WARN │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  Recent Scans:                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 2025-10-23 15:30 | Production | 8.5 | 2 vulns     │  │
│  │ 2025-10-23 14:00 | Staging    | 9.2 | 0 vulns     │  │
│  │ 2025-10-23 12:30 | Development| 7.1 | 5 vulns     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  [Chart: Score Trends Over Time]                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Technologies Recommandees

### Backend
- **API:** Flask ou FastAPI
- **Database:** PostgreSQL + Redis
- **Scheduler:** Azure Functions ou Celery
- **Queue:** Azure Service Bus ou RabbitMQ

### Frontend
- **Framework:** React ou Vue.js
- **UI Library:** Material-UI ou Ant Design
- **Charts:** Chart.js ou Plotly
- **State Management:** Redux ou Vuex

### Infrastructure
- **Hosting:** Azure App Service
- **Database:** Azure Database for PostgreSQL
- **Cache:** Azure Cache for Redis
- **Monitoring:** Application Insights

---

## Estimation du Temps

| Tache | Temps Estime | Priorite |
|-------|--------------|----------|
| Scheduler | 8-10 heures | P1 |
| Database Schema | 4-6 heures | P1 |
| Dashboard Backend API | 12-16 heures | P1 |
| Dashboard Frontend | 20-30 heures | P1 |
| Alerting System | 8-12 heures | P2 |
| Trend Analysis | 6-8 heures | P2 |
| JIRA/ServiceNow Integration | 8-10 heures | P3 |
| Tests et Integration | 10-15 heures | P1 |
| Documentation | 6-8 heures | P2 |
| **TOTAL** | **82-115 heures** | **~2-3 semaines** |

---

## Prochaines Etapes

1. Implementer le scheduler de base
2. Creer le schema de base de donnees
3. Developper les API endpoints
4. Creer le dashboard frontend
5. Implementer les alertes
6. Tester l'integration complete
7. Deployer sur Azure

---

Fin du document
