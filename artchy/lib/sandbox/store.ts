import "server-only";

/**
 * Simpele key/value-store voor sandbox-data (webhook-log,
 * voorraad-baseline). Op Netlify: Netlify Blobs. Lokaal: een JSON-bestand
 * (.sandbox-store.json, gitignored).
 */

const LOCAL_STORE_PATH = ".sandbox-store.json";

type StoreData = Record<string, unknown>;

async function readLocal(): Promise<StoreData> {
  const { readFile } = await import("node:fs/promises");
  try {
    return JSON.parse(await readFile(LOCAL_STORE_PATH, "utf8")) as StoreData;
  } catch {
    return {};
  }
}

async function writeLocal(data: StoreData): Promise<void> {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(LOCAL_STORE_PATH, JSON.stringify(data, null, 2));
}

function onNetlify(): boolean {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

export async function sandboxGet<T>(key: string): Promise<T | null> {
  if (onNetlify()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("sandbox");
    const value = await store.get(key, { type: "json" });
    return (value as T) ?? null;
  }
  const data = await readLocal();
  return (data[key] as T) ?? null;
}

export async function sandboxSet<T>(key: string, value: T): Promise<void> {
  if (onNetlify()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("sandbox");
    await store.setJSON(key, value);
    return;
  }
  const data = await readLocal();
  data[key] = value;
  await writeLocal(data);
}

/* ---- Webhook-log ---- */

export type LoggedOrder = {
  receivedAt: string;
  orderId: number;
  orderNumber: number;
  name: string;
  test: boolean;
  cartToken: string | null;
  checkoutToken: string | null;
  totalPrice: string;
  currency: string;
  orderStatusUrl: string | null;
  lineItems: Array<{ title: string; quantity: number; price: string }>;
};

const WEBHOOK_LOG_KEY = "webhook-orders";
const WEBHOOK_LOG_MAX = 50;

export async function logWebhookOrder(order: LoggedOrder): Promise<void> {
  const log = (await sandboxGet<LoggedOrder[]>(WEBHOOK_LOG_KEY)) ?? [];
  const next = [order, ...log.filter((o) => o.orderId !== order.orderId)];
  await sandboxSet(WEBHOOK_LOG_KEY, next.slice(0, WEBHOOK_LOG_MAX));
}

export async function getWebhookOrders(): Promise<LoggedOrder[]> {
  return (await sandboxGet<LoggedOrder[]>(WEBHOOK_LOG_KEY)) ?? [];
}

export async function findOrderByCartToken(
  cartToken: string,
): Promise<LoggedOrder | null> {
  const log = await getWebhookOrders();
  return log.find((o) => o.cartToken === cartToken) ?? null;
}
