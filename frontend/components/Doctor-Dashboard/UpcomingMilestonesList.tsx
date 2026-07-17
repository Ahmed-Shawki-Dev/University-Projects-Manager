"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorDashboardMilestoneDto } from "@/types/schema";
import { formatDistanceToNow } from "date-fns";

interface IProps {
  upcomingMilestones: DoctorDashboardMilestoneDto[];
}

export default function UpcomingMilestonesList({ upcomingMilestones }: IProps) {
  return (
    <Card className="shadow-sm h-full flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {upcomingMilestones?.map((milestone) => (
          <div
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            key={milestone.id}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {milestone?.title}
              </p>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {milestone?.projectName}
              </Badge>
            </div>
            <div className="text-xs text-destructive font-medium">
              Due{" "}
              {formatDistanceToNow(new Date(milestone.dueDate), {
                addSuffix: true,
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
