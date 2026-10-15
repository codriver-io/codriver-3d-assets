# Arena Națională — Bucharest

Original procedural landmark `arena-nationala`, depicting the 2011 gmp stadium at Bulevardul Basarabia 37–39 with the central membrane **retracted**. The white scalloped grandstand roof, exposed elliptical compression ring, alternating tall concrete columns, bright white vertical facade rhythm, red concourse fascia and red/yellow/blue seating distinguish it from a generic stadium. A folded central fabric package and video cube remain in the open aperture. No moving/closed roof variant is delivered.

Source: `src/peregrine/landmarks/top-cities/arena-nationala/`. Export: `pnpm build:top-cities-landmarks arena-nationala --no-check`. Original code/docs MIT; original model CC BY 4.0; mapped geography retains OpenStreetMap ODbL attribution. No photographs, textures or external meshes ship.

## Sources and dimensions

| Item | Value | Basis |
| --- | --- | --- |
| Opened | 2011 | [gmp architect project](https://www.gmp.de/en/projects/533/national-arena-bucharest), [Wikipedia](https://en.wikipedia.org/wiki/Arena_Națională) |
| Capacity | 55,000 architect brief; 55,634 listed capacity | gmp / Wikipedia; seats represented as tier surfaces, not individual counted seats |
| Height | 55 m | [OSM relation 2501757](https://www.openstreetmap.org/relation/2501757), ten above-ground levels |
| Envelope | about 205 × 239 m, mapped world-axis bounds | [Outer way 13450166](https://www.openstreetmap.org/way/13450166); actual procedural structure inset inside it |
| Open inner roof aperture | about 84 × 118 m | [Inner way 186042396](https://www.openstreetmap.org/way/186042396), simplified to ellipse |
| Playing pitch | 68 × 105 m | conventional regulation pitch, modelling assumption |
| Roof outer spring / inner edge | 38 / 44 m, with 7.5 m outer scallop rise | photo estimates |
| Compression ring / tall piers | 54.4 / 54.7 m | estimated articulation of the 55 m tagged structure |
| Short piers / facade | 34.5 / 31 m | photo estimates |
| Roof bays / primary columns | 40 / 80 alternating heights | estimated repetition from reference images, not surveyed |
| Seat tiers | 1.5–15.5 m and 19–33.5 m | photo estimates |
| Storage package | approximately 11 m wide at 46.5 m | photo estimate; compact folded fabric and video cube |

The architect explicitly describes exterior steps over the old stadium's earthen embankment, alternating column heights and a roof system comprising an outer compression ring and prestressed radial cable structure. The model follows those structural features. The external landscape/embankment is terrain, not an invented building extrusion; stairs outside the mapped building are excluded from ownership.

## Geographic frame and ownership

Origin `[26.152495124390242, 44.437199604878046]` is the average of the mapped outer vertices. Coordinates are real metres east/up/south with y=0 at the structural apron grade. The north/south mapped controls `[5.90,-118.74]` and `[-6.96,120.64]` establish the long axis approximately 3.1° west of south. Rotation is baked once into the pitch, opening and source/GLB geometry; the host must not rotate again.

The precise outer polygon is retained and ray-intersected to shape the facades/roof, avoiding an ellipse that leaks beyond the provider envelope. The footprint owns outer way 13450166 of relation 2501757. Inner way 186042396 is an untagged inner hole, not a separate provider extrusion; it is not masked independently. The dossier lacked member geometry, so the exact two ways were fetched through the single-object OSM API fallback after the shared Overpass helper failed. There are no additional building parts in the supplied relation.

A rigid bounded apron supports the columns. No DEM, absolute altitude, Mercator stretch or berm is baked into the export. An explicit footprint-bounded median terrain pad samples the mapped boundary and feathers by 12 m; its DEM/berm behavior still requires host validation. Cityscape and Full 3D world placement are **not tested yet; integration is checked separately**. The lead must verify terrain footing residuals, apron/berm transitions, approach stairs, resident lattice coverage and provider replacement; the inspector cannot establish those properties.

## Materials and simplification

Named merged materials: bright warm-white `concrete` (#eceae4), warm white `roof`, grey `steel`, dark recess `shadow`, muted red `seats`, blue `upper`, yellow `yellow`, green `turf`, gate `glow`, field `paint`, roof floodlight `lamp`. Dark palettes dim the structure and light the gates/floodlights. Far folds yellow into upper blue, paint into concrete and drops small roof lamps; broad seating colour regions survive.

The red concourse is a continuous 5.4 m storey at y=16.2–21.6, partitioned into the facade instead of layered onto concrete. The upper-tier dark back wall meets the actual LOD roof underside and the concrete tier ledge; the exterior scallops frame dark voids rather than exposing turf or seats. A continuous cap beam at y=34–34.6 holds the short piers and near louvres, so their flat tops no longer end unsupported.

The membrane is an original double-surface scalloped parametric annulus with closed inner/outer edges, welded for smooth cushion normals. There is no central opaque disc. Forty curved radial stays meet the tall pier/compression ring and inner tension ring; forty inward retraction lines terminate at the folded fabric package. The closed support rings avoid free ends. Every cable endpoint is tested against the actual concrete ring/column, roof package or video-cube support surface, excluding the steel member material. Deliberately shortened free ends prove the checks reject lost contact.

Near uses twelve stepped rows per seating tier; far uses three and fewer plan segments, with narrow aisle wedges retaining the near angular width. These are aggregate seating terraces, not a 55,634-seat replica. Facade glazing remains separate gate bays at both LODs. Logos, lettering, individual seats, nets, people, detailed cable clamps and surrounding landscaped berm are omitted.

## Reference photographs

The dossier contact sheet `tmp/top-cities/arena-nationala/refs-sheet.jpg` was read for the interior, seating colours, roof underside and retraction hub. Its reference-only Commons photographs are credited in the catalog: Nowy Styl Group (CC BY-SA 4.0), PosifCool (CC BY-SA 4.0), Andrei Dan Suciu (CC BY 3.0) and Andrei Stroe (CC BY-SA 3.0). File titles/links are in the dossier `refs/SOURCES.txt` and catalog provenance.

Two missing-angle references were read: `refs/exterior-gmp.jpg` and `refs/aerial-gmp.jpg` (the latter is actually an interior perspective). They are Marcus Bredt photographs on the [gmp project page](https://www.gmp.de/en/projects/533/national-arena-bucharest), copyright reserved, retained only under ignored scratch for visual comparison and never redistributed. Their exterior view motivated the alternating-height colonnade and red fascia; the interior view corrected the initial red-only assumption to red/yellow lower and blue/yellow upper seating.

## Verification

Review fix g11c, 2026-10-15: deepened each exterior roof scallop from 3.8 m to 7.5 m, backed the upper arcade with an opaque dark tier wall, brightened the colonnade/rings to #eceae4, made the red concourse a continuous full storey, and capped the short columns/louvres into a ring beam. The open retractable centre, storage package, seating colours and supported cable system remain.

| LOD | Before tris / draws / bytes | After tris / draws / bytes |
| --- | --- | --- |
| Near | 32500 / 11 / 1571368 | 34100 / 11 / 1657764 |
| Far | 8758 / 8 / 457628 | 9398 / 8 / 492204 |

Far tube cross-sections use three sides to keep the export below the strict 500000-byte cap; named support tests still check every cable endpoint. The column cap, concourse and backing retain their full ring continuity in both LODs. Existing geometry tests now raycast through every exterior bay at two upper-arcade elevations and concourse height, requiring dark backing/red fascia as the first visible surface. Deep scallop relief is independently raycast in both LODs. No SPEC.ready assertion was added.

Final GLB near/far sheets with photos, plus far/near/street app evidence in both modes, live under `tmp/next-200/fix/g11c/arena-nationala/`; app shots use `app/{city,world}/`. The photo comparison reuses `refs/exterior-gmp.jpg` and the dossier interior reference sheet; no new imagery is retained. See `tmp/next-200/fix/g11c/REPORT.md` for final test, depth/catalog and capture results.

No git writes or shared app-bundle rebuild were performed; app QA uses a scratch `/tmp` bundle on slot L (3314/3316). Both modes require independent re-review. Terrain footing residuals, apron/berm transitions, resident lattice coverage, lifecycle transitions, failure recovery and Tesla hardware performance remain unverified; these visual captures alone do not certify those gates.
