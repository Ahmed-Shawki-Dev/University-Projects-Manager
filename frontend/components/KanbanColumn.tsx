import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanColumnDto, TaskDto } from "@/types/schema";
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

      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
        {colTasks.map((colTask) => (
          <KanbanTaskCard key={colTask.id} colTask={colTask} />
        ))}
      </CardContent>
    </Card>
  );
}
