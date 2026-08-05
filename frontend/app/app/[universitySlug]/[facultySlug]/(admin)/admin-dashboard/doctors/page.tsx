import { getAllDoctors } from "@/action/doctors/getAllDoctors";
import PageHeader from "@/components/PageHeader";
import { ProjectRouteParams } from "@/types/schema";
import AddNewDoctorModal from "./AddNewDoctorModal";
import DoctorsTable from "./DoctorsTable";

interface IProps {
  params: Promise<{ universitySlug: string; facultySlug: string }>;
}

export default async function AdminDoctorsPage({ params }: IProps) {
  const slugs = (await params) as unknown as ProjectRouteParams;
  const doctors = await getAllDoctors(slugs);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Doctors"
        description="Manage and view all registered academic staff members for this faculty."
      >
        <AddNewDoctorModal />
      </PageHeader>

      <DoctorsTable doctors={doctors.data ?? []} />
    </div>
  );
}
