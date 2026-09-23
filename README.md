# ✦ SEP — Student Event Participation

> A refreshed student event experience built around one idea: **Discover → Choose → Register → Participate.**

[![HTML](https://img.shields.io/badge/HTML5-Ready-E34F26?logo=html5&logoColor=white)](#)
[![CSS](https://img.shields.io/badge/CSS3-Responsive-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111)](#)

## ✨ What is SEP?

SEP is a front-end concept for student event participation. It helps students discover campus activities, browse events by category, and move toward registration through a clean, responsive interface.

The original repository was created with StackBlitz. This version has been redesigned from the ground up with separate visual directions for the home, events, about and sign-in experiences.

## 🎨 Design direction

The pages intentionally **do not use one repeated theme**:

| Page | Visual direction |
|---|---|
| 🏠 Home | Warm editorial / orange + cobalt |
| ✦ Events | Dark experimental / neon lime |
| ◌ About | Editorial / paper + serif typography |
| → Sign in | Minimal monochrome / acid-lime accent |

This keeps the product feeling like a designed experience rather than four copies of the same template.

## 🧩 Current features

- Responsive navigation
- Mobile menu
- Featured event cards
- Event category filtering
- Responsive event catalogue
- Client-side sign-in validation
- Accessible labels and navigation
- Responsive layouts for smaller screens
- No framework or build step required

## ⚠️ Backend status

This repository is currently **front-end only**.

The sign-in form is a UI/demo flow. It does **not** authenticate users, store passwords, create accounts or save registrations.

A real backend would be required for:

- Student authentication
- User profiles
- Event creation
- Event registration
- Attendance
- Participation history
- Admin/event-organizer access

## 🛠️ Dependencies

There are no npm packages required for the current version.

### Required

- A modern web browser
- Optional: Python 3 for a local development server

### External resource

The CSS uses Google Fonts through fonts.googleapis.com. An internet connection is therefore recommended for the intended typography.

## 🚀 Run locally

### Option 1 — Open the page directly

Clone the repository:

    git clone https://github.com/vishwadevgupta/EVENTPARTICIPATION.git
    cd EVENTPARTICIPATION

Then open index.html in your browser.

### Option 2 — Recommended: local server

If Python 3 is installed:

    python -m http.server 5500

Then open:

    http://localhost:5500/

**When should you use the localhost link?**

Only while the project is running on your own computer. localhost means your computer; it is not a public deployment URL.

### Option 3 — VS Code

1. Open the repository in VS Code.
2. Install the Live Server extension.
3. Right-click index.html.
4. Select Open with Live Server.
5. Open the URL shown by VS Code.

## 📁 Project structure

    EVENTPARTICIPATION/
    ├── index.html
    ├── home.css
    ├── app.js
    ├── services.html
    ├── services.css
    ├── about.html
    ├── about.css
    ├── Signin.html
    ├── signin.css
    └── README.md

Each major page has its own stylesheet so its visual identity can evolve independently.

## 🧪 Try the experience

1. Start on Home.
2. Select Explore events.
3. Filter events using All / Tech / Culture / Sports.
4. Choose Register.
5. Open Sign in.
6. Enter a valid-looking email and a password of at least six characters.
7. Submit the form to see the demo validation state.

## 🌐 Deployment

This is a static website and can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static web server

For GitHub Pages, publish the master branch from the repository root.

## 🔮 Recommended next version

The natural next step is to connect this UI to a real application backend:

    Browser
       ↓
    SEP Frontend
       ↓
    REST API
       ↓
    Authentication + Event Services
       ↓
    Database

A production version could use Java/Spring Boot, Node.js/Express, .NET, or another API stack.

## 📌 Project status

**UI:** Modernized  
**Responsive:** Yes  
**Event filtering:** Yes  
**Authentication UI:** Yes  
**Real authentication:** Not yet  
**Database:** Not yet  
**Public deployment:** Not currently configured

## 📄 License

No license is currently declared. Add a license before distributing the project publicly.
