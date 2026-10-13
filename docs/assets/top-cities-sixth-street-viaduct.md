# Sixth Street Viaduct — Los Angeles

Original procedural model of the **2022 Ribbon of Light**, connecting the Arts District to Boyle Heights over the Los Angeles River and railway corridors. It is not the demolished 1932 steel viaduct. The supplied dossier contained historical photographs, an artwork and an obsolete 46-foot width; those were excluded from the model's dimension and silhouette references.

## Sources and dimensions

Primary dimensions: [HNTB project fact sheet](https://www.hntb.com/press_release/project-fact-sheet-sixth-street-viaduct-replacement/), checked 2026-10-13, and [HNTB current project](https://www.hntb.com/projects/sixth-street-viaduct-replacement/). The [City of Los Angeles project page](https://engineering.lacity.gov/about-us/major-projects/sixth-street-viaduct-replacement-project) corroborates the arch heights, cant and cable network; its typical-span value conflicts with HNTB's, as recorded below. These are modelling references, not an engineering survey.

| Feature | Authored value | Basis |
| --- | ---: | --- |
| Arch pairs | 10 / 20 ribs | HNTB, current bridge |
| Typical arch rise above road | 9.144 m / 30 ft, seven pairs | HNTB |
| Railway arch rise | 18.288 m / 60 ft, two pairs | HNTB |
| East gateway rise | 12.192 m / 40 ft, one pair | HNTB |
| Outward cant | 9 degrees | HNTB and city |
| Transverse arch rib width | 3.048 m / 10 ft | HNTB |
| Typical / longest railway arch span | 60.96 / 76.2 m | HNTB 200 / 250 ft; city page instead says typical 300 ft; HNTB chosen |
| East gateway span | 68.58 m | Visual estimate |
| Structural deck width | 30.48 m / 100 ft | HNTB; protected bike lanes and separate walks |
| Bicycle track each side | 3.05 m | HNTB nominal 10 ft |
| Sidewalk each side | 3.54 m authored | Published varying 8–14 ft; intermediate estimate |
| Published viaduct length | 1,066.8 m / 3,500 ft | HNTB; distinct from approach-inclusive road-fit extent |
| Road-fit extent | 1,164.40 m | Mapped OSM alignment including adjoining approach roads |
| World west-to-east abutment rise | 19.2024 m / 63 ft | HNTB; applies to overall bridge, not an extra rise above the raised deck |
| Flat deck plateau / highest crown | 16.15 / 34.438 m | Deck inferred from HNTB 113 ft crown minus 60 ft rise; approximate local grade |
| Flat ramps | 190 m west, 275 m east | Simulator compromise; 25 m vertical curves; max grades 9.79% / 6.46% |
| Landing taper | Last 110 m each end; nominal 17.8 m west / 14.3 m east overall | Five-lane west / four-lane east fallback; actual HD edges fit the runtime roadway, leaving a 0.15 m kerb shoulder at each toe, expanding into bike/walk space inland |
| Bicycle access paths | 3.66 m wide; mapped west 196.46 m, east helix including connector 348.10 m | OSM dossier paths; published west 510 ft / east 790 ft describe different ramp-only extents. Grades and pier sections estimated |
| Arch/pier stations, radial rib depth | Estimated; 1.2 m radial rib | Photographic/mapped interpretation |
| Y-bents | 18 | HNTB; nine inter-arch gaps, two longitudinal Y supports each |

Alignment is copied from the supplied OSM dossier, not re-queried: ways `398814236`, `700357472`, `1106895614`, `700357386`, `700357387`. The current `man_made=bridge` outline `1068873832` is retained as a reference ID, not masked as a building. No bridge-owned `building=*` extrusion was identified in the dossier. `FOOTPRINTS` is empty and `footprintless` explicit; the road layer owns roadway replacement. The source extract is in ignored `tmp/top-cities/sixth-street-viaduct/osm.json`; attributed roadway controls ship in `sixth-street-viaduct-alignment.js`.

## Visual references and provenance

The supplied `refs-sheet.jpg` was opened before modelling. The current bridge's northeast river view, [Sixth Street Viaduct from northeast](https://commons.wikimedia.org/wiki/File:Sixth_Street_Viaduct_from_northeast.jpg), Spaghettifier, CC BY-SA 4.0, supplied `refs/5.jpg`, was used for arch-to-deck, hanger network and bent interpretation. Two additional HNTB project-gallery images were downloaded for the missing night roadway and current side views: `FINAL-Sixth-Street-Viaduct-Replacement_2.jpg` and `_8.jpg`. The gallery does not specify individual photographer or an open redistribution licence; these remain reference-only, with all original rights retained. They live only under ignored `tmp/`, and are absent from every export and commit.

No traced mesh, scan, photograph, texture or external geometry is shipped. Original procedural source and its measured exports are the deliverables. Mapped alignment © OpenStreetMap contributors, ODbL 1.0, [OSM copyright](https://www.openstreetmap.org/copyright).

## Geometry, palette and placement

Metres east/up/south around `[-118.22694,34.03806]`. The mapped roadway's curve and orientation are baked through `PROFILE.bridgePoint`; no latitude stretch, DEM or absolute height is baked into the GLBs. Local y=0 is Cityscape ground. Near uses three station chunks; far merges to one per material.

Both LODs retain every arch pair, outward cant, three crown heights, real open throats, crossing diagonal hanger network, springing blocks, Y-bent openings, deck underside beams, bike tracks, raised walks, railings, the mapped western bicycle descent and the open eastern helical descent. Near adds denser cable nodes/posts, transverse deck ribs and dashed lane paint. Far reduces arch tessellation, hanger and post spacing, simplifies underside beams and merges sidewalk concrete. Surface ribbons and arches have closed ends and outward normals.

Every retained hanger, arch foot, rail post, walkway end, longitudinal girder and Y branch has an explicitly named support; tests query that support's actual authored mesh while excluding the tested member. A deliberately shortened hanger must fail. Named support meshes and test contacts are non-enumerable authoring metadata and are not serialized into the GLBs. Footings have zero attachment lift; shafts interpolate from footing to deck, while arches and deck follow the shared road surface.

Palette uses subdued warm concrete, grey asphalt, dark slender hangers and pale metal rails. The dark palette makes the arches pale white, matching the requested white night treatment. HNTB's photographed orange accent lighting is not reproduced; this is a theme colour approximation of floodlighting, not a photometric simulation.

Main river spans retain their full width. Only the last 110 m narrows the pavement, bike/walk corridors, kerbs and rails into the street envelope. The west fallback reflects five lanes; the east fallback reflects four. A local layer adapter captures aligned at-grade approach pavement and paint through the existing shared clipping/draping path, so the actual provider colour, lane layout and dash phase continue across both abutments. It rejects a distant raised bridge sample as an ordinary street datum and ignores off-centre/wider-than-carriageway junction fans when learning terminal kerbs. The structural slab tapers to a 2 cm buried cap, and rails descend to street grade at each toe. The carriageway slab is separate from the two shoulder slabs, recessed 0.60 m under the deck (shoulders 0.45 m) so terrain at the outer walks cannot form a full-width concrete chord across the carriageway. Newly clipped outside-street vertices receive their own terrain ground height; repeated refits restore immutable offsets. Cross streets remain outside directional ownership, and provider indices restore when disabled. Fallback pavement and paint stay under the HD surface.

Full 3D world uses `absolute-deck` and a separate runtime surface: an **estimated** 77 m west ground datum, 93.15 m railway deck and 96.2024 m east structural control, blending into live DEM/road heights at both ends. The 63-foot total abutment rise is not added above the raised deck. Each support meets its own terrain sample; no corridor pad flattens the river or nearby streets. Landing crossfall/clamping uses the existing `lateralBankFit` contract. No shared bridge implementation was changed.

Approximations: arch/pier station distribution, parabolic rib profiles, radial sections, springing blocks and Y-bent sections, lane paint/dash pitch, concrete underside and landing envelopes. Five pedestrian stairways and PARC park furniture remain omitted. Both bicycle access shapes are now included: a sweeping north-west descent toward Mateo and the east-bank north-side helical path. The OSM helix is kept open in both LODs, including its deck connector; the western ramp is a sweep rather than an invented second helix. Path slabs, rail ends, posts and piers have named support contacts, with feet anchored to their local terrain and interpolated deck weights. Ramp grades, 40 cm slabs, 3.66 m widths, and support sections are simplified estimates, not a pedestrian-access survey.

## Export costs and verification

| Variant | Triangles | Mesh draws | Uncompressed GLB |
| --- | ---: | ---: | ---: |
| Near | 77,220 | 24 | 2,732,040 bytes / 2,668 KiB |
| Far | 29,288 | 7 | 986,544 bytes / 963 KiB |

Both fit the 120k/40/4.5 MB and 30k/10/1.2 MB limits. Far and near bounds agree, including the 34.438 m crown. GLBs are self-contained, texture-free, standard uncompressed GLB 2.0 with normals and `_bridgelift` attachments. These figures exclude app base-map/HD draws and are not Tesla hardware performance measurements.

Focused conformance passed **609 tests**. The **13 landmark tests** pass in about one second: arch/hanger and access-member named contacts, shortened/free-end negative controls, open helix centre and continuous path surfaces, endpoint road heights and crossing rejection, export attachment round trip, terrain support refits without accumulation, actual at-grade HD pavement/paint capture, clipped street terrain heights, and exact provider-index restoration, retained outside-street paint/pavement, lower-kerb terrain continuity and fallback asphalt clearance/restoration. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and the local Peregrine bundle build pass; deterministic `qa-metrics.mjs` reports both variants **ok**. The depth table was regenerated and checked: **zero material cycles or dropped edges**.

## Review corrections, 2026-10-13

The b8b reviewer found square pavement/kerb cutoffs at both landings and missing side bicycle ramps. The changes above address both findings. Near costs changed from 64,932 triangles / 24 draws / 2,310,988 bytes to 74,508 / 24 / 2,677,460; far changed from 22,652 / 7 / 769,880 to 27,408 / 7 / 948,608. The far asset keeps the full access silhouette within the 30k limit.

Reference sources for the access distinction: [HNTB designer article](https://www.hntb.com/designer/a-star-is-reborn/) and [Michael Maltzan Architecture project](https://www.mmaltzan.com/projects/sixth-street-viaduct/). Mapped west ways `1106890014`, `1106890013`; helical connector/turns `1425356998`, `1425356999`, `1425356997`, `1425356993`, `1425357000`, `1425356996`, `1425357001`, `1425356992`, `1425356995`. These access IDs are included in `OSM_WAYS`; none is a provider building extrusion, so `FOOTPRINTS` remains empty. The neighbour flagged in the review is retained.

Two GLB look rounds were used. Final exported sheets opened: `tmp/top-cities/shots/sixth-street-viaduct/fix-final-near/sixth-street-viaduct-glb-near-light-sheet.jpg` and `fix-final-far/sixth-street-viaduct-glb-far-dark-sheet.jpg`, each covering overview, hanger detail, helix, western descent and both landings. The first round prompted openings in the bridge rail at the mapped access forks, and shorter/buried landing caps. No further geometry look rounds were used.

## Application evidence: separate mode results

These captures use the actual application renderer and its shared unlit/vertex shading; they do not use inspector materials. The lane route is fulfilled from the real saved source through `compactLanes`, not a hand-built mesh, so these are snapshot checks rather than claims about the latest live lane archive.

Fresh eight-view landing evidence is `tmp/top-cities/shots/sixth-street-viaduct/fix-landings-sheet.jpg`: west/east, each heading, Cityscape above and world below. Source PNGs and `height-report.json` are in `fix-app-cityscape/` and `fix-app-world/`; bicycle-access views are gathered in `fix-access-sheet.jpg`. Captures centre 10 m inside each toe, at zoom 19.05 / pitch 62, with HD lanes and paint enabled. The local adapter preserves the cross streets and the surface colour through the join. The final local bundle stamp is `9d2670625501`. World footings with authored y=0 agree with the resident DEM to floating-point precision; all 38 mapped alignment controls retain matching eastbound/westbound heights, reject transverse headings, and the off-bridge query returns null. The reports include actual HD and overlay counts: 8 provider overlay draws in each captured mode, adding 5,068 triangles in Cityscape / 5,526 on terrain, separately from GLB costs. The 1,104 zero-height footing vertices sampled in world have a maximum DEM residual of 0.000004 m.

The map query stations are 10 m and 1,154.402 m, at `[-118.23281742306933,34.03825646523998]` and `[-118.22083383997769,34.03659253659034]`. Cityscape heights above flat road are about 0.19576 m west and 0.12920 m east; world west is about 0.20205 m and east is clamped to the resident street grade. Exact abutment queries are at grade. World runtime endpoint datums are approximately 76.877428 and 94.946320 m. These are sampled runtime data, not authored survey elevations.

The fx2a independent review rejected the previous landing blend and world east shoulder intrusion. The round-2 fixes and replacement evidence are recorded below; independent re-review of this revision remains pending. Latest live lane data, live route/car/traffic driving, hardware performance, full failure/mode/reanchor matrix and all stairs remain not tested or omitted as stated; local export readiness does not certify those cases. No online environment or product gate was changed. Local QA servers are stopped after capture; generated runtime bundles are rebuilt locally and excluded from the bridge commit so the lead can rebuild once after merge.

## fx2a round-2 landing correction

The clipped provider's flat pass appended outside pavement after surviving street paint, hiding centre/dash markings beyond both toes. The local adapter now retains aligned outside-street WHITE/YELLOW paint in the existing late HD marks batch, and the connected street pavement in the late surface batch so below-grade end caps cannot show through the flat street pass. Compact Uint8 colour/style slots are promoted to the Float32 overlay format; shader extrusion, distances, dash phase and paint visibility controls remain provider-owned. Street paint uses its original relative offset plus its own DEM once, and repeated ground/surface refits restore those immutable values. No new overlay draws were needed in these captures.

Pavement's 6 cm lift fades to zero over the final 5 m, joining street grade without a transverse raised cap. Paint is at least 10 cm above the actual pavement triangle at paint vertices and triangle interior/edge samples, using a cached horizontal spatial index whose heights update during refits. The 15 cm terminal shoulder and zero-height rail ends finish into the road edge. The final 8 m of world crossfall also accepts lower kerb DEM values instead of clamping them upward to the centreline, with a smooth return to the normal terrain clearance contract inland. Source junctions retain their deliberate paint clearances; no centre line is fabricated through a cross street.

On world terrain, resident HD pavement also bounds the fallback asphalt from above: endpoint, edge and interior probes recess it 12 cm below accepted HD faces. This prevents its coarser terrain chords hiding paint between samples. The fit resets from immutable authored positions and is cached by model/surface/road/terrain versions; disabling HD or removing resident coverage restores fallback geometry.

The full-width slab was split into carriageway and shoulders. Only the terminal carriageway gains 5 m longitudinal samples in both LODs; the river span, arches, network hangers and bicycle access silhouettes remain intact. Both slab components are recessed below HD asphalt. Hanger deck sockets and rail-post/cap bases extend to deck minus 0.55 m, inside the recessed shoulder slab; a vertical solid-support probe checks the hanger/post endpoints in both LODs and rejects a deliberately raised free post. This removes the beige triangular east-landing intrusion seen on the terrain captures. The generated material depth graph has zero cycles or dropped edges; deterministic `round2-qa-metrics.json` reports near and far **ok**.

Before → after: near 74,508 / 24 draws / 2,677,460 bytes → 77,220 / 24 / 2,732,040; far 27,408 / 7 / 948,608 → 29,288 / 7 / 986,544. Both remain within the bridge budgets. All **609** current top-cities conformance tests, **13** focused landmark tests, catalog validation, `assets:check`, `assets:preview`, and the local Peregrine build pass. The thirteen focused landmark tests cover compact-attribute merge, actual paint-to-pavement clearance, paint retention outside both cuts, provider-index restoration, terrain reset and repeated fitting, in addition to the original structural contacts.

Final exported near/light and far/dark six-view sheets were opened in `tmp/top-cities/shots/sixth-street-viaduct/round2-final-{near,far}/`; they include overview, hanger detail, helix, western descent and both toes. Final eight-view app evidence is `round2-landings-sheet.jpg` in the same shots root. All four landing bearings per mode were recaptured and inspected individually in `round2-app-cityscape/` and `round2-app-world/`, using the same saved OSM source and Protomaps/DEM setup as above. Final local renderer stamp: `aaea549692c9`.

These final reports show 8 overlay draws in each mode, 5,124 additional triangles in Cityscape and 5,672 in world. Both directions agree at every one of 38 alignment controls; transverse headings are rejected and the off-bridge query returns null. World is terrain-active and all 1,104 zero-height footing vertices have maximum DEM residual 0.000004 m. Toe queries retain Cityscape west/east heights 0.195758 / 0.129200 m and world west/east 0.202052 / 0 m above the resident road ground. Static captures and numerical samples do not establish live driving or hardware performance.
