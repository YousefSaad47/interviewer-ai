# Current Integration

This project uses Hume AI for realtime voice interviews through Hume's Empathic Voice Interface (EVI).

There are two Hume integrations:

1. Frontend realtime voice connection via `@humeai/voice-react`.
2. Backend Hume SDK usage via `hume` for access tokens, EVI config creation, chat event retrieval, and webhook payload parsing.

Current SDK/package versions:

| Package | Location | Version |
| --- | --- | --- |
| `hume` | `apps/api/package.json` | `^0.16.0` |
| `@humeai/voice-react` | `apps/www/package.json` | `^0.2.14` |

The backend creates or reuses one EVI config named `Interviewer AI`. The config uses:

| Option | Current value |
| --- | --- |
| `eviVersion` | `"3"` |
| voice provider | `"HUME_AI"` |
| voice name | `"Ava Song"` |
| prompt | hard-coded technical interviewer prompt in `apps/api/src/services/hume.ts` |
| webhooks | only added when `HUME_WEBHOOK_URL` is configured |
| webhook events | `chat_started`, `chat_ended`, `tool_call` |
| language model | not explicitly configured |
| tools | not configured |
| event messages | not configured |
| timeouts | not configured |
| dynamic variables | not configured |
| session settings | not sent from frontend |

Important limitation: the interview setup form collects `targetRole`, `experienceLevel`, `interviewFocus`, and `additionalContext`, but the backend currently ignores those values when creating the Hume prompt/session.

# Project Interview Flow

Actual lifecycle in this project:

1. User fills interview setup in `apps/www/src/features/interview/components/setup-interview-page.tsx`.
2. `useStartInterview` posts mapped setup data to `POST /api/interview/start`.
3. `InterviewService.start` creates an `Interview` row with `IN_PROGRESS`.
4. It finds or creates `Question` rows by category/difficulty.
5. It creates `InterviewQuestion` rows for the selected questions.
6. Backend requests a Hume access token with `fetchAccessToken({ apiKey, secretKey })`.
7. Backend calls `getOrCreateConfig`; it lists configs and reuses `Interviewer AI` if found, otherwise creates it.
8. API returns `interviewId`, `accessToken`, `configId`, `questionCount`, `currentQuestion`, and `expiresAt`.
9. Frontend puts `interviewId`, `accessToken`, `configId`, and `questionCount` in the URL and routes to `/interview/technical`.
10. `TechnicalInterviewPage` wraps the page in `VoiceProvider`.
11. User clicks `Start Interview`.
12. `useTechnicalInterviewSession.handleStart` calls `connect({ auth: { type: "accessToken" }, configId })`.
13. `@humeai/voice-react` initializes microphone input, audio playback, and the EVI WebSocket.
14. Hume sends a `chat_metadata` message containing `chatId` and `chatGroupId`.
15. Frontend posts those IDs to `POST /api/interview/:id/link-chat`.
16. Backend saves `Interview.humeChatId` and `Interview.humeChatGroupId`.
17. User and assistant messages stream through `useVoice().messages`.
18. Frontend displays only `user_message` and `assistant_message` content as live transcript bubbles.
19. Frontend estimates progress by counting assistant messages containing `QUESTION_START`.
20. User clicks `End Interview`.
21. Frontend calls `disconnect()`.
22. If `chat_metadata` exists, frontend calls `POST /api/interview/:id/finalize` with `chatId` and `chatGroupId`.
23. Backend calls `hume.empathicVoice.chats.listChatEvents(chatId)`.
24. Backend filters only `USER_MESSAGE` events.
25. Each user message is mapped by array index to an `InterviewQuestion`.
26. Backend creates an `Answer` with the user transcript and Hume chat IDs.
27. Backend parses `emotionFeatures` JSON into `AnswerFeedback.emotionalTone`.
28. Backend attempts to extract `fluency`, `confidence`, and `sentiment` from that parsed JSON.
29. Backend enqueues `evaluate-answer` to generate AI feedback with the local AI provider.
30. Interview is marked `COMPLETED`.
31. Frontend redirects to `/dashboard`.

Webhook lifecycle:

1. If `HUME_WEBHOOK_URL` exists when the config is created, Hume is configured to call `/api/hume/webhook`.
2. Express registers this route with `express.raw({ type: "application/json" })`.
3. The webhook handler verifies `x-hume-ai-webhook-timestamp` and `x-hume-ai-webhook-signature` using `HUME_WEBHOOK_SIGNING_KEY`.
4. Payload is parsed through `HumeSerialization.empathicVoice.WebhookEvent.parseOrThrow`.
5. `chat_started` links the Hume chat to an interview only when `event.customSessionId` exists.
6. `chat_ended` finalizes by `chatId`.
7. `tool_call` is accepted but ignored.

Important risk: frontend `connect` does not pass a `customSessionId` or `sessionSettings.customSessionId`. Therefore, the webhook `chat_started` path probably cannot link the chat to the interview unless Hume somehow supplies `customSessionId` from another source. The normal link path is the frontend `/link-chat` call after `chat_metadata`.

# Files Related to Hume

| File | Relevance |
| --- | --- |
| `apps/api/src/services/hume.ts` | Hume SDK client, access token fetching, EVI config creation, chat event retrieval, prompt, voice, webhook config. |
| `apps/api/src/modules/interview/interview.service.ts` | Starts interviews, fetches Hume events, stores transcripts/emotion JSON, links/finalizes chats. |
| `apps/api/src/modules/interview/interview.webhook.ts` | Hume webhook signature verification and webhook event routing. |
| `apps/api/src/modules/interview/interview.controller.ts` | `/start`, `/finalize`, `/link-chat`, `/progress` endpoints. |
| `apps/api/src/modules/interview/interview.schema.ts` | Request schemas for start/finalize/link-chat. |
| `apps/api/src/core/env.ts` | Hume env vars: `HUME_API_KEY`, `HUME_SECRET_KEY`, `HUME_WEBHOOK_SIGNING_KEY`, `HUME_WEBHOOK_URL`. |
| `apps/api/src/index.ts` | Registers raw Hume webhook route before JSON parsers/controllers. |
| `apps/api/prisma/schema.prisma` | Hume chat ID fields and feedback storage fields. |
| `apps/api/prisma/migrations/20260620184414_add_hume_columns/migration.sql` | Adds Hume IDs to answers. |
| `apps/api/prisma/migrations/20260620200700_add_interview_current_question_column/migration.sql` | Adds Hume IDs/current question to interviews. |
| `apps/www/src/features/interview/hooks/use-start-interview.ts` | Starts backend session and forwards token/config via URL. |
| `apps/www/src/features/interview/hooks/use-technical-interview-session.ts` | Uses `useVoice`, connects to Hume, reads messages, links chat, finalizes. |
| `apps/www/src/features/interview/components/technical-interview-page.tsx` | Wraps `VoiceProvider`, renders transcript/progress/mic controls. |
| `apps/www/src/features/interview/api/interview.api.ts` | `linkInterviewChat` client call. |
| `apps/www/src/features/interview/types/interview.types.ts` | Hume start/link response typing. |
| `apps/api/src/modules/admin-interviews/*` | Uses stored answer/feedback fields in admin interview views, but does not expose `emotionalTone`. |
| `apps/api/src/modules/dashboard/dashboard.service.ts` | Uses stored feedback overall scores for user dashboard stats/recent items. |

# Events

## Frontend WebSocket Messages

These are the messages currently visible through `useVoice().messages`.

| Message | When it fires | Payload shape | Handled where | Stored? | Current behavior |
| --- | --- | --- | --- | --- | --- |
| `chat_metadata` | First message after EVI connection | `chatId`, `chatGroupId`, optional `customSessionId`, optional `requestId` | `useTechnicalInterviewSession` | Partially | Used to call `/link-chat` and later `/finalize`. |
| `user_message` | User speech is transcribed | `message.content`, `fromText`, `interim`, `language`, `models.prosody.scores`, `time` | Displayed in transcript list | Not directly | Shown live. Stored later only through REST `USER_MESSAGE` events. Live `models`, `language`, `time`, `interim` are ignored. |
| `assistant_message` | Assistant response transcript arrives | `message.content`, `fromText`, `id`, `isQuickResponse`, `language`, `models.prosody.scores` | Displayed in transcript list; scanned for `QUESTION_START` | No | Shown live. Used for progress count. Not persisted. |
| `assistant_prosody` | Assistant audio expression measurement arrives | `id`, `models.prosody.scores` | Not explicitly handled | No | Ignored unless present in general message history. |
| `user_interruption` | User interrupts assistant audio | interruption fields from Hume SDK | Not explicitly handled | No | Ignored. |
| `audio_output` | Assistant audio stream chunk/output | base64/audio message from Hume SDK | Internally handled by `@humeai/voice-react` | No | Played by SDK. App does not inspect/store. |
| `tool_call` | EVI requests a configured tool | tool name, parameters JSON string, `toolCallId`, `responseRequired`, `toolType` | No `VoiceProvider.onToolCall` supplied | No | Not used. |
| error/connection messages | WebSocket/audio/microphone failures or connection state | SDK-specific error/connection messages | Only `status` is read | No | UI shows connecting/not started; detailed errors ignored. |

## Backend REST Chat Events

The installed Hume SDK defines `ReturnChatEventType` values:

| Event type | Hume meaning | Handled where | Stored? | Current behavior |
| --- | --- | --- | --- | --- |
| `USER_MESSAGE` | User transcript event | `InterviewService.finalize` | Yes, partially | Creates one `Answer` per event until questions are exhausted. |
| `AGENT_MESSAGE` | Assistant/agent text event | fetched but not filtered into storage | No | Ignored. |
| `ASSISTANT_PROSODY` | Assistant audio prosody scores | fetched but not stored | No | Ignored. |
| `CHAT_START_MESSAGE` | Chat start event | fetched but not stored | No | Ignored. |
| `CHAT_END_MESSAGE` | Chat end event | fetched but not stored | No | Ignored. |
| `FUNCTION_CALL` | Tool/function call event | fetched but not stored | No | Ignored. |
| `FUNCTION_CALL_RESPONSE` | Tool/function response event | fetched but not stored | No | Ignored. |
| `PAUSE_ONSET` | Pause onset event | fetched but not stored | No | Ignored. |
| `RESUME_ONSET` | Resume onset event | fetched but not stored | No | Ignored. |
| `SESSION_SETTINGS` | Session settings event | fetched but not stored | No | Ignored. |
| `SYSTEM_PROMPT` | System prompt event | fetched but not stored | No | Ignored. |
| `USER_INTERRUPTION` | User interrupted assistant | fetched but not stored | No | Ignored. |
| `USER_RECORDING_START_MESSAGE` | User recording start | fetched but not stored | No | Ignored. |

REST event payload shape used by the current parser:

| Field | Type | Current use |
| --- | --- | --- |
| `type` | string | Filters `USER_MESSAGE`. |
| `chatId` | string | Parsed but not stored from event; input chat ID is stored. |
| `chatGroupId` | string optional | Parsed if present. |
| `messageText` | string optional | Stored as `Answer.transcript`. |
| `role` | string optional in local schema; SDK says role is required | Parsed but ignored. |
| `emotionFeatures` | stringified JSON optional | Parsed into `AnswerFeedback.emotionalTone`. |
| `metadata` | stringified JSON optional | Parsed by schema but ignored. |
| `timestamp` | number optional in local schema; SDK says required | Parsed but ignored. |
| `id`, `relatedEventId` | SDK fields | Not included in local parser, ignored. |

## Webhook Events

| Event name | When it fires | Payload shape | Handled where | Stored? | Current behavior |
| --- | --- | --- | --- | --- | --- |
| `chat_started` | Hume chat starts | common `chatId`, `chatGroupId`, optional `configId`; `startTime`, `chatStartType`, optional `customSessionId`, optional Twilio fields | `interview.webhook.ts` | Partially | If `customSessionId` exists, links chat to interview. Otherwise no-op. |
| `chat_ended` | Hume chat ends | common IDs; `durationSeconds`, `endReason`, `endTime`, optional `customSessionId`, optional Twilio fields | `interview.webhook.ts` | Partially | Calls `finalizeByChatId`, which stores answers/feedback if interview was linked and not completed. `durationSeconds` and `endReason` are discarded. |
| `tool_call` | Hume tool call event | common IDs; `timestamp`, `toolCallMessage`, optional Twilio fields | `interview.webhook.ts` | No | Switch case exists but does nothing. |

# Stored Data

| Field | Source | Type | Database location | Frontend uses it? |
| --- | --- | --- | --- | --- |
| Interview ID | Backend-generated | UUID string | `Interview.id` | Yes, URL/start/finalize/link calls. |
| Category | Setup form/API | enum | `Interview.category` | Dashboard/admin. |
| Difficulty | Setup form/API | enum | `Interview.difficulty` | Dashboard/admin. |
| Status | Backend lifecycle | enum | `Interview.status` | Dashboard/admin. |
| Question count | Setup form/API | int | `Interview.questionCount` | Interview UI/dashboard/admin. |
| Started timestamp | Prisma default | DateTime | `Interview.startedAt` | Dashboard/admin. |
| Completed timestamp | Finalize/webhook | DateTime | `Interview.completedAt` | Dashboard/admin. |
| Hume chat ID | `chat_metadata`, webhook, finalize input | string nullable unique | `Interview.humeChatId`, `Answer.humeChatId` | Backend lookup; not shown in normal UI. |
| Hume chat group ID | `chat_metadata`, webhook, finalize input | string nullable | `Interview.humeChatGroupId`, `Answer.humeChatGroupId` | Backend only. |
| Current question | Backend method/progress logic | int | `Interview.currentQuestion` | Progress endpoint/admin, but frontend currently estimates locally instead. |
| Question text | DB seeded/placeholder | string | `Question.text` | Admin details. |
| Suggested answer | DB question data | string nullable | `Question.suggestedAnswer` | AI evaluator input only. |
| Answer transcript | Hume REST `USER_MESSAGE.messageText` | string nullable | `Answer.transcript` | Admin transcript preview. |
| Audio URL | Not provided/stored currently | string nullable | `Answer.audioUrl` | No. |
| Answer duration | Not provided/stored currently | int nullable | `Answer.durationMs` | Admin type supports it but currently null. |
| Emotional tone | Hume REST `USER_MESSAGE.emotionFeatures` parsed JSON | JSON nullable | `AnswerFeedback.emotionalTone` | No; admin API does not select/expose it. |
| Fluency score | Attempted from `emotionFeatures.fluency` | float nullable | `AnswerFeedback.fluencyScore` | Admin scoring, dashboard indirectly through overall if present. Likely null because Hume emotion labels do not include `fluency`. |
| Confidence score | Attempted from `emotionFeatures.confidence` | float nullable | `AnswerFeedback.confidenceScore` | Admin scoring. Likely null because Hume emotion labels do not include `confidence`. |
| Sentiment score | Attempted from `emotionFeatures.sentiment` | float nullable | `AnswerFeedback.sentimentScore` | Admin details. Likely null because Hume emotion labels do not include `sentiment`. |
| Initial overall score | Average of parsed fluency/confidence | float nullable | `AnswerFeedback.overallScore` | Usually overwritten later by AI evaluator. |
| AI strengths | Local AI evaluator | string[] | `AnswerFeedback.strengths` | Admin. |
| AI improvements | Local AI evaluator | string[] | `AnswerFeedback.improvements` | Admin. |
| AI ideal answer | Local AI evaluator | string nullable | `AnswerFeedback.idealAnswer` | Admin. |
| Detail level | Local AI evaluator | string nullable | `AnswerFeedback.detailLevel` | Admin. |
| Relevance score | Local AI evaluator | number nullable | `AnswerFeedback.relevanceScore` | Admin scoring. |
| Technical accuracy | Local AI evaluator | number nullable | `AnswerFeedback.technicalAccuracy` | Admin scoring. |
| AI overall score | Local AI evaluator | number nullable | `AnswerFeedback.overallScore` | Dashboard/admin. |
| Filler word count | No current source | int nullable | `AnswerFeedback.fillerWordCount` | Admin supports it but null. |
| Clarity score | No current source | float nullable | `AnswerFeedback.clarityScore` | Admin supports it but null. |

# SDK Configuration

Backend SDK:

| Area | Current implementation |
| --- | --- |
| Client | `new HumeClient({ apiKey })` |
| Access token | `fetchAccessToken({ apiKey, secretKey })` |
| Token cache | In-memory cache for 25 minutes |
| REST APIs used | `empathicVoice.configs.listConfigs`, `empathicVoice.configs.createConfig`, `empathicVoice.chats.listChatEvents` |
| WebSocket APIs used on backend | None |
| Webhook serialization | `serialization.empathicVoice.WebhookEvent.parseOrThrow` |
| Webhook auth | HMAC SHA-256 over `${payload}.${timestamp}` with `HUME_WEBHOOK_SIGNING_KEY`; 180 second timestamp window |

Frontend SDK:

| Area | Current implementation |
| --- | --- |
| Provider | `<VoiceProvider>` with no custom props |
| Hook | `useVoice()` |
| Connect auth | `{ type: "accessToken", value: accessToken }` |
| Connect config | `configId` from backend |
| Microphone | managed by `@humeai/voice-react` |
| Audio playback | managed by `@humeai/voice-react` |
| Message history | `messages` from `useVoice` |
| Muting | `mute`, `unmute`, `isMuted` |
| Disconnect | `disconnect()` |
| Unused available hook data | `chatMetadata` property, `lastVoiceMessage`, `lastUserMessage`, `fft`, `micFft`, detailed error flags, call duration, player queue length, tool status, volume, audio mute/pause controls |

Hume official/reference sources consulted:

| Source | What it established |
| --- | --- |
| Hume TypeScript SDK README (`apps/api/node_modules/hume/README.md`) | SDK supports Empathic Voice REST and WebSocket APIs; API reference URL is `https://dev.hume.ai/reference/`. |
| Hume generated SDK reference (`apps/api/node_modules/hume/reference.md`) | REST methods for chats, chat groups, configs, prompts, tools, audio reconstruction. |
| `@humeai/voice-react` README | `VoiceProvider`, `useVoice`, WebSocket/microphone/audio/message history behavior, connect options, available callbacks/properties. |
| Hume SDK type comments | Exact event/message payloads and links to Hume docs pages under `https://dev.hume.ai/docs/...` and `https://dev.hume.ai/reference/...`. |

Note: live web search did not reliably surface Hume docs pages in this environment, so current Hume capability analysis is based on the installed official SDK/reference package and its embedded documentation links. Any product feature not visible in those SDK/reference files is marked uncertain or not supported.

# Available Hume Features

| Capability | Hume availability | Current project use | Can be enabled? | Where available |
| --- | --- | --- | --- | --- |
| Realtime voice conversation | Yes | Yes | Already enabled | `@humeai/voice-react` WebSocket. |
| Microphone capture | Yes via React SDK | Yes | Already enabled | `connect()` initializes mic. |
| Assistant audio playback | Yes via React SDK | Yes | Already enabled | SDK playback queue. |
| Live user transcript | Yes | Yes, displayed | Already enabled | `user_message.message.content`. |
| Live assistant transcript | Yes | Yes, displayed | Already enabled | `assistant_message.message.content`. |
| Persisted user transcript | Yes via chat events | Yes, partially | Already enabled | `USER_MESSAGE.messageText` into `Answer.transcript`. |
| Persisted assistant transcript | Yes via `AGENT_MESSAGE` | No | Yes | `listChatEvents`. |
| Full conversation transcript | Yes by combining user/agent events | No | Yes | `listChatEvents` or live `messages`. |
| Chat ID | Yes | Yes | Already enabled | `chat_metadata`, webhook, REST events. |
| Chat group ID / resumability | Yes | Stored, not used for resume | Yes | `chat_metadata.chatGroupId`, `resumedChatGroupId`. |
| Request ID | Yes | No | Yes | `chat_metadata.requestId`. |
| Custom session ID | Yes | No effective usage | Yes | `connect.sessionSettings.customSessionId` or related config/session settings. |
| User language detection | Yes | No | Yes | `user_message.language`. |
| Assistant language detection | Yes | No | Yes | `assistant_message.language`. |
| User message timing | Yes | No | Yes | `user_message.time`. |
| Event timestamps | Yes | No | Yes | `ReturnChatEvent.timestamp`. |
| Prosody/emotion scores | Yes, 48 expression scores | Partially | Already available but underused | `models.prosody.scores` live; `emotionFeatures` in REST chat events. |
| Assistant prosody | Yes | No | Yes | `assistant_message.models`, `assistant_prosody`, `ASSISTANT_PROSODY`. |
| Emotion timeline | Yes, if scores/timestamps are retained | No | Yes | Combine event timestamps with prosody scores. |
| Audio reconstruction | Yes | No | Yes | `empathicVoice.chats.getAudio`, `chatGroups.getAudio`. |
| Chat group event history | Yes | No | Yes | `empathicVoice.chatGroups.listChatGroupEvents`. |
| Chat list/history | Yes | No | Yes | `empathicVoice.chats.listChats`. |
| Config versions | Yes | No | Yes | config version REST APIs. |
| Prompt management | Yes | No | Yes | prompt REST APIs. |
| User-defined tools | Yes | No | Yes | config/session `tools`, `tool_call` messages/webhooks. |
| Built-in tools | Yes according to SDK comments | No | Yes | config/session `builtinTools`. |
| Webhooks | Yes | Partially | Already configured conditionally | `chat_started`, `chat_ended`, `tool_call`. |
| Webhook duration/end reason | Yes | No | Yes | `chat_ended.durationSeconds`, `endReason`. |
| Twilio phone calling metadata | Yes if using Twilio | No | Yes if phone integration added | webhook Twilio fields. |
| Session settings | Yes | No | Yes | `connect({ sessionSettings })` or SDK send methods. |
| Dynamic variables | Yes | No | Yes | `sessionSettings.variables`. |
| Voice switching | Yes | No | Yes | `sessionSettings.voiceId`. |
| Custom language model | Yes according to SDK docs | No | Yes, with config/session setup | language model config and API key. |
| Pause/resume assistant | Yes | No | Yes | React SDK `pauseAssistant`, `resumeAssistant`; REST events. |
| User interruptions | Yes | No | Yes | `user_interruption` / `USER_INTERRUPTION`. |
| Audio FFT / mic FFT | Yes via React SDK | No | Yes | `fft`, `micFft`. |
| Speaking rate | Not directly seen in Hume SDK types | No | Derive manually from transcript/time | Use transcript words plus timing. |
| Filler words | Not directly seen in Hume SDK types | No | Derive manually from transcript | Parse transcript. |
| Interruptions count | Yes as events; metric must be derived | No | Yes | Count interruption events. |
| Turn taking | Yes as events; metric must be derived | No | Yes | Sequence user/agent events. |
| Speaking balance | Not direct; derivable | No | Yes | Compare user/agent durations/word counts. |
| Conversation summary | Not directly seen in Hume SDK types | No | Use local AI summarizer | Hume does not appear to provide this directly in current SDK. |
| Overall interview score | Not directly Hume | No from Hume | Use local scoring | Local AI evaluator already scores answers. |
| Confidence score | Not a direct Hume emotion label | Attempted but likely null | Derive/custom mapping | Infer from selected expression labels or local evaluator. |
| Sentiment score | Not a direct Hume emotion label | Attempted but likely null | Derive/custom mapping | Infer from emotion labels or local evaluator. |
| Facial expression data | Not in EVI voice SDK examined | No | Uncertain; likely separate Expression Measurement APIs, not current EVI path | Not available in current implementation. |

# Missing Features

## Already Implemented

- Hume access token generation.
- Hume EVI config creation/reuse.
- Hume voice provider selection.
- Hume prompt configuration.
- Frontend EVI WebSocket connection.
- Microphone and assistant audio playback through React SDK.
- Live transcript display for user/assistant messages.
- Hume chat ID and chat group ID linking.
- Manual frontend finalization.
- Webhook signature verification.
- Webhook handling for `chat_started` and `chat_ended`.
- REST retrieval of Hume chat events.
- Storage of user transcripts as answers.
- Storage of parsed user `emotionFeatures` JSON.

## Available but Unused

- Assistant transcript persistence.
- Full chronological event timeline.
- Event IDs and related event IDs.
- Event timestamps.
- User message timing intervals.
- Language detection.
- Live `models.prosody.scores`.
- Assistant prosody.
- Emotion timeline across the interview.
- Audio reconstruction.
- Chat duration and end reason from webhook.
- Pause/resume and interruption events.
- Tool calls and tool responses.
- Dynamic variables/session settings.
- Resume by chat group ID.
- Request ID.
- Detailed WebSocket/audio/microphone errors.
- Mic FFT/audio FFT.
- Hume config language model settings.
- Hume config event messages and timeouts.
- Built-in/user-defined tool configuration.
- Prompt/config versioning.
- Chat group APIs.

## Not Supported Directly by Current Hume Integration

- Direct Hume-provided interview score.
- Direct Hume-provided technical correctness score.
- Direct Hume-provided filler word count.
- Direct Hume-provided speaking pace metric.
- Direct Hume-provided communication score.
- Direct Hume-provided strengths/weaknesses/recommendations.
- Direct Hume-provided interview summary.
- Direct Hume-provided facial metrics through the current EVI voice flow.

Some of these can be derived from Hume transcripts, timing, and emotion scores, or produced by the existing local AI evaluator.

# Backend Gaps

1. The backend discards almost every Hume chat event except `USER_MESSAGE`.
2. The backend does not store a normalized event timeline.
3. The backend does not store event timestamps, Hume event IDs, or related event IDs.
4. Assistant messages are not stored, so the final transcript cannot show the actual interviewer questions/follow-ups from Hume.
5. The code maps user messages to interview questions by index, which can be wrong when Hume records greetings, clarifications, follow-ups, interruptions, or non-answer user speech.
6. `currentQuestion` is not updated by the current flow. `recordQuestion` exists but is never called.
7. Frontend progress relies on the assistant literally saying `QUESTION_START`, and those markers may appear in the displayed transcript.
8. `emotionFeatures` is treated as though it may contain `fluency`, `confidence`, and `sentiment`, but Hume's SDK emotion score type contains 48 emotion/expression labels, not those fields.
9. `emotionalTone` is stored but not selected/exposed by admin interview APIs.
10. Hume webhook `chat_started` expects `customSessionId`, but the frontend does not send it.
11. `chat_ended.durationSeconds` and `endReason` are discarded.
12. Webhook and manual finalization can race. Duplicate finalization is guarded by interview status, but the frontend swallows errors and the race can still produce operational noise.
13. Only the first page of 100 chat events is requested. Longer interviews may exceed this.
14. The setup form context is not injected into Hume prompt/session settings.
15. Audio reconstruction is not used, despite `Answer.audioUrl` existing.
16. No raw Hume payloads are retained for debugging or future reprocessing.
17. No consent/privacy retention boundary exists specifically for emotional analytics.

# Data That Should Be Stored

For a professional results page, useful Hume-derived storage would include:

| Data | Why store it |
| --- | --- |
| Raw Hume chat events | Enables reprocessing when schemas/scoring improve. |
| Normalized conversation turns | Needed for transcript, timeline, turn-taking, interruptions. |
| Assistant messages | Required to show actual questions, prompts, and follow-ups. |
| User messages | Already stored, but should keep event ID/timestamp/time interval. |
| Hume event ID | Prevents duplicates and supports traceability. |
| Related event ID | Connects assistant prosody to assistant messages. |
| Event role/type | Enables timeline filtering. |
| Event timestamp | Enables charts and duration analysis. |
| Message time interval | Enables speaking pace, response latency, answer duration. |
| Language | Useful for localization and analysis quality. |
| Full prosody scores | Enables emotion timeline and aggregate emotional profile. |
| Top emotions per turn | Easier UI/querying than raw JSON alone. |
| Assistant prosody | Helps evaluate interviewer tone and session quality. |
| Interruption events | Supports interruption and turn-taking metrics. |
| Pause/resume events | Supports silence/pacing analysis. |
| Chat start/end events | Supports lifecycle, duration, completion reason. |
| Webhook end reason | Useful for abandoned/error sessions. |
| Audio reconstruction reference | Useful for playback/audit if product policy allows. |
| Derived speaking rate | Results page metric. |
| Derived filler word count | Results page metric. |
| Derived speaking balance | Results page metric. |
| Derived sentiment/confidence mappings | Results page metric, but should be labeled as derived. |
| Setup context used | Shows what role/focus the interview evaluated. |

# Possible Interview Result Sections

Based only on currently available or enableable Hume data plus existing local AI feedback:

- Session summary.
- Overall score.
- Technical score.
- Communication score.
- Confidence indicator, clearly labeled as derived unless custom-scored by AI.
- Full transcript with user and interviewer turns.
- Question-by-question answers.
- AI-generated strengths.
- AI-generated improvements.
- Ideal answer/reference answer.
- Technical accuracy.
- Relevance score.
- Detail level.
- Emotion timeline.
- Dominant emotions by answer.
- Emotional trend across the interview.
- Stress/anxiety indicators, carefully labeled as expression signals rather than clinical claims.
- Calmness/concentration/determination indicators.
- Speaking pace.
- Answer duration.
- Response latency.
- Filler word count.
- Pause/silence timeline.
- Interruption count.
- Turn-taking analysis.
- Speaking balance.
- Conversation flow timeline.
- Hume transcript confidence/prosody confidence visualization, where available.
- Audio playback, if audio reconstruction is enabled and privacy policy allows.
- Interview completion metadata.
- End reason/error reason.
- Recommendations for next practice session.
- Category/focus performance breakdown.
- Progress compared with previous interviews.
- Raw transcript export.
- Admin/audit trace with Hume chat ID and event IDs.

# Recommendations

1. Store a normalized `InterviewEvent` or `ConversationTurn` table before building the results page.
2. Preserve raw Hume event payloads in JSON for future reprocessing.
3. Store assistant messages and timestamps, not only user answers.
4. Replace index-based answer-to-question mapping with explicit question markers, tool calls, or persisted turn metadata.
5. Pass `customSessionId: interviewId` through Hume session settings so webhooks can reliably link chats.
6. Inject setup form fields into Hume via dynamic variables or generated prompt text.
7. Expose `emotionalTone` through API responses where appropriate.
8. Stop expecting `fluency`, `confidence`, and `sentiment` directly inside Hume emotion scores. Create derived metrics from the 48 expression labels or leave them to the local evaluator.
9. Fetch all Hume chat event pages, not just the first 100 events.
10. Store webhook `durationSeconds` and `endReason`.
11. Decide whether audio reconstruction is allowed by product/privacy policy before enabling audio playback.
12. Add idempotency around finalization keyed by Hume chat ID/event ID.
13. Treat Hume emotion outputs as expression measurements, not definitive internal emotional states.

# Final Conclusion

The project has a functional Hume EVI integration for live voice interviews, but it currently uses only a narrow slice of what Hume provides. The live frontend receives rich message objects with transcript, language, timing, chat metadata, and prosody inference. The backend can retrieve a broad set of chat events, webhook metadata, and audio reconstruction, but finalization currently stores only user message text and a raw emotion JSON blob.

For a professional Interview Results page, the most important missing foundation is a durable conversation/event timeline. Without assistant turns, timestamps, event IDs, timing intervals, and full prosody scores, the product can show basic transcripts and AI feedback, but it cannot accurately show emotional trends, pacing, interruptions, turn taking, or a trustworthy question-by-question flow.

The next backend step should be data modeling and ingestion, not UI: capture the full Hume chat event stream, normalize it, keep raw payloads, and derive interview metrics from that stored timeline.
