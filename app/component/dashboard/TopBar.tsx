"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function TopBar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center text-white gap-8">
          <Link href="/auth/dashboard" className="flex items-center gap-3 text-lg font-bold text-white">
            <img src="/images/fitness-logo.svg" alt="Fitness Logo" className="h-8 w-8" />
            <span>Fitness Tracking</span>
          </Link>

          
        </div>

        <div className="flex items-center text-black gap-3 text-sm">
          <Link
            href="/exercise-tips"
            className="rounded-md bg-lime-400 px-3 py-1.5 text-black hover:bg-lime-300"
          >
            Exercise Tips
          </Link>
          <Link
            href="/meal-plan"
            className="rounded-md bg-lime-400 px-3 py-1.5 text-black hover:bg-lime-300"
          >
            Meal Plan
          </Link>
          <button
            onClick={handleProfileClick}
            className="rounded-md bg-lime-400 px-3 py-1.5 text-black hover:bg-lime-300"
          >
            Profile
          </button>
          {isLoggedIn && (
            <button
              onClick={() => {
                Cookies.remove("token");
                Cookies.remove("user");
                setIsLoggedIn(false);
                router.push("/login");
              }}
              className="rounded-md bg-lime-400 px-3 py-1.5 text-black hover:bg-lime-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}