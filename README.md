# UIDAI Token & Appointment Management System

A production-grade Aadhaar Appointment and Token Management System developed during my internship at UIDAI Regional Office Lucknow and deployed for real-world usage.

## Problem Statement

The existing token handling process relied heavily on manual intervention, resulting in:

* Long resident waiting times
* Manual queue management
* Difficulty tracking actual resident visits
* Lack of real-time operational visibility
* No district-wise analytics for service demand
* Limited reporting and auditability

Managing appointments, walk-ins, priority residents, and daily service statistics manually became increasingly difficult as resident volume grew.

---

## Solution

Designed and deployed a full-stack Token & Appointment Management System featuring:

### QR-Based Appointment & Token Generation

* Appointment booking and walk-in token generation
* Aadhaar service-specific workflows

### Intelligent Priority Handling

* Senior citizen priority
* Child priority
* Divyang priority
* District-based priority rules
* Configurable administrative controls

### Multi-Level Operations Workflow

* Guard 1: Entry Verification
* Guard 2: Service Completion Tracking
* Guard 3: Physical & Reference Token Handling

### Administrative Dashboard

* Real-time token monitoring
* Daily slot management
* Holiday management
* Priority configuration
* CSV exports
* Operational analytics

### District Analytics & Heatmap

* Uttar Pradesh district-wise visualization
* Appointment analytics and Walk-in analytics
* EID-based analytics
* Resident drill-down reporting

---

## Impact

### Real-World Deployment

* Successfully deployed at UIDAI Regional Office Lucknow
* Hosted on Microsoft Azure
* Accessible through a public production domain

### Operational Benefits

* Supports approximately 300+ daily token requests
* Reduces manual token management effort
* Enables real-time queue monitoring
* Improves operational visibility for administrators
* Provides district-level service demand analytics

### Engineering Outcomes

* End-to-end production deployment
* Cloud-hosted infrastructure
* Automated reporting and analytics
* Scalable architecture for future expansion

---

## Key Features

* Appointment Booking System
* Walk-in Token Generation
* EID-Based Resident Tracking
* Priority Token Management
* Entry & Service Verification Workflow
* Heatmap Analytics Dashboard
* CSV Export & Reporting
* Real-Time Operational Monitoring

---

## Screenshots

### First Page
<img width="1215" height="686" alt="image" src="https://github.com/user-attachments/assets/5b0135cb-ffb8-446a-9fc2-e463b36f5c9b" />


### Appointment Portal

<img width="1214" height="508" alt="image" src="https://github.com/user-attachments/assets/eec614d6-c9a5-48b4-8dd9-284fdd958f28" />


### Walk-in Portal
<img width="1217" height="471" alt="image" src="https://github.com/user-attachments/assets/1a9b8ddd-7523-4017-9e61-8e99b76c1fa8" />

### Resident Form
<img width="1218" height="686" alt="image" src="https://github.com/user-attachments/assets/78b06043-6c95-4b3b-96e4-7777a43f2c44" />

### Token Confirmation Slip
<img width="1235" height="695" alt="image" src="https://github.com/user-attachments/assets/05189dbc-dc37-4f36-b9f4-10aaeaa6d19d" />
<img width="1232" height="691" alt="image" src="https://github.com/user-attachments/assets/477fdaab-e392-4d69-af88-f8434e4966eb" />

### Admin Dashboard
<img width="1226" height="613" alt="image" src="https://github.com/user-attachments/assets/d48a36da-3e1b-4835-bee4-39f20440a059" />
<img width="1161" height="668" alt="image" src="https://github.com/user-attachments/assets/01e73f5b-1b95-4297-9737-020532a05b0a" />
<img width="1191" height="539" alt="Screenshot 2026-06-03 114249" src="https://github.com/user-attachments/assets/64f7b2e8-b72c-4369-be72-5629dc3b9063" />

### Heatmap Analytics

<img width="1225" height="687" alt="image" src="https://github.com/user-attachments/assets/f1d55c52-45eb-4fe7-a127-f4093ae79222" />


### Guard Dashboards
<img width="1216" height="672" alt="Screenshot 2026-06-03 224050" src="https://github.com/user-attachments/assets/954569f3-5856-482b-a421-d60d3491803d" />
<img width="1218" height="671" alt="Screenshot 2026-06-03 224102" src="https://github.com/user-attachments/assets/e515c586-e4e9-479c-83d9-513627e2b1b7" />
<img width="1206" height="663" alt="Screenshot 2026-06-03 224111" src="https://github.com/user-attachments/assets/e8e894bd-02aa-4395-916a-360d35f0a7ab" />




---

## System Architecture

<img width="636" height="954" alt="image" src="https://github.com/user-attachments/assets/0bb6b17a-0e35-48ce-a7ae-c7c7d6236226" />


---

## Why This Project Matters

This project represents a complete production software lifecycle:

* Requirements gathering
* System design
* Full-stack development
* Database design
* Cloud deployment
* Operational monitoring
* Real-world usage

Rather than a demonstration project, this system is actively deployed and used in a government operational environment.


## Repository Structure

```
.
├── frontend/          # Active static frontend
├── backend/           # Active Node.js/Express backend
├── random/            # Experimental / parked ideas
└── docs/
    └── codebase/
        ├── backend.md
        └── frontend.md
```

---

## Application Flows

### User Booking Flow
```
frontend/index.html
  → frontend/index2.html
  → frontend/appointment.html   (future / same-day appointment)
     OR
  → frontend/walkin.html        (walk-in token)
  → POST /api/generate-token
  → frontend/confirmation.html  (reads localStorage.tokenData, renders printable slip)
```

### Admin Flow
```
frontend/admin-login.html   (stores adminToken in localStorage)
  → frontend/admin.html     (calendar, token list, dashboard, token-per-hour settings, CSV export)
  → frontend/priority-settings.html  (priority rules, long-distance districts, holidays, notices)
```

### Guard Flow
```
frontend/guard-login.html   (stores guardToken in localStorage)
  → frontend/guard.html     (current-day queue; calls visit / undo-visit endpoints)
```

---

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

- Listens on `http://localhost:5000`
- Loads environment variables from `backend/.env`
- Database schema: `backend/src/models/init.js` *(not auto-imported by server.js — run manually if needed)*
- Database file: `backend/src/models/appointments.db`

### Frontend

Serve `frontend/` with Live Server or any static server so HTML pages can reach the backend on port `5000`.

---

## Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Chart.js
- html2pdf.bundle.min.js
- Fetch API

### Backend
- Node.js + Express.js
- REST APIs
- SQLite (with transaction handling)

### Cloud & Infrastructure
- Microsoft Azure Virtual Machine (B2als_v2)
- GitHub CI/CD Integration
- name.com domain (`generatetoken.page`) via GitHub Student Developer Pack
- Cloudflare DNS
- HTTPS / TLS (SSL)

---

## Production Deployment Architecture

### Domain & DNS Flow

```
User
  ↓
generatetoken.page  (name.com via GitHub Student Pack)
  ↓
Cloudflare DNS  (A Record → Azure Public IP)
  ↓
Azure Public IP
  ↓
Azure VM
  ↓
Node.js Server (PM2)
```

### Azure VM Configuration

| Component       | Value                  |
|-----------------|------------------------|
| VM Size         | B2als_v2               |
| Category        | General Purpose        |
| vCPUs           | 2                      |
| RAM             | 4 GiB                  |
| Max Data Disks  | 4                      |
| Max IOPS        | 3750                   |
| Local Storage   | N/A                    |
| Disk Type       | Premium SSD Supported  |
| Monthly Cost    | ~$17.96                |
| Deployment      | GitHub → Azure         |

### CI/CD Pipeline

```
Local Development
  ↓
Push to GitHub Repository
  ↓
GitHub Actions / Manual Pull to VM
  ↓
Build on Production VM
  ↓
Live Production System
```

- Process manager: **PM2**

---

## Database & Storage

### Database
- **Engine:** SQLite (hosted on Azure VM)
- **Schema bootstrap:** `backend/src/models/init.js`
- **File:** `backend/src/models/appointments.db`

### Record Size & Growth Estimate

| Metric              | Value              |
|---------------------|--------------------|
| Per record size     | ~0.24 KB           |
| Daily (300 tokens)  | ~72 KB/day         |
| Monthly             | ~2–3 MB/month      |
| Yearly              | ~25–30 MB/year     |

### Storage Architecture

| Storage Type              | Purpose               |
|---------------------------|-----------------------|
| Premium SSD (Azure Disk)  | Database persistence  |
| VM File System            | Runtime files         |

---

## Resource Utilization

| Resource        | Usage                      |
|-----------------|----------------------------|
| Database Growth | ~25 MB/year                |
| Static Assets   | < 20 MB                    |
| RAM Usage       | ~500–800 MB (typical)      |
| CPU Load        | Low (~300 tokens/day)      |
| Disk Required   | < 1 GB for multiple years  |

> The VM (4 GB RAM) is comfortably provisioned for current load.

---

## Security Architecture

### Transport Layer
- HTTPS enabled
- TLS encryption

### Infrastructure
- Azure Network Security Group (NSG)
- Restricted inbound ports
- SSH secured access

---

## Scalability

| Metric                   | Value                             |
|--------------------------|-----------------------------------|
| Current daily load       | ~300 tokens/day (~12–15/hour)     |
| VM capacity (no scaling) | 2000+ requests/day                |
| VM spec                  | 2 vCPU + 4 GB RAM                 |

---

## Documentation Index

- `docs/codebase/backend.md`
- `docs/codebase/frontend.md`

---

## Recommended Onboarding Order

1. Read `docs/codebase/backend.md`
2. Read `docs/codebase/frontend.md`
3. Start backend: `cd backend && npm install && npm start`
4. Serve `frontend/` with Live Server
5. Open `http://localhost:5000` (backend) and the frontend in your browser
