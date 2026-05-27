"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { fmtPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <main className="container">
        <header className="ledger-head">
          <span className="meta">№ Ledger</span>
          <h1>The cart is quiet.</h1>
        </header>
        <div className="cart-empty">
          <p>Nothing is held here yet. The archive is waiting.</p>
          <Link href="/archive" className="btn">
            Browse the archive <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="ledger-head">
        <span className="meta">
          № Ledger · {items.length} {items.length === 1 ? "entry" : "entries"}
        </span>
        <h1>Held for you.</h1>
      </header>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.slug}>
            <div className="cart-thumb">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="92px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="cart-info">
              <Link href={`/archive/${item.slug}`} className="name">
                {item.name}
              </Link>
              <div className="sub">
                {item.designer} · {item.year}
              </div>
              <div className="qty">
                <button
                  className="step"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(item.slug, Math.max(1, item.qty - 1))}
                >
                  −
                </button>
                <span className="count">{item.qty}</span>
                <button
                  className="step"
                  aria-label="Increase quantity"
                  onClick={() => setQty(item.slug, item.qty + 1)}
                >
                  +
                </button>
                <button className="remove" onClick={() => remove(item.slug)}>
                  Remove
                </button>
              </div>
            </div>
            <div className="line-price">{fmtPrice(item.price * item.qty)}</div>
          </div>
        ))}
      </div>

      <div className="cart-foot">
        <div className="subtotal">
          <span className="label">Subtotal</span>
          <span className="amount">{fmtPrice(subtotal)}</span>
        </div>
        <button className="btn">
          Proceed to checkout <span aria-hidden>→</span>
        </button>
      </div>
    </main>
  );
}
