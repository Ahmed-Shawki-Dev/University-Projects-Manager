import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getAvatarIcon } from "@/lib/utils";
import { statusStyles, TaskDto } from "@/types/schema";
import { AlignLeft, File, Flag, User } from "lucide-react";
import TaskAttachmentList from "./TaskAttachmentList";
import TaskAttachmentUploadForm from "./TaskAttachmentUploadForm";
import TaskCommentsSection from "./TaskCommentsSection";

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
      <SheetContent className="sm:max-w-xl w-full p-6 flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <SheetHeader className="space-y-3 text-left shrink-0">
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
            {milestoneTitle && (
              <Badge
                variant="secondary"
                className="text-xs font-normal gap-1 px-2.5 py-0.5"
              >
                <Flag className="w-3 h-3 text-primary" />
                <span>{`${milestoneTitle?.slice(0, 20)}...`}</span>
              </Badge>
            )}
          </div>

          <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">
            {taskDetails.title}
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-3 shrink-0" />

        <Tabs
          defaultValue="details"
          className="w-full flex-1 min-h-0 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          {/* Tab 1: Details */}
          <TabsContent
            value="details"
            className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1"
          >
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

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                <span>Description</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/40 min-h-25 text-sm leading-relaxed text-muted-foreground">
                {taskDetails.description ||
                  "No description provided for this task."}
              </div>
              <TaskCommentsSection taskId={taskDetails.id} />
            </div>
          </TabsContent>

          <TabsContent
            value="attachments"
            className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <File className="w-4 h-4 text-muted-foreground" />
                <span>Attachments</span>
              </div>
              <TaskAttachmentUploadForm taskId={taskDetails.id} />
              <TaskAttachmentList taskId={taskDetails.id} />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
