import type { Metadata } from "next";
import { Pencil, Lock, Shirt, User } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "How it works",
  description: "This is how we turn art into limited wearable pieces.",
};

const STEPS = [
  {
    icon: Pencil,
    title: "Choose",
    text: "Discover art from our creators.",
  },
  {
    icon: Lock,
    title: "Unlock",
    text: "The community unlocks the design.",
  },
  {
    icon: Shirt,
    title: "Produce",
    text: "We produce limited editions, never mass.",
  },
  {
    icon: User,
    title: "Wear",
    text: "You wear more than clothing. You wear art.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bone text-coal">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 text-center">
          <h1 className="text-heading">How art becomes fashion</h1>
          <p className="mt-2 text-sm text-coal/70">
            This is how we turn art into limited wearable pieces.
          </p>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col items-center">
                <span className="flex size-8 items-center justify-center rounded-full bg-coal font-display text-sm text-snow">
                  {i + 1}
                </span>
                <step.icon className="mt-4 size-6" aria-hidden />
                <h2 className="mt-3 font-display text-base uppercase">
                  {step.title}
                </h2>
                <p className="mt-1 text-sm text-coal/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
