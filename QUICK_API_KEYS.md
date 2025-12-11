# ⚡ Guide Rapide - Obtenir les Clés API

---

## 🔑 1. JWT_SECRET (Ligne 5)

### ✅ DÉJÀ GÉNÉRÉ ET CONFIGURÉ !

Un JWT_SECRET sécurisé a été généré automatiquement et ajouté à votre `.env`.

**Valeur générée :**
```
7017487c8ae4a1e486f8d038ab103f2d121d97443acc301f318e41a1a9a2499a8cebac444d8fd085c3a1fd8ebbb9ca2ee5189f6663420835c4574eca2593f7fa
```

✅ **C'est fait !** Pas besoin de le changer.

---

## 🤖 2. OPENAI_API_KEY (Ligne 8)

### 📝 Étapes pour Obtenir la Clé OpenAI

#### Étape 1 : Créer un Compte

1. Aller sur **https://platform.openai.com/**
2. Cliquer sur **"Sign up"** (S'inscrire)
3. Créer un compte (email + mot de passe)

#### Étape 2 : Ajouter un Mode de Paiement

⚠️ **Important :** Nécessaire même pour les crédits gratuits.

1. Aller dans **Settings** → **Billing**
2. Cliquer sur **"Add payment method"**
3. Ajouter une carte bancaire
4. Vous recevrez **$5 de crédits gratuits** 🎁

#### Étape 3 : Créer la Clé API

1. Aller sur **https://platform.openai.com/api-keys**
2. Cliquer sur **"Create new secret key"**
3. Donner un nom (ex: "SamaPlanner")
4. **Copier la clé** (elle commence par `sk-...`)
5. ⚠️ **Important :** Copiez-la maintenant, elle ne sera plus visible après !

#### Étape 4 : Ajouter dans `.env`

Éditez le fichier `backend/.env` et remplacez :

```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

Par :

```env
OPENAI_API_KEY="sk-proj-votre-vraie-cle-ici"
```

---

## 🚀 Script Automatique

Pour générer un nouveau JWT_SECRET à tout moment :

```bash
cd backend
./GENERATE_KEYS.sh
```

---

## 💰 Coûts OpenAI

- **$5 de crédits gratuits** à l'inscription
- **Whisper (transcription)** : ~$0.006 par minute
- **GPT-4 (extraction)** : ~$0.01 par requête
- **Total par enregistrement** : ~$0.016

**Avec $5, vous pouvez tester ~300 enregistrements !** 🎉

---

## ✅ Vérification

Une fois l'OPENAI_API_KEY ajoutée, redémarrez le backend :

```bash
cd backend
npm run start:dev
```

Le backend devrait démarrer sans l'avertissement `⚠️ OPENAI_API_KEY not configured`.

---

## 📚 Documentation Complète

Pour plus de détails, voir : `HOW_TO_GET_API_KEYS.md`

---

**Résumé :**
- ✅ JWT_SECRET : **Déjà configuré automatiquement**
- ⏳ OPENAI_API_KEY : **À obtenir sur https://platform.openai.com/api-keys**

