"use client";

import { getProjectActivities } from "@/action/activities/getProjectActivities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Activity, Loader2 } from "lucide-react";
import useSWR from "swr";
import { Button } from "../ui/button";

export default function ProjectActivitiesButton({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const { data, error, isLoading } = useSWR(
    projectSlug ? `/api/activities/${projectSlug}` : null,
    () => getProjectActivities(projectSlug),
  );

  const activities = data?.data || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"secondary"} className="cursor-pointer">
          <Activity className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="w-4 h-4" />
            Project Activity
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Fetching timeline...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-xs text-destructive">
            Failed to load project activity.
          </div>
        )}

        {!isLoading && !error && activities.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No activity recorded yet.
          </div>
        )}

        {!isLoading && !error && activities.length > 0 && (
          <div className="flex-1 overflow-y-auto pr-3 mt-4 space-y-6 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-7 group">
                <span className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-primary/80 ring-4 ring-background group-hover:scale-125 transition-transform" />

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-foreground/90 font-normal leading-relaxed">
                    {act.message}
                  </p>

                  <time className="text-[10px] text-muted-foreground/70 font-mono">
                    {act.createdAt
                      ? format(new Date(act.createdAt), "hh:mm a - MMM dd")
                      : "Just now"}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
