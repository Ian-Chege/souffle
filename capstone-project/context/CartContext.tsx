"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  slug: string;
  name: string;
  designer: string;
  year: number;
  price: number;
  image: string | null;
  qty: number;
}

export interface AddToCartInput {
  slug: string;
  name: string;
  designer: string;
  year: number;
  price: number;
  imageUrl: string | null;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  addToCart: (lamp: AddToCartInput) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((lamp: AddToCartInput) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.slug === lamp.slug);
      if (ex) return prev.map((i) => (i.slug === lamp.slug ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...prev,
        {
          slug: lamp.slug,
          name: lamp.name,
          designer: lamp.designer,
          year: lamp.year,
          price: lamp.price,
          image: lamp.imageUrl,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty } : i)));
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, cartCount, addToCart, setQty, remove }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
