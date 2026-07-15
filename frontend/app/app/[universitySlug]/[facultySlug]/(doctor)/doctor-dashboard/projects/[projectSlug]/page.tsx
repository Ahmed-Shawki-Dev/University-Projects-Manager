import { getMilestonesWithTasks } from "@/action/milestones/getMilestonesWithTasks";
import { getTaskBoards } from "@/action/task/getTaskBoards";
import KanbanBoard from "@/components/KanbanBoard";
import MilestonesTimeline from "@/components/Milestones/MilestonesTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    getMilestonesWithTasks(slugs),
  ]);

  return (
    <div>
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="grid w-full max-w-100 grid-cols-2">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="milestones">Milestones Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-4">
          <KanbanBoard
            columns={boardRes?.data?.columns ?? []}
            columnsOrder={boardRes?.data?.columnsOrder ?? []}
            tasks={boardRes?.data?.tasks ?? []}
            milestones={milestonesRes?.data ?? []}
            isProfessor={true}
          />
        </TabsContent>
        <TabsContent value="milestones" className="mt-4">
          <MilestonesTimeline milestones={milestonesRes?.data ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProjectPage;
