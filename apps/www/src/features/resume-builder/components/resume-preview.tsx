"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import { useResume } from "../contexts/resume-context";
import type { SkillCategory } from "../types";

export function ResumePreview() {
  const { data } = useResume();
  const { personalInfo, workExperience, projects, education, skills } = data;

  const formatDisplayUrl = (url: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    const lines = text
      .split(/\r?\n|•/)
      .map((l) => l.trim())
      .filter(Boolean);

    return (
      <ul className="mt-1 list-disc space-y-1 pl-5 text-[11.5px] text-gray-800 leading-relaxed">
        {lines.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    );
  };

  const contactItems = [
    personalInfo.email && (
      <a
        key="email"
        href={`mailto:${personalInfo.email}`}
        className="print-link hover:underline"
      >
        {personalInfo.email}
      </a>
    ),
    personalInfo.phone && <span key="phone">{personalInfo.phone}</span>,
    personalInfo.location && (
      <span key="location">{personalInfo.location}</span>
    ),
    personalInfo.linkedin && (
      <a
        key="linkedin"
        href={
          personalInfo.linkedin.startsWith("http")
            ? personalInfo.linkedin
            : `https://${personalInfo.linkedin}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="print-link hover:underline"
      >
        {formatDisplayUrl(personalInfo.linkedin)}
      </a>
    ),
    personalInfo.github && (
      <a
        key="github"
        href={
          personalInfo.github.startsWith("http")
            ? personalInfo.github
            : `https://${personalInfo.github}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="print-link hover:underline"
      >
        {formatDisplayUrl(personalInfo.github)}
      </a>
    ),
  ].filter(Boolean);

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
            color: black !important;
            text-decoration: none !important;
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
          <div
            className="print-page-container mx-auto min-h-[840px] rounded-sm border border-gray-200 bg-white p-8 text-left text-black shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            {/* Header / Personal Details */}
            <header className="text-center">
              <h1
                className="font-bold text-3xl text-black tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-gray-700">
                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {item}
                    {index < contactItems.length - 1 && (
                      <span className="mx-2 text-gray-400">|</span>
                    )}
                  </div>
                ))}
              </div>
            </header>

            {/* Sections Wrapper */}
            <div className="mt-5 space-y-4 text-left">
              {/* Professional Summary */}
              {personalInfo.summary && (
                <section>
                  <h2 className="font-bold text-[13px] text-black tracking-tight">
                    Professional Summary
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-black border-t" />
                  <p className="text-justify text-[11.5px] text-gray-800 leading-relaxed">
                    {personalInfo.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {workExperience && workExperience.length > 0 && (
                <section className="mt-3.5">
                  <h2 className="font-bold text-[13px] text-black tracking-tight">
                    Experience
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-black border-t" />
                  <div className="space-y-3">
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
                                , {exp.company}
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

              {/* Education */}
              {education && education.length > 0 && (
                <section className="mt-3.5">
                  <h2 className="font-bold text-[13px] text-black tracking-tight">
                    Education
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-black border-t" />
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex items-baseline justify-between gap-4 text-[11.5px]"
                      >
                        <div>
                          <span className="font-bold text-black">
                            {edu.degree}
                          </span>
                          {edu.school && (
                            <span className="text-gray-800">
                              {" "}
                              , {edu.school}
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

              {/* Projects */}
              {projects && projects.length > 0 && (
                <section className="mt-3.5">
                  <h2 className="font-bold text-[13px] text-black tracking-tight">
                    Projects
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-black border-t" />
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <article key={proj.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between gap-4 text-[11.5px]">
                          <div>
                            <span className="font-bold text-black">
                              {proj.name}
                            </span>
                            {proj.role && (
                              <span className="text-gray-800">
                                {" "}
                                , {proj.role}
                              </span>
                            )}
                          </div>
                          {proj.url && (
                            <div className="shrink-0">
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="print-link font-medium text-black hover:underline"
                              >
                                Link
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
                <section className="mt-3.5">
                  <h2 className="font-bold text-[13px] text-black tracking-tight">
                    Skills
                  </h2>
                  <hr className="mt-0.5 mb-1.5 border-black border-t" />
                  <div className="space-y-0.5 text-[11.5px] leading-relaxed">
                    {Array.isArray(skills) && typeof skills[0] === "string" ? (
                      <div>
                        <span className="font-bold text-black">Skills : </span>
                        <span className="text-gray-800">
                          {(skills as string[]).join(", ")}
                        </span>
                      </div>
                    ) : (
                      (skills as SkillCategory[]).map((cat) => (
                        <div key={cat.id}>
                          <span className="font-bold text-black">
                            {cat.category} :{" "}
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
