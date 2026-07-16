import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboardAlerts() {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Attention Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* التنبيه الأول */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium">Test Project 1</h4>
            <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
              No Milestones
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            This project has been created but has no active milestones plan yet.
          </p>
          <Link
            href="#"
            className="text-xs text-primary flex items-center gap-0.5 hover:underline pt-1"
          >
            Create Plan <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* التنبيه الثاني */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium">Graduation Project</h4>
            <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-full font-medium">
              Overdue
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Phase 1: Database Design passed its deadline without completion.
          </p>
          <Link
            href="#"
            className="text-xs text-primary flex items-center gap-0.5 hover:underline pt-1"
          >
            Review Progress <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
