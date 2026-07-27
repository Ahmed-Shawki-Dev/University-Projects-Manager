import { z } from "zod";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const uploadTaskAttachmentsSchema = z.object({
  files: z
    .custom<File[]>()
    .refine((files) => files && files.length > 0, {
      message: "Please select at least one file.",
    })
    .refine((files) => files?.every((file) => file.size <= MAX_FILE_SIZE), {
      message: "Single file size cannot exceed 10 MB.",
    })
    .refine(
      (files) => {
        const totalSize = files?.reduce((acc, curr) => acc + curr.size, 0) || 0;
        return totalSize <= MAX_FILE_SIZE;
      },
      {
        message: "Total upload size cannot exceed 10 MB per request.",
      },
    ),
});

export type UploadAttachmentFormValues = z.infer<
  typeof uploadTaskAttachmentsSchema
>;
