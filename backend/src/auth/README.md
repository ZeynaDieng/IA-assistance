# Auth Module - Documentation

Module d'authentification pour Zeii

## Endpoints

### POST /api/auth/register

**Description :** Enregistrer un nouvel utilisateur

**Body :**
```json
{
  "phoneNumber": "+221771234567",
  "pin": "1234"
}
```

**Response (201) :**
```json
{
  "user": {
    "id": "clx...",
    "phoneNumber": "+221771234567",
    "createdAt": "2024-12-07T10:00:00.000Z",
    "updatedAt": "2024-12-07T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors :**
- `409 Conflict` : Phone number already registered
- `400 Bad Request` : Invalid phone number or PIN format

---

### POST /api/auth/login

**Description :** Se connecter avec numéro de téléphone et PIN

**Body :**
```json
{
  "phoneNumber": "+221771234567",
  "pin": "1234"
}
```

**Response (200) :**
```json
{
  "user": {
    "id": "clx...",
    "phoneNumber": "+221771234567",
    "createdAt": "2024-12-07T10:00:00.000Z",
    "updatedAt": "2024-12-07T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors :**
- `401 Unauthorized` : Invalid phone number or PIN

---

## Protection des Routes

Pour protéger une route avec JWT, utiliser le guard :

```typescript
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { CurrentUser } from './auth/decorators/current-user.decorator'

@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user) {
  return user
}
```

---

## Variables d'environnement

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d
```

---

## Notes

- PIN est hashé avec bcrypt (10 rounds)
- JWT expire après 7 jours par défaut
- Phone number doit être au format international

