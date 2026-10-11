# San Francisco–Oakland Bay Bridge, East Span

The 2013 replacement East Span, carrying I-80 from Yerba Buena Island (YBI) to the Oakland touchdown: the self-anchored suspension span (SAS) with its single four-legged tower, the twin side-by-side decks, the bike and pedestrian path, the Skyway and the approach structures at both ends. A **road-fitted bridge** in the San Francisco registry (`src/peregrine/landmarks/san-francisco/bay-bridge-east-span/`). The West Span (San Francisco to the YBI tunnel) is a separate landmark.

## Identity

- Opened 2 September 2013; the SAS is the world's longest single-tower self-anchored suspension span. White steel tower, boxes and cable; light grey concrete Skyway.
- What a driver sees: eastbound out of the YBI tunnel, the deck runs between the two cable planes under an angled canopy of suspenders, past the tower standing in the gap between the decks; then the long, low Skyway curves and descends toward Oakland. From the water or Oakland: the slender asymmetric tower, the cable that comes down to the deck far to the east, the paired white T-columns of the Skyway.

## Sources

- Caltrans SAS elevation and plan (Wikimedia Commons, public domain): 10 + 180 + 385 + 49.385 m, piers W2, T1, E2, cable crossing in plan at the tower.
- T.Y. Lin, *Seismic design of the SAS* (13 WCEE, paper 0911): 385 m main span, 180 m back span, 0.78 m cable anchored in the deck at the east bent and looped around the west bent through deviation saddles, cables not crossing at the tower (single saddle), suspenders splayed to the exterior sides of the boxes every 10 m, crossbeams 10 m wide x 5.5 m deep every 30 m, path on the south side, tower 160 m of four shafts with shear links.
- CGS SMIP04 (Maroney): each box carries a 25 m deck with five lanes, 4.8 m path on the eastbound structure; YBI transition ~467 m; Skyway spans 120–160 m, girder 5.5 m deep at mid-span and 9 m at the piers, 27.4 m (90 ft) segments, columns with four corner elements and shear walls.
- MTC/BATA fact sheets (SAS, Skyway): four tower legs and shear link beams, the cable wrapped under the western end of the deck, the cantilevered path on the eastbound (south) side, Skyway piers 45–115 ft tall with T-shaped pier tables, 452 segments.
- ASBI: four Skyway frames of 4, 4, 4 and 2 piers, 525 ft typical span, 15.5 ft path.
- OpenStreetMap (OSM API extracts, 2026-10-01, ODbL): eastbound way 237731428 and westbound way 236348361 (and the YBI viaduct / on-grade I-80 beyond), the tower outline 237735191 (`bridge:support=pylon`, `building=tower`, `height=160`), the SAS deck outlines (man_made=bridge 1000066963 / 1006027483), 20 crossbeam rectangles between the decks, the Alexander Zuckermann Bay Bridge Trail 1000067342 and the YBI ramps. Derivation: `bay-bridge-east-span-derive.mjs` (one-shot, reproducible).
- Photographs (Wikimedia Commons, local study only): Mariordo 2015 side view (CC BY-SA 4.0), *Crossing the Bay Bridge* (CC BY 2.0), *Earth Science Eastern Span DSC 0670* aerial (CC BY-SA 2.0), Leonard G. tower (CC0), helicopter views 1 and 3 (CC BY 2.0).

## Dimensions

| Item | Value | Basis |
| --- | --- | --- |
| SAS | 624.385 m = 10 (west of W2) + 180 (W2–T1) + 385 (T1–E2) + 49.385 (east of E2) | Published (Caltrans) |
| Tower | 160 m above the water; four tapered pentagonal legs, 17 x 12.4 m envelope at the base to 10 x 7.8 m at the top, open 3.4 m gaps, 2.6 m deep shear-link beams every 12 m | Height published; sections and link spacing estimated from photographs and the mapped 19.5 x 13.6 m outline |
| Tower position | centroid of the mapped outline, on the midline between the decks (0.1 m off) | Mapped |
| W2, E2 | from the tower by the published spans; 0.2 m and 0.3 m from the mapped W2 cap-beam and E2 crossbeam rectangles | Published + mapped check |
| Decks | carriageway centres 41.8 m apart (mapped), kerb to kerb 24.4 m (five 12 ft lanes, two 10 ft shoulders); SAS boxes 6.8–36.9 m off the midline, Skyway girders 4.5–34.4 m; path 4.8 m outside the eastbound box | Mapped outlines; lanes published |
| Separation on YBI | 26 m at the start of the alignment, 41.8 m from ~100 m west of W2 (the westbound viaduct climbs over the eastbound one toward the double-deck tunnel) | Mapped |
| Deck height, **real** (the exported GLB and Full 3D world) | 57 m over the SAS west end and the tower (`SPEC.realDeckM`), 1 % down to 51 m at the SAS east end, ~49 m at E3, 22 m at E16; authored ends 48 m (YBI viaduct) and 4 m (Oakland) | Estimated: deck at 0.35 of the 160 m tower on the Caltrans elevation (±3 m); tallest Skyway piers 115 ft + 9 m girder |
| Deck height, **flat-map compromise** (what the Cityscape profile draws) | 0 at the YBI foot, 29.3 m at the SAS west end (30 m PVI), 39.5 m at the tower (40 m PVI), 40 m across the main span, 21.5 m at E16, 0 at the end | Chosen for a ≤ 16 % YBI ramp, see below |
| Cable | 0.9 m tube (0.78 m published) from the saddle at 156.8 m to the outer box edges; main span sag with the vertex near E2 (29 m above the deck at mid-span), back span straighter (40 % at mid-span) | Published diameter; shape from the Caltrans elevation |
| Suspenders | every 10 m, from the cable to 0.6 m inside the outer box edge | Published spacing |
| Crossbeams | at the 18 mapped stations between W2 and E2+34 m, 10 m along, 5.5 m deep | Mapped stations, published size |
| Skyway | E3 160 m past E2, then 9 x 160 m and 4 x 122.5 m to E16; girder 5.5 m (mid-span) to 9 m (pier), parabolic haunch; columns 9.2 x 5.2 m flaring to 15.5 x 8.5 m pier tables on 19 x 13 m pile caps | Spans and depths published; pier stations estimated (not mapped) |
| Ends | YBI transition: concrete box per carriageway on single columns; Oakland touchdown: 3 m box on columns every 45 m, then fill | Estimated |

## Flat-map convention (Cityscape)

The basemap has no water, island or shore relief: roads are at `y = 0`. The alignment can only start where both carriageways run side by side: west of it the westbound viaduct climbs over the eastbound one toward the double-deck tunnel, which one station/lateral/height profile cannot represent. Rising to the real ~57 m in the remaining 224 m would need a 32 % ramp (the first version had a 32 % smoothstep and the review found it reads like a roller-coaster). So the flat-map deck is a **compromise below the real one**:

- The profile is a road profile, not a smoothstep: **constant grades between intersection points joined by parabolic vertical curves** (`bay-bridge-east-span-profile.js`: foot 50 m, SAS west crest 60 m, tower 80 m, SAS east 60 m, E16 120 m), tangent to the approach roads at both ends, meeting any loaded approach datum exactly.
- West: **15.05 %** from the YBI foot to ~30 m at the SAS west end (10 % with the HD road's 10 m generic bridge as datum), then **5.3 %** over the back span to 40 m at the tower, level across the main span.
- East: −0.9 % down the Skyway to 22 m at E16, then **4.4 %** over the touchdown onto the mapped on-grade I-80 (153 m past the mapped bridge end).
- The GLB is authored on the real profile; in Cityscape the shared fit lowers the deck to this compromise and the **superstructure moves with it** (tower weighted 0 at its foot to 1 from deck level, cable and suspenders 1): it keeps its real 103 m above the deck, so the tower top shows at 142.5 m above the water in Cityscape and at the published 160 m in Full 3D world and in the inspector. One exported GLB serves both modes; the shared fit has no "stay put" weight in world mode (weight 0 means "go to the DEM"), so the tower can only be exact in the mode the GLB is authored for.

## Full 3D world (`terrainPolicy: 'absolute-deck'`)

Adopted from the Golden Gate branch (merged): no corridor flattening; the structure keeps its authored heights above sea level, supports (weight 0) reach the local DEM, and the ramp ends take the DEM at the alignment ends without dipping below the ground. `layer.js` subclasses the registry layer and tags `_surface()` once the DEM is known, so `deckHeight(s, surface)` returns the **real** profile there (with the terrain ends) while Cityscape's plain approach pair returns the flat-map compromise; with no argument it is the authored (real) surface the GLB is built on. The tower top stays at 160 m, its foot and the pile caps go down to the bay floor (−11 to −16 m in the DEM), the W2 portal stands on the island (~21 m).

## Modelling decisions

- **Recognition features**: the tower's four faceted legs with the shear-link "ladder" in the gaps; one cable in four inclined planes from the single saddle to the outer deck edges (the X in plan), wrapped under the decks at W2 and anchored at E2; the angled suspender canopy over each deck; the twin decks with the open gap and crossbeams; the south path with its fence; the long Skyway with haunched girders on paired T-columns.
- **Layout**: the profile is the shared `createBridgeProfile` plus a station-dependent layout (`layoutEdges`): the carriageway separation follows the mapped ways and the deck widens (a gore) where the YBI westbound off-ramp (OSM 322962944) and eastbound on-ramp (329394287) meet the carriageways. `roadEdges`, `fittedLateral` and `bridgeRoadHeight` are the shared functions with these edges; HD pavement sections still win, clamped to 3 m of the layout so a trail captured on the same side cannot stretch a carriageway. No shared file was changed.
- **Lift weights**: decks, boxes and girders move with the deck (1); columns grade from 0 at the ground to 1 under the deck; pile caps and footings stay (0).
- **Path slab**: the cantilever under the path has no top face between the path surface's edges (it lay 5 cm under it and z-fought at distance); only its two margins, where the railings stand, keep theirs.
- **Far LOD**: same decks, boxes, girders, tower, cable (10 samples per half span), every other suspender, outer barriers, path fence top rail; no paint, lamps, inner barriers, fence sheets or W2 footings.
- **Materials** (both themes): `steel`, `concrete`, `footing`, `cable`, `asphalt`, `paint`, `rail`, `path`, `lamp`.

## Cost

| | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 73,304 | 33 | 2,728 KB |
| Far | 22,692 | 7 | 817 KB |

Budgets: near ≤ 120,000 / 40 / 4.5 MB, far ≤ 30,000 / 10 / 1.2 MB. Near has four spatial chunks (YBI + SAS, three along the Skyway).

## Verification

**Review fix round** (independent review PASS-WITH-NITS): the 32 % smoothstep YBI ramp became a 15 % constant grade with vertical curves on a lowered flat-map deck (real height recorded apart); the tower's leg gaps were widened to 3.4 m and the 1.1 x 1.8 m link tabs every 7 m (which read as saw-teeth on one fluted shaft) became 2.6 m deep beams every 12 m built in the tower frame; re-checked in the tower, tower-axis (driver's view along the bridge: two legs and an open slot with rungs, as in the photograph), deck and facade renders and in the app (table below).

**Inspector** (`node tmp/san-francisco/shot.mjs`, renders in `tmp/san-francisco/shots/bay-bridge-east-span/`): procedural near light: overview, facade, deck (driver eastbound), tower, underside, west, east, structure, a plan view over the tower; exported GLB: far dark facade and overview, near light skyway and structure; near dark overview and east. Compared with the Caltrans elevation/plan, the 2015 side photograph, the eastbound driving photograph, the aerial and the helicopter views. Changed because of what was seen: the pentagonal legs rendered as smooth cylinders (shared vertices): sweeps and lofts now give each face its own vertex columns; unreferenced vertices and the double-sided path fence had zero normals (GLTFExporter warnings): emitted geometry is compacted and the fence back face has its own vertices; the far model was trimmed (inner barriers, fence sheets, paint, lamps) from 24.4 k to 19.7 k triangles; the overview and east presets were reframed. The plan view reproduces the Caltrans plan (cables crossing in plan at the tower, crossbeams between the decks, path on the south).

**Tests**: `bay-bridge-east-span.test.js` (15 tests, 0.5 s; two pin the real profile and Full 3D world: authored = real (57 m), world ends on the terrain road, a synthetic DEM keeps the tower top at 160 m and gives deck − bay floor = 72 m, Cityscape lowers the tower with the deck, world → flat restores; the 13th pins the flat-map profile: ~30 m at W2, 40 m at the tower, 5.3 % back span, constant grade between the curves, tangent at the foot, `realDeckM` 57 above the flat deck): alignment = midline of the mapped carriageways (41.8 m apart, converging to 26 m on YBI, 153 m of on-grade road past the mapped bridge end); origin = tower centroid on the midline; spans 180 / 385 m, total 624.385 m, W2 and E2 within 1 m of the mapped crossbeams; four legs to 160 m with the saddle between them and no road over the tower (raycasts); road at `deckHeight` on both decks at seven stations in both LODs, an open gap between crossbeams, crossbeams under the deck, path only on the south; the cable from the saddle to the W2 wrap under the decks, suspenders at the outer edges; fourteen Skyway piers with pile caps at the water, girders 9 m deep over the piers and 5.5 m at mid-span; the deck-height contract both carriageways both directions, null across / in the gap / beside / beyond the west end, ramps meeting any approach datum, steepest grades; the YBI off-ramp on the gore, identity fit without live data, HD sections clamped to 3 m; standard road replacement and exact restore; `_bridgelift` weights in both exports (pile caps 0, road 1); the runtime layer (lazy `/models/bridges/…-far.glb`, disposal, car and route ribbon +12 cm, terrain corridor, dark palette); views. `san-francisco.test.js`: the landmark's three conformance tests pass; `node scripts/asset-catalog.mjs` passes.

**In the app** (own worktree, `pnpm build:peregrine`, servers on 3278 / 3280, `tmp/san-francisco/app-shot.mjs` plus a probe of `window.__map.landmarks.heightAt`; shots in `tmp/san-francisco/shots/bay-bridge-east-span/app/` and `world/`):

| Probe (Cityscape, near LOD loaded, approaches `[0, 0]`, no HD lanes locally) | Model `deckHeight` | `heightAt` |
| --- | ---: | ---: |
| EB / WB, s = 5 m (YBI ramp foot), both directions | 0.04 | 0.04 / 0.04 |
| s = 60 m / 120 m (YBI ramp, 15 %) | 5.27 / 14.29 | same |
| s = 224 m (SAS west end) / 414 m (tower) / 614 m | 29.27 / 39.47 / 40.00 | same |
| s = 1500 m / 2500 m (Skyway) | 34.26 / 25.43 | same |
| s = 2889 m (E16) / 3213 m (touchdown) / 3410 m (end) | 21.47 / 7.72 / 0.00 | same |
| perpendicular heading, median gap, 80 m beside | — | null |

- Far (zoom 14.3) and near (16.3) LODs load and activate; no page errors. Both ends in both directions (`west-eb`, `west-wb`, `east-eb`, `east-wb`, near and street): the deck meets the provider's standard roads at grade with no step or gap; no generic provider bridge doubles the deck (the standard roads are flat locally).
- **Problem found**: OSM maps the tower as `building=tower`, `height=160` (way 237735191) and the provider extrudes it: a plain 19.5 x 13.6 x 160 m box hides the four-leg tower in the app. The registry's road-bridge path never applies `FOOTPRINTS` (only building entries mask provider extrusions), and the fix is in a shared file (`registry-landmarks-layer.js`), so it is left to the lead (see the report).
- HD lanes (`/osm-lanes`) answer 503 locally, so HD pavement draping, `joins`/`sections` fitting and the HD approach datum (generic bridges at 10 m for layer 2, 15 m for the westbound layer 3 on YBI) are not tested. With HD, the two carriageways sit at different generic heights on YBI (10 m vs 15 m), so a single `'start'` datum (their mean) would leave a ±2.5 m step at the west joint.

| Mode | Status |
| --- | --- |
| Inspector, near/far, light/dark, procedural and GLB | Verified (screenshots above) |
| Cityscape (flat), standard roads | Verified: loads, both ends meet the roads, car/route height = deck (table) |
| Cityscape with HD lanes | Not tested (no lane data locally) |
| Full 3D world (terrain, port 3280, 'absolute-deck') | Verified for load, heights and ends (table below; `w-ybi`, `w-tower`, `w-skyway`, `w-oakland` shots): real deck, no flattening or trench, `heightAt` = deck − ground everywhere. Not checked in the app: terrain late/replaced, repeated mode switching (the world → flat restore is covered by a test) |
| MCU2/MCU3 performance | Not measured |

| Full 3D world probe (DEM from the layer's own sampling; deck = real profile with terrain ends) | Deck (m a.s.l.) | Ground under EB (m) | Deck − ground | `heightAt` EB |
| --- | ---: | ---: | ---: | ---: |
| YBI end, s = 0 | 10.67 | 9.5 | 1.21 | 1.21 |
| YBI ramp, s = 120 | 32.75 | 9.5 | 23.21 | 23.21 |
| W2 (island) | 56.23 | 22.2 | 34.04 | 34.04 |
| Tower T1 | 56.86 | −16.1 | 72.93 | 72.93 |
| E2 | 51.68 | −12.0 | 63.67 | 63.67 |
| Mid-Skyway, s = 1500 | 41.74 | −5.5 | 47.26 | 47.26 |
| E16 | 21.69 | −0.8 | 22.51 | 22.51 |
| Oakland end, s = 3413 | 4.67 | 4.3 | 0.42 | 0.42 |

In world mode the YBI ramp climbs from the island road (DEM 10.7 m at the alignment start, no HD lanes locally) to the real 57 m: steepest 23 % (about 18 % with the HD road's 10 m generic bridge as datum). The real YBI transition viaduct west of the start is not part of this landmark.

## Known approximations

- Deck heights and the Skyway pier stations are estimates (no published profile grade or pier chainage was found); E3–E16 positions follow the published span range.
- The tower legs are simple tapered pentagons; the real legs have more complex sections and a sculpted top. Shear-link spacing is estimated.
- The YBI transition structures (stacked near the tunnel, side by side at W2) are modelled only where the carriageways are side by side.
- Not modelled: the old East Span piers kept as viewpoints, the belvederes, cable bands, deviation saddles, night lighting of the tower and cable.
