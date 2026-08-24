import GuestDashboard from "@/components/dashboard/guest/GuestDashboard";
import { EventHeader } from "@/components/events";

export default function GuestDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <EventHeader />
      <GuestDashboard />
    </div>
  );
}
