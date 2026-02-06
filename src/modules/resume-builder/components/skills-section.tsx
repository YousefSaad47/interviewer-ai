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
    <Card className="border-border rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Skills
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
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
              className="h-9 w-32 rounded-lg border-neutral-300 bg-white text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
            <Button
              onClick={handleAddSkill}
              className="gap-1 rounded-lg bg-[#6382DE] px-4 py-2 text-sm text-white hover:bg-[#6382DE]/90"
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
            className="border-border flex items-center gap-2 rounded-lg border bg-neutral-50 px-3 py-2 dark:bg-neutral-800"
          >
            <Input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="text-foreground h-auto w-auto border-none !bg-transparent p-0 text-sm shadow-none ring-0 outline-none hover:!bg-transparent focus:!bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:hover:!bg-transparent dark:focus:!bg-transparent"
            />
            <button
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
