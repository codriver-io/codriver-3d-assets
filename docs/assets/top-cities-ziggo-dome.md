# Ziggo Dome

Dark concert-hall box with vertically striped media facade, stepped rear corners, detached glazed entrance block and two elevated connecting passages.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

OSM exterior envelope is approximately121 by91m including stair/service projections; ABT establishes a90by90m clear roof span. Hall30m; entrance29m; mapped enclosed bridges8–17m and19–22m. LED pitch is visually aggregated for driving distance rather than one emitter per lamp.

Origin 4.937095599999999,52.3134096; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -2.630604470963027 radians is baked from the two mapped control points [[4.9380805,52.3132901],[4.9367641,52.3128389]]; the host must not rotate again. Footprints replace only OSM ways 1445777925, 1445777926, 1445777927, 1445777928. No video advertising, names, logos, signs or media texture. Media facade represented by muted vertical strips in both LODs. Only the arena, entrance and its two enclosed footbridges are authored; adjoining offices and extensions remain host geometry. Comparison photos of completed building are night views.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Ziggo_Dome)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1445777925)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1445777926)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1445777927)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1445777928)
- [ABT structural designer:90m clear roof span and massed black box](https://abt.eu/en/projects/abt-betrokken-bij-realisatie-nieuwe-ziggo-dome/)
- [File:Ziggo Dome.JPG — Shirley de Jong — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Ziggo_Dome.JPG)
- [ABT project exterior photograph — Ferdy Damman, credited by ABT — All rights reserved; comparison only, no redistribution](https://abt.eu/wp-content/uploads/2024/05/Ferdy-Damman-1280x967.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/ziggo-dome.jpg`; mapped overhead: `tmp/benelux/ziggo-dome/qa/ziggo-dome-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/ziggo-dome/dark/ziggo-dome-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Reviewed the completed hall in two exterior photographs; facade strips preserve the black-box identity without branded video. Exact mapped stepped corners, entrance block and two elevated links fit the red rings; light and dark exported LODs pass.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 7334 | 5 | 93624 |
| far | 2186 | 5 | 36096 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Decimated far media-strip bays from nominal 1.6 m to 4 m before LOD coarsening and merged their widths to about 0.9 m on the main facade. Far now has 2186 triangles and clearly separated stable fins in the single fresh sheet; near remains unchanged at 7334. Replaced the old minimum-triangle assertion with checks for visible-width far strips, preserving the black envelope and excluding protected display artwork.

Fresh exported contact sheet: `tmp/followup/sheets/ziggo-dome.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 7334 | 5 | 93624 |
| far | 2186 | 5 | 36096 |

Cityscape: not tested. Full 3D world: not tested.
