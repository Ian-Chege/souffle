import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user?.isAdmin) throw new Error("Unauthorized");
  return userId;
}

// First signed-in user can claim admin if none exists yet
export const bootstrapAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const allUsers = await ctx.db.query("users").take(100);
    const alreadyHasAdmin = allUsers.some((u) => u.isAdmin);
    if (alreadyHasAdmin) throw new Error("Admin already exists. Contact an existing admin.");
    await ctx.db.patch(userId, { isAdmin: true });
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("users").take(100);
  },
});

export const promoteAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(userId, { isAdmin: true });
  },
});

export const revokeAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const callerId = await requireAdmin(ctx);
    if (callerId === userId) throw new Error("Cannot revoke your own admin access");
    await ctx.db.patch(userId, { isAdmin: false });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const createLamp = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    designer: v.string(),
    country: v.string(),
    year: v.number(),
    material: v.string(),
    price: v.number(),
    sold: v.boolean(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("lamps")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) throw new Error(`Slug "${args.slug}" already exists`);
    return ctx.db.insert("lamps", args);
  },
});

export const updateLamp = mutation({
  args: {
    id: v.id("lamps"),
    slug: v.string(),
    name: v.string(),
    designer: v.string(),
    country: v.string(),
    year: v.number(),
    material: v.string(),
    price: v.number(),
    sold: v.boolean(),
    description: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const toggleSold = mutation({
  args: { id: v.id("lamps"), sold: v.boolean() },
  handler: async (ctx, { id, sold }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { sold });
  },
});

export const deleteLamp = mutation({
  args: { id: v.id("lamps") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
