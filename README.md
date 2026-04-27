# Habit Tracker PWA

## Project Overview
Habit Tracker is a mobile-first Progressive Web App built with Next.js App Router, React, TypeScript, and Tailwind CSS. It supports local signup and login, habit creation and editing, streak tracking, local persistence with `localStorage`, and basic offline app-shell support through a service worker.

## Setup Instructions
1. Install dependencies with `npm install`.
2. Use Node.js 20 or newer for best compatibility with the current toolchain.

## Run Instructions
- Start the development server with `npm run dev`.
- Create a production build with `npm run build`.
- Start the production server with `npm run start`.

## Test Instructions
- Run unit tests with coverage using `npm run test:unit`.
- Run integration tests using `npm run test:integration`.
- Run end-to-end tests using `npm run test:e2e`.
- Run the full suite using `npm run test`.

## Local Persistence Structure
The app uses deterministic browser `localStorage` keys only.

- `habit-tracker-users`: JSON array of users with `id`, `email`, `password`, and `createdAt`
- `habit-tracker-session`: active session object with `userId` and `email`, or no key when logged out
- `habit-tracker-habits`: JSON array of habits with `id`, `userId`, `name`, `description`, `frequency`, `createdAt`, and `completions`

All persistence is local to the browser. There is no remote backend, database, or external authentication provider in this stage.

## PWA Implementation
PWA support is implemented with:

- `public/manifest.json` for install metadata, colors, start URL, and icons
- `public/sw.js` for service worker registration and app-shell caching
- client-side registration through `src/components/shared/ServiceWorkerRegistration.tsx`

The service worker caches core app-shell routes and static assets so the shell can still load after the app has been visited once, even when offline.

## Trade-offs And Limitations
- Authentication is local-only and not secure for production use because credentials are stored in browser `localStorage`.
- Habit data is device- and browser-specific because there is no synced backend.
- Offline support is intentionally minimal for this stage and focuses on cached shell loading rather than full offline data mutation flows.
- Session validity is checked against stored users, but any user-data reset will invalidate the session locally.

## Test File Mapping
- `tests/unit/slug.test.ts`: verifies habit slug generation rules
- `tests/unit/validators.test.ts`: verifies habit-name validation behavior
- `tests/unit/streaks.test.ts`: verifies current-streak calculation behavior
- `tests/unit/habits.test.ts`: verifies habit completion toggling behavior
- `tests/unit/auth.test.ts`: verifies local auth helper behavior
- `tests/unit/storage.test.ts`: verifies storage helper read and write behavior
- `tests/integration/auth-flow.test.tsx`: verifies signup and login form flows
- `tests/integration/habit-form.test.tsx`: verifies create, edit, delete, validation, and completion UI flows
- `tests/e2e/app.spec.ts`: verifies route protection, auth, dashboard behavior, persistence, logout, and offline app-shell loading
