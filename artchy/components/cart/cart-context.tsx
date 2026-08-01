"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/schemas";

type CartContextValue = {
  cart: Cart | null;
  open: boolean;
  pending: boolean;
  setOpen: (open: boolean) => void;
  addItem: (merchandiseId: string, quantity?: number) => void;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setCart(await getCartAction());
    });
  }, []);

  const addItem = useCallback((merchandiseId: string, quantity = 1) => {
    startTransition(async () => {
      setCart(await addToCartAction(merchandiseId, quantity));
      setOpen(true);
    });
  }, []);

  const updateLine = useCallback((lineId: string, quantity: number) => {
    startTransition(async () => {
      setCart(await updateCartLineAction(lineId, quantity));
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    startTransition(async () => {
      setCart(await removeCartLineAction(lineId));
    });
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, open, pending, setOpen, addItem, updateLine, removeLine }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart moet binnen <CartProvider> gebruikt worden.");
  }
  return ctx;
}
