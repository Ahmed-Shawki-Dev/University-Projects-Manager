"use client";
import { updateTask } from "@/action/task/updateTask";
import { MilestoneDto, TaskDto, UpdateTaskDto } from "@/types/schema";
import { addTaskSchema, UpdateTaskType } from "@/validation/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Field, FieldError } from "./ui/field";
import { Input } from "./ui/input";
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
}: {
  currentTask: TaskDto;
  milestones: MilestoneDto[];
  taskId: string;
  onClose: () => void;
}) => {
  const form = useForm<UpdateTaskType>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: currentTask.title || "",
      description: currentTask.description || "",
      milestoneId: currentTask.milestoneId || "",
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

      const res = await updateTask(taskId, payload as unknown as UpdateTaskDto);

      if (res.isSuccess) {
        toast.success(res.message || "Task Updated Successfully");
        form.reset();
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
