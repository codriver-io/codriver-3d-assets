# The O2 — London

The O2 / Millennium Dome enclosing canopy: broad pale scalloped membrane, twelve mapped ochre lattice masts with slight outward lean, representative cable fans and twelve cylindrical perimeter service pods including the taller tunnel-vent pod.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Millennium_Dome)
- [RSHP: 365 m overall structure, 50 m roof and twelve 100 m masts](https://rshp.com/projects/culture-and-leisure/the-millennium-dome/)
- [ICE: 320 m roof, 52 m centre account, outward-leaning masts and 2022 repair context](https://www.ice.org.uk/what-is-civil-engineering/infrastructure-projects/millennium-dome)
- [LUSAS / Buro Happold mast study: octagonal 90 m lattice above pyramid, 323 mm longitudinal CHS](https://www.lusas.com/case/civil/millennium_dome.html)
- [Historic England: twelve lattice masts and cylindrical service pods](https://www.heritagegateway.org.uk/Gateway/Results_Single.aspx?resourceID=19191&uid=1341658)
- [Mapped mast control 2377736208](https://www.openstreetmap.org/node/2377736208)
- [Mapped mast control 2377736211](https://www.openstreetmap.org/node/2377736211)
- [OSM provider footprint / building part 4320517](https://www.openstreetmap.org/way/4320517)
- [OSM provider footprint / building part 140106710](https://www.openstreetmap.org/way/140106710)
- [OSM provider footprint / building part 151983298](https://www.openstreetmap.org/way/151983298)
- [File:The O2 Arena viewed from a cable car.jpg — Alexander Baxevanis; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:The_O2_Arena_viewed_from_a_cable_car.jpg)
- [File:O2 Arena, Greenwich, from the Thames Path 01.jpg — Simon Burchell; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:O2_Arena,_Greenwich,_from_the_Thames_Path_01.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/the-o2-london/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0004078,51.5007542,0.0068078,51.5052458.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Twelve mast heads | 100 m | Architect, ICE and mapped nodes |
| Main canopy apex | 50 m | Architect; ICE says 52 m, treated as a differing account |
| Mapped exterior envelope | about 346.7 × 347.7 m | OSM outer ring, including scalloped perimeter |
| Nominal roof / total span | 320 / 365 m | Primary engineering/architectural accounts; distinct spans, not forced to one radius |
| Eave / skirt | 7.5 m | Mapped perimeter fit-out height; photo estimate for fabric edge |
| Mast tube diameter | 0.323 m near | Published longitudinal CHS; far simplifies to four chords |
| Mast lean | 14 m outward tip shift | Photo estimate, mapped nodes treated as base anchors |
| Service pods | 20 m, one at 33.5 m | Exact mapped footprints and heights |

Origin `[0.0032044,51.5029354]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

The twelve OSM tower nodes are exported as MASTS; each is a separate geographic control. South control [0.0033786,51.5019807] and west control [0.0016674,51.5028272], together with opposite nodes, determine the actual mast-ring rotation. The fabric follows the exact mapped outer ring, rather than a nominal compass-aligned circle. All geographic orientation is baked; no terrain or Mercator stretch is authored.

## Model and foundation

The enclosing fabric uses a shallow spherical-cap profile clipped to the mapped scalloped ring, with adjacent narrow seam strips. The primary roof accounts distinguish a 320 m clear span and 365 m overall structure; the current mapped exterior envelope is retained instead of scaling it to a mismatched nominal value. Twelve separately positioned lattice masts have octagonal near chords, complete cross rings and pyramidal supported bases; far keeps four chords and coarser rings. Representative inner/outer stay fans meet named mast-head collars and small roof anchors that intersect the actual membrane. All stays, cross members and mast legs have named support tests in both LODs, including detached negative controls. The twelve service-pod rings are mapped individually. Local y=0 is the rigid foundation datum, with no plaza, river or paving surface. Covered interior venue extrusions are owned by the enclosing canopy envelope. The later Up at The O2 walkway and interior fit-out are omitted.

50 m fabric apex is chosen from RSHP; the ICE 52 m account is recorded rather than silently merged. The mapped 346.7 × 347.7 m exterior envelope differs from the nominal 320 m clear and 365 m overall spans. Mast inclination, lattice-ring pitch, eave profile and reduced cable fans are estimates; near/far keep all twelve masts. The repaired, complete canopy is represented; the 2023 photo verifies its exterior after Storm Eunice. Interior event spaces, Up at The O2 walkway, full 23-cable-per-head web, lettering and logos are omitted.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 45754 | 7 | 604084 |
| far | 5998 | 6 | 99772 |

Deterministic QA: `tmp/batch/the-o2-london-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/the-o2-london.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/the-o2-london/the-o2-london-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/the-o2-london/the-o2-london-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Two visual looks. The first plan comparison showed that a coarse angular outline cut across some mapped scallops; the final roof and skirt follow every outline vertex in both LODs. Near retains narrow seam partitions, while far drops subpixel seams and coarsens the lattice rings, tube sections and pod facets to remain under 12,000 triangles. The current repaired-roof exterior was checked in Simon Burchell's 2023 photograph, alongside the 2012 cable-car exterior; the interior and 2004 images were rejected as current-version evidence. Final contact, dark far and red-ring top views retain the broad shallow fabric cap, all twelve mapped masts, representative cable fans and individually mapped service pods. Near uses 0.323 m CHS; far uses slightly thicker simplified chords for visibility. Every anchor intersects the actual membrane, and every mast/rung/stay/pyramid terminal passes its named support test with detached negative controls. The 320 m clear, approximately 348 m mapped exterior, and 365 m overall spans remain separate documented quantities.

Independent-review revision: Far canopy/skirt use 72 mapped-radius sectors and four radial roof bands; all twelve lattice masts, four stays per mast and their real roof contacts remain. Mast rails use four tiers and omit hidden member end caps; near GLB is byte-identical.

Far cost: 11182 → 5998 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/the-o2-london.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.

## 2026-11-10 application framing follow-up

Stock frame cropped the roof and site perimeter. Custom exact origin; zoom 15.6, pitch 45, bearing 200; no model edits. The whole roof, masts and grounded perimeter now fit within the surrounding peninsula road/block context in both modes. Final verdict: Cityscape **verified**; Full 3D world **verified**. Before/after evidence, capture diagnostics and exact command arguments are recorded in the follow-up report. No readiness gate was changed from a framing/data gap.
