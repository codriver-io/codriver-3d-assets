# Palacio Real de Madrid

Stable asset ID: `palacio-real-de-madrid`. Original procedural exterior of the Palacio Real, Calle de Bailén, the official ceremonial residence of the Spanish royal family: Giovanni Battista Sacchetti's square late-Baroque palace of 1738–1764, on Filippo Juvarra's idea, standing on the site of the Alcázar. Grey granite below, white Colmenar limestone above, metal hips, an open court, and the Prince's Gate on the Plaza de la Armería. Not the interiors, the Almudena Cathedral, the statues in the plazas, or the Sabatini and Campo del Moro gardens. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md).

## Identity and sources

Consulted 2026-10-04:

- [Wikipedia: Royal Palace of Madrid](https://en.wikipedia.org/wiki/Royal_Palace_of_Madrid): official residence, Baroque and classical, 135,000 m² and 3,418 rooms, Juvarra then Sacchetti, Sabatini and others, construction from 1738, Charles III in residence in 1764, BIC RI-51-0001061 (monument, 1931), coordinates 40°25′05″N 3°42′51″W. The Plaza de la Armería front is the main facade (rusticated base, giant order, balustrade, Prince's Gate with the royal arms). Plaza de Oriente is east, the Sabatini Gardens north, the Campo del Moro west, the Almudena across the plaza. Charles III had the king statues taken off the balustrade; the 1973 restoration put some back, including the south attic group.
- [Wikipedia (es): Palacio Real de Madrid](https://es.wikipedia.org/wiki/Palacio_Real_de_Madrid): Sacchetti's square plan around a square court, with projecting corner bodies. The south facade is the principal one because of the attic over the balustrade (Philip V, María Luisa, Ferdinand VI, Bárbara de Braganza).
- [Patrimonio Nacional](https://www.patrimonionacional.es/visita/palacio-real-de-madrid): the agency that administers the palace.
- A secondary compilation, [Casiopea: Palacio Real de Madrid](https://wiki.ead.pucv.cl/index.php/PALACIO_REAL_DE_MADRID), repeats facades of 131 m a side, 33 m high, and six storeys. That is the figure the balustrade is set to. It is not a measured survey.
- OpenStreetMap through the shared Overpass queue: **relation 30399** (the palace and the two south galleries). Outer ways 101817021, 151240792, 151240798, 151240788; inner way 151240796 is the main court. Derived coordinates © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Wikimedia Commons photographs in ignored `tmp/top-cities/palacio-real-de-madrid/refs/` only (nothing from them is in the repository or the GLBs): *Royal Palace of Madrid Panorama* (Fernando, CC BY-SA 4.0; the south front and the galleries), *Royal Palace of Madrid viewed from a distance* (Sheila1988, CC BY-SA 4.0; the east front), *Royal Palace of Madrid 01* (Bernard Gagnon, CC BY-SA 3.0; the Prince's Gate), *Plaza de Oriente (Madrid) 11* (Brian Snelson, CC BY 2.0), *Palacio Real de Madrid Julio 2016 (cropped)* (Tim Adams, CC BY-SA 4.0; the plan from above). *Main Staircase* (European Commission / Dati Bendo, CC BY 4.0) is an interior and was not used for the massing.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[-3.714234605, 40.418469883]` is the centre of the main block, not the centroid of the whole multipolygon (the south galleries pull that centroid into the plaza). The mapped walls run 4.7° off north. The model is authored in a building frame (`palacio-real-de-madrid-plan.js`: +u east, +v south, out of the Plaza de la Armería) and turned once by 4.70° about Y; the layer never rotates it again. The south front looks toward bearing **184.7**. `y = 0` is the palace platform (Plaza de la Armería and Plaza de Oriente). The drop to the Campo del Moro is not modelled.

Plan, in that frame: the main square is about 130 m on a side (mapped extremes 129.6 m north–south and 129.9 m east–west). Stone faces sit 0.95 m inside the ring so a cornice 0.68 m proud stays inside it. The south long wall is pulled further, to v = 60.55, because the mapped line at v ≈ 61.8 has two bites beside the gate. Corner pavilions and a north centre bay project; the wings between them are recessed. Court (way 151240796): u −26.13..25.13, v −31.02..20.17. Two lower galleries continue south to about v = 208, the west one notched between v ≈ 124 and 164.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Main block | mapped 129.6 m N–S, 129.9 m E–W | OSM relation 30399 |
| Repeated facade size | 131 m a side, 33 m high, six storeys | Casiopea compilation (secondary) |
| Balustrade | 33.2 m | set to that 33 m figure |
| Crown over the Prince's Gate | 40.4 m | estimated from the gate photograph |
| Royal Chapel lantern | 47.6 m | estimated, 11 m above the 36.6 m ridge; this is `SPEC.height`. OSM has no chapel part; the dome sits on the mapped north-centre pavilion |
| Statues on the balustrade | about 36.7 m | estimated |
| Hip ridge | 36.6 m, eaves at 31.6 m | estimated |
| Granite base | 0–10.4 m | estimated (two-storey rustication) |
| Piano nobile (`glow`) | 12.2–17.7 m | estimated |
| South galleries | wall 11.5 m, hip 14.7 m | estimated from the panorama; one OSM part tagged `building:levels=6` is not followed |
| Court | 51.3 × 51.2 m | OSM way 151240796 |
| Prince's Gate | opening u ±4.35 m, crown of the arch 9.05 m, door about 5.7 m behind the stone face | opening estimated; position is the centre of the south front |

## Model

Source `src/peregrine/landmarks/top-cities/palacio-real-de-madrid/`: `geometry.js`, `palacio-real-de-madrid-plan.js`, `config.js`, `footprint.js`, `views.js`, `palacio-real-de-madrid.test.js`. Build: `pnpm build:top-cities-landmarks palacio-real-de-madrid`. Six materials, one draw each: `stone` (Colmenar limestone), `granite` (base, court floor, columns, door wall), `trim` (string, cornice, balustrade, statues, crown), `roof`, `glass`, `glow` (piano nobile: pale by day, warm at night, unshaded).

Both LODs keep the square, the projecting pavilions, the open court, the hip roofs, the Prince's Gate with six columns and the crown, the balustrade, the Royal Chapel dome on the north range, and the two south galleries including the west notch. The dome is a stone drum, a lead-grey ribbed shell and a lantern, topping out at 47.6 m. A solid parapet with statue posts runs the outer eaves, and the hip eaves and pavilion caps sit behind it. Giant-order pilasters stand about 0.8 m proud on the south, east and west fronts, over a channelled granite base. The Armería galleries have round-arched openings and wider end piers. Windows are one bay at a time on the outer fronts and the court, including the south centre bay behind the giant order. Near adds pediments, pier blocks in the rustication and separate statue posts. Far keeps the dome, the parapet, the pilasters and the arches, with fewer posts. The same outer bounds are used at both LODs.

Cost (exported default scenes, after the second review pass): **near 17,564 triangles / 6 draws / 961,116 bytes; far 5,865 / 6 / 327,980.** The task budget for this pass is 35,000 / 10 draws near and 10,000 / 10 far; the shared building budget is 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Untested on Tesla hardware.

## Terrain (Full 3D world)

The palace stands on the bluff above the Manzanares. No DEM was sampled in this pass, so no metre of relief is claimed. `SPEC.terrainPad` is `{ rings: [FOOTPRINTS[0]], datum: 'median', featherM: 14 }`: only the outer ring, held at the median sample and feathered 14 m. The part rings are not terraces. `padM` is 230 and is unused while the pad is set. Expect the platform to stay up where the ground falls toward the Campo del Moro, and the west lip to meet that slope inside the feather. The model stays rigid on `y = 0`.

## Approximations

- Storey heights other than the 33.2 m balustrade, the bay pitch, the crown, the roofs and the gallery heights are estimated from the photographs.
- Hips are separate planes set behind the parapet. Pavilion caps are flat slabs under the balustrade, not hips.
- The crown is stacked blocks, and the arch is a ten-sided polygon (six at far). The chapel dome is a faceted shell with raised ribs, not a smooth surface.
- The giant order is a row of square pilasters, 0.80 m proud (0.82 m at the capital). Two bites in the mapped ring, on the north-east recess and the west front, keep the local projection at 0.52 m so the mesh stays inside the footprint.
- Light wells 307006518, 307006516 and 307006515 stay covered.
- Small mapped jogs (pilaster bumps, the north statue plinths) are left out. The south wall is about a metre inside its mapped line so the cornice clears the gate bites.
- King statues are posts, not likenesses. Most of the real balustrade was cleared under Charles III; the model keeps a regular row, which matches the restored south and east fronts more than a bare cornice.
- The Almudena, the plaza statues and both gardens are not modelled.

## Verification

Renders with `node .agents/skills/build-3d-city/scripts/shot.mjs palacio-real-de-madrid --source glb ... --out tmp/landmarks/shots/palacio-real-de-madrid`, read against `tmp/top-cities/palacio-real-de-madrid/refs-sheet.jpg`:

- Exported near, light: `palacio-real-de-madrid-glb-near-light-sheet.jpg` (south front, overview, roofs, Prince's Gate, east front, north front).
- Exported near, dark: `palacio-real-de-madrid-glb-near-dark-sheet.jpg` (south front, gate, east front; the piano nobile goes warm).
- Exported far, light and dark: `palacio-real-de-madrid-glb-far-light-sheet.jpg`, `palacio-real-de-madrid-glb-far-dark-sheet.jpg`.

What the earlier procedural sheets changed: the first plan sat outside the ring and the gate was a solid skin; both were rebuilt from the mapped corners. Hip quads were wound downward and disappeared under front-face culling; `quadUp` now keeps the world-space normal upward, and the grey hips show from above. The south face moved from the proud pavilion line back to v = 60.55 so the cornice stays inside the bites beside the gate.

Review pass (`tmp/top-cities/review/palacio-real-de-madrid/REVIEW.md`, recognisability 3/5): far window rows were one strip per floor, and the south centre bay had columns with no windows behind them. Far glazing is now one quad per bay on the outer fronts and the court, and the centre bay keeps the piano nobile and the upper windows between the columns, with the arch left open. Grade-level downward faces are omitted, column shafts end inside their capitals, and cornices on the short return cheeks project 0.30 m instead of 0.68 m, so the trim no longer lies on the neighbouring stone face.

Second review (`REVIEW-2.md`, recognisability 3/5): from a distance the roof read as flat slabs and the facades as a plain window grid. The chapel dome, the parapet with statue posts, the giant-order pilasters and the gallery arches were added in both LODs. Cityscape and Full 3D world were not re-tested.

Tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/palacio-real-de-madrid/palacio-real-de-madrid.test.js`. The landmark test pins the ~130 m square, the 40.4 m crown, the 33.2 m balustrade, nothing below grade, the glass door set back in the Prince's Gate, the six granite columns, the lit piano nobile, the granite base, the open court, the north hip, the east gallery roof, the empty west notch, containment in the outer ring, and far versus near bounds.

Placement modes: **Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately (`terrainPad` declared; no DEM sample).
