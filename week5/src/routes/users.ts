import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';

const router = Router();

const layout = (title: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} — Week 5</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f2f5; color: #333; padding: 2rem; }
    nav { display: flex; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    nav a { color: #4f46e5; font-weight: 600; text-decoration: none; }
    nav a:hover { text-decoration: underline; }
    h1 { font-size: 1.6rem; margin-bottom: 1.5rem; color: #111; }
    h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #374151; }
    .card { background: white; border-radius: 10px; padding: 1.5rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.07); margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.7rem 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.95rem; }
    th { background: #f9fafb; font-weight: 700; font-size: 0.8rem;
         text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .actions { display: flex; gap: 0.5rem; }
    form { display: contents; }
    input { width: 100%; padding: 0.55rem 0.8rem; border: 1.5px solid #d1d5db;
            border-radius: 6px; font-size: 0.95rem; outline: none; }
    input:focus { border-color: #4f46e5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; font-size: 0.88rem;
           font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: #4f46e5; color: white; }
    .btn-primary:hover { background: #4338ca; }
    .btn-edit { background: #fef3c7; color: #92400e; }
    .btn-edit:hover { background: #fde68a; }
    .btn-delete { background: #fee2e2; color: #991b1b; }
    .btn-delete:hover { background: #fecaca; }
    .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; }
    .empty { text-align: center; padding: 2rem; color: #9ca3af; }
    .flash { background: #d1fae5; color: #065f46; padding: 0.75rem 1rem;
             border-radius: 6px; margin-bottom: 1rem; font-weight: 600; }
    label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 0.3rem; }
    .field { display: flex; flex-direction: column; }
    .note { font-size: 0.8rem; color: #9ca3af; margin-top: 0.3rem; }
  </style>
</head>
<body>
  <nav>
    <a href="/">← Home</a>
    <a href="/users">Users</a>
    <a href="/products">Products</a>
    <a href="/view/sql">SQL Reference</a>
    <a href="/dashboard">Dashboard</a>
  </nav>
  ${body}
</body>
</html>`;

// ── LIST + CREATE ───────────────────────────────────────────────────────────
router.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const flash = req.query['msg'] ? `<div class="flash">${req.query['msg']}</div>` : '';

  const rows = users.length
    ? users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <div class="actions">
            <a href="/users/${u.id}/edit" class="btn btn-edit btn-sm">Edit</a>
            <form method="POST" action="/users/${u.id}/delete">
              <button type="submit" class="btn btn-delete btn-sm"
                onclick="return confirm('Delete ${u.username}?')">Delete</button>
            </form>
          </div>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="5" class="empty">No users yet. Add one below.</td></tr>`;

  const body = `
    ${flash}
    <h1>Users</h1>
    <div class="card">
      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="card">
      <h2>Add User</h2>
      <form method="POST" action="/users">
        <div class="grid">
          <div class="field"><label>Username</label><input name="username" required placeholder="e.g. ian" /></div>
          <div class="field"><label>Email</label><input name="email" type="email" required placeholder="ian@example.com" /></div>
          <div class="field"><label>Password</label><input name="password" type="password" required placeholder="min 8 chars" /></div>
        </div>
        <button type="submit" class="btn btn-primary">Add User</button>
        <p class="note">Password is hashed with bcrypt before being stored.</p>
      </form>
    </div>`;

  res.send(layout('Users', body));
});

// ── CREATE ──────────────────────────────────────────────────────────────────
router.post('/users', async (req: Request, res: Response) => {
  const { username, email, password } = req.body as Record<string, string>;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, email, password: passwordHash } });
  res.redirect('/users?msg=User+added');
});

// ── EDIT FORM ───────────────────────────────────────────────────────────────
router.get('/users/:id/edit', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true, username: true, email: true },
  });
  if (!user) { res.status(404).send('User not found'); return; }

  const body = `
    <h1>Edit User</h1>
    <div class="card">
      <form method="POST" action="/users/${user.id}">
        <div class="grid">
          <div class="field"><label>Username</label><input name="username" value="${user.username}" required /></div>
          <div class="field"><label>Email</label><input name="email" type="email" value="${user.email}" required /></div>
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <a href="/users" class="btn btn-edit">Cancel</a>
        </div>
      </form>
    </div>`;

  res.send(layout(`Edit — ${user.username}`, body));
});

// ── UPDATE ──────────────────────────────────────────────────────────────────
router.post('/users/:id', async (req: Request, res: Response) => {
  const { username, email } = req.body as Record<string, string>;
  await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { username, email },
  });
  res.redirect('/users?msg=User+updated');
});

// ── DELETE ──────────────────────────────────────────────────────────────────
router.post('/users/:id/delete', async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.redirect('/users?msg=User+deleted');
});

export default router;
