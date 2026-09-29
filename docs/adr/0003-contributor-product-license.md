# ADR-0003: Separate public asset licensing from Codriver product permission

- Status: Accepted as contribution policy; signatures and authority require review
- Date: 2026-09-28
- Related: [pipeline decision](0001-open-landmark-pipeline.md), [contributor agreement](../../CONTRIBUTOR-LICENSE.md), [acceptance procedure](../contribution-acceptance.md)

## Context

The collection is open under MIT code/docs and CC BY models. Codriver wants to recognize contributors in the asset library while using accepted original contributions in its products without managing individual contributor credits in the app. Public-license metadata alone does not grant that additional permission, and rewriting copyright fields cannot establish ownership.

## Decision

Require a separate, expressly accepted contributor license for new outside contributions. It grants Codriver perpetual, irrevocable, worldwide, royalty-free commercial use, modification, distribution, transfer and sublicensing rights without individual product attribution, with a limited moral-rights waiver/consent where permitted. Contributors retain ownership; library recognition is retained. The public MIT and CC BY texts remain unchanged.

Use native GitHub declarations tied to an immutable agreement version, identified rights holders, PR and covered commit, followed by maintainer review. Store the declaration permalink with model provenance. CI does not authenticate or legally validate consent. Existing contributions are not silently opted in; any missing original-author or third-party permission remains a separate integration requirement.

Keep truthful creator copyright and public attribution metadata. The app does not need a new individual-credit UI for rights covered by this separate grant. OpenStreetMap and other third-party obligations remain independent. Asset creation skills must never accept legal terms or fabricate signatures for contributors.

The [acceptance procedure](../contribution-acceptance.md) calls for qualified legal review of the agreement and applicable signing formalities; this ADR does not assert universal enforceability.

## Consequences

Public users continue to receive MIT/CC BY rights. Codriver has a separate product-use basis only where it owns the work or has an accepted grant. Contributor acknowledgement stays in the library. Maintainers review authority and record consent once per covered submission, instead of assuming that one checkbox or a build result removes attribution obligations.

## Alternatives considered

- Blanket “everything becomes Codriver’s property”: broader than the product need and does not establish a valid assignment, moral-rights waiver or third-party rights.
- CC BY alone: preserves the public collection but does not expressly give Codriver the requested product-specific exception.
- Delete contributor copyright from exports: misstates ownership without creating permission.
- Revoke earlier public licenses or apply terms retroactively: does not produce consent or cancel existing grants.

## References

[Creative Commons: separate agreements](https://creativecommons.org/faq/#can-i-enter-into-separate-or-supplemental-agreements-with-users-of-my-work) permit additional rights alongside public licenses. Canadian [Copyright Act s.13](https://laws-lois.justice.gc.ca/eng/acts/C-42/section-13.html) addresses ownership, assignments and signed grants; [s.14.1](https://laws-lois.justice.gc.ca/eng/acts/C-42/section-14.1.html) distinguishes moral rights and their waiver from copyright ownership.
