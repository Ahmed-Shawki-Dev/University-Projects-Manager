import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectRouteParams } from "@/types/schema";
import { Settings, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import LeaveTeamButton from "./LeaveTeamButton";

export default function ProjectSettingsModal({
  slugs,
}: {
  slugs: ProjectRouteParams;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"secondary"} className="cursor-pointer">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 gap-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex gap-2 items-center text-xl font-semibold">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span>Project Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className=" flex flex-col gap-3">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-4 h-4" />
            <h4 className="text-sm font-semibold tracking-wide uppercase">
              Danger Zone
            </h4>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Once you leave this project, you will instantly lose your access to
            the board. Make sure you transfer ownership if you are the leader.
          </p>

          <div className="mt-1">
            <LeaveTeamButton slugs={slugs} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
