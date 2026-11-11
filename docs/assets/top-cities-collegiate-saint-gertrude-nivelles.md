# Collegiate Church of Saint Gertrude

Nivelles, Belgium. Current permanent exterior, authored 2026-11-10.

Current restored Romanesque Sainte-Gertrude, after the 1984 westwork reconstruction and 2024 exterior work: broad arcaded westwork, projecting western apse, octagonal belfry with pyramidal slate cap, paired round stair turrets, long double-choir nave and tall eastern transept gables. Regional tourism publishes 102 m and 50 m; a local 2023 report says 60 m. Adopted overall 50 m is an estimate within conflicting published heights, not a survey. Mapped envelope approximately 102 × 47 m includes transept chapels and buttresses; published main transept width is 44 m. Cloister and town hall are excluded. Geographic yaw baked once.

## Geographic frame and dimensions

Origin: [4.32372, 50.59747]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 110.91191° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/30126781.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Overall mapped length | about 102 m | OSM outer ring; regional tourism publishes 102 m |
| Main nave / eastern transept | 25 / 44 m published widths | Mapped outer envelope is wider around chapels/buttresses |
| Current tower tip | 50 m adopted estimate | Regional tourism 50 m; local TVcom report instead says 60 m |
| Westwork body / belfry | 28.4 / 40.3 m | Photographic stage estimates |
| Turret roofs | 40.5 m | Photographic estimate |
| Jean de Nivelles | about 2 m | Published approximate statue size; simplified silhouette |

## References and rights

- [Regional tourism authority: 102 m church, two opposing choirs and Romanesque identity](https://www.destinationbw.be/fr/decouvrir/les-incontournables/la-collegiale-sainte-gertrude/)
- [Regional tourism brochure: 102 m length and 50 m tower](https://www.destinationbw.be/uploads/2020/01/brochure-fr-light.pdf)
- [TVcom 2023 reports 60 m: conflicting height retained as an estimate, not silently resolved](https://www.tvcom.be/info/societe/le-coq-de-la-collegiale-sainte-gertrude-de-nivelles-peut-chanter-nouveau/31847)
- [Cuspysan, Nivelles Collégiale Sainte Gertrude 2025-05-22 02, CC0; current side/east exterior comparison only](https://commons.wikimedia.org/wiki/File:Nivelles_-_Collégiale_Sainte_Gertrude_-_2025-05-22_-_02.jpg)
- [Donar Reiskoffer, Belgium Nijvel Main Church, CC BY 3.0; current reconstructed westwork comparison only](https://commons.wikimedia.org/wiki/File:Belgium,_Nijvel,_Main_Church.JPG)
- [Jean-Pol GRANDMONT, 0 Nivelles collégiale Ste-Gertrude, CC BY 3.0; westwork/aisle comparison only](https://commons.wikimedia.org/wiki/File:0_Nivelles_-_collégiale_Ste-Gertrude.JPG)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/30126781)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The current reconstructed westwork has a barlong front with twin-arched rows and a blind arcade, western semicircular apse/gallery, octagonal belfry and pyramidal cap, plus two round stair turrets. The old pre-war Gothic spire is excluded. A small helmeted jacquemart with joined torso/limbs stands on the southern turret’s ledge. The double-choir nave retains lower aisle arches and upper clerestory bays; the eastern transept has its coloured rows of Romanesque gable niches. The northern eastern chapel and southern sacristy follow the owned church outline. The adjacent cloister and town hall are excluded from the exact provider ring. Far preserves all major bays, turrets, apse gallery and pediment rhythm; it reduces curve and shaft segments. Fine sculpture, masonry tooling, clockwork and interiors are omitted; all stage heights are estimates.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15384 | 5 | 250784 |
| far | 7996 | 5 | 145776 |

Build: `pnpm build:top-cities-landmarks collegiate-saint-gertrude-nivelles`. Identity tests: `src/peregrine/landmarks/top-cities/collegiate-saint-gertrude-nivelles/collegiate-saint-gertrude-nivelles.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids collegiate-saint-gertrude-nivelles --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/collegiate-saint-gertrude-nivelles/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/collegiate-saint-gertrude-nivelles.jpg`. Red-ring procedural plan: `tmp/r4/shots/collegiate-saint-gertrude-nivelles/collegiate-saint-gertrude-nivelles-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/collegiate-saint-gertrude-nivelles/collegiate-saint-gertrude-nivelles-glb-far-dark-sheet.jpg`. One visual correction added the missing northern eastern chapel seen in the 2025 exterior and mapped footprint. Final exported sheet, refreshed mapped top and exported far/dark were inspected. The westwork, octagonal crown, paired round turrets, projecting apse/gallery and two transepts remain identifiable in far. Deterministic QA has no flags or dropped material-cycle edges.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Reduced FAR from 10,364 to 7,996 triangles (22.8%) using coarser arch curves, round turret/apse roof samples and sub-pixel jacquemart curve samples. NEAR is unchanged. Every arcade, window row, facet/bay and joined statue limb remains. The reference tile now uses the uncropped current 2025 exterior with the complete crown visible; the adopted 50 m height and documented 50/60 m source disagreement remain unchanged.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: All westwork/apse gallery rows, nave and aisle bays, transept windows/upper niches, eastern choir/chapel windows and turret/belfry openings remain face by face. FAR keeps the same octagonal main crown, paired round turrets, roof intersections, northern chapel and jacquemart silhouette; only curve samples are lower.

New contact sheet: `tmp/followup/sheets/collegiate-saint-gertrude-nivelles.jpg`. Identity/conformance tests passed; `tmp/followup/collegiate-saint-gertrude-nivelles-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
