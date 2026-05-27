import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
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
