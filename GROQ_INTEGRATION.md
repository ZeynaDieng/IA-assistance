# ✅ Intégration Groq - Whisper & Llama 3.1

**Date :** Décembre 2024

---

## 🎯 Changements Effectués

L'application SamaPlanner utilise maintenant **Groq** au lieu d'OpenAI pour :

1. **Transcription vocale** : Groq Whisper Large V3
2. **Extraction de tâches** : Groq Llama 3.1 70B Instruct

---

## 📝 Modifications Techniques

### 1. Service de Transcription (`whisper.service.ts`)

**Changements :**
- ✅ API endpoint : `https://api.groq.com/openai/v1/audio/transcriptions`
- ✅ Modèle : `whisper-large-v3`
- ✅ Variable d'environnement : `GROQ_API_KEY` (au lieu de `OPENAI_API_KEY`)

**Code :**
```typescript
this.groqApiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions'
formData.append('model', 'whisper-large-v3')
Authorization: `Bearer ${this.groqApiKey}`
```

### 2. Service d'Extraction (`gpt.service.ts`)

**Changements :**
- ✅ API endpoint : `https://api.groq.com/openai/v1/chat/completions`
- ✅ Modèle : `llama-3.1-70b-instruct`
- ✅ Variable d'environnement : `GROQ_API_KEY`
- ✅ Format de réponse : JSON object forcé

**Code :**
```typescript
this.groqApiUrl = "https://api.groq.com/openai/v1/chat/completions"
model: "llama-3.1-70b-instruct"
response_format: { type: "json_object" }
```

---

## 🔑 Configuration

### Variable d'Environnement

Dans `backend/.env` :

```env
GROQ_API_KEY="gsk_votre-cle-groq-ici"
```

**Important :** Remplacez `OPENAI_API_KEY` par `GROQ_API_KEY` dans votre fichier `.env`.

### Obtenir une Clé API Groq

Voir le fichier `HOW_TO_GET_GROQ_API_KEY.md` pour les instructions complètes.

**Résumé rapide :**
1. Aller sur https://console.groq.com/
2. Créer un compte
3. Générer une clé API sur https://console.groq.com/keys
4. Ajouter dans `backend/.env` : `GROQ_API_KEY="gsk_..."`
5. Redémarrer le backend

---

## 🚀 Avantages de Groq

### Performance
- ⚡ **Ultra-rapide** : Latence très faible grâce au LPU (Language Processing Unit)
- 🎯 **Haute précision** : Whisper Large V3 offre une transcription excellente
- 💪 **Puissant** : Llama 3.1 70B est un modèle performant

### Coûts
- 💰 **Tarification compétitive** : Coûts réduits par rapport à d'autres services
- 🎁 **Tier gratuit** : Offre généreuse pour le développement

---

## 🔄 Migration depuis OpenAI

### Étapes de Migration

1. ✅ **Code mis à jour** : Les services utilisent maintenant Groq
2. ⏳ **Variables d'environnement** : Remplacer `OPENAI_API_KEY` par `GROQ_API_KEY`
3. ⏳ **Obtenir une clé Groq** : Créer un compte et générer une clé
4. ⏳ **Tester** : Vérifier que la transcription et l'extraction fonctionnent

### Fichiers Modifiés

- ✅ `backend/src/ai/whisper.service.ts`
- ✅ `backend/src/ai/gpt.service.ts`
- ✅ `backend/ENV_EXAMPLE.txt`
- ✅ `HOW_TO_GET_GROQ_API_KEY.md` (nouveau)

---

## 🧪 Tester l'Intégration

### 1. Vérifier la Configuration

```bash
cd backend
cat .env | grep GROQ_API_KEY
```

Vous devriez voir :
```
GROQ_API_KEY="gsk_..."
```

### 2. Redémarrer le Backend

```bash
npm run start:dev
```

Vous ne devriez **PAS** voir :
```
⚠️  GROQ_API_KEY not configured
```

### 3. Tester la Transcription

1. Enregistrer un message vocal depuis l'app
2. Vérifier que la transcription fonctionne
3. Vérifier que l'extraction de tâches fonctionne

---

## 📊 Modèles Utilisés

### Whisper Large V3
- **Usage** : Transcription vocale
- **Précision** : Excellente pour le français et le wolof
- **Vitesse** : Ultra-rapide avec Groq

### Llama 3.1 70B Instruct
- **Usage** : Extraction de tâches depuis la transcription
- **Capacités** : Compréhension contextuelle avancée
- **Format** : JSON structuré pour les tâches

---

## ⚠️ Notes Importantes

1. **Format JSON** : Llama 3.1 nécessite `response_format: { type: "json_object" }` pour garantir un JSON valide
2. **Rate Limits** : Groq a ses propres limites de taux (généralement plus généreuses)
3. **Gestion d'erreurs** : Les mêmes mécanismes de retry s'appliquent

---

## 🔍 Dépannage

### Erreur : "GROQ_API_KEY not configured"
- Vérifier que `GROQ_API_KEY` est dans `backend/.env`
- Redémarrer le backend

### Erreur : "401 Unauthorized"
- Vérifier que la clé API est correcte
- Vérifier que la clé commence par `gsk_`
- Régénérer une nouvelle clé sur https://console.groq.com/keys

### Transcription ne fonctionne pas
- Vérifier le format audio (supporté : mp3, wav, m4a)
- Vérifier la taille du fichier (max 25MB généralement)
- Consulter les logs du backend

---

## ✅ Checklist de Migration

- [ ] Compte Groq créé sur https://console.groq.com/
- [ ] Clé API Groq générée
- [ ] `GROQ_API_KEY` ajoutée dans `backend/.env`
- [ ] Ancienne `OPENAI_API_KEY` retirée (optionnel)
- [ ] Backend redémarré
- [ ] Test de transcription réussi
- [ ] Test d'extraction de tâches réussi

---

**L'intégration Groq est complète ! 🎉**

