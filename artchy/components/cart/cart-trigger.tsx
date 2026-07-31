"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "./cart-context";

export function CartTrigger() {
  const { cart, setOpen } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
      className="relative text-snow transition-colors hover:text-gold"
      onClick={() => setOpen(true)}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium tabular-nums text-coal">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
