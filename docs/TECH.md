# Technical Architecture Documentation

## System Design Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Layer                        │
│  (Voice Input in Bhojpuri/Hindi/English)           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│             Frontend PWA (script.js)                │
│  - Web Speech API (Recognition + Synthesis)         │
│  - Lottie Animations                                │
│  - Offline-first Service Worker                     │
│  - Webcam Aadhaar Scanning                          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│            Backend API (server.js)                  │
│  - Express.js REST endpoints                        │
│  - CORS enabled for PWA                             │
└──────────────────┬──────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
┌─────▼─────┐          ┌────────▼────────┐
│ AI Engine │          │  Data Layer     │
│ (Future)  │          │  - Legal DB     │
│           │          │  - Schemes DB   │
│ - GPT-4   │          │  - User Data    │
│ - Gemini  │          │  - Case Files   │
└───────────┘          └─────────────────┘
      │                         │
      │                         │
┌─────▼─────────────────────────▼─────┐
│      External Integrations          │
│  - NALSA APIs                       │
│  - myScheme Portal                  │
│  - eCourts                          │
│  - SMS Gateway                      │
│  - Aadhaar eKYC                     │
└─────────────────────────────────────┘
```

---

## Core Components

### 1. Voice Recognition System

**Technology**: Web Speech API  
**Supported Languages**: 
- Hindi (hi-IN) ✅
- English (en-US) ✅
- Bhojpuri (fallback to hi-IN, needs custom model) 🔄

**Key Features**:
- Continuous listening mode
- Interim results for real-time feedback
- Error handling with user-friendly messages
- Dynamic language switching

**Code Location**: `script.js:46-80`

**Limitations**:
- Requires internet connection (cloud-based recognition)
- Limited dialect support for regional languages
- Browser compatibility (Chrome/Edge recommended)

**Future Enhancements**:
- Offline speech recognition using TensorFlow.js
- Custom acoustic models for Bhojpuri/Maithili/Magahi
- Noise cancellation for rural environments

---

### 2. RightFinder Engine

**Purpose**: Maps natural language queries to legal rights and welfare schemes

**Current Implementation**: Simple dictionary lookup  
**Location**: `server.js:7-16`

```javascript
const legalDB = {
  'MGNREGA पेमेंट डिले': 'मजदूरी का 15 दिनों के अंदर भुगतान होना चाहिए'
};
```

**Planned Architecture**:

```
User Query
    ↓
NLP Processing (Intent Classification)
    ↓
Entity Extraction (Location, Amount, Parties)
    ↓
Legal Knowledge Graph Search
    ↓
Multi-dimensional Matching:
  - Legal Rights (IPC, CrPC, Constitution)
  - Welfare Schemes (Central + State)
  - Remedies (NALSA, RTI, Lok Adalat)
    ↓
Ranked Results with Confidence Scores
```

**Key Databases Needed**:
- Indian Penal Code (IPC) provisions
- NALSA free legal aid eligibility matrix
- myScheme API integration (7000+ schemes)
- State-wise welfare programs
- Supreme Court/High Court judgment precedents

**Implementation Strategy**:
1. **Phase 1**: Expand dictionary to 500+ common issues
2. **Phase 2**: Integrate LLM (GPT-4/Gemini) with RAG (Retrieval Augmented Generation)
3. **Phase 3**: Fine-tune model on Indian legal corpus

---

### 3. Ghost Filing Engine

**Purpose**: Automated legal document generation and submission

**Current Status**: Simulation only  
**Location**: `server.js:18-22`

**Document Types to Support**:
- FIR (First Information Report)
- Legal Notice under various acts
- RTI (Right to Information) application
- Consumer complaint
- Labour court petition
- NALSA legal aid application
- Pension scheme applications
- Ration card forms

**Architecture**:

```
User Consent + Data Collection
    ↓
Template Selection (based on issue type)
    ↓
Dynamic Field Population:
  - User details (from Aadhaar/voice)
  - Legal grounds (from RightFinder)
  - Jurisdiction (auto-detected)
    ↓
PDF/Form Generation
    ↓
Encryption & Digital Signature
    ↓
Submission via:
  - Email to authorities
  - Web portal upload
  - SMS-based filing (future)
    ↓
Acknowledgment + Case Tracking ID
```

**Critical Requirements**:
- Legal validity of AI-generated documents
- Digital signature integration (Aadhaar eSign)
- Audit trail for every filed case
- Privacy protection (GDPR/DPDP compliance)

---

### 4. Aadhaar Scanning Module

**Purpose**: Rapid identity verification for form filling

**Technology**: 
- `getUserMedia()` API for webcam
- Tesseract.js for OCR (planned)
- Canvas API for image capture

**Location**: `script.js:190-230`, `index.html:50-56`

**Current Capabilities**:
- Webcam access with environment-facing camera
- Image capture to canvas

**Needed Enhancements**:
- QR code scanning (Aadhaar QR contains XML)
- OCR for text extraction (name, DOB, address)
- Integration with UIDAI's Aadhaar eKYC API
- Consent management for data usage

**Privacy Safeguards**:
- No server storage of Aadhaar images
- Client-side processing only
- Explicit user consent
- Compliance with Aadhaar Act, 2016

---

### 5. Multilingual TTS (Text-to-Speech)

**Purpose**: Audio readback for illiterate users

**Technology**: `SpeechSynthesis` API  
**Location**: `script.js:68-72`

**Supported Voices**:
- Hindi (hi-IN)
- English (en-US)
- Regional dialects (limited)

**Critical for UX**:
- Read aloud legal rights discovered
- Audio step-by-step filing instructions
- Status updates in user's dialect

**Challenges**:
- Browser voice quality varies
- Limited natural-sounding Indic voices
- May require server-side TTS (Google/AWS)

---

## Data Models

### User Session
```javascript
{
  sessionId: String,
  language: "bhojpuri" | "hindi" | "english",
  timestamp: Date,
  location: { lat, lng, district, state },
  consentGiven: Boolean
}
```

### Legal Query
```javascript
{
  queryId: String,
  userQuery: String (raw voice transcript),
  detectedIntent: String,
  entities: {
    issueType: String,
    parties: [String],
    amount: Number,
    location: String
  },
  matchedRights: [
    {
      rightId: String,
      title: String,
      description: String,
      legalBasis: String, // IPC Section, Article, Act
      remedies: [String],
      confidence: Number
    }
  ]
}
```

### Case Filing
```javascript
{
  caseId: String,
  userId: String (hashed),
  filingType: "FIR" | "RTI" | "Legal Notice" | "Scheme Application",
  generatedDocument: {
    pdfUrl: String,
    textContent: String,
    signatureHash: String
  },
  status: "draft" | "filed" | "acknowledged" | "resolved",
  timeline: [
    {
      date: Date,
      event: String,
      actor: String
    }
  ],
  authority: {
    name: String,
    contact: String,
    jurisdiction: String
  }
}
```

---

## API Endpoints

### POST /api/rightfinder
**Purpose**: Identify legal rights from natural language query

**Request**:
```json
{
  "query": "मेरी मजदूरी नहीं मिली",
  "language": "hindi",
  "location": "Patna, Bihar"
}
```

**Response**:
```json
{
  "rights": [
    {
      "id": "MGNREGA_WAGE_DELAY",
      "title": "MGNREGA Payment Guarantee",
      "description": "Wages must be paid within 15 days",
      "legalBasis": "MGNREGA Act 2005, Section 3(2)",
      "remedies": [
        "File complaint with Block Development Officer",
        "Apply for compensation for delayed payment",
        "Contact NALSA for free legal aid"
      ],
      "confidence": 0.92
    }
  ],
  "suggestedActions": [
    "File RTI for wage records",
    "Register complaint on MGNREGA portal"
  ]
}
```

### POST /api/ghostfiling
**Purpose**: Generate and file legal documents

**Request**:
```json
{
  "caseType": "FIR",
  "userDetails": {
    "name": "Ramesh Kumar",
    "aadhaar": "hashed",
    "address": "...",
    "phone": "..."
  },
  "incident": {
    "type": "wage_theft",
    "description": "...",
    "date": "2026-01-05",
    "parties": ["Employer Name"]
  },
  "consent": true
}
```

**Response**:
```json
{
  "success": true,
  "caseId": "NYAYA-2026-001234",
  "documentUrl": "https://...",
  "filedWith": "Patna Police Station",
  "acknowledgmentNumber": "FIR-2026-001234",
  "nextSteps": [
    "You'll receive SMS updates",
    "RTI will be filed on Day 7 if no action",
    "Lok Adalat referral on Day 15"
  ]
}
```

---

## Security & Privacy

### Encryption
- **At Rest**: AES-256 for user data
- **In Transit**: TLS 1.3 for all APIs
- **Aadhaar Data**: Never stored, only processed client-side

### Authentication
- **Current**: Sessionless (stateless queries)
- **Future**: JWT with Aadhaar-based login

### Compliance
- **Aadhaar Act 2016**: Section 8 (consent), Section 29 (no storage)
- **Digital Personal Data Protection Act 2023**: Right to erasure, data portability
- **IT Act 2000**: Section 43A (reasonable security practices)

---

## Performance Metrics

### Target Benchmarks
- **Voice Recognition Latency**: < 2 seconds
- **RightFinder Response Time**: < 3 seconds
- **Document Generation**: < 5 seconds
- **PWA Load Time**: < 1 second (cached)
- **Offline Functionality**: 100% UI, degraded AI features

### Scalability
- **Current**: Single Node.js server
- **Phase 2**: Microservices (separate RightFinder, Filing, Notification services)
- **Phase 3**: Kubernetes deployment with auto-scaling

---

## Dependencies

### Frontend
- Vanilla JavaScript (no framework for performance)
- Lottie-web (animations)
- Tesseract.js (planned for OCR)

### Backend
- Express.js 5.x
- dotenv (environment config)
- cors (cross-origin support)

### Future Integrations
- OpenAI API / Google Gemini (AI)
- MongoDB/PostgreSQL (persistent storage)
- Redis (caching)
- Twilio (SMS notifications)
- AWS S3 (document storage)

---

## Testing Strategy

### Unit Tests
- Voice recognition error handling
- RightFinder query parsing
- Document generation logic

### Integration Tests
- End-to-end case filing flow
- External API connectivity
- PWA offline mode

### User Testing
- Rural usability studies
- Dialect accuracy testing
- Accessibility compliance (WCAG 2.1)

---

## Deployment

### Current
- Frontend: Static hosting (GitHub Pages, Netlify)
- Backend: Heroku/Railway (single instance)

### Production-Ready
- Frontend: Cloudflare CDN
- Backend: AWS EC2/ECS with load balancer
- Database: RDS (PostgreSQL)
- File Storage: S3 with encryption
- CDN: CloudFront for assets

---

## Monitoring & Analytics

### Key Metrics to Track
- Daily active users (by language/state)
- Query success rate (% finding relevant rights)
- Filing completion rate
- Justice gap closure (₹ benefits accessed)
- User retention (return visits)

### Tools
- Google Analytics (anonymized)
- Custom event tracking (case filed, right discovered)
- Error logging (Sentry)
- Uptime monitoring (UptimeRobot)

---

## Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guide
- Branch naming conventions
- PR review process
- Development environment setup

---

## License

[Project license - suggest AGPL-3.0 for public good]

