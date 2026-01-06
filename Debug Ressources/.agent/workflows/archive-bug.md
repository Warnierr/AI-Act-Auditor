---
description: Archiver un nouveau bug rencontré
---

Ce workflow permet de créer rapidement un nouveau rapport de bug structuré dans l'archive.

1. Exécutez le script d'archivage :
// turbo
```powershell
.\archive_bug.ps1 -Name "nom-du-bug"
```

2. Ouvrez le fichier généré dans `archive/YYYY/MM-Month/YYYY-MM-DD_nom-du-bug.md`.
3. Remplissez les informations sur le bug, l'environnement et la résolution.
4. (Optionnel) Mettez à jour le fichier `summary.md` pour garder un index propre.
