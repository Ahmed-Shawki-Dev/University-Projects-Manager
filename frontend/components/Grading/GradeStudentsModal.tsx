"use client";
import { createBulkGrade } from "@/action/grading/createBulkGrade";
import { getTeamMembersWithGrades } from "@/action/grading/getTeamMembersWithGrades";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectRouteParams, SubmitStudentGradeDto } from "@/types/schema";
import { BookOpenCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

interface IProps {
  milestoneId: string;
  maxGrade: number;
}

interface IFormInput {
  students: SubmitStudentGradeDto[];
}

export default function GradeStudentsModal({ milestoneId, maxGrade }: IProps) {
  const slugs = useParams() as unknown as ProjectRouteParams;
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { data: students, isLoading } = useSWR(
    open ? `milestone-grades-${milestoneId}` : null,
    () => getTeamMembersWithGrades(slugs, milestoneId),
  );

  const { register, handleSubmit, setValue } = useForm<IFormInput>({
    values: {
      students:
        students?.map((s) => ({
          studentId: s.studentId,
          grade: s.currentGrade ?? 0,
        })) || [],
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsPending(true);
      const message = await createBulkGrade(slugs, milestoneId, data.students);
      toast.success(message ?? "Bulk grades saved successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit grades:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleMasterGradeChange = (val: string) => {
    const gradeNum = parseFloat(val);

    const finalGrade = isNaN(gradeNum) ? 0 : gradeNum;

    students?.forEach((_, index) => {
      setValue(`students.${index}.grade`, finalGrade);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="flex items-center justify-center gap-1.5"
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>Grade Students</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Input Milestone Grades</DialogTitle>
          <DialogDescription className="wrap-break-word">
            Enter and update the scores for each student in this milestone team.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 bg-muted/50 p-3 rounded-lg border mb-4">
          <div className="text-sm font-medium text-muted-foreground">
            Set grade for all:
          </div>
          <Input
            type="number"
            placeholder="Type to set all..."
            className="w-36 text-right"
            min={0}
            max={maxGrade}
            step="0.5"
            onChange={(e) => handleMasterGradeChange(e.target.value)}
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Table className="border rounded-xl">
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right w-28">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-9 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                students?.map((student, index) => (
                  <TableRow key={student.studentId}>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {student.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        className="w-20 ml-auto text-right"
                        min={0}
                        max={maxGrade}
                        step="0.5"
                        placeholder="0"
                        {...register(`students.${index}.grade` as const)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isPending}>
              {isPending ? "Saving..." : "Save Grades"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
