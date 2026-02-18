import Link from "next/link";

export default function Hero() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <p className="text-white text-lg leading-relaxed">
          Fitness is not just about building muscles or losing weight—it’s about
          creating a stronger, healthier version of yourself. Regular exercise
          improves physical strength, boosts mental clarity, reduces stress, and
          builds long-term discipline. Even small, consistent efforts can lead to
          powerful changes over time.
        </p>
        <Link
          href="/exercise-tips"
          className="mt-6 rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-black"
        >
          Start Now
        </Link>
      </div>
    </div>
  );
}
