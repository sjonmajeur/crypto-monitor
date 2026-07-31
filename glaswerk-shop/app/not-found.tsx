import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading">Niet gevonden</h1>
        <p className="text-ink/70">
          Deze pagina bestaat niet (meer). Bekijk de collectie of ga terug
          naar de homepage.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/collectie" className="text-clay underline-offset-4 hover:underline">
            Naar de collectie
          </Link>
          <Link href="/" className="underline-offset-4 hover:underline">
            Naar home
          </Link>
        </div>
      </main>
    </>
  );
}
