import { getAllStudents } from "@/action/students/getAllStudents";
import PageHeader from "@/components/PageHeader";
import { ProjectRouteParams } from "@/types/schema";
import StudentsTable from "./StudentsTable";

interface IProps {
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function AdminStudentsPage({ params }: IProps) {
  const slugs = (await params) as unknown as ProjectRouteParams;
  const doctors = await getAllStudents(slugs);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Students"
        description="Manage and view all students for this faculty."
      />

      <StudentsTable students={doctors.data ?? []} />
    </div>
  );
}
