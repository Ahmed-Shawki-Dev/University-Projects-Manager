import * as z from "zod";

export const addTaskSchema = z.object({
  title: z.string().min(1, "Title Required"),
  description: z.string().optional(),
  milestoneId: z.string().optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title Required"),
  description: z.string().optional(),
  milestoneId: z.string().optional(),
});

export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
