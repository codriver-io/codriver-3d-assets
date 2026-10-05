# Puerta de Europa — Madrid

Original procedural model of the KIO twin office towers at Paseo de la Castellana 189 and 216, Plaza de Castilla, by Philip Johnson and John Burgee. The west tower carries an approximate geometric CaixaBank wordmark; the east carries REALIA. Model authoring date: 2026-10-05. The 2017 night photograph still shows Bankia; its obsolete tenant sign is not reproduced. Madrid Tourism says construction finished in autumn 1995, whereas the dossier/Wikipedia gives completion in 1996; this models the present tower massing.

From 800 m the identifying feature is two square towers leaning toward one another across an entirely open gap. At 100 m, the black-blue glass, large silver perimeter/centre bands and horizontal thirds, diagonal flank bracing and fine bronze-red mullions distinguish them from plain tilted extrusions. No plaza monument, neighbouring building, road, trees or furniture is authored.

## Sources and rights

- [Official Madrid Tourism](https://www.esmadrid.com/en/tourist-information/torres-kio-puerta-europa): square 115 ft / approximately 35 m bases, 14.3° lean, three basements, ground/equipment/24 office floors, glass/aluminium/stainless-steel facade and rooftop heliports. English page accessed 2026-10-05; page dated 2026-03-26.
- [Gate of Europe, Wikipedia](https://en.wikipedia.org/wiki/Gate_of_Europe): rounded 114 m height, 26 floors, designers and completion, current owners, blue west / red east helicopter pad outlines. Dossier facts are the starting point; the page was checked.
- [OSM east outline 11103227](https://www.openstreetmap.org/way/11103227) and [west outline 965429323](https://www.openstreetmap.org/way/965429323), plus **55 building parts**: placement, mapped 114.7 m roof, 27 mapped level slices and east 114.9 m rooftop part. Dossier plus a single 250 m query via the shared Overpass helper; full response in ignored `tmp/top-cities/puerta-de-europa/towers-osm.json`. Geographic data © OpenStreetMap contributors, ODbL 1.0.
- Reference photograph [Torres KIO (37719354701).jpg](https://commons.wikimedia.org/wiki/File:Torres_KIO_(37719354701).jpg), **Deensel, CC BY 2.0**, September 2017. Night facade, silver framework and opposed silhouettes. Licence checked on Commons; retained only in ignored `refs/1.jpg`.
- Madrid Tourism's `f_i_pg_gd_puertaeuropa_003.jpg`, linked from the official page: a daytime street facade view used to judge dark glazing, red grid and silver bands. Rights for redistribution are not supplied, so this is a local visual reference only in ignored `refs/official-day.jpg`. The two unrelated/remote dossier skyline images were not relied upon for details.

No photograph, raster texture, scan, traced mesh, logo file or font file is included in source or GLBs. Letter strokes are original simple geometry and approximate the tenant names.

## Geographic frame and replacement

Real metres, +X east, +Y up, +Z south; local y=0 is the rigid lobby grade. Origin `[-3.68911225135, 40.46686163068]` is the midpoint of the two lowest mapped floor polygon centroids. Tower centres relative to it are west `[-87.9112, -18.4739]` and east `[87.9112, 18.4739]` m. Separation is approximately 179.7 m.

Mapped edge controls fix each grid independently: east lowest-part edge `[-3.6879102,40.4665054]` → `[-3.6878269,40.4668235]` runs at bearing 11.267°; the west corresponding edge runs at bearing 11.706° modulo 180. Grid rotations are **baked into geometry and exports**, with no host rotation required. Horizontal floor plates are sheared toward the other tower, rather than rotating upright boxes (which would incorrectly tilt the floors and roofs).

There is an explicit mapping discrepancy: the centroids of OSM lowest/highest floor slices move about 26.4 m over their 110.5 m spacing, while the official 14.3° lean displaces the model crown 29.2 m over 114.7 m. We retain the published lean and 35 m bases. `FOOTPRINTS` contains one complete projected envelope per tower, a convex union of the mapped outline and corrected structural sweep; the inward crown projection extends about 3 m beyond OSM. All 57 owned OSM ways are recorded, including upper slices and the rooftop part. These envelopes represent tower projections, including overhang, and do not include neighbouring monuments/buildings. A vertex ownership test and red-ring top render check the fit.

`padM: 116` covers the separated footprints. Plaza de Castilla is expected to be broadly level, but DEM sampling and the large disc spanning the central road are **not verified**; integration must check foundation datum/pad edges before approving Full 3D world. No terrain, absolute elevation or Mercator stretch is baked into the model.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Main roof / highest heliport | 114.7 / 114.9 m | Mapped OSM; published 114 m is rounded |
| Horizontal plate | 35 × 35 m | Official Madrid Tourism; mapped plates roughly 35.7 m |
| Opposed lean | 14.3° from vertical, approximately 29.2 m crown offset | Official Madrid Tourism; some technical descriptions round to 15° |
| Facade levels | 26, equal approximately 4.41 m pitch | Published count; pitch and ground/equipment distribution estimated; OSM maps 27 slices |
| Large horizontal bands | y=0.45, 38.23, 76.47, 114.2 m; 0.9 m wide | Estimated from reference thirds |
| Centre / corner stripes | 0.82 / 0.8 m wide | Estimated |
| Near glazing grid | 24 pane columns per face, 26 floor rows plus midfloor transoms | Estimated from photographs |
| Far glazing grid | 8 pane columns, 13 grouped floor rows; lit cells split into shorter window bands | Deliberate reduction |
| Heliports | 25 × 25 × 0.15 m slab, coloured perimeter and H | Feature sourced; exact size estimated; top marks 0.05 m above slab |
| Lobby entry | 5.6 m wide, 2.4 m lintel; paired handles near only | Estimated |

## Materials and geometry

Nine named near materials, eight far: dark blue `glass`, deeper `spandrel`, bronze-red `mullion` (near only), silver `metal`, dark `roof`, warm night `light`, pale night `sign`, `blue` and `red` heliport outlines. Day/night palettes have identical keys. Lit panes read as dark glass by day and warm office lights at night; silver steel remains shaded. Tenant lettering and heliport H use `sign` and are approximate, without branded logos.

Exposed indexed quads form the curtain wall: glass cells, mullion seams and opaque floor bands tile each wall. Fine near transoms stand 0.055 m proud. Silver frames are merged sheared box members in contact with the facade, with a tall diagonal ribbon on each flank. Roofs and heliports stay horizontal. Hidden grade/heliport undersides are removed; corner columns finish 0.1 m below the roof plane to avoid coplanar caps. Geometry merges by material; no per-window draw and no textures or custom bridge attributes.

Far retains the complete silhouettes, opposite leans, road gap, large silver framework, signs and heliport markings. It drops fine transoms/door handles and reduces facade sampling; illuminated cells retain single-floor proportions. Roof plant, faithful logos, detailed doors/interiors, exact engineer's bracing sections, real night occupancy and basements are not modelled.

## Costs and verification

Costs are the exported default scenes, not Tesla hardware measurements. Repeatable export: `pnpm build:top-cities-landmarks puerta-de-europa --no-check`. Source is in `src/peregrine/landmarks/top-cities/puerta-de-europa/`; exports and manifest are under `public/models/buildings/`.

The focused node tests pin grade/top, horizontal 35 m plates, independently raycast opposed lean, outward faces, the empty gap, silver centre/third/diagonal bracing, all-vertex footprint containment, and matching LOD envelopes/budgets. Shared conformance additionally parses both GLBs and checks bounds, materials and manifest metrics.

Visual evidence, read as contact sheets against the photographs:

- `tmp/top-cities/shots/puerta-de-europa/iteration1/puerta-de-europa-procedural-near-light-sheet.jpg`: front/back, elevated/roof, street, curtain-wall detail and entrance. The twin tilt, open gap, silver thirds and red grid read clearly; no massing correction was needed.
- `tmp/top-cities/shots/puerta-de-europa/final/verification-sheet.jpg`: final exported near/far, light/dark, front/back, roof, top footprint, street, detail and entrance alongside Deensel's night photograph and the official daytime reference. The far model retains the identifiable gate and large framework.

Geometry QA initially found approximately 3 m² of coplanar corner caps at grade/roof. Removing hidden bottom faces and lowering the upper column caps eliminated these overlaps. Far lit panels were split into shorter bands to avoid two-storey glowing bars. Final `qa-metrics.json` reports zero coplanar overlaps, 0% back-face hits (224 hit rays), min y=0, max y=114.9 and no `bridgeLift` bytes. The source and GLB bounds match exactly. The focused command completed 108 tests with zero failures, including all six landmark-specific tests and all three Puerta de Europa conformance checks.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Model delivery does not establish runtime replacement, foundation datum, terrain-arrival, mode-switch, reanchor, failed-load lifecycle, bundle parity or vehicle/road continuity. Independent visual review remains for the coordinator; no PASS is claimed on its behalf. No shared file changes were needed.

| Export | Triangles | Draws | Size (KiB, rounded) |
| --- | ---: | ---: | ---: |
| Near | 22,396 | 9 | 1,197 |
| Far | 5,056 | 8 | 281 |

Building caps: 60,000 / 14 / 2.5 MB near; 12,000 / 8 / 500 KB far. Geometry and LOD silhouette checks pass, with the far model at approximately 23% of near triangles. Exported bytes are recorded in the generated manifest.

Global catalog validation was run and retried; at the last check it was blocked by another active worker's missing `docs/3d-top-cities-lincoln-memorial.md`. This landmark's manifest and fragment parse and pass scoped QA; the shared blocker was reported to the coordinator without editing Lincoln Memorial files.

Manifest byte costs: near **1,225,548 bytes**, far **288,140 bytes**. The coordinator explicitly directed this worker to settle successfully with the shared catalog blocker documented, rather than wait for the other worker's document; the global check remains to be rerun after that document arrives. All owned deliverables are complete and uncommitted.
