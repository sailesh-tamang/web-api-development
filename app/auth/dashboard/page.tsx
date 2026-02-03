import TopBar from "../../component/dashboard/TopBar";
import Hero from "../../component/dashboard/hero";
import Footer from "../../component/dashboard/Footer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Hero />
      
      <Footer />
    </div>
  );
}
