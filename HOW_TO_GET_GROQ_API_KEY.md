# 🔑 Comment Obtenir la Clé API Groq

**Date :** Décembre 2024

---

## 📋 Clé Requise dans `.env`

### `GROQ_API_KEY` - Clé API Groq

---

## 🤖 Obtenir la Clé API Groq

### Étape 1 : Créer un Compte Groq

1. Aller sur **https://console.groq.com/**
2. Cliquer sur **"Sign up"** (S'inscrire)
3. Créer un compte avec :
   - Email
   - Mot de passe
   - Vérification email

### Étape 2 : Générer une Clé API

1. Une fois connecté, aller sur **https://console.groq.com/keys**
2. Cliquer sur **"Create API Key"**
3. Donner un nom (ex: "SamaPlanner Dev")
4. **Copier la clé immédiatement** (elle ne sera plus visible après)
5. La clé commence par `gsk_...`

**Exemple de clé :**

```
gsk_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### Étape 3 : Ajouter la Clé dans `.env`

Dans le fichier `backend/.env` :

```env
GROQ_API_KEY="gsk_votre-cle-groq-ici"
```

---

## 💰 Coûts Groq

### Tarification (Décembre 2024)

Groq offre un **tier gratuit généreux** pour commencer :

- **Whisper Large V3** : Très rapide et précis pour la transcription
- **Llama 3.1 70B** : Modèle performant pour l'extraction de tâches
- **Limites** : Vérifiez les limites actuelles sur https://console.groq.com/

### Avantages de Groq

- ⚡ **Très rapide** : Inférence ultra-rapide grâce à leur LPU (Language Processing Unit)
- 💰 **Coût réduit** : Tarification compétitive
- 🚀 **Performances** : Latence très faible pour une meilleure expérience utilisateur

---

## 🔒 Sécurité des Clés

### ⚠️ RÈGLES IMPORTANTES

1. **NE JAMAIS** commiter le fichier `.env` dans Git
2. **NE JAMAIS** partager vos clés API publiquement
3. **NE JAMAIS** mettre les clés dans le code source
4. Utiliser des clés différentes pour dev/staging/production

### Vérifier que `.env` est dans `.gitignore`

```bash
cd backend
cat .gitignore | grep .env
```

Si rien n'apparaît, ajoutez :

```bash
echo ".env" >> .gitignore
```

---

## 📝 Exemple de `.env` Complet

```env
# Database
DATABASE_URL="postgresql://samaplanner:password@localhost:5432/samaplanner?schema=public"

# JWT Secret (généré avec: openssl rand -hex 64)
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2"

# Groq API Key (obtenu depuis https://console.groq.com/keys)
GROQ_API_KEY="gsk_votre-cle-groq-ici"

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

---

## 🧪 Tester la Clé

### Test Simple

La clé API est testée automatiquement lors de la première utilisation. Si la clé est invalide, vous recevrez une erreur lors de la transcription ou de l'extraction de tâches.

### Vérifier dans les Logs

Après avoir démarré le backend, vous ne devriez pas voir :
```
⚠️  GROQ_API_KEY not configured
```

---

## 📚 Ressources

- **Groq Console :** https://console.groq.com/
- **Documentation Groq :** https://groq.com/docs/
- **API Keys Management :** https://console.groq.com/keys

---

## ✅ Checklist

- [ ] Compte Groq créé sur https://console.groq.com/
- [ ] Clé API Groq créée
- [ ] GROQ_API_KEY ajoutée dans `backend/.env`
- [ ] `.env` vérifié dans `.gitignore`
- [ ] Backend redémarré pour charger la nouvelle clé

---

**Une fois la clé configurée, redémarrez le backend pour qu'elle soit prise en compte ! 🚀**

