"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { useResume } from "..";

export function EducationSection() {
  const { data, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Education
        </CardTitle>
        <CardAction>
          <Button
            onClick={addEducation}
            className="gap-1 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.education.map((edu, index) => (
          <div
            key={edu.id}
            className="space-y-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800"
          >
            {/* Entry Header */}
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm">
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

            {/* School */}
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">School</Label>
              <Input
                type="text"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(edu.id, { school: e.target.value })
                }
                placeholder="Enter school or university name"
                className="w-full rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
              />
            </div>

            {/* Degree & Year */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label className="text-muted-foreground text-xs">Degree</Label>
                <Input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science"
                  className="rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="text-muted-foreground text-xs">Year</Label>
                <Input
                  type="text"
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(edu.id, { year: e.target.value })
                  }
                  placeholder="e.g., 2020-2024"
                  className="rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
