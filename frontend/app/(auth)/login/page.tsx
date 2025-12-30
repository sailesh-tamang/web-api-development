"use client";

import Link from "next/link";
import { Check, EyeOff } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-zinc-900 px-4">
      {/* container */}
      <div className="w-full max-w-sm text-white">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold">
            Welcome To <span className="text-lime-400">HealthSync</span>
          </h1>
          <p className="text-sm text-zinc-400">
            Hello There, Please Sign In To Continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Email Or Phone</label>
            <div className="relative">
              <input
                type="email"
                placeholder="sailesh@gmail.com"
                className="h-11 w-full rounded-md border border-lime-400/80 bg-transparent px-3 pr-10 text-sm outline-none
                focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lime-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="h-11 w-full rounded-md border border-lime-400/80 bg-transparent px-3 pr-10 text-sm outline-none
                focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
              <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lime-400" />
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-lime-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login button (same as your simple flow) */}
          <Link href="/dashboard">
            <button
              type="button"
              className="h-11 w-full rounded-md bg-lime-400 text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              Login
            </button>
          </Link>

          {/* Divider */}
          <div className="text-center text-sm text-zinc-400">Or Login With</div>

          {/* Register */}
          <div className="text-center text-sm text-zinc-300">
            Don&apos;t Have Account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-lime-400 hover:underline"
            >
              Register!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
