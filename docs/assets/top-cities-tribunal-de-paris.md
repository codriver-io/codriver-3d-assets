# Tribunal de Paris — Paris

Pale glass courthouse with an L-shaped podium, three shrinking stacked slabs and planted terraces between them.

## Sources and rights

- [Setec:160 m,38 floors,base plus three shrinking glass blocks](https://www.setec.fr/blog/projets/tribunal-de-paris/)
- [Justice ministry:2018 courthouse identity and160 m authorised height](https://www.tribunal-de-paris.justice.fr/75/la-necessite-dun-nouveau-palais-de-justice-paris)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tribunal_de_Paris)
- [OSM way 481196425: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/481196425)
- [Reference photograph: File:Tribunal de Paris - Octobre 2019.jpg — Vincevinss — CC-BY-4.0](https://en.wikipedia.org/wiki/File:Tribunal_de_Paris_-_Octobre_2019.jpg)
- [Reference photograph: File:Tribunal de Paris seen from Batignolles park.jpg — Coppertarzan — CC0](https://commons.wikimedia.org/wiki/File:Tribunal_de_Paris_seen_from_Batignolles_park.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tribunal-de-paris/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 160 | Published primary engineer and justice ministry |
| Podium | 30 | Photo estimate |
| Upper roofs | 84 /124 /160 | Photo estimate |
| Upper plate lengths | 164 /119 /80 | Estimated within mapped podium |
| Upper width | 42 | Photo estimate |
| Bearing | 26.45 | Two mapped long-edge control points |

Origin `[2.30994743, 48.89499214]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The full L-shaped mapped podium carries three progressively shorter upper slabs. Recessed4 m glass necks support them and create visible shadow breaks, rather than floating boxes. Three stepped gardens include roof-contacting trunks and low-cost clustered foliage. Far keeps all slabs, necks, planted terrace groups and a coarser individual-pane grid. The old courthouse facade/interior, unrelated La Defense panorama and adjacent sorting-centre construction image were rejected; the2019 completed skyline and Batignolles-park view establish this structure. Upper plate sizes and terrace elevations are estimates; the mapped base and long facade control the orientation.

Completed2018 Renzo Piano courthouse at Batignolles, not the old Ile de la Cite court. Published160 m and38 floors; L-shaped mapped podium with three shrinking glass blocks and three planted terraces. Podium30 m and upper roof elevations84/124/160 m, upper footprints,4 m recessed necks and tree sizes estimated from completed photos. Photovoltaic wing-walls, lettering, interiors and adjacent sorting facility omitted.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 24532 | 6 | 392348 |
| far | 7224 | 6 | 129260 |

Deterministic metrics: `tmp/france/tribunal-de-paris/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tribunal-de-paris.jpg`. Mapped orientation/top check: `tmp/france/shots/tribunal-de-paris/tribunal-de-paris-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

