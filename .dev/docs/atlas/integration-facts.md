# Stating integration facts: current implementation versus durable requirement

When another team designs an interface against Stage, every fact Stage supplies is one of two
things, and they are easy to confuse while writing and expensive to confuse afterwards:

- **Current implementation.** How Stage works today. True, checkable, and possibly temporary.
- **Durable requirement.** What Stage will need from the interface regardless. The thing an
  external design should actually be built against.

A published interface designed against the first is correct until Stage changes, at which point the
interface is wrong and someone else owns the cost.

## The pattern, observed three times in one exchange

September 2026, while specifying Usher's access-management UI package with Usher's session. Each
statement was accurate about Stage as it stood, and each was supplied as though it constrained the
package's design.

| Stated as a constraint | What it actually was |
| --- | --- |
| Stage has a "browser-only client architecture" | One client-side session-validity check. Stage has a real server side and can host a bridge |
| The package must take an Emotion theme object | Emotion is what Stage uses today and has decided to leave, for shadcn and Tailwind |
| Lyric has a shadcn UI package to model this on | An open, unmerged pull request that may never land |

None was caught by the recipient, who had no way to check any of them. Two were caught here, one by
the developer.

## Why it happens, and why the recipient cannot catch it

**The honest answer from inside a codebase is a description of that codebase.** Asked "how does
Stage do X", reading the code produces the current implementation, and it arrives with all the
authority of something directly verified. The durable requirement is not in the code: it is in the
roadmap, in a decision record, or in work that has not started.

**So the more carefully the current state is checked, the more confidently it gets stated.** This is
the same shape as the stale-address failure in the agent-index conventions, where verifying that a
handle had not changed is what turned a perishable value into an apparently durable one.

**The recipient has no defence.** They cannot see Stage's roadmap, they are asking precisely because
they lack this context, and a fact from the owning team reads as settled. The error surfaces at
integration time or at migration time, well after the design has been built on it.

## The practice

**Label every integration fact as it is written**, rather than leaving the reader to infer which
kind it is:

- Current implementation, and expected to hold.
- Current implementation, and changing. Say what it is changing to.
- Durable requirement.

**Two questions before stating a constraint:**

1. Is this true of the codebase, or true of the requirement? A constraint is the second.
2. Would this still be true after the work already on the roadmap lands? If not, the roadmap's
   target is the constraint, and today's implementation is context at best.

**Worked example, the theming constraint restated correctly:**

> Wrong: "the package must take an Emotion theme object, because that is how Stage themes Arranger's
> components."
>
> Right: "the package must be themeable by a host on Emotion today and on shadcn/Tailwind after our
> migration, without re-theming in between. CSS custom properties satisfy both; a JS theme object
> satisfies only the first."

The second is shorter, more useful, and is the constraint. The first is a description of Stage that
happens to be true this quarter.

## Where this bites hardest

Stage is the first integration target for Usher and consumes packages from Arranger, so it supplies
this kind of fact often and will supply more. It is also mid-migration on its framework and its
styling system, which is exactly the condition that generates current-versus-durable confusion:
there are two true answers at once, and the checkable one is the wrong one.

Related: [`../usher/access-management-ui.md`](../usher/access-management-ui.md) for the constraints
this practice produced, and [`cross-ui-findings.md`](cross-ui-findings.md) for the separate habit of
attributing non-portable behaviour to the wrong file.
