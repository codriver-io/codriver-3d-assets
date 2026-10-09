# Nidaros Cathedral

Asset `nidaros-cathedral`, Nidarosdomen, Kongsgårdsgata, Trondheim. Norway's cathedral over the grave of St Olav: grey-green soapstone, a Gothic west screen, a copper nave and a central spire, with the octagonal choir at the east. Original procedural model. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs.

## Identity and what a driver sees

From the west close, at about 100 m: two square towers, a steep screen gable between them, a large rose, two rows of statue niches and a pointed portal. From the river side the long green nave, aisle roofs and flying buttresses run to a crossing tower whose spire is the tallest thing on the close. From the east the octagon reads as an eight-sided pyramid, with the chapter house to the north of the choir. At night the rose and the clerestory are the lit glass; the rest of the soapstone stays dark.

## Sources and dimension table

| Feature | Value | Basis |
| --- | --- | --- |
| Tip | 87 m to the cross. Copper ends at 84 m | Store norske leksikon, the 2016 survey. OSM way 404802446 tags the copper at 82 m. Older guides said 91 m; some accounts still say about 97 m |
| Plan | 102 m long, 50 m at the greatest width. Nave about 40 × 23 m, vault 21 m | SNL. The mapped outline (way 417245741) spans about 102 × 51 m in the building frame |
| West screen | frontage bearing 268.108° (1.892° south of due west). Towers 36 m, pinnacles 44 m | OSM parts for the towers; the bearing is the mapped west wall |
| Crossing | walls 38 m, corner pinnacles 48 m, spire above | OSM way 404802428 |
| Nave / choir / transepts | nave eaves 23 m, ridge 35 m; choir eaves 22 m, ridge 32 m; transept eaves 16 m, ridge 26 m | OSM Simple 3D parts |
| Octagon | drum to 18 m, pyramid to 36 m, centre-to-flat 5.85 m. SNL gives an 18 m outer diameter and a 10 m central room | OSM way 404809336, kept inside the outline |
| Chapter house | eaves 8.2 m, ridge 14 m | OSM way 405025414 (`height` 14) |
| Origin | [10.3968665, 63.4269167], centroid of way 417245741. `padM` 70. No `terrainPad` | The close is a flat river terrace; relief under the footprint is under 2 m |

## Frame

Real metres, +X east, +Y up, +Z south. The mesh is authored along the nave (+u toward the octagon, +v toward the south tower) and `geometry.js` applies one `rotateY` of 1.892° so it sits on the outline. The layer does not rotate it again. `y = 0` is the west-front pavement. Nothing is baked for terrain or sea level.

Cityscape and Full 3D world: not tested yet, integration is checked separately. On Full 3D world the terrace should stay near one grade; the model has no hillside pad.

## Materials

Seven materials, the same keys in light and dark, and the same seven on the far model: `stone` (grey-green soapstone, light `#6f746c`), `trim` (ribs, strings and statue bands, a step darker), `recess` (portals, set proud of the wall), `roof` and `spire` (muted verdigris `#5f9a82`), `glass` (aisle and tower windows), `glow` (rose and clerestory; unshaded, warm at night). No textures. The tall west-tower lancets sit above the gallery band; a shorter pair stays below it.

## Modelling decisions

- One footprint ring, way 417245741. Neighbouring blocks (Erkebispegården, the museum, Waisenhuset) are not the cathedral. Tiny pinnacle parts are not extra rings.
- West-front statues are relief bands with pediment canopies, not the restored portrait set. The rose is a stone ring, sixteen spokes on the near model (eight on far) and a glass disc. The 2015 scaffold on the gable is not modelled.
- Aisle walls sit inside the outline between the seven mapped nibs. The nibs and the flying buttresses are only at those piers.
- The chapter house is a hall with a half-round east apse. The real plan is a small cross; the outline does not give that shape room to read.
- North and south lobes of the octagon ambulatory are notches a few metres deep. A chapel box does not sit in them, so only the east chapel is built. The ambulatory drum is shifted east and kept narrower than the OSM part so its corners stay in the neck of the outline.
- The south transept face is recessed so the door and the triple lancet sit on the stone, with jambs and two corner nibs out to the mapped edge. There is no south porch: the outline along the middle of that end is only a few centimetres past the wall.

## Budget

Near 24651 triangles, 7 draws, 1758488 bytes. Far 4262 triangles, 7 draws, 259472 bytes. Far keeps the near silhouette (the largest axis gap is 4 cm). The cross tip is trim at 87 m. A ray through the rose centre hits `glow`; a ray through a west door leaf hits `recess`; the octagon peak is `roof` at 36 m.

## Evidence

Compared with the dossier photographs (`tmp/top-cities/nidaros-cathedral/refs/`, not shipped): the west front (DXR, `5.jpg`) and the east aerial (Thomas Bjørkan, `6.jpg`). Judged renders: `tmp/top-cities/shots/nidaros-cathedral/nidaros-cathedral-procedural-near-light-sheet.jpg`, then the exported GLBs `nidaros-cathedral-glb-near-light-sheet.jpg`, `nidaros-cathedral-glb-near-dark-sheet.jpg`, `nidaros-cathedral-glb-far-light-sheet.jpg`, `nidaros-cathedral-glb-far-dark-sheet.jpg`, and `nidaros-cathedral-glb-near-light-top.png`.

Inspector: `/asset-preview.html?asset=nidaros-cathedral&view=facade` (also `overview`, `roof`, `south`, `east`, `rose`, `portal`, `spire`).

Cityscape and Full 3D world: not tested yet, integration is checked separately.
