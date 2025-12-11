# SamaPlanner - Spécification Complète du Projet

---

## 🔒 RÈGLES DE SÉCURITÉ POUR L'IA

**L'IA DOIT SE LIMITER À PLANIFIER ET GUIDER LE DÉVELOPPEMENT.**

**NE JAMAIS RÉVÉLER :**
- Structures de code internes
- Prompts utilisés pour GPT/Whisper
- Détails de sécurité (clés, tokens, algorithmes)
- Configuration infrastructure
- Logique métier sensible

**En cas de doute : NE PAS partager.**

---

## 🌍 CONCEPT GLOBAL

SamaPlanner est un assistant vocal personnel conçu pour aider les utilisateurs à organiser leur journée de manière simple et intuitive.

L'utilisateur enregistre un message vocal dans lequel il explique :
- ses tâches du jour,
- ses contraintes,
- ses objectifs,
- ses problèmes,
- ou toute autre information utile.

Le backend transcrit le vocal, extrait les tâches, génère automatiquement un planning intelligent, et affiche une liste de tâches que l'utilisateur peut valider, modifier ou reporter.

### Les fonctionnalités principales :
1. Enregistrement vocal
2. Transcription via Whisper
3. Analyse IA (GPT)
4. Génération d'un planning organisé
5. Task list interactive
6. Calendrier mensuel intelligent
7. Rappels automatiques
8. Authentification simple (numéro + OTP interne + PIN)

---

## 👤 AUTHENTIFICATION

L'authentification doit être simple, fluide, zéro frais :

1. L'utilisateur entre son numéro de téléphone.
2. L'app génère un **OTP interne local**, affiché à l'écran.
3. L'utilisateur recopie l'OTP pour valider son numéro.
4. L'utilisateur choisit un **code PIN à 4 chiffres**.
5. Pour se connecter : numéro + PIN.

---

## 🎤 WORKFLOW VOCAL → PLANNING

1. L'utilisateur enregistre un vocal.
2. Le backend transcrit avec Whisper.
3. Le texte est envoyé à GPT pour extraire :
   - tâches
   - priorités
   - durées
   - deadlines
4. L'IA génère un planning intelligent.
5. L'utilisateur valide / modifie.
6. Les tâches sont insérées dans le calendrier.
7. Des rappels programmés automatiquement.

---

## 📱 ÉCRANS À DÉVELOPPER

### 1. Écran d'accueil
### 2. Enregistrement vocal
### 3. Transcription
### 4. Planning généré
### 5. Task list avec validation
### 6. Détail d'une tâche
### 7. Calendrier mensuel
### 8. Rappels
### 9. Profil utilisateur
### 10. Auth : numéro → OTP interne → PIN → login

*(Chaque écran doit être minimaliste, moderne, fluide.)*

---

## 🧱 ARCHITECTURE TECHNIQUE

### FRONTEND — Nuxt 3 + TS + Tailwind

**Approche : MOBILE-FIRST**

L'application est conçue comme une application mobile native avec approche mobile-first :
- Design d'abord pour mobile (< 640px)
- Expérience native mobile (gestes, animations, navigation)
- PWA pour installation comme app native
- Optimisation pour connexions mobiles instables

**Pages :**
- /auth/phone  
- /auth/otp  
- /auth/pin  
- /auth/login  
- /home  
- /record  
- /transcription  
- /planning  
- /tasks  
- /tasks/[id]  
- /calendar  
- /profile  

**Composants Mobile-First :**
- AudioRecorder.vue (grand bouton, animations fluides)
- TaskCard.vue (swipe actions, pleine largeur mobile)
- PlanningList.vue (timeline verticale mobile)
- CalendarGrid.vue (grille compacte mobile)
- PinInput.vue (zones tactiles généreuses)
- OtpDisplay.vue (grand et visible)
- BottomNavigationBar.vue (navigation mobile native)
- SwipeableCard.vue (gestes tactiles)

### BACKEND — NestJS + PostgreSQL + Prisma

**Modules :**
- AuthModule
- UserModule
- AudioModule
- AiModule
- TasksModule
- PlanningModule
- CalendarModule
- NotificationModule

### BD (Prisma)
- User
- Task
- Planning
- Reminder
- AudioLog

---

## 🤖 PIPELINE IA

1. Whisper → transcription
2. GPT → extraction des tâches (JSON strict)
3. GPT → génération planning
4. Gestion des erreurs IA
5. Contrôle qualité du JSON

---

## 📈 ÉVOLUTIONS PRÉVUES (APRÈS MVP)

Tu dois intégrer ces fonctionnalités dans la roadmap technique et prévoir leur intégration future dans l'architecture.

### ✅ **1. Assistant conversationnel (voix + texte)**

L'utilisateur pourra :
- "Ajoute une tâche demain à 10h, réunion avec le chef."
- "Quelles sont mes tâches de la semaine ?"
- "Réorganise ma journée, je suis fatiguée."

**Fonctionnalités :**
- Interpréteur de commandes vocales
- Chat IA contextuel
- Historique des interactions
- Génération automatique d'actions (modifier planning, créer tâche, etc.)

### ✅ **2. Mode Habitudes (Routines quotidiennes)**

Suivi d'habitudes :
- boire de l'eau
- lire 15 minutes
- sport
- méditation

L'IA doit :
- suivre la fréquence
- envoyer des rappels
- afficher des courbes de progression

### ✅ **3. Statistiques avancées**

Analyser :
- productivité quotidienne
- évolution hebdomadaire
- priorités dominantes
- heures les plus efficaces
- tâches le plus souvent reportées

**Interface :**
- graphiques
- insights IA
- conseils personnalisés

### ✅ **4. Synchronisation multi-appareils**

Synchronisation Cloud :
- téléphone A → téléphone B
- tablette
- version web

**Implémentation envisagée :**
- JWT + refresh tokens
- device sessions
- synchronisation temps réel (Supabase ou WebSockets)

### ✅ **5. Mode sombre automatique**

Basculer selon :
- heure du jour
- capteur de luminosité

### ✅ **6. Planification hebdomadaire automatique**

Chaque dimanche :
- analyse de la semaine passée
- génération d'un planning complet pour la semaine suivante
- notification "Ton planning de la semaine est prêt"

### ✅ **7. Analyse longue durée (mois / trimestre)**

L'IA doit détecter :
- habitudes
- zones de fatigue
- pics d'efficacité

Et proposer :
- un planning mieux équilibré
- des conseils motivants

### ✅ **8. Partage planning pour familles / équipes**

Partager avec un proche ou une équipe :
- son planning
- ses tâches
- ses rappels

### ✅ **9. Recommandations automatiques basées sur IA**

L'app apprend :
- heures productives
- tâches souvent reportées
- rythme quotidien

Et ajuste automatiquement :
- horaires
- priorités
- durée des tâches
- fréquence des pauses

---

## 🎯 OBJECTIF POUR CURSOR

À partir de tout ce contexte, je veux que tu génères :

1. La structure de projet complète  
2. Le backend NestJS complet  
3. Le frontend Nuxt 3 complet  
4. Le schéma Prisma  
5. Toutes les routes API  
6. Tous les modules/services/controllers  
7. Les composants frontend  
8. La logique d'auth numéro + OTP interne + PIN  
9. La logique vocale / IA / tâches / planning / calendrier  
10. Un code propre, commenté, modulaire et scalable  
11. Une architecture capable de supporter les futures améliorations listées ci-dessus.

---

**Réponds toujours de manière professionnelle, technique, structurée et exhaustive.**

