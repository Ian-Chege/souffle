import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// In-memory user store — replaced by the database in Week 5
const users: { id: number; username: string; email: string; passwordHash: string }[] = [];
let nextId = 1;

// GET — login form
router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Login</title></head>
    <body>
      <h2>Login</h2>
      <form method="POST" action="/login">
        <label>Email: <input type="email" name="email" required /></label><br/><br/>
        <label>Password: <input type="password" name="password" required /></label><br/><br/>
        <button type="submit">Login</button>
      </form>
      <p><a href="/register">Don't have an account? Register</a></p>
    </body>
    </html>
  `);
});

// POST — register (also used by the forms route for demo)
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username?: string;
    email?: string;
    password?: string;
  };

  if (!username || !email || !password) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    res.status(409).json({ error: 'Email already registered.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ id: nextId++, username, email, passwordHash });

  res.send(`
    <h2>Account created for ${username}!</h2>
    <a href="/login">Go to Login</a>
  `);
});

// POST — login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(401).send('Invalid credentials.');
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(401).send('Invalid credentials.');
    return;
  }

  req.session.user = { id: user.id, username: user.username };
  res.redirect('/dashboard');
});

// GET — protected dashboard
router.get('/dashboard', requireAuth, (req: Request, res: Response) => {
  const user = req.session.user!;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Dashboard</title></head>
    <body>
      <h2>Welcome, ${user.username}!</h2>
      <p>You are logged in. This page is protected.</p>
      <form method="POST" action="/logout">
        <button type="submit">Logout</button>
      </form>
    </body>
    </html>
  `);
});

// POST — logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
