# Instructions de Setup - SamaPlanner

**Guide complet pour démarrer le développement**

---

## 📋 Prérequis

- Node.js 20+ installé
- Docker & Docker Compose installés
- Git installé
- Un compte OpenAI avec clé API (pour Whisper et GPT-4)

---

## 🚀 Setup Complet

### Étape 1 : Démarrer PostgreSQL

```bash
# Depuis la racine du projet
docker-compose up -d postgres

# Vérifier que PostgreSQL est démarré
docker ps
# Vous devriez voir le container "samaplanner-postgres" en cours d'exécution
```

### Étape 2 : Setup Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier .env.example vers .env
cp .env.example .env

# Éditer .env et ajouter vos clés :
# - DATABASE_URL (déjà configuré pour Docker)
# - JWT_SECRET (générer une clé secrète)
# - OPENAI_API_KEY (votre clé OpenAI)

# Générer le client Prisma
npm run prisma:generate

# Créer les migrations et la base de données
npm run prisma:migrate

# (Optionnel) Ouvrir Prisma Studio pour voir la base de données
npm run prisma:studio

# Démarrer le backend en mode développement
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

### Étape 3 : Setup Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
echo "API_BASE_URL=http://localhost:3000/api" > .env

# Démarrer le frontend en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3001`

---

## ✅ Vérification

### Backend
- Ouvrir `http://localhost:3000/api` → Devrait retourner une erreur 404 (normal, pas de route racine)
- Vérifier les logs : `🚀 Backend running on http://localhost:3000`

### Frontend
- Ouvrir `http://localhost:3001` → Devrait afficher la page onboarding
- Vérifier la console navigateur : Pas d'erreurs critiques

### Base de Données
- Ouvrir Prisma Studio : `cd backend && npm run prisma:studio`
- Vérifier que les tables sont créées (User, Task, Planning, etc.)

---

## 🐛 Dépannage

### Erreur : "Cannot connect to database"
- Vérifier que Docker est démarré : `docker ps`
- Vérifier que le container PostgreSQL est actif
- Vérifier la DATABASE_URL dans `.env`

### Erreur : "Module not found"
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller : `npm install`

### Erreur : "Prisma Client not generated"
- Exécuter : `npm run prisma:generate`

### Erreur : Port déjà utilisé
- Changer le port dans `.env` (PORT=3001 pour backend)
- Ou arrêter le processus utilisant le port

---

## 📝 Prochaines Étapes

Une fois le setup terminé :

1. **Tester l'authentification** :
   - Aller sur `/onboarding`
   - Suivre le flux : phone → otp → pin
   - Vérifier que le compte est créé

2. **Tester l'enregistrement audio** :
   - Aller sur `/home`
   - Cliquer sur le bouton microphone
   - Autoriser l'accès au microphone
   - Enregistrer un message

3. **Développer les modules backend manquants** :
   - Voir `CHECKLIST.md` pour les tâches restantes
   - Commencer par AuthModule complet

---

## 🔧 Commandes Utiles

### Backend
```bash
npm run start:dev      # Démarrage développement
npm run build          # Build production
npm run test           # Tests
npm run prisma:studio  # Interface graphique Prisma
npm run prisma:migrate # Créer migration
```

### Frontend
```bash
npm run dev            # Démarrage développement
npm run build          # Build production
npm run generate       # Génération statique
npm run lint           # Linter
npm run typecheck      # Vérification TypeScript
```

### Docker
```bash
docker-compose up -d           # Démarrer services
docker-compose down            # Arrêter services
docker-compose logs postgres   # Voir logs PostgreSQL
docker-compose restart postgres # Redémarrer PostgreSQL
```

---

## 📚 Documentation

- **PRD.md** : Spécifications complètes
- **CHECKLIST.md** : Tâches à réaliser
- **DESIGN_SYSTEM.md** : Design System
- **COMPONENTS_GUIDE.md** : Guide composants
- **ROADMAP_IMPLEMENTATION.md** : Roadmap détaillée

---

**Bon développement ! 🚀**

