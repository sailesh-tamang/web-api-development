import TopBar from "../../component/dashboard/TopBar";
import Dashboard from "../../component/dashboard/Dashboard";
import Footer from "../../component/dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <Dashboard />
      <Footer />
    </div>
  );
}
