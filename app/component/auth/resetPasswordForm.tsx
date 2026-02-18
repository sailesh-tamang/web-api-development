"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "../ui/input";
import Button from "../ui/button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      validateToken(tokenParam, emailParam);
    } else {
      setError("Invalid reset link. Missing token or email.");
      setIsValidating(false);
    }
  }, [searchParams]);

  const validateToken = async (resetToken: string, resetEmail: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/validate-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, email: resetEmail }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.message || "Invalid or expired reset link");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
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

  if (isValidating) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-300">Validating reset link...</p>
      </div>
    );
  }

  if (error === "Invalid or expired reset link") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-red-500 bg-red-100/10 p-3 rounded">{error}</div>
        <p className="text-center text-sm text-gray-300">
          <a href="/forget-password" className="font-medium text-blue-400 hover:underline">
            Request a new reset link
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Button type="submit" disabled={loading || isValidating}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

      <p className="text-center text-sm text-gray-300">
        <a href="/login" className="font-medium text-blue-400 hover:underline">
          Back to Login
        </a>
      </p>
    </form>
  );
}
