# Backend File Documentation

This document covers the active Node/Express backend under `backend/`.

## `backend/package.json`

- Status: Active
- Purpose: Declares the backend package, runtime scripts, and Node dependencies.
- Key details: `npm start` runs `src/server.js`; `npm run dev` uses `nodemon`.
- Dependencies: `express`, `cors`, `dotenv`, `sqlite3`.

## `backend/src/server.js`

- Status: Active entry point
- Purpose: Loads `backend/.env`, imports the Express app, and starts the server on port `5000`.
- Important behavior: Logs selected environment values during startup, which is useful for debugging but risky for production.
- Change here when: You need to change the server port, startup logging, or startup bootstrap logic.

## `backend/src/app.js`

- Status: Active entry point
- Purpose: Builds the Express app, enables CORS and JSON parsing, and mounts route modules.
- Mounted routes:
  - `/api/guard`
  - `/api/admin`
  - `/api` for location, booking, and availability
- Important note: OTP routes are present only as a commented line.

## `backend/src/routes/booking.routes.js`

- Status: Active
- Purpose: Exposes `POST /api/generate-token`.
- Middleware: Applies `timeWindow.middleware.js`.
- Controller: Delegates all booking logic to `booking.controller.js`.

## `backend/src/routes/availability.routes.js`

- Status: Active
- Purpose: Exposes appointment and walk-in slot lookup endpoints.
- Endpoints:
  - `GET /api/availability`
  - `GET /api/walkin-availability`

## `backend/src/routes/location.routes.js`

- Status: Active
- Purpose: Exposes `POST /api/location-check`.
- Use case: Lets the frontend decide whether the user qualifies for walk-in mode based on distance from the office.

## `backend/src/routes/admin.routes.js`

- Status: Active
- Purpose: Defines the admin API surface.
- Main groups:
  - Login
  - Calendar overview
  - Token list by date
  - Dashboard analytics
  - Slot editing
  - Tokens-per-hour settings
  - Priority rules and long-distance district management
  - Holiday management
  - Notice management
- Important note: Some earlier stats and CSV routes are still visible as commented code.

## `backend/src/routes/guard.routes.js`

- Status: Active
- Purpose: Defines the guard-facing API.
- Endpoints:
  - `POST /login`
  - `GET /today`
  - `POST /visit`
  - `POST /undo-visit`
  - `GET /tokens-per-hour`

## `backend/src/controllers/booking.controller.js`

- Status: Active core business logic
- Purpose: Validates booking requests, enforces booking limits, reserves a slot, assigns token type, generates the token, and inserts the token row.
- Main rules enforced:
  - Required field validation
  - Mobile, name, and QRC format validation
  - Duplicate QRC prevention
  - Per-mobile token limits
  - Per-device daily limit
  - Holiday/weekend checks for walk-in mode
  - Slot reservation through `slot.service.js`
  - Priority token type selection using `priority_rules` and `priority_districts`
- Database behavior: Wraps the full booking operation in an explicit transaction with `BEGIN`, `COMMIT`, and `ROLLBACK`.
- Safe edits: Validation rules, token-type branching, or new booking constraints.
- Be careful: This file is tightly coupled to database schema fields like `device_id`, `token_type`, `token_seq`, `visited`, and `distance_meters`.

## `backend/src/controllers/availability.controller.js`

- Status: Active
- Purpose: Keeps `daily_slots` rows present for future dates and returns appointment or walk-in availability.
- Main exports:
  - `getAvailability`
  - `getWalkinAvailability`
- Notable logic:
  - Skips weekends and declared holidays from appointment availability.
  - Pre-fills roughly 30 days of `daily_slots`.
  - Carries a limited number of unused appointment slots into walk-in after a time threshold and only once per day using `carry_forward_done`.
- Be careful: Business-hour comments and actual hour checks have drifted over time; always verify both code and user-facing text together.

## `backend/src/controllers/location.controller.js`

- Status: Active
- Purpose: Computes the distance between user coordinates and office coordinates and returns either `WALKIN` or `APPOINTMENT`.
- Dependencies: `geofence.js` and `constants.js`.
- Output: Returns both meters and rounded kilometers.

## `backend/src/controllers/admin.controller.js`

- Status: Active
- Purpose: Contains almost all admin operations and reporting.
- Main responsibilities:
  - Admin login
  - Calendar overview for nearby dates
  - Token list by selected date
  - Dashboard summary by mode, gender, age, service, district, and token type
  - Slot editing
  - Tokens-per-hour editing
  - Priority rule editing
  - Priority district add/remove
  - Holiday add/remove/list
  - Notice save/list/delete
- Reporting style: Uses nested SQLite queries and returns a single aggregated payload for the frontend dashboard.
- Watch-outs:
  - Debug logging is still present in login.
  - Some old endpoints are commented out rather than fully removed.
  - `getHolidays` currently returns only the next upcoming holiday because it uses `LIMIT 1`.

## `backend/src/controllers/guard.controller.js`

- Status: Active
- Purpose: Handles guard login and same-day queue operations.
- Main responsibilities:
  - Guard login against env-based credentials
  - Fetch today’s tokens
  - Mark a token as visited
  - Undo a visit within the allowed time window
  - Return today’s `tokens_per_hour`
- Queue behavior: Keeps recently visited rows visible for a short time window so the guard dashboard can still show them.
- Watch-outs:
  - Debug logging is still present for credentials and guard token visibility.
  - The undo window changed over time and is now ten minutes in active code.

## `backend/src/services/slot.service.js`

- Status: Active
- Purpose: Creates `daily_slots` rows if needed and atomically increments booked counts.
- Main exports: `reserveSlot`.
- Important behavior:
  - Uses `INSERT ... ON CONFLICT DO NOTHING` to ensure the day exists.
  - Uses a guarded `UPDATE` so a slot can only be booked if booked count is still below total count.
- Why it matters: This is the concurrency safety layer for overbooking prevention.

## `backend/src/services/token.service.js`

- Status: Active
- Purpose: Generates the final token string and daily sequence number.
- Main exports: `generateDailyToken`.
- Token format: `NNN-TYPE-AADHAARLAST4`.
- Counter behavior:
  - Ensures a `daily_token_counters` row exists.
  - Increments `last_token`.
  - Also increments token-type-specific counters such as `ap_count`, `wp_count`, `wl_count`, `al_count` , `an_count`and `wn_count`.
- Watch-outs:
  - This file contains a large amount of older commented token logic.
  - The implementation depends on SQLite supporting the `RETURNING` clause.

## `backend/src/models/db.js`

- Status: Active
- Purpose: Opens the SQLite database connection for the rest of the backend.
- Database file: `appointments.db` in the same folder.
- Side effect: Logs database path and connection success/failure.

## `backend/src/models/init.js`

- Status: Active bootstrap, but not auto-run
- Purpose: Defines the SQLite schema and indexes.
- Tables created:
  - `daily_slots`
  - `tokens`
  - `daily_token_counters`
  - `otp_verifications`
  - `holidays`
  - `priority_rules`
  - `priority_districts`
  - `notices`
- Indexes: Adds several token indexes plus a unique `(date, token_seq)` index.
- Change here when: New columns or tables are required.
- Be careful: If you create a new database file, this must be executed manually or wired into startup.

## `backend/src/middlewares/adminAuth.js`

- Status: Active
- Purpose: Rejects admin API calls unless `x-admin-token` matches the configured admin auth token.

## `backend/src/middlewares/guardAuth.js`

- Status: Active
- Purpose: Rejects guard API calls unless `x-guard-token` matches the configured guard token.

## `backend/src/middlewares/timeWindow.middleware.js`

- Status: Active but currently minimal
- Purpose: Normalizes current time to IST and then immediately calls `next()`.
- Practical meaning: It is a placeholder for booking-window enforcement rather than a true gate in its current form.

## `backend/src/utils/admin.config.js`

- Status: Active
- Purpose: Centralizes `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_AUTH_TOKEN` from environment variables.

## `backend/src/utils/guard.config.js`

- Status: Active
- Purpose: Centralizes `GUARD_USERNAME`, `GUARD_PASSWORD`, and `GUARD_TOKEN` from environment variables.

## `backend/src/utils/constants.js`

- Status: Active
- Purpose: Stores global business constants.
- Current values include:
  - Office latitude and longitude
  - Geofence radius
  - Default appointment and walk-in slot counts
  - Lookahead days

## `backend/src/utils/geofence.js`

- Status: Active
- Purpose: Implements Haversine-distance calculation in meters.
- Main export: `distanceMeters`.
