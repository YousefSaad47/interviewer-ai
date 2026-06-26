# Admin Dashboard Backend Audit

This report audits the current Prisma schema, implemented backend endpoints, and the completed Admin Dashboard UI.

Scope is limited to the current simple Admin Dashboard modules:

- Dashboard Overview
- Users
- Mock Interviews
- Coding Practice
- Resume Builder / Resume Analyzer
- Analytics
- Admin Management

Excluded by request: plans, subscriptions, payments, basic settings, question bank, support tickets, complaints, and replying to users.

## 1. Current Schema Summary

### User

Stores application users with `id`, `name`, `email`, `emailVerified`, optional `image`, relations to sessions/accounts/interviews/resumes/submissions/performance/settings, and timestamps.

Admin pages: Dashboard Overview, Users, Mock Interviews, Coding Practice, Resume Builder, Analytics, Admin Management.

Current support: enough for user listing identity, latest users, and joining user-owned activity. Missing admin-facing `role` and `status` fields for Admin Management and user activate/deactivate.

### Session

Stores auth sessions with `token`, `ipAddress`, `userAgent`, `expiresAt`, `userId`, and timestamps.

Admin pages: Users, Admin Management.

Current support: enough to derive latest login approximately from latest session `createdAt` or `updatedAt`. Sensitive `token` must not be exposed. No explicit `lastLoginAt` field, but not required for MVP if derived.

### Account

Stores auth provider accounts and credentials/tokens: provider IDs, access/refresh/id tokens, token expiry, scope, optional password, and user relation.

Admin pages: Users only indirectly.

Current support: useful for provider/account metadata if needed, but Admin Dashboard should not expose tokens or password fields. Not needed for MVP list/detail except maybe provider summary.

### Interview

Stores interview sessions with `category`, `difficulty`, `status`, `questionCount`, `startedAt`, `completedAt`, Hume chat IDs, `currentQuestion`, user relation, questions, answers, and timestamps.

Admin pages: Dashboard Overview, Mock Interviews, Analytics, Users.

Current support: mostly enough for list/filter/detail, status, duration, category/difficulty, user joins, latest sessions, and activity over time. It does not store a denormalized overall score, but this can be computed from `AnswerFeedback.overallScore`.

### InterviewQuestion

Join model between `Interview` and `Question`, with `sortOrder`, optional `followUpText`, answers, and timestamps.

Admin pages: Mock Interviews.

Current support: enough to show session question order and details. Admin UI does not currently need question bank management.

### Answer

Stores interview answers with optional `transcript`, `audioUrl`, `durationMs`, interview/question relations, Hume chat IDs, feedback, and timestamps.

Admin pages: Mock Interviews.

Current support: enough for transcript preview and answer-level detail. Full transcript should only be exposed on details, not list rows.

### AnswerFeedback

Stores AI feedback for answers: `idealAnswer`, strengths, improvements, `overallScore`, filler count, fluency, clarity, confidence, emotional tone, sentiment, detail level, relevance, and technical accuracy.

Admin pages: Mock Interviews, Analytics, Users.

Current support: enough for overall score, communication/clarity/fluency, confidence, technical/relevance scoring, and feedback. No schema change required for MVP.

### PerformanceSnapshot

Stores per-user daily/category performance aggregates: average confidence, fluency, clarity, score, total answered, time spent, recommendation, and user relation.

Admin pages: Analytics, Users.

Current support: useful for trend analytics, but currently user-scoped. Enough schema for some analytics if populated. Not required for the first admin MVP if analytics are computed directly from source tables.

### Resume

Stores resumes with title, `ResumeStatus`, JSON content, ATS score, grammar score, suggestions, user relation, matches, and timestamps.

Admin pages: Dashboard Overview, Resume Builder, Analytics, Users.

Current support: enough for resume list, details, status, ATS score, suggestions, user joins, and usage over time. Full `content` should only be returned on detail endpoints.

### ResumeMatch

Stores resume-to-job-description match percentage, matched/missing keywords, optional tailored resume, relations, and timestamps.

Admin pages: Resume Builder.

Current support: enough for match breakdowns and ATS-related details if admin details need them.

### JobDescription

Stores job descriptions with title, company, raw text, keywords, resume matches, and timestamps.

Admin pages: Resume Builder.

Current support: enough for resume match context. Not needed for basic list rows.

### CodingProblem

Stores coding problems with title, slug, difficulty, description, constraints, examples, starter code, limits, scoring weights, test cases, submissions, and timestamps.

Admin pages: Coding Practice, Analytics.

Current support: enough to join submissions to problem titles/difficulty and compute weighted scores. Admin UI does not include question/problem bank management, so no admin CRUD is needed for MVP.

### TestCase

Stores coding test cases with input/output, hidden flag, sort order, problem relation, results, and timestamps.

Admin pages: Coding Practice.

Current support: enough for submission result details. Hidden test case inputs/outputs should be restricted in admin responses unless explicitly needed.

### CodingSubmission

Stores user submissions with code, language, status, AST hash, Judge0 token, scoring dimensions, AI feedback, execution time, memory, problem/user relations, results, and timestamps.

Admin pages: Dashboard Overview, Coding Practice, Analytics, Users.

Current support: enough for submission list/detail, status, language, score dimensions, AI feedback, user/problem joins, and trends. No denormalized single score, but it can be computed from scoring fields and problem weights.

### CodingSubmissionResult

Stores per-test-case result with passed flag, output/error, submission/test case relations, and timestamps.

Admin pages: Coding Practice.

Current support: enough for detailed execution results.

## 2. Existing Endpoints Summary

Backend controllers are mounted under `/api/{controller.path}`. Auth is handled by Better Auth under `/api/auth/{*splat}`. The Admin Dashboard currently uses local fixture data from `apps/www/src/features/admin/data/admin-dashboard-data.ts`; no Admin Dashboard API client exists.

| Method | Endpoint | Purpose | Related Admin Page | Status |
| ------ | -------- | ------- | ------------------ | ------ |
| ALL | `/api/auth/{*splat}` | Better Auth auth/session/email/password/social routes | Admin Management, Users | Partially Ready |
| POST | `/api/hume/webhook` | Receives Hume chat events and finalizes/updates interview data | Mock Interviews | Not Admin-Suitable |
| GET | `/api/openapi.json` | OpenAPI document | None | Not Admin-Suitable |
| GET | `/api/docs` | Swagger UI | None | Not Admin-Suitable |
| GET | `/api/admin/queues` | Bull Board queue UI in development only | None | Not Admin-Suitable |
| POST | `/api/sample` | Sample endpoint | None | Not Admin-Suitable |
| GET | `/api/dashboard/stats` | Current user's completed interviews, average score, practice time, problems solved | Dashboard Overview | Exists, but needs admin-specific version. |
| GET | `/api/dashboard/recent` | Current user's recent interviews/submissions | Dashboard Overview | Exists, but needs admin-specific version. |
| GET | `/api/dashboard/skills` | Current user's interview category skill summary | Analytics | Exists, but needs admin-specific version. |
| GET | `/api/dashboard/goals` | Current user's weekly goals | None | Not Admin-Suitable |
| POST | `/api/interview/start` | Starts authenticated user's interview | Mock Interviews | Not Admin-Suitable |
| POST | `/api/interview/{id}/finalize` | Finalizes authenticated user's interview | Mock Interviews | Not Admin-Suitable |
| POST | `/api/interview/{id}/link-chat` | Links authenticated user's interview to Hume chat | Mock Interviews | Not Admin-Suitable |
| GET | `/api/interview/{id}/progress` | Gets authenticated user's interview progress | Mock Interviews | Not Admin-Suitable |
| POST | `/api/coding/submissions` | Creates authenticated user's coding submission | Coding Practice | Not Admin-Suitable |
| POST | `/api/coding/run` | Runs arbitrary code for authenticated user | Coding Practice | Not Admin-Suitable |
| GET | `/api/coding/submissions` | Lists authenticated user's own submissions | Coding Practice | Exists, but needs admin-specific version. |
| GET | `/api/coding/submissions/{id}` | Gets authenticated user's own submission detail | Coding Practice | Exists, but needs admin-specific version. |
| GET | `/api/problems` | Public/user-facing coding problem list | Coding Practice | Partially Ready |
| GET | `/api/problems/{slug}` | Public/user-facing coding problem detail | Coding Practice | Partially Ready |
| GET | `/api/admin/overview` | Admin overview totals/latest records | Dashboard Overview | Missing |
| GET | `/api/admin/users` | Admin user list/search/filter | Users | Missing |
| GET | `/api/admin/users/{id}` | Admin user detail/activity summary | Users | Missing |
| PATCH | `/api/admin/users/{id}` | Admin user status/profile actions | Users | Missing |
| DELETE | `/api/admin/users/{id}` | Admin user delete/deactivate action | Users | Missing |
| GET | `/api/admin/interviews` | Admin interview list/filter | Mock Interviews | Missing |
| GET | `/api/admin/interviews/{id}` | Admin interview detail, scores, transcript preview | Mock Interviews | Missing |
| GET | `/api/admin/coding/submissions` | Admin coding submission list/filter | Coding Practice | Missing |
| GET | `/api/admin/coding/submissions/{id}` | Admin coding submission detail/results | Coding Practice | Missing |
| GET | `/api/admin/resumes` | Admin resume list/filter | Resume Builder | Missing |
| GET | `/api/admin/resumes/{id}` | Admin resume detail/ATS/suggestions/matches | Resume Builder | Missing |
| GET | `/api/admin/analytics` | Admin aggregate analytics | Analytics | Missing |
| GET | `/api/admin/admins` | Admin users list | Admin Management | Missing |
| POST | `/api/admin/admins` | Add/invite admin | Admin Management | Missing |
| PATCH | `/api/admin/admins/{id}` | Edit admin role/status | Admin Management | Missing |
| DELETE | `/api/admin/admins/{id}` | Remove admin access | Admin Management | Missing |

## 3. Admin Dashboard Requirements vs Backend Coverage

### Dashboard Overview

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| total users | Supported by `User` | Missing | No | Yes | Count `User`. |
| total mock interviews | Supported by `Interview` | Missing | No | Yes | Count `Interview`. |
| total coding sessions | Supported by `CodingSubmission` | Missing | No | Yes | Count submissions. |
| total resume analyses | Supported by `Resume` | Missing | No | Yes | Count resumes or resumes with scores. |
| latest users | Supported by `User.createdAt` | Missing | No | Yes | Need user list projection. |
| latest interview sessions | Supported by `Interview` + `User` + feedback | Missing | No | Yes | Existing `/api/dashboard/recent` is user-scoped. |
| recent activities | Derivable from `User`, `Interview`, `CodingSubmission`, `Resume` timestamps | Missing | No | Yes | No dedicated activity model found in current codebase. |

### Users

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| list users | Supported by `User` | Missing | No | Yes | Needs pagination/search. |
| search users | Supported by `User.name/email` | Missing | No | Yes | Add query params. |
| filter users | Partially supported | Missing | Yes | Yes | No `User.status` or `User.role`. |
| get user details | Supported through relations | Missing | No | Yes | Include counts and recent activity. |
| activate/deactivate user | Not supported | Missing | Yes | Yes | Needs `User.status`. |
| delete user | Cascade relations exist | Missing | No | Yes | Prefer soft disable for MVP. |
| user activity summary | Supported via related tables | Missing | No | Yes | Counts from interviews/submissions/resumes. |

### Mock Interviews

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| list interview sessions | Supported by `Interview` + `User` | Missing | No | Yes | Existing interview endpoints are user actions only. |
| filter by status/category/difficulty/user/date | Supported by fields/indexes partly | Missing | No | Yes | Current indexes are user-focused; admin can still query. |
| get interview details | Supported | Missing | No | Yes | Need include questions/answers/feedback. |
| get scores and feedback | Supported by `AnswerFeedback` | Missing | No | Yes | Overall score can be computed. |
| get transcript preview | Supported by `Answer.transcript` | Missing | No | Yes | Return preview in list/detail depending endpoint. |

### Coding Practice

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| list coding submissions | Supported by `CodingSubmission` + `User` + `CodingProblem` | Existing user-scoped only | No | Yes | `/api/coding/submissions` only returns current user's submissions. |
| filter by status/language/problem/user/date | Supported | Missing | No | Yes | Add admin query params. |
| get submission details | Supported | Existing user-scoped only | No | Yes | `/api/coding/submissions/{id}` enforces owner. |
| get test case results | Supported by `CodingSubmissionResult` + `TestCase` | Existing user-scoped only | No | Yes | Hide hidden test case content by default. |
| get scores and AI feedback | Supported | Existing user-scoped only | No | Yes | Overall score can be computed from score dimensions/weights. |

### Resume Builder

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| list resumes | Supported by `Resume` + `User` | Missing | No | Yes | No resume API module found in current codebase. |
| filter by status/user/date | Supported | Missing | No | Yes | `Resume.status`, `userId`, `createdAt`. |
| get resume details | Supported | Missing | No | Yes | Return `content` only on detail endpoint. |
| get ATS score | Supported by `Resume.atsScore` | Missing | No | Yes | Existing schema enough. |
| get suggestions | Supported by `Resume.suggestions` | Missing | No | Yes | Existing schema enough. |
| get resume matches | Supported by `ResumeMatch` + `JobDescription` | Missing | No | Yes | Include optional details. |

### Analytics

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| users growth | Supported by `User.createdAt` | Missing | No | Yes | Aggregate by day/week. |
| interviews over time | Supported by `Interview.createdAt/startedAt/completedAt` | Existing user-scoped only | No | Yes | Use admin aggregate endpoint. |
| coding activity over time | Supported by `CodingSubmission.createdAt` | Existing user-scoped only | No | Yes | Aggregate by day/week. |
| resume usage over time | Supported by `Resume.createdAt` | Missing | No | Yes | No resume API. |
| most used features | Derivable from activity counts | Missing | No | Yes | Compare counts across feature tables. |
| completion rates | Supported by `Interview.status`, `CodingSubmission.status`, `Resume.status` | Missing | No | Yes | Define simple rate formulas. |

### Admin Management

| Needed Feature | Schema Support | Endpoint Support | Missing Schema? | Missing Endpoint? | Notes |
| -------------- | -------------- | ---------------- | --------------- | ----------------- | ----- |
| list admins | Not supported | Missing | Yes | Yes | No user role/admin model found. |
| add admin | Not supported | Missing | Yes | Yes | Needs role on user or separate admin model. |
| edit admin role | Not supported | Missing | Yes | Yes | Minimal option: `User.role`. |
| disable admin | Not supported | Missing | Yes | Yes | Minimal option: `User.status`. |
| delete admin | Partially supported by deleting `User` | Missing | Yes | Yes | Safer to remove role or disable. |
| track last login | Partially derivable from `Session` | Missing | No | Yes | Use latest session timestamp for MVP. |

## 4. Missing Schema Fields

Only minimal schema changes needed for the simple Admin Dashboard are listed here.

### User.role

Reason:
Needed to distinguish normal users from admins and super admins, protect admin routes, list admins, add admins, and edit admin roles.

Admin page:
Admin Management, all admin-only routes.

MVP:
Required.

Suggested change:

```prisma
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

model User {
  role UserRole @default(USER)
}
```

### User.status

Reason:
Needed for user activate/deactivate and admin disable flows. The Admin UI already displays user/admin statuses such as Active, Disabled, and Invited.

Admin page:
Users, Admin Management.

MVP:
Required if activate/deactivate and disable admin actions are kept. Optional only if those actions are hidden.

Suggested change:

```prisma
enum UserStatus {
  ACTIVE
  DISABLED
}

model User {
  status UserStatus @default(ACTIVE)
}
```

### Optional: User.invitedAt or AdminInvitation model

Reason:
The Admin UI has an "Add Admin" modal and fixture status "Invited". Current schema has no invitation concept except auth verification flows.

Admin page:
Admin Management.

MVP:
Optional. For MVP, adding an admin can require an existing `User` and update `role`. If inviting by email before user creation is required, add an invitation model later.

Suggested optional shape:

```prisma
model AdminInvitation {
  id        String   @id @default(uuid()) @db.Uuid()
  email     String   @unique
  role      UserRole @default(ADMIN)
  invitedBy String   @db.Uuid()
  acceptedAt DateTime? @db.Timestamptz()
  expiresAt DateTime  @db.Timestamptz()
  createdAt DateTime @default(now()) @db.Timestamptz()
}
```

Not required for a simple first admin backend if admins are promoted from existing users.

## 5. Missing Admin Endpoints

All endpoints below should require an authenticated user with `User.role` of `ADMIN` or `SUPER_ADMIN`. Destructive role/status operations should require `SUPER_ADMIN` unless the project intentionally allows regular admins.

### Dashboard Overview

```http
GET /api/admin/overview
```

Purpose:
Return dashboard totals, latest users, latest interviews, and recent activity.

Query params:

```ts
{
  range?: "7d" | "30d" | "90d";
}
```

Response:

```ts
{
  totalUsers: number;
  totalInterviews: number;
  totalCodingSessions: number;
  totalResumeAnalyses: number;
  latestUsers: AdminUserListItem[];
  latestInterviews: AdminInterviewListItem[];
  recentActivities: AdminActivityItem[];
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

### Users

```http
GET /api/admin/users
```

Purpose:
List users with search, filters, pagination, and usage counts.

Query params:

```ts
{
  search?: string;
  status?: "ACTIVE" | "DISABLED";
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  page?: number;
  limit?: number;
}
```

Response:

```ts
{
  data: AdminUserListItem[];
  page: number;
  limit: number;
  total: number;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

```http
GET /api/admin/users/:id
```

Purpose:
Get user profile drawer details and activity summary.

Response:

```ts
{
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "DISABLED";
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  lastLoginAt: string | null;
  totals: {
    interviews: number;
    codingSessions: number;
    resumes: number;
  };
  recentActivity: AdminActivityItem[];
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

```http
PATCH /api/admin/users/:id/status
```

Purpose:
Activate or disable a user.

Request body:

```ts
{
  status: "ACTIVE" | "DISABLED";
}
```

Response:

```ts
{
  id: string;
  status: "ACTIVE" | "DISABLED";
}
```

Required permissions:
`SUPER_ADMIN`.

```http
DELETE /api/admin/users/:id
```

Purpose:
Delete a user only if product policy allows hard delete. Prefer status disable for MVP.

Response:

```ts
{
  success: true;
}
```

Required permissions:
`SUPER_ADMIN`.

### Mock Interviews

```http
GET /api/admin/interviews
```

Purpose:
List interview sessions for all users.

Query params:

```ts
{
  search?: string;
  userId?: string;
  status?: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
```

Response:

```ts
{
  data: AdminInterviewListItem[];
  page: number;
  limit: number;
  total: number;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

```http
GET /api/admin/interviews/:id
```

Purpose:
Get interview details, score breakdown, feedback, and transcript preview.

Response:

```ts
{
  id: string;
  candidate: AdminUserSummary;
  category: string;
  difficulty: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  overallScore: number | null;
  scores: {
    communication: number | null;
    technical: number | null;
    confidence: number | null;
  };
  transcriptPreview: Array<{
    question: string;
    answer: string | null;
    score: number | null;
  }>;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

### Coding Practice

```http
GET /api/admin/coding/submissions
```

Purpose:
List coding submissions across all users.

Query params:

```ts
{
  search?: string;
  userId?: string;
  problemId?: string;
  status?: "PENDING" | "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR";
  language?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
```

Response:

```ts
{
  data: AdminCodingSubmissionListItem[];
  page: number;
  limit: number;
  total: number;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

```http
GET /api/admin/coding/submissions/:id
```

Purpose:
Get submission detail, score breakdown, AI feedback, and test case results.

Response:

```ts
{
  id: string;
  user: AdminUserSummary;
  problem: {
    id: string;
    title: string;
    difficulty: string;
  };
  language: string;
  status: string;
  score: number | null;
  scores: {
    logic: number | null;
    naming: number | null;
    efficiency: number | null;
    bestPractices: number | null;
  };
  aiFeedback: string | null;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  createdAt: string;
  results: Array<{
    id: string;
    passed: boolean;
    output: string | null;
    error: string | null;
    testCaseId: string;
    isHidden: boolean;
  }>;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

### Resume Builder

```http
GET /api/admin/resumes
```

Purpose:
List resumes across all users.

Query params:

```ts
{
  search?: string;
  userId?: string;
  status?: "DRAFT" | "COMPLETE" | "ARCHIVED";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
```

Response:

```ts
{
  data: AdminResumeListItem[];
  page: number;
  limit: number;
  total: number;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

```http
GET /api/admin/resumes/:id
```

Purpose:
Get resume details, ATS score, skills/suggestions, and matches.

Response:

```ts
{
  id: string;
  candidate: AdminUserSummary;
  title: string;
  status: "DRAFT" | "COMPLETE" | "ARCHIVED";
  atsScore: number | null;
  grammarScore: number | null;
  suggestions: string[];
  contentPreview: unknown;
  matches: Array<{
    id: string;
    matchPct: number;
    jobTitle: string;
    company: string;
    matchedKeywords: string[];
    missingKeywords: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

### Analytics

```http
GET /api/admin/analytics
```

Purpose:
Return simple aggregate charts for the Admin Dashboard.

Query params:

```ts
{
  range?: "7d" | "30d" | "90d";
  interval?: "day" | "week";
}
```

Response:

```ts
{
  usersGrowth: TimeSeriesPoint[];
  interviewsActivity: TimeSeriesPoint[];
  codingActivity: TimeSeriesPoint[];
  resumeUsage: TimeSeriesPoint[];
  mostUsedFeatures: Array<{
    feature: "interviews" | "coding" | "resumes";
    count: number;
  }>;
  completionRates: {
    interviews: number;
    codingAccepted: number;
    resumesComplete: number;
  };
}
```

Required permissions:
`ADMIN`, `SUPER_ADMIN`.

### Admin Management

```http
GET /api/admin/admins
```

Purpose:
List users with admin roles.

Query params:

```ts
{
  search?: string;
  status?: "ACTIVE" | "DISABLED";
  role?: "ADMIN" | "SUPER_ADMIN";
  page?: number;
  limit?: number;
}
```

Response:

```ts
{
  data: AdminAccountListItem[];
  page: number;
  limit: number;
  total: number;
}
```

Required permissions:
`SUPER_ADMIN`.

```http
POST /api/admin/admins
```

Purpose:
Promote an existing user to admin or create an admin invite if invitations are added.

Request body for MVP:

```ts
{
  userId: string;
  role: "ADMIN" | "SUPER_ADMIN";
}
```

Response:

```ts
{
  id: string;
  role: "ADMIN" | "SUPER_ADMIN";
}
```

Required permissions:
`SUPER_ADMIN`.

```http
PATCH /api/admin/admins/:id
```

Purpose:
Edit admin role/status.

Request body:

```ts
{
  role?: "ADMIN" | "SUPER_ADMIN";
  status?: "ACTIVE" | "DISABLED";
}
```

Response:

```ts
{
  id: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "DISABLED";
}
```

Required permissions:
`SUPER_ADMIN`.

```http
DELETE /api/admin/admins/:id
```

Purpose:
Remove admin access by setting role back to `USER`, not deleting the user.

Response:

```ts
{
  success: true;
}
```

Required permissions:
`SUPER_ADMIN`.

## 6. Suggested Admin API Contract

Use `/api/admin/*` to match the current backend's `/api` prefix.

Shared DTOs:

```ts
type AdminUserSummary = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type TimeSeriesPoint = {
  date: string;
  count: number;
};

type AdminActivityItem = {
  id: string;
  type: "user" | "interview" | "coding" | "resume";
  label: string;
  createdAt: string;
};
```

Recommended endpoint groups:

| Group | Endpoints |
| ----- | --------- |
| Overview | `GET /api/admin/overview` |
| Users | `GET /api/admin/users`, `GET /api/admin/users/:id`, `PATCH /api/admin/users/:id/status`, `DELETE /api/admin/users/:id` |
| Interviews | `GET /api/admin/interviews`, `GET /api/admin/interviews/:id` |
| Coding | `GET /api/admin/coding/submissions`, `GET /api/admin/coding/submissions/:id` |
| Resumes | `GET /api/admin/resumes`, `GET /api/admin/resumes/:id` |
| Analytics | `GET /api/admin/analytics` |
| Admins | `GET /api/admin/admins`, `POST /api/admin/admins`, `PATCH /api/admin/admins/:id`, `DELETE /api/admin/admins/:id` |

Do not add payments, subscriptions, support, questions bank, or settings endpoints for this dashboard.

## 7. Admin Authorization Requirements

Current schema does not support admin users or roles.

Current auth middleware only verifies that a Better Auth session exists and sets `req.userId`. It does not check roles.

Recommended minimal approach:

```prisma
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  DISABLED
}

model User {
  role   UserRole   @default(USER)
  status UserStatus @default(ACTIVE)
}
```

Then add an admin-only middleware that:

1. Reuses the existing authenticated session.
2. Loads the current user by `req.userId`.
3. Rejects missing users, `DISABLED` users, and users with `role = USER`.
4. Allows read endpoints for `ADMIN` and `SUPER_ADMIN`.
5. Allows role/status/destructive endpoints only for `SUPER_ADMIN`.

Audit logging:

Not required for the simple MVP. If later needed, add a small audit table only for admin role/status/delete actions. Do not over-engineer it now.

## 8. Data Privacy Notes

The Admin Dashboard should avoid exposing these fields by default:

- `Session.token`
- `Account.accessToken`
- `Account.refreshToken`
- `Account.idToken`
- `Account.password`
- Hume access tokens returned by interview start
- `CodingSubmission.judge0Token`
- Full resume `content` in list endpoints
- Full interview transcript in list endpoints
- Hidden `TestCase.input` and `TestCase.output` unless explicitly needed in detail views
- Raw auth verification values
- Raw emotional JSON unless a detail/debug view explicitly needs it

Recommended default:

- List endpoints return summaries only.
- Detail endpoints return sensitive-ish content only when necessary.
- Never return auth secrets or provider tokens.

## 9. Priority Plan

### Must Have

- Add `User.role`.
- Add `User.status` if disable/activate actions remain in the UI.
- Add admin role guard middleware.
- Add `GET /api/admin/overview`.
- Add `GET /api/admin/users`.
- Add `GET /api/admin/users/:id`.
- Add `GET /api/admin/interviews`.
- Add `GET /api/admin/interviews/:id`.
- Add `GET /api/admin/coding/submissions`.
- Add `GET /api/admin/coding/submissions/:id`.
- Add `GET /api/admin/resumes`.
- Add `GET /api/admin/resumes/:id`.
- Add `GET /api/admin/analytics`.
- Add `GET /api/admin/admins`.
- Add `PATCH /api/admin/admins/:id` or equivalent role/status management.

### Should Have

- `PATCH /api/admin/users/:id/status`.
- `POST /api/admin/admins` for promoting an existing user to admin.
- `DELETE /api/admin/admins/:id` to remove admin access by setting role to `USER`.
- Consistent pagination DTOs across admin list endpoints.
- Derived `lastLoginAt` from latest `Session`.
- Activity feed assembled from latest users/interviews/submissions/resumes.

### Later

- Admin invitation model if adding admins by email before account creation is required.
- Audit log for admin mutations.
- More advanced analytics caching/materialized aggregates if data volume grows.
- Hard-delete user endpoint only after privacy/data retention policy is clear.

## 10. Final Recommendation

The current schema is mostly enough for the simple Admin Dashboard's data display needs. Interviews, coding submissions, resumes, scoring, feedback, and timestamps are already modeled well enough for MVP admin listing, details, and analytics.

Minimum schema changes:

1. Add `User.role`.
2. Add `User.status`.

Optional schema change:

- Add `AdminInvitation` only if admin invites must work before the target user exists.

Missing endpoints:

- All admin-specific endpoints are missing. Existing dashboard/coding/interview endpoints are authenticated user-scoped and are not suitable for cross-user admin views.
- No resume API module was found in current codebase.
- No admin API client is used by the current Admin Dashboard frontend; it uses fixtures from `admin-dashboard-data.ts`.

Recommended first implementation order:

1. Add role/status schema support and admin guard middleware.
2. Implement read-only endpoints first: overview, users, interviews, coding, resumes, analytics, admins.
3. Wire the Admin Dashboard from fixtures to these read endpoints.
4. Add minimal mutations: disable user, promote/edit admin role, remove admin access.
5. Leave invitations, audit logs, and hard deletes for later.
