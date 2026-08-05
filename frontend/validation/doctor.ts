import { z } from "zod";

export const CreateDoctorSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  academicRank: z.string().optional(),
});

export type DoctorSchemaType = z.infer<typeof CreateDoctorSchema>;
