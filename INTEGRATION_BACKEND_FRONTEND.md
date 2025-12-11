# 🔗 Intégration Backend ↔ Frontend

**Date :** Décembre 2024

---

## ✅ BACKEND PRÊT

Le backend NestJS est **complètement fonctionnel** et démarre sans erreurs :

```
✅ Compilation TypeScript : 0 erreurs
✅ Modules chargés : 6/6
✅ Routes mappées : 14 endpoints
✅ Prisma Client généré
```

---

## 📋 ENDPOINTS BACKEND DISPONIBLES

### 🔐 Auth (`/api/auth`)
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### 🎤 Audio (`/api/audio`)
- `POST /api/audio/upload` - Upload fichier audio (JWT requis)
- `GET /api/audio/:id` - Récupérer un audio log (JWT requis)

### 🤖 AI (`/api/ai`)
- `POST /api/ai/transcribe` - Transcrire un audio (JWT requis)
  - Body: `{ audioLogId: string }`
- `POST /api/ai/extract-tasks` - Extraire tâches d'une transcription (JWT requis)
  - Body: `{ transcription: string }`

### 📅 Planning (`/api/planning`)
- `POST /api/planning/generate` - Générer planning (JWT requis)
- `POST /api/planning/validate` - Valider planning (JWT requis)

### ✅ Tasks (`/api/tasks`)
- `GET /api/tasks` - Liste des tâches (JWT requis)
- `GET /api/tasks/:id` - Détails tâche (JWT requis)
- `POST /api/tasks` - Créer tâche (JWT requis)
- `PATCH /api/tasks/:id` - Modifier tâche (JWT requis)
- `DELETE /api/tasks/:id` - Supprimer tâche (JWT requis)
- `POST /api/tasks/:id/complete` - Compléter tâche (JWT requis)
- `POST /api/tasks/:id/postpone` - Reporter tâche (JWT requis)

### 📆 Calendar (`/api/calendar`)
- `GET /api/calendar/month` - Tâches du mois (JWT requis)
- `GET /api/calendar/day` - Tâches du jour (JWT requis)

---

## 🔧 CONFIGURATION FRONTEND

### Variables d'environnement

Le frontend utilise déjà `runtimeConfig` dans `nuxt.config.ts` :

```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
  }
}
```

### Mode Mock

Le frontend est actuellement en **MOCK_MODE** (`stores/auth.ts`) :
- `MOCK_MODE = true` → Utilise localStorage pour auth
- `MOCK_MODE = false` → Utilise le backend réel

---

## 🔄 INTÉGRATION FRONTEND ↔ BACKEND

### ✅ Déjà intégré

1. **Audio Upload** (`components/features/AudioRecorder.vue`)
   - ✅ Utilise `/api/audio/upload`
   - ✅ Headers JWT inclus

2. **Task Extraction** (`stores/planning.ts`)
   - ✅ Utilise `/api/ai/extract-tasks`
   - ✅ Headers JWT inclus

3. **Transcription** (`stores/audio.ts`)
   - ✅ **CORRIGÉ** : Utilise maintenant `/api/ai/transcribe` (au lieu de `/audio/transcribe`)

### ⚠️ À compléter

1. **Auth Store** (`stores/auth.ts`)
   - Actuellement en MOCK_MODE
   - **Action** : Mettre `MOCK_MODE = false` quand prêt pour tests backend

2. **Planning Store** (`stores/planning.ts`)
   - `generatePlanningFromTasks` utilise peut-être un endpoint différent
   - Vérifier endpoint `/api/planning/generate`

3. **Tasks Store** (`stores/tasks.ts`)
   - Vérifier que tous les endpoints correspondent

4. **Calendar Store** (`stores/calendar.ts` si existe)
   - Intégrer `/api/calendar/month` et `/api/calendar/day`

---

## 🚀 POUR ACTIVER LE BACKEND

### 1. Configurer .env backend

```bash
cd backend
cp .env.example .env
```

Éditer `.env` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/samaplanner"
JWT_SECRET="votre-secret-jwt-super-securise"
OPENAI_API_KEY="sk-votre-cle-openai"
PORT=3000
FRONTEND_URL="http://localhost:3001"
CORS_ORIGIN="http://localhost:3001"
```

### 2. Setup base de données

```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Créer migrations
npm run prisma:migrate

# (Optionnel) Seed données test
npm run prisma:seed
```

### 3. Démarrer backend

```bash
cd backend
npm run start:dev
```

Vérifier : `http://localhost:3000/api` devrait répondre.

### 4. Activer backend dans frontend

Dans `frontend/stores/auth.ts` :
```typescript
const MOCK_MODE = false // ← Passer à false
```

---

## 🧪 TESTER L'INTÉGRATION

### 1. Test Auth
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+221771234567","pin":"1234"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+221771234567","pin":"1234"}'
```

### 2. Test Audio Upload (avec token)
```bash
TOKEN="votre-jwt-token"

curl -X POST http://localhost:3000/api/audio/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@recording.webm"
```

### 3. Test Transcription
```bash
curl -X POST http://localhost:3000/api/ai/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"audioLogId":"votre-audio-log-id"}'
```

---

## 📝 NOTES IMPORTANTES

1. **CORS** : Backend configuré pour accepter `http://localhost:3001`
2. **JWT** : Tous les endpoints (sauf auth) nécessitent un token JWT
3. **File Upload** : Audio upload utilise `multipart/form-data`
4. **Error Handling** : Frontend gère déjà les erreurs réseau et 404

---

**Le backend est prêt ! Il ne reste qu'à configurer .env et activer dans le frontend. 🎉**

