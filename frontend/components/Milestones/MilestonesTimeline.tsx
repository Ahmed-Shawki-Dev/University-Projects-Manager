import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MilestoneWithTasksDto, TaskDto, TaskStatusEnum } from "@/types/schema";
import { Award, CalendarDays } from "lucide-react";
import GradeStudentsModal from "../Grading/GradeStudentsModal";
import { Badge } from "../ui/badge";
import CreateMilestoneModal from "./CreateMilestoneModal";

interface MilestonesTimelineProps {
  milestones: MilestoneWithTasksDto[];
}

export default function MilestonesTimeline({
  milestones,
}: MilestonesTimelineProps) {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Project Roadmap
          </h2>
          <p className="text-muted-foreground text-xs">
            Track project phases, deadlines, and grades breakdown.
          </p>
        </div>
        <CreateMilestoneModal />
      </div>

      <div className="lg:col-span-2 space-y-4">
        {milestones.length === 0 ? (
          <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground text-sm">
            No milestones created yet. Use the form to add the first phase!
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {milestones.map((milestone) => {
              const completedTasks =
                milestone.tasks?.filter((t: TaskDto) => t.status === "Done")
                  .length ?? 0;
              const totalTasks = milestone.tasks?.length ?? 0;

              return (
                <AccordionItem
                  key={milestone.id}
                  value={milestone.id}
                  className="border rounded-xl px-4 bg-card/50"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2 pr-4">
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">
                          {milestone.title}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <Award className="w-3 h-3" />
                            {milestone.maxGrade} Points
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-1">
                        <Badge
                          variant={
                            totalTasks > 0 && completedTasks === totalTasks
                              ? "default"
                              : "secondary"
                          }
                          className="w-fit text-xs"
                        >
                          {totalTasks > 0
                            ? `${completedTasks}/${totalTasks} Tasks Done`
                            : "0 Tasks"}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="py-4 border-t space-y-2">
                    <div className="flex items-center justify-center px-2">
                      <GradeStudentsModal
                        milestoneId={milestone?.id}
                        maxGrade={milestone?.maxGrade}
                      />
                    </div>

                    {totalTasks === 0 ? (
                      <p className="text-xs text-muted-foreground/70 pl-2">
                        No tasks linked to this milestone yet.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-62.5 overflow-y-auto pr-1">
                        {milestone.tasks.map((task: TaskDto) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-background border text-xs hover:bg-accent/40 transition-colors"
                          >
                            <span className="font-medium truncate max-w-[70%]">
                              {task.title}
                            </span>
                            <Badge
                              variant={
                                task.status === "Done"
                                  ? "default"
                                  : task.status === TaskStatusEnum.InProgress
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-[10px] px-1.5 py-0"
                            >
                              {task.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
