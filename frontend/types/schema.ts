export enum TaskStatusEnum {
  Todo = "Todo",
  InProgress = "InProgress",
  Review = "Review",
  Done = "Done",
}

export enum ProjectType {
  CourseProject = "CourseProject",
  UniversityProject = "UniversityProject",
  GraduationProject = "GraduationProject",
}

export interface RegisterDto {
  email: string;
  fullName: string;
  studentCode: string;
  password: string;
}

export interface RegisterResponseDto {
  email: string;
  fullName: string;
  studentCode: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserHeaderDto {
  email: string;
  fullName: string;
  userRole: "Student" | "Doctor" | "Admin";
  universitySlug: string;
  facultySlug: string;
}

export interface LoginResponseDto {
  user: UserHeaderDto;
  token: string;
}

// 3. Infrastructure Types
export interface UniversityDto {
  id: string;
  name: string;
  slug: string;
}

export interface FacultyDto {
  id: string;
  name: string;
  slug: string;
  universityId: string;
}

// 4. Project Types
export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: ProjectType;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  totalProjectGrade: number;
  deadline: Date;
  type: ProjectType;
  maxStudents: number;
}

export interface MilestoneDto {
  id: string;
  title: string;
  description: string | null;
  maxGrade: number;
  startDate: string;
  dueDate: string;
  projectId: string;
}

export interface MilestoneWithTasksDto {
  id: string;
  title: string;
  description: string | null;
  maxGrade: number;
  startDate: string;
  dueDate: string;
  tasks: TaskDto[];
}

export interface CreateMilestoneDto {
  title: string;
  description: string | null;
  maxGrade: number;
  startDate: string;
  dueDate: string;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusEnum;
  milestoneId: string | null;
}

export interface CreateTaskDto {
  title: string;
  description: string | null;
  milestoneId: string | null;
}
export interface UpdateTaskDto {
  title: string;
  description: string | null;
  milestoneId: string | null;
}

export interface UpdateTaskStatusDto {
  status: TaskStatusEnum;
}

export interface KanbanColumnDto {
  id: TaskStatusEnum;
  title: string;
  taskIds: string[];
}

export interface KanbanBoardDto {
  tasks: TaskDto[];
  columns: Record<TaskStatusEnum, KanbanColumnDto>;
  columnsOrder: TaskStatusEnum[];
}

export const statusStyles: Record<
  TaskStatusEnum,
  { badge: string; border: string; label: string }
> = {
  [TaskStatusEnum.Todo]: {
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    border: "border-t-slate-500/40",
    label: "To Do",
  },
  [TaskStatusEnum.InProgress]: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    border: "border-t-amber-500/40",
    label: "In Progress",
  },
  [TaskStatusEnum.Review]: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    border: "border-t-purple-500/40",
    label: "Review",
  },
  [TaskStatusEnum.Done]: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    border: "border-t-emerald-500/40",
    label: "Done",
  },
};

export interface ProjectRouteParams {
  universitySlug: string;
  facultySlug: string;
  projectSlug?: string;
}

// Faculty
export interface FacultyLayoutDto {
  id: number;
  name: string;
  slug: string;
  universityId: number;
  university: UniversityDto | null;
}

// Projects In Explore Page
export interface ProjectExploreDto {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  type: "CourseProject" | "UniversityProject" | "GraduationProject";
  maxStudents: number;
  currentStudentCount: number;
  isCurrentStudentJoined: boolean;
  isFull: boolean;
}

// ** Doctor Dashboard Types
export interface DoctorDashboardStatsCards {
  projectsCount: number;
  studentsCount: number;
  finishedTasksCount: number;
}

export interface DoctorDashboardMilestoneDto {
  id: string;
  title: string;
  projectName: string;
  dueDate: string;
}

export interface DoctorDashboardAlertDto {
  id: string;
  projectName: string;
  alertType: string;
  message: string;
  dueDate: string;
}

export interface DoctorDashboardResponseDto {
  statsCards: DoctorDashboardStatsCards;
  upcomingMilestones: DoctorDashboardMilestoneDto[];
  doctorAlerts: DoctorDashboardAlertDto[];
}

// ** Student Dashboard Types
export interface StudentDashboardCardStats {
  pendingTasks: number;
  inProgressTasks: number;
  overdueMilestones: number;
}

export interface StudentDashboardCurrentMilestoneProgressDto {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalTasksCount: number;
  completedTasksCount: number;
  progressPercentage: number;
}

export interface StudentDashboardResponseDto {
  stats: StudentDashboardCardStats;
  currentMilestone: StudentDashboardCurrentMilestoneProgressDto | null;
}

export interface TeamMemberDto {
  name: string;
  email: string;
  isLeader: boolean;
  isMe: boolean;
}
