import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, getAvatarIcon } from "@/lib/utils";
import { statusStyles, TaskDto } from "@/types/schema";
import { AlignLeft, Flag, User } from "lucide-react";

interface IProps {
  taskDetails: TaskDto;
  milestoneTitle?: string;
  open: boolean;
  onClose: () => void;
}

export default function TaskDetailsDrawer({
  taskDetails,
  milestoneTitle,
  open,
  onClose,
}: IProps) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="sm:max-w-xl w-full p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <SheetHeader className="space-y-3 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold px-2.5 py-0.5",
                  statusStyles[taskDetails.status],
                )}
              >
                {taskDetails.status}
              </Badge>

              {/* Milestone Badge */}
              <Badge
                variant="secondary"
                className="text-xs font-normal gap-1 px-2.5 py-0.5"
              >
                <Flag className="w-3 h-3 text-primary" />
                <span>{`${milestoneTitle?.slice(0, 20)}...`}</span>
              </Badge>
            </div>

            <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">
              {taskDetails.title}
            </SheetTitle>
          </SheetHeader>

          <Separator />

          {/* Main Attributes */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assignees</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {taskDetails.assignedStudents &&
              taskDetails.assignedStudents.length > 0 ? (
                taskDetails.assignedStudents.map((student) => (
                  <span
                    key={student.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-secondary-foreground border border-border/50"
                  >
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      {getAvatarIcon(student.name || "S")}
                    </span>
                    {student.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Unassigned
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Description Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlignLeft className="w-4 h-4 text-muted-foreground" />
              <span>Description</span>
            </div>
            <div className="p-4 rounded-lg bg-muted/20 border border-border/40 min-h-25 text-sm leading-relaxed text-muted-foreground">
              {taskDetails.description ||
                "No description provided for this task."}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
          <span>Task ID: {taskDetails.id.slice(0, 8)}...</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
