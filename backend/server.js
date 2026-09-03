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
    
    // Check if this is actually a legal query
    if (analysis.isLegalQuery === false) {
      const redirectMessage = language === 'english' 
        ? 'I can only help with Indian law and government schemes. Please ask questions related to legal rights, laws, or government services.'
        : language === 'kannada'
        ? 'ನಾನು ಭಾರತೀಯ ಕಾನೂನು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ। ದಯವಿಟ್ಟು ಕಾನೂನು ಹಕ್ಕುಗಳು, ಕಾನೂನುಗಳು ಅಥವಾ ಸರ್ಕಾರಿ ಸೇವೆಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ।'
        : 'मुझे खेद है, मैं केवल भारतीय कानून और सरकारी योजनाओं के बारे में मदद कर सकता हूं। कृपया कानूनी अधिकारों, कानूनों या सरकारी सेवाओं से संबंधित प्रश्न पूछें।';
      
      return res.json({
        query,
        language,
        analysis,
        advice: {
          text: redirectMessage,
          source: 'system',
          confidence: 1.0,
          steps: [],
          rights: [],
          helpResources: [
            { name: 'NALSA Helpline', contact: '15100', description: language === 'english' ? 'Free Legal Aid' : 'मुफ्त कानूनी सहायता' }
          ]
        },
        timestamp: new Date().toISOString()
      });
    }
    
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
  
  // First, check if query is actually about legal/government matters
  const isLegalQuery = /(कानून|law|rights|अधिकार|police|पुलिस|scheme|योजना|card|कार्ड|license|लाइसेंस|pension|पेंशन|help|मदद|complaint|शिकायत|case|मामला|court|अदालत|advocate|वकील|fir|धारा|section|act|अधिनियम|सरकार|government|ministry|मंत्रालय|helpline|हेल्पलाइन|portal|पोर्टल|certificate|प्रमाण|प्रमाणपत्र|चोरी|theft|assault|मारपीट|harassment|छेड़छाड़|fraud|धोखा|scam|मजदूरी|wage|राशन|ration|आधार|aadhaar|pan|passport|voter|मतदाता|driving|ड्राइविंग|birth|जन्म|death|मृत्यु|land|ज़मीन|property|संपत्ति|education|शिक्षा|nrega|mgnrega|nalsa|legal aid|कानूनी सहायता|victim|पीड़ित|justice|न्याय|compensation|मुआवज़ा|salary|वेतन|भुगतान|payment|benefit|लाभ|subsidy|सब्सिडी|welfare|कल्याण)/i.test(lowerQuery);
  
  if (!isLegalQuery) {
    // Mark as non-legal query
    issueType = 'non_legal';
    return {
      issueType,
      ipcSection,
      needsPoliceComplaint,
      relevantPortal,
      relevantAct,
      isLegalQuery: false
    };
  }
  
  // Enhanced pattern matching with more variations
  
  // Criminal offenses - prioritize first
  if (/(चोरी|theft|stolen|लूट|robbery|chor|चुरा)/i.test(lowerQuery)) {
    issueType = 'theft';
    ipcSection = ipcSections.theft;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '379',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(मारपीट|assault|fight|beat|मार|गाली|गुस्सा|हमला|attack)/i.test(lowerQuery)) {
    issueType = 'assault';
    ipcSection = ipcSections.assault;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '323',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(बलात्कार|rape|sexual|यौन)/i.test(lowerQuery)) {
    issueType = 'rape';
    ipcSection = ipcSections.rape;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '376',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(धोखाधड़ी|cheating|fraud|scam|धोखा|ठग|fake|फर्जी)/i.test(lowerQuery)) {
    issueType = 'cheating';
    ipcSection = ipcSections.cheating;
    needsPoliceComplaint = true;
    relevantAct = {
      name: 'Indian Penal Code, 1860',
      section: '420',
      reference: 'https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00037_186045_1523266765688'
    };
  } else if (/(छेड़छाड़|harassment|molest|छेड़|तंग|परेशान)/i.test(lowerQuery)) {
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
  
  // Check for government services with enhanced patterns
  if (/(राशन|ration|खाद्य|food|card|कार्ड)/i.test(lowerQuery)) {
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
  } else if (/(पेंशन|pension|विधवा|widow|वृद्ध|old|age|दिव्यांग|disable)/i.test(lowerQuery)) {
    issueType = 'pension';
    relevantPortal = {
      name: 'NSAP Portal',
      url: 'https://nsap.nic.in/',
      description: 'पेंशन योजना के लिए आवेदन करें'
    };
  } else if (/(मजदूरी|wage|mgnrega|नरेगा|mazduri|payment|भुगतान|salary|वेतन|काम|work)/i.test(lowerQuery) && /(नहीं|not|pending|due|delay|late)/i.test(lowerQuery)) {
    issueType = 'mgnrega';
    relevantPortal = {
      name: 'MGNREGA Portal',
      url: 'https://nrega.nic.in/',
      description: 'मजदूरी शिकायत दर्ज करें'
    };
  } else if (/(आधार|aadhaar|aadhar|uid|update|expired|expire|biometric)/i.test(lowerQuery)) {
    issueType = 'aadhaar';
    relevantPortal = {
      name: 'UIDAI Portal',
      url: 'https://uidai.gov.in/',
      description: 'आधार कार्ड सेवाएं'
    };
  } else if (/(pan|पैन|permanent|account|number)/i.test(lowerQuery)) {
    issueType = 'pan_card';
    relevantPortal = {
      name: 'Income Tax Portal',
      url: 'https://www.incometax.gov.in/iec/foportal',
      description: 'PAN कार्ड के लिए आवेदन करें'
    };
  } else if (/(driving|license|ड्राइविंग|लाइसेंस|dl|learner)/i.test(lowerQuery)) {
    issueType = 'driving_license';
    relevantPortal = {
      name: 'Parivahan Portal',
      url: 'https://parivahan.gov.in/',
      description: 'Driving License सेवाएं'
    };
  } else if (/(passport|पासपोर्ट|travel|विदेश)/i.test(lowerQuery)) {
    issueType = 'passport';
    relevantPortal = {
      name: 'Passport Seva',
      url: 'https://www.passportindia.gov.in/',
      description: 'Passport आवेदन और सेवाएं'
    };
  } else if (/(voter|वोटर|मतदाता|epic|election|चुनाव|vote|मत)/i.test(lowerQuery)) {
    issueType = 'voter_id';
    relevantPortal = {
      name: 'National Voters Service Portal',
      url: 'https://voters.eci.gov.in/',
      description: 'Voter ID आवेदन और सेवाएं'
    };
  } else if (/(birth|जन्म|certificate|प्रमाण|death|मृत्यु)/i.test(lowerQuery)) {
    issueType = 'birth_certificate';
    relevantPortal = {
      name: 'CRS Portal',
      url: 'https://crsorgi.gov.in/',
      description: 'Birth/Death Certificate'
    };
  } else if (/(ज़मीन|land|property|संपत्ति|dispute|विवाद|खेत|plot)/i.test(lowerQuery)) {
    issueType = 'land_dispute';
    relevantPortal = {
      name: 'Land Records',
      url: 'https://landrecords.gov.in/',
      description: 'भूमि रिकॉर्ड और विवाद'
    };
  } else if (/(education|शिक्षा|school|स्कूल|admission|प्रवेश)/i.test(lowerQuery)) {
    issueType = 'education';
    relevantAct = {
      name: 'Right to Education Act, 2009',
      section: '3',
      description: 'Free and compulsory education',
      reference: 'https://www.indiacode.nic.in/handle/123456789/2086'
    };
  } else if (/(information|जानकारी|rti)/i.test(lowerQuery)) {
    issueType = 'rti';
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
    relevantAct,
    isLegalQuery: true
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
                text: `You are Nyaya Mitra, a legal advisor ONLY for Indian law and citizens. You must STRICTLY follow these rules:

CRITICAL RULES:
1. ONLY answer questions related to Indian law, Indian government schemes, and legal rights in India
2. If the question is NOT about Indian law or legal matters, respond with: "मुझे खेद है, मैं केवल भारतीय कानून और सरकारी योजनाओं के बारे में मदद कर सकता हूं। कृपया कानूनी या सरकारी योजना से संबंधित प्रश्न पूछें।"
3. Write ENTIRE response in ${languageNames[language] || 'Hindi'} language
4. Keep responses short (3-5 sentences), simple and actionable for rural/common people
5. Always mention specific Indian laws, sections, or government portals

User's Legal Question: ${query}

Identified Issue Type: ${analysis.issueType}
${analysis.ipcSection ? `Relevant IPC Section: ${analysis.ipcSection.section} - ${analysis.ipcSection.description}` : ''}
${analysis.relevantAct ? `Relevant Act: ${analysis.relevantAct.name}` : ''}

Format your response as:
**कानूनी सलाह:** [2-3 sentences about the legal rights and what the person should do]

**तुरंत कदम:**
1. [First immediate action]
2. [Second immediate action]
3. [Third immediate action]

**मदद कहां मिलेगी:**
- [Specific helpline, office, or portal with contact/link]

Remember: ONLY answer if this is about Indian law/rights. Otherwise, politely redirect to legal topics.`
              }]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 600,
              topP: 0.8,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );
      
      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Validate that response is relevant to Indian law
        const isRelevant = validateLegalResponse(aiResponse, query, language);
        
        if (isRelevant) {
          return {
            text: aiResponse,
            source: 'ai',
            confidence: 0.9
          };
        } else {
          console.log('AI response deemed irrelevant, using fallback');
          return getFallbackAdvice(query, analysis, language);
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }
  }
  
  // Fallback to rule-based advice
  return getFallbackAdvice(query, analysis, language);
}

// Validate that AI response is relevant to Indian law and the query
function validateLegalResponse(response, query, language) {
  const lowerResponse = response.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Check if response contains Indian legal keywords
  const indianLegalKeywords = [
    'ipc', 'धारा', 'section', 'act', 'कानून', 'अधिनियम',
    'fir', 'police', 'पुलिस', 'court', 'अदालत', 'nyaya',
    'nalsa', 'nrega', 'mgnrega', 'aadhaar', 'आधार',
    'scheme', 'योजना', 'helpline', 'हेल्पलाइन',
    'rights', 'अधिकार', 'भारतीय', 'indian', 'सरकार', 'government'
  ];
  
  const hasLegalKeywords = indianLegalKeywords.some(keyword => 
    lowerResponse.includes(keyword)
  );
  
  // Check if response is not a refusal/irrelevant message
  const refusalPhrases = [
    'i cannot', 'i can\'t', 'not able to', 'मैं नहीं कर सकता',
    'खेद है', 'sorry', 'मुझे खेद', 'केवल भारतीय कानून'
  ];
  
  const isRefusal = refusalPhrases.some(phrase => 
    lowerResponse.includes(phrase)
  );
  
  // Response should have legal keywords and not be a refusal
  return hasLegalKeywords && !isRefusal;
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
  const { issueType, ipcSection, needsPoliceComplaint, relevantPortal, relevantAct } = analysis;
  
  let response = `मैं आपकी समस्या समझ गया हूँ। `;
  
  // First provide practical solutions
  response += `\n\n**💡 पहले ये कोशिश करें:**\n\n`;
  
  if (issueType === 'ration_card') {
    response += `1. अपने नजदीकी राशन दुकान या PDS केंद्र से संपर्क करें\n`;
    response += `2. अपने क्षेत्र के Block Development Officer (BDO) से मिलें\n`;
    response += `3. ऑनलाइन आवेदन करें: ${relevantPortal ? relevantPortal.url : 'nfsa.gov.in'}\n`;
    response += `4. अगर 15 दिन में कोई जवाब नहीं तो Grievance Portal पर शिकायत करें\n\n`;
    
    response += `**📋 जरूरी दस्तावेज:**\n`;
    response += `• आधार कार्ड, पते का प्रमाण, आय प्रमाण पत्र\n\n`;
    
    response += `**⚖️ कानूनी अधिकार:**\n`;
    response += `• National Food Security Act, 2013 के तहत आपको सस्ता अनाज पाने का अधिकार है\n`;
    response += `• अगर बिना कारण आवेदन खारिज हो जाए तो RTI दाखिल कर सकते हैं\n\n`;
    
  } else if (issueType === 'mgnrega' || /वेतन|salary|wage|payment/.test(query.toLowerCase())) {
    response += `1. अपने Job Card की फोटो कॉपी रखें\n`;
    response += `2. Gram Panchayat या Block office में लिखित शिकायत दें\n`;
    response += `3. 15 दिन में पेमेंट नहीं आए तो आपको मुआवजा मिलेगा\n`;
    response += `4. MGNREGA Helpline: 1800-345-22-44 पर कॉल करें\n`;
    response += `5. Online शिकायत: nrega.nic.in/netnrega/homestciti.aspx पर\n\n`;
    
    response += `**⚖️ कानूनी अधिकार:**\n`;
    response += `• MGNREGA Act 2005 के तहत 15 दिन में पेमेंट अनिवार्य है\n`;
    response += `• देरी होने पर आपको 0.05% प्रति दिन का मुआवजा मिलेगा\n`;
    response += `• किसी भी कारण से काम से मना नहीं कर सकते\n\n`;
    
  } else if (issueType === 'pension') {
    response += `1. अपने Bank/Post Office से पेंशन status चेक करें\n`;
    response += `2. Tehsil/Block office में Application Update करवाएं\n`;
    response += `3. अगर पेंशन रुक गई है तो कारण पूछें (लिखित में)\n`;
    response += `4. NSAP Portal: nsap.nic.in पर online track करें\n`;
    response += `5. State Social Welfare Department में complaint करें\n\n`;
    
    response += `**⚖️ कानूनी अधिकार:**\n`;
    response += `• विधवा/वृद्धा/दिव्यांग पेंशन योजना के तहत मासिक सहायता का अधिकार\n`;
    response += `• बिना कारण पेंशन बंद नहीं कर सकते\n\n`;
    
  } else if (issueType === 'aadhaar') {
    if (/update|अपडेट|expired|expire|change/.test(query.toLowerCase())) {
      response += `**आधार कार्ड अपडेट करने के तरीके:**\n\n`;
      response += `1. **ऑनलाइन अपडेट (घर बैठे):**\n`;
      response += `   • UIDAI Portal पर जाएं: https://myaadhaar.uidai.gov.in/\n`;
      response += `   • "Update Your Aadhaar" पर क्लिक करें\n`;
      response += `   • Mobile number, Email, Address ऑनलाइन अपडेट करें\n`;
      response += `   • Document अपलोड करें और pay करें (₹50 लगते हैं)\n\n`;
      
      response += `2. **Aadhaar Seva Kendra जाकर:**\n`;
      response += `   • नजदीकी Aadhaar Center ढूंढें: https://appointments.uidai.gov.in/\n`;
      response += `   • Appointment बुक करें (online या जाकर)\n`;
      response += `   • जरूरी दस्तावेज ले जाएं\n`;
      response += `   • Biometric update के लिए ₹100 fees\n\n`;
      
      response += `**📋 जरूरी दस्तावेज:**\n`;
      response += `• Address proof: Passport, Voter ID, Bank statement, Ration card\n`;
      response += `• Identity proof: PAN card, Driving license, Passport\n`;
      response += `• Date of Birth proof: Birth certificate, School certificate\n\n`;
      
      response += `**⏰ समय सीमा:**\n`;
      response += `• Online update: 7-10 दिन में e-Aadhaar मिल जाएगा\n`;
      response += `• Aadhaar center: Same day acknowledgment slip मिलेगा, 10-15 दिन में updated card\n\n`;
      
      response += `**💡 Important:**\n`;
      response += `• आधार की validity expire नहीं होती! कार्ड पर कोई expiry date नहीं होती\n`;
      response += `• अगर 10 साल से ज्यादा पुराना है तो biometric update जरूरी है\n`;
      response += `• Update के बाद e-Aadhaar download कर सकते हैं (same validity)\n\n`;
      
    } else {
      response += `**नया आधार कार्ड बनवाने के लिए:**\n\n`;
      response += `1. नजदीकी Aadhaar Enrolment Center जाएं\n`;
      response += `2. Appointment book करें: https://appointments.uidai.gov.in/\n`;
      response += `3. POI, POA, DOB proof documents ले जाएं\n`;
      response += `4. Biometric capture होगा (photo, fingerprint, iris)\n`;
      response += `5. Enrolment ID मिलेगी - इसे संभाल कर रखें\n`;
      response += `6. 60-90 दिन में घर पर Aadhaar card आएगा\n\n`;
      
      response += `**Helpline:**\n`;
      response += `• UIDAI Toll-Free: 1947\n`;
      response += `• Email: help@uidai.gov.in\n`;
      response += `• Status check: https://myaadhaar.uidai.gov.in/CheckAadhaarStatus\n\n`;
    }
    
  } else if (issueType === 'pan_card') {
    response += `**PAN Card के लिए:**\n\n`;
    response += `1. **नया PAN बनवाना है:**\n`;
    response += `   • Online apply: https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html\n`;
    response += `   • Form 49A भरें (Indian citizens के लिए)\n`;
    response += `   • Documents upload करें (DOB proof, Address proof, Photo)\n`;
    response += `   • Fee pay करें (₹107 online, ₹93 offline)\n`;
    response += `   • 15-20 दिन में PAN card आ जाएगा\n\n`;
    
    response += `2. **PAN update/correction:**\n`;
    response += `   • Form 49A fill करें (changes के साथ)\n`;
    response += `   • Updated documents submit करें\n`;
    response += `   • Processing time: 15-20 days\n\n`;
    
    response += `**Helpline:**\n`;
    response += `• NSDL: 020-27218080\n`;
    response += `• Status check: tin.tin.nsdl.com/pantan/StatusTrack.html\n\n`;
    
  } else if (issueType === 'passport') {
    response += `**Passport के लिए:**\n\n`;
    response += `1. Passport Seva website पर register करें: passportindia.gov.in\n`;
    response += `2. Online application form भरें\n`;
    response += `3. Fee payment करें (₹1500 normal, ₹3500 tatkal)\n`;
    response += `4. Appointment book करें nearest PSK/POPSK\n`;
    response += `5. Documents original + photocopy ले जाएं\n`;
    response += `6. Police verification होगा\n`;
    response += `7. 30-45 दिन में passport मिलेगा\n\n`;
    
    response += `**Helpline:** 1800-258-1800\n\n`;
    
  } else if (issueType === 'driving_license') {
    response += `**Driving License के लिए:**\n\n`;
    response += `1. Parivahan portal पर apply: parivahan.gov.in\n`;
    response += `2. पहले Learning License लें (test देना होगा)\n`;
    response += `3. 30 दिन बाद Permanent DL के लिए apply करें\n`;
    response += `4. Driving test pass करें\n`;
    response += `5. 7-10 दिन में DL मिल जाएगा\n\n`;
    
    response += `**DL Renewal:**\n`;
    response += `• Expire होने से पहले या बाद में renew कर सकते हैं\n`;
    response += `• Online renewal: parivahan.gov.in/parivahan\n`;
    response += `• Medical certificate जरूरी (40+ age के लिए)\n\n`;
    
  } else if (issueType === 'voter_id') {
    response += `**Voter ID Card (EPIC) के लिए:**\n\n`;
    response += `1. **नया Voter ID बनवाना:**\n`;
    response += `   • Online apply: https://voters.eci.gov.in/\n`;
    response += `   • "Apply for New Voter ID" चुनें\n`;
    response += `   • Form 6 भरें\n`;
    response += `   • Age: 18 साल पूरे होने चाहिए\n`;
    response += `   • Documents: Address proof, Age proof, Photo\n`;
    response += `   • Booth Level Officer (BLO) verification करेगा\n`;
    response += `   • 30-45 दिन में Voter ID मिल जाएगा\n\n`;
    
    response += `2. **Voter ID में correction/update:**\n`;
    response += `   • Form 8 भरें (correction के लिए)\n`;
    response += `   • Name, address, photo change कर सकते हैं\n`;
    response += `   • Upload proof documents\n\n`;
    
    response += `3. **Duplicate Voter ID:**\n`;
    response += `   • Form 8 भरें\n`;
    response += `   • Reason for duplicate बताएं (lost/damaged)\n`;
    response += `   • Free of cost\n\n`;
    
    response += `**📋 जरूरी दस्तावेज:**\n`;
    response += `• Address proof: Aadhaar, Passport, Bank statement, Ration card\n`;
    response += `• Age proof: Birth certificate, School certificate, Aadhaar\n`;
    response += `• Recent passport size photo\n\n`;
    
    response += `**Helpline:**\n`;
    response += `• NVSP Helpline: 1950\n`;
    response += `• Email: feedback@eci.gov.in\n`;
    response += `• Check status: voters.eci.gov.in/track-application\n\n`;
    
  } else if (issueType === 'birth_certificate') {
    response += `**Birth Certificate के लिए:**\n\n`;
    response += `1. **नया Birth Certificate:**\n`;
    response += `   • CRS Portal: https://crsorgi.gov.in/\n`;
    response += `   • Hospital discharge slip या जन्म के प्रमाण चाहिए\n`;
    response += `   • 21 दिन के अंदर register करें (free)\n`;
    response += `   • 21 दिन बाद: Late registration fee लगेगी\n\n`;
    
    response += `2. **Correction in Birth Certificate:**\n`;
    response += `   • नगर निगम/Gram Panchayat में application दें\n`;
    response += `   • Proof documents attach करें\n`;
    response += `   • Processing: 15-30 days\n\n`;
    
    response += `**Municipal Corporation/Gram Panchayat में apply कर सकते हैं**\n\n`;
    
  } else if (issueType === 'assault' || issueType === 'harassment' || issueType === 'theft') {
    response += `1. **पहले अपनी सुरक्षा सुनिश्चित करें** - खतरे से दूर रहें\n`;
    response += `2. किसी भरोसेमंद व्यक्ति को तुरंत बताएं\n`;
    response += `3. अगर गंभीर है तो 100/112 डायल करें (Emergency)\n`;
    response += `4. Medical certificate लें अगर चोट है\n`;
    response += `5. सबूत इकट्ठे करें - फोटो, वीडियो, गवाह\n\n`;
    
    response += `**⚖️ कानूनी कार्रवाई:**\n\n`;
    if (ipcSection) {
      response += `यह **${ipcSection.description}** का मामला है जो **IPC धारा ${ipcSection.section}** के अंतर्गत आता है।\n\n`;
      response += `**सजा:** ${ipcSection.punishment}\n\n`;
    }
    
    response += `**अगले कदम:**\n`;
    response += `1. 72 घंटे के अंदर नजदीकी पुलिस स्टेशन में FIR दर्ज करें\n`;
    response += `2. FIR नंबर और कॉपी जरूर लें (यह आपका कानूनी अधिकार है)\n`;
    response += `3. अगर पुलिस FIR नहीं लिख रही है तो:\n`;
    response += `   • SP/Commissioner को लिखित शिकायत करें\n`;
    response += `   • Online FIR: अपने राज्य की police website पर\n`;
    response += `   • Magistrate court में directly complaint कर सकते हैं\n\n`;
    
  } else if (issueType === 'cheating' || issueType === 'fraud') {
    response += `1. तुरंत सभी दस्तावेज सुरक्षित रखें (SMS, emails, receipts)\n`;
    response += `2. Bank/Payment gateway को inform करें और transaction block करवाएं\n`;
    response += `3. Cyber Crime Portal पर online complaint करें: cybercrime.gov.in\n`;
    response += `4. National Cyber Crime Helpline: 1930 पर call करें\n`;
    response += `5. अगर ऑनलाइन fraud है तो अपने bank में dispute raise करें\n\n`;
    
    response += `**⚖️ कानूनी कार्रवाई:**\n\n`;
    if (ipcSection) {
      response += `यह **IPC धारा ${ipcSection.section} - ${ipcSection.description}** के अंतर्गत आता है।\n`;
      response += `**सजा:** ${ipcSection.punishment}\n\n`;
    }
    
    response += `**FIR के लिए:**\n`;
    response += `• पुलिस स्टेशन या Cyber Crime Police Station जाएं\n`;
    response += `• सभी सबूत साथ ले जाएं (screenshots, bank statements)\n\n`;
    
  } else if (issueType === 'land_dispute') {
    response += `1. अपने Property Documents की पूरी जांच करें\n`;
    response += `2. Tehsildar/Revenue Office से Land Records निकालें\n`;
    response += `3. अगर boundary dispute है तो Survey करवाएं\n`;
    response += `4. पहले Panchayat/Local Authority में शिकायत करें\n`;
    response += `5. अगर समाधान नहीं तो Civil Court में case file करें\n\n`;
    
    response += `**⚖️ कानूनी विकल्प:**\n`;
    response += `• Mediation/Conciliation पहले try करें (कम खर्च, जल्दी समाधान)\n`;
    response += `• Legal Aid Services से मुफ्त वकील मिल सकता है\n`;
    response += `• Lok Adalat में केस ले जा सकते हैं\n\n`;
    
    response += `**📋 जरूरी दस्तावेज:**\n`;
    response += `• Sale deed, Registry papers\n`;
    response += `• 7/12 extract या Khasra/Khatauni\n`;
    response += `• Property tax receipts\n`;
    response += `• Survey documents\n\n`;
    
  } else if (/ज़मीन|land|property|dispute/.test(query.toLowerCase())) {
    response += `1. अपने Property Documents की पूरी जांच करें\n`;
    response += `2. Tehsildar/Revenue Office से Land Records निकालें\n`;
    response += `3. अगर boundary dispute है तो Survey करवाएं\n`;
    response += `4. पहले Panchayat/Local Authority में शिकायत करें\n`;
    response += `5. अगर समाधान नहीं तो Civil Court में case file करें\n\n`;
    
    response += `**⚖️ कानूनी विकल्प:**\n`;
    response += `• Mediation/Conciliation पहले try करें (कम खर्च, जल्दी समाधान)\n`;
    response += `• Legal Aid Services से मुफ्त वकील मिल सकता है\n`;
    response += `• Lok Adalat में केस ले जा सकते हैं\n\n`;
    
  } else {
    response += `1. अपनी समस्या के बारे में पूरी जानकारी इकट्ठा करें\n`;
    response += `2. संबंधित विभाग में लिखित शिकायत दें\n`;
    response += `3. अगर 30 दिन में कोई जवाब नहीं तो RTI दाखिल करें\n`;
    response += `4. Grievance Portal पर ऑनलाइन शिकायत करें\n`;
    response += `5. अगर जरूरी हो तो वकील से परामर्श लें\n\n`;
  }
  
  response += `**🆘 मुफ्त कानूनी सहायता:**\n\n`;
  response += `• NALSA Helpline: **15100** (राष्ट्रीय कानूनी सेवा प्राधिकरण)\n`;
  response += `• District Legal Services Authority में जाएं\n`;
  response += `• Online: nalsa.gov.in\n`;
  response += `• अगर आपकी आय ₹3 लाख से कम है तो मुफ्त वकील मिलेगा\n\n`;
  
  if (relevantPortal) {
    response += `**🌐 संबंधित Portal:**\n`;
    response += `${relevantPortal.name}: ${relevantPortal.url}\n\n`;
  }
  
  response += `क्या आपको और कोई जानकारी चाहिए?`;
  
  return response;
}

function generateEnglishChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint, relevantPortal, relevantAct } = analysis;
  
  let response = `I understand your problem. `;
  
  // Provide practical solutions first
  response += `\n\n**💡 What you should do:**\n\n`;
  
  if (issueType === 'aadhaar') {
    if (/update|expired|expire|change/.test(query.toLowerCase())) {
      response += `**How to Update Aadhaar Card:**\n\n`;
      response += `1. **Online Update (from home):**\n`;
      response += `   • Visit UIDAI Portal: https://myaadhaar.uidai.gov.in/\n`;
      response += `   • Click on "Update Your Aadhaar"\n`;
      response += `   • Update Mobile, Email, Address online\n`;
      response += `   • Upload documents and pay (₹50 fee)\n\n`;
      
      response += `2. **Visit Aadhaar Seva Kendra:**\n`;
      response += `   • Find nearest center: https://appointments.uidai.gov.in/\n`;
      response += `   • Book appointment (online or walk-in)\n`;
      response += `   • Take required documents\n`;
      response += `   • Biometric update fee: ₹100\n\n`;
      
      response += `**📋 Required Documents:**\n`;
      response += `• Address proof: Passport, Voter ID, Bank statement, Ration card\n`;
      response += `• Identity proof: PAN card, Driving license, Passport\n`;
      response += `• DOB proof: Birth certificate, School certificate\n\n`;
      
      response += `**⏰ Processing Time:**\n`;
      response += `• Online: 7-10 days for e-Aadhaar\n`;
      response += `• Aadhaar center: Same day acknowledgment, 10-15 days for updated card\n\n`;
      
      response += `**💡 Important:**\n`;
      response += `• Aadhaar never expires! There's no expiry date on the card\n`;
      response += `• If it's 10+ years old, biometric update is recommended\n`;
      response += `• e-Aadhaar has same validity as physical card\n\n`;
      
    } else {
      response += `**For New Aadhaar Card:**\n\n`;
      response += `1. Visit nearest Aadhaar Enrolment Center\n`;
      response += `2. Book appointment: https://appointments.uidai.gov.in/\n`;
      response += `3. Take POI, POA, DOB proof documents\n`;
      response += `4. Biometric capture (photo, fingerprint, iris)\n`;
      response += `5. You'll get Enrolment ID - keep it safe\n`;
      response += `6. Aadhaar card will arrive in 60-90 days\n\n`;
      
      response += `**Helpline:**\n`;
      response += `• UIDAI Toll-Free: 1947\n`;
      response += `• Email: help@uidai.gov.in\n`;
      response += `• Status check: https://myaadhaar.uidai.gov.in/CheckAadhaarStatus\n\n`;
    }
    
  } else if (issueType === 'pan_card') {
    response += `**For PAN Card:**\n\n`;
    response += `1. **New PAN Application:**\n`;
    response += `   • Apply online: https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html\n`;
    response += `   • Fill Form 49A (for Indian citizens)\n`;
    response += `   • Upload documents (DOB, Address, Photo)\n`;
    response += `   • Pay fee (₹107 online, ₹93 offline)\n`;
    response += `   • PAN card arrives in 15-20 days\n\n`;
    
    response += `2. **PAN Update/Correction:**\n`;
    response += `   • Fill Form 49A with changes\n`;
    response += `   • Submit updated documents\n`;
    response += `   • Processing: 15-20 days\n\n`;
    
    response += `**Helpline:**\n`;
    response += `• NSDL: 020-27218080\n`;
    response += `• Track status: tin.tin.nsdl.com/pantan/StatusTrack.html\n\n`;
    
  } else if (issueType === 'passport') {
    response += `**For Passport:**\n\n`;
    response += `1. Register on Passport Seva: passportindia.gov.in\n`;
    response += `2. Fill online application form\n`;
    response += `3. Pay fee (₹1500 normal, ₹3500 tatkal)\n`;
    response += `4. Book appointment at nearest PSK/POPSK\n`;
    response += `5. Take original + photocopy documents\n`;
    response += `6. Police verification will be done\n`;
    response += `7. Passport arrives in 30-45 days\n\n`;
    
    response += `**Helpline:** 1800-258-1800\n\n`;
    
  } else if (issueType === 'driving_license') {
    response += `**For Driving License:**\n\n`;
    response += `1. Apply on Parivahan portal: parivahan.gov.in\n`;
    response += `2. First get Learning License (need to pass test)\n`;
    response += `3. After 30 days, apply for Permanent DL\n`;
    response += `4. Pass driving test\n`;
    response += `5. DL will be issued in 7-10 days\n\n`;
    
    response += `**DL Renewal:**\n`;
    response += `• Can renew before or after expiry\n`;
    response += `• Online renewal: parivahan.gov.in/parivahan\n`;
    response += `• Medical certificate required (for 40+ age)\n\n`;
    
  } else if (issueType === 'voter_id') {
    response += `**For Voter ID Card (EPIC):**\n\n`;
    response += `1. **New Voter ID Application:**\n`;
    response += `   • Apply online: https://voters.eci.gov.in/\n`;
    response += `   • Select "Apply for New Voter ID"\n`;
    response += `   • Fill Form 6\n`;
    response += `   • Age requirement: Must be 18 years\n`;
    response += `   • Documents: Address proof, Age proof, Photo\n`;
    response += `   • Booth Level Officer (BLO) will verify\n`;
    response += `   • Voter ID arrives in 30-45 days\n\n`;
    
    response += `2. **Correction/Update in Voter ID:**\n`;
    response += `   • Fill Form 8 (for corrections)\n`;
    response += `   • Can change name, address, photo\n`;
    response += `   • Upload proof documents\n\n`;
    
    response += `3. **Duplicate Voter ID:**\n`;
    response += `   • Fill Form 8\n`;
    response += `   • State reason (lost/damaged)\n`;
    response += `   • Free of cost\n\n`;
    
    response += `**📋 Required Documents:**\n`;
    response += `• Address proof: Aadhaar, Passport, Bank statement, Ration card\n`;
    response += `• Age proof: Birth certificate, School certificate, Aadhaar\n`;
    response += `• Recent passport size photo\n\n`;
    
    response += `**Helpline:**\n`;
    response += `• NVSP Helpline: 1950\n`;
    response += `• Email: feedback@eci.gov.in\n`;
    response += `• Track application: voters.eci.gov.in/track-application\n\n`;
    
  } else if (issueType === 'birth_certificate') {
    response += `**For Birth Certificate:**\n\n`;
    response += `1. **New Birth Certificate:**\n`;
    response += `   • CRS Portal: https://crsorgi.gov.in/\n`;
    response += `   • Need hospital discharge slip or birth proof\n`;
    response += `   • Register within 21 days (free)\n`;
    response += `   • After 21 days: Late registration fee applicable\n\n`;
    
    response += `2. **Correction in Birth Certificate:**\n`;
    response += `   • Apply at Municipal Corporation/Gram Panchayat\n`;
    response += `   • Attach proof documents\n`;
    response += `   • Processing: 15-30 days\n\n`;
    
    response += `**Can apply at Municipal Corporation or Gram Panchayat**\n\n`;
    
  } else if (issueType === 'land_dispute') {
    response += `1. Check all your Property Documents thoroughly\n`;
    response += `2. Get Land Records from Tehsildar/Revenue Office\n`;
    response += `3. If boundary dispute, get Survey done\n`;
    response += `4. First file complaint with Panchayat/Local Authority\n`;
    response += `5. If no resolution, file case in Civil Court\n\n`;
    
    response += `**⚖️ Legal Options:**\n`;
    response += `• Try Mediation/Conciliation first (cheaper, faster)\n`;
    response += `• Legal Aid Services can provide free lawyer\n`;
    response += `• Take case to Lok Adalat for quick settlement\n\n`;
    
    response += `**📋 Required Documents:**\n`;
    response += `• Sale deed, Registry papers\n`;
    response += `• 7/12 extract or Khasra/Khatauni\n`;
    response += `• Property tax receipts\n`;
    response += `• Survey documents\n\n`;
    
  } else if (needsPoliceComplaint) {
    response += `1. **First ensure your safety** - stay away from danger\n`;
    response += `2. Tell a trusted person immediately\n`;
    response += `3. Call 100/112 if serious emergency\n`;
    response += `4. Get medical certificate if injured\n`;
    response += `5. Collect evidence - photos, videos, witnesses\n\n`;
    
    if (ipcSection) {
      response += `**⚖️ Legal Action:**\n\n`;
      response += `This is a case of **${ipcSection.description}** under **IPC Section ${ipcSection.section}**.\n\n`;
      response += `**Punishment:** ${ipcSection.punishment}\n\n`;
    }
    
    response += `**Next Steps:**\n`;
    response += `1. File FIR at nearest police station within 72 hours\n`;
    response += `2. Get FIR number and copy (your legal right)\n`;
    response += `3. If police refuses FIR:\n`;
    response += `   • Write complaint to SP/Commissioner\n`;
    response += `   • File online FIR on state police website\n`;
    response += `   • Directly approach Magistrate court\n\n`;
    
  } else {
    response += `1. Gather complete information about your problem\n`;
    response += `2. File written complaint with relevant department\n`;
    response += `3. If no response in 30 days, file RTI\n`;
    response += `4. File online grievance on portal\n`;
    response += `5. Consult lawyer if necessary\n\n`;
  }
  
  response += `**🆘 Free Legal Aid:**\n\n`;
  response += `• NALSA Helpline: **15100**\n`;
  response += `• Visit District Legal Services Authority\n`;
  response += `• Online: nalsa.gov.in\n`;
  response += `• Free lawyer if income < ₹3 lakh\n\n`;
  
  if (relevantPortal) {
    response += `**🌐 Relevant Portal:**\n`;
    response += `${relevantPortal.name}: ${relevantPortal.url}\n\n`;
  }
  
  response += `Do you need any more information?`;
  
  return response;
}

function generateKannadaChatResponse(query, analysis) {
  const { issueType, ipcSection, needsPoliceComplaint, relevantPortal, relevantAct } = analysis;
  
  let response = `ನಿಮ್ಮ ಸಮಸ್ಯೆ ನನಗೆ ಅರ್ಥವಾಗಿದೆ। `;
  
  // First provide practical solutions
  response += `\n\n**💡 ಮೊದಲು ಇದನ್ನು ಪ್ರಯತ್ನಿಸಿ:**\n\n`;
  
  if (issueType === 'ration_card') {
    response += `1. ನಿಮ್ಮ ಹತ್ತಿರದ ಪಡಿತರ ಅಂಗಡಿ ಅಥವಾ PDS ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ\n`;
    response += `2. ನಿಮ್ಮ ಪ್ರದೇಶದ Block Development Officer (BDO) ಅವರನ್ನು ಭೇಟಿಯಾಗಿ\n`;
    response += `3. ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ: ${relevantPortal ? relevantPortal.url : 'nfsa.gov.in'}\n`;
    response += `4. 15 ದಿನದಲ್ಲಿ ಯಾವುದೇ ಉತ್ತರವಿಲ್ಲದಿದ್ದರೆ Grievance Portal ನಲ್ಲಿ ದೂರು ನೀಡಿ\n\n`;
    
    response += `**📋 ಅಗತ್ಯ ದಾಖಲೆಗಳು:**\n`;
    response += `• ಆಧಾರ್ ಕಾರ್ಡ್, ವಿಳಾಸ ಪುರಾವೆ, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಹಕ್ಕುಗಳು:**\n`;
    response += `• National Food Security Act, 2013 ಅಡಿಯಲ್ಲಿ ಅಗ್ಗಿ ಧಾನ್ಯ ಪಡೆಯುವ ಹಕ್ಕು\n`;
    response += `• ಕಾರಣವಿಲ್ಲದೆ ಅರ್ಜಿ ತಿರಸ್ಕರಿಸಿದರೆ RTI ಸಲ್ಲಿಸಬಹುದು\n\n`;
    
  } else if (issueType === 'mgnrega' || /ಸಂಬಳ|salary|wage|payment/.test(query.toLowerCase())) {
    response += `1. ನಿಮ್ಮ Job Card ನ ಫೋಟೋ ಕಾಪಿ ಇರಿಸಿಕೊಳ್ಳಿ\n`;
    response += `2. Gram Panchayat ಅಥವಾ Block office ನಲ್ಲಿ ಲಿಖಿತ ದೂರು ನೀಡಿ\n`;
    response += `3. 15 ದಿನದಲ್ಲಿ ಪಾವತಿ ಬರದಿದ್ದರೆ ಪರಿಹಾರ ಸಿಗುತ್ತದೆ\n`;
    response += `4. MGNREGA Helpline: 1800-345-22-44 ಗೆ ಕರೆ ಮಾಡಿ\n`;
    response += `5. ಆನ್‌ಲೈನ್ ದೂರು: nrega.nic.in/netnrega/homestciti.aspx ನಲ್ಲಿ\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಹಕ್ಕುಗಳು:**\n`;
    response += `• MGNREGA Act 2005 ಅಡಿಯಲ್ಲಿ 15 ದಿನದಲ್ಲಿ ಪಾವತಿ ಕಡ್ಡಾಯ\n`;
    response += `• ವಿಳಂಬವಾದರೆ ದಿನಕ್ಕೆ 0.05% ಪರಿಹಾರ ಸಿಗುತ್ತದೆ\n`;
    response += `• ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಕೆಲಸ ನಿರಾಕರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ\n\n`;
    
  } else if (issueType === 'pension') {
    response += `1. ನಿಮ್ಮ Bank/Post Office ನಿಂದ ಪಿಂಚಣಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ\n`;
    response += `2. Tehsil/Block office ನಲ್ಲಿ Application Update ಮಾಡಿಸಿ\n`;
    response += `3. ಪಿಂಚಣಿ ನಿಂತಿದ್ದರೆ ಕಾರಣ ಕೇಳಿ (ಲಿಖಿತವಾಗಿ)\n`;
    response += `4. NSAP Portal: nsap.nic.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ track ಮಾಡಿ\n`;
    response += `5. State Social Welfare Department ನಲ್ಲಿ ದೂರು ನೀಡಿ\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಹಕ್ಕುಗಳು:**\n`;
    response += `• ವಿಧವೆ/ವೃದ್ಧರ/ದಿವ್ಯಾಂಗರ ಪಿಂಚಣಿ ಯೋಜನೆಯಡಿ ಮಾಸಿಕ ಸಹಾಯದ ಹಕ್ಕು\n`;
    response += `• ಕಾರಣವಿಲ್ಲದೆ ಪಿಂಚಣಿ ನಿಲ್ಲಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ\n\n`;
    
  } else if (issueType === 'assault' || issueType === 'harassment' || issueType === 'theft') {
    response += `1. **ಮೊದಲು ನಿಮ್ಮ ಸುರಕ್ಷತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ** - ಅಪಾಯದಿಂದ ದೂರವಿರಿ\n`;
    response += `2. ವಿಶ್ವಾಸಾರ್ಹ ವ್ಯಕ್ತಿಗೆ ತಕ್ಷಣ ತಿಳಿಸಿ\n`;
    response += `3. ಗಂಭೀರವಾಗಿದ್ದರೆ 100/112 ಡಯಲ್ ಮಾಡಿ (Emergency)\n`;
    response += `4. ಗಾಯವಿದ್ದರೆ Medical certificate ತೆಗೆದುಕೊಳ್ಳಿ\n`;
    response += `5. ಪುರಾವೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ - ಫೋಟೋ, ವೀಡಿಯೋ, ಸಾಕ್ಷಿಗಳು\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಕ್ರಮ:**\n\n`;
    if (ipcSection) {
      response += `ಇದು **${ipcSection.description}** ಪ್ರಕರಣವಾಗಿದ್ದು **IPC ವಿಭಾಗ ${ipcSection.section}** ಅಡಿಯಲ್ಲಿ ಬರುತ್ತದೆ।\n\n`;
      response += `**ಶಿಕ್ಷೆ:** ${ipcSection.punishment}\n\n`;
    }
    
    response += `**ಮುಂದಿನ ಹಂತಗಳು:**\n`;
    response += `1. 72 ಗಂಟೆಯೊಳಗೆ ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ FIR ದಾಖಲಿಸಿ\n`;
    response += `2. FIR ಸಂಖ್ಯೆ ಮತ್ತು ಕಾಪಿ ತೆಗೆದುಕೊಳ್ಳಿ (ಇದು ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕು)\n`;
    response += `3. ಪೊಲೀಸರು FIR ಬರೆಯದಿದ್ದರೆ:\n`;
    response += `   • SP/Commissioner ಗೆ ಲಿಖಿತ ದೂರು ನೀಡಿ\n`;
    response += `   • ಆನ್‌ಲೈನ್ FIR: ನಿಮ್ಮ ರಾಜ್ಯದ police website ನಲ್ಲಿ\n`;
    response += `   • Magistrate court ನಲ್ಲಿ ನೇರವಾಗಿ ದೂರು ನೀಡಬಹುದು\n\n`;
    
  } else if (issueType === 'cheating' || issueType === 'fraud') {
    response += `1. ತಕ್ಷಣ ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಿ (SMS, emails, receipts)\n`;
    response += `2. Bank/Payment gateway ಗೆ ತಿಳಿಸಿ ಮತ್ತು transaction block ಮಾಡಿಸಿ\n`;
    response += `3. Cyber Crime Portal ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ದೂರು ನೀಡಿ: cybercrime.gov.in\n`;
    response += `4. National Cyber Crime Helpline: 1930 ಗೆ ಕರೆ ಮಾಡಿ\n`;
    response += `5. ಆನ್‌ಲೈನ್ fraud ಆಗಿದ್ದರೆ ನಿಮ್ಮ bank ನಲ್ಲಿ dispute raise ಮಾಡಿ\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಕ್ರಮ:**\n\n`;
    if (ipcSection) {
      response += `ಇದು **IPC ವಿಭಾಗ ${ipcSection.section} - ${ipcSection.description}** ಅಡಿಯಲ್ಲಿ ಬರುತ್ತದೆ।\n`;
      response += `**ಶಿಕ್ಷೆ:** ${ipcSection.punishment}\n\n`;
    }
    
    response += `**FIR ಗಾಗಿ:**\n`;
    response += `• ಪೊಲೀಸ್ ಠಾಣೆ ಅಥವಾ Cyber Crime Police Station ಗೆ ಹೋಗಿ\n`;
    response += `• ಎಲ್ಲಾ ಪುರಾವೆಗಳನ್ನು ತೆಗೆದುಕೊಂಡು ಹೋಗಿ (screenshots, bank statements)\n\n`;
    
  } else if (/ಜಮೀನು|land|property|dispute/.test(query.toLowerCase())) {
    response += `1. ನಿಮ್ಮ Property Documents ನ ಸಂಪೂರ್ಣ ಪರಿಶೀಲನೆ ಮಾಡಿ\n`;
    response += `2. Tehsildar/Revenue Office ನಿಂದ Land Records ತೆಗೆದುಕೊಳ್ಳಿ\n`;
    response += `3. Boundary dispute ಇದ್ದರೆ Survey ಮಾಡಿಸಿ\n`;
    response += `4. ಮೊದಲು Panchayat/Local Authority ನಲ್ಲಿ ದೂರು ನೀಡಿ\n`;
    response += `5. ಪರಿಹಾರವಾಗದಿದ್ದರೆ Civil Court ನಲ್ಲಿ case file ಮಾಡಿ\n\n`;
    
    response += `**⚖️ ಕಾನೂನು ಆಯ್ಕೆಗಳು:**\n`;
    response += `• Mediation/Conciliation ಮೊದಲು ಪ್ರಯತ್ನಿಸಿ (ಕಡಿಮೆ ಖರ್ಚು, ವೇಗವಾದ ಪರಿಹಾರ)\n`;
    response += `• Legal Aid Services ನಿಂದ ಉಚಿತ ವಕೀಲ ಸಿಗಬಹುದು\n`;
    response += `• Lok Adalat ನಲ್ಲಿ case ತೆಗೆದುಕೊಳ್ಳಬಹುದು\n\n`;
    
  } else {
    response += `1. ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸಿ\n`;
    response += `2. ಸಂಬಂಧಿತ ಇಲಾಖೆಯಲ್ಲಿ ಲಿಖಿತ ದೂರು ನೀಡಿ\n`;
    response += `3. 30 ದಿನದಲ್ಲಿ ಉತ್ತರವಿಲ್ಲದಿದ್ದರೆ RTI ಸಲ್ಲಿಸಿ\n`;
    response += `4. Grievance Portal ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ದೂರು ನೀಡಿ\n`;
    response += `5. ಅಗತ್ಯವಿದ್ದರೆ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ\n\n`;
  }
  
  response += `**🆘 ಉಚಿತ ಕಾನೂನು ಸಹಾಯ:**\n\n`;
  response += `• NALSA Helpline: **15100** (ರಾಷ್ಟ್ರೀಯ ಕಾನೂನು ಸೇವಾ ಪ್ರಾಧಿಕಾರ)\n`;
  response += `• District Legal Services Authority ಗೆ ಹೋಗಿ\n`;
  response += `• ಆನ್‌ಲೈನ್: nalsa.gov.in\n`;
  response += `• ನಿಮ್ಮ ಆದಾಯ ₹3 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆಯಿದ್ದರೆ ಉಚಿತ ವಕೀಲ ಸಿಗುತ್ತದೆ\n\n`;
  
  if (relevantPortal) {
    response += `**🌐 ಸಂಬಂಧಿತ Portal:**\n`;
    response += `${relevantPortal.name}: ${relevantPortal.url}\n\n`;
  }
  
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

      NyayaGhost Backend Server         
                                       
   Port: ${PORT}                           
   Environment: ${process.env.NODE_ENV || 'development'}      
   Status: ✓ Running                    

  `);
});