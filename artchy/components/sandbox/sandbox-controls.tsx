"use client";

import { useState, useTransition } from "react";

import { resetSandboxAction } from "@/app/actions/sandbox";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";

export function DemoFillButton({ variantIds }: { variantIds: string[] }) {
  const { addItem, pending } = useCart();

  return (
    <Button
      variant="secondary"
      disabled={pending || variantIds.length === 0}
      onClick={() => {
        for (const id of variantIds) addItem(id, 1);
      }}
    >
      {variantIds.length === 0
        ? "Geen beschikbare demo-items"
        : "Vul cart met demo-items"}
    </Button>
  );
}

export function ResetSandboxButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  return (
    <div>
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await resetSandboxAction();
            const parts = [
              `${res.ordersRemoved} testorder(s) geannuleerd en verwijderd`,
              res.inventoryReset
                ? "voorraad teruggezet naar startwaarden"
                : "voorraad niet gereset",
            ];
            if (res.errors.length) parts.push(`fouten: ${res.errors.join(" | ")}`);
            setResult(parts.join("; "));
          })
        }
      >
        {isPending ? "Bezig met resetten…" : "Reset sandbox"}
      </Button>
      {result && (
        <p className="mt-2 text-sm text-ash" aria-live="polite">
          {result}
        </p>
      )}
    </div>
  );
}
