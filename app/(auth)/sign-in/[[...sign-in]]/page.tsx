"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import "../../auth.css";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/admin";
      } else if (result.status === "needs_second_factor") {
        setStep("2fa");
      } else {
        setError(`Unexpected status: ${result.status}`);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handle2FA(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.attemptSecondFactor({ strategy: "totp", code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/admin";
      } else {
        setError("Verification failed. Try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  if (step === "2fa") {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Two-Factor Auth</h1>
        <p className="auth-subtitle">Enter the code from your authenticator app</p>
        <form onSubmit={handle2FA}>
          <div className="auth-form-group">
            <label className="auth-label">VERIFICATION CODE</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="auth-input"
              placeholder="6-digit code"
              autoFocus
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Admin Sign In</h1>
      <p className="auth-subtitle">Sign in to access the dashboard</p>
      <form onSubmit={handleCredentials}>
        <div className="auth-form-group">
          <label className="auth-label">EMAIL</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">PASSWORD</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
