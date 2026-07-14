"use client";

import { registerAction } from "@/action/auth/register";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFacultyStore } from "@/stores/facultyStore";
import { ProjectRouteParams } from "@/types/schema";
import { RegisterInput, registerSchema } from "@/validation/register";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function RegisterForm() {
  const facultyData = useFacultyStore((s) => s.facultyData);
  const universityName = facultyData?.university?.name;
  const facultyName = facultyData?.name;
  const slugs = useParams() as unknown as ProjectRouteParams;
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      studentCode: "",
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await registerAction(data, slugs);
      if (res.isSuccess) {
        router.push(`/app/${slugs.universitySlug}/${slugs.facultySlug}/login`);
        toast.success(res.message || "Project Created Successfully");
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
    <Card>
      <CardHeader className="space-y-4 pb-4 flex flex-col justify-center items-center">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-semibold tracking-tight flex justify-center flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>Register to</span>
            {universityName ? (
              <span className="text-primary font-bold">{universityName}</span>
            ) : (
              <Skeleton className="h-4 w-20 rounded-md inline-block animate-pulse" />
            )}
          </CardTitle>
          <div className="min-h-4">
            {facultyName ? (
              <p className="text-xs font-medium opacity-60 uppercase tracking-widest">
                Faculty of {facultyName}
              </p>
            ) : (
              <Skeleton className="h-3 w-40 rounded-md animate-pulse" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="register-form">
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-fullname">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="register-fullname"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="studentCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-studentcode">
                    Student Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-studentcode"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    type="email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    type="password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link
                    href={`/app/${slugs.universitySlug}/${slugs.facultySlug}/login`}
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
