# Portal session layer: what replacing NextAuth has to provide

Leaving Next.js removes NextAuth, and NextAuth is the whole of Stage's session layer: sign-in, the OAuth exchange with Keycloak, token refresh, session encryption and sign-out. So whatever replaces Next.js has to provide all of it. This page records what that replacement must satisfy.

Source: Usher's design docs and the iMicroSeq portal plan (#182), as supplied by Usher on 2026-10-20. Each item keeps the standing Usher gave it, because a roadmap otherwise makes a decision and a recommendation read alike. Item numbers follow Usher's list so the two can be cross-referenced; Usher's 14 to 16 were reports of things gone wrong, held with the developer rather than listed here.

## Using this as a checklist

Every rule below applies to whatever replaces NextAuth, and each needs a test that fails if the rule is broken, not only an implementation that intends to keep it. Stage's current session layer is built to rules 6, 7 and 11 to 13, with those tests beside `global/utils/authOptions.ts`, and a replacement needs equivalents. Rule 8 holds for everything a page can read: the session sent to the browser carries identity only. The session cookie itself still carries the tokens, encrypted and readable only by Stage's server, until a server-side store (rule 10) replaces it. Rule 4 holds for the protected proxy: when an upstream answers 401 to a request sent with a Keycloak access token, Stage renews the session at once, at most once per person per minute. If Keycloak has ended the session, the page gets the proxy's own 401 `session_ended` and signs out; otherwise it gets the upstream's 401 unchanged. In the browser, pages follow the live session rather than the one read when the page loaded: a tab notices another tab's sign-out at once, and an ended session at its next focus, navigation or protected call. A replacement needs the browser half as well as the server half, or the server ends a session that a page still presents as signed in. **A portal does not re-read its session on a timer, since every read extends the idle limit**: a timed re-read keeps an unattended tab's session alive until Keycloak's maximum, undoing rule 13's idle limit. Rule 11 holds for Keycloak sign-in; the EGO path's own encryption secret goes with EGO's removal.

## Decided in Usher's design

1. **The bridge exchanges the portal's Keycloak access token**, sent with each request to an ushered application. The controller accepts it only when its `aud` names that bridge's application. So a portal's Keycloak client needs an audience mapper naming every application it calls, and a missing mapper fails closed: those requests are refused.
2. **What comes back never reaches the portal.** The exchange yields an Usher token, encrypted per application, living five minutes, cached by the bridge. The portal only ever handles Keycloak's tokens.
3. **Revocation reaches an open session without the portal doing anything.** The controller pushes revocations, category changes, and sign-outs relayed from Keycloak's back-channel logout to every bridge, which drops the affected cached tokens. The worst case is the 30-second poll interval, not the token lifetime. A new grant can lag up to one Usher token lifetime.
4. **A refused identity gets one answer.** An expired, invalid or revoked sign-in token is answered 401 with `WWW-Authenticate: Bearer error="invalid_token"`, and never served as anonymous. A portal must read that 401 as "this session's token is no good": refresh, or end the session and offer sign-in.
5. **A token's lifetime is never lengthened to fit an operation.** EGO lengthened tokens for uploads, which gave every principal a long revocation window. A long upload is authorized as an operation of its own, with its own scope, revocable in flight. The shape of that credential is not settled.

## Decided for iMicroSeq's portal and for Stage

Decided in #182 as rules for a portal's session layer, and adopted for Stage by the developer on 2026-10-20.

6. The sign-in token is kept out of storage page scripts can read, and refreshed before it expires.
7. A session whose refresh fails ends, rather than forwarding an expired token.
8. The browser receives no token, encrypted or not. Only the server needs it.

## Recommended, not decided anywhere

9. **No token travels in a URL**, and event streams go through the server proxy too. A task in the iMicroSeq plan without a separate ruling.
10. **A server-side store keyed by an opaque id**, in an httpOnly, Secure, SameSite cookie, rather than an encrypted cookie holding the tokens. Both keep tokens from scripts. Only the store lets sign-out, or Keycloak's back-channel logout, end a session at once: an encrypted cookie stays valid until it expires, wherever a copy went. It also keeps refresh and id tokens out of a cookie's size limit.
11. **Every secret fails closed**: no default value, and refuse to start without it.
12. **Refresh on the server, ahead of expiry, one refresh at a time per session.** The standard realm issues access tokens for five minutes. Serializing matters because concurrent requests racing on a rotated refresh token can sign the person out.
13. **Cap the session at Keycloak's SSO limits** (the standard realm: 30 minutes idle, 10 hours at most), or tie its life to refresh succeeding, so the portal never believes in a session Keycloak has ended.

**One refresh at a time is not enough on its own when rotation is on.** Measured on Keycloak 26.8.0 with refresh-token rotation on: presenting a refresh token after it has been replaced ends that client's Keycloak session, though not the SSO session. A request still carrying the replaced token, from another tab or one sent before the renewed cookie arrived, must therefore get the renewed tokens rather than refresh again. Stage remembers each completed renewal for a minute to do this.

**A refresh that gets no answer is not a refusal.** Rule 7 ends a session only when Keycloak answers `invalid_grant`, meaning the refresh token is no longer good. Any other failed answer describes Stage's request or Keycloak's state rather than the person's session: a 401 `invalid_client` means Stage's client credentials were rejected, as during a secret rotation. In those cases, and when Keycloak cannot answer at all (a network error, a timeout, a 5xx), the session is kept and the refresh is tried again on the next read. Meanwhile the access token is used only while it has not expired, and a request needing it after that is answered 503. Ending sessions over an outage would sign everyone out whenever Keycloak restarts, and it would leave Keycloak's own session alive behind a portal session that looks ended. Each token request also needs a timeout, since requests sharing one refresh wait on the same answer.

## Open

17. Whether Usher's realm requirements, the per-client audience mapper among them, join Overture's Keycloak deployment standard or ship as a module of Usher's own.
18. Whether a portal registers for Keycloak's back-channel logout itself, beside Usher's controller. Usher relaying sign-outs to bridges covers enforcement. A portal with a server-side store (10) would also need it to end its own session at once, and nothing has designed that. So adopting 10 makes 18 Stage's question too.

## Why getting this right in Stage matters beyond Stage

The iMicroSeq plan moves portal-ui onto Stage's server-side pattern, with the refresh fixed. So Stage's session layer is becoming the template for the portal that will handle Indigenous health data. A defect left in Stage's pattern is one the port has to know to remove.

**Renewal is the clearest case.** Once Usher's bridges validate tokens, a session layer that does not renew its five-minute tokens would let a signed-in person lose access to controlled data five minutes in while their session still looks healthy.
