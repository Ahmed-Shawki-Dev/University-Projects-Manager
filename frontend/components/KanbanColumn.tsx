"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  KanbanColumnDto,
  statusStyles,
  TaskDto,
  TaskStatusEnum,
} from "@/types/schema";
import { Droppable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";

interface IProps {
  col: KanbanColumnDto;
  colTasks: TaskDto[];
}

export default function KanbanColumn({ col, colTasks }: IProps) {
  const styles = statusStyles[col.id as TaskStatusEnum];
  return (
    <Card
      className={`flex-1 min-w-67.5 max-w-87.5 h-full flex flex-col bg-background border shrink-0 snap-center ${styles.border}`}
    >
      <CardHeader className="shrink-0">
        <CardTitle className="">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles.badge}`}
          >
            {col.title}
          </span>
        </CardTitle>
      </CardHeader>
      <Droppable droppableId={col.id}>
        {(provided) => (
          <CardContent
            className={cn("flex-1 overflow-y-auto space-y-3 p-4 min-h-0")}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {colTasks.map((colTask, idx) => (
              <KanbanTaskCard colTask={colTask} idx={idx} key={colTask.id} />
            ))}
            {provided.placeholder}
          </CardContent>
        )}
      </Droppable>
    </Card>
  );
}
