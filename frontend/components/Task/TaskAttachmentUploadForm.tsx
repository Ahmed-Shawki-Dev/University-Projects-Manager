"use client";

import { uploadTaskAttachments } from "@/action/taskAttachments/uploadTaskAttachments";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { uploadTaskAttachmentsSchema } from "@/validation/taskAttachments";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  UploadCloud,
  XIcon,
} from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/"))
    return <ImageIcon className="w-4 h-4 text-blue-500" />;
  if (fileType.includes("pdf"))
    return <FileTextIcon className="w-4 h-4 text-red-500" />;
  return <FileIcon className="w-4 h-4 text-muted-foreground" />;
};

export default function TaskAttachmentUploadForm({
  taskId,
}: {
  taskId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(uploadTaskAttachmentsSchema),
    defaultValues: {
      files: [],
    },
  });

  const selectedFiles = watch("files") as File[];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length === 0) return;

    const newFilesArray = Array.from(newFiles);
    const currentFiles = (watch("files") as File[]) || [];

    const mergedFiles = [...currentFiles, ...newFilesArray];

    const uniqueFiles = mergedFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size),
    );

    setValue("files", uniqueFiles, { shouldValidate: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter(
      (_, idx) => idx !== indexToRemove,
    );
    setValue("files", updatedFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: { files: File[] }) => {
    const res = await uploadTaskAttachments(taskId, data);

    if (res.isSuccess) {
      toast.success("Files uploaded successfully");
      reset();
      mutate(`task-attachments-${taskId}`);
    } else {
      toast.error(res.message || "Error while adding files");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.docx"
      />

      <div
        onClick={handleButtonClick}
        className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-muted/5 hover:bg-muted/15 flex flex-col items-center justify-center gap-2 group"
      >
        <div className="p-2.5 bg-primary/10 rounded-full text-primary group-hover:scale-105 transition-transform">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium">Click to upload attachments</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            PDF, PNG, JPG or DOCX (Max 10MB each)
          </p>
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Selected Files ({selectedFiles.length})
          </p>

          <div className="flex flex-col gap-2">
            {selectedFiles.map((file, idx) => (
              <Attachment
                key={`${file.name}-${idx}`}
                state={isSubmitting ? "uploading" : "done"}
              >
                <AttachmentMedia>{getFileIcon(file.type)}</AttachmentMedia>

                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => handleRemoveFile(idx)}
                    disabled={isSubmitting}
                  >
                    <XIcon className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </div>
        </div>
      )}

      {errors.files && (
        <p className="text-xs text-destructive font-medium">
          {errors.files.message as string}
        </p>
      )}

      {selectedFiles && selectedFiles.length > 0 && (
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Uploading files..." : "Upload Selected Files"}
        </Button>
      )}
    </form>
  );
}
