"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanColumnDto, TaskDto } from "@/types/schema";
import { Droppable } from "@hello-pangea/dnd";
import KanbanTaskCard from "./KanbanTaskCard";

interface IProps {
  col: KanbanColumnDto;
  colTasks: TaskDto[];
}

export default function KanbanColumn({ col, colTasks }: IProps) {
  return (
    <Card className="w-70 md:w-full h-full flex flex-col bg-background border shrink-0">
      <CardHeader className="shrink-0">
        <CardTitle>{col.title}</CardTitle>
      </CardHeader>
      <Droppable droppableId={col.id}>
        {(provided) => (
          <CardContent
            className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0"
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
