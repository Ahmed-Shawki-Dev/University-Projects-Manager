import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAvatarIcon } from "@/lib/utils";
import { DoctorDto } from "@/types/schema";
import { GraduationCap, Mail, UserX } from "lucide-react";

interface IProps {
  doctors: DoctorDto[];
}

export default function DoctorsTable({ doctors }: IProps) {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
        <div className="p-3 rounded-full bg-muted mb-3 text-muted-foreground">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-lg">No Doctors Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          There are currently no doctors assigned to this faculty. You can add
          one using the button above.
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
              <TableHead className="w-75">Doctor Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Academic Rank</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => {
              return (
                <TableRow
                  key={doctor.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
                        {getAvatarIcon(doctor?.fullName)}
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {doctor?.fullName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {doctor?.email || "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="gap-1.5 font-normal whitespace-nowrap px-2.5 py-0.5 rounded-md"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      {doctor?.academicRank || "Professor"}
                    </Badge>
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
