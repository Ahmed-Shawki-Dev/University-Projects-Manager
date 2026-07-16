// upcoming-milestones-card.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpcomingMilestonesList() {
  return (
    <Card className="shadow-sm h-full flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {/* السطر الأول (مايلستون لمشروع التخرج) */}
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Database Design</p>
            {/* البادج ده بيعرف الدكتور المايلستون دي تبع أنهي مشروع من الـ 10 */}
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Graduation Project
            </Badge>
          </div>
          <div className="text-xs text-destructive font-medium">
            Due in 2 days
          </div>
        </div>

        {/* السطر الثاني (مايلستون لمشروع مادة) */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Requirements Analysis
            </p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Course Project 1
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">Due in 5 days</div>
        </div>
      </CardContent>
    </Card>
  );
}
