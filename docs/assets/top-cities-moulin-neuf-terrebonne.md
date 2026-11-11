# Moulin neuf de Terrebonne

Terrebonne’s long stone river mill with slate gable, repeated dormers, end chimneys, open water culverts and the red-framed glazed link to its eastern annex.

## Identity and sources

Current exterior at Terrebonne, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://fr.wikipedia.org/wiki/Moulin_neuf_de_l'île_des_Moulins)
- [Mapped replacement footprint 413192479](https://www.openstreetmap.org/way/413192479)
- [Mapped replacement footprint 413192480](https://www.openstreetmap.org/way/413192480)
- [Municipal mill identity, exterior photos and 1850 history](https://terrebonne.ca/patrimoine-bati/moulin-neuf-de-lile-des-moulins/)
- [Municipal inventory distinguishes the separate library and Moulin Neuf addresses](https://terrebonne.ca/wp-content/uploads/2026/01/Liste-biens-immeubles-inventaire-patrimonial-2024.pdf)
- [File:Moulin neuf - Terrebonne - 01.jpg · Jeangagnon · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Moulin_neuf_-_Terrebonne_-_01.jpg)
- [File:Moulin neuf - Terrebonne - 02.jpg · Jeangagnon · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Moulin_neuf_-_Terrebonne_-_02.jpg)
- [Ville de Terrebonne, Moulin neuf exterior 1 · Ville de Terrebonne (photographer not credited) · All rights reserved, © Ville de Terrebonne; viewed only](https://terrebonne.ca/wp-content/uploads/2023/07/IMG_5044-1024x683.jpeg)
- [Ville de Terrebonne, Moulin neuf exterior 2 · Ville de Terrebonne (photographer not credited) · All rights reserved, © Ville de Terrebonne; viewed only](https://terrebonne.ca/wp-content/uploads/2023/07/IMG_5009-1-scaled.jpeg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.63946185,45.69259875. Replacement OSM ways: 413192479,413192480. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Main mill plan | approx 37.5 × 14 | OSM way 413192479 |
| Main eave / ridge | 11.1 / 16.1 | Exterior photo estimates |
| Highest chimney | 18.3 | Exterior photo estimate |
| Basement ceiling / culvert crown | 3.4 / 2.1 | Photo estimates relative to lowest foundation |
| Annex plan | approx 16 × 12 | OSM way 413192480 |

Mapped orientation controls are LOCAL_RINGS[0][0] [-73.6397128,45.6926394] and LOCAL_RINGS[0][3] [-73.6392347,45.6926836]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The Commons article coordinate points at the separate eastern library, and the OSM Moulin Neuf label is on its small annex. The Commons exterior-photo geotag (-73.639475,45.692579) and the municipality’s current exterior photos identify the large western river building, way 413192479; the attached eastern annex 413192480 is included, and library 35307760 is excluded. The oldest exterior foundation/water-gate foot is local y=0, with the raised land-side entry floor at +3.4 m; no river or terrain is baked. Before app integration the land/water footing datum and entrance terrace need separate validation. Roof, dormer, culvert, chimney and gallery dimensions are estimates. Restricted city photographs are viewed for comparison only, never redistributed. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 2216 triangles / 5 draws / 41320 bytes; far: 1412 triangles / 5 draws / 30740 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/moulin-neuf-terrebonne.jpg and tmp/east/moulin-neuf-terrebonne/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Named-contact tests caught an 8 cm mismatch at the slightly skew annex wall: the gallery now terminates on the actual mapped wall at both corners, not its minimum-X bounding box. First visual correction added the dormer glazing and two subordinate roof stacks, and cooled the masonry to the grey reference colour.
