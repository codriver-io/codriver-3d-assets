# Cité de l'espace — Ariane 5

Original procedural model of the full-scale Ariane 5 replica in Toulouse's Cité de
l'espace, visible from the eastern A61 ring road. Scope: central stage and pointed
fairing, two EAP boosters, their compact plinths, the tall umbilical mast with its
splayed sloping foot and three service ties. The museum, park, planetarium and
Mir/Soyuz/LEM exhibits are excluded. Source folder:
`src/peregrine/landmarks/top-cities/cite-de-l-espace/`.

## Sources and dimensions

| Element | Model | Evidence / uncertainty |
| --- | --- | --- |
| Replica height | 53 m | [Replica manufacturer JF-TAPIA](https://www.maquettes-industrielles.com/en/space-models.html), OSM core way 1276158603 height=53 |
| Core and fairing diameter | 5.4 m | [ESA core-stage description](https://www.esa.int/ESA_Multimedia/Images/2021/11/Ariane_5_booster_transfer); mapped core diameter approximately 5.35 m |
| EAP case diameter | 3.05 m | [ESA technical brochure](https://www.esa.int/esapub/br/br250/br250.pdf); mapped booster circles approximately 3.3 m |
| Booster height | 32.3 m to tip including exhibit stand | [ESA](https://www.esa.int/Enabling_Support/Space_Transportation/Ariane/Ariane_5_boosters_EAP) gives 31 m for EAP; photographed stand/cone estimate. OSM height=27 is visibly too short compared with the photos and is not followed |
| Mast | 49 m, 3.6 × 2.5 m | Height from OSM way 1276158601; section enlarged from mapped 3.18 × 1.96 m after photo review, not an engineering survey |
| Mast foot | 8.45 × 4.65 m at grade, tapering to 3.6 × 1.2 m at 17 m | OSM way 1276158602 height=17 and outline; tapered shape estimated from photographs |
| Fairing | White cylinder from 31.4–45.1 m, ogival nose 45.1–53 m | Estimated from dossier photographs, not the modern flight article's internal staging |
| Core ivory shell | 4.1–31.4 m, white conical skirt 1.1–4.1 m below | Photo estimate; small thermal-cladding patches in near LOD |
| Booster centers | Local design frame `[4.55,-0.34]`, `[-4.67,-0.18]` | Centroids of ways 1276158604/5 |
| Service ties | Levels 17, 32.2 and 43.5 m | Photo estimates; attached between mast front and core surface |

Dossier photos, used only for visual comparison: Poppy, *Ariane 5 (mock-up)*
(CC BY-SA 3.0); kallerna, *Cité de l'espace Toulouse 1* (CC BY-SA 4.0);
Rama, *Ariane 5 at the Cité de l'Espace-IMG 1889* (CC BY-SA 3.0 fr);
Mike Peel, *Ariane 5 at Cite de l'Espace 9* (CC BY-SA 4.0);
Yoshi Canopus, *France-Toulouse-Cite de l'espace-Ariane 5* (public domain);
Jamiecat, *Fusée Ariane 5 (4332428498)* (CC BY 2.0).
Links and rights are in the catalog record and ignored dossier `refs/SOURCES.txt`.
No photos, textures or third-party meshes are shipped.

## Geographic frame and replacement

Origin `[1.4930070294117646,43.58556052352941]` is the average of the core's
17 unique mapped circular vertices. Two control points (the booster centers)
set the southeast baseline bearing 123.25 degrees; front faces northeast,
bearing 33.25 degrees. Rotation is baked into source vertices and GLBs once.
Axes are east/up/south in real metres, with y=0 at the rigid exhibit footing.

Five original provider replacement rings are the mapped core, two boosters, mast and mast foot; two additional authored rings bound the corrected mast and buttress.
The adjacent La Cité des Petits museum outline and its building parts are
explicitly excluded. All near/far vertices fit these rings with the runtime's
normal ownership slack (tested). Low plinth rims and shell fittings extend a few
centimetres beyond mapped circular radii. The museum under the exhibit remains
provider-owned; its overlap with the model needs separate application review.
`padM=17` covers the compact group. The site appears level; no hill or terrain
height is baked in, and no terrain integration claim is made.

## Geometry and materials

Closed surfaces of revolution define the core, fairing, booster barrels, noses,
foot drums and hollow nozzle lips. Adjacent core/fairing and booster/nose
surfaces meet at shared edges without stacked end caps. Three 0.26 m square umbilical
bars bridge open air to the detached mast. The mast foot tapers both in height
and width; its faces use outward winding. The core remains supported by short
white posts and its nozzle support; green equipment pods have connecting rods.

Eight merged draws per LOD: `white`, `ivory`, `tan`, `metal`, `blue`, `red`,
`gold`, `green`. Small flag grids, orbit marks and original geometric
`CITE DE L'ESPACE` stencil strokes use these materials. Markings wrap onto
curved shells and penetrate their support surfaces slightly, avoiding detached
panels or coplanar overlays. Dark palette dims the same materials; no glowing
flight engines or invented illumination. Far retains the fairing, two boosters,
flange joints, flag grids, orbit marks, mast and ties, dropping title strokes,
cladding patches, base ribs, seams, lightning rods and stairs.

Approximations: simplified logos and flag grids rather than exact institutional
artwork; fairing shoulders, panel layout, engines, conduits, stair and service
attachment hardware estimated. No interiors or launch-pad landscaping. Model
is an exhibit replica, not a flight-ready Ariane 5 engineering reconstruction.

## Visual and numerical verification

Reference sheet viewed: `tmp/top-cities/cite-de-l-espace/refs-sheet.jpg`.
Initial procedural sheet:
`tmp/top-cities/shots/cite-de-l-espace/iteration-1/cite-de-l-espace-procedural-near-light-sheet.jpg`.
This showed cropped full-height cameras and reversed title strokes: cameras
were moved outward, text direction corrected, markings wrapped to shells and
the mast foot narrowed toward its upper contact. A final numerical inspection
also corrected the tapered mast-foot winding.

Final exported sheets under `tmp/top-cities/shots/cite-de-l-espace/final/`:
`cite-de-l-espace-glb-{near,far}-{light,dark}-sheet.jpg`, with overview, facade,
back, roof, street, nozzle detail and top view in each. Comparison contact
sheet `comparison.jpg` places all four exported sheets beside the dossier.
Both LODs preserve the narrow pointed rocket silhouette, two visible boosters,
the tall independent mast and open tie gaps; dark views retain the same parts.

Focused tests cover 53 m height, 5.4/3.05 m diameters, nose taper, booster ends,
open case and mast gaps, service connections, mast slope, mapped containment
and GLB round trip (normals, materials, byte metrics, no textures or bridgeLift).
All ten landmark-specific/conformance checks pass; the current requested
unfiltered two-file run passes all 257 tests (zero failures).
Deterministic QA: no coplanar pairs after removing hidden mast-foot grade faces,
0% back-face hits, y=0–53 m, no removable bridgeLift bytes.
The current whole-catalog check validates this record but fails on an unrelated
unregistered `dome-de-la-grave-far.glb`; no other worker files were changed.
Export and catalog commands:

```sh
pnpm build:top-cities-landmarks cite-de-l-espace --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/cite-de-l-espace/cite-de-l-espace.test.js
node scripts/asset-catalog.mjs
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids cite-de-l-espace --out tmp/top-cities/cite-de-l-espace/qa-metrics.json
```

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 14,020 | 8 | 428,120 B (418 KiB) |
| Far | 5,640 | 8 | 178,596 B (174 KiB) |

| Gate | Status |
| --- | --- |
| Cityscape | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |
| Independent exported-GLB review | initial PASS-WITH-NITS; requested defects fixed, revised reviewer check pending |
| Device performance, streaming/lifecycle, duplicate museum extrusion | not tested |

Only this landmark's source, record, documentation and exports changed; no
shared runtime files, runtime clones, bundle build or deployment involved.


## Independent-review corrections (2026-10-09)

Initial independent verdict: PASS-WITH-NITS, recognisability 4/5; three requested
fixes applied in one look/fix iteration:

| Finding | Before → after |
| --- | --- |
| Khaki/olive surfaces | Core ivory `#d1c6a4` → `#e5dcc2`, booster/fairing white `#efefeb` → `#f5f5ef`; separate beige-only mast/foot `#d2c6a4`, with corresponding lighter night palette |
| Bare core and hidden booster bells | Ivory lower taper → 3 m tall white core skirt, radius 1.8–2.7 m; booster solid lower barrels → white tapering skirts over exposed flared metallic bells; case diameters and tips unchanged |
| Detached mast and hairline ties | Center z=10.5 → 6.95 m, section 3.18 × 1.96 → 3.6 × 2.5 m; clear rocket gap 6.87 → approximately 3 m; ties 0.12/0.18 → 0.26 m in both LODs |
| Plain mast (optional) | Retained inexpensive horizontal tile seams in near; no invented prominent cap box |

The original OSM rings remain to suppress all original provider mast extrusions.
Two bounded photo-estimated rings contain the revised body/foot; the shift and
widening are explicit visual approximations rather than silently altered OSM
measurements. The mapped origin, booster baseline and all rocket proportions
remain fixed. The museum outline is still excluded.

`REVIEW.md` had no Prepare command and `REVIEW-2.md` was absent. Regenerated the
standard exported-GLB review sheet with:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids cite-de-l-espace --no-ref --tag 'After review fixes' --out tmp/top-cities/shots/cite-de-l-espace/revision
```

Looked at `tmp/top-cities/shots/cite-de-l-espace/revision/cite-de-l-espace.jpg`;
the generic cameras crop this very tall exhibit, so also judged full-height
owned cameras and engine close-ups in
`tmp/top-cities/shots/cite-de-l-espace/revision/comparison.jpg` (exported near/far,
light/dark beside all dossier photographs). The revision visibly has lighter
cream cladding, beige mast, white tapered skirts, exposed dark bells and a
closer mast; both LODs retain the pointed 53 m fairing and separate boosters.
The reference tile is intentionally omitted from the generic sheet because the
initial review's Wikipedia tile incorrectly showed Mir/Kvant; the owned
comparison uses the correct Ariane photographs.

Additional raycasts pin the white core taper, metallic bells, wide booster
skirts, thicker ties and corrected mast position. Deterministic revision metrics
are in `tmp/top-cities/cite-de-l-espace/revision-metrics.json`: no flagged
artifacts or budget excess. Integration status remains separate and untested.

Revision validation: requested two-file test command **257/257 passed**, seven
landmark tests plus three conformance tests for this asset; exported QA has
zero coplanar pairs, zero back-face hits, no removable bytes, bounds y=0–53 m.
Near **14,020 / 8 / 418 KiB**, far **5,640 / 8 / 174 KiB**.
