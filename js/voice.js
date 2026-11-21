// ==============================================================
// MUASHRA - Voice Recording & Speech Recognition Module
// Course Topics: Web APIs, Event Listeners, DOM Updates
// ==============================================================

function initVoice() {
    const recordBtn = document.getElementById('record-btn');
    const recordText = document.getElementById('record-text');
    const voiceStatus = document.getElementById('voice-status');
    const descriptionInput = document.getElementById('description');
    const audioPreview = document.getElementById('audio-preview');

    if (!recordBtn) return;

    let isRecording = false;
    let recognition = null;
    let mediaRecorder = null;
    let audioChunks = [];

    // 1. Setup Web Speech Recognition (Urdu / English)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ur-PK'; // Urdu (Pakistan), also captures Roman Urdu / English

        recognition.onstart = function () {
            voiceStatus.textContent = "Listening in Urdu / Roman Urdu... Speak now!";
            voiceStatus.style.color = "#047857";
        };

        recognition.onresult = function (event) {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (transcript.trim().length > 0) {
                descriptionInput.value = transcript;
                // Dispatch input event for real-time category & department scanner
                const evt = new Event('input');
                descriptionInput.dispatchEvent(evt);
            }
        };

        recognition.onerror = function (event) {
            console.warn("Speech recognition note:", event.error);
            voiceStatus.textContent = "Mic active. You can also type directly.";
        };

        recognition.onend = function () {
            if (isRecording) {
                stopRecording();
            }
        };
    }

    // 2. Start / Stop toggle handler
    recordBtn.addEventListener('click', async function () {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    async function startRecording() {
        isRecording = true;
        recordBtn.classList.add('recording');
        recordText.textContent = "Stop Recording (روکیں)";
        voiceStatus.textContent = "Recording audio...";

        // Start Speech-to-text
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {}
        }

        // Start Audio recording for <audio> element
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = function (e) {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                if (audioPreview) {
                    audioPreview.src = audioUrl;
                    audioPreview.style.display = 'block';
                }
            };

            mediaRecorder.start();
        } catch (mediaErr) {
            console.warn("Audio media recording note:", mediaErr.message);
        }
    }

    function stopRecording() {
        isRecording = false;
        recordBtn.classList.remove('recording');
        recordText.textContent = "Speak in Urdu (آواز میں شکایت ریکارڈ کریں)";
        voiceStatus.textContent = "Voice captured. Review transcript below.";

        if (recognition) {
            try {
                recognition.stop();
            } catch (e) {}
        }

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try {
                mediaRecorder.stop();
            } catch (e) {}
        }
    }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', function () {
    initVoice();
    if (typeof initGPS === 'function') {
        initGPS();
    }
});
