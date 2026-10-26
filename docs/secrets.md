# Secrets

Stage reads three secrets from its environment when it starts. Only its server uses them, and none of them, nor anything decrypted with them, is sent to a page. Supply each from your deployment's secret store at container start, never in the image or the repository, and restart Stage after changing one, since a running process keeps the values it started with.

Generate each encryption secret as a random value, for example with `openssl rand -base64 48`.

## `KEYCLOAK_CLIENT_SECRET`

**What Stage uses it for:** authenticating as Keycloak's confidential client when it completes a sign-in, renews a session's tokens, and ends a Keycloak session at sign-out.

**What it requires:** the secret Keycloak generated for Stage's client. Stage refuses to start without it when `NEXT_PUBLIC_AUTH_PROVIDER` is `keycloak`.

**What changing it costs:** nobody is signed out, provided Stage restarts within Keycloak's session idle limit (30 minutes in the standard realm). Until Stage restarts with the new value, new sign-ins fail, protected requests are answered 503 once each session's current access token expires (within five minutes), and sign-out cannot end the Keycloak session. Keycloak sees no activity on those sessions meanwhile, so one that reaches the idle limit ends at the first renewal after the restart. Restart Stage as soon as the new value is in place.

## `SESSION_ENCRYPTION_SECRET`

**What Stage uses it for:** encrypting the session cookie. The cookie carries the session, including its Keycloak tokens, in a form only Stage's server can read.

**What it requires:** a random value of at least 32 characters. Stage refuses to start in Keycloak mode when it is missing or shorter.

**What changing it costs:** everyone is signed out of Stage, since existing session cookies can no longer be read. Keycloak's own sessions are unaffected, so signing in again may not ask for credentials.

## `ACCESSTOKEN_ENCRYPTION_SECRET`

**What Stage uses it for:** encrypting the EGO token held in an EGO session. It is used only when `NEXT_PUBLIC_AUTH_PROVIDER` is `ego`, and Keycloak deployments do not use it.

**What it requires:** EGO deployments keep their current setting until EGO support is removed.

**What changing it costs:** nothing for Keycloak deployments. It is removed together with EGO support.
