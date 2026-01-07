# 🚀 Guide Rapide : Déployer sur kenshu.dev

## ⚡ Version Express (15 minutes)

### 1️⃣ Backend sur Railway

1. **Installer Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Se connecter et déployer**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Configurer les variables**
   Dans le dashboard Railway, ajoutez :
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   OPENROUTER_API_KEY=sk-or-xxxxx
   ALLOWED_ORIGINS=https://kenshu.dev,https://www.kenshu.dev
   PORT=8000
   ```

4. **Domaine personnalisé**
   - Settings > Custom Domain > `api.kenshu.dev`
   - Railway vous donne un CNAME, configurez-le chez votre registrar DNS

### 2️⃣ Frontend sur Vercel

1. **Déployer avec Vercel CLI**
   ```bash
   cd frontend
   npm i -g vercel
   vercel
   ```

2. **Ou via GitHub**
   - Push votre code sur GitHub
   - Allez sur vercel.com > New Project
   - Import votre repo
   - Root Directory: `frontend`

3. **Variables d'environnement Vercel**
   Settings > Environment Variables :
   ```
   NEXT_PUBLIC_API_URL=https://api.kenshu.dev
   NEXT_PUBLIC_SITE_URL=https://kenshu.dev
   ```

4. **Domaine personnalisé**
   - Settings > Domains > Add `kenshu.dev`
   - Vercel vous guide pour la configuration DNS

### 3️⃣ Configuration DNS

Chez votre registrar (Cloudflare, Namecheap, etc.) :

```
Type    Name    Value
----    ----    -----
A       @       76.76.21.21 (IP Vercel)
CNAME   www     cname.vercel-dns.com
CNAME   api     [your-project].railway.app
```

### 4️⃣ Variables d'Environnement Locales

**Frontend** : Créez `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend** : Créez `backend/.env`
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENROUTER_API_KEY=sk-or-xxxxx
ALLOWED_ORIGINS=http://localhost:3000,https://kenshu.dev
PORT=8000
```

## ✅ Vérification

1. **Backend API**
   ```bash
   curl https://api.kenshu.dev/
   ```

2. **Frontend**
   Visitez : https://kenshu.dev

## 💰 Coûts

- **Vercel** : Gratuit
- **Railway** : 5$/mois (500h gratuit au début)
- **Total** : 5$/mois

## 📚 Guide Complet

Pour plus de détails, consultez `DEPLOIEMENT_KENSHU_DEV.md`

---

**Temps estimé** : 15-20 minutes  
**Difficulté** : ⭐⭐☆☆☆
