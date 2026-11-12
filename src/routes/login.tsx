import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/enroll/SiteHeader";
import { logIn } from "@/lib/enrollments";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Maths Enrollment Submissions" },
      { name: "description", content: "Log in to see submitted maths course enrollment forms." },
      { property: "og:title", content: "Log in — Maths Enrollment Submissions" },
      {
        property: "og:description",
        content: "Log in to see submitted maths course enrollment forms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const enter = () => {
    logIn();
    navigate({ to: "/submissions" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader
        right={
          <Button asChild variant="paper">
            <Link to="/">
              <ArrowLeft /> Back to form
            </Link>
          </Button>
        }
      />
      <main className="mx-auto grid max-w-6xl place-items-center px-5 py-16">
        <div className="w-full max-w-md animate-rise rounded-2xl border-2 border-ink bg-card p-8 text-center shadow-offset">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border-2 border-ink bg-highlight shadow-offset-sm">
            <ClipboardList className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-black">Teacher login</h1>
          <p className="mt-2 text-muted-foreground">
            No passcode needed — tap below to see every submitted form.
          </p>
          <Button variant="ink" size="xl" className="mt-8 w-full" onClick={enter}>
            Log in <ArrowRight />
          </Button>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to enrollment form
          </Link>
        </div>
      </main>
    </div>
  );
}
