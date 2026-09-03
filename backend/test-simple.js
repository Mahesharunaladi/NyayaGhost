// Simple test to verify relevance fix
// Make sure server is running first: node server.js

const testQueries = [
  { query: "मेरी मजदूरी नहीं मिली", language: "hindi", expected: "LEGAL" },
  { query: "राशन कार्ड कैसे बनाएं", language: "hindi", expected: "LEGAL" },
  { query: "What is the weather today?", language: "english", expected: "NON-LEGAL" },
  { query: "मुझे एक जोक सुनाओ", language: "hindi", expected: "NON-LEGAL" }
];

async function test() {
  console.log('\n🧪 Testing Relevance Fix...\n');
  
  for (const testCase of testQueries) {
    try {
      const response = await fetch('http://localhost:3000/api/legal-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: testCase.query,
          language: testCase.language
        })
      });

      const data = await response.json();
      const isLegal = data.analysis?.isLegalQuery !== false;
      const result = isLegal ? "LEGAL" : "NON-LEGAL";
      const passed = (testCase.expected === result);
      
      console.log(`${passed ? '✅' : '❌'} "${testCase.query.substring(0, 30)}..." => ${result} (expected ${testCase.expected})`);
      
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Test complete!\n');
}

test().catch(console.error);
