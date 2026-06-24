"""
Unit Tests (ATS Matching)

Coverage:
  • ATSEngine.calculate — basic matching
  • ATSEngine.calculate — no skills in resume → 0% match
  • ATSEngine.calculate — all skills match → 100%
  • ATSEngine.calculate — partial matching
  • TailoredResumeService.generate — basic functionality
  • TailoredResumeService.generate — with matched keywords
  • TailoredResumeService.generate — with match percentage
  • KeywordExtractor.extract — basic extraction
  • KeywordExtractor.extract — case insensitive
  • KeywordExtractor.extract — no matches

"""

from unittest.mock import patch


class TestATSEngine:
    def _engine(self):
        from src.services.ats_engine import ATSEngine

        return ATSEngine()

    def test_calculate_basic_match(self):
        engine = self._engine()
        resume = {"parsed": {"skills": ["Python", "FastAPI", "Docker", "PostgreSQL"]}}
        job_keywords = ["python", "fastapi", "docker", "aws", "ci/cd"]

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 60.0
        assert set(result["matched_keywords"]) == {"python", "fastapi", "docker"}
        assert set(result["missing_keywords"]) == {"aws", "ci/cd"}

    def test_calculate_no_match(self):
        engine = self._engine()
        resume = {"parsed": {"skills": ["Java", "Spring", "MySQL"]}}
        job_keywords = ["python", "fastapi", "docker"]

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 0.0
        assert result["matched_keywords"] == []
        assert set(result["missing_keywords"]) == {"python", "fastapi", "docker"}

    def test_calculate_perfect_match(self):
        engine = self._engine()
        resume = {"parsed": {"skills": ["Python", "FastAPI", "Docker", "AWS"]}}
        job_keywords = ["python", "fastapi", "docker", "aws"]

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 100.0
        assert set(result["matched_keywords"]) == {"python", "fastapi", "docker", "aws"}
        assert result["missing_keywords"] == []

    def test_calculate_empty_job_skills(self):
        engine = self._engine()
        resume = {"parsed": {"skills": ["Python", "FastAPI"]}}
        job_keywords = []

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 0.0
        assert result["matched_keywords"] == []
        assert result["missing_keywords"] == []

    def test_calculate_empty_resume_skills(self):
        engine = self._engine()
        resume = {"parsed": {"skills": []}}
        job_keywords = ["python", "fastapi", "docker"]

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 0.0
        assert result["matched_keywords"] == []
        assert set(result["missing_keywords"]) == {"python", "fastapi", "docker"}

    def test_calculate_case_insensitive_matching(self):
        engine = self._engine()
        resume = {"parsed": {"skills": ["PYTHON", "FASTAPI", "DOCKER"]}}
        job_keywords = ["python", "fastapi", "docker", "aws"]

        result = engine.calculate(resume, job_keywords)

        assert result["match_pct"] == 75.0
        assert set(result["matched_keywords"]) == {"python", "fastapi", "docker"}
        assert result["missing_keywords"] == ["aws"]


class TestTailoredResumeService:
    def _service(self):
        from src.services.tailored_resume import TailoredResumeService

        return TailoredResumeService()

    def test_generate_basic(self):
        service = self._service()
        resume = {"parsed": {"skills": ["Python", "FastAPI", "Docker"]}}
        missing_keywords = ["aws", "ci/cd"]

        result = service.generate(resume, missing_keywords)

        assert "summary" in result
        assert "suggestions" in result
        assert "optimized_skills" in result
        assert len(result["suggestions"]) == 3

    def test_generate_with_matched_keywords(self):
        service = self._service()
        resume = {"parsed": {"skills": ["Python", "FastAPI"]}}
        missing_keywords = ["docker", "aws"]
        matched_keywords = ["python", "fastapi"]
        match_pct = 50.0

        result = service.generate(
            resume,
            missing_keywords,
            matched_keywords=matched_keywords,
            match_pct=match_pct,
        )

        assert "Resume optimized" in result["summary"]
        assert len(result["suggestions"]) > 1
        assert "docker" in result["optimized_skills"]
        assert "aws" in result["optimized_skills"]

    def test_generate_with_high_match_score(self):
        service = self._service()
        resume = {"parsed": {"skills": ["Python", "FastAPI", "Docker", "AWS"]}}
        missing_keywords = []
        matched_keywords = ["python", "fastapi", "docker", "aws"]
        match_pct = 100.0

        result = service.generate(
            resume,
            missing_keywords,
            matched_keywords=matched_keywords,
            match_pct=match_pct,
        )

        assert "Excellent match" in " ".join(result["suggestions"])
        assert sorted(result["optimized_skills"]) == sorted(["Python", "FastAPI", "Docker", "AWS"])

    def test_generate_with_low_match_score(self):
        service = self._service()
        resume = {"parsed": {"skills": ["Java"]}}
        missing_keywords = ["python", "fastapi", "docker"]
        matched_keywords = []
        match_pct = 0.0

        result = service.generate(
            resume,
            missing_keywords,
            matched_keywords=matched_keywords,
            match_pct=match_pct,
        )

        assert "low" in " ".join(result["suggestions"]).lower()
        assert len(result["optimized_skills"]) == 4

    def test_generate_tailored_content(self):
        service = self._service()
        resume = {
            "parsed": {
                "skills": ["Python", "FastAPI"],
                "experience": [{"company": "Tech Corp", "role": "Developer"}],
                "education": [{"degree": "BSc", "institution": "MIT"}],
            },
            "personal_info": {"name": "John Doe"},
        }
        missing_keywords = ["docker"]

        result = service.generate(resume, missing_keywords)

        assert "tailored_content" in result
        assert "John Doe" in result["tailored_content"]
        assert "Python" in result["tailored_content"]
        assert "docker" in result["tailored_content"]


class TestKeywordExtractor:
    def _extractor(self):
        from src.services.keyword_extractor import KeywordExtractor

        return KeywordExtractor()

    def test_extract_basic(self):
        extractor = self._extractor()
        text = "We need a Python developer with FastAPI and Docker experience."

        result = extractor.extract(text)

        assert "python" in result
        assert "fastapi" in result
        assert "docker" in result

    def test_extract_case_insensitive(self):
        extractor = self._extractor()
        text = "PYTHON, FASTAPI, and DOCKER are required"

        result = extractor.extract(text)

        assert "python" in result
        assert "fastapi" in result
        assert "docker" in result

    def test_extract_no_matches(self):
        extractor = self._extractor()
        text = "We need a Java developer with Spring Boot experience."

        result = extractor.extract(text)

        assert result == []

    def test_extract_partial_matches(self):
        extractor = self._extractor()
        text = "Python, PostgreSQL, and React are needed"

        result = extractor.extract(text)

        assert "python" in result
        assert "postgresql" in result

    def test_extract_with_skill_list_override(self):
        extractor = self._extractor()
        with patch.object(extractor, "skills", ["java", "spring", "mysql"]):
            text = "We need Java and Spring experience with MySQL"

            result = extractor.extract(text)

            assert "java" in result
            assert "spring" in result
            assert "mysql" in result
