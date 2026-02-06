"use client";

import { useState } from "react";

import { useTheme } from "next-themes";

import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Send } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { TestCaseView } from "./test-case-view";

export function CodePanel() {
  const [activeTab, setActiveTab] = useState("case-1");
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

  const handleReset = () => {
    setCode(languageStarterCode[language] || "");
  };

  return (
    <ResizablePanelGroup orientation="vertical" className="h-full">
      {/* Editor Section */}
      <ResizablePanel defaultSize="60%" minSize="30%" maxSize="80%">
        <div className="flex h-full flex-col">
          {/* Header with Language Selector + Reset */}
          <div className="bg-background flex items-center justify-between border-b px-4 py-3 md:px-6 md:py-3.5 dark:border-[#1a1a1a]">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="bg-muted w-35 border-none text-xs font-medium md:w-40 md:text-sm">
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

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground gap-2 text-xs md:text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Code
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
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
                padding: { top: 16, bottom: 16 },
                fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                fontLigatures: true,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="bg-background flex justify-end gap-2 border-t px-4 py-3 md:gap-3 md:px-6 md:py-3.5 dark:border-[#1a1a1a]">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              Run Code
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 gap-2 text-xs md:text-sm"
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Test Cases */}
      <ResizablePanel defaultSize="40%" minSize="20%" maxSize="70%">
        <TestCaseView activeTab={activeTab} setActiveTab={setActiveTab} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
