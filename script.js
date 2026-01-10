document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Nyaya Mitra - Script loaded');
    console.log('🔍 Initializing elements...');
    
    const app = document.getElementById('app');
    const pages = document.querySelectorAll('.page');
    const micButton = document.getElementById('mic-button');
    const languageToggles = document.querySelectorAll('.language-toggle button');
    const voiceOutput = document.getElementById('voice-output');
    const webcamFeed = document.getElementById('webcam-feed');
    const aadhaarCanvas = document.getElementById('aadhaar-canvas');
    const captureAadhaarButton = document.getElementById('capture-aadhaar');
    const aadhaarDetails = document.getElementById('aadhaar-details');

    console.log('📊 Element check:', {
        app: !!app,
        pages: pages.length,
        micButton: !!micButton,
        languageToggles: languageToggles.length,
        voiceOutput: !!voiceOutput
    });

    let currentLanguage = 'hindi'; // Default language
    let recognition; // Speech recognition object (accessible globally in this scope)

    // Debug: Check if mic button exists
    if (!micButton) {
        console.error('❌ Microphone button not found! Check HTML id="mic-button"');
    } else {
        console.log('✅ Microphone button found');
    }

    if (!voiceOutput) {
        console.error('❌ Voice output element not found! Check HTML id="voice-output"');
    } else {
        console.log('✅ Voice output element found');
    }

    // Function to navigate between pages
    function showPage(id) {
        pages.forEach(page => {
            if (page.id === id) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        console.log('Navigated to:', id);
    }

    // Smooth scroll to sections
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Add event listeners to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-buttons button');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('Experience') || button.textContent.includes('Try Nyaya Mitra')) {
            button.addEventListener('click', () => {
                scrollToSection('home-page');
                // Focus on microphone button
                setTimeout(() => {
                    micButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            });
        } else if (button.textContent.includes('Partner')) {
            button.addEventListener('click', () => {
                alert('🤝 Partner Inquiry\n\nThank you for your interest! Please contact us at:\n📧 partners@nyayamitra.org\n\nWe work with NGOs, Legal Aid Boards, Gram Panchayats, and Government agencies.');
            });
        } else if (button.textContent.includes('Invest')) {
            button.addEventListener('click', () => {
                alert('💰 Investment Inquiry\n\nThank you for your interest! Please contact us at:\n📧 invest@nyayamitra.org\n\nWe are building the future of justice for 1.4 billion Indians.');
            });
        }
    });


    // Lottie Animation for Ghost
    const ghostAnimationContainer = document.querySelector('.ghost-animation');
    if (ghostAnimationContainer) {
        // Check if lottie library is loaded
        if (typeof lottie !== 'undefined') {
            try {
                lottie.loadAnimation({
                    container: ghostAnimationContainer,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: 'assets/ghost.json'
                });
                console.log('Lottie animation loaded successfully');
            } catch (error) {
                console.warn('Lottie animation failed to load:', error.message);
                ghostAnimationContainer.innerHTML = '<div style="font-size: 100px; text-align: center; animation: bounce 2s infinite;">👻</div>';
            }
        } else {
            // Fallback emoji if Lottie library not loaded
            console.log('Lottie library not found, using emoji fallback');
            ghostAnimationContainer.innerHTML = '<div style="font-size: 100px; text-align: center; animation: bounce 2s infinite;">👻</div>';
        }
    }

    // Web Speech API (SpeechRecognition) - Initialize FIRST
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'hi-IN'; // Hindi default
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = async (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("User said:", transcript);
          voiceOutput.textContent = transcript;
          
          try {
              // Send to backend for AI processing
              const response = await fetch('http://localhost:3000/api/rightfinder', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                      query: transcript,
                      language: currentLanguage
                  })
              });
              
              const data = await response.json();
              console.log('RightFinder response:', data);
              
              if (data.matches && data.matches.length > 0) {
                  const topMatch = data.matches[0];
                  
                  // Display the found right
                  voiceOutput.innerHTML = `
                      <strong>${topMatch.title}</strong><br>
                      ${topMatch.description}<br><br>
                      <strong>उपाय:</strong><br>
                      ${topMatch.remedies ? topMatch.remedies.join('<br>') : 'जानकारी उपलब्ध नहीं'}
                  `;
                  
                  // Speak the result
                  speak(topMatch.description, currentLanguage === 'english' ? 'en-US' : 'hi-IN');
                  
                  // Auto-proceed to case filing after 5 seconds
                  setTimeout(() => {
                      // Store data for case filing
                      sessionStorage.setItem('currentQuery', transcript);
                      sessionStorage.setItem('currentRight', JSON.stringify(topMatch));
                      showPage('case-filing-page');
                  }, 5000);
              } else {
                  voiceOutput.textContent = 'संबंधित अधिकार नहीं मिला। कृपया दोबारा कोशिश करें।';
                  setTimeout(() => showPage('home-page'), 3000);
              }
          } catch (error) {
              console.error('Error fetching rights:', error);
              voiceOutput.textContent = 'सर्वर से कनेक्ट नहीं हो पाया। कृपया दोबारा कोशिश करें।';
              setTimeout(() => showPage('home-page'), 3000);
          }
        };
        
        function startListening() {
          recognition.start();
          console.log('🎤 Speech recognition started');
        }

        if (micButton) {
            micButton.addEventListener('click', () => {
                console.log('🎤 Microphone button clicked');
                try {
                    showPage('voice-input-page');
                    voiceOutput.textContent = 'सुन रहा हूँ…';
                    recognition.start();
                    console.log('✅ Recognition started successfully');
                } catch (error) {
                    console.error('❌ Error starting recognition:', error);
                    alert('Error: ' + error.message);
                }
            });
            console.log('✅ Microphone button listener attached');
        } else {
            console.error('❌ Cannot attach listener - micButton is null');
        }

        // Text-to-Speech (TTS) with dialect selection
        function speak(text, lang = 'hi-IN') {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          speechSynthesis.speak(utterance);
        }
        
        // Ghost Filing Engine - Handles case submission
        async function ghostFilingEngine(caseData) {
          try {
              const response = await fetch('http://localhost:3000/api/ghostfiling', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(caseData)
              });
              const data = await response.json();
              console.log('Case filed:', data);
              return data;
          } catch (error) {
              console.error('Filing error:', error);
              return { success: false, error: 'Network error' };
          }
        }
        
        // RightFinder Engine - Already integrated above
        async function rightFinderEngine(userQuery) {
          const response = await fetch('http://localhost:3000/api/rightfinder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery })
          });
          const data = await response.json();
          return data.matches;
        }
        
        // Dynamic Form Generation
        function generateForm(fields) {
          const formContainer = document.getElementById('formContainer');
          if (!formContainer) {
            console.warn('formContainer element not found');
            return;
          }
          const form = document.createElement('form');
          fields.forEach(f => {
            const label = document.createElement('label');
            label.textContent = f.label;
            const input = document.createElement('input');
            input.name = f.name;
            form.appendChild(label);
            form.appendChild(input);
          });
          formContainer.appendChild(form);
        }
        
        // Dynamic To-Do List with Audio Readout
        function showToDoList(tasks) {
          const container = document.getElementById('todoList');
          if (!container) {
            console.warn('todoList element not found');
            return;
          }
          container.innerHTML = '';
          tasks.forEach((task, i) => {
            const item = document.createElement('li');
            item.textContent = task;
            container.appendChild(item);
          });
          speak("Here are your next steps.");
        }
        
        // Backend Service Call
        async function queryAI(text) {
          const response = await fetch('http://localhost:3000/api/rightfinder', {
            method: 'POST',
            body: JSON.stringify({ query: text }),
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          return data;
        }
        
        // Update speech recognition result handler is already done above
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            voiceOutput.textContent = 'कुछ गलती हुई, फिर से कोशिश करें।';
            setTimeout(() => showPage('home-page'), 2000);
        };

        // Language Toggle (now that recognition is defined)
        languageToggles.forEach(button => {
            button.addEventListener('click', () => {
                currentLanguage = button.dataset.lang;
                // Remove active class from all buttons
                languageToggles.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update speech recognition language
                if (currentLanguage === 'hindi') {
                    recognition.lang = 'hi-IN';
                } else if (currentLanguage === 'english') {
                    recognition.lang = 'en-US';
                } else if (currentLanguage === 'bhojpuri') {
                    // Fallback to Hindi for Bhojpuri
                    recognition.lang = 'hi-IN';
                    console.warn('Bhojpuri speech recognition using Hindi as fallback');
                }
                console.log(`Language set to ${currentLanguage}, Speech recognition: ${recognition.lang}`);
            });
        });

    } else {
        console.error('❌ Web Speech API not supported in this browser');
        if (micButton) {
            micButton.disabled = true;
            micButton.textContent = '❌ Speech Not Supported';
            micButton.style.opacity = '0.5';
            micButton.style.cursor = 'not-allowed';
            micButton.addEventListener('click', () => {
                alert('Speech Recognition is not supported in your browser.\n\nPlease use:\n- Chrome\n- Edge\n- Safari (iOS 14.5+)\n\nMake sure you\'re on HTTPS or localhost.');
            });
        }
    }

    // Add a test button click listener outside speech recognition check
    if (micButton && !recognition) {
        console.log('⚠️ Microphone button exists but Speech Recognition not available');
    }

    // Aadhaar Scan (Webcam + Tesseract.js)
    if (captureAadhaarButton) {
        captureAadhaarButton.addEventListener('click', async () => {
            if (typeof Tesseract === 'undefined') {
                aadhaarDetails.textContent = 'OCR library not loaded. Feature unavailable.';
                console.error('Tesseract.js not loaded');
                return;
            }
            
            showPage('aadhaar-scan-page');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                webcamFeed.srcObject = stream;
                webcamFeed.play();

                webcamFeed.addEventListener('loadedmetadata', () => {
                    captureAadhaarButton.textContent = 'Capture & Scan';
                    captureAadhaarButton.onclick = async () => {
                        const context = aadhaarCanvas.getContext('2d');
                        aadhaarCanvas.width = webcamFeed.videoWidth;
                        aadhaarCanvas.height = webcamFeed.videoHeight;
                        context.drawImage(webcamFeed, 0, 0, aadhaarCanvas.width, aadhaarCanvas.height);

                        aadhaarDetails.textContent = 'Scanning Aadhaar...';
                        const { data: { text } } = await Tesseract.recognize(
                            aadhaarCanvas,
                            'eng+hin', // English and Hindi for better OCR
                            { logger: m => console.log(m) }
                        );

                        // Basic parsing for demonstration
                        const nameMatch = text.match(/(Name|नाम):\s*([\w\s]+)/i);
                        const villageMatch = text.match(/(Village|गाँव):\s*([\w\s]+)/i);

                        const name = nameMatch ? nameMatch[2].trim() : 'N/A';
                        const village = villageMatch ? villageMatch[2].trim() : 'N/A';

                        aadhaarDetails.innerHTML = `नाम: ${name} | गाँव: ${village}`;
                        stream.getTracks().forEach(track => track.stop()); // Stop webcam
                        setTimeout(() => showPage('case-filing-page'), 3000); // Proceed to next page
                    };
                });

            } catch (err) {
                console.error('Error accessing webcam:', err);
                aadhaarDetails.textContent = 'Webcam access denied or not available.';
                setTimeout(() => showPage('home-page'), 3000);
            }
        });
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    // IndexedDB (Placeholder - actual implementation would be more complex)
    function initIndexedDB() {
        const request = indexedDB.open('NyayaGhostDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('cases', { keyPath: 'id', autoIncrement: true });
            console.log('IndexedDB upgraded/created.');
        };

        request.onsuccess = (event) => {
            console.log('IndexedDB opened successfully.');
            // You can store and retrieve data here
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    }
    initIndexedDB();

    // Initial page load
    showPage('home-page');
});