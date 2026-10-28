# ECG Learning Studio

Self-paced ECG learning by Progress Ajayi. Live app: https://ecg-learning-studio.vercel.app/

75 objectives, 75 worked examples plus 75 guided exercises, 150 objective questions, 393 glossary terms and 18 original synthetic practice challenges. All 20 source documents are registered, including 19 PDFs containing 925 pages. Registration is not a claim that every source page or tracing has been converted into a separate lesson.

Run `npm run dev`, `npm test`, `npm run build`. Deploy the complete source through Vercel to include Node API functions in `api`, with `dist` as static output. A static-only Drop upload does not activate Google authentication.

See [the access administrator guide](docs/access-administrator.md) for OAuth setup, named-user approval/revocation and production tests still required. Until configured, protected endpoints fail closed. Drive permissions are the authoritative email allowlist.

No source PDFs, delegate credentials, private Drive IDs, OAuth secrets or real user allowlist are included. Never commit populated environment values. [Source coverage](docs/source-coverage.md) records source mapping and limits.
