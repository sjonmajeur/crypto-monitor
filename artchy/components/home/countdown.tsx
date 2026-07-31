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
export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const targetDate = new Date(target);
    const tick = () => setParts(partsUntil(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: Array<{ value: number | null; label: string }> = [
    { value: parts?.days ?? null, label: "Days" },
    { value: parts?.hours ?? null, label: "Hrs" },
    { value: parts?.minutes ?? null, label: "Mins" },
    { value: parts?.seconds ?? null, label: "Secs" },
  ];

  return (
    <div className="flex gap-8" role="timer" aria-label="Time until drop closes">
      {cells.map((cell) => (
        <div key={cell.label}>
          <p className="font-display text-3xl text-gold tabular-nums">
            {cell.value === null ? "--" : String(cell.value).padStart(2, "0")}
          </p>
          <p className="label mt-1 text-ash">{cell.label}</p>
        </div>
      ))}
    </div>
  );
}
