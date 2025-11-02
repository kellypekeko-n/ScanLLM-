# Nouvelle Interface Utilisateur - LLM Security Platform

## 🎨 Vue d'ensemble

Cette refonte complète de l'interface utilisateur transforme la plateforme en une application moderne de style Trivy avec:
- Design sombre élégant
- Support multilingue (FR/EN)
- Navigation améliorée
- Nouvelles fonctionnalités

## 🚀 Démarrage Rapide

### Option 1: Script Automatique (Recommandé)
```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"
.\start_new_ui.ps1
```

### Option 2: Manuel
```powershell
# Terminal 1 - Backend
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform"
.\.venv\Scripts\Activate.ps1
$env:PORT="8000"
python .\app.py

# Terminal 2 - Frontend
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform\frontend"
$env:REACT_APP_API_URL="http://127.0.0.1:8000"
npm start
```

## 📁 Structure des Nouveaux Fichiers

```
frontend/src/
├── i18n/
│   └── translations.js          # Traductions FR/EN
├── contexts/
│   └── LanguageContext.jsx      # Gestion de la langue
├── pages/
│   ├── HomeNew.jsx              # Page d'accueil redessinée
│   ├── ScanSystem.jsx           # Formulaire de scan système
│   ├── About.jsx                # Guide d'utilisation
│   ├── Settings.jsx             # Paramètres utilisateur
│   └── History.jsx              # Historique des scans
└── components/
    ├── NavbarNew.jsx            # Navigation mise à jour
    └── Feedback.jsx             # Composant d'avis
```

## ✨ Nouvelles Fonctionnalités

### 1. Internationalisation (i18n)
- **Langues**: Français et Anglais
- **Toggle**: Bouton EN/FR dans la navbar
- **Persistance**: Choix sauvegardé dans localStorage

### 2. Page d'Accueil Redessinée
- Design inspiré de Trivy
- Fond dégradé sombre (gray-900 → blue-900)
- 2 actions principales:
  - **Tester un Prompt** → Redirige vers `/scan`
  - **Scanner un Système** → Redirige vers `/scan-system`
- Section avis utilisateurs avec 3 témoignages

### 3. Scanner un Système
- Formulaire détaillé avec validation
- Champs: Nom (requis), Endpoint, Model, API Key
- Scan asynchrone avec redirection vers résultats

### 4. Historique des Scans
- Tableau complet des scans précédents
- Colonnes: ID, Nom, Date, Statut, Score, Vulnérabilités
- Filtrage et tri (à venir)

### 5. Guide d'Utilisation
- Documentation complète
- Explication des 7 tests de sécurité
- Instructions pas à pas

### 6. Paramètres
- Sélection de langue (FR/EN)
- Choix du thème (Dark/Light - Light à venir)
- Schéma de couleurs (Cyan/Blue/Purple)
- Section contact

### 7. Composant Feedback
- Rating par étoiles (1-5)
- Zone de commentaire
- Soumission avec animation

## 🎯 Navigation

### Navbar
- **Home**: Page d'accueil
- **New Scan**: Test de prompt
- **Dashboard**: Tableau de bord (à venir)
- **History**: Historique des scans
- **About**: Guide d'utilisation
- **Settings** (icône): Paramètres
- **EN/FR**: Toggle de langue
- **Login/Logout**: Authentification (mock)

### Routes
| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Page d'accueil minimaliste |
| `/scan` | NewScan | Test de prompt individuel |
| `/scan-system` | ScanSystem | Scan système complet |
| `/history` | History | Historique des scans |
| `/about` | About | Guide utilisateur |
| `/settings` | Settings | Paramètres |
| `/dashboard` | Dashboard | Tableau de bord (à venir) |
| `/solutions` | Solutions | Base de solutions |

## 🔧 Activation de la Nouvelle UI

### Étape 1: Renommer les Fichiers
```powershell
cd "C:\Users\Kelly Pekeko\PycharmProjects\SCAN LLM\llm-security-platform\frontend\src"

# Sauvegarder les anciens fichiers
Move-Item pages\Home.jsx pages\HomeOld.jsx -Force
Move-Item components\Navbar.jsx components\NavbarOld.jsx -Force

# Activer les nouveaux fichiers
Move-Item pages\HomeNew.jsx pages\Home.jsx -Force
Move-Item components\NavbarNew.jsx components\Navbar.jsx -Force
```

### Étape 2: Mettre à Jour App.jsx
Le fichier `App.jsx` est déjà configuré pour utiliser les nouveaux composants.

### Étape 3: Redémarrer le Frontend
```powershell
npm start
```

## 🎨 Personnalisation

### Changer la Couleur Primaire
Modifier dans `tailwind.config.js`:
```js
colors: {
  primary: colors.cyan,  // Changer pour blue, purple, etc.
}
```

### Ajouter une Traduction
Modifier `src/i18n/translations.js`:
```js
export const translations = {
  en: {
    myNewKey: 'My English text',
  },
  fr: {
    myNewKey: 'Mon texte français',
  },
};
```

Utiliser dans un composant:
```jsx
const { t } = useLanguage();
<p>{t('myNewKey')}</p>
```

## 📊 Données Mock

Les données suivantes sont actuellement mockées pour la démonstration:

1. **Avis utilisateurs** (Home.jsx)
   - 3 témoignages fictifs
   - À remplacer par des données réelles

2. **Historique des scans** (History.jsx)
   - 3 scans d'exemple
   - À connecter à l'API backend

3. **État d'authentification** (Navbar.jsx)
   - Login/Logout simulé
   - À intégrer avec JWT/OAuth

## 🔌 Intégration Backend

### Endpoints Requis
```
POST /api/scan/software      # Lancer un scan système
GET  /api/scan/<scan_id>     # Récupérer le statut/résultats
GET  /api/scans/history      # Historique des scans
POST /api/feedback           # Soumettre un avis
GET  /api/user/settings      # Paramètres utilisateur
PUT  /api/user/settings      # Mettre à jour les paramètres
```

### Exemple d'Intégration
```jsx
// Dans History.jsx
useEffect(() => {
  const fetchHistory = async () => {
    const data = await apiService.getScanHistory();
    setScans(data);
  };
  fetchHistory();
}, []);
```

## 🐛 Dépannage

### Erreur: Cannot find module 'LanguageContext'
```powershell
# Vérifier que le fichier existe
ls src\contexts\LanguageContext.jsx

# Vérifier que index.js importe LanguageProvider
```

### La langue ne change pas
1. Ouvrir DevTools (F12)
2. Application → Local Storage
3. Vérifier la clé `language`
4. Rafraîchir la page (Ctrl+F5)

### Styles ne s'appliquent pas
1. Vérifier que Tailwind CSS est configuré
2. Vérifier `tailwind.config.js`
3. Redémarrer le serveur de développement

### Page blanche
1. Ouvrir la console (F12)
2. Vérifier les erreurs d'import
3. Vérifier que tous les fichiers existent

## 📝 TODO

- [ ] Implémenter la sidebar droite (historique)
- [ ] Connecter l'authentification réelle
- [ ] Ajouter le mode Light
- [ ] Implémenter les schémas de couleurs alternatifs
- [ ] Ajouter des animations de transition
- [ ] Optimiser pour mobile
- [ ] Ajouter des tests unitaires
- [ ] Documenter l'API complète

## 🤝 Contribution

Pour ajouter une nouvelle page:
1. Créer le fichier dans `src/pages/`
2. Ajouter les traductions dans `src/i18n/translations.js`
3. Ajouter la route dans `src/App.jsx`
4. Ajouter le lien dans `src/components/Navbar.jsx`

## 📄 Licence

Voir LICENSE dans le répertoire racine.
