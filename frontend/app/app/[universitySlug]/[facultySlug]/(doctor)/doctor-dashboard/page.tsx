import DoctorDashboardAlerts from "@/components/Doctor-Dashboard/DoctorDashboardAlerts";
import DoctorDashboardStatusCard from "@/components/Doctor-Dashboard/DoctorDashboardStatusCard";
import UpcomingMilestonesList from "@/components/Doctor-Dashboard/UpcomingMilestonesList";
import { Lightbulb } from "lucide-react";

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col h-full container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your supervised projects activity.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <DoctorDashboardStatusCard title="Active projects" icon={Lightbulb} />
        <DoctorDashboardStatusCard title="Active students" icon={Lightbulb} />
        <DoctorDashboardStatusCard title="Finished tasks" icon={Lightbulb} />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingMilestonesList />
        </div>

        <div className="flex flex-col gap-4">
          <DoctorDashboardAlerts />
        </div>
      </div>
    </div>
  );
}
