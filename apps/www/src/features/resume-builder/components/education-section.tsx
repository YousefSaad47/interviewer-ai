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
} from "@/shared/ui";

import { useResume } from "..";

export function EducationSection() {
  const { data, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="font-bold text-foreground text-xl">
          Education
        </CardTitle>
        <CardAction>
          <Button
            onClick={addEducation}
            className="h-9 gap-1 rounded-lg bg-primary px-3 text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {data.education.map((edu, index) => (
          <div
            key={edu.id}
            className="space-y-3 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55"
          >
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-foreground text-sm">
                Education {index + 1}
              </Label>
              {data.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <X className="h-4 w-4 text-[#FF6467]" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-foreground text-xs">
                School
              </Label>
              <Input
                type="text"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(edu.id, { school: e.target.value })
                }
                placeholder="Enter school or university name"
                className="h-10 w-full rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Degree
                </Label>
                <Input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="font-semibold text-foreground text-xs">
                  Year
                </Label>
                <Input
                  type="text"
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(edu.id, { year: e.target.value })
                  }
                  placeholder="e.g., 2020-2024"
                  className="h-10 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
