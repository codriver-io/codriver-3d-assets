# Plant Hall, University of Tampa

Original procedural model of the present-day 1891 Tampa Bay Hotel, now Plant Hall, Tampa, Florida. The museum history identifies architect J. A. Wood and construction in 1888–1891; NPS describes Moorish architecture, red brick and five storeys. University of Tampa's Spring 2007 Journal documents thirteen minarets, cupolas and domes and their restored silver finish. The model retains six tall open-lantern minarets, four small angular roof cupolas and three west veranda domes. All crowns survive far LOD.

References and checked photo licences are in `prototypes/assets3d/catalog.d/plant-hall-tampa.json`. The three useful dossier images are Bbphotos' minaret photograph (CC BY-SA 4.0) and Ebyabe's two hall photographs (CC BY 2.5). An official university aerial is reference-only and remains in ignored scratch; no photographs, textures or external meshes are exported. Source is original procedural Three.js geometry; geographic data remains ODbL.

## Geographic frame and dimensions

Metres, east/up/south, origin `[-82.46422,27.94672]`; local y=0 is rigid flat-map grade. The dossier's initial origin was approximately 139 m south of the building and was corrected. Coordinates are baked directly from the mapped geographic rings, with no additional host rotation. East-facing frontage bearing approximately 89° follows mapped control points `[-82.4641069,27.946173]` and `[-82.4641043,27.9464003]`. The main outline is OSM way 25913559; every main-hall part 1110635631–1110635649 is also owned. The adjacent northwest Fletcher/Music Hall and its dome are excluded.

| Feature | Metres | Basis |
| --- | --- | --- |
| Main mapped envelope | about 50.4 × 157.7 | OSM geographic outline |
| Historic completed hotel length | 274.32 (900 ft) | NPS historical description, not imposed on today's footprint |
| Historic total length alternative | about 402 (quarter mile) | Museum historical description; source conflict, not used to scale present-day model |
| OSM main height | 22.04 | Tag, not surveyed total skyline |
| Outer wings / central block | 18.8 / 22.1 | Photo estimated |
| Return wings | 16.7 | Photo estimated, close to 17 m OSM tags |
| Minaret brick shafts | 22.9 / 24.8 | Photo estimated, distinct from 24–28 m OSM part tags |
| Highest silver crescent | 41.7 | Photo estimated, includes lantern and finial |
| Minaret shaft radius | 2.9 / 3.45 | Mapped circles, adjusted to aerial appearance |
| East veranda / west porte-cochere roof | 7.7 / 10.6 | Photo estimated against mapped 8 / 11 m parts |

## Construction and limits

Separate mapped wing extrusions retain the irregular setbacks. Individual arched window rows and stone courses follow mapped wall edges. Cylindrical minarets carry tapered, slightly bulbous silver skirts, genuinely open supported lanterns, upper onions and crescent moons; near adds radial seams and oculi. Four rooftop cupolas and three veranda domes use different profiles. The east veranda and west porte-cochere remain open, with supporting posts and pierced horseshoe bands. Pale stone trim contrasts with subdued red brick and silver roofing. Dark theme dims the walls and warms selected individual windows, without inventing a floodlight installation.

Far keeps all thirteen crowns, open lanterns, articulated massing, open entrance and separate window rows; it drops mullions, window surrounds and most seams and uses fewer circular segments. The model approximates profiles and facade counts; exact carved ornament, roof hardware, balconies, gardens, interiors and air-conditioners are omitted. Historic length sources disagree, and minaret heights are not survey measurements. The building uses a rigid foundation; terrain datum and replacement must be checked separately in the app.

## Verification

Export and focused check results and inspected contact-sheet paths are recorded below. Local exported inspection does not certify Cityscape, Full 3D world, lifecycle behavior or Tesla hardware performance.

| Mode | Status |
| --- | --- |
| Inspector source and GLB, near/far, light/dark | Verified locally through the final comparison sheet |
| Cityscape | Not tested yet, integration is checked separately |
| Full 3D world | Not tested yet, integration is checked separately |

Build: `pnpm build:top-cities-landmarks plant-hall-tampa --no-check`.

## Final authoring evidence, 2026-10-13

Read `tmp/top-cities/shots/plant-hall-tampa/final/export-reference-comparison.jpg`: four attributed reference images beside six near-light views, six far-light views, and four views each of near-dark and far-dark (facade, back, entrance, detail). This includes the opposite facade, roof, street-height entrance and close minaret view. The corresponding exported sheets in that directory were generated from actual GLBs. Also read `plant-hall-tampa-procedural-near-light-sheet.jpg` (overview, roof, entrance), which agrees with the GLB views.

Inspection changed the model: the initial far export exceeded budget, so small window surrounds, mullions, seams and some stone rings were omitted while eight minaret window bearings, all thirteen crowns and separate rows stayed; buried mass top caps and roof side faces were removed to eliminate material cycles and coplanar overlaps; chimney blocks were lowered onto their actual supporting roofs; and a centre post blocking the horseshoe entrance was moved to its two sides. The final silver roof profiles and open lanterns match the reference's main cues, while fine brickwork, carved trim, parapet detail and exact veranda composition remain approximations.

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 40,114 | 6 | 1,376,040 | 1,344 |
| Far | 9,329 | 6 | 312,500 | 305 |

`tmp/top-cities/plant-hall-tampa/metrics.json` has no flagged issues, zero coplanar overlaps, zero layered faces, no removable attributes and a 1.5% outside-ray back-face rate (below the 2% audit threshold). No material cycle edges were dropped. The focused four landmark tests pass, pinning ownership, grade/envelope, the estimated skyline, LOD silhouette, all six supported minarets and open lanterns, all four roof cupolas, all three veranda domes and the open horseshoe entrance. These height tests assert the authored estimates, not surveyed facts.

The requested combined test command completed 584/585 tests successfully: the only failure was another builder's `bob-kerrey-pedestrian-bridge` footprint validation. Plant Hall's three registry conformance checks and four local tests all passed. `node scripts/asset-catalog.mjs` and `pnpm assets:preview` were attempted and blocked by the same other builder's unregistered Bob Kerrey far GLB; Plant Hall's source/manifest/catalog consistency check passed. `node scripts/landmark-depth-layers.mjs --ids plant-hall-tampa --check` passes with zero cycles.

No app server, runtime clone, commit, staging deploy or full test suite was run. Cityscape and Full 3D world remain **not tested yet, integration is checked separately**; provider replacement, DEM contacts, mode/lifecycle transitions and hardware performance are open integration checks.
