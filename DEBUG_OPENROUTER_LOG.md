# Log de Debug - AI Act Auditor

## 🐞 Problème : Service IA non configuré (OpenRouter)
**Date :** 29 Décembre 2025
**Statut :** ✅ Résolu

### Symptômes
- Message "Service IA non configuré" ou "❌ Désolé, je ne peux pas répondre..." dans le chat.
- L'endpoint `/api/v1/chat/health` renvoyait `not_configured` même avec une clé OpenRouter valide (et plantait car il ne vérifiait que la clé Anthropic).

### Causes identifiées
1. **Health Check incomplet** : Le backend (`backend/api/v1/endpoints/chat.py`) vérifiait uniquement `ANTHROPIC_API_KEY` et ignorait les variables OpenRouter dans sa réponse JSON de santé.
2. **Dépendance stricte à la Base URL** : Le code de `backend/core/advisor.py` exigeait la présence simultanée de `OPENROUTER_API_KEY` et `OPENROUTER_BASE_URL`. Sans l'URL, le système basculait sur Anthropic direct.
3. **Confusion des variables** : Le système cherchait à utiliser le SDK Anthropic mais avec un endpoint OpenRouter, ce qui nécessite une configuration spécifique de l'URL de base dans le client.

### Résolution
- **Mise à jour de `backend/core/advisor.py`** : 
    - La fonction `get_anthropic_client()` vérifie maintenant en priorité le duo `OPENROUTER_API_KEY` + `OPENROUTER_BASE_URL`.
    - Si trouvés, elle initialise le client Anthropic avec la `base_url` pointant vers OpenRouter.
- **Correction du `.env`** : Ajout des deux variables nécessaires :
    ```env
    OPENROUTER_API_KEY=sk-or-v1-....
    OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
    ```
- **Amélioration de la logique de secours** : Le système ne lève une erreur `ValueError` que si AUCUNE des deux méthodes (OpenRouter ou Anthropic Direct) n'est configurée.

### Point de vigilance
Sous Windows, les variables d'environnement dans le `.env` ne doivent pas avoir d'espaces avant ou après le `=` (ex: `KEY = VALUE` peut échouer selon le parseur).
