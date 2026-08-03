"use client";

import { useActionState } from "react";

import { logInAlsEigenaarAction, type InlogResultaat } from "./actions";

const veld =
  "w-full border border-line bg-night px-4 py-3 text-sm text-snow placeholder:text-ash focus:border-gold focus:outline-none";

export function InlogFormulier() {
  const [staat, actie, bezig] = useActionState<InlogResultaat | null, FormData>(
    logInAlsEigenaarAction,
    null,
  );

  return (
    <form action={actie} className="flex flex-col gap-4">
      {staat?.melding ? (
        <p role="alert" className="border border-line bg-night px-4 py-3 text-sm text-gold">
          {staat.melding}
        </p>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ash">E-mailadres</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className={veld}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ash">Wachtwoord</span>
        <input
          name="wachtwoord"
          type="password"
          required
          autoComplete="current-password"
          className={veld}
        />
      </label>

      <button
        type="submit"
        disabled={bezig}
        className="mt-2 bg-gold px-6 py-3 text-xs uppercase tracking-[0.15em] text-coal transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {bezig ? "Bezig…" : "Inloggen"}
      </button>
    </form>
  );
}
