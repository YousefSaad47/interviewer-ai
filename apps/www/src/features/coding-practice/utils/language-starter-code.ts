import type { Language } from "../types";

export const LANGUAGE_STARTER_CODE: Record<Language, string> = {
  javascript: `// Write your solution here
function solve(input) {
  // Your code here
}

// Read input and call solve
const input = require('fs').readFileSync(0, 'utf-8').trim();
console.log(solve(input));
`,
  python: `# Write your solution here
def solve(input):
    # Your code here
    pass

# Read input and call solve
import sys
input = sys.stdin.read().strip()
print(solve(input))
`,
  java: `public class Main {
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        String input = sc.nextLine();
        System.out.println(solve(input));
    }

    public static String solve(String input) {
        // Your code here
        return "";
    }
}
`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

string solve(string input) {
    // Your code here
    return "";
}

int main() {
    string input;
    getline(cin, input);
    cout << solve(input) << endl;
    return 0;
}
`,
  typescript: `// Write your solution here
function solve(input: string): string {
  // Your code here
  return "";
}

// Read input and call solve
const input = require("fs").readFileSync(0, "utf-8").trim();
console.log(solve(input));
`,
};
