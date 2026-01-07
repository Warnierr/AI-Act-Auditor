# 🏗️ Architecture Finale : kenshu.dev

## 📊 Vue d'Ensemble

```
                        CLOUDFLARE DNS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   kenshu.dev          aiact.kenshu.dev     api-aiact.kenshu.dev
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │Portfolio│          │AI Act   │          │FastAPI  │
   │Vercel   │          │Auditor  │          │Backend  │
   │         │          │Next.js  │          │Railway  │
   └─────────┘          └────┬────┘          └─────────┘
                             │
                             │ API Calls
                             │
                             └────────────────►
```

## 🎯 Configuration Cloudflare

### Enregistrements DNS

| Sous-domaine | Type  | Target                  | Proxy | Usage            |
|--------------|-------|-------------------------|-------|------------------|
| @            | A     | [Vercel IP]             | ✅    | Portfolio        |
| www          | CNAME | cname.vercel-dns.com    | ✅    | Portfolio (www)  |
| aiact        | CNAME | cname.vercel-dns.com    | ✅    | AI Act Frontend  |
| api-aiact    | CNAME | [railway].railway.app   | ✅    | AI Act Backend   |

### Avantages du Proxy Cloudflare (nuage orange)

✅ **CDN Global** : Cache et accélération  
✅ **DDoS Protection** : Protection automatique  
✅ **SSL/TLS** : Certificats gratuits  
✅ **Analytics** : Statistiques détaillées  
✅ **Firewall** : Règles de sécurité  

## 🚀 Vercel - Frontend Apps

### Projet 1 : Portfolio
- **Domain** : kenshu.dev, www.kenshu.dev
- **Status** : ✅ Actif
- **Framework** : [Votre framework]

### Projet 2 : AI Act Auditor
- **Domain** : aiact.kenshu.dev
- **Status** : 🟡 À configurer
- **Framework** : Next.js 16
- **Variables** :
  ```env
  NEXT_PUBLIC_API_URL=https://api-aiact.kenshu.dev
  NEXT_PUBLIC_SITE_URL=https://aiact.kenshu.dev
  ```

### Projet 3 : Budget AI (Futur)
- **Domain** : budget.kenshu.dev
- **Status** : ⏳ En attente
- **Backend** : api-budget.kenshu.dev

## 🚂 Railway - Backend APIs

### Projet 1 : AI Act API
- **Domain** : api-aiact.kenshu.dev
- **Status** : 🟡 À configurer
- **Stack** : FastAPI + Python
- **Variables** :
  ```env
  ALLOWED_ORIGINS=https://aiact.kenshu.dev
  ANTHROPIC_API_KEY=***
  PORT=8000
  ```

### Projet 2 : Budget API (Futur)
- **Domain** : api-budget.kenshu.dev
- **Status** : ⏳ En attente

## 📋 Checklist Déploiement AI Act Auditor

### 1. Cloudflare DNS
- [ ] CNAME `aiact` → `cname.vercel-dns.com`
- [ ] CNAME `api-aiact` → `[railway].railway.app`
- [ ] Proxy activé (nuage orange)

### 2. Railway Backend
- [ ] Code déployé
- [ ] Variables d'environnement configurées
- [ ] Custom domain `api-aiact.kenshu.dev` ajouté
- [ ] Health check : ✅ `curl https://api-aiact.kenshu.dev/`

### 3. Vercel Frontend
- [ ] Custom domain `aiact.kenshu.dev` ajouté
- [ ] Variables d'environnement configurées
- [ ] Redéployé avec nouvelles variables
- [ ] Test : ✅ https://aiact.kenshu.dev

### 4. Tests Fonctionnels
- [ ] Page d'accueil charge
- [ ] Formulaire d'audit fonctionne
- [ ] API répond correctement
- [ ] Conseiller IA fonctionne
- [ ] Export PDF fonctionne

## 🎨 Organisation des Apps

```
kenshu.dev/
├── Portfolio (existant)
│   └── kenshu.dev
│
├── AI Act Auditor
│   ├── Frontend: aiact.kenshu.dev
│   └── Backend:  api-aiact.kenshu.dev
│
├── Budget AI
│   ├── Frontend: budget.kenshu.dev
│   └── Backend:  api-budget.kenshu.dev
│
└── [Futures Apps]
    ├── Frontend: [app].kenshu.dev
    └── Backend:  api-[app].kenshu.dev
```

## 🔐 Sécurité

### Cloudflare
- ✅ SSL/TLS : Full (Strict)
- ✅ Always Use HTTPS
- ✅ HSTS Enabled
- ✅ Auto Minify
- ✅ Brotli Compression

### Vercel
- ✅ Headers de sécurité (`vercel.json`)
- ✅ Environment Variables sécurisées
- ✅ HTTPS only
- ✅ Preview deployments

### Railway
- ✅ Variables d'environnement chiffrées
- ✅ HTTPS only
- ✅ Private networking
- ✅ Health checks

## 💰 Coûts Mensuels

| Service     | Plan      | Coût      |
|-------------|-----------|-----------|
| Cloudflare  | Free      | 0€        |
| Vercel      | Hobby     | 0€        |
| Railway     | Developer | ~5€/app   |
| **TOTAL**   |           | **~5€**   |

### Par App
- Portfolio : Gratuit (Vercel only)
- AI Act : ~5€/mois (Railway backend)
- Budget AI : ~5€/mois (Railway backend)

## 📈 Scalabilité

### Ajout d'une Nouvelle App

1. **Cloudflare** (2 min)
   ```
   CNAME [app]     → cname.vercel-dns.com
   CNAME api-[app] → [railway].railway.app
   ```

2. **Railway** (5 min)
   - Déployer le backend
   - Ajouter custom domain
   - Configurer variables

3. **Vercel** (3 min)
   - Importer projet depuis GitHub
   - Ajouter custom domain
   - Configurer variables

**Total** : ~10 minutes par nouvelle app ! 🚀

## 🎯 Bonnes Pratiques

### Nommage
✅ **Frontend** : `[app].kenshu.dev`  
✅ **Backend** : `api-[app].kenshu.dev`  
❌ **Éviter** : `[app]-api.kenshu.dev`, `[app].api.kenshu.dev`

### Variables d'Environnement
✅ **Toujours** utiliser `NEXT_PUBLIC_` pour les vars frontend  
✅ **Jamais** commiter les `.env`  
✅ **Toujours** avoir un `.env.example`

### Déploiement
✅ **Tester** en local avant de déployer  
✅ **Vérifier** les logs après déploiement  
✅ **Monitorer** les performances

## 📚 Guides Disponibles

1. **CONFIGURATION_SOUS_DOMAINES.md** - Guide complet
2. **GUIDE_ETAPES_AIACT.md** - Étapes détaillées
3. **ARCHITECTURE_KENSHU_FINAL.md** - Ce document

## 🎉 Résultat Final

Une fois tout configuré, vous aurez :

```
https://kenshu.dev              → Portfolio
https://aiact.kenshu.dev        → AI Act Auditor
https://api-aiact.kenshu.dev    → AI Act API
https://budget.kenshu.dev       → Budget AI (futur)
https://api-budget.kenshu.dev   → Budget API (futur)
```

✨ **Tout centralisé sous kenshu.dev !** ✨

---

**Version** : 1.0  
**Auteur** : Configuration pour architecture multi-apps  
**Date** : 6 Janvier 2025
