import { SiteHeaderClient } from "./site-header-client";
import { getArtists, getHomepageContent, getSiteSettings } from "@/lib/cms/content";

/**
 * Server-wrapper: haalt menu en artiesten uit het CMS (met terugval op
 * de standaardwaarden) en geeft ze door aan de interactieve header.
 */
export async function SiteHeader() {
  const [settings, artists, homepage] = await Promise.all([
    getSiteSettings(),
    getArtists(),
    getHomepageContent(),
  ]);

  return (
    <SiteHeaderClient
      menu={settings.menu.map((item) => ({
        href: item.href,
        label: item.label,
      }))}
      artists={artists}
      aankondiging={homepage.aankondiging}
    />
  );
}
