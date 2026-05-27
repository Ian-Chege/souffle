# Souffle — E-Commerce Platform for Table Lamps

A full-stack e-commerce platform for rare table lamps sourced from around the world. Capstone project for BIT3208 Advanced Web Design and Development.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI | React + TailwindCSS |
| Language | TypeScript |
| Backend | Convex |
| Auth | Convex Auth |
| State | React Context |

## Running locally

```bash
npm install
npx convex dev   # start Convex backend (keep running)
npm run dev      # start Next.js at http://localhost:3000
```

Requires a Convex account. Set `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.

## Structure

```
app/            ← Next.js App Router pages
components/     ← shared UI components
convex/         ← backend functions, schema, auth config
context/        ← React Context providers
lib/            ← utilities
public/         ← static assets
```
