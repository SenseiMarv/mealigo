# Login and server connection

Source: [GitHub issue #2](https://github.com/SenseiMarv/mealiego/issues/2).

This design record captures the completed grill-with-docs interview. The user confirmed the shared understanding on 2026-09-08, including the simple diagnostic response viewer. Implementation has not started.

## Agreed requirements

- Support iOS and Android. Web support is outside scope.
- Before signing in, the user connects to a Mealie instance by entering its URL.
- Keep one saved server connection initially. Changing its URL ends the current session and requires connecting and signing in again.
- Offer an advanced custom-header modal with editable name/value rows and add/remove controls. Reject malformed and case-insensitively duplicate header names. Reserve authentication and transport headers, including Authorization, Cookie, Host, and Content-Type, for the app; reverse-proxy Basic authentication is outside this iteration. Include configured headers in every API request.
- Validate the server using a successful, expected Mealie response from /api/app/about, with custom headers attached, before showing login. A generic HTTP 200 response is insufficient.
- If the server advertises that password login is unavailable, explain that this app currently requires it and allow editing the connection. SSO, registration, and password recovery are outside this issue.
- Accept a username or email address and password for sign-in.
- Support root addresses, IP addresses, custom ports, and subpaths served by a correctly configured reverse proxy. Preserve the user's base path when addressing every API endpoint. Default addresses without a scheme to HTTPS; HTTP must be explicit. Never silently downgrade HTTPS.
- Reject redirects as an invalid server address; do not follow them. The entered address must directly expose a functioning Mealie API, using custom headers where required by a proxy.
- Support password-manager autofill, followed by an explicit Sign in action.
- Manual selection of saved credentials through the password manager is an acceptable baseline. Automatic domain-matched suggestions are not required for arbitrary instance URLs.
- Retain the authenticated session across app restarts.
- Renew valid sessions while the app is in use. Require sign-in again when the session has expired and can no longer be renewed.
- Retain session credentials during temporary connection failures and offer a retry screen. Preserve the ability to introduce offline-first use later; offline data access is not implemented by this issue.
- Store the session credential securely on the device. Do not persist the password.
- Use HTTPS with normal certificate validation, including certificates trusted by the device. Also allow explicit HTTP for any hostname or IP address, without trying to detect whether it belongs to a home network. Do not offer an ignore-certificate-errors option.
- On each Connect action, check the entered URL's scheme: HTTP shows a warning modal and requires explicit acceptance before the connection check sends any request; HTTPS does not. The warning explains that passwords and other exchanged data are unencrypted in transit. Do not persist consent or introduce a remembered-consent mechanism. Cancel sends no request.
- After connecting, subsequent requests, session restoration, and sign-in use the same UX for HTTP and HTTPS. The warning belongs only to the Connect action, not to individual requests. Do not add ongoing insecure-connection indicators; a possible alert in future server settings belongs to another ticket.
- The encryption requirement covers secure local session-credential storage and HTTPS communication, subject to the explicit HTTP exception. This issue does not require encrypting the remote Mealie database.
- Store custom headers securely with the server connection and retain them across app restarts and sign-out.
- Save changes to custom headers only after a successful connection check. Preserve the Mealie session when the URL is unchanged; changing headers alone does not force sign-in.
- Signing out clears the Mealie session but retains the connection settings. A separate Forget server action removes the URL and custom headers as well as the session.
- After successful sign-in, show a minimal authenticated screen with the connected server, signed-in identity, and Sign out. Prefer text-only content and controls; recipe browsing is outside this issue.
- Show distinct, actionable failures for an unreachable server, certificate failure, proxy access denial, an unexpected server response, incorrect credentials, and a locked account. Retain entered connection settings for correction and offer retry/edit actions.
- Add a button to open a modal with the failed request's detailed server response. The main error message remains concise. Display the response directly as described below.

The HTTP exception is recorded in [ADR-0001](../adr/0001-explicit-http-connections.md).

## Subpath assessment

The user requested subpath support if its incremental cost is small. Source inspection of Mealie v3.25.1 found that the connection check, password login, current-user lookup, refresh, and logout can all use a preserved URL prefix with bearer authentication, without requiring redirects or server-generated navigation URLs. Include this support: for example, an instance at https://example.com/mealie/ is probed at https://example.com/mealie/api/app/about.

This requires consistent URL construction and verification with a prefix-rewriting proxy. It does not promise that arbitrary proxy configurations or Mealie's web frontend support subpaths; images and OIDC will need separate assessment when introduced. This is a source-based effort assessment, not runtime verification.

Sources: [Mealie auth routes](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/auth/auth.py), [about route](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/app/app_about.py), [current-user routes](https://github.com/mealie-recipes/mealie/blob/v3.25.1/mealie/routes/users/crud.py), [official subpath limitation](https://docs.mealie.io/documentation/getting-started/faq/#can-i-serve-mealie-on-a-subpath).

## Diagnostic behavior

Display the failed response's HTTP status, response headers, and response body as plain text in the modal. If there is no server response, show the connection error instead. Keep this local, in-memory error state; this issue does not add diagnostic history, logging, export, or sharing. Do not build a custom redaction system or capture successful authentication responses for this view.

A server can include sensitive information in an error response, so raw diagnostic content could contain secrets. The agreed design accepts this possibility for the local troubleshooting view instead of adding a general redaction system.
