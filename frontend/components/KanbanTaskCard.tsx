import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MilestoneDto, TaskDto } from "@/types/schema";
import { Draggable } from "@hello-pangea/dnd";

interface IProps {
  colTask: TaskDto;
  idx: number;
  milestones?: MilestoneDto[];
}

const KanbanTaskCard = ({ colTask, idx, milestones }: IProps) => {
  const milestone = milestones?.find((m) => m.id === colTask.milestoneId);
  console.log(milestones);
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
          <CardHeader>
            <CardTitle>{colTask.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-primary/50 mb-3 line-clamp-2">
              {colTask.description}
            </p>

            <div className="text-xs text-primary/30 line-clamp-2">
              Milestone : {milestone?.title ?? "Without Milestone"}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default KanbanTaskCard;
