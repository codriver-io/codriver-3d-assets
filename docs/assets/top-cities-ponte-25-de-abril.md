# Ponte 25 de Abril, Lisbon–Almada

Original procedural model of the current 1966 suspension bridge with its 1999 railway retrofit and six road lanes. This is a road-fitted landmark, using `createRegistryBridgeLayer`; it does not add a separate preview to the application. No photos, textures, scanned or third-party meshes ship.

## Sources and identity

- [Lusoponte design and construction](https://www.lusoponte.pt/en/25-de-abril/project/design-and-construction): main/side spans, tower height and north concrete approach viaduct. Its indexed page was available; a direct page fetch returned 502 during this run.
- [Turismo de Lisboa](https://www.visitlisboa.com/en/places/25-de-abril-bridge): 1,012.88 m main span, 190.50 m tower height, 70 m navigation clearance, 0.586 m primary and 0.3544 m secondary cable diameters, 1999 road/rail retrofit. Its anchor-distance table says 2,227.64 m, whereas the commonly reported bridge length is 2,277.64 m; these differing definitions are not treated as a survey.
- [Infraestruturas de Portugal, A Obra](https://servicos.infraestruturasdeportugal.pt/pt-pt/a-descobrir/obras-de-arte/ponte-25-de-abril/a-obra): open spatial stiffening truss, towers, main cables and primary dimensions.
- [OSM roadway 10073105](https://www.openstreetmap.org/way/10073105), opposite carriageway 22286596, south A2 motorway ways 22635104, 394724380, 438739976/979/980/981/985/986, 516115155, 683823411/700 and 740479705. Support extracts obtained 2026-10-12 through the lead tree's shared Overpass helper; original dossier reused. Derived data © OpenStreetMap contributors, ODbL 1.0. Editable reduced snapshot: `ponte-25-de-abril-alignment.js`; original JSON remains in ignored scratch.
- Dossier photos, inspected as `refs-sheet.jpg`: Gologmine, *Ponte 25 de Abril in 209* (CC BY-SA 4.0); Ricardo Liberato, *Ponte Sobre o Tejo by Night* (CC BY-SA 2.0); Matt Perich, *Lisbon Bridge* (CC BY 2.0); Mike, *25 De Abril Bridge* (CC BY 3.0). Exact Commons links and credit strings are in the catalog record. No additional photos fetched.

## Dimensions and frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Main span | 1,012.88 m | Published |
| Side spans | 482.42 m each | Published; Lusoponte rounds to 483 m |
| Towers | 190.5 m | Published, above water |
| Road datum / truss underside | 80 / 70 m | 70 m clearance published; 10 m truss depth and upper surface inferred from photos |
| Deck width | 24.5 m | Common published overall width; cross-section interpreted from dossier aerial/oblique photos, not an orthophoto survey |
| Road width | 22.7 m plus narrow maintenance edges | Estimated current six-lane cross-section; no public pedestrian walk |
| Railway | Two tracks, four rails, 1.668 m gauge | OSM gauge; estimated lower-floor width and height |
| Primary / auxiliary cables | 0.586 / 0.3544 m diameter | Published |
| Primary cable sag | 104 m from saddle to midspan | Photo estimate |
| Tower station error | 1.47 m each | Published spacing centered between mapped pylons |
| Cable anchor envelope | 2,277.64 m | Common total-length convention; north anchor houses mapped, south house inferred |
| Full alignment | 3,929.38 m | Mapped roadway plus flat-map ramps, distinct from suspended bridge length |
| Flat ramps | 800 m south, 1,151.66 m north | Missing-bluff convention; 40 m end vertical curves |
| Maximum flat grades | 10.53% south, 7.20% north | Constant grades between short end curves |

Origin `[-9.17708, 38.68950]`; local metres +X east, +Y up, +Z south. Rotation is baked along the mapped motorway, approximately 350.2° northbound across the main span. No Mercator scaling or DEM heights are baked into the GLBs. A single profile supplies all structural stations, road ownership, approach fitting, car/route/camera height and the HD overlay. `fittedLateral` is identity for the rigid steel deck. South toll approaches use mapped carriageway separation; lane-derived widths there are estimates (10-lane pavement retained as a broad approach).

The model owns only mapped bridge support/anchor building extrusions listed in `footprint.js`: 326146678 (south toll canopy), 98960341/342/406, 205986120, 485126757, 485215117, 551530666, 696047686/687 and 801885031. Pier-only OSM ways determine bents but have no building extrusion to remove. The main bridge and pavement intentionally extend outside these small building-mask rings: they replace road geometry through the road layer. Nearby commercial buildings and the Alcântara interchange are excluded. North anchor houses follow their mapped station and lateral offsets; cable backstays fan into them. Exact engineering anchorage internals and the Pilar 7 visitor building are simplified.

## Geometry and LOD

Open red X-braced towers above and below the road; deep Warren truss with transverse railway floor beams; paired primary/1999 auxiliary cables, continuous anchored backstays, suspenders, two visible lower railway tracks, six upper lanes, maintenance strips, parapets and lamps. Towers use separate steel leg tiers rather than copying Golden Gate's closed Art Deco portals. Truss diagonals and cables retain negative space in both LODs.

Near batches use four station chunks, 24 cable samples per span and roughly 12.2 m truss/hanger spacing. Far uses one material batch, 10 cable samples and roughly 24.4 m web/hanger spacing; it keeps all towers, cables, rails, footings and approach bents, and drops lamps, paint dashes and fine web posts. Both LOD bounds match exactly, including the toll canopy and its posts. Six semantic material names in the palette; far uses four. Colors are muted red steel, pale concrete, gray asphalt and rails, with warm near lamp heads. Far night illumination is simplified; it does not reproduce the photographed decorative light strings. Rivets, cable bands, train overhead electrification and individual toll booths are omitted; the open toll canopy is retained.

## Verification evidence

Inspector contact sheets under `tmp/top-cities/shots/ponte-25-de-abril/`: `ponte-25-de-abril-glb-{near,far}-{light,dark}-sheet.jpg`, with overview, opposing broadside/back, above, close tower, driving deck and underside views; combined with the dossier photos in `export-reference-sheet.jpg`. The final export has a new sheet in `final/`. Screenshots were opened and compared, not merely generated. Changes from inspection: additional approach bents; pier/cap connections retained in far; separate railway members; structural faces at ramp feet removed to resolve depth cycles; the north anchor positions and cable fan corrected from the mapped support extract.

`node --test .../top-cities.test.js .../ponte-25-de-abril.test.js`: 404 passed on the final geometry (6 landmark-specific tests plus the registry conformance tests). The landmark tests observe tower bounds, span spacing, open portals, upper road/lower rail surfaces, mapped ownership, both headings, crossing/off-bridge rejection, fixed width, grades and matching LOD envelopes. Named triangle ranges test every enumerated cable segment, suspender, truss web/floor beam, tower brace, parapet run and rail terminal against its named supporting geometry, excluding itself in both LODs; a shortened hanger proves the assertion fails. Tests complete in under one second for this landmark. Shared material-depth generation/check has zero dropped cycle edges.

## Placement modes

Local Protomaps app previews, owned slot ports 3278/3280; source bundle and GLBs rebuilt, servers restarted after changes. Runtime uses the shared unlit/vertex-shaded material path. App far/near/street captures: `cityscape/ponte-25-de-abril-{far,near,street}.png` and `world/ponte-25-de-abril-{far,near,street}.png`. Approach captures in `{cityscape,world}-approaches/{south,north}-{northbound,southbound}.png` show both ends from both directions. Measured `probe.json` records live `window.__map.landmarks.heightAt`, mapped motorway ownership and world support feet.

Cityscape: verified for standard roads, near/far loading, both approaches, both headings and provider bridge removal. Full 3D world: verified for standard roads with Terrarium z15 and `absolute-deck`, without a flatten corridor. An initial world check exposed hillside cuts through the wide south pavement; the existing `lateralBankFit.terrainClamp` now maintains 0.15 m clearance at each pavement vertex. Approach undersides share their carriageway edges with the pavement, preventing an outer steel slab from interpolating above the road on a cross-slope. Dense strips and explicit constant-grade profiles follow the same surface as navigation. No new shared bridge feature was required.

HD lanes: not tested; `/osm-lanes` returned 503 on the local previews. Authored paint is a fallback and shared runtime HD draping remains active when lanes are supplied. No Tesla hardware measurements, device run, online staging deployment or independent reviewer approval is claimed.

## Final measured costs and live heights

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 72,704 | 22 | 3,053,216 | 2981.7 |
| far | 28,620 | 4 | 1,125,036 | 1098.7 |

Costs describe exported scene draws, without runtime road/tile draws; bridge budgets near 120k/40/4.5 MB, far 30k/10/1.2 MB. `pnpm assets:check`, `pnpm assets:preview`, focused tests, catalog validation and depth check pass; no dropped material cycles. Final app bundle used for QA: `1a4f15a49219`; generated bundles are excluded from the commit.

Values below use the west carriageway centre; its northbound and southbound query return the same value. `heightAt` in world mode is the lift above the query DEM; add DEM to obtain the absolute deck elevation. East-carriageway values are retained in `probe.json`.

| Station (m) | Cityscape heightAt (m) | World DEM (m) | World heightAt (m) | World absolute surface (m) |
| ---: | ---: | ---: | ---: | ---: |
| 0.00 | 0.000 | 72.690 | 0.150 | 72.840 |
| 25.00 | 0.822 | 72.945 | 0.150 | 73.095 |
| 200.00 | 18.947 | 77.993 | 0.150 | 78.143 |
| 400.00 | 40.000 | 70.837 | 5.180 | 76.017 |
| 800.00 | 80.000 | -0.555 | 80.555 | 80.000 |
| 1282.42 | 80.000 | 0.000 | 80.000 | 80.000 |
| 2295.30 | 80.000 | 0.000 | 80.000 | 80.000 |
| 1788.86 | 80.000 | 0.000 | 80.000 | 80.000 |
| 2777.72 | 80.000 | -0.070 | 80.070 | 80.000 |
| 3529.38 | 27.346 | 26.940 | 28.543 | 55.483 |
| 3904.38 | 0.562 | 40.845 | 2.167 | 43.011 |
| 3929.38 | 0.000 | 42.669 | 0.150 | 42.819 |

Both modes own all 70 mapped motorway vertices inside the final alignment, with zero misses; `heightAt` is null at the off-bridge point and crossing heading. World has no terrain pad/flatten corridor (`terrainFootprint()` null). The final near-model probe checks 840 zero-weight base vertices against the DEM: residual -0.000004 to 0.000004 m. Bases use the shared support attachment weights; there is no custom terrain mesh.

Final world approach screenshots were reopened after the terrain and underside corrections: pavement continuous in both directions, no red steel floor exposed above it, and no generic provider deck doubling. The higher north road remains an estimated flat-map ramp on concrete bents; the absolute terrain profile accounts for the real bluff. HD approach width/bank fitting remains untested because the local lane service returned 503.

## Independent review fixes (2026-10-12)

The review's broad square landings now narrow only over their terminal 180 m, to two 8.22 m wide carriageways centered on the mapped roads. This width is the standard motorway ribbon at the review camera's z17.7 (4.11 m half-width), not a surveyed lane width; SD ribbons vary with zoom. Both river-span carriageways retain [-11.35, -0.25] / [0.25, 11.35] m and six lanes. The wider south toll carriageway and mapped separation are retained. Asphalt and approach undersides follow both actual inner and outer edges, exposing the separated median instead of spanning it. Lane paint follows each carriageway. Parapets lower to their grounded 0.15 m terminal posts, and maintenance strips follow the taper. The landmark-specific unlit asphalt shader eases to the standard provider pavement palette at each landing in both themes; its provider-color mix is disabled while live HD pavement is active. No shared runtime module was changed.

The south white transverse slab was identified by an app raycast as a provider building, not a crossing road. Exact OSM way **326146678**, `building=service`, `barrier=toll_booth`, **Praça de Portagens da Ponte 25 de Abril**, is now included in `OSM_WAYS` and its full ring in `FOOTPRINTS`. Original OSM API map snapshot and reduced building rings are in `tmp/top-cities/ponte-25-de-abril/landing-{osm.xml,buildings.json}`; the shared Overpass endpoint failed twice, so a single OSM map API extract supplied the exact ring. Real crossing streets are retained, including the crossing south of the model entrance.

The remaining cream pavement patch raycast to `approach-east-0-1`: its wide concrete triangle interpolated across a terrain hollow above the asphalt. Both carriageway asphalt and concrete underside now share twelve transverse subdivisions, giving their terrain-clamped vertices the same sampling positions. Interior concrete seam walls are omitted to preserve far-LOD headroom; the bottom face and outer walls remain. No arbitrary road lowering or terrain flattening was required.

Final approach evidence is `tmp/top-cities/shots/ponte-25-de-abril/review-fix/{cityscape,world}-approaches/{south,north}-{northbound,southbound}.png`, with live `probe.json` in each folder. These views were reopened, showing the clean landing transition, open canopy and no protruding underside patch. Final near/far GLB overview, roof, deck and underside sheets are in `review-fix/export-final/`. Two look-fix rounds were used. Eight landmark tests and 398 registry checks pass; catalog coverage and depth generation/check pass with zero cycle edges. Eight canopy-column contacts now meet named roof/footing supports in both LODs; the existing deliberately shortened hanger continues to fail its support check.

Before → after costs: near 44,020 → 72,704 triangles, 22 → 22 draws, 2,001,612 → 3,053,216 bytes; far 15,128 → 28,620 triangles, 4 → 4 draws, 623,528 → 1,125,036 bytes. Both fit the 120k/40/4.5 MB and 30k/10/1.2 MB bridge budgets. Runtime seam blending adds an attribute and a simple material mix, without another mesh draw.

The final both-mode probes continue to own all 70 mapped motorway vertices with zero misses, equal forward/reverse heights and null results off-bridge or across it. World source y=0 footing samples remain planted against the DEM, with no terrain pad. HD pavement/paint and driving on device remain not tested because the local lane service returned 503; the new fallback toggle is covered by the focused test.
