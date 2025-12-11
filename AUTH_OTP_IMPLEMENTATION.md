# Implémentation Authentification OTP

## Résumé des modifications

L'authentification a été modifiée pour utiliser un système OTP au lieu du PIN. Les sessions JWT durent maintenant 3 mois (90 jours).

## Changements Backend

### 1. Schéma Prisma (`backend/prisma/schema.prisma`)

**Ajouts :**
- `firstName` et `lastName` dans le modèle `User` (optionnels temporairement pour migration)
- `pinHash` rendu optionnel (commenté temporairement)
- Nouveau modèle `Otp` avec :
  - `phoneNumber`, `code` (6 chiffres), `expiresAt`, `verified`, `purpose` (REGISTER/LOGIN)
  - Relation optionnelle avec `User`
- Enum `OtpPurpose` (REGISTER, LOGIN)

### 2. DTOs (`backend/src/auth/dto/`)

**Nouveaux fichiers :**
- `send-otp.dto.ts` : `phoneNumber`, `purpose` (optionnel, default REGISTER)
- `verify-otp-register.dto.ts` : `phoneNumber`, `otp`, `firstName`, `lastName`
- `verify-otp-login.dto.ts` : `phoneNumber`, `otp`

**Anciens fichiers commentés :**
- `register.dto.ts` et `login.dto.ts` (basés sur PIN) - peuvent être réactivés plus tard

### 3. AuthService (`backend/src/auth/auth.service.ts`)

**Nouvelles méthodes :**
- `sendOtp(phoneNumber, purpose)` : Génère et stocke un OTP à 6 chiffres (expire en 5 minutes)
  - Pour REGISTER : vérifie que le numéro n'existe pas déjà
  - Pour LOGIN : vérifie que le numéro existe
  - Invalide les anciens OTP non vérifiés
  - Retourne le code OTP (dev seulement - à retirer en production)

- `verifyOtpRegister(phoneNumber, otp, firstName, lastName)` : 
  - Vérifie l'OTP (non expiré, non vérifié)
  - Crée l'utilisateur avec firstName et lastName
  - Génère un JWT (validité 90 jours)
  - Marque l'OTP comme vérifié

- `verifyOtpLogin(phoneNumber, otp)` :
  - Vérifie que l'utilisateur existe
  - Vérifie l'OTP (non expiré, non vérifié)
  - Génère un JWT (validité 90 jours)
  - Marque l'OTP comme vérifié

**Méthodes commentées :**
- `hashPin()`, `verifyPin()`, `register()`, `login()` (anciennes méthodes PIN)

### 4. AuthController (`backend/src/auth/auth.controller.ts`)

**Nouveaux endpoints :**
- `POST /api/auth/send-otp` : Envoyer un OTP
- `POST /api/auth/verify-otp-register` : Vérifier OTP et créer compte
- `POST /api/auth/verify-otp-login` : Vérifier OTP et connecter

**Endpoints commentés :**
- `POST /api/auth/register` (PIN)
- `POST /api/auth/login` (PIN)

### 5. Configuration JWT (`backend/src/auth/auth.module.ts`)

- Expiration changée de `7d` à `90d` (3 mois)

## Changements Frontend

### 1. Store Auth (`frontend/stores/auth.ts`)

**Interface User :**
- Ajout de `firstName?` et `lastName?`

**Nouvelles méthodes :**
- `sendOtp(phoneNumber, purpose)` : Appelle `/api/auth/send-otp`
- `verifyOtpRegister(phoneNumber, otp, firstName, lastName)` : Appelle `/api/auth/verify-otp-register`
- `verifyOtpLogin(phoneNumber, otp)` : Appelle `/api/auth/verify-otp-login`

**Méthodes commentées :**
- `generateOtp()`, `verifyOtp()`, `login()`, `register()` (anciennes méthodes)

### 2. Pages d'authentification

#### `pages/auth/phone.vue` (Inscription)
- **Avant** : Numéro de téléphone uniquement
- **Maintenant** : Prénom + Nom + Numéro de téléphone
- Envoie OTP via `sendOtp()` avec `purpose: 'REGISTER'`
- Redirige vers `/auth/otp` avec les données

#### `pages/auth/otp.vue` (Vérification OTP)
- **Avant** : OTP 4 chiffres généré localement
- **Maintenant** : OTP 6 chiffres depuis le backend
- Affiche le code OTP en dev (à retirer en production)
- Gère REGISTER et LOGIN
- Bouton "Renvoyer le code" (cooldown 30s)
- Validation automatique après 6 chiffres

#### `pages/auth/login.vue` (Connexion)
- **Avant** : Numéro + PIN
- **Maintenant** : Numéro uniquement
- Envoie OTP via `sendOtp()` avec `purpose: 'LOGIN'`
- Redirige vers `/auth/otp` avec `purpose: 'login'`

#### `pages/auth/pin.vue` (Commentée temporairement)
- Page conservée mais non utilisée dans le flux actuel

### 3. Pages utilisateur

#### `pages/home.vue`
- Affiche le nom complet (`firstName + lastName`) au lieu du numéro
- Fallback sur les 4 derniers chiffres si nom non disponible

#### `pages/profile.vue`
- Affiche le nom complet en titre
- Affiche le numéro de téléphone en sous-titre
- Stats dynamiques depuis `tasksStore`

## Flux d'authentification

### Inscription
1. Utilisateur → `/onboarding` → `/auth/phone`
2. Saisit : Prénom, Nom, Numéro de téléphone
3. Clique "Envoyer le code OTP"
4. Backend génère OTP (6 chiffres, expire en 5 min)
5. Utilisateur → `/auth/otp` (avec firstName, lastName, phone, purpose=register)
6. Saisit le code OTP (6 chiffres)
7. Backend vérifie OTP, crée utilisateur, génère JWT (90 jours)
8. Utilisateur → `/home` (connecté)

### Connexion
1. Utilisateur → `/auth/login`
2. Saisit : Numéro de téléphone
3. Clique "Envoyer le code OTP"
4. Backend génère OTP (6 chiffres, expire en 5 min)
5. Utilisateur → `/auth/otp` (avec phone, purpose=login)
6. Saisit le code OTP (6 chiffres)
7. Backend vérifie OTP, génère JWT (90 jours)
8. Utilisateur → `/home` (connecté)

## Notes importantes

### Développement
- L'OTP est retourné dans la réponse `sendOtp()` (champ `otp`)
- L'OTP s'affiche dans l'UI (`pages/auth/otp.vue`)
- **À RETIRER EN PRODUCTION** : L'OTP doit être envoyé par SMS uniquement

### Production
Pour activer l'envoi SMS réel :
1. Intégrer un service SMS (Twilio, AWS SNS, etc.)
2. Retirer le champ `otp` de la réponse `sendOtp()`
3. Retirer l'affichage du code OTP dans l'UI
4. Envoyer le code par SMS dans `auth.service.ts` → `sendOtp()`

### Migration des données existantes
- Les utilisateurs existants ont `firstName` et `lastName` à `null`
- Ils peuvent toujours se connecter via OTP (si on active LOGIN)
- Pour compléter leurs données, créer un endpoint de mise à jour

### PIN (Commenté temporairement)
- Le code PIN est conservé mais commenté
- Les endpoints `/auth/register` et `/auth/login` sont commentés
- Peut être réactivé facilement si besoin

## Variables d'environnement

Aucun changement requis. `JWT_SECRET` et `DATABASE_URL` restent les mêmes.

**Optionnel :** Ajouter `JWT_EXPIRATION=90d` dans `.env` (déjà configuré avec default à 90d)

## Tests

1. **Inscription :**
   - Aller sur `/auth/phone`
   - Entrer prénom, nom, numéro
   - Vérifier OTP dans console backend ou UI (dev)
   - Entrer OTP
   - Vérifier redirection vers `/home`

2. **Connexion :**
   - Aller sur `/auth/login`
   - Entrer numéro
   - Vérifier OTP dans console backend ou UI (dev)
   - Entrer OTP
   - Vérifier redirection vers `/home`

3. **Session longue :**
   - Se connecter
   - Fermer et rouvrir le navigateur
   - Vérifier que la session persiste (3 mois)

## Prochaines étapes

1. Intégrer un service SMS réel pour l'envoi d'OTP
2. Retirer l'affichage du code OTP dans l'UI (production)
3. Ajouter un endpoint pour mettre à jour firstName/lastName pour les utilisateurs existants
4. Optionnel : Réactiver le PIN si besoin

