# Christopher S. Bond Bridge, Kansas City

Original procedural model of the **2010 Kansas City bridge** carrying I-29, I-35 and US 71 across the Missouri River. This is the current single diamond-pylon cable-stayed bridge, replacing the demolished Paseo suspension bridge; it is not the bridge in Hermann. Driver recognition features are the open A-shaped upper portal, open lower diamond, two inclined semi-fan cable planes, blue steel edge girders and broad seven-lane deck. No photographs, textures, scans or third-party meshes are shipped.

## Sources and geographic frame

- [Massman Construction project](https://www.massman.net/massman-bridges/christopherbondbridge): pylon 314 ft, deck 145 ft, cable-stayed portion 1,002 ft and approach spans totalling 715 ft; composite steel/concrete construction. These are completed-project figures.
- [Parsons engineering paper abstract, TRB](https://trid.trb.org/View/1125807) and [2009 International Bridge Conference presentation](https://eswp.com/wp-content/uploads/2015/04/IBC09OnSiteBro.pdf): asymmetrical main/back spans, 550 / 451.5 ft. Early design totals differ from completed-project and mapped extents; they are not used to stretch the alignment.
- [FHWA kcICON final report](https://www.fhwa.dot.gov/hfl/projects/mo_designbuild_i29_35_kansascity.pdf): identity, project and construction context. A copy and extracted text remain in ignored scratch.
- [OSM bridge outline 708969114](https://www.openstreetmap.org/way/708969114), bridge roadways [544392690](https://www.openstreetmap.org/way/544392690) / [560399630](https://www.openstreetmap.org/way/560399630), and connected motorway approaches, extracted through the lead checkout's shared Overpass queue on 2026-10-05. Full original IDs and retained mapped lines are in `christopher-s-bond-bridge-alignment.js` / `footprint.js`. OSM road tags give three southbound and four northbound lanes.
- Reference photos, inspected in the supplied `refs-sheet.jpg`: Todd Wade, [Christopher Bond Bridge U0T7762](https://commons.wikimedia.org/wiki/File:Christopher_Bond_Bridge_U0T7762.jpg), CC BY 2.0; Smuckola, [New Paseo Bridge, Kansas City, Missouri](https://commons.wikimedia.org/wiki/File:New_Paseo_Bridge,_Kansas_City,_Missouri.jpg), CC BY-SA 4.0; Americasroof, Paseo-bridge2a.jpg, CC BY 3.0 (construction context only, with the old suspension bridge alongside). The first two Commons licences were checked against their file pages; the third photograph's supplied dossier credit was retained and it was not used for present-day geometry.

Real metres, +X east, +Y up, +Z south. Anchor `[-94.56562945, 39.1229174]` is near the tower's mapped outline notches. The pylon is on the averaged road axis, 3.65 m from that anchor. Rotation is baked once from the mapped road; station increases south to north, about 340 degrees, and positive lateral is east. The GLB contains no Mercator latitude scale or terrain elevation. Local y=0 represents the pylon footing on the flat map, not sea level. The complete mapped man_made=bridge ring is registered; no building/part extrusion was present in the supplied dossier. Modelled ramps deliberately continue outside the structural outline along the mapped highway, and the 145 ft deck width follows the contractor rather than forcing a fit to the less uniform OSM outline.

## Dimensions

| Quantity | Model | Basis |
| --- | ---: | --- |
| Pylon top | 95.7072 m | Published 314 ft, interpreted above the local footing; not a surveyed elevation datum |
| Deck width | 44.196 m | Published 145 ft |
| Cable-stayed main / back spans | 167.64 / 137.6172 m | Published 550 / 451.5 ft |
| Cable arrangement | 40 stays: 10 main + 10 back in each plane | Engineering project description and photo semi-fan pattern |
| Road surface | 25 m over local grade | Photographic estimate, not published clearance |
| Approach-inclusive profile | 1,005.255 m | Averaged mapped carriageways, clipped to approximately 350 m ramps |
| Tower station | 515.184 m | Projected outline notches on shared road axis |
| Stay-span endpoints | 347.544 / 652.801 m | Published spans about the mapped tower station |
| Ramp lengths | 347.544 m south / 352.454 m north | Cityscape convention; rounding of original sampled station gives small asymmetry |
| Maximum grade | 10.79% | Measured from the shared smoothstep deck profile; below 12% |
| Upper opening | 42 m wide at y=28, apex y=88.5 | Photographic estimate |
| Pylon section | 5.5 m along the road, hip outer width 54 m | Photographic estimate, simplified hollow-box legs |
| Slab / girders | 0.9 m slab, edge girder underside 2.55 m below deck | Estimate |
| Bents, railings, lamps, anchor sleeves | As parameterised in geometry.js | Estimates; not fabrication details |

The 1,005 m road alignment includes flat-map ramps and must not be described as the physical bridge's structural length. The supplied OSM bridge ways are about 536 m; Massman's completed total is approximately 523 m. The motorway is not rescaled to hide that discrepancy.

## Geometry, materials and LOD

The diamond pylon is a closed extrusion with **two real holes**, not overlapping beams or a solid triangular slab. Its basis preserves handedness so both broad faces and the opening walls have outward winding. The lower strut carries the deck bearings; the inclined legs sit outside the traffic lanes. Stays attach to the sloping upper legs and blue edge-girder anchor shoes. The approach column bents avoid both cable-stayed spans and the navigation channel. Both LODs retain all 40 stays, the two pylon openings, slab, girders, median, outer barriers/rails and approach supports.

Near adds floor-beam rhythm, underside bracing, rail posts, 3+4 fallback lane paint, lamps, anchor sleeves and static blue lighting panels. Far reduces floor beams and deck tessellation and removes those small fittings. Repeated components merge by material and three station chunks in near; far merges to five meshes. The local material names are `concrete`, `steel`, `cable`, `asphalt`, `rail`, `paint`, `lamp`, `glow`, with matching light/dark keys. Night panels are a static blue approximation of the real programmable lighting, without a copied photograph or texture.

Deck fitting retains `bridgeLift` (`_bridgelift` after GLB loading). Foundations have weight zero, approach shafts interpolate toward their caps, and the upper pylon follows the deck rigidly. Only thin approach slab/girder skirts extend below flat grade (minimum -2.55 m); they are intentionally buried at the ramp feet. The shared runtime preserves provider HD pavement/paint when available, and uses the authored asphalt/paint as fallback. No shared bridge file was modified.

| Export | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 40,160 | 20 | 1,948,716 | 1,903 |
| Far | 11,780 | 5 | 441,648 | 431 |

Costs are exported scene metrics, not Tesla hardware measurements or total app calls. Both are comfortably under the bridge caps (near 120k/40/4.5MB, far 30k/10/1.2MB).

## Visual and automated evidence

Scratch evidence is under `tmp/top-cities/shots/christopher-s-bond-bridge/` in this worktree.

- Looked at supplied reference sheet and `iteration1/christopher-s-bond-bridge-procedural-near-light-sheet.jpg`: all eight views, including front/back, above, driver's portal and underside. Tightened the broadside/overview cameras and reduced planar deck sampling after this inspection.
- Looked at `final/reference-comparison.jpg`: supplied reference photos directly above exported near/light overview, facade, back, roof; near/dark deck, tower detail, underside, approach; and the same eight far views. The diamond windows, semi-fans and blue girders survive far detail; no floating caps or filled portal. All four exported variant/theme contact sheets and full PNGs are retained in `final/`.
- QA exposed a reflection in the pylon extrusion frame and coplanar ramp surfaces at grade. Corrected the pylon basis, verified the ribbon winding and moved the thin skirts below grade. Final `tmp/top-cities/christopher-s-bond-bridge/qa-metrics.json`: no issues; back-face sweep 1.5% (under 2%); one sub-square-metre steel/concrete contact candidate, no large coplanar overlap; near/far bounds match.
- Required focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/christopher-s-bond-bridge/christopher-s-bond-bridge.test.js` passes **115/115**. Six fast landmark tests pin observed pylon top, cable endpoint span extents and anchor bands, both portal openings/strut/hip/apex contacts, deck raycast heights, grades/joins, mapped roadway ownership, crossing rejection, fixed footings, LOD bounds, footprint envelope, observable deck width and exported attachment attributes. No full test suite was run.
- `node scripts/asset-catalog.mjs` passes: 164 records, 292 GLB variants. `pnpm assets:preview` passes and builds local ignored catalog/inspection pages. `pnpm build:peregrine` passes; generated app bundles are removed from this landmark commit.

## App integration evidence

Local feature worktree only: standard Protomaps tiles from tiles.codriver.io. Cityscape port 3270; Terrarium terrain port 3272. Bundle stamp during QA: `97d93813b144`. No online deployment or rollout changes.

| Mode / case | Status and evidence |
| --- | --- |
| Cityscape | **Verified**: app far/near/street screenshots load active models in both LODs; `app-cityscape/` |
| Both approaches, both directions | **Verified on standard roads**: the required ad-hoc app shots in `approaches/spot-{south,north}-{south,north}-{near,street}.png`, inspected in `app-contact.jpg`; pavement reaches the ramp feet at grade, no visible step or open gap, no duplicated elevated provider bridge |
| Full 3D world | **Verified for loading/navigation with legacy corridor flattening**: `app-world/` near/far, terrain enabled and models active; tower/deck stand on the existing flattened corridor datum, group y=280.253 Mercator metres in the probe. Terrain-preserving bank/support fitting is **not certified**; this spec does not declare sea-level/absolute-deck placement |
| Height API | **Verified in each mode**: 63 probes, zero misses, including 15 mapped carriageway vertices inside the clipped alignment, 44 station/direction probes, three outside queries and one crossing heading |
| HD pavement/paint, dash phase and live lane count | **Not tested**: local `/osm-lanes` returns 503 (no Redis); fallback paint is checked only |
| Car/route/traffic/camera | Shared height API and source profile checked; actual vehicle/route/congestion drive and camera following **not tested** |
| Mode failure/lifecycle, delayed terrain, hardware | **Not tested**; shared factory retained unchanged |

Probe JSON is in `tmp/top-cities/christopher-s-bond-bridge/probe-{cityscape,world}.json`. Representative station heights (both road directions, metres relative to the active grade):

| Station m | Deck/heightAt m |
| ---: | ---: |
| 0 | 0 |
| 1 | 0.00062 |
| 60 | 1.97807 |
| 175 | 12.63250 |
| 347.544 | 25 |
| 515.184 (tower) | 25 |
| 652.801 | 25 |
| 830.255 | 12.36945 |
| 945.255 | 1.92683 |
| 1004.255 | 0.00060 |
| 1005.255 | 0 |

Both ramp endpoints have exactly 0 height in the local standard-road run. A point 60 m laterally away and a perpendicular heading at the tower return null. The same relative numbers were observed with terrain enabled; they do not assert that the legacy flattening is a survey-quality river/abutment datum.

## Limitations and review handoff

Deck clearance, tower cross sections, bent spacing, cable diameter, rail fittings and lane widths are visual estimates. The mapped outline is less uniform than the published deck width, and only the bridge plus its road-fitting approaches is modelled, without the rest of kcICON. No rivets, construction cranes, old Paseo bridge, internal stairs, signs or animated lighting. The night palette is an approximation. The legacy terrain corridor can flatten bank relief; a terrain-preserving Missouri River datum/abutment integration needs separate work and review. HD surfaces and a driven route remain unverified locally. Independent reviewer acceptance is pending the coordinator's review; exports and documentation are ready for that review.
