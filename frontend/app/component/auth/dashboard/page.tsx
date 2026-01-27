import TopBar from "../../dashboard/TopBar";
import Hero from "../../dashboard/hero";
import Footer from "../../dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <Hero />
      <Footer />
    </div>
  );
}
