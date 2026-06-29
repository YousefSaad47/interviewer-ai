# Form Builder Project Documentation

This document inventories the current `apps/form-builder` project: folder structure,
runtime entrypoints, endpoints, functions, classes, data models, settings, tests, and
important current-state notes.

## Current State Summary

- The project contains the new `ats_resume_builder` package for AI-assisted ATS resume PDF generation.
- The actual API factory is `ats_resume_builder.api.app.create_app()`.
- The current `src/main.py` on this branch only prints `Hello World!` and does not expose a FastAPI `app`.
- Because of that, `uvicorn main:app` will not work unless `src/main.py` is changed to create/export `app = create_app()`.
- The FastAPI endpoints exist in code under `src/ats_resume_builder/api`, but they are only active when an app is created with `create_app()`.
- The current `pyproject.toml` declares no runtime dependencies even though the source imports FastAPI, Pydantic, Jinja2, LangGraph, httpx, python-json-logger, and other packages.
- `apps/form-builder/tmp/` is untracked runtime/mock data and is not used by the new PDF endpoint path.

## Folder Structure

```text
apps/form-builder/
├── .gitignore
├── .python-version
├── FORM_BUILDER_FULL_DOCUMENTATION.md
├── Makefile
├── README.md
├── pyproject.toml
├── ruff.toml
├── uv.lock
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── ats_resume_builder/
│       ├── __init__.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── app.py
│       │   ├── dependencies.py
│       │   └── routes.py
│       ├── ats/
│       │   ├── __init__.py
│       │   └── rules.py
│       ├── compiler/
│       │   ├── __init__.py
│       │   └── pdf_compiler.py
│       ├── config/
│       │   ├── __init__.py
│       │   └── settings.py
│       ├── exceptions/
│       │   ├── __init__.py
│       │   └── errors.py
│       ├── graph/
│       │   ├── __init__.py
│       │   └── workflow.py
│       ├── logging/
│       │   ├── __init__.py
│       │   └── setup.py
│       ├── prompts/
│       │   ├── __init__.py
│       │   └── manager.py
│       ├── providers/
│       │   ├── __init__.py
│       │   ├── base.py
│       │   ├── factory.py
│       │   └── gemini.py
│       ├── renderer/
│       │   ├── __init__.py
│       │   └── latex_renderer.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── resume.py
│       ├── services/
│       │   ├── __init__.py
│       │   └── resume_builder.py
│       ├── templates/
│       │   └── resume.tex.j2
│       └── utils/
│           ├── __init__.py
│           ├── json_repair.py
│           └── latex.py
├── tests/
│   ├── test_api.py
│   ├── test_compiler.py
│   ├── test_gemini_provider.py
│   ├── test_json_repair.py
│   ├── test_latex_renderer.py
│   └── test_validation.py
└── tmp/                         # untracked runtime/mock files
    ├── mock_db_files.json
    ├── mock_db_jobs.json
    ├── mock_db_matches.json
    ├── mock_db_uploaded.json
    └── mock_db_users.json
```

## Runtime Entrypoints

### `src/main.py`

Functions:

- `main()`
  - Prints `Hello World!`.
  - Does not create or export a FastAPI application.

Current content behavior:

```text
python src/main.py
```

prints:

```text
Hello World!
```

Important note:

- The API code exists, but `main.py` currently does not wire it.
- To run the API, code must import `create_app()` and expose `app`, or the server must target a module that creates the app.

## FastAPI Application

### `src/ats_resume_builder/api/app.py`

Functions:

- `create_app() -> FastAPI`
  - Loads settings with `get_settings()`.
  - Configures JSON logging with `configure_logging(settings.log_level)`.
  - Creates `FastAPI(title=settings.app_name)`.
  - Includes `ats_resume_builder.api.routes.router`.
  - Defines `GET /health`.
  - Registers exception handlers for `AppError` and `RequestValidationError`.
  - Returns the configured FastAPI app.

Nested endpoint function:

- `health() -> dict[str, str]`
  - Endpoint: `GET /health`
  - Tags: `health`
  - Response:
    ```json
    { "status": "ok" }
    ```

Nested exception handlers:

- `app_error_handler(_: Request, exc: AppError) -> JSONResponse`
  - Converts custom application exceptions into JSON error responses.
  - Response shape:
    ```json
    {
      "error": {
        "code": "...",
        "message": "...",
        "details": {}
      }
    }
    ```

- `validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse`
  - Returns status `422` when validation error location points to `resume`.
  - Returns status `400` for other request validation errors.
  - Uses error code `invalid_resume` for resume validation errors.
  - Uses error code `validation_error` otherwise.

## Endpoints

These endpoints exist when the app is created through `create_app()`.

### `GET /health`

- Defined in: `src/ats_resume_builder/api/app.py`
- Tags: `health`
- Purpose: health check.
- Response:
  ```json
  { "status": "ok" }
  ```

### `POST /v1/resumes/pdf`

- Defined in: `src/ats_resume_builder/api/routes.py`
- Router prefix: `/v1`
- Full path: `/v1/resumes/pdf`
- Tags: `resume-builder`
- Handler: `build_resume_pdf(...)`
- Request body model: `ResumeBuildRequest`
- Success response:
  - Status: `200`
  - Body: raw PDF bytes
  - Media type: `application/pdf`
  - Headers:
    - `Content-Disposition: attachment; filename="resume.pdf"`
    - `X-Resume-Id`
    - `X-AI-Optimized: true`
    - `X-Request-Id`
- Documented error responses:
  - `422`: invalid resume.
  - `502`: AI provider failure.
  - `503`: compilation failure.
  - `504`: compilation timeout.

Handler logic:

1. Generates a UUID request id.
2. Resolves `ResumeBuilderService` using FastAPI dependency injection.
3. Calls `service.build_pdf(payload, request_id=request_id)`.
4. Returns a binary `Response` with PDF bytes and PDF-related headers.

## API Dependency Wiring

### `src/ats_resume_builder/api/dependencies.py`

Functions:

- `get_resume_builder_service() -> ResumeBuilderService`
  - Cached with `functools.lru_cache`.
  - Loads `Settings` through `get_settings()`.
  - Creates an AI provider with `create_ai_provider(settings)`.
  - Creates `ResumeOptimizationWorkflow` with:
    - provider
    - `PromptManager`
    - `ATSRulesRepository`
    - settings
  - Creates and returns `ResumeBuilderService` with:
    - workflow
    - `LatexResumeRenderer`
    - `PDFCompiler(settings)`

## Configuration

### `src/ats_resume_builder/config/settings.py`

Types:

- `AIProviderName = Literal["gemini", "openai", "ollama", "local"]`

Classes:

- `Settings(BaseSettings)`
  - Reads environment variables from `.env`.
  - Uses env prefix `ATS_`.
  - Ignores extra env values.
  - Case-insensitive environment variable names.

Settings fields:

- `app_name: str = "ATS Resume Builder"`
- `environment: Literal["development", "production", "test"] = "development"`
- `log_level: str = "INFO"`
- `ai_provider: AIProviderName = "gemini"`
- `gemini_api_key: SecretStr | None = None`
- `gemini_model: str = "gemini-2.5-flash"`
- `gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta"`
- `ai_timeout_seconds: float = 30.0`
  - Must be greater than `0`.
- `ai_retry_limit: int = 2`
  - Must be between `0` and `5`.
- `prompt_version: str = "v1"`
- `ats_rules_version: str = "v1"`
- `compiler_path: str = "xelatex"`
- `compiler_timeout_seconds: float = 300.0`
  - Must be greater than `0`.
- `temporary_directory: Path = Path("/tmp/resume-generation")`

Functions:

- `get_settings() -> Settings`
  - Cached with `functools.lru_cache`.
  - Instantiates and returns `Settings`.

Important environment variables:

```text
ATS_APP_NAME
ATS_ENVIRONMENT
ATS_LOG_LEVEL
ATS_AI_PROVIDER
ATS_GEMINI_API_KEY
ATS_GEMINI_MODEL
ATS_GEMINI_BASE_URL
ATS_AI_TIMEOUT_SECONDS
ATS_AI_RETRY_LIMIT
ATS_PROMPT_VERSION
ATS_ATS_RULES_VERSION
ATS_COMPILER_PATH
ATS_COMPILER_TIMEOUT_SECONDS
ATS_TEMPORARY_DIRECTORY
```

## Resume Schemas And Validation

### `src/ats_resume_builder/schemas/resume.py`

Type aliases:

- `NonEmptyStr`
  - `str`, minimum length `1`, maximum length `500`.
- `ShortStr`
  - `str`, minimum length `1`, maximum length `120`.
- `LongStr`
  - `str`, minimum length `1`, maximum length `3000`.

Enums:

- `SkillLevel(StrEnum)`
  - `beginner`
  - `intermediate`
  - `advanced`
  - `expert`

- `LanguageLevel(StrEnum)`
  - `basic`
  - `conversational`
  - `professional`
  - `native`

Classes:

- `DateRange(BaseModel)`
  - Fields:
    - `start: date | None = None`
    - `end: date | None = None`
    - `current: bool = False`
  - Forbids extra fields.
  - Validator:
    - `validate_range() -> DateRange`
      - Rejects `end < start`.
      - Rejects `current=True` with an `end` date.

- `Link(BaseModel)`
  - Fields:
    - `label: ShortStr`
    - `url: HttpUrl`
  - Forbids extra fields.

- `PersonalInformation(BaseModel)`
  - Fields:
    - `full_name: ShortStr`
    - `email: EmailStr`
    - `phone: str | None`
    - `location: str | None`
    - `headline: str | None`
    - `links: list[Link]`
  - Phone validation:
    - Allows digits, spaces, parentheses, plus, dot, and dash.
    - Requires at least 7 digits.
    - Maximum phone string length is 32.

- `ExperienceItem(BaseModel)`
  - Fields:
    - `company: ShortStr`
    - `title: ShortStr`
    - `location: str | None`
    - `date_range: DateRange`
    - `highlights: list[LongStr]`
  - `highlights` requires at least 1 item and allows up to 12.

- `EducationItem(BaseModel)`
  - Fields:
    - `institution: ShortStr`
    - `degree: ShortStr`
    - `field_of_study: str | None`
    - `location: str | None`
    - `date_range: DateRange | None`
    - `description: LongStr | None`
    - `highlights: list[LongStr]`
  - `highlights` allows up to 8.

- `SkillItem(BaseModel)`
  - Fields:
    - `name: ShortStr`
    - `level: SkillLevel | None`
    - `keywords: list[ShortStr]`
  - `keywords` allows up to 20.

- `ProjectItem(BaseModel)`
  - Fields:
    - `name: ShortStr`
    - `description: LongStr`
    - `url: HttpUrl | None`
    - `highlights: list[LongStr]`
    - `technologies: list[ShortStr]`
  - `highlights` allows up to 10.
  - `technologies` allows up to 20.

- `CertificationItem(BaseModel)`
  - Fields:
    - `name: ShortStr`
    - `issuer: str | None`
    - `issued_on: date | None`
    - `url: HttpUrl | None`

- `LanguageItem(BaseModel)`
  - Fields:
    - `name: ShortStr`
    - `level: LanguageLevel | None`

- `Resume(BaseModel)`
  - Fields:
    - `personal_information: PersonalInformation`
    - `professional_summary: str | None`
    - `experience: list[ExperienceItem]`
    - `education: list[EducationItem]`
    - `skills: list[SkillItem]`
    - `projects: list[ProjectItem]`
    - `certifications: list[CertificationItem]`
    - `languages: list[LanguageItem]`
  - Forbids extra fields.
  - Validator:
    - `validate_content() -> Resume`
      - Requires at least one of:
        - `experience`
        - `education`
        - `skills`
        - `projects`

- `ResumeBuildRequest(BaseModel)`
  - Fields:
    - `resume_id: str`
      - JSON alias: `resumeId`
      - Minimum length `1`
      - Maximum length `120`
    - `resume: Resume`
  - Forbids extra fields.
  - Allows population by field name.

- `ResumeBuildResponseMetadata(BaseModel)`
  - Fields:
    - `resume_id: str`
    - `ai_optimized: bool`

## ATS Rules

### `src/ats_resume_builder/ats/rules.py`

Classes:

- `ATSRuleSet(BaseModel)`
  - Fields:
    - `version: str`
    - `rules: tuple[str, ...]`

- `ATSRulesRepository`
  - Purpose: isolates versioned ATS guidance from prompts and services.
  - Methods:
    - `get(version: str) -> ATSRuleSet`
      - Returns a rule set with these rules:
        - Use a single-column layout.
        - Prefer measurable impact statements.
        - Avoid tables, images, icons, graphics, and text boxes.
        - Use standard section names and plain text bullets.
        - Keep all output as structured JSON matching the schema.

## Prompt Management

### `src/ats_resume_builder/prompts/manager.py`

Classes:

- `PromptManager`
  - Purpose: builds provider prompts without coupling prompt text to services.
  - Methods:
    - `build_resume_optimization_prompt(resume, *, prompt_version, ats_rules) -> str`
      - Builds a prompt containing:
        - prompt version
        - ATS optimization instructions
        - instruction to return only valid JSON
        - ATS rules version
        - ATS rules
        - JSON schema from `Resume.model_json_schema()`
        - input resume JSON from `resume.model_dump_json()`

## AI Provider Layer

### `src/ats_resume_builder/providers/base.py`

Classes:

- `AIProvider(ABC)`
  - Abstract provider contract.
  - Attributes:
    - `name: str`
  - Abstract methods:
    - `generate_json(prompt: str, *, request_id: str) -> str`
      - Returns provider text expected to contain JSON.

### `src/ats_resume_builder/providers/factory.py`

Functions:

- `create_ai_provider(settings: Settings) -> AIProvider`
  - Returns `GeminiProvider(settings)` when `settings.ai_provider == "gemini"`.
  - Raises `AIProviderError` for unimplemented providers:
    - `openai`
    - `ollama`
    - `local`

### `src/ats_resume_builder/providers/gemini.py`

Classes:

- `GeminiProvider(AIProvider)`
  - Attributes:
    - `name = "gemini"`
    - `_retryable_status_codes = {429, 500, 502, 503, 504}`
  - Constructor:
    - `__init__(settings: Settings, client: httpx.AsyncClient | None = None)`
    - Stores settings and optional injected HTTP client.

Methods:

- `generate_json(prompt: str, *, request_id: str) -> str`
  - Requires `settings.gemini_api_key`.
  - Calls Gemini `generateContent`.
  - Sends API key in `x-goog-api-key` header.
  - Requests JSON response with:
    ```json
    { "generationConfig": { "responseMimeType": "application/json" } }
    ```
  - Uses retry logic through `_post_with_retries`.
  - Extracts text from:
    ```text
    candidates[0].content.parts[0].text
    ```
  - Raises `AIProviderError` when:
    - API key is missing.
    - HTTP request fails.
    - Gemini response does not contain expected JSON text.

- `_post_with_retries(client, endpoint, *, headers, payload, timeout) -> httpx.Response`
  - Performs POST request.
  - Retries retryable HTTP status codes.
  - Retries timeout and transport errors until retry limit is reached.
  - Uses exponential backoff via `_sleep_before_retry`.

- `_should_retry_status(status_code: int, attempt: int) -> bool`
  - Returns true when status is retryable and retry limit is not exceeded.

- `_sleep_before_retry(attempt: int) -> None`
  - Sleeps for `min(0.25 * (2 ** attempt), 2.0)` seconds.

## Optimization Workflow

### `src/ats_resume_builder/graph/workflow.py`

Types:

- `WorkflowState(TypedDict)`
  - Fields:
    - `request_id: str`
    - `resume: Resume`
    - `optimized_resume: Resume | None`
    - `retry_count: int`
    - `raw_ai_response: str | None`

Classes:

- `ResumeOptimizationWorkflow`
  - Dataclass with slots.
  - Fields:
    - `provider: AIProvider`
    - `prompt_manager: PromptManager`
    - `ats_rules_repository: ATSRulesRepository`
    - `settings: Settings`

Methods:

- `optimize(resume: Resume, *, request_id: str) -> tuple[Resume, int]`
  - Creates initial workflow state.
  - Tries to use LangGraph:
    - `StateGraph`
    - node: `optimize_resume`
    - edge to `END`
  - Falls back to direct `_optimize_node` execution when `langgraph` import fails.
  - Validates that `optimized_resume` is a `Resume`.
  - Returns optimized resume and retry count.
  - Raises `InvalidAIResponseError` if no valid resume is produced.

- `_optimize_node(state: WorkflowState) -> WorkflowState`
  - Gets ATS rules by `settings.ats_rules_version`.
  - Builds AI prompt with `PromptManager`.
  - Calls `provider.generate_json(...)`.
  - Repairs JSON with `repair_json(...)`.
  - Validates repaired JSON into `Resume`.
  - Retries repair/validation failures up to `settings.ai_retry_limit`.
  - Raises `InvalidAIResponseError` when AI response cannot be repaired or validated.

## Resume Builder Service

### `src/ats_resume_builder/services/resume_builder.py`

Classes:

- `ResumeBuilderService`
  - Constructor dependencies:
    - `ResumeOptimizationWorkflow`
    - `LatexResumeRenderer`
    - `PDFCompiler`
  - Maintains logger for the module.

Methods:

- `build_pdf(request: ResumeBuildRequest, *, request_id: str) -> bytes`
  - Optimizes resume through workflow.
  - Renders optimized resume to LaTeX.
  - Compiles LaTeX to PDF bytes.
  - Logs:
    - `resume_pdf_generated`
    - `request_id`
    - `resume_id`
    - `retry_count`
    - total duration in milliseconds
    - compilation duration in milliseconds
  - Returns PDF bytes.

## LaTeX Rendering

### `src/ats_resume_builder/renderer/latex_renderer.py`

Classes:

- `LatexResumeRenderer`
  - Uses Jinja2 template `resume.tex.j2`.
  - Default template directory:
    - `src/ats_resume_builder/templates`
  - Jinja configuration:
    - `FileSystemLoader`
    - autoescape disabled for strings
    - trim blocks
    - lstrip blocks
    - `StrictUndefined`

Methods:

- `render(resume: Resume) -> str`
  - Loads the template.
  - Builds context.
  - Renders LaTeX string.

- `_build_context(resume: Resume) -> dict[str, Any]`
  - Prepares and sanitizes resume data.
  - Extracts personal information.
  - Builds contact items.
  - Adds PDF metadata:
    - title
    - author

- `_prepare_resume_data(resume: Resume) -> dict[str, Any]`
  - Converts resume to Python data.
  - Sorts experience in reverse chronological order by start date.

- `_build_contact_items(personal: dict[str, Any]) -> list[dict[str, str]]`
  - Builds contact records for:
    - email
    - phone
    - location
    - links

- `_sanitize(value: Any) -> Any`
  - Escapes strings for LaTeX.
  - Converts enums to escaped enum values.
  - Formats dates.
  - Formats date ranges.
  - Recursively sanitizes dictionaries and lists.

- `_display_link_label(label: str) -> str`
  - Normalizes known labels:
    - `linkedin` -> `LinkedIn`
    - `github` -> `GitHub`
    - `portfolio` -> `Portfolio`
    - `website` -> `Portfolio`
    - `personalwebsite` -> `Portfolio`

- `_display_url(url: str) -> str`
  - Removes `https://`, `http://`, and trailing `/`.

- `_date_range_sort_key(item: dict[str, Any]) -> date`
  - Returns start date for sorting experience.
  - Returns `date.min` when no valid date is present.

- `_format_date_range(value: DateRange) -> str`
  - Formats start and end dates.
  - Uses `Present` when `current=True`.
  - Returns values like:
    - `Feb 2022 -- Present`
    - `Sep 2017 -- Jun 2020`

- `_format_date(value: date | None) -> str`
  - Formats dates as `%b %Y`.
  - Returns empty string for `None`.

### `src/ats_resume_builder/templates/resume.tex.j2`

Purpose:

- Jinja2 LaTeX resume template.
- Uses `article` document class.
- Uses packages including:
  - `geometry`
  - `titlesec`
  - `tabularx`
  - `xcolor`
  - `enumitem`
  - `fontawesome5`
  - `amsmath`
  - `hyperref`
  - `paracol`
  - `charter`
- Defines sections:
  - Header/contact
  - Professional Summary
  - Education
  - Projects
  - Work Experience
  - Technical Skills
  - Certifications
  - Languages
- Omits empty sections with Jinja conditionals.
- Uses Font Awesome icons for contact links.
- Uses `hyperref` links for URLs.

## PDF Compilation

### `src/ats_resume_builder/compiler/pdf_compiler.py`

Classes:

- `PDFCompiler`
  - Constructor:
    - `__init__(settings: Settings)`
    - Stores runtime settings.

Methods:

- `compile(latex: str, *, request_id: str) -> bytes`
  - Creates request-specific temporary directory:
    - `settings.temporary_directory / request_id`
  - Writes LaTeX to `resume.tex`.
  - Runs compiler command:
    ```text
    xelatex -interaction=nonstopmode -halt-on-error resume.tex
    ```
    using `settings.compiler_path`.
  - Captures stdout/stderr.
  - Enforces `settings.compiler_timeout_seconds`.
  - Reads and returns `resume.pdf` bytes.
  - Always deletes the request directory in `finally`.
  - Raises:
    - `PDFCompilationTimeoutError` on compiler timeout.
    - `CompilationError` when compiler executable is missing.
    - `CompilationError` when compiler exits non-zero or PDF is not produced.

## Utilities

### `src/ats_resume_builder/utils/json_repair.py`

Functions:

- `repair_json(raw: str) -> dict[str, Any]`
  - Lightly repairs common LLM JSON wrapper issues.
  - Removes Markdown JSON fences.
  - Extracts text between first `{` and last `}`.
  - Removes trailing commas before `}` or `]`.
  - Parses JSON.
  - Requires parsed result to be a JSON object.
  - Raises `ValueError` if parsed JSON is not an object.

### `src/ats_resume_builder/utils/latex.py`

Constants:

- `LATEX_ESCAPE_MAP`
  - Maps LaTeX special characters to escaped equivalents:
    - `\`
    - `&`
    - `%`
    - `$`
    - `#`
    - `_`
    - `{`
    - `}`
    - `~`
    - `^`

Functions:

- `escape_latex(value: object) -> str`
  - Converts `None` to empty string.
  - Converts value to string.
  - Escapes all characters found in `LATEX_ESCAPE_MAP`.

## Exceptions

### `src/ats_resume_builder/exceptions/errors.py`

Classes:

- `AppError(Exception)`
  - Base application exception with HTTP mapping.
  - Defaults:
    - `status_code = 500`
    - `code = "internal_error"`
  - Constructor:
    - `__init__(message: str, *, details: dict[str, object] | None = None)`
    - Stores:
      - `message`
      - `details`

- `InvalidResumeError(AppError)`
  - `status_code = 422`
  - `code = "invalid_resume"`

- `AIProviderError(AppError)`
  - `status_code = 502`
  - `code = "ai_provider_failure"`

- `InvalidAIResponseError(AppError)`
  - `status_code = 502`
  - `code = "invalid_ai_response"`

- `CompilationError(AppError)`
  - `status_code = 503`
  - `code = "compilation_failure"`

- `PDFCompilationTimeoutError(CompilationError)`
  - `status_code = 504`
  - `code = "compilation_timeout"`

### `src/ats_resume_builder/exceptions/__init__.py`

Re-exports:

- `AIProviderError`
- `AppError`
- `CompilationError`
- `InvalidAIResponseError`
- `InvalidResumeError`
- `PDFCompilationTimeoutError`

## Logging

### `src/ats_resume_builder/logging/setup.py`

Functions:

- `configure_logging(level: str) -> None`
  - Creates a stdout logging handler.
  - Uses `pythonjsonlogger.json.JsonFormatter`.
  - Log fields:
    - `asctime`
    - `levelname`
    - `name`
    - `message`
    - `request_id`
    - `resume_id`
  - Clears root logger handlers.
  - Adds JSON handler.
  - Sets root log level from `level.upper()`.

## Package Initializers

The following `__init__.py` files exist to mark packages and, in some cases, re-export symbols:

- `src/__init__.py`
- `src/ats_resume_builder/__init__.py`
- `src/ats_resume_builder/api/__init__.py`
- `src/ats_resume_builder/ats/__init__.py`
- `src/ats_resume_builder/compiler/__init__.py`
- `src/ats_resume_builder/config/__init__.py`
- `src/ats_resume_builder/exceptions/__init__.py`
- `src/ats_resume_builder/graph/__init__.py`
- `src/ats_resume_builder/logging/__init__.py`
- `src/ats_resume_builder/prompts/__init__.py`
- `src/ats_resume_builder/providers/__init__.py`
- `src/ats_resume_builder/renderer/__init__.py`
- `src/ats_resume_builder/schemas/__init__.py`
- `src/ats_resume_builder/services/__init__.py`
- `src/ats_resume_builder/utils/__init__.py`

Known re-exports:

- `providers/__init__.py`
  - `AIProvider`
  - `create_ai_provider`
  - `GeminiProvider`
- `exceptions/__init__.py`
  - re-exports all custom exception classes.

## Tests

### `tests/test_api.py`

Classes:

- `FakeResumeBuilderService`
  - Test double for `ResumeBuilderService`.
  - Methods:
    - `build_pdf(request, *, request_id) -> bytes`
      - Asserts `resume_id == "resume-123"`.
      - Asserts a request id exists.
      - Returns fake PDF bytes.

Functions:

- `test_build_resume_pdf_returns_binary_response()`
  - Creates FastAPI app with `create_app()`.
  - Overrides `get_resume_builder_service`.
  - Posts valid resume JSON to `/v1/resumes/pdf`.
  - Asserts:
    - status `200`
    - content type `application/pdf`
    - `x-resume-id`
    - `x-ai-optimized`
    - response bytes.

### `tests/test_compiler.py`

Functions:

- `test_compiler_cleans_request_directory_on_failure(tmp_path)`
  - Uses invalid compiler path.
  - Asserts `CompilationError`.
  - Asserts temporary request directory is deleted after failure.

### `tests/test_gemini_provider.py`

Functions:

- `test_gemini_provider_retries_transient_status_and_uses_header_key()`
  - Mocks Gemini with `httpx.MockTransport`.
  - First response: `503`.
  - Second response: `200`.
  - Asserts retry happened.
  - Asserts API key is sent in `x-goog-api-key` header, not URL.

- `test_gemini_provider_does_not_retry_non_transient_status()`
  - Mocks Gemini with `400`.
  - Asserts `AIProviderError`.
  - Asserts only one request was made.

### `tests/test_json_repair.py`

Functions:

- `test_repairs_markdown_fenced_json()`
  - Verifies fenced JSON with trailing comma is repaired.

- `test_extracts_json_object_from_text()`
  - Verifies JSON object can be extracted from surrounding text.

### `tests/test_latex_renderer.py`

Functions:

- `test_escape_latex_special_characters()`
  - Verifies LaTeX special character escaping.

- `test_renderer_escapes_resume_content()`
  - Verifies renderer escapes user-provided resume content.

- `test_renderer_omits_empty_sections_and_renders_contact_links()`
  - Verifies contact links render.
  - Verifies empty sections are omitted.

- `test_renderer_sorts_experience_reverse_chronologically()`
  - Verifies current/latest experience appears before older experience.
  - Verifies date range format.

- `test_renderer_supports_education_description()`
  - Verifies education description appears.
  - Verifies education date range format.

### `tests/test_validation.py`

Functions:

- `valid_payload() -> dict[str, Any]`
  - Returns a minimal valid payload for `ResumeBuildRequest`.

- `test_valid_resume_payload()`
  - Validates payload.
  - Asserts `resume_id` and email.

- `test_rejects_invalid_email()`
  - Mutates email to invalid value.
  - Expects Pydantic `ValidationError`.

- `test_rejects_empty_resume_body()`
  - Removes body content.
  - Expects validation error requiring at least one content section.

## Project Configuration Files

### `pyproject.toml`

Current content:

- Project name: `form-builder`
- Version: `0.1.0`
- Requires Python: `>=3.14`
- Runtime dependencies: empty list
- UV package mode enabled.
- Script:
  - `form-builder = "main:main"`
- Dev dependency group:
  - `ruff>=0.15.16`
  - `ty>=0.0.47`

Important note:

- Source code imports dependencies not declared in current `pyproject.toml`.
- Needed runtime packages based on imports include at least:
  - `fastapi`
  - `pydantic`
  - `pydantic-settings`
  - `httpx`
  - `jinja2`
  - `langgraph`
  - `python-json-logger`
  - `uvicorn`
  - `email-validator`

### `Makefile`

Targets:

- `help`
  - Prints documented make commands.
- `type-check`
  - Runs `uvx ty check`.
- `format`
  - Runs `uvx ruff format .`.
- `format-check`
  - Runs `uvx ruff format --check .`.
- `lint`
  - Runs `uvx ruff check .`.
- `lint-fix`
  - Runs `uvx ruff check --fix .`.
- `clean`
  - Removes cache/build artifacts matching:
    - `__pycache__`
    - `.mypy_cache`
    - `.ruff_cache`
    - `.pytest_cache`
    - `*.egg-info`
    - `.venv`

### `ruff.toml`

Lint selection:

- `I`
- `F401`

Per-file ignores:

- `__init__.py`
  - ignores `F401`

### `.gitignore`

Ignores:

- Python generated files:
  - `__pycache__/`
  - `*.py[oc]`
  - `build/`
  - `dist/`
  - `wheels/`
  - `*.egg-info`
  - `.pytest_cache/`
  - `.mypy_cache/`
  - `.ruff_cache/`
- Virtual environments:
  - `.venv`

### `README.md`

Current file is empty.

### `uv.lock`

UV lockfile for dependency resolution. Current contents should be treated as generated lock metadata.

## Untracked Runtime Files

Current untracked folder:

```text
apps/form-builder/tmp/
```

Files observed:

- `mock_db_files.json`
- `mock_db_jobs.json`
- `mock_db_matches.json`
- `mock_db_uploaded.json`
- `mock_db_users.json`

These are not used by the new `ats_resume_builder` PDF path. They appear to be runtime/mock database files from an older flow.

## End-To-End PDF Flow

When wired correctly through `create_app()`, the intended PDF generation flow is:

1. Client sends `POST /v1/resumes/pdf`.
2. FastAPI validates payload as `ResumeBuildRequest`.
3. `get_resume_builder_service()` constructs service dependencies.
4. `ResumeBuilderService.build_pdf()` starts.
5. `ResumeOptimizationWorkflow.optimize()` builds ATS prompt.
6. `GeminiProvider.generate_json()` calls Gemini and returns JSON text.
7. `repair_json()` strips wrappers/trailing commas and parses JSON.
8. Parsed JSON is validated as `Resume`.
9. `LatexResumeRenderer.render()` converts `Resume` to LaTeX using `resume.tex.j2`.
10. `PDFCompiler.compile()` writes `resume.tex`, invokes XeLaTeX, reads `resume.pdf`.
11. Temporary request directory is deleted.
12. API returns PDF bytes with PDF headers.

## Known Gaps In Current Branch State

- `src/main.py` does not currently expose the FastAPI app.
- `pyproject.toml` does not currently list runtime dependencies needed by the source code.
- `README.md` is empty.
- `.gitignore` does not ignore `tmp/`, so runtime/mock files show up as untracked.
- The default compiler is `xelatex`; the machine or deployment environment must have XeLaTeX installed or `ATS_COMPILER_PATH` must point to a valid executable.
- `GeminiProvider` requires `ATS_GEMINI_API_KEY` when `ATS_AI_PROVIDER=gemini`.

## Minimal Example Payload

```json
{
  "resumeId": "resume-123",
  "resume": {
    "personal_information": {
      "full_name": "Ada Lovelace",
      "email": "ada@example.com",
      "phone": "+1 (555) 123-4567",
      "location": "London, UK",
      "links": [
        {
          "label": "github",
          "url": "https://github.com/ada"
        }
      ]
    },
    "professional_summary": "Software engineer focused on reliable backend systems.",
    "skills": [
      {
        "name": "Python",
        "level": "expert",
        "keywords": ["FastAPI", "Pydantic", "Jinja2"]
      }
    ]
  }
}
```

