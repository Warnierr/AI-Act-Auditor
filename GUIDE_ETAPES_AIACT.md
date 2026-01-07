# 🚀 Guide Étape par Étape : AI Act Auditor sur aiact.kenshu.dev

## ⏱️ Temps estimé : 20 minutes

## ✅ Checklist Préparation

- [ ] Compte Cloudflare avec kenshu.dev configuré
- [ ] Compte Vercel avec accès au projet
- [ ] Compte Railway (ou Render)
- [ ] Clés API (Anthropic/OpenRouter)
- [ ] Code poussé sur GitHub

---

## 📋 ÉTAPE 1 : Configuration Cloudflare DNS (5 min)

### 1.1 Frontend
1. Allez sur **Cloudflare Dashboard**
2. Sélectionnez **kenshu.dev**
3. Allez dans **DNS > Records**
4. Cliquez sur **Add record**

   **Enregistrement** :
   ```
   Type:    CNAME
   Name:    aiact
   Target:  cname.vercel-dns.com
   TTL:     Auto
   Proxy:   ✅ Proxied (nuage orange)
   ```

5. Cliquez sur **Save**

### 1.2 Backend
1. Toujours dans **DNS > Records**
2. Cliquez sur **Add record**

   **Enregistrement** :
   ```
   Type:    CNAME
   Name:    api-aiact
   Target:  [À REMPLIR après Railway - étape 3]
   TTL:     Auto
   Proxy:   ✅ Proxied (nuage orange)
   ```

3. **Ne sauvegardez pas encore** - on remplira le Target après Railway

---

## 🚂 ÉTAPE 2 : Déploiement Backend sur Railway (10 min)

### 2.1 Installation Railway CLI
```bash
npm i -g @railway/cli
```

### 2.2 Connexion et Déploiement
```bash
cd backend

# Connexion
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

### 2.3 Configuration des Variables d'Environnement

1. Allez sur **Railway Dashboard** > Votre projet
2. Cliquez sur **Variables**
3. Ajoutez les variables suivantes :

   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   OPENROUTER_API_KEY=sk-or-xxxxx
   ALLOWED_ORIGINS=https://aiact.kenshu.dev
   PORT=8000
   HOST=0.0.0.0
   ENVIRONMENT=production
   ```

4. Cliquez sur **Deploy** pour redémarrer

### 2.4 Domaine Personnalisé Railway

1. Toujours dans Railway Dashboard
2. Allez dans **Settings** > **Networking**
3. Section **Custom Domain**, cliquez sur **Add Custom Domain**
4. Entrez : `api-aiact.kenshu.dev`
5. Railway vous affiche : `[votre-projet].railway.app`

### 2.5 Retour sur Cloudflare

1. **Copiez** le domaine Railway : `[votre-projet].railway.app`
2. Retournez sur **Cloudflare DNS**
3. Complétez l'enregistrement `api-aiact` :
   ```
   Target: [votre-projet].railway.app
   ```
4. **Save**

### 2.6 Test Backend
```bash
# Attendez 2-3 minutes puis testez
curl https://api-aiact.kenshu.dev/

# Devrait retourner :
# {"message":"Welcome to AI Act Auditor API","status":"active"}
```

---

## ☁️ ÉTAPE 3 : Déploiement Frontend sur Vercel (5 min)

### 3.1 Configuration Vercel

#### Option A : Via Dashboard (Recommandé si déjà déployé)

1. Allez sur **Vercel Dashboard**
2. Sélectionnez votre projet **AI Act Auditor**
3. **Settings** > **Domains**
4. Cliquez sur **Add Domain**
5. Entrez : `aiact.kenshu.dev`
6. Cliquez sur **Add**

Vercel va :
- ✅ Vérifier le CNAME Cloudflare
- ✅ Générer un certificat SSL
- ✅ Déployer automatiquement

#### Option B : Via CLI (Si nouveau déploiement)

```bash
cd frontend

# Login Vercel
vercel login

# Déployer
vercel --prod

# Ajouter le domaine
vercel domains add aiact.kenshu.dev
```

### 3.2 Variables d'Environnement Vercel

1. Toujours dans **Settings** > **Environment Variables**
2. Cliquez sur **Add New**

   **Production** :
   ```env
   NEXT_PUBLIC_API_URL=https://api-aiact.kenshu.dev
   NEXT_PUBLIC_SITE_URL=https://aiact.kenshu.dev
   ```

3. **Save**

### 3.3 Redéploiement

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **Redeploy**
4. Sélectionnez **Use existing Build Cache** : ❌ (pour forcer le rebuild)

---

## 🧪 ÉTAPE 4 : Validation Complète (3 min)

### 4.1 Test DNS
```bash
# Frontend
nslookup aiact.kenshu.dev
# Devrait pointer vers Cloudflare/Vercel

# Backend
nslookup api-aiact.kenshu.dev
# Devrait pointer vers Railway
```

### 4.2 Test HTTPS/SSL
```bash
# Frontend
curl -I https://aiact.kenshu.dev
# HTTP/2 200

# Backend
curl -I https://api-aiact.kenshu.dev
# HTTP/2 200
```

### 4.3 Test Fonctionnel

1. **Ouvrez** : https://aiact.kenshu.dev
2. **Vérifiez** :
   - [ ] La page charge correctement
   - [ ] Le sélecteur de thème fonctionne
   - [ ] Navigation vers /assess fonctionne

3. **Créez un audit test** :
   - [ ] Formulaire fonctionne (3 étapes)
   - [ ] Soumission réussie
   - [ ] Page de résultats s'affiche
   - [ ] Conseiller IA répond
   - [ ] Export PDF fonctionne

---

## 📱 ÉTAPE 5 : Tests Responsive

1. **Desktop** : ✅ OK
2. **Mobile** :
   - Ouvrez Chrome DevTools (F12)
   - Toggle Device Toolbar
   - Testez iPhone, iPad
3. **Thèmes** :
   - Testez les 4 thèmes (Dark Purple, Dark Blue, Light, Minimal)

---

## 🎉 Terminé !

Votre application est maintenant live sur :

- **Frontend** : https://aiact.kenshu.dev
- **API** : https://api-aiact.kenshu.dev
- **Docs API** : https://api-aiact.kenshu.dev/docs

---

## 🔄 Pour vos autres applications

Répétez simplement ces étapes en changeant :

### Budget AI
- Frontend : `budget.kenshu.dev`
- Backend : `api-budget.kenshu.dev`

### Template
```
1. Cloudflare DNS : [app].kenshu.dev → vercel
2. Railway : api-[app].kenshu.dev
3. Vercel : Ajouter custom domain
4. Variables : Mettre à jour les URLs
```

---

## 📊 Monitoring

### Vercel
- **Analytics** : Settings > Analytics (Gratuit)
- **Logs** : Deployments > [deployment] > Functions Logs

### Railway
```bash
railway logs
```

### Cloudflare
- **Analytics** : Dashboard > Analytics
- **Cache** : Dashboard > Caching > Configuration

---

## 🐛 Problèmes Courants

### "Site can't be reached"
- Attendez 5-10 min pour propagation DNS
- Vérifiez le CNAME sur Cloudflare

### "Too many redirects"
- Cloudflare SSL : Passez en **Full (Strict)**

### "CORS error"
- Vérifiez `ALLOWED_ORIGINS` sur Railway
- Format exact : `https://aiact.kenshu.dev` (pas de slash final)

---

## 💡 Optimisations Post-Déploiement

### Cloudflare
1. **Page Rules** (3 gratuits)
   - Always Use HTTPS
   - Cache Everything pour `/_next/static/*`

2. **Firewall Rules**
   - Block bad bots
   - Rate limiting

### Vercel
1. **Analytics** : Activez
2. **Speed Insights** : Activez
3. **Security** : Vérifiez les headers

---

**Temps total** : ~20 minutes  
**Coût mensuel** : ~5$ (Railway)  
**Status** : ✅ Production Ready

Félicitations ! 🎊
