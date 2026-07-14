import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden bg-background">
      {/* Light Mode */}
      <div
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 10%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(circle 600px at 100% 90%, rgba(59, 130, 246, 0.15), transparent)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%",
          backgroundRepeat: "repeat, repeat, no-repeat, no-repeat",
        }}
      />

      {/* Dark Mode */}
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 10%, rgba(139, 92, 246, 0.08), transparent),
            radial-gradient(circle 600px at 100% 90%, rgba(59, 130, 246, 0.08), transparent)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%",
          backgroundRepeat: "repeat, repeat, no-repeat, no-repeat",
        }}
      />

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md shadow-xl">{children}</div>
    </div>
  );
}
