import KanbanBoard from "@/components/KanbanBoard";
import { fetchApi } from "@/lib/fetchApi";
import { KanbanBoardDto, MilestoneDto } from "@/types/schema";

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

  const boardPromise = fetchApi<KanbanBoardDto>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects/${projectSlug}/tasks`,
  );

  const milestonesPromise = fetchApi<MilestoneDto[]>(
    `/api/universities/${universitySlug}/faculties/${facultySlug}/projects/${projectSlug}/milestones`,
  );

  const [boardRes, milestonesRes] = await Promise.all([
    boardPromise,
    milestonesPromise,
  ]);

  return (
    <div>
      <KanbanBoard
        columns={boardRes?.data?.columns ?? []}
        columnsOrder={boardRes?.data?.columnsOrder ?? []}
        tasks={boardRes?.data?.tasks ?? []}
        milestones={milestonesRes?.data ?? []}
      />
    </div>
  );
};

export default ProjectPage;
