"use client";

import { useEffect } from "react";

import { useCart } from "./cart-context";

/**
 * Ververst de cart-context bij mount — voor pagina's na een
 * (demo-)checkout, zodat het badge in de header direct klopt.
 */
export function CartRefresher() {
  const { refresh } = useCart();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return null;
}
