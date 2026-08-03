import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading text-snow">Not found</h1>
        <p className="text-ash">
          This page doesn&apos;t exist (anymore). Check the shop or head back
          home.
        </p>
        <div className="flex gap-6 text-sm">
          <Link
            href="/shop"
            className="text-gold underline-offset-4 hover:underline"
          >
            Go to the shop
          </Link>
          <Link href="/" className="text-snow underline-offset-4 hover:underline">
            Back home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
