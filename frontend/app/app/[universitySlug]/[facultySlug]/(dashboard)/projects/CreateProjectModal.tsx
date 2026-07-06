"use client";
import { createProject } from "@/action/project/createProject";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateProjectDto,
  ProjectRouteParams,
  ProjectType,
} from "@/types/schema";
import { CreateProjectSchema, ProjectSchemaType } from "@/validation/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const { universitySlug, facultySlug } = useParams();
  const form = useForm({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      totalProjectGrade: 0,
      type: undefined,
      deadline: undefined,
    },
  });

  const onSubmit = async (data: ProjectSchemaType) => {
    try {
      const res = await createProject(
        data as unknown as CreateProjectDto,
        { universitySlug, facultySlug } as ProjectRouteParams,
      );

      if (res.isSuccess) {
        toast.success(res.message || "Project Created Successfully");
        form.reset();
        setOpen(false);
      } else {
        form.setError("root", {
          message: res.message || "Something went wrong",
        });
        toast.error(res.message);
      }
    } catch {
      form.setError("root", { message: "Network error, please try again." });
      toast.error("Network error, please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <Plus />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-175 md:max-w-125">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="create-project-form"
          className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3"
        >
          <div className="md:col-span-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="md:col-span-3">
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Description (optional)"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="md:col-span-1">
            <Controller
              name="totalProjectGrade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Grade</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min={"0"}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="md:col-span-1">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col gap-1.5"
                >
                  <FieldLabel>Project Type</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="project-type-trigger">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectType.CourseProject}>
                        Course Project
                      </SelectItem>
                      <SelectItem value={ProjectType.UniversityProject}>
                        University Project
                      </SelectItem>
                      <SelectItem value={ProjectType.GraduationProject}>
                        Graduation Project
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="md:col-span-1">
            <Controller
              name="deadline"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col gap-1.5"
                >
                  <FieldLabel>Deadline</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd MMMM")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>
        <DialogFooter>
          <Button form="create-project-form">Add Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
