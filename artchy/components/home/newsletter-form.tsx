"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Nog niet aan een mailinglijst gekoppeld: toont na submit alleen een
 * success-melding (zie DECISIONS.md).
 */
export function NewsletterForm() {
  const [joined, setJoined] = useState(false);

  if (joined) {
    return (
      <p
        className="flex items-center gap-2 text-sm text-gold"
        role="status"
        data-placeholder="true"
      >
        <Check className="size-4" aria-hidden />
        You&apos;re in — welcome to the community.
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
        placeholder="Enter your email"
        className="h-11 min-w-0 flex-1 border border-line bg-night px-4 text-sm text-snow placeholder:text-ash"
      />
      <Button type="submit" variant="outline" className="shrink-0 gap-2">
        Join the community <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
