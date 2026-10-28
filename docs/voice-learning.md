# Voice learning and optional ECG tutor

## Verified architecture and scope

The existing app is framework-free JavaScript ES modules, HTML and CSS. npm scripts run a dependency-free Node development server, `node --test tests/*.test.mjs`, and a static production build. Vercel hosts `dist` and the existing Node API functions. GitHub repository: https://github.com/ajayiprogress04-ctrl/ecg-learning-studio, branch `main`. The baseline inspected for this release was `958cafe65a57a1cfb983a843c89d368370196c4a`. The downloaded local source was older; the current GitHub files were restored before integrating changes. No replacement repository, project or database was created.

`data/curriculum.json` contains 15 topics and 75 objectives with explanations, deeper teaching, worked and guided examples, practice questions and exact source page mappings. `visuals.js` and `practice-lab.js` create educational schematics and synthetic tracings; they are not clinical recordings. `app.js` owns hash routes, section tabs, dropdowns, glossary connections and browser-local progress, notes and bookmarks. The public source register maps 20 supplied documents; private PDFs remain in Drive.

Google OAuth routes and `server/access.js` verify identity, encrypted HttpOnly sessions and current named-user Drive permissions. API replies are private and not cached. The inspected Production environment had the seven existing Google/Drive/session settings and no AI-provider settings. The local source directory was not a Git working tree; a fresh read-only Git clone verified the current `main` baseline. Existing local content was retained; changes are limited to voice, integration, privacy and documentation.

## Implemented behaviour

- One shared SpeechPlayer cancels preceding utterances before starting another. Speech uses the selected device/browser voice, not an AI API.
- Listen, pause, resume, stop, replay, speed, voice selection and next/previous section controls appear within objectives. Sections are short passages drawn from the actual objective content.
- Pause uses cancel-and-restart at the current short passage. This deliberately favours reliable behaviour over claiming exact word-level resumption across devices. Maximum passage length is 240 characters after pronunciation expansion. No automatic playback starts on ordinary page navigation.
- Relevant lesson headings, paragraphs, detailed dropdowns and worked examples are highlighted and scrolled into view. Closed teaching dropdowns open as their content is selected. Individual ECG waveform components are not automatically annotated.
- Learn, Worked example, Practise and Sources each provide suitable narration. Hidden guided answers and unsubmitted quiz solutions are excluded. Visible checked feedback is included when the practice page is re-rendered.
- Guided mode reads one section and waits for the learner to continue. It offers an existing worked example and objective questions with the app's existing marking and feedback. Guidance does not award mastery, submit answers or alter notes.
- An eight-stage interpretation learning path uses verified existing objectives for calibration, rate, sinus rhythm, waves, PR/QRS, morphology, ischaemia/ST–T and QT. It supplements the curriculum rather than replacing it. Learners can leave, pause or read silently at any time.
- The ECG Tutor & voice button opens a text command/search panel. Local commands navigate real lessons, show examples, open practice, stop/repeat/slow speech and continue sections. A validated objective ID and one of four tab names are the only supported lesson-navigation payloads. Unsupported topics offer verified search matches or an honest no-match result. No arbitrary JavaScript or model-generated route is executed.
- Microphone recognition, where the browser exposes SpeechRecognition, begins only after the learner checks the privacy notice and presses Start microphone. The transcript is editable and is never automatically submitted. Cancel, failure, denied permission and text fallback are supported. This is turn-based recognition, not real-time conversation.
- A separate Ask AI action sends explicit questions to `/api/tutor` only when configured. It never substitutes canned generated-looking responses. Missing configuration is clearly labelled. Spoken AI answers use the same shared speech player and require an explicit Listen action.

## Optional AI integration and cost

No paid service is enabled in this release. Do not add populated secrets to the repository. If the owner later approves a trial, securely set these server-side Vercel variables and redeploy:

```
TUTOR_ENABLED=true
OPENAI_API_KEY=<enter securely in Vercel, never in chat or source>
OPENAI_MODEL=gpt-5.4-mini
```

The release only accepts this verified model configuration. Recheck availability and pricing before enabling; the live provider was not tested during this release. Existing Google/Drive environment settings remain unchanged. `.env.example` lists configuration names and safe defaults only.

| Capability | Provider / key | Usage charges | Privacy and controls |
| --- | --- | --- | --- |
| Lesson narration and spoken tutor text | Browser speech synthesis; no app API key | No app AI/TTS API request | Prefer a device voice; online voices depend on browser/vendor policies. |
| Navigation, section highlighting, guided questions | Local app logic; no key | No AI usage | Reuses public course data and existing routes. |
| Spoken question transcription | Browser recognition; no app provider key | No separately configured app transcription service | Browser may send audio to its speech service; not universally available or offline. Explicit notice and editable transcript. |
| Generated tutor answers | OpenAI Responses, server key required | GPT-5.4-mini documentation checked 28 October 2026: USD 0.75 / million input tokens, USD 4.50 / million output tokens; cached input USD 0.075 / million | Explicit Ask AI; owner-only trial; selected public excerpts plus up to six recent turns; no private PDF retrieval. |
| Hosted TTS / real-time voice | Not implemented or activated | No estimate or free-service claim | Reassess official prices and benefits only if browser voice quality is inadequate. |

Illustration, not a quota guarantee: 3,000 uncached input tokens plus 500 output tokens would cost approximately USD 0.0045 at those listed text rates. Actual usage, output length, model availability, tax and provider terms vary. The server fixes `max_output_tokens` at 1,800, disables reasoning for this selected model, bounds question/history/context sizes, makes no automatic retries and prevents duplicate in-flight requests in the UI. A per-instance guard allows at most four requests/minute and 40/day per identity. **This is not a durable global spending cap:** serverless instances can reset or run in parallel. Before extending beyond an owner trial, implement a shared atomic quota store and agree a real spending ceiling. Use a separate restricted provider project/key, review its limits and usage, and do not assume provider budget alerts impose a hard cap.

Official references checked:

- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/text

## Security and data handling

`api/tutor.js` enforces same-origin JSON POSTs, an 18 KB bound, valid existing objective IDs, bounded user/assistant history, a current Google session, fresh Drive approval and owner-only access. It fails closed when disabled. The API never accepts a provider URL, key, model, tool, raw document, system message or arbitrary navigation action from the browser.

The server retrieves at most three public course excerpts, prioritising the current objective. Public source title/page metadata is attached by the server as links to supplied context, not as a claim that every generated sentence is independently validated. The model is instructed to admit insufficient evidence and avoid fabricated sources. AI answers still require review for correctness.

Only the question, bounded conversation and public teaching excerpts are sent to OpenAI. No Google credentials, email identities, study notes or private Drive files enter that prompt. The response is rendered as plain text, never executable HTML. No model tools or document-fetch capabilities are provided. Conversations are held only in page memory, with Clear and reload removal; the server deliberately logs neither questions nor answers. Hosting/provider operational logs remain subject to their own policies. `store:false` disables response-object storage; it is not a claim of zero provider retention or zero abuse monitoring.

Existing document routes and access permissions are unchanged. AI access does not widen Drive sharing. Microphone audio is not recorded by the app; browser recognition may use external vendor processing. Voice and microphone limitations are explained in the UI and `privacy.html`.

## Validation record

Automated tests use fake speech events and mocked AI/Google responses where credentials or hardware are unavailable. They do not prove clinical accuracy, real provider availability or audible voice quality.

- Existing 27 course and access tests plus 14 new voice/tutor tests pass (41 total).
- New checks cover speech chunks and pronunciation, pause/resume/stop/replay, stale callbacks on lesson switching, empty/unavailable/error states, hidden quiz-solution exclusion, valid/invalid routes, real path IDs, bounded input/history/context, missing key/no calls, stateless bounded provider payload, failures/timeouts/incomplete responses, duplicate/burst guard, anonymous/cross-origin/non-owner denial and public-asset key checks.
- Production build and JavaScript syntax checks pass. No lint or type-check command exists in the project.
- Browser checks: real lesson voice panel rendered; typed heart-rate command opened `normal-ecg-03/learn`; guided selection highlighted the real lesson heading; missing AI key displayed honest unavailability. Dropdown baseline preserved.
- This cloud Chrome session exposes no usable speech voice and returns a synthesis error. That error is displayed; audible playback, voice quality, pause/resume on real audio and mobile behaviour are **not certified** by this test. State transitions are unit-tested.
- Microphone capture and denied hardware permission are **not exercised with a real microphone**. They must be tested on intended learner devices. Text input remains available.
- No real AI answer or spoken AI answer has been tested because paid activation and a provider key have not been authorised/configured. Provider success/failure paths are mocked.
- Cross-account Drive viewing/revocation tests remain subject to the existing administrator guide; this voice release does not claim to complete them.

## Acceptance steps on the owner's phone/computer

1. Open an objective and tap Listen. Choose an available device voice; confirm correct pronunciation and audio.
2. Pause, Resume, Stop and Replay; change speed; select a long section. Confirm no overlapping audio when switching objectives or closing the page.
3. Use ECG Tutor & voice → “Take me to the section on heart rate calculation”. Confirm the correct title appears. Try “Teach me how to identify the P wave”, guidance, next section, example and practice.
4. Check the microphone notice, press Start microphone and approve the browser prompt only if comfortable. Correct an ECG transcript and submit it yourself. Test cancellation and denied permission.
5. If a later paid owner trial is approved, configure the server variables securely. Verify the authenticated owner can ask a grounded question, hear the response, stop it, clear context and follow lesson links. Verify other accounts are denied and inspect actual usage before wider access.

## Smallest next stage

First confirm voice quality, technical pronunciation, screen-reader behaviour and recognition on the actual Android/iOS/desktop browsers used by learners. Then, if approved, activate a small owner-only text-AI trial and review a fixed set of ECG questions against course sources. Add a shared hard quota before multi-user AI. Consider hosted TTS only if device voices are inadequate, and real-time conversation only after those accuracy, privacy and cost checks. Do not market the present turn-based microphone input as a natural real-time tutor.
