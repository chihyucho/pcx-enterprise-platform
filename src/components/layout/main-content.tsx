import { cn } from "@/lib/utils";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn("flex-1 overflow-auto p-4 lg:p-6", className)}>
      {children}
    </main>
  );
}
