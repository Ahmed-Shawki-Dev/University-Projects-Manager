import { fetchApi } from "@/lib/fetchApi";
import { FacultyDto } from "@/types/schema";

interface PageProps {
  params: Promise<{ universitySlug: string }>;
}

export default async function FacultiesPage({ params }: PageProps) {
  const { universitySlug } = await params;

  const response = await fetchApi<FacultyDto[]>(
    `/university/${universitySlug}/faculties`,
  );

  if (!response.isSuccess) {
    return <div className="p-8 text-red-500">Error: {response.message}</div>;
  }

  const faculties = response.data;

  return (
    <div className="p-8">
      {faculties.map((f) => (
        <div key={f.id}>{f.name}</div>
      ))}
    </div>
  );
}
