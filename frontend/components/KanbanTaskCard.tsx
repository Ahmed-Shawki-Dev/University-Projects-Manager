"use client";
import { removeTask } from "@/action/task/removeTask";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MilestoneWithTasksDto, TaskDto, TeamMemberDto } from "@/types/schema";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import TaskDetailsDrawer from "./Task/TaskDetailsDrawer";
import UpdateTaskCard from "./UpdateTaskCard";
import { Button } from "./ui/button";

interface IProps {
  colTask: TaskDto;
  milestones?: MilestoneWithTasksDto[];
  isProfessor?: boolean;
  teamMembers: TeamMemberDto[];
}

const KanbanTaskCard = ({
  colTask,
  milestones,
  isProfessor,
  teamMembers,
}: IProps) => {
  const [showTaskDetailsDrawer, setShowTaskDetailsDrawer] = useState(false);
  const [showUpdateTaskCard, setShowUpdateTaskCard] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: colTask.id,
      disabled: isProfessor,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const milestone = milestones?.find((m) => m.id === colTask.milestoneId);

  if (showUpdateTaskCard) {
    return (
      <UpdateTaskCard
        milestones={milestones ?? []}
        taskId={colTask.id}
        currentTask={colTask}
        onClose={() => setShowUpdateTaskCard(false)}
        teamMembers={teamMembers}
      />
    );
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={() => setShowTaskDetailsDrawer(true)}
        className={cn(
          `mb-2 shadow-sm border border-border/60 select-none touch-none cursor-pointer hover:border-primary/50 transition-colors group p-3`,
          isDragging && "opacity-50 scale-105 shadow-xl z-50",
        )}
      >
        <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium truncate max-w-[75%]">
            {colTask.title}
          </CardTitle>
          <div className="space-x-1 flex shrink-0 group-hover opacity-0 group-hover:opacity-80 transition-opacity">
            <Button
              variant={"ghost"}
              size={"icon-xs"}
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setShowUpdateTaskCard(true);
              }}
            >
              <Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon-xs"}
              className="h-6 w-6 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                removeTask(colTask.id);
              }}
            >
              <Trash className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <TaskDetailsDrawer
        taskDetails={colTask}
        milestoneTitle={milestone?.title ?? ""}
        open={showTaskDetailsDrawer}
        onClose={() => setShowTaskDetailsDrawer(false)}
      />
    </>
  );
};

export default KanbanTaskCard;
