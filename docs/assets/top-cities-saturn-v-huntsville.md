# Saturn V — Huntsville vertical replica

Original procedural model `saturn-v-huntsville`, U.S. Space & Rocket Center, One Tranquility Base, Huntsville, Alabama. This is the full-scale vertical outdoor replica built in 1999, visible from I-565; the historic horizontal Saturn V inside Davidson Center and the smaller Saturn I in the Rocket Garden are excluded. Folder contract: [top-cities landmarks](../top-cities-landmarks.md).

## References and dimensions

| Element | Model | Basis |
| --- | --- | --- |
| Grade to escape-tower tip | 111 m | [NASA full-scale Saturn V height](https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-grades-5-8/); nominal full-scale envelope used as overall model height |
| Main diameter | 10.06 m, local stiffening rings 10.16 m | [NASA: S-IC 33 ft diameter, 138 ft length, five F-1 engines](https://www.nasa.gov/image-article/this-week-nasa-history-s-ic-t-arrives-marshall-april-9-1967/) |
| Identity | 1999 outdoor vertical replica | [Rocket Center replica restoration account](https://www.rocketcenter.com/content/2025-08-08/us-space-rocket-center-launches-revivethesaturnv-fundraising-campaign) |
| Anchor | -86.6559120, 34.7110991 | OSM attraction [node 3091286888](https://www.openstreetmap.org/node/3091286888), not the approximate scaffold anchor at -86.6546, 34.7106 |
| Orientation datum | 28 degrees geometry rotation; bearing 332 degrees on adjacent short edge | OSM Davidson Center way 304569947 control points (-86.6558520,34.7107332) to (-86.6559017,34.7108105); rocket roll-pattern phase relative to this edge is estimated |
| Base slab / piers | 16 m square, 0.6 m slab, piers to y=8 | Estimated from photographs; simplified four broad display piers |
| Engine bells | five, mouth y=4.3, outer diameter 2.96 m | Count sourced; bell profile, mouth clearance and placement estimated |
| First / second stage tops | y=46 / 70 m | Photo-derived division of nominal envelope |
| Upper transition / third stage | y=70–76 cone, diameter 6.6 m to y=88 | Photo-derived |
| Apollo adapter / service module / capsule | y=88–93 / 93–99 / 99–102 | Photo-derived |
| Escape tower | open truss y=102–104.4, motor and tip to y=111 | Photo-derived |

Looked at the provided dossier contact sheet first: it principally shows Saturn I and unrelated interiors. Added only two accurate replica photos, stored in ignored `tmp/top-cities/saturn-v-huntsville/refs/`: [Davidson Center-27527-3.jpg](https://commons.wikimedia.org/wiki/File:Davidson_Center-27527-3.jpg), Ken Thomas, public domain (2008), whole rocket and display piers at night; [Saturn V 1-1 Replica, US Space and Rocket Center, Huntsville, AL.jpg](https://commons.wikimedia.org/wiki/File:Saturn_V_1-1_Replica,_US_Space_and_Rocket_Center,_Huntsville,_AL.jpg), Naomi Persephone Amethyst, CC BY-SA 4.0 (2017), low-angle base, corrugations and USA lettering. These are comparison references only; no photograph, texture, scan, font asset or traced mesh ships.

## Geographic frame and ownership

Real metres, +X east, +Y up, +Z south; y=0 is the rigid display forecourt grade. Rotation is applied directly to every geometry before export, never again by the host. The original dossier covers the smaller Rocket Garden east of this replica. A shared-helper Overpass lookup failed all three endpoints; two bounded OSM API map extracts were saved locally as `map.xml` and `davidson-map.xml` to disambiguate the rockets and identify the actual attraction node.

No building or building:part is mapped at the replica. `footprintless: true`, `FOOTPRINTS=[]` and `OSM_WAYS=[]` deliberately avoid masking neighbouring Davidson Center way 304569947, service building way 389380986 or the solar roof way 1161123970. All model vertices, including the rotated slab corners, lie within the 12 m rigid pad. No scene/DEM datum or latitude stretch is baked in.

## Geometry and materials

The stepped cylindrical shell assigns black roll pattern and white paint to separate surface facets, with no duplicate cylindrical skin. Six merged materials: white, black, support concrete, engine/tower metal, muted red lettering and stripes, blue flag canton. Light and dark palettes have the same keys. Hollow F-1 bells keep actual mouth cavities; four fins are thin closed prisms. Four broad sloping piers support the thrust plate. Escape-tower legs and side braces join the capsule cap and escape-motor base, preserving negative space in far.

Near uses 96 main-shell facets, 24 bell segments and shallow structural corrugation bars. Far uses 32 / 12, drops the corrugations, and retains all stages, fins, piers, engines, truss contacts and markings. USA is original stroke geometry; flags have seven coarse red stripes and a blue canton, without stars. Far markings sit 0.55 m proud to tolerate driving-range depth precision; near 0.16 m. Depth ordering is generated and checked separately.

## Approximations and limits

The nominal 111 m envelope includes the estimated display supports in this model; actual flight-stack length excludes its display clearance, so stage heights are modestly compressed (about 4 percent). Main diameter is full scale. Stage transitions, fin dimensions, corrugation count, supports, engine bell profiles and roll-pattern phase are estimates rather than construction measurements. Small piping, United States lettering, flag stars, engine turbopumps, plaque ring, floodlights, adjacent tower, museum, surrounding plaza and horizontal rocket are omitted. The pad and model are rigid; terrain placement has separate application gates. No Tesla hardware cost measurements.

## Export costs and evidence

Near: 13,076 triangles / 6 draws / 684 KiB; far: 3,416 triangles / 6 draws / 182 KiB. Both are below building budgets with considerable headroom; far bounds match near. Exports: `public/models/buildings/saturn-v-huntsville.json`, `saturn-v-huntsville-near.glb` and `saturn-v-huntsville-far.glb` (700,652 / 186,592 bytes).

Evidence is kept under `tmp/top-cities/shots/saturn-v-huntsville/`: procedural-near-light-sheet and exported GLB sheets for near/far and light/dark, including overview, facade at street level, back, roof, engines and escape detail. First visual review widened the display piers and corrected the flag stripe/canton intersection. Named-support tests caught escape-leg feet beyond the capsule cap; moved them inward to a 0.6 m radius. Deterministic QA caught engine backing discs only 0.2 m below the thrust plate; moved them down to y=7.2, leaving a 0.8 m gap and preserving hollow mouths.

Focused landmark tests pin height, main diameter, stage diameters, black bands, fins, all five hollow bells, near/far silhouette, slab/thrust-plate pier contacts and capsule/motor contacts for each escape leg and brace. Negative shortened endpoints prove contact tests reject free ends; GLB round-trip checks bounds, costs, materials and texture-free export. Final test, catalog, metrics and depth results are recorded after the final export below.

Cityscape: **not tested yet**. Full 3D world: **not tested yet; integration is checked separately**.

Final review: looked at `tmp/top-cities/shots/saturn-v-huntsville/final-contact-sheet.jpg`, showing both reference photographs next to the final exported GLBs in near/light, far/dark, near/dark and far/light, with front/street, back, above, engine and escape detail views. The three-stage profile, fins, roll bands and hollow supported base remain recognizable; far keeps the silhouette and open escape structure. The full floodlighting seen in the night photo is not simulated.

Final deterministic checks: seven landmark-specific tests and all three Saturn V registry checks pass. Combined focused run: 595/596 pass; the sole unrelated failure is `charles-bridge` footprint area (not a real polygon). QA metrics: no issues, zero layered or coplanar overlap area, zero back-face hits in 224 rays, no below-grade or redundant bridge-lift bytes. Depth generation/check: current, zero cycle edges dropped. Full catalog check initially stopped on another worker's missing `docs/3d-top-cities-vancouver-public-library.md`; the retry and `pnpm assets:preview` stopped on the same unrelated missing document. The unmodified `loadAssetCatalog` validator also passed against an isolated scratch catalog containing the exact Saturn V record, source/doc links, manifest and both exports. No shared source required changes other than the explicitly allowed generated depth table.
