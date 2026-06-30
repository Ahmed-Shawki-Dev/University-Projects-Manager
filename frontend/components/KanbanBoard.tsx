"use client";
import { updateTaskStatus } from "@/action/task/updateTaskStatus";
import { KanbanColumnDto, TaskDto, TaskStatusEnum } from "@/types/schema";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useOptimistic, useTransition } from "react";
import KanbanColumn from "./KanbanColumn";

interface IProps {
  columns: Record<TaskStatusEnum, KanbanColumnDto>;
  columnsOrder: TaskStatusEnum[];
  tasks: TaskDto[];
}

const KanbanBoard = ({ columnsOrder, columns, tasks }: IProps) => {
  const [isPending, startTransition] = useTransition();

  const [optimisticColumns, setOptimisticColumns] = useOptimistic(
    columns,
    (currentStatus, updatedColumns: Record<TaskStatusEnum, KanbanColumnDto>) =>
      updatedColumns,
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!result.destination) return;
    if (result.destination == null) return;

    startTransition(async () => {
      const columnCopy = { ...optimisticColumns };

      const oldStatus = source.droppableId as TaskStatusEnum;
      const newStatus = destination?.droppableId as TaskStatusEnum;

      const sourceTaskIds = [...columnCopy[oldStatus].taskIds];
      const destinationTaskIds = [...columnCopy[newStatus].taskIds];

      const [removedId] = sourceTaskIds.splice(source.index, 1);

      if (oldStatus === newStatus) {
        sourceTaskIds.splice(destination?.index ?? 0, 0, removedId);
        columnCopy[oldStatus] = {
          ...columnCopy[oldStatus],
          taskIds: sourceTaskIds,
        };
      } else {
        destinationTaskIds.splice(destination?.index ?? 0, 0, removedId);

        columnCopy[oldStatus] = {
          ...columnCopy[oldStatus],
          taskIds: sourceTaskIds,
        };
        columnCopy[newStatus] = {
          ...columnCopy[newStatus],
          taskIds: destinationTaskIds,
        };
      }
      setOptimisticColumns(columnCopy);

      await updateTaskStatus(draggableId, { status: newStatus });
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 mt-6 w-full min-w-full items-start justify-start h-[calc(100vh-160px)] overflow-x-auto pb-4 px-2 snap-x">
        {columnsOrder.map((col) => {
          const colTasks = tasks.filter((task) =>
            optimisticColumns[col].taskIds.includes(task.id),
          );
          return (
            <KanbanColumn
              col={optimisticColumns[col]}
              colTasks={colTasks}
              key={col}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
