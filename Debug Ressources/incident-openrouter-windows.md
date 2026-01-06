# Rapport d'Incident : Configuration OpenRouter sur Windows

## 1. Symptôme
L'assistant IA renvoyait une erreur 500 avec le message "Service IA non configuré" ou "Erreur serveur", même si la clé était présente dans le fichier .env.

## 2. Cause Racine (Bug du %)
Sur Windows, si une variable d'environnement n'est pas correctement résolue par le système au démarrage de Next.js, elle peut être transmise sous sa forme littérale délimitée par des pourcents : %OPENROUTER_API_KEY%.
Cela se produit souvent quand :
- Le terminal n'a pas été redémarré après une modification du .env.
- Il y a des guillemets ou des espaces mal placés dans le .env sous Windows.

## 3. Solution & Protections
### Protection logicielle ajoutée
Dans src/app/api/ai/chat/route.ts, une vérification explicite du caractère % a été ajoutée pour éviter les appels API invalides :
if (!apiKey || apiKey.includes("%")) {
  console.error("[Chat API] ERROR: OPENROUTER_API_KEY is missing or invalid (contains %)");
  return NextResponse.json({ 
    error: 'Service IA non configuré. Veuillez vérifier la clé API dans .env.' 
  }, { status: 500 });
}

### Configuration correcte (.env)
Afin d'assurer la compatibilité avec tous les clients, il est nécessaire de définir :
- OPENROUTER_API_KEY : La clé commençant par sk-or-v1-.
- OPENROUTER_BASE_URL : https://openrouter.ai/api/v1

## Checklist de résolution
1. Nettoyer le .env : Pas d'espaces avant/après le =.
2. Redémarrage complet : Fermer le terminal et relancer npm run dev.
3. Vérifier les logs : Chercher [Chat API] ERROR dans le terminal.
