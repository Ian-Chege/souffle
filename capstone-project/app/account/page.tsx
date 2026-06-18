"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AccountPage() {
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Already signed in — skip the form, show account view (handled below)
  }, [isAuthenticated]);

  async function handleSubmit(e: React.FormEvent) {
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
      setError(err instanceof Error ? err.message : "Something went wrong. Check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="account-wrap">
        <p className="account-loading">Loading…</p>
      </main>
    );
  }

  // Signed in — show account info
  if (isAuthenticated && currentUser) {
    return (
      <main className="account-wrap">
        <div className="account-card">
          <span className="account-eyebrow">№ Your account</span>
          <h1 className="account-heading">
            {currentUser.name ?? "Account"}
          </h1>
          <div className="account-detail">
            <span className="account-label">Email</span>
            <span className="account-value">{currentUser.email ?? "—"}</span>
          </div>
          <div className="account-detail">
            <span className="account-label">Role</span>
            <span className="account-value">{currentUser.isAdmin ? "Admin" : "Member"}</span>
          </div>
          <div className="account-actions">
            {currentUser.isAdmin && (
              <button className="account-btn-secondary" onClick={() => router.push("/admin/dashboard")}>
                Go to dashboard
              </button>
            )}
            <button
              className="account-btn-ghost"
              onClick={() => signOut().then(() => router.push("/"))}
            >
              Sign out
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </main>
    );
  }

  // Not signed in — show form
  return (
    <main className="account-wrap">
      <div className="account-card">
        <span className="account-eyebrow">№ Souffle</span>
        <h1 className="account-heading">
          {mode === "signIn" ? "Sign in" : "Create account"}
        </h1>
        <p className="account-sub">
          {mode === "signIn"
            ? "Save lamps, track your enquiries."
            : "Join to save pieces and follow the archive."}
        </p>

        <form onSubmit={handleSubmit} className="account-form">
          {mode === "signUp" && (
            <div className="account-field">
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
          <div className="account-field">
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
          <div className="account-field">
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
          {error && <p className="account-error">{error}</p>}
          <button className="account-btn-primary" type="submit" disabled={submitting}>
            {submitting ? "…" : mode === "signIn" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          className="account-toggle"
          onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(""); }}
          type="button"
        >
          {mode === "signIn" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .account-wrap {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-lg);
  }
  .account-loading {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-ink-2);
  }
  .account-card {
    width: 100%;
    max-width: 400px;
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    padding: var(--space-xl) var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
  .account-eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-ink-2);
    letter-spacing: 0.05em;
  }
  .account-heading {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-style: italic;
    color: var(--color-ink);
    margin: 0 0 var(--space-2xs);
  }
  .account-sub {
    font-size: var(--text-sm);
    color: var(--color-ink-2);
    margin: 0;
  }
  .account-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-top: var(--space-2xs);
  }
  .account-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .account-field label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
  }
  .account-field input {
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
  .account-field input:focus { border-color: var(--color-accent); }
  .account-btn-primary {
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
    width: 100%;
  }
  .account-btn-primary:hover { opacity: 0.85; }
  .account-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .account-error {
    font-size: var(--text-xs);
    color: oklch(55% 0.18 25);
    font-family: var(--font-mono);
    margin: 0;
  }
  .account-toggle {
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
  .account-detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--color-rule);
  }
  .account-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-ink-2);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .account-value {
    font-size: var(--text-sm);
    color: var(--color-ink);
  }
  .account-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-top: var(--space-xs);
  }
  .account-btn-secondary {
    background: var(--color-ink);
    color: var(--color-accent-ink);
    border: none;
    padding: var(--space-xs) var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 0.06em;
    cursor: pointer;
    text-transform: uppercase;
  }
  .account-btn-secondary:hover { opacity: 0.85; }
  .account-btn-ghost {
    background: none;
    border: 1px solid var(--color-rule);
    padding: var(--space-xs) var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-ink-2);
    cursor: pointer;
    letter-spacing: 0.04em;
  }
  .account-btn-ghost:hover { border-color: var(--color-ink-2); }
`;
