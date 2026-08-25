# Expense Tracker — MERN Stack

Full-stack expense tracker: **MongoDB + Express + React + Node.js**, with JWT auth, Tailwind CSS, Chart.js, and Axios.

## 📁 Folder Structure

```
expense-tracker/
├── backend/
│   ├── models/        # Mongoose schemas (User, Transaction, Budget, Savings)
│   ├── routes/        # Express routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # JWT auth middleware
│   ├── server.js      # Express entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/         # Login, Signup, Dashboard, Transactions, Budget, Savings, Settings
    │   ├── components/    # Sidebar, StatCard, Modals, ProtectedRoute
    │   ├── context/       # AuthContext, ThemeContext
    │   ├── api/           # Axios instance
    │   └── utils/
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 🚀 Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # then edit MONGO_URI and JWT_SECRET
npm run dev
```

Server runs at `http://localhost:5000`.

### `.env` keys

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/expense-tracker
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

> The frontend reads `VITE_API_URL` from `frontend/.env` (defaults to `http://localhost:5000/api`).

## 🔐 API Routes

All `/api/*` routes except auth require `Authorization: Bearer <token>`.

### Auth
| Method | Route | Body |
|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` |
| POST | `/api/auth/login`  | `{ email, password }` |
| GET  | `/api/auth/me`     | — |

### Profile / Settings
| Method | Route | Body |
|---|---|---|
| GET   | `/api/profile` | — |
| PUT   | `/api/profile` | `{ name, dob, gender, currency, timezone, theme }` |
| GET   | `/api/profile/export` | — (returns JSON dump) |
| DELETE| `/api/profile/reset`  | — (wipes user data) |

### Transactions
| Method | Route |
|---|---|
| GET    | `/api/transactions?type=&from=&to=` |
| POST   | `/api/transactions` |
| PUT    | `/api/transactions/:id` |
| DELETE | `/api/transactions/:id` |
| GET    | `/api/transactions/summary` (totals for dashboard) |

### Budgets
| Method | Route |
|---|---|
| GET    | `/api/budgets` |
| POST   | `/api/budgets` |
| PUT    | `/api/budgets/:id` |
| DELETE | `/api/budgets/:id` |

### Savings
| Method | Route |
|---|---|
| GET    | `/api/savings?type=` |
| POST   | `/api/savings` |
| DELETE | `/api/savings/:id` |

## 🎨 Features

- JWT auth with bcrypt password hashing
- Per-user data isolation (every query scoped to `req.user.id`)
- Dashboard stat cards + Chart.js donut chart
- Transactions: filter, add, edit, delete
- Budgets: progress bars, auto-linked to expenses by category
- Savings: deposits/withdrawals, totals
- Settings: profile, currency (₹ default), light/dark mode, JSON export, reset
- Toasts via `react-hot-toast`, loading spinners, form validation
- Responsive sidebar layout

## 💡 Notes

- Default currency is **₹ (INR)** with `en-IN` formatting.
- Dark mode toggled via Tailwind `class` strategy + `ThemeContext`.
