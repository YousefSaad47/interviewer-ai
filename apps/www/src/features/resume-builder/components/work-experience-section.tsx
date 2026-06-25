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

export function WorkExperienceSection() {
  const {
    data,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResume();

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="font-bold text-foreground text-xl">
          Work Experience
        </CardTitle>
        <CardAction>
          <Button
            onClick={addWorkExperience}
            className="h-9 gap-1 rounded-lg bg-primary px-3 text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {data.workExperience.map((exp, index) => (
          <div
            key={exp.id}
            className="space-y-3 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55"
          >
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-foreground text-sm">
                Experience {index + 1}
              </Label>
              {data.workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkExperience(exp.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <X className="h-4 w-4 text-[#FF6467]" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Company
                </Label>
                <Input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateWorkExperience(exp.id, { company: e.target.value })
                  }
                  placeholder="Enter company name"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Position
                </Label>
                <Input
                  type="text"
                  value={exp.position}
                  onChange={(e) =>
                    updateWorkExperience(exp.id, { position: e.target.value })
                  }
                  placeholder="Enter position title"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-foreground text-xs">
                Duration
              </Label>
              <Input
                type="text"
                value={exp.duration}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { duration: e.target.value })
                }
                placeholder="e.g., Jan 2020 - Dec 2022"
                className="h-10 w-full rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-foreground text-xs">
                Description
              </Label>
              <Textarea
                value={exp.description}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { description: e.target.value })
                }
                placeholder="Describe your responsibilities and achievements"
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
