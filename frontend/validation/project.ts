import { ProjectType } from "@/types/schema";
import * as z from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string().optional(),
  totalProjectGrade: z.number().min(1, "Project grade required"),
  deadline: z.date("Please pick a deadline"),
  type: z.enum(ProjectType, "Please select project type"),
  maxStudents: z.number().min(1, "Team members must be more than 0"),
});

export type ProjectSchemaType = z.infer<typeof CreateProjectSchema>;
