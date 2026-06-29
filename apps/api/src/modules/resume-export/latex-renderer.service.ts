import path from "node:path";

import nunjucks from "nunjucks";

import { displayUrl, escapeLatex, sanitizeUrl } from "./utils/escape-latex";
import type { NormalizedResumeData } from "./utils/normalize-resume";

interface ContactItem {
  text: string;
  url: string;
}

interface TemplateContext {
  metadataTitle: string;
  metadataAuthor: string;
  personal: { fullName: string };
  contactItems: ContactItem[];
  summary: string;
  workExperience: Array<{
    position: string;
    company: string;
    duration: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    role: string;
    safeUrl: string;
    bullets: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
}

export class LatexRendererService {
  private readonly _env: nunjucks.Environment;

  constructor() {
    const templateDir = path.join(__dirname, "templates");
    this._env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(templateDir),
      { autoescape: false, trimBlocks: true, lstripBlocks: true },
    );
  }

  render(resume: NormalizedResumeData): string {
    const context = this._buildContext(resume);
    return this._env.render("resume.tex.njk", context);
  }

  private _buildContext(resume: NormalizedResumeData): TemplateContext {
    const personal = resume.personalInfo;
    const safeName = escapeLatex(personal.fullName);

    const contactItems: ContactItem[] = [];

    if (personal.email) {
      contactItems.push({
        text: escapeLatex(personal.email),
        url: `mailto:${sanitizeUrl(`mailto:${personal.email}`).replace("mailto:", "")}`,
      });
    }
    if (personal.phone) {
      contactItems.push({ text: escapeLatex(personal.phone), url: "" });
    }
    if (personal.location) {
      contactItems.push({ text: escapeLatex(personal.location), url: "" });
    }
    if (personal.linkedin) {
      const url = this._ensureProtocol(personal.linkedin);
      contactItems.push({
        text: escapeLatex(displayUrl(url)),
        url: sanitizeUrl(url),
      });
    }
    if (personal.github) {
      const url = this._ensureProtocol(personal.github);
      contactItems.push({
        text: escapeLatex(displayUrl(url)),
        url: sanitizeUrl(url),
      });
    }

    return {
      metadataTitle: escapeLatex(`${personal.fullName}'s CV`),
      metadataAuthor: safeName,
      personal: { fullName: safeName },
      contactItems,
      summary: escapeLatex(resume.summary || personal.summary),
      workExperience: resume.workExperience.map((w) => ({
        position: escapeLatex(w.position),
        company: escapeLatex(w.company),
        duration: escapeLatex(w.duration),
        bullets: this._splitBullets(w.description),
      })),
      education: resume.education.map((e) => ({
        degree: escapeLatex(e.degree),
        school: escapeLatex(e.school),
        year: escapeLatex(e.year),
      })),
      projects: resume.projects.map((p) => ({
        name: escapeLatex(p.name),
        role: escapeLatex(p.role),
        safeUrl: p.url ? sanitizeUrl(this._ensureProtocol(p.url)) : "",
        bullets: this._splitBullets(p.description),
      })),
      skills: resume.skills.map((s) => ({
        category: escapeLatex(s.category),
        items: s.items.map(escapeLatex),
      })),
    };
  }

  private _splitBullets(description: string): string[] {
    if (!description.trim()) return [];
    const lines = description
      .split(/\n|(?:\.\s)/)
      .map((l) => l.trim().replace(/\.$/, ""))
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      return [escapeLatex(description)];
    }
    return lines.map(escapeLatex);
  }

  private _ensureProtocol(url: string): string {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }
}
