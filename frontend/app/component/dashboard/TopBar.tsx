"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center text-slate-900 gap-8">
          <Link href="/auth/dashboard" className="text-lg font-bold">
            fitness tracking
          </Link>

        </div>
        <div className="flex items-center text-black gap-3 text-sm">
          <button 
            onClick={() => router.push('/login')}
            className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Profile
          </button>
        </div>
      </div>
    </header>
  );
}
