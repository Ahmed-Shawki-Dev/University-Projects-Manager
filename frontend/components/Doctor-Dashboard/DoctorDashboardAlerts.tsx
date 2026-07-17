"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorDashboardAlertDto } from "@/types/schema";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";

interface IProps {
  doctorAlerts: DoctorDashboardAlertDto[];
}

export default function DoctorDashboardAlerts({ doctorAlerts }: IProps) {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Attention Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {doctorAlerts?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            All caught up! No urgent alerts.
          </p>
        ) : (
          doctorAlerts?.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium">{alert.projectName}</h4>
                <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                  {alert.alertType}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">{alert.message}</p>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-muted-foreground italic">
                  Passed{" "}
                  {formatDistanceToNow(new Date(alert.dueDate), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
