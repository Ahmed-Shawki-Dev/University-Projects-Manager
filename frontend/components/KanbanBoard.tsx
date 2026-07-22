"use client";
import { updateTaskStatus } from "@/action/task/updateTaskStatus";
import {
  KanbanColumnDto,
  MilestoneWithTasksDto,
  TaskDto,
  TaskStatusEnum,
  TeamMemberDto,
} from "@/types/schema";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useOptimistic, useState, useTransition } from "react";
import KanbanColumn from "./KanbanColumn";
import KanbanTaskCard from "./KanbanTaskCard";

interface IProps {
  columns: Record<TaskStatusEnum, KanbanColumnDto>;
  columnsOrder: TaskStatusEnum[];
  tasks: TaskDto[];
  milestones?: MilestoneWithTasksDto[];
  isProfessor?: boolean;
  teamMembers?: TeamMemberDto[];
}

const KanbanBoard = ({
  columnsOrder,
  columns,
  tasks,
  milestones,
  isProfessor = false,
  teamMembers,
}: IProps) => {
  const [isPending, startTransition] = useTransition();

  const [activeTask, setActiveTask] = useState<TaskDto | null>(null);

  const [optimisticColumns, setOptimisticColumns] = useOptimistic(
    columns,
    (currentStatus, updatedColumns: Record<TaskStatusEnum, KanbanColumnDto>) =>
      updatedColumns,
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    if (isProfessor) return;
    const { active, over } = event;
    if (!over) return;

    const draggableId = active.id as string;
    const newStatus = over.id as TaskStatusEnum;

    const oldStatus = Object.keys(optimisticColumns).find((key) =>
      optimisticColumns[key as TaskStatusEnum].taskIds.includes(draggableId),
    ) as TaskStatusEnum;

    if (!oldStatus || oldStatus === newStatus) return;

    startTransition(async () => {
      const columnCopy = JSON.parse(JSON.stringify(optimisticColumns));

      columnCopy[oldStatus].taskIds = columnCopy[oldStatus].taskIds.filter(
        (id: string) => id !== draggableId,
      );
      columnCopy[newStatus].taskIds.push(draggableId);

      setOptimisticColumns(columnCopy);
      await updateTaskStatus(draggableId, { status: newStatus });
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 mt-6 items-start justify-start h-full overflow-x-auto pb-4 px-2 min-w-full touch-pan-x">
        {columnsOrder.map((col) => {
          const colTasks = tasks.filter((task) =>
            optimisticColumns[col].taskIds.includes(task.id),
          );
          return (
            <KanbanColumn
              col={optimisticColumns[col]}
              colTasks={colTasks}
              key={col}
              milestones={milestones}
              isProfessor={isProfessor}
              teamMembers={teamMembers ?? []}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="scale-105 opacity-90 shadow-2xl cursor-grabbing">
            <KanbanTaskCard
              colTask={activeTask}
              milestones={milestones}
              isProfessor={isProfessor}
              teamMembers={teamMembers ?? []}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
