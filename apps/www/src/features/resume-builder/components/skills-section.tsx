"use client";

import { useState } from "react";

import { Plus, Tag, X } from "lucide-react";

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

import { useResume } from "../contexts/resume-context";
import type { SkillCategory } from "../types";

export function SkillsSection() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } =
    useResume();
  const skillCategories = (data.skills || []) as SkillCategory[];

  // Keep track of new skill inputs per category ID
  const [newItemText, setNewItemText] = useState<{ [catId: string]: string }>(
    {},
  );

  const handleAddItem = (catId: string) => {
    const text = newItemText[catId]?.trim();
    if (!text) return;

    const cat = skillCategories.find((c) => c.id === catId);
    if (cat) {
      const currentItems = cat.items || [];
      updateSkillCategory(catId, {
        items: [...currentItems, text],
      });
    }

    setNewItemText((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleRemoveItem = (catId: string, itemIndex: number) => {
    const cat = skillCategories.find((c) => c.id === catId);
    if (cat) {
      const currentItems = cat.items || [];
      updateSkillCategory(catId, {
        items: currentItems.filter((_, idx) => idx !== itemIndex),
      });
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="flex items-center gap-2 font-bold text-foreground text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
            <Tag className="h-4 w-4" />
          </span>
          Technical Skills
        </CardTitle>
        <CardAction>
          <Button
            onClick={addSkillCategory}
            className="h-9 gap-1 rounded-lg bg-primary px-3 text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-5">
        {skillCategories.map((cat) => (
          <div
            key={cat.id}
            className="space-y-3 rounded-lg border border-border bg-white/60 p-4 dark:bg-surface-secondary/55"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <Label className="font-semibold text-foreground text-xs">
                  Category Name
                </Label>
                <Input
                  type="text"
                  value={cat.category}
                  onChange={(e) =>
                    updateSkillCategory(cat.id, { category: e.target.value })
                  }
                  placeholder="e.g., Backend, Frontend, DevOps"
                  className="h-9 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSkillCategory(cat.id)}
                className="mt-5 shrink-0 transition-opacity hover:opacity-80"
              >
                <X className="h-4 w-4 text-[#FF6467]" />
              </button>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground text-xs">
                Skills List
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newItemText[cat.id] || ""}
                  onChange={(e) =>
                    setNewItemText((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem(cat.id);
                    }
                  }}
                  placeholder="Add skill (e.g. Node.js)..."
                  className="h-9 flex-1 rounded-lg border-border bg-white/70 shadow-none focus-visible:ring-primary/20 dark:border-border-interactive dark:bg-surface-elevated"
                />
                <Button
                  onClick={() => handleAddItem(cat.id)}
                  variant="secondary"
                  className="h-9 rounded-lg px-3 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(cat.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-xs dark:bg-surface-elevated"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(cat.id, idx)}
                      className="text-muted-foreground transition-opacity hover:text-foreground hover:opacity-85"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {skillCategories.length === 0 && (
          <p className="py-4 text-center text-muted-foreground text-sm">
            No technical skills categories added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
