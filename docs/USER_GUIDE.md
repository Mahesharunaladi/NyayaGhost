# NyayaGhost User Guide
## कैसे इस्तेमाल करें | How to Use

---

## 📱 For Users (हिंदी में)

### शुरुआत कैसे करें

1. **वेबसाइट खोलें**
   - अपने फोन के browser में जाएं
   - `nyayaghost.com` टाइप करें (या जो URL दिया गया हो)

2. **भाषा चुनें**
   - Bhojpuri, हिंदी, या English चुनें
   - आपकी सुविधा के अनुसार

3. **🎤 माइक बटन दबाएं**
   - बीच में लाल गोला (🎤) दबाएं
   - अपनी परेशानी बताएं

### उदाहरण: क्या बोलें?

✅ **अच्छे उदाहरण:**
- "मेरी मजदूरी नहीं मिली दो महीने से"
- "Ration card कैसे बनाएं?"
- "Widow pension के लिए apply करना है"
- "मेरे जमीन पर कब्जा हो गया"
- "मुफ्त वकील चाहिए"

❌ **कम जानकारी वाले:**
- "मदद चाहिए" (कैसी मदद?)
- "पैसा नहीं मिला" (कौन सा पैसा? किससे?)

### आपको क्या मिलेगा?

#### 1. आपके अधिकार (Your Rights)
- कौन सा कानून है आपकी मदद के लिए
- कहां शिकायत करें
- कितने दिन में जवाब मिलेगा

#### 2. सरकारी योजनाएं (Government Schemes)
- कौन सी scheme के लिए eligible हैं
- कितना पैसा मिलेगा
- कैसे apply करें

#### 3. केस फाइलिंग (Case Filing)
- Automatic FIR/complaint draft
- SMS पर status updates
- अगले steps की जानकारी

---

## 🖥️ For Administrators (English)

### Setting Up for Community Centers

If you're running this at a Common Service Center (CSC) or NGO:

#### 1. Installation
```bash
# Clone the project
git clone https://github.com/Mahesharunaladi/NyayaGhost.git

# Install dependencies
npm install

# Start the server
npm start
```

#### 2. Tablet/Kiosk Mode
- Use Chrome in fullscreen mode (F11)
- Disable sleep mode in system settings
- Connect external microphone for better audio
- Print language selection guide in local dialect

#### 3. Daily Operations

**Morning Checklist:**
- [ ] Check internet connection
- [ ] Test microphone
- [ ] Verify backend server is running
- [ ] Clear browser cache if slow

**Per User:**
- [ ] Explain voice input (show demo)
- [ ] Select their language
- [ ] Let them speak naturally
- [ ] Show results, explain options
- [ ] Help with document download if needed

**Evening:**
- [ ] Export daily usage stats
- [ ] Charge devices
- [ ] Report any technical issues

### Privacy Guidelines

⚠️ **IMPORTANT - Never:**
- Record Aadhaar numbers permanently
- Share user data with unauthorized parties
- Take screenshots of personal information
- Leave screen unattended with user data

✅ **Always:**
- Get explicit verbal consent
- Clear session data after each user
- Use incognito mode for sensitive cases
- Explain data usage in simple language

---

## 🎯 Common User Scenarios

### Scenario 1: MGNREGA Wage Delay

**User Says:**
> "हमार मनरेगा के पइसा नहीं मिला, दो महीना हो गया"

**System Response:**
1. Identifies: MGNREGA wage payment delay
2. Shows legal right: Payment within 15 days
3. Suggests actions:
   - Complaint to BDO
   - Register on MGNREGA portal
   - Apply for compensation (0.05% per day)
4. Offers: Auto-generate complaint

**Next Steps for User:**
- Download complaint letter
- Submit to Block Office
- Get acknowledgment receipt
- Track status via SMS

### Scenario 2: Widow Pension Application

**User Says:**
> "Mere husband ka death ho gaya, pension kaise milega?"

**System Response:**
1. Identifies: Widow pension eligibility
2. Shows schemes:
   - Central: ₹300/month
   - State top-up (e.g., Rajasthan: ₹500)
3. Lists required documents:
   - Death certificate
   - Aadhaar
   - BPL card
   - Bank passbook
4. Shows application form

**Next Steps for User:**
- Print/download application
- Collect documents
- Submit to Block Office
- Follow up in 30-60 days

### Scenario 3: Free Lawyer Request

**User Says:**
> "मुझे lawyer चाहिए par paise nahi hai"

**System Response:**
1. Explains: NALSA free legal aid
2. Eligibility: SC/ST, women, poor (income < ₹3 lakh)
3. Shows nearest DLSA office
4. Provides helpline: 15100
5. Offers: Application form for legal aid

---

## 📊 For NGO Partners

### Integration Guide

#### Embed NyayaGhost in Your Website
```html
<iframe 
  src="https://nyayaghost.com" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

#### WhatsApp Bot Integration
Coming soon - users can query via WhatsApp message

#### Bulk Training Sessions
Contact us for:
- Train-the-trainer workshops
- Printed multilingual guides
- Video tutorials in regional languages
- Impact measurement dashboards

---

## 🔧 Troubleshooting

### Issue: Microphone Not Working

**Solutions:**
1. Check browser permissions (Chrome → Settings → Privacy → Microphone)
2. Ensure HTTPS connection (voice API requires secure context)
3. Try different browser (Chrome recommended)
4. Test external microphone

### Issue: Language Not Recognized

**Solutions:**
1. Speak clearly, not too fast
2. Reduce background noise
3. Try typing instead (future feature)
4. Use Hindi as fallback for Bhojpuri

### Issue: No Internet Connection

**Good News:** Basic UI works offline!
- Can still access cached information
- Save queries for later sync
- View previously generated documents

**Limitations:**
- AI matching won't work
- Can't file cases online
- Scheme database not updated

---

## 📞 Support Contacts

**For Users:**
- Helpline: [Coming soon]
- WhatsApp: [Coming soon]
- Walk-in: Nearest CSC / DLSA office

**For Partners/NGOs:**
- Email: [Your email]
- GitHub Issues: Technical problems
- Community Forum: Best practices sharing

---

## 🌟 Success Stories

### Case Study 1: Bihar Farmer
**Problem:** MGNREGA payment delayed 4 months  
**Solution:** Used NyayaGhost to file complaint  
**Outcome:** Received ₹15,600 (wages + compensation) in 3 weeks

### Case Study 2: Rajasthan Widow
**Problem:** Unaware of pension scheme  
**Solution:** Discovered eligibility via voice query  
**Outcome:** Now receiving ₹800/month pension

---

## 🙏 Feedback

Help us improve! After using NyayaGhost, please share:
- Was it easy to use? (Yes/No)
- Did you find your answer? (Yes/No)
- What can we improve?

**Quick Feedback:**
[QR Code link to Google Form]

---

## 📚 Legal Disclaimer

NyayaGhost provides legal information, not legal advice. For complex cases, please consult a qualified lawyer. Auto-generated documents should be reviewed before submission. We are not responsible for outcomes, but we're here to help you access your rights.

---

**Version:** 1.0  
**Last Updated:** January 10, 2026  
**Languages:** Bhojpuri, Hindi, English (more coming soon)

---

> **हर सवाल का जवाब है, बस पूछना आना चाहिए**  
> *(Every question has an answer, you just need to know how to ask)*
