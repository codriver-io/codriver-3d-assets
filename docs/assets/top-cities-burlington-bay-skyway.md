# Burlington Bay James N. Allan Skyway

Original procedural model of the twin high-level QEW bridges over the Burlington Canal, Burlington–Hamilton, Ontario: the **1958 Toronto-bound arched through-truss** beside the **1985 Niagara-bound box-girder bridge**. The open steel crown and long rising approach viaducts distinguish this crossing from the separate Burlington Canal Lift Bridge, which this model does not own.

Sources: [Passfield 2007, Canadian Journal of Civil Engineering](https://historicbridges.org/quebec/iledorleans/bio.pdf), [Bassi, Lin & Holowka 1985 engineering paper abstract](https://trid.trb.org/View/270976), [identity and dimensions](https://en.wikipedia.org/wiki/Burlington_Bay_James_N._Allan_Skyway), OpenStreetMap carriageways and structural outlines, and the three attributed reference photographs in the catalog record. Photographs stay in ignored scratch; none ship as textures or traced meshes.

| Dimension | Model | Basis |
| --- | --- | --- |
| Central canal span | 151 m | Published 495 ft / 151 m |
| Original back spans | 83.7 m each | Published; total central unit 318.4 m |
| Original soffit at crest | 36.7 m | Published clearance (brief rounded to 36.6 m) |
| Road crest | 39.2 m | Clearance + estimated 2.5 m girder depth |
| Arch crown | 64 m | Published overall height |
| Newer deck width | 21.25 m | 1985 engineering paper; supersedes dossier's generic 30 m |
| Original deck width | 20.4 m | Estimate from mapped structural outline and four-lane photographs |
| Deck centre spacing | 25 m | Mapped/photo estimate |
| Main truss panel count | 24 | Photo-based estimate; both chord planes and open webs retained far |
| Original / newer structural length | 2560 / 2215 m published | Actual mapped ends used; newer continuation is retaining fill |
| Approach pier rhythm | 31.5 m original / 48 m newer | Estimate |

Frame: local metric +X east, +Y up, +Z south, origin `[-79.79775421,43.29945]`, midpoint of the mapped QEW carriageways at the canal. Alignment samples both OSM carriageways at every mapped latitude; the GLB follows their real bearing (about 337°), with no baked Mercator scale. OSM ways 24383761, 25514592, 24383647 (original), 24384193, 24690493, 155736565 (newer), and adjoining 24383762 / 337262624 supply the road frame; outlines 1128114243 / 1128114244 supply extrusion ownership. The independent lift bridge and local Eastport Drive stay outside it.

The original central unit has curved upper/lower steel chords, web diagonals, vertical deck hangers, overhead sway portals, floor beams and two concrete pier portals with curved soffits. The later unit has steel approach box girders and deeper, haunched concrete main-span boxes. Each deck has a separate slab, open gap, four fallback lanes, barriers and outer lamps. The near model splits three station chunks; far merges material batches, omits secondary counterwebs, simplifies surface samples and keeps every main arch chord/web, pier and the twin-deck gap. Member sections, truss tessellation, girder haunches, pier shapes and lamps are visual estimates, not engineering fabrication data. The paints are fallback only: the shared bridge runtime retains actual HD pavement and paint when available.

Both landings taper only over 150 m onto the mapped carriageway centres and live provider width. Barriers sink into the pavement over 25 m, and pavement colour blends into the standard road at the noses. River spans retain their authored widths. Flat Cityscape uses a 6 km crest radius, constant grades and short 65 m sag transitions; modelled alignment is 2563.38 m, with a 1416.40 m southern ramp arm and a 1146.98 m northern arm; maximum tangent grades are **3.096% south / 4.050% north**, both comfortably under 12%. The mapped newer structural unit is 2219.28 m (within 4.3 m of the published 2215 m).

Full 3D world uses **bank-fit**, because Lake Ontario is roughly 75 m above sea level and the reusable model's zero is water, not sea level. Explicit bank/canal controls hold the crossing above water without flattening the corridor; each support foot samples the DEM independently. The two central controls query the same nearby open-water location, avoiding bridge/ship artefacts in the DEM. Terrain and approach heights are composed by the existing runtime surface; no shared bridge files are modified.

## Verification and measured costs

Near **52,244 triangles / 18 draws / 2,221,160 bytes (2169 KiB)**; far **19,248 / 5 / 949,172 bytes (927 KiB)**. Both are within 120k/40/4.5 MB and 30k/10/1.2 MB. Identical near/far bounds; crest 64.0 m, lowest geometry −0.508 m (buried landing fill), no below-grade exposed member.

 First visual contact sheet inspected: `tmp/top-cities/shots/burlington-bay-skyway/r1/burlington-bay-skyway-procedural-near-light-sheet.jpg` (overview, facade, back, plan, deck, underside, detail, approach) against the dossier's `refs-sheet.jpg`. It showed the correct asymmetric twins and open arch, but the original main pier caps were too rectangular; they were changed to curved portal soffits matching the construction photo. Far surface sampling was reduced for budget headroom.

Final exported GLBs inspected in `tmp/top-cities/shots/burlington-bay-skyway/verified/`: near-light sheet (facade/back/deck/underside), far-light, near-dark and far-dark sheets, and `compare.jpg` with all four LOD/theme elevations beside the Poke958 photograph. The arch silhouette, open channel, twin gap, web pattern, portals, supports and night palette survive export. The source overview and plan are in `r1/`; the export overview/plan/detail and approach sheets are in `final/`. The coarser far arch keeps the same crown and main webs; fine counterdiagonals and lane dashes drop.

Depth verification found a cycle between independent pavement and slab faces. The final road is a physical slab with asphalt **top faces** and concrete underside/edges, rather than a thin surface over a second slab top. The support fill stops before it dips below grade. Regenerated `node scripts/landmark-depth-layers.mjs --ids burlington-bay-skyway` and `--check`: **0 cycle edges**, current table. `qa-metrics.mjs --ids burlington-bay-skyway`: **no issues**, zero coplanar area, zero unsupported-member candidates near/far and 0% back-face hits across the sweep. Generated depth table is left for the lead to regenerate and commit; it is not included in the landmark commit.

The map uses the shared unlit/vertex-shaded runtime. `app-cityscape/` and `app-world/` contain unobstructed shots `south-northbound`, `south-southbound`, `north-northbound`, `north-southbound`, `canal-northbound`, `canal-southbound`; `south-landings.jpg` / `north-landings.jpg` were read to compare both modes. Both noses follow the actual basemap ribbon widths and colour with no visible gap, step, apron, doubled bridge deck or buried lane paint. The lower Eastport Drive / lift bridge crossing remains present. `app-cityscape/burlington-bay-skyway-{far,near,street}.png` also verifies far/near lifecycle and the truss at street scale; `app-world-standard/` contains the same far/near/street views, all active (far, near, near respectively), with `report.json`. A concurrent browser capture closed once under host load; the sequential retry completed and its report is the final evidence.

`app-probe.mjs` and each mode's `probe.json` (ignored scratch) queried all **34 in-range mapped QEW vertices in both headings**, 68 queries per mode, **zero nulls**. At 11 sample stations the two carriageway centres return the same height in either driving heading; median, off-road and crossing headings return null. Cityscape reads exactly the authored deck. World values below are **metres above the queried local ground**, so they vary with the DEM under each carriageway even though the canal datum is shared.

| Station / feature | Authored and Cityscape | World newer / original |
| --- | --- | --- |
| 5 m / south nose | 0.00 | 0.01 / 0.01 |
| 85 m / south taper | 0.86 | 0.96 / 0.96 |
| 250 m / south approach | 5.96 | 6.25 / 6.25 |
| 1257.20 m / truss starts | 37.09 | 38.60 / 38.58 |
| 1340.90 m / south canal pier | 38.72 | 42.65 / 42.57 |
| 1416.40 m / canal crest | 39.20 | 39.80 / 39.90 |
| 1491.90 m / north canal pier | 38.72 | 36.77 / 36.97 |
| 1575.60 m / truss ends | 37.09 | 33.92 / 33.55 |
| 2313.38 m / north approach | 7.80 | 8.86 / 8.86 |
| 2478.38 m / north taper | 1.12 | 2.05 / 2.07 |
| 2558.38 m / north nose | 0.00 | 0.06 / 0.06 |

Focused landmark tests cover sourced dimensions, canal clearance/openings, asymmetric twin decks, named terminal contacts in both LODs (including a deliberately shortened web failing), mapped road queries / heading rejection, full local corridor containment, landing-only fitting, stable refits and exported attachment weights. `node scripts/asset-catalog.mjs` / `pnpm assets:check` pass (425 entries / 832 GLB variants), and `pnpm assets:preview` builds the local inspector. **Five own landmark tests and all three id-filtered registry tests pass.** The filtered registry checks spec/catalog, sound geometry and near/far silhouette/budgets, plus exported GLB/manifest/source agreement.

World footing probe: `app-world-feet/probe.json` checks **1488 planted vertices** whose immutable authored y=0 and bridgeLift=0; maximum local DEM residual **0.00000412 m**. This excludes the tops of the 1.2 m pile-cap plinths, which are also rigid but are not foot planes. The earlier broad zero-lift probe included those plinth tops and therefore read 1.20 m; there was no floating footing. Footings deform from immutable source coordinates and the deck follows the shared bank/canal controls, not each pier's terrain. A missing/replaced DEM stress test is not part of this capture.

Not tested: HD lanes (local `/osm-lanes` requests return 503 without Redis), a driven route/car/traffic/camera alignment run, theme/terrain/failure stress matrix and Tesla hardware performance. The normal app's static camera and navigation height API were verified; that does not certify the omitted driving/HD cases. Bank-fit intentionally keeps this lake-level datum separate from sea level; piers sample their local feet and no corridor flattening is used. Member/pier dimensions and truss panelisation remain photo estimates, and this is a visual landmark, not a survey or structural analysis.
