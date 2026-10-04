# Reunion Tower

Asset `reunion-tower`, 300 Reunion Boulevard, Dallas. Original procedural model of the
observation tower: an open geodesic ball (aluminium struts, round light nodes, a blue glass
belt, a concrete deck ring and a crown) on a banded central shaft and three outer elevator
shafts with glazed faces. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md).
Source: `src/peregrine/landmarks/top-cities/reunion-tower/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height to the roof | 561 ft (171 m) | published ([Wikipedia](https://en.wikipedia.org/wiki/Reunion_Tower)) |
| Architect, year, address | Welton Becket and Associates, 1978, 300 Reunion Boulevard | published (Wikipedia) |
| Light nodes | 259 fixtures; 2026 upgrade adds pixels per node (8,547 points) and does not move the joints | published ([Wikipedia](https://en.wikipedia.org/wiki/Reunion_Tower), [Dallas Morning News, 2026-03-20](https://www.dallasnews.com/news/2026/03/20/reunion-tower-upgrade-adds-thousands-of-lights-to-dallas-skyline/)) |
| Axis | `[-96.808943125, 32.775362575]` | mapped: centroid of OSM way 1491048359, the central shaft |
| Central shaft | ring radius 5.75–6.30 m; model radius 6.05 m | mapped |
| Outer shafts | centres at bearings 101.3 / 310.5 / 209.0 deg, 9.0–10.6 m from the axis, ring radius about 2.2 m; model radius 2.18 m, glass on the outward face | mapped (ways 1491048355–57) |
| Ball ring | same 19-point ring twice (ways 1428779225 and 1491048358), 16.45–17.47 m from the axis, tagged height 170 / min_height 137 | mapped |
| Geodesic, crown, glass belt, pour bands | class-I 8-frequency cage, belt, ring deck, crown | photographs (Batrak; Tribble 0244 and 0262) |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Top | 171.0 m at the north-pole light housing; strut centreline pole at 170.74 m | sourced height |
| Sphere | centreline radius 16.15 m, centre at 154.59 m, housings to 16.41 m | inscribed in the mapped ring; an often-quoted “about 118 ft” (36 m) diameter is wider than the ring and was not followed |
| Cage | near: class-I 8V, 5-side tubes of radius 0.09 m; far: 4V, 3-side tubes of radius 0.13 m. South cap cut at unit y −0.55 so the basket stays open around the shafts | frequency chosen so the close photographs read as a continuous geodesic; 259 is the fixture count, not the vertex count (a full 8V has 642) |
| Nodes | octahedra, radius 0.26 m, split into `glow` / `light` / `lamp` by latitude | estimated size, between the old ~8 in fixtures and the 2026 24 in fixtures, so the joints read at city scale |
| Glass belt | spherical zone 0.55 m inside the struts, y 152.55–162.7 | estimated from the Tribble worm’s-eye |
| Deck ring | annulus y 151.05–152.35, inner radius 7.6 m, outer 13.85 m, plus an open lip at y 162.95 | estimated; a solid disc filled the basket and was opened |
| Crown | cylinder radius 4.4–4.7 m around y 166, with a lip at 168.25 m | estimated from the open cap in the photographs |
| Shafts | centre and three outers from y 0 to 151.15 m, pour bands 3.6 m (8 bands on the far LOD), short collar into the deck | radii and bearings mapped; band pitch estimated |
| Elevator glass | one 0.95 m strip per outer shaft, proud of the concrete | estimated width; the outward face is the mapped one |

## Materials

Seven merged materials, one draw each: `concrete` and `concrete_dark` (alternating pour bands, deck, crown), `glass` (observation belt and the three elevator strips), `metal` (struts), and `glow` / `light` / `lamp` (light housings). Those three names are unshaded: nearly the same aluminium grey by day, and red / cyan / amber latitude bands at night. Light and dark palettes share keys. No textures.

## Modelling decisions

- The silhouette is the ball on four banded shafts. From a few hundred metres the shafts read as one mast with blue seams, which is what the postcard shows; the four columns separate in the street and worm’s-eye views.
- The ball is a strut-and-node cage, not a solid drum. The glass is a belt. Below it the deck is a ring and the lattice hangs around the column tops. The crown stands in the open upper cap.
- The sphere follows the mapped ring so the model sits inside the red footprint. The top node is exactly the published 171 m.
- Far LOD keeps the same radii, deck, crown, glass and four shafts, with a coarser cage, so the bbox matches the near model within a metre.
- Below 40 m every vertex is inside the six mapped rings (the runtime layer’s own `ownsPoint`). The ball overhangs the shaft cluster and is inside its own ring.
- The Hyatt Regency (way 610136503 and its parts) is a neighbour and stays provider-owned. The foundation pad is underground and is not modelled. Nothing is below grade. Downtown Dallas is flat fill, so there is no `terrainPad`; `padM` is 24 m.
- Runtime zone: drawn within 4.5 km from zoom 12.5, near LOD within 700 m.

## Approximations, honestly

- Maintenance walkways between the shafts, the entrance pavilion and the animated light show are omitted. Night colour is three static bands.
- Band pitch, glass-belt height, crown size and the deck radii are read off photographs, not a survey. A metre of difference in the belt would still read as the same tower.
- The node count is the 8V cage (denser than the 259 fixtures). The joints are where the lights sit.
- The 2026 fixtures are larger than the nodes in the older Commons photographs. The model splits the difference so the discs survive at the far LOD.
- Looked at three procedural passes. The first floor was a solid plug; it is now a ring, and the street camera was pulled back so the facade is the whole tower rather than a column close-up.

## Verification

Compared with the dossier photographs (`tmp/top-cities/reunion-tower/refs/`, not shipped): the postcard (Batrak), the four shafts (Tribble 0262) and the worm’s-eye basket (Tribble 0244). Renders: `tmp/top-cities/shots/reunion-tower/` procedural near light (overview, facade, roof, ball, shafts, plan) and the exported GLB near/far in light and dark. Cityscape and Full 3D world: not tested yet, integration is checked separately.

## Cost

Near 25,128 triangles, 7 draws, 725 KB. Far 4,244 triangles, 7 draws, 127 KB. Building budget is 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far.
