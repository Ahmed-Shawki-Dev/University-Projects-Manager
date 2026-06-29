import { columnOrder } from "@/mock/taskMock";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  return (
    <div className="flex md:grid md:grid-cols-4 gap-4 mt-6 w-full h-[calc(100vh-160px)] overflow-x-auto pb-4">
      {" "}
      {columnOrder.map((column) => {
        return <KanbanColumn key={column} />;
      })}
    </div>
  );
};

export default KanbanBoard;
