import { KanbanColumnDto, TaskDto, TaskStatusEnum } from "@/types/schema";
import KanbanColumn from "./KanbanColumn";

interface IProps {
  columns: Record<string, KanbanColumnDto>;
  columnsOrder: TaskStatusEnum[];
  tasks: TaskDto[];
}

const KanbanBoard = ({ columnsOrder, columns, tasks }: IProps) => {
  console.log(columnsOrder);
  return (
    <div className="flex md:grid md:grid-cols-4 gap-4 mt-6 w-full h-[calc(100vh-160px)] overflow-x-auto pb-4">
      {columnsOrder.map((col) => {
        const colTasks = tasks.filter((task) =>
          columns[col].taskIds.includes(task.id),
        );
        return (
          <KanbanColumn key={col} col={columns[col]} colTasks={colTasks} />
        );
      })}
    </div>
  );
};

export default KanbanBoard;
