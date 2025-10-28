document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const pages = document.querySelectorAll('.page');
    const micButton = document.getElementById('mic-button');
    const languageToggles = document.querySelectorAll('.language-toggle button');
    const voiceOutput = document.getElementById('voice-output');
    const webcamFeed = document.getElementById('webcam-feed');
    const aadhaarCanvas = document.getElementById('aadhaar-canvas');
    const captureAadhaarButton = document.getElementById('capture-aadhaar');
    const aadhaarDetails = document.getElementById('aadhaar-details');

    let currentLanguage = 'hindi'; // Default language

    // Function to navigate between pages
    function showPage(id) {
        pages.forEach(page => {
            if (page.id === id) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    // Lottie Animation for Ghost
    const ghostAnimationContainer = document.querySelector('.ghost-animation');
    if (ghostAnimationContainer) {
        Lottie.loadAnimation({
            container: ghostAnimationContainer, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/ghost.json' // the path to the animation json
        });
    }

    // Language Toggle
    languageToggles.forEach(button => {
        button.addEventListener('click', () => {
            currentLanguage = button.dataset.lang;
            alert(`Language set to ${currentLanguage}`);
            // Implement actual language change logic here (e.g., update text content)
        });
    });

    // Web Speech API (SpeechRecognition)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN'; // Default to Hindi

        micButton.addEventListener('click', () => {
            showPage('voice-input-page');
            voiceOutput.textContent = 'सुन रहा हूँ…';
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceOutput.textContent = transcript;
            // Simulate processing and showing issue
            setTimeout(() => {
                voiceOutput.textContent = 'MGNREGA पेमेंट डिले';
                // In a real app, this would trigger navigation to Case Filing or further actions
                setTimeout(() => showPage('case-filing-page'), 2000);
            }, 3000);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            voiceOutput.textContent = 'कुछ गलती हुई, फिर से कोशिश करें।';
            setTimeout(() => showPage('home-page'), 2000);
        };

        // Update recognition language based on currentLanguage
        // This is a simplified example, actual language codes might vary
        // and require more robust handling.
        // For Bhojpuri, a specific `lang` code might not be directly available
        // and might require custom speech models or a different approach.
        // For demonstration, we'll use hi-IN for Hindi and en-US for English.
        // Bhojpuri would need a more advanced integration.
        languageToggles.forEach(button => {
            button.addEventListener('click', () => {
                currentLanguage = button.dataset.lang;
                if (currentLanguage === 'hindi') {
                    recognition.lang = 'hi-IN';
                } else if (currentLanguage === 'english') {
                    recognition.lang = 'en-US';
                } else if (currentLanguage === 'bhojpuri') {
                    // Fallback or custom integration for Bhojpuri
                    recognition.lang = 'hi-IN'; // Using Hindi as a fallback
                    console.warn('Bhojpuri speech recognition might require custom models or a different API.');
                }
                alert(`Speech recognition language set to ${recognition.lang}`);
            });
        });

    } else {
        micButton.disabled = true;
        micButton.textContent = 'Speech Not Supported';
        console.warn('Web Speech API not supported in this browser.');
    }

    // Aadhaar Scan (Webcam + Tesseract.js)
    captureAadhaarButton.addEventListener('click', async () => {
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