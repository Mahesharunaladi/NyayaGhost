# 🎤 AI Legal Advisor Feature

## Overview
Your Nyaya Mitra app now provides **intelligent legal advice** based on voice input! Users can speak their problem and get:
- ✅ Legal advice in their language
- 📋 Relevant IPC sections (for complaints)
- 📍 Nearest police stations (for criminal matters)
- 🌐 Government portal links (for services)

## Features Implemented

### 1. **AI-Powered Legal Advice**
- Analyzes user's spoken query
- Provides actionable legal guidance
- Shows specific steps to take
- Lists user's rights

### 2. **IPC Section Recommendations**
When a user mentions criminal matters like:
- चोरी (theft) → IPC 379
- मारपीट (assault) → IPC 323
- बलात्कार (rape) → IPC 376
- धोखाधड़ी (cheating) → IPC 420
- छेड़छाड़ (harassment) → IPC 354
- दहेज उत्पीड़न (dowry) → IPC 498A

The system automatically shows:
- Section number
- Description in Hindi
- Punishment details

### 3. **Nearest Police Station Finder**
For criminal complaints, users can:
- Click "नजदीकी पुलिस स्टेशन खोजें"
- Grant location permission
- See list of nearby police stations with:
  - Name & address
  - Phone number
  - Distance
  - Google Maps link

### 4. **Government Portal Links**
Automatically redirects to relevant portals:
- राशन कार्ड → National Food Security Portal
- पेंशन → NSAP Portal
- मजदूरी → MGNREGA Portal
- आधार → UIDAI Portal
- PAN → Income Tax Portal

## How It Works

### User Flow:
1. User selects language (हिंदी, English, ಕನ್ನಡ, etc.)
2. Clicks microphone 🎤 and speaks problem
3. Speech is converted to text
4. Backend analyzes the query
5. AI generates legal advice
6. Results displayed with:
   - Legal advice
   - IPC sections (if applicable)
   - Steps to take
   - User rights
   - Police station button (if needed)
   - Portal links (if applicable)
   - Helpline numbers

### Example Queries:

**Query 1:** "मेरा राशन कार्ड नहीं बना"
- Shows: Steps to apply for ration card
- Portal: National Food Security Portal link
- No IPC section needed

**Query 2:** "मेरे साथ मारपीट हुई है"
- Shows: IPC Section 323 (Assault)
- Steps: Get MLC, file FIR
- Button: Find nearest police station
- Helplines: Police 100, NALSA 15100

**Query 3:** "मुझे पेंशन चाहिए"
- Shows: Pension application steps
- Portal: NSAP Portal link
- Documents required
- Eligibility criteria

## API Endpoints

### POST `/api/legal-advice`
```json
{
  "query": "मेरा वेतन नहीं मिला",
  "language": "hindi"
}
```

**Response:**
```json
{
  "query": "मेरा वेतन नहीं मिला",
  "language": "hindi",
  "analysis": {
    "issueType": "mgnrega",
    "ipcSection": null,
    "needsPoliceComplaint": false,
    "relevantPortal": {
      "name": "MGNREGA Portal",
      "url": "https://nrega.nic.in/",
      "description": "मजदूरी शिकायत दर्ज करें"
    }
  },
  "advice": {
    "text": "MGNREGA के तहत आपको 15 दिन में मजदूरी पाने का अधिकार है।",
    "steps": [
      "1. Block Development Officer को लिखित शिकायत दें",
      "2. MGNREGA portal पर complaint दर्ज करें",
      "3. Delayed payment पर 0.05% daily interest मिलेगा"
    ],
    "rights": [
      "15 दिन में payment का अधिकार",
      "Delay पर interest का अधिकार"
    ],
    "helpResources": [...]
  }
}
```

### POST `/api/nearest-police-station`
```json
{
  "latitude": 25.5941,
  "longitude": 85.1376
}
```

**Response:**
```json
{
  "success": true,
  "stations": [
    {
      "name": "साहिबगंज पुलिस स्टेशन",
      "address": "Main Road, District Center",
      "phone": "0612-2234567",
      "distance": "2.3 km",
      "mapsUrl": "https://maps.google.com/?q=police+station"
    }
  ]
}
```

## Supported Issue Types

### Criminal Matters (need police complaint):
- ✓ Theft (चोरी)
- ✓ Assault (मारपीट)
- ✓ Rape (बलात्कार)
- ✓ Cheating (धोखाधड़ी)
- ✓ Harassment (छेड़छाड़)
- ✓ Dowry (दहेज)
- ✓ Domestic Violence (घरेलू हिंसा)

### Government Services:
- ✓ Ration Card (राशन कार्ड)
- ✓ Pension (पेंशन)
- ✓ MGNREGA Wages (मजदूरी)
- ✓ Aadhaar (आधार)
- ✓ PAN Card

### General Legal Aid:
- ✓ Free Lawyer (मुफ्त वकील)
- ✓ Legal Rights

## Helpline Numbers Displayed

| Service | Number | Description |
|---------|--------|-------------|
| NALSA | 15100 | मुफ्त कानूनी सहायता |
| Women Helpline | 181 | महिला हेल्पलाइन |
| Child Helpline | 1098 | बाल हेल्पलाइन |
| Police | 100 | आपातकालीन सेवा |

## Future Enhancements

### Phase 2 (Recommended):
1. **Real AI Integration**
   - Add Google Gemini API key to `.env`
   - Get smarter, context-aware advice
   
2. **Real Police Station Data**
   - Integrate with actual police station database
   - Real-time distance calculation
   
3. **Multi-step Workflow**
   - Guide user through filing FIR
   - Generate pre-filled complaint forms
   
4. **Voice Response**
   - Read advice back in user's language
   - Full voice conversation

5. **Case Tracking**
   - Save user's cases
   - Send SMS/WhatsApp updates
   - Track complaint status

## Testing

### Test the feature:
1. Open `http://localhost:8081` in Chrome
2. Select language (हिंदी or English)
3. Click 🎤 microphone button
4. Say one of these:
   - "मेरे साथ चोरी हुई है"
   - "मुझे राशन कार्ड चाहिए"
   - "मेरी पेंशन नहीं आई"
   - "मुझे मुफ्त वकील चाहिए"

### Expected Result:
- ✅ Speech recognized
- ✅ Legal advice displayed
- ✅ IPC section shown (if criminal matter)
- ✅ Steps to take listed
- ✅ Rights explained
- ✅ Police station button (if needed)
- ✅ Portal link (if applicable)
- ✅ Helpline numbers shown

## Tech Stack
- **Frontend**: Vanilla JS with Web Speech API
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (fallback to rule-based)
- **Location**: Browser Geolocation API

## Files Modified
- ✅ `index.html` - Added `fetchLegalAdvice()` and `findNearestPoliceStation()`
- ✅ `server.js` - Added `/api/legal-advice` and `/api/nearest-police-station`

---

**Made with 🧡 for Nyaya Mitra - Justice for All**
