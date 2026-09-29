# ADR-0001: Keep editable source, portable GLBs and one measured catalog

- Status: Accepted
- Date: 2026-09-28
- Scope: the public Codriver 3D asset collection
- Related: [Contribution guide](../../CONTRIBUTING.md), [placement contract](0002-cityscape-and-topography.md)

## Context

The Montréal collection grew from a single bridge into buildings and bridges with shared inspectors, source generators and multiple detail levels. A rendered screenshot alone cannot establish reproducibility, redistribution rights or app integration. Future contributions need the same explicit delivery contract, including models created in an external editor.

## Decision

Keep editable authoring source and self-contained GLB 2.0 exports, registered in one catalog with measured manifests. Prefer procedural Three.js authoring for repeatable structural geometry; accept editor-authored models with editable source and documented export steps. Runtime generation is optional for host applications that need variation, rather than the default delivery format for fixed landmarks.

Use metres in a local east/up/south frame anchored by longitude/latitude. Document the vertical origin, orientation, dimensions, references and approximations. Do not bake a particular terrain dataset or renderer’s moving datum into the reusable geometry. Preserve structural semantics, openings and attachment contacts in near/far variants.

`prototypes/assets3d/catalog.json` identifies each model and its source, rights, documentation and views. The manifest owns actual exported metrics. Validation rejects orphan models, broken paths/frames and stale costs. The public collection contains only ready, redistribution-cleared assets; an issue or draft PR can hold a proposal before it is ready. Restricted source captures never enter the public repository or deploy output.

Code and documentation use MIT; original models use CC BY 4.0. Each contributor retains ownership and public-library credit. [ADR-0003](0003-contributor-product-license.md) adds a separately accepted Codriver product license without individual product attribution; public MIT/CC BY terms remain unchanged. Geographic datasets keep their own terms. Build tooling must preserve per-model copyright and attribution in both manifests and GLB metadata; it must not reassign contributions to Codriver. Trademarks and source references are not relicensed by this policy.

GitHub supplies contribution guidance, proposal/bug issue forms, PR templates and read-only CI on forks. CI builds the library and verifies assets, documentation/skill packaging and browser behavior. Publishing uses a separate maintainer action. An accepted library model does not imply app integration or a product rollout.

## Consequences

Models are reproducible, attributable and reusable outside Codriver. Source and exports require coordinated updates; generated metadata must be included after the build. A source/GLB comparison and a catalog check establish library quality, while host-mode validation remains separately reported. These constraints can evolve through later ADRs without invalidating existing CC BY grants.

## Alternatives considered

- GLB-only submissions without editable source: harder to maintain or fix across LODs.
- Runtime procedural generation for every host: unnecessary startup/workload coupling for fixed landmarks.
- A screenshot gallery without catalog coverage checks: allows orphan exports and stale costs.
- Storing deployment/account procedures with the public builder: unnecessary for creating reusable models.
