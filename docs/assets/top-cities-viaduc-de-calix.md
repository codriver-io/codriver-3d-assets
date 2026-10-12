# Viaduc de Calix, Caen

Original procedural, road-fitted model of the permanent N814 viaduct across the canal, Orne and port peninsula, built 1971–1975. It includes the later central concrete separator and omits the renovation scaffolding visible in dossier photographs 1 and 6. The supplied dossier was the starting point; no extra photographs, third-party meshes, scans or textures were used. Local screenshots and source downloads remain ignored.

## Sources and measured dimensions

[G Lacombe, PCM September 1976, pp 55–57](https://www.unipef.org/revue/fusion/810-pcm-1976-1976-09-ch00.pdf) is the main engineering source, downloaded and read as text. It resolves the apparent two-carriageway arrangement: a single upper roadway slab connects two independently supported box girders. [ARCIS](https://viaducdecalix.wordpress.com/les-caracteristiques/) confirms the length, span count and maximum girder depth; [Travee](https://travee.fr/project/viaduc-de-calix/) describes the prestressed segment structure and later strengthening.

| Quantity | Sourced value / model interpretation |
| --- | --- |
| Structural length | 1,182.60 m (PCM); mapped mean roadway 1,183.074 m, retained |
| Spans north → south | 50.3, 70, 70, 113, 156, 113, eight × 70, 50.3 m |
| Continuous slab width | 16.50 m, widening to 23.39 m at the southern end |
| Original roadway between kerbs | 13.50 m; later median divider is estimated |
| Box girder centres / external width | 9.60 m / 3.82 m |
| Ordinary bay depth | 1.90 m at closure, 4.00 m over supports |
| Main bay depth | 2.60 m at closure, 9.70 m over main supports |
| Ordinary / main pier shaft section | 2.60 m square / 2.60 × 5.10 m |
| Capital plan envelope | 4.60 m transverse, 4.60 or 7.10 m longitudinal |
| Published central road height | 38 m above canal water; distinct from navigation clearance |
| Lamps / rails / capital height | Estimated 8.5 m / 1.31 m / 1.2–1.9 m |
| Overall exported height | 46.50 m including lamps |

PCM's road-height datum is used rather than treating Wikipedia's 38 m “hauteur libre” as both road and soffit. The world-mode 38 m crest is an approximate absolute local datum; no surveyed NGF elevation or tide datum is claimed. Exact haunch curves, transitional 113 m bay depths, joints and widening onset are visual estimates constrained by the sourced section and photos. Underwater foundations, internal hollow-box chambers, signs, noise screens, port facilities and worksite controls are omitted.

Commons references were inspected as one contact sheet. Catalog provenance records every title, author and licence: Rundvald's public-domain *Caen-Calix.JPG* (duplicated in slots 2/4), Ikmo-ned's *FranceNormandieMondevilleHerouvilleViaducCalixCouchant* (CC BY-SA 3.0), Loxyger's *Viaduc Calix 01.07.2025 (1)* and *Viaduc Calix presqu'île* (CC BY-SA 4.0), and Benoit-caen's *Travaux de rénovation du viaduc de Calix juin 2026* (CC0). None is shipped.

## Geographic frame, geometry and road fitting

Source folder: `src/peregrine/landmarks/top-cities/viaduc-de-calix/`; origin `[-0.32775,49.1846]`, axes east/up/south in metres, station north to south. Rotation is baked into exports. The dossier's OSM ways 124795692, 179995298, 4577067, 179995288 and 179995294 are interpolated at common latitudes and averaged to one road frame; outline 377837685 supplies the footprint. Small shared-helper queries add mapped northern ways 211981647/124795689/211981649 and southern roadway chains including 37530754/539832770/77352787. Extracts are in this worktree's ignored scratch.

The model owns the structural outline, not port buildings. Road ramps extend 123.416 m north and 259.737 m south outside that outline, for a 1,566.227 m fitted alignment. Their narrow retaining cheeks are an estimated flat-map support treatment. Those road extensions deliberately sit outside the structural footprint; the latter is the provider building mask, and road ownership uses the separate alignment and carriageway edges. The southern widening returns to ordinary two-lane width on the outgoing approach.

The continuous slab, twin closed external box-girder lofts, deep parabolic haunches, 14 pairs of independent shafts, flared inverted-pyramid capitals, three-bar open parapets, segment seams and slender alternate-side lamps make the model recognisable from below and above. Near uses four station chunks and six materials; far merges into three materials, keeps every pier/haunch and the lighting envelope, drops paint and seams, and spaces railing posts more widely. Internal prestressing and hollow box interiors are hidden and omitted. Named palettes provide weathered concrete, asphalt, steel, dark joints, white paint and near-only self-lit lamp heads at night.

`layer.js` uses the existing registry bridge factory without shared renderer changes. One profile serves the geometry, pavement and `heightAt`, including direction and crossing-road ownership. The median is explicitly rejected because shared road-edge tolerance otherwise includes it. Pier toes carry attachment weight 0, shafts interpolate to 1, and capitals/decks carry 1, so world placement fits foundations independently from the road.

Cityscape uses 25 m entrance and 50 m crest vertical curves, with constant grade between them: 504.716 m northern and 1,061.511 m southern crest runs, maximum grades 8.133% / 3.711%. This is a flat-map compromise rather than the real embankment profile. Full 3D world uses `absolute-deck`, preserving the crest while joining loaded DEM approach datums; no terrain or latitude stretch is baked into the model and no corridor flattening is requested.

## Export costs and deterministic verification

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 39,968 | 24 | 2,529,644 | 2470.4 |
| far | 13,048 | 3 | 802,040 | 783.2 |

Both variants fit the 120k/40/4.5 MB near and 30k/10/1.2 MB far caps. These are exported mesh costs, not app-wide or Tesla hardware measurements. GLBs retain `_bridgelift`, semantic materials, finite normals and source bounds, with identical near/far envelopes. QA reports zero different-material coplanar overlaps, zero back-face hits in the coarse 18-hit ray sweep, no below-grade parts and no issues (`tmp/top-cities/viaduc-de-calix/metrics.json`).

The required focused command passed all 291 tests; the five landmark tests take under 0.5 s and measure actual slab edges, soffits, open main span, all shaft feet and capital contacts, both headings, median/crossing rejection, grade and GLB attachments. After strengthening the footing raycasts, those five tests were rerun and passed. Catalog validation passed with 222 entries / 414 variants; `pnpm assets:preview` built the local ignored catalog. `pnpm build:peregrine` succeeded with build stamp `41fe99c7c9b1`; generated renderer bundles are excluded from delivery. No full suite, installation, staging deployment or shared-file extension was performed.

## Visual evidence

Images were opened and judged against the supplied references:

- `tmp/top-cities/shots/viaduc-de-calix/iteration1/viaduc-de-calix-procedural-near-light-sheet.jpg`: overview, both sides, above, deck, underside, capital and both approaches; confirmed the single slab and independent shafts.
- `tmp/top-cities/shots/viaduc-de-calix/final-{near,far}-{light,dark}/`: exported GLB contact sheets and nine individual views each. The second iteration replaced the double median strips with one Jersey section and reduced far samples to leave budget headroom.
- `tmp/top-cities/shots/viaduc-de-calix/final-reference-comparison.jpg`: photos beside exported near/far light/dark facade, pier, underside and driving-deck views; checked haunch depth and flared heads.
- `tmp/top-cities/shots/viaduc-de-calix/final-all-views.jpg`: all exported front/back/above/street/detail views in both LODs and themes; far keeps the silhouette and negative spaces but omits fine rail posts and segment seams.
- `tmp/top-cities/viaduc-de-calix/app-sheet.jpg` and `approaches-sheet.jpg`: actual app in Cityscape and Full 3D world, near/far/street and both ends in both directions. Read back all rows; pavement reaches the fitted approaches with no visible vertical step or duplicate raised provider deck. Provider styling changes from white standard roads to the grey authored fallback at the endpoints.

## Local app and height evidence

Cityscape: **verified locally** for near/far loading, standard-road replacement, both approaches/directions and navigation surface queries. Full 3D world: **verified locally** for the same limited cases with Terrarium DEM and independent support fitting. Local app logs retain guest API/CORS errors; these did not prevent model or DEM loading. Servers are stopped after QA.

`app-city/`, `app-world/`, `approaches-city/` and `approaches-world/` contain screenshot reports. `fit-city/height-report.json` and `fit-world/height-report.json` record the actual active bridge layer, 18 carriageway queries, forward/reverse agreement, crossing rejection, and off-deck/median null. The last two supersede the earlier approach height reports, which queried the correct map surface but did not identify the layer metadata. World north/south endpoint datums were 22.459 / 12.483 m. The API returns height above local ground, not an absolute altitude; lateral DEM variation causes at most about 0.05 m endpoint difference from the centreline surface.

| Station m | Cityscape API m | World absolute deck m | World ground m | World API m |
| --- | ---: | ---: | ---: | ---: |
| 0.000 | 0.000 | 22.459 | 22.501 | -0.042 |
| 25.000 | 1.017 | 22.874 | 22.079 | 0.796 |
| 123.416 | 9.022 | 26.148 | 18.331 | 7.817 |
| 426.716 | 33.689 | 36.237 | 0.415 | 35.822 |
| 504.716 | 38.000 | 38.000 | 0.001 | 37.999 |
| 582.716 | 36.033 | 36.679 | -0.538 | 37.217 |
| 1306.490 | 9.173 | 18.643 | 9.636 | 9.007 |
| 1541.227 | 0.464 | 13.039 | 13.045 | -0.006 |
| 1566.227 | 0.000 | 12.483 | 12.513 | -0.030 |

Forward and reverse queries agree at every station on both carriageways; crossing headings, the centre separator and a point 30 m beside the crest return null. This checks the navigation surface used by route/car/camera, not a moving vehicle traversal. HD sections are zero: the local `/osm-lanes` service returns 503 without Redis, so HD pavement/paint lane count and dash continuity are **not tested**. Live traffic, halo, picking, paint toggles, mode/lifecycle stress, missing/late terrain, repeated reanchor and real hardware remain **not tested**. The absolute crest datum and ramp widths are estimates; independent visual review and coordinated release remain with the lead.

## Independent review follow-up

One revision addressed the review nits without changing structural proportions. Daytime concrete changed from warm `#a9aaa0` to cool `#a4a8a8`; near railing posts changed from 3.5 m to 7 m spacing. Near falls from 51,916 triangles / 24 draws / 3193.8 KiB to 46,564 / 24 / 2869.8 KiB (10.3% fewer triangles, 10.1% fewer bytes). Far remains 16,044 / 3 / 964.6 KiB. Draw count stays constant because rails, posts and lamp stems already merge into one steel mesh per station chunk, four in total. `b.beam` has a rectangular 12-triangle section, with no radial subdivisions to reduce; self-lit lamp heads retain their separate material for night rendering. Segment seams remain as reviewed.

Re-exported with `pnpm build:top-cities-landmarks viaduc-de-calix --no-check`. All 291 focused landmark/conformance tests passed and catalog validation passed (222 entries / 414 variants). Revised metrics report no budget overrun, overlap, back-face or below-grade artifact. The supplied `REVIEW.md` has no Prepare command; its normal preparation equivalent, `qa-metrics.mjs` plus `qa-sheet.mjs`, was rerun. Opened the new photo/near/far sheet and underside/capital/deck detail sheet at `tmp/top-cities/review/viaduc-de-calix/revised/`. The harness's green ground light still tints downward faces; actual app inspection is the colour check.

Rebuilt and reran daytime app captures in Cityscape and Full 3D world: near/far/street, both approaches in both directions, and closer underside inspection. Revised `app-sheet.jpg`, `approaches-sheet.jpg`, and `inspection-{city,world}/spot-underside-street.png` are under the same `revised/` directory. The last two render the actual loaded app scene using the registered underside inspection camera; both show neutral grey soffits and preserve the loaded placement. Both modes load the active bridge and retain the fitted pavement joins. Each mode's height report again checks 18 carriageway positions in both directions, crossing rejection and null median/off-deck ownership; endpoint datums remain 22.459 / 12.483 m in world. HD pavement/paint, moving-vehicle traversal and lifecycle stress remain not tested for the reasons above.

## Live HD lane review (REVIEW-2, 2026-10-11)

The live HD section union alternated carriageway sides at merge triangles and
included slip-road widths. Previously `fittedLateral` applied those discontinuous
sections to the whole structure, pulling kerbs, median, rails and lamps through
lanes in X shapes. The Calix profile now keeps every structural vertex in its
authored lateral frame; only the vertical approach/terrain fit changes it. Raw HD
sections still serve pavement and navigation ownership. The shared HD draping,
materials, lane layout and paint code are unchanged.

Kerbs, the central separator, rails/posts and lamps now stop at the structural
abutments (stations 123.416–1306.490 m). The 123 m northern and 260 m southern
ordinary embankment approaches have no authored raised road furniture. Their
fallback pavement and low retaining treatment remain. The engineering slab
width and southern structural widening retain the sourced proportions. This is
a visual integration approximation, not a surveyed barrier placement.

One look/fix iteration addressed REVIEW-2 only. Before → after: both approach
X patterns → no sideways deformation and no approach furniture; southeast ramp
barrier fragments → rails/kerbs end at the abutment; correctly draped HD paint →
retained. Near costs fall from 46,564 / 24 / 2869.8 KiB to 39,968 / 24 / 2470.4
KiB; far falls from 16,044 / 3 / 964.6 KiB to 13,048 / 3 / 783.2 KiB.

Evidence root: `tmp/top-cities/viaduc-de-calix/hd-review/`. Opened and judged
`glb-sheet/viaduc-de-calix.jpg` (exported near/far against the reference),
`city-on-off.jpg` and `world-on-off.jpg` (on left, off right; north approach,
north abutment, south abutment, south approach, then mid-span), plus
`street-sheet.jpg` (both directions at those four ends in both modes).
Cityscape and Full 3D world are each **verified locally for live HD paint and

World uses Terrarium DEM; both modes load 61 HD surface sections. The HD-on
screenshots preserve visible provider lane lines, merging lines and arrows;
there are no X-shaped authored barriers or southeast barrier fragments across
slip roads. Existing authored fallback pavement can still be visible in small
gaps in HD coverage at the north alignment endpoint; this is outside REVIEW-2.

`city-on/height-report.json` and `world-on/height-report.json` record seven
stations including both ends, both abutments and the crest, at lateral offsets
±3.4 m (carriageway centrelines) and 0 m (separator). All fourteen carriageway
positions return the same height in forward and reverse headings (maximum
difference 0); all seven separator queries return null. City HD endpoint surface
datums are 0.364 / 1.296 m. World DEM endpoint datums remain 22.459 / 12.483 m,
with HD offsets giving fitted endpoint surface datums 22.823 / 13.779 m. The
crest remains 38 m in Cityscape, about 37.999 m above local terrain in world.
This is surface-query and static visual evidence, not vehicle traversal.

Re-exported with `pnpm build:top-cities-landmarks viaduc-de-calix --no-check`.
REVIEW.md contains no Prepare command; its equivalent `qa-metrics.mjs --ids
viaduc-de-calix` and `qa-sheet.mjs --ids viaduc-de-calix` were rerun. Metrics report
no issues, no coplanar overlaps, no back-face hits and no below-grade artifact.
All 292 focused landmark/conformance tests pass, including the new observable
regression that applies adversarial HD ramp sections to both LODs and verifies
unchanged horizontal vertices and no raised approach furniture. Catalog
validation passes (222 entries / 414 variants), and `pnpm assets:preview` builds
the ignored local inspector. The local renderer bundle was rebuilt for QA only

left running. Night, live traffic, paint-toggle/lifecycle stress and real Tesla
hardware remain not tested for this revision.
