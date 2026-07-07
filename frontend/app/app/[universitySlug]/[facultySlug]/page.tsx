import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
  }>;
}

export default async function FacultyRootPage({ params }: PageProps) {
  const { universitySlug, facultySlug } = await params;

  redirect(`/app/${universitySlug}/${facultySlug}/projects`);
}
