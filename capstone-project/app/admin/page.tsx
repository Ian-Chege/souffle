"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminSignInPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isAdmin = useQuery(api.users.isCurrentUserAdmin);
  const bootstrapAdmin = useMutation(api.admin.bootstrapAdmin);

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already authenticated and admin → go to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin === true) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signUp") {
        await signIn("password", { email, password, name, flow: "signUp" });
      } else {
        await signIn("password", { email, password, flow: "signIn" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBootstrap() {
    setError("");
    try {
      await bootstrapAdmin();
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to claim admin.");
    }
  }

  if (isLoading) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-ink-2)" }}>
          Loading…
        </p>
      </main>
    );
  }

  // Authenticated but not admin — offer bootstrap or show blocked
  if (isAuthenticated && isAdmin === false) {
    return (
      <main className="admin-gate">
        <div className="admin-card">
          <span className="admin-eyebrow">№ Admin access</span>
          <h1 className="admin-heading">Restricted area</h1>
          <p className="admin-sub">Your account does not have admin access.</p>
          <button className="admin-btn-primary" onClick={handleBootstrap}>
            Claim first admin
          </button>
          {error && <p className="admin-error">{error}</p>}
          <p className="admin-hint">
            This only works if no admin exists yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-gate">
      <div className="admin-card">
        <span className="admin-eyebrow">№ Souffle admin</span>
        <h1 className="admin-heading">Sign in</h1>

        <form onSubmit={handleEmailSubmit} className="admin-form">
          {mode === "signUp" && (
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn-primary" type="submit" disabled={submitting}>
            {submitting ? "…" : mode === "signIn" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          className="admin-toggle"
          onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(""); }}
          type="button"
        >
          {mode === "signIn" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>

      <style>{`
        .admin-gate {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
        }
        .admin-card {
          width: 100%;
          max-width: 400px;
          background: var(--color-paper);
          border: 1px solid var(--color-rule);
          padding: var(--space-xl) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .admin-eyebrow {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          letter-spacing: 0.05em;
        }
        .admin-heading {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-style: italic;
          color: var(--color-ink);
          margin: 0 0 var(--space-xs);
        }
        .admin-sub {
          font-size: var(--text-sm);
          color: var(--color-ink-2);
          margin: 0;
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-field label {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          letter-spacing: 0.04em;
        }
        .admin-field input {
          border: 1px solid var(--color-rule);
          background: var(--color-paper-2);
          padding: var(--space-xs) var(--space-sm);
          font-size: var(--text-sm);
          color: var(--color-ink);
          outline: none;
          font-family: var(--font-body);
          width: 100%;
          box-sizing: border-box;
        }
        .admin-field input:focus {
          border-color: var(--color-accent);
        }
        .admin-btn-primary {
          background: var(--color-ink);
          color: var(--color-accent-ink);
          border: none;
          padding: var(--space-xs) var(--space-md);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.06em;
          cursor: pointer;
          margin-top: var(--space-2xs);
          text-transform: uppercase;
        }
        .admin-btn-primary:hover { opacity: 0.85; }
        .admin-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .admin-error {
          font-size: var(--text-xs);
          color: oklch(55% 0.18 25);
          font-family: var(--font-mono);
          margin: 0;
        }
        .admin-toggle {
          background: none;
          border: none;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          text-align: left;
        }
        .admin-hint {
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          font-family: var(--font-mono);
          margin: 0;
        }
      `}</style>
    </main>
  );
}

