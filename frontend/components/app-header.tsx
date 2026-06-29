import { SidebarTrigger } from "./ui/sidebar";

export default function AppHeader() {
  return (
    <header className="flex fixed h-14 items-center gap-4 bg-sidebar border-b px-4  w-full">
      <div>
        <SidebarTrigger />
      </div>
    </header>
  );
}
