import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-16">
        <div className="glass-panel p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Clerk is not configured</h1>
          <p className="mt-3 text-slate-700">
            Add your Clerk publishable and secret keys to enable passkey sign-in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "glass-panel w-full",
          },
        }}
      />
    </main>
  );
}
