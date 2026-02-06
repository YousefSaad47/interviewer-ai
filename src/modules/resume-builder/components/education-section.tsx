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
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Education
        </CardTitle>
        <CardAction>
          <Button
            onClick={addEducation}
            className="gap-1 rounded-lg bg-[#6382DE] px-4 py-2 text-sm text-white hover:bg-[#6382DE]/90"
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
                  onClick={() => removeEducation(edu.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <X className="h-4 w-4 text-[#FF6467]" />
                </button>
              )}
            </div>

            {/* School */}
            <Input
              type="text"
              value={edu.school}
              onChange={(e) =>
                updateEducation(edu.id, { school: e.target.value })
              }
              placeholder="School"
              className="w-full rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
            />

            {/* Degree & Year */}
            <div className="flex gap-3">
              <Input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
                placeholder="Degree"
                className="flex-1 rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
              />
              <Input
                type="text"
                value={edu.year}
                onChange={(e) =>
                  updateEducation(edu.id, { year: e.target.value })
                }
                placeholder="Year"
                className="flex-1 rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
