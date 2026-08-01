"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type TestCard = {
  label: string;
  number: string;
  outcome: string;
};

/**
 * Testkaarten voor Shopify Payments in testmodus. Voor de Bogus Gateway
 * gelden kaartnummers 1 (geslaagd), 2 (geweigerd) en 3 (fout), met als
 * naam op de kaart "Bogus Gateway".
 */
const TEST_CARDS: TestCard[] = [
  {
    label: "Geslaagd",
    number: "4242424242424242",
    outcome: "Betaling slaagt; order wordt aangemaakt.",
  },
  {
    label: "Geweigerd",
    number: "4000000000000002",
    outcome: "Kaart wordt geweigerd (card_declined).",
  },
  {
    label: "Onjuist nummer",
    number: "4242424242424241",
    outcome: "Faalt op het kaartnummer (incorrect_number).",
  },
  {
    label: "Dispute",
    number: "4000000000000259",
    outcome: "Betaling slaagt en er wordt direct een dispute geopend.",
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Kopieer ${value}`}
      className="flex items-center gap-1.5 border border-line px-2 py-1 text-xs text-snow hover:border-gold"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? (
        <Check className="size-3.5 text-gold" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {copied ? "Gekopieerd" : "Kopieer"}
    </button>
  );
}

export function TestCards() {
  const [openCard, setOpenCard] = useState<string | null>(TEST_CARDS[0].label);

  return (
    <div>
      <ul className="divide-y divide-line border border-line">
        {TEST_CARDS.map((card) => {
          const open = openCard === card.label;
          return (
            <li key={card.label}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenCard(open ? null : card.label)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-snow hover:text-gold"
              >
                {card.label}
                <ChevronDown
                  className={cn("size-4 transition-transform", open && "rotate-180")}
                  aria-hidden
                />
              </button>
              {open && (
                <div className="px-4 pb-4 text-sm text-ash">
                  <div className="flex flex-wrap items-center gap-3">
                    <code className="tabular-nums text-snow">
                      {card.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                    </code>
                    <CopyButton value={card.number} />
                  </div>
                  <p className="mt-2">{card.outcome}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <dl className="mt-4 space-y-1 text-sm text-ash">
        <div className="flex gap-2">
          <dt className="text-snow">Naam op kaart:</dt>
          <dd>
            wat je wil — gebruik <code>Bogus Gateway</code> als de Bogus
            Gateway actief is (kaartnummers 1 = geslaagd, 2 = geweigerd, 3 =
            fout)
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-snow">CVV:</dt>
          <dd>3 willekeurige cijfers</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-snow">Vervaldatum:</dt>
          <dd>elke datum in de toekomst</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-snow">Foutcases:</dt>
          <dd>maand 13 of een jaar in het verleden</dd>
        </div>
      </dl>
    </div>
  );
}
