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
import { Check, ChevronsUpDownIcon } from "lucide-react";
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
    <Card className="w-full max-w-md p-6 shadow-none animate-in fade-in-50 zoom-in-95 duration-200">
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="grid gap-4"
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1.5">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className={`gap-1.5`}>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Description (Optional)"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="milestoneId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className={`gap-1.5`}>
              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select Milestone" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="">No Milestone</SelectItem>
                  <SelectSeparator />
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="studentIds"
          control={form.control}
          render={({ field, fieldState }) => {
            const currentSelectedIds = field.value || [];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className={`grid gap-1.5`}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                    >
                      {currentSelectedIds.length === 0 ? (
                        <span className="opacity-60">Assign Students...</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                          {currentSelectedIds.map((id) => {
                            const member = teamMembers?.find(
                              (m) =>
                                m.id.toString().toLowerCase() ===
                                id.toString().toLowerCase(),
                            );
                            return (
                              <span
                                key={id}
                                className="bg-secondary text-secondary-foreground text-[11px] px-2 py-0.5 rounded-sm border"
                              >
                                {member?.name || "Unknown"}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search team members..." />
                      <CommandGroup className="max-h-60 overflow-y-auto">
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
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "h-4 w-4 shrink-0",
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <div className="flex items-center gap-2">
          <Button type="submit" className="flex-1">
            Update Task
          </Button>

          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UpdateTaskCard;
