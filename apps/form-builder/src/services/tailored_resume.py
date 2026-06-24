"""
Tailored Resume Service.

Flow C: Generates tailored resume variations based on ATS matching results.
"""

from typing import Any, Dict, List, Optional


class TailoredResumeService:
    def generate(
        self,
        resume: Dict[str, Any],
        missing_keywords: List[str],
        matched_keywords: Optional[List[str]] = None,
        match_pct: Optional[float] = None,
    ) -> Dict[str, Any]:
        original_skills = resume.get("parsed", {}).get("skills", [])

        optimized_skills = list(set(original_skills + missing_keywords))

        suggestions = []
        if missing_keywords:
            suggestions.append(
                f"Add experience with the following skills: {', '.join(missing_keywords)}"
            )

            for skill in missing_keywords:
                suggestions.append(f"Consider adding a project or experience using {skill}")

        if matched_keywords is not None and match_pct is not None:
            if match_pct < 50:
                suggestions.append(
                    "Your match score is low. Consider adding more relevant keywords."
                )
            elif match_pct < 75:
                suggestions.append(
                    "Good match, but consider adding more specific keywords to improve."
                )
            else:
                suggestions.append(
                    "Excellent match! Your resume is well-aligned with the job description."
                )

        tailored_content = self._generate_tailored_content(
            resume=resume,
            optimized_skills=optimized_skills,
            suggestions=suggestions,
        )

        return {
            "summary": f"Resume optimized for target job (Match: {match_pct}%)"
            if match_pct
            else "Resume optimized for target job",
            "suggestions": suggestions,
            "optimized_skills": optimized_skills,
            "tailored_content": tailored_content,
        }

    def _generate_tailored_content(
        self,
        resume: Dict[str, Any],
        optimized_skills: List[str],
        suggestions: List[str],
    ) -> str:
        personal_info = resume.get("personal_info", {})
        name = personal_info.get("name", "Candidate")

        summary = f"{name} is a skilled professional with expertise in "
        summary += ", ".join(optimized_skills[:5]) if optimized_skills else "various technologies"

        suggestions_text = "\n".join([f"- {s}" for s in suggestions[:3]])

        content = f"""
# Tailored Resume for {name}

## Professional Summary
{summary}

## Key Skills
{", ".join(optimized_skills)}

## Suggested Improvements
{suggestions_text}

## Original Experience
{resume.get("parsed", {}).get("experience", "Experience details not available")}

## Original Education
{resume.get("parsed", {}).get("education", "Education details not available")}
"""

        return content.strip()
