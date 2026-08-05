import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAvatarIcon } from "@/lib/utils";
import { StudentDto } from "@/types/schema";
import { Hash, Mail, UserX } from "lucide-react";

interface IProps {
  students: StudentDto[];
}

export default function StudentsTable({ students }: IProps) {
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
        <div className="p-3 rounded-full bg-muted mb-3 text-muted-foreground">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-lg">No Students Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          There are currently no students registered in this faculty.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-75">Student Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Student Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              return (
                <TableRow
                  key={student.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
                        {getAvatarIcon(student?.fullName)}
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {student?.fullName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {student?.email || "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                      <Hash className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {student?.studentCode || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
