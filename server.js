require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// IPC Sections Database
const ipcSections = {
  assault: { section: '323', description: 'साधारण चोट पहुंचाना', punishment: '1 साल तक की सजा' },
  theft: { section: '379', description: 'चोरी', punishment: '3 साल तक की सजा' },
  rape: { section: '376', description: 'बलात्कार', punishment: '7 साल से लेकर उम्रकैद' },
  murder: { section: '302', description: 'हत्या', punishment: 'उम्रकैद या मौत की सजा' },
  dowry: { section: '498A', description: 'दहेज उत्पीड़न', punishment: '3 साल तक की सजा' },
  domestic_violence: { section: '498A', description: 'घरेलू हिंसा', punishment: '3 साल तक की सजा' },
  cheating: { section: '420', description: 'धोखाधड़ी', punishment: '7 साल तक की सजा' },
  kidnapping: { section: '363', description: 'अपहरण', punishment: '7 साल तक की सजा' },
  harassment: { section: '354', description: 'छेड़छाड़', punishment: '2 साल तक की सजा' },
  defamation: { section: '500', description: 'मानहानि', punishment: '2 साल तक की सजा' }
};

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Enhanced Legal Rights Database (expandable)
const legalDB = {
  'MGNREGA पेमेंट डिले': {
    id: 'RIGHT_MGNREGA_001',
    title: 'MGNREGA Wage Payment Guarantee',
    description: 'मजदूरी का 15 दिनों के अंदर भुगतान होना चाहिए',
    legalBasis: 'MGNREGA Act 2005, Section 3(2)',
    remedies: [
      'Block Development Officer को शिकायत करें',
      'MGNREGA Portal पर complaint दर्ज करें',
      'NALSA से मुफ्त कानूनी सहायता लें'
    ],
    compensation: 'Delayed payment के लिए 0.05% प्रति दिन ब्याज',
    confidence: 0.92
  },
  'ration card': {
    id: 'SCHEME_RATION_001',
    title: 'National Food Security Act - Ration Card',
    description: 'राशन कार्ड के लिए आवेदन करें',
    legalBasis: 'National Food Security Act, 2013',
    remedies: [
      'नजदीकी Fair Price Shop से form लें',
      'Online apply करें: state food portal',
      'Required documents: Aadhaar, Address proof, Income certificate'
    ],
    benefits: 'Subsidized food grains - Rice at ₹3/kg, Wheat at ₹2/kg',
    confidence: 0.88
  },
  'widow pension': {
    id: 'SCHEME_WIDOW_PENSION_001',
    title: 'Indira Gandhi National Widow Pension Scheme',
    description: 'विधवा महिलाओं के लिए ₹300-2500 मासिक पेंशन',
    legalBasis: 'Central Scheme under NSAP',
    eligibility: 'Age 40-59, BPL, No other pension',
    remedies: [
      'Block Development Office में आवेदन करें',
      'Documents: Death certificate, BPL card, Aadhaar, Bank passbook'
    ],
    benefits: 'Monthly pension: ₹300 (Central) + State top-up',
    confidence: 0.85
  },
  'मुफ्त वकील': {
    id: 'RIGHT_FREE_LEGAL_AID_001',
    title: 'NALSA Free Legal Aid',
    description: 'सभी गरीब लोगों को मुफ्त वकील मिलने का अधिकार है',
    legalBasis: 'Legal Services Authorities Act, 1987',
    eligibility: 'SC/ST, Women, Children, Disabled, Income < ₹3 lakh',
    remedies: [
      'District Legal Services Authority (DLSA) में जाएं',
      'Call NALSA helpline: 15100',
      'Online apply: nalsa.gov.in'
    ],
    benefits: 'Free lawyer for civil and criminal cases',
    confidence: 0.95
  }
};

// Fuzzy search function for better matching
function findMatchingRights(query) {
  const lowerQuery = query.toLowerCase();
  const matches = [];
  
  for (const [key, right] of Object.entries(legalDB)) {
    if (lowerQuery.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(lowerQuery)) {
      matches.push(right);
    }
  }
  
  // Keyword-based matching for common terms
  const keywords = {
    'मजदूरी|wage|payment|salary': 'MGNREGA पेमेंट डिले',
    'राशन|ration|food': 'ration card',
    'पेंशन|pension|विधवा|widow': 'widow pension',
    'वकील|lawyer|legal aid|नालसा|nalsa': 'मुफ्त वकील'
  };
  
  for (const [pattern, key] of Object.entries(keywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lowerQuery) && legalDB[key]) {
      if (!matches.find(m => m.id === legalDB[key].id)) {
        matches.push(legalDB[key]);
      }
    }
  }
  
  return matches.length > 0 ? matches : [
    {
      id: 'FALLBACK',
      title: 'संबंधित अधिकार नहीं मिला',
      description: 'हम आपकी मदद के लिए और जानकारी इकट्ठा कर रहे हैं',
      remedies: ['NALSA helpline: 15100 पर call करें'],
      confidence: 0.2
    }
  ];
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Legal Advisor API
app.post('/api/legal-advice', async (req, res) => {
  try {
    const { query, language = 'hindi' } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`[Legal Advice] Query: "${query}" | Language: ${language}`);
    
    // Analyze query for complaint type
    const analysis = analyzeQuery(query);
    
    // Generate AI advice
    const advice = await generateLegalAdvice(query, language, analysis);
    
    res.json({
      query,
      language,
      analysis,
      advice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Legal Advice error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      fallback: getFallbackAdvice(req.body.query)
    });
  }
});

// Analyze query to determine issue type
function analyzeQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  let issueType = 'general';
  let ipcSection = null;
  let needsPoliceComplaint = false;
  let relevantPortal = null;
  
  // Check for police complaint scenarios
  if (/(चोरी|theft|stolen)/i.test(lowerQuery)) {
    issueType = 'theft';
    ipcSection = ipcSections.theft;
    needsPoliceComplaint = true;
  } else if (/(मारपीट|assault|fight|beat)/i.test(lowerQuery)) {
    issueType = 'assault';
    ipcSection = ipcSections.assault;
    needsPoliceComplaint = true;
  } else if (/(बलात्कार|rape|sexual)/i.test(lowerQuery)) {
    issueType = 'rape';
    ipcSection = ipcSections.rape;
    needsPoliceComplaint = true;
  } else if (/(धोखाधड़ी|cheating|fraud|scam)/i.test(lowerQuery)) {
    issueType = 'cheating';
    ipcSection = ipcSections.cheating;
    needsPoliceComplaint = true;
  } else if (/(छेड़छाड़|harassment|molest)/i.test(lowerQuery)) {
    issueType = 'harassment';
    ipcSection = ipcSections.harassment;
    needsPoliceComplaint = true;
  } else if (/(दहेज|dowry)/i.test(lowerQuery)) {
    issueType = 'dowry';
    ipcSection = ipcSections.dowry;
    needsPoliceComplaint = true;
  } else if (/(हिंसा|violence|domestic)/i.test(lowerQuery)) {
    issueType = 'domestic_violence';
    ipcSection = ipcSections.domestic_violence;
    needsPoliceComplaint = true;
  }
  
  // Check for government services
  if (/(राशन|ration)/i.test(lowerQuery)) {
    issueType = 'ration_card';
    relevantPortal = {
      name: 'National Food Security Portal',
      url: 'https://nfsa.gov.in/',
      description: 'राशन कार्ड के लिए ऑनलाइन आवेदन करें'
    };
  } else if (/(पेंशन|pension)/i.test(lowerQuery)) {
    issueType = 'pension';
    relevantPortal = {
      name: 'NSAP Portal',
      url: 'https://nsap.nic.in/',
      description: 'पेंशन योजना के लिए आवेदन करें'
    };
  } else if (/(मजदूरी|wage|mgnrega|नरेगा)/i.test(lowerQuery)) {
    issueType = 'mgnrega';
    relevantPortal = {
      name: 'MGNREGA Portal',
      url: 'https://nrega.nic.in/',
      description: 'मजदूरी शिकायत दर्ज करें'
    };
  } else if (/(आधार|aadhaar|aadhar)/i.test(lowerQuery)) {
    relevantPortal = {
      name: 'UIDAI Portal',
      url: 'https://uidai.gov.in/',
      description: 'आधार कार्ड सेवाएं'
    };
  } else if (/(pan|पैन)/i.test(lowerQuery)) {
    relevantPortal = {
      name: 'Income Tax Portal',
      url: 'https://www.incometax.gov.in/iec/foportal',
      description: 'PAN कार्ड के लिए आवेदन करें'
    };
  }
  
  return {
    issueType,
    ipcSection,
    needsPoliceComplaint,
    relevantPortal
  };
}

// Generate legal advice using AI (with fallback)
async function generateLegalAdvice(query, language, analysis) {
  // Try to use Gemini API if available
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (geminiKey && geminiKey !== 'your_gemini_key_here') {
    try {
      const languageNames = {
        hindi: 'Hindi (हिंदी)',
        english: 'English',
        kannada: 'Kannada (ಕನ್ನಡ)',
        bhojpuri: 'Bhojpuri (भोजपुरी)',
        tamil: 'Tamil (தமிழ்)',
        telugu: 'Telugu (తెలుగు)'
      };
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a legal advisor for Indian citizens. Respond ONLY in ${languageNames[language] || 'Hindi'}.
                
User's problem: ${query}

Issue type: ${analysis.issueType}

Provide:
1. Brief legal advice (2-3 sentences)
2. Immediate steps to take
3. Rights the person has
4. Where to seek help

IMPORTANT: Write the entire response in ${languageNames[language] || 'Hindi'}. Keep response simple and actionable for common people.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );
      
      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        return {
          text: data.candidates[0].content.parts[0].text,
          source: 'ai',
          confidence: 0.9
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }
  }
  
  // Fallback to rule-based advice
  return getFallbackAdvice(query, analysis, language);
}

// Fallback advice when AI is not available
function getFallbackAdvice(query, analysis = {}, language = 'hindi') {
  const { issueType, ipcSection, needsPoliceComplaint, relevantPortal } = analysis;
  
  let advice = {
    text: '',
    steps: [],
    rights: [],
    helpResources: []
  };
  
  // Language-specific advice templates
  const adviceTemplates = {
    hindi: {
      theft: {
        text: 'चोरी के मामले में आपको तुरंत पुलिस में शिकायत दर्ज करानी चाहिए।',
        steps: [
          '1. नजदीकी पुलिस स्टेशन जाएं',
          '2. FIR दर्ज कराएं (IPC धारा 379)',
          '3. चोरी की गई वस्तुओं की सूची बनाएं',
          '4. FIR की कॉपी जरूर लें'
        ],
        rights: ['आपको FIR दर्ज कराने का अधिकार है', 'पुलिस मना नहीं कर सकती']
      },
      assault: {
        text: 'मारपीट के मामले में मेडिकल जांच करवाएं और पुलिस में शिकायत दर्ज करें।',
        steps: [
          '1. तुरंत अस्पताल जाएं और MLC (Medico-Legal Case) बनवाएं',
          '2. पुलिस में FIR दर्ज करें (IPC धारा 323)',
          '3. घायलों की तस्वीरें रखें',
          '4. गवाहों के नाम-पते लिखें'
        ],
        rights: ['चोट लगने पर मुफ्त इलाज का अधिकार', 'FIR दर्ज कराने का अधिकार']
      },
      ration_card: {
        text: 'राशन कार्ड बनवाने के लिए आप ऑनलाइन या ऑफलाइन आवेदन कर सकते हैं।',
        steps: [
          '1. अपने राज्य के Food & Supply विभाग की वेबसाइट पर जाएं',
          '2. Required documents: आधार, पते का प्रमाण, आय प्रमाण',
          '3. Application form भरें',
          '4. 30 दिन में कार्ड मिल जाएगा'
        ]
      },
      pension: {
        text: 'पेंशन योजनाओं के लिए Block Development Office में आवेदन करें।',
        steps: [
          '1. अपनी उम्र और श्रेणी के अनुसार योजना चुनें',
          '2. BDO office में आवेदन फॉर्म जमा करें',
          '3. Documents: आधार, बैंक पासबुक, आय प्रमाण',
          '4. Status track करें: nsap.nic.in'
        ]
      },
      mgnrega: {
        text: 'MGNREGA के तहत आपको 15 दिन में मजदूरी पाने का अधिकार है।',
        steps: [
          '1. Block Development Officer को लिखित शिकायत दें',
          '2. MGNREGA portal पर complaint दर्ज करें',
          '3. Delayed payment पर 0.05% daily interest मिलेगा',
          '4. NALSA से मुफ्त कानूनी मदद लें'
        ],
        rights: ['15 दिन में payment का अधिकार', 'Delay पर interest का अधिकार']
      },
      default: {
        text: 'आपकी समस्या के लिए कानूनी सहायता उपलब्ध है।',
        steps: [
          '1. NALSA helpline पर call करें: 15100',
          '2. District Legal Services Authority में जाएं',
          '3. मुफ्त वकील की मदद लें',
          '4. Online complaint: nalsa.gov.in'
        ]
      }
    },
    kannada: {
      theft: {
        text: 'ಕಳ್ಳತನದ ಪ್ರಕರಣದಲ್ಲಿ ನೀವು ತಕ್ಷಣವೇ ಪೊಲೀಸರಲ್ಲಿ ದೂರು ದಾಖಲಿಸಬೇಕು।',
        steps: [
          '1. ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಹೋಗಿ',
          '2. FIR ದಾಖಲಿಸಿ (IPC ವಿಭಾಗ 379)',
          '3. ಕದ್ದ ವಸ್ತುಗಳ ಪಟ್ಟಿ ಮಾಡಿ',
          '4. FIR ನಕಲು ತೆಗೆದುಕೊಳ್ಳಿ'
        ],
        rights: ['FIR ದಾಖಲಿಸುವ ಹಕ್ಕು ನಿಮಗಿದೆ', 'ಪೊಲೀಸರು ನಿರಾಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ']
      },
      assault: {
        text: 'ಹೊಡೆದಾಟದ ಪ್ರಕರಣದಲ್ಲಿ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಮಾಡಿಸಿ ಮತ್ತು ಪೊಲೀಸರಲ್ಲಿ ದೂರು ದಾಖಲಿಸಿ।',
        steps: [
          '1. ತಕ್ಷಣವೇ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ MLC ಮಾಡಿಸಿ',
          '2. ಪೊಲೀಸರಲ್ಲಿ FIR ದಾಖಲಿಸಿ (IPC ವಿಭಾಗ 323)',
          '3. ಗಾಯಗಳ ಫೋಟೋ ತೆಗೆಯಿರಿ',
          '4. ಸಾಕ್ಷಿದಾರರ ವಿವರಗಳನ್ನು ಬರೆಯಿರಿ'
        ],
        rights: ['ಗಾಯಕ್ಕೆ ಉಚಿತ ಚಿಕಿತ್ಸೆಯ ಹಕ್ಕು', 'FIR ದಾಖಲಿಸುವ ಹಕ್ಕು']
      },
      ration_card: {
        text: 'ರೇಷನ್ ಕಾರ್ಡ್ ಮಾಡಿಸಲು ಆನ್‌ಲೈನ್ ಅಥವಾ ಆಫ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು।',
        steps: [
          '1. ನಿಮ್ಮ ರಾಜ್ಯದ Food & Supply ವಿಭಾಗದ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಹೋಗಿ',
          '2. ಬೇಕಾದ ದಾಖಲೆಗಳು: ಆಧಾರ್, ವಿಳಾಸ ಪುರಾವೆ, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ',
          '3. ಅರ್ಜಿ ಫಾರಂ ಭರ್ತಿ ಮಾಡಿ',
          '4. 30 ದಿನಗಳಲ್ಲಿ ಕಾರ್ಡ್ ಸಿಗುತ್ತದೆ'
        ]
      },
      default: {
        text: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಕಾನೂನು ಸಹಾಯ ಲಭ್ಯವಿದೆ।',
        steps: [
          '1. NALSA ಹೆಲ್ಪ್‌ಲೈನ್‌ಗೆ ಕರೆ ಮಾಡಿ: 15100',
          '2. District Legal Services Authority ಗೆ ಭೇಟಿ ನೀಡಿ',
          '3. ಉಚಿತ ವಕೀಲರ ಸಹಾಯ ಪಡೆಯಿರಿ',
          '4. ಆನ್‌ಲೈನ್ ದೂರು: nalsa.gov.in'
        ]
      }
    },
    english: {
      theft: {
        text: 'In case of theft, you should immediately file a police complaint.',
        steps: [
          '1. Go to nearest police station',
          '2. File an FIR (IPC Section 379)',
          '3. Make a list of stolen items',
          '4. Take a copy of the FIR'
        ],
        rights: ['You have the right to file an FIR', 'Police cannot refuse']
      },
      assault: {
        text: 'In case of assault, get medical examination and file a police complaint.',
        steps: [
          '1. Go to hospital immediately and get MLC done',
          '2. File FIR at police station (IPC Section 323)',
          '3. Take photos of injuries',
          '4. Note down witness details'
        ],
        rights: ['Right to free medical treatment for injuries', 'Right to file FIR']
      },
      ration_card: {
        text: 'You can apply for a ration card online or offline.',
        steps: [
          '1. Visit your state Food & Supply department website',
          '2. Required documents: Aadhaar, address proof, income certificate',
          '3. Fill application form',
          '4. Card will be issued within 30 days'
        ]
      },
      default: {
        text: 'Legal assistance is available for your problem.',
        steps: [
          '1. Call NALSA helpline: 15100',
          '2. Visit District Legal Services Authority',
          '3. Get free lawyer assistance',
          '4. File online complaint: nalsa.gov.in'
        ]
      }
    }
  };
  
  // Determine language from frontend parameter
  const lang = language || 'hindi';
  const templates = adviceTemplates[lang] || adviceTemplates.hindi;
  const template = templates[issueType] || templates.default;
  
  advice.text = template.text;
  advice.steps = template.steps;
  advice.rights = template.rights || [];
  
  // Add common help resources
  advice.helpResources = [
    { name: 'NALSA Helpline', contact: '15100', description: 'मुफ्त कानूनी सहायता' },
    { name: 'Women Helpline', contact: '181', description: 'महिला हेल्पलाइन' },
    { name: 'Child Helpline', contact: '1098', description: 'बाल हेल्पलाइन' },
    { name: 'Police', contact: '100', description: 'आपातकालीन पुलिस सेवा' }
  ];
  
  return {
    ...advice,
    source: 'fallback',
    confidence: 0.75
  };
}

// Find nearest police stations (mock data - can be integrated with real API)
app.post('/api/nearest-police-station', (req, res) => {
  const { latitude, longitude, state, district } = req.body;
  
  // Mock data - in production, integrate with real police station database
  const policeStations = [
    {
      name: 'साहिबगंज पुलिस स्टेशन',
      address: 'Main Road, District Center',
      phone: '0612-2234567',
      distance: '2.3 km',
      mapsUrl: 'https://maps.google.com/?q=police+station'
    },
    {
      name: 'कोतवाली पुलिस स्टेशन',
      address: 'Gandhi Maidan, City Center',
      phone: '0612-2234568',
      distance: '3.5 km',
      mapsUrl: 'https://maps.google.com/?q=police+station'
    },
    {
      name: 'महिला थाना',
      address: 'Near Railway Station',
      phone: '0612-2234569',
      distance: '4.1 km',
      mapsUrl: 'https://maps.google.com/?q=police+station',
      type: 'Women Police Station'
    }
  ];
  
  res.json({
    success: true,
    stations: policeStations,
    count: policeStations.length
  });
});

// RightFinder API
app.post('/api/rightfinder', (req, res) => {
  try {
    const { query, language = 'hindi', location } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`[RightFinder] Query: "${query}" | Language: ${language}`);
    
    const matches = findMatchingRights(query);
    
    res.json({
      query,
      language,
      matches,
      count: matches.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RightFinder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ghost Filing API
app.post('/api/ghostfiling', (req, res) => {
  try {
    const { caseType, userDetails, incident, consent } = req.body;
    
    if (!consent) {
      return res.status(400).json({ error: 'User consent required' });
    }
    
    const caseId = 'NYAYA-' + Date.now();
    
    console.log(`[GhostFiling] Case filed: ${caseId} | Type: ${caseType}`);
    
    const caseData = {
      caseId,
      caseType: caseType || 'general_complaint',
      status: 'draft_generated',
      filedAt: new Date().toISOString(),
      userDetails: {
        name: userDetails?.name || 'Anonymous',
        // Never log sensitive data like Aadhaar
      },
      incident: incident || {},
      nextSteps: [
        'Document has been generated',
        'Review and submit to authority',
        'You will receive SMS updates'
      ]
    };
    
    res.json({
      success: true,
      caseData,
      message: 'केस सफलतापूर्वक दर्ज हुआ'
    });
  } catch (error) {
    console.error('GhostFiling error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scheme Finder API (future integration with myScheme)
app.post('/api/schemefinder', (req, res) => {
  const { age, gender, state, income } = req.body;
  
  // Placeholder for myScheme API integration
  const schemes = [
    {
      id: 'SCHEME_PMJAY_001',
      name: 'Ayushman Bharat',
      eligible: income < 500000,
      benefits: 'Free healthcare up to ₹5 lakh'
    }
  ];
  
  res.json({ schemes });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Something went wrong',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     NyayaGhost Backend Server         ║
║                                       ║
║  Port: ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}      ║
║  Status: ✓ Running                    ║
╚═══════════════════════════════════════╝
  `);
});