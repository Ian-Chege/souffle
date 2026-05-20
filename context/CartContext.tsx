"use client";

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import type { Lamp } from "@/lib/data";

export interface CartItem {
  id: string;
  name: string;
  designer: string;
  year: number;
  price: number;
  angle: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  cartOpen: boolean;
  toast: string;
  cartCount: number;
  addToCart: (lamp: Lamp) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const addToCart = useCallback(
    (lamp: Lamp) => {
      setItems((prev) => {
        const ex = prev.find((i) => i.id === lamp.id);
        if (ex) return prev.map((i) => (i.id === lamp.id ? { ...i, qty: i.qty + 1 } : i));
        return [
          ...prev,
          {
            id: lamp.id,
            name: lamp.name,
            designer: lamp.designer,
            year: lamp.year,
            price: lamp.price,
            angle: lamp.angle,
            qty: 1,
          },
        ];
      });
      showToast(`Added · ${lamp.name}`);
    },
    [showToast]
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const cartCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartOpen,
        toast,
        cartCount,
        addToCart,
        setQty,
        remove,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
