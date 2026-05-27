# Week 5 — Database Integration

Building data-driven systems by connecting the Express backend to PostgreSQL using Prisma.

## Stack

| Tool | Purpose |
|------|---------|
| PostgreSQL 17 | Relational database (via DBngin) |
| Prisma | ORM + schema management |
| Prisma Studio | Visual database browser (replaces PHPMyAdmin) |

## Setup

```bash
npm install
npx prisma db push     # apply schema to local PostgreSQL
npx prisma studio      # open visual DB browser at localhost:5555
npm run dev
```

Requires `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres@localhost:5432/studentdb"
```

## Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Float
  stock     Int      @default(0)
  createdAt DateTime @default(now())
}
```

## CRUD endpoints

| Route | Method | Action |
|-------|--------|--------|
| `/users` | POST | Create user |
| `/users` | GET | List all users |
| `/users/:id` | GET | Get one user |
| `/users/:id` | PUT | Update user |
| `/users/:id` | DELETE | Delete user |

Screenshots will be added once the week5 project is built.
