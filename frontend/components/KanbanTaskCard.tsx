import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskDto } from "@/types/schema";

interface IProps {
  colTask: TaskDto;
}

const KanbanTaskCard = ({ colTask }: IProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{colTask.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p>{colTask.description}</p>
      </CardContent>
    </Card>
  );
};

export default KanbanTaskCard;
