import express from 'express';
import session = require('express-session');
import authRoutes from './routes/auth';
import formRoutes from './routes/forms';

const app = express();
const PORT = process.env['PORT'] ?? 3000;
const SESSION_SECRET = process.env['SESSION_SECRET'] ?? 'dev-secret';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true in production with HTTPS
  })
);

// Routes
app.use('/', authRoutes);
app.use('/', formRoutes);

// Home
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Week 4 Backend</title></head>
    <body>
      <h1>Week 4 — Node.js + TypeScript Backend</h1>
      <ul>
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/dashboard">Dashboard (protected)</a></li>
        <li><a href="/contact">Contact Form</a></li>
      </ul>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
