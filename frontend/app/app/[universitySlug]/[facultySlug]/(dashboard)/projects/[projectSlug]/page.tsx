import { getProjectMilestones } from "@/action/milestones/getProjectMilestones";
import { getTaskBoards } from "@/action/task/getTaskBoards";
import { getTeamMembers } from "@/action/teams/getTeamMembers";
import KanbanBoard from "@/components/KanbanBoard";
import ProjectSettingsModal from "@/components/Settings/ProjectSettingsModal";
import FilterKanbanTasks from "@/components/Task/FilterKanbanTasks";
import TeamModal from "@/components/Team/TeamModal";

interface IProps {
  params: Promise<{
    universitySlug: string;
    facultySlug: string;
    projectSlug: string;
  }>;
  searchParams: Promise<{
    milestoneId: string;
    studentId: string;
    onlyMyTasks: string;
  }>;
}

const ProjectPage = async ({ params, searchParams }: IProps) => {
  const slugs = await params;
  const queries = await searchParams;

  const [boardRes, milestonesRes, teamMembersRes] = await Promise.all([
    getTaskBoards(slugs, queries),
    getProjectMilestones(slugs),
    getTeamMembers(slugs),
  ]);

  return (
    <div className="w-full flex flex-col h-full container mx-auto px-2 py-2 space-y-2">
      <div className="w-full border-b pb-3 pt-1 shrink-0 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase truncate">
            {slugs.projectSlug.split("-").slice(0, -1).join(" ")}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <TeamModal members={teamMembersRes?.data ?? []} />
          <ProjectSettingsModal slugs={slugs} />
          <FilterKanbanTasks
            milestones={milestonesRes.data}
            teamMembers={teamMembersRes.data}
          />
        </div>
      </div>

      <div className="w-full h-[calc(100vh-200px)]">
        <KanbanBoard
          columns={boardRes?.data?.columns ?? {}}
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
