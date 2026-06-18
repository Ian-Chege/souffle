# Week 6: Database Integration and CRUD Operations


## Database Integration

```tsx
<ConvexAuthNextjsServerProvider>
  <ConvexClientProvider>
    {children}
  </ConvexClientProvider>
</ConvexAuthNextjsServerProvider>
```

The `DATABASE_URL` equivalent is the `CONVEX_URL` environment variable in `.env.local`. The connection is managed automatically — every query and mutation runs through it.

---

## Database Schema

```ts
export default defineSchema({
  lamps: defineTable({
    slug:        v.string(),
    name:        v.string(),
    designer:    v.string(),
    country:     v.string(),
    year:        v.number(),
    material:    v.string(),
    price:       v.number(),
    sold:        v.boolean(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    name:    v.optional(v.string()),
    email:   v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  }).index("email", ["email"]),
});
```

---

## CRUD Operations

### Practical Task 1 - Lamp Catalogue 


#### CREATE — Add a lamp

```ts
export const createLamp = mutation({
  args: {
    name: v.string(), designer: v.string(), country: v.string(),
    year: v.number(), material: v.string(), price: v.number(),
    sold: v.boolean(), description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("lamps", args);
  },
});
```

#### READ — Display all lamps

**Capstone (`convex/lamps.ts` → `list`):**
```ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("lamps").collect();
  },
});
```

In the dashboard:
```tsx
const lamps = useQuery(api.lamps.list);
// renders a <table> row for each lamp
```

#### UPDATE — Edit a lamp

```ts
export const updateLamp = mutation({
  args: { id: v.id("lamps"), name: v.string(), price: v.number(), /* ... */ },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});
```

#### DELETE — Remove a lamp

```ts
export const deleteLamp = mutation({
  args: { id: v.id("lamps") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
```


