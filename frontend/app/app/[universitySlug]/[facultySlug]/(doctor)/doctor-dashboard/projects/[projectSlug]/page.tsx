import { getProjectMilestones } from "@/action/milestones/getProjectMilestones";
import { getTaskBoards } from "@/action/task/getTaskBoards";
import KanbanBoard from "@/components/KanbanBoard";

const DoctorProjectPage = async ({
  params,
}: {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
    projectSlug: string;
  }>;
}) => {
  const slugs = await params;

  const [boardRes, milestonesRes] = await Promise.all([
    getTaskBoards(slugs),
    getProjectMilestones(slugs),
  ]);

  return (
    <div>
      <KanbanBoard
        columns={boardRes?.data?.columns ?? []}
        columnsOrder={boardRes?.data?.columnsOrder ?? []}
        tasks={boardRes?.data?.tasks ?? []}
        milestones={milestonesRes?.data ?? []}
        isProfessor={true}
      />
    </div>
  );
};

export default DoctorProjectPage;
