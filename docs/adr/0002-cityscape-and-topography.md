# ADR-0002: Keep asset coordinates independent of Cityscape and topography

- Status: Accepted as an asset handoff and validation contract
- Date: 2026-09-28
- Related: [asset pipeline](0001-open-landmark-pipeline.md), [submission checklist](../model-submission.md)
- Availability: this document does not enable or announce Full 3D world. Its host integration and rollout are separate from publishing a model.

## Context

A building placed correctly on a flat plane may float above a slope. A bridge deformed onto every terrain sample may sink into its valley. Applying terrain height in both the model and host doubles the elevation. We need portable source assets and explicit evidence for each host mode.

## Decision

Deliver one local metric asset with an explicit base datum and structural attachment information. The host owns geographic projection, vertical placement and terrain sampling. Report validation per mode, never infer terrain support from a standalone viewer or flat Cityscape screenshot.

| Concern | Cityscape | Full 3D world / topography |
| --- | --- | --- |
| Ground | Flat local reference; structures may have authored/fitted relative heights | Shared terrain surface and a runtime vertical datum |
| Building | Rigid placement at documented base | Rigid foundation datum or explicit local pad; separate terraces if necessary; no facade draping |
| Landmark bridge | Deck fitted to approaches; supports meet its base | Explicit deck/abutment solution and support-ground contacts; do not drape the deck onto a riverbed |
| Generic bridge/tunnel roads | Host structure offsets | Bridge bank-to-bank / tunnel portal-to-portal ground datum plus structure offset |
| Navigation | Vehicle, route, traffic and camera share the fitted surface | The same surface contract, including terrain datum and structure ownership |
| Missing data | Ordinary geometry remains a fallback | Unknown elevation is not sea level; defer, retain a known fit or use an explicit host fallback |

The reusable asset’s `y=0` is not implicitly sea level. Separate ground datum, geometry height/structure offset and runtime scene-origin compensation. Apply Mercator scaling and terrain elevation exactly once. Terrain exaggeration affects the host ground; it must not silently magnify building height, bridge clearance or tunnel depth.

Keep foundations and support/deck attachments explicit. A rigid-pad landmark strategy is valid only when documented and checked at the pad edge and approaches. More detailed terrain fitting is a separate integration choice. Neither a whole-bridge flatten zone nor a center-point translation guarantees clean endpoints.

Refit from immutable authoring geometry when the terrain, road tiles, scene origin or mode changes. Avoid accumulating transforms. Road replacement is owned by the successfully loaded visible landmark and is reversible. Preserve actual HD pavement/paint continuity where supplied by the host, plus lane counts and marking phase. Other crossings and tunnels must survive replacement.

## Verification matrix

Record the tested application revision, mode, source, camera position, screenshots and numeric seam/contact measurements. Use `verified`, `not tested`, or `unsupported` explicitly. The asset library viewer has no terrain engine and reports only source/export appearance.

| Check | Required evidence when claiming host compatibility |
| --- | --- |
| Source versus exported GLB | Near/far, day/night, facade/roof or piers/deck views; recognizable silhouette and contacts |
| Flat Cityscape | Approaches/base, roadway continuity, nearby crossings and navigation surfaces |
| Full 3D world | Slope/valley placement, foundation/support contacts, both approaches, pad boundaries and terrain-relative road heights |
| Terrain changes | Missing/late terrain data, tile boundaries, mode switching, moving origin; no double elevation or cumulative deformation |
| Road detail | On/off; active supported data sources; lane paint, fallback pavement and unrelated crossings preserved |
| Lifecycle | Load failure, enable/disable, 2D transition, near/far switch and disposal restore original host geometry |
| Performance | Actual bytes/triangles/draws plus the device/context measured; do not call desktop timing a Tesla result |

## Consequences

One GLB remains useful in a standalone viewer and different map engines. Contributors can submit a good model without private app access while honestly leaving host checks untested. Maintainers need separate integration evidence before marking each mode supported. Existing models are not retroactively declared terrain-compatible by this ADR.

## Alternatives considered

- Bake terrain height into every GLB: ties portable geometry to one dataset and causes double elevation.
- Drape every vertex: warps rigid buildings and makes bridge decks follow valleys.
- Reuse a flat-world screenshot as terrain evidence: misses datum, seam and mode-transition failures.
