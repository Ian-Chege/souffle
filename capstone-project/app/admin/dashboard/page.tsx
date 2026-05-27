"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

type Lamp = {
  _id: Id<"lamps">;
  slug: string;
  name: string;
  designer: string;
  country: string;
  year: number;
  material: string;
  price: number;
  sold: boolean;
  description: string;
  imageUrl: string | null;
  imageStorageId?: Id<"_storage">;
};

type LampForm = Omit<Lamp, "_id" | "imageUrl">;

const EMPTY_FORM: LampForm = {
  slug: "", name: "", designer: "", country: "",
  year: new Date().getFullYear(), material: "", price: 0,
  sold: false, description: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isAdmin = useQuery(api.users.isCurrentUserAdmin);
  const currentUser = useQuery(api.users.getCurrentUser);
  const lamps = useQuery(api.lamps.list);
  const users = useQuery(api.admin.listUsers);

  const createLamp = useMutation(api.admin.createLamp);
  const updateLamp = useMutation(api.admin.updateLamp);
  const deleteLamp = useMutation(api.admin.deleteLamp);
  const toggleSold = useMutation(api.admin.toggleSold);
  const promoteAdmin = useMutation(api.admin.promoteAdmin);
  const revokeAdmin = useMutation(api.admin.revokeAdmin);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);

  const [panel, setPanel] = useState<"lamps" | "users">("lamps");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"lamps"> | null>(null);
  const [form, setForm] = useState<LampForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || isAdmin === undefined) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-ink-2)" }}>Loading…</p>
      </main>
    );
  }
  if (!isAuthenticated || isAdmin === false) {
    router.replace("/admin");
    return null;
  }

  const stats = lamps
    ? { total: lamps.length, sold: lamps.filter((l) => l.sold).length, available: lamps.filter((l) => !l.sold).length }
    : null;

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setShowAddForm(true);
  }

  function openEdit(lamp: Lamp) {
    setForm({
      slug: lamp.slug, name: lamp.name, designer: lamp.designer,
      country: lamp.country, year: lamp.year, material: lamp.material,
      price: lamp.price, sold: lamp.sold, description: lamp.description,
      imageStorageId: lamp.imageStorageId,
    });
    setEditingId(lamp._id);
    setImageFile(null);
    setImagePreview(lamp.imageUrl);
    setError("");
    setShowAddForm(true);
  }

  function closeForm() {
    setShowAddForm(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let imageStorageId = form.imageStorageId;
      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, { method: "POST", body: imageFile, headers: { "Content-Type": imageFile.type } });
        const { storageId } = await res.json();
        imageStorageId = storageId;
      }
      if (editingId) {
        await updateLamp({ id: editingId, ...form, imageStorageId });
      } else {
        await createLamp({ ...form, imageStorageId });
      }
      closeForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: Id<"lamps">, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteLamp({ id });
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/admin");
  }

  return (
    <main className="dash">
      {/* Header */}
      <header className="dash-header">
        <div>
          <span className="dash-eyebrow">№ Souffle admin</span>
          <h1 className="dash-title">Dashboard</h1>
        </div>
        <div className="dash-header-right">
          <span className="dash-user">
            {currentUser?.name ?? currentUser?.email ?? "Admin"}
          </span>
          <button className="dash-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="dash-stats">
          <Stat label="Total lamps" value={stats.total} />
          <Stat label="Available" value={stats.available} />
          <Stat label="Sold" value={stats.sold} />
        </div>
      )}

      {/* Panel tabs */}
      <div className="dash-tabs">
        <button className={`dash-tab ${panel === "lamps" ? "active" : ""}`} onClick={() => setPanel("lamps")}>
          Lamps
        </button>
        <button className={`dash-tab ${panel === "users" ? "active" : ""}`} onClick={() => setPanel("users")}>
          Users
        </button>
      </div>

      {/* Lamps panel */}
      {panel === "lamps" && (
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>Lamp catalogue</h2>
            <button className="dash-btn-add" onClick={openAdd}>+ Add lamp</button>
          </div>

          {/* Add / Edit form */}
          {showAddForm && (
            <div className="dash-form-wrap">
              <div className="dash-form-head">
                <h3>{editingId ? "Edit lamp" : "New lamp"}</h3>
                <button className="dash-close" onClick={closeForm}>✕</button>
              </div>
              <form className="dash-form" onSubmit={handleSubmit}>
                <div className="dash-form-grid">
                  <Field label="Name" required>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </Field>
                  <Field label="Slug">
                    <input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      placeholder="auto-from-name"
                      onBlur={() => { if (!form.slug && form.name) setForm((f) => ({ ...f, slug: f.name.toLowerCase().replace(/\s+/g, "-") })); }}
                    />
                  </Field>
                  <Field label="Designer">
                    <input value={form.designer} onChange={(e) => setForm({ ...form, designer: e.target.value })} required />
                  </Field>
                  <Field label="Country">
                    <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
                  </Field>
                  <Field label="Year">
                    <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} min={1800} max={2099} required />
                  </Field>
                  <Field label="Material">
                    <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} required />
                  </Field>
                  <Field label="Price (KES)">
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} required />
                  </Field>
                  <Field label="Status">
                    <select value={form.sold ? "sold" : "available"} onChange={(e) => setForm({ ...form, sold: e.target.value === "sold" })}>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </Field>
                </div>
                <Field label="Description">
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
                </Field>
                <Field label="Image">
                  <div className="dash-image-upload">
                    {imagePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="dash-image-preview" />
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    <button type="button" className="dash-btn-upload" onClick={() => fileRef.current?.click()}>
                      {imagePreview ? "Change image" : "Upload image"}
                    </button>
                  </div>
                </Field>
                {error && <p className="dash-error">{error}</p>}
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn-cancel" onClick={closeForm}>Cancel</button>
                  <button type="submit" className="dash-btn-save" disabled={submitting}>
                    {submitting ? "Saving…" : editingId ? "Save changes" : "Create lamp"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lamps table */}
          {lamps === undefined ? (
            <p className="dash-loading">Loading…</p>
          ) : lamps.length === 0 ? (
            <p className="dash-empty">No lamps yet. Add one above.</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Catalogue №</th>
                    <th>Name</th>
                    <th>Designer</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lamps.map((lamp) => (
                    <tr key={lamp._id}>
                      <td className="dash-mono">{lamp.slug}</td>
                      <td>{lamp.name}</td>
                      <td>{lamp.designer}</td>
                      <td className="dash-mono">{lamp.year}</td>
                      <td className="dash-mono">KES {lamp.price.toLocaleString()}</td>
                      <td>
                        <button
                          className={`dash-status-btn ${lamp.sold ? "sold" : "available"}`}
                          onClick={() => toggleSold({ id: lamp._id, sold: !lamp.sold })}
                          title={lamp.sold ? "Mark available" : "Mark sold"}
                        >
                          {lamp.sold ? "Sold" : "Available"}
                        </button>
                      </td>
                      <td className="dash-actions">
                        <button className="dash-action-btn" onClick={() => openEdit(lamp as Lamp)}>Edit</button>
                        <button className="dash-action-btn danger" onClick={() => handleDelete(lamp._id, lamp.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Users panel */}
      {panel === "users" && (
        <section className="dash-section">
          <div className="dash-section-head">
            <h2>Users</h2>
          </div>
          {users === undefined ? (
            <p className="dash-loading">Loading…</p>
          ) : users.length === 0 ? (
            <p className="dash-empty">No users found.</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: Doc<"users">) => (
                    <tr key={user._id}>
                      <td>{user.name ?? "—"}</td>
                      <td className="dash-mono">{user.email ?? "—"}</td>
                      <td>
                        <span className={`dash-role ${user.isAdmin ? "admin" : "user"}`}>
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="dash-actions">
                        {user._id !== currentUser?._id && (
                          user.isAdmin ? (
                            <button className="dash-action-btn danger" onClick={() => revokeAdmin({ userId: user._id })}>
                              Revoke admin
                            </button>
                          ) : (
                            <button className="dash-action-btn" onClick={() => promoteAdmin({ userId: user._id })}>
                              Make admin
                            </button>
                          )
                        )}
                        {user._id === currentUser?._id && (
                          <span className="dash-mono" style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-2)" }}>you</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <style>{`
        .dash {
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--space-lg) var(--space-md);
          min-height: 80vh;
        }
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-rule);
          padding-bottom: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .dash-eyebrow {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }
        .dash-title {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-style: italic;
          color: var(--color-ink);
          margin: 0;
        }
        .dash-header-right {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .dash-user {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
        }
        .dash-signout {
          background: none;
          border: 1px solid var(--color-rule);
          padding: 4px var(--space-xs);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .dash-signout:hover { border-color: var(--color-ink-2); }
        .dash-stats {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .stat {
          flex: 1;
          border: 1px solid var(--color-rule);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-paper-2);
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 4px;
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-style: italic;
          color: var(--color-ink);
        }
        .dash-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-rule);
          margin-bottom: var(--space-md);
          gap: 0;
        }
        .dash-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: var(--space-xs) var(--space-md);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: -1px;
        }
        .dash-tab.active {
          color: var(--color-ink);
          border-bottom-color: var(--color-ink);
        }
        .dash-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }
        .dash-section-head h2 {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-style: italic;
          color: var(--color-ink);
          margin: 0;
        }
        .dash-btn-add {
          background: var(--color-ink);
          color: var(--color-accent-ink);
          border: none;
          padding: var(--space-2xs) var(--space-sm);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.05em;
          cursor: pointer;
        }
        .dash-btn-add:hover { opacity: 0.85; }
        .dash-form-wrap {
          border: 1px solid var(--color-rule);
          background: var(--color-paper-2);
          padding: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .dash-form-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-md);
        }
        .dash-form-head h3 {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          font-style: italic;
          color: var(--color-ink);
          margin: 0;
        }
        .dash-close {
          background: none;
          border: none;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--color-ink-2);
          cursor: pointer;
        }
        .dash-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .dash-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-sm);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field label {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          letter-spacing: 0.04em;
        }
        .field input,
        .field select,
        .field textarea {
          border: 1px solid var(--color-rule);
          background: var(--color-paper);
          padding: var(--space-2xs) var(--space-xs);
          font-size: var(--text-sm);
          color: var(--color-ink);
          font-family: var(--font-body);
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus { border-color: var(--color-accent); }
        .field textarea { resize: vertical; }
        .dash-image-upload {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .dash-image-preview {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border: 1px solid var(--color-rule);
        }
        .dash-btn-upload {
          background: none;
          border: 1px solid var(--color-rule);
          padding: var(--space-2xs) var(--space-xs);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .dash-btn-upload:hover { border-color: var(--color-ink-2); }
        .dash-form-actions {
          display: flex;
          gap: var(--space-xs);
          justify-content: flex-end;
        }
        .dash-btn-cancel {
          background: none;
          border: 1px solid var(--color-rule);
          padding: var(--space-2xs) var(--space-sm);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .dash-btn-save {
          background: var(--color-ink);
          color: var(--color-accent-ink);
          border: none;
          padding: var(--space-2xs) var(--space-sm);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.05em;
          cursor: pointer;
        }
        .dash-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .dash-error {
          font-size: var(--text-xs);
          color: oklch(55% 0.18 25);
          font-family: var(--font-mono);
          margin: 0;
        }
        .dash-table-wrap {
          overflow-x: auto;
        }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }
        .dash-table th {
          text-align: left;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--color-ink-2);
          padding: var(--space-xs) var(--space-sm);
          border-bottom: 1px solid var(--color-rule);
          text-transform: uppercase;
        }
        .dash-table td {
          padding: var(--space-xs) var(--space-sm);
          border-bottom: 1px solid var(--color-rule);
          color: var(--color-ink);
          vertical-align: middle;
        }
        .dash-table tr:hover td { background: var(--color-paper-2); }
        .dash-mono {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
        }
        .dash-actions {
          display: flex;
          gap: var(--space-2xs);
        }
        .dash-action-btn {
          background: none;
          border: 1px solid var(--color-rule);
          padding: 2px var(--space-xs);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          cursor: pointer;
          letter-spacing: 0.03em;
        }
        .dash-action-btn:hover { border-color: var(--color-ink-2); color: var(--color-ink); }
        .dash-action-btn.danger:hover { border-color: oklch(55% 0.18 25); color: oklch(55% 0.18 25); }
        .dash-status-btn {
          border: 1px solid var(--color-rule);
          background: none;
          padding: 2px var(--space-xs);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          cursor: pointer;
          letter-spacing: 0.03em;
        }
        .dash-status-btn.sold { color: oklch(50% 0.10 45); border-color: oklch(80% 0.08 45); }
        .dash-status-btn.available { color: oklch(45% 0.12 155); border-color: oklch(80% 0.08 155); }
        .dash-role {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          padding: 1px var(--space-xs);
          border: 1px solid var(--color-rule);
        }
        .dash-role.admin { border-color: var(--color-accent); color: var(--color-accent-deep); }
        .dash-role.user { color: var(--color-ink-2); }
        .dash-loading, .dash-empty {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-ink-2);
          padding: var(--space-md) 0;
        }
      `}</style>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="field">
      <label>{label}{required && " *"}</label>
      {children}
    </div>
  );
}
