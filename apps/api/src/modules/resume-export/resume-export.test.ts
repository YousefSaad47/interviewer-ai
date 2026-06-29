import { describe, expect, test } from "bun:test";
import { LatexRendererService } from "./latex-renderer.service";
import { PdfCompilerService } from "./pdf-compiler.service";
import { resumeExportInputSchema } from "./resume-export.schema";
import type { ResumeContent } from "./resume-export.types";
import { escapeLatex } from "./utils/escape-latex";
import { normalizeResumeForExport } from "./utils/normalize-resume";
import { safeFilename } from "./utils/safe-filename";

const validContent: ResumeContent = {
  personalInfo: {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+20 100 000 0000",
    location: "Cairo, Egypt",
    summary: "Built Node.js & PostgreSQL systems with 50% faster APIs.",
    linkedin: "linkedin.com/in/ada",
    github: "https://github.com/ada",
  },
  workExperience: [
    {
      id: "w1",
      company: "A&B Co",
      position: "Backend Engineer",
      duration: "2022 - Present",
      description: "Protected user_name exports with {safe} escaping.",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Resume_Export",
      role: "Lead",
      duration: "2024",
      description: "Generated PDFs from Node.js & LaTeX.",
      url: "https://github.com/ada/resume_export",
    },
  ],
  education: [
    {
      id: "e1",
      school: "Cairo University",
      degree: "BSc Computer Science",
      year: "2018 - 2022",
    },
  ],
  skills: [
    {
      id: "s1",
      category: "Backend & Data",
      items: ["Node.js", "PostgreSQL", "LaTeX_Export"],
    },
  ],
};

describe("resume export validation", () => {
  test("accepts a valid resume request", () => {
    expect(
      resumeExportInputSchema.safeParse({ content: validContent }).success,
    ).toBe(true);
  });

  test("rejects missing full name", () => {
    const result = resumeExportInputSchema.safeParse({
      content: {
        ...validContent,
        personalInfo: { ...validContent.personalInfo, fullName: "" },
      },
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid email and URL", () => {
    const result = resumeExportInputSchema.safeParse({
      content: {
        ...validContent,
        personalInfo: {
          ...validContent.personalInfo,
          email: "not-an-email",
          linkedin: "javascript:alert(1)",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  test("removes empty optional rows before export", () => {
    const result = resumeExportInputSchema.parse({
      content: {
        ...validContent,
        projects: [
          { id: "blank", name: "", role: "", duration: "", description: "" },
        ],
        education: [{ id: "blank", school: "", degree: "", year: "" }],
      },
    });

    expect(result.content.projects).toHaveLength(0);
    expect(result.content.education).toHaveLength(0);
  });
});

describe("resume export utilities", () => {
  test("escapes LaTeX special characters", () => {
    const escaped = escapeLatex("A&B%$_{}~^\\");

    expect(escaped).toContain("A\\&B\\%\\$\\_\\{\\}");
    expect(escaped).toContain("\\textasciitilde{}");
    expect(escaped).toContain("\\textasciicircum{}");
    expect(escaped).toContain("\\textbackslash{}");
  });

  test("generates safe filenames", () => {
    expect(safeFilename(" Mohamed Ahmed / Resume ")).toBe(
      "mohamed-ahmed-resume-resume.pdf",
    );
    expect(safeFilename("***")).toBe("resume.pdf");
  });
});

describe("resume export PDF compilation", () => {
  test("reports unavailable compiler", async () => {
    await expect(
      new PdfCompilerService("definitely-not-xelatex", 1000).compile("latex"),
    ).rejects.toThrow("LaTeX compiler is not available");
  });

  test("renders and compiles a PDF with special characters", async () => {
    const available = Bun.spawnSync(["xelatex", "--version"]);
    if (available.exitCode !== 0) {
      return;
    }

    const normalized = normalizeResumeForExport(validContent);
    const latex = new LatexRendererService().render(normalized);
    const pdf = await new PdfCompilerService("xelatex", 30000).compile(latex);

    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
