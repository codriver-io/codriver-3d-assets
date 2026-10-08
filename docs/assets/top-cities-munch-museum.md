# MUNCH (Munch Museum), Oslo

Original procedural model of estudio Herreros' Munch Museum in Bjørvika, opened 22 October 2021 at Edvard Munchs plass 1. Stable ID `munch-museum`; source is `src/peregrine/landmarks/top-cities/munch-museum/`. At street distance the identifying features are the broad ribbed podium with the lilac MUNCH wordmark, the slim grey tower, and the upper plate that slides west-northwest as a glazed head over an aluminium shaft.

Sources checked 2026-10-08: the [MUNCH press release](https://www.mynewsdesk.com/munchmuseet/pressreleases/a-museum-built-for-the-future-3107960), [Dezeen](https://www.dezeen.com/2021/07/25/estudio-herreross-munch-museum-oslo-architecture/), [Lindner](https://www.lindner-group.com/en/references/munch-museum), [Bollinger+Grohmann](https://www.bollinger-grohmann.com/en.projects.new-munch-museum.html), and OSM ways [545260792](https://www.openstreetmap.org/way/545260792), [995726956](https://www.openstreetmap.org/way/995726956), [727490336](https://www.openstreetmap.org/way/727490336), [995726957](https://www.openstreetmap.org/way/995726957) and [995726958](https://www.openstreetmap.org/way/995726958). OSM geometry came from the dossier. The press release gives the architect, the 2021 opening, the address and the 13-storey tower on a three-storey podium. Dezeen gives the 57.4 m height. Lindner describes the recycled perforated-aluminium skin, a 25 m vertical front, a 20 m incline and a 7 m overhang. Bollinger+Grohmann and the museum round that height to 60 m. This model uses 57.4 m so the mapped parts do not have to be scaled.

| Quantity | Model | Basis |
| --- | --- | --- |
| Roof | 57.4 m | Dezeen and the building record. 60 m is the published rounding |
| Podium | 13 m | OSM way 995726956 |
| Kink, start of the slide | 37 m | OSM way 727490336. Matches Lindner's 25 m vertical front above the podium |
| Head | mapped part to 57 m, roof at 57.4 m | OSM way 995726958 |
| Plate shift | 7.5 m, bearing about 296° | Measured between the 37 m and 57 m outlines. Lindner publishes 7 m |
| Tower plan | about 66 × 24 m, long axis about 26° from north | OSM shaft |
| Glazed head | west-northwest front from 37 m to 55.8 m, plus a 5 m glass strip at the top of the south narrow end | Photographs: the long front is the leaning curtain; the narrow end is ribbed except that corner |
| Shaft to grade | aluminium continues to y=0 where the shaft plan leaves the podium | Waterfront photographs: the shaft stands on the quay beside the podium, with no open overhang |
| Roof recess | aluminium faces set back 2.35 m from 52.6 m to 55.8 m, then a lip to 57.4 m | The stepped crown in the overcast side photographs |
| Cladding | light silver `#b9bdc0`, groove `#9aa1a6` | Overcast photographs. Low sun warms the metal; that colour is not baked in |
| Wordmark | lilac `#a888d0`, 16.2 × 3.15 m, baseline 7.15 m, on the longest podium edge | Quay photograph. Size estimated |
| Cladding rhythm | near pitch 0.72 m on the tower and 0.92 m on the podium; amplitudes 0.22 m and 0.36 m | Estimated from photographs. Far pitch is coarser; amplitudes match |
| Storeys | 13, with a three-storey podium | Museum press. Not modelled as separate floor plates |

The frame is real metres, +X east, +Y up, +Z south. Origin `[10.75523029, 59.90572569]` is the mercator centroid of the civic outline. Plan rotation is baked into the geometry from that outline. `y=0` is local flat-map grade. The Bjørvika quay is reclaimed and treated as level, so there is no `terrainPad`; `padM` is 72 m, enough to cover the outline. Expected ground variation in Full 3D world is under about 2 m. No sea level and no latitude stretch are baked.

Both long faces translate together above 37 m. The short ends stay in their own planes and shear, which is what the mapped parts do. Glass covers the leaning front, whose outward normal follows the shift, from the kink to the roof lip. On the south narrow end the glass is only a 5 m vertical strip at the corner shared with that front; the rest of the end is ribbed. Where the shaft outline leaves the podium, the same aluminium continues down to grade, so the waterfront side stands on the quay instead of hanging over open air. The other aluminium faces step back 2.35 m from 52.6 m to 55.8 m, with a window in the notch and a lip out to the roof. A few slot windows sit on the shaft in the near model. The podium keeps its broader ribbed body and glazed ground floor. Far keeps the same amplitudes, the glass, the grade shaft and the roof step, uses a coarser pitch, and drops lit panes and slot windows.

Named palettes share `panel`, `glow`, `glass`, `light`, `frame`, `sign` and `gap`. Day aluminium is light silver `#b9bdc0` and the groove stripe is `#9aa1a6`. Night grooves warm slightly, as perforations lit from inside. The wordmark is unshaded lilac. Letters are extruded block strokes. The N diagonal falls from the top of the left stem to the bottom of the right stem, and the word runs left to right for someone outside the quay face.

Apartment ways south of the quay are not included. Doors, interiors, the waterfront sculpture, the Opera House and the real panel count (Lindner's 4,018 panels) are omitted. The sawtooth does not mitre at the corners, so a thin gap can show there. The glass grid is regular and does not carry the diagonal bracing visible in the evening photograph.

Reference photographs used only for comparison, in ignored scratch: **MUNCH Bjørvika Oslo**, Hanne Evensen, CC BY 4.0; **Munch Museum in the evening 2**, Nurtenge, CC BY-SA 4.0; **MUNCH with Bjørvika in the background (2021)**, Premeditated, CC BY-SA 4.0. The dossier contact sheet is mostly paintings; image 6 is the former Tøyen building and was not used. Original source, no photo or texture ships. OSM-derived geographic data © OpenStreetMap contributors, ODbL 1.0.

Build: `pnpm build:top-cities-landmarks munch-museum --no-check`.

Visual evidence is under ignored `tmp/top-cities/shots/munch-museum/`. The first procedural sheet showed the lean, the podium and the glass, and three defects: the word ran backwards, podium ribs cut through the letters, and lit panes read as white tiles. The second sheet fixed the reading direction, cleared the ribs off a black backplate, and darkened the day `light` colour. The N in that sheet still rose the wrong way. The third sheet, `iter3/munch-museum-procedural-near-light-sheet.jpg`, and the street frame beside it, show MUNCH with the diagonal falling to the right, the kink, the curtain wall and the ribs. Exported GLB sheets, near and far in light and dark, are `glb-near-light/`, `glb-near-dark/`, `glb-far-light/` and `glb-far-dark/`. Those four sheets were looked at beside the evening curtain-wall photograph and the waterfront photographs: the kink, the wordmark and the podium ribs survive the GLB round trip, night lighting is the sawtooth glow, and the far model keeps the silhouette without lit panes. A later review fix moved the glass onto the leaning head, cut the aluminium crown back under a lip, and darkened the day skin. A second pass, checked on `tmp/top-cities/review/munch-museum/munch-museum.jpg` against `tmp/top-cities/munch-museum/refs/1.jpg` through `refs/5.jpg`, drops the shaft to grade where it leaves the podium, keeps glass on the narrow end to a 5 m corner strip, and lightens the day aluminium to `#b9bdc0` with `#9aa1a6` grooves. The quay wordmark is lilac. `qa-metrics` reports no issues.

Final exported costs, as printed by the build (KB is bytes / 1024):

| Variant | Triangles | Draws | Bytes | KB |
| --- | --- | --- | --- | --- |
| Near | 23,423 | 7 | 1,834,524 | 1,792 |
| Far | 4,463 | 6 | 354,584 | 346 |

Both LODs share the same bounds, min y = 0 and max y = 57.4 m. No textures and no `bridgeLift` attribute.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The quay is expected to need only a small foundation correction if the terrain sampler is turned on later. Independent visual review remains with the coordinator. No shared file was edited.
