"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

interface ApiError {
  response?: { data?: { message?: string } };
}

export default function SignInPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const rawFrom = sp.get("from");
  const from = rawFrom ? decodeURIComponent(rawFrom) : "/profile";

  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace(from);
    },
    onError: (err: ApiError) => {
      setError(err?.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            autoComplete="email"
            required
            onChange={() => error && setError("")}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            autoComplete="current-password"
            required
            onChange={() => error && setError("")}
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
