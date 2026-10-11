# Palace of Westminster and Elizabeth Tower

Stable asset ID: `palace-of-westminster`. Original procedural exterior of the Palace of Westminster, Westminster, London SW1A 0AA: Charles Barry and Augustus Pugin's Perpendicular Gothic Revival palace of 1840-70, with Elizabeth Tower (completed 1859, the clock tower whose bell is Big Ben) at the north end and Victoria Tower (1860) at the south. The present building replaces the medieval palace burned in 1834. Westminster Hall (1097-99, hammer-beam roof of the 1390s) survives on the west and is in the model. Not the interiors, Westminster Abbey, St Margaret's, or the wider Parliamentary Estate. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md).

## Identity and sources

Consulted 2026-10-04:

- [UK Parliament, The towers of Parliament](https://www.parliament.uk/about/living-heritage/building/palace/architecture/palacestructure/towers-of-parliament): Elizabeth Tower **96.3 m** (316 ft); Central Tower **91.4 m** (300 ft), an octagonal spire over the Central Lobby.
- [UK Parliament, Facts and figures: Big Ben and Elizabeth Tower](https://www.parliament.uk/about/living-heritage/building/palace/big-ben/facts-figures/): four dials, each **7 m** across, of pot opal glass in a cast-iron frame; Anston stone, Clipsham stone and Caen limestone; the Ayrton Light shines when the Houses are sitting.
- [Wikipedia, Elizabeth Tower](https://en.wikipedia.org/wiki/Elizabeth_Tower): **96.3 m** (316 ft); base **12.2 m** (40 ft) square; dials **6.9 m** (22.5 ft) centred **54.9 m** (180 ft) above the ground. The model uses these dial figures. Parliament's 7 m is 10 cm larger.
- [Wikipedia, Victoria Tower](https://en.wikipedia.org/wiki/Victoria_Tower): **98.5 m** (323 ft) to the base of the flagstaff, and a further **22.3 m** (73 ft) to the crown finial, **120.8 m**. The Union Flag flies there, or the Royal Standard when the sovereign is in the palace. The Sovereign's Entrance is at the foot of the south face.
- OpenStreetMap through the shared Overpass queue (`tmp/top-cities/palace-of-westminster/`): relation **1567699**, outer way **367642719**, plus Elizabeth Tower way **123557148**, Victoria Tower way **367642689** (`height=96`, which is the masonry and not the finial), Westminster Hall way **367642704**, St Stephen's Hall way **367642699**, St Stephen's Porch way **367642700**. The Central Tower part way **1144193784** is `height=78` with a 16 m pyramidal roof. Courtyard holes stay with the provider. Derived coordinates © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Wikimedia Commons photographs, in ignored `tmp/` only (nothing from them is in the repository or the GLBs): Victoria Tower from Victoria Tower Gardens (Julian Herzog, CC BY 4.0); Elizabeth Tower and the north front (Christian David, CC BY-SA 4.0); Elizabeth Tower from the street (Dietmar Rabich, CC BY-SA 4.0). The Lords chamber interior, Monet's sunset and Turner's 1834 fire are in the dossier and are not the present exterior.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[-0.1245759, 51.4993173]` is the area centroid of relation 1567699's outer ring. The palace's long axis runs toward Elizabeth Tower on bearing **10.19°** (building +x). The river front looks toward the Thames on bearing **100.19°** (building +z). `angle` in `palace-of-westminster-plan.js` is the one `rotateY` applied at the end of `geometry.js`. The layer does not rotate the model again. There is no `rotationDeg` on `SPEC`. `y = 0` is the Embankment terrace and the yards. The site is Thames floodplain. No terrain is baked in, and there is no `terrainPad`.

The mapped river wall is straight, but about **3.1°** off the long axis, so in this frame it is the line `v = 39.7 − 0.0549 · (u + 94)`. The river range is a prism with that sloping front and a flat back at `v = 16.2`. Other ranges are axis-aligned and stop inside the west edge, which steps in and out. Elizabeth Tower's centre is `u = 151.58`, `v = −27.07`. Victoria Tower's centre is `u = −118.2`, `v = −34.1`.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Elizabeth Tower, tip | **96.3 m** | parliament.uk; Wikipedia |
| Elizabeth Tower, plan | **12.2 m** square; the model shaft is 12.2 m, the plinth 13.4 m, inside a mapped square of about 14.6 m | Wikipedia 40 ft; OSM way 123557148 |
| Clock | four dials, **6.9 m**, centres at **54.9 m**; hands at 10:10 on the near LOD | Wikipedia. parliament.uk says 7 m |
| Ayrton Light | a small unshaded lamp under a gold cross-orb at 96.3 m | parliament.uk names the light; the slate stages and gilt ribs below it are estimated from photographs |
| Victoria Tower, flagstaff base | **98.5 m** | Wikipedia |
| Victoria Tower, crown finial | **120.8 m** (98.5 + 22.3), and `SPEC.height` | Wikipedia |
| Victoria Tower, shaft | 20 m square, inside a mapped outline about 24.8 m across the buttresses | OSM way 367642689; the 20 m wall is estimated |
| Central Tower | spire to **91.4 m** | parliament.uk. OSM part tops at 78 m and is treated as the lantern, not the tip |
| Palace length | about 300 m along the river; the model runs from the Victoria Tower's west wall to Elizabeth Tower's east wall, about 286 m | published length; OSM outline |
| River wall / roofs | wall 26 m, ridge 36.2 m, bays about 5.2 m | estimated |
| Westminster Hall | walls 16.5 m, ridge 30 m | estimated; the plan is OSM way 367642704 |
| Overall | about 143 × 291 m in east/south, **120.8 m** high | model bounds |

## Model

Source `src/peregrine/landmarks/top-cities/palace-of-westminster/`: `geometry.js`, `palace-of-westminster-kit.js`, `palace-of-westminster-plan.js`, `config.js`, `footprint.js`, `views.js`, `palace-of-westminster.test.js`. Build: `pnpm build:top-cities-landmarks palace-of-westminster --no-check`.

Nine materials on the near model, seven on the far model. `stone` (honey Anston / Clipsham limestone, `#d4c09a` by day, `#8d7d64` at night; OSM's `#f0d0a0` is too yellow), `trim` (pale dressed courses; near only, far uses stone), `roof` (slate), `glass`, `gold` (gilt ironwork, shaded), `iron`, `glow` (clock dials and the Ayrton lamp: `#f4f0e6` by day, `#ffd59a` at night, unshaded), `sign` (the flag's navy field, unshaded), `red` (the flag's cross; near only, so the far flag is the same outer thickness in navy alone).

Both LODs have the river screen and its three rows of glazed bays at the same 5.2 m rhythm, with a pinnacle on every bay, the Lords front, the north pavilion, Westminster Hall, St Stephen's Hall and porch, and the three open courts. Elizabeth Tower has a ribbed shaft, four lit dials with twelve iron hour marks (longer at the quarters) and an iron chapter ring, an open belfry of paired louvred arches, and a stepped slate spire to 96.3 m. Gold on that spire is the hip ribs, four corner finials and the cross-orb. Victoria Tower's shaft has four stages of grouped pointed windows with mullions, and stringcourses between the stages. Its crown is four square stone corner turrets, each with a setback and a pyramidal cap, and an open stone parapet between them. The flagstaff rises from the centre, from 98.5 m to the 120.8 m finial. There is no gilded cage and no slate pyramid. Near adds window surrounds, a third light in each Victoria group, blind panels, the clock hands, and the flag's red cross. Far keeps two lights a group, the parapet, the turrets, the slate stages and the dial marks, and drops `trim` and `red`.

Cost (exported): **near 18 957 triangles / 9 draws / 1 037 164 bytes; far 7 204 / 7 / 398 836.** Budgets are 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB. This pass stays inside the asked band of about 15–30 k near and 4–8 k far, with the same 9 and 7 draws.

## Terrain (Full 3D world)

The palace stands on the Thames floodplain. The terrace and the yards are essentially level, and the relief under the footprint should stay under 2 m. There is no `terrainPad`. `padM` is 175 m, which covers the outer ring (about 162 m from the origin) and Elizabeth Tower. The model is rigid on `y = 0`.

## Approximations

- Every height except the three tower tips, the dial size and the dial height is estimated from the photographs and from the mapped parts. Bay spacing on the river front is 5.2 m. Roof pitches are straight. Pinnacles are a shaft and a cone.
- The Central Tower's published height is 91.4 m. OSM draws a lantern to 78 m with a 16 m roof. The model uses 91.4 m and does not follow the 78 m tag.
- OSM tags Victoria Tower `height=96`. That matches the masonry better than the finial. The model follows Wikipedia: 98.5 m at the flagstaff base, 120.8 m at the crown.
- The flag is a red cross on a navy field. It is not a full Union Flag (no white saltire, no St Patrick's saltire). It flies toward the south, building −x.
- The belfry is a pair of louvred pointed arches a face, recessed behind stone piers. It is not Pugin's full openwork tracery. Hour marks are iron ticks, longer at 12, 3, 6 and 9, not lettered Roman numerals. The Ayrton Light is a small cube under the gold cross. The spire faces are slate; gold is the ribs, the corner finials and the orb and spike.
- Victoria Tower's crown is four stone turrets and an open stone parapet. The gilded iron crest that sits inside the real crown is not modelled. There is no pyramidal roof and no gilded cage. The shaft openings are grouped pointed windows with plain mullions, not Pugin's tracery.
- Three courts are left open. Smaller light wells in the OSM outer ring are filled. A short range sits in the island between Westminster Hall and the spine; the gap on either side of that island stays open.
- Window tracery, crockets, the Sovereign's Entrance porch, statues and the interior are not modelled. Westminster Abbey (way 364313092) and the Parliamentary Estate (way 139806331) are not in `FOOTPRINTS`.
- Walls and buttresses are kept inside the mapped rings. A vertex more than 2 m outside those rings fails the landmark test.

## Verification

Renders with `node .agents/skills/build-3d-city/scripts/shot.mjs palace-of-westminster --sheet`, read against the Herzog, David and Rabich photographs. Sheets are in `tmp/landmarks/shots/palace-of-westminster/`:

- Near, light, procedural: `palace-of-westminster-procedural-near-light-sheet.jpg` (overview, river front, roof, Elizabeth Tower, Victoria Tower, west yard, clock, Westminster Hall). The first pass had the river screen crossing the north court and an east return of the Lords front outside the outline; both were pulled back inside the rings. The Elizabeth and Victoria cameras were too close and cropped the spires; they now show each tower from the terrace to the tip. The belfry's iron louvres read as four slots, so they were replaced by a pair of pointed openings.
- Far and night, and the exported GLBs: `procedural-far-light-sheet.jpg`, `procedural-near-dark-sheet.jpg`, `procedural-far-dark-sheet.jpg`, `glb-near-light-sheet.jpg`, `glb-far-light-sheet.jpg`, `glb-near-dark-sheet.jpg`, `glb-far-dark-sheet.jpg`. The exported meshes match the procedural ones. Night stone is the darker honey; the dials stay lit. Far drops clock hands and the red of the flag, and keeps the towers, the pointed Victoria windows, the river range and the hall.

A review (recog 3/5) sent the first export back: a blank Elizabeth belfry with glass on the stone, a slate pyramid on Victoria Tower, an unmarked clock, and a far river front that had dropped its windows and pinnacles. A second review (recog 4/5) asked for the Victoria crown, the Elizabeth spire and the Victoria windows again. The crown is now four stone turrets and an open parapet, the spire is slate with gilt ribs and a gold cross, and the shaft has grouped pointed windows between stringcourses, on both LODs. The contact sheet is `tmp/top-cities/review/palace-of-westminster/palace-of-westminster.jpg`. Close-ups are `tmp/landmarks/shots/palace-of-westminster/palace-of-westminster-procedural-near-light-elizabeth.png`, `palace-of-westminster-procedural-near-light-victoria.png`, `palace-of-westminster-procedural-far-light-elizabeth.png` and `palace-of-westminster-procedural-far-light-victoria.png`. Hour marks are ticks, not lettered numerals. The belfry is seven slats a side, not Pugin's full arcade. The Victoria iron crest is omitted.

Tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/palace-of-westminster/palace-of-westminster.test.js`. The landmark test pins the 120.8 m finial and a clear grade, the 12.2 m shaft and a lit dial on each face, the gold tip at 96.3 m, Victoria Tower's 20 m shaft, south-flying flag and finial, the 91.4 m central spire, the three open courts, a glazed river bay, containment inside 2 m of the mapped rings, the far silhouette, and the draw budgets.

Placement modes: **Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately. Expect under 2 m of relief; `padM = 175` covers the footprint.
