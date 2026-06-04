import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

const layout = (title: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f2f5; padding: 2rem; color: #333; }
    h1   { margin-bottom: 1.5rem; color: #4f46e5; }
    nav  { margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; }
    nav a { color: #4f46e5; text-decoration: none; font-weight: 600; }
    nav a:hover { text-decoration: underline; }
    table { width: 100%; border-collapse: collapse; background: white;
            border-radius: 8px; overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
    th, td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 700; font-size: 0.85rem;
         text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 99px;
             font-size: 0.8rem; font-weight: 600; background: #ede9fe; color: #5b21b6; }
    .empty { text-align: center; padding: 3rem; color: #9ca3af; }
  </style>
</head>
<body>
  <nav>
    <a href="/">← Home</a>
    <a href="/view/users">Users Table</a>
    <a href="/view/products">Products Table</a>
    <a href="/view/sql">SQL Reference</a>
    <a href="/dashboard">Dashboard</a>
  </nav>
  ${body}
</body>
</html>`;

// ── Users table view ────────────────────────────────────────────────────────
router.get('/view/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const rows = users.length
    ? users.map(u => `
        <tr>
          <td><span class="badge">${u.id}</span></td>
          <td>${u.username}</td>
          <td>${u.email}</td>
          <td>${new Date(u.createdAt).toLocaleString()}</td>
        </tr>`).join('')
    : `<tr><td colspan="4" class="empty">No users yet — <a href="/register">register one</a></td></tr>`;

  const body = `
    <h1>Users (${users.length})</h1>
    <table>
      <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Created</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  res.send(layout('Users', body));
});

// ── Products table view ─────────────────────────────────────────────────────
router.get('/view/products', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  const rows = products.length
    ? products.map(p => `
        <tr>
          <td><span class="badge">${p.id}</span></td>
          <td>${p.name}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${new Date(p.createdAt).toLocaleString()}</td>
        </tr>`).join('')
    : `<tr><td colspan="5" class="empty">No products yet.</td></tr>`;

  const body = `
    <h1>Products (${products.length})</h1>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Created</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  res.send(layout('Products', body));
});

// ── SQL reference view ──────────────────────────────────────────────────────
router.get('/view/sql', async (req: Request, res: Response) => {
  // Run a real raw SQL query against the DB for the screenshot
  const rawUsers = await prisma.$queryRaw<{ id: number; username: string; email: string }[]>`
    SELECT id, username, email FROM "User" ORDER BY id;
  `;

  const rawProducts = await prisma.$queryRaw<{ id: number; name: string; price: number }[]>`
    SELECT id, name, price FROM "Product" ORDER BY id;
  `;

  const userRows = rawUsers.length
    ? rawUsers.map(u => `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.email}</td></tr>`).join('')
    : `<tr><td colspan="3" class="empty">No users</td></tr>`;

  const productRows = rawProducts.length
    ? rawProducts.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>$${Number(p.price).toFixed(2)}</td></tr>`).join('')
    : `<tr><td colspan="3" class="empty">No products</td></tr>`;

  const body = `
    <h1>SQL Query Reference</h1>

    <h2 style="margin:1.5rem 0 0.75rem;color:#374151">CREATE TABLE equivalent (Prisma schema → SQL)</h2>
    <pre style="background:#1e1e2e;color:#cdd6f4;padding:1.25rem;border-radius:8px;font-size:0.9rem;margin-bottom:1.5rem;overflow-x:auto">
CREATE TABLE "User" (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) UNIQUE NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Product" (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  price      DOUBLE PRECISION NOT NULL,
  stock      INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW()
);</pre>

    <h2 style="margin:1rem 0 0.75rem;color:#374151">SELECT * FROM "User"</h2>
    <table style="margin-bottom:1.5rem">
      <thead><tr><th>id</th><th>username</th><th>email</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table>

    <h2 style="margin:1rem 0 0.75rem;color:#374151">SELECT * FROM "Product"</h2>
    <table style="margin-bottom:1.5rem">
      <thead><tr><th>id</th><th>name</th><th>price</th></tr></thead>
      <tbody>${productRows}</tbody>
    </table>

    <h2 style="margin:1rem 0 0.75rem;color:#374151">Prisma → SQL mapping</h2>
    <pre style="background:#1e1e2e;color:#cdd6f4;padding:1.25rem;border-radius:8px;font-size:0.9rem;overflow-x:auto">
-- INSERT (prisma.user.create)
INSERT INTO "User" (username, email, password)
VALUES ('ian', 'ian@test.com', '&lt;bcrypt_hash&gt;');

-- SELECT ALL (prisma.user.findMany)
SELECT id, username, email, "createdAt" FROM "User" ORDER BY "createdAt" DESC;

-- SELECT ONE (prisma.user.findUnique)
SELECT * FROM "User" WHERE id = 1;

-- UPDATE (prisma.user.update)
UPDATE "User" SET username = 'ian_updated' WHERE id = 1;

-- DELETE (prisma.user.delete)
DELETE FROM "User" WHERE id = 1;</pre>`;

  res.send(layout('SQL Reference', body));
});

export default router;
