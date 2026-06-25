import { prisma } from "../src/lib/prisma";
import {
  createCodingResult,
  createCodingSubmissionResponse,
  createCodingSubmitInput,
} from "../src/modules/coding/coding.fixtures";

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "test@interviewer.ai" },
    update: {},
    create: {
      name: "Test User",
      email: "test@interviewer.ai",
      emailVerified: true,
    },
  });
  console.log(`User: ${user.id} (${user.email})`);

  const problemDefs = [
    // === EASY (1-7) ===
    {
      slug: "hello-world",
      title: "Hello World",
      description: "Print 'Hello, World!' to standard output.",
      difficulty: "EASY" as const,
      examples: [{ input: "none", output: "Hello, World!" }],
      testCases: [{ input: "", output: "Hello, World!\n", sortOrder: 0 }],
    },
    {
      slug: "two-sum",
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      difficulty: "EASY" as const,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6",
        },
      ],
      testCases: [
        { input: "2 7 11 15\n9", output: "0 1\n", sortOrder: 0 },
        { input: "3 2 4\n6", output: "1 2\n", sortOrder: 1 },
        { input: "3 3\n6", output: "0 1\n", sortOrder: 2 },
      ],
    },
    {
      slug: "fizzbuzz",
      title: "FizzBuzz",
      description:
        "For each number from 1 to n, print 'Fizz' if divisible by 3, 'Buzz' if divisible by 5, 'FizzBuzz' if divisible by both, otherwise the number itself. Print each result on a new line.",
      difficulty: "EASY" as const,
      examples: [
        { input: "n = 3", output: "1\n2\nFizz" },
        {
          input: "n = 15",
          output:
            "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        },
      ],
      testCases: [
        { input: "3", output: "1\n2\nFizz\n", sortOrder: 0 },
        { input: "5", output: "1\n2\nFizz\n4\nBuzz\n", sortOrder: 1 },
        {
          input: "15",
          output:
            "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n",
          sortOrder: 2,
        },
      ],
    },
    {
      slug: "reverse-string",
      title: "Reverse String",
      description: "Given a string, return the reversed version of the string.",
      difficulty: "EASY" as const,
      examples: [
        { input: "hello", output: "olleh" },
        { input: "world", output: "dlrow" },
      ],
      testCases: [
        { input: "hello", output: "olleh\n", sortOrder: 0 },
        { input: "racecar", output: "racecar\n", sortOrder: 1 },
        { input: "12345", output: "54321\n", sortOrder: 2 },
      ],
    },
    {
      slug: "palindrome-check",
      title: "Palindrome Check",
      description:
        "Given a string, return 'true' if it is a palindrome (reads the same forwards and backwards), otherwise return 'false'. Ignore case sensitivity.",
      difficulty: "EASY" as const,
      examples: [
        { input: "racecar", output: "true" },
        { input: "hello", output: "false" },
      ],
      testCases: [
        { input: "racecar", output: "true\n", sortOrder: 0 },
        { input: "hello", output: "false\n", sortOrder: 1 },
        {
          input: "A man a plan a canal Panama",
          output: "false\n",
          sortOrder: 2,
        },
        { input: "Madam", output: "true\n", sortOrder: 3 },
      ],
    },
    {
      slug: "factorial",
      title: "Factorial",
      description:
        "Given a non-negative integer n, compute n! (n factorial). n! = n × (n-1) × ... × 2 × 1. 0! = 1.",
      difficulty: "EASY" as const,
      examples: [
        { input: "5", output: "120" },
        { input: "0", output: "1" },
      ],
      testCases: [
        { input: "0", output: "1\n", sortOrder: 0 },
        { input: "1", output: "1\n", sortOrder: 1 },
        { input: "5", output: "120\n", sortOrder: 2 },
        { input: "10", output: "3628800\n", sortOrder: 3 },
      ],
    },
    {
      slug: "fibonacci",
      title: "Fibonacci Number",
      description:
        "Given a non-negative integer n, return the nth Fibonacci number (0-indexed). F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2).",
      difficulty: "EASY" as const,
      examples: [
        { input: "2", output: "1" },
        { input: "5", output: "5" },
      ],
      testCases: [
        { input: "0", output: "0\n", sortOrder: 0 },
        { input: "1", output: "1\n", sortOrder: 1 },
        { input: "5", output: "5\n", sortOrder: 2 },
        { input: "10", output: "55\n", sortOrder: 3 },
      ],
    },
    {
      slug: "anagram-check",
      title: "Anagram Check",
      description:
        "Given two strings, return 'true' if they are anagrams of each other (contain the same characters in any order), otherwise return 'false'. The first line is the first string, the second line is the second string. Ignore case.",
      difficulty: "EASY" as const,
      examples: [
        { input: "listen\nsilent", output: "true" },
        { input: "hello\nworld", output: "false" },
      ],
      testCases: [
        { input: "listen\nsilent", output: "true\n", sortOrder: 0 },
        { input: "hello\nworld", output: "false\n", sortOrder: 1 },
        { input: "triangle\nintegral", output: "true\n", sortOrder: 2 },
        { input: "abc\nabcd", output: "false\n", sortOrder: 3 },
      ],
    },
    {
      slug: "longest-word",
      title: "Longest Word",
      description:
        "Given a sentence, return the longest word. If there are multiple words of the same maximum length, return the first one. Words are separated by spaces. Assume no punctuation.",
      difficulty: "EASY" as const,
      examples: [
        { input: "The quick brown fox", output: "quick" },
        { input: "I love programming", output: "programming" },
      ],
      testCases: [
        { input: "The quick brown fox", output: "quick\n", sortOrder: 0 },
        { input: "hello world", output: "hello\n", sortOrder: 1 },
        { input: "a bb ccc dddd", output: "dddd\n", sortOrder: 2 },
      ],
    },
    {
      slug: "prime-check",
      title: "Prime Number Check",
      description:
        "Given an integer n greater than 1, return 'true' if it is a prime number, otherwise return 'false'. A prime number is only divisible by 1 and itself.",
      difficulty: "EASY" as const,
      examples: [
        { input: "7", output: "true" },
        { input: "10", output: "false" },
      ],
      testCases: [
        { input: "2", output: "true\n", sortOrder: 0 },
        { input: "7", output: "true\n", sortOrder: 1 },
        { input: "10", output: "false\n", sortOrder: 2 },
        { input: "97", output: "true\n", sortOrder: 3 },
      ],
    },
    // === MEDIUM (11-17) ===
    {
      slug: "binary-search",
      title: "Binary Search",
      description:
        "Given a sorted array of integers and a target value, return the index of the target if it exists, otherwise return -1. The first line of input is the sorted array elements separated by spaces. The second line is the target value.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "1 3 5 7 9\n5", output: "2" },
        { input: "2 4 6 8 10\n7", output: "-1" },
      ],
      testCases: [
        { input: "1 3 5 7 9\n5", output: "2\n", sortOrder: 0 },
        { input: "2 4 6 8 10\n7", output: "-1\n", sortOrder: 1 },
        { input: "1 2 3 4 5 6 7 8 9\n1", output: "0\n", sortOrder: 2 },
        { input: "10 20 30 40 50\n50", output: "4\n", sortOrder: 3 },
      ],
    },
    {
      slug: "merge-sorted-arrays",
      title: "Merge Two Sorted Arrays",
      description:
        "Given two sorted arrays, merge them into a single sorted array. The first line contains the first sorted array elements. The second line contains the second sorted array elements. Output the merged sorted array on one line.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "1 3 5\n2 4 6", output: "1 2 3 4 5 6" },
        { input: "1 2 3\n4 5 6", output: "1 2 3 4 5 6" },
      ],
      testCases: [
        { input: "1 3 5\n2 4 6", output: "1 2 3 4 5 6\n", sortOrder: 0 },
        { input: "1 2 3\n4 5 6", output: "1 2 3 4 5 6\n", sortOrder: 1 },
        { input: "1 5 9\n2 3 7", output: "1 2 3 5 7 9\n", sortOrder: 2 },
      ],
    },
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      description:
        "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order. Output 'true' or 'false'.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "()", output: "true" },
        { input: "()[]{}", output: "true" },
        { input: "(]", output: "false" },
      ],
      testCases: [
        { input: "()", output: "true\n", sortOrder: 0 },
        { input: "()[]{}", output: "true\n", sortOrder: 1 },
        { input: "(]", output: "false\n", sortOrder: 2 },
        { input: "([)]", output: "false\n", sortOrder: 3 },
        { input: "{[]}", output: "true\n", sortOrder: 4 },
      ],
    },
    {
      slug: "remove-duplicates",
      title: "Remove Duplicates",
      description:
        "Given a sorted array of integers, remove duplicates in-place and return the count of unique elements. Input is the array on one line. Output the number of unique elements.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "1 1 2", output: "2" },
        { input: "0 0 1 1 1 2 2 3 3 4", output: "5" },
      ],
      testCases: [
        { input: "1 1 2", output: "2\n", sortOrder: 0 },
        { input: "0 0 1 1 1 2 2 3 3 4", output: "5\n", sortOrder: 1 },
        { input: "1 2 3 4 5", output: "5\n", sortOrder: 2 },
        { input: "5 5 5 5 5", output: "1\n", sortOrder: 3 },
      ],
    },
    {
      slug: "max-subarray",
      title: "Maximum Subarray",
      description:
        "Given an array of integers, find the contiguous subarray with the largest sum, and return its sum. Input is space-separated integers on one line.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6" },
        { input: "1 2 3 4", output: "10" },
      ],
      testCases: [
        { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6\n", sortOrder: 0 },
        { input: "1 2 3 4", output: "10\n", sortOrder: 1 },
        { input: "-1 -2 -3", output: "-1\n", sortOrder: 2 },
        { input: "5 4 -1 7 8", output: "23\n", sortOrder: 3 },
      ],
    },
    {
      slug: "rotate-array",
      title: "Rotate Array",
      description:
        "Given an array and a number k, rotate the array to the right by k steps. First line: space-separated array. Second line: k. Output the rotated array.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "1 2 3 4 5 6 7\n3", output: "5 6 7 1 2 3 4" },
        { input: "-1 -100 3 99\n2", output: "3 99 -1 -100" },
      ],
      testCases: [
        { input: "1 2 3 4 5 6 7\n3", output: "5 6 7 1 2 3 4\n", sortOrder: 0 },
        { input: "-1 -100 3 99\n2", output: "3 99 -1 -100\n", sortOrder: 1 },
        { input: "1 2 3\n1", output: "3 1 2\n", sortOrder: 2 },
      ],
    },
    {
      slug: "word-break",
      title: "Word Break",
      description:
        "Given a string and a dictionary of words (space-separated), determine if the string can be segmented into a space-separated sequence of one or more dictionary words. First line: string. Second line: dictionary words. Output 'true' or 'false'.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "leetcode\nleet code", output: "true" },
        { input: "catsandog\ncats dog sand and cat", output: "false" },
      ],
      testCases: [
        { input: "leetcode\nleet code", output: "true\n", sortOrder: 0 },
        { input: "applepenapple\napple pen", output: "true\n", sortOrder: 1 },
        {
          input: "catsandog\ncats dog sand and cat",
          output: "false\n",
          sortOrder: 2,
        },
      ],
    },
    {
      slug: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      description:
        "Given a string, return the longest palindromic substring. If there are multiple, return the first one.",
      difficulty: "MEDIUM" as const,
      examples: [
        { input: "babad", output: "bab" },
        { input: "cbbd", output: "bb" },
      ],
      testCases: [
        { input: "babad", output: "bab\n", sortOrder: 0 },
        { input: "cbbd", output: "bb\n", sortOrder: 1 },
        { input: "a", output: "a\n", sortOrder: 2 },
        { input: "racecar", output: "racecar\n", sortOrder: 3 },
      ],
    },
    // === HARD (18-20) ===
    {
      slug: "lru-cache",
      title: "LRU Cache",
      description:
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement a program that takes a series of commands: 'put key value' inserts a key-value pair, 'get key' returns the value. The first line is the cache capacity. Subsequent lines are commands until EOF. If get finds the key, output the value on a new line, otherwise output -1.",
      difficulty: "HARD" as const,
      examples: [
        {
          input: "2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 1",
          output: "1\n-1\n1",
        },
      ],
      testCases: [
        {
          input: "2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 1",
          output: "1\n-1\n1\n",
          sortOrder: 0,
        },
        {
          input: "1\nput 1 10\nget 1\nput 2 20\nget 1\nget 2",
          output: "10\n-1\n20\n",
          sortOrder: 1,
        },
      ],
    },
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      description:
        "Given an array of non-negative integers representing elevation heights, compute how much water can be trapped after rain. Input: space-separated heights on one line. Output: total units of trapped water.",
      difficulty: "HARD" as const,
      examples: [
        { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
        { input: "4 2 0 3 2 5", output: "9" },
      ],
      testCases: [
        { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6\n", sortOrder: 0 },
        { input: "4 2 0 3 2 5", output: "9\n", sortOrder: 1 },
        { input: "1 1 1", output: "0\n", sortOrder: 2 },
        { input: "3 0 0 2 0 4", output: "10\n", sortOrder: 3 },
      ],
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      description:
        "Given two sorted arrays, find the median of the merged array. First line: first sorted array. Second line: second sorted array. Output the median (as a float). Time complexity should be O(log(min(n,m))).",
      difficulty: "HARD" as const,
      examples: [
        { input: "1 3\n2", output: "2.0" },
        { input: "1 2\n3 4", output: "2.5" },
      ],
      testCases: [
        { input: "1 3\n2", output: "2.0\n", sortOrder: 0 },
        { input: "1 2\n3 4", output: "2.5\n", sortOrder: 1 },
        { input: "0 0\n0 0", output: "0.0\n", sortOrder: 2 },
      ],
    },
  ];

  const problems = await Promise.all(
    problemDefs.map((def) =>
      prisma.codingProblem.upsert({
        where: { slug: def.slug },
        update: {
          title: def.title,
          description: def.description,
          difficulty: def.difficulty,
          examples: def.examples,
        },
        create: {
          slug: def.slug,
          title: def.title,
          description: def.description,
          difficulty: def.difficulty,
          examples: def.examples,
          testCases: { create: def.testCases },
        },
      }),
    ),
  );
  console.log(`Problems seeded: ${problems.length}`);

  for (let i = 0; i < 5; i++) {
    const fixture = createCodingSubmitInput();
    const responseFixture = createCodingSubmissionResponse();

    const problem = problems[i % problems.length];
    if (!problem) {
      throw new Error("Seed problem fixture was not created");
    }

    const testCases = await prisma.testCase.findMany({
      where: { problemId: problem.id },
      orderBy: { sortOrder: "asc" },
    });

    await prisma.codingSubmission.create({
      data: {
        code: fixture.code,
        language: fixture.language,
        status: responseFixture.status,
        judge0Token: responseFixture.judge0Token,
        executionTimeMs: responseFixture.executionTimeMs,
        memoryUsedKb: responseFixture.memoryUsedKb,
        problemId: problem.id,
        userId: user.id,
        results: {
          create: testCases.map((tc) => {
            const resultFixture = createCodingResult();
            return {
              passed: resultFixture.passed,
              output: resultFixture.output,
              error: resultFixture.error,
              testCaseId: tc.id,
            };
          }),
        },
      },
    });
  }

  console.log("Sample submissions seeded.");
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
