# 🎯 Plan d'Action Prioritaire - AI Act Auditor

**Date** : Janvier 2025  
**Objectif** : Transformer le MVP en produit production-ready

---

## 🚨 Actions Immédiates (Semaine 1)

### 1. Logging Structuré ⏱️ 2h
**Priorité** : 🔴 CRITIQUE  
**Impact** : Débogage en production

```python
# À créer : backend/core/logging.py
import structlog

logger = structlog.get_logger()

# Utilisation
logger.info("assessment_completed", system_id=system.name, risk_level=result.risk_level)
```

**Fichiers** :
- `backend/core/logging.py` (nouveau)
- `backend/main.py` (modifier)
- `backend/api/v1/endpoints/assess.py` (modifier)

**Checklist** :
- [ ] Installer structlog : `pip install structlog`
- [ ] Configurer logging structuré
- [ ] Remplacer tous les `print()` par `logger`
- [ ] Ajouter contexte dans les logs (request_id, user_id)

---

### 2. Tests Critiques ⏱️ 4h
**Priorité** : 🔴 CRITIQUE  
**Impact** : Prévenir les régressions

**Tests à ajouter** :

```python
# backend/tests/test_reporting.py
def test_pdf_generation_success():
    """Test PDF generation with valid data"""
    
def test_pdf_generation_with_special_chars():
    """Test PDF handles special characters"""
    
def test_pdf_professional_template():
    """Test professional template rendering"""
```

```python
# backend/tests/test_integration.py
def test_assess_endpoint_integration():
    """Test full assess workflow"""
    
def test_chat_endpoint_integration():
    """Test chat advisor workflow"""
```

**Checklist** :
- [ ] Tests pour `reporting.py`
- [ ] Tests d'intégration API
- [ ] Tests de validation des modèles
- [ ] Coverage > 70%

---

### 3. Validation Frontend ⏱️ 3h
**Priorité** : 🔴 CRITIQUE  
**Impact** : Meilleure UX, moins d'erreurs

```typescript
// frontend/src/lib/validation.ts
import { z } from 'zod'

export const AISystemInputSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  domain: z.string().min(1, "Domain required"),
  // ...
})
```

**Checklist** :
- [ ] Installer Zod : `npm install zod`
- [ ] Créer schémas de validation
- [ ] Intégrer dans AssessmentWizard
- [ ] Messages d'erreur multilingues

---

## ⚡ Actions Court Terme (Semaine 2-3)

### 4. Cache Backend ⏱️ 4h
**Priorité** : 🟠 IMPORTANT  
**Impact** : Performance + réduction coûts

```python
# backend/core/cache.py
from functools import lru_cache
import hashlib
import json

class CacheManager:
    def __init__(self):
        self._cache = {}
    
    def get_cache_key(self, endpoint: str, data: dict) -> str:
        """Generate cache key from endpoint and data"""
        key_str = f"{endpoint}:{json.dumps(data, sort_keys=True)}"
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def get(self, key: str):
        """Get from cache"""
        return self._cache.get(key)
    
    def set(self, key: str, value: any, ttl: int = 3600):
        """Set cache with TTL"""
        self._cache[key] = {
            'value': value,
            'expires_at': time.time() + ttl
        }
```

**Checklist** :
- [ ] Créer CacheManager
- [ ] Intégrer dans endpoint `/assess`
- [ ] Ajouter TTL configurable
- [ ] Tests de cache

---

### 5. Rate Limiting ⏱️ 2h
**Priorité** : 🟠 IMPORTANT  
**Impact** : Protection contre abus

```python
# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/v1/assess")
@limiter.limit("10/minute")  # 10 requêtes par minute
async def assess_system(...):
    ...
```

**Checklist** :
- [ ] Installer slowapi : `pip install slowapi`
- [ ] Configurer rate limiting
- [ ] Limites par endpoint
- [ ] Messages d'erreur clairs

---

### 6. Monitoring Basique ⏱️ 3h
**Priorité** : 🟠 IMPORTANT  
**Impact** : Visibilité production

```python
# backend/core/monitoring.py
import time
from functools import wraps

def track_metrics(func):
    """Decorator to track function metrics"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start
            logger.info("endpoint_called", 
                       endpoint=func.__name__,
                       duration=duration,
                       status="success")
            return result
        except Exception as e:
            duration = time.time() - start
            logger.error("endpoint_error",
                        endpoint=func.__name__,
                        duration=duration,
                        error=str(e))
            raise
    return wrapper
```

**Checklist** :
- [ ] Créer décorateur de métriques
- [ ] Ajouter aux endpoints critiques
- [ ] Logs structurés avec métriques
- [ ] (Optionnel) Intégrer Sentry

---

## 📊 Actions Moyen Terme (Mois 2)

### 7. Analytics ⏱️ 2h
**Priorité** : 🟡 AMÉLIORATION  
**Impact** : Comprendre l'usage

```typescript
// frontend/src/lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props: properties })
  }
}

// Utilisation
trackEvent('audit_created', { risk_level: result.risk_level })
trackEvent('pdf_downloaded', { report_type: 'professional' })
```

**Checklist** :
- [ ] Intégrer Plausible ou Vercel Analytics
- [ ] Événements clés (audit créé, PDF téléchargé)
- [ ] Dashboard analytics

---

### 8. Génération PDF Async ⏱️ 6h
**Priorité** : 🟡 AMÉLIORATION  
**Impact** : Performance, pas de timeout

```python
# backend/api/v1/endpoints/export.py
from fastapi import BackgroundTasks

@router.post("/export/pdf")
async def export_pdf(
    system: AISystemInput,
    background_tasks: BackgroundTasks
):
    # Générer PDF en background
    task_id = str(uuid.uuid4())
    background_tasks.add_task(generate_pdf_task, task_id, system)
    return {"task_id": task_id, "status": "processing"}

@router.get("/export/pdf/{task_id}")
async def get_pdf_status(task_id: str):
    # Vérifier statut
    ...
```

**Checklist** :
- [ ] Refactoriser en async
- [ ] Système de queue (ou BackgroundTasks)
- [ ] Endpoint de statut
- [ ] Tests async

---

### 9. Base de Données (Optionnel) ⏱️ 8h
**Priorité** : 🟢 OPTIONNEL  
**Impact** : Historique, fonctionnalités avancées

```python
# backend/core/database.py
from sqlalchemy import create_engine, Column, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(String, primary_key=True)
    system_name = Column(String)
    risk_level = Column(String)
    created_at = Column(DateTime)
    result_data = Column(JSON)
```

**Checklist** :
- [ ] Choisir DB (SQLite pour start, PostgreSQL pour prod)
- [ ] Modèles SQLAlchemy
- [ ] Migrations (Alembic)
- [ ] API pour historique

---

## 🎨 Quick Wins (Améliorations Rapides)

### 10. Documentation API ⏱️ 1h
```python
# backend/api/v1/endpoints/assess.py
@router.post("/assess", 
             response_model=AnalysisResult,
             summary="Assess AI System Compliance",
             description="""
             Analyze an AI system according to EU AI Act (Regulation 2024/1689).
             
             Returns:
             - Risk level (Prohibited, High, Limited, Minimal)
             - Confidence score
             - Matched rules and justifications
             - Compliance obligations
             """,
             responses={
                 200: {"description": "Assessment completed"},
                 400: {"description": "Invalid input"},
                 500: {"description": "Server error"}
             })
```

**Checklist** :
- [ ] Enrichir descriptions OpenAPI
- [ ] Ajouter exemples
- [ ] Documenter codes d'erreur

---

### 11. Headers Sécurité ⏱️ 30min
```python
# backend/main.py
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    return response
```

**Checklist** :
- [ ] Ajouter middleware sécurité
- [ ] Tester headers
- [ ] Vérifier avec securityheaders.com

---

### 12. Améliorer Messages d'Erreur ⏱️ 1h
```python
# backend/core/exceptions.py
class AIActAuditorException(Exception):
    """Base exception"""
    pass

class ValidationError(AIActAuditorException):
    """Input validation error"""
    pass

class ClassificationError(AIActAuditorException):
    """Classification error"""
    pass
```

**Checklist** :
- [ ] Créer exceptions personnalisées
- [ ] Handler d'erreurs global
- [ ] Messages d'erreur clairs et multilingues

---

## 📅 Planning Suggéré

### Semaine 1
- **Lundi-Mardi** : Logging structuré (2h)
- **Mercredi-Jeudi** : Tests critiques (4h)
- **Vendredi** : Validation frontend (3h)

### Semaine 2
- **Lundi-Mardi** : Cache backend (4h)
- **Mercredi** : Rate limiting (2h)
- **Jeudi-Vendredi** : Monitoring (3h)

### Semaine 3
- **Lundi-Mardi** : Analytics (2h)
- **Mercredi-Jeudi** : PDF async (6h)
- **Vendredi** : Quick wins (2h)

---

## 🎯 Objectifs par Phase

### Phase 1 : Stabilisation (Semaine 1-2)
✅ Logging opérationnel  
✅ Tests > 70% coverage  
✅ Validation robuste  
✅ Sécurité de base

### Phase 2 : Performance (Semaine 3-4)
✅ Cache backend  
✅ PDF async  
✅ Monitoring  
✅ Analytics

### Phase 3 : Fonctionnalités (Mois 2)
✅ Base de données  
✅ Historique  
✅ Exports multiples  
✅ i18n étendu

---

## 📊 Métriques de Succès

### Techniques
- **Coverage** : > 80%
- **Latence API** : < 500ms (p95)
- **Erreurs** : < 0.1%
- **Uptime** : > 99.5%

### Produit
- **Audits/mois** : Tracking
- **PDF téléchargés** : Taux conversion
- **Chat utilisé** : Adoption
- **Templates** : Utilisation

---

## 🚀 Démarrage Rapide

### Commencer Maintenant
1. **Fork le repo** (si pas déjà fait)
2. **Créer branche** : `git checkout -b feature/stabilization`
3. **Commencer par logging** : Plus rapide, impact immédiat
4. **Tester localement** : `./start_dev.ps1`
5. **Commit progressif** : Un feature à la fois

### Commandes Utiles
```bash
# Tests
pytest backend/tests/ -v --cov=backend

# Linting
ruff check backend/
npm run lint

# Type checking
mypy backend/
npm run type-check
```

---

**Version** : 1.0  
**Dernière mise à jour** : Janvier 2025  
**Status** : 🟢 Prêt à implémenter
