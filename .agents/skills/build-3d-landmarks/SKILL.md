---
name: build-3d-landmarks
description: Build or refine recognizable 3D bridges and buildings from sourced references, with editable geometry, optimized GLBs and a catalog entry. Use for landmark contributions; host app integration needs separate validation.
---

# Build 3D landmarks

Deliver editable source, near/far self-contained GLBs, measured manifests, provenance and usable inspection views. Read the repository’s `CONTRIBUTING.md` and `docs/model-submission.md` for paths, rights and validation commands. In another repository, use its existing export/catalog conventions instead of inventing Codriver dependencies.

## Establish the asset

Identify the exact landmark and current/historical version. Inspect supplied archives before claiming they contain usable geometry. Separate reference-only material from redistribution-cleared source. A free download or AI output does not establish provenance.

Use primary project/heritage references for dimensions and photographs for silhouette. Label sourced dimensions versus estimates. Define a nearby geographic origin, metres, east/up/south axes, orientation and the meaning of local y=0. Keep terrain elevation, global Mercator coordinates and runtime scene datums out of the GLB.

## Model and export

For bridges read [bridge structure](references/bridges.md); for buildings read [building structure](references/buildings.md). Establish the recognizable silhouette before small details. Prefer procedural geometry for repetition and editable parameters; keep editor source and export steps when importing manual work.

Preserve openings, structural contacts and distinguishing features in both LODs. Merge compatible materials/geometry where it reduces draws. Prefer simple self-contained materials without new decoders. Measure actual exported default-scene triangles, draw calls and bytes. Inspect normals, winding, transforms and bounds after a GLB round trip.

## Prepare placement without claiming integration

Read [placement modes](references/placement.md). Cityscape uses a flat ground reference; Full 3D world uses terrain and a host-owned datum. Keep buildings rigid and give bridges explicit abutments/support footprints. Document the foundation plane, site relief and deck attachments needed by a host. Do not pre-drape the reusable model or assume a whole bridge can follow a valley floor.

## Catalog and verify

Register identity, generator/editable source, references, contributor credit, geographic-data license, local frame, variants, measured costs, inspection views and approximations. Only redistribution-cleared assets belong in the public collection. Follow the repository’s contributor agreement and acceptance procedure when present; record actual human/rightsholder acceptance evidence and never sign, accept legal terms or invent consent for a contributor. Keep public creator credit even where a separate license permits the host to omit individual in-app attribution.

Compare source and GLB from matching angles, near/far and day/night. Include an underside/support view for bridges and roof/opposite facade for buildings. Run the repository build and catalog checks, then inspect the actual browser result. Report Cityscape and topography separately as verified with evidence, not tested, or unsupported. The standalone inspector has no terrain engine.

Deliver file paths, preview views, measured costs, provenance and known limitations. A build or model submission does not authorize deployment or changing a host application’s access gates.
