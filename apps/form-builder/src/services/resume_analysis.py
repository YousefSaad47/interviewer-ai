"""
Resume Analysis Service.

Flow B: Extracts structured information from raw resume text.
"""

import re
from typing import Any, Dict, List, Optional


class ResumeAnalysisService:
    def __init__(self):
        self.skills_list = [
            "python",
            "java",
            "javascript",
            "typescript",
            "c++",
            "c#",
            "ruby",
            "php",
            "swift",
            "kotlin",
            "go",
            "rust",
            "react",
            "angular",
            "vue",
            "node",
            "express",
            "django",
            "flask",
            "fastapi",
            "spring",
            "rails",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "gcp",
            "jenkins",
            "git",
            "postgresql",
            "mysql",
            "mongodb",
            "redis",
            "elasticsearch",
            "rest",
            "graphql",
            "soap",
            "microservices",
            "ci/cd",
            "agile",
            "scrum",
            "tdd",
            "bdd",
            "devops",
            "linux",
            "unix",
            "bash",
            "html",
            "css",
            "sass",
            "less",
            "webpack",
            "babel",
            "jquery",
            "bootstrap",
            "tailwind",
            "material-ui",
            "redux",
            "mobx",
            "next.js",
            "nuxt.js",
            "gatsby",
            "spring boot",
            "hibernate",
            "mybatis",
            "jpa",
            "sqlalchemy",
            "pandas",
            "numpy",
            "scikit-learn",
            "tensorflow",
            "pytorch",
            "keras",
            "opencv",
            "nlp",
            "computer vision",
            "deep learning",
            "machine learning",
            "data science",
            "big data",
            "hadoop",
            "spark",
            "kafka",
            "rabbitmq",
            "memcached",
            "nginx",
            "apache",
            "tomcat",
            "jboss",
            "websphere",
            "weblogic",
            "oracle",
            "sql server",
            "db2",
            "sap",
            "jest",
            "cypress",
        ]

        self.education_keywords = [
            "bsc",
            "msc",
            "phd",
            "bachelor",
            "master",
            "doctorate",
            "degree",
            "university",
            "college",
            "institute",
            "school",
            "بكالوريوس",
            "ماجستير",
            "دكتوراه",
            "جامعة",
            "كلية",
            "bs",
            "ba",
            "ma",
            "ms",
            "mba",
            "ph.d",
            "b.eng",
            "m.eng",
            "b.tech",
            "m.tech",
            "b.com",
            "m.com",
            "b.sc",
            "m.sc",
        ]

        self.date_patterns = [
            r"(\d{4})\s*[-–—]\s*(\d{4})",
            r"(\d{4})\s*[-–—]\s*present",
            r"(\d{4})\s*[-–—]\s*current",
            r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{4})",
            r"(\d{1,2})\s*/\s*(\d{4})",
        ]

    def extract_name(self, text: str) -> Optional[str]:
        if not text:
            return None

        lines = text.split("\n")

        skip_patterns = [
            r"^resume$",
            r"^curriculum vitae$",
            r"^cv$",
            r"^work experience$",
            r"^education$",
            r"^skills$",
            r"^contact$",
            r"^personal information$",
            r"^profile$",
            r"^summary$",
            r"^experience$",
            r"^projects$",
            r"^certifications$",
        ]

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line.isupper() and not any("\u0600" <= c <= "\u06ff" for c in line):
                continue

            if any(re.search(pattern, line.lower()) for pattern in skip_patterns):
                continue

            if (
                "@" in line
                or "http" in line
                or "linkedin" in line.lower()
                or "github" in line.lower()
            ):
                continue

            if len(line.split()) >= 2 or any("\u0600" <= c <= "\u06ff" for c in line):
                return line

        return None

    def extract_email(self, text: str) -> Optional[str]:
        if not text:
            return None

        pattern = r"(?<![.\w])[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?![.\w])"
        matches = re.findall(pattern, text)

        for email in matches:
            if not email.startswith("."):
                return email

        return None

    def extract_skills(self, text: str) -> List[str]:
        if not text:
            return []

        text_lower = text.lower()
        found_skills = []

        for skill in self.skills_list:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, text_lower):
                found_skills.append(skill)

        return found_skills

    def extract_education(self, text: str) -> List[str]:
        if not text:
            return []

        found_education = []
        lines = text.split("\n")

        education_section = self._extract_section(
            text, ["education", "academic background", "qualifications"]
        )

        if education_section:
            lines = education_section.split("\n")

        for i, line in enumerate(lines):
            line_clean = line.strip()
            if not line_clean:
                continue

            line_lower = line_clean.lower()

            if any(keyword in line_lower for keyword in self.education_keywords):
                education_entry = line_clean

                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if next_line and len(next_line) < 100:
                        education_entry += " " + next_line

                found_education.append(education_entry)

        if not found_education:
            edu_patterns = [
                r"([Bb]achelor|[Mm]aster|[Pp]h\.?[Dd]|[Bb]\.?[Ss]?[Cc]?|[Mm]\.?[Ss]?[Cc]?)\s+[Ii]n\s+([A-Za-z\s]+)",
                r"([Bb]achelor|[Mm]aster|[Pp]h\.?[Dd])\s+of\s+([A-Za-z\s]+)",
                r"([A-Za-z]+\s+[Uu]niversity|[Cc]ollege|[Ii]nstitute)",
            ]

            for pattern in edu_patterns:
                matches = re.findall(pattern, text)
                for match in matches:
                    if isinstance(match, tuple):
                        found_education.append(" ".join(match).strip())
                    else:
                        found_education.append(match.strip())

        return found_education

    def extract_experience(self, text: str) -> List[Dict[str, Any]]:
        if not text:
            return []

        experiences = []

        experience_section = self._extract_section(
            text,
            [
                r"experience",
                r"work experience",
                r"employment",
                r"professional experience",
                r"career history",
            ],
        )

        if not experience_section:
            experience_section = text

        blocks = self._split_into_blocks(experience_section)

        for block in blocks:
            experience = self._parse_experience_block(block)
            if experience:
                experiences.append(experience)

        if not experiences:
            experiences = self._extract_experience_by_patterns(text)

        return experiences

    def extract_projects(self, text: str) -> List[Dict[str, Any]]:
        if not text:
            return []

        projects = []

        projects_section = self._extract_section(
            text,
            [r"projects?", r"personal projects", r"academic projects", r"portfolio"],
        )

        if not projects_section:
            return projects

        blocks = self._split_into_blocks(projects_section)

        for block in blocks:
            project = self._parse_project_block(block)
            if project:
                projects.append(project)

        if not projects:
            projects = self._extract_projects_by_patterns(text)

        return projects

    def _extract_section(self, text: str, section_keywords: List[str]) -> str:
        lines = text.split("\n")
        section_start = -1
        section_end = len(lines)

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if not line_lower or line_lower in ["---", "==="]:
                continue
            if any(re.search(keyword, line_lower) for keyword in section_keywords):
                section_start = i
                break

        if section_start == -1:
            return ""

        section_headers = [
            r"experience",
            r"education",
            r"skills",
            r"certifications",
            r"references",
            r"projects",
            r"publications",
            r"achievements",
            r"summary",
            r"profile",
        ]

        for i in range(section_start + 1, len(lines)):
            line_lower = lines[i].lower().strip()
            if line_lower in ["---", "==="]:
                continue
            if any(re.search(header, line_lower) for header in section_headers):
                if len(line_lower.split()) <= 3:
                    section_end = i
                    break

        return "\n".join(lines[section_start:section_end])

    def _split_into_blocks(self, text: str) -> List[str]:
        lines = text.split("\n")
        blocks = []
        current_block = []

        for line in lines:
            line = line.strip()
            if not line:
                if current_block:
                    blocks.append("\n".join(current_block))
                    current_block = []
            else:
                if line.isupper() and len(line.split()) <= 3:
                    if current_block:
                        blocks.append("\n".join(current_block))
                        current_block = []
                    current_block.append(line)
                else:
                    current_block.append(line)

        if current_block:
            blocks.append("\n".join(current_block))

        return blocks

    def _parse_experience_block(self, block: str) -> Optional[Dict[str, Any]]:
        lines = block.split("\n")

        if len(lines) < 2:
            return None

        first_line = lines[0].strip()
        company = None
        role = None
        location = None

        if "|" in first_line:
            parts = first_line.split("|")
            if len(parts) == 2:
                role = parts[0].strip()
                company = parts[1].strip()
            elif len(parts) == 3:
                role = parts[0].strip()
                company = parts[1].strip()
                location = parts[2].strip()
            else:
                role = first_line
        elif " @ " in first_line or " at " in first_line:
            parts = re.split(r"\s+@\s+|\s+at\s+", first_line)
            if len(parts) == 2:
                role = parts[0].strip()
                company = parts[1].strip()
            else:
                role = first_line
        elif " - " in first_line:
            parts = first_line.split(" - ")
            if len(parts) == 2:
                if any(
                    word in parts[1].lower()
                    for word in ["ltd", "inc", "corp", "company", "technologies"]
                ):
                    role = parts[0].strip()
                    company = parts[1].strip()
                else:
                    company = parts[0].strip()
                    role = parts[1].strip()
            else:
                role = first_line
        else:
            role = first_line
            if len(lines) > 1:
                company = lines[1].strip()

        start_date = None
        end_date = None
        date_line = None

        for line in lines:
            line_clean = line.strip()
            dates = self._extract_dates(line_clean)
            if dates:
                date_line = line_clean
                start_date = dates.get("start")
                end_date = dates.get("end")
                if "|" in line_clean and not location:
                    parts = line_clean.split("|")
                    if len(parts) >= 2:
                        for part in parts:
                            if "present" not in part.lower() and not re.search(r"\d{4}", part):
                                location = part.strip()
                break

        if not location:
            for line in lines:
                line_clean = line.strip()
                if (
                    line_clean != date_line
                    and "|" in line_clean
                    and "present" not in line_clean.lower()
                ):
                    parts = line_clean.split("|")
                    if len(parts) >= 2:
                        for part in parts:
                            if not re.search(r"\d{4}", part) and "present" not in part.lower():
                                location = part.strip()
                                break

        description_lines = []
        achievements = []
        technologies = []

        start_idx = 1
        found_date = False

        for i, line in enumerate(lines):
            if line.strip() == date_line:
                start_idx = i + 1
                found_date = True
                break

        if not found_date:
            for i, line in enumerate(lines):
                line_clean = line.strip()
                if line_clean and not any(
                    x in line_clean.lower() for x in ["ltd", "inc", "corp", "company"]
                ):
                    if i > 1:
                        start_idx = i
                        break

        for i in range(start_idx, len(lines)):
            line = lines[i].strip()
            if not line:
                continue

            if re.match(r"^[\s•\-–—\*\+\d]+", line) or line.startswith("-"):
                achievements.append(line)
            else:
                description_lines.append(line)

        combined_text = " ".join(description_lines + achievements)
        for skill in self.skills_list:
            if skill.lower() in combined_text.lower():
                technologies.append(skill)

        technologies = list(set(technologies))

        if role or company:
            return {
                "company": company or "Unknown Company",
                "role": role or "Unknown Role",
                "start_date": start_date or "Unknown",
                "end_date": end_date or "Present",
                "location": location or "",
                "description": " ".join(description_lines) if description_lines else "",
                "achievements": achievements,
                "technologies": technologies,
                "raw_text": block,
            }

        return None

    def _parse_project_block(self, block: str) -> Optional[Dict[str, Any]]:
        lines = block.split("\n")

        if not lines:
            return None

        first_line = lines[0].strip()
        name = None
        technologies = []
        link = None

        match = re.match(r"^(.+?)\s*[\(（]\s*([^)）]+)\s*[\)）]", first_line)
        if match:
            name = match.group(1).strip()
            tech_str = match.group(2).strip()
            for tech in self.skills_list:
                if tech.lower() in tech_str.lower():
                    technologies.append(tech)
        else:
            if ":" in first_line:
                parts = first_line.split(":", 1)
                name = parts[0].strip()
            elif " - " in first_line:
                parts = first_line.split(" - ", 1)
                name = parts[0].strip()
                if "http" in parts[1]:
                    link = parts[1].strip()
            else:
                name = first_line

        if not link:
            link_match = re.search(r"https?://[^\s]+", block)
            if link_match:
                link = link_match.group(0)

        description_lines = []

        for i in range(1, len(lines)):
            line = lines[i].strip()
            if not line:
                continue
            if "http" in line:
                if not link:
                    link = line
                continue
            description_lines.append(line)

        if not technologies:
            combined_text = " ".join(description_lines)
            for tech in self.skills_list:
                if tech.lower() in combined_text.lower():
                    technologies.append(tech)

        technologies = list(set(technologies))

        if name:
            return {
                "name": name,
                "description": " ".join(description_lines) if description_lines else "",
                "technologies": technologies,
                "link": link or "",
                "raw_text": block,
            }

        return None

    def _extract_dates(self, text: str) -> Optional[Dict[str, str]]:
        text_lower = text.lower()

        for pattern in self.date_patterns:
            match = re.search(pattern, text_lower)
            if match:
                if "present" in text_lower or "current" in text_lower:
                    return {"start": match.group(1), "end": "Present"}
                elif len(match.groups()) >= 2:
                    return {"start": match.group(1), "end": match.group(2)}

        date_matches = re.findall(r"\b(\d{4})\b", text)
        if len(date_matches) >= 2:
            return {"start": date_matches[0], "end": date_matches[-1]}
        elif len(date_matches) == 1:
            return {"start": date_matches[0], "end": "Present"}

        return None

    def _extract_experience_by_patterns(self, text: str) -> List[Dict[str, Any]]:
        experiences = []

        patterns = [
            r"(?:^|\n)([A-Z][a-zA-Z\s]+)\s*(?:\|\s*([A-Za-z\s]+))?\s*[-–—]\s*([A-Za-z\s]+)",
            r"(?:^|\n)([A-Z][a-zA-Z\s]+)\s*at\s*([A-Za-z\s]+)\s*[-–—]\s*([A-Za-z\s]+)",
            r"(?:^|\n)([A-Z][a-zA-Z\s]+)\s*[-–—]\s*([A-Za-z\s]+)\s*[-–—]\s*([A-Za-z\s]+)",
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, text, re.MULTILINE)
            for match in matches:
                groups = match.groups()
                if len(groups) >= 2:
                    role = groups[0].strip() if groups[0] else "Unknown Role"
                    company = (
                        groups[1].strip() if len(groups) > 1 and groups[1] else "Unknown Company"
                    )
                    start_date = groups[2].strip() if len(groups) > 2 and groups[2] else "Unknown"

                    experience = {
                        "role": role,
                        "company": company,
                        "start_date": start_date,
                        "end_date": "Present",
                        "location": "",
                        "description": "",
                        "achievements": [],
                        "technologies": [],
                        "raw_text": match.group(0),
                    }
                    experiences.append(experience)

        return experiences

    def _extract_projects_by_patterns(self, text: str) -> List[Dict[str, Any]]:
        projects = []

        patterns = [
            r"(?:^|\n)([A-Z][a-zA-Z\s]+)\s*[\(（]\s*([^)）]+)\s*[\)）]\s*[-–—]\s*([^\n]+)",
            r"(?:^|\n)([A-Z][a-zA-Z\s]+)\s*:?\s*([^\n]+)",
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, text, re.MULTILINE)
            for match in matches:
                groups = match.groups()
                if len(groups) >= 2:
                    project = {
                        "name": groups[0].strip() if groups[0] else "Unknown Project",
                        "description": groups[-1].strip() if len(groups) > 1 and groups[-1] else "",
                        "technologies": [],
                        "link": "",
                        "raw_text": match.group(0),
                    }

                    if len(groups) >= 2 and "(" in groups[0]:
                        tech_match = re.search(r"[\(（]\s*([^)）]+)\s*[\)）]", groups[0])
                        if tech_match:
                            tech_str = tech_match.group(1)
                            for tech in self.skills_list:
                                if tech.lower() in tech_str.lower():
                                    project["technologies"].append(tech)

                    projects.append(project)

        return projects

    def analyze(self, text: str) -> Dict[str, Any]:
        return {
            "full_name": self.extract_name(text),
            "email": self.extract_email(text),
            "skills": self.extract_skills(text),
            "experience": self.extract_experience(text),
            "education": self.extract_education(text),
            "projects": self.extract_projects(text),
        }
