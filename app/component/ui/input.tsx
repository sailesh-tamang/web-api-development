import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  const baseClasses = "rounded-md bg-black/50 text-white placeholder-gray-400 border border-green/600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-md";
  const classes = `${baseClasses} ${className ?? ""}`.trim();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-white">
        {label}
      </label>

      <input
        {...props}
        className={classes}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
