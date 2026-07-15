"use client";
import { createTask } from "@/action/task/createTask";
import {
  CreateTaskDto,
  MilestoneWithTasksDto,
  ProjectRouteParams,
} from "@/types/schema";
import { addTaskSchema } from "@/validation/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
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

const AddTaskCard = ({
  milestones,
}: {
  milestones: MilestoneWithTasksDto[];
}) => {
  const { universitySlug, facultySlug, projectSlug } = useParams();
  const [showCard, setShowCard] = useState(false);
  const form = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      milestoneId: "",
    },
  });

  const onSubmitHandler = async (data: z.infer<typeof addTaskSchema>) => {
    try {
      const payload = {
        ...data,
        milestoneId:
          data.milestoneId === "" || data.milestoneId === undefined
            ? null
            : data.milestoneId,
      };

      const res = await createTask(
        payload as CreateTaskDto,
        { universitySlug, facultySlug, projectSlug } as ProjectRouteParams,
      );

      if (res.isSuccess) {
        form.reset();
      }
    } catch {
      form.reset();
    }
  };

  return (
    <Card
      className={`w-full max-w-md p-0  ${showCard && "p-6"} shadow-none transition-all duration-300`}
    >
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="grid gap-4"
        onFocus={() => setShowCard(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            if (form.getValues("title").trim() === "") {
              setShowCard(false);
              form.reset();
            }
          }
        }}
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
                className={`${!showCard && "border-none"}`}
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className={`${!showCard && "hidden"}`}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className={`hidden gap-1.5 ${showCard && "grid"}`}
            >
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
            <Field
              data-invalid={fieldState.invalid}
              className={`hidden gap-1.5 ${showCard && "grid"}`}
            >
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

        <Button className={`hidden ${showCard && "grid"}`}>Create Task</Button>
      </form>
    </Card>
  );
};

export default AddTaskCard;
