"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Meteors from "@/components/magicui/meteors";

type LabelInputContainerProps = React.PropsWithChildren<{ className?: string }>;

function LabelInputContainer({
  children,
  className,
}: LabelInputContainerProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

export default function RegisterPage() {
  const router = useRouter();
  const { createAccount, login } = useAuthStore();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstname = String(formData.get("firstname") || "");
    const lastname = String(formData.get("lastname") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!firstname || !lastname || !email || !password) {
      setError("Please fill out all the fields");
      return;
    }

    setIsLoading(true);
    setError("");

    const fullName = `${firstname} ${lastname}`;

    const res = await createAccount(fullName, email, password);
    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }

    const loginRes = await login(email, password);
    if (loginRes?.error) {
      setError(loginRes.error.message);
      setIsLoading(false);
      return;
    }

    router.push("/questions");
    setIsLoading(false);
  };

  return (
    // ✅ DO NOT set bg-black here — let (auth)/layout.tsx render the background
    <div className="min-h-[100svh] w-full overflow-hidden text-white">
      <div className="mx-auto flex min-h-[100svh] w-full items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <Meteors number={10} />

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left panel */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,211,25,0.22),transparent_55%),radial-gradient(circle_at_70%_65%,rgba(255,41,117,0.22),transparent_55%),radial-gradient(circle_at_45%_40%,rgba(140,30,255,0.30),transparent_55%)]" />
                {/* ✅ centered text (this is what you wanted) */}
                <div className="relative z-10 flex h-full flex-col justify-center p-10">
                  <div className="text-center md:text-left">
                    <h1 className="bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                      Inquierly
                    </h1>
                    <p className="mt-3 max-w-sm text-sm text-white/70">
                      Create your account and start asking questions.
                    </p>
                  </div>

                  <div className="mt-10 space-y-2 text-xs text-white/60">
                    <p>• Post questions with tags</p>
                    <p>• Upload a related image</p>
                    <p>• Build reputation over time</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="relative z-10 p-7 md:p-10">
                <h2 className="text-2xl font-bold text-white">Sign up</h2>
                <p className="mt-1 text-sm text-white/70">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-orange-400 hover:underline"
                  >
                    Log in
                  </Link>
                  .
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <LabelInputContainer>
                      <Label htmlFor="firstname" className="text-white/80">
                        First name
                      </Label>
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="first name"
                        className="h-11 border-white/10 bg-black/30 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
                      />
                    </LabelInputContainer>

                    <LabelInputContainer>
                      <Label htmlFor="lastname" className="text-white/80">
                        Last name
                      </Label>
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="last name"
                        className="h-11 border-white/10 bg-black/30 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
                      />
                    </LabelInputContainer>
                  </div>

                  <LabelInputContainer>
                    <Label htmlFor="email" className="text-white/80">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 border-white/10 bg-black/30 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="password" className="text-white/80">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 border-white/10 bg-black/30 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
                    />
                  </LabelInputContainer>

                  <button
                    className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff] px-4 font-semibold text-black shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create account"}
                  </button>

                  <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
                      type="button"
                      disabled={isLoading}
                    >
                      <IconBrandGoogle className="h-4 w-4 shrink-0" />
                      <span className="truncate">Continue with Google</span>
                    </button>

                    <button
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
                      type="button"
                      disabled={isLoading}
                    >
                      <IconBrandGithub className="h-4 w-4 shrink-0" />
                      <span className="truncate">Continue with GitHub</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
