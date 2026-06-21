"use client";

import { CheckCircle, Download, Save } from "lucide-react";

import { Header } from "@/modules/landing";
import { Button } from "@/shared/components/ui/button";

import {
  EducationSection,
  PersonalInfoSection,
  ResumePreview,
  SkillsSection,
  WorkExperienceSection,
} from "../components";
import { ResumeProvider } from "../contexts";

export const ResumeBuilderPage = () => {
  return (
    <ResumeProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
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
        <div className="relative px-4 pt-28 pb-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="font-bold text-2xl text-foreground md:text-3xl lg:text-4xl">
                Resume Builder
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                Create a professional resume with AI assistance
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Button
                variant="outline"
                className="gap-2 rounded-lg border-border bg-card text-foreground text-sm hover:bg-accent"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">ATS Checker</span>
                <span className="sm:hidden">ATS</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-lg border-border bg-card text-foreground text-sm hover:bg-accent"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button className="gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Panel - Form Sections */}
            <div className="flex-1 space-y-8">
              <PersonalInfoSection />
              <WorkExperienceSection />
              <EducationSection />
              <SkillsSection />
            </div>

            {/* Right Panel - Resume Preview */}
            <div className="w-full lg:w-105">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};
