"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MailIcon,
  LockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@/lib/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (res.ok) {
        setSent(true);
        toast.success("If an account exists with this email, a reset code has been generated.");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!resetCode.trim()) {
      toast.error("Reset code is required");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: resetCode.trim(),
          newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully! Please sign in with your new password.");
        // Show success state
        setSent(false);
        setEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setResetLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 lg:py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="heading text-2xl font-bold tracking-tight text-foreground">
            pro straps
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <h1 className="heading text-xl font-bold text-foreground">
                  forgot password?
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email and we&apos;ll send you a reset code
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <MailIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className="pl-9 h-11 rounded-lg"
                      autoComplete="email"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full font-semibold text-sm"
                  disabled={loading}
                >
                  {loading ? "sending..." : "send reset code"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftIcon size={14} />
                  back to sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mb-4">
                  <CheckCircleIcon size={32} className="text-foreground" />
                </div>
                <h1 className="heading text-xl font-bold text-foreground">
                  enter reset code
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  A reset code has been generated for{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Check the server console for the code (dev mode).
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-code" className="text-sm font-medium">
                    Reset code
                  </Label>
                  <div className="relative">
                    <MailIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="reset-code"
                      type="text"
                      placeholder="Enter 8-character code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                      className="pl-9 h-11 rounded-lg uppercase tracking-widest font-mono"
                      maxLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <LockIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 h-11 rounded-lg"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password" className="text-sm font-medium">
                    Confirm new password
                  </Label>
                  <div className="relative">
                    <LockIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="confirm-new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 h-11 rounded-lg"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full font-semibold text-sm"
                  disabled={resetLoading}
                >
                  {resetLoading ? "resetting..." : "reset password"}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setResetCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftIcon size={14} />
                  back
                </button>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground hover:text-lime dark:hover:text-lime transition-colors"
                >
                  sign in instead
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}