"use client";

import { Label } from "@/components/ui/label";
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

interface ProjectSelectFieldProps {
  projects: AccountProjectRow[];
  value: string;
  onChange: (projectId: string) => void;
  required?: boolean;
  id?: string;
}

export function ProjectSelectField({
  projects,
  value,
  onChange,
  required = true,
  id = "project_id",
}: ProjectSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Project
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
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
