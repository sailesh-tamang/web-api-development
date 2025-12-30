"use client";

import Link from "next/link";
import { Check, EyeOff } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-zinc-900 px-4">
      <div className="w-full max-w-sm text-white">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-zinc-400">
            Please Enter Your Credentials To Proceed
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Sailesh Tamang"
                className="h-11 w-full rounded-md border border-lime-400/80 bg-transparent px-3 text-sm outline-none
                focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Phone</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+977-9876543210"
                className="h-11 w-full rounded-md border border-lime-400/80 bg-transparent px-3 text-sm outline-none
                focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-200">Email</label>
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

          {/* Create Account button */}
          <button
            type="submit"
            className="h-11 w-full rounded-md bg-lime-400 text-black font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-zinc-300">
            Already Have Account?{" "}
            <Link href="/login" className="font-semibold text-lime-400 hover:underline">
              Login!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
