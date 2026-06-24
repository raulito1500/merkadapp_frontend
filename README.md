# Merkadapp

A personal grocery management and expense tracking SPA. Started as a practical solution for splitting shopping and expenses in a shared home — and used as a hands-on project to learn React from scratch.

Pairs with [merkadapp API](https://github.com/raulito1500/merkadapp) — Go + MongoDB backend.

## Stack

- **React 18** — functional components and hooks throughout
- **React Bootstrap** — responsive layout and UI components
- **Chart.js** / react-chartjs-2 — spending visualization
- **React Router DOM v6** — client-side routing
- **Context API** — global state for API client, loading state and notifications
- **Axios** — HTTP client
- **SASS** — custom styles layered on top of Bootstrap
- **React Testing Library** — unit tests

## Features

- **Dashboard** — budget summary widget and 6-month spending chart
- **Bills** — log grocery runs with itemized products, bags and taxes; select and merge related bills
- **Products** — catalog organized by category and purchase frequency
- **Market lists** — create manually or auto-generate from product purchase history; check off items live via WebSocket
- **Recommendations** — surfaces products due for restocking based on their configured repeat interval

## Screenshots

<!-- Add screenshots or a GIF of the app here -->

## Project structure

```
src/
├── App/
│   ├── Context/        # AppContext (Axios instance, loading, notifications), AuthContext
│   ├── layouts/        # MainLayout (with navbar), BlankLayout (full screen)
│   ├── Loader/
│   ├── AppNavbar/
│   └── Notifications/
├── components/         # Reusable: DataViewOptions, PageTitle
├── Constants/          # Category labels and domain-level constants
├── features/
│   └── market-list/    # Market list creation and suggested list flow
├── Pages/
│   ├── Bill/           # List, Edit
│   ├── MarketList/     # View, Widget
│   ├── Overview/       # Dashboard widgets (Budget, Chart, NextList, Welcome)
│   └── Product/        # List, BillHistory, Recommendations
└── utils/              # formatting, grouping, searching, sorting
```

## Local setup

**Prerequisites:** Node 18+ and the [merkadapp API](https://github.com/raulito1500/merkadapp) running on port `8080`

```bash
git clone https://github.com/raulito1500/merkadapp_frontend.git
cd merkadapp_frontend
npm install
npm start
```

Open `http://localhost:3000`. Use the demo credentials to log in:

| User | Username |
|------|----------|
| Raúl | `rau` |
| Manuel | `manu` |

### Environment variables

The API base URL is read from the environment:

```env
# .env.development
REACT_APP_URL_BASE=http://localhost:8080

# .env.production
REACT_APP_URL_BASE=https://your-api-url.com
```
