# System alert banners from environment config: validation failure modes

Stage has no alert-banner feature today. When it gets one, these are the failure modes a sibling portal's implementation actually hit, generalized to the pattern rather than to that app: **a list of structured records supplied in a single environment variable, parsed and validated at runtime, with invalid records rejected and valid ones served.** Observed 2026-09-21 against a deployed implementation and its runtime type checker.

Runtime validation is the right call for this pattern, and worth stating before the failure modes, since all of them are about how the rejection path behaves rather than about whether to validate. The value is not known at build time, so the type system cannot reach it, and a malformed banner must not break the build or the process.

## A near-miss enum value is rejected silently, and a near-miss is what an author will type

The `level` field accepted exactly `error`, `info`, and `warning`. The value written was `warn`, which is the same word to a person and the token most logging libraries use, so it is the natural guess rather than a careless one. Validation rejected the record, no banner appeared, and nothing said why.

**For any config field that is a closed set of string literals, the accepted set has to appear where the value is authored, not only in the type declaration.** The type lives in the application repo; the value is written in a deployment config file, often by someone who will not open the source. A commented example listing every accepted value, kept beside the field in the config source, is what closes the gap.

The rejection message should also name the accepted set and the offending value. "Expected one of error, info, warning; received warn" ends the investigation. A bare validation failure starts one.

## A diagnostic logged below the environment's enabled level makes the rejection undiagnosable

This is the failure mode that cost the most time, and it is invisible in development.

| Message | Level it logged at | Visible in production? |
| --- | --- | --- |
| Attempting to gather alert banners | info | yes |
| No banners to display | info | yes |
| Why the record was rejected | debug | no, debug logging disabled |

The outcome was reported at `info` and the cause at `debug`, and production ran with debug logging off. So the symptom was permanently visible and the explanation permanently absent, in the one environment where the feature matters.

**A rejection diagnostic must log at or above the level of the message reporting the outcome.** A malformed config value is an operator error at startup, not routine chatter, so `warn` is the floor for it. The general rule: if a message explains another message, it cannot be quieter than the one it explains.

## Partitioning valid from invalid, then throwing over the invalid ones, discards the valid ones too

The implementation split the records into valid and invalid, then called a throwing validator over the invalid list to produce a descriptive error. That call sat inside the same `try` as the parse, and the `catch` returned an empty array. One malformed record therefore suppressed every well-formed record alongside it, while a comment directly above the function stated that valid alerts would still be served.

Two lessons, and the second is the more dangerous one:

- **Per-item error handling belongs inside the per-item loop.** A throwing call over the rejected set, inside the same `try` that wraps the whole operation, converts "some records are invalid" into "no records are served". Partial success has to be built, not asserted.
- **A comment claiming a behaviour the control flow contradicts is worse than no comment**, because it tells a reader the case is handled and stops them checking. The comment is where a reviewer's attention stops.

Cover it with a fixture holding one valid and one invalid record, and assert the valid one still renders. A test with only valid records passes either way, which is why this survived.

## Decide fail-open against fail-closed deliberately, because absence is not observable

An alert banner fails by not appearing, and what it usually carries is an outage or maintenance notice. So the failure lands exactly when the message matters most, and no user reports a banner they never saw. This is unlike most presentational config, where a broken value produces something visibly wrong.

Treat an unparseable alert config as loud at startup, at minimum a `warn` naming the field and the reason. Suppressing a notice quietly is the worst available outcome for this specific feature.

## Reading the value at module scope freezes it and puts configuration outside the boundary

The implementation read `process.env` directly inside the schema module and evaluated the alert array once, at module load, with the resolver closing over the result.

Three consequences:

- **Changing an alert requires a process restart**, since the value is captured once at import.
- **It is awkward to test**, because supplying a fixture means resetting module state rather than passing an argument.
- **It conflicts with a constraint this project states flatly.** `AGENTS.md` § Critical constraints requires that module code not read from the environment, and that configuration arrive at the application boundary as typed parameters.

**Stage already does this in seven places, so what follows is guidance to diverge from prevailing practice, not to avoid introducing something new.** A banner feature written in house style would inherit the freeze by default, which is the outcome this section exists to prevent. Verified 2026-09-21, all at true module scope rather than inside a function or component body:

| Location | Value frozen at import |
| --- | --- |
| `pages/api/[...proxy].ts:10` | Arranger API target |
| `pages/api/protected/[...proxy].ts:19` | Arranger API target |
| `pages/api/auth/[...nextauth].ts:15-21` | Keycloak client secret, session encryption secret |
| `global/utils/keycloakUtils.ts:4-10` | Keycloak client secret |
| `global/utils/crypt.ts:4` | access-token encryption secret |
| `global/utils/constants.ts:26` | Keycloak issuer and token URLs |
| `global/utils/egoTokenUtils.ts:29` | EGO public key |

**This is current implementation, not a durable requirement.** It is what Stage does today and intends to change, so nothing should be designed around it. The three entries holding a secret are the sharper cases, since a rotated secret does not take effect until the process restarts.

Parse and validate at the boundary, pass the validated list inward, and let the resolver read it from injected state. That satisfies the constraint and makes the fixture test above trivial rather than an exercise in module mocking.

## Transport: a structured value crossing into an environment variable has to be authored as a string

Where a deployment templating layer injects config values into environment variables, it generally renders each value through a stringify or quote step. A value authored as a native structure in the config source then serializes using the templating language's own representation rather than JSON, and the parse fails on something that looked entirely correct in the config file. The same content authored as a quoted string, or as a block scalar containing JSON text, passes through intact.

So keep the JSON as text in the config source, and verify by rendering the template and reading the resulting environment variable rather than by reading the config file.

**A second instance of the same class, from a different stack.** A mapping field named `n`, left unquoted in a YAML source, parses as the boolean `false` under YAML 1.1 rules and is then serialized by a JSON encoder as the literal property name `"false"`. The applied document carries a field nobody wrote, while the source file reads as correct. `y`, `yes`, `no`, `on`, and `off` coerce the same way. Reported from Stage's own Terraform and YAML deployment path, and reproduced there by applying both the broken and the corrected version, rather than verified here.

Both instances have the same shape: **a templating or serialization layer's own type coercion rewrites a value silently, between the file a person reads and the thing that actually runs.** The remedy generalizes with the shape. Quote anything whose type matters, and confirm by reading what came out of the render, never by re-reading the source.

One related trap, since it produces the same "I set it and nothing happened" symptom from the opposite direction: **config applied directly to a running workload is invisible to the templated deploy and is reverted by the next one**, with no error at any point. The deploy source is the only durable place to put it.

## See also

- [Cross-UI findings](cross-ui-findings.md): what is portable against what is app-specific in sibling Overture-family portals.
