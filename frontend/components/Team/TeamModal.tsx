import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamMemberDto } from "@/types/schema";
import { Crown, Users } from "lucide-react";
import { Badge } from "../ui/badge";

interface IProps {
  members: TeamMemberDto[];
}

export default function TeamModal({ members }: IProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>View Team ({members.length})</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92%] max-w-106.25 rounded-lg gap-0 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5" />
            <span>Project Team Members</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-4 max-h-[60vh] overflow-y-auto pr-1">
          {members.map((member) => (
            <div
              key={member.email}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors gap-3
                ${member.isMe ? "bg-primary/5 border-primary/20" : "bg-transparent border-transparent hover:bg-muted/50"}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-9 w-9 border shrink-0">
                  <AvatarImage src="" alt={member.name} />
                  <AvatarFallback
                    className={
                      member.isLeader
                        ? "bg-amber-500 text-white text-xs font-bold"
                        : "bg-muted text-muted-foreground text-xs font-semibold"
                    }
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold leading-none truncate flex items-center gap-1.5">
                    {member.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 truncate">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex gap-1.5 items-center shrink-0">
                {member.isMe && <Badge>You</Badge>}

                {member.isLeader ? (
                  <Badge
                    variant="outline"
                    className="text-amber-600 dark:text-amber-400 border border-amber-500/20 bg-amber-500/5 text-[10px] px-2 py-0.5 font-bold h-5 flex items-center gap-1"
                  >
                    <Crown className="h-2.5 w-2.5" />
                    Leader
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 font-medium h-5 text-muted-foreground"
                  >
                    Member
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
