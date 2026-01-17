require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Indian Laws API Configuration
const INDIAN_LAWS_API = 'https://api.indiankanoon.org';

// Function to fetch real legal sections from Indian Laws API
async function fetchLegalSection(actName, sectionNumber) {
  try {
    // Indian Kanoon API search
    const searchQuery = `${actName} section ${sectionNumber}`;
    const response = await fetch(`https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(searchQuery)}&pagenum=0`);
    
    if (response.ok) {
      const data = await response.json();
      return data.docs ? data.docs[0] : null;
    }
  } catch (error) {
    console.error('Error fetching from Indian Laws API:', error);
  }
  return null;
}

// IPC Sections Database (with API integration capability)
const ipcSections = {
  assault: { 
    section: '323', 
    description: 'साधारण चोट पहुंचाना', 
    punishment: '1 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  theft: { 
    section: '379', 
    description: 'चोरी', 
    punishment: '3 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  rape: { 
    section: '376', 
    description: 'बलात्कार', 
    punishment: '7 साल से लेकर उम्रकैद',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  murder: { 
    section: '302', 
    description: 'हत्या', 
    punishment: 'उम्रकैद या मौत की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  dowry: { 
    section: '498A', 
    description: 'दहेज उत्पीड़न', 
    punishment: '3 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  domestic_violence: { 
    section: '498A', 
    description: 'घरेलू हिंसा', 
    punishment: '3 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  cheating: { 
    section: '420', 
    description: 'धोखाधड़ी', 
    punishment: '7 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  kidnapping: { 
    section: '363', 
    description: 'अपहरण', 
    punishment: '7 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  harassment: { 
    section: '354', 
    description: 'छेड़छाड़', 
    punishment: '2 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  },
  defamation: { 
    section: '500', 
    description: 'मानहानि', 
    punishment: '2 साल तक की सजा',
    act: 'Indian Penal Code',
    apiReference: 'IPC'
  }
};

// Pension Fund Regulations Database
const pensionRegulations = {
  pfrda_pop_2018: {
    act: 'Pension Fund Regulatory and Development Authority (Point of Presence) Regulations, 2018',
    section: '5',
    description: 'Point of Presence requirements and regulations',
    apiUrl: 'https://www.indiacode.nic.in/handle/123456789/2045'
  }
};

// Additional Legal Acts Database
const legalActsDB = {
  mgnrega: {
    act: 'Mahatma Gandhi National Rural Employment Guarantee Act, 2005',
    key_sections: {
      '3': 'Entitlement and registration',
      '4': 'Demand for work',
      '5': 'Planning process'
    },
    website: 'https://nrega.nic.in'
  },
  nfsa: {
    act: 'National Food Security Act, 2013',
    key_sections: {
      '3': 'Coverage and entitlement',
      '5': 'Priority households',
      '12': 'State responsibility'
    },
    website: 'https://nfsa.gov.in'
  },
  rte: {
    act: 'Right to Education Act, 2009',
    key_sections: {
      '3': 'Right of children to free and compulsory education',
      '12': 'Extent of school and duties'
    },
    website: 'https://www.education.gov.in'
  },
  rti: {
    act: 'Right to Information Act, 2005',
    key_sections: {
      '6': 'Request for information',
      '7': 'Disposal of request'
    },
    website: 'https://rti.gov.in'
  },
  pwdv: {
    act: 'Protection of Women from Domestic Violence Act, 2005',
    key_sections: {
      '3': 'Definition of domestic violence',
      '12': 'Duties of police officers',
      '18': 'Protection orders'
    }
  },
  pocso: {
    act: 'Protection of Children from Sexual Offences Act, 2012',
    key_sections: {
      '4': 'Penetrative sexual assault',
      '8': 'Sexual harassment',
      '19': 'Reporting of offences'
    }
  },
  consumer: {
    act: 'Consumer Protection Act, 2019',
    key_sections: {
      '2': 'Definitions',
      '35': 'Jurisdiction of District Commission'
    },
    website: 'https://consumerhelpline.gov.in'
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://127.0.0.1:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// API to fetch legal acts and sections
app.get('/api/legal-acts', (req, res) => {
  try {
    const { act } = req.query;
    
    if (act) {
      // Return specific act
      const actData = legalActsDB[act];
      if (actData) {
        res.json({ success: true, act: actData });
      } else {
        res.status(404).json({ error: 'Act not found' });
      }
    } else {
      // Return all available acts
      res.json({ 
        success: true, 
        acts: Object.keys(legalActsDB),
        data: legalActsDB 
      });
    }
  } catch (error) {
    console.error('Legal Acts API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to search Indian legal sections
app.post('/api/search-legal-section', async (req, res) => {
  try {
    const { actName, sectionNumber, query } = req.body;
    
    if (!query && (!actName || !sectionNumber)) {
      return res.status(400).json({ error: 'Either query or actName+sectionNumber required' });
    }
    
    console.log(`[Legal Section Search] Act: ${actName}, Section: ${sectionNumber}, Query: ${query}`);
    
    // Try fetching from Indian Kanoon API
    let apiData = null;
    if (actName && sectionNumber) {
      apiData = await fetchLegalSection(actName, sectionNumber);
    }
    
    // Return combined data
    res.json({
      success: true,
      query: query || `${actName} Section ${sectionNumber}`,
      apiData,
      localData: {
        ipcSections,
        legalActsDB,
        pensionRegulations
      }
    });
  } catch (error) {
    console.error('Legal Section Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  let relevantAct = null;
  
  // Check for police complaint scenarios
  if (/(चोरी|theft|stolen)/i.test(lowerQuery)) {
    issueType = 'theft';
    ipcSection = ipcSections.theft;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '379',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(मारपीट|assault|fight|beat)/i.test(lowerQuery)) {
    issueType = 'assault';
    ipcSection = ipcSections.assault;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '323',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(बलात्कार|rape|sexual)/i.test(lowerQuery)) {
    issueType = 'rape';
    ipcSection = ipcSections.rape;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '376',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(धोखाधड़ी|cheating|fraud|scam)/i.test(lowerQuery)) {
    issueType = 'cheating';
    ipcSection = ipcSections.cheating;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '420',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(छेड़छाड़|harassment|molest)/i.test(lowerQuery)) {
    issueType = 'harassment';
    ipcSection = ipcSections.harassment;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '354',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(दहेज|dowry)/i.test(lowerQuery)) {
    issueType = 'dowry';
    ipcSection = ipcSections.dowry;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '498A',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(हिंसा|violence|domestic)/i.test(lowerQuery)) {
    issueType = 'domestic_violence';
    ipcSection = ipcSections.domestic_violence;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Protection of Women from Domestic Violence Act, 2005',
      section: '3',
      reference: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005'
    };
  }
  
  // Check for government services with legal act references
  if (/(राशन|ration)/i.test(lowerQuery)) {
    issueType = 'ration_card';
    relevantPortal = {
      name: 'National Food Security Portal',
      url: 'https://nfsa.gov.in/',
      description: 'राशन कार्ड के लिए ऑनलाइन आवेदन करें'
    };
    relevantAct = {
      name: 'National Food Security Act, 2013',
      section: '3',
      description: 'Right to receive food grains',
      reference: 'https://www.indiacode.nic.in/handle/123456789/2123'
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
  } else if (/(education|शिक्षा|school)/i.test(lowerQuery)) {
    relevantAct = {
      name: 'Right to Education Act, 2009',
      section: '3',
      description: 'Free and compulsory education',
      reference: 'https://www.indiacode.nic.in/handle/123456789/2086'
    };
  } else if (/(information|जानकारी|rti)/i.test(lowerQuery)) {
    relevantAct = {
      name: 'Right to Information Act, 2005',
      section: '6',
      description: 'Request for obtaining information',
      reference: 'https://rti.gov.in'
    };
  }
  
  return {
    issueType,
    ipcSection,
    needsPoliceComplaint,
    relevantPortal,
    relevantAct
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

// NEW: Chat-based Legal AI Endpoint with comprehensive law information
app.post('/api/chat-legal-advice', async (req, res) => {
  try {
    const { query, language, chatHistory } = req.body;
    
    console.log(`📝 Chat request: "${query}" in ${language}`);
    
    // Analyze the query
    const analysis = analyzeQuery(query);
    
    // Build comprehensive legal response
    let response = '';
    let legalInfo = null;
    let portalLinks = [];
    
    // Generate response based on language and issue type
    if (language === 'hindi' || language === 'bhojpuri') {
      response = generateHindiChatResponse(query, analysis);
    } else if (language === 'kannada') {
      response = generateKannadaChatResponse(query, analysis);
    } else if (language === 'tamil') {
      response = generateTamilChatResponse(query, analysis);
    } else if (language === 'telugu') {
      response = generateTeluguChatResponse(query, analysis);
    } else {
      response = generateEnglishChatResponse(query, analysis);
    }
    
    // Add legal sections information
    if (analysis.ipcSection) {
      legalInfo = {
        actName: language === 'hindi' ? 'भारतीय दंड संहिता (IPC), 1860' : 
                 language === 'kannada' ? 'ಭಾರತೀಯ ದಂಡ ಸಂಹಿತೆ (IPC), 1860' :
                 language === 'tamil' ? 'இந்திய தண்டனைச் சட்டம் (IPC), 1860' :
                 language === 'telugu' ? 'భారత దండ సంహిత (IPC), 1860' :
                 'Indian Penal Code (IPC), 1860',
        sections: [
          `${language === 'hindi' ? 'धारा' : language === 'kannada' ? 'ವಿಭಾಗ' : language === 'tamil' ? 'பிரிவு' : language === 'telugu' ? 'సెక్షన్' : 'Section'} ${analysis.ipcSection.section}: ${analysis.ipcSection.description}`,
          `${language === 'hindi' ? 'सजा' : language === 'kannada' ? 'ಶಿಕ್ಷೆ' : language === 'tamil' ? 'தண்டனை' : language === 'telugu' ? 'శిక్ష' : 'Punishment'}: ${analysis.ipcSection.punishment}`
        ],
        reference: analysis.relevantAct ? analysis.relevantAct.reference : 'https://www.indiacode.nic.in'
      };
    }
    
    // Add relevant portal links
    if (analysis.relevantPortal) {
      portalLinks.push({
        name: analysis.relevantPortal.name,
        url: analysis.relevantPortal.url
      });
    }
    
    // Add general helpful portals
    portalLinks.push(
      { name: language === 'hindi' ? 'राष्ट्रीय कानूनी सेवा प्राधिकरण (NALSA)' : 'National Legal Services Authority (NALSA)', url: 'https://nalsa.gov.in' },
      { name: language === 'hindi' ? 'भारतीय कानून खोज' : 'Indian Laws Search', url: 'https://www.indiacode.nic.in' },
      { name: language === 'hindi' ? 'ई-कोर्ट्स पोर्टल' : 'e-Courts Portal', url: 'https://ecourts.gov.in' }
    );
    
    res.json({
      success: true,
      response,
      legalInfo,
      portalLinks,
      analysis: {
        issueType: analysis.issueType,
        needsPoliceComplaint: analysis.needsPoliceComplaint
      }
    });
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request',
      message: error.message
    });
  }
});

// Response generators for different languages
function generateHindiChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint } = analysis;
  
  let response = `मैं आपकी समस्या समझ गया हूँ। `;
  
  if (ipcSection) {
    response += `यह **${ipcSection.description}** का मामला है जो **IPC धारा ${ipcSection.section}** के अंतर्गत आता है। इसमें ${ipcSection.punishment} हो सकती है।\n\n`;
  }
  
  response += `**आपको क्या करना चाहिए:**\n\n`;
  
  if (needsPoliceComplaint) {
    response += `1. तुरंत नजदीकी पुलिस स्टेशन जाएं और FIR दर्ज करें\n`;
    response += `2. FIR की कॉपी जरूर लें (यह आपका कानूनी अधिकार है)\n`;
    response += `3. सभी सबूत और गवाहों की जानकारी रखें\n`;
    response += `4. अगर गंभीर मामला है तो वकील से सलाह लें\n\n`;
  }
  
  response += `**आपके अधिकार:**\n\n`;
  response += `• आपको मुफ्त में FIR दर्ज करने का अधिकार है\n`;
  response += `• आप मुफ्त कानूनी सहायता के लिए NALSA (15100) पर कॉल कर सकते हैं\n`;
  response += `• पुलिस द्वारा प्रताड़ना के खिलाफ शिकायत कर सकते हैं\n\n`;
  
  response += `क्या आपको और कोई जानकारी चाहिए?`;
  
  return response;
}

function generateEnglishChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint } = analysis;
  
  let response = `I understand your problem. `;
  
  if (ipcSection) {
    response += `This is a case of **${ipcSection.description}** which falls under **IPC Section ${ipcSection.section}**. The punishment can be ${ipcSection.punishment}.\n\n`;
  }
  
  response += `**What you should do:**\n\n`;
  
  if (needsPoliceComplaint) {
    response += `1. Immediately visit the nearest police station and file an FIR\n`;
    response += `2. Make sure to get a copy of the FIR (this is your legal right)\n`;
    response += `3. Keep all evidence and witness information\n`;
    response += `4. If it's a serious case, consult with a lawyer\n\n`;
  }
  
  response += `**Your Rights:**\n\n`;
  response += `• You have the right to file FIR for free\n`;
  response += `• You can call NALSA (15100) for free legal aid\n`;
  response += `• You can file complaint against police torture\n\n`;
  
  response += `Do you need any more information?`;
  
  return response;
}

function generateKannadaChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint } = analysis;
  
  let response = `ನಿಮ್ಮ ಸಮಸ್ಯೆ ನನಗೆ ಅರ್ಥವಾಗಿದೆ। `;
  
  if (ipcSection) {
    response += `ಇದು **${ipcSection.description}** ಪ್ರಕರಣವಾಗಿದ್ದು **IPC ವಿಭಾಗ ${ipcSection.section}** ಅಡಿಯಲ್ಲಿ ಬರುತ್ತದೆ। ಇದರಲ್ಲಿ ${ipcSection.punishment} ಆಗಬಹುದು।\n\n`;
  }
  
  response += `**ನೀವು ಏನು ಮಾಡಬೇಕು:**\n\n`;
  
  if (needsPoliceComplaint) {
    response += `1. ತಕ್ಷಣ ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಹೋಗಿ FIR ದಾಖಲಿಸಿ\n`;
    response += `2. FIR ನಕಲು ತೆಗೆದುಕೊಳ್ಳುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ (ಇದು ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕು)\n`;
    response += `3. ಎಲ್ಲಾ ಪುರಾವೆಗಳು ಮತ್ತು ಸಾಕ್ಷಿಗಳ ಮಾಹಿತಿಯನ್ನು ಇರಿಸಿಕೊಳ್ಳಿ\n`;
    response += `4. ಗಂಭೀರ ಪ್ರಕರಣವಾದರೆ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ\n\n`;
  }
  
  response += `**ನಿಮ್ಮ ಹಕ್ಕುಗಳು:**\n\n`;
  response += `• ನಿಮಗೆ ಉಚಿತವಾಗಿ FIR ದಾಖಲಿಸುವ ಹಕ್ಕಿದೆ\n`;
  response += `• ಉಚಿತ ಕಾನೂನು ಸಹಾಯಕ್ಕಾಗಿ NALSA (15100) ಗೆ ಕರೆ ಮಾಡಬಹುದು\n`;
  response += `• ಪೊಲೀಸ್ ದೌರ್ಜನ್ಯದ ವಿರುದ್ಧ ದೂರು ಸಲ್ಲಿಸಬಹುದು\n\n`;
  
  response += `ನಿಮಗೆ ಇನ್ನೂ ಯಾವುದಾದರೂ ಮಾಹಿತಿ ಬೇಕೇ?`;
  
  return response;
}

function generateTamilChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint } = analysis;
  
  let response = `உங்கள் பிரச்சனை எனக்கு புரிகிறது। `;
  
  if (ipcSection) {
    response += `இது **${ipcSection.description}** வழக்கு **IPC பிரிவு ${ipcSection.section}** கீழ் வரும். இதில் ${ipcSection.punishment} தண்டனை கிடைக்கலாம்।\n\n`;
  }
  
  response += `**நீங்கள் என்ன செய்ய வேண்டும்:**\n\n`;
  
  if (needsPoliceComplaint) {
    response += `1. உடனடியாக அருகிலுள்ள காவல் நிலையத்திற்குச் சென்று FIR பதிவு செய்யவும்\n`;
    response += `2. FIR நகலை பெறுவதை உறுதிப்படுத்திக்கொள்ளுங்கள் (இது உங்கள் சட்ட உரிமை)\n`;
    response += `3. அனைத்து ஆதாரங்கள் மற்றும் சாட்சிகளின் தகவல்களை வைத்திருங்கள்\n`;
    response += `4. தீவிர வழக்கு என்றால் வழக்கறிஞரை தொடர்பு கொள்ளுங்கள்\n\n`;
  }
  
  response += `**உங்கள் உரிமைகள்:**\n\n`;
  response += `• உங்களுக்கு இலவசமாக FIR பதிவு செய்ய உரிமை உண்டு\n`;
  response += `• இலவச சட்ட உதவிக்கு NALSA (15100) அழைக்கலாம்\n`;
  response += `• போலீஸ் சித்திரவதைக்கு எதிராக புகார் அளிக்கலாம்\n\n`;
  
  response += `உங்களுக்கு இன்னும் ஏதாவது தகவல் தேவையா?`;
  
  return response;
}

function generateTeluguChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint } = analysis;
  
  let response = `మీ సమస్య నాకు అర్థమైంది। `;
  
  if (ipcSection) {
    response += `ఇది **${ipcSection.description}** కేసు **IPC సెక్షన్ ${ipcSection.section}** క్రింద వస్తుంది। ఇందులో ${ipcSection.punishment} శిక్ష విధించవచ్చు।\n\n`;
  }
  
  response += `**మీరు ఏమి చేయాలి:**\n\n`;
  
  if (needsPoliceComplaint) {
    response += `1. వెంటనే సమీప పోలీస్ స్టేషన్‌కు వెళ్లి FIR దాఖలు చేయండి\n`;
    response += `2. FIR కాపీ తీసుకోవడాన్ని నిర్ధారించుకోండి (ఇది మీ చట్టపరమైన హక్కు)\n`;
    response += `3. అన్ని సాక్ష్యాలు మరియు సాక్షుల సమాచారాన్ని ఉంచుకోండి\n`;
    response += `4. తీవ్రమైన కేసు అయితే న్యాయవాదిని సంప్రదించండి\n\n`;
  }
  
  response += `**మీ హక్కులు:**\n\n`;
  response += `• మీకు ఉచితంగా FIR దాఖలు చేసే హక్కు ఉంది\n`;
  response += `• ఉచిత న్యాయ సహాయం కోసం NALSA (15100) కు కాల్ చేయవచ్చు\n`;
  response += `• పోలీసు హింసకు వ్యతిరేకంగా ఫిర్యాదు చేయవచ్చు\n\n`;
  
  response += `మీకు ఇంకా ఏదైనా సమాచారం కావాలా?`;
  
  return response;
}

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