
# UIDAI Token Generation Project — Production README

---

## Project Overview

A Government Token & Appointment Management System built with a Node.js/Express backend and plain HTML/CSS/JS frontend, hosted on Microsoft Azure and accessible at [generatetoken.page](https://generatetoken.page).

---

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
