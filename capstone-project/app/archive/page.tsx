"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LampCard from "@/components/LampCard";

export default function ArchivePage() {
  const lamps = useQuery(api.lamps.list);
  const count = lamps?.length ?? 0;

  return (
    <main className="container">
      <header className="section-head" style={{ marginTop: "var(--space-2xl)", borderTop: "none", paddingTop: 0 }}>
        <div className="meta">
          <span>№ Index</span>
          <span>The archive</span>
          {lamps !== undefined && <span>{count} entries</span>}
        </div>
        <h2 style={{ fontSize: "var(--text-display-s)" }}>
          Every lamp in the catalogue.
        </h2>
        <p className="letter-body" style={{ marginTop: "var(--space-md)" }}>
          Photographed in our Nairobi studio. Shipped insured, worldwide.
          Stock turns slowly — each piece is one of one.
        </p>
      </header>

      {lamps === undefined ? (
        <p className="loading">Loading the catalogue…</p>
      ) : (
        <div className="catalogue">
          {lamps.map((lamp) => (
            <LampCard key={lamp._id} lamp={lamp} />
          ))}
        </div>
      )}
    </main>
  );
}
