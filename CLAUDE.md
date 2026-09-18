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

Run a single test file: `npm test -- src/utils/formatting.test.js` (interactive watch mode — press `p` to filter by filename, or pass `-- --watchAll=false` for a single run).

The app expects two backends running locally: [merkadapp API](https://github.com/raulito1500/merkadapp) (Go, port 8080) for bills/products/market lists, and [merkadapp expenses API](https://github.com/raulito1500/merkadapp_expenses-api) (NestJS) for expenses/groups. Login requires a real Firebase Authentication account for the project's Firebase config in `.env.development`.

## Architecture

The app is a single Firebase-hosted SPA (`HashRouter`) that talks to **two independent backends over two separate Axios instances** — there is no BFF or shared gateway.

- **`src/App/Context/app.js`** (`AppContext`/`AppProvider`) — owns an Axios instance for the merkadapp Go API (bills, products, market lists), plus global `loading` state and the `notifications` queue (`pushNotifications(title, error, type)`). Note there's also a module-level `api` instance exported from `src/App/Context/api.js` with a `useGetApi(url)` hook; both point at `REACT_APP_URL_BASE` but are separate instances — check which one a file imports before assuming shared state. Both instances attach a Firebase ID token via a request interceptor, same pattern as `expensesApi.js`.
- **`src/App/Context/expensesApi.js`** — a second Axios instance (`REACT_APP_EXPENSES_URL_BASE`) for the expenses API. It attaches a Firebase ID token via a request interceptor (`Authorization: Bearer <token>`); both backends now require this token (the Go API verifies it via `middleware/firebase_auth.go` in that repo, except for its `/ws` route, which stays open since a browser WebSocket handshake can't carry a bearer header).
- **`src/App/Context/auth.js`** (`AuthContext`/`AuthProvider`) — owns the Firebase session (email/password + Google sign-in via `signInWithPopup`), gates the entire router: if unauthenticated, it renders `<Login />` in place of `children` rather than redirecting.
- **`src/App/App.js`** — route table. Routes are split between two shells:
  - `MainLayout` (navbar + `Outlet`, `AppNavbar` fixed to the bottom) for the primary authenticated pages (`/`, `/products`, `/bills`, `/expenses`).
  - `BlankLayout` (full-screen, no navbar) for create/edit/detail flows (`/bills/create`, `/market-list/*`, `/expenses/:groupId`, etc.) and `/login`.
- Most domains live as `src/Pages/<Domain>/` with `List`/`Create`/`Edit`/`View` subfolders (`Bill`, `Expense`, `Group`, `Login`, `MarketList`, `Overview`, `Product`). The market list *creation* flow is complex enough (blank vs. suggested-from-history, item-by-item selection) to live under `src/features/market-list/` instead, organized by behavior rather than by page.
- `src/components/` holds cross-domain shared UI (e.g. `NumberPicker`, `PageTitle`, `DataViewOptions`). Note there is a second `NumberPicker` under `src/utils/NumberPicker/` — an older duplicate; prefer the one in `components/` for new work and check both before assuming there's only one.
- `src/utils/` holds pure helpers grouped by concern: `formatting.js`, `grouping.js`, `searching.js`, `sorting.js`, `userDisplay.js`.
- `src/Constants/constants.js` holds shared constants such as category labels.

## Conventions

- All user-facing copy (labels, buttons, error messages) must be in **English**, even though project discussion happens in Spanish.
- Errors surface through `pushNotifications(title, error, type)` (from `AppContext`) rather than inline error UI — it reads `error.response.data.message` when present, falling back to `error.message`.
- Page components pull their backend client from context (`useContext(AppContext).api` or the imported `expensesApi`) rather than instantiating Axios per-component.
- Tests use React Testing Library + Jest (via `react-scripts test`), colocated as `index.test.js` next to the component/util they cover. `src/setupTests.js` wires up `@testing-library/jest-dom`.
- Whenever a change affects what's documented in `README.md` (stack, architecture, features, setup steps, "Where to find things"), update `README.md` in the same change. The README is never a full dump of directories or every feature — keep it a high-level reference, not exhaustive documentation.
