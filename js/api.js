// ==============================================================
// MUASHRA - API Services Module (Course Topic: fetch() & JSON)
// Handles all HTTP requests using native vanilla fetch()
// Supports: Node.js Backend -> Supabase Cloud Database -> Local Fallback
// ==============================================================

// Support both direct http://localhost:5000 execution and file:/// or live-server testing
const API_BASE = (window.location.protocol === 'file:' || !window.location.port || window.location.port !== '5000')
    ? 'http://localhost:5000/api'
    : '/api';

// Supabase Cloud Configuration
const SUPABASE_URL = "https://syyyuwugegbtbuxanxtu.supabase.co";
const SUPABASE_KEY = "sb_publishable_fYgp1JGnj3miUnUlKU6Suw_nl3IqAQq";

// Master List of 39 Pakistani Districts from MUASHRA
const ALL_PAKISTAN_DISTRICTS = [
    'Khairpur Mirs',
    'Khairpur',
    'Sukkur',
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Peshawar',
    'Quetta',
    'Faisalabad',
    'Multan',
    'Gujranwala',
    'Sialkot',
    'Hyderabad',
    'Larkana',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Mardan',
    'Sheikhupura',
    'Rahim Yar Khan',
    'Jhang',
    'Gujrat',
    'Kasur',
    'Sahiwal',
    'Okara',
    'Wah Cantt',
    'Dera Ghazi Khan',
    'Mirpur Khas',
    'Chiniot',
    'Kamoke',
    'Mandi Bahauddin',
    'Jhelum',
    'Khanewal',
    'Muzaffargarh',
    'Turbat',
    'Mingora (Swat)',
    'Muzaffarabad',
    'Gilgit'
];

// Master Department Directory Catalog
const MASTER_DEPARTMENTS = [
    {
        name: "Sui Southern Gas Company (SSGC)",
        nameUrdu: "سوئی سدرن گیس کمپنی",
        category: "Gas & Sui Gas Pipeline",
        jurisdiction: "Khairpur Mirs, Sukkur, Karachi, Hyderabad, Larkana, Sindh & Balochistan",
        email: "complaints@ssgc.com.pk",
        helpline: "1199",
        slaDays: 1,
        trustScore: 89,
        ratingGrade: "A+",
        mandate: "Immediate gas pipeline leak isolation, hazardous gas smell inspection, pressure stabilization, and pipeline explosion prevention."
    },
    {
        name: "Sui Northern Gas Pipelines (SNGPL)",
        nameUrdu: "سوئی ناردرن گیس پائپ لائنز",
        category: "Gas & Sui Gas Pipeline",
        jurisdiction: "Lahore, Rawalpindi, Islamabad, Faisalabad, Multan, Peshawar, Punjab & KP",
        email: "customercare@sngpl.com.pk",
        helpline: "1199",
        slaDays: 1,
        trustScore: 90,
        ratingGrade: "A+",
        mandate: "High-pressure transmission pipeline repair, residential gas leakage emergency response, and meter burnout replacements."
    },
    {
        name: "Public Health Engineering Department",
        nameUrdu: "محکمہ پبلک ہیلتھ انجینئرنگ",
        category: "Water & Sanitation",
        jurisdiction: "Khairpur Mirs, Sukkur, Larkana, Interior Sindh",
        email: "phed@sindh.gov.pk",
        helpline: "1099",
        slaDays: 5,
        trustScore: 88,
        ratingGrade: "A",
        mandate: "Maintenance of rural and suburban drinking water supply pipelines, water treatment plants, and major rural sewerage systems."
    },
    {
        name: "Water & Sanitation Agency (WASA)",
        nameUrdu: "واٹر اینڈ سینی ٹیشن ایجنسی (واسہ)",
        category: "Water & Sanitation",
        jurisdiction: "Lahore, Rawalpindi, Faisalabad, Multan, Gujranwala",
        email: "complaints@wasa.punjab.gov.pk",
        helpline: "1334",
        slaDays: 3,
        trustScore: 92,
        ratingGrade: "A+",
        mandate: "Urban municipal water supply distribution, drainage network de-silting, sewer line unclogging, and storm water management."
    },
    {
        name: "Karachi Water & Sewerage Board (KW&SB)",
        nameUrdu: "کراچی واٹر اینڈ سیوریج بورڈ",
        category: "Water & Sanitation",
        jurisdiction: "Karachi Metropolitan Area",
        email: "commissioner@karachi.gov.pk",
        helpline: "1334 / 118",
        slaDays: 4,
        trustScore: 78,
        ratingGrade: "B+",
        mandate: "Metropolitan bulk water distribution, sewer trunk line repairs, and prevention of potable water contamination."
    },
    {
        name: "Sukkur Electric Power Company (SEPCO)",
        nameUrdu: "سکھر الیکٹرک پاور کمپنی (سیپکو)",
        category: "Electricity & Power",
        jurisdiction: "Sukkur, Khairpur, Larkana, Ghotki, Shikarpur, Jacobabad",
        email: "customercare@sepco.com.pk",
        helpline: "118",
        slaDays: 2,
        trustScore: 84,
        ratingGrade: "A",
        mandate: "Electrical power distribution, damaged pole replacements, sparking transformer repairs, and high-tension cable hazard removal."
    },
    {
        name: "K-Electric (KE)",
        nameUrdu: "کے الیکٹرک",
        category: "Electricity & Power",
        jurisdiction: "Karachi, Hub",
        email: "complaints@ke.com.pk",
        helpline: "118",
        slaDays: 2,
        trustScore: 81,
        ratingGrade: "A",
        mandate: "Power grid stability, residential power outage rectification, dangling wire safety isolation, and local substation servicing."
    },
    {
        name: "Lahore Electric Supply Company (LESCO)",
        nameUrdu: "لاہور الیکٹرک سپلائی کمپنی (لیسکو)",
        category: "Electricity & Power",
        jurisdiction: "Lahore, Kasur, Okara, Sheikhupura",
        email: "customercare@lesco.gov.pk",
        helpline: "118",
        slaDays: 2,
        trustScore: 86,
        ratingGrade: "A",
        mandate: "Electrical transmission repairs, meter burnout replacements, low-voltage hazard rectification, and emergency line isolation."
    },
    {
        name: "Sindh Solid Waste Management Board (SSWMB)",
        nameUrdu: "سندھ سالڈ ویسٹ مینجمنٹ بورڈ",
        category: "Waste Management",
        jurisdiction: "Karachi, Hyderabad, Sukkur, Larkana",
        email: "info@sswmb.gos.pk",
        helpline: "1128",
        slaDays: 3,
        trustScore: 79,
        ratingGrade: "B+",
        mandate: "Door-to-door municipal solid waste collection, roadside garbage dumpster clearance, and neighborhood sanitation maintenance."
    },
    {
        name: "Lahore Waste Management Company (LWMC)",
        nameUrdu: "لاہور ویسٹ مینجمنٹ کمپنی",
        category: "Waste Management",
        jurisdiction: "Lahore Metropolitan Area",
        email: "info@lwmc.com.pk",
        helpline: "1139",
        slaDays: 3,
        trustScore: 91,
        ratingGrade: "A+",
        mandate: "Urban waste collection, mechanical street sweeping, container clearance, and hazardous waste removal from educational/hospital zones."
    },
    {
        name: "Works & Services Department (C&W)",
        nameUrdu: "محکمہ مواصلات و تعمیرات (سی اینڈ ڈبلیو)",
        category: "Roads & Infrastructure",
        jurisdiction: "All Districts of Pakistan",
        email: "secretary@works.punjab.gov.pk",
        helpline: "1099",
        slaDays: 7,
        trustScore: 82,
        ratingGrade: "A",
        mandate: "Public highway patching, deep road pothole repairs, culvert & bridge maintenance, and structural safety inspections."
    },
    {
        name: "Local Municipal Administration & Town Committee",
        nameUrdu: "مقامی میونسپل کمیٹی و ٹاؤن ایڈمنسٹریشن",
        category: "Municipal Services",
        jurisdiction: "All 39 Districts",
        email: "complaints@localgov.pk",
        helpline: "1099",
        slaDays: 5,
        trustScore: 76,
        ratingGrade: "B",
        mandate: "General civic redressal, street light maintenance, open manhole covers, encroachment removal, and public parks upkeep."
    }
];

// ==============================================================
// 1. Authentication Services (Course Topic: fetch() POST with JSON)
// ==============================================================

async function apiLogin(credentials) {
    // 1. Try Node.js Backend API
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
                localStorage.setItem('muashra_user', JSON.stringify(result.user));
                return { success: true, user: result.user };
            }
        }
    } catch (err) {}

    // 2. Local Fallback Authentication
    const pass = (credentials.passkey || '').trim().toUpperCase();
    const email = (credentials.email || '').trim().toLowerCase();

    // 1. Electricity Officer (SEPCO)
    if (pass === 'SEPCO-8812' || pass === 'SEPCO' || pass === 'KHP-SEPCO' || email.includes('sepco')) {
        const user = {
            id: 'usr-103',
            name: 'Engr. Farooq Soomro',
            email: 'officer.khairpur@sepco.com.pk',
            role: 'officer',
            department: 'Sukkur Electric Power Company (SEPCO)',
            designation: 'Sub-Divisional Officer (SDO) - SEPCO Khairpur',
            badgeId: 'SEPCO-8812',
            city: 'Khairpur Mirs'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // 2. Water & Public Health Officer (PHED)
    if (pass === 'PHED-5521' || pass === 'PHED' || email.includes('phed')) {
        const user = {
            id: 'usr-104',
            name: 'Engr. Tariq Memon',
            email: 'officer.phed@sindh.gov.pk',
            role: 'officer',
            department: 'Public Health Engineering Department',
            designation: 'Executive Engineer (XEN) - Public Health & Sanitation Khairpur',
            badgeId: 'PHED-5521',
            city: 'Khairpur Mirs'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // 3. Sui Gas Officer (SSGC)
    if (pass === 'SSGC-4410' || pass === 'SSGC' || email.includes('ssgc')) {
        const user = {
            id: 'usr-105',
            name: 'Engr. Naveed Abbasi',
            email: 'officer.khairpur@ssgc.com.pk',
            role: 'officer',
            department: 'Sui Southern Gas Company (SSGC)',
            designation: 'In-charge Distribution - SSGC Khairpur',
            badgeId: 'SSGC-4410',
            city: 'Khairpur Mirs'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // 4. District Administration & Municipal Oversight (DC Office / All Departments)
    if (pass === 'ADMIN-9000' || pass === 'ADMIN' || pass === 'DC-KHP' || email.includes('admin.khairpur')) {
        const user = {
            id: 'usr-106',
            name: 'Syed Zulfiqar Shah',
            email: 'admin.khairpur@sindh.gov.pk',
            role: 'officer',
            department: 'Local Municipal Administration & Town Committee',
            designation: 'Assistant Commissioner / Municipal Officer - Khairpur (All Departments Oversight)',
            badgeId: 'ADMIN-9000',
            city: 'Khairpur Mirs'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // Citizen Demo 1: Ahmed Khan
    if (email === 'ahmed@citizen.pk') {
        const user = {
            id: 'usr-101',
            name: 'Ahmed Khan',
            email: 'ahmed@citizen.pk',
            role: 'citizen',
            city: credentials.city || 'Khairpur Mirs',
            phone: '0300-1234567'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // Citizen Demo 2: Zainab Bibi
    if (email === 'zainab@citizen.pk') {
        const user = {
            id: 'usr-102',
            name: 'Zainab Bibi',
            email: 'zainab@citizen.pk',
            role: 'citizen',
            city: credentials.city || 'Khairpur Mirs',
            phone: '0301-9876543'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    // Generic Citizen Login
    if (email.includes('citizen') || credentials.name) {
        const user = {
            id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
            name: credentials.name || 'Citizen',
            email: email || 'citizen@muashra.pk',
            role: 'citizen',
            city: credentials.city || 'Khairpur Mirs',
            phone: '0300-1234567'
        };
        localStorage.setItem('muashra_user', JSON.stringify(user));
        return { success: true, user };
    }

    return { success: false, message: 'Invalid credentials or security passkey.' };
}

async function apiRegister(userData) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
                localStorage.setItem('muashra_user', JSON.stringify(result.user));
                return { success: true, user: result.user };
            }
        }
    } catch (e) {}

    const newUser = {
        id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
        name: userData.name || 'Citizen',
        email: userData.email,
        role: 'citizen',
        city: userData.city || 'Khairpur Mirs',
        phone: userData.phone || ''
    };
    localStorage.setItem('muashra_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
}

function apiGetCurrentUser() {
    try {
        const saved = localStorage.getItem('muashra_user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

function apiLogout() {
    localStorage.removeItem('muashra_user');
}

// ==============================================================
// 2. Complaints Retrieval (Course Topic: fetch() GET)
// Strictly ZERO dummy data: starts empty until user registers!
// ==============================================================
async function apiGetComplaints() {
    // 1. Try Node.js Backend
    try {
        const response = await fetch(`${API_BASE}/complaints`);
        if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result.data)) return result.data;
        }
    } catch (err) {}

    // 2. Try Supabase Cloud REST
    try {
        const sbResponse = await fetch(`${SUPABASE_URL}/rest/v1/complaints?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        if (sbResponse.ok) {
            const data = await sbResponse.json();
            if (Array.isArray(data)) return data;
        }
    } catch (sbErr) {}

    // 3. Fallback Local Storage (Starts completely empty)
    const saved = localStorage.getItem('local_complaints');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
    }

    // Initial empty array - NO DUMMY RECORDS!
    return [];
}

// ==============================================================
// 3. Submit Complaint (Course Topic: fetch() POST with JSON)
// ==============================================================
async function apiCreateComplaint(complaintData) {
    const id = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
    const newRecord = {
        id: id,
        ...complaintData,
        status: 'Pending',
        upvotes: 1,
        created_at: new Date().toISOString()
    };

    // 1. Try Node.js Backend
    try {
        const response = await fetch(`${API_BASE}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });
        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result.data || newRecord };
        }
    } catch (err) {}

    // 2. Try Supabase Cloud Insert
    try {
        const sbResponse = await fetch(`${SUPABASE_URL}/rest/v1/complaints`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(newRecord)
        });
        if (sbResponse.ok) {
            const data = await sbResponse.json();
            const created = data[0] || newRecord;
            // Mirror to Node.js server to ensure server/complaints.json receives it!
            try {
                fetch(`${API_BASE}/complaints/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(created)
                }).catch(() => {});
            } catch (e) {}
            return { success: true, data: created };
        }
    } catch (e) {}

    // 3. Fallback Local Storage
    const existing = await apiGetComplaints();
    existing.unshift(newRecord);
    localStorage.setItem('local_complaints', JSON.stringify(existing));
    return { success: true, data: newRecord };
}

// ==============================================================
// 4. Upvote / Intensify Grievance (+1 with 1-Vote-Per-Citizen Enforcement)
// ==============================================================
async function apiUpvoteComplaint(id, voterId) {
    try {
        const response = await fetch(`${API_BASE}/complaints/${id}/upvote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterId })
        });
        const result = await response.json();
        return result;
    } catch (err) {}

    const list = await apiGetComplaints();
    const item = list.find(c => c.id === id);
    if (item) {
        item.voters = item.voters || [];
        if (voterId && item.voters.includes(voterId)) {
            return { success: false, alreadyVoted: true, message: 'You have already intensified this grievance once.', upvotes: item.upvotes };
        }
        if (voterId) item.voters.push(voterId);
        item.upvotes = (item.upvotes || 1) + 1;
        localStorage.setItem('local_complaints', JSON.stringify(list));
        return { success: true, upvotes: item.upvotes, voters: item.voters };
    }
    return { success: false };
}

// ==============================================================
// 5. Update Status (Officer Console - Course Topic: fetch() PATCH)
// ==============================================================
async function apiUpdateStatus(id, newStatus, note = '', officer_name = '') {
    // 1. Try Node.js Backend
    try {
        const response = await fetch(`${API_BASE}/complaints/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, note, officer_name })
        });
        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result.data };
        }
    } catch (err) {}

    // 2. Try Supabase Cloud PATCH
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/complaints?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (e) {}

    // 3. Fallback Local Storage
    const list = await apiGetComplaints();
    const item = list.find(c => c.id === id);
    if (item) {
        item.status = newStatus;
        item.resolution_note = note || `Status updated by ${officer_name || 'Officer'}`;
        localStorage.setItem('local_complaints', JSON.stringify(list));
        return { success: true, data: item };
    }
    return { success: false };
}

// ==============================================================
// 6. Department Accountability & Trust Matrix API
// ==============================================================
async function apiGetDepartments() {
    try {
        const response = await fetch(`${API_BASE}/analytics/departments`);
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) return result.data;
        }
    } catch (e) {}

    return MASTER_DEPARTMENTS;
}

// ==============================================================
// 7. AI & Department Categorizer (Course Topic: fetch() & Rule Engine)
// ==============================================================
async function apiAnalyzeWithAI(text, city) {
    try {
        const response = await fetch(`${API_BASE}/ai/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, city })
        });
        if (response.ok) {
            const result = await response.json();
            if (result.analysis) return result.analysis;
        }
    } catch (err) {}

    return clientClassifyDepartment(text, city);
}

function clientClassifyDepartment(text, city) {
    const lower = text.toLowerCase();
    const cityLower = (city || '').toLowerCase();

    let category = 'Municipal Services';
    let department = 'Local Municipal Administration & Town Committee';
    let urgency = 'Medium';

    // 0. Gas & Sui Gas Pipeline (Emergency Safety Hazard)
    if (lower.includes('gas') || lower.includes('sui gas') || lower.includes('ssgc') || 
        lower.includes('sngpl') || lower.includes('cylinder') || lower.includes('gas leak') || 
        lower.includes('gas line') || lower.includes('gas smell') || lower.includes('gas pipe')) {
        
        category = 'Gas & Sui Gas Pipeline';
        urgency = 'Critical';
        
        if (cityLower.includes('lahore') || cityLower.includes('islamabad') || cityLower.includes('rawalpindi') || 
            cityLower.includes('faisalabad') || cityLower.includes('multan') || cityLower.includes('peshawar') ||
            cityLower.includes('gujranwala') || cityLower.includes('sialkot') || cityLower.includes('sargodha') ||
            cityLower.includes('sheikhupura') || cityLower.includes('jhang') || cityLower.includes('gujrat') ||
            cityLower.includes('sahiwal') || cityLower.includes('okara') || cityLower.includes('kasur')) {
            department = 'Sui Northern Gas Pipelines (SNGPL)';
        } else {
            department = 'Sui Southern Gas Company (SSGC)';
        }
    } else if (lower.includes('pani') || lower.includes('water') || (lower.includes('pipe') && !lower.includes('gas')) || 
        lower.includes('sewer') || lower.includes('gutter') || lower.includes('naali') || 
        (lower.includes('leak') && !lower.includes('gas')) || lower.includes('wasa') || lower.includes('kwsb')) {
        category = 'Water & Sanitation';
        urgency = 'High';
        department = cityLower.includes('karachi') ? 'Karachi Water & Sewerage Board (KW&SB)' : 
                     (cityLower.includes('sukkur') || cityLower.includes('khairpur') || cityLower.includes('larkana')) ? 'Public Health Engineering Department' : 'Water & Sanitation Agency (WASA)';
    } else if (lower.includes('bijli') || lower.includes('electric') || lower.includes('light') || 
               lower.includes('wire') || lower.includes('tar') || lower.includes('transformer') || 
               lower.includes('spark') || lower.includes('sepco') || lower.includes('lesco') || lower.includes('ke')) {
        category = 'Electricity & Power';
        urgency = 'Critical';
        department = (cityLower.includes('sukkur') || cityLower.includes('khairpur') || cityLower.includes('larkana')) ? 'Sukkur Electric Power Company (SEPCO)' : 
                     cityLower.includes('karachi') ? 'K-Electric (KE)' : 
                     (cityLower.includes('lahore') || cityLower.includes('kasur')) ? 'Lahore Electric Supply Company (LESCO)' : 'Sukkur Electric Power Company (SEPCO)';
    } else if (lower.includes('kachra') || lower.includes('garbage') || lower.includes('waste') || 
               lower.includes('safai') || lower.includes('trash') || lower.includes('filth')) {
        category = 'Waste Management';
        urgency = 'Medium';
        department = cityLower.includes('karachi') || cityLower.includes('sukkur') || cityLower.includes('hyderabad') ? 'Sindh Solid Waste Management Board (SSWMB)' : 
                     cityLower.includes('lahore') ? 'Lahore Waste Management Company (LWMC)' : 'Sindh Solid Waste Management Board (SSWMB)';
    } else if (lower.includes('sadak') || lower.includes('road') || lower.includes('pothole') || 
               lower.includes('gali') || lower.includes('manhole')) {
        category = 'Roads & Infrastructure';
        urgency = lower.includes('manhole') ? 'Critical' : 'High';
        department = 'Works & Services Department (C&W)';
    }

    const clean = text.trim();
    return {
        title: `Official Grievance: ${clean.substring(0, 50)}...`,
        category,
        department,
        urgency,
        formal_english: `OFFICIAL CITIZEN GRIEVANCE PETITION\n\nRespected Executive Authority,\nThis administrative petition is submitted regarding civic deterioration at ${city}: "${clean}". Immediate technical crew deployment and corrective intervention are earnestly requested.`,
        formal_urdu: `بخدمت جناب مجاز اتھارٹی (${department})،\nعنوان: باضابطہ عوامی شکایت بابت ${category}۔\nگزارش ہے کہ شہری مسئلہ: "${clean}" فوری حل کا طالب ہے۔ ازراہ کرم فی الفور اصلاحی کارروائی عمل میں لائی جائے۔`
    };
}
