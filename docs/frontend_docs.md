# Frontend File Documentation

This document covers the active static frontend under `frontend/`.

## `frontend/index.html`

- Status: Active first page
- Purpose: Displays instruction-heavy consent content before a user can access the token portal.
- Main behavior: Stores `faqAccepted` and `faqDate` in `localStorage`, then redirects to `index2.html`.
- Edit here when: You need to change onboarding instructions, disclaimers, or consent wording.

## `frontend/index2.html`

- Status: Active home portal
- Purpose: Serves as the real entry page after consent.
- Main behavior:
  - Redirects back to `index.html` if daily consent is missing.
  - Shows appointment, walk-in, admin, and guard entry buttons.
  - Fetches `today-notice` and displays it.
  - Runs geolocation logic to decide walk-in access, especially after a time threshold.
- Watch-outs:
  - Contains inline JavaScript rather than a separate page script.
  - Uses hardcoded `http://localhost:5000` API URLs.

## `frontend/appointment.html`

- Status: Active
- Purpose: Renders the appointment booking calendar and applicant form.
- Main elements:
  - Calendar container
  - Availability info area
  - Applicant form
  - District and service selectors
  - QRC input
- Logic owner: `frontend/js/appointment.js`.

## `frontend/js/appointment.js`

- Status: Active
- Purpose: Loads appointment availability, handles date selection, validates input, and submits appointment requests.
- Main responsibilities:
  - Reads geofence distance from `localStorage`
  - Calls `/api/availability`
  - Disables or visually closes same-day booking after a cutoff
  - Validates name and mobile format
  - Builds the appointment payload
  - Posts to `/api/generate-token`
  - Stores `tokenData` in `localStorage` for the confirmation page
- Watch-outs:
  - The code contains a lot of historical commented versions.
  - Some comments say 10 AM while the active appointment gate also uses a 6 AM check in one helper, so changes should be tested carefully.

## `frontend/walkin.html`

- Status: Active
- Purpose: Renders the walk-in booking form and same-day slot information.
- Logic owner: `frontend/js/walkin.js`.
- Main difference from appointment flow: No calendar; booking is always for today.

## `frontend/js/walkin.js`

- Status: Active
- Purpose: Enforces walk-in rules, loads same-day walk-in availability, and submits walk-in token generation requests.
- Main responsibilities:
  - Reads stored geofence distance
  - Uses time-based logic to relax or enforce geofence checks
  - Calls `/api/walkin-availability`
  - Redirects to appointment flow when walk-in is full
  - Posts walk-in bookings to `/api/generate-token`
- Watch-outs:
  - Contains legacy commented blocks from older versions.
  - Calls `disableWalkinSubmit(...)` in one active holiday branch even though the active implementation mainly defines `disableWalkinForm(...)`; keep that in mind before refactoring.

## `frontend/confirmation.html`

- Status: Active final step
- Purpose: Displays the generated token slip, computes expected service time, and allows PDF download or printing.
- Main responsibilities:
  - Reads `tokenData` from `localStorage`
  - Calls `/api/admin/tokens-per-hour`
  - Splits the token for display formatting
  - Renders advisory text and app download links
  - Uses `html2pdf.bundle.min.js` for PDF export
- Watch-outs:
  - Deletes `tokenData` shortly after load.
  - Prevents back navigation with `history.pushState`.

## `frontend/admin-login.html`

- Status: Active
- Purpose: Simple admin login page.
- Main behavior:
  - Posts username and password to `/api/admin/login`
  - Saves `adminToken` to `localStorage`
  - Redirects to `admin.html`
- Watch-outs: Contains debug `console.log` statements for credentials and received token.

## `frontend/admin.html`

- Status: Active
- Purpose: Hosts the admin dashboard UI, calendar chooser, dashboard sections, token table, and action buttons.
- Logic owner: `frontend/js/admin.js`.
- Embedded styling: This page includes a large inline style block rather than using `frontend/css/style.css` alone.

## `frontend/js/admin.js`

- Status: Active
- Purpose: Drives the admin dashboard.
- Main responsibilities:
  - Enforces `adminToken` presence
  - Loads calendar overview from `/api/admin/calendar`
  - Loads date-specific token rows from `/api/admin/tokens`
  - Loads summary analytics from `/api/admin/dashboard`
  - Saves `tokens_per_hour`
  - Updates slot totals
  - Exports table data as CSV in the browser
  - Opens `priority-settings.html`
- UI behavior:
  - Colors rows by token type
  - Computes expected service times client-side
  - Draws a district chart with Chart.js
- Watch-outs:
  - Heavy coupling to the exact shape of the admin controller payload.
  - Mixed business logic and rendering logic in one large file.

## `frontend/guard-login.html`

- Status: Active
- Purpose: Simple guard login page.
- Main behavior:
  - Posts to `/api/guard/login`
  - Saves `guardToken` to `localStorage`
  - Redirects to `guard.html`
- Watch-outs: Also contains debug logging for credentials and received token.

## `frontend/guard.html`

- Status: Active
- Purpose: Hosts the current-day guard queue table.
- Logic owner: `frontend/js/guard.js`.
- Main display: Token rows, expected time, visited status, and visited-at timestamp.

## `frontend/js/guard.js`

- Status: Active
- Purpose: Loads the guard queue, marks residents as visited, and supports undo within the backend window.
- Main responsibilities:
  - Enforces `guardToken` presence
  - Loads tokens-per-hour for today
  - Loads `/api/guard/today`
  - Calls `/api/guard/visit`
  - Calls `/api/guard/undo-visit`
  - Computes expected service time in the browser
  - Offers client-side CSV export logic
- Watch-outs:
  - Includes large blocks of older commented code above the active implementation.
  - Depends on backend timestamps and the current undo window rule.

## `frontend/priority-settings.html`

- Status: Active admin sub-page
- Purpose: Renders forms for priority-rule editing, holiday management, notice management, and long-distance district maintenance.
- Logic owner: `frontend/js/priority-settings.js`.

## `frontend/js/priority-settings.js`

- Status: Active
- Purpose: Drives the priority-settings admin page.
- Main responsibilities:
  - Enforces `adminToken`
  - Loads current priority rules and configured districts
  - Saves rule changes
  - Adds or removes long-distance districts
  - Loads, adds, and removes holidays
  - Loads, saves, and removes notices
- Watch-outs:
  - Contains duplicate historical implementations in comments.
  - Assumes the admin API returns a specific `rules` and `districts` structure.

## `frontend/css/style.css`

- Status: Active shared stylesheet
- Purpose: Provides the general visual system for citizen-facing pages and some login/admin pages.
- Main coverage:
  - Government header styling
  - FAQ/onboarding layout
  - Calendar day styling
  - Forms and buttons
  - Slip styling
  - Priority page layout
- Edit here when: You want a site-wide style change outside of `admin.html` and `guard.html`, which also use inline page-level CSS.

## `frontend/js/location.js`

- Status: Unwired helper
- Purpose: An older standalone location-check script for geolocation-based access control.
- Current state: No active page in the inspected frontend references this file.
- Recommendation: Treat it as a parked utility unless you deliberately rewire it.

## `frontend/js/chart.min.js`

- Status: Active vendor file
- Purpose: Bundled Chart.js library used by `frontend/js/admin.js`.
- Recommendation: Do not edit manually; replace by upgrading the vendor asset if needed.

## `frontend/js/html2pdf.bundle.min.js`

- Status: Active vendor file
- Purpose: Bundled HTML-to-PDF library used by `frontend/confirmation.html`.
- Recommendation: Do not edit manually; replace with a fresh vendor bundle when upgrading.

