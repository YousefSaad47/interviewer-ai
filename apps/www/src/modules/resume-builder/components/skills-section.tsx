"use client";

import { useState } from "react";

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

import { useResume } from "../contexts/resume-context";

export function SkillsSection() {
  const { data, addSkill, updateSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Skills
        </CardTitle>
        <CardAction>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSkill();
                }
              }}
              placeholder="Add skill..."
              className="h-9 w-full rounded-lg border-neutral-300 bg-white text-sm sm:w-32 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <Button
              onClick={handleAddSkill}
              className="w-full gap-1 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {data.skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg border border-border bg-neutral-50 px-3 py-2 dark:bg-neutral-800"
          >
            <Input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="h-auto w-auto border-none bg-transparent! p-0 text-foreground text-sm shadow-none outline-none ring-0 hover:bg-transparent! focus:bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0 dark:focus:bg-transparent! dark:hover:bg-transparent!"
            />
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="transition-opacity hover:opacity-80"
            >
              <X className="h-3 w-3 text-[#FF6467]" />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
