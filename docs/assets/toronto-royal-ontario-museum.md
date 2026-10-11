# Royal Ontario Museum and the Michael Lee-Chin Crystal

Original procedural model of the whole museum at 100 Queen's Park / Bloor Street West, Toronto: the two heritage wings, the concrete curatorial block and Daniel Libeskind's Crystal (2007), as one landmark. Part of the [Toronto landmarks](3d-toronto-landmarks.md); catalog record `prototypes/assets3d/catalog.d/royal-ontario-museum.json`.

Build: `pnpm build:toronto-landmarks royal-ontario-museum`. Tests: `node --test src/peregrine/landmarks/toronto/royal-ontario-museum/`. Screenshots: `node local-scratch/shot.mjs royal-ontario-museum [--source glb] [--detail far] [--theme dark]`.

## Identity and version

Today's museum (2026): the 1914 West Wing (Darling & Pearson, Italianate / Neo-Romanesque), the 1933 East Wing (Chapman & Oxley, Neo-Byzantine, the domed rotunda and the Queen's Park entrance), the 1960s concrete curatorial block to the south, and the Michael Lee-Chin Crystal (opened 2 June 2007) set into the Bloor Street front where the 1984 Terrace Galleries were. The 2020s "OpenROM" changes to the entrance and plaza are not modelled: the Crystal's entrance is drawn as photographed in 2007-2021.

What a driver sees. At 100 m on Bloor Street: silver-white shards leaning out over the sidewalk beside a buff-stone gable with a round-headed window, a green copper roof behind. At 800 m: the jagged pale cluster (apex 37 m) against the darker mass of the museum, with the long green naves and the small rotunda pyramid on the east side.

## Sources

Numbers that come from a source are marked S in the table; anything else is an estimate (E).

* [Wikipedia, Royal Ontario Museum](https://en.wikipedia.org/wiki/Royal_Ontario_Museum): wings, architects, dates, 74,000 m² total.
* [Wikipedia, Michael Lee-Chin Crystal](https://en.wikipedia.org/wiki/Michael_Lee-Chin_Crystal): steel frame, anodised aluminium cladding (Josef Gartner, Germany), 25 % glass / 75 % aluminium, the Terrace Galleries it replaced.
* [Studio Libeskind, ROM](https://libeskind.com/work/royal-ontario-museum/): five intersecting metal-clad volumes, "no right angles and only one vertical wall", crystalline mineral inspiration.
* [Wikiarquitectura, Michael Lee-Chin Crystal](https://en.wikiarquitectura.com/building/michael-lee-chin-crystal/): 37 m height, five prismatic structures, Spirit House, Stair of Wonders, Hyacinth Gloria Chen Crystal Court.
* [Danish Architecture Center](https://dac.dk/en/magazine/places/the-crystal-at-the-royal-ontario-museum-612): "champagne-coloured anodized aluminum", about 20 % of the facade is windows; the restaurant crystal cantilevers over the West Wing galleries.
* [OpenStreetMap way 4942687](https://www.openstreetmap.org/way/4942687) (museum outline) and its `building:part` ways (ids in `royal-ontario-museum-site.js`): footprints, `height`, `min_height`, `roof:shape`, `roof:direction`, `roof:height` of every wing and every Crystal prism. Retrieved 2026-09-29 through one OSM map API request for a 0.006 x 0.004 degree box, cross-checked against the shared Overpass helper. © OpenStreetMap contributors, ODbL 1.0.
* Wikimedia Commons photographs, downloaded to the ignored `local-scratch/royal-ontario-museum/refs/` to compare against, never committed or shipped: Richie Diesterheft (CC BY 2.0, three views of the Crystal); Aptd, "Crystal.view.from.west" (CC BY-SA 4.0); Mb1000, "ROM Crystal" (public domain); dbking, "Bloor Street Toronto July 2010" (CC BY 2.0); fw_gadget, "Royal Ontario Museum from Bloor" (CC BY-SA 2.0); Ken Lund, four "Royal Ontario Museum, Toronto, Ontario" photos (CC BY-SA 2.0); Reading Tom, two photos (CC BY 2.0); Tony Hisgett, "Royal Ontario Museum 1" (CC BY 2.0); Owen Byrne (CC BY 2.0); Eric Mutrie (CC BY 2.0); sookie (CC BY 2.0); Steve Harris, "The ROM" (CC BY 2.0); Aviad2001 (CC BY 2.5); Gisling, "Royal Ontario Museum2" (CC BY-SA 3.0); Pemolo (CC BY-SA 3.0); Daniel MacDonald (CC BY 2.0); Mike from Vancouver (CC BY-SA 2.0); Maksim Sokolov, 2019 and "in Fall 2021" (CC BY-SA 4.0); Frypie (CC BY-SA 4.0); Jim.henderson, "ROM morning 2023" (CC BY-SA 4.0) and "Weston (east) entrance ROM 2023" (CC BY 4.0).

## Frame

Real metres, +X east, +Y up, +Z south, origin `[-79.394695, 43.667694]` (area centroid of the mapped outline). `y = 0` is the local flat-map grade; no terrain, sea level or latitude stretch is baked in. The street grid is turned 16.84 degrees from true north (mean axis of the six long edges of the 1933 wing's blocks; Bloor Street, Queen's Park and Avenue Road agree to about 1.5 degrees), so the geometry is authored in the museum's own frame (u along Bloor Street, v into the museum) and rotated once into east/up/south. The Crystal's front faces bearing 343 degrees (`frontageBearing`).

## Dimensions

| Feature | Value | Basis |
| --- | --- | --- |
| Crystal apex | 37 m | S: Wikiarquitectura / ROM. OSM tags 39 m on the two highest prisms; every Crystal height and roof rise is scaled by 37/39 |
| Museum outline | about 116 m along Bloor x 158 m deep (model bounds 132 x 173 m with the south pavilion and canopy) | S: OSM way 4942687 |
| Crystal prisms | nine skillion-roofed prisms (the "five crystals" as OSM splits them) | S: OSM parts; heights 27-39 m (scaled), roofs 8-33 m of rise |
| Roof planes of the Crystal | each prism keeps its mapped ring, `roof:direction` and `roof:height` | S: OSM |
| Wall lean | feet sit back from the roof edge by 0.2-0.5 m per metre of height (11-27 degrees from vertical) | E: read from photographs (Diesterheft, Aptd, Eric Mutrie, Pemolo) |
| Cantilever over the plaza | 10-12 m at the entrance front (measured on the built model: cover begins at v = -85 and the wall foot is at v = -73 at the tall prism); the northmost point is 9 m from Bloor's centre line | E: derived from the mapped roof outline and the lean above; a test pins at least 9 m |
| Glazing | seen from Bloor Street 23 % of the Crystal's visible pixels are glass (north-east corner 15 %, from above 10 %); 8 % of cladding area overall | E: sources say 20-25 % of the envelope is glass; the street front matches, the roofs are on the low side |
| East wing nave | eaves 20 m, ridge 24 m, copper | S: OSM `height` 24, `roof:height` 4 |
| East wing aisles | 18 m, flat | S: OSM |
| Rotunda block / drum / pyramid | 26 m / 30 m / apex 33.6 m | S: OSM 26, 30, 33 (pyramidal cap); apex 33.6 is an estimate |
| East porch (Weston entrance) | 23.5 m, steps 1.5 m | S: OSM |
| West wing, central range | 25 m | S: OSM |
| Curatorial block | 28 m, concrete | S: OSM |
| Facade rhythm (window rows, bay pitch 5.0-5.6 m, courses, arches) | photographs | E |

## Materials

Eleven named, merged materials (the concrete grey was folded into `roofFlat`), each in both palettes:

| Name | Use | Day | Night |
| --- | --- | --- | --- |
| `alu` | silver anodised aluminium cladding, strong dark seams and frames | `#c6cbce` | `#868e96` |
| `aluMid` | the darker cladding on the entrance prism | `#8f969b` | `#636b72` |
| `aluDark` | soffits under raised prisms | `#54595d` | `#40464b` |
| `seam` | cladding panel joints | `#3c4145` | `#262b30` |
| `glass` | Crystal glazing | `#2b4550` | `#1f3640` |
| `glow` (unshaded) | the Crystal Court front and the entrance lobby | `#8fb3c4` | `#ffcf8a` |
| `frame` | glazing frames, mullions | `#0f1215` | `#07090b` |
| `stone` / `stoneWest` / `stoneDeep` | 1933 buff stone / 1914 grey-brown stone / courses and window surrounds | `#b9a684` / `#9a8f7e` / `#8f8064` | dimmer |
| `copper` | green copper naves and rotunda pyramid | `#6f9282` | `#4b665b` |
| `slate`, `roofFlat`, `window` | west-wing roof, flat roofs and the curatorial block (`concrete` was the same grey and is folded into `roofFlat`), heritage windows | | |

## Modelling decisions

* **The Crystal is the OSM decomposition, sheared.** Each part is a slab: the mapped ring is its roof outline, the mapped skillion plane is its roof, and the walls are planar quads down to a foot that sits back from the roof edge by a shear. Because the roof height is affine over the ring, the foot polygon is an affine image of it, so a wall can never twist whatever the lean (`royal-ontario-museum-solids.js#slab`). This is what makes the prisms lean out over Bloor Street rather than stand as vertical extrusions.
* **Glazing is laid on the faces**, in each face's own 2D frame, so a window cannot drift off its plane: long bands and crossing bands on A's roof (the tall prism beside the 1933 gable), the long dark band down A's leaning north wall, the large glazed plane at the foot of A's leaning wall beside the entrance, the lozenge, lobby and west-face glazing on B, the lit Crystal Court glass on three faces of C, big glazed planes on the west prism G and D's overhanging face, bands on the rear roofs. Every glass shape is clipped to the face it lies on. Near LOD adds framed outlines, mullion grids and 0.6 m cladding seams (5,000+ seam quads); far LOD keeps only the glass shapes.
* **The heritage wings** are the OSM parts extruded, with the 1933 east wing's copper-roofed gabled naves, the round-headed window and three-light window in the north gable (the postcard view), the rotunda with its octagonal drum and pyramid, the east porch with its grand arch, and the 1914 west wing with three storeys of round-headed windows. Window rows, courses and cornices are near-only; far keeps coarse windows.
* **Far LOD** (1,731 triangles) has the same bounds as near to within 1 % and keeps every prism, roof plane and glazing band.
* **Draw budget** (`FOLD` in `config.js`): near folds the concrete grey into `roofFlat` and the 8-triangle dark aluminium trim into `seam` (13 draws). Far also folds deep stone into stone, mid aluminium into aluminium, the dark trim into the window tone and the lit lobby glass into the glass (8 draws).
* **No shared planes.** Overlays stand at least 5 cm off the face they dress (seams 5 cm, glazing 10 cm, frames 15 cm, window surrounds 5 cm, mullions 20 cm), so the coplanar-overlap check dropped from 1,253 m2 to 3 m2. Three walls of prism D that cross a neighbour at a shallow angle (`plainWalls` in `royal-ontario-museum-crystal.js`) carry no seams: a seam there ran within centimetres of the neighbour's plane along the crossing line.

## Approximations and open points

* Roof glazing is still below the published share (10 % seen from above).
* The Crystal's leaning walls, glazing bands and their positions are read from photographs, not from drawings: the shards and the cantilever are right in kind and size, but no individual band or window is surveyed. The largest uncertainty is the lean of the rear prisms (F, G, I, H), which are mostly hidden from the street.
* OSM gives roof planes for a wall-less mass; the real prisms are skewed boxes. The lean values are tuned by eye against Diesterheft's, Aptd's and Pemolo's photographs.
* The OpenROM plaza works, the Reed Family Plaza paving, the red "Crystal" pylon, benches, the stone gate posts and iron fence at the west end, and every interior are not modelled. The plaza is the basemap's.
* Heritage stone is one flat colour per wing; carved tympana, friezes, quoins and eave brackets are not modelled. Rooftop plant is a few estimated boxes.
* The provider extrusions replaced are the museum outline and two small parts just outside it; the outline way carries `height=0.1`, so the provider's own drawing of the museum is a thin slab that the model replaces.

## Verification

Model source rendered with `shot.mjs` and with a scratch harness that also applies the night palette, then the exported GLBs round-tripped through `shot.mjs --source glb`. Screenshots (`local-scratch/shots/royal-ontario-museum/`, ignored by git) that were read and compared with the Commons photographs above:

* Near, light, procedural and GLB: `overview` (north-east corner of Bloor and Queen's Park, against Reading Tom, Steve Harris and Jim.henderson), `facade` and `entrance` (north front and under the overhang, against Diesterheft, Aptd, Eric Mutrie), `roof` and aerial views from the north, south, west and east, `structure` (from the west, against Mb1000 and Owen Byrne), `east` (Queen's Park front and rotunda entrance, against Jim.henderson and Maksim Sokolov).
* Near, dark: `overview` (night palette; the Crystal Court and the entrance lobby glow).
* Far, dark and light, GLB: `overview`, `roof`, `structure`.

What the looks changed: the first extrusion of the OSM parts already showed the right shards but as bare white slabs; adding the crossing bands on A's roof and the long dark band on its north wall made it read as the Crystal from the corner of Bloor and Queen's Park. The stone first rendered olive and was warmed; heritage window surrounds and frames were slimmed after they read as heavy black outlines; the entrance view was moved back after the first camera sat inside the wall; flat roofs were darkened from near-white; a sub-grade sliver from overlay offsets on the leaning walls was fixed (`put` lifts anything under y = 0).

Review round 1 (PASS-WITH-NITS): street glazing was too sparse (now 23 % of Crystal pixels from Bloor Street), the cladding read beige with faint seams (now silver with dark seams and frames, both palettes), and a dark sliver poked out at the top of the tall glazing band on A's north wall (glass shapes were not clipped to their face; now every band and plane is).

Costs (exported): near 14,642 triangles / 13 draws / 741,304 bytes; far 1,731 / 8 / 86,152 bytes.

Tests: `royal-ontario-museum.test.js` pins the 37 m apex and the footprint, the 24 m ridge and 33.6 m pyramid by raycast, the 9+ m cantilever with a downward-facing underside, the glazing share, containment in the mapped outline and clearance from Bloor Street and Queen's Park, in both LODs; `toronto.test.js` covers budgets, palettes and the exported bytes.

| Environment | Status |
| --- | --- |
| Inspector (procedural and GLB, near/far, day/night) | verified as above |
| Cityscape, flat ground | not tested yet, integration is checked separately |
| Full 3D world, terrain | not tested yet, integration is checked separately |
| Tesla hardware | not measured |
