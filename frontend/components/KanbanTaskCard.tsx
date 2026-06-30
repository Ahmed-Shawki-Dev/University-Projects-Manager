import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskDto } from "@/types/schema";
import { Draggable } from "@hello-pangea/dnd";

interface IProps {
  colTask: TaskDto;
  idx: number;
}

const KanbanTaskCard = ({ colTask, idx }: IProps) => {
  return (
    <Draggable key={colTask.id} draggableId={colTask.id} index={idx}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>{colTask.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p>{colTask.description}</p>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default KanbanTaskCard;
