# MUASHRA (معاشرہ) - Web Engineering Course Project

## Project Overview
**MUASHRA** is a civic grievance reporting and municipal accountability web application built strictly with fundamental Web Engineering technologies. It bridges the communication gap between citizens and municipal authorities (WASA, SEPCO, KW&SB, SSWMB, and C&W) across Pakistani cities.

---

## Key Features & User Experience

### 1. Semantic Sidebar Navigation Layout
- **Sidebar (`<aside class="sidebar">`)**: Houses branding, real-time user session status (Guest vs Citizen vs Officer), quick action buttons (`➕ File a Complaint`, `🔑 Sign In / Register`), and direct section navigation.
- **Main Area (`<main class="main-content">`)**: Displays hero showcase with authentic photos from the field, civic mission cards, live complaint lodging form, neighborhood status feed, and the official officer portal.

### 2. Unified Authentication System (Citizen & Officer)
- **Citizen Account**: Quick login or registration with name, email, and city. Auto-populates citizen credentials on grievance submissions.
- **Municipal Officer Access**: Secured with government departmental security passkeys (e.g. `KHP-9021`, `WASA-9941`, `SEPCO-8812`, `KWSB-7742`). Includes 1-click testing accounts for classroom demonstrations.

### 3. Department Auto-Routing (Zero Misdirection)
- Form provides explicit **Category** and **Department** `<select>` controls.
- **Real-Time Voice & Text Keyword Scanner**: Speaking or typing keywords (e.g., *"pani"* / *"leak"* -> Water & Sanitation -> WASA/KW&SB/PHED; *"bijli"* / *"transformer"* -> Electricity & Power -> SEPCO/LESCO/KE; *"kachra"* -> Waste Management -> SSWMB/LWMC; *"sadak"* -> Roads -> Works & Services C&W) automatically selects the exact responsible department!
- Citizens can also manually adjust the department or trigger Groq AI to structure it.

### 4. All 39 Pakistani Districts Integrated
- Included all 39 districts from MUASHRA (Khairpur Mirs, Sukkur, Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Faisalabad, Multan, Larkana, Hyderabad, etc.) in every city dropdown (Complaint Form, Live Filters, and Citizen Registration).

### 5. Dedicated Department Responsibility & SLA Matrix
- A dedicated `<section id="departments-section">` showcasing 10 municipal departments (WASA, KW&SB, SEPCO, SSWMB, LWMC, C&W, PHED, LESCO, KE, Local Municipal Admin).
- Displays institutional mandates, trust scores (76-92), legally mandated SLA turnaround times (2-7 days), official helplines (1334, 118, 1128, 1099), and official contact emails.

### 6. "🔥 Intensify Issue" Community Voting & Auto-Escalation
- Citizens and neighbors can click **"🔥 Intensify (+1)"** to confirm and escalate civic priorities.
- Auto-escalation badges:
  - $\ge 5$ votes: *⚠️ Escalated to Deputy Commissioner*
  - $\ge 10$ votes: *🚨 Escalated to Provincial Chief Secretary*
- Sort toggle: **"⚡ Sort: Most Intensified First"** dynamically orders tickets by public demand.

### 7. Interactive Live GPS Geolocation
- **Starts completely blank**: District and Street Address remain empty until the citizen explicitly clicks **"📍 Detect Live GPS Location"**.
- Queries browser geolocation sensor (`navigator.geolocation`) and performs reverse geocoding via Google Maps API with OpenStreetMap Nominatim fallback.
- Dynamically updates the interactive Google Maps `<iframe>` to pinpoint the incident.

### 8. Officer Administrative Workstation (Assigned Controls)
- Authenticated officers see their official badge seal, designation, and assigned jurisdiction.
- Filters tickets assigned specifically to the officer's department/jurisdiction.
- Officers can mutate operational status (**In Progress**, **Resolved**, **Pending**), enter official resolution remarks, and save the update to the database and UI in real time.

---

## Web Engineering Topics Mapping

### 1. HTML5 Structure & Semantic Tags
- **Semantic Tags**: `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Media & Embedding**: `<audio>` (plays voice recordings), `<iframe>` (embeds dynamic Google Maps satellite view), `<img>` (real project imagery).
- **Forms**: `<form>`, `<input>`, `<select>`, `<textarea>`, `<button>`, `<fieldset>`, `<legend>`.
- **Tables**: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
- **Headings & Text**: `<h1>`-`<h6>`, `<p>`, `<br>`, `<hr>`, `<strong>`, `<code>`, `<mark>`.

### 2. CSS3 Layout & Styling
- **Selectors**: Universal (`*`), Element (`body`, `table`), ID (`#report-section`, `#auth-modal`), Class (`.sidebar`, `.hero-card`), Pseudo-classes (`:hover`, `:active`, `:focus`, `:nth-child(even)`).
- **Parent-Child Rules**: `nav.sidebar-nav ul li a.nav-item`, `.styled-table tbody tr:hover`.
- **Box Model**: Clear `margin`, `padding`, `border`, `width`, `height`, `box-sizing: border-box`.
- **Flexbox**: `display: flex`, `flex-direction`, `gap`, `flex-wrap`, `justify-content`, `align-items`.
- **Responsive Media Queries**: `@media (max-width: 900px)` and `@media (max-width: 600px)` adapting sidebar and grids for mobile screens.

### 3. JavaScript (ES6+ & DOM)
- **Variables**: `var`, `let`, `const`.
- **Operators**: Arithmetic, comparison (`===`), logical (`&&`, `||`, `!`).
- **Conditionals**: `if-else`, `switch-case` (for ticket urgency badge coloring).
- **Loops**: `for`, `while`, `do-while` (demonstrated in `js/app.js`).
- **Array Methods**: `forEach()`, `push()`, `pop()`, `shift()`, `unshift()`, `filter()`.
- **DOM Methods**: `getElementById()`, `getElementsByTagName()`, `querySelector()`, `querySelectorAll()`, `createElement()`, `appendChild()`.
- **JSON & Objects**: `JSON.stringify()`, `JSON.parse()`.
- **Fetch API**: Native `fetch()` calls with `GET`, `POST`, and `PATCH`.

### 4. Backend & Database
- **Node.js**: Clean Express server (`server/server.js`) handling REST endpoints and Groq AI proxy.
- **Supabase Cloud Database**: PostgreSQL database table (`complaints`) with Row Level Security.
- **Triple Fallback Architecture**: Node.js backend -> Direct Supabase REST API -> Local `localStorage` fallback.

---

## How to Run the Project

### Option A: The Full-Stack Node.js Way (Recommended for Course Demo)
1. Open PowerShell / Command Prompt:
   ```bash
   cd "C:\Users\marzi\.gemini\antigravity\scratch\Web_Engineering_Project\server"
   node server.js
   ```
2. Open your browser at:
   ```
   http://localhost:5000
   ```

### Option B: Direct Double-Click (No Terminal Required)
1. In File Explorer, go to `C:\Users\marzi\.gemini\antigravity\scratch\Web_Engineering_Project`.
2. Double-click `index.html`.
3. It opens directly in Chrome or Edge and connects to Supabase Cloud REST and local storage.
