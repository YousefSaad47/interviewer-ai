# Interviewer.ai - Complete System Documentation & Reference Manual

Welcome to the comprehensive system documentation for **Interviewer.ai**. This document serves as the master reference manual detailing every database schema, API endpoint, page route, shared package, and core engineering flow across the entire platform.

---

## Table of Contents
1. [Monorepo Architecture Overview](#1-monorepo-architecture-overview)
2. [Database Schema (PostgreSQL via Prisma ORM)](#2-database-schema-postgresql-via-prisma-orm)
3. [Core Backend REST API (`apps/api`)](#3-core-backend-rest-api-appsapi)
4. [ATS & Resume Python Microservice (`apps/form-builder`)](#4-ats--resume-python-microservice-appsform-builder)
5. [Frontend Client Routes & Page Architecture (`apps/www`)](#5-frontend-client-routes--page-architecture-appswww)
6. [Core Technical Engineering Flows](#6-core-technical-engineering-flows)
7. [Environment Variables Reference](#7-environment-variables-reference)

---

## 1. Monorepo Architecture Overview

Interviewer.ai is structured as a high-performance **Turborepo monorepo** managed with **Bun** for rapid package management and compilation speed.

```
interviewer-ai/
├── apps/
│   ├── www/                  # Frontend Client (Next.js 16 App Router)
│   ├── api/                  # Core Backend REST API (Express.js + Prisma)
│   └── form-builder/         # ATS & Secure File Microservice (FastAPI + Python UV)
├── packages/
│   ├── kubb/                 # Kubb OpenAPI Client & TanStack Hooks Generator
│   └── typescript-config/    # Shared TS configuration packages
├── judge0/                   # Local isolated Code Execution Sandbox
└── scripts/                  # Project-wide setup and development tools
```

*   **Bun Runtime**: Powers the entire TypeScript environment, executing package scripts and serving the Express backend.
*   **Turborepo (`turbo.json`)**: Orchestrates parallel building, linting, formatting (via Biome), and type checking with caching.
*   **Docker Compose (`docker-compose.dev.yml`)**: Spins up the development database, cache instances, and local mock services:
    *   **PostgreSQL 18** (Main relational database)
    *   **Redis 8** (BullMQ job queues and caching)
    *   **pgAdmin** (Database GUI)
    *   **Mailpit** (SMTP developer email server)
    *   **Judge0 Sandbox** (Isolated containerized code compilation & runner)

---

## 2. Database Schema (PostgreSQL via Prisma ORM)

All relational models are defined in [schema.prisma](file:///d:/MINE/Software%20Engineering/Projects/HTI/interviewer-ai/apps/api/prisma/schema.prisma).

### 2.1 Enums

#### `UserRole`
Defines authorization privileges.
*   `USER`: Standard candidate practicing interviews/coding.
*   `ADMIN`: Manager of problems, reviews interviews/resumes, views platform analytics.
*   `SUPER_ADMIN`: Administrative manager who configures roles and manages system settings.

#### `UserStatus`
Defines account accessibility.
*   `ACTIVE`: Fully functional account.
*   `DISABLED`: Suspended account; invalidates active sessions upon trigger.

#### `InterviewCategory`
Defines categories for mock interviews.
*   `DATA_STRUCTURES`, `ALGORITHMS`, `SYSTEM_DESIGN`, `BEHAVIORAL`, `HR`, `FRONTEND`, `BACKEND`, `FULLSTACK`, `DATABASE`, `DEVOPS`, `MACHINE_LEARNING`.

#### `Difficulty`
Interview difficulty.
*   `EASY`, `MEDIUM`, `HARD`.

#### `InterviewStatus`
Mock interview session lifecycle state.
*   `IN_PROGRESS`: Currently streaming or awaiting finalization.
*   `COMPLETED`: Evaluation completed and feedback generated.
*   `ABANDONED`: Disconnected without sending final chat signals.

#### `ResumeStatus`
Resume builder lifecycle state.
*   `DRAFT`, `COMPLETE`, `ARCHIVED`.

#### `ProblemDifficulty`
Coding challenges difficulty.
*   `EASY`, `MEDIUM`, `HARD`.

#### `SubmissionStatus`
Code execution result status.
*   `PENDING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILATION_ERROR`.

---

### 2.2 Relational Models

#### `User`
Stores core authentication records and user metadata.
*   `id` (`Uuid`, Primary Key, Defaults to UUIDv4)
*   `name` (`String`)
*   `email` (`String`, Unique)
*   `emailVerified` (`Boolean`, default: `false`)
*   `image` (`String?`)
*   `role` (`UserRole`, default: `USER`)
*   `status` (`UserStatus`, default: `ACTIVE`)
*   `createdAt` (`Timestamptz`, defaults to current time)
*   `updatedAt` (`Timestamptz`, auto-updated)
*   *Relations*: `sessions` (`Session[]`), `accounts` (`Account[]`), `interviews` (`Interview[]`), `resumes` (`Resume[]`), `submissions` (`CodingSubmission[]`), `performance` (`PerformanceSnapshot[]`), `settings` (`UserSettings?`).

#### `UserSettings`
Stores goals and thresholds for users.
*   `id` (`Uuid`, Primary Key, Defaults to UUIDv4)
*   `interviewGoal` (`Int`, default: `0` weekly goal)
*   `problemGoal` (`Int`, default: `0` weekly goal)
*   `userId` (`Uuid`, Unique Foreign Key to `User`)
*   `createdAt`, `updatedAt` (`Timestamptz`)

#### `Session`
Stores active session tokens for the Better Auth backend.
*   `id` (`Uuid`, Primary Key)
*   `token` (`String`, Unique)
*   `ipAddress` (`String?`)
*   `userAgent` (`String?`)
*   `expiresAt` (`Timestamptz`)
*   `userId` (`Uuid`, Foreign Key to `User`)

#### `Account`
Stores social authentication providers and credentials.
*   `id` (`Uuid`, Primary Key)
*   `accountId` (`String`)
*   `providerId` (`String`)
*   `accessToken` / `refreshToken` / `idToken` (`String?`)
*   `accessTokenExpiresAt` / `refreshTokenExpiresAt` (`Timestamptz?`)
*   `scope` (`String?`)
*   `password` (`String?` - Hashed password for local credentials provider)
*   `userId` (`Uuid`, Foreign Key to `User`)

#### `Verification`
Handles OTP/Verification token lifecycles.
*   `id` (`Uuid`, Primary Key)
*   `identifier` (`String` - e.g., user email)
*   `value` (`String` - OTP code)
*   `expiresAt` (`Timestamptz`)

#### `Interview`
Represents an AI voice mock interview session.
*   `id` (`Uuid`, Primary Key)
*   `category` (`InterviewCategory`)
*   `difficulty` (`Difficulty`)
*   `status` (`InterviewStatus`, default: `IN_PROGRESS`)
*   `questionCount` (`Int`, default: `5`)
*   `startedAt` (`Timestamptz`, default: `now`)
*   `completedAt` (`Timestamptz?`)
*   `humeChatId` (`String?`, Unique - Hume EVI Chat ID reference)
*   `humeChatGroupId` (`String?` - Hume Chat Group ID)
*   `currentQuestion` (`Int`, default: `0`)
*   `userId` (`Uuid`, Foreign Key to `User`)
*   *Relations*: `questions` (`InterviewQuestion[]`), `answers` (`Answer[]`)

#### `Question`
Static pool of interview questions generated or stored for mock interviews.
*   `id` (`Uuid`, Primary Key)
*   `category` (`InterviewCategory`)
*   `difficulty` (`Difficulty`)
*   `text` (`String`)
*   `suggestedAnswer` (`String?`)
*   `isCoding` (`Boolean`, default: `false`)
*   `codingProblemId` (`Uuid?` - If linked to a coding workspace)

#### `InterviewQuestion`
Join table connecting interviews to their specific ordered question set.
*   `id` (`Uuid`, Primary Key)
*   `sortOrder` (`Int`)
*   `interviewId` (`Uuid`, Foreign Key to `Interview`)
*   `questionId` (`Uuid`, Foreign Key to `Question`)
*   `followUpText` (`String?` - Dynamic AI generated follow-up, if any)
*   *Unique Constraint*: `[interviewId, questionId]`

#### `Answer`
Saves user-transcribed speech answers for questions.
*   `id` (`Uuid`, Primary Key)
*   `transcript` (`String?`)
*   `audioUrl` (`String?` - S3 or cloud bucket location)
*   `durationMs` (`Int?`)
*   `interviewQuestionId` (`Uuid`, Foreign Key to `InterviewQuestion`)
*   `interviewId` (`Uuid`, Foreign Key to `Interview`)
*   `humeChatId` (`String?`)
*   `humeChatGroupId` (`String?`)
*   *Relations*: `feedback` (`AnswerFeedback[]`)

#### `AnswerFeedback`
Saves AI analytical scores, sentiment, emotional cues, and grading.
*   `id` (`Uuid`, Primary Key)
*   `idealAnswer` (`String?`)
*   `strengths` (`String[]`)
*   `improvements` (`String[]`)
*   `overallScore` (`Float?` - 0-100 scale)
*   `fillerWordCount` (`Int?`)
*   `fluencyScore` (`Float?` - verbal fluency rating)
*   `clarityScore` (`Float?` - speech clarity rating)
*   `confidenceScore` (`Float?` - confidence rating)
*   `emotionalTone` (`Json?` - Stores Hume expression analyzer output emotions)
*   `sentimentScore` (`Float?` - positive/negative sentiment index)
*   `detailLevel` (`String?` - short, verbose, appropriate)
*   `relevanceScore` (`Float?`)
*   `technicalAccuracy` (`Float?`)
*   `answerId` (`Uuid`, Foreign Key to `Answer`)

#### `PerformanceSnapshot`
Pre-aggregated daily metrics used to render historical dashboard analytics.
*   `id` (`Uuid`, Primary Key)
*   `snapshotDate` (`Date`, Unique constraint field)
*   `category` (`InterviewCategory`, Unique constraint field)
*   `avgConfidence`, `avgFluency`, `avgClarity`, `avgScore` (`Float?`)
*   `totalAnswered` (`Int?`)
*   `timeSpentSec` (`Int?`)
*   `recommendation` (`String?` - AI generated recommendation based on trends)
*   `userId` (`Uuid`, Foreign Key to `User`, Unique constraint field)
*   *Unique Constraint*: `[userId, snapshotDate, category]`

#### `Resume`
Stores generated resumes from the CV builder.
*   `id` (`Uuid`, Primary Key)
*   `title` (`String`)
*   `status` (`ResumeStatus`, default: `DRAFT`)
*   `content` (`Json` - Contains resume nodes: education, experience, skills, projects)
*   `atsScore` (`Float?`)
*   `grammarScore` (`Float?`)
*   `suggestions` (`String[]`)
*   `userId` (`Uuid`, Foreign Key to `User`)
*   *Relations*: `matches` (`ResumeMatch[]`)

#### `JobDescription`
Job descriptions pasted by users to check compatibility with their resumes.
*   `id` (`Uuid`, Primary Key)
*   `title` (`String`)
*   `company` (`String`)
*   `rawText` (`String`)
*   `keywords` (`String[]` - Extracted ATS keywords)

#### `ResumeMatch`
Join table showing result of matching a resume to a job description.
*   `id` (`Uuid`, Primary Key)
*   `matchPct` (`Float` - ATS Match percentage, 0-100)
*   `matchedKeywords` (`String[]`)
*   `missingKeywords` (`String[]`)
*   `tailoredResume` (`Json?` - AI updated resume content with missing keywords)
*   `resumeId` (`Uuid`, Foreign Key to `Resume`)
*   `jobDescriptionId` (`Uuid`, Foreign Key to `JobDescription`)
*   *Unique Constraint*: `[resumeId, jobDescriptionId]`

#### `CodingProblem`
Algorithmic programming challenges (LeetCode style).
*   `id` (`Uuid`, Primary Key)
*   `title` (`String`)
*   `slug` (`String`, Unique - URL optimized name)
*   `difficulty` (`ProblemDifficulty`, default: `EASY`)
*   `description` (`String` - Markdown content)
*   `constraints` (`String?`)
*   `examples` (`Json` - [{input, output, explanation}])
*   `starterCode` (`Json` - starter templates for different languages: javascript, python, c++, etc.)
*   `topics`, `companies` (`String[]`)
*   `hint` (`String?`)
*   `isPremium` (`Boolean`, default: `false`)
*   `timeLimitMs` (`Int`, default: `2000`)
*   `memoryLimitKb` (`Int`, default: `256000`)
*   `logicWeight`, `namingWeight`, `efficiencyWeight`, `bestPracticesWeight` (`Float` - Sum to 1.0)
*   *Relations*: `testCases` (`TestCase[]`), `submissions` (`CodingSubmission[]`)

#### `TestCase`
Test cases linked to coding problems.
*   `id` (`Uuid`, Primary Key)
*   `input` (`String`)
*   `output` (`String`)
*   `isHidden` (`Boolean`, default: `false` - not visible to user in code playground)
*   `sortOrder` (`Int`, default: `0`)
*   `problemId` (`Uuid`, Foreign Key to `CodingProblem`)

#### `CodingSubmission`
Code submissions made by candidates.
*   `id` (`Uuid`, Primary Key)
*   `code` (`String`)
*   `language` (`String`, default: `javascript`)
*   `status` (`SubmissionStatus`)
*   `astHash` (`String?` - Abstract Syntax Tree hash for logic caching)
*   `judge0Token` (`String?`, Unique - Async execution verification token)
*   `logicScore`, `namingScore`, `efficiencyScore`, `bestPracticesScore` (`Float?` - 0-100 values)
*   `aiFeedback` (`String?` - AI review comments)
*   `executionTimeMs` / `memoryUsedKb` (`Int?`)
*   `problemId` (`Uuid`, Foreign Key to `CodingProblem`)
*   `userId` (`Uuid`, Foreign Key to `User`)
*   *Relations*: `results` (`CodingSubmissionResult[]`)

#### `CodingSubmissionResult`
Individual test case execution results for a submission.
*   `id` (`Uuid`, Primary Key)
*   `passed` (`Boolean`)
*   `output` (`String?`)
*   `error` (`String?`)
*   `submissionId` (`Uuid`, Foreign Key to `CodingSubmission`)
*   `testCaseId` (`Uuid`, Foreign Key to `TestCase`)
*   *Unique Constraint*: `[submissionId, testCaseId]`

---

## 3. Core Backend REST API (`apps/api`)

Built using **Express.js** running in the Bun environment. Registered routes use **Zod** parsing schemas, generating OpenAPI definitions automatically on boot.

### 3.1 Authentication & Middleware

#### Better Auth Endpoints
*   **Path Prefix**: `/api/auth`
*   Includes OAuth login handling, local credentials registration (`/signup`), login (`/signin`), email verification verification, password resets, and session tokens.
*   `authMiddleware`: Authenticates user requests via HTTP cookies or Bearer tokens. Appends `req.user` context.
*   `adminRoleMiddleware(roles)`: Rejects request if the authenticated user role is not within the acceptable roles array.

---

### 3.2 Candidate Modules (Auth Required)

#### Resumes Module
*   `GET /api/resumes/me`:
    *   *Purpose*: Get the authenticated user's current draft resume.
    *   *Response*: `Resume` JSON payload or `null` if empty.
*   `PUT /api/resumes/me`:
    *   *Purpose*: Creates or updates the latest resume for the user.
    *   *Body*: JSON payload validation of experience list, educations, skills, and projects.

#### Mock Interviews Module
*   `POST /api/interview/start`:
    *   *Purpose*: Starts an interview process. Fetches/generates random questions for the category and difficulty. Generates and returns a Hume access token and active Hume voice config ID.
    *   *Body*: `{ category: InterviewCategory, difficulty: Difficulty, questionCount: number }`
    *   *Response*: `{ interviewId, accessToken, configId, currentQuestion, questionCount }`
*   `POST /api/interview/:id/link-chat`:
    *   *Purpose*: Connects a frontend WebSockets Hume voice chat session with the created DB record.
    *   *Body*: `{ chatId: string, chatGroupId: string }`
*   `POST /api/interview/:id/finalize`:
    *   *Purpose*: Finalizes the voice session, fetches transcripts from the Hume REST API, calculates voice/emotional analytics, and triggers asynchronous AI evaluation queues (BullMQ).
    *   *Body*: `{ chatId: string, chatGroupId: string }`
*   `GET /api/interview/:id/progress`:
    *   *Purpose*: Retrieves current setup progress, question titles, and answer counts.

#### Coding Practice Module
*   `GET /api/problems`:
    *   *Purpose*: Lists coding problems (paginated).
    *   *Query Parameters*: `page`, `limit`, `difficulty`, `search`.
*   `GET /api/problems/:slug`:
    *   *Purpose*: Retrieves problem details including constraints, starter code, and visible examples.
*   `POST /api/coding/run`:
    *   *Purpose*: Executes custom starter code against sample inputs in the Judge0 sandbox (rate-limited).
    *   *Body*: `{ problemId, code, language }`
*   `POST /api/coding/submissions`:
    *   *Purpose*: Submits code for official evaluation. Computes AST hash to check for cache. On miss, runs tests asynchronously in Judge0 and scores dimensions using LLMs.
    *   *Body*: `{ problemId, code, language }`
*   `GET /api/coding/submissions`:
    *   *Purpose*: Retrieves a list of user submissions.
*   `GET /api/coding/submissions/:id`:
    *   *Purpose*: Retrieves submission execution stats, compiler errors, detailed test runs, and AI feedback.

#### Dashboard Module
*   `GET /api/dashboard/stats`:
    *   *Purpose*: Retrieves general candidate statistics (interviews, problems, resumes).
*   `GET /api/dashboard/recent`:
    *   *Purpose*: Retrieves recent activities feed.
*   `GET /api/dashboard/skills`:
    *   *Purpose*: Returns category-wise skill score averages.
*   `GET /api/dashboard/goals`:
    *   *Purpose*: Checks current weekly goal progression.

---

### 3.3 Admin Modules (Role Validation Required)

#### Admin User Management
*   `GET /api/admin/users`:
    *   *Purpose*: Paginated user listing. Shows user registrations and total activity counts (requires `ADMIN` or `SUPER_ADMIN`).
*   `GET /api/admin/users/:id`:
    *   *Purpose*: Detailed user dashboard, includes login history and bounded activity logs.
*   `PATCH /api/admin/users/:id/status`:
    *   *Purpose*: Enables/disables target user. If disabled, current sessions are invalidated immediately (requires `SUPER_ADMIN`).

#### Admin Interview Review
*   `GET /api/admin/interviews`:
    *   *Purpose*: Lists all platform mock interview sessions, searchable by candidate email, categories, and dates (requires `ADMIN` or `SUPER_ADMIN`).
*   `GET /api/admin/interviews/:id`:
    *   *Purpose*: Evaluates user transcripts, individual questions, emotional tones, and detailed feedback metrics.

#### Admin Coding Management
*   `POST /api/admin/coding/problems`:
    *   *Purpose*: Atomically creates a new coding problem along with its test cases (requires `ADMIN` or `SUPER_ADMIN`).
*   `GET /api/admin/coding/submissions`:
    *   *Purpose*: Lists coding submissions on the platform.
*   `GET /api/admin/coding/submissions/:id`:
    *   *Purpose*: Details code snippet, compiler performance, and scores.

#### Admin Resume Audit
*   `GET /api/admin/resumes`:
    *   *Purpose*: Lists resumes.
*   `GET /api/admin/resumes/:id`:
    *   *Purpose*: Previews resume data, calculated ATS matching levels, and suggestions.

#### Admin System Control
*   `GET /api/admin/analytics`:
    *   *Purpose*: General platform usage analytics buckets (7d, 30d, 90d ranges).
*   `GET /api/admin/admins`:
    *   *Purpose*: Lists all administrator profiles (requires `SUPER_ADMIN`).
*   `POST /api/admin/admins`:
    *   *Purpose*: Promotes standard users to administrative roles.
*   `PATCH /api/admin/admins/:id`:
    *   *Purpose*: Modifies roles/permissions.
*   `DELETE /api/admin/admins/:id`:
    *   *Purpose*: Revokes administrative access, resetting role to `USER`.

---

### 3.4 Integration & Event Handlers
*   `POST /api/hume/webhook`:
    *   *Purpose*: Receives asynchronous event hooks from Hume AI.
    *   *Security*: Checks signature using HMAC (`x-hume-ai-webhook-signature`).
    *   *Handled Events*: `chat_started` (initializes links), `chat_ended` (calls finalization queue), `tool_call`.

---

## 4. ATS & Resume Python Microservice (`apps/form-builder`)

Managed via Python **FastAPI** using **UV**. Serves as a specialized utility for heavy data parsing, PDF rendering, file system cryptography, and local storage management.

### 4.1 System Modules & Mock Storage
The service uses local mock database JSON nodes (`mock_db_*.json`) located in the `/tmp` path (designed to mimic database collection records):
*   `RESUMES` (Generated PDF resume histories)
*   `UPLOADED_RESUMES` (PDF parsing outputs)
*   `JOB_DESCRIPTIONS` (Keyword schemas for jobs)
*   `RESUME_MATCHES` (Job match score states)
*   `SECURE_FILES` (File metadata for uploaded payloads)
*   `USERS` (Local administrative credentials)

---

### 4.2 Microservice Endpoints

#### Resume Builder (Flow A)
*   `POST /resume/generate`:
    *   *Purpose*: Accepts resume nodes, formats them using templates, compiles to PDF, and returns file download routes.
    *   *Request*: `ResumeRequest` model (contact, work, education, projects, skills).
    *   *Response*: `{ status: "success", data: { resume_id, download_url, markdown } }`
*   `GET /resume/{resume_id}/download`:
    *   *Purpose*: Streams generated PDF back to the client.

#### Resume Analyzer & Parser (Flow B)
*   `POST /resume/upload`:
    *   *Purpose*: Accepts resume PDF files, extracts readable text, parses contact/education/skills/experience keywords using lightweight parsing logic, encrypts the file at rest, and saves the parsed details.
    *   *Request*: `UploadFile` (multipart/form-data)
    *   *Response*: Parsed Resume payload.
*   `GET /resume/upload`:
    *   *Purpose*: Lists all previously parsed and stored files.
*   `GET /resume/upload/{resume_id}`:
    *   *Purpose*: Retrieves parsed fields.

#### ATS Matcher (Flow C)
*   `POST /ats/match`:
    *   *Purpose*: Matches parsed resume details with a job description. Extracts keywords from raw job texts if not present, calculates match ratios, identifies keyword gaps, and creates tailored CV suggestions using the AI tailoring service.
    *   *Query Params*: `resume_id`, `job_id`.
    *   *Response*: Matched and missing keywords, match percentage, and optimized resume.
*   `GET /ats/matches/{resume_id}`:
    *   *Purpose*: Lists all matches for a specific resume.
*   `GET /ats/match/{match_id}`:
    *   *Purpose*: Gets specific matching results.
*   `POST /ats/re-match/{match_id}`:
    *   *Purpose*: Re-runs match analysis.

#### Secure Files Manager (Flow D - GDPR Compliant)
*   `POST /files/upload`:
    *   *Purpose*: Encrypts uploads using AES-256 and saves them at rest. Sets expiry time based on TTL.
    *   *Request*: `UploadFile`, `ttl_seconds` query (defaults to 7 days).
*   `GET /files/{file_id}`:
    *   *Purpose*: Decrypts and streams file. Fails if soft-deleted or expired.
*   `DELETE /files/{file_id}`:
    *   *Purpose*:
        *   Standard delete: Soft deletes (marks `deleted: true`) for GDPR compliance.
        *   `permanent=true`: Hard deletes file from local disk.
*   `POST /files/cleanup`:
    *   *Purpose*: Background job running on cron that hard-deletes files that have exceeded their TTL.
*   `GET /files/{file_id}/metadata`:
    *   *Purpose*: Retrieves metadata without decrypting file contents.

#### Jobs Database
*   `POST /jobs/`, `GET /jobs/`, `GET /jobs/{id}`, `PUT /jobs/{id}`, `DELETE /jobs/{id}`:
    *   *Purpose*: Standard CRUD operations for job descriptions used during matching.

---

## 5. Frontend Client Routes & Page Architecture (`apps/www`)

Built on **Next.js 16** with React 19, Tailwind CSS 4, and Framer Motion. Pages are organized using the Next.js App Router:

```
apps/www/src/app/
├── (auth)/                    # Authentication Route Group
│   ├── signin/page.tsx        # Sign-in page
│   ├── signup/page.tsx        # Registration page
│   ├── forgot-password/       # Request password recovery link
│   ├── reset-password/        # Enter new password
│   └── verify-code/           # Verification page (OTP)
├── dashboard/
│   └── page.tsx               # Candidate core metrics and activity dashboard
├── interview/
│   ├── setup/page.tsx         # Category, Difficulty, & Question setup
│   ├── technical/page.tsx     # Voice mock interview room (Hume EVI integration)
│   └── [id]/
│       └── results/page.tsx   # Detailed scores, emotional charts, & transcripts
├── problems/
│   ├── page.tsx               # Coding practice directory (LeetCode list)
│   └── [slug]/page.tsx        # Monaco Editor workspace & test case runner
├── resume-builder/
│   └── page.tsx               # Interactive CV form builder & ATS matching tool
├── settings/
│   ├── page.tsx               # Core settings routing
│   ├── profile/page.tsx       # User profile details
│   ├── interview/page.tsx     # Custom goals and settings
│   ├── notifications/page.tsx # Alerts configurations
│   └── privacy/page.tsx       # Data deletion & export features
└── admin/
    ├── page.tsx               # Admin analytics & platform stats overview
    ├── users/page.tsx         # User management grid (suspensions & roles)
    ├── interviews/page.tsx    # Mock interview archives and auditor
    └── coding-practice/
        └── problems/
            └── new/page.tsx   # Create programming problems with test cases
```

### 5.1 Component Structure (Feature-driven)
The UI logic is modularized inside `/src/features` folder:
*   `interview`: Controls setup pages, EVI WebSockets hook wrappers (`useTechnicalInterviewSession`), voice volume visualizers, and transcript feeds.
*   `problems`: Handles Monaco Editor state, test execution outputs, and performance metrics.
*   `resume-builder`: Renders the multi-step forms, live ATS optimization panels, and generated PDF preview pages.
*   `dashboard`: Renders charts (Verbal skills, confidence trends) using Lucide and custom SVG shapes.

---

## 6. Core Technical Engineering Flows

### 6.1 Flow A: Live Voice Empathic Mock Interview

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate
    participant FE as Frontend Client (apps/www)
    participant BE as Express API (apps/api)
    participant Hume as Hume AI (EVI v3)
    participant Queue as Redis Queue (evaluate-answer)
    participant AI as Vercel AI SDK (Gemini)

    Candidate->>FE: Select Category, Difficulty & Start
    FE->>BE: POST /api/interview/start
    BE->>BE: Create Interview & select Questions
    BE->>Hume: Request token & Config (Ava voice)
    BE-->>FE: Return interviewId, Token, configId
    FE->>Hume: Connect WebSocket with configId
    Hume-->>FE: Stream Chat Metadata (chatId, chatGroupId)
    FE->>BE: POST /api/interview/:id/link-chat
    BE->>BE: Link chatId to Interview record
    
    Note over Candidate, Hume: Live Audio conversation starts.<br/>Hume measures prosody, sentiment, and voice features.

    Candidate->>FE: Disconnect / Finish Interview
    FE->>Hume: Close WebSocket Connection
    FE->>BE: POST /api/interview/:id/finalize
    BE->>Hume: GET List Chat Events (chatId)
    Hume-->>BE: Return speech events, emotional scores
    BE->>BE: Save transcripts as Answer records
    BE->>Queue: Push Answer IDs to evaluation queue
    BE-->>FE: Finished (Redirect to results)
    
    Note over Queue, AI: Worker evaluates answers asynchronously
    Queue->>AI: Compare transcripts with Suggested answers
    AI-->>Queue: Return score, strengths, improvements
    Queue->>BE: Save AnswerFeedback (scores, tone, relevance)
    BE->>BE: Mark Interview status as COMPLETED
```

---

### 6.2 Flow B: Coding Sandbox Execution & AST Caching

```mermaid
graph TD
    A[Candidate submits code in IDE] --> B[Generate MD5 logic hash using Abstract Syntax Tree AST]
    B --> C{Check AST Hash in Database}
    C -- Cache Hit --> D[Retrieve existing submission evaluation scores instantly]
    C -- Cache Miss --> E[Send Code to Judge0 Sandbox Sandbox]
    E --> F[Execute tests in isolated container]
    F --> G{All test cases pass?}
    G -- No --> H[Mark status WRONG_ANSWER / RUNTIME_ERROR / COMPILATION_ERROR]
    G -- Yes --> I[Trigger Vercel AI SDK code review worker]
    I --> J[Analyze code efficiency, naming style, and best practices]
    J --> K[Combine sandbox and AI outputs, compute final scores]
    K --> L[Save CodingSubmission record & return results]
```

---

### 6.3 Flow C: Resume ATS Matching & AI Optimization

```mermaid
graph TD
    A[Upload resume PDF or fill CV form] --> B[FastAPI: Parse PDF and extract raw text]
    B --> C[Analyze details: projects, skills, history]
    C --> D[Retrieve targeted Job Description Keywords]
    D --> E[FastAPI ATS Engine: Compare text strings with job keywords]
    E --> F[Identify Matched and Missing Keywords]
    F --> G[Run LLM Optimization service to suggest revisions]
    G --> H[Render optimized resume PDF and return download paths]
```

---

## 7. Environment Variables Reference

### 7.1 Backend API (`apps/api/.env`)
```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Relational Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/interviewer_ai?schema=public"

# Redis Cache & Queue
REDIS_URL="redis://localhost:6379"

# Hume AI Integration
HUME_API_KEY="hume_api_key_here"
HUME_SECRET_KEY="hume_secret_key_here"
HUME_WEBHOOK_URL="http://localhost:4000/api/hume/webhook"
HUME_WEBHOOK_SIGNING_KEY="hume_webhook_signing_key"

# Vercel AI SDK Providers
GEMINI_API_KEY="gemini_api_key_here"
OLLAMA_BASE_URL="http://localhost:11434"

# Better Auth Keys
BETTER_AUTH_SECRET="auth_secret_key"
BETTER_AUTH_URL="http://localhost:4000"

# Email SMTP (Mailpit)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_USER=""
SMTP_PASS=""
```

### 7.2 Python Microservice (`apps/form-builder/.env`)
```bash
APP_NAME="Interviewer.ai Form Builder"
APP_VERSION="1.0.0"
PORT=8000

# File Storage Configuration
TMP_DIR="tmp"
FILE_ENCRYPTION_KEY="32_byte_base64_encoded_encryption_key"

# LLM Orchestrator
LLM_PROVIDER="google" # google | ollama
GEMINI_API_KEY="gemini_api_key_here"
OLLAMA_HOST="http://localhost:11434"
```

### 7.3 Frontend Client (`apps/www/.env`)
```bash
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_FORM_BUILDER_URL="http://localhost:8000"
```

---
*Interviewer.ai System Reference Guide.*
