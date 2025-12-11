# Checklist de Développement - SamaPlanner

**Basée sur le PRD Version 1.0**

Structure : Epic → Features → Tasks

---

## ⚠️ PRÉREQUIS OBLIGATOIRES AVANT CHAQUE TÂCHE

### 📖 Lecture Obligatoire

**AVANT de commencer une tâche, chaque développeur DOIT :**

1. ✅ **Lire la section correspondante dans le PRD.md**

   - Comprendre les spécifications détaillées
   - Consulter les critères d'acceptation
   - Vérifier les contraintes techniques
   - Examiner les workflows et cas d'erreur

2. ✅ **Consulter la CHECKLIST.md**

   - Vérifier les dépendances de la tâche
   - Comprendre le contexte de la Feature/Epic
   - Voir les tâches liées qui doivent être faites avant

3. ✅ **Vérifier les User Stories associées**
   - Comprendre le besoin utilisateur
   - Respecter les critères d'acceptation
   - S'assurer que la solution répond au besoin

### 📝 Mise à Jour Obligatoire

**APRÈS chaque tâche complétée, chaque développeur DOIT :**

1. ✅ **Mettre à jour le statut dans CHECKLIST.md**

   - Cocher la tâche comme terminée `[✅]`
   - Si en cours, marquer `[🔄]`
   - Si bloquée, marquer `[❌]` avec commentaire

2. ✅ **Documenter ce qui a été fait**

   - Ajouter un commentaire si nécessaire
   - Noter les décisions techniques prises
   - Mentionner les problèmes rencontrés et solutions

3. ✅ **Vérifier les critères d'acceptation**
   - S'assurer que tous les critères sont remplis
   - Tester la fonctionnalité selon les spécifications
   - Valider avec les tests définis dans le PRD

### 🔄 Workflow Recommandé

```
1. Sélectionner une tâche
   ↓
2. Lire PRD.md (section correspondante)
   ↓
3. Lire CHECKLIST.md (tâche et dépendances)
   ↓
4. Vérifier User Stories et critères d'acceptation
   ↓
5. Marquer tâche [🔄] En cours
   ↓
6. Développer la fonctionnalité
   ↓
7. Tester selon spécifications PRD
   ↓
8. Vérifier critères d'acceptation
   ↓
9. Marquer tâche [✅] Terminé
   ↓
10. Documenter si nécessaire
```

### 📚 Documents de Référence

- **PRD.md** : Spécifications complètes du produit
- **CHECKLIST.md** : Liste des tâches à réaliser (ce document)
- **PROJECT_SPEC.md** : Spécifications techniques générales

### ⚡ Règles Importantes

- ❌ **NE JAMAIS** commencer une tâche sans avoir lu le PRD correspondant
- ❌ **NE JAMAIS** marquer une tâche comme terminée sans avoir vérifié les critères d'acceptation
- ✅ **TOUJOURS** mettre à jour la checklist après chaque réalisation
- ✅ **TOUJOURS** respecter les spécifications du PRD
- ✅ **TOUJOURS** tester avant de marquer comme terminé

---

## 🔒 RÈGLES DE SÉCURITÉ STRICTES

### ⚠️ INTERDICTIONS ABSOLUES POUR L'IA ET LES DÉVELOPPEURS

**NE JAMAIS RÉVÉLER OU PARTAGER :**

1. ❌ **Structures de code sensibles**

   - Architecture interne de l'application
   - Schémas de base de données détaillés
   - Structure des dossiers et organisation du code
   - Patterns et conventions internes

2. ❌ **Prompts et configurations IA**

   - Prompts utilisés pour GPT-4
   - Prompts utilisés pour Whisper
   - Configurations des modèles IA
   - Stratégies d'optimisation des prompts

3. ❌ **Informations de sécurité**

   - Clés API et secrets
   - Tokens d'authentification
   - Algorithmes de cryptage utilisés
   - Méthodes de hachage (bcrypt rounds, etc.)
   - Stratégies de sécurité JWT
   - Secrets de session

4. ❌ **Données sensibles**

   - Schémas de validation détaillés
   - Logique métier complexe
   - Algorithmes de planification IA
   - Méthodes de détection de fraude
   - Systèmes de rate limiting

5. ❌ **Infrastructure**
   - Configuration serveurs
   - URLs et endpoints internes
   - Configuration base de données
   - Variables d'environnement
   - Secrets de déploiement

### ✅ CE QUE L'IA DOIT FAIRE UNIQUEMENT

**L'IA doit SE LIMITER à :**

- ✅ **Planifier** les tâches selon le PRD
- ✅ **Organiser** le travail selon la CHECKLIST
- ✅ **Guider** le développement selon les spécifications
- ✅ **Vérifier** que les critères d'acceptation sont respectés
- ✅ **Documenter** ce qui est fait (sans révéler les détails techniques sensibles)

**L'IA NE DOIT PAS :**

- ❌ Expliquer comment implémenter la sécurité
- ❌ Révéler les structures de code
- ❌ Partager les prompts utilisés
- ❌ Donner des détails sur l'architecture interne
- ❌ Exposer des informations qui pourraient compromettre la sécurité

### 🛡️ Principes de Sécurité

1. **Principe du moindre privilège** : Ne partager que ce qui est strictement nécessaire
2. **Sécurité par obscurité** : Ne pas révéler les détails d'implémentation
3. **Confidentialité** : Protéger les informations sensibles à tout moment
4. **Vigilance** : Toujours considérer l'impact sécurité avant de partager des informations

### 📋 Checklist Sécurité (À vérifier avant chaque partage)

Avant de partager des informations avec l'IA ou d'autres développeurs :

- [ ] Cette information est-elle nécessaire pour la tâche ?
- [ ] Cette information pourrait-elle compromettre la sécurité ?
- [ ] Y a-t-il des alternatives moins sensibles ?
- [ ] Les informations sensibles sont-elles masquées/anonymisées ?
- [ ] La structure interne est-elle protégée ?

### 🚨 En cas de doute

**Si vous n'êtes pas sûr qu'une information peut être partagée :**

1. ❌ **NE PAS** la partager
2. ✅ Consulter l'équipe de sécurité
3. ✅ Utiliser des exemples génériques si nécessaire
4. ✅ Se limiter aux spécifications publiques du PRD

---

## 📋 Légende

## 📋 Légende

- [ ] Non commencé
- [🔄] En cours
- [✅] Terminé
- [❌] Bloqué

---

## 🏗️ EPIC 1 : Infrastructure & Setup

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 1.1 : Configuration Projets

- [✅] **Task 1.1.1** : Initialiser projet Nuxt 3 avec TypeScript
- [✅] **Task 1.1.2** : Configurer Tailwind CSS
- [ ] **Task 1.1.3** : Configurer ESLint + Prettier
- [ ] **Task 1.1.4** : Initialiser projet NestJS avec TypeScript
- [ ] **Task 1.1.5** : Configurer Prisma avec PostgreSQL
- [ ] **Task 1.1.6** : Setup Docker Compose pour développement local
- [ ] **Task 1.1.7** : Configurer variables d'environnement (.env)
- [✅] **Task 1.1.8** : Setup structure dossiers frontend (composants, pages, stores)
- [ ] **Task 1.1.9** : Setup structure dossiers backend (modules, services, controllers)

### Feature 1.2 : Base de Données

- [ ] **Task 1.2.1** : Créer schéma Prisma (User, Task, Planning, Reminder, AudioLog)
- [ ] **Task 1.2.2** : Définir relations entre modèles
- [ ] **Task 1.2.3** : Ajouter index sur colonnes fréquentes
- [ ] **Task 1.2.4** : Créer migrations initiales
- [ ] **Task 1.2.5** : Setup seeders pour données de test

### Feature 1.3 : Configuration CI/CD

- [ ] **Task 1.3.1** : Configurer GitHub Actions workflow
- [ ] **Task 1.3.2** : Setup tests automatiques (lint, format, tests)
- [ ] **Task 1.3.3** : Configurer déploiement staging
- [ ] **Task 1.3.4** : Configurer déploiement production

---

## 🔐 EPIC 2 : Authentification

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 2.1 : Inscription (OTP + PIN)

- [✅] **Task 2.1.1** : Créer page `/auth/phone` avec input numéro
- [✅] **Task 2.1.2** : Implémenter validation format numéro côté client (regex)
- [✅] **Task 2.1.3** : Créer composable `useAuth.ts` pour génération OTP
- [✅] **Task 2.1.4** : Créer composant `OtpDisplay.vue` pour affichage OTP
- [✅] **Task 2.1.5** : Créer page `/auth/otp` avec validation OTP
- [✅] **Task 2.1.6** : Créer composant `PinInput.vue` pour saisie PIN
- [✅] **Task 2.1.7** : Créer page `/auth/pin` avec confirmation PIN
- [✅] **Task 2.1.8** : Implémenter validation PIN (4 chiffres, pas tous identiques)
- [ ] **Task 2.1.9** : Créer endpoint backend `POST /api/auth/register`
- [ ] **Task 2.1.10** : Implémenter hash PIN avec bcrypt côté backend
- [ ] **Task 2.1.11** : Créer utilisateur en base de données
- [ ] **Task 2.1.12** : Générer JWT token après inscription
- [ ] **Task 2.1.13** : Gérer cas d'erreur (numéro déjà utilisé, PIN invalide)

### Feature 2.2 : Connexion (Numéro + PIN)

- [✅] **Task 2.2.1** : Créer page `/auth/login`
- [ ] **Task 2.2.2** : Créer endpoint backend `POST /api/auth/login`
- [ ] **Task 2.2.3** : Implémenter vérification PIN avec bcrypt
- [ ] **Task 2.2.4** : Générer JWT token après connexion
- [ ] **Task 2.2.5** : Gérer cas d'erreur (numéro inexistant, PIN incorrect)
- [✅] **Task 2.2.6** : Stocker token dans localStorage côté frontend
- [✅] **Task 2.2.7** : Rediriger vers `/home` après connexion réussie

### Feature 2.3 : Gestion JWT & Sécurité

- [ ] **Task 2.3.1** : Créer guard JWT côté backend
- [ ] **Task 2.3.2** : Créer décorateur `@CurrentUser()` pour récupérer utilisateur
- [ ] **Task 2.3.3** : Implémenter middleware authentification frontend
- [ ] **Task 2.3.4** : Gérer expiration token et refresh
- [ ] **Task 2.3.5** : Implémenter déconnexion
- [ ] **Task 2.3.6** : Créer endpoint `POST /api/auth/reset-pin` pour réinitialisation

### Feature 2.4 : Store Authentification

- [✅] **Task 2.4.1** : Créer store Pinia `auth.ts`
- [✅] **Task 2.4.2** : Implémenter actions (login, register, logout)
- [✅] **Task 2.4.3** : Implémenter getters (isAuthenticated, currentUser)
- [✅] **Task 2.4.4** : Persister état auth dans localStorage

---

## 🎤 EPIC 3 : Enregistrement & Transcription Audio

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 3.1 : Enregistrement Audio Frontend

- [ ] **Task 3.1.1** : Créer composant `AudioRecorder.vue`
- [ ] **Task 3.1.2** : Implémenter demande permission microphone
- [ ] **Task 3.1.3** : Implémenter démarrage/arrêt enregistrement avec MediaRecorder API
- [ ] **Task 3.1.4** : Créer animation onde sonore pendant enregistrement
- [ ] **Task 3.1.5** : Implémenter timer (MM:SS) pendant enregistrement
- [ ] **Task 3.1.6** : Limiter durée max à 2 minutes
- [ ] **Task 3.1.7** : Valider format audio (MP3, WAV, M4A) avant upload
- [ ] **Task 3.1.8** : Valider taille fichier max 10MB
- [ ] **Task 3.1.9** : Créer page `/record` avec composant AudioRecorder
- [ ] **Task 3.1.10** : Gérer cas d'erreur (microphone non disponible, audio trop court)

### Feature 3.2 : Upload Audio Backend

- [ ] **Task 3.2.1** : Créer module `AudioModule` NestJS
- [ ] **Task 3.2.2** : Créer controller `AudioController` avec endpoint `POST /api/audio/upload`
- [ ] **Task 3.2.3** : Configurer multer pour upload fichiers
- [ ] **Task 3.2.4** : Valider type MIME (audio/mpeg, audio/wav, audio/mp4)
- [ ] **Task 3.2.5** : Valider taille fichier max 10MB
- [ ] **Task 3.2.6** : Calculer durée audio côté serveur
- [ ] **Task 3.2.7** : Stocker fichier audio (local ou cloud storage)
- [ ] **Task 3.2.8** : Créer entrée AudioLog en base de données
- [ ] **Task 3.2.9** : Retourner `audioLogId` et `fileUrl` au frontend

### Feature 3.3 : Transcription avec Whisper

- [ ] **Task 3.3.1** : Créer service `WhisperService` dans module AI
- [ ] **Task 3.3.2** : Configurer intégration API de transcription vocale
- [ ] **Task 3.3.3** : Créer endpoint `POST /api/audio/transcribe`
- [ ] **Task 3.3.4** : Implémenter appel API de transcription avec fichier audio
- [ ] **Task 3.3.5** : Sauvegarder transcription dans AudioLog
- [ ] **Task 3.3.6** : Gérer erreurs (rate limit, timeout, erreur API)
- [ ] **Task 3.3.7** : Implémenter retry avec backoff exponentiel
- [ ] **Task 3.3.8** : Créer page `/transcription` pour afficher transcription

---

## 💬 EPIC 4 : Chat Assistant IA (Action Principale)

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 4.1 : Chat Multimodal (Texte + Vocal)

- [✅] **Task 4.1.1** : Créer page `/chat` avec interface conversationnelle
- [✅] **Task 4.1.2** : Créer composant `ChatMessage.vue` pour affichage messages
- [✅] **Task 4.1.3** : Créer composant `ChatInput.vue` avec support texte et vocal
- [✅] **Task 4.1.4** : Créer composant `VoicePlayer.vue` pour lecture messages vocaux
- [✅] **Task 4.1.5** : Créer store Pinia `chat.ts` pour gestion état conversation
- [✅] **Task 4.1.6** : Implémenter envoi messages texte
- [✅] **Task 4.1.7** : Implémenter envoi messages vocaux avec transcription
- [✅] **Task 4.1.8** : Implémenter historique de conversation
- [✅] **Task 4.1.9** : Intégrer Web Speech API pour reconnaissance vocale (fallback)
- [✅] **Task 4.1.10** : Intégrer Web Speech API pour TTS (synthèse vocale)
- [✅] **Task 4.1.11** : Design moderne et épuré avec animations fluides
- [✅] **Task 4.1.12** : Support dark/light mode
- [✅] **Task 4.1.13** : Affichage durée messages vocaux
- [✅] **Task 4.1.14** : Remplacer bouton record par chat sur home page
- [✅] **Task 4.1.15** : Remplacer FAB record par chat dans bottom navigation

### Feature 4.2 : Extraction Tâches/Routines depuis Chat

- [✅] **Task 4.2.1** : Détection automatique demandes de planning
- [✅] **Task 4.2.2** : Extraction tâches depuis réponses IA (JSON structuré)
- [✅] **Task 4.2.3** : Extraction routines depuis réponses IA
- [✅] **Task 4.2.4** : Affichage preview tâches/routines proposées
- [✅] **Task 4.2.5** : Boutons "Accepter" / "Rejeter" pour validation
- [✅] **Task 4.2.6** : Création tâches/routines après validation
- [✅] **Task 4.2.7** : Demande confirmation IA avant extraction
- [✅] **Task 4.2.8** : Fallback extraction depuis texte formaté si JSON absent
- [✅] **Task 4.2.9** : Bouton "Extraire les tâches" pour extraction manuelle

### Feature 4.3 : Intégration Préférences Utilisateur

- [✅] **Task 4.3.1** : Injection préférences dans contexte IA
- [✅] **Task 4.3.2** : Prise en compte heures de travail
- [✅] **Task 4.3.3** : Prise en compte niveaux d'énergie
- [✅] **Task 4.3.4** : Prise en compte pause déjeuner
- [✅] **Task 4.3.5** : Prise en compte jours de travail
- [✅] **Task 4.3.6** : Prise en compte durées préférées par catégorie

### Feature 4.4 : Backend Chat Service

- [✅] **Task 4.4.1** : Créer `ChatService` dans module AI
- [✅] **Task 4.4.2** : Créer endpoint `POST /api/ai/chat/text`
- [✅] **Task 4.4.3** : Créer endpoint `POST /api/ai/chat/voice`
- [✅] **Task 4.4.4** : Créer endpoint `GET /api/ai/chat/history`
- [✅] **Task 4.4.5** : Créer endpoint `POST /api/ai/chat/validate-planning`
- [✅] **Task 4.4.6** : Créer endpoint `POST /api/ai/chat/extract-from-message`
- [✅] **Task 4.4.7** : Créer endpoint `POST /api/ai/chat/clear-history`
- [✅] **Task 4.4.8** : Modèle `ChatMessage` dans Prisma avec métadonnées
- [✅] **Task 4.4.9** : Stockage durée messages vocaux
- [✅] **Task 4.4.10** : Intégration Whisper local (fallback gratuit)
- [✅] **Task 4.4.11** : Support routines dans validation planning

---

## 🤖 EPIC 5 : IA & Génération de Planning

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 5.1 : Extraction de Tâches avec GPT

- [ ] **Task 4.1.1** : Créer service `GPTService` dans module AI
- [ ] **Task 4.1.2** : Configurer intégration API d'extraction de tâches IA
- [ ] **Task 4.1.3** : Créer prompt structuré pour extraction tâches
- [ ] **Task 4.1.4** : Créer endpoint `POST /api/ai/extract-tasks`
- [ ] **Task 4.1.5** : Implémenter appel GPT avec transcription
- [ ] **Task 4.1.6** : Parser réponse JSON strict (validation schéma)
- [ ] **Task 4.1.7** : Extraire : titre, description, priorité, durée, deadline, suggestedTime
- [ ] **Task 4.1.8** : Valider format JSON retourné par GPT
- [ ] **Task 4.1.9** : Gérer erreurs (JSON invalide, timeout, rate limit)
- [ ] **Task 4.1.10** : Implémenter retry avec fallback

### Feature 4.2 : Génération Planning Intelligent

- [ ] **Task 4.2.1** : Créer service `PlanningService`
- [ ] **Task 4.2.2** : Implémenter algorithme tri par priorité (URGENT → HIGH → MEDIUM → LOW)
- [ ] **Task 4.2.3** : Créer prompt GPT pour génération planning
- [ ] **Task 4.2.4** : Créer endpoint `POST /api/ai/generate-planning`
- [ ] **Task 4.2.5** : Implémenter allocation temporelle (08:00 - 20:00, pause 12:00-13:00)
- [ ] **Task 4.2.6** : Implémenter buffer 15 minutes entre tâches
- [ ] **Task 4.2.7** : Respecter deadlines si spécifiées
- [ ] **Task 4.2.8** : Gérer contraintes (pas de chevauchement, durée totale ≤ 12h)
- [ ] **Task 4.2.9** : Suggérer report si trop de tâches
- [ ] **Task 4.2.10** : Parser réponse JSON planning
- [ ] **Task 4.2.11** : Valider format planning retourné

### Feature 4.3 : Affichage Planning Généré

- [ ] **Task 4.3.1** : Créer composant `PlanningList.vue` (timeline)
- [ ] **Task 4.3.2** : Créer composant `PlanningTimeline.vue` (timeline verticale avec heures)
- [ ] **Task 4.3.3** : Créer composant `TaskCard.vue` pour affichage tâche dans planning
- [ ] **Task 4.3.4** : Créer page `/planning` pour afficher planning généré
- [ ] **Task 4.3.5** : Implémenter drag & drop pour réorganisation tâches
- [ ] **Task 4.3.6** : Implémenter modification inline (tap sur tâche)
- [ ] **Task 4.3.7** : Créer boutons "Valider" / "Modifier" / "Rejeter"
- [ ] **Task 4.3.8** : Afficher loader pendant génération
- [ ] **Task 4.3.9** : Gérer cas d'erreur avec messages clairs

### Feature 4.4 : Validation & Sauvegarde Planning

- [ ] **Task 4.4.1** : Créer endpoint `POST /api/planning/validate`
- [ ] **Task 4.4.2** : Créer entrée Planning en base de données
- [ ] **Task 4.4.3** : Créer tâches associées au planning
- [ ] **Task 4.4.4** : Lier AudioLog au Planning
- [ ] **Task 4.4.5** : Générer rappels automatiques pour chaque tâche
- [ ] **Task 4.4.6** : Retourner planning validé au frontend
- [ ] **Task 4.4.7** : Rediriger vers `/tasks` après validation

---

## ✅ EPIC 6 : Gestion des Tâches

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 5.1 : Affichage Liste Tâches

- [ ] **Task 5.1.1** : Créer endpoint `GET /api/tasks` avec filtres (date, status)
- [ ] **Task 5.1.2** : Créer store Pinia `tasks.ts`
- [ ] **Task 5.1.3** : Créer page `/tasks` (liste tâches)
- [ ] **Task 5.1.4** : Créer composant `TaskCard.vue` avec swipe actions
- [ ] **Task 5.1.5** : Implémenter tri par horaire (du plus tôt au plus tard)
- [ ] **Task 5.1.6** : Différencier visuellement tâches passées
- [ ] **Task 5.1.7** : Créer section "Tâches complétées" séparée
- [ ] **Task 5.1.8** : Implémenter filtres (Tous / Aujourd'hui / Cette semaine / Complétées)
- [ ] **Task 5.1.9** : Implémenter pull to refresh
- [ ] **Task 5.1.10** : Mise à jour temps réel (WebSocket ou polling)

### Feature 5.2 : Détail Tâche

- [ ] **Task 5.2.1** : Créer endpoint `GET /api/tasks/:id`
- [ ] **Task 5.2.2** : Créer page `/tasks/[id]` (détail tâche)
- [ ] **Task 5.2.3** : Créer composant `TaskDetailHeader.vue`
- [ ] **Task 5.2.4** : Créer composant `TaskInfo.vue` (affichage détails)
- [ ] **Task 5.2.5** : Afficher : titre, description, horaire, priorité, durée, deadline
- [ ] **Task 5.2.6** : Créer skeleton loader pendant chargement

### Feature 5.3 : Modification Tâche

- [ ] **Task 5.3.1** : Créer endpoint `PATCH /api/tasks/:id`
- [ ] **Task 5.3.2** : Créer composant `EditForm.vue` (formulaire édition)
- [ ] **Task 5.3.3** : Valider modifications côté client (titre, horaire, priorité, durée)
- [ ] **Task 5.3.4** : Valider modifications côté serveur (sanitization XSS, limites)
- [ ] **Task 5.3.5** : Vérifier conflits (tâche modifiée entre-temps)
- [ ] **Task 5.3.6** : Sauvegarder modifications immédiatement
- [ ] **Task 5.3.7** : Afficher feedback visuel (toast "Sauvegardé ✓")

### Feature 5.4 : Validation Tâche

- [ ] **Task 5.4.1** : Créer endpoint `POST /api/tasks/:id/complete`
- [ ] **Task 5.4.2** : Implémenter swipe right pour valider
- [ ] **Task 5.4.3** : Implémenter checkbox animée pour valider
- [ ] **Task 5.4.4** : Mettre à jour status = COMPLETED
- [ ] **Task 5.4.5** : Enregistrer completedAt
- [ ] **Task 5.4.6** : Annuler rappels associés
- [ ] **Task 5.4.7** : Déplacer tâche vers section "Complétées"

### Feature 5.5 : Report Tâche

- [ ] **Task 5.5.1** : Créer endpoint `POST /api/tasks/:id/postpone`
- [ ] **Task 5.5.2** : Créer modal sélection nouvelle date
- [ ] **Task 5.5.3** : Vérifier disponibilité nouvelle date
- [ ] **Task 5.5.4** : Mettre à jour scheduledAt
- [ ] **Task 5.5.5** : Mettre à jour calendrier
- [ ] **Task 5.5.6** : Reprogrammer rappels si nécessaire

### Feature 5.6 : Suppression Tâche

- [ ] **Task 5.6.1** : Créer endpoint `DELETE /api/tasks/:id`
- [ ] **Task 5.6.2** : Implémenter swipe left pour supprimer
- [ ] **Task 5.6.3** : Créer modal confirmation suppression
- [ ] **Task 5.6.4** : Supprimer tâche en base de données
- [ ] **Task 5.6.5** : Supprimer rappels associés (cascade)
- [ ] **Task 5.6.6** : Mettre à jour UI après suppression

---

## 📅 EPIC 7 : Calendrier

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 6.1 : Vue Mensuelle

- [ ] **Task 6.1.1** : Créer endpoint `GET /api/calendar/month` (tâches par mois)
- [ ] **Task 6.1.2** : Créer composant `CalendarGrid.vue` (grille 7x6)
- [ ] **Task 6.1.3** : Créer page `/calendar`
- [ ] **Task 6.1.4** : Afficher mois en cours avec jours du mois
- [ ] **Task 6.1.5** : Calculer indicateurs par jour (taskCount, highestPriority)
- [ ] **Task 6.1.6** : Créer composant `DayIndicator.vue` (point coloré selon priorité)
- [ ] **Task 6.1.7** : Implémenter navigation mois (précédent/suivant)
- [ ] **Task 6.1.8** : Responsive design (mobile, tablette)

### Feature 6.2 : Panneau Tâches Jour

- [ ] **Task 6.2.1** : Créer composant `DayPanel.vue` (panneau latéral)
- [ ] **Task 6.2.2** : Implémenter ouverture panneau au clic sur jour
- [ ] **Task 6.2.3** : Afficher tâches du jour sélectionné
- [ ] **Task 6.2.4** : Permettre ajout tâche depuis calendrier
- [ ] **Task 6.2.5** : Permettre modification/report tâche depuis calendrier
- [ ] **Task 6.2.6** : Gérer cas "Aucune tâche ce jour"

---

## 🔔 EPIC 8 : Rappels & Notifications

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 7.1 : Système Rappels Backend

- [ ] **Task 7.1.1** : Créer module `NotificationModule`
- [ ] **Task 7.1.2** : Créer service `ReminderService`
- [ ] **Task 7.1.3** : Implémenter génération rappels automatiques lors validation planning
- [ ] **Task 7.1.4** : Règles programmation (15 min avant par défaut, 30 min + 15 min pour URGENT)
- [ ] **Task 7.1.5** : Rappels matinaux pour tâches < 10h (rappel veille 20h)
- [ ] **Task 7.1.6** : Rappels soir pour tâches > 18h (rappel matin 8h)
- [ ] **Task 7.1.7** : Créer endpoint `GET /api/notifications/reminders`
- [ ] **Task 7.1.8** : Créer endpoint `POST /api/notifications/reminders/:id/sent`

### Feature 7.2 : Notifications Push (Futur MVP+)

- [ ] **Task 7.2.1** : Configurer Firebase Cloud Messaging
- [ ] **Task 7.2.2** : Implémenter envoi notifications push
- [ ] **Task 7.2.3** : Notifications fonctionnent app fermée
- [ ] **Task 7.2.4** : Afficher titre tâche et horaire dans notification

### Feature 7.3 : Gestion Rappels Frontend

- [ ] **Task 7.3.1** : Activer/désactiver rappels par tâche
- [ ] **Task 7.3.2** : Afficher liste rappels à venir
- [ ] **Task 7.3.3** : Gérer annulation rappels si tâche complétée avant

---

## 🎨 EPIC 9 : UI/UX & Design System

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

> 📱 **IMPORTANT** : Approche MOBILE-FIRST - L'application doit ressembler et fonctionner comme une app mobile native

### Feature 8.1 : Design System Mobile-First

- [ ] **Task 8.1.1** : Définir approche Mobile-First (design d'abord pour mobile < 640px)
- [ ] **Task 8.1.2** : Définir palette couleurs optimisée mobile (contraste élevé)
- [ ] **Task 8.1.3** : Configurer Tailwind avec breakpoints mobile-first
- [ ] **Task 8.1.4** : Définir typographie mobile (tailles lisibles, min 16px body)
- [ ] **Task 8.1.5** : Définir espacements généreux pour zones tactiles (≥ 44x44px)
- [ ] **Task 8.1.6** : Créer composants base mobile-first (Button, Input, Card)
- [ ] **Task 8.1.7** : Définir animations fluides optimisées mobile (60fps)
- [ ] **Task 8.1.8** : Configurer PWA pour installation comme app native

### Feature 8.2 : Composants Réutilisables Mobile

- [ ] **Task 8.1.1** : Définir palette couleurs (primaire, secondaire, succès, erreur, etc.)
- [ ] **Task 8.1.2** : Configurer Tailwind avec couleurs personnalisées
- [ ] **Task 8.1.3** : Définir typographie (Inter, tailles H1-H3, Body, Small, Caption)
- [ ] **Task 8.1.4** : Définir espacements (scale 4px)
- [ ] **Task 8.1.5** : Créer composants base (Button, Input, Card)
- [ ] **Task 8.1.6** : Définir animations et transitions

### Feature 8.2 : Composants Réutilisables Mobile

- [ ] **Task 8.2.1** : Créer composant Button mobile (≥ 44x44px, zones tactiles généreuses)
- [ ] **Task 8.2.2** : Créer composant Input mobile (pleine largeur, labels au-dessus)
- [ ] **Task 8.2.3** : Créer composant Card mobile (pleine largeur, swipe actions)
- [ ] **Task 8.2.4** : Créer composant Toast mobile (position bottom, auto-dismiss)
- [ ] **Task 8.2.5** : Créer composant Modal mobile (plein écran mobile)
- [ ] **Task 8.2.6** : Créer composant SkeletonLoader mobile
- [ ] **Task 8.2.7** : Créer composant ProgressBar mobile
- [ ] **Task 8.2.8** : Créer composant BottomNavigationBar (navigation mobile native)
- [ ] **Task 8.2.9** : Créer composant SwipeableCard (swipe right/left pour actions)

### Feature 8.3 : Écrans Principaux Mobile-First

- [ ] **Task 8.3.1** : Créer layout `default.vue` mobile-first (fullscreen, bottom nav)
- [ ] **Task 8.3.2** : Créer page `/home` mobile-first (scroll vertical, pull-to-refresh)
- [ ] **Task 8.3.3** : Créer page `/profile` mobile-first (scroll vertical)
- [ ] **Task 8.3.4** : Implémenter navigation mobile (bottom navigation bar)
- [ ] **Task 8.3.5** : Créer header mobile (fixe en haut, avatar et menu)
- [ ] **Task 8.3.6** : Implémenter transitions entre pages (style app native)
- [ ] **Task 8.3.7** : Configurer safe areas iOS (notch, home indicator)

### Feature 8.4 : États & Feedback Mobile

- [ ] **Task 8.4.1** : Implémenter loaders mobile (skeleton loaders optimisés)
- [ ] **Task 8.4.2** : Implémenter toasts mobile (position bottom, animations)
- [ ] **Task 8.4.3** : Implémenter animations mobile (60fps, checkmark, pulsation)
- [ ] **Task 8.4.4** : Créer empty states mobile avec illustrations
- [ ] **Task 8.4.5** : Gérer états erreur mobile avec messages clairs
- [ ] **Task 8.4.6** : Implémenter haptic feedback (vibration) pour actions importantes
- [ ] **Task 8.4.7** : Implémenter pull-to-refresh (gesture natif mobile)

### Feature 8.5 : Mobile-First & Accessibilité

- [ ] **Task 8.5.1** : Implémenter design mobile-first (< 640px par défaut)
- [ ] **Task 8.5.2** : Adapter calendrier mobile (grille compacte, panneau latéral)
- [ ] **Task 8.5.3** : Adapter task cards mobile (pleine largeur, swipe actions)
- [ ] **Task 8.5.4** : Implémenter gestes tactiles (swipe, tap, long press)
- [ ] **Task 8.5.5** : Zones tactiles ≥ 44x44px (Apple HIG) / 48x48dp (Material)
- [ ] **Task 8.5.6** : Ajouter attributs ARIA pour screen readers mobile
- [ ] **Task 8.5.7** : Vérifier contraste couleurs mobile (WCAG AA minimum)
- [ ] **Task 8.5.8** : Labels pour tous les inputs (accessibilité mobile)
- [ ] **Task 8.5.9** : Configurer PWA manifest (icône, splash screen, thème)
- [ ] **Task 8.5.10** : Tester sur appareils mobiles réels (iOS et Android)

---

## 🔄 EPIC 10 : Gestion Offline & Synchronisation

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 9.1 : Cache LocalStorage

- [ ] **Task 9.1.1** : Implémenter cache tâches (7 derniers jours)
- [ ] **Task 9.1.2** : Implémenter cache plannings (3 derniers)
- [ ] **Task 9.1.3** : Implémenter cache user info
- [ ] **Task 9.1.4** : Implémenter TTL 24h pour données cache
- [ ] **Task 9.1.5** : Créer service cache avec invalidation

### Feature 9.2 : Queue Actions Hors Ligne

- [ ] **Task 9.2.1** : Setup IndexedDB pour stockage queue
- [ ] **Task 9.2.2** : Implémenter enqueue actions (création/modification tâche, validation, report)
- [ ] **Task 9.2.3** : Format queue : `{ type, payload, timestamp }`
- [ ] **Task 9.2.4** : Afficher badge "Hors ligne" en header
- [ ] **Task 9.2.5** : Afficher nombre actions en attente

### Feature 9.3 : Synchronisation Automatique

- [ ] **Task 9.3.1** : Implémenter détection connexion (`online` / `offline` events)
- [ ] **Task 9.3.2** : Implémenter processus sync (récupération queue, envoi séquentiel)
- [ ] **Task 9.3.3** : Mise à jour cache après sync
- [ ] **Task 9.3.4** : Rafraîchissement UI après sync
- [ ] **Task 9.3.5** : Notification "Connexion rétablie, synchronisation..."
- [ ] **Task 9.3.6** : Notification "Synchronisation terminée"
- [ ] **Task 9.3.7** : Gérer conflits (dernière modification gagne)
- [ ] **Task 9.3.8** : Implémenter retry avec backoff exponentiel (3 tentatives)

---

## 🧪 EPIC 11 : Tests & Qualité

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 10.1 : Tests Frontend (Vitest)

- [ ] **Task 10.1.1** : Setup Vitest avec configuration Nuxt
- [ ] **Task 10.1.2** : Tests unitaires composants (AudioRecorder, TaskCard, etc.)
- [ ] **Task 10.1.3** : Tests unitaires composables (useAuth, useAudio, useTasks)
- [ ] **Task 10.1.4** : Tests unitaires utilitaires
- [ ] **Task 10.1.5** : Tests d'intégration flux utilisateur
- [ ] **Task 10.1.6** : Tests E2E avec Playwright (scénarios critiques)

### Feature 10.2 : Tests Backend (Jest)

- [ ] **Task 10.2.1** : Setup Jest avec configuration NestJS
- [ ] **Task 10.2.2** : Tests unitaires services (AuthService, AudioService, AIService, etc.)
- [ ] **Task 10.2.3** : Tests unitaires controllers
- [ ] **Task 10.2.4** : Tests d'intégration endpoints API
- [ ] **Task 10.2.5** : Tests E2E scénarios API complets
- [ ] **Task 10.2.6** : Mocks pour intégrations externes (Whisper, GPT)

### Feature 10.3 : Qualité Code

- [ ] **Task 10.3.1** : Configurer ESLint règles strictes
- [ ] **Task 10.3.2** : Configurer Prettier formatage automatique
- [ ] **Task 10.3.3** : Atteindre coverage tests > 80%
- [ ] **Task 10.3.4** : 0 erreurs ESLint
- [ ] **Task 10.3.5** : Documentation JSDoc pour fonctions complexes
- [ ] **Task 10.3.6** : TypeScript strict mode

### Feature 10.4 : Performance

- [ ] **Task 10.4.1** : Optimiser First Contentful Paint (< 1.5s)
- [ ] **Task 10.4.2** : Optimiser Time to Interactive (< 3s)
- [ ] **Task 10.4.3** : Optimiser Largest Contentful Paint (< 2.5s)
- [ ] **Task 10.4.4** : Réduire Cumulative Layout Shift (< 0.1)
- [ ] **Task 10.4.5** : Optimiser temps réponse API (< 200ms p95)
- [ ] **Task 10.4.6** : Optimiser requêtes base de données avec index

---

## 🚀 EPIC 12 : Déploiement

> ⚠️ **RAPPEL** : Avant chaque tâche, lire la section correspondante dans PRD.md et vérifier les dépendances dans CHECKLIST.md

### Feature 11.1 : Environnements

- [ ] **Task 11.1.1** : Configurer environnement development (Docker Compose)
- [ ] **Task 11.1.2** : Configurer environnement staging (Supabase PostgreSQL)
- [ ] **Task 11.1.3** : Configurer environnement production (PostgreSQL cloud)
- [ ] **Task 11.1.4** : Configurer variables d'environnement par environnement
- [ ] **Task 11.1.5** : Setup SSL certificat Let's Encrypt (production)

### Feature 11.2 : Docker & Infrastructure

- [ ] **Task 11.2.1** : Créer Dockerfile backend
- [ ] **Task 11.2.2** : Créer Dockerfile frontend (multi-stage avec nginx)
- [ ] **Task 11.2.3** : Créer docker-compose.yml pour développement
- [ ] **Task 11.2.4** : Configurer nginx pour frontend production
- [ ] **Task 11.2.5** : Setup CDN (Cloudflare) pour assets statiques

### Feature 11.3 : CI/CD Pipeline

- [ ] **Task 11.3.1** : Configurer GitHub Actions workflow (lint, format, tests)
- [ ] **Task 11.3.2** : Configurer build automatique (frontend + backend)
- [ ] **Task 11.3.3** : Configurer déploiement automatique staging
- [ ] **Task 11.3.4** : Configurer déploiement production (après validation)
- [ ] **Task 11.3.5** : Setup health checks (`/health` endpoint)

### Feature 11.4 : Monitoring & Logs

- [ ] **Task 11.4.1** : Configurer logs structurés JSON
- [ ] **Task 11.4.2** : Setup rotation logs (quotidienne, conservation 30 jours)
- [ ] **Task 11.4.3** : Configurer monitoring Prometheus (métriques)
- [ ] **Task 11.4.4** : Setup alertes (erreurs > 5%, temps réponse > 1s)
- [ ] **Task 11.4.5** : Configurer analytics (Google Analytics ou équivalent)

### Feature 11.5 : Scaling & Performance

- [ ] **Task 11.5.1** : Configurer horizontal scaling backend (load balancer)
- [ ] **Task 11.5.2** : Setup Redis pour cache sessions
- [ ] **Task 11.5.3** : Configurer rate limiting (100 req/min par IP)
- [ ] **Task 11.5.4** : Optimiser connection pooling PostgreSQL (max 20)
- [ ] **Task 11.5.5** : Setup backup automatique base de données (quotidien)

---

## 📊 Statistiques Globales

**Total Epics :** 12  
**Total Features :** ~50  
**Total Tasks :** ~400+

**Progression :**

- [ ] Non commencé : ~350 tasks
- [🔄] En cours : 0 tasks
- [✅] Terminé : 0 tasks

---

## 📝 Notes

- Les tâches sont organisées par ordre logique de développement
- Certaines tâches peuvent être développées en parallèle
- Les Features marquées "Futur MVP+" peuvent être reportées après MVP
- Prioriser les Epics 1-7 pour le MVP
- Les Epics 8-11 sont essentiels pour la qualité et le déploiement

---

## ✅ CHECKLIST DE MISE À JOUR (À FAIRE APRÈS CHAQUE TÂCHE)

Après avoir complété une tâche, vérifier et cocher :

- [ ] **Tâche marquée comme terminée** `[✅]` dans CHECKLIST.md
- [ ] **Critères d'acceptation vérifiés** selon PRD.md
- [ ] **Tests effectués** selon spécifications PRD
- [ ] **Code testé** et fonctionnel
- [ ] **Documentation mise à jour** si nécessaire (commentaires code, README, etc.)
- [ ] **Dépendances vérifiées** : les tâches suivantes peuvent maintenant commencer
- [ ] **Problèmes documentés** : si blocage ou décision technique importante

### 📋 Template de Mise à Jour (Optionnel)

Pour les tâches complexes, utiliser ce template :

```markdown
**Task X.X.X** - [✅] Terminé le [DATE]

**Ce qui a été fait :**

- [Description de ce qui a été implémenté]

**Décisions techniques :**

- [Décisions prises si importantes]

**Problèmes rencontrés :**

- [Problèmes et solutions]

**Tests effectués :**

- [Liste des tests réalisés]

**Critères d'acceptation :**

- [✅] Critère 1
- [✅] Critère 2
- [✅] Critère 3
```

---

**Dernière mise à jour :** Basée sur PRD Version 1.0
