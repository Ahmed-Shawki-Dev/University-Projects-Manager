"use client";

import { leaveStudentTeam } from "@/action/teams/leaveStudentTeam";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ProjectRouteParams } from "@/types/schema";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LeaveTeamButton({
  slugs,
}: {
  slugs: ProjectRouteParams;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeave = () => {
    startTransition(async () => {
      try {
        await leaveStudentTeam(slugs);
        toast.success("You have left the team successfully");
        router.push(
          `/app/${slugs.universitySlug}/${slugs.facultySlug}/projects`,
        );
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Leave Project Team</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span>Are you absolutely sure?</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground pt-1">
            This action cannot be undone. You will immediately lose access to
            this project&apos;s Kanban board and current tasks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isPending} className="sm:mr-2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleLeave();
            }}
            disabled={isPending}
            variant={"destructive"}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Leaving...
              </span>
            ) : (
              "Yes, Leave Team"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
