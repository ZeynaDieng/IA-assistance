# Correction de la Navigation et du Design Mobile

## Problème identifié

Le prototype React utilise un **conteneur mobile frame** avec :
- Background gris (`bg-gray-200`) autour
- Frame mobile avec `max-w-[400px]` et `rounded-[40px]` sur desktop
- Status bar mock en haut
- Design centré comme une vraie app mobile

Notre version Nuxt n'avait pas ce conteneur, donc le design ne correspondait pas.

## Solution appliquée

### 1. Création du Layout Default (`layouts/default.vue`)

```vue
<!-- Conteneur externe avec bg-gray-200 -->
<div class="w-full h-screen flex justify-center items-center bg-gray-200">
  <!-- Mobile Frame exact comme le React -->
  <div class="relative w-full max-w-[400px] h-full sm:h-[850px] sm:rounded-[40px] overflow-hidden shadow-2xl">
    <!-- Status Bar Mock -->
    <div class="absolute top-0 w-full h-12 ...">
      <span>9:41</span>
      <!-- Signal bars -->
    </div>
    <!-- Page Content -->
    <NuxtPage />
  </div>
</div>
```

### 2. Mise à jour de `app.vue`

- Ajout de `<NuxtLayout>` pour utiliser le layout default
- Configuration du body pour l'antialiasing

### 3. CSS Global (`assets/css/main.css`)

- Background `#E5E7EB` (bg-gray-200) pour correspondre au React
- `height: 100%` et `overflow: hidden` sur html/body
- Support dark mode

### 4. Ajustements des Pages

Toutes les pages ont été ajustées pour :
- Avoir `pt-20` (padding-top pour le status bar)
- Support du overflow hidden
- Correspondre exactement aux styles du React

## Résultat

Maintenant le design correspond EXACTEMENT au prototype React :
- ✅ Frame mobile avec coins arrondis sur desktop
- ✅ Status bar mock en haut
- ✅ Background gris autour du frame
- ✅ Design centré comme une vraie app mobile
- ✅ Dark mode supporté
- ✅ Navigation fonctionnelle

## Structure de Navigation

```
/ (index.vue)
  ↓ (redirect basé sur auth)
/onboarding
  ↓
/auth/phone
  ↓
/auth/otp
  ↓
/auth/pin
  ↓
/home (dashboard principal)
  ├─ /record (enregistrement vocal)
  ├─ /processing (traitement IA)
  ├─ /transcription (vérification)
  ├─ /planning (review planning)
  ├─ /tasks (liste des tâches)
  │  └─ /tasks/[id] (détail tâche)
  ├─ /calendar (calendrier)
  └─ /profile (profil)
```

## Vérification

Pour vérifier que tout fonctionne :
1. ✅ Le conteneur mobile frame s'affiche
2. ✅ Le status bar mock est visible
3. ✅ Les coins arrondis sur desktop (`sm:rounded-[40px]`)
4. ✅ Le background gris autour
5. ✅ La navigation entre pages fonctionne
6. ✅ Le design correspond au prototype React

---

**Le design est maintenant identique au prototype React !** 🎉

