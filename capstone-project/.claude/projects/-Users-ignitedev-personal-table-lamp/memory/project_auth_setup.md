---
name: project-auth-setup
description: Convex Auth integration status — email/password + Google OAuth, admin role system
metadata:
  type: project
---

Convex Auth (`@convex-dev/auth` v0.0.92) added with Password + Google providers.

**What's built:**
- `convex/auth.ts` — Password + Google providers
- `convex/schema.ts` — authTables merged with extended `users` table (+ `isAdmin` field) and `lamps`
- `convex/users.ts` — `getCurrentUser`, `isCurrentUserAdmin` queries
- `convex/admin.ts` — all admin-guarded mutations: createLamp, updateLamp, deleteLamp, toggleSold, generateUploadUrl, listUsers, promoteAdmin, revokeAdmin, bootstrapAdmin
- `components/ConvexClientProvider.tsx` — swapped to `ConvexAuthProvider`
- `app/admin/page.tsx` — sign-in page (email/password + Google OAuth)
- `app/admin/dashboard/page.tsx` — full admin dashboard (lamp CRUD, user management)

**Pending — Google OAuth credentials:**
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` must be set in Convex env vars
- Redirect URI: `https://quiet-kiwi-504.eu-west-1.convex.site/api/auth/callback/google`

**Why:** User requested admin-only access with email/password and Gmail OAuth.
**How to apply:** Admin bootstrap: first signed-in user can claim admin at `/admin` if no admin exists yet.
