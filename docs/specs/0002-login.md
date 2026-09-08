## Problem Statement

People with a Mealie account cannot yet use Mealie Go to connect to their Mealie instance or sign in. Their installations may use custom ports, reverse proxies, additional access headers, or HTTP. They need a straightforward mobile connection and login flow, password-manager support, and a session that survives app restarts without storing their password.

This spec expands [Login Form #2](https://github.com/SenseiMarv/mealiego/issues/2) using the design confirmed on 2026-09-08.

## Solution

On iOS and Android, let the user configure one server connection using a URL and optional custom headers. Verify that it directly exposes a usable Mealie API before presenting password login. Support username or email, password-manager autofill, explicit sign-in, securely persisted sessions, and recovery from temporary connection failures.

Allow explicit HTTP after a warning on Connect, with no stored consent or ongoing UX differences. End this feature at a minimal, text-oriented authenticated screen. Provide concise errors with an optional detailed response modal.

## User Stories

1. As a Mealie user, I want to enter my Mealie instance URL before signing in, so that the app connects to my installation.
2. As a Mealie user, I want my server connection remembered, so that I do not re-enter its settings when reopening the app.
3. As a Mealie user, I want to use a hostname or IP address with an optional port, so that I can connect to my personal setup.
4. As a Mealie user, I want an address without a scheme to default to HTTPS, so that secure communication is the default.
5. As a Mealie user, I want a correctly configured reverse-proxy subpath preserved, so that my personal API setup can work.
6. As a Mealie user, I want HTTPS certificates validated normally, so that the connection retains the device's server-trust protections.
7. As a Mealie user, I want to explicitly enter an HTTP address, so that I can use an installation without HTTPS.
8. As a Mealie user, I want a warning before Connect sends anything over HTTP, so that I understand that passwords and other data will travel unencrypted.
9. As a Mealie user, I want to cancel the HTTP warning without sending a request, so that I can reconsider the connection.
10. As a Mealie user, I want HTTP to work for any chosen hostname or IP address after acceptance, so that address restrictions do not exclude my setup.
11. As a connected Mealie user, I want HTTP and HTTPS to have the same subsequent UX, so that normal use is not interrupted by repeated transport warnings.
12. As a Mealie user, I want an advanced custom-header editor, so that I can satisfy my reverse proxy's access requirements.
13. As a Mealie user, I want to add, edit, and remove header name/value rows, so that I can configure access without editing raw request syntax.
14. As a Mealie user, I want malformed, duplicate, and app-reserved header names rejected clearly, so that I can correct invalid settings before connecting.
15. As a Mealie user, I want custom headers included in every API request, including the initial check, so that protected instances remain accessible throughout the flow.
16. As a Mealie user, I want custom header values stored securely, so that access credentials are protected on my device.
17. As a Mealie user, I want the app to verify a Mealie response before showing login, so that a proxy page or unrelated website is not mistaken for my instance.
18. As a Mealie user, I want redirects rejected as an invalid address, so that the app uses the exact API location I configured.
19. As a Mealie user, I want an explanation when the server does not offer password login, so that I understand why this app cannot sign in there.
20. As a Mealie user, I want to sign in with either username or email and my password, so that I can use my existing Mealie account.
21. As a Mealie user, I want my password manager to fill the login fields, so that I do not need to type my credentials manually.
22. As a Mealie user, I want to explicitly tap Sign in after autofill, so that I control when credentials are submitted.
23. As a Mealie user, I want my session securely retained across app restarts without saving my password, so that I can return conveniently.
24. As a signed-in Mealie user, I want valid sessions renewed while I use the app, so that I avoid unnecessary sign-ins.
25. As a Mealie user whose session has expired, I want to sign in again when renewal is no longer possible, so that access can be restored.
26. As a Mealie user experiencing an outage, I want my session retained and a retry action, so that a temporary failure does not sign me out.
27. As a Mealie user, I want changed custom headers checked before replacing saved values, so that a failed edit does not destroy my working configuration.
28. As a signed-in Mealie user, I want valid header edits on the same server to preserve my session, so that updating proxy credentials does not require another Mealie login.
29. As a Mealie user, I want changing the server URL to end the previous session, so that I reconnect and authenticate for the new server connection.
30. As a signed-in Mealie user, I want a minimal view showing the server and my identity, so that I can verify which account I am using.
31. As a signed-in Mealie user, I want to sign out while retaining connection settings, so that someone can sign in again without reconfiguring the server.
32. As a Mealie user, I want to forget the server and clear its session and custom headers, so that its saved connection data is removed from the app.
33. As a Mealie user, I want connection, certificate, proxy-access, and unexpected-response failures distinguished, so that I know what needs correction.
34. As a Mealie user, I want incorrect credentials and a locked account explained distinctly, so that I can respond appropriately.
35. As a Mealie user, I want entered connection settings available after an error, so that I can correct or retry them without starting over.
36. As a Mealie user troubleshooting a failure, I want a button that opens the detailed server response, so that I can inspect what the server returned.
37. As a Mealie user troubleshooting a connection with no response, I want the underlying connection error shown, so that the details view remains useful.

## Implementation Decisions

- Use the existing Expo Router application structure. The current app is a starter screen with a root stack; connection, authentication, session restoration, and diagnostics are new behavior. Do not implement recipe browsing as part of this change.
- Use the glossary's distinction between a Mealie instance, a server connection, and a Mealie account. A server connection consists of the URL and optional custom headers; it is not an account.
- Maintain one saved server connection. Group URL construction, custom-header application, redirect rejection, and API error capture behind a shared Mealie request boundary. Keep session lifecycle and secure persistence coherent rather than duplicating them across screens. These are responsibilities, not a requirement to introduce a class or separate abstraction for each one.
- Normalize the base URL while preserving an optional path prefix and custom port. Default a missing scheme to HTTPS. Append all API routes relative to the base directory so that a prefix is never discarded. Support HTTP and HTTPS, and never silently downgrade HTTPS.
- On each Connect action, an HTTP scheme triggers the warning modal before any connection-check request. Acceptance continues that action; cancellation sends nothing. Do not persist consent or add a remembered-consent flag. Other requests, session restoration, and subsequent login do not independently trigger warnings. No private-network address restriction is applied.
- Follow the accepted HTTP architectural decision: permit cleartext connections in the native builds while retaining normal HTTPS certificate validation. Configure both platforms for user-entered hosts and applicable iOS local-network permissions. Do not provide a certificate-validation bypass. Verify production-like builds because development-host behavior is insufficient evidence.
- Present the custom-header editor as a modal with name/value rows and add/remove controls. Reject malformed names, invalid request-header values, case-insensitively duplicate names, and app-controlled authentication or transport headers. Reserved names include Authorization, Cookie, Host, and Content-Type. Reverse-proxy Basic authentication is not supported by this iteration.
- Include custom headers on every Mealie API request: server validation, login, current-user lookup, refresh, logout, and connection revalidation. Persist their values securely with the server connection.
- Reject redirects without following them, including redirects to the same origin. Report an invalid server address and let the user edit it. A proxy must return the API response directly, using configured headers where necessary.
- Validate the server with GET /api/app/about. Require a successful response with the expected typed Mealie metadata; HTTP 200 with HTML or unrelated JSON is not success. Use the advertised password-login capability before showing the login screen. Explain unsupported password login and permit connection editing. The capability setting describes the advertised login flow, not a guarantee that the backend independently forbids password authentication.
- Use Mealie password authentication: POST /api/auth/token with form-encoded username and password. The username field accepts either the user's username or email. Read access_token, token_type, and expires_in from the response; use bearer authentication for subsequent authenticated requests. Do not persist the password or depend on a browser cookie session.
- Use GET /api/users/self to obtain the signed-in identity. Display only the connected server, signed-in identity, and Sign out in the minimal authenticated content. Prefer text-only presentation and text controls where possible.
- Configure native username/current-password autofill semantics. Manual password-manager selection followed by an explicit Sign in tap meets acceptance. Do not promise automatic credential matching for arbitrary self-hosted domains.
- Store session credentials in platform-backed secure storage. Restore valid sessions across app restarts and renew them during active use through POST /api/auth/refresh. Mealie refresh requires a still-valid session credential; it is not an independent long-lived refresh-token mechanism. Respect the server's expiry rather than inventing an unlimited client session lifetime.
- Distinguish authentication expiry or rejection from network unavailability. Require sign-in when the session can no longer be renewed, but retain the saved session during temporary transport failures and offer retry. Keep connectivity and authentication state distinct so future offline data access can be added without redesigning logout semantics. Do not build offline data storage now.
- Validate candidate custom-header edits before replacing saved settings. Keep the current connection settings if validation fails. Successful header-only changes preserve the session when the server URL is unchanged. A URL change ends the old session and requires connection validation and login for the replacement server.
- Sign out clears local session state and retains the server URL and custom headers. If using POST /api/auth/logout, do not treat its success as necessary for local sign-out or claim it revokes the bearer JWT; the inspected Mealie handler clears a session cookie. Forget server additionally clears saved URL and header values.
- Show actionable errors for unreachable servers, certificate failures, proxy access denial, unexpected responses, incorrect credentials, and locked accounts. In the inspected Mealie contract, invalid login credentials return 401 and locked accounts return 423. A 401/403 during the public server probe is a connection/access problem, not an incorrect Mealie password.
- The response-details modal displays the failed response's HTTP status, response headers, and body directly as plain text. If no response exists, display the underlying connection error. Keep diagnostic state in memory. Do not build a redaction system, diagnostic history, export/sharing, or collection of successful login responses for this viewer. Raw error responses may contain sensitive information; the user accepted this trade-off.
- Make no Mealie server schema changes. The encryption requirement concerns securely stored mobile session credentials and HTTPS in transit, with the explicit HTTP exception; it does not require encrypting the remote database.

## Testing Decisions

- The user confirmed one primary automated seam: exercise the complete rendered application flow through the existing Expo Router testing setup. Substitute external network responses and platform secure storage while keeping connection logic, authentication, session handling, and navigation real. Avoid separate mocking layers for each internal module.
- Prior art is the existing rendered-router test using renderRouter, screen, route assertions, and visible text under Jest Expo and React Native Testing Library. Extend that approach rather than introducing a separate testing framework.
- Good tests assert externally observable behavior: visible screens, actions, requests reaching the configured API address, and persistence or deletion at the secure-storage boundary. Do not assert hook structure, private state shapes, component internals, helper call counts, or snapshots that merely mirror markup.
- Cover initial connection gating, valid Mealie metadata, HTML/unexpected JSON responses, password-login capability, and correction after failures. Verify that login remains unavailable until a usable server response is received.
- Cover HTTP warning accept/cancel, HTTPS without a warning, no request before HTTP acceptance, no persisted consent, and no warning on ordinary subsequent requests. Verify explicit HTTP handling does not disable TLS validation.
- Cover prefix-preserving URLs, custom ports, custom headers on every API operation, malformed/duplicate/reserved header rejection, and redirect rejection without a request to the redirect destination.
- Cover username/email login, explicit submission, invalid credentials, locked accounts, minimal authenticated content, restoration across remount/restart simulation, valid-session refresh, expired sessions, and temporary outages without session deletion. Control time at the test boundary for expiry scenarios.
- Cover header edits that succeed or fail, session retention for header-only changes, URL changes, sign-out retaining connection settings, and Forget server clearing the complete saved connection. Verify the password is never persisted.
- Cover the detailed error modal with a response, a non-JSON body, and a connection error with no response. Assert that returned content is displayed as text, not rendered as an active page.
- Supplement the single automated app seam with focused native acceptance checks on iOS and Android. Verify password-manager field filling, release-like HTTP/TLS and local-network behavior, redirect rejection, session persistence, and clearing behavior. Include a real prefix-rewriting proxy because mocked responses cannot validate that deployment path or native transport behavior. This is targeted platform verification, not a second extensive lower-level test suite.
- Read the exact Expo SDK 57 documentation before implementation. For the eventual code change, run the repository's Node-version initialization before pnpm lint and pnpm test. The current spec task does not constitute runtime validation of the feature.

## Out of Scope

- Web support.
- Recipe browsing, editing, meal planning, or a polished authenticated dashboard.
- Offline-first data access, local recipe caching, synchronization, or an offline database. Session retention during outages is included.
- Multiple saved server connections or account switching across a connection list.
- SSO/OIDC, account registration, password recovery, and reverse-proxy Basic authentication.
- Persisting passwords, an independent refresh-token grant, or guaranteed indefinite login.
- Certificate-validation bypasses, silent HTTPS-to-HTTP fallback, redirects, or HTTP host-range restrictions.
- Persisted HTTP consent, ongoing insecure-connection indicators, or a future warning in server settings.
- Encrypting Mealie's server database or other server-side changes.
- Automatic website-matched password suggestions for every self-hosted domain.
- Diagnostic redaction infrastructure, persistent response history, automatic diagnostic logging, export/sharing, or successful-authentication response capture for the error viewer.
- Making Mealie's web frontend support subpaths; future image URLs and OIDC callbacks need separate compatibility assessment.

## Further Notes

- This spec synthesizes the confirmed design, glossary, and accepted decision to allow HTTP through explicit Connect-time acceptance. The user confirmed both the feature design and the testing approach.
- Source inspection used Mealie v3.25.1. This is the inspected integration baseline, not an agreed hard minimum-version gate. Validate server capabilities and response contracts rather than assuming any reachable URL is a supported installation.
- Subpath support adds a small URL-construction requirement for the scoped bearer-authenticated flow. It still requires a properly configured proxy and a runtime integration check.
- Expo SDK 57's default native fetch implementation supports redirect control; older React Native fetch limitations should not be assumed to apply. Confirm the chosen transport against the exact versioned documentation.
- Primary references: [Mealie authentication routes](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/auth/auth.py), [server metadata route](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/app/app_about.py), [current-user routes](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/users/crud.py), [Mealie subpath FAQ](https://docs.mealie.io/documentation/getting-started/faq/#can-i-serve-mealie-on-a-subpath), [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [Expo SecureStore](https://docs.expo.dev/versions/v57.0.0/sdk/securestore/), and [Apple Password AutoFill workflow](https://developer.apple.com/documentation/security/about-the-password-autofill-workflow).
