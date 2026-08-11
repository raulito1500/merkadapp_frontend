# Merkadapp

A personal grocery management and expense tracking SPA. Started as a practical solution for splitting shopping and expenses in a shared home — and used as a hands-on project to learn React from scratch.

**Live:** [merkadapp-638bb.web.app](https://merkadapp-638bb.web.app)

Pairs with two backends:
- [merkadapp API](https://github.com/raulito1500/merkadapp) — Go + MongoDB, powers bills, products and market lists
- [merkadapp expenses API](https://github.com/raulito1500/merkadapp_expenses-api) — NestJS + MongoDB, powers shared/personal expenses and groups

## Stack

- **React 18** — functional components and hooks throughout
- **React Bootstrap** — responsive layout and UI components
- **React Bootstrap Typeahead** — tag-style input for group members
- **Chart.js** / react-chartjs-2 — spending visualization
- **React Router DOM v6** — client-side routing (`HashRouter`)
- **Context API** — global state for the API clients, auth, loading state and notifications
- **Axios** — HTTP client (separate instances for each backend)
- **Firebase Authentication** — email/password and Google sign-in
- **SASS** — custom styles layered on top of Bootstrap
- **React Testing Library** — unit tests

## Architecture

The app is a single Firebase-hosted SPA that talks to two independent backends over separate Axios instances — there's no BFF or shared gateway between them.

```
Firebase Auth ──▶ AuthContext ──┐
                                 ▼
                          Context Providers        ┌─▶ merkadapp API (bills, products, market lists)
                       (Auth, Axios ×2, Loader,     │
                        Notifications)  ──▶ Router ─┤
                                 │                   └─▶ merkadapp expenses API (expenses, groups)
                                 ▼
                    MainLayout / BlankLayout ──▶ Pages / features
```

- `AuthContext` owns the Firebase session (email/password + Google sign-in) and gates the router.
- `AppContext` and a second, separate Axios client each hold the base URL and auth headers for one backend — the merkadapp Go API and the expenses API respectively — so a page only imports the client for the backend it needs.
- `HashRouter` renders every route inside `MainLayout` (navbar + auth-gated pages) or `BlankLayout` (login, full-screen views).
- Most domains live as a `Pages/<Domain>` folder (List/Create/Edit views); the market list creation flow is complex enough to live under `features/market-list` instead, grouped by behavior rather than by page.

## Features

- **Login** — Firebase Authentication (email/password or Google sign-in); session persisted by the Firebase SDK
- **Dashboard** — budget summary widget and 6-month spending chart
- **Bills** — log grocery runs with itemized products, bags and taxes; select and merge related bills
- **Products** — catalog organized by category and purchase frequency
- **Market lists** — create manually or auto-generate from product purchase history; check off items live via WebSocket
- **Recommendations** — surfaces products due for restocking based on their configured repeat interval
- **Expenses** — personal and group expense tracking against the new expenses API:
  - **Personal** — log personal expenses and move them into a group later
  - **Groups** — create groups with typeahead member entry, view group expenses, and see a per-member balance summary
  - move any expense between groups (or back to personal) after the fact

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login page](docs/screenshots/login-page.png) | ![Overview dashboard](docs/screenshots/overview-page.png) |

| Bills | Market list |
|---|---|
| ![Bills list](docs/screenshots/bills-view.png) | ![Market list view](docs/screenshots/marketlist-view.png) |

## Where to find things

| Looking for... | Go to |
|---|---|
| Firebase auth state, API clients (Axios), loading/notifications | `src/App/Context/` |
| Route shells (navbar vs. full-screen) | `src/App/layouts/` |
| Navbar, login/logout, user avatar menu | `src/App/AppNavbar/` |
| A specific domain's pages (List/Create/Edit) | `src/Pages/<Domain>/` — `Bill`, `Expense`, `Group`, `Login`, `MarketList`, `Overview`, `Product` |
| Market list creation / suggested-list flow | `src/features/market-list/` |
| Shared UI components | `src/components/` |
| Category labels and other constants | `src/Constants/` |
| Formatting, grouping, searching, sorting helpers | `src/utils/` |

## Getting Started

**Prerequisites:** Node 18+, the [merkadapp API](https://github.com/raulito1500/merkadapp) running on port `8080`, and the [merkadapp expenses API](https://github.com/raulito1500/merkadapp_expenses-api) for the Expenses section

```bash
git clone https://github.com/raulito1500/merkadapp_frontend.git
cd merkadapp_frontend
npm install
npm start
```

Open `http://localhost:3000`. The repo ships a working `.env.development` pointing at both backends on `localhost` and at the project's Firebase config, so this runs out of the box as long as the two backends are also running locally.

`.env.example` documents every variable the app reads — the base URL for each backend, plus the Firebase web app config (API key, auth domain, project ID, app ID) used to initialize Firebase Authentication. Use it as the reference if you need to point at a different backend or a different Firebase project; new values can be sourced from that Firebase project's console under **Project settings → General → Your apps**.

Login requires a real Firebase Authentication account for that project — create a user (email/password) in the console, or sign in with Google.

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — free to use, copy, modify and distribute for noncommercial purposes (personal, educational, portfolio). Commercial use requires permission from the author.
