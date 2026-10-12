# The Alamo, San Antonio

Original procedural model of the present-day Alamo church and Long Barrack at 300 Alamo Plaza. It includes the famous rounded west facade, four engaged entrance columns, recessed arched wooden door, four niches, five barred facade windows, mapped north rooms and transept, concrete barrel-vault roof, and separate low Long Barrack. No surrounding hotel, gift shop, collections center, grounds or current construction is owned.

The official [church history](https://www.thealamo.org/visit/whats-at-the-alamo/alamo-church) dates the mission church to 1755–1793, explains the rounded crest added during Army depot occupation, and identifies the present 1921 concrete barrel vault. The official [Long Barrack history](https://www.thealamo.org/visit/whats-at-the-alamo/long-barrack) dates the former two-storey convento to 1724; this model depicts its current low restored form, not the historical two-storey building.

## Frame and dimensions

Metres, east/up/south about `[-98.48611,29.42583]`; y=0 is rigid local plaza grade. The facade control points `[-98.4862816,29.4256405]` and `[-98.4862509,29.4258086]` establish its approximately 9° tangent and 279° west outward bearing. Geometry bakes an 81° Y rotation from a north/east authoring frame; the host must not rotate again.

Mapped ownership is church way 92060042, Long Barrack way 100052478 and all six facade parts 1489925161–1489925166, with both complete building rings retained verbatim from the dossier; all six small facade parts lie inside the church ring and use that containing mask. The original mapped church plan is 543 m² and barrack plan 513 m². Architectural portal projections remain within 0.8 m of the outline; ground paving is omitted.

| Feature | Metres | Basis |
| --- | --- | --- |
| Church plan depth / front width | 32.1 / 19.0 | OSM local plan |
| Facade crest / side shoulders | 9.8 / 7.6 | OSM building:part height tags, not survey measurements |
| Church perimeter wall top | 7.3 | Photo estimate |
| Barrel roof peak / rise | 8.7 / 1.35 | Photo estimate |
| Central door width / height | 2.15 / 3.35 | Photo proportion estimate |
| Long Barrack long edge | 58.2 | OSM local plan |
| Long Barrack wall top | 4.1 | Photo estimate |

## Modelling and rights

Original texture-free Three.js geometry. Walls have actual cut openings and recessed backs, rather than dark planes over unbroken masonry. Near includes carved shaft bands, pilaster steps, a simplified shield, wooden door panels, iron grilles and quiet limestone joints with varied heights, widths and vertical staggering. Far removes fine joints, bands and panels while preserving the curved crest, columns, niches, every window and the separate barrack. Palette is subdued warm limestone, pale carved stone, dark timber/iron and gray roofing, dimmed at night; there are no invented self-lit windows.

References inspected in ignored `tmp/top-cities/the-alamo/refs-sheet.jpg`: **Alamo pano.jpg**, Daniel Schwen, CC BY-SA 4.0; **Alamo Entrance.jpg**, Mattstone911, CC BY-SA 3.0; **Alamo Mission, San Antonio, Texas, USA.jpg**, Zygmunt Put (Zetpe0202), CC BY-SA 4.0. Catalog references link to the checked Commons licence pages. Interiors, memorial and plaque tiles were not used for exterior geometry. Geographic data © OpenStreetMap contributors, ODbL 1.0. No reference images, mesh or textures enter source-controlled or public files.

Fine carving, irregular rubble shape, exact side-window counts, modern fittings and interiors are simplified. All dimensions other than OSM horizontal plans and tagged facade heights are estimates. The site uses rigid grade; no terrain, scene datum or latitude stretch is baked in.

## Verification

Initial procedural near/light contact sheet: `tmp/top-cities/shots/the-alamo/iteration1/the-alamo-procedural-near-light-sheet.jpg`, with facade, back, roof, street, detail and barrack views. Inspection caught a gray roof edge crossing the facade and masonry courses extending above the hump. Roofs now inset inside mapped walls and joints clip to the actual crest profile.

Final exported comparison inspected: `tmp/top-cities/shots/the-alamo/final/the-alamo-export-reference-comparison.jpg`. The first two tiles are the attributed facade and entrance photos, followed by all 21 exported frames: near/light facade, back, roof, street, detail and barrack; far/light facade, back, roof, detail and barrack; near/dark and far/dark facade, back, roof, detail and barrack. Every tile was viewed against the dossier reference sheet. The front silhouette, paired columns, niches and separate window rhythm survive far. Red outlines agree with the mapped church and barrack; the portal cornice has a small deliberate overhang. Back and roof views retain the irregular north-room/transept plan and low barrel roof. The stone surfaces and detailed relief remain stylized architectural approximations, not surveyed rubble masonry.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| Near | 8,594 | 6 | 383,968 | 375.0 |
| Far | 2,302 | 6 | 107,608 | 105.1 |

`tmp/top-cities/the-alamo/metrics.json` reports no issues: zero layered faces, zero coplanar overlaps, no removable attributes, no unsupported-member candidates and a 0.6% near outside-in backface-hit rate (below the 2% audit threshold). Near/far bounds differ by less than 0.15 m. Depth generation and `--ids the-alamo --check` pass with zero dropped cycle edges. All **417** tests pass in the requested two-file run; the five landmark tests pin the crest/shoulder heights, real recessed openings, four column bases/capitals, barrel roof, detached barrack, geographic bearing, complete provider ownership, footprint containment and exported round trip.

The global catalog check and preview build were attempted twice; the last attempt was blocked only by the concurrently authored missing `docs/3d-top-cities-frauenkirche-munich.md`, outside this landmark's ownership. The targeted audit loaded and checked The Alamo record successfully. No shared source change was needed beyond the authorized depth-table regeneration.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**.

Build: `pnpm build:top-cities-landmarks the-alamo --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/the-alamo/the-alamo.test.js`.

## Independent review correction — 2026-10-12

Review nit fixed: near west-facade limestone has varied course heights, joint lengths and staggered vertical joints, clipped clear of openings and the curved crest; barrack courses also vary. Low-contrast original geometry is retained, far omits joints and preserves every opening. Individual rubble shapes and carving remain simplified.

Inspected exported near/light and far/light contact sheets at `tmp/top-cities/shots/the-alamo/review-fix1/the-alamo-glb-{near|far}-light-sheet.jpg`. The palace used two look-fix iterations; the museum and Alamo used one. Existing palettes and geographic ownership are unchanged. The initial authoring verification above is historical; current exports are measured in the table above.

Current focused run: **25/25 pass** (16 landmark-specific tests and nine scoped registry cases for these three models). The requested combined registry run reports 476 passes / one unrelated failure: the concurrently authored High Museum near model exceeds its triangle budget. The three-model deterministic audit in `tmp/top-cities/palacio-de-cibeles/review-fix-metrics.json` reports **ok** for both LODs of each landmark. Scoped depth generation and `--check` pass with **zero material-cycle edges dropped**. The global catalog command and `pnpm assets:preview` were run and are blocked by the concurrently authored unregistered `/models/buildings/high-museum-of-art-far.glb`; only the owned records were edited.

The independent pre-fix review found visible footing and no provider intrusion in the supplied Cityscape and Full 3D world stills. **Post-fix Cityscape: not tested; post-fix Full 3D world: not tested**, pending the lead's app recapture and independent re-review. Still-image approval does not certify lifecycle, DEM refinement or hardware performance.
