# ✦ SEP — Student Event Participation

> A full-stack campus event platform: **Discover → Create an account → Register → Participate → Track your journey.**

[![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](#)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)](#)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111)](#)

## ✨ What is SEP?

SEP is a student event participation platform for discovering campus events, creating student accounts, registering for events and tracking participation.

The interface intentionally uses **different visual directions on different pages** instead of repeating one template:

| Page | Visual direction |
|---|---|
| 🏠 Home | Warm editorial / orange + cobalt |
| ✦ Events | Dark experimental / neon lime |
| ◌ About | Editorial / paper + serif |
| → Sign in | Minimal monochrome / acid lime |
| ▣ Dashboard | Data-focused campus trail |
| ⚡ Admin | Dark control room / neon lime |

## 🚀 What works now?

### Student experience

- Create a student account
- Secure password hashing with bcrypt
- Sign in with JWT authentication
- Browse live events from the database
- Search events
- Filter by Tech / Culture / Sports
- See remaining capacity
- Register for an event
- Prevent duplicate registration
- Cancel a registration
- View a personal participation dashboard
- Log out

### Admin experience

- Admin account is seeded from environment variables
- Create events
- View recent registrations
- Admin-only API protection
- Admin link appears automatically for admin users

### Backend

- REST API built with Express
- SQLite persistence
- Foreign-key relationships
- Unique registration constraint
- Capacity validation
- Helmet security headers
- Authentication rate limiting
- JWT sessions
- Environment-based secrets
- API health endpoint

## 🧱 Architecture

    Browser
       │
       ▼
    HTML / CSS / Vanilla JS
       │
       ▼
    Express REST API
       │
       ├── JWT Authentication
       ├── Event Service
       ├── Registration Service
       └── Admin APIs
       │
       ▼
    SQLite Database

## 🛠️ Dependencies

You need:

- **Node.js 20+**
- **npm**
- A modern browser

The backend dependencies are installed from `package.json`:

- Express
- better-sqlite3
- bcryptjs
- jsonwebtoken
- dotenv
- helmet
- express-rate-limit

No global npm package is required.

## 🚀 Run locally

### 1. Clone the repository

    git clone https://github.com/vishwadevgupta/EVENTPARTICIPATION.git
    cd EVENTPARTICIPATION

### 2. Install dependencies

    npm install

This creates `node_modules/` locally. It is intentionally ignored by Git.

### 3. Configure environment variables

Copy the example file:

**macOS / Linux**

    cp .env.example .env

**Windows PowerShell**

    Copy-Item .env.example .env

Then edit `.env`:

    PORT=3000
    JWT_SECRET=replace-with-a-long-random-secret
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=change-this-password
    DB_FILE=./data/sep.db

Use a long, random value for `JWT_SECRET`.

Do **not** commit `.env`.

### 4. Start the application

Production-style:

    npm start

Development mode with Node's watch mode:

    npm run dev

You should see:

    SEP running at http://localhost:3000

### 5. Open SEP

Open:

    http://localhost:3000/

**When should you use localhost?**

Only when the application is running on your own computer. `localhost` means your computer; it is not a public/live URL.

The backend and frontend use the same port, so you do **not** need a separate frontend server.

## 🗄️ Database

SQLite is created automatically on first startup.

The default database file is:

    data/sep.db

The application automatically creates:

- `users`
- `events`
- `registrations`

It also seeds the initial sample events.

You do not need to manually create tables.

## 👤 Create a student account

Open:

    http://localhost:3000/Signin.html

Choose **Create account**, then enter:

- Name
- Email
- Password of at least 8 characters

After creating the account, sign in and you can register for events.

## ⚡ Admin access

The admin account is created from:

    ADMIN_EMAIL
    ADMIN_PASSWORD

in your local `.env`.

Example:

    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=change-this-password

Restart the server after changing these values.

Sign in using those credentials. The dashboard will expose the **Admin** link for an admin user.

Admin page:

    http://localhost:3000/admin.html

## 🔌 API

### Health

    GET /api/health

### Events

    GET /api/events
    GET /api/events/:id

Optional query parameters:

    /api/events?category=tech
    /api/events?q=forum
    /api/events?category=sports&q=cup

### Authentication

    POST /api/auth/register
    POST /api/auth/login
    GET  /api/me

### Student participation

    GET    /api/my/registrations
    POST   /api/events/:id/register
    DELETE /api/events/:id/register

### Admin

    POST /api/events
    GET  /api/admin/registrations

Protected endpoints require:

    Authorization: Bearer <JWT>

## 📁 Project structure

    EVENTPARTICIPATION/
    ├── index.html
    ├── home.css
    ├── services.html
    ├── services.css
    ├── about.html
    ├── about.css
    ├── Signin.html
    ├── signin.css
    ├── dashboard.html
    ├── dashboard.css
    ├── admin.html
    ├── admin.css
    ├── api.js
    ├── app.js
    ├── server.js
    ├── db.js
    ├── package.json
    ├── .env.example
    ├── .gitignore
    └── README.md

## 🔐 Security notes

This project includes practical baseline protections:

- Passwords are hashed with bcrypt.
- Passwords are never returned by the API.
- JWTs expire after 2 hours.
- Admin APIs require the admin role.
- Registration duplicates are prevented at the database level.
- Event capacity is checked before registration.
- Helmet adds security headers.
- Authentication endpoints are rate-limited.
- Secrets are loaded from environment variables.
- `.env` and SQLite database files are ignored by Git.

For production, use HTTPS, a managed secret store, a production database, stronger operational logging, backups, CSRF strategy where applicable, and a mature session/token architecture.

## 🧪 Quick test checklist

After starting the app:

1. Open Home.
2. Open Explore Events.
3. Search for an event.
4. Filter by category.
5. Create a student account.
6. Sign in.
7. Register for an event.
8. Open My Participation.
9. Cancel a registration.
10. Sign in as admin.
11. Create an event from Admin.
12. Confirm it appears in Explore Events.

## 🌐 Deployment

The application is now a **Node.js full-stack app**, so GitHub Pages alone cannot host the backend.

Suitable deployment options include:

- Render
- Railway
- Fly.io
- AWS
- Azure
- Google Cloud
- Any VPS/container platform supporting Node.js

For production deployment, use environment variables for secrets and use a persistent database/storage strategy.

## 🔮 Future upgrades

Good next steps include:

- Email verification
- Password reset
- Event images
- Attendance QR codes
- Calendar integration
- Organizer roles
- Event editing/deletion
- Pagination
- Analytics dashboard
- PostgreSQL for production
- Automated tests
- CI/CD deployment

## 📌 Status

**Frontend:** Modernized  
**Responsive:** Yes  
**Backend:** Express REST API  
**Database:** SQLite  
**Authentication:** JWT + bcrypt  
**Event registration:** Working  
**Student dashboard:** Working  
**Admin console:** Working  
**API protection:** Working  
**Public deployment:** Not currently configured

## 📄 License

No license is currently declared. Add a license before distributing the project publicly.
