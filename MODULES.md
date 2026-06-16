# Interviewer.ai - Modules Breakdown

Based on the graduation project requirements and the current monorepo architecture, the platform is divided into the following architectural and functional modules.

## Architectural Modules (Monorepo Packages)

1. **Frontend App (`apps/www`)**
   - **Tech Stack:** Next.js, React, Tailwind CSS, Turbopack.
   - **Purpose:** The user-facing web platform handling dashboards, resume building UI, coding environments, and interview room interfaces.

2. **Core API Service (`apps/api`)**
   - **Tech Stack:** Bun, Express.js, Prisma ORM, PostgreSQL.
   - **Purpose:** Central backend handling authentication, database operations, user state, and orchestrating requests to AI/Python services.

3. **ATS & Resume Parsing Service (`apps/ats-parser`)**
   - **Tech Stack:** Python, UV (Package Manager).
   - **Purpose:** Specialized backend microservice for analyzing resumes, parsing text, calculating ATS scores, and generating keyword match metrics.

---

## Functional Modules (Features)

### 1. Authentication & User Management Module

- **User Authentication:** Secure sign-up, login, password recovery, and session management (e.g., JWT, OAuth for social logins).
- **Role-Based Access Control (RBAC):** Managing permissions for different user roles (e.g., candidates, administrators).
- **Profile Management:** Managing user details, preferences, and interview history context.

### 2. AI Mock Interview Module

- **Configuration Engine:** Allows users to select categories (e.g., Data Structures, HR), question quantity, and difficulty levels.
- **Adaptive AI Engine:** Conducts real-time mock interviews, adapting follow-up questions dynamically based on the user's previous answers.
- **Speech & Media Processor:** Handles WebRTC/WebSockets for live audio/video streaming, integrating STT (Speech-to-Text) and TTS (Text-to-Speech).

### 3. Analytics & Performance Dashboard Module

- **Metrics Aggregation:** Calculates and tracks speech metrics (fluency, clarity, filler words) and answer detail levels.
- **Emotional Analytics:** Processes visual and auditory cues to measure emotional response and confidence trends.
- **Visualization Engine:** Powers the interactive dashboard with charts and historical trend visualizations.
- **Recommendation System:** Generates weekly, personalized improvement plans.

### 4. Feedback & Evaluation Module

- **Ideal Answer Generator:** Uses AI to generate sample 'ideal' answers to the questions asked during mock sessions.
- **Personalized Reviewer:** Evaluates user responses against ideal criteria to suggest personalized feedback.
- **Answer Comparison & Drafting UI:** An interface allowing users to compare their historical answers side-by-side and edit answer drafts.

### 5. Resume Builder & ATS System Module

- **Auto-Generator Builder:** Generates ATS-ready formats using user experience data and keyword-rich templates.
- **Resume Analyzer:** Connects with `apps/ats-parser` to calculate ATS match scores and provide readability/grammar suggestions.
- **Job Description (JD) Matcher:** Compares uploaded resumes with pasted JDs, highlighting missing keywords and producing AI-tailored resume variations.
- **Secure File Manager:** Ensures encryption, secure storage, and GDPR-compliant deletion of all uploaded user documents.

### 6. Problem-Solving & Coding Module

- **Sandboxed Code Execution Engine:** Safely runs and tests user code (similar to LeetCode) with strict input/output validation.
- **Question Repository:** Manages algorithmic and system design coding challenges.
- **AI Pairing Assistant:** Acts as an observer during the coding session, asking conceptual questions and evaluating logic, naming conventions, and best practices.
