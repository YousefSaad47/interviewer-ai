"use client";

import { useEffect, useState } from "react";

import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TestCaseViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TestCase {
  id: string;
  label: string;
  input: Array<{ key: string; value: string }>;
  output: string;
}

export function TestCaseView({ activeTab, setActiveTab }: TestCaseViewProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: uuidv4(),
      label: "Case 1",
      input: [
        { key: "nums", value: "[2, 7, 11, 15]" },
        { key: "target", value: "9" },
      ],
      output: "[0, 1]",
    },
    {
      id: uuidv4(),
      label: "Case 2",
      input: [
        { key: "nums", value: "[3, 2, 4]" },
        { key: "target", value: "6" },
      ],
      output: "[1, 2]",
    },
    {
      id: uuidv4(),
      label: "Case 3",
      input: [
        { key: "nums", value: "[1, 5, 10, 20]" },
        { key: "target", value: "30" },
      ],
      output: "[2, 3]",
    },
  ]);

  const currentTestCase = testCases.find((tc) => tc.id === activeTab);

  // Set initial active tab
  useEffect(() => {
    if (!activeTab || !testCases.find((tc) => tc.id === activeTab)) {
      const firstCase = testCases[0];
      if (firstCase) {
        setActiveTab(firstCase.id);
      }
    }
  }, [activeTab, testCases, setActiveTab]);

  const addTestCase = () => {
    // Prevent adding more than 8 test cases
    if (testCases.length >= 8) return;

    const newCaseNumber = testCases.length + 1;
    const lastCase = testCases[testCases.length - 1];
    if (!lastCase) return;
    const newCase: TestCase = {
      id: uuidv4(),
      label: `Case ${newCaseNumber}`,
      input: lastCase.input.map((item) => ({ ...item })),
      output: lastCase.output,
    };
    setTestCases([...testCases, newCase]);
    setActiveTab(newCase.id);
  };

  const removeTestCase = (id: string) => {
    // Prevent removing if only one test case exists
    if (testCases.length <= 1) return;

    const filteredCases = testCases.filter((tc) => tc.id !== id);
    // Renumber the cases to maintain sequential ordering
    const renumberedCases = filteredCases.map((tc, index) => ({
      ...tc,
      label: `Case ${index + 1}`,
    }));
    setTestCases(renumberedCases);

    // If removing the active tab, switch to the first remaining case
    if (activeTab === id) {
      const firstRemaining = renumberedCases[0];
      if (firstRemaining) {
        setActiveTab(firstRemaining.id);
      }
    }
  };

  const updateInputValue = (inputIndex: number, newValue: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === activeTab
          ? {
              ...tc,
              input: tc.input.map((item, idx) =>
                idx === inputIndex ? { ...item, value: newValue } : item,
              ),
            }
          : tc,
      ),
    );
  };

  const updateOutputValue = (newValue: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === activeTab ? { ...tc, output: newValue } : tc,
      ),
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b px-2 py-2 md:px-5 md:py-2.5 dark:border-[#1a1a1a]">
        {testCases.map((tab) => (
          <div key={tab.id} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative rounded-2xl px-2.5 py-1.5 pr-7 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground data-[active=true]:text-foreground md:px-4 md:py-2 md:pr-9 md:text-sm"
              data-active={activeTab === tab.id}
            >
              {activeTab === tab.id && (
                <span className="absolute inset-0 rounded-2xl bg-muted" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
            {testCases.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTestCase(tab.id);
                }}
                className="absolute top-1/2 right-0.5 z-20 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:right-1.5"
                aria-label={`Remove ${tab.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTestCase}
          disabled={testCases.length >= 8}
          className="shrink-0 rounded-2xl px-2 py-1.5 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 md:px-3 md:py-2 md:text-sm"
          aria-label="Add test case"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Test Case Content */}
      {currentTestCase && (
        <div className="flex-1 space-y-3 overflow-y-auto p-3 md:space-y-4 md:p-5">
          <div className="space-y-2">
            <span className="block font-medium text-muted-foreground text-xs md:text-sm">
              Input:
            </span>
            <div className="space-y-2 rounded-lg border bg-muted p-2.5 md:p-3 dark:border-[#1a1a1a] dark:bg-[#232323]">
              {currentTestCase.input.map((item, idx) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-1.5 font-mono text-xs sm:flex-row sm:items-center sm:gap-2 md:text-sm"
                >
                  <span className="shrink-0 text-muted-foreground sm:min-w-0">
                    {item.key} =
                  </span>
                  <input
                    type="text"
                    id={`input-${item.key}`}
                    value={item.value}
                    onChange={(e) => updateInputValue(idx, e.target.value)}
                    className="w-full flex-1 rounded border bg-background px-2 py-1.5 text-foreground outline-none transition-colors focus:border-primary md:py-1 dark:border-[#1a1a1a] dark:bg-[#2d2d2d]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block font-medium text-muted-foreground text-xs md:text-sm">
              Expected Output:
            </span>
            <div className="rounded-lg border bg-muted p-2.5 md:p-3 dark:border-[#1a1a1a] dark:bg-[#232323]">
              <input
                type="text"
                id="expected-output"
                value={currentTestCase.output}
                onChange={(e) => updateOutputValue(e.target.value)}
                className="w-full rounded border bg-background px-2 py-1.5 font-mono text-foreground text-xs outline-none transition-colors focus:border-primary md:py-1 md:text-sm dark:border-[#1a1a1a] dark:bg-[#2d2d2d]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
