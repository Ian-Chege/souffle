"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { catalogueNumber, fmtPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const lamp = useQuery(api.lamps.getBySlug, { slug: id });

  if (lamp === undefined) {
    return (
      <main className="container">
        <p className="loading">Loading the specimen…</p>
      </main>
    );
  }

  if (lamp === null) {
    return (
      <main className="container">
        <div className="cart-empty">
          <h1>Not in the archive.</h1>
          <p>The piece you&apos;re looking for is no longer here.</p>
          <Link href="/archive" className="btn">
            Back to the archive <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const num = catalogueNumber(lamp.slug);

  const handleAdd = () => {
    addToCart({
      slug: lamp.slug,
      name: lamp.name,
      designer: lamp.designer,
      year: lamp.year,
      price: lamp.price,
      imageUrl: lamp.imageUrl,
    });
    router.push("/cart");
  };

  return (
    <main className="container">
      <Link href="/archive" className="back">
        ← Back to the archive
      </Link>

      <article className="pdp">
        <div className="plate pdp-plate">
          {lamp.imageUrl && (
            <Image
              src={lamp.imageUrl}
              alt={lamp.name}
              fill
              sizes="(max-width: 880px) 100vw, 55vw"
              style={{ objectFit: "cover" }}
              priority
            />
          )}
        </div>

        <div className="pdp-detail">
          <div className="num">{num} · {lamp.country}</div>
          <h1>{lamp.name}</h1>
          <div className="sub">
            {lamp.designer} · {lamp.year}
          </div>

          <div className="price">{lamp.sold ? "— sold" : fmtPrice(lamp.price)}</div>

          <p className="body">{lamp.description}</p>

          <button
            className="btn"
            disabled={lamp.sold}
            aria-disabled={lamp.sold}
            onClick={handleAdd}
          >
            {lamp.sold ? "No longer available" : "Add to cart"}
          </button>

          <dl className="specs">
            <div>
              <dt>Materials</dt>
              <dd>{lamp.material}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{lamp.year}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>{lamp.country}</dd>
            </div>
            <div>
              <dt>Designer</dt>
              <dd>{lamp.designer}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Insured, from Nairobi · 7–14 days worldwide</dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
