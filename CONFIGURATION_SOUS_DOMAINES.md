# 🌐 Configuration Sous-Domaines kenshu.dev

## Architecture Globale

```
kenshu.dev                    → Portfolio (Vercel)
├── aiact.kenshu.dev         → AI Act Auditor Frontend (Vercel)
├── api-aiact.kenshu.dev     → AI Act Auditor Backend (Railway)
├── budget.kenshu.dev        → Budget AI Frontend (Vercel)
├── api-budget.kenshu.dev    → Budget AI Backend (Railway)
└── [autres apps...]
```

## 🚀 Configuration pour AI Act Auditor

### Étape 1 : Configuration Cloudflare DNS

1. **Connectez-vous à Cloudflare**
   - Allez sur votre domaine kenshu.dev
   - Section DNS

2. **Ajoutez les enregistrements DNS**

   | Type  | Name          | Target                              | Proxy |
   |-------|---------------|-------------------------------------|-------|
   | CNAME | aiact         | cname.vercel-dns.com                | ✅    |
   | CNAME | api-aiact     | [your-project].railway.app          | ✅    |

   **Note** : Activez le proxy Cloudflare (nuage orange) pour bénéficier du CDN et de la protection DDoS.

### Étape 2 : Configuration Vercel (Frontend)

1. **Allez dans votre projet AI Act Auditor sur Vercel**
   - Settings > Domains

2. **Ajoutez le custom domain**
   - Cliquez sur "Add Domain"
   - Entrez : `aiact.kenshu.dev`
   - Cliquez sur "Add"

3. **Vérification**
   - Vercel vérifie automatiquement le CNAME
   - Status : ✅ Valid Configuration
   - SSL sera automatiquement généré (Let's Encrypt)

4. **Variables d'environnement**
   ```env
   NEXT_PUBLIC_API_URL=https://api-aiact.kenshu.dev
   NEXT_PUBLIC_SITE_URL=https://aiact.kenshu.dev
   ```

### Étape 3 : Configuration Railway (Backend)

1. **Allez dans votre projet Railway**
   - Settings > Networking > Custom Domain

2. **Ajoutez le custom domain**
   - Entrez : `api-aiact.kenshu.dev`
   - Railway vous donne un CNAME : `[project].railway.app`

3. **Variables d'environnement**
   ```env
   ALLOWED_ORIGINS=https://aiact.kenshu.dev,https://www.aiact.kenshu.dev
   PORT=8000
   HOST=0.0.0.0
   ```

### Étape 4 : Mise à jour des fichiers de configuration

#### `vercel.json` (Frontend)
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs",
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
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api-aiact.kenshu.dev/api/:path*"
    }
  ]
}
```

#### `frontend/.env.production`
```env
NEXT_PUBLIC_API_URL=https://api-aiact.kenshu.dev
NEXT_PUBLIC_SITE_URL=https://aiact.kenshu.dev
```

## 🔧 Configuration Cloudflare Avancée (Optionnel)

### Page Rules pour optimisation

1. **Cache Everything pour les assets**
   ```
   aiact.kenshu.dev/_next/static/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 month
   ```

2. **Always Use HTTPS**
   ```
   *aiact.kenshu.dev/*
   Always Use HTTPS: On
   ```

3. **Auto Minify**
   ```
   aiact.kenshu.dev/*
   Auto Minify: JS, CSS, HTML
   ```

### SSL/TLS Configuration

1. **SSL/TLS Encryption Mode**
   - Recommandé : **Full (Strict)**
   - Cloudflare ↔️ Origin Server avec certificat valide

2. **Always Use HTTPS**
   - Activez pour rediriger HTTP → HTTPS

3. **Minimum TLS Version**
   - Recommandé : **TLS 1.2**

## 🧪 Tests de Validation

### Frontend
```bash
# Test DNS
nslookup aiact.kenshu.dev

# Test HTTPS
curl -I https://aiact.kenshu.dev

# Test dans le navigateur
open https://aiact.kenshu.dev
```

### Backend
```bash
# Test DNS
nslookup api-aiact.kenshu.dev

# Test Health Check
curl https://api-aiact.kenshu.dev/

# Test API
curl https://api-aiact.kenshu.dev/api/v1/chat/health
```

## 📱 Pour les Autres Applications

### Budget AI
```
Frontend:  budget.kenshu.dev
Backend:   api-budget.kenshu.dev
```

**DNS Cloudflare** :
```
CNAME  budget      cname.vercel-dns.com
CNAME  api-budget  [railway-project].railway.app
```

**Variables Vercel** :
```env
NEXT_PUBLIC_API_URL=https://api-budget.kenshu.dev
NEXT_PUBLIC_SITE_URL=https://budget.kenshu.dev
```

### Template pour Nouvelles Apps

1. **Choisir le sous-domaine** : `[app].kenshu.dev`
2. **Ajouter DNS Cloudflare** : CNAME → vercel-dns.com
3. **Configurer Vercel** : Add Custom Domain
4. **Backend** : `api-[app].kenshu.dev` sur Railway
5. **Variables d'environnement** : Mettre à jour les URLs

## 🎨 Organisation Visuelle

```
┌─────────────────────────────────────────────────┐
│          kenshu.dev (Portfolio)                 │
│          ┌─────────────────────┐                │
│          │  AI Act Auditor     │                │
│          │  aiact.kenshu.dev   │                │
│          └─────────────────────┘                │
│          ┌─────────────────────┐                │
│          │  Budget AI          │                │
│          │  budget.kenshu.dev  │                │
│          └─────────────────────┘                │
│          ┌─────────────────────┐                │
│          │  Autre App          │                │
│          │  [app].kenshu.dev   │                │
│          └─────────────────────┘                │
└─────────────────────────────────────────────────┘
```

## 🔒 Avantages de cette Architecture

✅ **Organisation** : Toutes les apps sous un même domaine  
✅ **SEO** : Meilleur référencement avec domaine principal  
✅ **SSL Gratuit** : Certificats automatiques via Cloudflare + Vercel  
✅ **Performance** : CDN Cloudflare + Vercel Edge Network  
✅ **Sécurité** : Protection DDoS Cloudflare  
✅ **Scalabilité** : Ajout facile de nouvelles apps  

## 💡 Bonnes Pratiques

1. **Nommage Cohérent**
   - Frontend : `[app].kenshu.dev`
   - Backend : `api-[app].kenshu.dev`

2. **Variables d'Environnement**
   - Toujours utiliser `.env.production` pour les valeurs prod
   - Ne jamais commiter les `.env` réels

3. **SSL/TLS**
   - Utilisez "Full (Strict)" sur Cloudflare
   - Vérifiez que HTTPS fonctionne

4. **Monitoring**
   - Activez Cloudflare Analytics
   - Activez Vercel Analytics
   - Surveillez les logs Railway

## 🐛 Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"
- Vérifiez que le CNAME est bien ajouté sur Cloudflare
- Attendez 5-10 minutes pour la propagation DNS

### "Too Many Redirects"
- Changez SSL/TLS mode de "Flexible" à "Full (Strict)"

### "Invalid SSL Certificate"
- Vérifiez que le proxy Cloudflare est activé (nuage orange)
- Attendez que Cloudflare génère le certificat (2-5 minutes)

### "CORS Error"
- Vérifiez `ALLOWED_ORIGINS` dans le backend
- Vérifiez que le domaine est exact (avec/sans www)

## 📞 Support

- **Cloudflare Docs** : https://developers.cloudflare.com/
- **Vercel Docs** : https://vercel.com/docs/custom-domains
- **Railway Docs** : https://docs.railway.app/deploy/custom-domains

---

**Version** : 1.0  
**Dernière mise à jour** : 6 Janvier 2025
