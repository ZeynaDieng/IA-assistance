# 🔄 Gestion des Rate Limits OpenAI (429)

**Date :** Décembre 2024

---

## ❌ Problème

Erreur 429 (Too Many Requests) d'OpenAI lors de la transcription ou extraction de tâches :
```
Error: Rate limit exceeded. Please try again later.
```

**Cause :** La limite de taux d'OpenAI a été dépassée. Les comptes gratuits ont des limites strictes sur le nombre de requêtes par minute.

---

## ✅ Solution Appliquée

Amélioration de la gestion des erreurs 429 avec :

### 1. **Backend - Whisper Service**

Retourne maintenant une erreur HTTP 429 appropriée avec le délai de retry :

```typescript
if (error.response?.status === 429) {
  const errorMessage = error.response?.data?.error?.message || 'Rate limit exceeded'
  const retryAfter = error.response?.headers?.['retry-after']
  
  throw new HttpException(
    {
      statusCode: 429,
      message: errorMessage,
      error: 'Too Many Requests',
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : 60
    },
    HttpStatus.TOO_MANY_REQUESTS
  )
}
```

### 2. **Backend - GPT Service**

Même traitement pour l'extraction de tâches.

### 3. **Frontend - Audio Store**

Détection des erreurs 429 avec message en français :

```typescript
if (response.status === 429) {
  const errorData = await response.json().catch(() => ({}))
  const retryAfter = errorData.retryAfter || 60
  throw new Error(
    `Limite de requêtes dépassée. Veuillez réessayer dans ${retryAfter} seconde${retryAfter > 1 ? 's' : ''}.`
  )
}
```

---

## 📊 Limites OpenAI

### Comptes Gratuits (Tier 1)
- **Whisper API** : 50 requêtes/minute
- **GPT-4 API** : 3 requêtes/minute
- **GPT-3.5-turbo** : 3 requêtes/minute

### Comptes Payants
- Limites plus élevées selon le plan
- Voir : https://platform.openai.com/docs/guides/rate-limits

---

## 🔧 Solutions Temporaires

### Option 1 : Attendre

Attendre 1-2 minutes avant de réessayer.

### Option 2 : Passer à un Compte Payant

Les comptes payants ont des limites beaucoup plus élevées.

### Option 3 : Implémenter un Retry Logic (Futur)

```typescript
// Future implementation
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        const retryAfter = error.response?.headers?.['retry-after'] || 60
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }
      throw error
    }
  }
}
```

---

## 🧪 Tester

1. **Attendre 1-2 minutes** après avoir atteint la limite
2. **Réessayer l'enregistrement** audio
3. La transcription devrait fonctionner

---

## 💡 Conseils

1. **Limiter les tests** : Ne pas faire trop de requêtes en peu de temps
2. **Utiliser un compte payant** pour le développement/production
3. **Mettre en cache** les transcriptions déjà effectuées (déjà implémenté dans le backend)

---

## ✅ Statut

- ✅ Erreur 429 détectée correctement
- ✅ Message d'erreur clair en français
- ✅ Retry-after affiché à l'utilisateur
- ⏳ Retry automatique (à implémenter)

---

**La gestion des rate limits est maintenant améliorée ! 🎉**

