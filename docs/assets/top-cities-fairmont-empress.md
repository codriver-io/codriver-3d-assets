# Fairmont Empress, Victoria

Original procedural model of Francis Rattenbury's 1908 Canadian Pacific hotel at 721 Government Street, with the later hotel wings. The silhouette uses the paired stone-gabled harbour pavilions, polygonal turrets, steep slate-grey roofs with neo-Gothic dormers and green copper turret caps, projecting window bays, brick/stone facade rhythm and four open Tudor porch arches. The supplied modern photographs guide the post-restoration exterior.

No third-party mesh, scan, photograph, texture or font is shipped. No changes to shared registry, runtime layer or other landmarks.

## Sources and dimensions

- [Official Fairmont site](https://www.fairmont.com/en/hotels/victoria/fairmont-empress.html): identity and address.
- [The Empress (hotel)](https://en.wikipedia.org/wiki/The_Empress_(hotel)): published 35.4 m overall height, eight levels, architect, 1908 opening, later expansions and restoration history. These agree with the prepared dossier and the OSM height and level tags.
- [OSM relation 1371841](https://www.openstreetmap.org/relation/1371841): hotel multipolygon. Full geometry fetched through the shared Overpass helper on 2026-10-06; ignored scratch `tmp/top-cities/fairmont-empress/hotel-outline.json`. Its eleven outer-way segments were joined by exact endpoint coordinates. Conference Centre relation 1371838 and Conservatory relation 9311605 are excluded.
- Photo titles/authors/licences and checked reference URLs are in the catalog record. The prepared `refs-sheet.jpg` was read before authoring: Dllu, *The Fairmont Empress, blue hour* (CC BY-SA 4.0); Adam Jones, *Architectural Detail - Empress Hotel - Victoria - BC - Canada - 01* (CC BY-SA 2.0); Michal Klajban, *Fairmont Empress, Victoria, British Columbia, Canada 08* (CC BY-SA 4.0); Wpcpey, *Fairmont Empress Lobby Lounge 2018* (CC BY-SA 4.0, not used to model interiors); NevinThompson, *Empress hotel may 2024* (CC BY-SA 4.0); R6, State & Private Forestry, Forest Health Protection, *1930. Empress Hotel. Victoria, BC. Canada.* (public domain). References stay in ignored scratch.

| Feature | Model | Basis |
| --- | --- | --- |
| Highest pavilion ridge finial | 35.4 m | Published height and OSM `height=35.4` |
| Levels | Six facade rows plus roof storeys | Eight total published/mapped; row spacing estimated from photographs |
| Hotel plan envelope | About 114 m east-west by 154 m north-south including later wing | Mapped OSM outer envelope, not a published facade length |
| Main harbour front | About 54 m along grid; pavilions about 12 m wide | Mapped frontage bay/wing steps; subdivision estimated |
| Main pavilion eaves / slate-grey roof top | 23.4 / 34.4 m | Photo estimate revised against the independent review; 11 m roof rise |
| Main harbour gable tips | 32.6 m | Photo estimate; tall pointed silhouette below 35.4 m finials |
| Recessed centre eaves / roof top | 23.4 / 31.1 m | Photo estimate |
| North harbour wing eaves / roof | 24 / 32.4 m | Photo estimate |
| Tudor porch | Four openings, total width 27.1 m; spring 3.8 m and apex 5.1 m | Photo estimate; real openings preserved in both LODs |
| Windows | Typical 1.25 × 2.05 m, 3.55 m row pitch | Photo estimate; pavilion oriels wider |
| Dormers | 1.6–2 m wide; gabled fronts about 3.25 m above lower edge | Photo estimate |
| Grid / frontage | Grid 8.5° clockwise from north; facade looks 278.5° | Mapped control points below |

## Geographic frame and model

Real metres, +X east, +Y up, +Z south. `origin` is the supplied structural anchor [-123.36797, 48.42185] on the harbour facade, rather than the full hotel's area centroid. Local `u` runs south along the frontage and `v` east into the hotel. `fairmont-empress-mesh.js` bakes this transform into every position and normal; runtime must not rotate it again.

Two controls on way 94679836, expressed relative to the anchor, are approximately (x=-7.8,z=46.8) and (x=-2.1,z=9.1). Their long front edge gives about 8.6° from north, rounded to 8.5°. The narrower northern wing's long edges agree. The northeast hotel wing follows a separate oblique mapped polygon instead of the main grid. `FOOTPRINTS` is the complete joined hotel outer ring and `OSM_WAYS` contains every eleven outer members; vegetation pads, roads and neighbours are not added to replacement ownership.

Blocks are separately roofed original procedural solids with facades split against their neighbours, so internal wall spans are suppressed. Slate-grey hips use steep pitches and narrow upper decks/ridges. Every main wing, dormer silhouette, gable, chimney, turret and open porch persists in far detail. Window frames, mullions, projecting sills, corner quoins, gable mouldings and dentils are omitted or simplified in far. Quads and custom polygon faces batch through `assetBuilder` into one mesh per named material.

Light/dark palettes: warm brick; pale grey-beige stone; dark slate-grey broad roofs; green copper turret caps; subdued glass; deterministic warm glowing rooms at night; dark metal. Flat geometric glazing is proud of its wall/stone frame by at least 0.08 m. Window sills and pavilion oriels are solid projecting geometry. The porch is an open piers/spandrels shell with arch soffits, roof and balustrade; no solid box fills the openings. Low foundations close the mapped outline at local y=0. Roof and chimney contacts are structural intersections, not floating objects.

## Terrain and limits

The hotel is on the harbour-side level site. All foundations are rigid at local flat-map grade y=0; no DEM, altitude or latitude stretch is embedded. `padM=130` covers the complete footprint from the facade anchor. Full 3D world must inspect its terrain samples and nearby roads before rollout; a bounded outline pad may be preferable if the disc includes lower harbour-side ground. No terrain certification is claimed.

The northeast wing and the narrow connecting link have simplified roofs; the rear facade repeats an estimated room rhythm because the dossier has no detailed rear survey. Stone sculpture, exact carved tracery, name lettering, flags, landscape, furniture, interior and Conservatory are omitted. Cornices/oriels and the northern turret project slightly beyond the mapped facade (about 1.5 m); the whole model remains in the outer geographic envelope with a 1.8 m trim tolerance. Physical height is independent of terrain.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No hardware performance measurements. Independent reviewer acceptance is left to the coordinator.

## Export and verification

Rebuild: `pnpm build:top-cities-landmarks fairmont-empress --no-check`.
Focused checks: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/fairmont-empress/fairmont-empress.test.js` and `node scripts/asset-catalog.mjs`.

The landmark tests observe the actual geometry with raycasts: 35.4 m height and grade, paired high pavilions above the recessed centre, four genuinely open porch bays, grounded piers, four turret tops, slate roof and copper turret contact and the northeast link, geographic envelope and near/far silhouette.

Initial procedural contact sheet: `tmp/top-cities/shots/fairmont-empress/iteration1/fairmont-empress-procedural-near-light-sheet.jpg`, judged against the supplied reference sheet. Front, opposite/back, roof, street, detail, north and overview were inspected. The sheet revealed the northeast wing had no modeled connection; the mapped link was added. Gable cornices, dentils, small upper openings and stronger stone framing were then added to reduce blank gables.

Initial delivery GLB evidence: `tmp/top-cities/shots/fairmont-empress/final/comparison.jpg` places the supplied harbour and detail photographs beside all exported near/far, light/dark views (`overview`, `facade`, `back`, `roof`, `street`, `detail`) and the overhead footprint view. Each full-resolution image and per-LOD/theme sheet remains in the same folder. These images were opened and judged, rather than merely generated. The final plan check added the missing mapped roofed section between the northeast wing and rear spine. Oblique exterior checks also corrected the northeast polygon winding, reversed dormer roof normals, closed dormer/gable backs and removed two near-coplanar trim/roof contacts by adjusting turret belts and a chimney top.

`qa-metrics.json` in the landmark scratch directory reports **zero coplanar pairs, zero back-face hits in 322 outside-in rays, no removable attributes and no issues**. Near/far have identical exported bounds: x -7.956 to 105.466 m; y 0 to 35.4 m; z -73.604 to 79.961 m. Both stay within the building budgets with headroom. Costs are exported scene metrics, not measured Tesla timing.

| LOD | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| Near | 35,811 | 7 | 1,933,640 | 1,888 |
| Far | 7,303 | 7 | 398,104 | 389 |

Verification: the required two-file focused command passed all **169 tests**, including eight landmark-specific tests; `node scripts/asset-catalog.mjs` passed (178 entries, 340 variants at verification); `pnpm assets:preview` built the local catalog inspector. Current revision logs are `revision-tests.txt`, `revision-catalog.txt` and `revision-metrics.json`; the original preview build log is `preview-build.txt` under `tmp/top-cities/fairmont-empress/`. The first run briefly saw another worker's Alberta Legislature spec/catalog mismatch; the final run passed completely. No shared file was needed or changed.

## Independent review revision

The review identified squat pavilion roof peaks, green wall panels absent from the current exterior, and broad roofs that were too uniformly green. The pavilion eaves were lowered from 25.3 to 23.4 m while their roof rise increased from 8.7 to 11 m (about 60° → 65° across the short hip span); roof tops rose from 34 to 34.4 m and the pointed harbour gables from 31.6 to 32.6 m. The finials remain at the sourced overall 35.4 m. Six facade room rows, open porch bays, mapped wings and the far silhouette remain. Green wall panels and their palette material were removed in both LODs; broad roofs, dormer coverings and gable cheeks now use dark slate grey, with green copper only on the four turret caps. The material names describe the reference appearance rather than asserting the historic substrate of each roof.

The supplied REVIEW.md has no Prepare command and no REVIEW-2.md was present. Equivalent standard preparation uses `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids fairmont-empress --out tmp/top-cities/fairmont-empress/revision-metrics.json` and `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids fairmont-empress --out tmp/top-cities/shots/fairmont-empress/revision`. The regenerated standard review sheet is `tmp/top-cities/shots/fairmont-empress/revision/fairmont-empress.jpg`; `review-comparison.jpg` in the same directory includes that entire sheet above harbour-facade and roof views in near/far, light/dark. I opened this contact sheet twice during the permitted two visual iterations. The first revised stone gable tips at 34 m crowded the dark roof apex; the final estimate is 32.6 m, leaving 1.8 m of dark roof above the stone while increasing the gable's vertical extent over the original. The published 35.4 m finial height stays unchanged. Revised roof rise is 26% taller and the front gable face is about 21% taller than before.

The final export is 35,811 triangles / 7 draws / 1,888 KiB near and 7,303 / 7 / 389 KiB far. `revision-metrics.json` reports zero coplanar pairs, zero back-face hits, no removable attributes and no issues. The eight landmark tests include actual high-gable ray hits, a steep roof shoulder and copper restricted to the small turret-cap mesh; all 169 focused tests and catalog validation pass. No shared file changes were required. Cityscape and Full 3D world remain not tested yet; independent re-review belongs to the coordinator.
