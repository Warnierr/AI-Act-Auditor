# 🛡️ AI Act Auditor - kenshu.dev

> Outil de conformité IA Act gratuit et open source pour classifier vos systèmes d'IA selon le règlement européen.

[![Live Demo](https://img.shields.io/badge/demo-aiact.kenshu.dev-blue)](https://aiact.kenshu.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal)](https://fastapi.tiangolo.com/)

## 🌐 Liens Rapides

- **Application** : [https://aiact.kenshu.dev](https://aiact.kenshu.dev)
- **API Docs** : [https://api-aiact.kenshu.dev/docs](https://api-aiact.kenshu.dev/docs)
- **Repository** : [https://github.com/Warnierr/AI-Act-Auditor](https://github.com/Warnierr/AI-Act-Auditor)
- **Portfolio** : [https://kenshu.dev](https://kenshu.dev)

## ✨ Fonctionnalités

### 🎯 Classification Automatique
- **Annexe III complète** : 8 catégories à haut risque avec mots-clés enrichis (FR/EN)
- **Détection Article 5** : Pratiques interdites (notation sociale, manipulation, exploitation) avec analyse sémantique multilingue
- **IA Générative** : Détection du risque limité (chatbots, deepfakes, contenu synthétique)
- **Score de confiance graduel** : 50%-100% selon la qualité des données et convergence des indicateurs
- **Alertes préventives** : Warning automatique si termes suspects détectés dans la description
- **Multilingue** : Interface et détection FR/EN

### 📊 Rapports Professionnels
- **Export PDF professionnel** : Rapport de conformité en 10 sections
- **Impression textuelle** : Format A4 optimisé avec styles CSS dédiés
- **Références légales complètes** : Articles 5, 9-15, 50-52, 43 cités
- **Timeline 2025-2027** : Dates clés de mise en conformité
- **Checklist obligations** : Actions structurées par phases (0-3, 3-6, 6-12 mois)
- **Glossaire officiel** : Définitions des termes (AI System, Provider, Deployer...)
- **Score de confiance** : Transparence sur la classification

### 💬 Conseiller IA (Powered by Claude 3.5)
- **RAG** : Réponses basées sur les articles officiels
- **Sources citées** : Liens vers les articles pertinents
- **Anonymisation** : Données RGPD compliant
- **Contexte personnalisé** : Conseils adaptés à votre audit
- **Questions contextuelles** : Suggestions adaptées selon le niveau de risque (High/Limited/Prohibited/Minimal)

### 🎨 Design Premium
- **4 thèmes** : Dark Purple, Dark Blue, Light, Minimal
- **Glassmorphism** : Interface moderne et élégante
- **Responsive** : Optimisé mobile, tablet, desktop
- **Animations** : Transitions fluides avec Framer Motion

## 📄 Nouveau : Rapports Professionnels v1.0

### ✨ Fonctionnalités Améliorées

#### 🖨️ Impression Professionnelle
- **Format textuel** (pas un screenshot) avec styles CSS dédiés
- **10 sections structurées** : Couverture, Résumé, Profil, Classification, Articles, Timeline, Obligations, Glossaire, Disclaimer, Ressources
- **Code couleur** : Rouge (Prohibited), Orange (High), Bleu (Limited), Vert (Minimal)
- **Format A4 optimisé** avec marges professionnelles

#### 📋 Contenu Enrichi
- **Articles cités** : 5, 9-15, 50-52, 43 selon le niveau de risque
- **Timeline officielle** : 2/02/2025 → 2/08/2025 → 2/08/2026 → 2/08/2027
- **Tableau des obligations** : Articles 9-15 pour High Risk avec cases à cocher
- **Glossaire légal** : Définitions officielles (AI System, Provider, Deployer, High-Risk)
- **Disclaimer juridique** : Avertissement professionnel
- **Ressources** : Bureau européen IA, AI Pact, Standards, Support

#### 💡 Questions Intelligentes
**Questions suggérées contextuelles** adaptées au niveau de risque :
- **HIGH RISK** : Art. 9 (gestion risques), Art. 11 (doc technique), Art. 14 (surveillance humaine), Art. 43 (conformité)
- **LIMITED RISK** : Art. 50-52 (transparence), IA générative, deepfakes
- **PROHIBITED** : Art. 5 (interdictions), exceptions, sanctions
- **MINIMAL** : RGPD, bonnes pratiques, réévaluation

### 📚 Documentation
- **`AMELIORATIONS_RAPPORTS_PRO.md`** : Documentation complète
- **`VEILLE_RAPPORTS_CONFORMITE.md`** : Meilleures pratiques
- **`TEST_RAPPORTS_PRO.md`** : Guide de test
- **`SYNTHESE_RAPPORTS.md`** : Résumé rapide
- **`RECAP_VISUEL_RAPPORTS.md`** : Visualisation

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Python 3.10+
- Clés API (Anthropic ou OpenRouter)

### Installation Locale

```bash
# Cloner le repository
git clone https://github.com/Warnierr/AI-Act-Auditor.git
cd AI-Act-Auditor

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configurer vos clés API
uvicorn main:app --reload

# Frontend (nouveau terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Visitez : http://localhost:3000

### Variables d'Environnement

**Backend** (`.env`) :
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENROUTER_API_KEY=sk-or-xxxxx  # Optionnel
ALLOWED_ORIGINS=http://localhost:3000,https://kenshu.dev
PORT=8000
```

**Frontend** (`.env.local`) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📦 Déploiement sur aiact.kenshu.dev

> **Architecture** : Sous-domaines de kenshu.dev pour une organisation propre

### Guides Disponibles

| Guide | Description | Temps |
|-------|-------------|-------|
| **[GUIDE_ETAPES_AIACT.md](GUIDE_ETAPES_AIACT.md)** | 🚀 Étapes détaillées avec checklist | 20 min |
| **[CONFIGURATION_SOUS_DOMAINES.md](CONFIGURATION_SOUS_DOMAINES.md)** | 📖 Configuration complète Cloudflare + Vercel | 30 min |
| **[ARCHITECTURE_KENSHU_FINAL.md](ARCHITECTURE_KENSHU_FINAL.md)** | 🏗️ Vue d'ensemble de l'architecture | Lecture |
| **[RESUME_CONFIGURATION.md](RESUME_CONFIGURATION.md)** | 📝 Résumé rapide | 5 min |

### URLs de Production

```
kenshu.dev               → Portfolio
aiact.kenshu.dev         → AI Act Auditor (frontend)
api-aiact.kenshu.dev     → AI Act Auditor (backend)
```

## 🏗️ Architecture

```
                  CLOUDFLARE DNS
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   kenshu.dev    aiact.kenshu.dev  api-aiact.kenshu.dev
        │               │               │
        ▼               ▼               ▼
   Portfolio     AI Act Auditor    FastAPI Backend
   (Vercel)      Next.js 16        Python + Claude
                 (Vercel)          (Railway)
```

### Sous-domaines
- **kenshu.dev** : Portfolio principal
- **aiact.kenshu.dev** : AI Act Auditor (frontend)
- **api-aiact.kenshu.dev** : API Backend
- **budget.kenshu.dev** : Budget AI (futur)
- **api-budget.kenshu.dev** : Budget API (futur)

## 📚 Stack Technique

### Frontend
- **Framework** : Next.js 16 (App Router)
- **UI** : Tailwind CSS 4 + Radix UI
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Types** : TypeScript

### Backend
- **Framework** : FastAPI
- **IA** : Anthropic Claude 3.5 Sonnet
- **PDF** : xhtml2pdf
- **Validation** : Pydantic

### Déploiement
- **Frontend** : Vercel (Gratuit)
- **Backend** : Railway (5$/mois)
- **DNS** : Cloudflare (Gratuit)

## 🎨 Thèmes Disponibles

| Thème | Description | Couleurs |
|-------|-------------|----------|
| **Dark Purple** | Moderne et élégant | Violet/Indigo |
| **Dark Blue** | Professionnel | Bleu/Cyan |
| **Light** | Clair et épuré | Blanc/Indigo |
| **Minimal** | Minimaliste | Noir/Blanc |

## 📖 Documentation

- [AI_ADVISOR_README.md](AI_ADVISOR_README.md) - Guide du conseiller IA
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist technique
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Vue d'ensemble du projet
- [THEME_AUDIT.md](THEME_AUDIT.md) - Documentation des thèmes

## 🧪 Tests

### Test Complet
1. Visitez [aiact.kenshu.dev](https://aiact.kenshu.dev)
2. Créez un audit test :
   - Nom : "Talent Finder"
   - Domaine : "Recrutement RH"
   - Cochez "Emploi & RH"
3. Vérifiez la classification : **HIGH RISK**
4. Testez le conseiller IA
5. Téléchargez le PDF

### API Health Check
```bash
curl https://api-aiact.kenshu.dev/
curl https://api-aiact.kenshu.dev/api/v1/chat/health
```

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

## 🙏 Remerciements

- **EU AI Act** : [Texte officiel](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- **Anthropic** : Claude 3.5 Sonnet
- **Vercel** : Hébergement frontend
- **Railway** : Hébergement backend

## 📞 Contact

- **Portfolio** : [kenshu.dev](https://kenshu.dev)
- **AI Act Auditor** : [aiact.kenshu.dev](https://aiact.kenshu.dev)
- **Email** : contact@kenshu.dev
- **GitHub** : [@Warnierr](https://github.com/Warnierr)

## 🔒 Confidentialité & RGPD

- ✅ **Données anonymisées** : Aucune information identifiante envoyée à l'API
- ✅ **Pas de stockage** : Conversations en mémoire uniquement
- ✅ **Pas de tracking** : Respect de la vie privée
- ✅ **Open Source** : Code auditable publiquement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Status** : 🟢 Production

Made with ❤️ for EU AI Act compliance
