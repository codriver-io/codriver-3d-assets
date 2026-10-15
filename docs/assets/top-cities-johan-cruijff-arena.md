# Johan Cruijff ArenA (Amsterdam)

Original procedural model of the Johan Cruijff ArenA (the Amsterdam ArenA until 2018), ArenA Boulevard 1, Amsterdam Zuidoost: Rob Schuurman's stadium of 1993-96 with the retractable roof, home of Ajax. Part of the [top-cities set](../top-cities-landmarks.md); catalog record `prototypes/assets3d/catalog.d/johan-cruijff-arena.json`; source `src/peregrine/landmarks/top-cities/johan-cruijff-arena/`. Build: `pnpm build:top-cities-landmarks johan-cruijff-arena`.

## What is modelled

The roof is **closed**, the state most drivers see from the A2 and the Arenaboulevard, and the cheapest to read from far away.

- **Bowl**: a superellipse (exponent 2.5, flat ends, rounded corners), 208 x 170 m at the wall, centred 2 m toward the back side of the pitch. White concrete in bands: a podium band, a window band of alternating teal glass and white panels, a red ribbon, a white band with slim fins, a cornice, and a dark clerestory under the roof.
- **Promenade deck** (9.6 m), 7 m wide all round the wall, on 48 Y-struts (96 legs) that land on the forecourt; the ground storey is dark glazing recessed under it. Six long stairs hug the deck edge down to the forecourt.
- **Roof**: a grey roof that climbs from the eave (33 to 38 m) to a 55 m plateau between the arches, where the two sliding panels meet at a centre seam and ride rails under the arches; rib lines on the slopes; photovoltaic arrays low on both long slopes and on the panels' parking ends.
- **The two arches** (the identity): vertical lattice trusses in the planes 42 m either side of the pitch axis, 202 m between their feet, crowning at the published 75 m (74.2 m chord centre, the white top chord reaches 75). Triangular section: one top chord, two bottom chords, Warren diagonals, posts and tie bars. The roof hangs from them on seven hangers each.
- **Corner masts**: four pairs of white masts on grey concrete cores, each with three stacked ring-light discs and a lamp (self-lit at night); a tall mast carries the arch foot, a shorter one stands beside it.
- **Entrance pod** on the front (WSW) side: a low glazed hall under a concrete canopy in the outline's bump, with the **logo box**: a 30 m white block of nine round windows, and two silver stair drums.

Orientation is baked into the geometry: the pitch's long axis (OSM way 57853514) runs **151 degrees**, the arches run along it, the entrance pod faces 241 degrees (WSW).

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Opened / architect | 1996 / Rob Schuurman | Wikipedia |
| Top of structure | 75 m | OSM relation 1458682 `height`, nl-wiki |
| Pitch | 105 x 68 m, long axis bearing 151 | OSM way 57853514 (`Field dimensions`), measured |
| Outline | about 258 x 226 m with deck, stair towers, pod | OSM way 57853253 (outer ring of the relation) |
| Roof | two sliding panels on two arched trusses | Wikipedia, photographs |
| Origin | pitch centre, [4.941798, 52.314329] | measured from way 57853514 |

## Dimensions: sourced against estimated

| Item | Model | Status |
| --- | --- | --- |
| Crown | 75.0 m (arch top chord) | sourced (OSM height) |
| Pitch axis | 151 deg | sourced (mapped pitch) |
| Footprint | inside the mapped outline (masts and stair feet on its edge) | sourced |
| Wall superellipse | 104 x 85 m half axes, n 2.5 | fitted to the mapped outline |
| Roof edge | 213 x 175 m | fitted |
| Eave / plateau | 33-38 m / 55 m | estimated from photographs |
| Deck level / width | 9.6 m / 7 m | estimated |
| Arch spacing / span | 84 m / 202 m between feet | estimated from photographs |
| Arch foot / truss depth | 48 m / 3.6 m at the feet, 7.2 m at the crown | estimated |
| Masts | 49.5 m tall, 42 m short | estimated |
| Logo box | 30 x 28 m, nine windows of 5 m | estimated |

## Materials (12 near, 8 far)

`roof`, `roof_seam`, `solar`, `concrete`, `concrete_dark`, `metal`, `glass`, `glow` (the lit ground-floor glazing and pod, unshaded: dark by day, warm at night), `teal`, `red`, `truss`, `light` (mast lamps, unshaded). Far folds `teal` into `concrete`, `metal` and `roof_seam` into `concrete_dark`, and `glow` into `glass`, so a far model has no glowing band at night.

## Cost

| | Triangles | Draws | Size |
| --- | --- | --- | --- |
| Near | 19,186 | 12 | 725 KB |
| Far | 7,056 | 8 | 267 KB |

Far keeps the arches (half the panels, one bottom chord), the masts, the roof grid, the PV bands and the facade bands at half the segment count.

## Approximations and known limits

- The roof is modelled closed; the open state (panels stacked over the ends, the pitch visible) is not available. There is no seating bowl, pitch or interior.
- The roof is a smooth heightfield: the real roof is faceted into panels and parking bays. The PV layout is a pattern, not a count.
- The facade is simplified to bands; the raking concrete frame, the glazed escalator tubes, signage, floodlights, the metro viaduct and the neighbouring shopping centre are not modelled. The shopping centre (way 181153235), the six-storey way 738058372 and the small annex way 282372120 are left to the provider on purpose: the model draws nothing over them.
- Stairs, struts and masts stand on a flat forecourt; the Amsterdam polder is flat so no terrain pad is declared (`padM` 150).

## Verification

- Contact sheets read, procedural and exported GLB: near light (overview, facade, back, roof, street, detail, mast and corner close-ups, plan view over the red outline) and far dark (overview, facade, back, roof), against references 2, 4 and 5 (aerials) and 1 (interior, roof arches). Changes made because of them: the arch feet were lowered from 53 to 48 m (the photographs show the arch dropping to the masts' height); the photovoltaic rows were cut from 7.6 m to 4.4 m (the real arrays are narrow bands); the pod was lowered from a 9 m dark block to a 5 m canopy and the logo box now stands on it instead of floating; roof ribs and stairs that hung off the roof edge or outside the outline were clipped or moved; far no longer folds the clerestory into the warm night glow (a giant cream band).
- `src/peregrine/landmarks/top-cities/johan-cruijff-arena/johan-cruijff-arena.test.js`: crown height both LODs, axis bearing, roof plateau and eave, logo box windows by raycast, every hanger and arch end and Y-strut and stair terminal against its named support (with a deliberately shortened free end that fails), nothing below grade, containment in the mapped outline, far silhouette.
- `node scripts/landmark-depth-layers.mjs --ids johan-cruijff-arena --check`: current, no cycles.
- Cityscape and Full 3D world: **not tested yet**, integration is checked separately.

## Reference photographs (ignored, not in the repository)

File:Arena, Ajax stadion, Amsterdam.JPG (Alf van Beem, CC0); File:Amsterdam Arena Roof Open.jpg (Quistnix, CC BY 3.0); File:Amsterdam Arena.jpg (Florian K., CC BY-SA 3.0); File:Ajax 0 Chelsea 1 (23Oct19).jpg (@cfcunofficial, CC BY-SA 2.0).
