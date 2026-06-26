"use client";

import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Code2,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui";

import { useCreateAdminCodingProblem } from "../hooks";
import type {
  AdminCodingDifficulty,
  AdminCodingProblemExample,
  AdminCodingProblemTestCase,
  CreateAdminCodingProblemBody,
} from "../types";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

type StarterCode = Record<
  "javascript" | "typescript" | "python" | "cpp",
  string
>;

const emptyExample = (): AdminCodingProblemExample => ({
  input: "",
  output: "",
  explanation: "",
});

const emptyTestCase = (sortOrder: number): AdminCodingProblemTestCase => ({
  input: "",
  output: "",
  isHidden: false,
  sortOrder,
});

const defaultStarterCode: StarterCode = {
  javascript: "function twoSum(nums, target) {\n  // Write your code here\n}",
  typescript:
    "function twoSum(nums: number[], target: number): number[] {\n  // Write your code here\n  return [];\n}",
  python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
  cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};",
};

const languageOptions = [
  { key: "javascript", label: "JavaScript" },
  { key: "typescript", label: "TypeScript" },
  { key: "python", label: "Python" },
  { key: "cpp", label: "C++" },
] as const;

export function AdminCreateCodingProblemPage() {
  const router = useRouter();
  const createProblem = useCreateAdminCodingProblem();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState<AdminCodingDifficulty>("EASY");
  const [topics, setTopics] = useState("");
  const [companies, setCompanies] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [hint, setHint] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState<AdminCodingProblemExample[]>([
    emptyExample(),
  ]);
  const [constraints, setConstraints] = useState([
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ]);
  const [starterCode, setStarterCode] =
    useState<StarterCode>(defaultStarterCode);
  const [testCases, setTestCases] = useState<AdminCodingProblemTestCase[]>([
    emptyTestCase(0),
  ]);

  const visibleTestCaseCount = useMemo(
    () => testCases.filter((testCase) => !testCase.isHidden).length,
    [testCases],
  );
  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    examples.some((example) => example.input.trim() && example.output.trim()) &&
    testCases.some(
      (testCase) =>
        !testCase.isHidden && testCase.input.trim() && testCase.output.trim(),
    );

  const navigateToAdmin = () => router.push("/admin");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body: CreateAdminCodingProblemBody = {
      title: title.trim(),
      ...(slug.trim() && { slug: slug.trim() }),
      difficulty,
      description: description.trim(),
      ...(constraints.some((constraint) => constraint.trim()) && {
        constraints: constraints
          .map((constraint) => constraint.trim())
          .filter(Boolean)
          .join("\n"),
      }),
      examples: examples
        .map((example) => ({
          input: example.input.trim(),
          output: example.output.trim(),
          ...(example.explanation?.trim() && {
            explanation: example.explanation.trim(),
          }),
        }))
        .filter((example) => example.input && example.output),
      starterCode: Object.fromEntries(
        Object.entries(starterCode).filter(([, code]) => code.trim()),
      ),
      testCases: testCases
        .map((testCase, index) => ({
          input: testCase.input.trim(),
          output: testCase.output.trim(),
          isHidden: testCase.isHidden,
          sortOrder: testCase.sortOrder ?? index,
        }))
        .filter((testCase) => testCase.input && testCase.output),
      ...(topics.trim() && { topics: splitList(topics) }),
      ...(companies.trim() && { companies: splitList(companies) }),
      ...(hint.trim() && { hint: hint.trim() }),
      isPremium,
    };

    await createProblem.mutateAsync(body);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-[0.22] dark:opacity-[0.18]">
        <div className="absolute top-[-12rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] bottom-[18rem] h-[26rem] w-[26rem] rounded-full bg-[var(--chart-2)]/15 blur-3xl" />
      </div>

      <AdminSidebar
        activeSection="coding"
        onNavigate={navigateToAdmin}
        onOpenChange={setSidebarOpen}
        open={sidebarOpen}
      />

      <div className="relative min-h-screen lg:pl-[280px]">
        <AdminTopbar
          onOpenSidebar={() => setSidebarOpen(true)}
          title="Create coding problem"
        />

        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
          <form
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  className="w-fit gap-2 rounded-lg"
                  onClick={() => router.back()}
                  type="button"
                  variant="outline"
                >
                  <ArrowLeft className="size-4" />
                  Cancel
                </Button>
                <Button
                  className="w-fit gap-2 rounded-lg"
                  disabled={!canSubmit || createProblem.isPending}
                  type="submit"
                >
                  <Save className="size-4" />
                  {createProblem.isPending ? "Saving..." : "Save Problem"}
                </Button>
              </div>

              <FormCard
                description="Core problem metadata used across the practice library."
                title="Basic information"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Two Sum"
                      value={title}
                    />
                  </Field>
                  <Field label="Slug">
                    <Input
                      onChange={(event) => setSlug(event.target.value)}
                      placeholder="two-sum"
                      value={slug}
                    />
                  </Field>
                  <Field label="Difficulty">
                    <Select
                      onValueChange={(value) =>
                        setDifficulty(value as AdminCodingDifficulty)
                      }
                      value={difficulty}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Topics / Tags">
                    <Input
                      onChange={(event) => setTopics(event.target.value)}
                      placeholder="arrays, hash table"
                      value={topics}
                    />
                  </Field>
                  <Field label="Companies">
                    <Input
                      onChange={(event) => setCompanies(event.target.value)}
                      placeholder="Google, Meta"
                      value={companies}
                    />
                  </Field>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary/35 px-4 py-3">
                    <div>
                      <Label htmlFor="premium-problem">Is Premium</Label>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Mark this problem as premium content.
                      </p>
                    </div>
                    <Checkbox
                      checked={isPremium}
                      id="premium-problem"
                      onCheckedChange={(checked) =>
                        setIsPremium(checked === true)
                      }
                    />
                  </div>
                </div>
                <Field label="Hint">
                  <Textarea
                    className="min-h-24"
                    onChange={(event) => setHint(event.target.value)}
                    placeholder="Try storing previously seen values in a map."
                    value={hint}
                  />
                </Field>
              </FormCard>

              <FormCard
                description="The statement candidates see before writing code."
                title="Problem statement"
              >
                <Field label="Description">
                  <Textarea
                    className="min-h-52"
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Given an array of integers nums and an integer target..."
                    value={description}
                  />
                </Field>
              </FormCard>

              <FormCard
                action={
                  <Button
                    className="gap-2 rounded-lg"
                    onClick={() =>
                      setExamples((currentExamples) => [
                        ...currentExamples,
                        emptyExample(),
                      ])
                    }
                    type="button"
                    variant="outline"
                  >
                    <Plus className="size-4" />
                    Add Example
                  </Button>
                }
                description="Visible sample cases with optional explanation."
                title="Examples"
              >
                {examples.map((example, index) => (
                  <RepeatableBlock
                    canRemove={examples.length > 1}
                    key={`example-${index}`}
                    onRemove={() =>
                      setExamples((currentExamples) =>
                        currentExamples.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      )
                    }
                    title={`Example ${index + 1}`}
                  >
                    <Field label="Input">
                      <Textarea
                        onChange={(event) =>
                          updateExample(
                            index,
                            "input",
                            event.target.value,
                            setExamples,
                          )
                        }
                        value={example.input}
                      />
                    </Field>
                    <Field label="Output">
                      <Textarea
                        onChange={(event) =>
                          updateExample(
                            index,
                            "output",
                            event.target.value,
                            setExamples,
                          )
                        }
                        value={example.output}
                      />
                    </Field>
                    <Field label="Explanation">
                      <Textarea
                        onChange={(event) =>
                          updateExample(
                            index,
                            "explanation",
                            event.target.value,
                            setExamples,
                          )
                        }
                        value={example.explanation ?? ""}
                      />
                    </Field>
                  </RepeatableBlock>
                ))}
              </FormCard>

              <FormCard
                action={
                  <Button
                    className="gap-2 rounded-lg"
                    onClick={() =>
                      setConstraints((currentConstraints) => [
                        ...currentConstraints,
                        "",
                      ])
                    }
                    type="button"
                    variant="outline"
                  >
                    <Plus className="size-4" />
                    Add Constraint
                  </Button>
                }
                description="One constraint per row. They are stored as a single statement block."
                title="Constraints"
              >
                <div className="space-y-3">
                  {constraints.map((constraint, index) => (
                    <div className="flex gap-2" key={`constraint-${index}`}>
                      <Input
                        onChange={(event) =>
                          setConstraints((currentConstraints) =>
                            currentConstraints.map((current, itemIndex) =>
                              itemIndex === index
                                ? event.target.value
                                : current,
                            ),
                          )
                        }
                        value={constraint}
                      />
                      <Button
                        aria-label="Remove constraint"
                        disabled={constraints.length === 1}
                        onClick={() =>
                          setConstraints((currentConstraints) =>
                            currentConstraints.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        size="icon"
                        type="button"
                        variant="outline"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </FormCard>

              <FormCard
                description="Starter code is stored per language key."
                title="Starter code"
              >
                <div className="grid gap-4">
                  {languageOptions.map((language) => (
                    <Field key={language.key} label={language.label}>
                      <Textarea
                        className="min-h-40 font-mono text-xs"
                        onChange={(event) =>
                          setStarterCode((currentCode) => ({
                            ...currentCode,
                            [language.key]: event.target.value,
                          }))
                        }
                        value={starterCode[language.key]}
                      />
                    </Field>
                  ))}
                </div>
              </FormCard>

              <FormCard
                action={
                  <Button
                    className="gap-2 rounded-lg"
                    onClick={() =>
                      setTestCases((currentCases) => [
                        ...currentCases,
                        emptyTestCase(currentCases.length),
                      ])
                    }
                    type="button"
                    variant="outline"
                  >
                    <Plus className="size-4" />
                    Add Test Case
                  </Button>
                }
                description="At least one visible test case is required."
                title="Test cases"
              >
                {testCases.map((testCase, index) => (
                  <RepeatableBlock
                    canRemove={testCases.length > 1}
                    key={`test-case-${index}`}
                    onRemove={() =>
                      setTestCases((currentCases) =>
                        currentCases.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      )
                    }
                    title={`Test case ${index + 1}`}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Input">
                        <Textarea
                          onChange={(event) =>
                            updateTestCase(
                              index,
                              "input",
                              event.target.value,
                              setTestCases,
                            )
                          }
                          value={testCase.input}
                        />
                      </Field>
                      <Field label="Expected Output">
                        <Textarea
                          onChange={(event) =>
                            updateTestCase(
                              index,
                              "output",
                              event.target.value,
                              setTestCases,
                            )
                          }
                          value={testCase.output}
                        />
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Field label="Sort Order">
                        <Input
                          min={0}
                          onChange={(event) =>
                            updateTestCase(
                              index,
                              "sortOrder",
                              Number(event.target.value),
                              setTestCases,
                            )
                          }
                          type="number"
                          value={testCase.sortOrder ?? index}
                        />
                      </Field>
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-secondary/35 px-4 py-3">
                        <Checkbox
                          checked={testCase.isHidden}
                          id={`test-case-hidden-${index}`}
                          onCheckedChange={(checked) =>
                            updateTestCase(
                              index,
                              "isHidden",
                              checked === true,
                              setTestCases,
                            )
                          }
                        />
                        <Label
                          className="flex items-center gap-2 text-sm"
                          htmlFor={`test-case-hidden-${index}`}
                        >
                          {testCase.isHidden ? (
                            <EyeOff className="size-4 text-muted-foreground" />
                          ) : (
                            <Eye className="size-4 text-muted-foreground" />
                          )}
                          Hidden / Visible
                        </Label>
                      </div>
                    </div>
                  </RepeatableBlock>
                ))}
              </FormCard>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <Card className="rounded-lg bg-card/78">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-secondary/70 text-primary">
                      <Code2 className="size-4" />
                    </span>
                    <div>
                      <CardTitle>Preview summary</CardTitle>
                      <CardDescription>Ready for admin review</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SummaryRow label="Title" value={title || "Untitled"} />
                  <SummaryRow label="Difficulty" value={difficulty} />
                  <SummaryRow
                    label="Visibility"
                    value={isPremium ? "Premium" : "Free"}
                  />
                  <SummaryRow label="Examples" value={examples.length} />
                  <SummaryRow label="Test cases" value={testCases.length} />
                  <SummaryRow
                    label="Visible cases"
                    value={visibleTestCaseCount}
                  />
                  <div className="flex flex-wrap gap-2">
                    {splitList(topics).map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    className="w-full gap-2 rounded-lg"
                    disabled={!canSubmit || createProblem.isPending}
                    type="submit"
                  >
                    <Save className="size-4" />
                    {createProblem.isPending ? "Saving..." : "Save Problem"}
                  </Button>
                  <Button
                    className="w-full rounded-lg"
                    onClick={() => router.back()}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </form>
        </main>
      </div>
    </div>
  );
}

function FormCard({
  action,
  children,
  description,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card className="rounded-lg bg-card/78">
      <CardHeader className="gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="space-y-2">
      <Label className="font-semibold text-heading text-sm">{label}</Label>
      {children}
    </div>
  );
}

function RepeatableBlock({
  canRemove,
  children,
  onRemove,
  title,
}: {
  canRemove: boolean;
  children: ReactNode;
  onRemove: () => void;
  title: string;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface-secondary/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-heading text-sm">{title}</p>
        <Button
          aria-label={`Remove ${title}`}
          disabled={!canRemove}
          onClick={onRemove}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-secondary/35 px-3 py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-semibold text-heading text-sm">{value}</span>
    </div>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateExample(
  index: number,
  key: keyof AdminCodingProblemExample,
  value: string,
  setExamples: Dispatch<SetStateAction<AdminCodingProblemExample[]>>,
) {
  setExamples((currentExamples) =>
    currentExamples.map((example, itemIndex) =>
      itemIndex === index ? { ...example, [key]: value } : example,
    ),
  );
}

function updateTestCase<Key extends keyof AdminCodingProblemTestCase>(
  index: number,
  key: Key,
  value: AdminCodingProblemTestCase[Key],
  setTestCases: Dispatch<SetStateAction<AdminCodingProblemTestCase[]>>,
) {
  setTestCases((currentCases) =>
    currentCases.map((testCase, itemIndex) =>
      itemIndex === index ? { ...testCase, [key]: value } : testCase,
    ),
  );
}
