# Chords Bridge — Jerusalem

Original procedural texture-free model of Santiago Calatrava’s 2008 light-rail and pedestrian bridge at Jerusalem’s entrance. This is a free-standing landmark with no vehicle road layer; the Red Line started operating in 2011.

Sources: [architect](https://calatrava.com/projects/bridge-of-strings-light-rail-train-jerusalem.html), [construction weld inspector](https://www.tecnocontrolnde.com/en/bridge-at-gerusalem/), [Wikipedia](https://en.wikipedia.org/wiki/Chords_Bridge), and OSM light-rail ways [75517167](https://www.openstreetmap.org/way/75517167) / [255019640](https://www.openstreetmap.org/way/255019640) plus pedestrian way [397713632](https://www.openstreetmap.org/way/397713632). Reference photos: [Petdad, Jerusalem Chords Bridge.JPG, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Jerusalem_Chords_Bridge.JPG) and [Little Savage, Jerusalem Chords Bridge 5.JPG, public domain](https://commons.wikimedia.org/wiki/File:Jerusalem_Chords_Bridge_5.JPG); both licence pages checked. Photographs remain in ignored scratch, with no texture or capture shipped.

| Dimension | Model / basis |
| --- | --- |
| Highest point | 118 m above local grade; construction inspector and Wikipedia |
| Cables | 66, 33 per curved arm, both LODs; construction inspector |
| Overall length | 360 m including approaches; Wikipedia |
| Central main span | Published 160 m; not an independently surveyed support span in this model |
| Deck width | 14.82 m; Wikipedia |
| Mapped railway bridge section | 270.47 m average of two OSM rail axes |
| Approach extensions | South 55 m, east 34.53 m, estimated straight tangent extensions to complete the published length |
| Track gauge | 1.435 m; OSM tags |
| Deck elevation | 7 m over flat grade; photo estimate |
| Mast displacement | 26 m west, 28 m north from foot to tip; photo estimate |
| Triangular spar, deck depth, walk width, rail/posts | Visual approximations, not engineering sections |

The model uses local metres east/up/south about [35.200,31.789], with orientation baked from the paired mapped tram lines. y=0 is flat local grade, no absolute altitude or DEM baked in. The triangular mast is a continuous closed loft, slender at the top and broader in the middle. Every stay runs into the mast and the steel deck; both details keep 66 cables. Two tram tracks and a glass-sided inner pedestrian path follow the curved deck. White steel, grey track bed, pale teal glass and limestone approach embankments use named merged materials, with a continuous warm pedestrian light band in the night palette.

Mapped bridge ways are open light-rail/footway lines and do not identify provider building polygons. `footprintless: true`, empty `FOOTPRINTS`/`OSM_WAYS`, and separate `ALIGNMENT_WAYS` avoid claiming ownership of adjacent buildings or vehicle streets. The dossier lists no replaced building geometry. A supplemental shared-helper context query returned HTTP 504; the existing dossier, not that failed query, supplies the model alignment. Ramp geometry is approximate; pedestrians/trams are not animated, catenary equipment and urban furniture are omitted. No road/navigation fitting is claimed.

Far keeps the full mast and cable silhouette, all four rails, pedestrian rails and supporting posts; small sleepers and underdeck ribs are omitted; the glass side rhythm remains with coarser samples. Deck bed/walk hidden bottom faces are omitted where they meet the structural deck, avoiding duplicate surfaces. End ramps sit on stone embankments or local grade rather than terminating in mid-air.

Verification and costs below describe the final exported files. Cityscape: not tested yet; Inspector evidence does not establish either mode.

## Export costs and inspected evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 26,642 | 10 | 1,001,772 | 978.3 |
| Far | 6,394 | 10 | 207,076 | 202.2 |

Both LOD bounds: x −61.285..160.243 m, y 0..118 m, z −22.466..182.133 m. Both are comfortably under the bridge triangle/byte caps; far uses the maximum ten material draws. Hardware performance is not measured.

Actually inspected the supplied `tmp/top-cities/chords-bridge/refs-sheet.jpg`, the initial export sheet, and `tmp/top-cities/shots/chords-bridge/reference-and-export-sheet.jpg`. The combined sheet places both original reference photos beside final near/far light/dark overviews, front/facade, back, above/roof, deck, underside, mast, near/far detail and procedural deck evidence. Individual contact sheets are in `final-near-light/`, `final-near-dark/`, `final-far-light/`, `final-far-dark/` beneath that screenshot directory; source evidence is `procedural/chords-bridge-procedural-near-light-sheet.jpg`.

The visual comparisons confirm the curved deck, slender inclined spar, spatial harp strings and clear underside. The first inspection/check round led to removal of hidden stacked bed faces and glass cap faces, rounding the rail posts to remove their competing caps, and clamping the light band at grade. Far keeps the pedestrian glass band after the metric screening highlighted its omission.

Final focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/chords-bridge/chords-bridge.test.js`: 590 passed, zero failures. Six landmark tests independently raycast the deck width, spar, support embankment and open crossing; check every named cable/rail/post/sleeper/rib/walk/glass terminal excluding the member; reject a shortened cable; and verify bounds, far silhouette and exported material/normal round trip. Landmark tests take about 0.3 s.

`node scripts/asset-catalog.mjs` passes (336 entries / 578 variants) and `pnpm assets:preview` builds the local catalog. Depth table regenerated with `--ids chords-bridge`; matching `--check` passes with zero cycle edges dropped. Scoped `qa-metrics.mjs` reports zero layered faces, zero coplanar pairs, 0% near back-face hits, and zero unsupported cable candidates in either LOD. Its only candidate is a far “wide window bands” heuristic: these are the actual continuous glass pedestrian parapets, not a building facade. No shared-file blocker; only the authorized generated depth table was touched outside the landmark-owned files. App modes and terrain integration remain not tested.
