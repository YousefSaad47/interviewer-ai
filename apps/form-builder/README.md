# ATS Resume Builder FastAPI Service

This service turns structured resume JSON into an ATS-friendly PDF. It validates the incoming payload with Pydantic, asks Gemini to improve the structured resume without inventing facts, validates the optimized JSON again, renders one fixed LaTeX template, compiles it with XeLaTeX, and returns raw PDF bytes to the Express backend.

It does not authenticate end users, talk to PostgreSQL, store generated resumes, expose public files, or communicate with the frontend. The Node.js API owns authentication, authorization, persistence, PDF storage, and downloads.

## Prerequisites

- Python 3.13 or newer
- `uv`
- XeLaTeX, available as `xelatex` or configured with `ATS_COMPILER_PATH`
- A Gemini API key for real PDF generation

`bun install` at the monorepo root installs JavaScript dependencies only. Run `uv sync` in this directory for Python dependencies.

## Setup

```bash
cd apps/form-builder
uv sync
cp .env.example .env
```

Set at least:

```env
ATS_GEMINI_API_KEY=
ATS_INTERNAL_SERVICE_KEY=development-secret
```

## Environment Variables

- `ATS_APP_NAME`: FastAPI app title
- `ATS_ENVIRONMENT`: `development`, `test`, or `production`
- `ATS_LOG_LEVEL`: Python log level
- `ATS_INTERNAL_SERVICE_KEY`: shared internal key required by `POST /v1/resumes/pdf`
- `ATS_AI_PROVIDER`: only `gemini` is supported
- `ATS_GEMINI_API_KEY`: Gemini API key
- `ATS_GEMINI_MODEL`: Gemini model, default `gemini-2.5-flash`
- `ATS_GEMINI_BASE_URL`: Gemini REST base URL
- `ATS_AI_TIMEOUT_SECONDS`: provider timeout
- `ATS_AI_RETRY_LIMIT`: retry count for retryable provider failures and invalid AI JSON
- `ATS_PROMPT_VERSION`: prompt version label
- `ATS_ATS_RULES_VERSION`: ATS rule version label
- `ATS_COMPILER_PATH`: XeLaTeX executable path
- `ATS_COMPILER_TIMEOUT_SECONDS`: PDF compilation timeout
- `ATS_TEMPORARY_DIRECTORY`: request-scoped temporary compilation root

## Development

Run only this service directly:

```bash
cd apps/form-builder
uv run uvicorn main:app --app-dir src --reload --host 0.0.0.0 --port 8001
```

Run it through Turbo from the monorepo root:

```bash
bun run dev --filter=form-builder
```

Run the full monorepo development workflow from the root:

```bash
bun run dev
```

That starts the Next.js app, Express API, and this FastAPI service because `apps/form-builder/package.json` provides Turbo scripts.

## Endpoints

`GET /health` is public and returns:

```json
{"status":"ok"}
```

`POST /v1/resumes/pdf` accepts camelCase JSON and requires `X-Internal-Service-Key`.

```http
POST /v1/resumes/pdf
Content-Type: application/json
Accept: application/pdf
X-Internal-Service-Key: development-secret
```

Sample request:

```json
{
  "resumeId": "resume-123",
  "resume": {
    "personalInformation": {
      "fullName": "Mohamed Ahmed",
      "email": "mohamed@example.com",
      "phone": "+20 100 000 0000",
      "location": "Cairo, Egypt",
      "headline": "Backend Developer",
      "links": [{"label": "github", "url": "https://github.com/mohamed"}]
    },
    "professionalSummary": "Backend developer focused on scalable web systems.",
    "experience": [],
    "education": [],
    "skills": [
      {
        "name": "Backend Development",
        "level": "advanced",
        "keywords": ["Node.js", "TypeScript", "PostgreSQL", "Prisma"]
      }
    ],
    "projects": [],
    "certifications": [],
    "languages": []
  }
}
```

Curl example:

```bash
curl -X POST http://localhost:8001/v1/resumes/pdf   -H "Content-Type: application/json"   -H "Accept: application/pdf"   -H "X-Internal-Service-Key: development-secret"   --data @sample-resume.json   --output resume.pdf
```

A successful response is `application/pdf` with `Content-Disposition: attachment; filename="resume.pdf"` and PDF bytes in the body.

## Quality Commands

```bash
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run ty check
```

Use `uv run ruff format .` to format the service.

## Common Errors

- `Gemini API key is not configured`: set `ATS_GEMINI_API_KEY`.
- `invalid_internal_service_key`: send `X-Internal-Service-Key` matching `ATS_INTERNAL_SERVICE_KEY`.
- `PDF compiler executable was not found`: install XeLaTeX or set `ATS_COMPILER_PATH`.
- `compilation_timeout`: increase `ATS_COMPILER_TIMEOUT_SECONDS` only after confirming XeLaTeX is healthy.
- Invalid resume errors usually mean the Node backend sent draft or incomplete data; generation should only call this service with a ready resume.
