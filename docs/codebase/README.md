# UIDAI Token Generation Project

This repository currently contains three layers of work:

1. The active static frontend in `frontend/` and active Node/Express backend in `backend/`.
3. Experimental or parked ideas in `random/`, notebooks, and text notes.

# The active stack first:

- Frontend entry flow: `frontend/index.html` -> `frontend/index2.html` -> `frontend/appointment.html` or `frontend/walkin.html`
- Admin flow: `frontend/admin-login.html` -> `frontend/admin.html` -> `frontend/priority-settings.html`
- Guard flow: `frontend/guard-login.html` -> `frontend/guard.html`
- Backend entry point: `backend/src/server.js`
- Database schema bootstrap: `backend/src/models/init.js`

## Quick Start

### Active backend

From `backend/`:

```bash
npm install
npm start
```

The backend listens on `http://localhost:5000`.

Important notes:

- `backend/src/server.js` loads environment variables from `backend/.env`.
- `backend/src/models/init.js` defines the SQLite schema, but it is not automatically imported by `server.js`.
- The database file is `backend/src/models/appointments.db`.

### Active frontend

The frontend is plain HTML/CSS/JS. Serve `frontend/` with Live Server or any static server so the HTML pages can call the backend on port `5000`.

## Documentation Index

- `docs/codebase/backend.md`
- `docs/codebase/frontend.md`


### Active booking flow

1. `frontend/index.html` shows the instruction/consent screen.
2. `frontend/index2.html` checks notice text, geolocation, and whether walk-in should be allowed.
3. `frontend/appointment.html` and `frontend/js/appointment.js` handle future or same-day appointment booking.
4. `frontend/walkin.html` and `frontend/js/walkin.js` handle walk-in token booking.
5. Both flows submit to `POST /api/generate-token`.
6. `frontend/confirmation.html` reads `localStorage.tokenData` and renders the printable slip.

### Admin flow

1. `frontend/admin-login.html` stores `adminToken` in `localStorage`.
2. `frontend/js/admin.js` reads calendar, token list, summary dashboard, token-per-hour settings, and CSV export.
3. `frontend/priority-settings.html` and `frontend/js/priority-settings.js` manage priority rules, long-distance districts, holidays, and notices.

### Guard flow

1. `frontend/guard-login.html` stores `guardToken` in `localStorage`.
2. `frontend/js/guard.js` loads the current-day queue.
3. Guard actions call `visit` and `undo-visit` endpoints.

## Recommended Onboarding Order

1. Read `docs/codebase/backend.md`
2. Read `docs/codebase/frontend.md`


