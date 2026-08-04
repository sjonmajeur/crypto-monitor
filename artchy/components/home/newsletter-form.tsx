"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Nog niet aan een mailinglijst gekoppeld: toont na submit alleen een
 * success-melding (zie DECISIONS.md).
 */
export function NewsletterForm({
  knopTekst = "Join the community",
  placeholder = "Enter your email",
  bevestiging = "You're in — welcome to the community.",
}: {
  knopTekst?: string;
  placeholder?: string;
  bevestiging?: string;
}) {
  const [joined, setJoined] = useState(false);

  if (joined) {
    return (
      <p
        className="flex items-center gap-2 text-sm text-coal"
        role="status"
        data-placeholder="true"
      >
        <Check className="size-4" aria-hidden />
        {bevestiging}
      </p>
    );
  }

  return (
    <form
      data-placeholder="true"
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      aria-label="Newsletter signup"
      onSubmit={(e) => {
        e.preventDefault();
        setJoined(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Enter your email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 border border-coal/30 bg-white px-4 text-sm text-coal placeholder:text-coal/50"
      />
      <Button type="submit" variant="dark" className="shrink-0 gap-2">
        {knopTekst} <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
