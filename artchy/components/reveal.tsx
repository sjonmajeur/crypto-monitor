import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Neutrale wrapper. De scroll-reveal is bewust verwijderd: elke
 * verborgen-tot-scroll-variant maakte secties zwart in full-page
 * captures en bij trage hydration (zie globals.css). Content is
 * altijd direct zichtbaar.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Genegeerd sinds de CSS-variant; behouden voor API-compatibiliteit. */
  delay?: number;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
