import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { SignInForm } from "@/components/SignInForm";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.auth.signInTitle };

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="bg-aurora absolute inset-0 -z-10" />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
            {t.auth.signInTitle}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">{t.auth.signInSubtitle}</p>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-neutral-500">{t.common.loading}</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
