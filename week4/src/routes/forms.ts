import { Router, Request, Response } from 'express';

const router = Router();

// GET — show the registration form
router.get('/register', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Register</title></head>
    <body>
      <h2>Register</h2>
      <form method="POST" action="/register">
        <label>Username: <input type="text" name="username" required /></label><br/><br/>
        <label>Email: <input type="email" name="email" required /></label><br/><br/>
        <label>Password: <input type="password" name="password" required /></label><br/><br/>
        <button type="submit">Register</button>
      </form>
      <p><a href="/login">Already have an account? Login</a></p>
    </body>
    </html>
  `);
});

// POST — process the registration form
router.post('/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username?: string;
    email?: string;
    password?: string;
  };

  if (!username || !email || !password) {
    res.status(400).send('All fields are required.');
    return;
  }

  // In Week 5 this will save to the database
  res.send(`
    <h2>Welcome, ${username}!</h2>
    <p>Account created for ${email}.</p>
    <a href="/login">Go to Login</a>
  `);
});

// GET — show the contact form
router.get('/contact', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Contact</title></head>
    <body>
      <h2>Contact Us</h2>
      <form method="POST" action="/contact">
        <label>Name: <input type="text" name="name" required /></label><br/><br/>
        <label>Message: <textarea name="message" required></textarea></label><br/><br/>
        <button type="submit">Send</button>
      </form>
    </body>
    </html>
  `);
});

// POST — process the contact form
router.post('/contact', (req: Request, res: Response) => {
  const { name, message } = req.body as { name?: string; message?: string };

  if (!name || !message) {
    res.status(400).send('Name and message are required.');
    return;
  }

  res.send(`<p>Thanks, ${name}! We received your message.</p>`);
});

export default router;
