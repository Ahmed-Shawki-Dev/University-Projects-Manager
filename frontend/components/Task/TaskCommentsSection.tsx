"use client";

import createTaskComment from "@/action/taskComments/createTaskComment";
import getAllTaskComments from "@/action/taskComments/getAllTaskComments";
import { format } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface IProps {
  taskId: string;
}

export default function TaskCommentsSection({ taskId }: IProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    data: commentsResponse,
    error,
    isLoading,
    mutate,
  } = useSWR(taskId ? `task-comments-${taskId}` : null, () =>
    getAllTaskComments(taskId),
  );

  const comments = commentsResponse?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    try {
      setSubmitting(true);

      const res = await createTaskComment(taskId, { content });

      if (res.isSuccess) {
        setContent("");
        mutate();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col  h-100 justify-between gap-4 p-1">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-xs text-destructive text-center">
            Failed to load comments
          </p>
        ) : comments?.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center pt-10">
            No comments yet.
          </p>
        ) : (
          comments?.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-lg bg-muted/30 border text-xs space-y-1"
            >
              <div className="flex justify-between font-semibold">
                <span>{comment.author.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {format(comment.createdAt, "hh:mm a")}
                </span>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="pt-2 border-t space-y-2">
        <Textarea
          placeholder="Enter a comment.."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-17.5 text-xs resize-none"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || submitting}
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="ml-1.5 text-xs">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
