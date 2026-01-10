# Legal Rights & Welfare Schemes Database Structure

## Overview

This document outlines the data structure for NyayaGhost's core knowledge base: the unified Legal Rights + Welfare Schemes database.

---

## 1. Legal Rights Database

### Schema: `legal_rights`

```json
{
  "id": "RIGHT_MGNREGA_001",
  "title": {
    "hindi": "मनरेगा मजदूरी गारंटी",
    "english": "MGNREGA Wage Guarantee",
    "bhojpuri": "मनरेगा मजदूरी के गारंटी"
  },
  "category": "labour",
  "subcategory": "wage_rights",
  "legalBasis": {
    "act": "Mahatma Gandhi National Rural Employment Guarantee Act, 2005",
    "section": "Section 3(2)",
    "article": null,
    "courtRulings": [
      {
        "case": "PUCL v. Union of India (2011)",
        "citation": "WP(C) No. 196/2001",
        "relevance": "Established MGNREGA as legal entitlement"
      }
    ]
  },
  "description": {
    "hindi": "मनरेगा के तहत 15 दिनों के अंदर मजदूरी का भुगतान अनिवार्य है",
    "english": "Wages under MGNREGA must be paid within 15 days of work completion",
    "bhojpuri": "मनरेगा में काम के 15 दिन के अंदर पइसा मिले के चाही"
  },
  "eligibility": {
    "criteria": [
      "Adult member of rural household",
      "Willing to do unskilled manual work",
      "Registered with MGNREGA"
    ],
    "exclusions": [
      "Urban residents (unless in notified areas)",
      "Government employees"
    ]
  },
  "remedies": [
    {
      "type": "administrative",
      "action": "Complaint to Block Development Officer",
      "authority": "BDO Office",
      "timeline": "7 days",
      "successRate": 0.65
    },
    {
      "type": "legal",
      "action": "File writ petition in High Court",
      "authority": "State High Court",
      "timeline": "3-6 months",
      "successRate": 0.80,
      "requiresLawyer": true,
      "nalsaEligible": true
    },
    {
      "type": "grievance",
      "action": "Register complaint on MGNREGA portal",
      "authority": "mgnrega.nic.in",
      "timeline": "14 days",
      "successRate": 0.45
    }
  ],
  "compensation": {
    "available": true,
    "type": "delayed_payment_interest",
    "formula": "0.05% per day after 15 days",
    "maxAmount": null,
    "precedents": [
      {
        "case": "Ramesh Kumar v. State of Bihar",
        "compensation": 5000,
        "delayDays": 90
      }
    ]
  },
  "documentation": {
    "required": [
      "MGNREGA Job Card",
      "Attendance slip/muster roll copy",
      "Bank account details",
      "Aadhaar (optional but helpful)"
    ],
    "optional": [
      "Complaint acknowledgment receipt",
      "Witness statements"
    ]
  },
  "commonScenarios": [
    "मजदूरी नहीं मिली (Wages not received)",
    "देर से भुगतान (Delayed payment)",
    "कम पैसा मिला (Underpayment)",
    "काम नहीं मिल रहा (Work not provided)"
  ],
  "relatedRights": [
    "RIGHT_RTI_001",
    "RIGHT_MINIMUM_WAGE_001"
  ],
  "prevalenceData": {
    "totalCases": 450000,
    "successfulResolutions": 180000,
    "averageResolutionTime": "45 days",
    "statesWithHighIssues": ["Bihar", "Jharkhand", "UP", "Madhya Pradesh"]
  },
  "lastUpdated": "2026-01-01"
}
```

---

## 2. Welfare Schemes Database

### Schema: `welfare_schemes`

```json
{
  "id": "SCHEME_WIDOW_PENSION_001",
  "name": {
    "hindi": "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना",
    "english": "Indira Gandhi National Widow Pension Scheme",
    "bhojpuri": "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना"
  },
  "type": "pension",
  "level": "central", // or "state", "district"
  "ministry": "Ministry of Rural Development",
  "launchDate": "2009-02-02",
  "status": "active",
  "eligibility": {
    "age": {
      "min": 40,
      "max": 59
    },
    "income": {
      "max": 100000,
      "period": "annual",
      "household": true
    },
    "maritalStatus": "widow",
    "otherCriteria": [
      "Must be Below Poverty Line (BPL)",
      "Should not be receiving any other pension"
    ]
  },
  "benefits": {
    "amount": 300,
    "currency": "INR",
    "frequency": "monthly",
    "stateTopUp": {
      "Rajasthan": 500,
      "Delhi": 2500,
      "Maharashtra": 600
    },
    "additionalBenefits": [
      "Free ration card eligibility",
      "Healthcare subsidies under Ayushman Bharat"
    ]
  },
  "applicationProcess": {
    "channels": [
      {
        "type": "online",
        "portal": "https://serviceonline.gov.in",
        "requiresRegistration": true
      },
      {
        "type": "offline",
        "location": "Block Development Office / Municipal Corporation",
        "requiresAppointment": false
      },
      {
        "type": "csc",
        "location": "Common Service Centre",
        "fee": 50
      }
    ],
    "documents": [
      "Aadhaar Card (mandatory)",
      "Husband's Death Certificate",
      "BPL Card",
      "Age Proof (Birth Certificate / School Leaving Certificate)",
      "Bank Passbook with IFSC",
      "Passport Size Photo"
    ],
    "steps": [
      "Obtain application form from Block Office or download online",
      "Fill form with personal and bank details",
      "Attach required documents",
      "Submit to concerned authority",
      "Get acknowledgment receipt",
      "Track application status online"
    ],
    "processingTime": "30-60 days",
    "fee": 0
  },
  "helplines": [
    {
      "type": "toll-free",
      "number": "1800-110-003",
      "language": ["Hindi", "English"],
      "hours": "10 AM - 6 PM (Mon-Fri)"
    }
  ],
  "commonRejectionReasons": [
    "Incomplete documentation",
    "Income above threshold",
    "Already receiving another pension",
    "Age not in range"
  ],
  "relatedSchemes": [
    "SCHEME_FOOD_SECURITY_001",
    "SCHEME_AYUSHMAN_001"
  ],
  "stateVariations": [
    {
      "state": "Rajasthan",
      "name": "Mukhyamantri Ekikrit Pension Yojana",
      "amount": 500,
      "eligibilityAge": { "min": 18, "max": 55 }
    }
  ],
  "statistics": {
    "totalBeneficiaries": 1800000,
    "budgetAllocation": 5400000000,
    "utilizationRate": 0.72,
    "awarenessRate": 0.35
  },
  "lastUpdated": "2026-01-01"
}
```

---

## 3. Case Filing Templates

### Schema: `filing_templates`

```json
{
  "id": "TEMPLATE_FIR_001",
  "type": "FIR",
  "jurisdiction": "all_india",
  "applicableSections": [
    {
      "ipc": "406",
      "description": "Criminal breach of trust",
      "scenarios": ["Wage theft", "Advance not returned"]
    },
    {
      "ipc": "420",
      "description": "Cheating",
      "scenarios": ["Fake job promises", "Fraudulent contracts"]
    }
  ],
  "template": {
    "hindi": "प्रति,\nथाना प्रभारी,\n{police_station_name}\n\nविषय: प्राथमिकी दर्ज करने हेतु\n\nमहोदय,\n\nमैं {complainant_name}, पुत्र/पुत्री {father_name}, निवासी {address}, आपके समक्ष निम्नलिखित शिकायत दर्ज करना चाहता/चाहती हूँ:\n\n{incident_description}\n\nउपरोक्त घटना दिनांक {incident_date} को {incident_location} पर घटित हुई। आरोपी का नाम {accused_name} है।\n\nआपसे निवेदन है कि उपरोक्त विषय में भारतीय दंड संहिता की धारा {ipc_sections} के तहत एफआईआर दर्ज करें।\n\nधन्यवाद,\n{complainant_name}\n{phone}\n{date}",
    "english": "To,\nStation House Officer,\n{police_station_name}\n\nSubject: Filing of FIR\n\nSir/Madam,\n\nI, {complainant_name}, son/daughter of {father_name}, resident of {address}, wish to file the following complaint:\n\n{incident_description}\n\nThe above incident occurred on {incident_date} at {incident_location}. The accused is {accused_name}.\n\nI request you to register an FIR under Section {ipc_sections} of the Indian Penal Code.\n\nThank you,\n{complainant_name}\n{phone}\n{date}"
  },
  "fields": [
    {
      "name": "complainant_name",
      "type": "text",
      "required": true,
      "source": "user_input"
    },
    {
      "name": "father_name",
      "type": "text",
      "required": true,
      "source": "user_input"
    },
    {
      "name": "address",
      "type": "textarea",
      "required": true,
      "source": "aadhaar_or_input"
    },
    {
      "name": "incident_description",
      "type": "textarea",
      "required": true,
      "source": "voice_transcript",
      "aiEnhanced": true
    },
    {
      "name": "incident_date",
      "type": "date",
      "required": true,
      "source": "user_input"
    },
    {
      "name": "incident_location",
      "type": "text",
      "required": true,
      "source": "gps_or_input"
    },
    {
      "name": "accused_name",
      "type": "text",
      "required": false,
      "source": "user_input"
    },
    {
      "name": "ipc_sections",
      "type": "text",
      "required": true,
      "source": "ai_suggested"
    },
    {
      "name": "police_station_name",
      "type": "text",
      "required": true,
      "source": "location_lookup"
    }
  ],
  "submissionMethods": [
    {
      "type": "email",
      "endpoint": "{police_station_email}",
      "format": "pdf"
    },
    {
      "type": "online_portal",
      "url": "https://citizen.mahapolice.gov.in",
      "statesSupported": ["Maharashtra"]
    },
    {
      "type": "in_person",
      "instructions": "Print and submit to nearest police station"
    }
  ],
  "followUpActions": [
    {
      "day": 7,
      "action": "File RTI if no acknowledgment",
      "template": "TEMPLATE_RTI_001"
    },
    {
      "day": 15,
      "action": "Approach Magistrate under Section 156(3) CrPC",
      "template": "TEMPLATE_MAGISTRATE_PETITION_001"
    }
  ]
}
```

---

## 4. User Journey Tracking

### Schema: `user_sessions`

```json
{
  "sessionId": "UUID",
  "userId": "hashed_aadhaar_or_phone",
  "startTime": "2026-01-10T10:30:00Z",
  "language": "hindi",
  "location": {
    "state": "Bihar",
    "district": "Patna",
    "gps": { "lat": 25.5941, "lng": 85.1376 }
  },
  "queries": [
    {
      "timestamp": "2026-01-10T10:31:00Z",
      "voiceInput": "हमार मजदूरी नहीं मिला दो महीना से",
      "processedQuery": "MGNREGA wage payment delay - 2 months",
      "detectedIntent": "wage_delay",
      "matchedRights": ["RIGHT_MGNREGA_001"],
      "matchedSchemes": [],
      "confidence": 0.89
    }
  ],
  "actions": [
    {
      "timestamp": "2026-01-10T10:35:00Z",
      "type": "case_filed",
      "caseId": "NYAYA-2026-001234",
      "filingType": "MGNREGA_complaint",
      "template": "TEMPLATE_BDO_COMPLAINT_001",
      "status": "draft_generated"
    }
  ],
  "consent": {
    "dataCollection": true,
    "smsNotifications": true,
    "sharing": false
  },
  "feedback": {
    "rating": 5,
    "comment": "बहुत अच्छा",
    "timestamp": "2026-01-10T10:40:00Z"
  }
}
```

---

## 5. Impact Metrics

### Schema: `impact_data`

```json
{
  "caseId": "NYAYA-2026-001234",
  "userId": "hashed_user_id",
  "rightDiscovered": "RIGHT_MGNREGA_001",
  "previouslyAware": false,
  "outcome": {
    "status": "resolved",
    "resolutionDate": "2026-02-15",
    "financialBenefit": 12000,
    "currency": "INR",
    "method": "bdo_intervention"
  },
  "timelineEvents": [
    {
      "date": "2026-01-10",
      "event": "Case filed via NyayaGhost"
    },
    {
      "date": "2026-01-17",
      "event": "RTI filed (automated)"
    },
    {
      "date": "2026-02-15",
      "event": "Wages paid + compensation"
    }
  ],
  "justiceGapClosed": 12000
}
```

**Aggregated Metrics**:
```json
{
  "month": "2026-01",
  "totalQueries": 5000,
  "newRightsDiscovered": 4200,
  "casesFiled": 1200,
  "casesResolved": 450,
  "financialImpact": 5400000,
  "averageResolutionTime": 35,
  "topIssues": [
    { "type": "MGNREGA_delay", "count": 850 },
    { "type": "ration_card", "count": 650 },
    { "type": "pension_delay", "count": 400 }
  ],
  "stateWise": {
    "Bihar": { "queries": 1200, "impact": 1440000 },
    "Jharkhand": { "queries": 900, "impact": 1080000 }
  }
}
```

---

## 6. Sample Data Seeding

### Initial Rights Database (Top 50 Issues)

```javascript
const initialRights = [
  {
    id: "RIGHT_MGNREGA_001",
    keywords: ["मनरेगा", "मजदूरी", "मजदूर", "MGNREGA", "wage", "payment delay"],
    // ... full schema
  },
  {
    id: "RIGHT_MINIMUM_WAGE_001",
    keywords: ["न्यूनतम मजदूरी", "कम पैसा", "minimum wage", "underpayment"],
    // ...
  },
  {
    id: "RIGHT_FREE_LEGAL_AID_001",
    keywords: ["मुफ्त वकील", "नालसा", "NALSA", "free lawyer", "legal aid"],
    // ...
  },
  // Add 47 more common issues
];
```

### Initial Schemes Database (Top 100 Schemes)

```javascript
const initialSchemes = [
  // Central Schemes
  { id: "SCHEME_PMJAY_001", /* Ayushman Bharat */ },
  { id: "SCHEME_WIDOW_PENSION_001", /* as above */ },
  { id: "SCHEME_DISABILITY_001", /* Disability Pension */ },
  { id: "SCHEME_PMKVY_001", /* Skill Development */ },
  // State Schemes (top 5 states)
  { id: "SCHEME_RAJ_PENSION_001", state: "Rajasthan" },
  { id: "SCHEME_BIHAR_FOOD_001", state: "Bihar" },
  // ...
];
```

---

## 7. API Integration Points

### myScheme API Integration
```javascript
// Fetch schemes based on user profile
async function fetchApplicableSchemes(userProfile) {
  const response = await fetch('https://www.myscheme.gov.in/api/schemes', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.MYSCHEME_API_KEY}` },
    body: JSON.stringify({
      age: userProfile.age,
      gender: userProfile.gender,
      state: userProfile.state,
      income: userProfile.income
    })
  });
  return await response.json();
}
```

### eCourts Integration (Case Status)
```javascript
async function trackCaseStatus(caseNumber) {
  const response = await fetch(`https://services.ecourts.gov.in/api/case/${caseNumber}`);
  return await response.json();
}
```

---

## 8. Search & Matching Algorithm

### Hybrid Approach

1. **Keyword Matching** (Fast, for exact matches)
```javascript
function keywordMatch(query, rightsDB) {
  return rightsDB.filter(right => 
    right.keywords.some(kw => query.toLowerCase().includes(kw))
  );
}
```

2. **Semantic Search** (AI-powered, for fuzzy matches)
```javascript
async function semanticMatch(query, rightsDB) {
  const embedding = await getEmbedding(query);
  return rightsDB.map(right => ({
    ...right,
    similarity: cosineSimilarity(embedding, right.embedding)
  })).filter(r => r.similarity > 0.7);
}
```

3. **Entity Extraction** (NLP for context)
```javascript
async function extractEntities(query) {
  // Extract: person names, locations, amounts, dates
  return {
    parties: ["Employer Name"],
    location: "Patna",
    amount: 12000,
    date: "2025-11-01"
  };
}
```

---

## Next Steps

1. **Populate Database**: Add 500+ rights and 1000+ schemes
2. **Build APIs**: Implement CRUD operations for each schema
3. **AI Integration**: Connect RightFinder to GPT-4/Gemini with RAG
4. **Testing**: Validate with real user queries
5. **Localization**: Translate all content to 22 languages

---

**This database structure is the foundation for bridging the justice gap. 🕊️**
