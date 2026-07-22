"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MilestoneWithTasksDto, TeamMemberDto } from "@/types/schema";
import { Filter, Flag, RotateCcw, User, Users, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {
  milestones?: MilestoneWithTasksDto[];
  teamMembers?: TeamMemberDto[];
}

export default function FilterKanbanTasks({ milestones, teamMembers }: IProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 1. قراءة الفلاتر الحالية من الـ URL مباشرة
  const currentMilestone = searchParams.get("milestoneId") ?? "all";
  const currentStudent = searchParams.get("studentId") ?? "all";
  const isOnlyMyTasks = searchParams.get("onlyMyTasks") === "true";

  // 2. حساب عدد الفلاتر الشغالة حالياً
  const activeFiltersCount =
    (currentMilestone !== "all" ? 1 : 0) +
    (currentStudent !== "all" ? 1 : 0) +
    (isOnlyMyTasks ? 1 : 0);

  // 3. دالة تحديث الـ URL
  const updateFilter = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleResetAll = () => {
    router.replace(pathname);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={activeFiltersCount > 0 ? "default" : "secondary"}
            size="sm"
            className="h-8 gap-2 text-xs relative"
          >
            <Filter className="w-3.5 h-3.5" />

            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-background text-foreground rounded-full ml-0.5">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="space-y-2" align="end">
          <PopoverHeader className="flex flex-row items-center justify-between border-b pb-2 space-y-0">
            <PopoverTitle className="flex items-center gap-1.5 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5" />
              Tasks Filter
            </PopoverTitle>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetAll}
                className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-destructive gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            )}
          </PopoverHeader>

          <div className="space-y-2">
            {/* 1. Milestone Filter */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Flag className="w-3 h-3" /> Milestone
              </Label>
              <Select
                value={currentMilestone}
                onValueChange={(val) => updateFilter("milestoneId", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Milestones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Milestones</SelectItem>
                  {milestones?.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Members Filter */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Members Tasks
              </Label>
              <Select
                value={currentStudent}
                onValueChange={(val) => updateFilter("studentId", val)}
                disabled={isOnlyMyTasks}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {teamMembers?.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Only My Tasks Filter */}
            <div className="space-y-1 pt-1">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                <User className="w-3 h-3" /> Personal
              </Label>
              <Field orientation="horizontal">
                <Checkbox
                  id="onlyMe"
                  checked={isOnlyMyTasks}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked;
                    if (isChecked) {
                      updateFilter("studentId", null);
                    }
                    updateFilter("onlyMyTasks", isChecked ? "true" : null);
                  }}
                />
                <FieldContent>
                  <FieldLabel
                    htmlFor="onlyMe"
                    className="text-xs cursor-pointer"
                  >
                    Only My Tasks
                  </FieldLabel>
                </FieldContent>
              </Field>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          title="Clear all filters"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      )}
    </div>
  );
}
