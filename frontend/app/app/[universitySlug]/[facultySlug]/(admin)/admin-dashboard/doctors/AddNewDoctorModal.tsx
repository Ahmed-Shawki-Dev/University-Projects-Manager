"use client";

import { createNewDoctor } from "@/action/doctors/addNewDoctor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CreateDoctorDto, ProjectRouteParams } from "@/types/schema";
import { CreateDoctorSchema, DoctorSchemaType } from "@/validation/doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddNewDoctorModal() {
  const [open, setOpen] = useState(false);
  const slugs = useParams();

  const form = useForm<DoctorSchemaType>({
    resolver: zodResolver(CreateDoctorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      academicRank: "Doctor",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: DoctorSchemaType) => {
    try {
      const res = await createNewDoctor(
        slugs as unknown as ProjectRouteParams,
        data as unknown as CreateDoctorDto,
      );

      if (res.isSuccess) {
        toast.success(res.message || "Doctor Added Successfully!");
        setOpen(false);
        form.reset();
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
        <Button className="gap-2 font-medium">
          <Plus className="w-4 h-4" />
          Add New Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Register New Doctor
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 py-2"
        >
          {/* Full Name */}
          <div>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter Doctor's name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Email */}
          <div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id={field.name}
                    placeholder="Enter Doctor's email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Password */}
          <div>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="*******"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Academic Rank */}
          <div>
            <Controller
              name="academicRank"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Academic Rank (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g., Professor / Associate Professor / Doctor"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Doctor...
              </>
            ) : (
              "Add Doctor"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
