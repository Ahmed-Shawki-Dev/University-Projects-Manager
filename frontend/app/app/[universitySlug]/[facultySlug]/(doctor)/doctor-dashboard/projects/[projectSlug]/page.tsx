import { getProjectMilestones } from "@/action/milestones/getProjectMilestones";
import { getTaskBoards } from "@/action/task/getTaskBoards";
import { getTeamMembers } from "@/action/teams/getTeamMembers";
import KanbanBoard from "@/components/KanbanBoard";
import MilestonesTimeline from "@/components/Milestones/MilestonesTimeline";
import ProjectActivitiesButton from "@/components/Student-Dashboard/ProjectActivitiesButton";
import FilterKanbanTasks from "@/components/Task/FilterKanbanTasks";
import TeamModal from "@/components/Team/TeamModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const DoctorProjectPage = async ({ params, searchParams }: IProps) => {
  const slugs = await params;
  const queries = await searchParams;

  const [boardRes, milestonesRes, teamMembersRes] = await Promise.all([
    getTaskBoards(slugs, queries),
    getProjectMilestones(slugs),
    getTeamMembers(slugs),
  ]);

  return (
    <div className="w-full flex flex-col h-full px-4 py-2 space-y-2 overflow-hidden">
      <div className="w-full border-b pb-3 pt-1 shrink-0 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase truncate">
            {slugs.projectSlug.split("-").slice(0, -1).join(" ")}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <TeamModal members={teamMembersRes?.data ?? []} />
          <ProjectActivitiesButton projectSlug={slugs.projectSlug} />
          <FilterKanbanTasks
            milestones={milestonesRes?.data ?? []}
            teamMembers={teamMembersRes?.data ?? []}
          />
        </div>
      </div>

      <Tabs
        defaultValue="kanban"
        className="w-full flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="milestones">Milestones Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4 h-[calc(100vh-220px)]">
          <KanbanBoard
            columns={boardRes?.data?.columns ?? {}}
            columnsOrder={boardRes?.data?.columnsOrder ?? []}
            tasks={boardRes?.data?.tasks ?? []}
            milestones={milestonesRes?.data ?? []}
            isProfessor={true}
            teamMembers={teamMembersRes?.data ?? []}
            projectId={boardRes?.data?.projectId ?? ""}
          />
        </TabsContent>

        <TabsContent value="milestones" className="mt-4 overflow-y-auto">
          <MilestonesTimeline milestones={milestonesRes?.data ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProjectPage;
