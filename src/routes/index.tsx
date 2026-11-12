import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, LogIn, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/enroll/SiteHeader";
import {
  addEnrollment,
  BATCH_OPTIONS,
  BOARD_OPTIONS,
  enrollmentSchema,
  type Enrollment,
} from "@/lib/enrollments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enroll — Class 10 & 12 Maths Course" },
      {
        name: "description",
        content: "Fill in the enrollment form for the Class 10 or Class 12 maths course.",
      },
      { property: "og:title", content: "Enroll — Class 10 & 12 Maths Course" },
      {
        property: "og:description",
        content: "Fill in the enrollment form for the Class 10 or Class 12 maths course.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnrollPage,
});

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  studentClass: string;
  board: string;
  school: string;
  guardianName: string;
  batch: string;
  notes: string;
};

const EMPTY: FormState = {
  fullName: "",
  email: "",
  phone: "",
  studentClass: "",
  board: "",
  school: "",
  guardianName: "",
  batch: "",
  notes: "",
};

const CLASS_CARDS = [
  {
    value: "10",
    title: "Class 10",
    formula: "x = (−b ± √(b²−4ac)) / 2a",
    topics: "Algebra · Trigonometry · Geometry · Statistics",
  },
  {
    value: "12",
    title: "Class 12",
    formula: "∫ f(x) dx = F(x) + C",
    topics: "Calculus · Matrices · Vectors · Probability",
  },
];

function EnrollPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState<Enrollment | null>(null);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = enrollmentSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    const saved = addEnrollment(parsed.data);
    setDone(saved);
    setForm(EMPTY);
    toast.success("Enrollment submitted!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-20">
      <SiteHeader
        right={
          <Button asChild variant="paper">
            <Link to="/login">
              <LogIn /> View submissions
            </Link>
          </Button>
        }
      />

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-6 lg:grid-cols-[1fr_1.25fr] lg:pt-12">
        {/* Intro */}
        <section className="relative animate-rise lg:sticky lg:top-10 lg:self-start">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-3 py-1 font-mono text-xs uppercase tracking-wider">
            Admissions open · 2026–27
          </p>
          <h1 className="font-display text-5xl font-black leading-[0.95] sm:text-6xl">
            Make maths your <span className="highlighter">strongest</span> subject.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Board-focused coaching for Class 10 and Class 12 — small batches, weekly tests and
            doubt-clearing sessions.
          </p>

          <ul className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              ["25", "students / batch"],
              ["4×", "classes / week"],
              ["50+", "mock tests"],
            ].map(([n, l]) => (
              <li
                key={l}
                className="rounded-xl border-2 border-ink bg-card p-3 text-center shadow-offset-sm"
              >
                <div className="font-display text-2xl font-black">{n}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </li>
            ))}
          </ul>

          <div aria-hidden className="pointer-events-none absolute -right-2 top-0 hidden lg:block">
            <span
              className="block animate-float-slow font-display text-7xl text-accent/70"
              style={{ ["--r" as string]: "12deg" }}
            >
              π
            </span>
          </div>
          <div aria-hidden className="pointer-events-none mt-10 hidden font-mono text-sm text-muted-foreground/80 lg:block">
            <p className="-rotate-2">sin²θ + cos²θ = 1</p>
            <p className="ml-16 mt-3 rotate-1">d/dx (eˣ) = eˣ</p>
            <p className="ml-6 mt-3 -rotate-1">aⁿ · aᵐ = aⁿ⁺ᵐ</p>
          </div>
        </section>

        {/* Form / confirmation */}
        <section className="animate-rise [animation-delay:120ms]">
          {done ? (
            <Confirmation entry={done} onAnother={() => setDone(null)} />
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="margin-rule relative rounded-2xl border-2 border-ink bg-card p-6 pl-14 shadow-offset sm:p-8 sm:pl-16"
            >
              <h2 className="font-display text-3xl font-bold">Enrollment form</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Takes about 2 minutes. Fields marked * are required.
              </p>

              <fieldset className="mt-7">
                <legend className="mb-3 text-sm font-semibold">Choose your class *</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CLASS_CARDS.map((c) => {
                    const active = form.studentClass === c.value;
                    return (
                      <label
                        key={c.value}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                          active
                            ? "border-ink bg-highlight shadow-offset-sm"
                            : "border-border bg-background hover:border-ink"
                        }`}
                      >
                        <input
                          type="radio"
                          name="studentClass"
                          value={c.value}
                          checked={active}
                          onChange={() => set("studentClass", c.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xl font-bold">{c.title}</span>
                          {active && <CheckCircle2 className="size-5" />}
                        </div>
                        <div className="mt-2 font-mono text-xs">{c.formula}</div>
                        <div className="mt-2 text-xs text-muted-foreground">{c.topics}</div>
                      </label>
                    );
                  })}
                </div>
                <FieldError msg={errors.studentClass} />
              </fieldset>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Student's full name *" error={errors.fullName} className="sm:col-span-2">
                  <input
                    className={inputCls(errors.fullName)}
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    maxLength={80}
                  />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <input
                    type="email"
                    className={inputCls(errors.email)}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    maxLength={120}
                  />
                </Field>
                <Field label="Phone *" error={errors.phone}>
                  <input
                    type="tel"
                    className={inputCls(errors.phone)}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="98765 43210"
                    maxLength={15}
                  />
                </Field>
                <Field label="Board *" error={errors.board}>
                  <select
                    className={inputCls(errors.board)}
                    value={form.board}
                    onChange={(e) => set("board", e.target.value)}
                  >
                    <option value="">Select board</option>
                    {BOARD_OPTIONS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
                <Field label="School *" error={errors.school}>
                  <input
                    className={inputCls(errors.school)}
                    value={form.school}
                    onChange={(e) => set("school", e.target.value)}
                    placeholder="School name"
                    maxLength={120}
                  />
                </Field>
                <Field label="Parent / guardian name *" error={errors.guardianName} className="sm:col-span-2">
                  <input
                    className={inputCls(errors.guardianName)}
                    value={form.guardianName}
                    onChange={(e) => set("guardianName", e.target.value)}
                    placeholder="Full name"
                    maxLength={80}
                  />
                </Field>
              </div>

              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-semibold">Preferred batch *</legend>
                <div className="flex flex-wrap gap-2">
                  {BATCH_OPTIONS.map((b) => {
                    const active = form.batch === b;
                    return (
                      <label
                        key={b}
                        className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-ink bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-ink"
                        }`}
                      >
                        <input
                          type="radio"
                          name="batch"
                          value={b}
                          checked={active}
                          onChange={() => set("batch", b)}
                          className="sr-only"
                        />
                        {b}
                      </label>
                    );
                  })}
                </div>
                <FieldError msg={errors.batch} />
              </fieldset>

              <Field label="Anything we should know? (optional)" error={errors.notes} className="mt-6">
                <textarea
                  rows={3}
                  className={inputCls(errors.notes)}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Topics you find difficult, target score, etc."
                  maxLength={500}
                />
              </Field>

              <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Saved on this device only.
                </p>
                <Button type="submit" variant="marker" size="xl">
                  <Send /> Submit enrollment
                </Button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

function Confirmation({ entry, onAnother }: { entry: Enrollment; onAnother: () => void }) {
  return (
    <div className="animate-rise rounded-2xl border-2 border-ink bg-card p-8 text-center shadow-offset">
      <div className="mx-auto grid size-16 place-items-center rounded-full border-2 border-ink bg-highlight">
        <CheckCircle2 className="size-8 text-success" />
      </div>
      <h2 className="mt-5 font-display text-3xl font-bold">You're enrolled, {entry.fullName.split(" ")[0]}!</h2>
      <p className="mt-2 text-muted-foreground">
        Class {entry.studentClass} · {entry.batch}
      </p>
      <div className="mx-auto mt-6 inline-block rounded-lg border-2 border-dashed border-ink px-5 py-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Enrollment ID</div>
        <div className="font-mono text-xl">{entry.id}</div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="ink" size="lg" onClick={onAnother}>
          Submit another
        </Button>
        <Button asChild variant="paper" size="lg">
          <Link to="/login">View submissions</Link>
        </Button>
      </div>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-lg border-2 bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ink focus:bg-card ${
    error ? "border-destructive" : "border-input"
  }`;
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      <FieldError msg={error} />
    </label>
  );
}

function FieldError({ msg }: { msg?: string | undefined }) {
  if (!msg) return null;
  return <span className="mt-1.5 block text-xs font-medium text-destructive">{msg}</span>;
}
