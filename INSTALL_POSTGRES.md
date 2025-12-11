# 📦 Installation PostgreSQL - Guide Rapide

**Docker n'est pas disponible, installons PostgreSQL avec Homebrew**

---

## ✅ Installation Rapide

Vous avez Homebrew installé. Voici les commandes :

```bash
# 1. Installer PostgreSQL
brew install postgresql@14

# 2. Ajouter PostgreSQL au PATH (pour cette session)
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# 3. Démarrer PostgreSQL
brew services start postgresql@14

# 4. Créer la base de données
psql postgres -c "CREATE DATABASE samaplanner;"
psql postgres -c "CREATE USER samaplanner WITH PASSWORD 'password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE samaplanner TO samaplanner;"
```

---

## 🔧 Configuration Permanente du PATH

Pour que `psql` soit toujours disponible, ajoutez à votre `~/.zshrc` :

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## ✅ Vérification

```bash
# Tester la connexion
psql -U samaplanner -d samaplanner -c "SELECT version();"
```

Si ça fonctionne, PostgreSQL est prêt ! 🎉

---

## 🚀 Ensuite

```bash
cd backend

# Créer .env
cp ENV_EXAMPLE.txt .env

# Éditer .env et ajouter :
# DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"

# Setup Prisma
npm run prisma:generate
npm run prisma:migrate dev --name init

# Démarrer backend
npm run start:dev
```

---

**C'est tout ! Votre base de données sera prête. 🎉**

