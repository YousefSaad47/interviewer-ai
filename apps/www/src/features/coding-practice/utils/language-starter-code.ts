import type { Language } from "../types";

export const LANGUAGE_STARTER_CODE: Record<Language, string> = {
  javascript: `/**
 * @param {string} input - Raw stdin input (parse as needed)
 * @return {string} Output to stdout
 */
function solution(input) {
  // TODO: Implement your solution here
  return "";
}

// ── Read input ────────────────────────────────────────────
const input = require("fs").readFileSync(0, "utf-8").trim();
console.log(solution(input));
`,
  python: `def solution(input_data: str) -> str:
    """Parse input_data and return the answer as a string."""
    # TODO: Implement your solution here
    return ""


# ── Read input ──────────────────────────────────────────────
import sys
print(solution(sys.stdin.read().strip()))
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();
        while (sc.hasNextLine()) sb.append(sc.nextLine()).append("\\n");
        System.out.print(solution(sb.toString().stripTrailing()));
    }

    public static String solution(String input) {
        // TODO: Implement your solution here
        return "";
    }
}
`,
  cpp: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

string solution(const string& input) {
    // TODO: Implement your solution here
    return "";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ostringstream ss;
    ss << cin.rdbuf();
    cout << solution(ss.str()) << endl;
    return 0;
}
`,
  typescript: `/**
 * @param input - Raw stdin input (parse as needed)
 * @returns Output to stdout
 */
function solution(input: string): string {
  // TODO: Implement your solution here
  return "";
}

// ── Read input ────────────────────────────────────────────
declare var require: any;
const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim();
console.log(solution(input));
`,
};
