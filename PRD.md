PRD – SamaPlanner

Version 1.0 – Document Produit Officiel

---

## 🔒 RÈGLES DE SÉCURITÉ POUR L'IA

### ⚠️ INSTRUCTIONS STRICTES POUR L'ASSISTANT IA

**L'IA DOIT SE LIMITER UNIQUEMENT À :**

- ✅ Planifier les tâches selon ce PRD
- ✅ Organiser le travail selon la CHECKLIST
- ✅ Guider le développement selon les spécifications
- ✅ Vérifier que les critères d'acceptation sont respectés
- ✅ Documenter ce qui est fait (sans révéler les détails techniques sensibles)

**L'IA NE DOIT JAMAIS RÉVÉLER OU PARTAGER :**

- ❌ **Structures de code** : Architecture interne, schémas de base de données détaillés, structure des dossiers
- ❌ **Prompts IA** : Prompts utilisés pour GPT-4, Whisper, configurations des modèles IA
- ❌ **Sécurité** : Clés API, tokens, algorithmes de cryptage, méthodes de hachage, stratégies JWT
- ❌ **Logique métier** : Algorithmes de planification IA, méthodes de détection, systèmes de rate limiting
- ❌ **Infrastructure** : Configuration serveurs, URLs internes, secrets de déploiement

**En cas de doute : NE PAS partager l'information.**

---

1️⃣ Vision du Produit

SamaPlanner est un assistant de planification intelligent qui transforme la manière dont les utilisateurs organisent leur journée.
Grâce à une interface conversationnelle multimodale (texte + vocal), l'utilisateur interagit naturellement avec l'IA, qui comprend, extrait les tâches et routines, génère un planning optimisé et le synchronise dans un calendrier interactif.

Vision à long terme :
Devenir l'assistant personnel intelligent le plus simple et efficace, capable d'organiser vos journées, vos routines, vos habitudes et votre bien-être, en s'adaptant à vos préférences et à votre style de vie.

Contexte marché :
Le marché présente un besoin croissant d'outils d'organisation personnelle adaptés aux contraintes locales (réseau instable, préférence pour la voix, simplicité). Les solutions existantes sont souvent trop complexes ou nécessitent une connexion constante.

Positionnement :
SamaPlanner se positionne comme la solution la plus simple et accessible pour l'organisation quotidienne, en utilisant une interface conversationnelle naturelle (texte ou vocal) et en minimisant les frictions techniques.

Valeur unique :

- **Chat conversationnel** : Interface multimodale (texte + vocal) comme action principale
- **IA contextuelle** : L'assistant apprend vos préférences et s'adapte à votre style de vie
- **Validation interactive** : Contrôle total avant la création des tâches et routines
- **Personnalisation avancée** : Préférences détaillées (heures de travail, énergie, routines)
- **Génération automatique** : Planning intelligent généré en quelques secondes
- **Authentification simple** : Numéro + OTP interne + PIN (zéro coût SMS)
- **Fonctionnement optimisé** : Adapté aux réseaux instables
- **Design moderne** : Interface épurée, fluide et agréable

2️⃣ Objectifs du Produit

🎯 Objectifs principaux du MVP

Permettre à un utilisateur de converser avec un assistant IA (texte ou vocal).

L'IA comprend le contexte et répond de manière personnalisée.

Détecter automatiquement les demandes de planning.

Extraire les tâches et routines avec l'IA.

Demander confirmation avant de créer les tâches/routines.

Générer un planning du jour automatiquement.

Afficher une task list validable avec filtres.

Afficher un calendrier mensuel avec les tâches insérées.

Gérer les routines récurrentes.

Authentification simple par numéro + OTP interne + PIN.

Rappels automatiques.

Préférences utilisateur personnalisables.

🎯 Objectifs secondaires

Interface minimale, fluide, simple.

Temps d'enregistrement → planning < 7 secondes.

Zéro friction dans l'onboarding.

🎯 Objectifs mesurables (Success Metrics)

Taux de complétion du premier planning : > 70% des utilisateurs qui enregistrent un vocal complètent leur premier planning

Temps moyen vocal → planning : < 7 secondes (objectif), < 10 secondes (acceptable)

Taux d'adoption : > 50% des utilisateurs créent au moins 3 plannings dans la première semaine

Taux de rétention J7 : > 40% des utilisateurs actifs après 7 jours

Taux de rétention J30 : > 25% des utilisateurs actifs après 30 jours

Nombre moyen de tâches par planning : 3-5 tâches

Taux de validation des tâches : > 60% des tâches générées sont validées

Temps d'onboarding : < 2 minutes de la première ouverture à la création du premier planning

🎯 Objectifs business

Acquisition : 1000 utilisateurs actifs dans les 3 premiers mois

Engagement : 5 plannings créés par utilisateur actif par semaine en moyenne

Satisfaction : Score NPS > 40

3️⃣ Personas

👩 Persona 1 : Étudiante – Coumba, 21 ans

Profil :

- 21 ans, étudiante en 3ème année à l'UCAD
- Vit à Dakar avec sa famille
- Smartphone Android moyen de gamme
- Connexion internet instable (3G/4G selon les zones)

Besoins :

- Oublie souvent ses cours et devoirs
- Préfère parler que taper des listes
- Cherche organisation simple et rapide
- Besoin de rappels pour ne pas oublier les deadlines

Frustrations techniques :

- Applications trop complexes avec trop d'options
- Nécessité de taper beaucoup de texte
- Applications qui nécessitent une connexion constante
- Interfaces encombrées et difficiles à naviguer

Comportements numériques :

- Utilise WhatsApp quotidiennement pour communiquer
- Écoute de la musique et podcasts
- Utilise peu d'applications de productivité (trop complexes)
- Préfère les messages vocaux aux messages texte

Objectifs avec SamaPlanner :

- Organiser sa semaine de cours et devoirs
- Ne plus oublier les deadlines importantes
- Avoir un planning visuel de sa journée

👨‍💼 Persona 2 : Employé – Mamadou, 32 ans

Profil :

- 32 ans, employé dans une entreprise à Dakar
- Responsable de plusieurs projets simultanés
- Smartphone iPhone ou Android haut de gamme
- Connexion internet correcte mais variable selon les déplacements

Besoins :

- Journées chargées avec beaucoup de réunions et tâches
- Utilise WhatsApp pour se rappeler des choses
- Cherche un assistant fiable pour suivre ses tâches
- Besoin de prioriser et organiser efficacement

Frustrations techniques :

- Applications qui ne fonctionnent pas hors ligne
- Synchronisation lente ou problématique
- Interfaces qui prennent trop de temps à utiliser
- Manque d'intelligence dans la génération de planning

Comportements numériques :

- Utilise WhatsApp Business pour le travail
- Consulte régulièrement son calendrier
- Utilise des applications de productivité mais les abandonne souvent
- Préfère les solutions rapides et efficaces

Objectifs avec SamaPlanner :

- Organiser ses journées de travail efficacement
- Suivre ses tâches et deadlines professionnelles
- Optimiser son temps et sa productivité

👩‍👧 Persona 3 : Mère de famille – Awa, 39 ans

Profil :

- 39 ans, mère de 3 enfants, travaille à temps partiel
- Vit à Dakar avec sa famille
- Smartphone Android moyen de gamme
- Connexion internet variable selon les zones

Besoins :

- Beaucoup de responsabilités quotidiennes (travail, enfants, maison)
- Besoin d'un planning simple, visuel et de rappels
- Gérer plusieurs agendas (personnel, enfants, famille)
- Ne pas oublier les rendez-vous importants

Frustrations techniques :

- Applications trop techniques et difficiles à utiliser
- Interfaces peu intuitives
- Applications qui consomment trop de données
- Manque de simplicité dans les solutions existantes

Comportements numériques :

- Utilise principalement WhatsApp et Facebook
- Consulte peu d'applications complexes
- Préfère les solutions simples et visuelles
- Utilise beaucoup les messages vocaux

Objectifs avec SamaPlanner :

- Organiser sa journée personnelle et familiale
- Avoir des rappels pour les rendez-vous importants
- Simplifier la gestion de ses multiples responsabilités

4️⃣ User Stories principales

US-001 : Enregistrement vocal
En tant qu'utilisateur, je veux enregistrer un vocal pour expliquer ma journée, afin de ne pas avoir à taper de texte.

Critères d'acceptation :

- L'utilisateur peut cliquer sur un bouton d'enregistrement visible et accessible
- L'enregistrement démarre immédiatement après le clic
- Une animation visuelle indique que l'enregistrement est en cours
- L'utilisateur peut arrêter l'enregistrement à tout moment
- L'audio est envoyé au backend après l'arrêt de l'enregistrement
- Le format audio accepté est MP3, WAV ou M4A
- La durée maximale d'enregistrement est de 2 minutes
- Un feedback visuel confirme l'envoi de l'audio

US-002 : Génération automatique de planning
En tant qu'utilisateur, je veux que l'IA génère un planning automatiquement à partir de mon vocal, afin de gagner du temps.

Critères d'acceptation :

- Le vocal est transcrit avec un taux de précision > 90%
- Les tâches sont extraites avec leurs informations (titre, priorité, durée, deadline)
- Un planning est généré avec des horaires suggérés
- Le planning est affiché dans un format timeline clair
- Le temps total de traitement (transcription + extraction + génération) est < 7 secondes
- En cas d'erreur, un message clair est affiché à l'utilisateur

US-003 : Visualisation des tâches du jour
En tant qu'utilisateur, je veux voir mes tâches du jour, afin de savoir ce que j'ai à faire.

Critères d'acceptation :

- Les tâches du jour sont affichées dans une liste claire
- Chaque tâche affiche : titre, horaire, priorité, durée estimée
- Les tâches sont triées par horaire (du plus tôt au plus tard)
- Les tâches passées sont visuellement différenciées
- Les tâches complétées sont dans une section séparée
- La liste se met à jour en temps réel

US-004 : Gestion des tâches
En tant qu'utilisateur, je veux valider, modifier ou reporter une tâche, afin de gérer mon planning selon mes besoins.

Critères d'acceptation :

- L'utilisateur peut valider une tâche par swipe right ou checkbox
- L'utilisateur peut modifier une tâche (titre, horaire, priorité, durée)
- L'utilisateur peut reporter une tâche à un autre jour
- L'utilisateur peut supprimer une tâche par swipe left
- Les modifications sont sauvegardées immédiatement
- Un feedback visuel confirme chaque action

US-005 : Calendrier mensuel
En tant qu'utilisateur, je veux voir un calendrier mensuel, afin d'avoir une vue d'ensemble de mes plannings.

Critères d'acceptation :

- Le calendrier affiche le mois en cours avec les jours du mois
- Les jours avec des tâches sont marqués avec des indicateurs visuels
- Les indicateurs sont colorés selon la priorité des tâches (rouge = haute, orange = moyenne, vert = basse)
- L'utilisateur peut naviguer entre les mois (précédent/suivant)
- Le clic sur un jour ouvre un panneau avec les tâches de ce jour
- Le calendrier est responsive et fonctionne sur mobile

US-006 : Rappels
En tant qu'utilisateur, je veux recevoir des rappels, afin de ne pas oublier mes tâches importantes.

Critères d'acceptation :

- Des notifications sont envoyées 15 minutes avant chaque tâche
- Les rappels peuvent être activés/désactivés par tâche
- Les notifications affichent le titre de la tâche et l'horaire
- Les notifications sont programmées automatiquement lors de la création du planning
- Les notifications fonctionnent même si l'application est fermée

US-007 : Authentification simple
En tant qu'utilisateur, je veux me connecter simplement avec mon numéro et un PIN, afin d'accéder rapidement à mon compte.

Critères d'acceptation :

- L'utilisateur entre son numéro de téléphone (format international ou local)
- Un OTP de 6 chiffres est généré localement et affiché à l'écran
- L'utilisateur recopie l'OTP pour valider son numéro
- L'utilisateur choisit un PIN à 4 chiffres
- Le PIN est crypté avant stockage
- Pour les connexions suivantes, l'utilisateur entre numéro + PIN
- En cas d'oubli du PIN, un processus de réinitialisation est disponible

US-008 : Chat Assistant IA (Action Principale) ✅ IMPLÉMENTÉ
En tant qu'utilisateur, je veux converser avec un assistant IA pour créer et gérer mon planning, afin d'avoir une expérience plus naturelle et interactive.

Critères d'acceptation :

- L'utilisateur peut envoyer des messages texte ou vocaux dans le chat
- L'IA répond de manière contextuelle et personnalisée
- L'IA détecte automatiquement les demandes de planning
- L'IA demande confirmation avant d'extraire les tâches/routines
- L'utilisateur peut voir un aperçu des tâches/routines proposées
- L'utilisateur peut accepter ou rejeter le planning proposé
- Les tâches et routines sont créées uniquement après validation
- L'historique de conversation est conservé pour le contexte
- Les préférences utilisateur sont prises en compte dans les réponses
- L'interface est moderne, épurée et intuitive
- Les messages vocaux affichent leur durée
- Le chat est accessible depuis le bouton principal de la home page

5️⃣ Scénarios Utilisateur (Flows)

▶️ Flow 1 : Création de compte

Étapes détaillées :

1. L'utilisateur arrive sur l'écran d'accueil (/auth/phone)
2. Saisie du numéro de téléphone (format : +221XXXXXXXXX ou 0XXXXXXXXX)
3. Validation du format du numéro côté client
4. Génération d'un OTP à 6 chiffres côté client (algorithme cryptographique sécurisé)
5. Affichage de l'OTP à l'écran (/auth/otp)
6. L'utilisateur recopie l'OTP dans le champ de saisie
7. Validation de l'OTP (comparaison locale)
8. Si valide → redirection vers création PIN (/auth/pin)
9. Saisie d'un PIN à 4 chiffres (avec confirmation)
10. Envoi au backend : { phoneNumber, hashedPin }
11. Création du compte en base de données
12. Génération d'un JWT token
13. Redirection vers /home

Cas d'erreur :

- Numéro invalide : message "Format de numéro invalide"
- OTP incorrect : message "OTP incorrect, réessayez"
- PIN trop simple : message "Choisissez un PIN plus sécurisé"
- Numéro déjà utilisé : message "Ce numéro est déjà enregistré" + option connexion

▶️ Flow 2 : Création de planning via Chat (Recommandé) ✅ NOUVEAU

Étapes détaillées :

1. L'utilisateur clique sur le bouton principal "Parle avec ton assistant IA" (/home)
2. Redirection vers la page chat (/chat)
3. L'utilisateur peut :
   - Taper un message texte (ex: "Planifie ma journée : réunion à 10h, déjeuner à 13h")
   - OU cliquer sur le micro pour enregistrer un message vocal
4. Si message vocal :
   - Enregistrement audio (Web Speech API ou MediaRecorder)
   - Transcription automatique (Whisper local ou API)
   - Affichage de la transcription
5. L'IA analyse la demande et détecte qu'il s'agit d'une demande de planning
6. L'IA propose un planning structuré en texte lisible
7. L'IA demande confirmation : "Souhaitez-vous que je crée ces tâches et routines dans votre planning ?"
8. L'IA fournit un JSON structuré avec les tâches et routines proposées
9. L'interface affiche un aperçu des tâches/routines avec boutons "Accepter" / "Rejeter"
10. Si l'utilisateur accepte :
    - Les tâches sont créées dans la base de données
    - Les routines sont créées si mentionnées
    - Un message de confirmation s'affiche
    - L'utilisateur peut continuer la conversation ou aller voir ses tâches
11. Si l'utilisateur rejette :
    - Le planning est ignoré
    - L'utilisateur peut continuer la conversation

**Avantages :**

- Plus rapide : Pas de navigation entre pages
- Plus précis : Validation avant création
- Plus flexible : Texte ou vocal selon le besoin
- Plus interactif : Conversation naturelle

Cas d'erreur :

- Microphone non disponible : message "Autorisez l'accès au microphone"
- Transcription échouée : message "Erreur de transcription, réessayez"
- Extraction IA échouée : message "Impossible d'extraire les tâches, réessayez"
- Rate limit : message "Limite atteinte, réessayez dans quelques instants"

▶️ Flow 2b : Enregistrement vocal → Planning (Méthode alternative)

Étapes détaillées :

1. L'utilisateur clique sur "🎤 Enregistrer ma journée" (/record)
2. Demande de permission microphone (si première fois)
3. Démarrage de l'enregistrement avec animation visuelle (ondes sonores)
4. L'utilisateur parle librement (durée max : 2 minutes)
5. Arrêt de l'enregistrement (bouton stop ou timeout)
6. Affichage d'un loader "Transcription en cours..."
7. Envoi de l'audio au backend (POST /api/audio/transcribe)
8. Backend : Transcription avec Whisper API
9. Backend : Extraction des tâches avec GPT (POST /api/ai/extract-tasks)
10. Backend : Génération du planning avec GPT (POST /api/ai/generate-planning)
11. Retour du planning au frontend (format JSON structuré)
12. Affichage du planning généré (/planning)
13. L'utilisateur peut valider, modifier ou rejeter
14. Si validé → sauvegarde en base de données
15. Génération automatique des rappels
16. Redirection vers /tasks

Cas d'erreur :

- Microphone non disponible : message "Autorisez l'accès au microphone"
- Audio trop court (< 2 secondes) : message "Enregistrement trop court"
- Transcription échouée : message "Erreur de transcription, réessayez"
- Extraction IA échouée : message "Impossible d'extraire les tâches, réessayez"
- Timeout (> 10 secondes) : message "Traitement trop long, réessayez"

▶️ Flow 3 : Validation d'une tâche

Étapes détaillées :

1. L'utilisateur voit la liste des tâches (/tasks)
2. Clic sur une tâche → ouverture du détail (/tasks/[id])
3. Affichage des détails : titre, description, horaire, priorité, durée, deadline
4. Actions possibles :
   - Valider (swipe right ou checkbox) → tâche marquée complète
   - Modifier → ouverture du formulaire d'édition
   - Reporter → sélection d'une nouvelle date
   - Supprimer (swipe left) → confirmation puis suppression
5. Sauvegarde des modifications en base de données
6. Mise à jour de l'affichage en temps réel
7. Si tâche reportée → mise à jour du calendrier

Cas d'erreur :

- Tâche introuvable : message "Tâche introuvable"
- Conflit de modification : message "Tâche modifiée, rafraîchissez"
- Erreur de sauvegarde : message "Erreur de sauvegarde, réessayez"

▶️ Flow 4 : Calendrier

Étapes détaillées :

1. L'utilisateur ouvre le calendrier (/calendar)
2. Affichage du mois en cours avec grille calendaire
3. Calcul des indicateurs pour chaque jour :
   - Nombre de tâches par jour
   - Priorité la plus haute du jour
   - Couleur de l'indicateur (rouge/orange/vert)
4. Navigation entre mois (boutons précédent/suivant)
5. Clic sur un jour → ouverture d'un panneau latéral
6. Affichage des tâches du jour sélectionné
7. Possibilité d'ajouter une nouvelle tâche depuis le calendrier
8. Possibilité de modifier/reporter une tâche depuis le calendrier

Cas d'erreur :

- Aucune tâche : message "Aucune tâche ce jour"
- Erreur de chargement : message "Erreur de chargement, réessayez"

### Validations Côté Client et Serveur

**Validations Côté Client (Frontend) :**

**Numéro de téléphone :**

- Format : Regex `^(\+221|0)[0-9]{9}$`
- Longueur : 9 chiffres après préfixe
- Feedback immédiat : Message d'erreur sous le champ
- Validation avant soumission

**OTP :**

- Format : 6 chiffres exactement
- Validation en temps réel : Chaque chiffre saisi
- Comparaison locale avec OTP généré
- Feedback : Message "OTP correct" ou "OTP incorrect"

**PIN :**

- Format : 4 chiffres exactement
- Confirmation : Deux champs doivent correspondre
- Validation : Pas tous identiques (ex: 1111)
- Feedback : Message si PIN trop simple

**Audio :**

- Format : MP3, WAV, M4A uniquement
- Taille max : 10MB
- Durée max : 2 minutes
- Validation avant upload

**Tâche (modification) :**

- Titre : Requis, min 3 caractères, max 100 caractères
- Durée : Entier positif, min 5 minutes, max 480 minutes (8h)
- Date : Format ISO valide, pas dans le passé pour nouvelles tâches
- Priorité : Enum valide (LOW, MEDIUM, HIGH, URGENT)

**Validations Côté Serveur (Backend) :**

**Authentification :**

- Numéro : Format validé avec regex, normalisé (+221)
- PIN hash : Vérification bcrypt, min 4 caractères avant hash
- JWT : Vérification signature, expiration, format

**Audio :**

- Type MIME : audio/mpeg, audio/wav, audio/mp4
- Taille : Max 10MB, vérifié avant traitement
- Durée : Calculée côté serveur, max 120 secondes

**Tâches :**

- Titre : Sanitization XSS, longueur validée
- ScheduledAt : Pas dans le passé (sauf modification)
- Priority : Enum strict, valeur par défaut si absente
- Duration : Entier positif, limites respectées
- UserId : Vérification propriétaire (authorization)

**Planning :**

- Date : Format ISO, pas dans le passé
- Tasks : Array non vide, max 20 tâches
- UserId : Vérification propriétaire

### États de Chargement et Feedback Utilisateur

**États de Chargement :**

**Enregistrement audio :**

- État initial : Bouton "Enregistrer" visible
- Enregistrement : Animation onde + timer + bouton stop
- Upload : Progress bar (0-100%) + message "Envoi en cours..."
- Transcription : Skeleton loader + message "Transcription..."
- Extraction : Skeleton loader + message "Analyse en cours..."
- Génération : Skeleton loader + message "Génération du planning..."

**Actions utilisateur :**

- Clic bouton : État disabled immédiat + spinner
- Sauvegarde : Toast "Sauvegarde..." puis "Sauvegardé ✓"
- Suppression : Confirmation modal + loader pendant suppression
- Modification : Formulaire pré-rempli + loader pendant sauvegarde

**Feedback Utilisateur :**

**Succès :**

- Toast vert : "Planning généré avec succès"
- Toast vert : "Tâche sauvegardée"
- Toast vert : "Compte créé, bienvenue !"
- Animation : Checkmark animé

**Erreurs :**

- Toast rouge : Message d'erreur clair et actionnable
- Exemples : "Erreur de connexion, vérifiez votre réseau"
- Exemples : "Tâche introuvable, rafraîchissez la page"
- Bouton "Réessayer" proposé

**Informations :**

- Toast bleu : "Planning en cours de génération..."
- Toast bleu : "Synchronisation en cours..."
- Badge : Nombre de tâches en attente

### Gestion Offline et Synchronisation

**Stratégie Offline :**

**Cache LocalStorage :**

- Données récentes : Tâches des 7 derniers jours
- Plannings validés : Derniers 3 plannings
- User info : Données utilisateur de base
- TTL : 24 heures pour données cache

**Queue d'Actions Hors Ligne :**

- Stockage : IndexedDB pour actions en attente
- Actions queueables :
  - Création/modification tâche
  - Validation tâche
  - Report tâche
  - Modification planning
- Format : `{ type: string, payload: object, timestamp: number }`

**Synchronisation Automatique :**

**Détection Connexion :**

- Event listener : `online` / `offline`
- Badge : Indicateur "Hors ligne" en header
- Notification : "Connexion rétablie, synchronisation..."

**Processus de Sync :**

1. Détection connexion rétablie
2. Récupération queue IndexedDB
3. Envoi séquentiel des actions en attente
4. Mise à jour cache LocalStorage
5. Rafraîchissement UI
6. Notification : "Synchronisation terminée"

**Gestion Conflits :**

- Dernière modification gagne (timestamp serveur)
- Notification : "Conflit détecté, dernière version chargée"
- Option : Voir historique des modifications

**Stratégie de Retry :**

- Tentatives : 3 tentatives avec backoff exponentiel
- Délais : 1s, 2s, 4s
- Après échec : Action marquée "échec" dans queue
- Option manuelle : Bouton "Réessayer" dans queue

6️⃣ Fonctionnalités (MVP)
🎤 1. Enregistrement vocal

Interface simple : bouton rond

Animation onde sonore

Envoi audio backend → Whisper

✍️ 2. Transcription & IA

Whisper convertit l’audio en texte

GPT extrait :

liste des tâches

priorités

durées

suggestions horaires

🧠 3. Planning automatique

Algo IA qui génère un agenda ordonné

Format JSON structuré

Affichage en timeline

☑️ 4. Task list

Swipe right : valider

Swipe left : supprimer / reporter

Checkbox animée

Section tâches faites

🗓️ 5. Calendrier

Vue mensuelle minimaliste

Points colorés selon priorité

Tap → panneau des tâches du jour

🔔 6. Rappels

Notifications de tâches

Rappels IA basiques

🔐 7. Auth

Numéro

OTP interne

PIN

💬 8. Chat Assistant IA (Action Principale) ✅ IMPLÉMENTÉ

**Interface conversationnelle multimodale (texte + vocal)**

Le chat est maintenant l'action principale de l'application, remplaçant le flux record → processing → transcription.

**Fonctionnalités :**

- **Messages texte** : L'utilisateur peut taper ses demandes
- **Messages vocaux** : Enregistrement audio directement dans le chat
- **Réponses intelligentes** : L'IA comprend le contexte et répond de manière personnalisée
- **Extraction automatique** : Détection des demandes de planning et extraction des tâches/routines
- **Validation interactive** : Boutons "Accepter" / "Rejeter" pour valider les plannings proposés
- **Historique de conversation** : Conservation du contexte pour des interactions fluides
- **Intégration préférences** : L'IA prend en compte les préférences utilisateur (heures de travail, énergie, etc.)
- **Support routines** : L'IA peut créer des routines en plus des tâches
- **Confirmation avant extraction** : L'IA demande confirmation avant de créer les tâches/routines

**Avantages par rapport au flux record :**

- ✅ Plus rapide : Pas de navigation entre pages
- ✅ Plus précis : L'utilisateur peut voir et corriger avant validation
- ✅ Plus flexible : Texte ou vocal selon le besoin
- ✅ Plus interactif : Conversation naturelle avec feedback immédiat
- ✅ Meilleure expérience : Validation avant création, pas après

**Interface :**

- Design moderne et épuré
- Bulles de messages avec avatars
- Animations fluides
- Support dark/light mode
- Player audio intégré pour messages vocaux
- Affichage durée des messages vocaux

7️⃣ Fonctionnalités prévues (Post-MVP)

(À intégrer dans la roadmap de Cursor)

🔄 Mode Habitudes

Suivi des routines quotidiennes :

eau

sport

lecture

méditation

📈 Statistiques avancées

Graphiques & insights IA :

productivité

priorités dominantes

heures efficaces

évolution hebdomadaire

☁️ Synchronisation multi-appareils

Téléphone → tablette → web

🌙 Mode sombre automatique

Selon l’heure / luminosité

📅 Planification hebdomadaire automatique

Chaque dimanche, planning complet de la semaine.

🧬 Analyse longue durée

Détection IA :

zones de fatigue

habitudes

pics de productivité

👥 Partage de planning

Famille / équipe

🧠 Optimisation automatique

L'app apprend l'utilisateur et ajuste le planning.

8️⃣ Contraintes & Exigences
Techniques :

Nuxt 3 + TS côté front

NestJS + Prisma côté backend

PostgreSQL

API Whisper & GPT

Auth locale (no SMS)

UX :

Pas plus de 3 actions pour générer un planning

Interface “soft”, rassurante, fluide

Accessible en conditions réseau faibles

9️⃣ KPIs (indicateurs clés)
MVP :

% d’utilisateurs qui complètent leur premier planning

Temps moyen vocal → planning

Taux d’usage quotidien

Nombre de tâches validées/jour

Long terme :

Maintien hebdomadaire

Engagement sur routines

Taux de retour après 30 jours

Temps d’utilisation moyen

🔟 Roadmap Résumée
Phase 1 – MVP (4 à 6 semaines)

Auth simple

Vocal → transcription

IA → planning

Task list

Calendrier

Rappels

Phase 2 – Améliorations

Assistant conversationnel

Habitudes

Statistiques

Mode sombre

Synchro multi-device

Phase 3 – Intelligence avancée

Optimisation automatique

Analyse longue durée

Planification hebdo

Phase 4 – Collaboration

Partage familial / équipe

Version web

---

## 1️⃣1️⃣ Architecture Technique Détaillée

### Stack Technique Complet

**Frontend :**

- Framework : Nuxt 3 (v3.8+)
- Langage : TypeScript (v5.0+)
- Styling : Tailwind CSS (v3.4+)
- State Management : Pinia (v2.1+)
- HTTP Client : $fetch (Nuxt native)
- Form Validation : VeeValidate + Yup
- Audio Recording : MediaRecorder API
- Date Management : date-fns (v3.0+)
- Icons : Heroicons

**Backend :**

- Framework : NestJS (v10.0+)
- Langage : TypeScript (v5.0+)
- ORM : Prisma (v5.0+)
- Base de données : PostgreSQL (v15+)
- Authentification : JWT (@nestjs/jwt)
- Validation : class-validator, class-transformer
- File Upload : multer (@nestjs/platform-express)
- Scheduling : @nestjs/schedule (pour rappels)
- HTTP Client : axios (pour APIs externes)

**Intégrations Externes :**

- Transcription : Service API de transcription vocale
- IA : Service API d'extraction de tâches IA
- Notifications Push : Firebase Cloud Messaging (futur)

**Outils de Développement :**

- Linting : ESLint + Prettier
- Testing : Vitest (frontend), Jest (backend)
- CI/CD : GitHub Actions
- Containerisation : Docker + Docker Compose

### Structure des Dossiers

**Frontend (Nuxt 3) :**

```
frontend/
├── assets/          # Images, styles globaux
├── components/      # Composants réutilisables
│   ├── AudioRecorder.vue
│   ├── TaskCard.vue
│   ├── PlanningList.vue
│   ├── CalendarGrid.vue
│   ├── PinInput.vue
│   └── OtpDisplay.vue
├── composables/     # Composables Nuxt
│   ├── useAuth.ts
│   ├── useAudio.ts
│   └── useTasks.ts
├── layouts/         # Layouts
│   └── default.vue
├── pages/           # Pages/routes
│   ├── auth/
│   │   ├── phone.vue
│   │   ├── otp.vue
│   │   ├── pin.vue
│   │   └── login.vue
│   ├── home.vue
│   ├── record.vue
│   ├── transcription.vue
│   ├── planning.vue
│   ├── tasks/
│   │   ├── index.vue
│   │   └── [id].vue
│   ├── calendar.vue
│   └── profile.vue
├── server/          # API routes Nuxt
│   └── api/
├── stores/          # Pinia stores
│   ├── auth.ts
│   ├── tasks.ts
│   └── planning.ts
├── types/           # Types TypeScript
└── utils/           # Utilitaires
```

**Backend (NestJS) :**

```
backend/
├── src/
│   ├── auth/           # Module authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   └── guards/
│   ├── users/           # Module utilisateurs
│   ├── audio/           # Module audio
│   │   ├── audio.controller.ts
│   │   ├── audio.service.ts
│   │   └── audio.module.ts
│   ├── ai/              # Module IA
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   ├── whisper.service.ts
│   │   ├── gpt.service.ts
│   │   └── ai.module.ts
│   ├── tasks/           # Module tâches
│   ├── planning/        # Module planning
│   ├── calendar/        # Module calendrier
│   ├── notifications/  # Module notifications
│   ├── common/          # Utilitaires communs
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── test/
```

### Schémas d'Intégration

**Flux Audio → Planning :**

```
Frontend (AudioRecorder)
    ↓ [POST /api/audio/upload]
Backend (AudioController)
    ↓ [save file]
AudioService
    ↓ [call Whisper API]
WhisperService
    ↓ [transcription text]
AIService
    ↓ [call GPT-4 for extraction]
GPTService
    ↓ [extracted tasks JSON]
PlanningService
    ↓ [call GPT-4 for planning]
GPTService
    ↓ [planning JSON]
Backend Response
    ↓ [JSON planning]
Frontend (PlanningList)
```

**Flux Authentification :**

```
Frontend (Phone Input)
    ↓ [generate OTP client-side]
Frontend (OTP Display)
    ↓ [validate OTP client-side]
Frontend (PIN Input)
    ↓ [POST /api/auth/register]
Backend (AuthController)
    ↓ [hash PIN]
AuthService
    ↓ [create user]
Prisma
    ↓ [generate JWT]
AuthService
    ↓ [return token]
Frontend (store token)
```

---

## 1️⃣2️⃣ Schéma de Données (Prisma)

### Modèle Complet

```prisma
// User Model
model User {
  id            String    @id @default(cuid())
  phoneNumber   String    @unique
  pinHash       String    // PIN crypté avec bcrypt
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  tasks         Task[]
  plannings     Planning[]
  reminders     Reminder[]
  audioLogs     AudioLog[]

  @@index([phoneNumber])
}

// Task Model
model Task {
  id            String    @id @default(cuid())
  title         String
  description   String?
  priority      Priority  @default(MEDIUM)
  duration      Int       // en minutes
  scheduledAt   DateTime  // date et heure prévues
  deadline      DateTime?
  status        TaskStatus @default(PENDING)
  completedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  planningId    String?
  planning      Planning? @relation(fields: [planningId], references: [id], onDelete: SetNull)
  reminders     Reminder[]

  @@index([userId])
  @@index([scheduledAt])
  @@index([status])
  @@index([planningId])
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
  POSTPONED
}

// Planning Model
model Planning {
  id            String    @id @default(cuid())
  date          DateTime  @date
  generatedAt   DateTime  @default(now())
  validatedAt   DateTime?
  status        PlanningStatus @default(DRAFT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks         Task[]
  audioLogId    String?
  audioLog      AudioLog? @relation(fields: [audioLogId], references: [id], onDelete: SetNull)

  @@unique([userId, date])
  @@index([userId])
  @@index([date])
}

enum PlanningStatus {
  DRAFT
  VALIDATED
  ARCHIVED
}

// Reminder Model
model Reminder {
  id            String    @id @default(cuid())
  scheduledAt   DateTime
  sentAt        DateTime?
  status        ReminderStatus @default(PENDING)
  createdAt     DateTime  @default(now())

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskId        String
  task          Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([scheduledAt])
  @@index([status])
}

enum ReminderStatus {
  PENDING
  SENT
  CANCELLED
}

// AudioLog Model
model AudioLog {
  id            String    @id @default(cuid())
  fileUrl       String    // URL du fichier audio stocké
  transcription String?   // Texte transcrit
  duration      Int       // en secondes
  createdAt     DateTime  @default(now())

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  planning      Planning?

  @@index([userId])
  @@index([createdAt])
}

// ChatMessage Model ✅ NOUVEAU
model ChatMessage {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role          String   // "user" | "assistant"
  content       String   // Texte du message
  audioUrl      String?  // URL du fichier audio (si message vocal)
  isVoice       Boolean  @default(false) // true si message vocal
  transcription String?  // Transcription si message vocal utilisateur
  metadata      String?  // JSON metadata (e.g., proposedTasks, proposedRoutines, validated)
  duration      Int?     // Duration of voice message in seconds
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([userId, createdAt])
}
```

### Contraintes et Index

- **User.phoneNumber** : Unique, indexé pour recherche rapide
- **Task.scheduledAt** : Indexé pour requêtes calendrier
- **Planning.userId + date** : Unique pour éviter doublons
- **Reminder.scheduledAt** : Indexé pour requêtes de rappels
- **ChatMessage.userId + createdAt** : Indexé pour historique conversation
- **Cascade deletes** : Suppression en cascade pour maintenir l'intégrité

### Formats de Données (JSON Schemas)

**Schéma TaskExtraction (Extraction IA) :**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "priority", "duration"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 3,
            "maxLength": 100
          },
          "description": {
            "type": "string",
            "maxLength": 500
          },
          "priority": {
            "type": "string",
            "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"]
          },
          "duration": {
            "type": "integer",
            "minimum": 5,
            "maximum": 480
          },
          "deadline": {
            "type": "string",
            "format": "date-time"
          },
          "suggestedTime": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "minItems": 1,
      "maxItems": 20
    }
  },
  "required": ["tasks"]
}
```

**Schéma PlanningResponse (Génération Planning) :**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "planning": {
      "type": "object",
      "required": ["date", "tasks"],
      "properties": {
        "date": {
          "type": "string",
          "format": "date"
        },
        "tasks": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["taskId", "scheduledAt", "order"],
            "properties": {
              "taskId": {
                "type": "string"
              },
              "scheduledAt": {
                "type": "string",
                "format": "date-time"
              },
              "order": {
                "type": "integer",
                "minimum": 1
              }
            }
          }
        }
      }
    }
  },
  "required": ["planning"]
}
```

**Schéma Task (API Response) :**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "description": { "type": "string", "nullable": true },
    "priority": {
      "type": "string",
      "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"]
    },
    "duration": { "type": "integer" },
    "scheduledAt": { "type": "string", "format": "date-time" },
    "deadline": { "type": "string", "format": "date-time", "nullable": true },
    "status": {
      "type": "string",
      "enum": ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "POSTPONED"]
    },
    "completedAt": {
      "type": "string",
      "format": "date-time",
      "nullable": true
    },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "title", "priority", "duration", "scheduledAt", "status"]
}
```

**Schéma ChatMessageMetadata (Métadonnées Chat) :** ✅ NOUVEAU

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "proposedTasks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "priority", "duration", "scheduledAt"],
        "properties": {
          "title": { "type": "string" },
          "description": { "type": "string", "nullable": true },
          "priority": {
            "type": "string",
            "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"]
          },
          "duration": { "type": "integer" },
          "scheduledAt": { "type": "string", "format": "date-time" },
          "deadline": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          }
        }
      }
    },
    "proposedRoutines": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "frequency", "duration", "priority"],
        "properties": {
          "title": { "type": "string" },
          "description": { "type": "string", "nullable": true },
          "frequency": {
            "type": "string",
            "enum": ["DAILY", "WEEKLY", "WEEKDAYS", "WEEKENDS", "CUSTOM"]
          },
          "time": { "type": "string", "format": "HH:mm", "nullable": true },
          "daysOfWeek": {
            "type": "array",
            "items": { "type": "string" }
          },
          "duration": { "type": "integer" },
          "priority": {
            "type": "string",
            "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"]
          }
        }
      }
    },
    "validated": { "type": "boolean", "default": false },
    "validatedAt": { "type": "string", "format": "date-time", "nullable": true }
  }
}
```

**Schéma CalendarDay (Calendrier) :**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date"
    },
    "taskCount": {
      "type": "integer",
      "minimum": 0
    },
    "highestPriority": {
      "type": "string",
      "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"],
      "nullable": true
    },
    "hasTasks": {
      "type": "boolean"
    }
  },
  "required": ["date", "taskCount", "hasTasks"]
}
```

### Catégorisation des Tâches

**Catégories Prédéfinies (Futur MVP+) :**

- Travail
- Personnel
- Santé
- Famille
- Apprentissage
- Loisirs

**Détection Automatique (IA) :**

- Analyse du titre et description
- Mots-clés par catégorie
- Classification automatique lors extraction
- Stockage dans champ `category` (futur)

**Utilisation :**

- Filtrage par catégorie
- Statistiques par catégorie
- Couleurs visuelles par catégorie
- Groupement dans calendrier

---

## 1️⃣3️⃣ APIs et Intégrations

### Endpoints API REST

#### Authentification

**POST /api/auth/register**

- Description : Création d'un nouveau compte
- Body : `{ phoneNumber: string, pinHash: string }`
- Response : `{ token: string, user: User }`
- Codes : 201 Created, 400 Bad Request, 409 Conflict

**POST /api/auth/login**

- Description : Connexion avec numéro + PIN
- Body : `{ phoneNumber: string, pin: string }`
- Response : `{ token: string, user: User }`
- Codes : 200 OK, 401 Unauthorized

**POST /api/auth/verify-otp**

- Description : Vérification OTP (côté client pour MVP)
- Body : `{ phoneNumber: string, otp: string }`
- Response : `{ valid: boolean }`
- Codes : 200 OK

**POST /api/auth/reset-pin**

- Description : Réinitialisation du PIN
- Body : `{ phoneNumber: string, newPinHash: string }`
- Response : `{ success: boolean }`
- Codes : 200 OK, 401 Unauthorized

#### Audio

**POST /api/audio/upload**

- Description : Upload d'un fichier audio
- Content-Type : multipart/form-data
- Body : `{ file: File }`
- Response : `{ audioLogId: string, fileUrl: string }`
- Codes : 201 Created, 400 Bad Request, 413 Payload Too Large

**POST /api/audio/transcribe**

- Description : Transcription audio avec Whisper
- Body : `{ audioLogId: string }`
- Response : `{ transcription: string, audioLogId: string }`
- Codes : 200 OK, 400 Bad Request, 500 Internal Server Error

#### IA

**POST /api/ai/extract-tasks**

- Description : Extraction des tâches depuis transcription
- Body : `{ transcription: string }`
- Response : `{ tasks: TaskExtraction[] }`
- Format réponse :

```json
{
  "tasks": [
    {
      "title": "Réunion avec l'équipe",
      "description": "Réunion hebdomadaire",
      "priority": "HIGH",
      "duration": 60,
      "deadline": "2024-01-15T10:00:00Z",
      "suggestedTime": "2024-01-15T09:00:00Z"
    }
  ]
}
```

- Codes : 200 OK, 400 Bad Request, 500 Internal Server Error

**POST /api/ai/generate-planning**

- Description : Génération d'un planning intelligent
- Body : `{ tasks: TaskExtraction[], date: string }`
- Response : `{ planning: PlanningResponse }`
- Format réponse :

```json
{
  "planning": {
    "date": "2024-01-15",
    "tasks": [
      {
        "taskId": "extracted_task_1",
        "scheduledAt": "2024-01-15T09:00:00Z",
        "order": 1
      }
    ]
  }
}
```

- Codes : 200 OK, 400 Bad Request, 500 Internal Server Error

#### Tâches

**GET /api/tasks**

- Description : Récupération des tâches
- Query : `?date=YYYY-MM-DD&status=PENDING`
- Response : `{ tasks: Task[] }`
- Codes : 200 OK, 401 Unauthorized

**GET /api/tasks/:id**

- Description : Détail d'une tâche
- Response : `{ task: Task }`
- Codes : 200 OK, 404 Not Found

**PATCH /api/tasks/:id**

- Description : Modification d'une tâche
- Body : `{ title?: string, scheduledAt?: string, priority?: Priority, ... }`
- Response : `{ task: Task }`
- Codes : 200 OK, 404 Not Found, 400 Bad Request

**POST /api/tasks/:id/complete**

- Description : Marquer une tâche comme complète
- Response : `{ task: Task }`
- Codes : 200 OK, 404 Not Found

**POST /api/tasks/:id/postpone**

- Description : Reporter une tâche
- Body : `{ newDate: string }`
- Response : `{ task: Task }`
- Codes : 200 OK, 404 Not Found

**DELETE /api/tasks/:id**

- Description : Supprimer une tâche
- Response : `{ success: boolean }`
- Codes : 200 OK, 404 Not Found

#### Planning

**GET /api/planning**

- Description : Récupération du planning
- Query : `?date=YYYY-MM-DD`
- Response : `{ planning: Planning }`
- Codes : 200 OK, 404 Not Found

**POST /api/planning/validate**

- Description : Valider un planning généré
- Body : `{ planningId: string, tasks: Task[] }`
- Response : `{ planning: Planning }`
- Codes : 200 OK, 400 Bad Request

#### Calendrier

**GET /api/calendar/month**

- Description : Récupération des tâches d'un mois
- Query : `?year=2024&month=1`
- Response : `{ days: CalendarDay[] }`
- Format réponse :

```json
{
  "days": [
    {
      "date": "2024-01-15",
      "taskCount": 3,
      "highestPriority": "HIGH",
      "hasTasks": true
    }
  ]
}
```

- Codes : 200 OK

#### Notifications

**GET /api/notifications/reminders**

- Description : Récupération des rappels à venir
- Query : `?limit=10`
- Response : `{ reminders: Reminder[] }`
- Codes : 200 OK

**POST /api/notifications/reminders/:id/sent**

- Description : Marquer un rappel comme envoyé
- Response : `{ reminder: Reminder }`
- Codes : 200 OK

### Intégrations Externes

#### API de Transcription Vocale

**Configuration :**

- Endpoint : Service API de transcription (configuration interne)
- Model : `whisper-1`
- Format : JSON
- Langue : auto-détection (support wolof, français)

**Gestion d'erreurs :**

- Rate limit : Retry avec backoff exponentiel
- Timeout : 30 secondes max
- Erreur API : Log + message utilisateur générique

#### API d'Extraction de Tâches IA

**Configuration :**

- Endpoint : Service API d'extraction de tâches (configuration interne)
- Model : `gpt-4-turbo-preview`
- Temperature : 0.7
- Max tokens : 2000

**Prompts structurés :**

**Extraction de tâches :**

```
Extrait les tâches du texte suivant et retourne un JSON strict avec ce format :
{
  "tasks": [
    {
      "title": "string",
      "description": "string (optionnel)",
      "priority": "LOW|MEDIUM|HIGH|URGENT",
      "duration": number (en minutes),
      "deadline": "ISO date string (optionnel)",
      "suggestedTime": "ISO date string (optionnel)"
    }
  ]
}

Texte : {transcription}
```

**Génération de planning :**

```
Génère un planning intelligent pour le {date} avec les tâches suivantes.
Organise-les de manière optimale en tenant compte des priorités et durées.
Retourne un JSON strict avec ce format :
{
  "planning": {
    "date": "YYYY-MM-DD",
    "tasks": [
      {
        "taskId": "string",
        "scheduledAt": "ISO datetime string",
        "order": number
      }
    ]
  }
}

Tâches : {tasks JSON}
```

### Gestion des Erreurs

**Codes de statut HTTP :**

- 200 OK : Succès
- 201 Created : Ressource créée
- 400 Bad Request : Données invalides
- 401 Unauthorized : Token invalide/expiré
- 403 Forbidden : Accès refusé
- 404 Not Found : Ressource introuvable
- 409 Conflict : Conflit (ex: numéro déjà utilisé)
- 413 Payload Too Large : Fichier trop volumineux
- 429 Too Many Requests : Rate limit dépassé
- 500 Internal Server Error : Erreur serveur
- 503 Service Unavailable : Service indisponible

**Format d'erreur standardisé :**

```json
{
  "statusCode": 400,
  "message": "Message d'erreur utilisateur",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:00:00Z",
  "path": "/api/tasks"
}
```

---

## 1️⃣4️⃣ Spécifications UI/UX Détaillées

### Design System

**Couleurs :**

- Primaire : #6366F1 (Indigo)
- Secondaire : #8B5CF6 (Violet)
- Succès : #10B981 (Vert)
- Avertissement : #F59E0B (Orange)
- Erreur : #EF4444 (Rouge)
- Fond : #FFFFFF (Blanc)
- Fond secondaire : #F9FAFB (Gris clair)
- Texte primaire : #111827 (Gris foncé)
- Texte secondaire : #6B7280 (Gris moyen)
- Bordure : #E5E7EB (Gris clair)

**Typographie :**

- Famille : Inter, system-ui, sans-serif
- Tailles :
  - H1 : 32px / 40px line-height
  - H2 : 24px / 32px line-height
  - H3 : 20px / 28px line-height
  - Body : 16px / 24px line-height
  - Small : 14px / 20px line-height
  - Caption : 12px / 16px line-height

**Espacements :**

- Base : 4px
- Scale : 4, 8, 12, 16, 24, 32, 48, 64px

**Composants de Base :**

**Bouton :**

- Padding : 12px 24px
- Border radius : 8px
- États : default, hover, active, disabled
- Variantes : primary, secondary, outline, ghost

**Input :**

- Padding : 12px 16px
- Border radius : 8px
- Border : 1px solid #E5E7EB
- Focus : border-color primaire + shadow

**Card :**

- Padding : 24px
- Border radius : 12px
- Shadow : 0 1px 3px rgba(0,0,0,0.1)
- Background : #FFFFFF

### Écrans Détaillés

#### 1. Écran d'Accueil (/home)

**Design Mobile-First :**

- Layout vertical scrollable (plein écran mobile)
- Header fixe en haut avec avatar et menu
- Contenu scrollable en dessous
- Bottom navigation bar fixe en bas
- Bouton flottant "🎤 Enregistrer" centré en bas (au-dessus de la nav bar)

**États :**

- État initial : Message de bienvenue + bouton "Enregistrer ma journée"
- Après premier planning : Affichage du planning du jour + bouton "Enregistrer"
- Sans tâches : Message "Aucune tâche aujourd'hui" + bouton "Enregistrer"

**Composants :**

- Header avec avatar et menu (fixe en haut)
- Section "Aujourd'hui" avec tâches du jour (scrollable)
- Bouton flottant "🎤 Enregistrer ma journée" (fixe en bas)
- Section "À venir" (tâches des prochains jours, scrollable)
- Bottom navigation bar (Home, Tasks, Calendar, Profile)

**Interactions Mobile :**

- Swipe down : Pull-to-refresh (gesture natif mobile)
- Tap sur tâche : Navigation vers détail
- Long press sur tâche : Menu contextuel (haptic feedback)
- Swipe right sur tâche : Valider rapidement
- Swipe left sur tâche : Supprimer/Reporter

#### 2. Enregistrement Vocal (/record)

**États :**

- Prêt : Bouton rond "Enregistrer" au centre
- Enregistrement : Animation onde sonore + timer + bouton stop
- Envoi : Loader "Envoi en cours..."
- Erreur : Message d'erreur + bouton "Réessayer"

**Composants :**

- AudioRecorder : Bouton rond avec animation
- Timer : Affichage durée (MM:SS)
- Visualizer : Ondes sonores animées

**Animations :**

- Démarrage : Scale up du bouton + apparition ondes
- Enregistrement : Pulsation continue
- Arrêt : Scale down + disparition ondes

#### 3. Transcription (/transcription)

**États :**

- Chargement : Skeleton loader
- Transcription : Texte transcrit affiché
- Erreur : Message d'erreur + option réessayer

**Composants :**

- TranscriptionText : Texte éditable
- Bouton "Continuer" : Passage à l'extraction IA

#### 4. Planning Généré (/planning)

**États :**

- Génération : Loader "Génération du planning..."
- Affichage : Timeline avec tâches positionnées
- Validation : Boutons "Valider" / "Modifier" / "Rejeter"

**Composants :**

- PlanningTimeline : Timeline verticale avec heures
- TaskCard : Carte de tâche avec drag & drop
- ActionButtons : Boutons de validation

**Interactions :**

- Drag & drop : Réorganisation des tâches
- Tap sur tâche : Modification inline
- Swipe : Suppression rapide

#### 5. Task List (/tasks)

**États :**

- Liste vide : Message "Aucune tâche"
- Avec tâches : Liste scrollable
- Filtres : Tous / Aujourd'hui / Cette semaine / Complétées

**Composants :**

- TaskCard : Carte avec swipe actions
- FilterTabs : Onglets de filtrage
- EmptyState : État vide avec illustration

**Interactions :**

- Swipe right : Valider
- Swipe left : Supprimer / Reporter
- Pull to refresh : Actualisation

#### 6. Détail Tâche (/tasks/[id])

**États :**

- Chargement : Skeleton
- Affichage : Détails complets
- Édition : Formulaire pré-rempli

**Composants :**

- TaskDetailHeader : Titre + actions
- TaskInfo : Informations détaillées
- EditForm : Formulaire d'édition
- ActionButtons : Valider / Modifier / Reporter / Supprimer

#### 7. Calendrier (/calendar)

**États :**

- Mois actuel : Grille calendaire
- Jour sélectionné : Panneau latéral avec tâches
- Navigation : Mois précédent/suivant

**Composants :**

- CalendarGrid : Grille 7x6 avec jours
- DayIndicator : Point coloré selon priorité
- DayPanel : Panneau latéral avec tâches du jour

**Interactions :**

- Tap jour : Ouverture panneau
- Swipe horizontal : Navigation mois
- Long press jour : Menu contextuel

#### 8. Profil (/profile)

**Composants :**

- UserInfo : Numéro + date inscription
- Settings : Préférences utilisateur
- Stats : Statistiques basiques (futur)

### Approche Mobile-First

**Philosophie de développement :**

L'application SamaPlanner est conçue **MOBILE-FIRST**. Cela signifie :

1. **Design initial pour mobile** : Tous les écrans sont d'abord conçus pour mobile (< 640px)
2. **Expérience native mobile** : L'application doit ressembler et fonctionner comme une application mobile native
3. **Interactions tactiles** : Optimisation pour les gestes tactiles (swipe, tap, long press)
4. **Performance mobile** : Optimisation pour connexions mobiles et appareils moins puissants
5. **Adaptation progressive** : Les versions tablette/desktop sont des adaptations du design mobile

**Caractéristiques Mobile-First :**

- **Navigation** : Bottom navigation bar (style app mobile)
- **Gestes** : Swipe pour actions rapides (valider, supprimer, reporter)
- **Taille des éléments** : Boutons et zones tactiles ≥ 44x44px (Apple HIG) / 48x48dp (Material Design)
- **Espacement** : Espacement généreux pour éviter les erreurs de tap
- **Scroll** : Scroll vertical natif, pull-to-refresh
- **Animations** : Animations fluides optimisées pour mobile
- **Feedback** : Feedback haptique (vibration) pour actions importantes
- **Fullscreen** : Utilisation maximale de l'écran mobile

### Responsive Design

**Breakpoints (Mobile-First) :**

- **Mobile** : < 640px (par défaut, design principal)
- **Tablet** : 640px - 1024px (adaptation du mobile)
- **Desktop** : > 1024px (futur, adaptation optionnelle)

**Adaptations :**

- **Mobile (< 640px)** : Design principal, navigation bottom, swipe gestures, fullscreen
- **Tablet (640-1024px)** : Adaptation avec sidebar, grille adaptative
- **Desktop (> 1024px)** : Adaptation future avec layout multi-colonnes

**Composants Mobile-First :**

- Calendrier : Grille compacte mobile, panneau latéral pour détails
- Task cards : Pleine largeur mobile, swipe actions
- Navigation : Bottom bar mobile, hamburger menu tablette+
- Forms : Inputs pleine largeur, labels au-dessus
- Modals : Plein écran mobile, centré tablette+

### Accessibilité (a11y)

**Standards WCAG 2.1 AA :**

- Contraste texte : Minimum 4.5:1
- Focus visible : Outline sur éléments focusables
- Labels : Tous les inputs ont des labels
- ARIA : Attributs ARIA pour composants complexes
- Navigation clavier : Tous les éléments accessibles au clavier

---

## 1️⃣5️⃣ Règles Métier

### Génération de Planning IA

**Algorithme de planification :**

1. **Tri des tâches par priorité :**

   - URGENT → HIGH → MEDIUM → LOW

2. **Allocation temporelle :**

   - Début de journée : 08:00 (par défaut, ajustable)
   - Fin de journée : 20:00
   - Pause déjeuner : 12:00 - 13:00 (bloquée)
   - Buffer entre tâches : 15 minutes

3. **Optimisation :**

   - Tâches URGENT en début de journée
   - Tâches longues (> 2h) en matinée si possible
   - Tâches courtes (< 30min) peuvent être groupées
   - Respect des deadlines si spécifiées

4. **Contraintes :**
   - Pas de chevauchement de tâches
   - Durée totale ≤ 12 heures
   - Si trop de tâches : Suggestion de reporter certaines

### Système de Priorités

**Définition :**

- **URGENT** : Deadline < 24h, action immédiate requise
- **HIGH** : Important, deadline < 3 jours
- **MEDIUM** : Normal, deadline < 7 jours
- **LOW** : Peut attendre, pas de deadline pressante

**Détection automatique :**

- Mots-clés dans transcription : "urgent", "important", "rapidement"
- Deadlines proches : < 24h = URGENT
- Contexte temporel : "aujourd'hui" = HIGH

### Gestion des Tâches

**Validation :**

- Tâche complétée → status = COMPLETED
- Date complétion enregistrée
- Rappels associés annulés
- Statistiques mises à jour

**Modification :**

- Modification horaire → Vérification conflits
- Modification priorité → Réorganisation si nécessaire
- Modification durée → Réallocation dans planning

**Report :**

- Sélection nouvelle date
- Vérification disponibilité
- Mise à jour planning source
- Création nouvelle instance si nécessaire

### Rappels Automatiques

**Règles de programmation :**

- Par défaut : 15 minutes avant tâche
- Tâches URGENT : 30 minutes + 15 minutes avant
- Tâches matinales (< 10h) : Rappel la veille à 20h
- Tâches du soir (> 18h) : Rappel le matin à 8h

**Gestion :**

- Création automatique lors validation planning
- Annulation si tâche complétée avant rappel
- Annulation si tâche reportée
- Réprogrammation si tâche modifiée

### Authentification

**Génération OTP :**

- Algorithme : Cryptographically secure random (6 chiffres)
- Validité : 10 minutes
- Stockage : Côté client uniquement (pas en base)

**Hachage PIN :**

- Algorithme : bcrypt (10 rounds)
- Stockage : PIN hash uniquement
- Vérification : Comparaison hash lors login

**JWT Token :**

- Durée : 7 jours
- Refresh : Token refresh après 6 jours
- Stockage : localStorage (frontend)
- Sécurité : HTTPS uniquement

---

## 1️⃣6️⃣ Tests et Qualité

### Stratégie de Tests

**Frontend (Vitest) :**

**Tests unitaires :**

- Composants : Rendu, props, événements
- Composables : Logique métier
- Utilitaires : Fonctions pures

**Tests d'intégration :**

- Flux utilisateur complets
- Interactions API
- Navigation entre pages

**Tests E2E (Playwright) :**

- Scénarios critiques :
  - Création de compte
  - Enregistrement vocal → planning
  - Validation de tâche
  - Navigation calendrier

**Backend (Jest) :**

**Tests unitaires :**

- Services : Logique métier isolée
- Controllers : Validation requêtes
- Utilitaires : Fonctions helper

**Tests d'intégration :**

- Endpoints API complets
- Intégrations Prisma
- Intégrations externes (mocks)

**Tests E2E :**

- Scénarios API complets
- Authentification complète
- Pipeline audio → planning

### Critères d'Acceptation par User Story

**US-001 : Enregistrement vocal**

- ✅ Bouton visible et accessible
- ✅ Enregistrement démarre immédiatement
- ✅ Animation visuelle active
- ✅ Arrêt possible à tout moment
- ✅ Envoi automatique après arrêt
- ✅ Formats audio supportés
- ✅ Durée max respectée (2 min)
- ✅ Feedback visuel d'envoi

**US-002 : Génération automatique**

- ✅ Transcription précision > 90%
- ✅ Extraction complète des tâches
- ✅ Planning généré avec horaires
- ✅ Affichage timeline clair
- ✅ Temps traitement < 7 secondes
- ✅ Gestion erreurs claire

**US-003 : Visualisation tâches**

- ✅ Liste claire et organisée
- ✅ Informations complètes affichées
- ✅ Tri par horaire
- ✅ Différenciation visuelle
- ✅ Section tâches complétées
- ✅ Mise à jour temps réel

**US-004 : Gestion tâches**

- ✅ Validation par swipe/checkbox
- ✅ Modification complète
- ✅ Report à autre jour
- ✅ Suppression par swipe
- ✅ Sauvegarde immédiate
- ✅ Feedback visuel

**US-005 : Calendrier mensuel**

- ✅ Affichage mois en cours
- ✅ Indicateurs visuels par jour
- ✅ Couleurs selon priorité
- ✅ Navigation mois
- ✅ Panneau tâches jour
- ✅ Responsive mobile

**US-006 : Rappels**

- ✅ Notifications 15 min avant
- ✅ Activation/désactivation
- ✅ Informations complètes
- ✅ Programmation automatique
- ✅ Fonctionnement app fermée

**US-007 : Authentification**

- ✅ Format numéro flexible
- ✅ OTP généré localement
- ✅ Validation OTP
- ✅ PIN 4 chiffres
- ✅ PIN crypté
- ✅ Login numéro + PIN
- ✅ Réinitialisation PIN

**US-008 : Chat Assistant IA** ✅ IMPLÉMENTÉ

- ✅ Messages texte et vocaux fonctionnels
- ✅ Détection automatique des demandes de planning
- ✅ Extraction des tâches et routines depuis les réponses IA
- ✅ Affichage preview des tâches/routines proposées
- ✅ Boutons "Accepter" / "Rejeter" pour validation
- ✅ Création des tâches/routines après validation uniquement
- ✅ Historique de conversation conservé
- ✅ Préférences utilisateur prises en compte
- ✅ Interface moderne et épurée
- ✅ Chat accessible depuis le bouton principal de la home page
- ✅ Affichage durée messages vocaux
- ✅ Demande confirmation IA avant extraction

### Performance Targets

**Métriques Frontend :**

- First Contentful Paint : < 1.5s
- Time to Interactive : < 3s
- Largest Contentful Paint : < 2.5s
- Cumulative Layout Shift : < 0.1

**Métriques Backend :**

- Temps réponse API : < 200ms (p95)
- Temps transcription : < 5s
- Temps extraction IA : < 2s
- Temps génération planning : < 2s
- Uptime : > 99.5%

**Métriques Base de Données :**

- Temps requête simple : < 50ms
- Temps requête complexe : < 200ms
- Taille base données : Optimisée avec index

### Qualité du Code

**Standards :**

- Coverage tests : > 80%
- Linting : 0 erreurs ESLint
- Formatage : Prettier automatique
- Documentation : JSDoc pour fonctions complexes
- Types : TypeScript strict mode

---

## 1️⃣7️⃣ Métriques et Analytics

### Événements à Tracker

**Authentification :**

- `auth_register_started`
- `auth_register_completed`
- `auth_login_started`
- `auth_login_completed`
- `auth_login_failed`
- `auth_pin_reset`

**Audio :**

- `audio_record_started`
- `audio_record_stopped`
- `audio_record_duration` (durée)
- `audio_upload_started`
- `audio_upload_completed`
- `audio_upload_failed`

**IA :**

- `ai_transcription_started`
- `ai_transcription_completed`
- `ai_transcription_duration` (durée)
- `ai_extraction_started`
- `ai_extraction_completed`
- `ai_extraction_tasks_count` (nombre)
- `ai_planning_generation_started`
- `ai_planning_generation_completed`
- `ai_planning_generation_duration` (durée)

**Tâches :**

- `task_viewed`
- `task_completed`
- `task_modified`
- `task_postponed`
- `task_deleted`
- `task_created_manual`

**Planning :**

- `planning_generated`
- `planning_validated`
- `planning_rejected`
- `planning_modified`

**Navigation :**

- `screen_viewed` (nom écran)
- `calendar_day_selected`
- `calendar_month_changed`

### Funnels de Conversion

**Funnel Onboarding :**

1. Arrivée écran phone → 100%
2. Saisie numéro → 90%
3. Validation OTP → 85%
4. Création PIN → 80%
5. Compte créé → 75%

**Funnel Premier Planning :**

1. Clic "Enregistrer" → 100%
2. Enregistrement vocal → 90%
3. Transcription réussie → 85%
4. Extraction réussie → 80%
5. Planning généré → 75%
6. Planning validé → 70%

**Funnel Engagement :**

1. Ouverture app → 100%
2. Consultation tâches → 60%
3. Action sur tâche → 40%
4. Création nouveau planning → 20%

### Métriques de Performance

**Temps de traitement :**

- Temps moyen transcription : < 5s
- Temps moyen extraction : < 2s
- Temps moyen génération : < 2s
- Temps total pipeline : < 7s (objectif)

**Taux de succès :**

- Taux transcription : > 95%
- Taux extraction : > 90%
- Taux génération : > 95%
- Taux validation planning : > 70%

**Engagement :**

- Sessions par utilisateur : Par jour/semaine
- Durée session moyenne : En minutes
- Actions par session : Nombre moyen
- Retour utilisateur : Taux J1, J7, J30

### Logs et Monitoring

**Logs Backend :**

- Niveau : INFO, WARN, ERROR
- Format : JSON structuré
- Champs : timestamp, level, message, context, userId
- Rotation : Quotidienne, conservation 30 jours

**Monitoring :**

- Health checks : `/health` endpoint
- Métriques Prometheus : Temps réponse, erreurs, etc.
- Alertes : Erreurs > 5%, temps réponse > 1s

**Analytics :**

- Outil : Google Analytics ou équivalent
- Événements : Tous les événements listés ci-dessus
- Dashboard : Vue temps réel + rapports hebdomadaires

---

## 1️⃣8️⃣ Déploiement et Infrastructure

### Environnements

**Development :**

- Base de données : PostgreSQL local (Docker)
- Backend : localhost:3000
- Frontend : localhost:3001
- Variables : `.env.local`

**Staging :**

- Base de données : PostgreSQL cloud (ex: Supabase)
- Backend : staging-api.samaplanner.com
- Frontend : staging.samaplanner.com
- Variables : `.env.staging`

**Production :**

- Base de données : PostgreSQL cloud (ex: Supabase, AWS RDS)
- Backend : api.samaplanner.com
- Frontend : samaplanner.com
- Variables : `.env.production`
- SSL : Certificat Let's Encrypt

### Variables d'Environnement

**Backend (.env) :**

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/samaplanner"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-..."

# Server
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN="https://samaplanner.com"

# File Storage
STORAGE_PATH="./uploads"
MAX_FILE_SIZE=10485760  # 10MB
```

**Frontend (.env) :**

```
# API
API_BASE_URL="https://api.samaplanner.com"

# App
APP_NAME="SamaPlanner"
APP_VERSION="1.0.0"
```

### CI/CD Pipeline

**GitHub Actions Workflow :**

**On Push to main :**

1. Lint & Format check
2. Tests unitaires (frontend + backend)
3. Build frontend
4. Build backend
5. Docker build images
6. Deploy to staging
7. Run E2E tests
8. Si succès → Deploy to production

**On Pull Request :**

1. Lint & Format check
2. Tests unitaires
3. Build check
4. Review required

### Docker Configuration

**Backend Dockerfile :**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Frontend Dockerfile :**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose (dev) :**

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: samaplanner
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/samaplanner
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3001:80"
    depends_on:
      - backend
```

### Scaling et Performance

**Backend :**

- Horizontal scaling : Load balancer + multiples instances
- Caching : Redis pour sessions et données fréquentes
- Rate limiting : 100 req/min par IP
- Queue : BullMQ pour traitement asynchrone (futur)

**Base de données :**

- Index optimisés : Sur colonnes fréquemment requêtées
- Connection pooling : Max 20 connexions
- Backup : Quotidien automatique
- Réplication : Read replicas (futur)

**Frontend :**

- CDN : Cloudflare ou équivalent
- Caching : Cache statique 1 an
- Compression : Gzip/Brotli
- Images : Optimisation et lazy loading

### Sécurité

**Mesures :**

- HTTPS : Obligatoire en production
- CORS : Configuration stricte
- Rate limiting : Protection contre abus
- Input validation : Validation stricte côté serveur
- SQL injection : Protection Prisma
- XSS : Sanitization des inputs
- CSRF : Tokens CSRF (si nécessaire)
- Secrets : Variables d'environnement uniquement
- Logs : Pas de données sensibles dans logs

---

## 1️⃣9️⃣ Contraintes & Exigences (Enrichi)

### Contraintes Techniques

**Performance :**

- Temps réponse API : < 200ms (p95)
- Temps pipeline vocal → planning : < 7 secondes
- Taille fichier audio max : 10MB
- Durée audio max : 2 minutes
- Taille base données : Optimisée avec index

**Compatibilité :**

- Navigateurs : Chrome, Firefox, Safari (dernières 2 versions)
- Mobile : iOS 14+, Android 8+
- Résolution : 320px minimum (mobile first)

**Limites :**

- Tâches par planning : Max 20
- Plannings par utilisateur : Illimité
- Taille transcription : Max 5000 caractères
- Requêtes API : 100/min par utilisateur

### Exigences UX (Enrichies)

**Performance perçue :**

- Feedback immédiat : < 100ms pour actions utilisateur
- Skeleton loaders : Pendant chargement
- Optimistic updates : Mise à jour immédiate UI
- Progressive loading : Chargement progressif données

**Accessibilité :**

- Navigation clavier : Complète
- Screen readers : Compatible
- Contraste : WCAG AA minimum
- Taille texte : Minimum 14px

**Offline :**

- Cache données : LocalStorage pour données récentes
- Queue actions : Stockage actions hors ligne
- Synchronisation : Auto-sync quand connexion rétablie

---

## 2️⃣0️⃣ KPIs (Enrichis)

### KPIs MVP (Détaillés)

**Acquisition :**

- Taux complétion premier planning : > 70%
- Temps onboarding : < 2 minutes
- Taux abandon onboarding : < 25%

**Engagement :**

- Taux usage quotidien : > 40% utilisateurs actifs
- Plannings créés par semaine : 5 en moyenne
- Tâches validées par jour : 3-5 en moyenne
- Taux validation planning : > 60%

**Performance :**

- Temps moyen vocal → planning : < 7s (objectif), < 10s (acceptable)
- Taux succès transcription : > 95%
- Taux succès extraction : > 90%
- Taux erreurs API : < 1%

**Rétention :**

- Taux rétention J1 : > 60%
- Taux rétention J7 : > 40%
- Taux rétention J30 : > 25%
- Taux retour utilisateurs : > 30%

### KPIs Long Terme

**Engagement :**

- Maintien hebdomadaire : > 50% utilisateurs actifs
- Engagement routines : > 30% utilisent habitudes
- Taux retour après 30 jours : > 25%
- Temps utilisation moyen : 5-10 min/jour

**Satisfaction :**

- Score NPS : > 40
- Taux recommandation : > 60%
- Taux satisfaction : > 4/5
- Taux support : < 5% utilisateurs

**Business :**

- Utilisateurs actifs : 1000 dans 3 mois
- Croissance mensuelle : > 20%
- Taux conversion : > 70% (essai → usage régulier)

---

## 2️⃣1️⃣ Roadmap Détaillée

### Phase 1 – MVP (4 à 6 semaines)

**Semaine 1-2 : Setup & Auth**

- Configuration projets (frontend + backend)
- Setup base de données Prisma
- Implémentation authentification complète
- Tests authentification

**Semaine 2-3 : Audio & Transcription**

- Composant enregistrement audio
- Upload fichiers backend
- Intégration Whisper API
- Interface transcription

**Semaine 3-4 : IA & Planning**

- Intégration GPT-4 API
- Extraction tâches
- Génération planning
- Interface planning

**Semaine 4-5 : Tâches & Calendrier**

- CRUD tâches complet
- Interface task list
- Calendrier mensuel
- Gestion tâches

**Semaine 5-6 : Chat Assistant & Rappels**

- ✅ Chat multimodal (texte + vocal) - **IMPLÉMENTÉ**
- ✅ Extraction tâches/routines depuis chat - **IMPLÉMENTÉ**
- ✅ Validation planning dans chat - **IMPLÉMENTÉ**
- ✅ Intégration préférences utilisateur - **IMPLÉMENTÉ**
- Système notifications
- Rappels automatiques
- Tests E2E
- Optimisations performance
- Déploiement staging

**Semaine 6 : Tests & Lancement**

- Tests utilisateurs
- Corrections bugs
- Déploiement production
- Monitoring setup

### Phase 2 – Améliorations (Semaines 7-12)

**Semaine 7-8 : Améliorations Chat & Expérience**

- ✅ Chat comme action principale - **IMPLÉMENTÉ**
- Améliorations UI/UX chat
- Commandes vocales avancées
- Suggestions contextuelles intelligentes

**Semaine 9-10 : Mode Habitudes**

- Modèle Habit en base
- Suivi fréquences
- Rappels habitudes
- Courbes progression

**Semaine 11-12 : Statistiques**

- Calcul métriques
- Graphiques productivité
- Insights IA
- Dashboard stats

**Semaine 13-14 : Mode sombre & Synchro**

- Thème sombre automatique
- Synchronisation multi-device
- JWT refresh tokens
- Device sessions

### Phase 3 – Intelligence avancée (Semaines 15-20)

**Semaine 15-16 : Optimisation automatique**

- Apprentissage préférences utilisateur
- Ajustement automatique planning
- Recommandations IA

**Semaine 17-18 : Analyse longue durée**

- Détection habitudes
- Identification zones fatigue
- Pics productivité
- Conseils personnalisés

**Semaine 19-20 : Planification hebdomadaire**

- Analyse semaine passée
- Génération planning semaine
- Notification automatique dimanche

### Phase 4 – Collaboration (Semaines 21-24)

**Semaine 21-22 : Partage planning**

- Modèle Partage en base
- Invitations utilisateurs
- Vue planning partagé
- Permissions

**Semaine 23-24 : Version web**

- Adaptation frontend desktop
- Optimisations web
- Responsive desktop
- Features web spécifiques

---

**Fin du Document PRD – Version 1.0**
