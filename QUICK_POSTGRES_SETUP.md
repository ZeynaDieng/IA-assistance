# ⚡ Quick PostgreSQL Setup (macOS)

**Setup rapide en 2 minutes**

---

## 🍺 Avec Homebrew (Recommandé)

```bash
# 1. Installer PostgreSQL
brew install postgresql@14

# 2. Démarrer PostgreSQL
brew services start postgresql@14

# 3. Créer la base de données
psql postgres -c "CREATE DATABASE samaplanner;"
psql postgres -c "CREATE USER samaplanner WITH PASSWORD 'password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE samaplanner TO samaplanner;"

# 4. Configurer backend/.env
cd backend
cp ENV_EXAMPLE.txt .env
# Éditer .env avec: DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"

# 5. Setup Prisma
npm run prisma:generate
npm run prisma:migrate dev --name init

# 6. Démarrer backend
npm run start:dev
```

✅ **C'est tout !**

---

## 🐳 Avec Docker (si Docker est installé)

```bash
# 1. Démarrer Docker Desktop
open -a Docker

# 2. Attendre que Docker démarre (~30 secondes)

# 3. Démarrer PostgreSQL
docker-compose up -d postgres

# 4. Configurer backend/.env (même DATABASE_URL que ci-dessus)

# 5. Setup Prisma et démarrer (étapes 5-6 ci-dessus)
```

---

## ☁️ Avec Supabase (Cloud, gratuit)

1. Aller sur https://supabase.com
2. Créer compte et projet (gratuit)
3. Copier connection string (Settings > Database)
4. Mettre dans `backend/.env` :
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   ```
5. Setup Prisma et démarrer (étapes 5-6)

---

**Pour plus de détails, voir `SETUP_POSTGRES_ALTERNATIVES.md`**

