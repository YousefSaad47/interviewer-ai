<<<<<<< Updated upstream
# Form Builder - Resume Builder & ATS System

This is a **FastAPI** backend module for the Interviewer AI platform. It provides resume generation, ATS analysis, job matching, and secure file management.

---

## **Getting Started**

### **Prerequisites**
- Python 3.11+
- [UV](https://github.com/astral-sh/uv) (recommended) or pip

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/YousefSaad47/interviewer-ai.git
cd interviewer-ai/apps/form-builder

# 2. Install UV (if not installed)
# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh
# Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 3. Install dependencies
uv sync

# 4. Set up environment variables
cp .env_example .env
# Edit .env with your configuration
```

### **Run the Development Server**

```bash
uv run uvicorn src.main:app --reload
```

### **Open API Documentation**

```
http://127.0.0.1:8000/docs
```

---
## **Learn More**

- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Learn about FastAPI features and API.
- [Pydantic Documentation](https://docs.pydantic.dev/) - Data validation using Python type hints.
- [UV Documentation](https://docs.astral.sh/uv/) - Fast Python package installer.
- [Render Documentation](https://render.com/docs) - Deploy your application.

---

=======
# ATS Resume Builder

FastAPI microservice that receives resume JSON, validates it, optimizes it through an AI provider abstraction, validates the returned JSON, renders an ATS-friendly LaTeX resume, compiles it with XeLaTeX, and returns raw PDF bytes.

## Run

```bash
uv sync
uv run uvicorn main:app --reload
```

## Endpoint

`POST /v1/resumes/pdf`

Success response:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="resume.pdf"`
- `X-Resume-Id`
- `X-AI-Optimized`

## Configuration

Environment variables use the `ATS_` prefix:

- `ATS_AI_PROVIDER=gemini`
- `ATS_GEMINI_API_KEY=...`
- `ATS_GEMINI_MODEL=gemini-2.5-flash`
- `ATS_AI_TIMEOUT_SECONDS=30`
- `ATS_AI_RETRY_LIMIT=2`
- `ATS_COMPILER_PATH=xelatex`
- `ATS_COMPILER_TIMEOUT_SECONDS=300`
- `ATS_TEMPORARY_DIRECTORY=/tmp/resume-generation`
- `ATS_PROMPT_VERSION=v1`
- `ATS_ATS_RULES_VERSION=v1`
- `ATS_LOG_LEVEL=INFO`

## Quality

```bash
uv run pytest
uvx ruff check .
uvx ruff format --check .
uvx ty check
```
>>>>>>> Stashed changes
