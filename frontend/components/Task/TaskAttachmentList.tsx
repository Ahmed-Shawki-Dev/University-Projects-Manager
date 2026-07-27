"use client";

import { getTaskAttachments } from "@/action/taskAttachments/getTaskAttachments";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { TaskAttachmentDto } from "@/types/schema";
import { ExternalLink, FileIcon, FileTextIcon, ImageIcon } from "lucide-react";
import useSWR from "swr";

const getFileIcon = (fileType: string) => {
  if (fileType?.startsWith("image/"))
    return <ImageIcon className="w-4 h-4 text-blue-500" />;
  if (fileType?.includes("pdf"))
    return <FileTextIcon className="w-4 h-4 text-red-500" />;
  return <FileIcon className="w-4 h-4 text-muted-foreground" />;
};

export default function TaskAttachmentList({ taskId }: { taskId: string }) {
  const { data: res, isLoading } = useSWR(`task-attachments-${taskId}`, () =>
    getTaskAttachments(taskId),
  );

  const attachments = res?.data || [];

  if (isLoading) {
    return (
      <p className="text-xs text-muted-foreground animate-pulse">
        Loading attachments...
      </p>
    );
  }

  if (attachments.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">
        No attachments uploaded yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 ">
      {attachments.map((att: TaskAttachmentDto) => (
        <Attachment key={att.id}>
          <AttachmentMedia>{getFileIcon(att.fileType)}</AttachmentMedia>

          <AttachmentContent>
            <AttachmentTitle className="line-clamp-1">
              {att.fileName}
            </AttachmentTitle>
            <AttachmentDescription>
              {(att.fileSize / (1024 * 1024)).toFixed(2)} MB • Uploaded by{" "}
              <span className="font-medium text-foreground">
                {att.uploaderName}
              </span>
            </AttachmentDescription>
          </AttachmentContent>

          <AttachmentActions>
            <a
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/${att.fileUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <AttachmentAction type="button" aria-label="Open attachment">
                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </AttachmentAction>
            </a>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  );
}
