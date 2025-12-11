# SamaPlanner Backend

Backend NestJS pour SamaPlanner - Assistant Vocal Intelligent

## 🚀 Démarrage Rapide

### 1. Créer le fichier `.env`

```bash
cp ENV_EXAMPLE.txt .env
```

Puis éditer `.env` avec vos valeurs réelles.

### 2. Démarrer PostgreSQL

```bash
# Depuis la racine du projet
docker-compose up -d postgres
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Setup Prisma

```bash
npm run prisma:generate
npm run prisma:migrate dev --name init
```

### 5. Démarrer le serveur

```bash
npm run start:dev
```

Le backend sera disponible sur `http://localhost:3000`

---

## 📚 Documentation

- **Setup complet** : Voir `/BACKEND_SETUP_GUIDE.md` à la racine
- **Quick Start** : Voir `/QUICK_START.md` à la racine
- **Intégration Frontend** : Voir `/INTEGRATION_BACKEND_FRONTEND.md`

---

## 🔑 Variables d'Environnement Requises

- `DATABASE_URL` - URL de connexion PostgreSQL
- `JWT_SECRET` - Secret pour signer les JWT
- `OPENAI_API_KEY` - Clé API OpenAI (optionnel pour dev)

Voir `ENV_EXAMPLE.txt` pour le format complet.

---

## 📋 Endpoints API

Voir la documentation dans chaque module :
- Auth : `src/auth/README.md`
- Audio : Upload & gestion fichiers
- AI : Transcription & extraction tâches
- Planning : Génération planning
- Tasks : CRUD tâches
- Calendar : Récupération par mois/jour
- Notifications : Rappels automatiques
- Users : Profil & statistiques

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e
```

---

## 📦 Scripts Disponibles

- `npm run start:dev` - Démarrage mode développement
- `npm run build` - Build production
- `npm run start:prod` - Démarrage production
- `npm run prisma:generate` - Générer Prisma Client
- `npm run prisma:migrate` - Créer/appliquer migrations
- `npm run prisma:studio` - Ouvrir Prisma Studio

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── auth/          # Authentification (JWT)
│   ├── users/         # Gestion utilisateurs
│   ├── audio/         # Upload fichiers audio
│   ├── ai/            # Whisper + GPT-4
│   ├── planning/      # Génération planning
│   ├── tasks/         # CRUD tâches
│   ├── calendar/      # Calendrier
│   ├── notifications/ # Rappels automatiques
│   └── prisma/        # Prisma service
├── prisma/
│   └── schema.prisma  # Schéma base de données
└── uploads/           # Fichiers uploadés
```

---

## ⚠️ Troubleshooting

### Erreur `DATABASE_URL not found`

Créez le fichier `.env` avec `DATABASE_URL`.

### Erreur `Can't reach database`

Vérifiez que PostgreSQL est démarré : `docker-compose ps`

### Erreur Prisma Client

Exécutez : `npm run prisma:generate`

---

**Pour plus de détails, voir `BACKEND_SETUP_GUIDE.md` à la racine du projet.**

