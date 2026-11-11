# Hôtel de Ville Esch-sur-Alzette

Esch-sur-Alzette, Luxembourg. Current permanent exterior, authored 2026-11-10.

Current 1935–1937 Isidore Engler town hall: symmetrical pale stone wings, five tall council-chamber windows, four-pier entrance portico, triangular central pediment, slate hipped roof and dormers. Mapped plan about 53.6 × 20.7 m with an 18.4 m central projection. Overall 21.2 m and floor/roof splits are photographic estimates; OSM has a rounded, unsurveyed 20 m height. The roof includes muted solar-panel fields. Pediment relief figures are simplified around a blank panel; heraldry, inscription, branding, flags and temporary banners are omitted. Geographic yaw baked once; plaza and neighbouring buildings are excluded.

## Geographic frame and dimensions

Origin: [5.9846487, 49.4963099]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 215.44046° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/251441992.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Main plan | 53.6 × 20.7 m | OSM way 251441992 |
| Overall height | 21.2 m estimate | Photo ratios; rounded OSM tag 20 m is not a survey |
| Central projection | 18.35 × 2.75 m | Mapped front risalit |

## References and rights

- [Luxembourg government architectural walk: Isidore Engler, 1935–1937 and sculpted town hall facade](https://luxembourg.public.lu/fr/visiter/arts-et-culture/patrimoine-architectural-luxembourgeois-i-esch-sur-alzette.html)
- [Zinneke, Esch-sur-Alzette Place de l’Hôtel de Ville 2022-05 ---4, CC BY-SA 3.0; current wide exterior comparison only](https://commons.wikimedia.org/wiki/File:Esch-sur-Alzette_Place_de_l%27Hôtel_de_Ville_2022-05_---4.jpg)
- [Jean-Marie Ottelé (jmo), central exterior pediment 2013-10-01; copyright, no redistribution licence stated; comparison only](https://industrie.lu/HoteldeVilleEsch.html)
- [Jean-Marie Ottelé exterior detail image; copyright, comparison only](https://industrie.lu/im/i/g/IMG_7555mir_welle_bleiwen_wat_mer_sin.jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/251441992)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The current Engler town hall keeps four storeys, five tall council windows, a four-pier portico, central triangular pediment and a broken-slope slate hip roof with small dormers. The relief is composed of two joined two-figure groups around a blank panel; inscriptions, heraldry and banners are omitted. Near includes a muted photovoltaic field on the front roof plane; far retains dormers, sash openings, portico and pediment. Courtyard paving and adjacent blocks are excluded. All dimensions above the mapped plan are proportional estimates.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6910 | 6 | 120200 |
| far | 5486 | 6 | 103080 |

Build: `pnpm build:top-cities-landmarks esch-sur-alzette-town-hall`. Identity tests: `src/peregrine/landmarks/top-cities/esch-sur-alzette-town-hall/esch-sur-alzette-town-hall.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids esch-sur-alzette-town-hall --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/esch-sur-alzette-town-hall/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/esch-sur-alzette-town-hall.jpg`. Red-ring procedural plan: `tmp/r4/shots/esch-sur-alzette-town-hall/esch-sur-alzette-town-hall-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/esch-sur-alzette-town-hall/esch-sur-alzette-town-hall-glb-far-dark-sheet.jpg`. The named central pediment, council-window proportions, portico contacts and low roof profile match the exterior comparison. Muted stone/slate colours, source-plan alignment and far/dark facade rhythm reviewed; no floating features or remaining deterministic QA flags.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Replaced the two small upright figures with two attached, joined bas-relief groups, each containing two people with separate rounded heads/noses, broad torsos and bent connected arms and legs. Their 14.54 m combined span is 79.2% of the 18.35 m tympanum. A muted sculptural stone material distinguishes the silhouettes; the central panel stays blank and no heraldry or lettering is present. Added a geographically correct full-facade overview preset.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: Matched full-facade NEAR/FAR views are paired in the final sheet, preserving all four heads, joined torsos and bent limbs across the same relief span. The opposite and return faces retain every separate window row; FAR only reduces head tessellation and pre-existing dormer/sash/solar detail. The one final sheet replaces its weak SW pair with the matched full-facade pair.

New contact sheet: `tmp/followup/sheets/esch-sur-alzette-town-hall.jpg`. Identity/conformance tests passed; `tmp/followup/esch-sur-alzette-town-hall-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
