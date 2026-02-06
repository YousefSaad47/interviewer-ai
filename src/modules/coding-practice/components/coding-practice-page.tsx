import { Header } from "@/modules/landing/components";

import { CodePanel } from "./code-panel";
import { ProblemPanel } from "./problem-panel";

export function CodingPracticePage() {
  return (
    <div className="bg-background relative h-screen w-full overflow-hidden">
      <Header />
      {/* Background mesh pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.39] dark:opacity-[0.2]"
        style={{
          backgroundImage: "url('/mesh.svg')",
          backgroundSize: "cover",
        }}
      />

      {/* Main Content */}
      <div className="relative flex h-[calc(100%-4rem)] flex-col pt-16 md:h-[calc(100%-5rem)] md:pt-20 lg:flex-row">
        {/* Problem Panel */}
        <div className="h-1/2 w-full overflow-auto lg:h-full lg:w-[774px]">
          <ProblemPanel />
        </div>

        {/* Code Panel */}
        <div className="h-1/2 w-full overflow-auto lg:h-full lg:flex-1">
          <CodePanel />
        </div>
      </div>
    </div>
  );
}
