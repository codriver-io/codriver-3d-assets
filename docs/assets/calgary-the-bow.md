# The Bow (Calgary)

Stable asset ID: `the-bow`. An original procedural model of **The Bow, 500 Centre Street SE** (Foster + Partners with Zeidler Partnership Architects, completed 2012), Calgary's second-tallest office tower. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/the-bow/`.

## Identity and what a driver sees

A 236 m, 58-storey tower whose plan is a **crescent**, a "bow" bent around the Bow River's side of downtown: a convex face toward the north-east, a concave face opening to the south-south-west onto a plaza, and a rounded wing at each tip. The two curved faces are wrapped in a **diagrid exoskeleton**: pale silver-white steel members stand about a metre off blue-grey glass, a horizontal ring every 26 m (nine bands over the height) and long diagonals crossing at the rings, so the face reads as tall triangles and diamonds that reach the ground. The two wing columns are plain, darker blue-green glass with fine vertical fins. Two dark bronze **mechanical floors** cross the faces, the concave face carries three recessed **sky gardens**, and the roof is flat with a window-washing rig. In the south plaza stands Jaume Plensa's 12 m wire-mesh head **"Wonderland"**. At 800 m it is a pale diagonal lattice on a slab with a notch in its footprint; at 100 m it is the lattice, the ground-level triangles and the head.

The +15 skywalks, the six-level parkade, the north-side sculpture "Alberta's Dream", the reconstructed York Hotel brick walls and the neighbouring buildings are not modelled.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 127741499](https://www.openstreetmap.org/way/127741499) | Outline (56 nodes, 3,848 m²), `height=236`, `building:levels=58`, `building:material=glass`. The crescent: the concave face fits a circle (centre -17.7 m E, +41.0 m S of the origin, radius 39.2 m, residual 0.25 m over 85 degrees); the convex face fits a circle about (-1.5, +9.6) m, radius 46 to 47.5 m (residual up to 2 m because the outline has small jogs); the two wing ends are read off the node list |
| [Wikipedia, The Bow](https://en.wikipedia.org/wiki/The_Bow_(skyscraper)) | 236 m, 58 storeys (53 office, 2 retail, 4 mechanical, 3 sky gardens "spaced approximately every 18 floors"), crescent shape, floors 54 and 55 the private sky-high clubs, Wonderland unveiled in January 2013 "on the south plaza", Foster + Partners and Zeidler, built for Encana, the tower stands 11 m short of the original plan after shadow concerns on the Bow River pathways |
| [Skyscraper Center](https://www.skyscrapercenter.com/building/the-bow/1036), [Wikidata Q1229086](https://www.wikidata.org/wiki/Q1229086) | Cross-check of the height and the architects |
| OSM `building=roof` ways 1518771027, 1518771028 | Two small entrance canopies on the concave face; not drawn, not listed as footprints |
| Photographs (below) | The diagrid pattern, the number of bands, the mechanical floors, the plain wings, the flat roof, the glass colour |

OSM geometry was read through the shared Overpass helper on 2026-10-02 (`tmp/calgary/the-bow/osm.json`, ignored by git) and is © OpenStreetMap contributors, ODbL 1.0.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/calgary/the-bow/refs/` to compare, never committed: "The Bow, Calgary, east view 20240819 1" (DXR, CC BY-SA 4.0), the main reference for the diagrid, "The Bow in Calgary" (Florian Fuchs, CC BY 3.0), "Bow Tower, Calgary, Canada; 2012" (Bernard Spragg, CC0), "TheBowfromBridgeland" (Greenwood714, CC BY-SA 3.0), "'Wonderland' (2012) by Jaume Plensa -- The Bow Calgary (AB) September 2019" (Ron Cogswell, CC BY 2.0), "The Bow Sky high clubs interior" (IQRemix, CC BY-SA 2.0) and "The Bow-future location" (Qyd, CC BY 2.5; the empty site, not used for geometry). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the ground floor). Origin `[-114.0619708, 51.0478588]` is the centre of the outline's bounding box (it spans x -45.7 to +45.7 m and z -38.0 to +38.0 m). No rotation is applied: the plan is authored directly in map coordinates, so the model sits on the mapped outline (checked in the plan view against the red ring: every vertex is within 0.62 m of it, none further). The concave plaza face looks toward bearing 207. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Top | 236.0 m (the window-washing rig) | **Sourced** (Wikipedia, OSM) |
| Roof deck | 233.6 m, flat; the concave rim dips smoothly by up to 5 m between the wings | Deck height **estimated** (rig 2.4 m above it); the dip is a **hedge**: the photographs show a flat roofline from the north and from above the concave face the edge reads lower than the wings, partly perspective |
| Storeys | 58; the lit-window grid is 8 m at the base, then 4.0 m per storey | **Sourced** count; pitch **estimated** (233.6 m / 58) |
| Plan | crescent, 91 m tip to tip across x and 74 m across z; thickness 40 to 45 m across the body | **Mapped** (OSM) |
| Convex face | circle of 46.0 m about (-1.5, +9.6); glass line 1.5 m inside it | **Mapped** (fit 46 to 47.5 m), set to 46.0 so the model stays inside the ring |
| Concave face | circle of 39.3 m about (-17.7, +41.0); glass line 1.5 m behind it | **Mapped** (residual 0.25 m) |
| Wings | west tip 14 m of the convex arc and a rounded end; south-east tip a 22 to 27 m wide tube with a rounded end | **Mapped** (outline nodes) |
| Diagrid bands | 9 over 233.6 m, 25.96 m per band (about 6.4 storeys) | **Estimated** by counting the horizontal members on the east-view photograph |
| Diagrid pitch | 11 half-bays of 9.7 m on the convex face, 6 of 9.7 m on the concave face; ring nodes every second half-bay, diagonals to both neighbours in the next band | **Estimated** from the photograph (triangle base about 20 m, height about 26 m) |
| Members | diagonals 0.95 m wide, rings 0.85 m, verticals 0.3 m (end posts 1.4 m); standing 0.3 to 1.5 m off the glass | **Estimated** (the diagonals measure about 1.2 m on the photograph; 0.95 m reads closer once the side faces show) |
| Zones | diagrid on the convex face from 143 to 10 degrees (west to east on the map) and on the whole concave face; both wings plain | **Estimated** from the photographs (plain dark west wing at the right of the east view; the two end columns in "The Bow in Calgary") |
| Mechanical floors | two louvred bands 7.5 m tall just above rings 3 and 6 (79 to 87 m and 157 to 165 m) | **Estimated** from the east view (4 mechanical floors in total are **sourced**) |
| Sky gardens | three, 12.5 m (3 storeys) tall, glass set back 2.5 m, centred at 73.2, 145.7 and 218.2 m (about 18 floors apart, the top at the sky-high clubs on floors 54 to 55) | Spacing and the top level **sourced** (Wikipedia); exact heights, depth and extent (between the wings, on the concave face only) **estimated** |
| Wonderland | 12 m head of white wire at (6, 24) m in the concave bay, facing east | Height and "south plaza" **sourced**; position, pose and the stylised head **estimated** |
| Parapet | 1.5 m beam around the whole roof edge, the top ring of the diagrid | **Estimated** |
| Roof plant | one 16 x 9 m enclosure 2 m above the deck; one rig (9 x 3.2 m carriage, 2.2 m mast) near the north-east rim | **Estimated** (the rig is visible on the photographs) |
| Lit windows | about 28 % of 4 m bays on 8 m to 232 m, hashed (near); coarser bays on alternate floors (far) | Estimated |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `glass` | Curtain wall of the two diagrid faces | `#5c7f9b` | `#243a4d` |
| `wing` | The two wing columns, the sky-garden recesses | `#3f6277` | `#182c3a` |
| `frame` | Diagrid rings, diagonals and verticals, parapet, wing fins, garden floor slabs | `#eef1f3` | `#8b97a2` |
| `louvre` | The two mechanical floors | `#5a524b` | `#2a2623` |
| `glow` | Lit offices, unshaded (about the shaded glass by day, so no dark patches) | `#587c99` | `#f0cb8c` |
| `roof` | Roof deck | `#767c82` | `#33383d` |
| `metal` | Roof plant and window-washing rig | `#9ca4aa` | `#566068` |
| `sculpt` | Wonderland | `#f3f4f2` | `#9aa4aa` |

The runtime layer shades each vertex from its normal, so the light palette is the sunlit colour.

## Modelling decisions

- **One crescent, extruded.** The outline is one closed polygon of about 80 vertices (near) built from the two fitted circles and the hand-placed wing ends, inset 1.5 m to the glass line with mitred offsets so every edge stays parallel to its neighbour (`the-bow-parts.js`). It is a prism: the real tower does not taper. Smooth normals run along each arc and split at the corners where the concave face meets a wing, so the curved glass shades as a curve and the wings as columns.
- **The diagrid is bars, not boxes.** A member is a bar of three faces (outer and both sides; the glass side is covered by the member and never drawn), 6 triangles. Rings run between half-bay columns, the zigzag of diagonals goes from every ring node to both neighbouring columns of the next ring, thin verticals stand at every column, and the two end columns of a face are heavy posts. About 350 bars on the two faces, 2.8 k triangles of `frame` in total including the parapet and wing fins; far keeps every ring and diagonal (they are the silhouette of the pattern) and drops the verticals and fins.
- **Diagrid and glass never share a plane.** Members start 0.3 m off the glass, the louvres stand 0.2 m proud and the lit panes 0.15 m, and the ground-end of every diagonal starts 0.2 m above grade so a tilted section never dips below it.
- **Sky gardens are recesses.** The glass steps back 2.5 m between a pale slab edge and a soffit, in `wing` colour, so each reads as a darker band 12.5 m tall behind the diagrid; the members run across them in front. They stop short of the wings.
- **Mechanical floors** are bronze louvre bands over the glass above rings 3 and 6, next to the lower two gardens, as on the photograph.
- **Roof.** The outline filled at the rim heights (the concave rim dips); the plant and rig boxes are sunk into the deck so they cannot hover over the sloping part. The rig's top is the 236 m height, so the bounds equal the sourced height.
- **Wonderland** is a wire head built from eleven profile rings and twelve meridians (`the-bow-sculpture.js`, 1.5 k triangles, near only), standing on the ground in the concave bay, about 10 m from the face. It is a stylised head with a nose and brow, not a likeness.
- **Far LOD.** Same envelope (bounds within 0.01 m of near), the same diagrid rings and diagonals and the same recesses, coarser arcs (12 degrees instead of 4), bigger and fewer lit panes, no verticals, no wing fins, no head. 3.2 k triangles against 7.0 k.

## Approximations and gaps

- The diagrid pitch, band count, member sizes and the plain-wing zones are read from photographs, not drawings; the real nodes are cast-steel joints that are not drawn.
- The roof dip is a hedge (see the table); the real roof may be flat.
- The two ground-level entrance canopies, the lobby and plaza paving, the +15 skywalk, the north-side sculpture and the reconstructed York Hotel walls are not modelled. The glass is opaque: the sky gardens are recesses, not interiors.
- The head is a pose and a size, not a likeness; the wire is 0.16 m, thicker than the real mesh, so it reads from 30 m.
- The east wing's face is plain and its end is read straight off the outline; its true cladding was not visible in any photograph.
- Floor pitch, glass colour and every lit window are estimates. By day the `glow` panes sit within a few percent of the shaded glass (`#587c99` against `#5c7f9b`), so they no longer show as darker patches.

## Build, budgets and verification

```sh
pnpm build:calgary-landmarks the-bow
node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/the-bow/the-bow.test.js
node scripts/asset-catalog.mjs
```

| Export | Bytes | Triangles | Draws |
| --- | ---: | ---: | ---: |
| `public/models/buildings/the-bow-near.glb` | 329 556 | 7 045 | 8 |
| `public/models/buildings/the-bow-far.glb` | 153 712 | 3 192 | 7 |

Budgets are 60 000 / 14 / 2.5 MB near and 12 000 / 8 / 500 KB far; the aims are 15 to 40 k and 2 to 8 k. Near per material: `frame` 2 838, `glow` 2 076, `sculpt` 1 512, `louvre` 204, `glass` 174, `wing` 132, `roof` 73, `metal` 36. No Tesla timing was measured. A deterministic check of the exported GLBs (the coplanar-overlap and back-face sweep of `qa-metrics.mjs`) found 0 coplanar pairs and 0.0 % (near) and 0.2 % (far) back-face hits.

`the-bow.test.js` pins (near and far where it applies): the 236 m top and nothing below grade; far bounds within 1.5 m of near, under half the triangles; the plan as wide and deep as the OSM outline with every vertex inside it (0.8 m slack); a level ray through the middle of the concave bay meets the concave face, crosses 38 to 46 m of building to the convex face, and the bay is open; a pale ring at every 25.96 m on both faces with clear glass between the diagonals, the diagonals meeting a level mid-band sweep at one ray in five to eight; louvres at 5.5 m above rings 3 and 6 and glass 22 m above them; the three sky gardens 2.5 m deep, three storeys tall, 18 floors apart, with glass above and below and the concave glass not recessed at the wings; the wings plain dark glass with rounded ends; the roof deck at 233.6 m and the concave rim 2 to 6 m lower; Wonderland 12 m tall, wire, in the bay, near only; every face the wall draws pointing out; lit panes only between the lobby and the roof and clear of the louvres; palette keys equal in light and dark.

Screenshots looked at (`tmp/calgary/shots/the-bow/`, procedural source and exported GLB, near and far, light and dark):

- **Plan view over the red ring.** The crescent opens to the south-south-west and sits inside the ring; the first run overhung the south-east end by 1.2 m, so the end points were pulled in, and the convex radius went from 46.8 to 46.0 m (worst vertex 0.62 m outside, at the junction post of the west wing).
- **Convex face from the north, at street level and from 330 m**, against "The Bow, Calgary, east view 20240819 1" and "TheBowfromBridgeland". The pattern (tall triangles with horizontal rings, thin verticals, brown bands, a dark plain column at the right) matched; the first render's diagonals and rings were too heavy (1.15 and 1.0 m) and the lit-window patches too strong by day, so members went to 0.95 and 0.85 m and `glow` darkened; the independent review then found the day `glow` too dark (`#426685` against `glass` `#5c7f9b` read as dark patches), so it is `#587c99` now.
- **Concave face from the south-south-west and from the plaza**, against "The Bow in Calgary" and the Spragg photograph: the two end columns flanking the lattice, the lattice reaching the ground. The sky gardens first read as a thin olive line (a soffit lit from the ground colour); the recess back wall was changed to the darker `wing` material so it reads as a band, and the gardens moved to Wikipedia's 18-floor spacing.
- **Mechanical bands** were first tan and 8.5 m tall; they are now a dark bronze-grey, 7.5 m.
- **Wonderland close-ups.** The first head was a light bulb (a neck as wide as the skull); the sections were redrawn with a narrower neck, a forward jaw and a nose, which reads as a profile head, not a likeness.
- **Roof from above:** crescent deck with parapet, plant and rig. **Night:** lit panes on a dark glass body with the lattice a pale grey.
- A first test run found the diagonals' ground ends 0.17 m below grade (a tilted cross-section); they now start 0.2 m up.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately.**
- Full 3D world (terrain): **not tested yet, integration is checked separately.** Downtown east of Centre Street is nearly flat, so no `terrainPad` is declared; the model is a rigid structure on `y = 0` with `padM = 62`, which covers the 53 m footprint. Expect a flat pad; if the DEM under the plaza varies by more than about 2 m the lead should declare a pad.
