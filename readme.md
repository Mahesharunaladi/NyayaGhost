# 🕊️ NyayaGhost: AI-Powered Justice & Welfare Navigator

> **"Bridging the 1.4 Billion Person Justice Gap - One Voice at a Time"**

## 🎯 Mission: Solving India's Awareness Crisis

NyayaGhost is a voice-first, vernacular AI platform that actively diagnoses legal rights violations and welfare entitlements for India's underserved populations. We're not just another legal tech app - we're building the **first-mile infrastructure** for justice and welfare access.

### The Problem We're Solving

- **90%+ of Indians** don't know they're entitled to free legal aid
- **80 crore Indians** lack basic constitutional literacy
- **1.4 billion people globally** have unmet justice needs
- Welfare scheme awareness in rural areas: **20-30%**
- Despite **80% eligibility** for legal aid, only **1% of cases** use state-provided lawyers

### Real-World Impact

#### 🏞️ The Land Dispute (Jharkhand)
A tribal farmer loses ancestral land to forged documents because he doesn't know about the **Forest Rights Act, 2006** or that DLSA provides free lawyers. Result: Generational poverty.

#### 👩‍👧‍👦 The Entitlement Gap (Rajasthan)
An illiterate widow qualifies for 3 government schemes but doesn't know they exist. Falls into debt trap while safety net funds go unclaimed.

#### 👷 The Wage Theft (Delhi)
Migrant worker wrongfully denied wages, unaware NALSA provides free legal aid for industrial workmen. Returns home empty-handed.

---

## 💡 Our Revolutionary Approach

### What Makes NyayaGhost Different?

| Traditional Solutions | NyayaGhost |
|----------------------|------------|
| **Passive "Pull"** - Waiting for users | **Active "Push"** - Proactive diagnosis |
| **Text-based, English-first** | **Voice-first, Vernacular-native** |
| **Legal-only silo** | **Unified Legal + Welfare** |
| **Requires literacy & awareness** | **Works for illiterate users** |
| **Urban, desktop-focused** | **Rural, smartphone-optimized** |

### Core Innovations

1. **🎤 Voice-First Interface**
   - Zero literacy barrier
   - Natural conversation in Bhojpuri, Hindi, English
   - Uses "desirable schemes" as conversation hooks

2. **🧠 Active Diagnosis Engine**
   - Doesn't wait for users to identify "legal problems"
   - Discovers rights violations during welfare queries
   - Example: While checking pension eligibility, asks about wage theft

3. **🔗 Unified Rights Database**
   - Combines welfare schemes + legal rights
   - Matches user's real-world "life problems"
   - Single interface for NALSA, myScheme, and more

4. **👻 Ghost Filing System**
   - Automated FIR/RTI/legal notice generation
   - SMS-based status tracking (no app required)
   - Works with existing government systems

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Voice Recognition**: Web Speech API with multi-language support
- **UI Framework**: Vanilla JS with CSS animations (Progressive Enhancement)
- **AI Integration**: Google Gemini API for legal advice generation
- **PWA**: Offline-first, installable
- **Languages**: Hindi, English, Kannada, Bhojpuri, Tamil, Telugu (expandable)
- **Visual Feedback**: CSS animations (pulse, ripple, fade effects)

### Backend Services
- **Runtime**: Node.js + Express
- **AI Engine**: Google Gemini AI (Integrated)
  - Query Analysis: Legal vs non-legal classification
  - Rights Matching: Applicable IPC sections and laws
  - Response Generation: Context-aware legal advice
  - Multi-language: Native language responses
- **APIs Integration**: 
  - Indian Laws Database
  - IPC Sections corpus
  - Government schemes data
- **Security**: 
  - CORS enabled
  - Environment variables for API keys
  - Input validation and sanitization

### Key Features Implemented

✅ **Multilingual Voice Input** - Hindi, English, Kannada, Bhojpuri, Tamil, Telugu  
✅ **Enhanced Microphone UI** - Animated button with visual feedback (pulse, ripple effects)  
✅ **AI-Powered Legal Advice** - Google Gemini AI integration for intelligent responses  
✅ **Relevance Filtering** - Smart detection of legal vs non-legal queries  
✅ **Speech-to-Text** - Real-time voice recognition with interim results  
✅ **IPC Section Matching** - Automatic identification of applicable laws  
✅ **Multi-language Responses** - Legal advice in user's native language  
✅ **Error Handling** - Context-specific error messages with retry options  
✅ **How It Works Modal** - Interactive guide explaining the system  
✅ **PWA-Ready** - Offline-first for areas with poor connectivity  
✅ **Mobile Optimized** - Responsive design for smartphones  

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
Modern browser with Web Speech API support
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mahesharunaladi/NyayaGhost.git
cd NyayaGhost
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file with your API keys
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

4. **Start the backend**
```bash
node server.js
```

5. **Open the frontend**
```bash
# Open index.html in a browser at http://localhost:3000
# Or visit http://localhost:3000 after starting the server
```

### Usage

1. **Choose your language** (Hindi/English/Kannada/Bhojpuri/Tamil/Telugu)
2. **Tap the mic button** 🎤 (it will pulse and turn red when listening)
3. **Speak your problem** in natural language
   - "मेरी मजदूरी नहीं मिली" (My wages weren't paid)
   - "Ration card kaise banaye?" (How to make ration card?)
   - "ಪೊಲೀಸ್ ದೂರು ಹೇಗೆ ಸಲ್ಲಿಸಬೇಕು?" (How to file police complaint?)
4. **Receive AI-powered legal advice** with IPC sections and your rights
5. **Get actionable steps** and helpline numbers
6. **Click ℹ️ button** (bottom-right) to learn how the system works

---

## 🗂️ Project Structure

```
NyayaGhost/
├── index.html              # Main PWA interface with voice input
├── script.js               # Frontend logic + Speech API (deprecated - merged into index.html)
├── style.css               # UI styling (deprecated - merged into index.html)
├── server.js               # Backend API with Gemini AI integration
├── manifest.json           # PWA configuration
├── package.json            # Dependencies (express, cors, dotenv, @google/generative-ai)
├── .env                    # Environment variables (API keys)
├── test-simple.js          # Quick relevance testing
├── test-relevance.js       # Comprehensive test suite
├── assets/
│   ├── ghost.json          # Lottie animation
│   └── hinid.ttf           # Vernacular font
├── images/
│   └── icons/              # PWA icons (192x192, 512x512)
└── docs/
    ├── TECH.md             # Technical documentation
    ├── USER_GUIDE.md       # User manual
    ├── DATABASE_SCHEMA.md  # Data structure
    ├── DEPLOYMENT.md       # Deployment guide
    └── PITCH_DECK.md       # Project pitch
```

---

## 🛠️ Roadmap

### Phase 1: MVP (Current - January 2026)
- [x] Voice input in 6+ languages
- [x] Google Gemini AI integration
- [x] Relevance filtering (legal vs non-legal queries)
- [x] IPC section identification
- [x] Multi-language response generation
- [x] Enhanced microphone UI with animations
- [x] How It Works modal
- [x] Error handling with context-specific messages
- [x] Real-time speech-to-text with interim results
- [ ] Real government API connections (myScheme, eCourts)
- [ ] SMS-based case tracking

### Phase 2: Scale
- [ ] 22 Scheduled languages support
- [ ] Aadhaar eKYC integration
- [ ] SMS-based alerts (no app needed)
- [ ] WhatsApp bot deployment
- [ ] Partnership with NALSA/CSCs

### Phase 3: Ecosystem
- [ ] Volunteer lawyer network
- [ ] NGO partnership dashboard
- [ ] JusticeScore gamification
- [ ] Impact analytics for donors/government
- [ ] Blockchain-verified case registry

---

## 📊 Key Metrics We Track

- **Awareness Rate**: % of users who discover unknown rights
- **Filing Success**: % of cases auto-filed successfully  
- **Justice Gap Closure**: Unclaimed benefits accessed (₹ value)
- **Time-to-Resolution**: Days from query to outcome
- **Dialect Accuracy**: Speech recognition WER by language

---

## 🤝 Contributing

This is a **public good project**. We welcome contributions from:
- **Developers**: AI/ML, voice tech, backend scaling
- **Legal experts**: Rights database curation, case templates
- **Linguists**: Dialect models, translation accuracy
- **Designers**: Literacy-free UX, accessibility
- **Activists**: User testing in rural communities

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 Legal & Privacy

- **User Consent**: Explicit opt-in for data collection
- **Encryption**: All sensitive data encrypted at rest/transit
- **No Dark Patterns**: Free legal aid is free (no hidden costs)
- **Open Source**: Core logic available for audit
- **GDPR/DPDP Compliant**: Right to deletion, data portability

---

## 🎓 Research & Citations

This project is informed by:
- NALSA State Legal Services Authority Annual Reports
- World Justice Project: "Measuring the Justice Gap"
- Vidhi Centre for Legal Policy: "Legal Aid in India"
- Government of India: myScheme, eCourts, Tele-Law evaluations

---

## 📞 Contact & Support

- **GitHub Issues**: Bug reports, feature requests
- **Email**: [Your contact email]
- **Twitter**: [@NyayaGhost]
- **Documentation**: [Wiki link]

---

## 🌟 Acknowledgments

Built with support from:
- National Legal Services Authority (NALSA)
- Common Service Centers (CSC)
- Open-source AI community
- Rural legal aid volunteers

---

## 📄 License

[Choose appropriate license - suggest AGPL-3.0 for public good projects]

---

> **"कानून है, पर पहुँचाना हमारा काम है"**  
> *(The law exists, but reaching it to people is our job)*

---

### Quick Links
- [Live Demo](#) 
- [Technical Documentation](docs/TECH.md)
- [User Manual](docs/USER_GUIDE.md)
- [API Documentation](docs/API.md)
- [Impact Report 2026](reports/impact-2026.pdf)
