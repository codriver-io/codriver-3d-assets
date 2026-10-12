# Pennybacker Bridge, Austin

Original procedural model of the current 1982 Loop 360 crossing of Lake Austin, also called the 360 Bridge. Two rust-coloured arch ribs form one through-arch span, with horizontal Vierendeel struts, vertical strand hangers, an unobstructed navigation channel and concrete approach spans. The surrounding limestone cliffs belong to the terrain provider and are not baked into this asset.

## Sources and dimensions

The primary engineering reference is [TxDOT's construction presentation](https://ftp.txdot.gov/pub/txdot-info/brg/texas-steel/2022/nov/steel-arch-bridges-in-texas-pennybacker-bridge.pdf), downloaded and read in ignored scratch on 2026-10-12. The [AIA Austin architecture guide](https://guidetoaustinarchitecture.com/places/pennybacker-bridge/) confirms the through-arch form, weathering steel and open transverse struts. [LCRA](https://www.lcra.org/water/dams-and-lakes/) supplies the Lake Austin full-pool elevation. The published total length is from the [Pennybacker Bridge summary](https://en.wikipedia.org/wiki/Pennybacker_Bridge); the total is not the arch span.

| Feature | Value used | Basis |
| --- | ---: | --- |
| Main arch span | 182.88 m / 600 ft | TxDOT |
| Deck width | 26.5176 m / 87 ft | TxDOT; takes precedence over an aerial-width estimate |
| Arch box width/depth | 1.2192 × 3.3528 m / 4 × 11 ft | TxDOT; depth applied vertically in the simplified ribbon |
| Hangers, near | 18 groups × four = 72 | TxDOT |
| Strand diameter, near | 0.05715 m / 2.25 in | TxDOT; far uses 0.095 m for visibility |
| Lane count/nominal width | Four × 3.6576 m / 12 ft | TxDOT; remaining width allocated to median, shoulders and walk |
| Raised east walk | Approximately 1.81 m / 6 ft | TxDOT nominal width; photographic placement |
| Floor-beam depth | 2.1336 m / 7 ft | TxDOT |
| Concrete approach spans | Three south, one north | TxDOT; individual lengths estimated |
| Published overall structure | 350.52 m / 1,150 ft | Summary; mapped roadway extent is 352.152 m, 0.47% longer |
| South approach spans | 46.264 m each | Three equal divisions of mapped shore extent; estimated |
| North approach span | 30.48 m | Estimate from photos and mapped north bank |
| Arch centreline rise | 50 m, from a 3 m local springing | Photographic estimate; not a surveyed height |
| Crown, local flat frame | 54.6764 m | Estimate including half the box depth |
| Deck, flat frame | 21.336 m / 70 ft | Photographic height estimate; conflicting clearance summaries are not treated as a survey |
| World lake datum | 150.20544 m / 492.8 ft | LCRA full pool; approximate compatibility with DEM vertical datum |
| World central deck | 171.54144 m absolute | Lake datum plus estimated deck clearance |
| Flat approach ramps | 320.016 m south / 320.002 m north | Mapped road frame; cubic profile, steepest 10.001% |
| Road-fit/model extent | 992.170 m | Includes both flat-map ramps and mapped bridge |
| Bearing toward north | Approximately 28.9° | OSM road controls; baked into geometry |

Dossier OSM snapshot is retained in ignored `tmp/top-cities/pennybacker-bridge/osm.json`; the relevant attributed polylines are editable in `pennybacker-bridge-alignment.js`. Origin `[-97.797196,30.349475525]` is the mean midpoint of the two mapped carriageways. Owned ways are 708944434 (outline), 177701858 and 126746778 (bridge carriageways), and 150438107, 368648297, 436733825, 436732065 (approach controls). No mapped building extrusion belongs to the structure; `FOOTPRINTS` is empty and roadway replacement uses the road layer.

Reference photographs, viewed in the supplied sheet and final comparison: [PennybackerBridge](https://commons.wikimedia.org/wiki/File:PennybackerBridge.jpg), Dbtfz, public domain; [Pennybacker bridge sunset 2006](https://commons.wikimedia.org/wiki/File:Pennybacker_bridge_sunset_2006.jpg), Larry D. Moore, CC BY 4.0; [360 Bridge - panoramio (2)](https://commons.wikimedia.org/wiki/File:360_Bridge_-_panoramio_(2).jpg) and [360 Bridge - panoramio](https://commons.wikimedia.org/wiki/File:360_Bridge_-_panoramio.jpg), Todd Dwyer, CC BY-SA 3.0; [360 Bridge Sunset, Austin TX](https://commons.wikimedia.org/wiki/File:360_Bridge_Sunset,_Austin_TX.jpg), sbmeaper1, CC0. The dossier's portrait of Percy Pennybacker was excluded from the structural study. Photos/PDF remain ignored; no texture, scan, traced mesh or third-party geometry is shipped.

## Geometry and placement

Metres east/up/south, local grade y=0, no latitude stretch or absolute elevation in GLBs. `createBridgeProfile` supplies one station/lateral frame for geometry, road replacement and navigation. Steel deck width is rigid outside the outer 50 m landing zones. The land-ramp pavement and slab split into separate ribbons, following mapped carriageway alignment over the ramps and tapering their widths over the last 50 m; only these noses fit provider width samples. Standard-road noses use the renderer's current motorway ribbon width, and their pavement colour blends to the provider palette. Median and transverse roads reject vehicle-height ownership. The road layer uses the existing registry bridge factory; a landmark-local `_surface` selects the world datum. No shared bridge extension was needed.

Two continuous extruded arch boxes avoid segment overlap seams. Nine transverse struts touch the ribs, with no roof X truss. Four long stringers, 18 floor beams and below-deck X wind bracing distinguish the underside. Paired near hangers attach inside the ribs and floor beams, including their first and last stations; far retains 18 paired stations and 36 visible strands. Shore-only concrete bents and arch footings have fixed ground attachment, shafts interpolate to the deck, and upper members follow the accepted deck. No lake pier. Sidewalk, central/edge barriers, rail posts, concrete bents and lane paint are merged into three near station chunks; far uses one batch per material, fewer posts/stringers and no fallback paint.

Palettes use subdued weathering brown, grey zinc strands, warm concrete and pale concrete pavement, with dimmer materials at night. Night is an unlit bridge approximation; invented architectural floodlights are omitted. Estimates include parabola, box orientation along its slope, strut pitch, hanger pitch, shoulder distribution, footing and bent shapes, landing widths without HD coverage and minor fittings.

Full 3D world uses `absolute-deck`: the bridge does not flatten a corridor through the limestone bluffs or river. Each support meets the resident DEM; ramp ends blend to the bank roads. `lateralBankFit.terrainClamp` keeps the accepted road above the DEM, with 0.22 m clearance because authored fallback pavement lies 0.12 m below the accepted surface. Ramp slabs and pavement share longitudinal and transverse samples (2 m near, 4 m far) so the concrete cannot intersect the pavement after fitting. This grid is retained in far for terrain continuity rather than discarding it for a lower triangle count. Terrain supports and approaches are not survey-accurate.

## Costs and verification

| Export | Triangles | Draws | Uncompressed size |
| --- | ---: | ---: | ---: |
| Near | 36,300 | 15 | 1,306,436 bytes / 1275.8 KiB |
| Far | 15,908 | 6 | 509,684 bytes / 497.7 KiB |

Both variants fit the 120k/40/4.5 MB and 30k/10/1.2 MB bridge budgets. No textures, compression extensions or decoder. Test-only member contact metadata is non-enumerable and omitted from GLBs. Attachment attributes, normals, palettes, bounds and shape survive GLB round trips.

The focused registry and landmark command passed 486 tests (fourteen landmark-specific). Tests measure actual triangles for every named hanger, arch rib, Vierendeel strut, wind brace, rail, walkway, stringer, floor beam and bent end; same-material supports exclude the member faces, and shortened hanger/strut negative cases prove detached ends fail. Raycasts verify both crowns, open throat, driving surface and empty lake channel in both LODs. Road tests cover both directions, both approaches, crossing/median/off-bridge rejection, rigid width and separate world datum. Terrain-clamp and transverse-valley regression tests require the actual fitted fallback pavement to clear a synthetic DEM and navigation to read the same surface; the valley test also requires the actual fitted concrete to remain below pavement in both LODs.

`node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview`, bundle build, generated depth-table check and deterministic `qa-metrics.mjs` pass. Depth generation drops zero cycle edges. Final QA metrics report no coplanar overlaps, no unresolved layered surfaces, no unsupported member-end flags and no backface sweep hits. Generated renderer bundles are not committed.

Visual evidence is under ignored `tmp/top-cities/shots/pennybacker-bridge/`: `near-light/`, `near-dark/`, `far-light/`, `far-dark/` contain exported GLB shots and sheets; `reference-comparison.jpg` puts all four variants beside the supplied photos. Views cover overview/front, back, above, deck, underside and arch/hanger detail. All sheets were opened. The first mechanical pass removed a rail/concrete material cycle and fixed the raised walk's slab contact. World captures revealed terrain piercing a coarse north ramp: corrected the fallback clearance and made concrete/pavement use the same transverse and longitudinal grid. Final exported and app captures were opened again after that change; `reference-comparison.jpg` and `final-approaches-sheet.jpg` and `final-app-modes-sheet.jpg` were inspected, and the north-ramp patches are resolved.

## Application verification

Cityscape: **verified locally** for near/far models, standard-provider replacement, both approaches/directions and height queries. Full 3D world: **verified locally** for model rendering, limestone-bank fit, resident DEM footing contacts, both approaches/directions and height queries. These are scoped local checks, not production or HD rollout certification.

No shared renderer or product-gate change. HD provider verification is **not tested**: local `/osm-lanes` returns 503 without Redis. Live route/car driving, account-gated production rollout, failure injection, theme/paint switching and Tesla hardware remain **not tested**. The factory supplies the existing shared navigation, loading, clipping, LOD and reversible masking implementation.

Both modes have `app-<mode>/pennybacker-bridge-{far,near,street}.png` and four approach images `app-<mode>/approach-{north,south}-{28.9,208.9}.png`, capturing both banks in both travel directions. Native screenshots, not only the inspector, establish the runtime material path and standard-provider replacement. Full height-query evidence, all mapped alignment vertices in both carriageways/directions, rejection probes and per-footing samples are in `app-<mode>/surface-check.json`.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` values below are height **above the rendered local ground** in world, and local flat height in Cityscape; reversing heading gives the same result. They are not absolute elevations. World `_terrainReady` and layer `active` are true; approach datums are 168.017869/181.686756 m. The lake's DEM samples are about 147.28 m, which differs from LCRA's 150.20544 m datum and is not a measured water-level correction.

| Station m | Cityscape both lanes | World d=-5.5 m | World d=+5.5 m |
| --- | ---: | ---: | ---: |
| 0 | 0 | 0.2200 | 0.4339 |
| 160 | 10.6672 | 6.6055 | 6.5139 |
| 320.016, south structural end | 21.336 | 18.5511 | 18.3773 |
| 458.808, south arch foot | 21.336 | 23.6788 | 23.7502 |
| 550.248, arch midpoint | 21.336 | 24.2635 | 24.2641 |
| 641.688, north arch foot | 21.336 | 20.0186 | 16.5226 |
| 672.168, north structural end | 21.336 | 0.5851 | 0.5336 |
| 832.170 | 10.6679 | 0.2200 | 0.2200 |
| 992.170 | 0 | 0.2200 | 0.2200 |

Median and lateral 18 m return null in both modes. World base contacts across 192 bottom vertices match the same resident DEM within 0.000008 m numerical residual; this tests fitting, not real-world survey accuracy. No terrain pad is used, so there is no flatten-pad lattice coverage to certify. The south toe has up to 0.434 m deck-to-ground offset from its lateral slope; this is within the footing tolerance but does not certify a seamless HD pavement/paint join. Independent reviewer signoff and public/app release are separate from asset readiness.

## Independent-review landing fix (2026-10-12)

The b6b reviewer accepted the rust arch, hangers and limestone-bank fit, and requested removal of the square width steps at stations 0 / 992.170 m. The two ramp ribbons now follow the mapped divided Loop 360 approaches; their final 50 m taper into the connected carriageway widths. Asphalt and concrete use matching split transverse terrain grids (2 m near / 4 m far), retaining the previous bank clamp. Walk and outer barriers taper with the pavement, ending on the slab 10 m before each nose; rails end in explicit posts. The central barrier ends on the structural slab before the divided land-ramp gap. The 182.88 m arch, rigid river deck, footing attachments, lake datum and approach height profile are unchanged.

The source OSM dossier already contained the north continuation; its relevant controls and way ownership were added (368648296, 436640997/998/999, 692695942, 976239611/612). No provider building part overlaps the model, so no building footprint was introduced. South nose carriageway centres project to −20.567 / +13.961 m lateral, and north centres to −11.023 / +12.756 m. Authored fallback ribbons are 9 m wide; runtime standard widths follow the current road shader, while HD can supply measured edges. Ownership uses the same landing edges as navigation and a 27 m outer envelope for the separated south carriageways.

Before → after: near 35,256 → 36,300 triangles, 15 → 15 draws, 1252.5 → 1275.8 KiB; far 15,392 → 15,908 triangles, 6 → 6 draws, 485.2 → 497.7 KiB. Fourteen focused landmark tests pass, including actual pavement raycasts at both divided noses, median rejection, changing provider widths, repeated refits and rigid-arch preservation. All 472 registry tests pass; catalog validation, asset previews, depth generation/check and QA metrics pass with zero cycles or geometry flags.

Review-fix evidence is retained under `tmp/top-cities/shots/pennybacker-bridge/review-fix/`: exported near-light / far-dark sheets, both approach directions in `cityscape/` and `world/`, and per-mode `surface-check.json`. These captures supersede the old slot-B approach shots for this landing revision. HD lane service, live vehicle motion and Tesla hardware remain not tested.

The widened divided south toe exposed a downhill crossfall that the old positive-only terrain clamp could not follow (1.266 m above local DEM on one carriageway). The landmark-local ground adapter now blends negative crossfall into the same 50 m landing zone; geometry and navigation both use that adapter. It preserves the original positive clamp and leaves all structural span/support stations untouched. Regression tests require both hillside signs to meet local DEM + 0.22 m at each toe, and actual pavement supports all 40 in-extent OSM roadway vertices in both LODs. Final application height probes cover those same 40 mapped vertices in both headings, in both modes. No shared runtime module was changed. Final QA bundle: `c79922872a2b`.

Final review-fix live results: Cityscape has 40/40 mapped roadway vertices with non-null heights in headings 28.9° / 208.9°, all four nose-centre heights 0 m; world has 40/40 with non-null heights in both headings, all four nose-centre heights +0.22 m over the local DEM. The 192 ground-attached vertices remain within ±0.000008 m of resident DEM. `review-fix/approaches-sheet.jpg` was inspected with world in its first two rows and Cityscape in its last two; north precedes south, and headings 28.9° / 208.9° occupy the left / right columns. Both final exported sheets were also opened. These final results supersede the earlier baseline point table at the changed ramp toes.
