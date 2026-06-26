export interface ProblemMetadata {
  number: number;
  topics: string[];
  companies: string[];
  hints: string[];
  isPremium?: boolean;
  constraints: string[];
}

export const problemMetadataMap: Record<string, ProblemMetadata> = {
  "hello-world": {
    number: 1,
    topics: ["Basic", "Output"],
    companies: ["Google", "Meta", "Amazon"],
    hints: [
      "Print the exact string 'Hello, World!' to the standard output.",
      "Ensure spelling, punctuation, and capitalization match exactly.",
      "Use the standard console output mechanism of your chosen language.",
    ],
    constraints: ["No inputs are provided.", "Output must match exactly."],
  },
  "two-sum": {
    number: 2,
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Adobe", "Apple", "Microsoft"],
    hints: [
      "A brute force approach checks all pairs in O(n²) time.",
      "For a number x, we need to find target - x in the array.",
      "Use a Hash Map to store numbers and look up the complement (target - x) in O(1) time, yielding O(n) total time.",
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists.",
    ],
  },
  fizzbuzz: {
    number: 3,
    topics: ["Math", "String", "Simulation"],
    companies: ["Microsoft", "Bloomberg", "Google"],
    hints: [
      "Iterate from 1 to n.",
      "Use the modulo operator (%) to check divisibility by 3, 5, or both (15).",
      "Remember to check divisibility by 15 (both 3 and 5) first, otherwise the conditions for 3 or 5 will trigger prematurely.",
    ],
    constraints: ["1 <= n <= 10⁴"],
  },
  "reverse-string": {
    number: 4,
    topics: ["Two Pointers", "String"],
    companies: ["Apple", "Adobe", "Microsoft"],
    hints: [
      "You can reverse the string in-place.",
      "Use two pointers: one at the beginning and one at the end.",
      "Swap the characters at the pointers, then move the pointers towards the center until they meet.",
    ],
    constraints: [
      "1 <= s.length <= 10⁵",
      "s consists of printable ASCII characters.",
    ],
  },
  "palindrome-check": {
    number: 5,
    topics: ["Two Pointers", "String"],
    companies: ["Facebook", "Microsoft", "Amazon"],
    hints: [
      "A string is a palindrome if it reads the same backwards.",
      "Use two pointers moving towards the center to compare characters.",
      "Remember to convert the characters to lowercase first to ignore case sensitivity.",
    ],
    constraints: [
      "1 <= s.length <= 2 * 10⁵",
      "s consists of printable ASCII characters.",
    ],
  },
  factorial: {
    number: 6,
    topics: ["Math", "Recursion"],
    companies: ["Oracle", "Cisco", "IBM"],
    hints: [
      "N factorial (N!) is N * (N-1) * ... * 1.",
      "This can be implemented recursively or iteratively.",
      "Base cases are F(0) = 1 and F(1) = 1.",
    ],
    constraints: ["0 <= n <= 20"],
  },
  fibonacci: {
    number: 7,
    topics: ["Math", "Dynamic Programming", "Recursion"],
    companies: ["Amazon", "Apple", "Uber"],
    hints: [
      "F(n) = F(n-1) + F(n-2).",
      "A simple recursive function runs in O(2^N) time. Can we do better?",
      "Optimize by saving previously computed values (memoization) or calculating iteratively to achieve O(n) time and O(1) space.",
    ],
    constraints: ["0 <= n <= 30"],
  },
  "anagram-check": {
    number: 8,
    topics: ["Hash Table", "String", "Sorting"],
    companies: ["Google", "Goldman Sachs", "Meta"],
    hints: [
      "Two strings are anagrams if they contain the same characters in any order.",
      "One approach is to sort both strings and check if they are equal.",
      "An optimized approach uses a character frequency map (or integer array) to count and compare character occurrences in O(n) time.",
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10⁴",
      "s and t consist of lowercase English letters.",
    ],
  },
  "longest-word": {
    number: 9,
    topics: ["String"],
    companies: ["Uber", "Salesforce", "Netflix"],
    hints: [
      "Split the sentence by space into an array of words.",
      "Iterate through the words and keep track of the maximum length found.",
      "If you find multiple words of the same maximum length, return the first one.",
    ],
    constraints: [
      "1 <= sentence.length <= 10⁴",
      "sentence consists of English letters and spaces.",
    ],
  },
  "prime-check": {
    number: 10,
    topics: ["Math"],
    companies: ["Tesla", "Nvidia", "SpaceX"],
    hints: [
      "A number is prime if it has no divisors other than 1 and itself.",
      "Numbers less than or equal to 1 are not prime.",
      "Optimize: You only need to check divisors up to the square root of N (if N is divisible by d, N/d is also a divisor).",
    ],
    constraints: ["1 <= n <= 2³¹ - 1"],
  },
  "binary-search": {
    number: 11,
    topics: ["Array", "Binary Search"],
    companies: ["Google", "Microsoft", "Amazon", "Meta"],
    hints: [
      "Maintain low and high boundary pointers.",
      "Calculate the middle index `mid` to divide the search space.",
      "Narrow the search space to the left half if the target is less than `nums[mid]`, or the right half if it is greater.",
    ],
    constraints: [
      "1 <= nums.length <= 10⁴",
      "-10⁴ < nums[i], target < 10⁴",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
  },
  "merge-sorted-arrays": {
    number: 12,
    topics: ["Array", "Two Pointers", "Sorting"],
    companies: ["Facebook", "LinkedIn", "Microsoft"],
    hints: [
      "You have two sorted arrays.",
      "Use two pointers, one at the start of each array, to compare elements.",
      "Add the smaller element to the result array and increment its pointer.",
    ],
    constraints: [
      "1 <= nums1.length, nums2.length <= 1000",
      "-10⁹ <= nums1[i], nums2[i] <= 10⁹",
    ],
  },
  "valid-parentheses": {
    number: 13,
    topics: ["String", "Stack"],
    companies: ["Amazon", "Microsoft", "Bloomberg", "Google", "Atlassian"],
    hints: [
      "Use a Stack data structure.",
      "When encountering an open bracket `(`, `[`, `{`, push it onto the stack.",
      "When encountering a closing bracket, pop the stack and check if it matches. If the stack is empty or doesn't match, return false.",
    ],
    constraints: [
      "1 <= s.length <= 10⁴",
      "s consists of parentheses only: '()[]{}'.",
    ],
  },
  "remove-duplicates": {
    number: 14,
    topics: ["Array", "Two Pointers"],
    companies: ["Intel", "Tencent", "Adobe"],
    hints: [
      "The input array is already sorted, meaning duplicates are adjacent.",
      "Use two pointers: a slow runner and a fast runner.",
      "When the fast runner finds a new unique value, copy it to the position of the slow runner and increment the slow runner.",
    ],
    constraints: [
      "1 <= nums.length <= 3 * 10⁴",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order.",
    ],
  },
  "max-subarray": {
    number: 15,
    topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
    companies: ["Netflix", "ByteDance", "Amazon", "Microsoft"],
    hints: [
      "A brute force checks all subarrays in O(n²) time.",
      "Try Kadane's Algorithm: Maintain the current subarray sum and reset it to 0 if it becomes negative.",
      "Track the maximum sum seen so far throughout the iteration.",
    ],
    constraints: ["1 <= nums.length <= 10⁵", "-10⁴ <= nums[i] <= 10⁴"],
  },
  "rotate-array": {
    number: 16,
    topics: ["Array", "Two Pointers", "Math"],
    companies: ["Amazon", "PayPal", "Meta"],
    hints: [
      "Rotation count k can be larger than the array length, so normalize it using `k = k % length`.",
      "One way is to reverse the entire array.",
      "Then reverse the first `k` elements, and reverse the remaining `length - k` elements to achieve O(n) time and O(1) space.",
    ],
    constraints: [
      "1 <= nums.length <= 10⁵",
      "-2³¹ <= nums[i] <= 2³¹ - 1",
      "0 <= k <= 10⁵",
    ],
  },
  "word-break": {
    number: 17,
    topics: ["Hash Table", "String", "Dynamic Programming", "Trie"],
    companies: ["Google", "Amazon", "Twitter", "Facebook"],
    hints: [
      "This is a classic Dynamic Programming problem.",
      "Let `dp[i]` represent if substring `s[0..i]` can be segmented into dictionary words.",
      "For each index `i`, check all dictionary words that end at `i` and check if `dp[i - word.length]` is true.",
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "s and words in wordDict consist of lowercase English letters.",
      "All the strings of wordDict are unique.",
    ],
  },
  "longest-palindromic-substring": {
    number: 18,
    topics: ["String", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Adobe", "Google"],
    hints: [
      "A palindrome reads the same forwards and backwards.",
      "Try to expand around centers. A string of length N has 2N - 1 possible centers.",
      "For each center, expand outward as long as the characters match, and track the maximum length found.",
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of only digits and English letters.",
    ],
  },
  "lru-cache": {
    number: 19,
    topics: ["Design", "Hash Table", "Linked List", "Doubly-Linked List"],
    companies: ["Apple", "Google", "Amazon", "Facebook", "Microsoft"],
    hints: [
      "We need O(1) time complexity for both `get` and `put` operations.",
      "Use a Hash Map to look up keys and get references to their storage nodes in O(1) time.",
      "Use a Doubly Linked List to store values, allowing us to move accessed nodes to the front and remove the tail node in O(1) time.",
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10⁴",
      "0 <= value <= 10⁵",
      "At most 2 * 10⁵ calls will be made to get and put.",
    ],
    isPremium: true,
  },
  "trapping-rain-water": {
    number: 20,
    topics: [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Stack",
      "Monotonic Stack",
    ],
    companies: [
      "Goldman Sachs",
      "Google",
      "Amazon",
      "Meta",
      "Microsoft",
      "Stripe",
    ],
    hints: [
      "For each position, the amount of water trapped is determined by `min(max_left_height, max_right_height) - current_height`.",
      "You can precompute prefix and suffix max arrays in O(n) time and space.",
      "Optimize: Use two pointers (left and right) moving towards each other to solve in O(n) time and O(1) space.",
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10⁴",
      "0 <= height[i] <= 10⁵",
    ],
    isPremium: true,
  },
  "median-of-two-sorted-arrays": {
    number: 21,
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Uber", "Apple", "Yahoo", "Amazon"],
    hints: [
      "The merged array size is `m + n`. We need to find the element(s) in the middle.",
      "Instead of merging arrays in O(m+n) time, we can binary search for the partition point.",
      "Partition both arrays such that the left half contains `(m + n + 1) / 2` elements. Perform binary search on the smaller array.",
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000",
      "-10⁶ <= nums1[i], nums2[i] <= 10⁶",
    ],
    isPremium: true,
  },
};

export function getProblemMetadata(
  slug: string | undefined,
  title: string,
): ProblemMetadata {
  if (slug && problemMetadataMap[slug]) {
    return problemMetadataMap[slug];
  }

  // Fallback metadata generator based on title/slug
  const baseSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let charSum = 0;
  for (let i = 0; i < baseSlug.length; i++) {
    charSum += baseSlug.charCodeAt(i);
  }

  const problemNumber = (charSum % 100) + 22;
  const isPremium = charSum % 7 === 0;

  const possibleTopics = [
    "Array",
    "String",
    "Hash Table",
    "Two Pointers",
    "Math",
    "Sorting",
    "Binary Search",
    "Dynamic Programming",
    "Stack",
    "Recursion",
    "Greedy",
    "Depth-First Search",
    "Breadth-First Search",
  ];

  const possibleCompanies = [
    "Google",
    "Amazon",
    "Meta",
    "Microsoft",
    "Apple",
    "Netflix",
    "Uber",
    "Stripe",
    "Airbnb",
    "Bloomberg",
    "Salesforce",
  ];

  const topics = [
    possibleTopics[charSum % possibleTopics.length] || "Basic",
    possibleTopics[(charSum + 3) % possibleTopics.length] || "Algorithms",
  ].filter((v, i, self) => self.indexOf(v) === i);

  const companies = [
    possibleCompanies[charSum % possibleCompanies.length] || "Google",
    possibleCompanies[(charSum + 4) % possibleCompanies.length] || "Amazon",
  ].filter((v, i, self) => self.indexOf(v) === i);

  return {
    number: problemNumber,
    topics,
    companies,
    hints: [
      "Analyze the problem constraints and try to think of a simple brute force solution first.",
      "Can we use a different data structure (like a hash map, stack, or set) to optimize search time?",
      "Consider time and space trade-offs. Can you achieve O(n) time complexity with O(n) space?",
    ],
    isPremium,
    constraints: [
      "Time complexity: O(n) or O(n log n)",
      "Space complexity: O(n) or O(1)",
      "Inputs are non-empty and fit within standard limits.",
    ],
  };
}
