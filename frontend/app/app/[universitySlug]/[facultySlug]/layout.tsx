import { getFacultyLayoutDetails } from "@/action/faculty/getFacultyLayout";
import { FacultyInitializer } from "@/providers/FacultyStoreProvider";
import { ProjectRouteParams } from "@/types/schema";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function FacultyLayout({ children, params }: IProps) {
  const faculty = await getFacultyLayoutDetails(
    (await params) as unknown as ProjectRouteParams,
  );

  console.log(faculty);

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
