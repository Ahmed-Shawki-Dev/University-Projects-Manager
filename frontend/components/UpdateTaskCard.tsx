"use client";

import { updateTask } from "@/action/task/updateTask";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn, getAvatarIcon } from "@/lib/utils";
import {
  MilestoneWithTasksDto,
  ProjectRouteParams,
  TaskDto,
  TeamMemberDto,
  UpdateTaskDto,
} from "@/types/schema";
import { addTaskSchema, UpdateTaskType } from "@/validation/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Flag, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Field, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const UpdateTaskCard = ({
  milestones,
  currentTask,
  taskId,
  onClose,
  teamMembers,
}: {
  currentTask: TaskDto;
  milestones: MilestoneWithTasksDto[];
  taskId: string;
  onClose: () => void;
  teamMembers: TeamMemberDto[];
}) => {
  const { universitySlug, facultySlug, projectSlug } = useParams();

  const form = useForm<UpdateTaskType>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: currentTask.title || "",
      description: currentTask.description || "",
      milestoneId: currentTask.milestoneId || "",
      studentIds: currentTask.assignedStudents?.map((s) => s.id) || [],
    },
  });

  const onSubmitHandler = async (data: UpdateTaskType) => {
    try {
      const payload = {
        ...data,
        milestoneId:
          data.milestoneId === "" || data.milestoneId === undefined
            ? null
            : data.milestoneId,
      };

      const res = await updateTask(
        taskId,
        payload as unknown as UpdateTaskDto,
        {
          universitySlug,
          facultySlug,
          projectSlug,
        } as unknown as ProjectRouteParams,
      );

      if (res.isSuccess) {
        toast.success(res.message || "Task Updated Successfully");
        onClose();
      }
    } catch {
      toast.error("Server Error");
    }
  };

  return (
    <Card className="w-full max-w-md p-3 shadow-md border border-primary/40 animate-in fade-in-50 zoom-in-95 duration-200">
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-3">
        {/* Title Input */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Title"
                autoComplete="off"
                className="h-8 text-sm placeholder:text-muted-foreground focus-visible:ring-1"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description Input */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Description (Optional)"
                autoComplete="off"
                className="h-8 text-xs bg-muted/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Options Toolbar */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-border/40">
          {/* Milestone Select */}
          <Controller
            name="milestoneId"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedMilestone = milestones.find(
                (m) => m.id === field.value,
              );

              return (
                <Select
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="h-8 w-15 p-0 shrink-0 flex items-center justify-center border-dashed relative"
                  >
                    <Flag
                      className={cn(
                        "w-4 h-4 text-muted-foreground",
                        selectedMilestone && "text-primary fill-primary/20",
                      )}
                    />
                    <span className="sr-only">
                      <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="">No Milestone</SelectItem>
                    <SelectSeparator />
                    {milestones.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />

          {/* Assignees Popover */}
          <Controller
            name="studentIds"
            control={form.control}
            render={({ field }) => {
              const currentSelectedIds = field.value || [];

              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      className="h-8 w-8 p-0 border-dashed shrink-0"
                    >
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search team members..."
                        className="h-8 text-xs"
                      />
                      <CommandGroup className="max-h-48 overflow-y-auto">
                        {teamMembers?.map((member) => {
                          const isSelected = currentSelectedIds.some(
                            (id) =>
                              id.toString().toLowerCase() ===
                              member.id.toString().toLowerCase(),
                          );
                          return (
                            <CommandItem
                              key={member.id}
                              value={member.name}
                              onSelect={() => {
                                const nextIds = isSelected
                                  ? currentSelectedIds.filter(
                                      (id) =>
                                        id.toString().toLowerCase() !==
                                        member.id.toString().toLowerCase(),
                                    )
                                  : [...currentSelectedIds, member.id];
                                field.onChange(nextIds);
                              }}
                              className="text-xs"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "h-3.5 w-3.5 shrink-0",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <span className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-secondary text-[9px] font-bold border">
                                  {getAvatarIcon(member.name)}
                                </span>
                                <span className="truncate">{member.name}</span>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit" size="sm" className="h-7 text-xs px-3">
            Update Task
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UpdateTaskCard;
