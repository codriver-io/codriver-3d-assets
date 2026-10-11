# Pegasus Bridge — current 1994 road crossing

Original procedural model of the closed Scherzer rolling-lift bascule carrying D514 across the Caen canal at Bénouville. The 1934/35 museum original (dossier reference 2) is excluded. This revision addresses the lead's REVIEW-2 live HD lane defect; the previous review's darker steel, striped barriers, sign heads, deep fascia and tower catwalk remain.

## Sources and dimensions

[Identity and replacement history](https://en.wikipedia.org/wiki/Pegasus_Bridge); [mapped roadway](https://www.openstreetmap.org/way/30319467), [bridge outline](https://www.openstreetmap.org/way/745702717), [cylindrical control tower](https://www.openstreetmap.org/way/725863483). Supplied OSM/facts/photo dossier read first; nearby building outlines were queried once through the shared Overpass helper. Only the tower is masked; Café Gondrée and neighbouring houses remain provider-owned.

Visual references: [portal and rolling shoes](https://commons.wikimedia.org/wiki/File:Pegasus_Bridge_Neu_01_09.jpg), Хрюша, CC BY-SA 3.0; [road view and striped barriers](https://commons.wikimedia.org/wiki/File:B%C3%A9nouville_-_Pegasus_Bridge_01.jpg), Kev22, CC BY-SA 4.0; [closed structure and tower access](https://commons.wikimedia.org/wiki/File:Pegasus_Bridge_-_B%C3%A9nouville_(Calvados)_-_Basse-Normandie_-_France_-_Feb._2011.jpg), dynamosquito, CC BY-SA 2.0. Photos remain in ignored dossier storage; no textures, scans or traced meshes in exports.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Bascule leaf | 45.7 m | Lead's nominal dimension; not a modern engineering survey |
| Mapped crossing / authored road length | 78.165 m | OSM movable road way 30319467, bank to bank |
| Bridge axis | 115.9° east of north | Mapped roadway |
| Deck / carriageway | 15.6 / 7.4 m | Outline and photo estimate, fitted to live carriageway width |
| Deck above bank road datum | 0.10 m | Render clearance, not canal altitude or surveyed clearance |
| Main portal height | 20 m above deck | Photo estimate |
| Rolling quadrant radius | 8.4 m | Photo estimate |
| Counterweight housing | 6.2 × 10.7 × 8.7 m | Photo estimate |
| Control shaft / cab | radius 2.15 / 3.25 m; roof y=9.81 m | Cadastre shaft radius approximately 2.4 m; heights/overhang estimated |
| Authored approaches | None | Ordinary streets remain provider-owned |
| Exterior fascia | 1.2 m deep | Photo estimate; below grade, world only |
| Abutments | y=-2.3 to -0.6 m | Estimated shallow supports; not a surveyed foundation |
| Deck / upper tower catwalk | deck +0.15 m / local y=7.55 m | Photo estimate |

## Frame and road fitting

Origin `[-0.27419275,49.24239125]`; +X east, +Y up, +Z south. Station runs west to east along the mapped bridge, positive lateral to the right (south). Rotation is baked once through `PROFILE.bridgePoint`. Local y=0 is bank road grade; no terrain, water plane or sea-level altitude is baked in.

The runtime alignment is exactly the bridge way's endpoints, stations 0 to 78.165 m. The remaining D514 nodes are retained only as geographic source data. No asphalt, walks, kerbs or barriers are authored over ordinary streets beyond the structure ends. `clipStandardEnds: true` and a 0.25 m ownership margin constrain replacement to the span. The shared registry layer preserves and drapes live HD pavement and paint; authored asphalt is the fallback beneath it. A single straight deck interpolates the live bank road datums and adds 0.10 m in both Cityscape and world; `terrainPolicy: 'bank-fit'` supplies the renderer's bank terrain datum without flattening the canal. Heading and lateral corridor rejection remain shared with ordinary bridge road acceptance.

The bascule frame, counterweight, cabin, rolling sectors, leaf and barriers move down 3.1 m with the new deck datum. The cream control tower retains its actual cadastre centroid and grade-fixed shaft, green cab/roof and red external stair. The structural frame extrapolates only for that detached tower and its access walkway; road ownership never extrapolates. Tower and trestle foot weights remain fixed; superstructure follows the deck. `_bridgelift` survives export.

Geometry is split at bank grade: the submerged fascia, lower girders, slab and abutments share one `foundation` batch. The landmark's own layer hides it on initial load and terrain-off in Cityscape, and restores it with enabled world terrain, including LOD replacement. All other authored vertices are at/above grade. World foundation material is the darker blue-grey edge colour. The detached tower remains separately masked; nearby houses and Café Gondrée stay provider-owned.

## Review-2 changes: before → after

1. **Approach HD paint buried:** 218.165 m of authored road including two 70 m ramps covered pedestrian crossings, centre dashes and a signal stop line → 78.165 m mapped bridge structure only, leaving ordinary approach roads and their paint visible.
2. **Invented deck hump:** closed deck +3.2 m with 6.857% ramps → straight bank-to-bank deck +0.10 m, with no authored ramps. Portal and bascule silhouette retain their heights relative to the deck.
3. **Newly buried structural pieces:** lowering would expose underground components through flat Cityscape → below-grade geometry split into a world-only foundation batch; no underground Cityscape vertices in the remaining visible batches.

## Export and checks

| LOD | Previous triangles / draws / bytes (KiB) | Current triangles / draws / bytes (KiB) |
| --- | --- | --- |
| Near | 11,964 / 10 / 709,680 (693.0) | 12,748 / 11 / 847,728 (827.9) |
| Far | 3,764 / 9 / 206,828 (202.0) | 4,100 / 10 / 294,500 (287.6) |

Within bridge budgets: near ≤120k triangles / 40 draws / 4.5 MB; far ≤30k / 10 / 1.2 MB. The far draw limit includes one world-only batch (Cityscape uses 9; near Cityscape uses 10). Byte increase includes indexed clipping of grade-crossing faces and exported attachment weights. Source and exported bounds agree; minY=-2.3 m, top approximately 21.15 m. Deterministic QA reports no issues, zero coplanar overlaps and 0% back-face hits in 117 rays.

Focused landmark + registry conformance passed all 296 tests (10 for Pegasus). Tests pin straight datum interpolation, both headings, rejection of ordinary approaches, pavement extent, mapped tower position, both LODs' bascule negative space/contacts, fascia/sign/catwalk, foundation mode visibility and GLB attachment round trip. `node scripts/asset-catalog.mjs` passed 222 records / 414 variants; local catalog inspection build passed. No shared renderer files changed.

REVIEW.md has no Prepare block. Equivalent preparation was rerun after the export:

```sh
pnpm build:top-cities-landmarks pegasus-bridge --no-check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids pegasus-bridge --out tmp/top-cities/pegasus-bridge/metrics-after.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids pegasus-bridge --no-ref --tag 'Span-only flush deck' --out tmp/top-cities/pegasus-bridge/after
```

Read `tmp/top-cities/pegasus-bridge/after/pegasus-bridge.jpg` against the supplied dossier reference sheet: source/export silhouette, near/far, street, opposite and top views preserve the bascule and tower. One authored look-fix iteration; no reference photos fetched.

## Live HD evidence, 2026-10-11

Isolated branch preview, runtime build `85aebb345d11`; Protomaps `tiles.codriver.io`, Redis 6391. Slot A used Cityscape 3270 and world 3272 with Terrarium DEM zoom ≤15. Ordinary approach/crossing stations, both banks and midspan were captured with HD enabled, paired against `landmarks=off`. Street captures at both banks face each driving direction. Files below are under ignored `tmp/top-cities/pegasus-bridge/hd-check/`:

- `cityscape-banks-sheet.jpg`, `cityscape-approaches-sheet.jpg`, `cityscape-street-sheet.jpg`: Cityscape on|off comparisons.
- `world-banks-sheet.jpg`, `world-approaches-sheet.jpg`, `world-street-sheet.jpg`: Full 3D world on|off comparisons.
- `{cityscape,world}-on/report.json`: centreline heightAt in both directions, including ordinary approach/crossing rejection.
- `street-{cityscape,world}-on/report.json`: both direction captures with loaded/active LOD and foundation visibility.

Both pedestrian crossings, the signal stop lines, centre dashes and surrounding side-road paint remain visible with the model on in both modes. The bank joints show no visible hump, gap, slab/kerb crossing a lane or overlapping authored approach. Near/far export recognition is checked separately from these live near LOD checks.

| Centreline sample | Cityscape forward / reverse (m) | World forward / reverse (m relative to local queried ground) |
| --- | ---: | ---: |
| West ordinary approach / crossing | null / null | null / null |
| 0, west bank | 0.10 / 0.10 | 0.10 / 0.10 |
| 39.082, midpoint | 0.10 / 0.10 | 0.24334009 / 0.24334009 |
| 78.165, east bank | 0.10 / 0.10 | 0.10 / 0.10 |
| East ordinary crossing / approach | null / null | null / null |

The world midpoint difference is the bank-to-bank ground datum minus the terrain sample under the canal, composed once by the shared renderer. It is not an authored bump. Cityscape HD paint, bank joins, both-direction height API and foundation visibility: **verified locally**. Full 3D world equivalents: **verified locally**. This evidence is not a physical vehicle drive or hardware performance measurement.

## Limits

No bascule animation, gears/interior machinery, quay/water model or lettering. Heights, operating fittings, member sizes and foundations are photographic estimates. Cab overhang exceeds the tower shaft's cadastre footprint; structural tower access is separately accounted for beyond the roadway. Foundation material is consolidated blue-grey for draw economy. Live car/route/traffic/halo/camera motion, paint toggling, far LOD in the app, late/missing terrain, failed loads, repeated mode/reanchor/lifecycle transitions and Tesla hardware remain **not tested**. Updated independent review belongs to the coordinator; no staging rollout or publication occurred.
