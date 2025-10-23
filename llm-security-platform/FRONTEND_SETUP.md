# Frontend Setup - Interface Web

Date: 23 octobre 2025

---

## Installation du Frontend

### Etape 1: Creer le Projet React

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Creer l'application React
npx create-react-app frontend

# Aller dans le dossier frontend
cd frontend

# Installer les dependances
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Configuration Tailwind CSS

### Fichier: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      }
    },
  },
  plugins: [],
}
```

---

## Configuration du Proxy

### Fichier: `frontend/package.json`

Ajouter cette ligne pour le proxy vers l'API:

```json
{
  "name": "llm-security-frontend",
  "version": "2.0.0",
  "private": true,
  "proxy": "https://llm-security-plateform.azurewebsites.net",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## Structure des Fichiers

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ScanForm.jsx
│   │   ├── ScanResults.jsx
│   │   ├── SolutionCard.jsx
│   │   ├── Dashboard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── NewScan.jsx
│   │   ├── Results.jsx
│   │   ├── Solutions.jsx
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── tailwind.config.js
```

---

## Commandes de Developpement

### Demarrer le serveur de developpement

```powershell
cd frontend
npm start
```

L'application sera disponible sur: http://localhost:3000

### Build pour la production

```powershell
npm run build
```

Les fichiers seront dans le dossier `build/`

---

## Deploiement sur Azure

### Option 1: Azure Static Web Apps

```powershell
# Installer Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deployer
cd frontend
npm run build
swa deploy ./build
```

### Option 2: Azure App Service

```powershell
# Build
npm run build

# Deployer avec Azure CLI
az webapp up --name llm-security-frontend --resource-group LLM-Security-RG --plan LLM-Security-Plan
```

---

Fin du document
