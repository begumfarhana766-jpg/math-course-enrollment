import { Link } from "@tanstack/react-router";
import { Sigma } from "lucide-react";
import type { ReactNode } from "react";

export function SiteHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
      <Link to="/" className="group flex items-center gap-2.5">
        <span className="grid size-10 place-items-center rounded-lg border-2 border-ink bg-highlight shadow-offset-sm transition-transform group-hover:-rotate-6">
          <Sigma className="size-5" strokeWidth={2.5} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold">Sigma Maths</span>
          <span className="block text-xs text-muted-foreground">Class 10 &amp; 12 coaching</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
