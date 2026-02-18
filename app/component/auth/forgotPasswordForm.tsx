"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/input";
import Button from "../ui/button";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setResetToken(body.token);
        setSuccess("Email verified! Now set your new password.");
        setStep("reset");
      } else {
        setError(body?.message || "Email not found");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!password || !confirmPassword) {
        setError("Both password fields are required");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!resetToken) {
        setError("Session expired. Please try again.");
        setLoading(false);
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${base}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          email,
          newPassword: password,
          confirmPassword,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess("Password has been reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(body?.message || "Failed to reset password");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-500 bg-red-100/10 p-3 rounded">{error}</div>}
        {success && <div className="text-sm text-green-500 bg-green-100/10 p-3 rounded">{success}</div>}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        <p className="text-center text-sm text-gray-300">
          Remember your password?{" "}
          <a href="/login" className="font-medium text-blue-400 hover:underline">
            Back to Login
          </a>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-500 bg-red-100/10 p-3 rounded">{error}</div>}
      {success && <div className="text-sm text-green-500 bg-green-100/10 p-3 rounded">{success}</div>}

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 text-sm"
        />
      </div>

      <Input
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

      <p className="text-center text-sm text-gray-300">
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setError(null);
            setSuccess(null);
          }}
          className="font-medium text-blue-400 hover:underline"
        >
          Back
        </button>
      </p>
    </form>
  );
}
