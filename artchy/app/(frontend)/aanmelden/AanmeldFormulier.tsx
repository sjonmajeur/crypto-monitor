"use client";

import { useActionState } from "react";

import { meldAanAction, type AanmeldResultaat } from "../actions/aanmelden";

const veld =
  "w-full border border-line bg-night px-4 py-3 text-sm text-snow placeholder:text-ash focus:border-gold focus:outline-none";

export function AanmeldFormulier() {
  const [staat, actie, bezig] = useActionState<AanmeldResultaat | null, FormData>(
    meldAanAction,
    null,
  );

  if (staat?.ok) {
    return (
      <div
        role="status"
        className="border border-gold/40 bg-night px-6 py-8 text-sm leading-relaxed text-bone"
      >
        {staat.melding}
      </div>
    );
  }

  return (
    <form action={actie} className="flex flex-col gap-4">
      {staat && !staat.ok ? (
        <p role="alert" className="border border-line bg-night px-4 py-3 text-sm text-gold">
          {staat.melding}
        </p>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ash">Naam</span>
        <input
          name="naam"
          type="text"
          required
          autoComplete="name"
          placeholder="Voor- en achternaam"
          className={veld}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ash">E-mailadres</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jij@voorbeeld.nl"
          className={veld}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ash">Wachtwoord</span>
        <input
          name="wachtwoord"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Minimaal 8 tekens"
          className={veld}
        />
      </label>

      <button
        type="submit"
        disabled={bezig}
        className="mt-2 bg-gold px-6 py-3 text-xs uppercase tracking-[0.15em] text-coal transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {bezig ? "Bezig met versturen…" : "Toegang aanvragen"}
      </button>
    </form>
  );
}
