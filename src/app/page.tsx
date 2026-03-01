import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const stackItems = [
  "Next.js 16 + React Compiler",
  "Tailwind CSS v4",
  "Bun-first runtime strategy",
  "Turso + Drizzle edge data layer",
  "Vercel AI SDK + LangChain",
  "Clerk passkey-first auth",
  "Tremor dashboards",
];

export default function Home() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 md:px-8 md:py-16">
      <div className="aurora-bg" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-teal-700">Edge-AI</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Carbon Intelligence Platform
            </h1>
          </div>

          {hasClerk ? (
            <>
              <SignedOut>
                <div className="flex items-center gap-3">
                  <SignInButton>
                    <button className="rounded-full border border-teal-800/25 px-4 py-2 text-sm text-teal-900 transition hover:bg-teal-100/80">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">
                      Start Free
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
                  >
                    Open Dashboard
                  </Link>
                  <UserButton />
                </div>
              </SignedIn>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
            >
              Open Dashboard
            </Link>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <article className="glass-panel p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
              AI-native sustainability operations
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-teal-950/90 md:text-lg">
              Track household energy usage in real time, estimate live carbon impact, and
              generate personalized reduction strategies with edge-executed AI agents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-teal-900">
              <span className="rounded-full border border-teal-800/25 bg-white/45 px-3 py-1.5">
                Low-latency ingestion
              </span>
              <span className="rounded-full border border-teal-800/25 bg-white/45 px-3 py-1.5">
                Agentic recommendations
              </span>
              <span className="rounded-full border border-teal-800/25 bg-white/45 px-3 py-1.5">
                Passkey + biometrics
              </span>
            </div>
          </article>

          <aside className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-slate-900">2026 Edge-AI Stack</h2>
            <ul className="mt-4 space-y-2 text-sm text-teal-950/90">
              {stackItems.map((item) => (
                <li key={item} className="rounded-lg border border-teal-900/15 bg-white/45 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
