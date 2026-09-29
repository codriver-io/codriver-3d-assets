# Scotiabank Arena

Asset `scotiabank-arena`, 40 Bay Street, Toronto (the Air Canada Centre until July 2018). Original procedural model in `src/peregrine/landmarks/toronto/scotiabank-arena/`, exported as near/far GLBs by `pnpm build:toronto-landmarks scotiabank-arena`. Folder contract: [3d-toronto-landmarks.md](3d-toronto-landmarks.md). No scan, third-party mesh, font, photograph or texture is in the repository or the GLB; the lettering is a 5 x 7 cell grid built as geometry.

## Identity and version modelled

The 1999 arena (Brisbin Brook Beynon Architects with HOK Sport) in its state on 2026-09-29: the retained Art Deco limestone facade of the 1941 Toronto Postal Delivery Building (Charles B. Dolphin) on the east (Bay Street) and south (Lake Shore Boulevard) sides, the low arched roof, the black metal attic (2026 photographs; the 2018 ones show light grey panels), the glazed plaza front on the west with the video screen and red "Scotiabank Arena" sign, and the crossed Cor-Ten columns in the plaza. **Not modelled:** the 15-storey, 55 m office tower on the same lot (OSM ways 187583789, 1104128163, 1104128150), the Union Station skywalk annexes on the north-west, the Gardiner and the streets. The map provider keeps drawing them.

What a driver sees: at 800 m a wide, low, dark-topped hall with a very shallow arched roofline, a red sign and a glass front on the plaza side; at 100 m the buff limestone colonnade on Bay Street under the black attic, with the rounded ribbon-window corner at Lake Shore.

## Sources

| Fact | Source |
| --- | --- |
| Address, opened 1999-02-19, architects, rename 2018, 9.1 x 15.2 m video screen over the plaza, Art Deco Queenston limestone facade retained on the east and south walls | [Wikipedia](https://en.wikipedia.org/wiki/Scotiabank_Arena) |
| Two-way kingpost steel roof truss spanning 102 m (N-S) and 110 m (E-W); 28 m clear height to the underside of the roof; masonry facades of the post office kept on the south and east; office tower 15 storeys | [Canadian Consulting Engineer](https://www.canadianconsultingengineer.com/features/air-canada-centre-toronto/) |
| Postal Delivery Building 1941, facade retained (facadism), Union Station HCD | [ACO Toronto](https://www.acotoronto.ca/building.php?ID=180) |
| Queenston limestone, black granite plinth, pink granite pilasters framing tall vertical windows in the central parts of the south and east facades, wrap-around ribbon windows, rounded corners, carved panels | [Taylor on History](https://tayloronhistory.com/2013/02/12/torontos-architectural-gemsthe-postal-delivery-building-now-the-acc/) |
| Plan outlines and part heights | OpenStreetMap ways 1104128156, 1104128153, 1104128155, 1104128154, 1104128157, 1104128159 and 19882585 (fetched 2026-09-29 through `local-scratch/overpass.mjs`) |

Reference photographs, used only to compare (local, ignored `local-scratch/scotiabank-arena/refs/`), all from Wikimedia Commons: Roland Tanglao, *Air Canada Centre Bay Street Facade* (CC BY 2.0); Paperfire, *Scotiabank Arena - 2018 (cropped)* (CC BY-SA 4.0); Adam Bishop, *Scotiabank Arena at dusk* and *summer 2022* (CC BY-SA 4.0); PascalHD, *Scotiabank Arena along Bay Street, May 13 2026 (01)* (CC BY-SA 4.0); Sikander, *Scotiabank Arena from CIBC Square Park - 20260308* (CC BY-SA 4.0); Balcer, *Air Canada Centre from CN Tower* (public domain); Secondarywaltz, *Air Canada Centre and CN Tower from Bay St* (public domain); Bourquie, *Union Station and ACC from CN Tower (2005.8.11)* (CC BY-SA 3.0); Adam Moss, *Toronto (26217674549)* (CC BY-SA 2.0).

## Frame, footprint and origin

Real metres, +X east, +Y up, +Z south. `y = 0` is local flat-map grade; no terrain, sea level or Mercator stretch is baked in (ADR-0043/0045). Origin `[-79.379057, 43.643449]` is the area centroid of the bowl-roof part (OSM way 1104128156). Nothing is rotated: every mass is built directly from the mapped outlines, whose edges follow Bay Street (bearing 343 degrees), Lake Shore Boulevard (about 60 degrees) and the plaza front (about 152-160 degrees). `frontageBearing` 242 is the outward normal of the plaza front (west-south-west).

`footprint.js` lists six OSM `building:part` rings: the bowl roof, the limestone facade strip, the south and north black wall bands, the west glazed front and its north wing. The lot outline (way 19882585) is **deliberately not listed**: the runtime removes provider triangles lying entirely inside a listed ring, and that outline contains the office tower, which would disappear with nothing drawn in its place. `scotiabank-arena.test.js` checks that no model vertex lies inside the tower footprint. The model stays within 2.8 m of the listed rings (canopy, pilaster and screen projections); the plaza sculpture stands about 15 m outside, on the public plaza, on purpose.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Roof span | about 110 m along Lake Shore, 94 m along the plaza front (bowl ring) | sourced 102 x 110 m truss span; plan from OSM |
| Roof crown | 31 m | estimated: sourced 28 m clear height plus truss depth; OSM 22 m + 4 m round roof (= 26 m) is lower, photographs of the Bay Street attic (about 0.4 of the cornice height) fit 27-31 m |
| Eave / attic top | 27 m at the corners, 28-29 m mid-edge | estimated; the arch rises about 2 m over 76 m along Bay Street in the photographs |
| Retained limestone cornice | 19 m | estimated from photographs (pedestrian scale, 5 storeys) |
| Bay Street facade | 95.7 m long, 8 window bays (8 m pitch) between a 19 m north block and a 12.7 m corner block | length from OSM; bays counted from photographs, approximate |
| Lake Shore facade | 77 m long, 6 bays, rounded 6 m radius corner with two ribbon-window bands | length from OSM; bays estimated |
| Glazed plaza front | 19.5 m to the canopy roof; entrance canopy at 5.6 m | estimated from photographs |
| Video screen | 9.1 m high x 15.2 m wide, bottom at 7.0 m | **published** size; position estimated |
| Red sign | letters 1.5 m high, about 21 m long, on the canopy roof | estimated from photographs |
| Plaza sculpture | two 31 m and 27 m tapered columns crossing, one 13 m thick column | estimated; star perforations omitted |
| Highest point | 32.4 m (rooftop plant); declared `height` 32 | |

## Materials and palettes

Twelve named materials, the same keys in `PALETTES.light` and `.dark`: `limestone`, `granite` (pilasters), `plinth` (black granite), `glass`, `frame` (mullions, canopy, fascia), `cladding` and `louvre` (attic), `roof`, `patina` (verdigris frieze line), `sign`, `glow`, `corten`. `sign` (red lettering) and `glow` (the video screen) are the runtime's unshaded self-lit materials, so they read at night; the dark palette dims stone and glass and brightens those two.

## Modelling decisions

- **Roof as a real surface.** A shallow two-way arch (`makeRoofHeight`): crown 31 m falling to about the 27 m eave at the corners, meshed as rings scaled about the bowl centroid so the roof and the attic-wall tops share one height function and never gap. It is the silhouette that reads at 800 m.
- **Attic as bays.** Black cladding below, lighter louvre band above, vertical fins every 9 m, a pale coping line; wall bases follow what stands in front (19 m over the limestone, 19.5 m over the plaza front, 12 m over the south return, 9 m over the north wing, ground level on the north side).
- **Roof.** Mid-grey membrane (light `#83878a`, dark `#50565b`) with standing-seam joints every 6 m (12 m far) draped on the arch, clipped to the bowl outline, plus roof plant (near). Review fix: it was a near-white plate.
- **North service face.** The 62 m north face (skirt, 0-18 m) is mid-grey `louvre` with dark base course and two bands, five roll-up loading doors with surrounds and vent panels, four pedestrian doors, and panel joints every 3.1 m (near). Review fix: it was one blank black slab.
- **Retained facade.** A solid limestone podium along the mapped outer line with rounded corners; black base course, pink-grey pilasters at an 8 m pitch, tall windows with mullion and transom grids, ribbon-window end blocks that wrap the Lake Shore corner, a verdigris frieze line, a cornice, and "Scotiabank Arena" in the frieze (near LOD).
- **Plaza front.** Glass prisms from the mapped west outline (front, south return, north wing) with a mullion grid, the thick canopy fascia, the 5.6 m entrance canopy, the 9.1 x 15.2 m screen, the red sign, two flagpoles.
- **Near vs far.** Near (14,173 triangles) carries mullions, transoms, sign letters, fins, roof plant and flagpoles. Far (5,830 triangles, 41 percent) keeps the roof arch (attic tops sampled every 6 m, four roof rings), the attic bay fins (12 m), pilasters and windows as recessed boxes, the ribbon windows, the north dock doors, roof seams, the screen and a solid sign bar, so the arch, the black band over the pale colonnade and the glazed front still read at 800 m.
- Materials are merged per name (12 draws in both LODs; budget 48 / 14).

## Approximations

Heights are photo and structure-based estimates, not a survey. The roof arch is a smooth cap, not the gull-wing truss profile. The attic reflects today's black cladding (the 2018 photographs show light grey panels). Doors, carved stone panels, the star perforations of the sculpture, the skywalk annexes, the PATH bridge and the office tower are omitted. The glazed front is one flat curtain wall with a grid; the real glass is reflective and slightly bowed. Bay counts on both limestone facades are approximate.

## Costs (exported default scenes)

| LOD | Triangles | Mesh draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 14,173 | 12 | 740,420 |
| Far | 5,830 | 12 | 314,528 |

## Verification evidence

Screenshots under `local-scratch/shots/scotiabank-arena/` (ignored by git), procedural source and exported GLB, rendered with `local-scratch/shot.mjs` (footprints drawn in red):

- Bay Street facade, opposite the road: `...procedural-near-light-bayref.png`, `...street.png`, `...streetN.png`, compared with Roland Tanglao's Bay Street photograph and the 2026 Bay Street photographs. Changes made: pilasters darkened (photograph shows darker stone than the wall), frieze lettering added and recoloured from black to grey, black base blocks kept at the pilaster feet.
- Plaza front, screen and sign, low and elevated: `...plazaref.png`, `...swcorner.png`, `...glb-near-dark-plaza.png`, compared with the 2018 and 2022 front views. Changes: glass darkened, canopy fascia thickened and set forward, sign moved onto the fascia top, sculpture rebuilt as long, thin tapered columns and darker Cor-Ten (the first version was short orange stumps).
- Above: `...roof.png`, `...top.png` (footprint check: model inside the red rings), `...aerial.png` vs the CN Tower aerials of 2005/2006.
- Back / north: `...north.png`, `...nw.png`, `...ne.png`. Changes: skirt cap made dark instead of a bright ledge; after review, the roof darkened with seams added and the north face articulated (`...-ne.png`, `...-north.png`, `...-glb-near-light-ne.png`), and the far model given denser arch sampling and attic fins (`...-far-dark-far800.png`); north wall follows the tower's mapped edge exactly (it previously pushed 1.2 m into the tower footprint; found by the test).
- Corner detail: `...glb-far-dark-facade.png`, `...glb-near-light-structure.png` (Lake Shore side).
- Exported GLB: `...glb-near-light-{overview,facade,plaza,structure,north,detail}.png`, `...glb-far-dark-{overview,plaza,facade}.png`, `...glb-near-dark-{overview,plaza}.png`, `...glb-far-light-{overview,roof}.png` all match the procedural source.

Tests: `node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/scotiabank-arena/scotiabank-arena.test.js` (all green). The landmark test pins the mapped vertices, the footprint envelope, crown/eave/cornice heights and the two-way arch, 9 and 7 pilasters by raycast in both LODs, window bays, the ribbon windows on the rounded corner, the published screen size and its facing, the sign's extent and readability from the plaza, no geometry inside the office tower's footprint, far-LOD bounds and cost, and the GLB round trip.

| Mode | Status |
| --- | --- |
| Cityscape, flat ground | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |
| Provider-extrusion replacement (six rings) | rings verified against the model in the inspector only; the office tower's extrusion is intentionally kept |

Open risk for integration: if the map provider also draws the whole-lot outline (way 19882585, no height, 5 levels) as an extrusion, it survives the mask and may show through where the model is lower than it (the south return, 12 m, and the north wing, 9 m).
