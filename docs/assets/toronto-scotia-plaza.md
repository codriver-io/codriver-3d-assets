# Scotia Plaza (Toronto)

Stable asset ID: `scotia-plaza`. An original procedural model of **Scotia Plaza, 40 King Street West** (WZMH Architects, completed 1988), together with the two six-level wings at its foot and the **1951 Bank of Nova Scotia building at 44 King Street West** that it wraps. Part of the [Toronto landmarks](3d-toronto-landmarks.md); source in `src/peregrine/landmarks/toronto/scotia-plaza/`.

## Identity and what a driver sees

The tower is the pink-red granite slab with the **V-shaped stepped recess** in its crown: on both long faces (east and west) the top twelve floors (56 to 68) are cut back four metres in a chevron of eleven stair-steps, exposing dark glazing between two full-height shoulders. The plan is a point-symmetric parallelogram: two opposite corners are chamfered into **sawtooth** stairs (the "step profile" that gives many floors twelve corner offices) and each long face carries a 4 m granite band that stands proud of the core. A red bank mark sits on the end bay of each band, three floors under the roof. At 100 m the model reads as a dark red-brown lattice of deep square windows; at 800 m as the notched crown against the sky.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 141694075](https://www.openstreetmap.org/way/141694075) | Tower outline, `height=274.9`, `building:levels=68`, `roof:shape=flat`, granite colour tag |
| OSM ways 951711673 to 951711694 | 22 thin building parts (11 a side) whose heights run 267, 259 ... 227 ... 259, 267 m: the top of each band, i.e. the chevron. Their footprints show the band is 4 m deep and 2.9 m per bay |
| OSM ways [951711671](https://www.openstreetmap.org/way/951711671), [951711672](https://www.openstreetmap.org/way/951711672) | The two `building:levels=6` wings filling the chamfered corners |
| OSM ways [43417401](https://www.openstreetmap.org/way/43417401), [366234293](https://www.openstreetmap.org/way/366234293), [366234292](https://www.openstreetmap.org/way/366234292), [366234294](https://www.openstreetmap.org/way/366234294) | The 44 King Street West heritage building: 25.6 m base, then nested tiers of 81, 98 and 115 m |
| [Wikipedia, Scotia Plaza](https://en.wikipedia.org/wiki/Scotia_Plaza) | 274.9 m, 68 storeys above ground, 1988, WZMH; parallelogram plan; stepped chevron on the east and west faces between floors 56 and 68; Napoleon Red granite quarried in Sweden and finished in Italy; north and south faces stepped; 27-storey Beaux-Arts limestone bank at 44 King Street West |
| [WZMH project page](https://www.wzmh.com/projects/scotia-plaza/) | "Folded" massing, sculpted recess at the crown, latticework of square windows |
| [ACO Toronto](https://www.acotoronto.ca/building.php?ID=951) | Completion 1988, designers and contractor |

OSM geometry was read from the OpenStreetMap API bounding-box endpoint (one request, 2026-09-29; the shared Overpass queue was 35 requests deep at the time) and is © OpenStreetMap contributors, ODbL 1.0. The extract is kept in the ignored `local-scratch/scotia-plaza/`.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `local-scratch/scotia-plaza/refs/` to compare, never committed: "Scotia Plaza 2025-05-24" and its cropped version (JK Liu, CC BY-SA 4.0), "Scotia Plaza 2009" (SimonP, CC BY-SA 3.0), "View from CN Tower 2023h" (Antony-22, CC BY-SA 4.0), "Bay Adelaide and Scotia Plaza" (Andrew Rivett, CC BY 2.0), "Scotia Plaza from Richmond Street East" (Ken Lund, CC BY-SA 2.0), "Toronto Bay and King from aerial photo Helicopter 2005" (George Socka, CC BY 2.0), "ScotiaPlaza.JPG", the granite in the Investor Services lobby (Raysonho, CC0). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade. Origin `[-79.3795541, 43.6494885]` is the centroid of the mapped tower outline. The geometry is authored in a site frame (u along King Street, bearing 72.87 degrees; v along Bay Street toward King, bearing 162.87) and rotated by 17.13122 degrees about +Y at the end. That angle was fitted to the mapped outline (length-weighted edge direction), not assumed from the street grid. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Roof height | 274.9 m (parapet top; deck 0.55 m below) | **Sourced**: OSM tag and Wikipedia agree |
| Storeys | 68 = two lobby levels (to 14.2 m) + 66 office floors | **Sourced** total; split estimated |
| Floor pitch | 3.95 m, counted down from the roof so every chevron step and the roof land on a floor line | Estimated; the mapped steps are 8 m (two floors) |
| Tower plan | about 76 m long (along Bay) by 31 m (core) or 39 m (with the two 4 m bands); 1 970 m² | **Mapped** (OSM) |
| Band depth, bay width | 4.0 to 4.15 m, 2.88 m | **Mapped** from the strip parts |
| Chevron | eleven strips a side, 12 bays; recess top at 227.5 m at the two apex bays, 267 m at the ends | **Mapped** heights snapped to the floor grid |
| Sawtooth steps | about 3.9 m tread by 4.1 m riser, five steps a corner (NW and SE) | **Mapped** |
| Wings | 30 m (six levels: two lobby + four office floors) | Level count mapped; height estimated |
| Windows | 1.6 x 2.2 m in a 2.9 x 3.95 m cell; reveals 0.9 m deep | Estimated from photographs |
| Roof plant | one 12 x 18 m plant room and two small boxes, top 277.0 m | **Estimated**; photographs show a plain roof |
| Logo | S-shaped mark about 5.5 x 9.6 m, red, on each band's end bay | Position and size estimated from photographs; drawn as a plain S, not the trademark artwork |
| Heritage building | 25.6 m base; tiers to 81, 98, 115 m; cornices 0.7 m proud | **Mapped** heights; facade estimated |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `granite` | Napoleon Red piers, spandrels, parapet, chevron ledges | `#a95a48` | `#7a4a40` |
| `glass` | Window strips (dark bronze) and glazing bars | `#33231f` | `#1b1413` |
| `curtain` | Glazing of the recess | `#3f3230` | `#2b2322` |
| `glow` | About 13 % of windows (10 % in far), unshaded | `#4a322d` (reads as glass by day) | `#ffcf8a` (lit at night) |
| `stone` | Limestone of the 44 King Street West building | `#ddd0b6` | `#8f8878` |
| `roof` | Decks, wing roofs, tier tops | `#5b4d4a` | `#3a3335` |
| `metal` | Roof plant | `#82878a` | `#4d5358` |
| `sign` | The red mark, unshaded | `#e0262c` | `#c9222a` |

The runtime layer shades each vertex from its normal (0.66 to 1.0 of the palette colour), so the light granite is the sunlit colour and the west face lands near `#904f3f`.

## Modelling decisions

- **Facade.** Every wall is a lattice built quad by quad in `scotia-plaza-facade.js`: full-width spandrel bands, piers between windows, a glass strip at the back of the reveals, and up to four reveal quads per window (left, right, sill, head). Vertices are welded by position and normal, and near meshes are cut into chunks under 65 000 vertices so indices stay 16-bit. Lit windows are small quads 3 cm in front of the glass and are hashed deterministically.
- **Chevron.** Real geometry, not a texture: each of the eleven strips per side is a granite column ending in a ledge at its mapped height, with the stepped returns between neighbours and glass on the core face behind, 4 m back. Both LODs keep it.
- **Sawtooth and wings.** Walls follow the mapped polygon; walls that a wing hides below 30 m are solid quads so nothing can be seen through.
- **Heritage building.** OSM massing with narrow recessed windows in limestone piers, a banking-hall row of tall slots, and a cornice course at every tier. It is the least detailed part.
- **Far LOD.** Same silhouette, ledges and recess; each wall is one quad behind a flat glass quad per window, with no reveals or glazing bars. 13.7k triangles, 8 draws.

## Approximations and gaps

- The glazed canopies and atria on the north (Adelaide Street) and south (King Street) sides, mapped as `building=roof` (ways 366570218, 366568729), are **not modelled**, and neither are the 11 to 14-storey glass atrium linking the two buildings, the below-grade levels, or the plaza. The heritage base is a flat 25.6 m box where the atrium stands.
- Floor pitch, window size, reveal depth, band colour, roof plant, logo and heritage detail are estimates. Wikipedia's Napoleon Red granite is a deep brown-red; the palette was set from photographs under different light, so tone is approximate.
- The mark is a plain red S rather than the bank's artwork; a temporary crane visible in 2025 photographs is not modelled.
- Left as mapped: the OSM parts contain small irregularities (a few centimetres) that were snapped to right angles.

## Build, budgets and verification

```sh
pnpm build:toronto-landmarks scotia-plaza
node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/scotia-plaza/scotia-plaza.test.js
node scripts/asset-catalog.mjs
```

| Export | Bytes | Triangles | Draws |
| --- | ---: | ---: | ---: |
| `public/models/buildings/scotia-plaza-near.glb` | 3 933 720 | 82 760 | 9 |
| `public/models/buildings/scotia-plaza-far.glb` | 735 624 | 13 680 | 8 |

Within the contract budgets (160 000 / 48 near, 45 000 / 14 far). The near file is large because of the window reveals (about 5 600 windows on the tower); MCU2 draws far. No Tesla timing was measured.

`scotia-plaza.test.js` pins: the 274.9 m roof, nothing below grade; the recess is 4 m deep at the apex on both faces, has glass above each ledge and granite below, and full-height shoulders; the sawtooth treads and the 30 m wing roof; granite and recessed glass by raycast; the mark on both end bays; the heritage tiers at 81, 98 and 115 m; 512 rays from outside that must all hit a front face (no holes, no inverted walls) in near and far; every vertex within a metre of the mapped footprints; far bounds within 1.5 m of near.

Screenshots looked at (`local-scratch/scotia-plaza/myshot.mjs`, a copy of `shot.mjs` that also applies the dark palette and draws sign/glow unshaded like the layer; output in `local-scratch/shots/scotia-plaza/`):

- Whole tower from the south-west at 250 m altitude, near/light, procedural and exported GLB (`...overview`), compared with "View from CN Tower 2023h" and "Bay Adelaide and Scotia Plaza": V-recess, stepped edges, mark on the right-hand shoulder, pleated left edge. Changed after the first pass: darker glazing, mullion lines, palette, mark geometry (per-vertex offsets instead of per-segment quads, which left teeth).
- Chevron close-up from 60 m, near/light and far/dark (`...chevron`): ledges and returns, shoulders, glazing bars.
- West and east faces square-on (`...facade`, `...east`), NW and NE sawtooth corners (`...nw-corner`, `...ne-corner`, `...structure`), street level (`...street`), north and south views, roof from above with the parapet (`...roof`, `...top`), the heritage tiers (`...heritage`), and far/dark from the exported GLB (`...glb-far-dark-overview`, `...glb-far-dark-roof`).
- Changed because of what they showed: parapet and deck added, cornices on the heritage tiers, reveals cut to reduce the file from 5.3 MB to 3.9 MB, heritage reveals reduced to left and head.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately.**
- Full 3D world (terrain): **not tested yet, integration is checked separately.** The model is authored on grade with a rigid base and `padM = 100`, so terrain must be flattened under the wings and the heritage building.
- Failed load, LOD switch and reanchoring are handled by the shared building layer and covered by its own tests, not re-tested here.
