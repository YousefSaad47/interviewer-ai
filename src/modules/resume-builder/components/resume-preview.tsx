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
    <Card className="border-border sticky top-25 rounded-[15px] bg-neutral-100 dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">
          Resume Preview
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Preview Card */}
        <div className="rounded-lg bg-white p-6">
          {/* Header */}
          <div className="space-y-2 pb-4">
            <h1 className="text-center text-3xl font-bold text-black">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>
          <Separator className="my-4" />

          {/* Summary */}
          {personalInfo.summary && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-black uppercase">
                Summary
              </h3>
              <p className="text-xs text-gray-700">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-black uppercase">
                Experience
              </h3>
              {workExperience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  {exp.position && (
                    <h4 className="text-sm font-bold text-black">
                      {exp.position}
                    </h4>
                  )}
                  {exp.company && (
                    <p className="text-xs text-gray-600">{exp.company}</p>
                  )}
                  {exp.duration && (
                    <p className="text-xs text-gray-500">{exp.duration}</p>
                  )}
                  {exp.description && (
                    <p className="text-xs text-gray-700">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-black uppercase">
                Education
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  {edu.degree && (
                    <h4 className="text-sm font-bold text-black">
                      {edu.degree}
                    </h4>
                  )}
                  {edu.school && (
                    <p className="text-xs text-gray-600">{edu.school}</p>
                  )}
                  {edu.year && (
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2 pt-4 pb-6">
              <h3 className="text-sm font-bold text-black uppercase">Skills</h3>
              <p className="text-xs text-gray-700">{skills.join(" • ")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
