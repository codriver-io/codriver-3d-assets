# Astrup Fearnley Museum of Modern Art, Oslo

Original procedural model of the Renzo Piano Building Workshop museum on Tjuvholmen, opened 29 September 2012, with Narud-Stokke-Wiig. From the road the identity is one swept glass sail over weathered grey-brown timber blocks: two sharp canal gables with sky between them, and from the fjord a single silver roof that falls toward the sculpture-park lawn. A canal separates the museum pavilion from the office block, crossed by a quay footbridge and a glazed skybridge.

## Sources and rights

- [Fondazione Renzo Piano](https://www.fondazionerenzopiano.org/en/project/astrup-fearnley-museum-of-modern-art/): height 25 m, site about 13,737 m², floor area about 15,600 m², design 2006–09, construction 2009–12.
- [Astrup Fearnley Museet](https://www.afmuseet.no/en/the-museum-building/): the present Strandpromenaden 2 building, not the 1993 Dronningens gate rooms.
- OpenStreetMap, © contributors, ODbL 1.0. Museum node [1931359713](https://www.openstreetmap.org/node/1931359713) (`Astrup Fearnley Museet`, start_date 2012-09-29). Building relations 12370134 and 12373875, glass roofs [1039892347](https://www.openstreetmap.org/way/1039892347) and [1039892620](https://www.openstreetmap.org/way/1039892620). Fetched from the OSM map API after the shared Overpass helper returned nothing useful at the dossier pin. The English Wikipedia coordinate 59.90750, 10.74417 is about 1.3 km east, at Havnelageret, and is not the anchor.
- Reference sheet `tmp/top-cities/astrup-fearnley-museum/refs-sheet.jpg` and `refs/1.jpg`–`refs/6.jpg`. Holger Uwe Schmitt, canal and fjord views (CC BY-SA 4.0); Ottestad, entrance, canal and office (CC BY-SA 3.0); Alhill42, timber and roof grid (CC BY-SA 4.0). Titles and file pages are in `refs/SOURCES.txt`. Photographs stay in ignored `tmp`.

All geometry is original. No mesh, photograph or texture is shipped. The Musée des Confluences landmark was studied for merged soups, far folding and raycast tests, not for its massing.

## Dimensions and frame

| Feature | Value | Basis |
| --- | --- | --- |
| Glass peak | 25.1 m in both exports | Published 25 m; lattice sits on the sheet |
| Office / gallery timber | 20 m and 16 m | OSM `building:part` heights |
| Museum timber | 8 m and 4 m | OSM `building:part` heights |
| Park lip | about 3.6–5.5 m | Photograph: the sail nearly meets the lawn; roof tag 8 m is the low eave, not this tip |
| Plan | about 85 m east-west by 103 m north-south | Mapped roof rings |
| Origin | [10.721644, 59.907011] | Vertex mean of the two outlines and the two glass roofs |
| Frontage | 45° | Canal edges run northeast–southwest |
| padM | 78 | Covers the footprint. No `terrainPad` |

Metres, +X east, +Y up, +Z south. Rotation is baked into the GLB. `y=0` is local quay grade. No sea level, DEM or latitude stretch is baked in. Tjuvholmen is flat reclaimed ground, so Full 3D world should not need a terrain pad; that placement was not tested.

## Geometry and materials

The sail is one height field over the two OSM roof polygons, low at the south lip and rising to the two northeast gables, with a narrow notch so the canal approach shows sky between the peaks. A broad lift keeps the sheet above the 20 m office without turning that roof into a flat lid. Top glass, a soffit 0.58 m below, and a steel rim close the edge. A steel grid lies 0.22 m above the glass. Glulam chords hang under the open soffit and stop short of the rim.

Timber volumes use the OSM part heights on a low concrete plinth. Near walls carry contrasting vertical board strips. Timber is weathered warm grey-brown (`#9c8a72`), with darker desaturated boards (`#776d5d`) and consistent dimmer night colours. The office has tall dark blue-grey `windowGlass` panes with a few muted amber `glow` blinds in both LODs; far keeps fewer, wider panes. Panes are 2.4 m tall, shortened to 2.05 m in the top row of the 16 m block to preserve every existing bay below its parapet. The museum’s canal face is a glazed curtain with steel mullions on the near model. Posts stand only in the open undercroft. A timber footbridge and a glazed skybridge cross the canal. There is no water plane.

Palette keys, light and dark: `timber`, `board`, `glass`, `glassDeep`, `windowGlass`, `steel`, `beam`, `glow`, `concrete`. Far folds `board` into `timber` and `glassDeep` into `glass`, and keeps `beam` and `windowGlass`, so the night sail, glulam and office glazing still separate. `glow` is unshaded.

Omitted on purpose: the “Astrup Fearnley Museet” lettering, sculpture-park works, the 84 m Tjuvtitten tower, and the roof over The Thief (way/1039892591).

## Costs and verification

| Export | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 15,732 | 9 | 1,157,772 (1131 KB) |
| Far | 3,132 | 7 | 232,340 (227 KB) |

`pnpm build:top-cities-landmarks astrup-fearnley-museum --no-check`. Far bounds match near. Budgets are 60k/14/2.5 MB near and 12k/8/500 KB far.

Looked at, beside `refs-sheet.jpg` and the single photographs:

- `tmp/top-cities/shots/astrup-fearnley-museum/astrup-fearnley-museum-procedural-near-light-sheet.jpg` (overview, canal facade, roof, fjord, canal, park), three passes. The first pass was a column forest with ribbon windows and a jagged lid. The second opened the undercroft and punched the windows. The third removed the flat office lid so the fjord view is one slope down to the park.
- Exported GLB sheets, near and far, light and dark, same cameras, checked after export (paths under the same shots directory, `glb` in the filename).
- Independent review: PASS-WITH-NITS, recognition 4/5. One correction pass on 2026-10-08 changed pale cream timber to weathered grey-brown with stronger board contrast, and uniform 1.2 m orange window dots to tall dark glazing with selective muted amber panes. Roof, pavilion massing, footprint and canal geometry were preserved. Compared the original review sheet and `refs-sheet.jpg` with `tmp/top-cities/shots/astrup-fearnley-museum/palette-fix/astrup-fearnley-museum.jpg` (exported near/far, opposite sides, street, top and close views), and the `astrup-fearnley-museum-glb-near-dark-sheet.jpg` in that folder (facade, water, canal, park). The review file contains no Prepare command; regenerated its eight-view layout with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids astrup-fearnley-museum --out tmp/top-cities/shots/astrup-fearnley-museum/palette-fix`.
- Focused landmark plus top-cities conformance tests: 228 passed, zero failed. `node scripts/asset-catalog.mjs`: 198 entries / 384 GLB variants valid. `tmp/top-cities/astrup-fearnley-museum/fix-metrics.json`: no flagged issues, zero coplanar overlaps, 0.7% back-face sweep hits, zero bridgeLift bytes, matching near/far bounds and no budget overrun. Each LOD gained one draw and about 1 KB for the separate office glazing material; triangle counts did not change.

Cityscape and Full 3D world: not tested yet, integration is checked separately.

The correction also checked `tmp/top-cities/shots/astrup-fearnley-museum/palette-fix/astrup-fearnley-museum-glb-far-dark-sheet.jpg` (facade and canal): dark glazing and selective amber panes survive the far LOD without changing the roof or canal silhouette.

## Approximations a reviewer will see

The double glass skin is a single sheet plus a soffit, not a 1.5 m cavity. Glulam is a row of straight chords, not the full laminated frame. Column positions are a rhythm under the open sail, not a survey. The canal bridges are placed on the gap nearest the gables. Opaque glass does not reflect the sky. The shared edge of the two roof polygons can show a shading seam. The office’s south parapet is cleared by a small safety lift where the field would otherwise clip the 20 m wall.
