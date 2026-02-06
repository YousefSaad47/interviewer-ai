"use client";

import { useState } from "react";

import { useTheme } from "next-themes";

import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function CodePanel() {
  const [activeTab, setActiveTab] = useState("testcase-1");
  const { theme } = useTheme();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`
  );

  const languageStarterCode: Record<string, string> = {
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
    typescript: `function twoSum(nums: number[], target: number): number[] {\n    \n};`,
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(languageStarterCode[newLanguage] || "");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with Language Selector + Reset */}
      <div className="bg-background flex items-center justify-between border-b border-neutral-300 px-3 py-2 md:px-5 md:py-3 dark:border-neutral-700">
        <div className="flex items-center gap-[10px]">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-muted w-[140px] rounded-lg border-none text-xs md:w-[180px] md:text-sm">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground text-xs md:text-base"
          onClick={() => setCode(languageStarterCode[language] || "")}
        >
          Reset
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden border-y border-neutral-300 dark:border-neutral-700">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Run/Submit Buttons */}
      <div className="bg-background flex justify-end gap-3 border-b border-neutral-300 px-4 py-3 md:gap-4 md:px-8 lg:px-20 dark:border-neutral-700">
        <Button
          variant="ghost"
          className="bg-muted text-foreground hover:bg-muted/80 gap-1.5 rounded px-3 py-2 text-sm md:gap-2 md:px-4 md:text-base"
        >
          <Play className="h-4 w-4 fill-current md:h-5 md:w-5" />
          Run
        </Button>
        <Button className="gap-1.5 rounded bg-[#6382DE] px-4 py-2 text-sm text-white hover:bg-[#6382DE]/90 md:gap-2 md:px-5 md:text-base">
          <svg
            className="h-4 w-4 md:h-5 md:w-5"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2.2V9M2.2 11L13.2 11V4.4M5.14 7.34L7.34 5.87V2.2"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Submit
        </Button>
      </div>

      {/* Test Cases */}
      <div className="bg-background flex-1 overflow-y-auto border-t border-neutral-300 dark:border-neutral-700">
        {/* Tabs */}
        <div className="bg-background flex items-center justify-between border-b border-neutral-300 px-3 py-2 md:px-5 md:py-3 dark:border-neutral-700">
          <div className="flex gap-3 md:gap-5">
            <button
              onClick={() => setActiveTab("testcase-1")}
              className={`text-center font-mono text-xs md:text-base ${
                activeTab === "testcase-1"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Testcase 1
            </button>
            <button
              onClick={() => setActiveTab("testcase-2")}
              className={`text-center font-mono text-xs md:text-base ${
                activeTab === "testcase-2"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Testcase 2
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`text-center font-mono text-xs md:text-base ${
                activeTab === "custom"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Custom Testcase
            </button>
          </div>
        </div>

        {/* Test Case Content */}
        <div className="space-y-2 p-3 md:space-y-3 md:p-4">
          <div className="mb-1 md:mb-2">
            <span className="text-muted-foreground text-xs md:text-sm">
              Your Input:
            </span>
          </div>
          <div className="border-border bg-muted space-y-2 rounded-lg border p-3 md:p-4">
            <div className="text-foreground font-mono text-xs md:text-base">
              nums = [2,7,11,15]
            </div>
            <div className="text-foreground font-mono text-xs md:text-base">
              target = 9
            </div>
          </div>

          {/* Output Section (visible after running) */}
          <div className="mt-2 space-y-2 md:mt-3">
            <div className="mb-1 md:mb-2">
              <span className="text-muted-foreground text-xs md:text-sm">
                Output:
              </span>
            </div>
            <div className="border-border bg-muted flex items-center justify-center rounded-lg border p-2 text-center md:p-3">
              <span className="text-foreground font-mono text-xs md:text-base">
                [0,1]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
