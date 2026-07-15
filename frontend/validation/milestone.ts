import * as z from "zod";

export const CreateMilestoneSchema = z.object({
  title: z.string().min(1, "Milestone title required"),
  description: z.string().optional(),
  maxGrade: z.number().min(1, "Grade must be more than 0"),
  startDate: z.date("Please pick a deadline"),
  dueDate: z.date("Please pick a deadline"),
});

export type MilestoneSchemaType = z.infer<typeof CreateMilestoneSchema>;
