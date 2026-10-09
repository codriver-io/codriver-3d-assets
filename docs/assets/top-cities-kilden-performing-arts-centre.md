# Kilden Performing Arts Centre, Kristiansand

Original procedural model of the ALA Architects and SMS Arkitekter performing-arts centre on Odderøya, opened 6 January 2012. At road distance the building is a dark hall whose harbour front is one undulating oak canopy over a full-height glass wall. The oak wave is the signature; the other three sides stay a plain dark volume.

## Sources and rights

- [ALA Architects, Kilden](https://ala.fi/work/kilden-performing-arts-centre/): opened January 2012, local-oak front wall, concert hall of 1,200 seats, theatre of 700, 24,600 m².
- [Dezeen, 30 March 2012](https://www.dezeen.com/2012/03/30/kilden-performing-arts-centreby-ala-architects/): the oak underbelly cantilevers over the glazed harbour front; the other facades are dark and vertically folded.
- Provided shared-helper OSM dossier, `tmp/top-cities/kilden-performing-arts-centre/osm.json`: way [273362400](https://www.openstreetmap.org/way/273362400) only (`building=civic`, `levels=8`, no height tag). The parking house and the neighbouring Kunstsilo are separate buildings and are not in this model. © OpenStreetMap contributors, ODbL 1.0.
- Reference sheet `tmp/top-cities/kilden-performing-arts-centre/refs-sheet.jpg` viewed before authoring. Credits in `refs/SOURCES.txt`: trolvag (CC BY-SA 3.0), Ad Meskens (CC BY-SA 4.0), Knut Arne Gjertsen (CC BY-SA 3.0), Nico-dk (CC BY-SA 3.0), Bjoertvedt (CC BY-SA 3.0).

All geometry is original procedural work. No external mesh, photograph, texture or traced surface is shipped. Musée des Confluences was studied for merged material batches and LOD discipline, without copying its source.

## Dimensions and frame

| Feature | Value | Basis |
| --- | --- | --- |
| Roof | 22 m | Published cantilever line of the oak wall |
| Harbour front | about 93 m | Measured OSM edge of way 273362400 (C→D) |
| Plan depth | about 71 m | Same ring, landward from that edge |
| Glass setback | 26 m from the lip | Photographic estimate; the published whole oak wall is longer because the foyer ceiling continues behind the glass |
| Oak thickness | 0.32 m at the lip, 1.15 m at the hall | Photographic estimate |
| Frontage bearing | 258° from north | Direction the facade looks, toward the quay |
| Model origin | [7.996949782420708, 58.13912380863734] | Mercator area centroid of way 273362400 |

Geometry is authored in east / up / south metres and the rotation is baked. `y=0` is local quay grade. Nothing hangs below grade. The quay is flat, so there is no `terrainPad`; `padM` is 68 so the pad disc stays on the quay.

## Geometry and materials

The oak is a shared-vertex loft. It leaves the top edge of the dark hall, stays high across most of its depth, and curls down only in the outer quarter. Along the quay the lip is two broad lobes plus a small central nick: the north lobe bottoms near 15 m, the south lobe (the corner in the harbour profile) bottoms near 11 m, about half the facade, so the glass wall below stays open. Soffit and top skin keep their own vertices so the thickness edge stays crisp. Near adds narrow board ribbons, a second oak colour, on the soffit and the outer skin, inset from the lip and both ends so they do not serrate the silhouette. Far keeps the same wave and drops the boards.

Behind the glass, the hall is the clipped remainder of the OSM ring. Exterior edges carry a shallow pleat and, on the near model, thin horizontal seams. The roof is a flat cap at 21.6 m under the 22 m oak line. The glass is one opaque `glow` wall with proud mullions: day colour is a cool grey-blue, night colour is warm, so the grid does not disappear after dark. Steel columns that stand inside the foyer are not modeled.

Near materials: `oak`, `oakLine`, `metal`, `seam`, `frame`, `glow` (6 draws). Far omits `oakLine` and `seam` (4 draws). Light and dark palettes share those keys.

## Costs and verification

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 15,599 | 6 | 564 KiB (578,024 bytes) |
| Far | 4,227 | 4 | 135 KiB (138,284 bytes) |

Measured by `pnpm build:top-cities-landmarks kilden-performing-arts-centre --no-check`. Far bounds stay within a few centimetres of near on each axis. No texture and no `bridgeLift` remain in the GLB.

Looked at, beside the dossier reference sheet and the night harbour photograph:

- `tmp/top-cities/shots/kilden-performing-arts-centre/kilden-performing-arts-centre-procedural-near-light-sheet.jpg` and the facade, south, detail, overview, entrance and rear frames.
- `kilden-performing-arts-centre-glb-near-light-sheet.jpg`, `kilden-performing-arts-centre-glb-near-dark-sheet.jpg`, `kilden-performing-arts-centre-glb-far-light-sheet.jpg`, `kilden-performing-arts-centre-glb-far-dark-sheet.jpg`.
- `kilden-performing-arts-centre-glb-near-light-top.png` for the ring and the east/south axes.

The first procedural sheet showed the right wave, but the oak was stacked flat bands and the end-on soffit broke into teeth. The shell was rebuilt as one indexed surface, the boards were pulled back from the lip, and the south camera was moved onto the quay so the profile is the curl. A later review found the lip hanging to grade in several even scallops of flat yellow. The section now drops only near the outer lip, the lip is two unequal high lobes, and the near boards are a warmer second oak. The far GLB keeps that silhouette with a coarser grid and no boards. The 2026-10-08 review sheet is `tmp/top-cities/review/kilden-performing-arts-centre/kilden-performing-arts-centre.jpg`.

## Approximations and integration handoff

Board lines suggest the oak grain; they are not the twelve thousand planks. The dark walls are large planes with a light pleat, not the full vertical fold of the aluminium cladding. Glass is opaque, so the foyer ceiling behind it is not visible. Lip rhythm, glass setback and oak thickness are estimates from the photographs. Boats, the quay edge, Kunstsilo and interior halls are omitted.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No shared source file was edited, and nothing was published.
