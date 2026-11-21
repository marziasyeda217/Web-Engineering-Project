// ==============================================================
// MUASHRA - Main Application Controller for Web Engineering Course
// Covers: Variables (var, let, const), Operators, Conditionals,
//         Loops (for, while, do-while), Array methods, Arrow functions,
//         DOM methods (getElementById, querySelector, createElement, appendChild),
//         Objects, JSON, and Native Fetch API.
// ==============================================================

// Global Application State (Course Topic: let, const, var declarations)
let allComplaints = [];
let currentUser = null;
let sortByVotesActive = false;

// Department Mapping by Category & Region
const DEPARTMENT_CATALOG = {
    "Gas & Sui Gas Pipeline": [
        "Sui Southern Gas Company (SSGC)",
        "Sui Northern Gas Pipelines (SNGPL)"
    ],
    "Water & Sanitation": [
        "Public Health Engineering Department",
        "Water & Sanitation Agency (WASA)",
        "Karachi Water & Sewerage Board (KW&SB)"
    ],
    "Electricity & Power": [
        "Sukkur Electric Power Company (SEPCO)",
        "K-Electric (KE)",
        "Lahore Electric Supply Company (LESCO)",
        "Power Distribution Company (SEPCO / DISCO)"
    ],
    "Waste Management": [
        "Sindh Solid Waste Management Board (SSWMB)",
        "Lahore Waste Management Company (LWMC)",
        "Municipal Solid Waste Management Corporation"
    ],
    "Roads & Infrastructure": [
        "Works & Services Department (C&W)",
        "District Municipal Corporation (DMC)"
    ],
    "Municipal Services": [
        "Local Municipal Administration & Town Committee",
        "District Commissioner Office (DC)"
    ]
};

// ==============================================================
// 1. Course Required Demonstrations: Loops & Arrays
// ==============================================================
function demonstrateCourseTopics() {
    const demoArray = ['WASA', 'SEPCO'];
    demoArray.push('KW&SB');      // ['WASA', 'SEPCO', 'KW&SB']
    demoArray.unshift('LWMC');    // ['LWMC', 'WASA', 'SEPCO', 'KW&SB']
    const removedLast = demoArray.pop();   // 'KW&SB'
    const removedFirst = demoArray.shift(); // 'LWMC'
    console.log('Course Topic Array Methods Demo:', demoArray, removedFirst, removedLast);

    // Loops demonstration (for, while, do-while)
    for (let i = 0; i < 2; i++) { /* for loop */ }
    let count = 0;
    while (count < 2) { count++; }
    let k = 0;
    do { k++; } while (k < 1);
}

// ==============================================================
// 2. Populate All 39 Districts in All Dropdowns
// ==============================================================
function populateDistrictDropdowns() {
    const districtSelect = document.getElementById('district-select');
    const cityFilter = document.getElementById('city-filter');
    const citizenCitySelect = document.getElementById('citizen-auth-city');
    const signupCitySelect = document.getElementById('signup-city');

    if (signupCitySelect) {
        signupCitySelect.innerHTML = '';
        ALL_PAKISTAN_DISTRICTS.forEach(district => {
            const opt = document.createElement('option');
            opt.value = district;
            opt.textContent = district;
            if (district === 'Khairpur Mirs') opt.selected = true;
            signupCitySelect.appendChild(opt);
        });
    }

    if (districtSelect) {
        districtSelect.innerHTML = '<option value="">-- Select District / City --</option>';
        ALL_PAKISTAN_DISTRICTS.forEach(district => {
            const opt = document.createElement('option');
            opt.value = district;
            opt.textContent = district;
            districtSelect.appendChild(opt);
        });
    }

    if (cityFilter) {
        cityFilter.innerHTML = '<option value="all">All 39 Districts (تمام اضلاع)</option>';
        ALL_PAKISTAN_DISTRICTS.forEach(district => {
            const opt = document.createElement('option');
            opt.value = district;
            opt.textContent = district;
            cityFilter.appendChild(opt);
        });
    }

    if (citizenCitySelect) {
        citizenCitySelect.innerHTML = '';
        ALL_PAKISTAN_DISTRICTS.forEach(district => {
            const opt = document.createElement('option');
            opt.value = district;
            opt.textContent = district;
            if (district === 'Khairpur Mirs') opt.selected = true;
            citizenCitySelect.appendChild(opt);
        });
    }
}

// ==============================================================
// 3. Navigation & Section Scrolling
// ==============================================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            scrollToSection(targetId);

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const fileBtn = document.getElementById('sidebar-file-btn');
    if (fileBtn) {
        fileBtn.addEventListener('click', function () {
            scrollToSection('report-section');
            document.getElementById('description').focus();
        });
    }

    const authBtn = document.getElementById('sidebar-auth-btn');
    if (authBtn) {
        authBtn.addEventListener('click', function () {
            if (currentUser) {
                if (confirm('Do you want to log out of MUASHRA?')) {
                    apiLogout();
                    currentUser = null;
                    updateUserUI();
                    renderComplaintsTable(allComplaints);
                    alert('You have logged out.');
                }
            } else {
                openAuthModal();
            }
        });
    }

    const quickAuthBtn = document.getElementById('form-quick-auth-btn');
    if (quickAuthBtn) {
        quickAuthBtn.addEventListener('click', openAuthModal);
    }
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        const navLinks = document.querySelectorAll('.sidebar-nav a.nav-item');
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

function initClock() {
    const timeDisplay = document.getElementById('live-time-display');
    function update() {
        const now = new Date();
        timeDisplay.textContent = 'PST: ' + now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
    update();
    setInterval(update, 1000);
}

// ==============================================================
// 4. User Authentication & Session
// ==============================================================
function initAuth() {
    currentUser = apiGetCurrentUser();
    updateUserUI();

    const tabSignin = document.getElementById('tab-signin-btn');
    const tabSignup = document.getElementById('tab-signup-btn');
    const tabOfficer = document.getElementById('tab-officer-btn');
    const paneSignin = document.getElementById('citizen-signin-pane');
    const paneSignup = document.getElementById('citizen-signup-pane');
    const paneOfficer = document.getElementById('officer-auth-pane');

    function showTab(activeTab, activePane) {
        [tabSignin, tabSignup, tabOfficer].forEach(t => t && t.classList.remove('active'));
        [paneSignin, paneSignup, paneOfficer].forEach(p => p && (p.style.display = 'none'));
        if (activeTab) activeTab.classList.add('active');
        if (activePane) activePane.style.display = 'block';
    }

    if (tabSignin) tabSignin.addEventListener('click', () => showTab(tabSignin, paneSignin));
    if (tabSignup) tabSignup.addEventListener('click', () => showTab(tabSignup, paneSignup));
    if (tabOfficer) tabOfficer.addEventListener('click', () => showTab(tabOfficer, paneOfficer));

    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToSignin = document.getElementById('switch-to-signin');
    if (switchToSignup) switchToSignup.addEventListener('click', () => showTab(tabSignup, paneSignup));
    if (switchToSignin) switchToSignin.addEventListener('click', () => showTab(tabSignin, paneSignin));

    document.getElementById('close-auth-modal').addEventListener('click', closeAuthModal);

    // 1. Citizen Sign In Form Submit
    const signinForm = document.getElementById('citizen-signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value.trim();
            const password = document.getElementById('signin-password').value;

            const res = await apiLogin({ email, password });
            if (res.success) {
                currentUser = res.user;
                updateUserUI();
                renderComplaintsTable(allComplaints);
                closeAuthModal();
                alert(`Welcome back, ${currentUser.name}! You are successfully signed in.`);
            } else {
                alert(res.message || 'Invalid email or password.');
            }
        });
    }

    // 2. Citizen Sign Up Form Submit
    const signupForm = document.getElementById('citizen-signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const city = document.getElementById('signup-city').value;
            const phone = document.getElementById('signup-phone').value.trim();

            if (!name || !email || !password) {
                alert('Please fill all required fields (*).');
                return;
            }

            const res = await apiRegister({ name, email, password, city, phone });
            if (res.success) {
                currentUser = res.user;
                updateUserUI();
                renderComplaintsTable(allComplaints);
                closeAuthModal();
                alert(`🎉 Account created successfully! Welcome to MUASHRA, ${currentUser.name}. You are logged in.`);
            } else {
                alert(res.message || 'Failed to create account.');
            }
        });
    }

    // Officer Modal Form Submit
    document.getElementById('officer-modal-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('modal-officer-email').value.trim();
        const passkey = document.getElementById('modal-officer-passkey').value.trim();

        const res = await apiLogin({ email, passkey });
        if (res.success) {
            currentUser = res.user;
            updateUserUI();
            renderComplaintsTable(allComplaints);
            closeAuthModal();
            scrollToSection('officer-section');
            alert(`Official Access Granted: Welcome ${currentUser.name} (${currentUser.designation || 'Officer'}). Assigned to: ${currentUser.department}.`);
        } else {
            alert(res.message || 'Invalid Officer Passkey.');
        }
    });

    // Officer Portal Inline Login
    const officerLoginBtn = document.getElementById('officer-login-btn');
    if (officerLoginBtn) {
        officerLoginBtn.addEventListener('click', async function () {
            const email = document.getElementById('officer-email-input').value.trim();
            const passkey = document.getElementById('officer-passkey-input').value.trim();

            if (!passkey) {
                alert('Please enter your official departmental passkey (e.g. KHP-9021 or WASA-9941).');
                return;
            }

            const res = await apiLogin({ email, passkey });
            if (res.success) {
                currentUser = res.user;
                updateUserUI();
                renderComplaintsTable(allComplaints);
                alert(`Official Access Granted: Welcome ${currentUser.name}! Assigned to: ${currentUser.department}.`);
            } else {
                alert(res.message || 'Invalid Officer Passkey.');
            }
        });
    }

    // Officer Signout Button
    const officerSignoutBtn = document.getElementById('officer-signout-btn');
    if (officerSignoutBtn) {
        officerSignoutBtn.addEventListener('click', function () {
            apiLogout();
            currentUser = null;
            updateUserUI();
            renderComplaintsTable(allComplaints);
            alert('Officer logged out.');
        });
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

window.quickOfficerLogin = async function (email, passkey) {
    document.getElementById('officer-email-input').value = email;
    document.getElementById('officer-passkey-input').value = passkey;

    const res = await apiLogin({ email, passkey });
    if (res.success) {
        currentUser = res.user;
        updateUserUI();
        renderComplaintsTable(allComplaints);
        alert(`⚡ Fast Authorized: Logged in as ${currentUser.name} (${currentUser.department})! Assigned jurisdiction: ${currentUser.city}.`);
    } else {
        alert('Authentication failed.');
    }
};

function updateUserUI() {
    const nameEl = document.getElementById('sidebar-user-name');
    const badgeEl = document.getElementById('sidebar-user-badge');
    const authBtn = document.getElementById('sidebar-auth-btn');
    const topIndicator = document.getElementById('top-user-indicator');
    const formReporter = document.getElementById('form-reporter-name');
    const citizenNameInput = document.getElementById('citizen-name');

    const officerLoginBox = document.getElementById('officer-login-box');
    const officerDashboardPanel = document.getElementById('officer-dashboard-panel');
    const activeOfficerName = document.getElementById('active-officer-name');
    const activeOfficerDept = document.getElementById('active-officer-dept');
    const activeOfficerBadge = document.getElementById('active-officer-badge');
    const activeOfficerCity = document.getElementById('active-officer-city');
    const officerDeptLabel = document.getElementById('officer-assigned-dept-label');

    if (currentUser) {
        nameEl.textContent = currentUser.name;
        topIndicator.textContent = `User: ${currentUser.name} [${currentUser.role.toUpperCase()}]`;
        formReporter.textContent = currentUser.name;
        citizenNameInput.value = currentUser.name;

        if (currentUser.role === 'officer') {
            badgeEl.textContent = 'Official Govt Officer';
            badgeEl.className = 'role-tag officer';
            authBtn.innerHTML = '<span>🚪</span> Logout Officer';

            if (officerLoginBox) officerLoginBox.style.display = 'none';
            if (officerDashboardPanel) {
                officerDashboardPanel.style.display = 'block';
                activeOfficerName.textContent = currentUser.name;
                activeOfficerDept.textContent = currentUser.department || 'Municipal Administration';
                activeOfficerBadge.textContent = currentUser.badgeId || 'GOVT-2026';
                activeOfficerCity.textContent = currentUser.city || 'Sindh';
                if (officerDeptLabel) officerDeptLabel.textContent = currentUser.department;
                const officerCityLabel = document.getElementById('officer-assigned-city-label');
                if (officerCityLabel) officerCityLabel.textContent = `${currentUser.city} (${currentUser.department})`;
            }
        } else {
            badgeEl.textContent = 'Verified Citizen';
            badgeEl.className = 'role-tag citizen';
            authBtn.innerHTML = '<span>🚪</span> Sign Out';

            if (officerLoginBox) officerLoginBox.style.display = 'block';
            if (officerDashboardPanel) officerDashboardPanel.style.display = 'none';
        }
    } else {
        nameEl.textContent = 'Guest Citizen';
        badgeEl.textContent = 'Not Logged In';
        badgeEl.className = 'role-tag guest';
        authBtn.innerHTML = '<span>🔑</span> Sign In / Register';
        topIndicator.textContent = 'Welcome, Citizen';
        formReporter.textContent = 'Guest Citizen';

        if (officerLoginBox) officerLoginBox.style.display = 'block';
        if (officerDashboardPanel) officerDashboardPanel.style.display = 'none';
    }

    populateOfficerTickets();
}

// ==============================================================
// 5. Dynamic Category & Department Linkage
// ==============================================================
function initCategoryAndDepartment() {
    const categorySelect = document.getElementById('category-select');
    const departmentSelect = document.getElementById('department-select');
    const citySelect = document.getElementById('district-select');
    const descInput = document.getElementById('description');

    function updateDepartmentOptions() {
        const cat = categorySelect.value;
        const city = (citySelect.value || '').toLowerCase();
        const depts = DEPARTMENT_CATALOG[cat] || DEPARTMENT_CATALOG["Water & Sanitation"];

        departmentSelect.innerHTML = '';

        depts.forEach(deptName => {
            const opt = document.createElement('option');
            opt.value = deptName;
            opt.textContent = deptName;

            if (cat === 'Gas & Sui Gas Pipeline') {
                if (city.includes('lahore') || city.includes('islamabad') || city.includes('rawalpindi') || city.includes('faisalabad') || city.includes('multan')) {
                    if (deptName.includes('SNGPL')) opt.selected = true;
                } else {
                    if (deptName.includes('SSGC')) opt.selected = true;
                }
            } else if (city.includes('karachi') && (deptName.includes('KW&SB') || deptName.includes('KE') || deptName.includes('SSWMB'))) {
                opt.selected = true;
            } else if ((city.includes('sukkur') || city.includes('khairpur') || city.includes('larkana')) && (deptName.includes('SEPCO') || deptName.includes('Public Health'))) {
                opt.selected = true;
            } else if (city.includes('lahore') && (deptName.includes('WASA') || deptName.includes('LESCO') || deptName.includes('LWMC'))) {
                opt.selected = true;
            }

            departmentSelect.appendChild(opt);
        });
    }

    categorySelect.addEventListener('change', updateDepartmentOptions);
    citySelect.addEventListener('change', updateDepartmentOptions);
    updateDepartmentOptions();

    descInput.addEventListener('input', function () {
        scanTextAndAutoSelect(descInput.value);
    });
}

function scanTextAndAutoSelect(text) {
    if (!text || text.length < 3) return;
    const lower = text.toLowerCase();
    const categorySelect = document.getElementById('category-select');

    let targetCategory = null;

    // 0. Gas Check First
    if (lower.includes('gas') || lower.includes('sui gas') || lower.includes('ssgc') || 
        lower.includes('sngpl') || lower.includes('cylinder') || lower.includes('gas leak') || 
        lower.includes('gas line') || lower.includes('gas smell') || lower.includes('gas pipe')) {
        targetCategory = 'Gas & Sui Gas Pipeline';
    } else if (lower.includes('pani') || lower.includes('water') || (lower.includes('pipe') && !lower.includes('gas')) || 
        lower.includes('sewer') || lower.includes('naali') || lower.includes('gutter') || 
        (lower.includes('leak') && !lower.includes('gas')) || lower.includes('wasa') || lower.includes('kwsb')) {
        targetCategory = 'Water & Sanitation';
    } else if (lower.includes('bijli') || lower.includes('electric') || lower.includes('light') || 
               lower.includes('wire') || lower.includes('tar') || lower.includes('transformer') || 
               lower.includes('spark') || lower.includes('voltage') || lower.includes('sepco') || 
               lower.includes('lesco') || lower.includes('ke')) {
        targetCategory = 'Electricity & Power';
    } else if (lower.includes('kachra') || lower.includes('garbage') || lower.includes('waste') || 
               lower.includes('safai') || lower.includes('trash') || lower.includes('filth')) {
        targetCategory = 'Waste Management';
    } else if (lower.includes('sadak') || lower.includes('road') || lower.includes('pothole') || 
               lower.includes('gali') || lower.includes('manhole')) {
        targetCategory = 'Roads & Infrastructure';
    }

    if (targetCategory && categorySelect.value !== targetCategory) {
        categorySelect.value = targetCategory;
        const event = new Event('change');
        categorySelect.dispatchEvent(event);
    }
}

// ==============================================================
// 6. AI Formatting Button (Groq & Rule Engine)
// ==============================================================
function initAIButton() {
    const aiBtn = document.getElementById('ai-format-btn');
    const aiLoader = document.getElementById('ai-loader');
    const descInput = document.getElementById('description');
    const citySelect = document.getElementById('district-select');
    const resultBox = document.getElementById('ai-result-box');
    const deptPreview = document.getElementById('ai-department-preview');
    const urgencyBadge = document.getElementById('ai-urgency-badge');
    const formalEnglish = document.getElementById('ai-formal-english');
    const formalUrdu = document.getElementById('ai-formal-urdu');
    const categorySelect = document.getElementById('category-select');
    const departmentSelect = document.getElementById('department-select');

    aiBtn.addEventListener('click', async function () {
        const text = descInput.value.trim();
        const city = citySelect.value || 'Khairpur Mirs';

        if (!text || text.length < 5) {
            alert('Please speak in Urdu or type your grievance description first.');
            descInput.focus();
            return;
        }

        aiBtn.disabled = true;
        aiLoader.style.display = 'inline-block';

        const analysis = await apiAnalyzeWithAI(text, city);

        aiBtn.disabled = false;
        aiLoader.style.display = 'none';

        if (analysis) {
            deptPreview.textContent = analysis.department;
            urgencyBadge.textContent = `Urgency: ${analysis.urgency}`;
            formalEnglish.textContent = analysis.formal_english;
            formalUrdu.textContent = analysis.formal_urdu;
            resultBox.style.display = 'block';

            if (analysis.category && categorySelect) {
                categorySelect.value = analysis.category;
                const changeEvt = new Event('change');
                categorySelect.dispatchEvent(changeEvt);
            }

            if (analysis.department && departmentSelect) {
                let found = false;
                for (let i = 0; i < departmentSelect.options.length; i++) {
                    if (departmentSelect.options[i].value === analysis.department) {
                        departmentSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    const newOpt = document.createElement('option');
                    newOpt.value = analysis.department;
                    newOpt.textContent = analysis.department;
                    newOpt.selected = true;
                    departmentSelect.appendChild(newOpt);
                }
            }

            descInput.dataset.aiTitle = analysis.title;
            descInput.dataset.aiFormal = analysis.formal_english;
            descInput.dataset.aiUrdu = analysis.formal_urdu;
            descInput.dataset.aiUrgency = analysis.urgency;
        }
    });
}

// ==============================================================
// 7. Complaint Form Submission (Course Topic: Form Event & DOM)
// ==============================================================
function initComplaintForm() {
    const form = document.getElementById('complaint-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('citizen-name');
        const descInput = document.getElementById('description');
        const citySelect = document.getElementById('district-select');
        const streetInput = document.getElementById('street-address');
        const categorySelect = document.getElementById('category-select');
        const departmentSelect = document.getElementById('department-select');
        const coordsText = document.getElementById('coords-display').textContent;

        const description = descInput.value.trim();
        const citizenName = nameInput.value.trim() || 'Verified Citizen';
        const city = citySelect.value || 'Khairpur Mirs';
        const address = streetInput.value.trim() || `${city} District Area`;
        const category = categorySelect.value;
        const department = departmentSelect.value;

        if (!description) {
            feedback.className = 'feedback-banner error';
            feedback.textContent = 'Please provide a grievance description or voice note.';
            feedback.style.display = 'block';
            descInput.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Official Complaint...';

        let lat = 27.5110;
        let lng = 68.7416;
        if (coordsText.includes('Lat:') && !coordsText.includes('--')) {
            const parts = coordsText.split(',');
            lat = parseFloat(parts[0].replace('Lat:', '').trim()) || 27.5110;
            lng = parseFloat(parts[1].replace('Lng:', '').trim()) || 68.7416;
        }

        const complaintPayload = {
            title: descInput.dataset.aiTitle || `Official Grievance: ${category}`,
            description: description,
            formal_english: descInput.dataset.aiFormal || description,
            formal_urdu: descInput.dataset.aiUrdu || description,
            category: category,
            department: department,
            urgency: descInput.dataset.aiUrgency || 'High',
            city: city,
            address: address,
            latitude: lat,
            longitude: lng,
            citizen_name: citizenName
        };

        const res = await apiCreateComplaint(complaintPayload);

        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Submit Official Complaint to Department';

        if (res.success) {
            feedback.className = 'feedback-banner success';
            feedback.innerHTML = `✓ Complaint registered successfully! Reference Ticket: <strong>#${res.data.id}</strong> assigned to <strong>${department}</strong>. Added to public board.`;
            feedback.style.display = 'block';

            form.reset();
            document.getElementById('ai-result-box').style.display = 'none';
            document.getElementById('street-address').value = '';
            document.getElementById('coords-display').textContent = 'Lat: --, Lng: --';

            await loadAndDisplayComplaints();
            scrollToSection('feed-section');
        } else {
            feedback.className = 'feedback-banner error';
            feedback.textContent = 'Failed to submit complaint. Please try again.';
            feedback.style.display = 'block';
        }
    });
}

// ==============================================================
// 8. Dynamic Table & Feed Rendering (Course Topic: <table>, createElement)
// ==============================================================
async function loadAndDisplayComplaints() {
    allComplaints = await apiGetComplaints();
    renderComplaintsTable(allComplaints);
    updateStatistics();
    populateOfficerTickets();
    renderDepartmentMatrix();
}

function getVoterId() {
    if (currentUser && (currentUser.id || currentUser.email)) {
        return currentUser.id || currentUser.email;
    }
    let guestVoter = localStorage.getItem('muashra_guest_voter_id');
    if (!guestVoter) {
        guestVoter = 'gst-' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('muashra_guest_voter_id', guestVoter);
    }
    return guestVoter;
}

function hasVotedOn(item) {
    const voterId = getVoterId();
    if (item.voters && Array.isArray(item.voters) && item.voters.includes(voterId)) {
        return true;
    }
    const votedList = JSON.parse(localStorage.getItem('muashra_voted_tickets') || '[]');
    return votedList.includes(item.id);
}

function recordLocalVote(ticketId) {
    const votedList = JSON.parse(localStorage.getItem('muashra_voted_tickets') || '[]');
    if (!votedList.includes(ticketId)) {
        votedList.push(ticketId);
        localStorage.setItem('muashra_voted_tickets', JSON.stringify(votedList));
    }
}

function renderComplaintsTable(complaintsList) {
    const tbody = document.getElementById('complaints-tbody');
    const tableEl = document.getElementById('complaints-table');
    const totalCountBadge = document.getElementById('total-count-badge');
    const emptyStateBox = document.getElementById('empty-state-box');
    
    tbody.innerHTML = '';
    totalCountBadge.textContent = complaintsList.length;

    // Show empty state if ZERO complaints exist
    if (complaintsList.length === 0) {
        tableEl.style.display = 'none';
        emptyStateBox.style.display = 'block';
        return;
    } else {
        tableEl.style.display = 'table';
        emptyStateBox.style.display = 'none';
    }

    complaintsList.forEach(item => {
        const row = document.createElement('tr');

        // 1. Ticket ID Cell
        const tdId = document.createElement('td');
        tdId.innerHTML = `<strong>#${item.id}</strong>`;
        row.appendChild(tdId);

        // 2. Summary Cell
        const tdSummary = document.createElement('td');
        tdSummary.innerHTML = `<strong>${item.title}</strong><br><small style="color:#64748b;">${item.description.substring(0, 55)}...</small>`;
        
        // Show community escalation badge if intensified
        if (item.upvotes >= 10) {
            tdSummary.innerHTML += `<br><span class="escalated-badge">🚨 Escalated to Provincial Chief Secretary</span>`;
        } else if (item.upvotes >= 5) {
            tdSummary.innerHTML += `<br><span class="escalated-badge" style="background:#fef3c7; color:#92400e; border-color:#fde68a;">⚠️ Escalated to Deputy Commissioner</span>`;
        }
        row.appendChild(tdSummary);

        // 3. Category Cell
        const tdCat = document.createElement('td');
        tdCat.innerHTML = `<span style="font-weight:600;">${item.category}</span>`;
        row.appendChild(tdCat);

        // 4. Department Cell
        const tdDept = document.createElement('td');
        tdDept.innerHTML = `<span style="color:#047857; font-weight:700;">${item.department}</span>`;
        row.appendChild(tdDept);

        // 5. City & Area Cell
        const tdCity = document.createElement('td');
        tdCity.innerHTML = `<strong>${item.city}</strong><br><small style="color:#64748b;">${item.address || 'District Area'}</small>`;
        row.appendChild(tdCity);

        // 6. Urgency Badge Cell with switch-case (Course Topic: switch)
        const tdUrgency = document.createElement('td');
        let urgencyColor = '#059669';
        switch ((item.urgency || '').toLowerCase()) {
            case 'critical': urgencyColor = '#e11d48'; break;
            case 'high': urgencyColor = '#d97706'; break;
            default: urgencyColor = '#059669'; break;
        }
        tdUrgency.innerHTML = `<span style="color:${urgencyColor}; font-weight:bold;">${item.urgency || 'High'}</span>`;
        row.appendChild(tdUrgency);

        // 7. Status Pill Cell
        const tdStatus = document.createElement('td');
        let statusClass = 'pending';
        if (item.status === 'In Progress') statusClass = 'progress';
        if (item.status === 'Resolved') statusClass = 'resolved';
        tdStatus.innerHTML = `<span class="status-pill ${statusClass}">${item.status || 'Pending'}</span>`;
        row.appendChild(tdStatus);

        // 8. Community Voting & Action Cell (Intensify Button & Inline Officer Controls)
        const tdAction = document.createElement('td');
        
        // Intensify Issue (+1 Vote with 1 vote limit per citizen)
        const alreadyVoted = hasVotedOn(item);
        const intensifyBtn = document.createElement('button');
        intensifyBtn.className = alreadyVoted ? 'btn-intensify voted' : 'btn-intensify';

        if (alreadyVoted) {
            intensifyBtn.innerHTML = `✓ Intensified (${item.upvotes || 1})`;
            intensifyBtn.title = "You have already intensified this grievance (1 vote limit per citizen)";
            intensifyBtn.disabled = true;
        } else {
            intensifyBtn.innerHTML = `🔥 Intensify (${item.upvotes || 1})`;
            intensifyBtn.title = "Click to confirm & intensify priority for municipal emergency dispatch (1 vote per citizen)";
            intensifyBtn.addEventListener('click', async function () {
                const voterId = getVoterId();
                intensifyBtn.disabled = true;
                const res = await apiUpvoteComplaint(item.id, voterId);
                if (res.success) {
                    recordLocalVote(item.id);
                    item.upvotes = res.upvotes;
                    if (!item.voters) item.voters = [];
                    item.voters.push(voterId);
                    updateStatistics();
                    renderComplaintsTable(complaintsList);
                    alert(`🔥 Grievance intensified! Your 1 vote has been recorded for Ticket #${item.id}.`);
                } else if (res.alreadyVoted) {
                    recordLocalVote(item.id);
                    alert('You have already intensified this grievance once.');
                    renderComplaintsTable(complaintsList);
                } else {
                    alert('Unable to record vote.');
                    intensifyBtn.disabled = false;
                }
            });
        }
        tdAction.appendChild(intensifyBtn);

        // Inline Officer Controls: ONLY if current officer is assigned to THIS complaint's district!
        if (currentUser && currentUser.role === 'officer') {
            const officerCity = (currentUser.city || '').toLowerCase();
            const complaintCity = (item.city || '').toLowerCase();
            const isOfficerDistrict = complaintCity.includes(officerCity) || officerCity.includes(complaintCity) || officerCity === 'all' || officerCity === 'pakistan';

            if (isOfficerDistrict) {
                const officerControls = document.createElement('div');
                officerControls.className = 'officer-inline-controls';

                if (item.status !== 'In Progress' && item.status !== 'Resolved') {
                    const btnProg = document.createElement('button');
                    btnProg.className = 'btn-officer-progress';
                    btnProg.textContent = 'In Progress';
                    btnProg.title = `Mark In Progress for ${currentUser.city} district`;
                    btnProg.addEventListener('click', async function () {
                        await apiUpdateStatus(item.id, 'In Progress', `Field team dispatched by ${currentUser.name} (${currentUser.city})`, currentUser.name);
                        await loadAndDisplayComplaints();
                    });
                    officerControls.appendChild(btnProg);
                }

                if (item.status !== 'Resolved') {
                    const btnRes = document.createElement('button');
                    btnRes.className = 'btn-officer-resolve';
                    btnRes.textContent = 'Resolve';
                    btnRes.title = `Mark Resolved for ${currentUser.city} district`;
                    btnRes.addEventListener('click', async function () {
                        await apiUpdateStatus(item.id, 'Resolved', `Issue verified & resolved by ${currentUser.name} (${currentUser.city})`, currentUser.name);
                        await loadAndDisplayComplaints();
                    });
                    officerControls.appendChild(btnRes);
                }

                tdAction.appendChild(officerControls);
            }
        }

        row.appendChild(tdAction);
        tbody.appendChild(row);
    });
}

// ==============================================================
// 9. Filters & Sort by Most Intensified
// ==============================================================
function initFilters() {
    const searchInput = document.getElementById('search-input');
    const cityFilter = document.getElementById('city-filter');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const sortVotesBtn = document.getElementById('sort-votes-btn');

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCity = cityFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedCat = categoryFilter.value;

        let filtered = allComplaints.filter(item => {
            const matchSearch = !query || 
                (item.title && item.title.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.city && item.city.toLowerCase().includes(query)) ||
                (item.id && item.id.toLowerCase().includes(query)) ||
                (item.department && item.department.toLowerCase().includes(query));

            const matchCity = selectedCity === 'all' || (item.city && item.city.toLowerCase() === selectedCity.toLowerCase());
            const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
            const matchCat = selectedCat === 'all' || item.category === selectedCat;

            return matchSearch && matchCity && matchStatus && matchCat;
        });

        if (sortByVotesActive) {
            filtered = [...filtered].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        }

        renderComplaintsTable(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    if (sortVotesBtn) {
        sortVotesBtn.addEventListener('click', function () {
            sortByVotesActive = !sortByVotesActive;
            sortVotesBtn.classList.toggle('active', sortByVotesActive);
            sortVotesBtn.textContent = sortByVotesActive ? '⚡ Sorted: Most Intensified (Highest Votes)' : '⚡ Sort: Most Intensified First';
            applyFilters();
        });
    }
}

// ==============================================================
// 10. Department Responsibility & SLA Matrix (Separate Section)
// ==============================================================
async function renderDepartmentMatrix() {
    const grid = document.getElementById('departments-cards-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const departments = await apiGetDepartments();

    departments.forEach(dept => {
        const card = document.createElement('article');
        card.className = 'dept-card';

        card.innerHTML = `
            <div class="dept-card-top">
                <div class="dept-title-area">
                    <h4>${dept.name}</h4>
                    <span class="dept-urdu-name">${dept.nameUrdu || ''}</span>
                </div>
                <div class="dept-score-badge">
                    <span>Trust Score</span>
                    <strong>${dept.trustScore || 85}</strong>
                </div>
            </div>

            <p class="dept-mandate-text">${dept.mandate}</p>

            <div class="dept-meta-row">
                <span class="sla-pill">⏳ SLA: ${dept.slaDays} Days Auto-Escalation</span>
                <span class="jurisdiction-pill">📍 ${dept.jurisdiction}</span>
            </div>

            <div class="dept-contact-footer">
                <span>📞 Helpline: <strong>${dept.helpline}</strong></span>
                <span>📧 <a href="mailto:${dept.email}">${dept.email}</a></span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==============================================================
// 11. Officer Workstation Management (Assigned Jurisdiction)
// ==============================================================
function populateOfficerTickets() {
    const ticketSelect = document.getElementById('officer-ticket-select');
    if (!ticketSelect) return;

    ticketSelect.innerHTML = '<option value="">-- Choose Ticket to Action --</option>';

    // Filter tickets: Officer sees complaints of their assigned DISTRICT!
    let assignedTickets = [];
    if (currentUser && currentUser.role === 'officer') {
        const officerCity = (currentUser.city || '').toLowerCase();
        assignedTickets = allComplaints.filter(c => {
            const complaintCity = (c.city || '').toLowerCase();
            return complaintCity.includes(officerCity) || officerCity.includes(complaintCity) || officerCity === 'all' || officerCity === 'pakistan';
        });
    } else {
        assignedTickets = allComplaints;
    }

    if (assignedTickets.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.textContent = `-- No complaints registered in your district (${currentUser?.city || 'Selected'}) yet --`;
        ticketSelect.appendChild(opt);
        return;
    }

    assignedTickets.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `#${item.id} - ${item.title.substring(0, 35)}... [${item.status}] (${item.city} - ${item.department})`;
        ticketSelect.appendChild(opt);
    });
}

function initOfficerActions() {
    const executeBtn = document.getElementById('execute-status-btn');
    const ticketSelect = document.getElementById('officer-ticket-select');
    const statusSelect = document.getElementById('officer-status-select');
    const noteInput = document.getElementById('officer-resolution-note');

    if (!executeBtn) return;

    executeBtn.addEventListener('click', async function () {
        const ticketId = ticketSelect.value;
        const newStatus = statusSelect.value;
        const note = noteInput.value.trim() || 'Verified and updated by municipal officer.';
        const officerName = currentUser ? currentUser.name : 'Officer';

        if (!ticketId) {
            alert('Please select a complaint ticket from the dropdown.');
            return;
        }

        executeBtn.disabled = true;
        executeBtn.textContent = 'Updating Database...';

        const res = await apiUpdateStatus(ticketId, newStatus, note, officerName);

        executeBtn.disabled = false;
        executeBtn.textContent = '💾 Execute Status Mutation';

        if (res.success) {
            alert(`✓ SUCCESS! Ticket #${ticketId} status mutated to [${newStatus}]. Database updated in real time.`);
            await loadAndDisplayComplaints();
            scrollToSection('feed-section');
        } else {
            alert('Failed to update status. Please try again.');
        }
    });
}

// ==============================================================
// 12. Update Civic Statistics Numbers
// ==============================================================
function updateStatistics() {
    const totalEl = document.getElementById('stat-total');
    const resolvedEl = document.getElementById('stat-resolved');
    const progressEl = document.getElementById('stat-progress');
    const upvotesEl = document.getElementById('stat-upvotes');

    if (!totalEl) return;

    let resolvedCount = 0;
    let progressCount = 0;
    let totalVotes = 0;

    allComplaints.forEach(item => {
        if (item.status === 'Resolved') resolvedCount++;
        if (item.status === 'In Progress') progressCount++;
        totalVotes += (item.upvotes || 1);
    });

    totalEl.textContent = allComplaints.length;
    resolvedEl.textContent = resolvedCount;
    progressEl.textContent = progressCount;
    upvotesEl.textContent = totalVotes;
}

// ==============================================================
// 13. App Initialization on DOMContentLoaded
// ==============================================================
window.addEventListener('DOMContentLoaded', function () {
    demonstrateCourseTopics();
    initClock();
    populateDistrictDropdowns();
    initNavigation();
    initAuth();
    initCategoryAndDepartment();
    initAIButton();
    initComplaintForm();
    initFilters();
    initOfficerActions();
    loadAndDisplayComplaints();
});
