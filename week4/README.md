# Week 4 — Server-Side Programming

Dynamic backend processing and user authentication using Node.js and TypeScript.

## Stack

| Tool | Purpose |
|------|---------|
| Node.js 22 | Runtime |
| Express.js | Web framework |
| TypeScript | Type-safe JavaScript |
| bcrypt | Password hashing |
| express-session | Session management |
| DBngin + PostgreSQL 17 | Local database (Week 5 integration) |

## Running locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home — links to all routes |
| `/register` | GET / POST | Registration form |
| `/login` | GET / POST | Login form |
| `/dashboard` | GET | Protected — requires session |
| `/contact` | GET / POST | Contact form |
| `/logout` | POST | Destroys session |

## Project structure

```
src/
├── index.ts              ← app entry point
├── routes/
│   ├── auth.ts           ← register, login, logout, dashboard
│   └── forms.ts          ← contact and standalone forms
├── middleware/
│   └── requireAuth.ts    ← session guard
└── types/
    └── session.d.ts      ← extends express-session types
```

---

### Fig 1 — Server Running

![Terminal showing server running at localhost:3000](./screenshots/fig1.png)

### Fig 2 — Home Page

![Browser open at home page listing all routes](./screenshots/fig2.png)

### Fig 3 — Register Form

![Register form at /register](./screenshots/fig3.png)

### Fig 4 — Registration Success

![Success response after submitting username, email and password](./screenshots/fig4.png)

### Fig 5 — Login Form

![Login form at /login](./screenshots/fig5.png)

### Fig 6 — Login Success and Redirect

![Redirect to dashboard after successful login](./screenshots/fig6.png)

### Fig 7 — Protected Dashboard

![Dashboard route showing logged-in username](./screenshots/fig7.png)

### Fig 8 — Unauthorized Access Blocked

![401 Unauthorized JSON response when accessing dashboard without a session](./screenshots/fig8.png)

### Fig 9 — Project Folder Structure

![VS Code explorer showing week4/src/ with routes, middleware, and types folders](./screenshots/fig9.png)
