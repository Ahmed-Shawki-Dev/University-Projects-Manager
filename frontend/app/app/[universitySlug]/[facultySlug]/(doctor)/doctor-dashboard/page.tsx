import { getDoctorDashboardData } from "@/action/dashboard/getDoctorDashboardData";
import DoctorDashboardAlerts from "@/components/Doctor-Dashboard/DoctorDashboardAlerts";
import DoctorDashboardStatusCard from "@/components/Doctor-Dashboard/DoctorDashboardStatusCard";
import UpcomingMilestonesList from "@/components/Doctor-Dashboard/UpcomingMilestonesList";
import { Lightbulb } from "lucide-react";

interface IProps {
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function DoctorDashboardPage({ params }: IProps) {
  const slugs = await params;
  const dashboardRes = await getDoctorDashboardData(slugs);
  const dashboardData = dashboardRes.data;

  return (
    <div className="flex flex-col h-full container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your supervised projects activity.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <DoctorDashboardStatusCard
          title="Active projects"
          icon={Lightbulb}
          value={dashboardData.statsCards.projectsCount}
        />
        <DoctorDashboardStatusCard
          title="Active students"
          icon={Lightbulb}
          value={dashboardData.statsCards.studentsCount}
        />
        <DoctorDashboardStatusCard
          title="Finished tasks"
          icon={Lightbulb}
          value={dashboardData.statsCards.finishedTasksCount}
        />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingMilestonesList
            upcomingMilestones={dashboardData.upcomingMilestones}
          />
        </div>

        <div className="flex flex-col gap-4">
          <DoctorDashboardAlerts doctorAlerts={dashboardData.doctorAlerts} />
        </div>
      </div>
    </div>
  );
}
