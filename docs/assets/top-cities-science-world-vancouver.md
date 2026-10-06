# Science World, Vancouver

Original procedural model of Bruno Freschi's Expo 86 Expo Centre, now Science World at 1455 Quebec Street, at the eastern end of False Creek. The permanent reflective silver geodesic envelope and post-2011 expanded podium are modeled. The temporary 2026 FIFA football wrap in the aerial reference is deliberately excluded; it is useful for the roof and footprint only.

Sources and references are registered with checked page URLs and Commons authors/licences in `prototypes/assets3d/catalog.d/science-world-vancouver.json`. Official Science World history identifies the Expo 86 building and architect; Summit BIM quotes its structural engineering consultant describing the 47 m dome and 2011 retrofit. BC Government calls the temporary wrapping a 40 m diameter sphere. Mapped OSM circle is approximately 40 m across, corroborating the diameter.

| Dimension | Model | Basis |
| --- | --- | --- |
| Sphere maximum diameter | 40 m | BC Government diameter, OSM way 363224101 |
| Highest point | about 47.33 m including lamp housing | approximately 47 m, structural engineer in Summit BIM |
| Sphere centre / cutoff | y=27 / 15 m | estimated centre, OSM part min_height=15 |
| Red drum | 16 m radius, y=10–15 m | estimated fit to clipped sphere; OSM pedestal 10–15 m, mapped radius about 14.5 m |
| Lower podium | 10 m tall | way 363224098 height |
| East gallery wing | 14 m tall | way 363224097 height |
| Entire mapped envelope | approximately 100 × 92 m | OSM way 37084312 |
| Panel frequency | 8 near / 4 far | visual approximation, preserves triangular faceting |
| Tube radius / light housing | .065 / .24 m near | photographic estimate |

Origin `[-123.10391135,49.27334995]` is the centre of the mapped dome's bounds. Real metres, X east/Y up/Z south; y=0 is local plaza grade. Sphere geometry is symmetric; the podium is built directly from mapped rings, with orientation already baked. Two controls on the longest lower-podium edge `[-123.1034203,49.2732005]` and `[-123.1031599,49.2731204]` establish its southeast-facing skew (see exact dossier for control coordinates); the wing follows the northeast/east crescent, rather than a cardinal grid. All five provider outline/part ways are owned; nearby way 363059115 is an outbuilding and excluded.

The faceted panels use three subdued silver/blue materials with metalness and separate normals. Thin triangular steel tubes and octahedral light housings are merged by material. Dark palettes dim the envelope and illuminate the node lights. The red drum closes onto the clipped shell. The lower curved curtain wall and taller crescent wing have red piers, horizontal glazing divisions, roof-edge bands and repeated raised photovoltaic/skylight modules. Five radial roof masts and tension braces meet the podium roof. Far preserves the globe, polygon panels, node lights, red collar, both podium heights and roof pattern; it folds two materials and reduces geometric subdivisions.

No image texture, external mesh, wrapped football graphic, letters, interior, piles below local grade, or seawall is shipped. Glazing is opaque for predictable silhouettes; reflections are approximated by facets/material variation. Drum diameter is slightly larger than the mapped pedestal so it meets the sphere's lower circle; it stays within the complete replacement outline. Exact panel frequency, light count, tension-mast positions and facade modules are estimates. Current renewal equipment and temporary banners are excluded.

The explicit terrainPad uses the complete building ring, median datum and three east-side references: a disc minimum crossing False Creek would risk sinking the rigid building. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**; median pad needs DEM and entrance checks in the app. No hardware performance claim.

## Costs and verification

Near: 29,133 triangles / 10 draws / 1,718 KB. Far: 6,947 triangles / 8 draws / 417 KB, default-scene GLB metrics. Export: `pnpm build:top-cities-landmarks science-world-vancouver --no-check`. Normals retained, bridgeLift stripped, repeated vertices welded; no decoder or compression extensions.

Reference sheet looked at: `tmp/top-cities/science-world-vancouver/refs-sheet.jpg`. First procedural contact sheet looked at: `tmp/top-cities/shots/science-world-vancouver/science-world-vancouver-procedural-near-light-sheet.jpg` (overview, creek facade, opposite side, above/plan, entrance and shell detail). It established the globe/drum and crescent roof proportions; far subdivision was reduced and mesh vertices welded to satisfy the byte budget without removing the distinctive faceting.

Final exported comparison looked at: `tmp/top-cities/shots/science-world-vancouver/export-reference-comparison.jpg`, containing the reference photos next to the final GLB near light (overview/facade/back/roof/entrance/detail), near dark (overview/facade/back/detail), far light and far dark (overview/facade/back/roof) sheets. Individual constituent sheets are `science-world-vancouver-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. This final comparison confirms the shell, red collar and two base heights remain recognizable in both LODs and themes. The second look showed that the far shell needed finer faceting; far roof modules became raised quads, facade members became open triangular prisms, and the geodesic frequency rose from three to four while cost fell. Lamp housings were enlarged slightly so the dotted night pattern reads clearly.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/science-world-vancouver/science-world-vancouver.test.js`: 158 passed, zero failed (2026-10-06); four dedicated assertions complete in approximately half a second. They verify shell diameter/apex, closed shell rays from every side and multiple elevations, drum support, eastern wing height, mapped footprint containment with 0.45 m trim tolerance, retained far faceting/lamps, and LOD silhouette. Source/export round-trip, named palettes and byte budgets pass the common conformance test.

`node scripts/asset-catalog.mjs`: passed. `qa-metrics.mjs --ids science-world-vancouver`: no issues; zero different-material coplanar overlaps, zero back-face hits in 279 exterior rays, y minimum zero, no removable bridgeLift attributes. Detailed QA and test logs are under `tmp/top-cities/science-world-vancouver/`. Three look iterations total; no shared files changed. Independent reviewer acceptance remains the coordinator's next gate.
