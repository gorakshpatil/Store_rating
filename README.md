# RateIt — Store Rating Platform

A full-stack web application for rating stores. Built with **Node.js/Express**, **MySQL/Sequelize**, and **React**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js |
| Database | MySQL + Sequelize ORM |
| Frontend | React 18 + React Router v6 |
| Auth | JWT (JSON Web Tokens) |
| Validation | express-validator (backend), inline (frontend) |

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth + validators
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # Express routers
│   │   └── index.js       # App entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/           # Axios API calls
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   └── pages/         # Page components
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** v16+ → https://nodejs.org
- **MySQL** 8.0+ → https://dev.mysql.com/downloads/installer/
- **npm** (comes with Node.js)

---

## Setup Instructions

### 1. Install MySQL
Download MySQL Community Server from https://dev.mysql.com/downloads/installer/
- During setup, set a root password — remember it
- Make sure MySQL service is running

### 2. Create the Database

Open MySQL terminal or MySQL Workbench and run:

```sql
CREATE DATABASE store_rating_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or via command line:
```bash
mysql -u root -p -e "CREATE DATABASE store_rating_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_db
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
JWT_SECRET=change_this_to_any_long_random_string
NODE_ENV=development
```

Start the backend:
```bash
npm run dev      # Development (with auto-reload)
# or
npm start        # Production
```

You should see:
```
Executing (default): SELECT 1+1 AS result
Database synced
Server running on port 5000
```

### 4. Frontend Setup

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

The app opens at **http://localhost:3000**

---

## Create Your First Admin User

### Step 1 — Register at http://localhost:3000/register
Fill in the form (note: name must be 20–60 characters, e.g. *"System Administrator User"*)

### Step 2 — Promote to admin via MySQL

```bash
mysql -u root -p store_rating_db -e "UPDATE users SET role = 'admin' WHERE email = 'your@email.com';"
```

Or in MySQL Workbench:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Log in again — you'll be redirected to the Admin Dashboard.

---

## User Roles & Access

| Role | Access |
|------|--------|
| **Admin** | Dashboard stats, manage users & stores, view all details |
| **Normal User** | Browse & search stores, submit/edit ratings, update password |
| **Store Owner** | View own store dashboard with ratings breakdown, update password |

---

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | Min 20, Max 60 characters |
| Email | Standard email format |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Address | Max 400 characters |
| Rating | Integer 1–5 |

---

## API Endpoints

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| PUT | `/api/auth/update-password` | Authenticated |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | List users (filterable + sortable) |
| GET | `/api/admin/users/:id` | User detail |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/stores` | List stores (filterable + sortable) |
| POST | `/api/admin/stores` | Create store |

### Stores (Normal User)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stores` | List stores with user's rating |
| POST | `/api/stores/:id/rate` | Submit or update rating |

### Owner
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/owner/dashboard` | Store stats + raters list |

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `ER_ACCESS_DENIED_ERROR` | Wrong DB_USER or DB_PASSWORD in `.env` |
| `ER_BAD_DB_ERROR` | Database not created yet — run the CREATE DATABASE command |
| Port 5000 in use | Change `PORT=5001` in `.env` and update `frontend/package.json` proxy to `http://localhost:5001` |
| `npm install` fails | Ensure Node.js is v16+ (`node -v`) |
| MySQL not found | Add MySQL `bin` to your system PATH |

---

## Features

- ✅ Role-based access control (Admin / Normal User / Store Owner)
- ✅ JWT authentication with auto-redirect on token expiry
- ✅ User registration with full validation
- ✅ Admin dashboard with total users/stores/ratings counters
- ✅ Admin: create users (all roles) and stores
- ✅ Admin: filterable + sortable tables
- ✅ Admin: user detail view (with store rating for owners)
- ✅ Normal user: browse & search stores by name and address
- ✅ Normal user: submit and modify star ratings (1–5)
- ✅ Store owner: dashboard with average rating + all raters
- ✅ All tables support ascending/descending sort
- ✅ Password update for all authenticated users
- ✅ One rating per user per store (enforced at DB level)
