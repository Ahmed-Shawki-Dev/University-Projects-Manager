export enum TaskStatusEnum {
  Todo = "Todo",
  InProgress = "InProgress",
  Review = "Review",
  Done = "Done",
}

export interface FacultyDto {
  id: string;
  name: string;
  slug: string;
  universityId: string;
}

export interface CreateFacultyDto {
  name: string;
  slug: string;
}
export interface UpdateFacultyDto {
  name: string;
}

export interface UniversityDto {
  id: string;
  name: string;
  slug: string;
}

export interface CreateUniversityDto {
  name: string;
  slug: string;
}

export interface UpdateUniversityDto {
  name: string;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
}

export interface UpdateTaskStatusDto {
  status: TaskStatusEnum;
}

export interface KanbanColumnDto {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoardDto {
  tasks: TaskDto[];
  columns: Record<TaskStatusEnum, KanbanColumnDto>;
  columnsOrder: TaskStatusEnum[];
}

export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: string;
}

export const statusStyles: Record<
  TaskStatusEnum,
  { badge: string; border: string }
> = {
  [TaskStatusEnum.Todo]: {
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    border: "border-t-slate-500/40",
  },
  [TaskStatusEnum.InProgress]: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    border: "border-t-amber-500/40",
  },
  [TaskStatusEnum.Review]: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    border: "border-t-purple-500/40",
  },
  [TaskStatusEnum.Done]: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    border: "border-t-emerald-500/40",
  },
};
