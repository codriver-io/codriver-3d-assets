# Akershus Fortress — Akershus slott

Original procedural exterior of **Akershus slott** on the harbour promontory at Akershusstranda, Oslo. Håkon V’s castle of the 1290s, rebuilt for Christian IV as a Renaissance residence (Blåtårnet 1623, Romerikstårnet in the 1630s). Warm pink-tan rendered walls, darker brick crow-step gables, dark slate roofs, two verdigris stair towers, and a grey rubble bastion. Asset ID `akershus-fortress`. The later barracks east of the castle are not in this model.

## Sources and rights

Consulted 2026-10-08:

- [Wikipedia — Akershus slott og festning](https://no.wikipedia.org/wiki/Akershus_slott_og_festning) and [Store norske leksikon](https://www.snl.no/Akershus_slott_og_festning): medieval core, Christian IV Renaissance rebuild, Blåtårnet and Romerikstårnet as the two stair towers. No published surveyed height in metres was found.
- [Visit Oslofjorden](https://www.visitoslofjorden.no/fakta-akershus-slott-og-festning): the fortress as a whole is much larger than the castle. This model is the castle and the inner bastion ring.
- OSM relation [13931023](https://www.openstreetmap.org/relation/13931023). Spire parts on Blåtårnet (way 904553012) and Romerikstårnet (way 904552993) are tagged `height=36`. Wing `building:part` height tags are mapper estimates and were not used as eaves (they produced six-storey walls).
- [Harbour elevation](https://commons.wikimedia.org/wiki/File:14-09-02-oslo-RalfR-370.jpg), Ralf Roletschek, **GFDL 1.2**: three-storey west front, brick stepped gable with a round window, dark slate roofs, clock tower to the north, onion tower to the south, spires well clear of the ridges.
- [Land-side bastion](https://commons.wikimedia.org/wiki/File:Akershus_Fortress_panorama.jpg), jimg944, **CC BY 2.0**: rubble rampart, Jomfrutårnet, and the grounds. The yellow barracks in that view are omitted.
- Karpedammen panorama, Spike, **CC BY-SA 4.0**, was used only to confirm which outbuildings to leave out. Interior photos in the dossier were not used.

No photos, textures or third-party meshes are shipped. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Frame and dimensions

Real metres, **+X east, +Y up, +Z south**. Origin `[10.73611, 59.90667]`. The harbour facade faces west (`frontageBearing` 270). The mapped rings already carry that orientation, so the GLB is not rotated again. `y=0` is the inner-fortress plateau on the flat basemap. The cliff down to Akershusstranda is not in the mesh. `padM` is 120 m. `terrainPad` uses every footprint, the podium ring as the height reference, datum `median`, feather 8 m.

| Feature | Dimension | Evidence |
| --- | --- | --- |
| Blåtårnet and Romerikstårnet tips | 36 m | OSM `height=36` on the spire parts. Mapper tags, not a survey |
| Romerikstårnet shaft | 22.5 m | **Estimated** so the clock and lantern clear Nordfløyen’s ridge |
| Blåtårnet shaft / onion | 16.8 m / bulb to 23.2 m | **Estimated** from the harbour photo: the onion starts just above the neighbouring eaves |
| Nordfløyen eave / ridge | 14.5 m / 21 m | **Estimated.** OSM part height was 31 m and made a six-storey wall |
| Romeriksfløyen ridge | 17.5 m | **Estimated** from the three-storey harbour front |
| Skriverstuefløyen / Sydfløyen ridges | 16 m / 17 m | **Estimated** so the inner roofs sit under the stair towers |
| West rampart parapet | 9.0 m | **Estimated** curtain on the plateau. Photo 5’s 15–20 m of stone is the scarp below y=0, left to terrain |
| Jomfrutårnet / Munks tårn | 14 m / 11 m | **Estimated** from the land-side panorama. The gap between them stays open |

## Geometry and materials

Editable folder: `src/peregrine/landmarks/top-cities/akershus-fortress/`. Build:

```sh
pnpm build:top-cities-landmarks akershus-fortress --no-check
```

The castle is the mapped wings and towers around the open borggård, plus the podium and the west and north-east rampart. A wall shared with a neighbour is not drawn. The roof slope over that wing still is, or the ridge chimneys sit in the sky. Dormers are only on west-facing slopes; south-slope dormers read as boxes in the sky from the harbour. Crow-step brick and the round oculus are the west gable of Nordfløyen, near LOD only. Romeriksfløyen and Skriverstuefløyen, the long harbour faces, have a tall arched lower register and a smaller upper row. Chimneys are stone shafts with copper pots on the long ridges.

Nine materials, same names in day and night: `stone`, `render`, `brick`, `slate`, `copper`, `glass`, `glow`, `trim`, `iron`. Day `render` is `#c48470` (warm pink-tan) and `stone` is `#8b8880` (grey rubble); night is `#7a5246` and `#56534e`. Brick crow-steps stay `#8d5340`, darker than the walls. Quoins and window surrounds stay pale `trim`. Day `glow` equals `glass` (`#2a343c`); night `glow` is `#e4c07a`. Copper is a colour (`#3f6e58` / `#243f34`), darkened so ACES exposure 1.2 does not turn it mint. Far drops `brick` and folds those gables into stone or render, and drops mullions, shutters, quoins and lintels, so it stays at 8 draws. Eaves (0.40 m) and the rampart foot batter (1.05 m) are the same on both LODs. The bastion face is two battered planes with projecting rubble courses.

## Verification and costs

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 15,989 | 9 | 843,268 | 823 |
| Far | 3,090 | 8 | 166,780 | 163 |

Both are inside the building caps (60k / 14 / 2.5 MB near; 12k / 8 / 500 KB far) and inside the 15–30k / 2–8k aim. Bounds are about 78 × 36 × 148 m. The tallest vertex is a spire tip at 36 m. Nothing sits below grade. The rampart foot batter is 1.05 m and the rubble courses stay inside 1.3 m, under the 1.6 m overhang check.

Sheets in ignored `tmp/top-cities/shots/akershus-fortress/`:

1. Procedural near light, after the eaves were lowered: `akershus-fortress-procedural-near-light-{overview,facade,harbour,detail,south}.png`, compared with Roletschek’s harbour view and the bastion panorama. The court is open, the gable is brick, the roofs are slate, and both copper caps clear the ridges.
2. The same harbour and overview views then showed chimneys and dormer boxes in the sky, because a low terrace was burying whole roof slopes. Slopes over a wing’s own footprint now draw anyway, and dormers stay on the west slopes. Confirmed on `akershus-fortress-procedural-near-light-harbour.png` and `…-overview.png`.
3. Exported GLBs: `akershus-fortress-glb-near-light-sheet.jpg`, `akershus-fortress-glb-near-dark-sheet.jpg`, `akershus-fortress-glb-far-light-sheet.jpg`, `akershus-fortress-glb-far-dark-sheet.jpg`.

## Approximations

Way 904552992, a south-west pier of about 4 m², is left out: the shared footprint check rejects a ring under 4 m². The onion is a faceted teardrop and the dormers are boxes. The rampart is coursed rubble on the mapped rings, raised to a 9 m harbour curtain; it is not the 15–20 m quay cliff, which stays terrain so the mesh is not doubled in Full 3D world. Wings meet with some roof intersections. Munks tårn (way 592419641, mapped height 12 m, pyramidal roof) stands apart on purpose; it is a real tower, not a stray prism. Vågehalstårnet’s flat copper roof is the mapped `roof:colour` `#a8c2a4` on way 904553007. Cityscape and Full 3D world were not driven in the app.
