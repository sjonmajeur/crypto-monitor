import "server-only";

/**
 * Toegang tot Payload vanuit server components.
 *
 * Alles is bewust "best effort": is er geen database (bijv. tijdens een
 * lokale build of vóór de eerste Railway-deploy), dan geven deze
 * functies null terug en gebruiken de pagina's hun ingebouwde
 * standaardteksten. De site crasht dus nooit op een leeg CMS.
 */

export function isCmsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URI);
}

type PayloadInstance = {
  findGlobal: (args: { slug: string; depth?: number }) => Promise<unknown>;
  find: (args: {
    collection: string;
    depth?: number;
    limit?: number;
    sort?: string;
  }) => Promise<{ docs: unknown[] }>;
};

let cached: Promise<PayloadInstance | null> | null = null;

async function getPayload(): Promise<PayloadInstance | null> {
  if (!isCmsConfigured()) return null;
  if (!cached) {
    cached = (async () => {
      try {
        const [{ getPayload: init }, { default: config }] = await Promise.all([
          import("payload"),
          import("@payload-config"),
        ]);
        return (await init({ config })) as unknown as PayloadInstance;
      } catch (error) {
        console.warn(
          "[cms] Payload niet beschikbaar, val terug op standaardteksten:",
          error instanceof Error ? error.message : error,
        );
        return null;
      }
    })();
  }
  return cached;
}

export async function getGlobal<T>(slug: string): Promise<T | null> {
  const payload = await getPayload();
  if (!payload) return null;
  try {
    return (await payload.findGlobal({ slug, depth: 2 })) as T;
  } catch (error) {
    console.warn(`[cms] Global "${slug}" niet gelezen:`, error);
    return null;
  }
}

export async function getCollection<T>(
  collection: string,
  options: { limit?: number; sort?: string } = {},
): Promise<T[] | null> {
  const payload = await getPayload();
  if (!payload) return null;
  try {
    const result = await payload.find({
      collection,
      depth: 2,
      limit: options.limit ?? 50,
      sort: options.sort,
    });
    return result.docs as T[];
  } catch (error) {
    console.warn(`[cms] Collectie "${collection}" niet gelezen:`, error);
    return null;
  }
}

/** URL van een Payload-upload; null als er geen beeld gekozen is. */
export function mediaUrl(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const url = (value as { url?: string }).url;
  return url && url.length > 0 ? url : null;
}

export function mediaAlt(value: unknown, fallback: string): string {
  if (!value || typeof value !== "object") return fallback;
  return (value as { alt?: string }).alt || fallback;
}

/** Lexical rich text → platte alinea's, zodat de opmaak identiek blijft. */
export function richTextToParagraphs(value: unknown): string[] {
  const root = (value as { root?: { children?: unknown[] } } | null)?.root;
  if (!root?.children) return [];
  const paragraphs: string[] = [];
  for (const node of root.children) {
    const children = (node as { children?: { text?: string }[] }).children ?? [];
    const text = children
      .map((child) => child.text ?? "")
      .join("")
      .trim();
    if (text) paragraphs.push(text);
  }
  return paragraphs;
}
