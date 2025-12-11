# ✅ Solution Rate Limit 429 - Retry Automatique

**Date :** Décembre 2024

---

## ❌ Problème

Erreur 429 (Too Many Requests) lors de la transcription :
```
POST http://localhost:3000/api/ai/transcribe 429 (Too Many Requests)
Error: Limite de traitement atteinte. Veuillez réessayer dans 60 secondes.
```

**Cause :** La limite de taux du service de traitement a été dépassée (environ 50 requêtes/minute pour la transcription vocale).

---

## ✅ Solution Implémentée

### 1. **Retry Automatique**

Ajout d'un retry automatique avec backoff dans `transcribeAudio()` et `extractTasks()` :

```typescript
const transcribeAudio = async (audioLogId: string, retryCount = 0): Promise<string> => {
  // ... requête ...
  
  if (response.status === 429) {
    const retryAfter = errorData.retryAfter || 60
    
    // Auto-retry une fois après attente
    if (retryCount === 0) {
      console.log(`⏳ Rate limit atteint. Retry automatique dans ${retryAfter}s...`)
      await new Promise(resolve => setTimeout(resolve, (retryAfter + 5) * 1000))
      return transcribeAudio(audioLogId, retryCount + 1)
    }
    
    // Si retry échoue aussi, erreur
    throw new Error(...)
  }
}
```

### 2. **Message Amélioré**

Messages d'erreur plus clairs avec conseils :

```typescript
throw new Error(
  `Limite de traitement atteinte. Notre serveur nécessite un peu de temps avant de traiter une nouvelle demande.\n\n⏰ Veuillez réessayer dans ${retryAfter}s.\n\n💡 Astuce: Pour éviter cette limite, espacer vos enregistrements de quelques minutes.`
)
```

### 3. **Affichage dans UI**

Le message s'affiche dans la page `processing.vue` pendant 5 secondes avant redirection.

---

## 🔄 Comportement

### Première Tentative
1. Requête vers le service de traitement
2. Si 429 → Affichage du compte à rebours dans l'UI
3. Attendre `retryAfter + 5s` avec mise à jour chaque seconde
4. Retry automatique

### Si Retry Réussit
1. ✅ Transcription continue normalement
2. Navigation vers la page suivante

### Si Retry Échoue
1. Message d'erreur clair affiché dans l'UI
2. Affichage pendant 5 secondes
3. Redirection vers `/home`
4. L'utilisateur peut réessayer manuellement

---

## 📊 Limites de Traitement

### Limites Actuelles
- **Transcription vocale** : ~50 requêtes/minute
- **Extraction de tâches** : ~3 requêtes/minute

### Solutions
1. **Attendre 1-2 minutes** avant de réessayer
2. **Espacer les enregistrements** : Limites beaucoup plus élevées en production
3. **Limiter les tests** : Ne pas faire trop de requêtes rapidement

---

## ✅ Avantages

- ✅ **Retry automatique** : Une tentative supplémentaire sans intervention
- ✅ **Compte à rebours visuel** : L'utilisateur voit le temps restant dans l'UI
- ✅ **Mise à jour en temps réel** : Le compte à rebours se met à jour chaque seconde
- ✅ **Messages clairs** : L'utilisateur comprend le problème
- ✅ **Pas de boucle infinie** : Maximum 1 retry automatique
- ✅ **UX améliorée** : Interface informative et rassurante

---

## 🧪 Tester

1. Si vous recevez une erreur 429 :
   - Le système attendra automatiquement
   - Retry automatique après `retryAfter + 5s`
   - Si toujours 429, message clair affiché

2. **Pour éviter les rate limits** :
   - Espacer les tests de 1-2 minutes
   - Limiter le nombre de requêtes simultanées

---

**Le retry automatique est maintenant implémenté ! 🎉**

