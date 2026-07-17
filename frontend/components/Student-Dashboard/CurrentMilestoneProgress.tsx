import { StudentDashboardCurrentMilestoneProgressDto } from "@/types/schema";
import { Calendar, Target } from "lucide-react";

interface IProps {
  milestone: StudentDashboardCurrentMilestoneProgressDto | null;
}

export default function CurrentMilestoneProgress({ milestone }: IProps) {
  if (!milestone) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-xl p-6 bg-card text-muted-foreground text-center">
        <Target className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">
          No active milestones for this period.
        </p>
        <p className="text-xs opacity-70">
          All set! Your team has caught up with all upcoming goals.
        </p>
      </div>
    );
  }

  const formattedDate = new Date(milestone.dueDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="flex flex-col space-y-4 p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary tracking-wide uppercase">
            Current Milestone
          </span>
          <h3 className="text-lg font-semibold tracking-tight">
            {milestone.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {milestone.description ||
              "No description provided for this milestone."}
          </p>
        </div>
        <div className="flex items-center text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-medium">
            Tasks Progress:{" "}
            <span className="text-foreground font-semibold">
              {milestone.completedTasksCount}
            </span>{" "}
            / {milestone.totalTasksCount}
          </span>
          <span className="font-bold text-primary">
            {milestone.progressPercentage}%
          </span>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${milestone.progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
