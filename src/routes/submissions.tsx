import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, LogOut, Mail, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/enroll/SiteHeader";
import {
  deleteEnrollment,
  isLoggedIn,
  loadEnrollments,
  logOut,
  type Enrollment,
} from "@/lib/enrollments";

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submitted Forms — Maths Enrollment" },
      { name: "description", content: "All submitted Class 10 and Class 12 maths enrollments." },
      { property: "og:title", content: "Submitted Forms — Maths Enrollment" },
      {
        property: "og:description",
        content: "All submitted Class 10 and Class 12 maths enrollments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubmissionsPage,
});

type Filter = "all" | "10" | "12";

function SubmissionsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate({ to: "/login", replace: true });
      return;
    }
    setItems(loadEnrollments());
    setReady(true);
  }, [navigate]);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (e) =>
        (filter === "all" || e.studentClass === filter) &&
        (!term ||
          [e.fullName, e.email, e.phone, e.school, e.id].some((v) =>
            v.toLowerCase().includes(term),
          )),
    );
  }, [items, filter, q]);

  const count10 = items.filter((e) => e.studentClass === "10").length;
  const count12 = items.filter((e) => e.studentClass === "12").length;

  const remove = (id: string) => {
    if (!window.confirm("Delete this enrollment?")) return;
    deleteEnrollment(id);
    setItems(loadEnrollments());
    toast.success("Enrollment deleted");
  };

  const exportCsv = () => {
    const cols: (keyof Enrollment)[] = [
      "id",
      "submittedAt",
      "fullName",
      "studentClass",
      "board",
      "batch",
      "email",
      "phone",
      "school",
      "guardianName",
      "notes",
    ];
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...visible.map((e) => cols.map((c) => esc(e[c])).join(","))].join(
      "\n",
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "enrollments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = () => {
    logOut();
    navigate({ to: "/" });
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen pb-20">
      <SiteHeader
        right={
          <>
            <Button asChild variant="paper">
              <Link to="/">
                <ArrowLeft /> Back to form
              </Link>
            </Button>
            <Button variant="ghost" onClick={signOut} aria-label="Log out">
              <LogOut /> <span className="hidden sm:inline">Log out</span>
            </Button>
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-black">
              Submitted <span className="highlighter">forms</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Everything students have sent on this device.</p>
          </div>
          <Button variant="ink" onClick={exportCsv} disabled={visible.length === 0}>
            <Download /> Export CSV
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat label="Total" value={items.length} />
          <Stat label="Class 10" value={count10} tone="highlight" />
          <Stat label="Class 12" value={count12} tone="accent" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl border-2 border-ink bg-card p-1">
            {(["all", "10", "12"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {f === "all" ? "All" : `Class ${f}`}
              </button>
            ))}
          </div>
          <label className="relative block sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, ID…"
              className="w-full rounded-xl border-2 border-ink bg-card py-2 pl-9 pr-3 text-sm outline-none focus:bg-background"
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-ink/40 bg-card/70 p-12 text-center">
            <p className="font-display text-2xl font-bold">
              {items.length === 0 ? "No submissions yet" : "Nothing matches"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length === 0
                ? "Forms submitted from the enrollment page will show up here."
                : "Try a different search or filter."}
            </p>
            {items.length === 0 && (
              <Button asChild variant="marker" className="mt-6">
                <Link to="/">Go to the form</Link>
              </Button>
            )}
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {visible.map((e) => (
              <li
                key={e.id}
                className="animate-rise rounded-2xl border-2 border-ink bg-card p-5 shadow-offset-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{e.id}</div>
                    <h3 className="mt-0.5 font-display text-2xl font-bold">{e.fullName}</h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border-2 border-ink px-3 py-0.5 text-xs font-bold ${
                      e.studentClass === "10"
                        ? "bg-highlight text-highlight-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    Class {e.studentClass}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <Info k="Board" v={e.board} />
                  <Info k="Batch" v={e.batch} />
                  <Info k="School" v={e.school} />
                  <Info k="Guardian" v={e.guardianName} />
                </dl>

                {e.notes && (
                  <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm italic">“{e.notes}”</p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashed pt-3 text-sm">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                    <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Mail className="size-3.5" /> {e.email}
                    </a>
                    <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Phone className="size-3.5" /> {e.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(e.submittedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(e.id)}
                      aria-label={`Delete ${e.fullName}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "highlight" | "accent";
}) {
  const bg =
    tone === "highlight"
      ? "bg-highlight text-highlight-foreground"
      : tone === "accent"
        ? "bg-accent text-accent-foreground"
        : "bg-card";
  return (
    <div className={`rounded-2xl border-2 border-ink p-4 shadow-offset-sm sm:p-5 ${bg}`}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-4xl font-black">{value}</div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="truncate font-medium">{v}</dd>
    </div>
  );
}
