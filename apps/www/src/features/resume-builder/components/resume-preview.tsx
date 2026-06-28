"use client";

import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import { useResume } from "../contexts/resume-context";
import type { SkillCategory } from "../types";

export function ResumePreview() {
  const { data } = useResume();
  const { personalInfo, workExperience, projects, education, skills } = data;

  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    const lines = text
      .split(/\r?\n|•/)
      .map((l) => l.trim())
      .filter(Boolean);

    return (
      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] text-gray-800 leading-relaxed">
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Styles for print mode */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-page-container, .print-page-container * {
            visibility: visible;
          }
          .print-page-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .print-link {
            color: #0969da !important;
            text-decoration: underline !important;
          }
        }
      `}</style>

      <Card className="no-print overflow-hidden rounded-lg border-border bg-card/80 lg:sticky lg:top-25 dark:bg-card/90">
        <CardHeader className="border-border border-b pb-4">
          <CardTitle className="font-bold text-foreground text-xl">
            Resume Preview
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            A paper-first view of the content you are editing.
          </p>
        </CardHeader>

        <CardContent className="bg-surface-product/60 p-4 dark:bg-surface-secondary/45">
          {/* Printable container */}
          <div className="print-page-container mx-auto min-h-[840px] rounded-sm border border-gray-200 bg-white p-8 text-black shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            {/* Header / Personal Details */}
            <header className="text-center">
              <h1
                className="font-bold text-3xl text-black tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>

              <div className="mt-3.5 grid grid-cols-2 border-gray-100 border-b pb-3 text-[11px] text-gray-700 sm:text-xs">
                {/* Left column details */}
                <div className="space-y-0.5 pl-2 text-left">
                  {personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-900" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-900" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gray-900" />
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="print-link text-[#0969da] hover:underline"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Right column details */}
                <div className="space-y-0.5 pl-6 text-left sm:pl-12">
                  {personalInfo.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3.5 w-3.5 shrink-0 text-[#0077b5]" />
                      <a
                        href={
                          personalInfo.linkedin.startsWith("http")
                            ? personalInfo.linkedin
                            : `https://${personalInfo.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="print-link break-all text-[#0969da] hover:underline"
                      >
                        {personalInfo.linkedin}
                      </a>
                    </div>
                  )}
                  {personalInfo.github && (
                    <div className="flex items-center gap-1">
                      <Github className="h-3.5 w-3.5 shrink-0 text-gray-900" />
                      <a
                        href={
                          personalInfo.github.startsWith("http")
                            ? personalInfo.github
                            : `https://${personalInfo.github}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="print-link break-all text-[#0969da] hover:underline"
                      >
                        {personalInfo.github}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Sections Wrapper */}
            <div className="mt-4 space-y-4 text-left">
              {/* Professional Summary */}
              {personalInfo.summary && (
                <section>
                  <h2 className="font-bold text-black text-xs uppercase tracking-wider">
                    Professional Summary
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-gray-400 border-t" />
                  <p className="text-justify text-[11.5px] text-gray-800 leading-relaxed">
                    {personalInfo.summary}
                  </p>
                </section>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <section>
                  <h2 className="font-bold text-black text-xs uppercase tracking-wider">
                    Education
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-gray-400 border-t" />
                  <div className="space-y-1">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex items-baseline justify-between gap-4 text-[11.5px]"
                      >
                        <div>
                          <span className="font-bold text-black">
                            {edu.school}
                          </span>
                          {edu.degree && (
                            <span className="text-gray-800">
                              , {edu.degree}
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 font-medium text-gray-900">
                          {edu.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {workExperience && workExperience.length > 0 && (
                <section>
                  <h2 className="font-bold text-black text-xs uppercase tracking-wider">
                    Experience
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-gray-400 border-t" />
                  <div className="space-y-2">
                    {workExperience.map((exp) => (
                      <article key={exp.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-4 text-[11.5px]">
                          <div>
                            <span className="font-bold text-black">
                              {exp.position}
                            </span>
                            {exp.company && (
                              <span className="text-gray-800">
                                {" "}
                                at {exp.company}
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 font-medium text-gray-900">
                            {exp.duration}
                          </div>
                        </div>
                        {exp.description && renderBulletPoints(exp.description)}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <section>
                  <h2 className="font-bold text-black text-xs uppercase tracking-wider">
                    Projects
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-gray-400 border-t" />
                  <div className="space-y-2">
                    {projects.map((proj) => (
                      <article key={proj.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-4 text-[11.5px]">
                          <div className="font-bold text-black">
                            {proj.name}
                          </div>
                          {proj.url && (
                            <div className="shrink-0">
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="print-link font-medium text-[#0969da] hover:underline"
                              >
                                {proj.url.includes("github.com")
                                  ? "GitHub"
                                  : "Live Demo"}
                              </a>
                            </div>
                          )}
                        </div>
                        {proj.description &&
                          renderBulletPoints(proj.description)}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Skills */}
              {skills && skills.length > 0 && (
                <section>
                  <h2 className="font-bold text-black text-xs uppercase tracking-wider">
                    Technical Skills
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-gray-400 border-t" />
                  <div className="space-y-0.5 text-[11px] leading-relaxed">
                    {Array.isArray(skills) && typeof skills[0] === "string" ? (
                      // Handle fallback to flat array representation
                      <div>
                        <span className="font-bold text-black">Skills: </span>
                        <span className="text-gray-800">
                          {(skills as string[]).join(", ")}
                        </span>
                      </div>
                    ) : (
                      // Handle categorized format representation
                      (skills as SkillCategory[]).map((cat) => (
                        <div key={cat.id}>
                          <span className="font-bold text-black">
                            {cat.category}:{" "}
                          </span>
                          <span className="text-gray-800">
                            {Array.isArray(cat.items)
                              ? cat.items.join(", ")
                              : ""}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
