"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TopBar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

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
          {!isLoading && (
            isAuthenticated && currentUser ? (
              <Link
                href="/account"
                className={`account-avatar${pathname === "/account" ? " active" : ""}`}
                title={currentUser.email ?? "Account"}
                aria-label="Your account"
              >
                {(currentUser.name ?? currentUser.email ?? "?")
                  .charAt(0)
                  .toUpperCase()}
              </Link>
            ) : (
              <Link
                href="/account"
                className={pathname === "/account" ? "active" : ""}
              >
                Sign in
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
