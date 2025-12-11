# Implémentation des Routines - SamaPlanner

## ✅ Ce qui a été fait

### Backend

1. **Modèle de données Prisma** (`backend/prisma/schema.prisma`)
   - Modèle `Routine` avec :
     - `frequency`: DAILY, WEEKLY, WEEKDAYS, WEEKENDS, CUSTOM
     - `time`: Horaire (HH:mm)
     - `daysOfWeek`: Jours de la semaine pour WEEKLY/CUSTOM
     - `duration`: Durée en minutes
     - `priority`: Priorité (LOW, MEDIUM, HIGH, URGENT)
     - `isActive`: Statut actif/inactif

2. **Module Routines** (`backend/src/routines/`)
   - **Service** (`routines.service.ts`) :
     - CRUD complet (create, read, update, delete)
     - `generateTasksFromRoutines()` : Génère des tâches depuis les routines actives pour une date donnée
     - `shouldGenerateForDate()` : Vérifie si une routine doit générer une tâche pour une date
     - `calculateScheduledTime()` : Calcule l'heure programmée
   
   - **Contrôleur** (`routines.controller.ts`) :
     - `GET /api/routines` : Liste des routines
     - `GET /api/routines/:id` : Détails d'une routine
     - `POST /api/routines` : Créer une routine
     - `PATCH /api/routines/:id` : Modifier une routine
     - `DELETE /api/routines/:id` : Supprimer une routine
     - `POST /api/routines/:id/toggle` : Activer/désactiver une routine
     - `POST /api/routines/generate-tasks` : Générer des tâches depuis les routines

3. **Amélioration du service IA** (`backend/src/ai/gpt.service.ts`)
   - Prompt amélioré pour détecter les routines dans le vocal
   - Détection des expressions : "tous les jours", "chaque matin", "tous les lundis", etc.
   - Retourne maintenant `ExtractionResult` avec `tasks` et `routines`
   - Interface `ExtractedRoutine` pour les routines détectées

4. **Mise à jour du contrôleur IA** (`backend/src/ai/ai.controller.ts`)
   - Retourne maintenant `{ tasks, routines }` dans la réponse

### Frontend

1. **Store Planning** (`frontend/stores/planning.ts`)
   - Mise à jour pour gérer les routines détectées
   - Stockage temporaire des routines (à compléter avec sauvegarde backend)

## 🔄 À faire

### Frontend

1. **Store Routines** (`frontend/stores/routines.ts`)
   - Actions pour CRUD des routines
   - Action pour générer des tâches depuis les routines

2. **Page Routines** (`frontend/pages/routines/index.vue`)
   - Liste des routines
   - Formulaire de création/édition
   - Toggle actif/inactif
   - Visualisation des routines actives

3. **Page Transcription** (`frontend/pages/transcription.vue`)
   - Afficher les routines détectées
   - Permettre de créer les routines détectées
   - Bouton pour sauvegarder les routines

4. **Intégration dans le planning**
   - Générer automatiquement des tâches depuis les routines actives lors de la génération de planning
   - Afficher les tâches générées depuis les routines différemment

5. **Page Planning** (`frontend/pages/planning.vue`)
   - Afficher les routines détectées
   - Permettre de créer les routines avant de valider le planning

## 📝 Exemples d'utilisation

### Détection vocale

L'utilisateur dit :
- "Je veux boire de l'eau tous les jours à 8h"
- "Sport tous les matins à 7h"
- "Lecture chaque soir à 21h"
- "Méditation tous les lundis et mercredis"

L'IA détecte automatiquement ces routines et les propose à l'utilisateur.

### Génération automatique de tâches

Quand l'utilisateur génère un planning, les routines actives génèrent automatiquement des tâches pour la date cible.

## 🎯 Prochaines étapes

1. Créer le store routines frontend
2. Créer la page de gestion des routines
3. Intégrer la création de routines dans le flux vocal
4. Ajouter la génération automatique de tâches depuis les routines dans le planning

