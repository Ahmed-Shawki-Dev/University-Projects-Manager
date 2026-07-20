import * as z from "zod";

export const addTaskSchema = z.object({
  title: z.string().min(1, "Title Required"),
  description: z.string().optional(),
  milestoneId: z.string().optional(),
  studentIds: z.array(z.string()),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title Required"),
  description: z.string().optional(),
  milestoneId: z.string().optional(),
  studentIds: z.array(z.string()),
});

export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
