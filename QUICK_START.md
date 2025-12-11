# ⚡ Quick Start - SamaPlanner Backend

**Démarrage rapide en 5 minutes**

---

## 🚀 Démarrage Ultra-Rapide

### 1. Configuration `.env`

```bash
cd backend
cp .env.example .env
```

Éditer `.env` :
```env
DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"
JWT_SECRET="$(openssl rand -hex 64)"
OPENAI_API_KEY="sk-votre-cle"
```

### 2. Démarrer PostgreSQL (Docker)

```bash
cd /Users/mac/PlannerApp
docker-compose up -d postgres
```

### 3. Setup Prisma

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate dev --name init
```

### 4. Démarrer le backend

```bash
npm run start:dev
```

✅ **Backend disponible sur `http://localhost:3000`**

---

## 🧪 Test Rapide

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+221771234567","pin":"1234"}'
```

---

## 📚 Documentation Complète

Voir `BACKEND_SETUP_GUIDE.md` pour plus de détails.

