import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lamps: defineTable({
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
  }).index("by_slug", ["slug"]),
});
