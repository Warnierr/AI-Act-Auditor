# AI Act Auditor - Setup & Configuration

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API Key (for AI Advisor)

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. **Configure environment variables:**
Create a `.env` file in the project root:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_API_KEY=xxxxx
```

Get your keys from:
- Anthropic: https://console.anthropic.com/
- Google AI Studio: https://makersuite.google.com/

3. **Run the backend:**
```bash
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🤖 AI Advisor Feature

The AI Advisor uses **Claude 3.5 Sonnet** with RAG (Retrieval-Augmented Generation) to provide:

- ✅ **Context-aware answers** based on your audit results
- ✅ **Source citations** with direct links to official AI Act articles
- ✅ **Privacy-first**: No conversation history stored
- ✅ **Multilingual**: French and English support

### How it works:

1. Complete an AI system audit
2. On the results page, scroll to the "AI Advisor" section
3. Ask questions about:
   - Your compliance obligations
   - How to implement specific requirements
   - Interpretation of AI Act articles
   - Next steps and deadlines

### Example questions:
- "What are my main obligations for a high-risk AI system?"
- "How do I implement human oversight?"
- "What documentation is required for Article 11?"
- "What are the deadlines for compliance?"

## 📚 Knowledge Base

The system includes a curated knowledge base of key AI Act articles:

- **Article 5**: Prohibited AI practices
- **Article 6**: Classification of high-risk systems
- **Article 9**: Risk management system
- **Article 10**: Data and data governance
- **Article 11**: Technical documentation
- **Article 12**: Record-keeping/logging
- **Article 13**: Transparency obligations
- **Article 14**: Human oversight
- **Article 15**: Accuracy, robustness, cybersecurity
- **Article 50**: Transparency for limited-risk AI
- **Article 52**: General-purpose AI models (GPAIs)

### RAG Implementation:

The system automatically:
1. Retrieves relevant articles based on your risk level
2. Provides context to Claude
3. Generates accurate, sourced responses
4. Links to official documentation

## 🔒 Privacy & Security

- **No storage**: Questions and answers are not stored
- **No memory**: Each conversation is independent
- **Anonymous**: No user tracking
- **Secure**: API keys are server-side only

## 🎯 Audit Categories

The auditor now covers ALL EU AI Act risk levels:

### High-Risk (Annexe III):
1. **Biometrics** - Remote identification, emotion recognition
2. **Critical Infrastructure** - Energy, water, transport
3. **Education** - Access, grading, evaluation
4. **Employment & HR** - Recruitment, monitoring
5. **Essential Services** - Credit scoring, insurance, emergency
6. **Law Enforcement** - Polygraphs, deepfakes, risk assessment
7. **Migration & Asylum** - Visas, border control
8. **Justice** - Courts, legal interpretation

### Limited Risk:
- **Generative AI** - Chatbots, content creation, deepfakes

### Minimal Risk:
- General AI systems without specific regulations

## 🛠️ API Documentation

Interactive API docs available at: `http://localhost:8000/docs`

### New Endpoints:

**POST /api/v1/chat/ask**
```json
{
  "question": "What are my obligations?",
  "system_data": { ... },
  "risk_level": "High Risk",
  "language": "en"
}
```

**GET /api/v1/chat/health**
Check if AI Advisor is configured and operational.

## 📖 References

All answers are based on:
- **EU AI Act** (Regulation 2024/1689)
- Official text: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Annotated version: https://artificialintelligenceact.eu/

## 🤝 Contributing

This is an open-source tool for SMEs and startups. Contributions welcome!

## 📄 License

Open source - see GitHub repository
