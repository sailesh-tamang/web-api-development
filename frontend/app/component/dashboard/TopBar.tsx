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

          {/* <nav className="hidden items-center gap-5 text-sm text-black md:flex">
            <Link href="#" className="hover:underline">For Women</Link>
            <Link href="#" className="hover:underline">For Men</Link>
            <Link href="#" className="hover:underline">New</Link>
            <Link href="#" className="hover:underline">Special Collections</Link>
          </nav> */}
        </div>

        <div className="flex items-center text-black gap-3 text-sm">
          <button 
            onClick={() => router.push('/login')}
            className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Profile
          </button>
          {/* <button className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Favorite
          </button> */}
          {/* <button className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Cart
          </button> */}
        </div>
      </div>
    </header>
  );
}
