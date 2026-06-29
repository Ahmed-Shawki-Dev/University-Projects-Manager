export type TaskStatusEnum = "Todo" | "InProgress" | "Review" | "Done";

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
