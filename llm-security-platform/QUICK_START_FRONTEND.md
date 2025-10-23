# Quick Start - Interface Web

Guide rapide pour demarrer l'interface web en 5 minutes

---

## Etapes Rapides

### 1. Creer le Projet React (2 min)

```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"

# Creer React app
npx create-react-app frontend

cd frontend

# Installer dependances
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Copier les Fichiers (1 min)

```powershell
# Retour au dossier parent
cd ..

# Copier tous les fichiers frontend
Copy-Item -Path "frontend_src\*" -Destination "frontend\src\" -Recurse -Force
```

### 3. Configurer Tailwind (1 min)

Editez `frontend/tailwind.config.js` et remplacez tout par:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
        danger: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' }
      }
    },
  },
  plugins: [],
}
```

### 4. Demarrer (1 min)

```powershell
cd frontend
npm start
```

L'application s'ouvrira sur http://localhost:3000

---

## Verifications

### Backend Doit Etre en Ligne

Verifiez que le backend est accessible:

```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/health
```

Si le backend n'est pas accessible, l'interface web affichera des erreurs.

---

## Test Rapide

1. Ouvrez http://localhost:3000
2. Cliquez sur "Commencer un Scan"
3. Entrez un prompt: "You are a helpful assistant"
4. Cochez "Mode Demo"
5. Cliquez sur "Lancer le Scan"
6. Attendez 8-10 secondes
7. Voir les resultats!

---

## Troubleshooting

### Erreur: Module not found

```powershell
cd frontend
npm install
```

### Erreur: Tailwind ne fonctionne pas

Verifiez que `index.css` contient:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Erreur: API not reachable

Verifiez que le backend est en ligne:

```powershell
Invoke-WebRequest https://llm-security-plateform.azurewebsites.net/
```

---

## Prochaines Etapes

1. Tester tous les endpoints
2. Personnaliser les couleurs
3. Ajouter votre logo
4. Deployer sur Azure

---

Fin du guide
