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
import { Check, Flag, Plus, Users } from "lucide-react";
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

interface AddTaskCardProps {
  milestones: MilestoneWithTasksDto[];
  teamMembers: TeamMemberDto[];
}

const AddTaskCard = ({ milestones, teamMembers }: AddTaskCardProps) => {
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
        {
          universitySlug,
          facultySlug,
          projectSlug,
        } as ProjectRouteParams,
      );

      if (res.isSuccess) {
        form.reset();
        setShowCard(false);
      }
    } catch {
      form.reset();
    }
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md p-0 shadow-sm border border-border/60 transition-all duration-200",
        showCard && "p-4 border-primary/40 shadow-md",
      )}
    >
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="space-y-3"
        onFocus={() => setShowCard(true)}
        onBlur={(e) => {
          const formElement = e.currentTarget;

          setTimeout(() => {
            const activeEl = document.activeElement;

            const isInsideForm = formElement?.contains(activeEl);

            const isInsidePortal =
              activeEl?.closest &&
              (activeEl.closest("[data-radix-popper-content-wrapper]") ||
                activeEl.closest("[role='dialog']") ||
                activeEl.closest("[role='listbox']"));

            if (!isInsideForm && !isInsidePortal) {
              if (form.getValues("title").trim() === "") {
                setShowCard(false);
                form.reset();
              }
            }
          }, 0);
        }}
        onMouseDown={(e) => {
          if (
            e.target === e.currentTarget ||
            (e.target as HTMLElement).tagName === "DIV"
          ) {
            e.preventDefault();
          }
        }}
      >
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
                placeholder={showCard ? "Title" : "Add A Task"}
                autoComplete="off"
                className={cn(
                  "h-8 text-sm placeholder:text-muted-foreground focus-visible:ring-1",
                  !showCard && "border-none shadow-none px-2",
                )}
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className={cn(!showCard && "hidden")}
                />
              )}
            </Field>
          )}
        />

        {/* Expanded Fields */}
        {showCard && (
          <>
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Bottom Actions Toolbar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
              <div className="flex items-center gap-1.5">
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
                              selectedMilestone &&
                                "text-primary fill-primary/20",
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
                            className="h-8 w-8 p-0 border-dashed"
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
                                    className="text-xs"
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <Check
                                        className={cn(
                                          "h-3.5 w-3.5 shrink-0",
                                          isSelected
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      <span className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-secondary text-[9px] font-bold border">
                                        {getAvatarIcon(member.name)}
                                      </span>
                                      <span className="truncate">
                                        {member.name}
                                      </span>
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

              {/* Form Controls */}
              <div className="flex items-center justify-end gap-1">
                <Button type="submit" size="icon-xs" className="h-8 w-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </Card>
  );
};

export default AddTaskCard;
