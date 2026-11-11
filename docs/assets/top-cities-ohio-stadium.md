# Ohio Stadium

Columbus, Ohio, United States. Current permanent exterior, authored 2026-11-10.

Current Ohio Stadium: open horseshoe concrete bowl and arcade, distinct south bleachers separated by two end gaps, north rotunda and twin towers, west press box and sloping seating terraces. Mapped stadium perimeter, not a solid building footprint, supplies the envelope. Official stadium height 136 ft (41.4528 m), rotunda 85 ft high / 70 ft diameter; tier heights and 1922 arcade rhythms are photo-based approximations. Field is unlettered and free of logos; no crowd or event structures.

## Geographic frame and dimensions

Origin: [-83.01974, 40.00165]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation -5.78216° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/119153498.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Mapped envelope | 209.2 × 281.6 m | OSM stadium perimeter way 119153498 |
| Overall height | 41.4528 m adopted | Ohio State official media guide: 136 ft |
| Rotunda | 25.908 m high / 21.336 m diameter | Ohio State Alumni Magazine: 85 / 70 ft |
| Unmarked field | 53.34 × 109.73 m | Standard field envelope; no logos or lettering |

## References and rights

- [Ohio State Athletics: current stadium history and facilities](https://ohiostatebuckeyes.com/sports/2023/6/2/ohio-stadium)
- [Ohio State Athletics 2022 media guide: stadium height 136 ft](https://ohiostatebuckeyes.com/documents/download/2023/7/26/2022-FB-Media-Guide_102-196_Award-Winners-History.pdf)
- [Ohio State Alumni Magazine: rotunda 85 ft high, 70 ft diameter](https://alumnimagazine.osu.edu/story/shoe-bob-long)
- [Carol M. Highsmith, Columbus Ohio Highsmith 21, modern exterior north entrance; public domain, comparison only](https://commons.wikimedia.org/wiki/File:Columbus,_Ohio_-_Highsmith_21.jpg)
- [Lectrician2, Ohio Stadium Overhead, 2014/current permanent horseshoe and south stand, CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Ohio_Stadium_Overhead.jpg)
- [dankeck, Ohio Stadium tennis court and basketball court, current south exterior, CC0; comparison only](https://commons.wikimedia.org/wiki/File:Ohio_Stadium,_tennis_court,_and_basketball_court_(25541564683).jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/119153498)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The footprint is the mapped stadium perimeter, not a filled building polygon. A hollow horseshoe consists of two sloped stepped tiers, a concourse, closed concrete soffits, historic arched lower facades and open upper framing. The north rotunda projects beyond the curved rim, with a genuine three-arch entry, shallow Pantheon-like vault and two square towers. The west press box remains a separate enclosed two-storey box with a broad roof; south bleachers have two diagonal end gaps and a plain scoreboard on grounded posts. Rows and gate counts are simplified. Upper rakers and uprights have a complete end inventory tested against concrete support triangles, with a floating-end negative control; their buried end caps are omitted. Field top is 0.16 m above local grade. The far LOD keeps both tiers, arcade holes, north entrance and south separation, while using fewer terraces and curve samples.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 24132 | 7 | 398148 |
| far | 9742 | 7 | 182732 |

Build: `pnpm build:top-cities-landmarks ohio-stadium`. Identity tests: `src/peregrine/landmarks/top-cities/ohio-stadium/ohio-stadium.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids ohio-stadium --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/ohio-stadium/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/ohio-stadium.jpg`. Red-ring procedural plan: `tmp/r4/shots/ohio-stadium/ohio-stadium-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/ohio-stadium/ohio-stadium-glb-far-dark-sheet.jpg`. One visual correction moved the rotunda forward to the mapped northern projection and muted the seats/concrete. Current sheet and final red-ring plan show the open horseshoe, separate south stand and west box; exported far/dark north approach retains the main open portal and twin towers. Zero deterministic flags and no dropped depth-cycle edges.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Replaced the shallow strip with an enclosed 138 × 13 m, two-storey west press box. Both long and end facades have two 3.05 m glazed rows separated by a floor band; the 142 × 19 m overhanging roof reaches 41.4528 m, 7.45 m above the 34 m bowl rim. Calibrated the box to about 49% of the mapped stadium length. Kept the overall height, north rotunda and south gaps; closed actual soffits and removed conflicting buried seat/riser caps to keep revised contacts depth-safe.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: West outer and inner press-box faces and both end walls retain two separate glazed levels and the same broad roof. North rotunda/arcade, east rim, open field and both south gaps match in FAR; all seating tiers, frame supports and closed soffits remain, with fewer step and curve samples only.

New contact sheet: `tmp/followup/sheets/ohio-stadium.jpg`. Identity/conformance tests passed; `tmp/followup/ohio-stadium-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
