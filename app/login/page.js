"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === "signup";

  function updateField(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const result = isSignUp
      ? await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      : await authClient.signIn.email({
          email: form.email,
          password: form.password,
        });

    setBusy(false);
    if (result.error) {
      setError(result.error.message || "Something went wrong. Try again.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  const inputClass =
    "w-full rounded border border-rule bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-mustard";

  return (
    <section className="mx-auto max-w-md px-5 py-12 md:py-16">
      <h1 className="mb-6 font-heading text-3xl">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignUp && (
          <label className="flex flex-col gap-1">
            Name
            <input name="name" value={form.name} onChange={updateField} required className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            minLength={8}
            required
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="text-rust">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded bg-ink px-6 py-3 font-semibold text-paper hover:bg-plum disabled:opacity-50"
        >
          {busy ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(isSignUp ? "signin" : "signup");
          setError("");
        }}
        className="mt-6 underline"
      >
        {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </section>
  );
}
