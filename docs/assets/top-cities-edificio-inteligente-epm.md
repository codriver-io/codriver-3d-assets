# Edificio Inteligente EPM — Medellín

Original procedural exterior of the Empresas Públicas de Medellín headquarters, Carrera 58 #42-125, La Alpujarra, inaugurated in 1997. The stepped glass wings, floor sunshades and vertical fins, twin buff service towers with perforated crowns, and supported entrance span identify this model. The detached auditorium and Parque de los Pies Descalzos remain provider context.

## Sources and estimates

Sources consulted 2026-10-15: [EPM official visits](https://www.epm.com.co/institucional/puertas-abiertas-epm/) identifies the headquarters and construction start in 1992; [CTBUH](https://www.skyscrapercenter.com/building/epm-building/20140) lists 14 floors and explicitly estimates 62 m from floor count; [FilMedellín](https://filmedellin.com/locaciones/edificio-inteligente-epm/) describes six towers, the public plaza, address and 124,289 m² floor area. FilMedellín's completion date of 1993 differs from the headquarters inauguration date of 1997; neither date supplies dimensions.

Photos inspected: John Gómez, [Edificio Inteligente](https://commons.wikimedia.org/wiki/File:Edificio_Inteligente.jpg), CC BY-SA 3.0, west plaza night facade (`refs/1.jpg`); SajoR, [Edificio EPM-FachadaEste-Medellin](https://commons.wikimedia.org/wiki/File:Edificio_EPM-FachadaEste-Medellin.JPG), public domain, east facade and service equipment (`refs/east.jpg`); FilMedellín EDIFICIO EPM_0002_3, copyright reference only, park approach (`refs/plaza.jpg`). Dossier `refs/2.jpg` depicts the Contraloría and was excluded. No reference image, external mesh, scan or texture ships.

| Feature | Model | Basis |
| --- | --- | --- |
| Twin plaza service crowns | 70 m | Revised photo estimate to restore the dominant towers; not surveyed |
| Central office roof | 58.6 m | Estimated from 14 main office levels at 4.15 m |
| Wing roof | 54.35 m | Photo estimate, upper tiers step back |
| Main office floor count | 14 levels | Published count; rows regularized |
| Owned site | About 120 × 75 m | OSM way 28669194 |
| Plaza-facing cores | 14 × 18 m each | Revised photo estimate |
| Other main cores | 12 × 13 m | Photo estimate |
| Pilotis | Six, 1.5 m square, 12.45 m high | Structural abstraction of photographed supports |
| Recessed lobby | Two storeys, 8 m behind central front slab edge | Photo-based approximation |
| Upper terrace setback | 1.4 m per tier | Photo estimate |

The previous 62 m crown matched CTBUH's floor-count estimate but underrepresented the towers relative to the glass roof in the photographs and independent review. The revised 70 m maximum is an explicit modeling estimate, rather than a new sourced height claim. The rear and end service cores stay lower.

## Geographic frame and rigid ground

[OSM way 28669194](https://www.openstreetmap.org/way/28669194), © OpenStreetMap contributors, ODbL 1.0, is the only provider building replaced; exact way ID and ring remain in `footprint.js`. Detached auditorium, park buildings, neighbours and roads are excluded. The mapped side from `[-75.5782592,6.2450131]` to `[-75.5780450,6.2456998]` establishes N17E, checked against the opposite long edge. Origin `[-75.57785,6.2453]`, metres east/up/south, rigid y=0, rotation −17° baked once into both GLBs.

The terrain pad is independent of provider ownership. Literal geographic corners are precomputed from the building-frame rectangle x=−83…83 m, z=−106…110 m. It includes the plaza and a 50 m halo around the structure, enough to cover the surrounding 38.22 m Mercator lattice nodes at this latitude. Five reference points stay within the headquarters site, selecting a rigid median rather than sampling the widened edges. The feather is 25 m. No runtime terrain module, absolute elevation, DEM height or Mercator stretch is imported or baked into the generator/GLBs.

The original footprint-tight pad let interpolation bridge high terrain nodes across the front wing. In the revised world preview, nine points at building-frame x=−32/0/33 m and z=−56/0/60 m are checked against the actual padded terrain and landmark datum, from both bearings. All nine residuals are exactly 0 m in all four measured near/street views. The measured datum is about 1486.401 m; this number is evidence only and is not an authoring constant.

## Review g18a fixes

The four-storey opening under the central office span now has two rows of three grounded pilotis reaching its first floor slab. A two-storey glazed lobby, recessed 8 m, leaves the front colonnade open. The entrance canopy ends embed into the two west service cores. Both LODs preserve these contacts.

The two plaza-facing cores widen from 10 × 13 m to 14 × 18 m and rise 8 m above the previous crown. Muted buff cladding distinguishes these main masses from the pale rear cores and floor bands. Open lattice crowns retain real gaps, piers, crossbars and caps in both LODs. The stepped wing silhouette, cylindrical ducts and fins remain.

All office glass uses one subdued tone instead of alternating light/dark panes; floor bands are 0.9 m thick. Disjoint glass panes and flush joints avoid overlapping facade layers. Far retains every floor and separate bays no wider than 9.5 m, with fewer fins and crown bars to keep the byte budget. Fine equipment, exact stair flights, irregular cladding and interiors remain abstracted.

## Measured exports and verification

Build: `pnpm build:top-cities-landmarks edificio-inteligente-epm --no-check`. Bounds match in both LODs: 94.16 m east–west × 129.35 m north–south, grade 0 m and crown 70 m.

| LOD | Before tris / draws / bytes | After tris / draws / bytes | After KiB |
| --- | --- | --- | ---: |
| Near | 21,284 / 4 / 1,252,764 | 22,488 / 4 / 1,316,488 | 1285.6 |
| Far | 8,508 / 4 / 472,980 | 8,484 / 4 / 457,472 | 446.8 |

`tmp/top-cities/edificio-inteligente-epm/review-fix/metrics.json`: zero layered faces, zero coplanar overlaps, no member-end or far window-rhythm candidates, no below-grade geometry, 1.2% back-face sweep hits (within the 2% gate). Scoped depth generation drops zero material-cycle edges and `--check` passes. Five focused tests verify dimensions/LOD envelope, supported plaza and dominant crowns, every fin root/canopy contact with negative cases, provider footprint fit, and pad coverage of the surrounding lattice nodes. No test asserts `SPEC.ready`.

Two look-fix rounds were used. Actually inspected exported sheets:

- `tmp/top-cities/shots/edificio-inteligente-epm/review-fix-1/near/edificio-inteligente-epm-glb-near-light-sheet.jpg`
- `tmp/top-cities/shots/edificio-inteligente-epm/review-fix-1/far/edificio-inteligente-epm-glb-far-dark-sheet.jpg`
- `tmp/top-cities/shots/edificio-inteligente-epm/review-fix-2/far-light/edificio-inteligente-epm-glb-far-light-sheet.jpg`
- `tmp/top-cities/shots/edificio-inteligente-epm/review-fix-2/near-dark/edificio-inteligente-epm-glb-near-dark-sheet.jpg`

Each sheet covers overview, plaza facade, rear, roof, entrance and detail. After the first look, far panes were tightened to retain window rhythm and far fin density reduced to recover the byte budget. The massing was retained.

App evidence is under `tmp/top-cities/edificio-inteligente-epm/review-fix/app/{city,world}/`: `far.png`, `near-b107.png`, `street-b107.png`, `near-b287.png`, `street-b287.png`. Near and street views from both bearings were inspected, showing an unobstructed model, clean floor rows, grounded pilotis and no ridge through the wings or duplicate provider blocks. `report.json` identifies loaded/active layers and LOD; the world `report-near-b107,street-b107,near-b287,street-b287.json` contains the corrected coordinate footing measurements. The initial report's null footing values were a measurement-script conversion error, corrected before acceptance.

Cityscape: **verified** in these static daytime far/near/street app views. Full 3D world: **verified** at near/street from bearings 107/287 with normal terrain exaggeration, using the shared unlit/vertex-shaded runtime path. These checks do not verify nighttime app shading, terrain eviction, repeated mode transitions, exaggeration changes, failure lifecycle or device performance. Independent re-review remains required.

Preview slot L (Cityscape 3314/admin 3315, world 3316/admin 3317) used a dedicated `/tmp/codriver-epm-g18ar-*` copy and an in-memory-built renderer bundle (`f4efdd42453d`). The shared `public/peregrine.js` was never rebuilt. Source over HEAD and process cleanup are recorded in the scratch report. No git write, online deployment or shared-tree app server was used.

Final validation: **5/5 landmark tests and 3/3 scoped EPM registry tests pass**, including the lattice policy read dynamically in the test only. Global catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass (425 entries / 836 GLB variants). The earlier aggregate run completed **891/895**, with unrelated failures in Pantheon source/export bounds, Pavillon Roger-Gaudry's `spandrel` palette, Marché Atwater's `canopy` palette and Parliament Hill's status/readiness mismatch; no unrelated file was changed.
