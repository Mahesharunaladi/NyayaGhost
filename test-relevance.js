// Test script to verify irrelevant answer fix
// Run with: node test-relevance.js

const testQueries = [
  // Should be ACCEPTED (legal queries)
  {
    query: "मेरी मजदूरी नहीं मिली",
    language: "hindi",
    expectedResult: "ACCEPT",
    category: "MGNREGA Issue"
  },
  {
    query: "राशन कार्ड कैसे बनाएं",
    language: "hindi",
    expectedResult: "ACCEPT",
    category: "Ration Card"
  },
  {
    query: "चोरी हो गई है",
    language: "hindi",
    expectedResult: "ACCEPT",
    category: "Theft Complaint"
  },
  {
    query: "Free lawyer कहां मिलेगा",
    language: "hindi",
    expectedResult: "ACCEPT",
    category: "Legal Aid"
  },
  {
    query: "How to file FIR for assault",
    language: "english",
    expectedResult: "ACCEPT",
    category: "Police Complaint"
  },
  {
    query: "Pension scheme apply ಮಾಡುವುದು ಹೇಗೆ",
    language: "kannada",
    expectedResult: "ACCEPT",
    category: "Pension Scheme"
  },
  
  // Should be REJECTED (non-legal queries)
  {
    query: "What is the weather today?",
    language: "english",
    expectedResult: "REJECT",
    category: "Weather (Non-legal)"
  },
  {
    query: "मुझे एक जोक सुनाओ",
    language: "hindi",
    expectedResult: "REJECT",
    category: "Joke (Non-legal)"
  },
  {
    query: "How to cook biryani?",
    language: "english",
    expectedResult: "REJECT",
    category: "Cooking (Non-legal)"
  },
  {
    query: "क्रिकेट के बारे में बताओ",
    language: "hindi",
    expectedResult: "REJECT",
    category: "Cricket (Non-legal)"
  },
  {
    query: "What are good movies to watch?",
    language: "english",
    expectedResult: "REJECT",
    category: "Movies (Non-legal)"
  }
];

async function testQuery(testCase) {
  try {
    const response = await fetch('http://localhost:3000/api/legal-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: testCase.query,
        language: testCase.language
      })
    });

    const data = await response.json();
    
    // Check if query was properly categorized
    const isLegalQuery = data.analysis?.isLegalQuery !== false;
    const actualResult = isLegalQuery ? "ACCEPT" : "REJECT";
    const passed = actualResult === testCase.expectedResult;
    
    console.log(`\n${passed ? '✅ PASS' : '❌ FAIL'} | ${testCase.category}`);
    console.log(`   Query: "${testCase.query}"`);
    console.log(`   Expected: ${testCase.expectedResult} | Got: ${actualResult}`);
    console.log(`   Issue Type: ${data.analysis?.issueType || 'N/A'}`);
    
    if (data.advice?.text) {
      const preview = data.advice.text.substring(0, 80);
      console.log(`   Response: ${preview}...`);
    }
    
    return passed;
  } catch (error) {
    console.error(`\n❌ ERROR | ${testCase.category}`);
    console.error(`   ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Testing Irrelevant Answer Fix - NyayaGhost              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n🔍 Running tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testQueries) {
    const result = await testQuery(testCase);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║   Test Results: ${passed}/${testQueries.length} Passed   ${failed} Failed                      ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Irrelevant answer issue is FIXED! ✅\n');
  } else {
    console.log('⚠️  Some tests failed. Review the results above.\n');
  }
  
  process.exit(failed === 0 ? 0 : 1);
}

// Check if server is running
fetch('http://localhost:3000/api/health')
  .then(() => {
    console.log('✅ Server is running on port 3000\n');
    runTests();
  })
  .catch(() => {
    console.error('❌ Server is not running!');
    console.error('Please start the server first: node server.js\n');
    process.exit(1);
  });
