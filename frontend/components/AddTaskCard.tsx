"use client";
import { createTask } from "@/action/task/createTask";
import { cn, getAvatarIcon } from "@/lib/utils";
import {
  CreateTaskDto,
  MilestoneWithTasksDto,
  ProjectRouteParams,
  TeamMemberDto,
} from "@/types/schema";
import { addTaskSchema } from "@/validation/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Command, CommandGroup, CommandInput, CommandItem } from "./ui/command";
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

const AddTaskCard = ({
  milestones,
  teamMembers,
}: {
  milestones: MilestoneWithTasksDto[];
  teamMembers: TeamMemberDto[];
}) => {
  const { universitySlug, facultySlug, projectSlug } = useParams();
  const [showCard, setShowCard] = useState(false);
  const form = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      milestoneId: "",
      studentIds: [],
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

        <Controller
          name="studentIds"
          control={form.control}
          render={({ field, fieldState }) => {
            const currentSelectedIds = field.value || [];
            return (
              <Field
                data-invalid={fieldState.invalid}
                className={`hidden gap-1.5 ${showCard && "grid"}`}
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
                            const member = teamMembers.find((m) => m.id === id);
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
                          const isSelected = currentSelectedIds.includes(
                            member.id,
                          );
                          return (
                            <CommandItem
                              key={member.id}
                              value={member.name}
                              onSelect={() => {
                                const nextIds = isSelected
                                  ? currentSelectedIds.filter(
                                      (id) => id !== member.id,
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

        <Button className={`hidden ${showCard && "grid"}`}>Create Task</Button>
      </form>
    </Card>
  );
};

export default AddTaskCard;
