"use client";
import { loginAction } from "@/action/auth/login";
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
import { LoginInput, loginSchema } from "@/validation/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm() {
  const facultyData = useFacultyStore((s) => s.facultyData);
  const universityName = facultyData?.university?.name;
  const facultyName = facultyData?.name;

  const slugs = useParams() as unknown as ProjectRouteParams;
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await loginAction(data, slugs);
      if (res.isSuccess) {
        router.push(`/app/${slugs.universitySlug}/${slugs.facultySlug}`);
        toast.success(res.message || "Login done successfully");
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
            <span>Login to</span>
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
        <form onSubmit={handleSubmit(onSubmit)} id={"login-form"}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="example@muc.edu.eg"
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" disabled={isSubmitting} form="login-form">
                {isSubmitting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/app/${slugs.universitySlug}/${slugs.facultySlug}/register`}
                >
                  Sign up
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
