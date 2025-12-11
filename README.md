# SamaPlanner

**Assistant de planification intelligent avec chat conversationnel**

SamaPlanner est un assistant personnel qui transforme la façon dont vous organisez votre journée. Grâce à une interface conversationnelle multimodale (texte + vocal) et à l'intelligence artificielle, créez et gérez vos plannings de manière naturelle et intuitive.

---

## 📋 Structure du Projet

```
PlannerApp/
├── frontend/          # Nuxt 3 + Vue 3 + TailwindCSS
├── backend/           # NestJS + Prisma + PostgreSQL
├── PRD.md             # Product Requirements Document
├── CHECKLIST.md       # Checklist de développement
├── DESIGN_SYSTEM.md   # Design System complet
└── docker-compose.yml # Docker Compose pour développement
```

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (ou utiliser Docker)

### 1. Setup Base de Données

```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d postgres

# Vérifier que PostgreSQL est démarré
docker ps
```

### 2. Setup Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et ajouter vos clés API (IA)

# Générer le client Prisma
npm run prisma:generate

# Créer les migrations
npm run prisma:migrate

# Démarrer le backend en mode développement
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le frontend en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3001`

---

## 📁 Structure Frontend

```
frontend/
├── assets/
│   └── css/
│       └── main.css          # Styles globaux Tailwind
├── components/
│   ├── ui/                   # Composants UI de base
│   │   ├── Logo.vue
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   ├── BottomNavigationBar.vue
│   │   ├── TaskItem.vue
│   │   ├── ProgressBar.vue
│   │   ├── Modal.vue
│   │   └── VoiceRecorder.vue
│   └── features/             # Composants features
│       ├── AudioRecorder.vue
│       ├── PinInput.vue
│       └── OtpDisplay.vue
├── pages/
│   ├── onboarding.vue
│   ├── home.vue
│   ├── record.vue
│   ├── processing.vue
│   ├── auth/
│   │   ├── phone.vue
│   │   ├── otp.vue
│   │   ├── pin.vue
│   │   └── login.vue
│   └── ...
├── stores/                   # Pinia stores
│   ├── auth.ts
│   └── audio.ts
├── composables/              # Composables Nuxt
│   └── ...
├── nuxt.config.ts
└── tailwind.config.js
```

---

## 📁 Structure Backend

```
backend/
├── src/
│   ├── auth/                 # Module authentification
│   ├── users/                # Module utilisateurs
│   ├── audio/                # Module audio
│   ├── ai/                   # Module IA (Whisper + GPT)
│   ├── tasks/                # Module tâches
│   ├── planning/             # Module planning
│   ├── calendar/             # Module calendrier
│   ├── notifications/        # Module notifications
│   ├── prisma/               # Prisma service
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma         # Schéma Prisma
└── package.json
```

---

## 🎨 Design System

Tous les composants suivent le Design System défini dans `DESIGN_SYSTEM.md` :

- **Couleurs** : Violet #6C3EF1, Bleu nuit #0D0F33
- **Glassmorphism** : backdrop-blur + bg-white/10
- **Arrondis** : rounded-2xl (boutons), rounded-3xl (cards)
- **Animations** : Transitions fluides 300ms

---

## ✨ Fonctionnalités Principales

### 💬 Chat Assistant IA (Action Principale)
- **Interface conversationnelle** : Parlez ou tapez vos demandes naturellement
- **Multimodal** : Support texte et vocal dans la même interface
- **Extraction intelligente** : L'IA détecte automatiquement les demandes de planning
- **Validation interactive** : Acceptez ou rejetez les plannings proposés avant création
- **Personnalisation** : L'IA prend en compte vos préférences (heures de travail, énergie, etc.)
- **Support routines** : Créez des routines récurrentes en plus des tâches ponctuelles
- **Historique** : Conservation du contexte pour des conversations fluides

### ✅ Gestion des Tâches
- Liste de tâches avec filtres (Tous, Aujourd'hui, Cette semaine, Complétées)
- Détails complets : titre, description, horaire, priorité, durée, deadline
- Actions : valider, modifier, reporter, supprimer
- Swipe actions pour une gestion rapide
- Section séparée pour les tâches complétées

### 🔄 Routines
- Création de routines récurrentes (quotidiennes, hebdomadaires, personnalisées)
- Gestion des routines actives
- Intégration automatique dans le planning

### 📅 Calendrier
- Vue mensuelle avec indicateurs visuels
- Points colorés selon la priorité des tâches
- Navigation fluide entre les mois
- Affichage des tâches du jour sélectionné

### ⚙️ Préférences Utilisateur
- Heures de travail personnalisées
- Niveaux d'énergie (matin, après-midi, soir)
- Pause déjeuner configurable
- Jours de travail
- Durées préférées par catégorie
- Options de planification avancées

### 📊 Statistiques
- Vue d'ensemble de la productivité
- Taux de complétion des tâches
- Statistiques détaillées sur les plannings

### 🔔 Notifications
- Rappels automatiques pour les tâches
- Notifications intelligentes selon les préférences

## 📱 Pages Disponibles

### Authentification
- `/onboarding` - Écran d'accueil
- `/auth/phone` - Saisie numéro
- `/auth/otp` - Validation OTP interne
- `/auth/pin` - Création PIN
- `/auth/login` - Connexion

### Application
- `/home` - Accueil avec Chat Assistant (action principale)
- `/chat` - Interface conversationnelle complète
- `/record` - Enregistrement vocal (méthode alternative)
- `/processing` - Traitement IA
- `/transcription` - Transcription
- `/planning` - Planning généré
- `/tasks` - Liste des tâches
- `/tasks/[id]` - Détail tâche
- `/calendar` - Calendrier mensuel
- `/profile` - Profil utilisateur
- `/settings` - Paramètres et préférences
- `/notifications` - Gestion des notifications
- `/stats` - Statistiques et analyses

---

## 🔧 Configuration

### Variables d'Environnement Frontend

Créer `frontend/.env` :

```env
API_BASE_URL=http://localhost:3000/api
```

### Variables d'Environnement Backend

Créer `backend/.env` (voir `.env.example`) :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/samaplanner"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="votre-cle-api-ia"
```

---

## 📚 Documentation

- **PRD.md** : Spécifications complètes du produit
- **CHECKLIST.md** : Checklist de développement
- **DESIGN_SYSTEM.md** : Design System et tokens
- **COMPONENTS_GUIDE.md** : Guide d'utilisation des composants
- **ROADMAP_IMPLEMENTATION.md** : Roadmap d'implémentation

---

## 🧪 Tests

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
npm run test
```

---

## 🚢 Déploiement

Voir `ROADMAP_IMPLEMENTATION.md` pour les étapes de déploiement.

---

## 🎯 Points Forts

- **Chat comme action principale** : Interface conversationnelle naturelle et intuitive
- **Multimodal** : Texte ou vocal selon votre préférence
- **IA contextuelle** : L'assistant apprend vos préférences et s'adapte
- **Validation avant création** : Vous contrôlez ce qui est ajouté à votre planning
- **Design moderne** : Interface épurée, fluide et agréable
- **Mobile-First** : Conçu pour mobile avec une expérience native
- **Personnalisation avancée** : Préférences détaillées pour un planning sur mesure

## 📝 Notes

- **Mobile-First** : L'application est conçue pour mobile d'abord
- **PWA** : Configuration PWA pour installation comme app native
- **Offline** : Support offline avec synchronisation automatique (en développement)
- **Chat Principal** : Le chat est maintenant la méthode recommandée pour créer des plannings

---

## 🚀 État Actuel

L'application est en développement actif avec les fonctionnalités principales implémentées :

- ✅ **Chat Assistant IA** (fonctionnalité principale) - Interface conversationnelle complète
- ✅ **Gestion complète des tâches** - CRUD, filtres, actions
- ✅ **Routines récurrentes** - Création et gestion
- ✅ **Calendrier mensuel** - Vue avec indicateurs visuels
- ✅ **Authentification complète** - Numéro + OTP interne + PIN
- ✅ **Préférences utilisateur** - Configuration avancée
- ✅ **Statistiques** - Vue d'ensemble de la productivité
- ✅ **Notifications** - Système de rappels
- ✅ **Design System** - Interface moderne et cohérente
- ✅ **Dark/Light Mode** - Support des deux thèmes

**En développement :**
- 🔄 Synchronisation offline avancée
- 🔄 Améliorations de l'IA (meilleure compréhension contextuelle)
- 🔄 Fonctionnalités collaboratives

---

**Développé avec ❤️ pour simplifier l'organisation quotidienne**

