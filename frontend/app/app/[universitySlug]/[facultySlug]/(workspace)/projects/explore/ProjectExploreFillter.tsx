"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectType } from "@/types/schema";
import { usePathname, useRouter } from "next/navigation";

export default function ProjectExploreFillter({
  currentOption,
}: {
  currentOption?: ProjectType;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (value: string) => {
    if (value === "ALL") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?projectType=${value}`);
    }
  };

  const stringValue =
    currentOption !== undefined ? String(currentOption) : "ALL";

  return (
    <Select value={stringValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Project type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Projects</SelectItem>
        <SelectItem value={String(ProjectType.CourseProject)}>
          Course project
        </SelectItem>
        <SelectItem value={String(ProjectType.GraduationProject)}>
          Graduation project
        </SelectItem>
        <SelectItem value={String(ProjectType.UniversityProject)}>
          University project
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
