# 🔧 Correction Erreur 400 - Transcription DTO

**Date :** Décembre 2024

---

## ❌ Problème

Erreur 400 lors de la transcription :
```
POST http://localhost:3000/api/ai/transcribe 400 (Bad Request)
Error: property audioLogId should not exist
```

**Cause :** Le DTO `TranscribeDto` dans le contrôleur AI n'avait pas de décorateurs de validation. Avec `ValidationPipe` configuré avec `whitelist: true` dans `main.ts`, NestJS rejette automatiquement toutes les propriétés qui ne sont pas explicitement déclarées avec des décorateurs de validation.

---

## ✅ Solution

Ajout des décorateurs de validation manquants dans `backend/src/ai/ai.controller.ts` :

### Avant
```typescript
class TranscribeDto {
  audioLogId: string
}

class ExtractTasksDto {
  transcription: string
}
```

### Après
```typescript
import { IsString, IsNotEmpty } from 'class-validator'

class TranscribeDto {
  @IsString()
  @IsNotEmpty()
  audioLogId: string
}

class ExtractTasksDto {
  @IsString()
  @IsNotEmpty()
  transcription: string
}
```

---

## 📋 Explication

Quand `ValidationPipe` est configuré avec :
- `whitelist: true` → Supprime les propriétés sans décorateurs
- `forbidNonWhitelisted: true` → Rejette les requêtes avec des propriétés non whitelistées

NestJS nécessite que chaque propriété du DTO ait des décorateurs de validation (`@IsString()`, `@IsNotEmpty()`, etc.) pour être acceptée.

---

## 🔄 Redémarrer le Backend

**IMPORTANT :** Redémarrer le backend pour que les changements prennent effet :

```bash
cd backend
npm run start:dev
```

---

## ✅ Test

Après redémarrage, la transcription devrait fonctionner correctement :
1. Enregistrer un audio
2. Upload vers le backend
3. Transcription via Whisper API
4. Réception de la transcription

---

**Le problème 400 est maintenant résolu ! 🎉**

