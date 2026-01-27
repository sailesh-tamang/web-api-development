import TopBar from "../../dashboard/TopBar";
import Hero from "../../dashboard/hero";
import CircleCarousel from "../../dashboard/CircleCarusel";
import ProductRow from "../../dashboard/ProductRow";
import Footer from "../../dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />

      <Hero />

      {/* <div className="space-y-6">
        <CircleCarousel />

        <ProductRow title="BESTSELLERS" />
        <ProductRow title="NEW COLLECTION" />
        <ProductRow title="NEW ITEMS" />
      </div> */}

      <Footer />
    </div>
  );
}
