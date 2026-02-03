import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-900"
    >
      {/* Glassmorphism Box */}
      <div className="w-full max-w-md rounded-2xl bg-black/50 backdrop-blur-xl p-8 shadow-xl border border-white/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          {title}
        </h1>

        {children}
      </div>
    </main>
  );
}