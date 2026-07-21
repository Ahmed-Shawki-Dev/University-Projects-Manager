import { removeTask } from "@/action/task/removeTask";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAvatarIcon } from "@/lib/utils";
import { MilestoneWithTasksDto, TaskDto, TeamMemberDto } from "@/types/schema";
import { Draggable } from "@hello-pangea/dnd";
import { Edit, X } from "lucide-react";
import { useState } from "react";
import UpdateTaskCard from "./UpdateTaskCard";
import { Button } from "./ui/button";

interface IProps {
  colTask: TaskDto;
  idx: number;
  milestones?: MilestoneWithTasksDto[];
  isProfessor?: boolean;
  teamMembers: TeamMemberDto[];
}

const KanbanTaskCard = ({
  colTask,
  idx,
  milestones,
  isProfessor,
  teamMembers,
}: IProps) => {
  const [showUpdateTaskCard, setShowUpdateTaskCard] = useState(false);

  const milestone = milestones?.find((m) => m.id === colTask.milestoneId);

  if (showUpdateTaskCard) {
    return (
      <UpdateTaskCard
        milestones={milestones ?? []}
        taskId={colTask.id}
        currentTask={colTask}
        onClose={() => setShowUpdateTaskCard(false)}
        teamMembers={teamMembers}
      />
    );
  }

  return (
    <Draggable
      key={colTask.id}
      draggableId={colTask.id}
      index={idx}
      isDragDisabled={isProfessor}
    >
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style as React.CSSProperties}
          className={`mb-2 shadow-sm border border-border/60 select-none touch-none ${
            snapshot.isDragging ? "opacity-80 scale-102 shadow-lg z-50" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold truncate max-w-[70%]">
              {colTask.title}
            </CardTitle>
            <div className="space-x-1 flex shrink-0">
              <Button
                variant={"outline"}
                size={"icon-xs"}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUpdateTaskCard(true);
                }}
              >
                <Edit className="w-3.5 h-3.5 text-primary/70 cursor-pointer" />
              </Button>
              <Button
                variant={"destructive"}
                size={"icon-xs"}
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(colTask.id);
                }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-4 py-0">
            <p className="text-xs opacity-60 mb-2 line-clamp-2">
              {colTask.description || "No description provided."}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-row items-center justify-between border-t border-border/40 mt-2">
            <div className="text-[11px] opacity-60 truncate max-w-[60%] mt-2">
              <span className="font-medium">Milestone:</span>{" "}
              {milestone?.title ?? "Without Milestone"}
            </div>

            {colTask.assignedStudents &&
              colTask.assignedStudents.length > 0 && (
                <div className="flex -space-x-1.5 items-center mt-2 overflow-hidden">
                  {colTask.assignedStudents.map((student) => (
                    <span
                      key={student.id}
                      className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-secondary text-[9px] font-bold border border-background text-secondary-foreground ring-1 ring-border shadow-sm transition-transform hover:scale-105 hover:z-10"
                      title={student.name || "Assigned Student"}
                    >
                      {getAvatarIcon(student.name || "AS")}
                    </span>
                  ))}
                </div>
              )}
          </CardFooter>
        </Card>
      )}
    </Draggable>
  );
};

export default KanbanTaskCard;
