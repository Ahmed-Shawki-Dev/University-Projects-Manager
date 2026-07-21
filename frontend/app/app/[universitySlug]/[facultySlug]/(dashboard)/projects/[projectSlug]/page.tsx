import { getProjectMilestones } from "@/action/milestones/getProjectMilestones";
import { getTaskBoards } from "@/action/task/getTaskBoards";
import { getTeamMembers } from "@/action/teams/getTeamMembers";
import KanbanBoard from "@/components/KanbanBoard";
import ProjectSettingsModal from "@/components/Settings/ProjectSettingsModal";
import TeamModal from "@/components/Team/TeamModal";

const ProjectPage = async ({
  params,
}: {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
    projectSlug: string;
  }>;
}) => {
  const slugs = await params;

  const [boardRes, milestonesRes, teamMembersRes] = await Promise.all([
    getTaskBoards(slugs),
    getProjectMilestones(slugs),
    getTeamMembers(slugs),
  ]);

  return (
    <div className="w-full flex flex-col h-full container mx-auto px-2 py-2 space-y-2">
      <div className="flex items-center justify-between border-b pb-2 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight uppercase">
            {slugs.projectSlug.split("-").slice(0, -1).join(" ")}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <TeamModal members={teamMembersRes?.data ?? []} />
          <ProjectSettingsModal slugs={slugs} />
        </div>
      </div>

      <div className="w-full h-[calc(100vh-200px)]">
        <KanbanBoard
          columns={boardRes?.data?.columns ?? []}
          columnsOrder={boardRes?.data?.columnsOrder ?? []}
          tasks={boardRes?.data?.tasks ?? []}
          milestones={milestonesRes?.data ?? []}
          isProfessor={false}
          teamMembers={teamMembersRes.data ?? []}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
