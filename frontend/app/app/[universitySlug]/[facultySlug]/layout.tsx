import { getFacultyLayoutDetails } from "@/action/faculty/getFacultyLayout";
import { FacultyInitializer } from "@/providers/FacultyStoreProvider";
import { ProjectRouteParams } from "@/types/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const resolvedParams = await params;
  const faculty = await getFacultyLayoutDetails(
    resolvedParams as unknown as ProjectRouteParams,
  );

  if (!faculty?.data) {
    return {
      title: "Faculty Not Found",
    };
  }

  const facultyName = faculty.data.name || "Faculty";
  const universityName = faculty.data.university?.name || "University";

  return {
    title: `${universityName} | ${facultyName}`,
    description: `Official page for ${facultyName} at ${universityName}`,
  };
}

export default async function FacultyLayout({ children, params }: IProps) {
  const faculty = await getFacultyLayoutDetails(
    (await params) as unknown as ProjectRouteParams,
  );

  if (faculty.status === 404) {
    notFound();
  }

  return (
    <>
      <FacultyInitializer data={faculty.data} />
      <main>{children}</main>
    </>
  );
}
