# Contributing to NyayaGhost

Thank you for your interest in contributing to NyayaGhost! This is a **public good project** aimed at closing India's justice and welfare awareness gap. Every contribution helps empower millions.

---

## 🎯 Ways to Contribute

### 1. Code Contributions
- **AI/ML**: Improve RightFinder accuracy, build dialect models
- **Backend**: Scale APIs, integrate government portals
- **Frontend**: Enhance accessibility, add languages
- **DevOps**: CI/CD, monitoring, deployment automation

### 2. Domain Expertise
- **Legal**: Curate rights database, validate document templates
- **Social Work**: Map welfare schemes, verify eligibility criteria
- **Linguistics**: Translate UI, improve dialect speech models
- **UX Research**: Conduct rural usability testing

### 3. Documentation
- User guides in regional languages
- API documentation
- Case studies and impact reports
- Video tutorials for illiterate users

### 4. Community Support
- Answer questions in GitHub Discussions
- Test features and report bugs
- Share project with NGOs and activists
- Conduct field trials in rural communities

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git basics
- Familiarity with Express.js (backend) or vanilla JS (frontend)
- Understanding of Indian legal/welfare system (helpful but not required)

### Setup Development Environment

1. **Fork and clone**
```bash
git clone https://github.com/YOUR_USERNAME/NyayaGhost.git
cd NyayaGhost
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
# Add your test API keys
```

4. **Run locally**
```bash
# Backend
node server.js

# Frontend (in separate terminal)
npx http-server -p 8080
# Open http://localhost:8080
```

5. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

---

## 📝 Code Guidelines

### JavaScript Style
- **ES6+ syntax** preferred
- **2-space indentation**
- **Semicolons required**
- **Descriptive variable names** (avoid single letters except loop counters)
- **Comments for complex logic**

**Good:**
```javascript
const userQuery = voiceTranscript.trim().toLowerCase();
const matchedRights = await rightFinderEngine(userQuery, userLanguage);
```

**Avoid:**
```javascript
const q=v.trim().toLowerCase();
const r=await rfe(q,l);
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Bhojpuri dialect support
fix: resolve speech recognition timeout on slow networks
docs: update API documentation for ghostfiling endpoint
refactor: extract RightFinder logic into separate module
test: add unit tests for document generation
```

### File Structure
```
src/
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── services/       # API calls, speech handling
│   └── utils/          # Helper functions
├── backend/
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic
│   ├── models/         # Data schemas
│   └── services/       # External integrations
└── tests/
    ├── unit/
    └── integration/
```

---

## 🧪 Testing

### Before Submitting PR

1. **Run tests**
```bash
npm test
```

2. **Check for errors**
```bash
npm run lint
```

3. **Test in browser**
- Chrome (voice recognition primary)
- Firefox (fallback testing)
- Mobile Safari (iOS testing)

4. **Manual testing checklist**
- [ ] Voice input works in all 3 languages
- [ ] Ghost animation loads properly
- [ ] API responses are correct
- [ ] Error handling shows user-friendly messages
- [ ] PWA installs correctly

---

## 🔍 Pull Request Process

### 1. Before Creating PR

- Ensure your code follows the style guide
- Add/update tests for new features
- Update documentation (README, TECH.md, etc.)
- Test on multiple browsers
- Rebase on latest `main` branch

### 2. PR Title Format
```
[Type] Brief description

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
- `[feat] Add Telugu language support`
- `[fix] Resolve Aadhaar scanner crash on iOS`
- `[docs] Add deployment guide for Railway`

### 3. PR Description Template

```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on mobile device

## Screenshots/Recordings
(if UI changes)

## Related Issues
Closes #123
```

### 4. Review Process
- Maintainers will review within 2-3 days
- Address feedback with new commits
- Once approved, squash and merge

---

## 🌐 Internationalization (i18n)

### Adding a New Language

1. **Update language toggle** in `index.html`:
```html
<button data-lang="tamil">தமிழ்</button>
```

2. **Add speech recognition code** in `script.js`:
```javascript
} else if (currentLanguage === 'tamil') {
  recognition.lang = 'ta-IN';
}
```

3. **Create translation file** in `locales/ta.json`:
```json
{
  "welcome": "வரவேற்கிறோம்",
  "mic_button": "பேசுங்கள்",
  "listening": "கேட்கிறேன்..."
}
```

4. **Update RightFinder** to handle Tamil queries

5. **Test with native speakers**

---

## 🛡️ Security & Privacy Guidelines

### Sensitive Data Handling

**NEVER commit**:
- API keys (use `.env`)
- User personal data (Aadhaar, phone numbers)
- Production credentials

**ALWAYS**:
- Hash user identifiers
- Encrypt data in transit (HTTPS)
- Get explicit consent before data collection
- Implement right to deletion

### Code Review Checklist
- [ ] No hardcoded secrets
- [ ] User input sanitized (prevent XSS)
- [ ] Database queries parameterized (prevent SQL injection)
- [ ] Rate limiting on APIs
- [ ] CORS properly configured

---

## 📊 Performance Guidelines

### Frontend
- Keep `script.js` under 50KB uncompressed
- Lazy load images and animations
- Use service workers for offline caching
- Target 90+ Lighthouse score

### Backend
- Response time < 200ms for simple queries
- Use caching for static data (legal DB)
- Implement pagination for large datasets
- Monitor memory usage (Node.js can leak)

---

## 🧩 Feature Request Process

### Before Requesting
1. Check existing issues/discussions
2. Validate against project mission
3. Consider impact on illiterate/rural users

### Creating Feature Request

Use the issue template:
```markdown
## Problem Statement
Describe the user need

## Proposed Solution
Your idea for solving it

## Alternatives Considered
Other approaches you thought about

## Impact
- Who benefits?
- How many users affected?
- Alignment with justice gap mission
```

---

## 📚 Resources for Contributors

### Legal Knowledge
- [NALSA Website](http://nalsa.gov.in)
- [myScheme Portal](https://www.myscheme.gov.in)
- [eCourts Services](https://ecourts.gov.in)
- [India Code (searchable acts)](https://www.indiacode.nic.in)

### Technical References
- [Web Speech API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Indian Language Computing](http://www.bhashaindia.com)

### Design & UX
- [Designing for Low-Literacy Users](https://www.nngroup.com/articles/low-literacy-users/)
- [Voice UI Design Guidelines](https://designguidelines.withgoogle.com/conversation/)

---

## 🏆 Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Credited in impact reports
- Invited to community calls
- Eligible for swag (stickers, t-shirts)

**Top contributors** (10+ merged PRs) become **Core Maintainers** with voting rights on major decisions.

---

## 📞 Questions?

- **GitHub Discussions**: For feature ideas, questions
- **Issues**: For bugs, specific technical questions
- **Email**: [maintainer email] for sensitive topics
- **Community Calls**: Monthly video call (announced in Discussions)

---

## 📄 Code of Conduct

### Our Pledge
We are committed to providing a welcoming, inclusive environment for all contributors regardless of:
- Experience level
- Education background
- Geographic location
- Gender, race, religion, or other identity

### Expected Behavior
- Be respectful and constructive
- Focus on what's best for the project mission
- Assume good faith
- Accept feedback gracefully

### Unacceptable Behavior
- Harassment, discrimination, or trolling
- Publishing others' private information
- Off-topic arguments
- Spam or self-promotion unrelated to project

**Enforcement**: Violations may result in temporary ban or permanent removal from the project. Report to [email].

---

## 🙏 Thank You

Every line of code, every translation, every bug report brings us closer to a more just society. Your contribution matters.

> **"तुम्हारा हर योगदान न्याय को पहुँचाने में मदद करता है"**  
> *(Your every contribution helps deliver justice)*

---

**Ready to contribute?** Check out our [Good First Issues](https://github.com/Mahesharunaladi/NyayaGhost/labels/good%20first%20issue) to get started!
