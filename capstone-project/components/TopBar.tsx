"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function TopBar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link href="/" className="brand" aria-label="Souffle — home">
          souffle
          <span className="brand-kicker">№ Nairobi</span>
        </Link>
        <span aria-hidden />
        <nav className="nav" aria-label="Primary">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Index
          </Link>
          <Link
            href="/archive"
            className={pathname.startsWith("/archive") ? "active" : ""}
          >
            Archive
          </Link>
          <Link href="/cart" className={pathname === "/cart" ? "active" : ""}>
            Cart{cartCount > 0 ? ` · ${cartCount}` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
