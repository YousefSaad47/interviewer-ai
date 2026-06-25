class ATSEngine:
    def calculate(self, resume, job_keywords):
        resume_skills = set(skill.lower() for skill in resume["parsed"]["skills"])
        job_skills = set(skill.lower() for skill in job_keywords)

        matched = list(resume_skills.intersection(job_skills))
        missing = list(job_skills.difference(resume_skills))

        if not job_skills:
            score = 0
        else:
            score = (len(matched) / len(job_skills)) * 100

        return {
            "match_pct": round(score, 2),
            "matched_keywords": matched,
            "missing_keywords": missing,
        }
