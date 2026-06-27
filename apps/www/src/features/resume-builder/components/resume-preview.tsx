"use client";

import { MapPin, Phone, Mail, Linkedin, Github } from "lucide-react";

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
      <ul className="list-disc pl-4 mt-0.5 text-[11px] leading-relaxed text-gray-800 space-y-0.5">
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

      <Card className="overflow-hidden rounded-lg border-border bg-card/80 lg:sticky lg:top-25 dark:bg-card/90 no-print">
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
          <div className="print-page-container mx-auto min-h-[840px] rounded-sm bg-white p-8 text-black shadow-[0_18px_50px_rgba(15,23,42,0.12)] border border-gray-200">
            {/* Header / Personal Details */}
            <header className="text-center">
              <h1 className="font-bold text-3xl tracking-tight text-black" style={{ fontFamily: "Georgia, serif" }}>
                {personalInfo.fullName || "Your Name"}
              </h1>

              <div className="mt-3.5 grid grid-cols-2 text-[11px] sm:text-xs text-gray-700 pb-3 border-b border-gray-100">
                {/* Left column details */}
                <div className="space-y-0.5 text-left pl-2">
                  {personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-900 shrink-0" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-gray-900 shrink-0" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-gray-900 shrink-0" />
                      <a href={`mailto:${personalInfo.email}`} className="text-[#0969da] hover:underline print-link">
                        {personalInfo.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Right column details */}
                <div className="space-y-0.5 text-left pl-6 sm:pl-12">
                  {personalInfo.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3.5 w-3.5 text-[#0077b5] shrink-0" />
                      <a
                        href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0969da] hover:underline print-link break-all"
                      >
                        {personalInfo.linkedin}
                      </a>
                    </div>
                  )}
                  {personalInfo.github && (
                    <div className="flex items-center gap-1">
                      <Github className="h-3.5 w-3.5 text-gray-900 shrink-0" />
                      <a
                        href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0969da] hover:underline print-link break-all"
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
                  <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                    Professional Summary
                  </h2>
                  <hr className="border-t border-gray-400 mt-0.5 mb-1.5" />
                  <p className="text-[11.5px] leading-relaxed text-gray-800 text-justify">
                    {personalInfo.summary}
                  </p>
                </section>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                    Education
                  </h2>
                  <hr className="border-t border-gray-400 mt-0.5 mb-1.5" />
                  <div className="space-y-1">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline gap-4 text-[11.5px]">
                        <div>
                          <span className="font-bold text-black">{edu.school}</span>
                          {edu.degree && <span className="text-gray-800">, {edu.degree}</span>}
                        </div>
                        <div className="shrink-0 text-gray-900 font-medium">
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
                  <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                    Experience
                  </h2>
                  <hr className="border-t border-gray-400 mt-0.5 mb-1.5" />
                  <div className="space-y-2">
                    {workExperience.map((exp) => (
                      <article key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline gap-4 text-[11.5px]">
                          <div>
                            <span className="font-bold text-black">{exp.position}</span>
                            {exp.company && <span className="text-gray-800"> at {exp.company}</span>}
                          </div>
                          <div className="shrink-0 text-gray-900 font-medium">
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
                  <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                    Projects
                  </h2>
                  <hr className="border-t border-gray-400 mt-0.5 mb-1.5" />
                  <div className="space-y-2">
                    {projects.map((proj) => (
                      <article key={proj.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline gap-4 text-[11.5px]">
                          <div className="font-bold text-black">{proj.name}</div>
                          {proj.url && (
                            <div className="shrink-0">
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0969da] hover:underline print-link font-medium"
                              >
                                {proj.url.includes("github.com") ? "GitHub" : "Live Demo"}
                              </a>
                            </div>
                          )}
                        </div>
                        {proj.description && renderBulletPoints(proj.description)}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Skills */}
              {skills && skills.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold text-black uppercase tracking-wider">
                    Technical Skills
                  </h2>
                  <hr className="border-t border-gray-400 mt-0.5 mb-1.5" />
                  <div className="space-y-0.5 text-[11px] leading-relaxed">
                    {Array.isArray(skills) && typeof skills[0] === "string" ? (
                      // Handle fallback to flat array representation
                      <div>
                        <span className="font-bold text-black">Skills: </span>
                        <span className="text-gray-800">{(skills as string[]).join(", ")}</span>
                      </div>
                    ) : (
                      // Handle categorized format representation
                      (skills as SkillCategory[]).map((cat) => (
                        <div key={cat.id}>
                          <span className="font-bold text-black">{cat.category}: </span>
                          <span className="text-gray-800">
                            {Array.isArray(cat.items) ? cat.items.join(", ") : ""}
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
