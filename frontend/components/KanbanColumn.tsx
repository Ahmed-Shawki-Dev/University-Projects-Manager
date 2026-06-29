import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KanbanTaskCard from "./KanbanTaskCard";

export default function KanbanColumn() {
  return (
    <Card className="w-70 md:w-full h-full flex flex-col bg-background border shrink-0">
      <CardHeader className="shrink-0">
        <CardTitle>Todo</CardTitle>
        <CardDescription>Todo Description</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
        <KanbanTaskCard />
        <KanbanTaskCard />
      </CardContent>
    </Card>
  );
}
