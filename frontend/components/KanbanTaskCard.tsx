import { removeTask } from "@/action/task/removeTask";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MilestoneDto, TaskDto } from "@/types/schema";
import { Draggable } from "@hello-pangea/dnd";
import { Edit, X } from "lucide-react";
import { useState } from "react";
import UpdateTaskCard from "./UpdateTaskCard";
import { Button } from "./ui/button";

interface IProps {
  colTask: TaskDto;
  idx: number;
  milestones?: MilestoneDto[];
}

const KanbanTaskCard = ({ colTask, idx, milestones }: IProps) => {
  const [showUpdateTaskCard, setShowUpdateTaskCard] = useState(false);

  const milestone = milestones?.find((m) => m.id === colTask.milestoneId);

  if (showUpdateTaskCard) {
    return (
      <UpdateTaskCard
        milestones={milestones ?? []}
        taskId={colTask.id}
        currentTask={colTask}
        onClose={() => setShowUpdateTaskCard(false)}
      />
    );
  }

  return (
    <Draggable key={colTask.id} draggableId={colTask.id} index={idx}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style as React.CSSProperties}
          className="mb-2"
        >
          <CardHeader className="flex justify-between">
            <CardTitle>{colTask.title}</CardTitle>
            <div className="space-x-1">
              <Button
                variant={"outline"}
                size={"icon-xs"}
                onClick={() => setShowUpdateTaskCard(true)}
              >
                <Edit className="w-4 h-4 text-primary/70 cursor-pointer" />
              </Button>
              <Button
                variant={"destructive"}
                size={"icon-xs"}
                onClick={() => removeTask(colTask.id)}
              >
                <X />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs opacity-60 mb-3 line-clamp-2">
              {colTask.description}
            </p>

            <div className="text-xs opacity-60 line-clamp-2">
              Milestone : {milestone?.title ?? "Without Milestone"}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default KanbanTaskCard;
