"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  KanbanColumnDto,
  MilestoneDto,
  statusStyles,
  TaskDto,
  TaskStatusEnum,
} from "@/types/schema";
import { Droppable } from "@hello-pangea/dnd";
import AddTaskCard from "./AddTaskCard";
import KanbanTaskCard from "./KanbanTaskCard";

interface IProps {
  col: KanbanColumnDto;
  colTasks: TaskDto[];
  milestones?: MilestoneDto[];
}

export default function KanbanColumn({ col, colTasks, milestones }: IProps) {
  const styles = statusStyles[col.id as TaskStatusEnum];
  return (
    <Card
      className={`flex-1 min-w-67.5 max-w-87.5 h-full flex flex-col bg-background border shrink-0 snap-center ${styles.border}`}
    >
      <CardHeader className="shrink-0">
        <CardTitle className="flex flex-col gap-2">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border w-fit ${styles.badge}`}
          >
            {col.title}
          </span>
          {col.id === TaskStatusEnum.Todo && (
            <AddTaskCard milestones={milestones ?? []} />
          )}
        </CardTitle>
      </CardHeader>
      <Droppable droppableId={col.id.toString()}>
        {(provided) => (
          <CardContent
            className={cn("flex-1 overflow-y-auto space-y-3 p-4 min-h-0")}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {colTasks.map((colTask, idx) => {
              return (
                <KanbanTaskCard
                  colTask={colTask}
                  idx={idx}
                  key={colTask.id}
                  milestones={milestones}
                />
              );
            })}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
}
