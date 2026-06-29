import KanbanBoard from "@/components/KanbanBoard";
import { fetchApi } from "@/lib/fetchApi";
import { KanbanBoardDto } from "@/types/schema";

const ProjectPage = async ({
  params,
}: {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
    projectSlug: string;
  }>;
}) => {
  const { universitySlug, facultySlug, projectSlug } = await params;
  const res = await fetchApi<KanbanBoardDto>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects/${projectSlug}/tasks`,
  );

  console.log(res);
  return (
    <div>
      {res.data?.tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
      <KanbanBoard />
    </div>
  );
};

export default ProjectPage;
