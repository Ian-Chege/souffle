"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LampCard from "@/components/LampCard";
import { catalogueNumber } from "@/lib/utils";

export default function HomePage() {
  const lamps = useQuery(api.lamps.list);
  const feature = lamps?.[0];
  const recent = lamps?.slice(1, 5) ?? [];

  return (
    <main className="container">
      <section className="letter">
        <div className="letter-text">
          <span className="letter-eyebrow">№ A note from the archive</span>
          <h1>
            Rare <span className="glow">lamps</span>,<br />
            <span className="glow-deep">quietly</span> kept.
          </h1>
          <p className="letter-lede">
            Souffle is a small Nairobi archive of one-of-a-kind table lamps
            found in estates, ateliers and forgotten storerooms across four
            continents.
          </p>
          <p className="letter-body">
            Each lamp is photographed in our studio, conserved by hand and
            rewired to the standard of the room it is going to. We do not
            restore beyond what the object asks for. The patina stays. The
            history stays. The light, we promise, is warmer for it.
          </p>
          <div className="letter-cta">
            <Link href="/archive" className="btn">
              Enter the archive <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="letter-sign">— The keepers, Nairobi</p>
        </div>

        {feature && (
          <Link href={`/archive/${feature.slug}`} className="letter-feature" aria-label={`Currently on view: ${feature.name}`}>
            <span className="kicker">№ Currently on view</span>
            <div className="plate">
              {feature.imageUrl && (
                <Image
                  src={feature.imageUrl}
                  alt={feature.name}
                  fill
                  sizes="(max-width: 880px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
              {feature.sold && <div className="tag">Sold</div>}
            </div>
            <div className="caption">
              <span className="num">{catalogueNumber(feature.slug)}</span>
              <span className="name">{feature.name}</span>
              <span className="sub">
                {feature.designer} · {feature.country} · {feature.year}
              </span>
            </div>
          </Link>
        )}
      </section>

      <section className="newly-catalogued">
        <header className="section-head">
          <div className="meta">
            <span>№ 02</span>
            <span>Newly catalogued</span>
          </div>
          <h2>Recent additions to the archive.</h2>
        </header>
        {lamps === undefined ? (
          <p className="loading">Loading the catalogue…</p>
        ) : (
          <div className="row-grid">
            {recent.map((lamp) => (
              <LampCard key={lamp._id} lamp={lamp} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
