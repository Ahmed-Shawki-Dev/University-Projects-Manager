import { CircleOff } from "lucide-react";

const EmptyProjects = () => {
  return (
    <div className="flex justify-center flex-col gap-4 items-center h-full opacity-50">
      <CircleOff className="w-20 h-20" />
      <p className="text-3xl font-semibold">No Projects Available</p>
    </div>
  );
};

export default EmptyProjects;
