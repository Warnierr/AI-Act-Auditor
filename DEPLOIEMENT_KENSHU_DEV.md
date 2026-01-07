# 🚀 Guide de Déploiement sur kenshu.dev

## 📋 Architecture Proposée

```
kenshu.dev (Frontend - Next.js sur Vercel)
    ↓
api.kenshu.dev (Backend - FastAPI sur Railway/Render)
```

## 🔧 Configuration Requise

### 1. Variables d'Environnement Frontend (Vercel)

Allez dans **Vercel Dashboard > Settings > Environment Variables** et ajoutez :

```env
NEXT_PUBLIC_API_URL=https://api.kenshu.dev
NEXT_PUBLIC_SITE_URL=https://kenshu.dev
```

### 2. Variables d'Environnement Backend (Railway/Render)

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENROUTER_API_KEY=sk-or-xxxxx
ALLOWED_ORIGINS=https://kenshu.dev,https://www.kenshu.dev
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
```

## 📦 Étape 1 : Déploiement Backend (Railway)

### Option A : Railway (Recommandé)

1. **Créer un compte sur Railway.app**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialiser le projet**
   ```bash
   cd backend
   railway init
   ```

3. **Configurer les variables d'environnement**
   - Allez sur le dashboard Railway
   - Variables > Add Variables
   - Copiez toutes les variables ci-dessus

4. **Déployer**
   ```bash
   railway up
   ```

5. **Configurer le domaine personnalisé**
   - Settings > Networking > Custom Domain
   - Ajoutez : `api.kenshu.dev`
   - Créez un CNAME chez votre registrar DNS :
     ```
     api.kenshu.dev → [railway-url].railway.app
     ```

### Option B : Render.com

1. **Créer un nouveau Web Service**
   - Repository : Votre repo GitHub
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Variables d'environnement**
   - Ajoutez toutes les variables listées ci-dessus

3. **Domaine personnalisé**
   - Settings > Custom Domain > `api.kenshu.dev`

## 🌐 Étape 2 : Déploiement Frontend (Vercel)

### Configuration Vercel

1. **Importer le projet**
   ```bash
   cd frontend
   vercel
   ```

2. **Ou via Dashboard Vercel**
   - New Project
   - Import Git Repository
   - Framework Preset : **Next.js**
   - Root Directory : `frontend`

3. **Variables d'environnement**
   ```env
   NEXT_PUBLIC_API_URL=https://api.kenshu.dev
   NEXT_PUBLIC_SITE_URL=https://kenshu.dev
   ```

4. **Domaine personnalisé**
   - Settings > Domains
   - Ajoutez : `kenshu.dev` et `www.kenshu.dev`
   - Vercel vous donnera les DNS à configurer :
     ```
     A Record: kenshu.dev → 76.76.21.21
     CNAME: www.kenshu.dev → cname.vercel-dns.com
     ```

## 🔐 Étape 3 : Configuration DNS chez votre Registrar

Chez votre registrar de domaine (Cloudflare, Namecheap, etc.) :

```dns
# Frontend
A       @           76.76.21.21
CNAME   www         cname.vercel-dns.com

# Backend API
CNAME   api         [your-railway-project].railway.app
```

**Note** : Les adresses IP Vercel peuvent varier. Vérifiez dans votre dashboard Vercel.

## 📝 Étape 4 : Créer les fichiers de variables d'environnement locaux

### Frontend : `.env.local`

Créez `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Frontend : `.env.production`

Créez `frontend/.env.production` :
```env
NEXT_PUBLIC_API_URL=https://api.kenshu.dev
NEXT_PUBLIC_SITE_URL=https://kenshu.dev
```

### Backend : `.env`

Créez `backend/.env` :
```env
ANTHROPIC_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:3000,https://kenshu.dev,https://www.kenshu.dev
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
```

**⚠️ IMPORTANT** : Ne commitez jamais les fichiers `.env` ! Ils sont déjà dans `.gitignore`.

## 🧪 Étape 5 : Test de la Configuration

### Test Local

1. **Backend**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   Visitez : http://localhost:8000/docs

2. **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Visitez : http://localhost:3000

### Test Production

1. **API Health Check**
   ```bash
   curl https://api.kenshu.dev/api/v1/chat/health
   ```

2. **Frontend**
   Visitez : https://kenshu.dev

## 🔒 Sécurité & Performance

### Headers de Sécurité (Vercel)

Créez `frontend/vercel.json` :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### CORS Backend (FastAPI)

Vérifiez dans `backend/main.py` :
```python
from fastapi.middleware.cors import CORSMiddleware

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Monitoring

### Vercel Analytics
- Activez dans Settings > Analytics
- Gratuit pour les projets hobby

### Railway Logs
```bash
railway logs
```

### Uptime Monitoring
- UptimeRobot (gratuit)
- Configurez des checks sur :
  - https://kenshu.dev
  - https://api.kenshu.dev/health

## 💰 Coûts Estimés

| Service | Plan | Coût |
|---------|------|------|
| Vercel (Frontend) | Hobby | **Gratuit** |
| Railway (Backend) | Starter | **5$/mois** |
| Cloudflare (DNS) | Free | **Gratuit** |
| **Total** | | **5$/mois** |

## 🐛 Troubleshooting

### Erreur CORS
```
Access to fetch at 'https://api.kenshu.dev' has been blocked by CORS
```
**Solution** : Vérifiez `ALLOWED_ORIGINS` dans les variables d'environnement backend.

### 404 sur API
**Solution** : Vérifiez que le DNS CNAME pointe bien vers Railway/Render.

### Build Failed sur Vercel
**Solution** : 
```bash
cd frontend
npm run build
```
Corrigez les erreurs TypeScript localement avant de déployer.

## 📞 Support

- **Vercel Docs** : https://vercel.com/docs
- **Railway Docs** : https://docs.railway.app
- **Next.js Deployment** : https://nextjs.org/docs/deployment

## ✅ Checklist Finale

- [ ] Backend déployé sur Railway/Render
- [ ] Variables d'environnement backend configurées
- [ ] Domaine `api.kenshu.dev` configuré
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement frontend configurées
- [ ] Domaine `kenshu.dev` configuré
- [ ] DNS configurés chez le registrar
- [ ] Test health check API : ✅
- [ ] Test page d'accueil : ✅
- [ ] Test audit complet : ✅
- [ ] Test chat advisor : ✅
- [ ] Monitoring activé

---

**Version** : 1.0  
**Dernière mise à jour** : 2025-01-06
