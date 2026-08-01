import Link from "next/link";

/**
 * Vaste sandbox-balk. Eén codepad: rendert alleen wanneer
 * NEXT_PUBLIC_SANDBOX=true; anders bestaat de balk niet.
 */
export function SandboxBanner() {
  if (process.env.NEXT_PUBLIC_SANDBOX !== "true") return null;

  return (
    <div className="bg-gold text-center text-coal">
      <Link
        href="/sandbox"
        className="label block py-1.5 font-medium hover:underline"
      >
        SANDBOX — testmodus, geen echte betalingen
      </Link>
    </div>
  );
}

export function isSandbox(): boolean {
  return process.env.NEXT_PUBLIC_SANDBOX === "true";
}
