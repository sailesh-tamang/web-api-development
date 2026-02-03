"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function TopBar() {
  const router = useRouter();
  const isLoggedIn = !!Cookies.get("token");

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center text-slate-900 gap-8">
          <Link href="/auth/dashboard" className="text-lg font-bold">
            Fitness Tracking App
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
            onClick={handleProfileClick}
            className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
            Profile
          </button>
          {isLoggedIn && (
            <button 
              onClick={() => {
                Cookies.remove("token");
                Cookies.remove("user");
                router.push("/login");
              }}
              className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
              Logout
            </button>
          )}
          
        </div>
      </div>
    </header>
  );
}