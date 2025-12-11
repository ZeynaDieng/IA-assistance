# 🔐 Correction Erreur 401 (Unauthorized)

**Date :** Décembre 2024

---

## ❌ Problème

Erreur 401 lors de l'upload audio :
```
POST http://localhost:3000/api/audio/upload 401 (Unauthorized)
```

**Cause :** Le token JWT n'était pas présent ou n'était pas envoyé correctement dans les requêtes.

---

## ✅ Solutions Appliquées

### 1. **Plugin d'Initialisation Auth** (`plugins/auth.client.ts`)

Nouveau plugin Nuxt qui initialise automatiquement l'authentification au démarrage de l'application :

```typescript
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.initialize()
})
```

Ce plugin garantit que le token et l'utilisateur sont restaurés depuis `localStorage` dès le démarrage.

### 2. **Vérification du Token dans `uploadAudio()`**

Ajout de vérifications avant chaque requête :

```typescript
// Ensure auth is initialized
if (!authStore.isLoggedIn) {
  authStore.initialize()
}

// Check if token exists
if (!authStore.token) {
  throw new Error('Non authentifié. Veuillez vous connecter.')
}
```

### 3. **Gestion Améliorée des Erreurs 401**

Détection des erreurs 401 avec messages clairs :

```typescript
if (!response.ok) {
  if (response.status === 401) {
    // Token invalid or expired, clear auth and redirect
    authStore.logout()
    throw new Error('Session expirée. Veuillez vous reconnecter.')
  }
  // ...
}
```

### 4. **Vérification Auth dans `processing.vue`**

Vérification de l'authentification avant de traiter l'audio :

```typescript
// Check authentication first
const authStore = useAuthStore()
authStore.initialize()

if (!authStore.isLoggedIn || !authStore.token) {
  router.push('/onboarding')
  return
}
```

---

## 🔄 Workflow Corrigé

1. **Au démarrage** : Plugin initialise l'auth depuis `localStorage`
2. **Avant upload** : Vérification que l'utilisateur est authentifié
3. **Si 401** : Déconnexion automatique + redirection vers `/onboarding`
4. **Messages clairs** : Messages d'erreur explicites pour l'utilisateur

---

## ✅ Test

**Pour tester :**

1. Se connecter avec un compte
2. Enregistrer un audio
3. L'upload devrait fonctionner avec le token JWT

**Si vous obtenez toujours une erreur 401 :**

1. Vérifiez que vous êtes bien connecté (token présent dans `localStorage`)
2. Vérifiez que le backend est démarré
3. Vérifiez que le token n'est pas expiré

---

## 📋 Checklist

- ✅ Plugin d'initialisation auth créé
- ✅ Vérification token dans `uploadAudio()`
- ✅ Vérification token dans `transcribeAudio()`
- ✅ Gestion erreurs 401 améliorée
- ✅ Vérification auth dans `processing.vue`

---

**Le problème 401 devrait maintenant être résolu ! 🎉**

