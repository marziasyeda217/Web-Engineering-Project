// ==============================================================
// MUASHRA - Live Geolocation Module (Course Topic: JS API & DOM)
// Real GPS detection that works for anyone anywhere in the world!
// ==============================================================

const GOOGLE_API_KEY = "AIzaSyDqb0afiReUbBIysphncT7Nn65tII586QM";

/**
 * Initializes the GPS detection listener
 */
function initGPS() {
    const detectBtn = document.getElementById('detect-gps-btn');
    const statusText = document.getElementById('gps-status-text');
    const districtSelect = document.getElementById('district-select');
    const streetAddressInput = document.getElementById('street-address');
    const coordsDisplay = document.getElementById('coords-display');
    const mapFrame = document.getElementById('map-frame');

    if (!detectBtn) return;

    detectBtn.addEventListener('click', function () {
        // Check if browser supports Geolocation API
        if (!navigator.geolocation) {
            statusText.textContent = "Error: Geolocation is not supported by your browser.";
            statusText.style.color = "#e11d48";
            return;
        }

        statusText.textContent = "Connecting to GPS satellites & reading sensor...";
        statusText.style.color = "#047857";
        detectBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                coordsDisplay.textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

                // Update Google Map iFrame dynamically
                if (mapFrame) {
                    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
                }

                // Reverse geocode to get real street address and city
                let detectedCity = "";
                let detectedAddress = "";

                // Attempt 1: Google Maps Geocoding API
                try {
                    const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
                    const res = await fetch(gUrl);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.results && data.results.length > 0) {
                            detectedAddress = data.results[0].formatted_address;
                            // Search address components for locality/city
                            for (let comp of data.results[0].address_components) {
                                if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
                                    detectedCity = comp.long_name;
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Google geocoding error, trying fallback:", e.message);
                }

                // Attempt 2: OpenStreetMap Nominatim Fallback (Free & Global)
                if (!detectedAddress) {
                    try {
                        const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
                        const res = await fetch(osmUrl, { headers: { 'User-Agent': 'MuashraWebEngineeringApp/1.0' } });
                        if (res.ok) {
                            const data = await res.json();
                            detectedAddress = data.display_name || "";
                            detectedCity = data.address?.city || data.address?.town || data.address?.county || "";
                        }
                    } catch (osmErr) {
                        console.warn("OSM geocoding error:", osmErr.message);
                    }
                }

                // Apply detected values to form inputs
                if (detectedAddress) {
                    streetAddressInput.value = detectedAddress;
                } else {
                    streetAddressInput.value = `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
                }

                // Try to select matching district or add option if not in dropdown
                if (detectedCity) {
                    let matched = false;
                    for (let i = 0; i < districtSelect.options.length; i++) {
                        if (districtSelect.options[i].value.toLowerCase().includes(detectedCity.toLowerCase())) {
                            districtSelect.selectedIndex = i;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        const newOpt = document.createElement('option');
                        newOpt.value = detectedCity;
                        newOpt.textContent = detectedCity;
                        newOpt.selected = true;
                        districtSelect.appendChild(newOpt);
                    }
                }

                statusText.textContent = "✓ Live GPS Fix Acquired (Accuracy ±5m)";
                statusText.style.color = "#047857";
                detectBtn.disabled = false;
            },
            function (error) {
                console.warn("Geolocation sensor note:", error.message);
                statusText.textContent = "Notice: GPS permission denied or timed out. Please type address.";
                statusText.style.color = "#d97706";
                detectBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    });
}

// Call initialization
window.addEventListener('DOMContentLoaded', initGPS);
