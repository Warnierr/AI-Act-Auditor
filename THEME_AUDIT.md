# Audit des Thèmes et UI/UX - AI Act Auditor

## État des lieux
L'audit a révélé que certaines parties de l'application utilisaient des couleurs "en dur" (hardcoded), ce qui empêchait les thèmes (Dark Blue, Dark Purple, Minimal) de s'appliquer correctement et causait des problèmes de lisibilité (texte blanc sur fond blanc).

## Actions Correctives Effectuées

### 1. Correction des Contrastes (White-on-White)
**Problème :** Sur les pages d'audit (`/assess`) et de résultats (`/results`), le texte était illisible car les composants `Input` et `Textarea` héritaient de la couleur de texte blanche du thème sombre par défaut, alors que le fond de ces pages était forcé à blanc (`bg-slate-50`).
**Correction :** 
- Forçage des couleurs `text-slate-900` et `bg-white` sur tous les champs de saisie.
- Ajout de classes de couleur explicites sur les titres et labels des cartes.

### 2. Refactorisation du Dashboard Admin
**Problème :** Le tableau de bord administrateur utilisait exclusivement des classes `bg-slate-50`, `bg-white` et `text-slate-900`, le rendant incompatible avec les thèmes sombres.
**Correction :** 
- Remplacement par les variables sémantiques :
    - `bg-slate-50` -> `bg-background`
    - `bg-white` -> `bg-card`
    - `text-slate-900` -> `text-foreground`
    - `text-slate-500` -> `text-muted-foreground`
- Le dashboard respecte désormais le thème global choisi par l'utilisateur.

### 3. Vérification de `AssessmentWizard`
Les pages "Document" (`/assess` et `/results`) conservent volontairement un style clair (type papier/officiel) pour la lisibilité et l'impression, mais les champs de saisie ont été blindés pour être toujours lisibles quel que soit le thème global.

## Bonnes Pratiques pour le Futur

Lors de l'ajout de nouvelles pages ou composants, suivez ces règles pour garantir la flexibilité des thèmes :

1. **Utilisez les variables sémantiques** :
   - Fond de page : `bg-background` (pas `bg-white` ou `bg-slate-50`)
   - Fond de carte : `bg-card`
   - Texte principal : `text-foreground` (pas `text-black` ou `text-slate-900`)
   - Texte secondaire : `text-muted-foreground` (pas `text-gray-500`)
   - Bordures : `border-border`

2. **Évitez les couleurs hardcoded** :
   - ❌ `text-blue-600`
   - ✅ `text-primary` (s'adapte au thème : indigo, violet, noir...)

3. **Pour les zones "Imprimables" (Style Papier)** :
   Si vous devez forcer un style clair (comme pour `/results`), vous devez **aussi** forcer la couleur du texte :
   - ✅ `bg-white text-slate-900`
   - ❌ `bg-white text-foreground` (car `text-foreground` peut être blanc en mode sombre)

## Thèmes Disponibles
Les variables sont définies dans `globals.css` pour :
- **Clair** (Défaut) : Bleu/Ardoise
- **Dark Blue** : Thème sombre professionnel
- **Dark Purple** : Thème sombre créatif ("Cyberpunk")
- **Minimal** : Monochrome fort contraste

---
*Audit réalisé le 2026-01-05*
