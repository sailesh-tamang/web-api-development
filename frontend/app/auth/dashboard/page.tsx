import TopBar from "../../component/dashboard/TopBar";
import Hero from "../../component/dashboard/hero";
import CircleCarousel from "../../component/dashboard/CircleCarusel";
import ProductRow from "../../component/dashboard/ProductRow";
import Footer from "../../component/dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <Hero />
      <CircleCarousel />
      <ProductRow title="BESTSELLERS" />
      <Footer />
    </div>
  );
}
