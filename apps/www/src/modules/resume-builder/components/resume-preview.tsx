"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { useResume } from "../contexts/resume-context";

export function ResumePreview() {
  const { data } = useResume();
  const { personalInfo, workExperience, education, skills } = data;

  return (
    <Card className="rounded-[15px] border-border bg-neutral-100 lg:sticky lg:top-25 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-bold text-foreground text-xl">
          Resume Preview
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Preview Card */}
        <div className="rounded-lg bg-white p-4 sm:p-6">
          {/* Header */}
          <div className="space-y-2 pb-4">
            <h1 className="text-center font-bold text-2xl text-black sm:text-3xl">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-gray-600 text-xs sm:gap-x-4 sm:text-sm">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>
          <Separator className="my-4" />

          {/* Summary */}
          {personalInfo.summary && (
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-black text-sm uppercase">
                Summary
              </h3>
              <p className="text-gray-700 text-xs">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-black text-sm uppercase">
                Experience
              </h3>
              {workExperience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  {exp.position && (
                    <h4 className="font-bold text-black text-sm">
                      {exp.position}
                    </h4>
                  )}
                  {exp.company && (
                    <p className="text-gray-600 text-xs">{exp.company}</p>
                  )}
                  {exp.duration && (
                    <p className="text-gray-500 text-xs">{exp.duration}</p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 text-xs">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-black text-sm uppercase">
                Education
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  {edu.degree && (
                    <h4 className="font-bold text-black text-sm">
                      {edu.degree}
                    </h4>
                  )}
                  {edu.school && (
                    <p className="text-gray-600 text-xs">{edu.school}</p>
                  )}
                  {edu.year && (
                    <p className="text-gray-500 text-xs">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2 pt-4 pb-6">
              <h3 className="font-bold text-black text-sm uppercase">Skills</h3>
              <p className="text-gray-700 text-xs">{skills.join(" • ")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
