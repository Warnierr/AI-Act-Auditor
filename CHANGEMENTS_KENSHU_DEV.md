# 📝 Changements pour l'intégration de kenshu.dev

## 🎯 Objectif
Configurer l'application AI Act Auditor pour fonctionner avec le domaine **kenshu.dev** en production.

## ✅ Modifications Effectuées

### 1. Configuration Frontend

#### Fichiers Modifiés
- ✅ **frontend/src/components/chat/ChatAssistant.tsx**
  - Changé : `http://localhost:8000/api/v1/chat/` → `/api/v1/chat/`
  - Raison : Utiliser le proxy Next.js pour éviter les problèmes CORS

#### Fichiers Créés
- ✅ **frontend/.env.example**
  - Template pour les variables d'environnement
  - Documentation des valeurs dev/prod

- ✅ **frontend/.gitignore**
  - Ignore les fichiers `.env*` (sauf `.env.example`)
  - Protection des clés API

### 2. Configuration Backend

#### Fichiers Modifiés
- ✅ **backend/main.py**
  - CORS dynamique basé sur `ALLOWED_ORIGINS`
  - Support de plusieurs domaines (localhost + production)

#### Fichiers Créés
- ✅ **backend/.gitignore**
  - Ignore `.env` et fichiers sensibles
  - Protection des clés API

### 3. Configuration Déploiement

#### Fichiers Créés
- ✅ **vercel.json**
  - Headers de sécurité (HSTS, X-Frame-Options, etc.)
  - Proxy `/api/*` vers `https://api.kenshu.dev`
  - Configuration optimisée pour Next.js

- ✅ **railway.toml**
  - Configuration Railway pour le backend
  - Build et start commands
  - Health checks

- ✅ **Procfile**
  - Configuration Render/Heroku compatible
  - Commande de démarrage backend

### 4. Documentation

#### Fichiers Créés
- ✅ **DEPLOIEMENT_KENSHU_DEV.md**
  - Guide complet de déploiement (30+ pages)
  - Configuration DNS détaillée
  - Troubleshooting

- ✅ **GUIDE_RAPIDE_DEPLOIEMENT.md**
  - Version express (15 minutes)
  - Commandes essentielles
  - Liens rapides

- ✅ **CHECKLIST_KENSHU_DEV.md**
  - Checklist complète de déploiement
  - Tests de validation
  - Post-déploiement

- ✅ **README.md** (mis à jour)
  - URLs kenshu.dev
  - Badges et liens
  - Architecture mise à jour

- ✅ **CHANGEMENTS_KENSHU_DEV.md** (ce fichier)
  - Résumé des modifications
  - Guide de migration

## 🔧 Variables d'Environnement

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://api.kenshu.dev
NEXT_PUBLIC_SITE_URL=https://kenshu.dev
```

### Backend (Railway/Render)
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENROUTER_API_KEY=sk-or-xxxxx
ALLOWED_ORIGINS=https://kenshu.dev,https://www.kenshu.dev
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=production
```

## 🌐 Architecture de Production

```
┌──────────────────────────────────────┐
│   kenshu.dev (Vercel)                │
│   - Next.js Frontend                 │
│   - Proxy /api/* vers backend        │
│   - SSL/HTTPS automatique            │
└───────────────┬──────────────────────┘
                │
                │ HTTPS
                │
┌───────────────▼──────────────────────┐
│   api.kenshu.dev (Railway)           │
│   - FastAPI Backend                  │
│   - Claude 3.5 Sonnet                │
│   - SSL/HTTPS automatique            │
└──────────────────────────────────────┘
```

## 📋 Prochaines Étapes

### 1. Créer les fichiers .env locaux

**Frontend** : `frontend/.env.local`
```bash
cp frontend/.env.example frontend/.env.local
# Éditer avec vos valeurs locales
```

**Backend** : `backend/.env`
```bash
cp backend/.env.example backend/.env
# Ajouter vos clés API
```

### 2. Tester en local

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visitez : http://localhost:3000

### 3. Déployer sur kenshu.dev

Suivez le guide : [GUIDE_RAPIDE_DEPLOIEMENT.md](GUIDE_RAPIDE_DEPLOIEMENT.md)

## 🔍 Points d'Attention

### CORS
- Le backend accepte maintenant les requêtes de plusieurs origines
- Configuration via `ALLOWED_ORIGINS` (séparées par des virgules)
- Vérifiez que les domaines sont exacts (avec/sans www)

### Proxy Next.js
- Les appels API frontend utilisent `/api/*` (relatif)
- Next.js proxy automatiquement vers le backend
- Configuration dans `vercel.json` et `next.config.ts`

### Sécurité
- Headers de sécurité ajoutés (HSTS, X-Frame-Options, etc.)
- Clés API jamais exposées au frontend
- Variables sensibles dans `.env` (ignoré par git)

### SSL/HTTPS
- Vercel et Railway gèrent SSL automatiquement
- Aucune configuration manuelle nécessaire
- Certificats renouvelés automatiquement

## 🧪 Tests de Validation

### Backend API
```bash
# Health check
curl https://api.kenshu.dev/

# Chat health
curl https://api.kenshu.dev/api/v1/chat/health
```

### Frontend
1. Visitez https://kenshu.dev
2. Testez le sélecteur de thème
3. Créez un audit
4. Vérifiez le conseiller IA
5. Téléchargez le PDF

## 📊 Compatibilité

### Développement Local
- ✅ Windows, macOS, Linux
- ✅ Node.js 18+
- ✅ Python 3.10+

### Production
- ✅ Vercel (Frontend)
- ✅ Railway (Backend)
- ✅ Render (Backend alternatif)
- ✅ Cloudflare (DNS)

## 🐛 Problèmes Connus & Solutions

### "CORS policy: No 'Access-Control-Allow-Origin'"
**Solution** : Vérifiez `ALLOWED_ORIGINS` dans les variables backend

### "Failed to fetch"
**Solution** : Vérifiez que le backend est démarré et accessible

### "Environment variable not defined"
**Solution** : Créez les fichiers `.env.local` et `.env` avec les bonnes valeurs

## 💡 Conseils

1. **Testez toujours en local** avant de déployer
2. **Utilisez la checklist** pour ne rien oublier
3. **Vérifiez les logs** en cas de problème
4. **Gardez vos clés API secrètes**
5. **Documentez vos changements**

## 📞 Support

- **Documentation** : Consultez les fichiers `*_KENSHU_DEV.md`
- **Issues** : [GitHub Issues](https://github.com/Warnierr/AI-Act-Auditor/issues)
- **Email** : contact@kenshu.dev

---

**Date** : 6 Janvier 2025  
**Version** : 1.0  
**Status** : ✅ Prêt pour déploiement
