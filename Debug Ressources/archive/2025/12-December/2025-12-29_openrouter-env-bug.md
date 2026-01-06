# Bug : Variables d'environnement OpenRouter sur Windows (%)

## Description
L'application ne parvient pas à se connecter à OpenRouter et renvoie un message "Service IA non configuré" ou une erreur 500, même si la clé OPENROUTER_API_KEY est présente dans le fichier .env.

## Cause technique
Sur Windows, le caractère % est utilisé pour délimiter les variables d'environnement. Si une variable n'est pas trouvée ou mal chargée par le système, Windows peut renvoyer la chaîne littérale %OPENROUTER_API_KEY% au lieu de sa valeur réelle (sk-or-v1-...). 

Next.js (ou le loader d'environnement) récupère alors cette chaîne brute contenant des pourcents, ce qui rend la clé invalide pour l'authentification auprès de l'API OpenRouter.

## Solution / Protection
Une vérification a été intégrée dans la route API (src/app/api/chat/route.ts) pour détecter la présence de % dans la clé :

`	ypescript
if (!apiKey || apiKey.includes("%")) {
  console.error("[Chat API] ERROR: OPENROUTER_API_KEY is missing or invalid!");
  return new Response("Erreur de configuration : clé API manquante.", { status: 500 });
}
`

## Étapes de résolution
1. **Redémarrer le terminal** : Windows doit souvent recharger les variables d'environnement. Un simple redémarrage du serveur 
pm run dev ne suffit parfois pas, il faut fermer et rouvrir le terminal/IDE.
2. **Vérifier le fichier .env** : S'assurer que la clé commence bien par sk-or-v1- et qu'il n'y a pas d'espaces ou de guillemets superflus.
3. **Vider le cache Next.js** (si persistance) : m -rf .next.
