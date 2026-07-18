import { getStudentDashboardData } from "@/action/dashboard/getStudentDashboardData";
import DashboardStatsCard from "@/components/DashboardStatsCard";
import CurrentMilestoneProgress from "@/components/Student-Dashboard/CurrentMilestoneProgress";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface IProps {
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function StudentDashboardPage({ params }: IProps) {
  const slugs = await params;
  const dashboardRes = await getStudentDashboardData(slugs);
  const dashboardData = dashboardRes?.data;

  return (
    <div className="flex flex-col h-full container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your projects activity.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <DashboardStatsCard
          title="Pending Tasks"
          icon={CheckCircle2}
          value={dashboardData?.stats.pendingTasks}
        />
        <DashboardStatsCard
          title="Tasks In Progress"
          icon={Clock}
          value={dashboardData?.stats.inProgressTasks}
        />
        <DashboardStatsCard
          title="Overdue Milestones"
          icon={AlertTriangle}
          value={dashboardData?.stats.overdueMilestones}
        />
      </div>
      <div className="flex-1 ">
        <div className="">
          <CurrentMilestoneProgress
            milestone={dashboardData?.currentMilestone}
          />
        </div>
      </div>
    </div>
  );
}
