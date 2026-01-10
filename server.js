require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

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