export default function Footer() {
  return (
    <footer className="mt-10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-400">
            <li>9845351587</li>
            <li>fitness@tracking.com</li>
            
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © 2020 – 2025 fitness tracking. All rights reserved.
      </div>
    </footer>
  );
}
