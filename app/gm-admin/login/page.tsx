"use client";

import Image from "next/image";
import { useActionState } from "react";
import { AdminLogo } from "@/components/admin/AdminLogo";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

const field =
  "mt-1.5 w-full rounded-xl border border-navy/20 bg-white px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/20";

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — a full column on desktop, a compact banner on phones. */}
      <aside className="relative isolate overflow-hidden bg-navy px-6 py-8 lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14">
        <Image
          src="/images/real-food/hero-counter.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="-z-10 object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(17,25,54,.82)_0%,rgba(30,42,120,.78)_55%,rgba(17,25,54,.92)_100%)]" />

        <AdminLogo white className="w-[150px] lg:w-[230px]" />

        <div className="mt-6 lg:mt-0">
          <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-gold">Staff access</p>
          <h1 className="display mt-2 text-4xl uppercase text-white lg:mt-3 lg:text-6xl">
            Mansion <span className="accent">Admin</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/60 lg:mt-4 lg:text-base lg:leading-7">
            Update the menu, mark dishes sold out and manage specials — changes go live on the site right away.
          </p>
        </div>

        <p className="mt-6 hidden text-[10px] uppercase tracking-[.22em] text-white/35 lg:mt-0 lg:block">
          5651 Steeles Ave E · Scarborough
        </p>
      </aside>

      {/* Sign-in form */}
      <main className="flex flex-1 items-center justify-center bg-marble px-5 py-10 sm:px-8 lg:py-14">
        <div className="w-full max-w-[380px]">
          <h2 className="text-2xl font-bold text-navy">Welcome back</h2>
          <p className="mt-1.5 text-sm text-ink/50">Sign in to manage the Greek Mansion menu.</p>

          <form action={formAction} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-ink/70">
              Email
              <input type="email" name="email" autoComplete="email" required autoFocus className={field} placeholder="you@greekmansion.ca" />
            </label>

            <label className="block text-sm font-semibold text-ink/70">
              Password
              <input type="password" name="password" autoComplete="current-password" required className={field} placeholder="••••••••" />
            </label>

            {state.error && (
              <p role="alert" className="rounded-xl border border-[#C0392B]/25 bg-[#C0392B]/8 px-4 py-3 text-sm font-medium text-[#A5281B]">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-navy px-4 py-4 text-xs font-semibold uppercase tracking-[.18em] text-white transition hover:bg-ink disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-6 text-ink/40">
            Authorized staff only. Lost your password? Ask an admin to reset it in Supabase.
          </p>
        </div>
      </main>
    </div>
  );
}
