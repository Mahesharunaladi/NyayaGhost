require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const legalDB = {
  'MGNREGA पेमेंट डिले': 'मजदूरी का 15 दिनों के अंदर भुगतान होना चाहिए'
};

app.post('/api/rightfinder', (req, res) => {
  const { query } = req.body;
  const right = legalDB[query] || 'संबंधित अधिकार नहीं मिला';
  res.json({ right });
});

app.post('/api/ghostfiling', (req, res) => {
  const caseData = { ...req.body, caseId: 'NYAYA-' + Date.now() };
  res.json({ success: true, caseData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));