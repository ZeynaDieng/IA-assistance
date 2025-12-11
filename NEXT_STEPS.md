# 🎯 Prochaines Étapes - SamaPlanner

**Date :** Décembre 2024  
**État actuel :** Frontend complet (UI/UX), Backend structure de base prête

---

## ✅ CE QUI EST DÉJÀ FAIT

### Frontend (100% complet)
- ✅ **16 pages** créées et fonctionnelles
- ✅ **17 composants UI** réutilisables
- ✅ **7 composants features** spécifiques
- ✅ **Layouts** avec mobile frame
- ✅ **Stores Pinia** (auth, tasks, audio, planning)
- ✅ **Dark mode** global fonctionnel
- ✅ **Navigation** complète
- ✅ **Design System** appliqué

### Backend (Infrastructure de base)
- ✅ Projet NestJS initialisé
- ✅ **Schéma Prisma COMPLET** ✅ (User, Task, Planning, Reminder, AudioLog)
- ✅ Docker Compose configuré
- ✅ Dépendances installées (JWT, bcrypt, multer, Prisma, etc.)
- ✅ Structure modules définie dans `app.module.ts`
- ⚠️ Modules NestJS à créer/implémenter
- ⚠️ Endpoints API à implémenter

---

## 🔴 PRIORITÉ 1 : Backend - Modules NestJS & Endpoints API

### 📋 Étape 1 : Module Auth (Authentification)

**Statut :** Module importé dans `app.module.ts`, à créer/implémenter

**Objectif :** Créer les endpoints d'authentification (register, login)

**Tâches :**
1. [ ] Créer `backend/src/auth/auth.module.ts`
   - Configurer JWT module
   - Exporter AuthService
2. [ ] Créer `backend/src/auth/auth.service.ts`
   - `hashPin(pin: string)` avec bcrypt
   - `verifyPin(pin: string, hash: string)`
   - `generateJWT(userId: string)`
   - `register(phoneNumber, pinHash)` → créer User + retourner JWT
   - `login(phoneNumber, pin)` → vérifier PIN + retourner JWT
3. [ ] Créer `backend/src/auth/auth.controller.ts`
   - `POST /api/auth/register` 
     - Body: `{ phoneNumber: string, pinHash: string }`
     - Response: `{ user: User, token: string }`
   - `POST /api/auth/login`
     - Body: `{ phoneNumber: string, pin: string }`
     - Response: `{ user: User, token: string }`
4. [ ] Créer guards JWT (pour protéger routes)
   - `backend/src/auth/guards/jwt-auth.guard.ts`
   - `backend/src/auth/strategies/jwt.strategy.ts`
5. [ ] Créer décorateur `@CurrentUser()` pour récupérer user depuis token
6. [ ] Tester avec Postman/Thunder Client

**Référence :**
- `PRD.md` section "Authentification"
- `CHECKLIST.md` Epic 2 (Tasks 2.1.x, 2.2.x, 2.3.x)

---

### 📋 Étape 2 : Module Audio (Upload & Transcription)

**Statut :** Module importé dans `app.module.ts`, à créer/implémenter

**Objectif :** Gérer l'upload d'audio et la transcription avec Whisper

**Tâches :**
1. [ ] Créer `backend/src/audio/audio.module.ts`
   - Importer ConfigModule, PrismaModule
2. [ ] Créer `backend/src/audio/audio.service.ts`
   - `uploadAudio(file: Express.Multer.File, userId: string)`
     - Valider format (MP3, WAV, M4A, WEBM)
     - Valider taille max 10MB
     - Stocker fichier (dossier `uploads/audio/` ou cloud)
     - Créer AudioLog en DB
     - Retourner `{ audioLogId, fileUrl }`
3. [ ] Créer `backend/src/audio/audio.controller.ts`
   - `POST /api/audio/upload` (multipart/form-data)
     - Guard JWT (authentifié)
     - Upload fichier avec multer
     - Retourner AudioLog créé

**Référence :**
- `PRD.md` section "Enregistrement & Transcription Audio"
- `CHECKLIST.md` Epic 3 (Tasks 3.2.x)

---

### 📋 Étape 3 : Module AI (Whisper + GPT)

**Statut :** Module importé dans `app.module.ts`, à créer/implémenter

**Objectif :** Transcription Whisper + Extraction tâches GPT

**Tâches Partie A - Whisper :**
1. [ ] Créer `backend/src/ai/ai.module.ts`
   - Configurer OpenAI client
2. [ ] Créer `backend/src/ai/whisper.service.ts`
   - Configurer client OpenAI avec API key
   - `transcribeAudio(fileUrl: string, audioLogId: string)`
     - Télécharger fichier audio
     - Appel OpenAI Whisper API
     - Sauvegarder transcription dans AudioLog
     - Gérer erreurs (rate limit, timeout)
     - Retry avec backoff exponentiel
     - Retourner transcription
3. [ ] Créer endpoint dans `audio.controller.ts`
   - `POST /api/audio/transcribe/:audioLogId`
   - Guard JWT
   - Appeler WhisperService

**Tâches Partie B - GPT Extraction :**
4. [ ] Créer `backend/src/ai/gpt.service.ts`
   - Configurer client OpenAI GPT-4
   - `extractTasks(transcription: string)`
     - Créer prompt structuré pour extraction
     - Appel GPT-4 avec prompt
     - Parser réponse JSON
     - Valider format JSON (schéma strict)
     - Retourner liste tâches extraites
5. [ ] Créer endpoint dans `ai.controller.ts` (ou nouveau controller)
   - `POST /api/ai/extract-tasks`
     - Body: `{ transcription: string }`
     - Guard JWT
     - Retourner `{ tasks: Task[] }`

**Référence :**
- `PRD.md` section "IA & Génération de Planning"
- `CHECKLIST.md` Epic 3 (Tasks 3.3.x) et Epic 4 (Tasks 4.1.x)

---

### 📋 Étape 4 : Module Planning (Génération Planning Intelligent)

**Statut :** Module importé dans `app.module.ts`, à créer/implémenter

**Objectif :** Générer planning intelligent à partir des tâches

**Tâches :**
1. [ ] Créer `backend/src/planning/planning.module.ts`
2. [ ] Créer `backend/src/planning/planning.service.ts`
   - `generatePlanning(tasks: Task[], userId: string, date: Date)`
     - Trier tâches par priorité (URGENT → HIGH → MEDIUM → LOW)
     - Allouer horaires (08:00-20:00, pause 12:00-13:00)
     - Buffer 15min entre tâches
     - Respecter deadlines si spécifiées
     - Gérer contraintes (pas de chevauchement)
     - Suggérer report si trop de tâches
     - Optionnel : Appel GPT pour suggestions horaires
     - Retourner planning structuré avec tâches horaires
   - `validatePlanning(planningData: PlanningData, userId: string)`
     - Créer Planning en DB
     - Créer Tasks associées
     - Lier AudioLog si fourni
     - Générer rappels automatiques (voir NotificationsModule)
     - Retourner Planning créé
3. [ ] Créer `backend/src/planning/planning.controller.ts`
   - `POST /api/ai/generate-planning`
     - Body: `{ tasks: Task[], date?: string }`
     - Guard JWT
     - Retourner planning généré
   - `POST /api/planning/validate`
     - Body: `{ planning: PlanningData, audioLogId?: string }`
     - Guard JWT
     - Sauvegarder planning en DB
     - Retourner Planning créé

**Référence :**
- `PRD.md` section "IA & Génération de Planning"
- `CHECKLIST.md` Epic 4 (Tasks 4.2.x, 4.4.x)

---

### 📋 Étape 5 : Module Tasks (CRUD Tâches)

**Statut :** Module importé dans `app.module.ts`, à créer/implémenter

**Objectif :** CRUD complet pour les tâches

**Tâches :**
1. [ ] Créer `backend/src/tasks/tasks.module.ts`
2. [ ] Créer `backend/src/tasks/tasks.service.ts`
   - `findAll(userId: string, filters: { date?, status? })`
   - `findOne(id: string, userId: string)`
   - `create(data: CreateTaskDto, userId: string)`
   - `update(id: string, data: UpdateTaskDto, userId: string)`
   - `complete(id: string, userId: string)`
   - `postpone(id: string, newDate: Date, userId: string)`
   - `delete(id: string, userId: string)`
3. [ ] Créer `backend/src/tasks/tasks.controller.ts`
   - `GET /api/tasks` (query: date?, status?)
   - `GET /api/tasks/:id`
   - `PATCH /api/tasks/:id`
   - `POST /api/tasks/:id/complete`
   - `POST /api/tasks/:id/postpone`
   - `DELETE /api/tasks/:id`
   - Tous avec Guard JWT + vérifier ownership

**Référence :**
- `PRD.md` section "Gestion des Tâches"
- `CHECKLIST.md` Epic 5

---

## 📝 ORDRE DE RÉALISATION RECOMMANDÉ

```
1. Module Auth (register, login)
   ↓
2. Module Audio (upload)
   ↓
3. Module AI - Whisper (transcription)
   ↓
4. Module AI - GPT (extraction tâches)
   ↓
5. Module Planning (génération planning)
   ↓
6. Module Tasks (CRUD)
   ↓
7. Tests & Intégration Frontend-Backend
```

---

## 🔧 CONFIGURATION REQUISE

### Variables d'environnement (.env)
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/samaplanner"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="7d"

# OpenAI
OPENAI_API_KEY="sk-..."

# Server
PORT=3000
NODE_ENV=development
```

### Commandes utiles
```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Générer Prisma Client
cd backend && npm run prisma:generate

# Créer migration (si schéma modifié)
npm run prisma:migrate

# Démarrer backend
npm run start:dev

# Ouvrir Prisma Studio (visualiser DB)
npm run prisma:studio
```

---

## ✅ CRITÈRES DE SUCCÈS

Chaque module est considéré comme terminé quand :
- [ ] Code implémenté et testé
- [ ] Endpoints API fonctionnels (testés avec Postman/Thunder Client)
- [ ] Validation des données (DTOs avec class-validator)
- [ ] Gestion erreurs appropriée
- [ ] Guard JWT sur routes protégées
- [ ] Documentation mise à jour (CHECKLIST.md)
- [ ] Pas d'erreurs TypeScript/ESLint

---

## 🎯 OBJECTIF FINAL

**Backend complet et fonctionnel** avec :
- ✅ Authentification (register, login) avec JWT
- ✅ Upload audio + transcription Whisper
- ✅ Extraction tâches GPT-4
- ✅ Génération planning intelligent
- ✅ CRUD tâches complet
- ✅ API REST complète et sécurisée

**Ensuite :** 
- Intégration complète frontend ↔ backend
- Tests E2E
- Déploiement

---

## 📚 DOCUMENTS DE RÉFÉRENCE

- **PRD.md** : Spécifications complètes du produit
- **CHECKLIST.md** : Liste détaillée des tâches (Epic 1-5)
- **PROJECT_SPEC.md** : Spécifications techniques
- **backend/prisma/schema.prisma** : Schéma DB (déjà complet ✅)

---

**Dernière mise à jour :** Décembre 2024 - Après complétion du frontend
