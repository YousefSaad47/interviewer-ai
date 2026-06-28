import { hashPassword } from "better-auth/crypto";

import { prisma } from "../src/lib/prisma";

const ADMIN_EMAIL = "mohamedabdelkreem770@gmail.com";
const DEFAULT_PASSWORD = "123456789";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * DAY);
const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 60 * 60 * 1000);

const seededUsers = [
  {
    name: "Mohamed Abdelkreem",
    email: ADMIN_EMAIL,
    role: "SUPER_ADMIN" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Karim Amin",
    email: "karim.admin@interviewer.ai",
    role: "ADMIN" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Sara Hassan",
    email: "sara.admin@interviewer.ai",
    role: "ADMIN" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Ahmed Ali",
    email: "ahmed.ali@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Mariam Adel",
    email: "mariam.adel@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Omar Khaled",
    email: "omar.khaled@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Nour Mohamed",
    email: "nour.mohamed@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Youssef Samir",
    email: "youssef.samir@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Salma Tarek",
    email: "salma.tarek@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Mostafa Mahmoud",
    email: "mostafa.mahmoud@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Hana Ashraf",
    email: "hana.ashraf@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Ali Wael",
    email: "ali.wael@interviewer.ai",
    role: "USER" as const,
    status: "ACTIVE" as const,
  },
  {
    name: "Laila Emad",
    email: "laila.emad@interviewer.ai",
    role: "USER" as const,
    status: "DISABLED" as const,
  },
];

const problemDefs = [
  // 5 very easy LeetCode-style problems
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "EASY" as const,
    description:
      "Given an integer array and a target, return the indices of two different elements whose sum equals the target.",
    constraints: "2 <= nums.length <= 10^4",
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Google"],
    hint: "Store each visited value and its index in a hash map.",
    examples: [{ input: "2 7 11 15\n9", output: "0 1" }],
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1\n", sortOrder: 0 },
      { input: "3 2 4\n6", output: "1 2\n", sortOrder: 1 },
      { input: "3 3\n6", output: "0 1\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "EASY" as const,
    description:
      "Determine whether every opening bracket in the input is closed by the correct bracket in the correct order.",
    constraints: "1 <= s.length <= 10^4",
    topics: ["String", "Stack"],
    companies: ["Meta", "Microsoft"],
    hint: "Push opening brackets onto a stack and match them when closing brackets appear.",
    examples: [{ input: "()[]{}", output: "true" }],
    testCases: [
      { input: "()", output: "true\n", sortOrder: 0 },
      { input: "()[]{}", output: "true\n", sortOrder: 1 },
      { input: "([)]", output: "false\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "EASY" as const,
    description:
      "Given daily stock prices, return the maximum profit possible from one buy followed by one sell.",
    constraints: "1 <= prices.length <= 10^5",
    topics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Bloomberg"],
    hint: "Track the lowest price seen so far and the best profit.",
    examples: [{ input: "7 1 5 3 6 4", output: "5" }],
    testCases: [
      { input: "7 1 5 3 6 4", output: "5\n", sortOrder: 0 },
      { input: "7 6 4 3 1", output: "0\n", sortOrder: 1 },
      { input: "2 4 1 8", output: "7\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "EASY" as const,
    description:
      "Return true when any value appears at least twice in the array; otherwise return false.",
    constraints: "1 <= nums.length <= 10^5",
    topics: ["Array", "Hash Table", "Sorting"],
    companies: ["Apple", "Adobe"],
    hint: "Compare the array length with the size of a set built from it.",
    examples: [{ input: "1 2 3 1", output: "true" }],
    testCases: [
      { input: "1 2 3 1", output: "true\n", sortOrder: 0 },
      { input: "1 2 3 4", output: "false\n", sortOrder: 1 },
      {
        input: "1 1 1 3 3 4 3 2 4 2",
        output: "true\n",
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "EASY" as const,
    description:
      "Search a sorted integer array for a target and return its index, or -1 when it is absent.",
    constraints: "1 <= nums.length <= 10^4",
    topics: ["Array", "Binary Search"],
    companies: ["Google", "Microsoft"],
    hint: "Repeatedly discard the half that cannot contain the target.",
    examples: [{ input: "-1 0 3 5 9 12\n9", output: "4" }],
    testCases: [
      { input: "-1 0 3 5 9 12\n9", output: "4\n", sortOrder: 0 },
      { input: "-1 0 3 5 9 12\n2", output: "-1\n", sortOrder: 1 },
      { input: "5\n5", output: "0\n", sortOrder: 2, isHidden: true },
    ],
  },

  // 5 medium LeetCode-style problems
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "MEDIUM" as const,
    description:
      "Group words that contain the same letters with the same frequencies. Print each group on a separate line.",
    constraints: "1 <= words.length <= 10^4",
    topics: ["Array", "Hash Table", "String", "Sorting"],
    companies: ["Amazon", "Meta"],
    hint: "Use each sorted word as a grouping key.",
    examples: [
      { input: "eat tea tan ate nat bat", output: "eat tea ate\ntan nat\nbat" },
    ],
    testCases: [
      {
        input: "eat tea tan ate nat bat",
        output: "eat tea ate\ntan nat\nbat\n",
        sortOrder: 0,
      },
      { input: "a", output: "a\n", sortOrder: 1 },
      {
        input: "abc bca cab foo",
        output: "abc bca cab\nfoo\n",
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "MEDIUM" as const,
    description:
      "For every index, return the product of all array values except the value at that index without division.",
    constraints: "2 <= nums.length <= 10^5",
    topics: ["Array", "Prefix Sum"],
    companies: ["Amazon", "Microsoft"],
    hint: "Combine prefix products with suffix products.",
    examples: [{ input: "1 2 3 4", output: "24 12 8 6" }],
    testCases: [
      { input: "1 2 3 4", output: "24 12 8 6\n", sortOrder: 0 },
      { input: "-1 1 0 -3 3", output: "0 0 9 0 0\n", sortOrder: 1 },
      { input: "2 3", output: "3 2\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM" as const,
    description:
      "Return the length of the longest contiguous substring containing no repeated character.",
    constraints: "0 <= s.length <= 5 * 10^4",
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Google"],
    hint: "Maintain a sliding window and the most recent index of each character.",
    examples: [{ input: "abcabcbb", output: "3" }],
    testCases: [
      { input: "abcabcbb", output: "3\n", sortOrder: 0 },
      { input: "bbbbb", output: "1\n", sortOrder: 1 },
      { input: "pwwkew", output: "3\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "three-sum",
    title: "3Sum",
    difficulty: "MEDIUM" as const,
    description:
      "Return all unique triplets whose values sum to zero. Print one sorted triplet per line.",
    constraints: "3 <= nums.length <= 3000",
    topics: ["Array", "Two Pointers", "Sorting"],
    companies: ["Meta", "Amazon"],
    hint: "Sort the array, fix one value, then use two pointers.",
    examples: [{ input: "-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1" }],
    testCases: [
      { input: "-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1\n", sortOrder: 0 },
      { input: "0 1 1", output: "\n", sortOrder: 1 },
      { input: "0 0 0", output: "0 0 0\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "MEDIUM" as const,
    description:
      "Choose two vertical lines that form a container with the x-axis and return the maximum water area.",
    constraints: "2 <= height.length <= 10^5",
    topics: ["Array", "Two Pointers", "Greedy"],
    companies: ["Amazon", "Google"],
    hint: "Move the pointer at the shorter line toward the center.",
    examples: [{ input: "1 8 6 2 5 4 8 3 7", output: "49" }],
    testCases: [
      { input: "1 8 6 2 5 4 8 3 7", output: "49\n", sortOrder: 0 },
      { input: "1 1", output: "1\n", sortOrder: 1 },
      { input: "4 3 2 1 4", output: "16\n", sortOrder: 2, isHidden: true },
    ],
  },

  // 5 hard LeetCode-style problems
  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD" as const,
    description:
      "Given two sorted arrays, return the median of all values with logarithmic complexity in the smaller array.",
    constraints: "0 <= m, n <= 1000; m + n >= 1",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Microsoft"],
    hint: "Binary-search the partition position in the smaller array.",
    examples: [{ input: "1 3\n2", output: "2.0" }],
    testCases: [
      { input: "1 3\n2", output: "2.0\n", sortOrder: 0 },
      { input: "1 2\n3 4", output: "2.5\n", sortOrder: 1 },
      { input: "0 0\n0 0", output: "0.0\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "HARD" as const,
    description:
      "Given bar heights, calculate the total amount of rain water trapped between the bars.",
    constraints: "1 <= height.length <= 2 * 10^4",
    topics: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    companies: ["Amazon", "Google"],
    hint: "Track the maximum wall seen from both ends using two pointers.",
    examples: [{ input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6" }],
    testCases: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6\n", sortOrder: 0 },
      { input: "4 2 0 3 2 5", output: "9\n", sortOrder: 1 },
      { input: "3 0 0 2 0 4", output: "10\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    difficulty: "HARD" as const,
    description:
      "Merge several sorted integer lists into one sorted list. Input lists are separated by semicolons.",
    constraints: "0 <= k <= 10^4",
    topics: ["Linked List", "Divide and Conquer", "Heap"],
    companies: ["Amazon", "Meta"],
    hint: "Keep the smallest current head in a min-heap.",
    examples: [{ input: "1 4 5;1 3 4;2 6", output: "1 1 2 3 4 4 5 6" }],
    testCases: [
      { input: "1 4 5;1 3 4;2 6", output: "1 1 2 3 4 4 5 6\n", sortOrder: 0 },
      { input: "", output: "\n", sortOrder: 1 },
      { input: "1;0", output: "0 1\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "HARD" as const,
    description:
      "Return the shortest substring of the first string that contains every character of the second string with matching frequencies.",
    constraints: "1 <= s.length, t.length <= 10^5",
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Meta", "Uber"],
    hint: "Expand until the window is valid, then shrink while it stays valid.",
    examples: [{ input: "ADOBECODEBANC\nABC", output: "BANC" }],
    testCases: [
      { input: "ADOBECODEBANC\nABC", output: "BANC\n", sortOrder: 0 },
      { input: "a\na", output: "a\n", sortOrder: 1 },
      { input: "a\naa", output: "\n", sortOrder: 2, isHidden: true },
    ],
  },
  {
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "HARD" as const,
    description:
      "Given histogram bar heights, return the largest rectangular area that can be formed by consecutive bars.",
    constraints: "1 <= heights.length <= 10^5",
    topics: ["Array", "Stack", "Monotonic Stack"],
    companies: ["Google", "Amazon"],
    hint: "Use a monotonic increasing stack of bar indices.",
    examples: [{ input: "2 1 5 6 2 3", output: "10" }],
    testCases: [
      { input: "2 1 5 6 2 3", output: "10\n", sortOrder: 0 },
      { input: "2 4", output: "4\n", sortOrder: 1 },
      { input: "1 1 1 1", output: "4\n", sortOrder: 2, isHidden: true },
    ],
  },
];

const interviewTemplates = [
  {
    category: "BACKEND" as const,
    difficulty: "MEDIUM" as const,
    questions: [
      "Explain how Node.js handles concurrent I/O operations.",
      "When would you use a message queue in a backend system?",
      "How do database transactions protect data consistency?",
      "Describe a secure access-token and refresh-token flow.",
      "How would you diagnose a slow API endpoint?",
    ],
  },
  {
    category: "SYSTEM_DESIGN" as const,
    difficulty: "HARD" as const,
    questions: [
      "Design a scalable URL-shortening service.",
      "How would you partition a rapidly growing relational database?",
      "Design a notification service that supports email and push messages.",
      "How do you make an API idempotent?",
      "Explain cache invalidation strategies for a distributed system.",
    ],
  },
  {
    category: "BEHAVIORAL" as const,
    difficulty: "MEDIUM" as const,
    questions: [
      "Tell me about a difficult technical decision you made.",
      "Describe a disagreement with a teammate and how you resolved it.",
      "How do you prioritize tasks when several deadlines overlap?",
      "Tell me about a production incident you helped resolve.",
      "What feedback changed the way you work?",
    ],
  },
  {
    category: "ALGORITHMS" as const,
    difficulty: "MEDIUM" as const,
    questions: [
      "Compare breadth-first search and depth-first search.",
      "Explain the time complexity of hash-table operations.",
      "How would you detect a cycle in a linked list?",
      "When is dynamic programming appropriate?",
      "Explain the difference between stable and unstable sorting.",
    ],
  },
];

function buildResumeContent(name: string, index: number) {
  return {
    personal: {
      fullName: name,
      headline: index % 2 === 0 ? "Backend Developer" : "Full-Stack Developer",
      location: "Cairo, Egypt",
    },
    summary:
      "Software developer focused on building reliable web applications, clean APIs, and maintainable systems.",
    skills: ["TypeScript", "Node.js", "React", "PostgreSQL", "Docker"],
    experience: [
      {
        company: "Tech Studio",
        role: index % 2 === 0 ? "Backend Developer" : "Software Engineer",
        startDate: "2024-01",
        endDate: "Present",
      },
    ],
    education: [
      {
        school: "Higher Technological Institute",
        degree: "B.Sc. Computer Science",
        graduationYear: 2026,
      },
    ],
  };
}

async function createCredentialAccount(userId: string, passwordHash: string) {
  await prisma.account.deleteMany({
    where: { userId, providerId: "credential" },
  });

  await prisma.account.create({
    data: {
      accountId: userId,
      providerId: "credential",
      password: passwordHash,
      userId,
    },
  });
}

async function main() {
  console.log("Seeding rich demo data...");

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  const seededEmails = seededUsers.map((user) => user.email);

  // Remove only records created by this seed, making it safe to rerun locally.
  await prisma.user.deleteMany({ where: { email: { in: seededEmails } } });
  await prisma.question.deleteMany({
    where: { text: { startsWith: "[SEED]" } },
  });
  await prisma.jobDescription.deleteMany({
    where: { company: { startsWith: "[SEED]" } },
  });

  const users: Array<{
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "DISABLED";
  }> = [];
  for (let index = 0; index < seededUsers.length; index += 1) {
    const seedUser = seededUsers[index];
    const createdAt = daysAgo(48 - index * 3);

    const user = await prisma.user.create({
      data: {
        name: seedUser.name,
        email: seedUser.email,
        emailVerified: true,
        role: seedUser.role,
        status: seedUser.status,
        createdAt,
        settings: {
          create: {
            interviewGoal: index === 0 ? 8 : 3 + (index % 3),
            problemGoal: index === 0 ? 15 : 5 + (index % 4) * 2,
          },
        },
      },
    });

    await createCredentialAccount(user.id, passwordHash);
    users.push(user);
  }

  const admin = users[0];
  if (!admin) throw new Error("Admin user was not created");

  console.log(`Admin login: ${ADMIN_EMAIL} / ${DEFAULT_PASSWORD}`);
  console.log(`Users created: ${users.length}`);

  // Coding problems: exactly 5 easy, 5 medium, and 5 hard.
  const problems = [];
  for (const definition of problemDefs) {
    const problem = await prisma.codingProblem.upsert({
      where: { slug: definition.slug },
      update: {
        title: definition.title,
        difficulty: definition.difficulty,
        description: definition.description,
        constraints: definition.constraints,
        examples: definition.examples,
        topics: definition.topics,
        companies: definition.companies,
        hint: definition.hint,
      },
      create: {
        slug: definition.slug,
        title: definition.title,
        difficulty: definition.difficulty,
        description: definition.description,
        constraints: definition.constraints,
        examples: definition.examples,
        topics: definition.topics,
        companies: definition.companies,
        hint: definition.hint,
        testCases: { create: definition.testCases },
      },
    });

    const testCaseCount = await prisma.testCase.count({
      where: { problemId: problem.id },
    });
    if (testCaseCount === 0) {
      await prisma.testCase.createMany({
        data: definition.testCases.map((testCase) => ({
          ...testCase,
          problemId: problem.id,
        })),
      });
    }

    problems.push(problem);
  }

  // Rich coding activity for dashboard and analytics charts.
  for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
    const user = users[userIndex];
    if (!user || user.status === "DISABLED") continue;

    const submissionCount = userIndex === 0 ? 24 : 3 + (userIndex % 7);
    for (
      let submissionIndex = 0;
      submissionIndex < submissionCount;
      submissionIndex += 1
    ) {
      const problem =
        problems[(userIndex * 2 + submissionIndex) % problems.length];
      if (!problem) continue;

      const testCases = await prisma.testCase.findMany({
        where: { problemId: problem.id },
        orderBy: { sortOrder: "asc" },
      });
      const accepted =
        userIndex === 0
          ? submissionIndex < 18
          : (userIndex + submissionIndex) % 4 !== 0;

      await prisma.codingSubmission.create({
        data: {
          code: `// Seed solution for ${problem.slug}\nfunction solve(input) {\n  return input.trim();\n}`,
          language: submissionIndex % 3 === 0 ? "typescript" : "javascript",
          status: accepted ? "ACCEPTED" : "WRONG_ANSWER",
          astHash: `seed-${user.id}-${problem.id}-${submissionIndex}`,
          judge0Token: `seed-token-${user.id}-${problem.id}-${submissionIndex}`,
          logicScore: accepted
            ? userIndex === 0
              ? 94 + (submissionIndex % 5)
              : 82 + (submissionIndex % 15)
            : 45,
          namingScore: accepted ? (userIndex === 0 ? 96 : 86) : 58,
          efficiencyScore: accepted
            ? userIndex === 0
              ? 92 + (submissionIndex % 6)
              : 79 + (submissionIndex % 18)
            : 40,
          bestPracticesScore: accepted ? (userIndex === 0 ? 95 : 84) : 52,
          aiFeedback: accepted
            ? "Good solution. Consider documenting edge cases and complexity."
            : "Review the failing edge cases and verify the chosen algorithm.",
          executionTimeMs: 35 + submissionIndex * 7,
          memoryUsedKb: 18000 + submissionIndex * 600,
          problemId: problem.id,
          userId: user.id,
          createdAt: hoursAgo(userIndex * 13 + submissionIndex * 17),
          results: {
            create: testCases.map((testCase, testIndex) => ({
              passed: accepted || testIndex === 0,
              output:
                accepted || testIndex === 0
                  ? testCase.output
                  : "Incorrect output\n",
              error:
                accepted || testIndex === 0
                  ? null
                  : "Expected output did not match",
              testCaseId: testCase.id,
            })),
          },
        },
      });
    }
  }

  // Mock interviews with questions, transcripts, and detailed AI feedback.
  let interviewCounter = 0;
  for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
    const user = users[userIndex];
    if (!user || user.status === "DISABLED") continue;

    const interviewsForUser = userIndex === 0 ? 10 : 1 + (userIndex % 3);
    for (
      let interviewIndex = 0;
      interviewIndex < interviewsForUser;
      interviewIndex += 1
    ) {
      const template =
        interviewTemplates[
          (userIndex + interviewIndex) % interviewTemplates.length
        ];
      if (!template) continue;

      const completed =
        userIndex === 0 ? true : (userIndex + interviewIndex) % 5 !== 0;
      const startedAt = daysAgo(1 + interviewCounter * 2);
      const interview = await prisma.interview.create({
        data: {
          category: template.category,
          difficulty: template.difficulty,
          status: completed ? "COMPLETED" : "ABANDONED",
          questionCount: template.questions.length,
          currentQuestion: completed ? template.questions.length : 2,
          startedAt,
          completedAt: completed
            ? new Date(
                startedAt.getTime() + (24 + interviewIndex * 6) * 60 * 1000,
              )
            : null,
          humeChatId: `seed-chat-${interviewCounter}`,
          humeChatGroupId: `seed-group-${Math.floor(interviewCounter / 3)}`,
          userId: user.id,
        },
      });

      for (
        let questionIndex = 0;
        questionIndex < template.questions.length;
        questionIndex += 1
      ) {
        const questionText = template.questions[questionIndex];
        const question = await prisma.question.create({
          data: {
            category: template.category,
            difficulty: template.difficulty,
            text: `[SEED] ${questionText}`,
            suggestedAnswer:
              "A strong response should explain the concept, discuss trade-offs, and include a practical example.",
          },
        });

        const interviewQuestion = await prisma.interviewQuestion.create({
          data: {
            interviewId: interview.id,
            questionId: question.id,
            sortOrder: questionIndex,
            followUpText:
              questionIndex % 2 === 0
                ? "Can you give a concrete production example?"
                : null,
          },
        });

        if (completed || questionIndex < 2) {
          const score =
            userIndex === 0
              ? 88 + ((interviewIndex + questionIndex) % 10)
              : 68 + ((userIndex * 7 + questionIndex * 5) % 28);
          await prisma.answer.create({
            data: {
              transcript:
                "I would begin by clarifying the requirements, explain the core idea, discuss trade-offs, and then describe how I used it in a real project.",
              durationMs:
                userIndex === 0
                  ? 180_000 + questionIndex * 25_000
                  : 72_000 + questionIndex * 11_000,
              interviewQuestionId: interviewQuestion.id,
              interviewId: interview.id,
              humeChatId: `seed-answer-chat-${interviewCounter}-${questionIndex}`,
              humeChatGroupId: `seed-group-${Math.floor(interviewCounter / 3)}`,
              feedback: {
                create: {
                  idealAnswer:
                    "Define the concept clearly, explain the implementation, mention alternatives, and finish with measurable impact.",
                  strengths: [
                    "Clear structure",
                    "Relevant example",
                    "Good technical vocabulary",
                  ],
                  improvements: [
                    "Quantify the outcome",
                    "Mention one more trade-off",
                  ],
                  overallScore: score,
                  fillerWordCount: 2 + (questionIndex % 4),
                  fluencyScore: Math.min(98, score + 4),
                  clarityScore: Math.min(98, score + 6),
                  confidenceScore: Math.max(60, score - 2),
                  emotionalTone: { calm: 0.72, focused: 0.2, nervous: 0.08 },
                  sentimentScore: 0.74,
                  detailLevel: score > 82 ? "DETAILED" : "BALANCED",
                  relevanceScore: Math.min(100, score + 3),
                  technicalAccuracy: Math.min(100, score + 1),
                },
              },
            },
          });
        }
      }

      interviewCounter += 1;
    }
  }

  // Resume builder data with ATS scores and job matches.
  const jobDescriptions = await Promise.all([
    prisma.jobDescription.create({
      data: {
        title: "Backend Node.js Developer",
        company: "[SEED] CloudScale Labs",
        rawText:
          "Node.js TypeScript PostgreSQL REST APIs Docker Redis testing and system design.",
        keywords: [
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Docker",
          "Redis",
          "REST APIs",
        ],
      },
    }),
    prisma.jobDescription.create({
      data: {
        title: "Full-Stack Engineer",
        company: "[SEED] ProductFlow",
        rawText:
          "React Next.js Node.js TypeScript SQL CI/CD and cloud deployment.",
        keywords: ["React", "Next.js", "Node.js", "TypeScript", "SQL", "CI/CD"],
      },
    }),
  ]);

  for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
    const user = users[userIndex];
    if (!user || user.status === "DISABLED") continue;

    const resumeCount = userIndex === 0 ? 4 : userIndex % 3 === 0 ? 2 : 1;
    for (let resumeIndex = 0; resumeIndex < resumeCount; resumeIndex += 1) {
      const atsScore =
        userIndex === 0
          ? 92 + (resumeIndex % 4)
          : 64 + ((userIndex * 5 + resumeIndex * 9) % 32);
      const resume = await prisma.resume.create({
        data: {
          title: `${user.name} ${resumeIndex === 0 ? "Main Resume" : "Backend Resume"}`,
          status: atsScore >= 78 ? "COMPLETE" : "DRAFT",
          content: buildResumeContent(user.name, userIndex),
          atsScore,
          grammarScore: Math.min(98, atsScore + 7),
          suggestions: [
            "Add measurable achievements to the experience section.",
            "Include more role-specific keywords.",
            "Keep bullet points concise and action-oriented.",
          ],
          userId: user.id,
          createdAt: daysAgo(2 + userIndex + resumeIndex * 4),
        },
      });

      const job =
        jobDescriptions[(userIndex + resumeIndex) % jobDescriptions.length];
      if (!job) continue;
      await prisma.resumeMatch.create({
        data: {
          matchPct: Math.max(55, atsScore - 4),
          matchedKeywords: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
          missingKeywords: resumeIndex === 0 ? ["Redis", "CI/CD"] : ["AWS"],
          tailoredResume: buildResumeContent(user.name, userIndex),
          resumeId: resume.id,
          jobDescriptionId: job.id,
        },
      });
    }
  }

  // Performance snapshots produce useful dashboard and analytics trends.
  const performanceCategories = [
    "BACKEND",
    "SYSTEM_DESIGN",
    "ALGORITHMS",
  ] as const;
  for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
    const user = users[userIndex];
    if (!user || user.status === "DISABLED") continue;

    for (let week = 0; week < 6; week += 1) {
      const category =
        performanceCategories[
          (userIndex + week) % performanceCategories.length
        ];
      if (!category) continue;
      const baseScore =
        userIndex === 0 ? 84 + week * 2 : 61 + userIndex * 2 + week * 3;

      await prisma.performanceSnapshot.create({
        data: {
          snapshotDate: daysAgo(week * 7 + userIndex),
          category,
          avgConfidence: Math.min(96, baseScore - 2),
          avgFluency: Math.min(97, baseScore + 1),
          avgClarity: Math.min(98, baseScore + 3),
          avgScore: Math.min(95, baseScore),
          totalAnswered: userIndex === 0 ? 10 + week : 4 + (week % 5),
          timeSpentSec:
            userIndex === 0
              ? 3600 + week * 600
              : 900 + week * 220 + userIndex * 30,
          recommendation:
            week % 2 === 0
              ? "Practice structured answers using the STAR framework."
              : "Review system-design trade-offs and scalability patterns.",
          userId: user.id,
        },
      });
    }
  }

  const [userCount, adminCount, interviewCount, resumeCount, submissionCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.interview.count(),
      prisma.resume.count(),
      prisma.codingSubmission.count(),
    ]);

  console.log("Seed complete.");
  console.table({
    users: userCount,
    admins: adminCount,
    codingProblems: problems.length,
    interviews: interviewCount,
    resumes: resumeCount,
    codingSubmissions: submissionCount,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
