# 🔑 Comment Obtenir les Clés API Nécessaires

**Date :** Décembre 2024

---

## 📋 Clés Requises dans `.env`

### 1. `JWT_SECRET` (Ligne 5)

### 2. `API_KEY_IA` (Ligne 8) - Clé API pour le service IA

---

## 🔐 1. JWT_SECRET - Générer une Clé Secrète

### Option A : Génération Automatique (Recommandé)

```bash
# Avec Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Avec OpenSSL
openssl rand -hex 64

# Avec Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

**Exemple de résultat :**

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### Option B : Génération en Ligne

1. Aller sur https://randomkeygen.com/
2. Choisir "CodeIgniter Encryption Keys"
3. Copier une clé de 64 caractères

### Option C : Utiliser un Générateur de Mots de Passe

- https://1password.com/password-generator/
- https://www.lastpass.com/features/password-generator

**⚠️ Important :** Utilisez une clé d'au moins 32 caractères, idéalement 64+.

---

## 🤖 2. Clés API pour le Service IA - Système de Fallback Automatique

### Configuration du Service IA

Le système utilise **deux APIs en fallback automatique** :

1. **Groq** (prioritaire) - Rapide et gratuit
2. **OpenAI** (fallback) - Se déclenche automatiquement si Groq atteint sa limite

**Quand une API atteint sa limite (erreur 429), le système bascule automatiquement sur l'autre !**

### Configuration Recommandée

**Option 1 : Groq seulement (gratuit, rapide)**

```env
GROQ_API_KEY="votre-cle-groq-ici"
```

**Option 2 : Groq + OpenAI (recommandé pour production)**

```env
GROQ_API_KEY="votre-cle-groq-ici"
OPENAI_API_KEY="votre-cle-openai-ici"
```

**Option 3 : OpenAI seulement**

```env
OPENAI_API_KEY="votre-cle-openai-ici"
```

### Comment obtenir les clés

#### Groq API (Recommandé - Gratuit)

1. Aller sur https://console.groq.com/
2. Créer un compte
3. Obtenir votre clé API dans "API Keys"
4. Coller dans `.env` : `GROQ_API_KEY="votre-cle"`

#### OpenAI API (Fallback - Payant)

1. Aller sur https://platform.openai.com/api-keys
2. Créer un compte ou se connecter
3. Créer une nouvelle clé API
4. Coller dans `.env` : `OPENAI_API_KEY="votre-cle"`

---

## 💰 Coûts du Service IA

### Système de Fallback Automatique

Le système utilise **Groq en priorité** (gratuit) et bascule automatiquement sur **OpenAI** (payant) si Groq atteint sa limite (429).

### Tarification

#### Groq (Prioritaire)

- **Gratuit** avec limites de taux (rate limits)
- Transcription Whisper : Gratuit
- Extraction de tâches (Llama 3.3) : Gratuit
- **Limite :** ~30 requêtes/minute, puis fallback automatique sur OpenAI

#### OpenAI (Fallback)

- **Payant** mais plus fiable
- Transcription Whisper : ~$0.006 par minute d'audio
- Extraction de tâches (GPT-4o-mini) : ~$0.00015 par 1000 tokens

### Exemple de Coûts (si OpenAI est utilisé en fallback)

- **1 enregistrement vocal de 1 minute** :

  - Transcription : ~$0.006
  - Extraction tâches : ~$0.001
  - **Total : ~$0.007 par enregistrement**

- **100 enregistrements** : ~$0.70
- **1000 enregistrements** : ~$7

**Note :** Avec Groq en priorité, la plupart des requêtes sont gratuites !

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

# API Keys pour le Service IA (système de fallback automatique)
# Groq (prioritaire, gratuit) : https://console.groq.com/
GROQ_API_KEY="votre-cle-groq-ici"
# OpenAI (fallback, payant) : https://platform.openai.com/api-keys
OPENAI_API_KEY="votre-cle-openai-ici"

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

## 🚀 Configuration Rapide

### Script Automatique

```bash
cd backend

# Générer JWT_SECRET
JWT_SECRET=$(openssl rand -hex 64)
echo "JWT_SECRET généré: $JWT_SECRET"

# Mettre à jour .env
sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env

echo "✅ JWT_SECRET mis à jour dans .env"
echo "⚠️  N'oubliez pas d'ajouter votre clé API IA manuellement !"
```

---

## 🧪 Tester les Clés

### Tester JWT_SECRET

Le backend utilisera automatiquement cette clé. Si elle est invalide, vous aurez des erreurs lors de l'authentification.

### Tester la Clé API IA

La clé API est testée automatiquement lors de la première utilisation. Si la clé est invalide, vous recevrez une erreur lors de la transcription ou de l'extraction de tâches.

---

## 📚 Ressources

- **JWT Best Practices :** https://jwt.io/introduction
- **Documentation API :** Contactez l'administrateur système pour la documentation complète

---

## ✅ Checklist

- [ ] JWT_SECRET généré (64+ caractères)
- [ ] JWT_SECRET ajouté dans `.env`
- [ ] GROQ_API_KEY obtenue (https://console.groq.com/) - **Recommandé**
- [ ] GROQ_API_KEY ajoutée dans `.env` du backend
- [ ] (Optionnel) OPENAI_API_KEY obtenue (https://platform.openai.com/) - Pour fallback
- [ ] (Optionnel) OPENAI_API_KEY ajoutée dans `.env` du backend
- [ ] `.env` vérifié dans `.gitignore`
- [ ] Backend redémarré pour charger les nouvelles clés

## 🔄 Fonctionnement du Fallback Automatique

1. **Première tentative :** Le système essaie d'abord Groq (rapide et gratuit)
2. **Si erreur 429 (rate limit) :** Bascule automatiquement sur OpenAI
3. **Si erreur autre :** Log l'erreur et utilise OpenAI si disponible
4. **Si les deux échouent :** Retourne une erreur explicite à l'utilisateur

**Avantages :**

- ✅ Groq gratuit pour la plupart des requêtes
- ✅ Pas d'interruption si limite atteinte (fallback automatique)
- ✅ Transparent pour l'utilisateur
- ✅ Aucune configuration supplémentaire nécessaire

---

**Une fois les clés configurées, redémarrez le backend pour qu'elles soient prises en compte ! 🚀**
