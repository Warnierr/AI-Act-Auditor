# 🧪 Test Local Rapide - AI Act Auditor

## ⚡ Démarrage Express (5 minutes)

### Prérequis
- ✅ Node.js installé
- ✅ Python 3.10+ installé
- ✅ Clés API configurées

---

## 🚀 Lancement en 3 Commandes

### Terminal 1 : Backend
```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 : Frontend
```powershell
cd frontend
npm run dev
```

### Terminal 3 : Navigateur
```
http://localhost:3000
```

---

## ✅ Tests Rapides

### Test 1 : Interface (2 min)
1. Page d'accueil charge ✅
2. Changer de thème (Dark Purple, Dark Blue, Light, Minimal) ✅
3. Changer de langue (FR ↔ EN) ✅
4. Responsive : Réduire la fenêtre ✅

### Test 2 : Audit Simple (3 min)
1. Cliquer sur "Commencer l'Audit"
2. Remplir :
   ```
   Nom: ChatBot Test
   Description: Un simple chatbot pour le support client
   Domaine: Service client
   ```
3. Étape 2 : Cocher "IA Générative"
4. Étape 3 : Vérifier le résumé
5. Soumettre
6. ✅ Résultat : LIMITED RISK

### Test 3 : Audit HIGH RISK (3 min)
1. Nouveau audit
2. Remplir :
   ```
   Nom: TalentScout
   Description: Système de tri automatique des CV
   Domaine: Ressources Humaines
   ```
3. Étape 2 : Cocher "Emploi & RH"
4. Soumettre
5. ✅ Résultat : HIGH RISK

### Test 4 : Conseiller IA (2 min)
1. Sur la page de résultats
2. Scroller jusqu'au chat
3. Questions suggérées visibles ? ✅
4. Cliquer sur une question
5. L'IA répond ? ✅
6. Articles sourcés affichés ? ✅

### Test 5 : Export PDF (1 min)
1. Cliquer sur "Télécharger PDF"
2. PDF généré ? ✅
3. Contenu lisible ? ✅

---

## 🐛 Checklist de Validation

### ✅ Problèmes Corrigés
- [x] Texte blanc sur blanc (étape 3) → **CORRIGÉ**
- [x] Questions suggérées invisibles → **CORRIGÉ**
- [x] Liens GitHub incorrects → **CORRIGÉ**

### 🎨 Thèmes à Vérifier
Testez chaque thème et vérifiez :
- [ ] **Dark Purple** : Tous les textes lisibles ?
- [ ] **Dark Blue** : Tous les textes lisibles ?
- [ ] **Light** : Tous les textes lisibles ?
- [ ] **Minimal** : Tous les textes lisibles ?

### 📱 Responsive à Vérifier
- [ ] Mobile (< 640px) : Layout correct
- [ ] Tablet (768px) : Layout correct
- [ ] Desktop (1024px+) : Layout correct

---

## 🧪 Cas de Test Détaillés

Consultez **[CAS_TEST_REELS.md](CAS_TEST_REELS.md)** pour :
- 8 cas de test complets (HIGH, LIMITED, PROHIBITED, MINIMAL)
- Questions précises à poser au conseiller IA
- Résultats attendus

---

## 🔍 Débogage

### Backend ne démarre pas ?
```powershell
# Vérifier Python
python --version

# Vérifier les dépendances
pip list | findstr fastapi

# Réinstaller si besoin
pip install -r requirements.txt
```

### Frontend ne démarre pas ?
```powershell
# Vérifier Node
node --version

# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

### API ne répond pas ?
```powershell
# Tester l'API directement
curl http://localhost:8000/

# Devrait retourner :
# {"message":"Welcome to AI Act Auditor API","status":"active"}
```

### Conseiller IA ne répond pas ?
1. Vérifier `.env` : `ANTHROPIC_API_KEY` configurée ?
2. Tester health check :
   ```powershell
   curl http://localhost:8000/api/v1/chat/health
   ```
3. Vérifier les logs backend

---

## 📊 Logs Utiles

### Backend
Les logs s'affichent dans le terminal backend :
```
INFO:     127.0.0.1:54321 - "POST /api/v1/assess HTTP/1.1" 200 OK
```

### Frontend
Ouvrir la console navigateur (F12) :
```javascript
console.log("API Response:", data)
```

---

## 🎯 Test de Charge (Optionnel)

Testez plusieurs audits rapidement :
1. Audit 1 : HIGH RISK (RH)
2. Audit 2 : LIMITED RISK (Chatbot)
3. Audit 3 : MINIMAL RISK (Anti-spam)
4. Audit 4 : PROHIBITED (Émotions)

Tous devraient fonctionner sans erreur.

---

## 🔐 Test de Sécurité

### CORS
Frontend sur `localhost:3000` peut appeler Backend sur `localhost:8000` ? ✅

### Headers
Vérifier dans Network (F12) :
```
Access-Control-Allow-Origin: http://localhost:3000
Content-Type: application/json
```

---

## 🎉 Tout Fonctionne ?

Si tous les tests passent, vous êtes prêt pour le déploiement !

Suivez : **[GUIDE_ETAPES_AIACT.md](GUIDE_ETAPES_AIACT.md)**

---

## 📞 Problèmes ?

1. Vérifiez les logs Backend + Frontend
2. Consultez **[CAS_TEST_REELS.md](CAS_TEST_REELS.md)**
3. Relancez les serveurs
4. Vérifiez les variables d'environnement

---

**Temps total** : 15 minutes  
**Dernière mise à jour** : 6 Janvier 2025
