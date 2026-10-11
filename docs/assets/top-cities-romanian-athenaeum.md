# Romanian Athenaeum — Ateneul Român

Original procedural model of Albert Galleron's 1888 concert hall at Strada Benjamin Franklin 1–3, Bucharest, heritage record B-II-m-A-18789, following the restored exterior visible in the dossier's 2016 daytime and 2010 night photographs. At 100 m the defining details are six Ionic front columns plus two returns, five gilded mosaic medallions behind the open portico, a triangular pediment and round drum windows with lyre grilles. At 800 m the broad wings, circular drum, shallow ribbed zinc dome and two-tier crown remain readable.

Source folder: `src/peregrine/landmarks/top-cities/romanian-athenaeum/`. Build: `pnpm build:top-cities-landmarks romanian-athenaeum --no-check`. Runtime exports: `public/models/buildings/romanian-athenaeum-{near,far}.glb` and `romanian-athenaeum.json`. Original geometry only; no external mesh, traced mesh, photograph or texture is shipped.

## Evidence and dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Origin | 26.0973 E, 44.4413 N | Nearby dossier anchor, approximately dome centre |
| Frontage outward bearing | 235.369650 degrees | OSM controls [26.0969371,44.4414031] and [26.0970259,44.4413113] define width bearing 145.369650 degrees; frontage is perpendicular toward southwest |
| Main body width/depth | Approximately 48.8 × 56.4 m, diagonal rear edge | Mapped body way 1493065630; exact polygon retained |
| Portico width/depth | 26.4 × 8.35 m | Mapped gabled part 1493111084, simplified symmetry |
| Drum external diameter | 29.16 m | Published in Revista Constructiilor, February 2011, page 8; detailed OSM dome envelope approximately 30 m |
| Twenty oculi | 20; approximately 1.82 × 2.22 m | Count published; size and trim estimated from exterior photo |
| Concert hall internal diameter | 28.50 m, not exterior mesh | Published; retained as context, not substituted for the external diameter |
| Body cornice / wing hip roof | 11.5 / 13 m | OSM building part heights |
| Portico column order | Base at 1.3 m, capital to 13.34 m | Approximately 12 m including base/capital; proportion estimated from photos |
| Pediment apex | 18.96 m including projecting trim | Estimated; simplified mapped gabled-part roof |
| Drum cornice / main dome crown | 21.5 / 25.25 m | Estimated photo proportions, detailed OSM dome height 25 m |
| Lantern roof / finial | 28.3 / 31 m | Detailed OSM parts 1493204404: 28 m and 1493204405: 31 m |
| Total height published elsewhere | **41 m, deliberately not used** | Parent OSM way 16291602 and the construction article; conflicts with detailed part heights and photo ratios |

The 41 m versus 31 m discrepancy is unresolved. The coordinator explicitly agreed to preserve the detailed mapped and photograph-supported 31 m profile rather than stretch the whole building vertically. Neither value is represented as a new survey measurement. The detailed model has a 29.16 m external drum and a roughly 12 m column order, consistent with the facade photos; all individual vertical levels beyond the mapped tags remain estimates.

Sources checked on 2026-10-05:

- [Romanian Athenaeum identity, architect and opening](https://en.wikipedia.org/wiki/Romanian_Athenaeum).
- [Revista Constructiilor, February 2011, page 8](https://www.revistaconstructiilor.eu/wp-content/uploads/2011/02/nr_67_februarie_2011.pdf): zinc dome, 29.16 m external diameter, 20 circular lyre windows, 41 m published total.
- [OSM parent way 16291602](https://www.openstreetmap.org/way/16291602), checked through the shared helper; full dossier extract includes all internal columns, roof parts, stair roofs and rear glazed roof 1192148712. The parent envelope contains the complete part geometry, so one enclosing footprint replaces the contained provider parts without listing tiny column rings as separate masks.
- [Diego Delso front photo](https://commons.wikimedia.org/wiki/File:Ateneo_Rumano,_Bucarest,_Ruman%C3%ADa,_2016-05-29,_DD_73.jpg), CC BY-SA 4.0.
- [Albert Galleron original elevation](https://commons.wikimedia.org/wiki/File:Albert_Galleron_-_Atheneul_Rom%C3%A2n_project.jpg), public domain, used for architectural rhythm rather than the historic roof geometry.
- [Luca Volpi / Goldmund100 night facade](https://commons.wikimedia.org/wiki/File:Ateneul_Rom%C3%A2n_Facade_night.jpg), CC BY-SA 3.0.

Reference-only images remain in ignored `tmp/top-cities/romanian-athenaeum/refs/`; attribution is also in the catalog. The official Philharmonic history URL was unavailable to the browser tool, so it is not cited as checked evidence.

## Frame, construction and limitations

Local metres: east/up/south, y=0 at entrance grade. Rotation −55.369650 degrees is applied to every primitive exactly once, inside the exported geometry. The OSM parent ring includes the projecting portico and diagonal rear annex. Model vertices are checked against that ring with the contract's 0.8 m eave tolerance. No plaza rectangle or surrounding garden is drawn. Pad radius 49 m covers the building's corners; this central city site appears level, but terrain is not measured here.

Geometry merges into seven material meshes. `stone` is warm wall plaster, `trim` pale limestone, `roof` zinc with dark standing seams, `glass` dark oculi and the rear skylight, `wood` entrance doors, `gold` mosaic/finial accents and `glow` entrance glazing. Night dims the masonry and metal and makes only the entrance glazing warm self-lit. Full floodlight simulation is omitted.

Near includes fluted shafts, Ionic volutes, dentils, paired drum pilasters, twenty lyre grilles, medallion bust reliefs and botanical zinc crest motifs. These are original geometric abstractions, not replicas of portrait mosaics or surveyed carvings. Far preserves all six front columns, two returns, five open bays and recessed medallions, all twenty round windows, the pediment, forty-sided near/twenty-sided far dome, lantern and finial; it drops tiny fluting, reliefs, dentils and grilles.

The rear is a reconstruction from mapped geometry and roof tags; the supplied photos chiefly cover the front. The irregular body, low wing roofs and semicircular glazed roof are retained, while unseen sculptural detail is omitted. Lettering, interiors, basement, garden/statue, full portrait likenesses and elaborate stone sculpture are not modeled.

## Cost and verification

Exported default-scene costs, uncompressed GLB:

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 39,460 | 7 | 1,400,588 | 1,367.8 |
| Far | 8,016 | 7 | 307,660 | 300.4 |

Under the building caps of 60k / 14 / 2.5 MB and 12k / 8 / 500 KB. These are asset costs, not measured device performance.

Visual QA and focused verification evidence follow. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Foundation/pad behavior, late/failed loads, provider replacement and Tesla hardware remain unverified; no runtime edits were made. Independent review is pending with the coordinator.


### Screenshots actually judged

Opened the dossier `tmp/top-cities/romanian-athenaeum/refs-sheet.jpg` once. Opened the first procedural contact sheet `tmp/top-cities/shots/romanian-athenaeum/iteration-1/romanian-athenaeum-procedural-near-light-sheet.jpg` (facade, back, roof, street, detail, top). It showed a plain modern-looking lantern, overly pale roof seams, and a full circular rear roof, so the second build added botanical crest leaves/curls, changed the standing seams to zinc, and rebuilt the rear roof using the mapped semicircular ring.

Opened `tmp/top-cities/shots/romanian-athenaeum/final/comparison-sheet.jpg` after the final export: daytime and night reference photos alongside exported **near light facade/back/roof/street/detail/top**, **far light facade/back/roof**, **near dark facade/detail**, and **far dark facade/back**. The exported shape matches the source, fits the red parent outline, and retains the open colonnade, round drum and crown in far. No visible floating ornaments or flipped/empty faces were seen. The rear annex and lantern carving remain simplified; night is deliberately dimmer than the real floodlit facade, with warm entrance glazing.

### Checks

- Exact focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/romanian-athenaeum/romanian-athenaeum.test.js`. Seven landmark-specific tests pin the six front column contacts, five open bays and gilded medallions, twenty radial glass oculi, 29.16 m drum, grounded 31 m finial, orientation, footprint containment and near/far silhouette; shared conformance also checks exported metrics and GLB/source bounds; final run passed all 121 tests (0 failures), including all seven landmark-specific tests and three shared Romanian Athenaeum checks.
- `node scripts/asset-catalog.mjs`: valid. Exact output saved in ignored `tmp/top-cities/romanian-athenaeum/catalog-result.txt`.
- `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids romanian-athenaeum --out tmp/top-cities/romanian-athenaeum/metrics.json`: clean, **zero different-material coplanar pairs**, **0% back-face hits across 282 intersecting rays**, no leftover bridgeLift attribute. It originally found hidden small-cap bases sharing the roof bottom plane at y=11.5; raising those embedded bases to 11.62 cleared the overlap without changing the visible silhouette.
- `SPEC.ready = true`; texture-free near/far exports and catalog record are complete.
- The shared `pnpm assets:preview` generator writes outside this worker's owned scratch directories and was left for the coordinator; landmark-local screenshots used the approved shot helper without starting a persistent dev server.
- Independent visual review, Cityscape, Full 3D world and real hardware remain pending. No shared file changes were needed.
