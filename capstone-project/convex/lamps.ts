import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const lamps = await ctx.db.query("lamps").collect();
    return Promise.all(
      lamps.map(async (l) => ({
        ...l,
        imageUrl: l.imageStorageId ? await ctx.storage.getUrl(l.imageStorageId) : null,
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const lamp = await ctx.db
      .query("lamps")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!lamp) return null;
    return {
      ...lamp,
      imageUrl: lamp.imageStorageId ? await ctx.storage.getUrl(lamp.imageStorageId) : null,
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const create = mutation({
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
    const existing = await ctx.db
      .query("lamps")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return ctx.db.insert("lamps", args);
  },
});
