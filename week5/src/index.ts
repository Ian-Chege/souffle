import express from 'express';
import session = require('express-session');
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import viewRoutes from './routes/views';

const app = express();
const PORT = process.env['PORT'] ?? 3001;
const SESSION_SECRET = process.env['SESSION_SECRET'] ?? 'dev-secret';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', viewRoutes);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html><html><head><title>Week 5</title></head><body>
      <h1>Week 5 — PostgreSQL + Prisma</h1>
      <h3>Auth</h3>
      <ul>
        <li><a href="/register">Register</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/dashboard">Dashboard (protected)</a></li>
      </ul>
      <h3>Table Views</h3>
      <ul>
        <li><a href="/view/users">View Users Table</a></li>
        <li><a href="/view/products">View Products Table</a></li>
        <li><a href="/view/sql">SQL Query Reference</a></li>
      </ul>
      <h3>JSON API</h3>
      <ul>
        <li>GET /users &nbsp;·&nbsp; POST /users</li>
        <li>GET /products &nbsp;·&nbsp; POST /products</li>
      </ul>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
