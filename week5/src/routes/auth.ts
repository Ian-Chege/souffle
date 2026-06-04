import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// GET — login form
router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html><html><head><title>Login</title></head><body>
      <h2>Login</h2>
      <form method="POST" action="/login">
        <label>Email: <input type="email" name="email" required /></label><br/><br/>
        <label>Password: <input type="password" name="password" required /></label><br/><br/>
        <button type="submit">Login</button>
      </form>
      <p><a href="/register">No account? Register</a></p>
    </body></html>
  `);
});

// GET — register form
router.get('/register', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html><html><head><title>Register</title></head><body>
      <h2>Register</h2>
      <form method="POST" action="/register">
        <label>Username: <input type="text" name="username" required /></label><br/><br/>
        <label>Email: <input type="email" name="email" required /></label><br/><br/>
        <label>Password: <input type="password" name="password" required /></label><br/><br/>
        <button type="submit">Register</button>
      </form>
    </body></html>
  `);
});

// POST — register, store hashed password in DB
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body as Record<string, string>;

  if (!username || !email || !password) {
    res.status(400).send('All fields are required.');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).send('Email already registered.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, email, password: passwordHash } });

  res.send(`<h2>Account created for ${username}!</h2><a href="/login">Login</a>`);
});

// POST — login, validate against DB
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as Record<string, string>;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).send('Invalid credentials.');
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
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
    <!DOCTYPE html><html><head><title>Dashboard</title></head><body>
      <h2>Welcome, ${user.username}!</h2>
      <p>Logged in · session is active.</p>
      <ul>
        <li><a href="/users">View all users</a></li>
        <li><a href="/products">View all products</a></li>
      </ul>
      <form method="POST" action="/logout">
        <button type="submit">Logout</button>
      </form>
    </body></html>
  `);
});

// POST — logout
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect('/login'));
});

export default router;
