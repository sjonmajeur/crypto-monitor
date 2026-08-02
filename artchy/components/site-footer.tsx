import { SiteFooterClient } from "./site-footer-client";
import { getSiteSettings } from "@/lib/cms/content";

/** Server-wrapper: leest de footerteksten uit het CMS. */
export async function SiteFooter() {
  const settings = await getSiteSettings();
  return <SiteFooterClient settings={settings} />;
}
