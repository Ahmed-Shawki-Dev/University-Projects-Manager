"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  KanbanColumnDto,
  MilestoneWithTasksDto,
  statusStyles,
  TaskDto,
  TaskStatusEnum,
  TeamMemberDto,
} from "@/types/schema";
import { useDroppable } from "@dnd-kit/core";
import AddTaskCard from "./AddTaskCard";
import KanbanTaskCard from "./KanbanTaskCard";

interface IProps {
  col: KanbanColumnDto;
  colTasks: TaskDto[];
  milestones?: MilestoneWithTasksDto[];
  isProfessor?: boolean;
  teamMembers: TeamMemberDto[];
}

export default function KanbanColumn({
  col,
  colTasks,
  milestones,
  isProfessor,
  teamMembers,
}: IProps) {
  const styles = statusStyles[col?.id as TaskStatusEnum];

  const { setNodeRef } = useDroppable({
    id: col.id.toString(),
  });

  return (
    <Card
      className={cn(
        "w-70 sm:w-80 shrink-0 h-full flex flex-col bg-background border",
        styles.border,
      )}
    >
      <CardHeader className="shrink-0">
        <CardTitle className="flex flex-col gap-2">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border w-fit ${styles.badge}`}
          >
            {col.title}
          </span>
          {col.id === TaskStatusEnum.Todo && !isProfessor && (
            <AddTaskCard
              milestones={milestones ?? []}
              teamMembers={teamMembers}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 p-4 overflow-y-auto overflow-x-hidden min-h-0",
        )}
      >
        {colTasks.map((colTask) => (
          <KanbanTaskCard
            colTask={colTask}
            key={colTask.id}
            milestones={milestones}
            isProfessor={isProfessor}
            teamMembers={teamMembers}
          />
        ))}
      </CardContent>
    </Card>
  );
}
