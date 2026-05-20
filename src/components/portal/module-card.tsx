import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { NavIcon } from "@/components/navigation/nav-icon";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PortalModule } from "@/types/module";

interface ModuleCardProps {
  module: PortalModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const content = (
    <Card
      className={cn(
        "relative h-full transition-colors",
        module.enabled
          ? "cursor-pointer hover:border-foreground/20 hover:shadow-md"
          : "cursor-not-allowed opacity-70"
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/50">
            <NavIcon name={module.icon} className="h-5 w-5 text-foreground" />
          </div>
          {module.enabled ? (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-base">{module.title}</CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );

  if (!module.enabled) {
    return content;
  }

  return (
    <Link href={module.href} className="block h-full">
      {content}
    </Link>
  );
}
