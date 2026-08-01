"use server";

import { revalidatePath } from "next/cache";

import {
  cancelAndDeleteOrder,
  getInventorySnapshot,
  getRecentTestOrders,
  isAdminConfigured,
  setInventoryLevels,
  type InventorySnapshot,
} from "@/lib/shopify/admin";
import { sandboxGet, sandboxSet } from "@/lib/sandbox/store";

const BASELINE_KEY = "inventory-baseline";

function assertSandbox(): void {
  if (process.env.NEXT_PUBLIC_SANDBOX !== "true") {
    throw new Error("Sandbox staat uit.");
  }
}

/**
 * Legt de voorraad-startwaarden éénmalig vast, zodat "Reset sandbox" er
 * naartoe terug kan. Bestaat de baseline al, dan blijft die staan.
 */
export async function ensureInventoryBaseline(): Promise<InventorySnapshot | null> {
  assertSandbox();
  if (!isAdminConfigured()) return null;

  const existing = await sandboxGet<InventorySnapshot>(BASELINE_KEY);
  if (existing) return existing;

  const snapshot = await getInventorySnapshot();
  await sandboxSet(BASELINE_KEY, snapshot);
  return snapshot;
}

export async function resetSandboxAction(): Promise<{
  ordersRemoved: number;
  inventoryReset: boolean;
  errors: string[];
}> {
  assertSandbox();
  if (!isAdminConfigured()) {
    return {
      ordersRemoved: 0,
      inventoryReset: false,
      errors: ["Admin API niet geconfigureerd (SHOPIFY_ADMIN_ACCESS_TOKEN)."],
    };
  }

  const errors: string[] = [];
  let ordersRemoved = 0;

  // Alleen orders met test:true — cancelAndDeleteOrder weigert al het
  // andere hard. Testorders worden nooit vervuld: annuleren + verwijderen.
  const orders = await getRecentTestOrders(50);
  for (const order of orders) {
    try {
      await cancelAndDeleteOrder(order);
      ordersRemoved += 1;
    } catch (e) {
      errors.push(
        `Order ${order.name}: ${e instanceof Error ? e.message : "onbekende fout"}`,
      );
    }
  }

  let inventoryReset = false;
  const baseline = await sandboxGet<InventorySnapshot>(BASELINE_KEY);
  if (baseline) {
    try {
      await setInventoryLevels(baseline);
      inventoryReset = true;
    } catch (e) {
      errors.push(
        `Voorraad-reset: ${e instanceof Error ? e.message : "onbekende fout"}`,
      );
    }
  } else {
    errors.push("Geen voorraad-baseline gevonden; voorraad ongemoeid.");
  }

  revalidatePath("/sandbox");
  return { ordersRemoved, inventoryReset, errors };
}
