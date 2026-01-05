# AI Act Auditor — Stack Technique & Architecture (Context)

## 1) Architecture cible (SaaS moderne)
Objectif : scalabilité, SEO, typage, coût faible, RGPD by design.

### Stack
- Frontend : **Next.js 14+ (TypeScript)** + Tailwind + Shadcn/UI + Framer Motion  
  - Pourquoi : SEO (lead magnet), UX premium, performance (RSC), crédibilité produit
- Backend : **FastAPI (Python 3.12)** + Pydantic  
  - Pourquoi : validation stricte, async, OpenAPI, “moteur de vérité” réglementaire
- IA : **Gemini Flash (ou équivalent)** (texte + vision + grounding si pertinent)  
  - Rôle : assistif uniquement (extraction, signaux faibles, reformulation, justification)
- DB/Auth : **Supabase (Postgres)** (V2)  
  - V1 sans DB / client-side ; V2 opt-in “save audit”
- Infra : **Vercel (web)** + **Cloud Run (api)** + GitHub Actions (CI)

## 2) Moteur de classification (approche hybride en 3 couches)
### Couche 1 — Déterministe (source of truth)
- Règles strictes codées via JSON/YAML
- Mapping Annexe I (définition) + Annexe III (high-risk) + règles “éliminatoires”
- Output stable et défendable

### Couche 2 — IA assistive (NLP/Vision)
- Analyse sémantique des descriptions
- Détection signaux faibles (biométrie, biais, usage RH, etc.)
- Pré-remplissage / reformulation / suggestions d’articles pertinents
- Option : analyse diagrammes (Vision) si demande prouvée

### Couche 3 — Validation & ambiguïté
- **Score de confiance**
- Identification zones grises (“besoin d’info complémentaire”)
- Recommandation action : “consulter expert” ou “question supplémentaire”

## 3) Endpoints (MVP)
- `GET /health`
- `POST /assess` (JSON) → risque + confiance + justifs + obligations
- `POST /export/pdf` → rapport + FRIA starter + Annexe IV skeleton
- (V2) `POST /ai/analyze-text` et `POST /ai/analyze-vision`

## 4) Structure repo (recommandée)
**2 repos** (plus propre open-source + déploiements indépendants)
- `ai-act-auditor-backend/` (FastAPI)
- `ai-act-auditor-frontend/` (Next.js)

Backend (exemple)
- `app/core/models.py` (Pydantic)
- `app/core/rules_engine.py`
- `app/core/annexes/*.yaml`
- `app/ai/gemini_client.py`
- `app/api/audit.py`

Frontend (exemple)
- `app/(landing)/`
- `app/assess/` (wizard)
- `app/results/`
- `components/ui/` (Shadcn)
- `components/assessment/`

## 5) RGPD & sécurité (implémentation concrète)
- V1 : traitements côté client + export local (pas de DB)
- V2 : persistance Supabase **opt-in**
- Minimisation : ne stocker que le nécessaire, anonymiser si possible
- Transparence : expliquer traitement IA + logs (sans données sensibles)

## 6) Déploiement & coûts (ordre de grandeur)
- Vercel Hobby : 0€
- Cloud Run : 0–5€ (faible trafic)
- Supabase Free : 0€ (V2)
- IA API : 0–10€ (tests / faible volume)
- Domaine : ~15€/an

Note produit : avant d’implémenter Vision, mesurer usage réel (feature coûteuse).
