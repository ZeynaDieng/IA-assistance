#!/bin/bash

echo "🔑 Génération des clés pour SamaPlanner"
echo ""

# Générer JWT_SECRET
echo "📝 Génération de JWT_SECRET..."
JWT_SECRET=$(openssl rand -hex 64)
echo "✅ JWT_SECRET généré: $JWT_SECRET"
echo ""

# Mettre à jour .env si il existe
if [ -f .env ]; then
    # Sauvegarder l'ancien JWT_SECRET s'il existe
    OLD_JWT=$(grep "^JWT_SECRET=" .env | cut -d '=' -f2 | tr -d '"')
    
    # Mettre à jour JWT_SECRET
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    else
        # Linux
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    fi
    
    echo "✅ JWT_SECRET mis à jour dans .env"
else
    echo "⚠️  Fichier .env non trouvé. Créez-le d'abord avec: cp ENV_EXAMPLE.txt .env"
    echo ""
    echo "Puis ajoutez cette ligne dans .env :"
    echo "JWT_SECRET=\"$JWT_SECRET\""
fi

echo ""
echo "📋 Prochaines étapes :"
echo "1. Ajoutez votre OPENAI_API_KEY dans .env"
echo "   Obtenez-la sur : https://platform.openai.com/api-keys"
echo ""
echo "2. Redémarrez le backend pour charger les nouvelles clés"
echo "   npm run start:dev"
echo ""

