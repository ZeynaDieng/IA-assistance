# 🗄️ Setup PostgreSQL - Alternatives

**Date :** Décembre 2024

---

## ⚠️ Docker n'est pas démarré

Si Docker n'est pas disponible, voici les alternatives pour installer PostgreSQL.

---

## 🐳 Option 1 : Démarrer Docker (Recommandé si installé)

### macOS

```bash
# Ouvrir Docker Desktop
open -a Docker

# Attendre que Docker démarre (vérifier avec)
docker ps

# Puis démarrer PostgreSQL
docker-compose up -d postgres
```

### Vérifier que Docker est installé

```bash
docker --version
```

Si Docker n'est pas installé, voir Option 2 ou 3.

---

## 🍺 Option 2 : Installation PostgreSQL avec Homebrew (macOS)

### 2.1 Installer PostgreSQL

```bash
# Installer Homebrew si pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer PostgreSQL
brew install postgresql@14

# Démarrer PostgreSQL
brew services start postgresql@14
```

### 2.2 Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Dans psql, créer la base
CREATE DATABASE samaplanner;
CREATE USER samaplanner WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE samaplanner TO samaplanner;

# Quitter
\q
```

### 2.3 Mettre à jour DATABASE_URL dans `.env`

```env
DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"
```

---

## 📦 Option 3 : Installation PostgreSQL Directe (macOS)

### 3.1 Télécharger PostgreSQL

1. Aller sur https://www.postgresql.org/download/macosx/
2. Télécharger l'installer PostgreSQL.app
3. Installer l'application
4. Démarrer PostgreSQL depuis l'application

### 3.2 Créer la base de données

```bash
# PostgreSQL.app ajoute psql au PATH
# Se connecter
psql postgres

# Créer la base
CREATE DATABASE samaplanner;
CREATE USER samaplanner WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE samaplanner TO samaplanner;
\q
```

### 3.3 Mettre à jour DATABASE_URL

```env
DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"
```

---

## 🚀 Option 4 : PostgreSQL Cloud (Gratuit pour dev)

### Option 4A : Supabase (Recommandé)

1. Aller sur https://supabase.com
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Copier la connection string (Settings > Database)
5. Utiliser cette URL dans `.env`

```env
DATABASE_URL="postgresql://postgres:[VOTRE-PASSWORD]@db.[VOTRE-PROJECT].supabase.co:5432/postgres"
```

### Option 4B : Neon (Serverless PostgreSQL)

1. Aller sur https://neon.tech
2. Créer un compte gratuit
3. Créer une base de données
4. Copier la connection string
5. Utiliser dans `.env`

---

## ✅ Vérification de la Connexion

Une fois PostgreSQL installé, tester la connexion :

```bash
# Avec psql
psql -U samaplanner -d samaplanner

# Ou avec la commande complète
psql "postgresql://samaplanner:password@localhost:5432/samaplanner"
```

Si vous pouvez vous connecter, tout est bon ! ✅

---

## 🔧 Configuration Backend

Après avoir configuré PostgreSQL :

```bash
cd backend

# 1. Créer .env
cp ENV_EXAMPLE.txt .env
# Éditer .env avec votre DATABASE_URL

# 2. Générer Prisma Client
npm run prisma:generate

# 3. Créer migrations
npm run prisma:migrate dev --name init

# 4. Démarrer backend
npm run start:dev
```

---

## 🐛 Dépannage

### Erreur : `psql: command not found`

**Solution :** PostgreSQL n'est pas dans votre PATH. Ajoutez-le :

```bash
# Pour Homebrew
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Erreur : `connection refused`

**Solution :** PostgreSQL n'est pas démarré :

```bash
# Homebrew
brew services start postgresql@14

# Ou vérifier le statut
brew services list
```

### Erreur : `password authentication failed`

**Solution :** Vérifiez les credentials dans `.env` et dans PostgreSQL.

---

## 📝 Recommandation

Pour le développement local, **Homebrew** (Option 2) est la solution la plus simple et rapide sur macOS.

Pour tester rapidement sans installation, **Supabase** (Option 4A) est excellent.

---

**Une fois PostgreSQL configuré, vous pourrez démarrer le backend ! 🎉**

