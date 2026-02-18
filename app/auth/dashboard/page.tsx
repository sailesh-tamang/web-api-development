import TopBar from "../../component/dashboard/TopBar";
import Hero from "../../component/dashboard/hero";
import Footer from "../../component/dashboard/Footer";
import WalkingTracker from "../../component/dashboard/WalkingTracker";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <Hero />
      <WalkingTracker />
      
      <Footer />
    </div>
  );
}
