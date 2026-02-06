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
import { Textarea } from "@/shared/components/ui/textarea";

import { useResume } from "../contexts/resume-context";

export function WorkExperienceSection() {
  const {
    data,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResume();

  return (
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Work Experience
        </CardTitle>
        <CardAction>
          <Button
            onClick={addWorkExperience}
            className="gap-1 rounded-lg bg-[#6382DE] px-4 py-2 text-sm text-white hover:bg-[#6382DE]/90"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.workExperience.map((exp, index) => (
          <div
            key={exp.id}
            className="space-y-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800"
          >
            {/* Entry Header */}
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm">
                Experience {index + 1}
              </Label>
              {data.workExperience.length > 1 && (
                <button
                  onClick={() => removeWorkExperience(exp.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <X className="h-4 w-4 text-[#FF6467]" />
                </button>
              )}
            </div>

            {/* Company & Position */}
            <div className="flex gap-3">
              <Input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { company: e.target.value })
                }
                placeholder="Company"
                className="flex-1 rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
              />
              <Input
                type="text"
                value={exp.position}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { position: e.target.value })
                }
                placeholder="Position"
                className="flex-1 rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
              />
            </div>

            {/* Duration */}
            <Input
              type="text"
              value={exp.duration}
              onChange={(e) =>
                updateWorkExperience(exp.id, { duration: e.target.value })
              }
              placeholder="Duration"
              className="w-full rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
            />

            {/* Description */}
            <Textarea
              value={exp.description}
              onChange={(e) =>
                updateWorkExperience(exp.id, { description: e.target.value })
              }
              placeholder="Description"
              rows={3}
              className="w-full rounded-lg border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-700"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
