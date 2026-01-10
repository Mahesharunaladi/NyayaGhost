# 🚀 Quick Start Guide

## Get NyayaGhost Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- A terminal/command prompt
- A modern browser (Chrome recommended)

---

## 📦 Installation

### Step 1: Clone or Download
```bash
# If you have Git installed:
git clone https://github.com/Mahesharunaladi/NyayaGhost.git
cd NyayaGhost

# OR download ZIP from GitHub and extract
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your preferred text editor
# For now, you can leave defaults for testing
```

---

## ▶️ Running the Application

### Option 1: Run Everything (Recommended for Development)

**Terminal 1 - Backend Server:**
```bash
npm start
```
You should see:
```
╔═══════════════════════════════════════╗
║     NyayaGhost Backend Server         ║
║                                       ║
║  Port: 3000                           ║
║  Environment: development             ║
║  Status: ✓ Running                    ║
╚═══════════════════════════════════════╝
```

**Terminal 2 - Frontend (Optional if accessing via file://):**
```bash
npm run frontend
```
Then open: `http://localhost:8080`

**OR** simply open `index.html` directly in your browser!

---

## ✅ Testing the Application

### 1. Open the Frontend
- Navigate to `http://localhost:8080` 
- Or open `index.html` in Chrome

### 2. Test Voice Input
1. Click the language button (Hindi, English, or Bhojpuri)
2. Click the 🎤 microphone button
3. Allow microphone permissions
4. Say one of these test phrases:

**Test Phrases:**
- **Hindi:** "मेरी मजदूरी नहीं मिली"
- **English:** "MGNREGA payment delay"
- **Hindi:** "Ration card kaise banaye"
- **English:** "I need a free lawyer"

### 3. Expected Behavior
- Voice transcript appears on screen
- System finds matching legal rights
- Remedies and next steps are displayed
- After 5 seconds, auto-navigates to case filing page

---

## 🧪 Testing Without Microphone

If you don't have a microphone or it's not working:

### Quick Backend Test (API only)

**Test the RightFinder API:**
```bash
curl -X POST http://localhost:3000/api/rightfinder \
  -H "Content-Type: application/json" \
  -d '{"query": "MGNREGA payment delay", "language": "english"}'
```

**Expected Response:**
```json
{
  "query": "MGNREGA payment delay",
  "language": "english",
  "matches": [
    {
      "id": "RIGHT_MGNREGA_001",
      "title": "MGNREGA Wage Payment Guarantee",
      "description": "मजदूरी का 15 दिनों के अंदर भुगतान होना चाहिए",
      ...
    }
  ],
  "count": 1
}
```

**Test Case Filing:**
```bash
curl -X POST http://localhost:3000/api/ghostfiling \
  -H "Content-Type: application/json" \
  -d '{
    "caseType": "MGNREGA_complaint",
    "consent": true,
    "userDetails": {"name": "Test User"},
    "incident": {"description": "Wage delay"}
  }'
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue 2: "Port 3000 already in use"
**Solution:**
```bash
# Option A: Kill existing process
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_number> /F

# Option B: Change port in .env
echo "PORT=3001" >> .env
npm start
```

### Issue 3: Microphone not working
**Solutions:**
1. Ensure you're using **HTTPS** or **localhost** (required by browser)
2. Check browser permissions: Chrome → Settings → Privacy → Microphone
3. Try a different browser (Chrome recommended)
4. Use the curl tests above to test backend independently

### Issue 4: CORS errors
**Solution:**
Update `.env` with your frontend URL:
```bash
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

---

## 📂 Project Structure Overview

```
NyayaGhost/
├── index.html          # Main UI
├── script.js           # Frontend logic
├── style.css           # Styling
├── server.js           # Backend API
├── sw.js               # Service Worker (PWA)
├── manifest.json       # PWA config
├── package.json        # Dependencies
├── .env.example        # Environment template
├── docs/               # Documentation
│   ├── TECH.md
│   ├── USER_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── DATABASE_SCHEMA.md
└── assets/             # Images, fonts, animations
```

---

## 🎯 Next Steps

### For Developers:
1. ✅ You've got it running!
2. Read `docs/TECH.md` for architecture
3. Read `CONTRIBUTING.md` to add features
4. Check `docs/DATABASE_SCHEMA.md` to expand rights database

### For Deployers:
1. Read `docs/DEPLOYMENT.md`
2. Choose hosting: Railway, Heroku, AWS
3. Set up production environment variables
4. Configure SSL/HTTPS

### For Users:
1. Read `docs/USER_GUIDE.md`
2. Test with real scenarios
3. Provide feedback via GitHub Issues

---

## 🎨 Customization Ideas

### Add More Legal Rights
Edit `server.js`, expand the `legalDB` object:
```javascript
const legalDB = {
  'your new query': {
    id: 'RIGHT_CUSTOM_001',
    title: 'Your Right Title',
    description: 'Description in Hindi/English',
    remedies: ['Step 1', 'Step 2'],
    confidence: 0.85
  },
  // ... existing rights
};
```

### Add New Languages
1. Update language buttons in `index.html`
2. Add language code in `script.js` recognition setup
3. Translate UI text in `index.html`
4. Add translations in `legalDB` entries

### Customize Styling
Edit `style.css` to match your organization's branding

---

## 📊 Monitoring

### Check Server Health
```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{"status":"ok","timestamp":"2026-01-10T12:34:56.789Z"}
```

### View Logs
Backend logs appear in Terminal 1 where you ran `npm start`

---

## 🆘 Getting Help

- **Documentation:** Check `docs/` folder
- **Issues:** [GitHub Issues](https://github.com/Mahesharunaladi/NyayaGhost/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Mahesharunaladi/NyayaGhost/discussions)
- **Email:** [Your contact email]

---

## ✨ You're Ready!

Your NyayaGhost instance is now running. Start testing with voice queries and explore the platform.

**Remember:** This is an MVP. The real power comes from:
1. Expanding the legal rights database
2. Integrating AI (GPT-4/Gemini) for better matching
3. Connecting to real government APIs
4. Community feedback and iteration

---

**Happy hacking for justice! 🕊️**

---

## 📜 License

This project is licensed under AGPL-3.0 - see LICENSE file for details.

## 🙏 Acknowledgments

Built with the mission to close India's justice gap and empower millions with knowledge of their rights.
