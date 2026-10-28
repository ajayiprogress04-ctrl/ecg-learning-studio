# Restricted document access — administrator guide

## Architecture and activation

Public learning remains available without signing in. Vercel Node functions verify Google email identity through OAuth and check the course folder’s named-user permissions and the requested file’s permissions on every document request. Google Drive enforces access again in its viewer. Its named-user permissions are the authoritative email allowlist; there is no client-side approval list or duplicate database.

The administrator-only app page shows approved accounts and opens Google Drive’s official permission manager. Approval and revocation do not require rebuilding the app. The OAuth client and server environment must be configured before this works in production. Until then, the UI reports setup is required and protected endpoints fail closed. Automated provider tests are simulations, not completed tests with the real brother/colleague accounts.

## One-time configuration

1. In the Drive owner’s Google Cloud project, enable Google Drive API. Configure Google Auth Platform branding, support contact and audience. In external Testing mode, add the administrator and the two readers as OAuth test users.
2. Create a Web application OAuth client with the exact redirect URI `https://ecg-learning-studio.vercel.app/api/auth/callback`.
3. The app requests verified email identity and `https://www.googleapis.com/auth/drive.metadata.readonly`. It uses read-only metadata to verify permissions; Google’s viewer serves PDF content. This is a restricted Google scope. Follow Google’s verification requirements; external Testing grants may expire after seven days. Do not bypass warnings or claim Google verification has been completed.
4. Enter configuration directly in Vercel’s secure environment settings: `APP_ORIGIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `ADMIN_EMAIL`, `DRIVE_FOLDER_ID`, `DRIVE_SOURCE_IDS`. The session secret must be a cryptographically random 32-byte base64url key. The source map pairs public source IDs with existing private Drive file IDs.
5. Never paste secrets into chat or commit populated environment files. Deploy the complete source repository through Vercel so Node API functions are created; a static-only Drop upload cannot activate authentication. Environment configuration changes require a deployment; named-user approval changes do not.

## Approve each reader

Sign in as the actual Drive owner and open Manage document access. In Google Drive, choose Share → Manage access for the course folder. Keep General access **Restricted**. Add the brother’s and colleague’s exact Google identities individually as **Viewers**, not Editors. Do not grant Anyone, domain or group access. If acting on behalf of the administrator, do not send invitation email without explicit instruction; use the notification option appropriately.

Verify each source is a child of the configured folder and inherits the intended permission. OAuth test-user approval and Drive permission are separate requirements: one does not grant the other.

## Reader experience

Open Private source library → Sign in with Google. Use the approved identity and consent to email identity plus read-only Drive metadata. Open a source page from a lesson or the complete original from the source register. No repeated download/upload is needed. The embedded viewer must also be using the approved Google account. If cookies or account selection prevent embedding, use the secure Drive tab and select that account.

## Add or revoke later

Use the folder’s Share → Manage access panel to add a named Viewer or remove a person. Also remove any independent file-level grants or alternate inherited access for that person. The app rechecks the folder and each file on the next request. Anyone/domain/group sharing fails closed.

Drive may need time to propagate changes. Already viewed pages, screenshots or previously downloaded copies cannot be recalled. This is access control, not DRM; the app does not claim printing, copying or screenshots are impossible.

## Troubleshooting and verification

- Cannot sign in: check OAuth test-user/audience settings, exact redirect URI and metadata scope consent.
- Signed in but not approved: compare the verified email with the named-user folder permission and check its expiry.
- Only some documents fail: check parent folder and individual file permissions; remove over-broad sharing.
- Approved badge but Drive asks for access: switch the viewer to the approved Google account or open the secure Drive tab.
- Sign-in after refresh: sessions last at most 12 hours; consent expiry or revocation requires sign-in again.
- Setup required: check that Vercel has deployed the Node functions and all required environment values.

Production acceptance still requires the real brother, colleague, an unapproved identity and signed-out browser: test access, copied URLs, revocation, refresh and mobile/desktop viewer behaviour. Do not report these passed until actual credentials and identities are available.

The portal source may contain delegate credentials. It is flagged and remains protected. Never reproduce those values in lessons, search, logs, public screenshots, source code or study exports.
