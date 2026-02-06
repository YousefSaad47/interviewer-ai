"use client";

import { useState } from "react";

import { Plus, X } from "lucide-react";

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
      id: "case-1",
      label: "Case 1",
      input: [
        { key: "nums", value: "[2, 7, 11, 15]" },
        { key: "target", value: "9" },
      ],
      output: "[0, 1]",
    },
    {
      id: "case-2",
      label: "Case 2",
      input: [
        { key: "nums", value: "[3, 2, 4]" },
        { key: "target", value: "6" },
      ],
      output: "[1, 2]",
    },
    {
      id: "case-3",
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
  useState(() => {
    if (!activeTab || !testCases.find((tc) => tc.id === activeTab)) {
      setActiveTab(testCases[0].id);
    }
  });

  const addTestCase = () => {
    // Prevent adding more than 8 test cases
    if (testCases.length >= 8) return;

    const newCaseNumber = testCases.length + 1;
    const lastCase = testCases[testCases.length - 1];
    const newCase: TestCase = {
      id: `case-${newCaseNumber}`,
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
    setTestCases(filteredCases);

    // If removing the active tab, switch to the first remaining case
    if (activeTab === id) {
      setActiveTab(filteredCases[0].id);
    }
  };

  const updateInputValue = (inputIndex: number, newValue: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === activeTab
          ? {
              ...tc,
              input: tc.input.map((item, idx) =>
                idx === inputIndex ? { ...item, value: newValue } : item
              ),
            }
          : tc
      )
    );
  };

  const updateOutputValue = (newValue: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === activeTab ? { ...tc, output: newValue } : tc))
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b px-2 py-2 md:px-5 md:py-2.5 dark:border-[#1a1a1a]">
        {testCases.map((tab) => (
          <div key={tab.id} className="relative shrink-0">
            <button
              onClick={() => setActiveTab(tab.id)}
              className="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground relative rounded-2xl px-2.5 py-1.5 pr-7 text-xs font-medium transition-colors md:px-4 md:py-2 md:pr-9 md:text-sm"
              data-active={activeTab === tab.id}
            >
              {activeTab === tab.id && (
                <span className="bg-muted absolute inset-0 rounded-2xl" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
            {testCases.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTestCase(tab.id);
                }}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive absolute top-1/2 right-0.5 z-20 -translate-y-1/2 rounded-full p-0.5 transition-colors md:right-1.5"
                aria-label={`Remove ${tab.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTestCase}
          disabled={testCases.length >= 8}
          className="text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-2xl px-2 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:px-3 md:py-2 md:text-sm"
          aria-label="Add test case"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Test Case Content */}
      {currentTestCase && (
        <div className="flex-1 space-y-3 overflow-y-auto p-3 md:space-y-4 md:p-5">
          <div className="space-y-2">
            <label className="text-muted-foreground block text-xs font-medium md:text-sm">
              Input:
            </label>
            <div className="bg-muted space-y-2 rounded-lg border p-2.5 md:p-3 dark:border-[#1a1a1a] dark:bg-[#232323]">
              {currentTestCase.input.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1.5 font-mono text-xs sm:flex-row sm:items-center sm:gap-2 md:text-sm"
                >
                  <span className="text-muted-foreground shrink-0 sm:min-w-0">
                    {item.key} =
                  </span>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateInputValue(idx, e.target.value)}
                    className="focus:border-primary bg-background text-foreground w-full flex-1 rounded border px-2 py-1.5 transition-colors outline-none md:py-1 dark:border-[#1a1a1a] dark:bg-[#2d2d2d]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground block text-xs font-medium md:text-sm">
              Expected Output:
            </label>
            <div className="bg-muted rounded-lg border p-2.5 md:p-3 dark:border-[#1a1a1a] dark:bg-[#232323]">
              <input
                type="text"
                value={currentTestCase.output}
                onChange={(e) => updateOutputValue(e.target.value)}
                className="focus:border-primary bg-background text-foreground w-full rounded border px-2 py-1.5 font-mono text-xs transition-colors outline-none md:py-1 md:text-sm dark:border-[#1a1a1a] dark:bg-[#2d2d2d]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
