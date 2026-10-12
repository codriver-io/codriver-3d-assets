# Magere Brug, Amsterdam

Original procedural model of the current white-painted timber double-leaf bascule bridge across the Amstel at Kerkstraat, in its closed state. The paired arched portal gantries, longitudinal balance beams, dark lifting chains and inclined stabilisers, shallow white approach arches, dark railings and warm outline lights distinguish this crossing. No vehicle road layer is supplied: it has been pedestrian/cycle-only since 2003.

## Identity and evidence

[Wikipedia](https://en.wikipedia.org/wiki/Magere_Brug), checked 2026-10-12, identifies the present 1934 bridge, the 1969 renovation, automatic operation since 1994, pedestrian/cycle-only use since 2003 and 1,200 evening bulbs. The older 1871 nine-arch crossing is not the modeled historical state. The previous I amsterdam link redirects to a general directory and is not used as dimensional evidence.

[OSM outline 601096321](https://www.openstreetmap.org/way/601096321), from the supplied dossier, gives the owned bridge polygon including its narrowed centre. Path controls 601096320, 27311768 and 601096318 establish the station direction; `width=8.00` is a path tag, not the full outer structure width. There are no provider building parts inside the owned bridge polygon in this dossier. No neighboring abutment buildings or river/bank outlines are claimed.

| Quantity | Authored value | Evidence |
| --- | --- | --- |
| Outer station extent | -41.55 to +39.35 m; 80.90 m | Mapped OSM envelope about 80.96 m, rounded inward |
| Origin | 4.9023731, 52.36358365 | Midpoint of mapped movable path |
| Crossing bearing | 73 degrees east-northeast | Two OSM path control points |
| Fixed-deck width | 9.55 m outer structure | OSM outline about 9.8–10.0 m |
| Central leaf width | 5.00 m | OSM narrowed polygon about 5.27 m |
| Movable hinge spacing | 11.90 m | OSM movable path about 11.9 m |
| Top / fixed deck | 11.5 / 2.6 m above local support grade | Photo estimates, not survey |
| Portal arch | 4.12 m width; crown 8.70 m | Photo estimate |
| White gantry/balance proportions | approx. 7.2 m pillar above shoe, 12.5 m balance beam | Photo estimates |
| Outline lighting | Sampled individual warm bulbs, not all 1,200 | Historical count sourced; model spacing estimated |

Frame: local real metres, +X east / +Y up / +Z south, with station orientation baked into vertices. Local y=0 is the exposed foundation datum; it is neither sea level nor surveyed riverbed. No DEM or Mercator scaling is baked into GLBs. Small bank-only median terrain rings are provided, avoiding a river-centred flattening disc; this policy is unverified in the app.

Visual sources inspected: dossier `refs-sheet.jpg`, with current day photo 1 (Zairon, CC BY-SA 4.0), night photo 2 (Jorge Royan, CC BY-SA 3.0), portal detail photo 5 (Rokus C, CC BY 3.0, also opened individually), and open mechanism photo 6 (dennis22photos, CC BY-SA 3.0). Commons file links and credits are in the catalog. Historical photo 3 was compared for mechanism continuity only; dossier photo 4 is excluded as an unrelated light installation. All photo files remain ignored scratch; all geometry is original and texture-free.

## Modeling and verification

Near merges repeated white board details, hardware, railings and spherical bulb samples by semantic material. Far retains every arched opening, both portals, both counterweight systems, chains, braces, leaf railings and their terminal supports, with fewer curve/light samples and no fine hardware. Paving is a muted, smooth surface; no photo texture or false plank pattern is used. The model does not animate, reproduce chain links, precise cast iron hardware, brick coursing, weathering, the exact paving pattern, or the full bulb count. Clearance and balance hardware dimensions remain estimates.

Initial procedural sheet opened at `tmp/top-cities/shots/magere-brug/magere-brug-procedural-near-light-sheet.jpg` (overview/front/back/above/deck/underside/gantry/detail). Its recognizable arched gantries, narrowed deck and balanced white structure were compared with the references. QA identified coincident low pier shoes; these were rebuilt as full separate stone bases beneath the timber piers. Gantry shoes were moved above the paved deck and the pillars seated on them; false raised paving stripes were removed. Final exported evidence and measured results follow below.

Focused tests inspect mapped bounds, grade, all shallow arch openings, both gantry apertures, hinge supports, full polygon containment with 0.8 m provider slack, near/far silhouette and texture-free normals. Every beam, chain, brace, rail and moving leaf enumerates two named independent support ranges in the actual batched geometry; closest-triangle surface tests exclude the member itself. A deliberately shortened chain fails support contact. A terminal can be embedded within a solid support; the surface-distance tolerance is 0.36 m (largest counterweight half-thickness 0.35 m).

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. App path elevations, shared runtime shading, provider replacement, DEM footing residuals, bank pad coverage, lifecycle and device performance remain lead/reviewer gates. No app server, deployment, git write or shared runtime modification was performed.

Final exported GLB contact sheet **opened and judged**: `tmp/top-cities/shots/magere-brug/export-reference-contact-sheet.jpg`, with current closed day/night and portal photos beside overview/front/back/above/deck/underside/gantry/detail in near/far and light/dark. The second look/fix round exposed bulbs partly buried in the gantry headcaps and lights on only one portal face; bulbs now outline both faces and remain on the far balance beams and pillars at coarser spacing. Both LODs retain the open gantry passage, narrowed central double leaves, shallow waterways and named structural contacts. The smooth unweathered timber, square simplified counterweights, smooth paving and sampled lights remain visible approximations; there are no source images or textures in exports.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | ---: | ---: | ---: | ---: |
| Near | 42,956 | 5 | 1,702,876 | 1,663 |
| Far | 8,908 | 5 | 568,368 | 555 |

Final deterministic QA (`tmp/top-cities/magere-brug/qa-metrics.json`) reports no issues, zero layered/coplanar overlap pairs, no removable `bridgeLift`, local minimum y=0 and top 11.5 m; near back-face sweep is 0.6% of 165 rays, below the 2% screening threshold. Geometry-derived depth regeneration/check passes with **zero dropped cycle edges**, and only the permitted generated `src/peregrine/landmarks/depth-layers.js` shared file was modified.

Landmark tests: **6/6 pass**, approx. 0.27 seconds; its three registry conformance/source-export tests also pass. The exact requested combined test run records **469/471 pass**, with failures exclusively in other concurrent assets: `high-museum-of-art` near 76,308 triangles exceeds the 60,000 building cap, and `att-building-nashville` temporarily has ready catalog status while its spec is false. The unfiltered output is `tmp/top-cities/magere-brug/test-results.txt`. Global `node scripts/asset-catalog.mjs` and `pnpm assets:preview` were attempted and retried but blocked by the other builder's missing `docs/3d-top-cities-att-building-nashville.md`; Magere Brug's isolated catalog fallback and exported metrics passed. No unrelated files were edited to resolve those transient failures. Both-mode app evidence and independent review are still required from the lead.

Final catalog retry after the Nashville record advanced instead reports the concurrent unregistered `high-museum-of-art-far.glb`; the final Magere Brug depth check still passes. This is another outside-ownership catalog condition, not an asset omission in this deliverable.
