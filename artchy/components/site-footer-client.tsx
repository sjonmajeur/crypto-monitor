import Link from "next/link";

import { DEFAULT_SITE_SETTINGS, type SiteSettingsContent } from "@/lib/cms/defaults";
import { Music2 } from "lucide-react";

/* Lucide levert geen brand-iconen meer; Instagram/YouTube als inline SVG. */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}


export function SiteFooterClient({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsContent;
} = {}) {
  const { footerMenu, footerInfo, socials } = settings;
  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl uppercase text-snow">
            {settings.merknaam}
          </p>
          <p className="label mt-1 text-ash">{settings.merkOndertitel}</p>
          <p className="mt-4 whitespace-pre-line text-sm text-ash">
            {settings.merkZin}
          </p>
        </div>
        <nav aria-label="Menu">
          <p className="label mb-4 text-snow">{settings.kolomTitels.menu}</p>
          <ul className="space-y-2 text-sm text-ash">
            {footerMenu.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Info">
          <p className="label mb-4 text-snow">{settings.kolomTitels.info}</p>
          {/* Zonder link tonen we alleen de tekst (pagina bestaat nog niet). */}
          <ul className="space-y-2 text-sm text-ash">
            {footerInfo.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} className="hover:text-gold">
                    {item.label}
                  </Link>
                ) : (
                  <span data-placeholder="true">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label mb-4 text-snow">{settings.kolomTitels.volg}</p>
          <div className="flex gap-4 text-ash">
            {socials.instagram && (
              <a
                href={socials.instagram}
                aria-label="Instagram"
                className="hover:text-gold"
              >
                <InstagramIcon className="size-5" />
              </a>
            )}
            {socials.tiktok && (
              <a
                href={socials.tiktok}
                aria-label="TikTok"
                className="hover:text-gold"
              >
                <Music2 className="size-5" aria-hidden />
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                aria-label="YouTube"
                className="hover:text-gold"
              >
                <YoutubeIcon className="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="label mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 px-6 py-4 text-ash">
          <span>{settings.copyright}</span>
          <span>{settings.slogan}</span>
        </div>
      </div>
    </footer>
  );
}
