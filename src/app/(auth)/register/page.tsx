"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import Meteors from "@/components/magicui/meteors";

type LabelInputContainerProps = React.PropsWithChildren<{ className?: string }>;

function LabelInputContainer({
  children,
  className,
}: LabelInputContainerProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

function getPasswordRules(password: string) {
  return [
    { key: "len", label: "At least 8 characters", ok: password.length >= 8 },
    { key: "num", label: "At least 1 number", ok: /\d/.test(password) },
    {
      key: "low",
      label: "At least 1 lowercase letter",
      ok: /[a-z]/.test(password),
    },
    {
      key: "up",
      label: "At least 1 uppercase letter",
      ok: /[A-Z]/.test(password),
    },
    {
      key: "sp",
      label: "At least 1 special character",
      ok: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

function getStrengthLabel(passed: number) {
  if (passed <= 1) return "Weak";
  if (passed === 2) return "Fair";
  if (passed === 3) return "Good";
  if (passed === 4) return "Strong";
  return "Very strong";
}

// smooth red(0) -> yellow(60) -> green(120)
function strengthHue(pct: number) {
  // pct: 0..100
  return Math.round((Math.max(0, Math.min(100, pct)) / 100) * 120);
}

function PasswordStrength({ password }: { password: string }) {
  const rules = React.useMemo(() => getPasswordRules(password), [password]);
  const passed = rules.filter((r) => r.ok).length;

  const pct = Math.round((passed / rules.length) * 100);
  const hue = strengthHue(pct);

  const label = getStrengthLabel(passed);

  if (!password) return null;

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-black/25 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs text-white/70">Password strength</p>
        <p className="text-xs font-semibold text-white/85">{label}</p>
      </div>

      {/* meter track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        {/* meter fill (width + color animates) */}
        <div
          className="h-full rounded-full transition-[width,background-color] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: `hsl(${hue} 90% 55%)`,
          }}
        />
      </div>

      {/* rules */}
      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {rules.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                r.ok ? "bg-emerald-400" : "bg-white/20"
              )}
            />
            <span
              className={cn(
                "text-xs",
                r.ok ? "text-white/85" : "text-white/55"
              )}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {/* hint */}
      <p className="mt-2 text-xs text-white/55">
        Tip: aim for <span className="text-white/80 font-semibold">Good</span>{" "}
        or above to enable account creation.
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { createAccount, login } = useAuthStore();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);

  // ✅ gate: must be "Good" or better (>= 3 rules)
  const passedRulesCount = React.useMemo(() => {
    return getPasswordRules(password).filter((r) => r.ok).length;
  }, [password]);

  const canCreate = passedRulesCount >= 3;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstname = String(formData.get("firstname") || "");
    const lastname = String(formData.get("lastname") || "");
    const email = String(formData.get("email") || "");
    const pw = String(formData.get("password") || "");

    if (!firstname || !lastname || !email || !pw) {
      setError("Please fill out all the fields");
      return;
    }

    // ✅ enforce on submit too (not only UI disable)
    const passed = getPasswordRules(pw).filter((r) => r.ok).length;
    if (passed < 3) {
      setError("Password is too weak. Make it at least “Good” to continue.");
      return;
    }

    setIsLoading(true);
    setError("");

    const fullName = `${firstname} ${lastname}`;

    const res = await createAccount(fullName, email, pw);
    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }

    const loginRes = await login(email, pw);
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

                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-white/10 bg-black/30 pr-11 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <IconEyeOff className="h-5 w-5" />
                        ) : (
                          <IconEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <PasswordStrength password={password} />
                  </LabelInputContainer>

                  <button
                    className={cn(
                      "mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 font-semibold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60",
                      canCreate
                        ? "bg-gradient-to-r from-[#ffd319] via-[#ff2975] to-[#8c1eff] text-black shadow-fuchsia-500/20 hover:brightness-110"
                        : "bg-white/10 text-white/60"
                    )}
                    type="submit"
                    disabled={isLoading || !canCreate}
                    title={
                      !canCreate
                        ? "Make password at least “Good” to enable"
                        : ""
                    }
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
