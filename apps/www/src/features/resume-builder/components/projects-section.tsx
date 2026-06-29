"use client";

import { Plus, X } from "lucide-react";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@/shared/ui";

import { useResume } from "../contexts/resume-context";

export function ProjectsSection() {
  const { data, addProject, updateProject, removeProject } = useResume();

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="font-bold text-foreground text-xl">
          Projects
        </CardTitle>
        <CardAction>
          <Button
            onClick={addProject}
            className="h-9 gap-1 rounded-lg bg-primary px-3 text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {data.projects?.map((proj, index) => (
          <div
            key={proj.id}
            className="space-y-3 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55"
          >
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-foreground text-sm">
                Project {index + 1}
              </Label>
              {data.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <X className="h-4 w-4 text-[#FF6467]" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Project Name
                </Label>
                <Input
                  type="text"
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                  placeholder="Enter project name"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Role / Technologies
                </Label>
                <Input
                  type="text"
                  value={proj.role}
                  onChange={(e) =>
                    updateProject(proj.id, { role: e.target.value })
                  }
                  placeholder="e.g., Lead Developer - Next.js, React"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Duration
                </Label>
                <Input
                  type="text"
                  value={proj.duration}
                  onChange={(e) =>
                    updateProject(proj.id, { duration: e.target.value })
                  }
                  placeholder="e.g., Jan 2023 - Mar 2023"
                  className="h-10 w-full rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Project Link URL
                </Label>
                <Input
                  type="text"
                  value={proj.url || ""}
                  onChange={(e) =>
                    updateProject(proj.id, { url: e.target.value })
                  }
                  placeholder="e.g., https://github.com/username/project"
                  className="h-10 w-full rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-foreground text-xs">
                Description
              </Label>
              <Textarea
                value={proj.description}
                onChange={(e) =>
                  updateProject(proj.id, { description: e.target.value })
                }
                placeholder="Describe the project's features and your contributions"
                rows={3}
                className="min-h-24 w-full rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
