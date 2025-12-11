# 🚀 Guide de Configuration Backend

**Date :** Décembre 2024

---

## 📋 PRÉREQUIS

- Node.js 18+ installé
- PostgreSQL 14+ installé (ou Docker)
- npm ou yarn installé

---

## 🔧 ÉTAPE 1 : Configuration des Variables d'Environnement

### 1.1 Créer le fichier `.env`

```bash
cd backend
cp .env.example .env
```

### 1.2 Éditer `.env` avec vos valeurs

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/samaplanner?schema=public"

# JWT Secret (générer une clé aléatoire)
JWT_SECRET="changez-moi-par-une-cle-secrete-aleatoire"

# OpenAI API Key (pour Whisper et GPT-4)
OPENAI_API_KEY="sk-votre-cle-openai"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL="http://localhost:3001"
CORS_ORIGIN="http://localhost:3001"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
```

### 🔑 Générer un JWT Secret

```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64
```

---

## 🗄️ ÉTAPE 2 : Configuration Base de Données

### Option A : PostgreSQL Local

#### 2.1 Installer PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Télécharger depuis https://www.postgresql.org/download/windows/

#### 2.2 Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base de données
CREATE DATABASE samaplanner;

# Créer un utilisateur (optionnel)
CREATE USER samaplanner_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE samaplanner TO samaplanner_user;

# Quitter
\q
```

#### 2.3 Mettre à jour DATABASE_URL dans `.env`

```env
DATABASE_URL="postgresql://samaplanner_user:votre_mot_de_passe@localhost:5432/samaplanner?schema=public"
```

### Option B : Docker Compose (Recommandé)

#### 2.1 Démarrer PostgreSQL avec Docker

```bash
cd /Users/mac/PlannerApp
docker-compose up -d postgres
```

#### 2.2 Mettre à jour DATABASE_URL dans `.env`

```env
DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"
```

---

## 📦 ÉTAPE 3 : Installation des Dépendances

```bash
cd backend
npm install
```

---

## 🗃️ ÉTAPE 4 : Configuration Prisma

### 4.1 Générer Prisma Client

```bash
npm run prisma:generate
```

### 4.2 Créer les migrations

```bash
npm run prisma:migrate dev --name init
```

Cela va :
- Créer le fichier de migration
- Appliquer la migration à la base de données
- Générer le Prisma Client

### 4.3 (Optionnel) Seed la base de données

Si vous avez un fichier de seed :
```bash
npm run prisma:seed
```

---

## 🚀 ÉTAPE 5 : Démarrer le Backend

### Mode Développement (avec hot-reload)

```bash
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

### Vérifier que ça fonctionne

```bash
# Test simple
curl http://localhost:3000/api

# Ou ouvrir dans le navigateur
open http://localhost:3000/api
```

---

## ✅ VÉRIFICATION

### Tester un endpoint

```bash
# Test Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+221771234567",
    "pin": "1234"
  }'
```

Si vous obtenez une réponse avec `user` et `token`, tout fonctionne ! 🎉

---

## 🐛 DÉPANNAGE

### Erreur : `Environment variable not found: DATABASE_URL`

**Solution :** Vérifiez que le fichier `.env` existe et contient `DATABASE_URL`

### Erreur : `Can't reach database server`

**Solution :** 
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez la connexion avec `psql -U user -d samaplanner`
3. Vérifiez que `DATABASE_URL` est correcte

### Erreur : `P1001: Can't reach database server`

**Solution :** 
- Si Docker : `docker-compose ps` pour vérifier que le conteneur est actif
- Si local : `brew services list` (macOS) ou `sudo systemctl status postgresql` (Linux)

### Erreur : `Prisma schema validation - (validate wasm)`

**Solution :** Vérifiez que le schéma Prisma est valide :
```bash
npx prisma validate
```

### Erreur : `⚠️ OPENAI_API_KEY not configured`

**Solution :** Cette erreur n'empêche pas le démarrage, mais vous ne pourrez pas utiliser l'IA. Ajoutez votre clé OpenAI dans `.env` :

```env
OPENAI_API_KEY="sk-votre-cle"
```

---

## 📝 VARIABLES D'ENVIRONNEMENT REQUISES

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/samaplanner` |
| `JWT_SECRET` | Secret pour signer les JWT | `your-secret-key` |
| `OPENAI_API_KEY` | Clé API OpenAI (optionnel) | `sk-...` |
| `PORT` | Port du serveur (optionnel) | `3000` |
| `FRONTEND_URL` | URL du frontend pour CORS | `http://localhost:3001` |

---

## 🔐 SÉCURITÉ EN PRODUCTION

⚠️ **IMPORTANT** : Ne commitez jamais le fichier `.env` !

1. Utilisez des secrets forts pour `JWT_SECRET`
2. Changez tous les mots de passe par défaut
3. Utilisez HTTPS en production
4. Configurez des variables d'environnement sécurisées (AWS Secrets Manager, etc.)

---

## 📚 COMMANDES UTILES

```bash
# Générer Prisma Client
npm run prisma:generate

# Créer une nouvelle migration
npm run prisma:migrate dev --name nom_migration

# Appliquer migrations en production
npm run prisma:migrate deploy

# Voir la base de données dans Prisma Studio
npm run prisma:studio

# Format code
npm run format

# Linter
npm run lint

# Tests
npm run test
```

---

**Une fois ces étapes complétées, votre backend sera opérationnel ! 🎉**

