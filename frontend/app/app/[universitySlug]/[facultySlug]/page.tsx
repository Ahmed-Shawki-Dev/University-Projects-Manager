import { getCurrentUser } from "@/action/auth/me";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
  }>;
}

export default async function FacultyRootPage({ params }: PageProps) {
  const { universitySlug, facultySlug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/app/${universitySlug}/${facultySlug}/login`);
  }

  switch (user.userRole) {
    case "Admin":
      redirect(`/app/${universitySlug}/${facultySlug}/admin-dashboard`);

    case "Doctor":
      redirect(`/app/${universitySlug}/${facultySlug}/doctor-dashboard`);

    case "Student":
      redirect(`/app/${universitySlug}/${facultySlug}/projects`);

    default:
      redirect(`/app/${universitySlug}/${facultySlug}/login`);
  }
}
