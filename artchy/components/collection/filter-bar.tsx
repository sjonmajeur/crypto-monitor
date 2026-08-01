"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { SORT_OPTIONS, formatVolumeMl, type SortOption } from "@/lib/collection";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  types: string[];
  volumesMl: number[];
  activeType?: string;
  activeInhoud?: string;
  activeSort: SortOption;
  resultCount: number;
};

/**
 * Filterbalk voor de PLP. Alle staat leeft in de URL (searchParams) zodat
 * filters deelbaar en server-renderbaar zijn; dit is het enige
 * client-component op de pagina.
 */
export function FilterBar({
  types,
  volumesMl,
  activeType,
  activeInhoud,
  activeSort,
  resultCount,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/shop?${qs}` : "/shop", {
          scroll: false,
        });
      });
    },
    [router, searchParams],
  );

  const toggle = (key: "type" | "inhoud", value: string, active: boolean) =>
    setParam(key, active ? null : value);

  return (
    <div
      className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line pb-6"
      data-pending={isPending || undefined}
    >
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {types.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-wide text-ash">
              Type
            </legend>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const active = type === activeType;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle("type", type, active)}
                    className={cn(
                      "border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-gold bg-gold text-coal"
                        : "border-line text-snow hover:border-gold",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {volumesMl.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-wide text-ash">
              Volume
            </legend>
            <div className="flex flex-wrap gap-2">
              {volumesMl.map((ml) => {
                const active = String(ml) === activeInhoud;
                return (
                  <button
                    key={ml}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle("inhoud", String(ml), active)}
                    className={cn(
                      "border px-3 py-1.5 text-sm tabular-nums transition-colors",
                      active
                        ? "border-gold bg-gold text-coal"
                        : "border-line text-snow hover:border-gold",
                    )}
                  >
                    {formatVolumeMl(ml)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="flex items-center gap-6">
        <p className="text-sm text-ash" aria-live="polite">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-xs uppercase tracking-wide text-ash">
            Sort
          </span>
          <select
            value={activeSort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="border border-line bg-night px-2 py-1.5 text-sm text-snow"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
