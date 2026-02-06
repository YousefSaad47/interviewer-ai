import { Header } from "@/modules/landing/components";

import { QuickActions } from "../components/quick-actions";
import { RecentInterviews } from "../components/recent-interviews";
import { SkillsOverview } from "../components/skills-overview";
import { StatsCards } from "../components/stats-cards";
import { WeeklyGoals } from "../components/weekly-goals";

export function DashboardPage() {
  return (
    <div className="bg-background relative min-h-screen w-full overflow-x-hidden">
      <Header />
      {/* Background mesh pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.39] dark:opacity-[0.2]"
        style={{
          backgroundImage: "url('/mesh.svg')",
          backgroundSize: "cover",
        }}
      />

      {/* Background blur effects */}
      <div
        className="pointer-events-none absolute opacity-50 dark:opacity-100"
        style={{
          left: "-517px",
          top: "-385px",
          width: "660px",
          height: "665px",
          background:
            "radial-gradient(circle, oklch(0.545 0.143 265.8) 0%, transparent 70%)",
          filter: "blur(250px)",
        }}
      />
      <div
        className="pointer-events-none absolute opacity-50 dark:opacity-100"
        style={{
          right: "-180px",
          top: "423px",
          width: "390px",
          height: "393px",
          background:
            "radial-gradient(circle, rgba(99, 130, 222, 0.4) 0%, transparent 70%)",
          filter: "blur(358.5px)",
        }}
      />

      {/* Main Content */}
      <div className="relative space-y-8 px-4 pt-32 pb-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-foreground text-4xl font-bold">
            Welcome back, Karim
          </h1>
          <p className="text-muted-foreground text-lg">
            Here&apos;s your interview preparation progress
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Two Column Layout */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            <RecentInterviews />
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[410px]">
            <QuickActions />
          </div>
        </div>

        {/* Weekly Goals */}
        <WeeklyGoals />

        {/* Skills Overview */}
        <SkillsOverview />
      </div>
    </div>
  );
}
