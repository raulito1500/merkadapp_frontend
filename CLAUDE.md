# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Merkadapp is a personal grocery management and expense tracking SPA, built with Create React App (`react-scripts`). It's a hands-on learning project as much as a working app, so favor straightforward, idiomatic React over clever abstractions.

## Commands

```bash
npm start          # dev server at localhost:3000 (uses .env.development, which points at both backends on localhost out of the box)
npm run build       # production build
npm test             # jest via react-scripts, watch mode by default
npm run test:watch  # explicit watch mode
```

Run a single test file: `npm test -- src/shared/utils/formatting.test.js` (interactive watch mode — press `p` to filter by filename, or pass `-- --watchAll=false` for a single run).

The app expects two backends running locally: [merkadapp API](https://github.com/raulito1500/merkadapp) (Go, port 8080) for bills/products/market lists, and [merkadapp expenses API](https://github.com/raulito1500/merkadapp_expenses-api) (NestJS) for expenses/groups. Login requires a real Firebase Authentication account for the project's Firebase config in `.env.development`.

## Architecture

The app is a single Firebase-hosted SPA (`HashRouter`) that talks to **two independent backends over two separate Axios instances** — there is no BFF or shared gateway.

- **`src/lib/apiClient.js`** — module-level Axios instance (`api`) for the merkadapp Go API (bills, products, market lists, `REACT_APP_URL_BASE`). It attaches a Firebase ID token via a request interceptor. Pages don't import it directly; they get it through `AppContext`.
- **`src/lib/expensesApiClient.js`** — a second Axios instance (`expensesApi`, `REACT_APP_EXPENSES_URL_BASE`) for the expenses API, imported directly by pages. It attaches a Firebase ID token the same way (`Authorization: Bearer <token>`); both backends now require this token (the Go API verifies it via `middleware/firebase_auth.go` in that repo, except for its `/ws` route, which stays open since a browser WebSocket handshake can't carry a bearer header). `src/lib/firebase.js` holds the Firebase app/auth setup both clients and `AuthProvider` use.
- **`src/app/providers/app.js`** (`AppContext`/`AppProvider`) — exposes the `api` client from `lib/apiClient.js`, plus global `loading` state and the `notifications` queue (`pushNotifications(title, error, type)`).
- **`src/app/providers/auth.js`** (`AuthContext`/`AuthProvider`) — owns the Firebase session (email/password + Google sign-in via `signInWithPopup`), gates the entire router: if unauthenticated, it renders `<Login />` in place of `children` rather than redirecting.
- **`src/app/App.js`** — route table. Routes are split between two shells (in `src/app/layouts/`):
  - `MainLayout` (navbar + `Outlet`, `AppNavbar` fixed to the bottom) for the primary authenticated pages (`/`, `/products`, `/bills`, `/expenses`).
  - `BlankLayout` (full-screen, no navbar) for create/edit/detail flows (`/bills/create`, `/market-list/*`, `/expenses/:groupId`, etc.) and `/login`.
- Most domains live as `src/pages/<Domain>/` with `List`/`Create`/`Edit`/`View` subfolders (`Bill`, `Expense`, `Group`, `Login`, `MarketList`, `Overview`, `Product`). The market list *creation* flow is complex enough (blank vs. suggested-from-history, item-by-item selection) to live under `src/features/market-list/` instead, organized by behavior rather than by page.
- `src/shared/components/` holds cross-domain shared UI (`NumberPicker`, `PageTitle`, `DataViewOptions`, `Avatar`, `CustomToggle`).
- `src/shared/utils/` holds pure helpers grouped by concern: `formatting.js`, `grouping.js`, `searching.js`, `sorting.js`, `settlements.js`, `userDisplay.js`.
- `src/shared/constants/constants.js` holds shared constants such as category labels.

## Conventions

- All user-facing copy (labels, buttons, error messages) must be in **English**, even though project discussion happens in Spanish.
- Errors surface through `pushNotifications(title, error, type)` (from `AppContext`) rather than inline error UI — it reads `error.response.data.message` when present, falling back to `error.message`.
- Page components pull their backend client from context (`useContext(AppContext).api` or the imported `expensesApi`) rather than instantiating Axios per-component.
- Tests use React Testing Library + Jest (via `react-scripts test`), colocated as `index.test.js` next to the component/util they cover. `src/setupTests.js` wires up `@testing-library/jest-dom`.
- Whenever a change affects what's documented in `README.md` (stack, architecture, features, setup steps, "Where to find things"), update `README.md` in the same change. The README is never a full dump of directories or every feature — keep it a high-level reference, not exhaustive documentation.
