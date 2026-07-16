import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface IProps {
  title: string;
  icon: LucideIcon;
}

export default function DoctorDashboardStatusCard({
  title,
  icon: Icon,
}: IProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          {title}
        </span>
        <Icon className="w-4 h-4 text-muted-foreground opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12</div>
        <p className="text-xs text-muted-foreground mt-1">
          +2 created this week
        </p>
      </CardContent>
    </Card>
  );
}
