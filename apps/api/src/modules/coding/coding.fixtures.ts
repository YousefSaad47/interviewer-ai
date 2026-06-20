import { faker } from "@faker-js/faker";

interface CodingSubmitInputFixture {
  problemId: string;
  code: string;
  language: string;
}

interface CodingResultFixture {
  id: string;
  passed: boolean;
  output: string | null;
  error: string | null;
  submissionId: string;
  testCaseId: string;
  createdAt: string;
  updatedAt: string;
}

type Status =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface CodingSubmissionResponseFixture {
  id: string;
  code: string;
  language: string;
  status: Status;
  judge0Token: string | null;
  logicScore: number | null;
  namingScore: number | null;
  efficiencyScore: number | null;
  bestPracticesScore: number | null;
  aiFeedback: string | null;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  problemId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  results: CodingResultFixture[];
  problem: {
    id: string;
    title: string;
    difficulty: Difficulty;
  };
}

export const createCodingSubmitInput = (
  overrides: Partial<CodingSubmitInputFixture> = {},
): CodingSubmitInputFixture => ({
  problemId: faker.string.uuid(),
  code: faker.helpers.arrayElement([
    'console.log("Hello, World!")',
    'print("Hello, World!")',
    "function twoSum(nums, target) { return [0, 1]; }",
    'System.out.println("Hello, World!");',
  ]),
  language: faker.helpers.arrayElement([
    "javascript",
    "python",
    "java",
    "cpp",
    "typescript",
  ]),
  ...overrides,
});

export const createCodingResult = (
  overrides: Partial<CodingResultFixture> = {},
): CodingResultFixture => ({
  id: faker.string.uuid(),
  passed: true,
  output: "Hello, World!\n",
  error: null,
  submissionId: faker.string.uuid(),
  testCaseId: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createCodingSubmissionResponse = (
  overrides: Partial<CodingSubmissionResponseFixture> = {},
): CodingSubmissionResponseFixture => ({
  id: faker.string.uuid(),
  code: 'console.log("Hello, World!")',
  language: "javascript",
  status: "ACCEPTED",
  judge0Token: faker.string.uuid(),
  logicScore: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
  namingScore: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
  efficiencyScore: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
  bestPracticesScore: faker.number.float({
    min: 0,
    max: 100,
    fractionDigits: 1,
  }),
  aiFeedback: faker.lorem.sentence(),
  executionTimeMs: faker.number.int({ min: 0, max: 5000 }),
  memoryUsedKb: faker.number.int({ min: 1000, max: 256000 }),
  problemId: faker.string.uuid(),
  userId: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  results: [createCodingResult()],
  problem: {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      "Two Sum",
      "Reverse Linked List",
      "Binary Search",
      "Merge Sort",
      "LRU Cache",
    ]),
    difficulty: faker.helpers.arrayElement(["EASY", "MEDIUM", "HARD"]),
  },
  ...overrides,
});
