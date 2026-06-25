"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { useResume } from "../contexts/resume-context";

export function ResumePreview() {
  const { data } = useResume();
  const { personalInfo, workExperience, education, skills } = data;
  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ].filter(Boolean);

  return (
    <Card className="overflow-hidden rounded-lg border-border bg-card/80 lg:sticky lg:top-25 dark:bg-card/90">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="font-bold text-foreground text-xl">
          Resume Preview
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          A paper-first view of the content you are editing.
        </p>
      </CardHeader>

      <CardContent className="bg-surface-product/60 p-4 dark:bg-surface-secondary/45">
        <div className="mx-auto min-h-[660px] rounded-sm bg-white p-7 text-[#17211d] shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-8">
          <header className="border-[#17211d] border-b pb-5">
            <p className="mb-2 font-semibold text-[#4a5d57] text-[10px] uppercase tracking-[0.22em]">
              Candidate Profile
            </p>
            <h1 className="font-bold text-3xl tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {contactItems.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[#4a5d57] text-xs">
                {contactItems.map((item, index) => (
                  <span key={item} className="flex items-center gap-3">
                    {index > 0 && (
                      <span className="h-1 w-1 rounded-full bg-[#10b981]" />
                    )}
                    {item}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="mt-6 space-y-6">
            {personalInfo.summary && (
              <PreviewSection title="Summary">
                <p className="text-[#34443f] text-xs leading-5">
                  {personalInfo.summary}
                </p>
              </PreviewSection>
            )}

            {workExperience.length > 0 && (
              <PreviewSection title="Experience">
                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <article key={exp.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {exp.position && (
                            <h4 className="font-bold text-sm">
                              {exp.position}
                            </h4>
                          )}
                          {exp.company && (
                            <p className="mt-0.5 text-[#4a5d57] text-xs">
                              {exp.company}
                            </p>
                          )}
                        </div>
                        {exp.duration && (
                          <p className="shrink-0 text-[#61736d] text-[11px]">
                            {exp.duration}
                          </p>
                        )}
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-[#34443f] text-xs leading-5">
                          {exp.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </PreviewSection>
            )}

            {education.length > 0 && (
              <PreviewSection title="Education">
                <div className="space-y-3">
                  {education.map((edu) => (
                    <article
                      key={edu.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        {edu.degree && (
                          <h4 className="font-bold text-sm">{edu.degree}</h4>
                        )}
                        {edu.school && (
                          <p className="mt-0.5 text-[#4a5d57] text-xs">
                            {edu.school}
                          </p>
                        )}
                      </div>
                      {edu.year && (
                        <p className="shrink-0 text-[#61736d] text-[11px]">
                          {edu.year}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </PreviewSection>
            )}

            {skills.length > 0 && (
              <PreviewSection title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-[#d8eee6] bg-[#f3fbf7] px-2.5 py-1 font-medium text-[#34443f] text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </PreviewSection>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)]">
      <h3 className="border-[#10b981] border-l-2 pl-2 font-bold text-[11px] uppercase tracking-[0.16em]">
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}
