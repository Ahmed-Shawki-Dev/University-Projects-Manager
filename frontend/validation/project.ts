import { ProjectType } from "@/types/schema";
import * as z from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string().optional(),
  totalProjectGrade: z.number().min(1, "Project grade required"),
  deadline: z.date(),
  type: z.enum(ProjectType),
});

export type ProjectSchemaType = z.infer<typeof CreateProjectSchema>;
