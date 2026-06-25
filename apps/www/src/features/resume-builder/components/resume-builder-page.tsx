"use client";

import { CheckCircle, Download, Save } from "lucide-react";

import { Header } from "@/features/landing";
import { Button } from "@/shared/ui";

import {
  EducationSection,
  PersonalInfoSection,
  ResumePreview,
  SkillsSection,
  WorkExperienceSection,
} from "../components";
import { ResumeProvider } from "../contexts";

export const ResumeBuilderPage = () => {
  // TODO(resume-api): Connect ATS checking, saving, and export when resume endpoints are registered.
  return (
    <ResumeProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
        <Header />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.24] dark:opacity-[0.14]"
          style={{
            backgroundImage: "url('/mesh.svg')",
            backgroundSize: "cover",
          }}
        />

        <div
          className="pointer-events-none absolute opacity-35 dark:opacity-70"
          style={{
            left: "-517px",
            top: "-385px",
            width: "660px",
            height: "665px",
            background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
            filter: "blur(250px)",
          }}
        />
        <div
          className="pointer-events-none absolute opacity-25 dark:opacity-60"
          style={{
            right: "-180px",
            top: "423px",
            width: "390px",
            height: "393px",
            background:
              "radial-gradient(circle, rgba(52, 211, 153, 0.28) 0%, transparent 70%)",
            filter: "blur(358.5px)",
          }}
        />

        <main className="relative mx-auto w-full max-w-[1500px] px-4 pt-28 pb-20 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <section className="mb-6 overflow-hidden rounded-lg border border-border bg-card/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="relative p-6 sm:p-8">
                <div className="absolute top-0 right-8 h-44 w-44 -translate-y-20 rounded-full bg-primary/15 blur-3xl" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                    Resume studio
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Live preview
                  </div>
                  <h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
                    Shape your resume like a working document
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
                    Edit the content on the left and keep the final page in
                    sight. No marketing cards, just a focused writing surface.
                  </p>
                </div>
              </div>

              <div className="border-border border-t bg-surface-product/70 p-6 sm:p-8 lg:border-t-0 lg:border-l dark:bg-surface-secondary/55">
                <div className="grid h-full content-between gap-5">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["ATS", "Ready"],
                      ["Format", "1 page"],
                      ["Mode", "Draft"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-border bg-card/70 p-3 text-center"
                      >
                        <p className="text-muted-foreground text-xs">{label}</p>
                        <p className="mt-1 font-semibold text-foreground text-sm">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-10 gap-2 rounded-lg border-border bg-card/70 text-foreground text-sm hover:border-primary/30 hover:bg-card"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">ATS Checker</span>
                      <span className="sm:hidden">ATS</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 gap-2 rounded-lg border-border bg-card/70 text-foreground text-sm hover:border-primary/30 hover:bg-card"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button className="h-10 gap-2 rounded-lg bg-primary px-4 text-primary-foreground text-sm shadow-[0_14px_35px_rgba(16,185,129,0.2)] hover:bg-primary/90">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-5">
              <PersonalInfoSection />
              <WorkExperienceSection />
              <EducationSection />
              <SkillsSection />
            </div>

            <div className="w-full">
              <ResumePreview />
            </div>
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
};
