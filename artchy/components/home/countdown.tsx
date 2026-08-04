"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function partsUntil(target: Date): Parts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

/**
 * Countdown voor de limited drop, naar het ARTCHY-model. Rendert pas na
 * mount om hydration-mismatch op de klok te vermijden.
 */
type KlokLabels = { dagen: string; uren: string; minuten: string; seconden: string };

export function Countdown({
  target,
  labels,
}: {
  target: string;
  labels?: KlokLabels;
}) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const targetDate = new Date(target);
    const tick = () => setParts(partsUntil(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: Array<{ value: number | null; label: string }> = [
    { value: parts?.days ?? null, label: labels?.dagen ?? "Days" },
    { value: parts?.hours ?? null, label: labels?.uren ?? "Hrs" },
    { value: parts?.minutes ?? null, label: labels?.minuten ?? "Mins" },
    { value: parts?.seconds ?? null, label: labels?.seconden ?? "Secs" },
  ];

  return (
    <div
      className="grid max-w-lg grid-cols-4 gap-4 sm:gap-8"
      role="timer"
      aria-label="Time until drop closes"
    >
      {cells.map((cell) => (
        <div key={cell.label} className="min-w-0">
          <p className="font-display text-5xl text-gold tabular-nums sm:text-7xl">
            {cell.value === null ? "--" : String(cell.value).padStart(2, "0")}
          </p>
          <p className="label mt-2 text-ash">{cell.label}</p>
        </div>
      ))}
    </div>
  );
}
