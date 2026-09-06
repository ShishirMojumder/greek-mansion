"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#C9A227]">Greek Mansion</p>
          <h1 className="mt-1 text-2xl font-bold text-[#1E2A78]">Admin sign in</h1>
        </div>

        <form action={formAction} className="space-y-4 rounded-2xl border border-[#1E2A78]/12 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-[#111936]/70">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="mt-1.5 w-full rounded-lg border border-[#1E2A78]/20 px-3 py-3 text-base text-[#111936] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
            />
          </label>

          <label className="block text-sm font-medium text-[#111936]/70">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-lg border border-[#1E2A78]/20 px-3 py-3 text-base text-[#111936] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
            />
          </label>

          {state.error && (
            <p role="alert" className="rounded-full bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[#1E2A78] px-4 py-3 text-sm font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#111936] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#111936]/40">Authorized staff only.</p>
      </div>
    </div>
  );
}
