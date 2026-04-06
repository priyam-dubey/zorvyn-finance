# Zorvyn Finance Dashboard

A Finance Dashboard UI built with React + Vite as a frontend developer internship assignment.

## Tech Stack

- **React 18** — UI framework
- **Vite** — build tool & dev server
- **Chart.js + react-chartjs-2** — data visualizations
- **CSS Modules** — scoped component styling
- **React Context + useReducer** — global state management
- **localStorage** — data persistence

## Features

- **Dashboard Overview** — Summary cards, balance trend chart, spending donut, monthly bar chart
- **Transactions** — Searchable, filterable, sortable transaction list
- **Role-Based UI** — Admin (add transactions) vs Viewer (read-only) via dropdown
- **Insights** — Top category, month-over-month, savings rate, category ranking chart
- **Export** — Download transactions as CSV
- **Persistence** — Data saved to localStorage across sessions

## Project Structure

```
src/
├── components/
│   ├── Topbar.jsx / .module.css
│   ├── Navbar.jsx / .module.css
│   ├── Overview.jsx
│   ├── SummaryCards.jsx / .module.css
│   ├── Charts.jsx / .module.css
│   ├── TransactionsTable.jsx / .module.css
│   ├── AddTransactionModal.jsx / .module.css
│   ├── Insights.jsx / .module.css
│   └── Notification.jsx / .module.css
├── context/
│   └── AppContext.jsx        # Global state (Context + useReducer)
├── data/
│   └── transactions.js       # Mock data & constants
├── hooks/
│   ├── useStats.js           # Computed financial statistics
│   └── useNotification.js    # Toast notification hook
├── App.jsx
├── App.module.css
├── main.jsx
├── index.css                 # Global CSS variables & resets
└── utils.js                  # Formatting & CSV export helpers
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Role Switching

Use the **Role** dropdown in the top-right to switch between:
- **Admin** — Can add new transactions via the "+ Add Transaction" button
- **Viewer** — Read-only mode, add button is hidden
