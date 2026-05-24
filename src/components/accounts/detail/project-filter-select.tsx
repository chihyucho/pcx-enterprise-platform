"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  projectLabel,
  type AccountProjectRow,
} from "@/lib/accounts/project-utils";

interface ProjectFilterSelectProps {
  projects: AccountProjectRow[];
  value: string;
  onValueChange: (value: string) => void;
}

export function ProjectFilterSelect({
  projects,
  value,
  onValueChange,
}: ProjectFilterSelectProps) {
  return (
    <div className="max-w-md space-y-2">
      <label
        htmlFor="project-filter"
        className="text-sm font-medium text-muted-foreground"
      >
        Filter by project
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="project-filter" className="bg-card">
          <SelectValue placeholder="All projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {projectLabel(project)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
