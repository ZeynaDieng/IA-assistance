# ✅ Setup Complet - SamaPlanner Backend

**Date :** Décembre 2024

---

## ✅ INSTALLATION TERMINÉE

Toutes les étapes de configuration ont été effectuées :

### 1. ✅ PostgreSQL Installé
- PostgreSQL 14 installé via Homebrew
- Service démarré automatiquement
- Base de données `samaplanner` créée
- Utilisateur `samaplanner` créé avec mot de passe `password`

### 2. ✅ Configuration Backend
- Fichier `.env` créé dans `backend/`
- `DATABASE_URL` configurée
- Prisma Client généré
- Migrations créées et appliquées

---

## 🚀 DÉMARRER LE BACKEND

```bash
cd backend
npm run start:dev
```

Le backend sera disponible sur : **http://localhost:3000**

---

## 🧪 TESTER

### Test d'enregistrement

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+221771234567","pin":"1234"}'
```

### Test de connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+221771234567","pin":"1234"}'
```

---

## 📋 CREDENTIALS DATABASE

- **Host:** localhost
- **Port:** 5432
- **Database:** samaplanner
- **User:** samaplanner
- **Password:** password

---

## 🔧 COMMANDES UTILES

```bash
# Démarrer PostgreSQL
brew services start postgresql@14

# Arrêter PostgreSQL
brew services stop postgresql@14

# Status PostgreSQL
brew services list | grep postgresql

# Se connecter à la base
/opt/homebrew/opt/postgresql@14/bin/psql -U samaplanner -d samaplanner

# Prisma Studio (interface graphique)
cd backend && npm run prisma:studio
```

---

## 📚 ENDPOINTS DISPONIBLES

Tous les endpoints sont préfixés par `/api` :

- **Auth:** `/api/auth/register`, `/api/auth/login`
- **Audio:** `/api/audio/upload`, `/api/audio/:id`
- **AI:** `/api/ai/transcribe`, `/api/ai/extract-tasks`
- **Planning:** `/api/planning/generate`, `/api/planning/validate`
- **Tasks:** `/api/tasks/*` (CRUD complet)
- **Calendar:** `/api/calendar/month`, `/api/calendar/day`
- **Notifications:** `/api/notifications`, `/api/notifications/:id`
- **Users:** `/api/users/profile`, `/api/users/statistics`

**Total: 18 endpoints** ✅

---

## ⚠️ NOTE IMPORTANTE

Le fichier `.env` contient des credentials par défaut. **En production**, changez :
- `JWT_SECRET` (générer une clé aléatoire forte)
- `POSTGRES_PASSWORD` (mot de passe sécurisé)
- `OPENAI_API_KEY` (si vous utilisez l'IA)

---

## 🎉 TOUT EST PRÊT !

Votre backend SamaPlanner est maintenant complètement configuré et prêt à être utilisé.

**Prochaine étape :** Démarrer le backend et tester les endpoints !

---

