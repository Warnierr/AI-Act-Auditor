# AI Act Auditor - Project Summary

## 📊 Project Status: MVP Alpha Complete

### Phase Completion
| Phase | Status | Details |
|-------|--------|---------|
| **Phase 1: Foundation** | ✅ 100% | Backend FastAPI + Frontend Next.js setup |
| **Phase 2: Core Logic** | ✅ 100% | Rule Engine (Annex III YAML), Risk Classification |
| **Phase 3: Exports** | ✅ 100% | PDF Report Generation (xhtml2pdf + Jinja2) |
| **Phase 4: UI/UX Polish** | ✅ 100% | Premium SaaS design, i18n FR/EN |
| **Phase 5: Deployment** | 🔲 Pending | Docker, Vercel/Railway deploy |

---

## 🏗️ Technical Stack

### Backend (Python/FastAPI)
```
backend/
├── main.py                 # FastAPI app entry
├── core/
│   ├── config.py           # Pydantic Settings
│   ├── models.py           # Pydantic schemas (AISystemInput, AnalysisResult)
│   ├── rules.py            # Deterministic Rule Engine + i18n
│   ├── reporting.py        # PDF generation service
│   ├── data/
│   │   └── annex_iii.yaml  # High-risk categories (YAML)
│   └── templates/
│       └── report.html     # Jinja2 PDF template
└── api/v1/
    ├── router.py
    └── endpoints/
        ├── assess.py       # POST /api/v1/assess
        └── export.py       # POST /api/v1/export/pdf
```

**Dependencies:** FastAPI, Uvicorn, Pydantic, PyYAML, Jinja2, xhtml2pdf

### Frontend (Next.js 16 + React 19)
```
frontend/src/
├── app/
│   ├── page.tsx            # Landing page (premium design)
│   ├── assess/page.tsx     # Wizard wrapper
│   ├── results/page.tsx    # Results dashboard
│   ├── layout.tsx          # Root layout + i18n Provider
│   └── globals.css         # Design system (glassmorphism, gradients)
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── assessment/
│       └── AssessmentWizard.tsx
├── lib/
│   ├── api.ts              # API client
│   ├── translations.ts     # i18n dictionaries
│   ├── LanguageContext.tsx # React Context for locale
│   └── utils.ts
└── types/
    └── index.ts            # TypeScript interfaces
```

**Dependencies:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, shadcn/ui, Lucide Icons

---

## 🎯 What the Project Does

**AI Act Auditor** is a **free, open-source compliance tool** that helps SMEs and startups assess whether their AI system falls under the EU AI Act (Regulation 2024/1689).

### Core Features
1. **3-Step Wizard**: Collects system info (name, description, domain, risk flags)
2. **Deterministic Classification**: Rule-based engine checks:
   - Prohibited practices (Article 5)
   - High-Risk categories (Annex III)
   - Limited Risk / Transparency (Article 50)
   - Minimal Risk
3. **Detailed Results**: Risk level, confidence score, legal justifications, matched rules
4. **Compliance Checklist**: Specific obligations based on risk level
5. **PDF Export**: Downloadable report for stakeholders
6. **Bilingual (FR/EN)**: Full i18n support

### Value Proposition
- **Lead Magnet** for consulting services (upsell to premium audits)
- **Educational Tool** for startups to understand AI Act requirements
- **Open Source** for trust and transparency

---

## 🤖 Should We Add AI/LLM Logic?

### Current Approach: Deterministic Rules Only
✅ **Pros:**
- 100% reproducible and auditable results
- No hallucinations or inconsistencies
- GDPR-compliant (no external API calls with user data)
- Fast and cheap (no API costs)

❌ **Cons:**
- Limited to keyword matching and explicit flags
- Cannot understand nuanced descriptions
- Requires manual rule updates when AI Act evolves

### Potential AI Enhancements

| Feature | AI Role | Risk | Value |
|---------|---------|------|-------|
| **Smart Classification** | Analyze description to detect implicit high-risk indicators | Medium (hallucinations) | High |
| **Natural Language Justification** | Generate human-readable explanations | Low | Medium |
| **Document Analysis** | Parse technical documentation for compliance gaps | Medium | High |
| **Chat Assistant** | Q&A about AI Act requirements | Low | High |

### Recommended Hybrid Approach
```
User Input → Deterministic Rules (PRIMARY DECISION) → AI Enhancement (EXPLANATIONS ONLY)
```
- **Classification**: Keep deterministic (legal liability)
- **Explanations**: Use LLM to make justifications more understandable
- **Chat**: Add a Gemini-powered assistant for AI Act Q&A

---

## 🌍 Similar Projects & Competitors

### Open Source Tools
| Project | Description | Link |
|---------|-------------|------|
| **Algorithm Audit (Amsterdam)** | Dynamic questionnaires for AI Act classification. EUPL-1.2 license. | [algorithmaudit.eu](https://algorithmaudit.eu) |
| **KitOps** | AI model tracking for Article 12 (logging) compliance | [kitops.ml](https://kitops.ml) |
| **Seldon Core** | AI lifecycle management with governance features | [seldon.io](https://www.seldon.io) |

### Commercial Tools
| Tool | Focus | Model |
|------|-------|-------|
| **Trail ML** | AI risk assessment, model compliance | Freemium |
| **Code4Thought** | Self-assessment questionnaires | Free/Paid |
| **HeyData** | GDPR + AI Act compliance suite | Paid |

### Differentiation Opportunities
1. **French/CNIL Focus**: Specific guidance for French market
2. **PDF Export**: Many tools lack downloadable reports
3. **Open Source + Self-Hosted**: Privacy-first approach
4. **Premium Upsell**: Connect assessment to paid consulting

---

## 🚀 Next Steps

### Immediate (Week 1)
- [ ] Deploy to Vercel (frontend) + Railway/Render (backend)
- [ ] Add Google Analytics / Plausible for tracking
- [ ] Create landing page SEO (meta tags, sitemap)

### Short-term (Weeks 2-3)
- [ ] Add Gemini-powered chat assistant for AI Act Q&A
- [ ] Improve PDF template with branding
- [ ] Add user email capture (lead magnet flow)

### Medium-term (Month 2)
- [ ] Document analysis feature (upload PDF, get compliance report)
- [ ] FRIA template generator (Fundamental Rights Impact Assessment)
- [ ] Integration with Notion/Airtable for compliance tracking

---

*Last updated: 2025-12-28*
