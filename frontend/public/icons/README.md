# Icônes PWA

Les icônes suivantes sont nécessaires pour le PWA :

- `icon-192x192.png` - Icône 192x192 pixels (pour Android)
- `icon-512x512.png` - Icône 512x512 pixels (pour Android et splash screen)

## Génération des icônes

Vous pouvez générer les icônes à partir d'un logo source en utilisant :

1. **Outils en ligne** :
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

2. **Commande ImageMagick** :
   ```bash
   convert logo.png -resize 192x192 icon-192x192.png
   convert logo.png -resize 512x512 icon-512x512.png
   ```

3. **Design recommandé** :
   - Fond : #6C3EF1 (violet primaire)
   - Icône : Logo SamaPlanner centré
   - Format : PNG avec transparence
   - Style : Rounded corners (pour maskable)

## Splash Screen

Le splash screen est généré automatiquement à partir de l'icône 512x512 et des métadonnées dans `manifest.json`.

Pour iOS, ajoutez également dans `nuxt.config.ts` :
```html
<link rel="apple-touch-startup-image" href="/splash/ios-splash.png">
```

