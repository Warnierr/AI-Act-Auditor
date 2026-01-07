# ✅ Checklist de Déploiement kenshu.dev

## 📋 Avant de Commencer

- [ ] Compte Railway ou Render créé
- [ ] Compte Vercel créé
- [ ] Domaine kenshu.dev acheté
- [ ] Accès au DNS du domaine
- [ ] Clés API prêtes :
  - [ ] ANTHROPIC_API_KEY
  - [ ] OPENROUTER_API_KEY (optionnel)

## 🔧 Configuration Backend

### Variables d'Environnement
- [ ] `ANTHROPIC_API_KEY` configurée
- [ ] `OPENROUTER_API_KEY` configurée (si utilisé)
- [ ] `ALLOWED_ORIGINS` = `https://kenshu.dev,https://www.kenshu.dev`
- [ ] `PORT` = `8000`
- [ ] `HOST` = `0.0.0.0`
- [ ] `ENVIRONMENT` = `production`

### Déploiement
- [ ] Code backend poussé sur Railway/Render
- [ ] Build réussi
- [ ] Service démarré
- [ ] Health check OK : `curl https://api.kenshu.dev/`

### Domaine
- [ ] Domaine personnalisé `api.kenshu.dev` ajouté
- [ ] CNAME configuré chez le registrar DNS
- [ ] SSL/HTTPS activé automatiquement
- [ ] Test : `curl https://api.kenshu.dev/api/v1/chat/health`

## 🌐 Configuration Frontend

### Variables d'Environnement Vercel
- [ ] `NEXT_PUBLIC_API_URL` = `https://api.kenshu.dev`
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://kenshu.dev`

### Déploiement
- [ ] Code frontend poussé sur Vercel (ou GitHub connecté)
- [ ] Build réussi
- [ ] Preview deployment OK
- [ ] Production deployment OK

### Domaine
- [ ] Domaine `kenshu.dev` ajouté
- [ ] Domaine `www.kenshu.dev` ajouté (redirection)
- [ ] DNS A Record configuré : `@ → IP Vercel`
- [ ] DNS CNAME configuré : `www → cname.vercel-dns.com`
- [ ] SSL/HTTPS activé automatiquement
- [ ] Test : Visitez https://kenshu.dev

## 🧪 Tests de Validation

### Backend API
- [ ] Health check : `GET https://api.kenshu.dev/`
- [ ] Chat health : `GET https://api.kenshu.dev/api/v1/chat/health`
- [ ] Assess endpoint : `POST https://api.kenshu.dev/api/v1/assess`
- [ ] Export PDF : `POST https://api.kenshu.dev/api/v1/export/pdf`

### Frontend
- [ ] Page d'accueil charge : https://kenshu.dev
- [ ] Sélecteur de thème fonctionne
- [ ] Sélecteur de langue fonctionne (FR/EN)
- [ ] Bouton "Open Source" redirige vers GitHub
- [ ] Navigation vers /assess fonctionne

### Workflow Complet
- [ ] Créer un nouvel audit sur /assess
- [ ] Remplir le formulaire (3 étapes)
- [ ] Soumettre l'audit
- [ ] Page de résultats s'affiche
- [ ] Télécharger le PDF fonctionne
- [ ] Chat advisor répond aux questions
- [ ] Sources des articles affichées

### Responsive & Thèmes
- [ ] Mobile (< 640px) : Layout correct
- [ ] Tablet (640-1024px) : Layout correct
- [ ] Desktop (> 1024px) : Layout correct
- [ ] Thème Dark Purple : Couleurs OK
- [ ] Thème Dark Blue : Couleurs OK
- [ ] Thème Light : Couleurs OK
- [ ] Thème Minimal : Couleurs OK

## 🔒 Sécurité

- [ ] HTTPS activé sur frontend et backend
- [ ] CORS configuré correctement
- [ ] Headers de sécurité en place (vercel.json)
- [ ] Clés API non exposées dans le code
- [ ] .env dans .gitignore
- [ ] Variables sensibles uniquement en production

## 📊 Monitoring

- [ ] Vercel Analytics activé
- [ ] Railway/Render logs accessibles
- [ ] Uptime monitoring configuré (optionnel)
- [ ] Alertes configurées (optionnel)

## 🐛 Troubleshooting

### Si le backend ne répond pas
1. Vérifier les logs Railway : `railway logs`
2. Vérifier les variables d'environnement
3. Vérifier que le port est bien $PORT
4. Tester le health check

### Si CORS bloque les requêtes
1. Vérifier `ALLOWED_ORIGINS` dans backend
2. Vérifier que l'URL frontend est exacte (avec/sans www)
3. Vérifier les headers CORS dans les logs

### Si le build Vercel échoue
1. Tester le build localement : `npm run build`
2. Vérifier les erreurs TypeScript
3. Vérifier que les variables d'environnement sont définies

## 📝 Post-Déploiement

- [ ] Tester depuis différents navigateurs
- [ ] Tester depuis mobile réel
- [ ] Partager le lien avec des testeurs
- [ ] Documenter les URLs :
  - Frontend : https://kenshu.dev
  - API : https://api.kenshu.dev
  - Docs API : https://api.kenshu.dev/docs
- [ ] Mettre à jour le README avec les URLs de production

## 🎉 Félicitations !

Si tous les points sont cochés, votre application est en production sur kenshu.dev ! 🚀

---

**Date de déploiement** : ___________  
**Version** : 1.0  
**Déployé par** : ___________
