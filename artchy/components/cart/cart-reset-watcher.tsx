"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useCart } from "./cart-context";

/**
 * /?reset=1 wist de cart (cookies + client-storage) en toont daarna de
 * schone homepage — handig voor testers om opnieuw te beginnen.
 */
export function CartResetWatcher() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const wantsReset = searchParams.get("reset") === "1";

  useEffect(() => {
    if (!wantsReset) return;
    clearCart();
    // URL direct opschonen zonder navigatie.
    window.history.replaceState(null, "", "/");
  }, [wantsReset, clearCart]);

  return null;
}
