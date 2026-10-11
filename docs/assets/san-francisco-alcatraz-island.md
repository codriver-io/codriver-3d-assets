# Alcatraz Island, San Francisco Bay

Original procedural model of the Alcatraz penitentiary complex, for Cityscape. Part of the [San Francisco landmarks](../san-francisco-landmarks.md).

Build: `pnpm build:san-francisco-landmarks alcatraz-island`. Source: `src/peregrine/landmarks/san-francisco/alcatraz-island/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `alcatraz-island-plan.js`, `alcatraz-island-kit.js`, `alcatraz-island-parts.js`, `alcatraz-island.test.js`). Catalog record: `prototypes/assets3d/catalog.d/alcatraz-island.json`.

## What it is

Alcatraz is the 22-acre rock 1.25 miles off San Francisco. The model is the part of it a driver sees from the Embarcadero, the Marina and the Golden Gate Bridge: the long grey-beige **Main Cellhouse** (concrete, built 1909-1912 over the old Citadel, three storeys on a rusticated base, flat parapet roof with skylight monitors) with its **Dining Hall** wing and the **Administration Block**; the **1909 lighthouse** (octagonal concrete tower with a lantern) beside its south-east end; the dark **Warden's House ruins** (burnt 1970, a roofless shell with a free chimney); the **recreation-yard wall** with buttress piers, coping, a catwalk rail and guard towers; and the **1940-41 water tower** (250,000 US gallon tank on six cross-braced steel legs) at the north-west end. The state modelled is today's, as a National Park Service museum.

**The island rock is not part of the model**: Full 3D world terrain already carries it, so baking it would double its 40 m. Nothing else on the island is modelled either (see "Left out").

## Source check (fetched 2026-10-01)

| Fact used | Where it was confirmed |
| --- | --- |
| Lighthouse: concrete, octagonal pyramidal tower, "84 feet (26 m)" (also "25.6 metres (84 ft)"), focal height 214 ft (65 m) above sea level, built 1909, masonry foundation | Wikipedia, *Alcatraz Island Lighthouse* (text fetched through the API under that exact title; an earlier fetch under a wrong title came back empty and was deleted); OSM way 99202294 tags `height=26`, `start_date=1909`, `man_made=lighthouse` |
| "The three-story cellhouse" with cell blocks A-D | Wikipedia, *Alcatraz Federal Penitentiary*, opening section |
| Water tower: "six cross-braced steel legs submerged in concrete foundations", "94 feet (29 m)", "250,000 US gallons", built 1940-41, "tallest building on the island", north-west side | Wikipedia, *Alcatraz Federal Penitentiary*, "Alcatraz water tower" section |
| Warden's House: 3 floors, built 1921 (other sources 1926/1929), burnt 1970 | Wikipedia, *Alcatraz Federal Penitentiary*, "Warden's House" section; the lighthouse article for the 1970 fire |
| Outlines and the yard-wall line | OpenStreetMap ways listed in `footprint.js` (fetched through the shared Overpass queue) |
| Cellhouse length | **Not backed by a Wikipedia figure** (see below) |

Everything not in this table (parapet heights, window tiers, monitors, ruin breaks, base block, yard-wall height, guard-tower positions, the cellhouse-to-lighthouse height ratio) is **estimated from photographs** and labelled so below.

## Frame, origin, orientation

* Origin `[-122.4229316, 37.8266302]`: area centroid of the mapped outline of the Main Prison (OSM way 128245373). Six outlines are in `FOOTPRINTS`: Main Prison, Dining Hall (24433437), Administration Block (128245367), Lighthouse (99202294), Warden's House ruins (27996789), Water Tower (660870452).
* The island's grid is turned 45.95 degrees off north. Two long edges of the cellhouse outline (48.1 m and 48.0 m) give bearing **135.95 / 135.93 degrees**, and two short ones (34.9 m, 20.1 m) the perpendicular 45.95. The model is authored in building axes (**u** along the long axis toward the lighthouse, **w** toward the south-west) and rotated once onto east/up/south; `frontageBearing` is 225.95 (the long south-west front looks at San Francisco and the Golden Gate). The rotation is exported in the GLB; the layer must not rotate again.
* **`y = 0` is the cellhouse's yard / main grade, about 38 m above the bay.** No sea level, terrain or latitude stretch is baked in. Other grades (from one public Terrarium DEM tile, z15 5240/12659, coarse 3.8 m pixels, used only to decide offsets):

| Place | Ground (m above the bay) | Relative to `y=0` | In the model |
| --- | --- | --- | --- |
| Cellhouse yard / central block | about 38.5 | 0 | on `y=0` |
| Administration Block end | about 42 | +3.5 | on `y=0` (4 m of slope hidden in the fixed grade) |
| Dining Hall (north-west) | about 37.7 | -0.8 | on `y=0` |
| Lighthouse base | about 41.7 (consistent with the 65 m focal height) | +3.2 | base block rises from `y=0`, so the tower is 25.6 m above its own foot and 28.8 m above `y=0` |
| Warden's House ruins | about 38.6 | 0 | on `y=0` |
| Water tower | about 29.7 (24.6-30.6 around it) | about -9 | footings 2.5 m below `y=0` (the lowest point of the model; the -3 m floor stays); **top set to its true height relative to the cellhouse roof, see below** |
| Power House, chimney, dock, Building 64 | 5-15 | -25 to -33 | omitted |

### Water tower: height and the Full 3D world limitation

The published tower is 94 ft (29 m) tall, but it stands on ground about 9 m below the cellhouse yard, so its tank top is only about 5 m above the cellhouse roof (the lighthouse stays the highest point). A rigid model cannot go more than 3 m below `y=0` without drawing through the flat Cityscape ground. The model therefore keeps the footings at -2.5 m and sets the tank top at **20.6 m above `y=0`, 4.8 m above the central roof**, so the tower is **about 23 m from footing to hatch, not 29 m**: the legs are shortened by about 6 m to 11 m; tank (13 m across, 11.8 m including bowl and dome) and leg splay are unchanged. The sourced 29 m is not reproduced.

**Full 3D world: the tower stands on its own terrace.** The footing level is a plan constant (`TOWER.footY`, -2.5 m). The explicit terrain pad (see Placement) holds a 15 m disc round the tower at the pad's datum minus 2.5 m. The footings meet the drawn ground within 0.8 m; with the old 75 m disc they were buried 11-14 m. Because the legs are shortened, the terrace is a mound up to about 10 m above the DEM there.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Cellhouse complex length (Dining Hall end to Administration Block end) | 132 m (u -84.5 to 47.4) | mapped (OSM); see "Cellhouse length" |
| Main block plan | 48 x 49 m (u -15.4 to 15.7, w -24.6 to 24.7), plus end block and south-east block | mapped (OSM) |
| Cellhouse storeys | three above a rusticated base | sourced: Wikipedia ("three-story cellhouse") |
| Parapet heights: central / end block / Admin Block / Dining Hall | 15.6 / 14.0 / 12.4 / 10.8 m | estimated from photographs against the 25.6 m lighthouse (in the aerials the cellhouse is roughly 55-60 % of the tower: a visual estimate) |
| Window rhythm: 4.3-4.4 m bays, three tiers (small base, two tall) | | estimated; pilaster/cornice articulation from photographs |
| Skylight monitors | 1.7 m rise, four | estimated (aerials) |
| Lighthouse tower height | 25.6 m (84 ft), octagonal, tapering 4.4 to 3.4 m across the flats | sourced: Wikipedia and OSM `height=26`; the taper widths are estimated |
| Lighthouse base block | 6.0 m square, top 8.4 m above `y=0` | estimated from a close-up photograph |
| Water tower | about 23 m footing to hatch (published 29 m, see above); tank about 13 m across (OSM ring 13.5 m); six legs | six legs, 94 ft and 250,000 gal sourced; shortened height, bowl 3.4 m / wall 5.8 m / dome 2.6 m and brace panels estimated |
| Ruins shell | 16 x 13 m, about 10 m high, stepped gable 12.6 m, chimney 14.9 m | outline mapped; heights and breaks estimated from photographs |
| Recreation-yard wall | 4.6 m incl. 0.3 m coping, + 0.7 m rail, 0.7 m thick, buttress piers 1.1 x 0.9 m every ~6.2 m, on the mapped line (way 99202295) | line mapped; height and piers estimated |
| Guard towers | two, on the yard wall corners | estimated positions (not mapped) |

### Cellhouse length: mapped 132 m vs "500 ft (150 m)"

The brief's landmark note gives the cellhouse as about 150 m (500 ft) long. I could not find that figure in the Wikipedia pages I fetched (*Alcatraz Island*, *Alcatraz Federal Penitentiary*, *Alcatraz Dining Hall*, searched for 500, 275 and 150 ft/m). A web-search summary quoted the cell house proper as about 150 x 275 ft (46 x 84 m); that was not independently verified. **The model follows the mapped OSM outlines**: the Main Prison outline is 65 m along the long axis by 49 m across (area 2,840 m2), the Dining Hall wing adds 52 m and the Administration Block 15 m, so the whole complex is 132 m. If 150 m were the intended overall length, the model is about 18 m shorter; the mapped footprint is what the provider extrusion is replaced against, so it wins.

## Materials

Ten named materials, same keys in light and dark: `stone` (weathered grey-beige cellhouse wall), `trim` (pilasters, cornice, sills, coping), `base` (rusticated base, buttress piers, footings), `wall` (yard wall and guard-tower stalks, weathered grey), `roof`, `glass` (window openings), `ruin` (dark burnt-out shell and chimney), `tower` (lighthouse concrete), `steel` (water tower, rails, vane), `glow` (lantern, drawn unshaded: lit at night). Far merges `trim` and `base` into `stone` and `wall` into `ruin` (seven draws).

## Modelling decisions

* **Cellhouse** from the mapped outline as six rectangles (stepped blocks), each a rusticated base, wall, projecting cornice and thin roof slab, so shared sides never project and no faces coincide; pilasters, string courses, sills, mullioned windows and skylight monitors on every dressed face (16 faces); far keeps the cornice, roofs and one dark window quad per bay.
* **Lighthouse**: base block, cap, tapered octagonal shaft with two narrow windows, corbelled gallery with posts and rail, watch room, eight-sided glazed lantern (`glow`), cap and vane.
* **Water tower**: lathe-turned bowl, wall and dome, balcony and rail, six splayed 11 m legs, three braced panels with crossed diagonals and rings, central riser, concrete footings. The frame stays open in far.
* **Ruins**: four walls built from pier/spandrel boxes around window openings in three tiers, so the openings are real see-through gaps; deliberate breaks, a stepped gable, broken floor slabs hanging off the inside of the long walls (near), a low south-east wing and a free-standing 14.9 m fireplace stack standing 4 m or more above the broken walls so it reads against the sky. Roofless, in a dark grey burnt tone.
* **Yard wall**: one mitred strip along the mapped polyline in weathered grey, with a pale `trim` coping line, buttress piers on the outer face about every 6.2 m (near) and a rail strip on top. Piers and coping are near only; far is a plain strip.

## Left out

The dock and Building 64, the Power House and chimney, New and Model Industries, Sally Port, military chapel, officers' club, morgue and the shoreline stand 15-35 m below the plateau; in a rigid model on `y=0` they would float or need a plinth the contract does not allow. They stay provider extrusions (they are not in `FOOTPRINTS`). Also not modelled: the "UNITED STATES PENITENTIARY" sign (it is at the dock), the recreation-yard steps and buttress, parapet antenna rods, the cellhouse interior, vegetation and the cliff.

## Approximations and weaknesses

* The cellhouse is a clean idealisation: window tiers and parapet heights are estimated from a handful of photographs; the real concrete ranges from pinkish beige to grey with staining, the model uses one weathered grey-beige.
* The ruins read as a roofless shell but are blocky; the real shell has timber, irregular breaks and a curved gable.
* The yard wall has constant height on flat ground; in life it retains a slope and varies in height.
* The water tower is 6 m shorter than published (see above). In Full 3D world it stands on a raised terrace, up to about 10 m above the DEM. The lighthouse base stands on flat ground in Cityscape. Grade offsets come from a coarse DEM and are good to a few metres.
* Cornices project 0.35 m past the mapped wall lines; yard-wall, pier and guard-tower parts lie outside the building rings by design.

## Costs

Near 11,418 triangles / 10 draws / 613,208 bytes; far 3,002 / 7 / 168,080 (budget 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB). Desktop numbers from the exporter, not Tesla hardware.

## Placement

`SPEC.height` is 28.8 m (lighthouse vane). **Cityscape: verified** in the running app (2026-10-01): it stays flat, the group stays at y = 0, no flatten zone exists, and `padM` (75 m) is not used. Screenshot: `tmp/landmark-qa/alcatraz/after-cityscape/alcatraz-island-near.png`.

**Full 3D world: verified** in the running app (2026-10-01; local server, AWS Terrarium DEM at z15), with the residual gaps below. `SPEC.terrainPad` replaces the default disc (`building-layer.js` reads it through `terrain-footprints.js#padFootprint`). The 75 m disc reached the island's slopes and took their lowest DEM sample (14.6 m) as the datum. That sank the complex about 23 m into a flattened pit and raised the bay round the island by up to 11 m. The pad now:

* flattens the mapped Main Prison, Dining Hall and Administration Block outlines to the **median** DEM over the Main Prison outline (37.6 m), feathered back to the DEM over 30 m;
* holds two terraces. The water tower's 15 m disc sits at the datum minus 2.5 m (its footings), with a 25 m feather. The recreation yard's wall line, pushed out 12 m, sits at the datum, with a 12 m feather. Each terrace reaches past its part because the app draws terrain on a lattice of about 30 m;
* flattens nothing else and raises no water.

The measurements below come from `tmp/landmark-qa/alcatraz/measure.mjs`. Each value is the part's base relative to the drawn ground: + means the part floats, - means it is sunk.

| Part | Before (75 m disc) | After (`terrainPad`) |
| --- | --- | --- |
| Datum | 14.6 m | 37.6 m |
| Cellhouse walls (DEM 32.8-41.5) | 0, on a pit cut up to 27 m below the DEM | -0.3 to +0.8 |
| Dining Hall | -1.9 to 0 | 0 to +1.9 (west corner) |
| Lighthouse (DEM 41.5) | -0.5 | 0 |
| Warden's House ruins (DEM 38.7) | -3.2 | +1.3 |
| Water tower footings (DEM 24.3-30.2) | -14.2 to -11.2 | -0.8 to +0.8 |
| Recreation-yard wall vertices | -11.7 to 0 | 0 to +2.9; west corner +8.4 |
| Bay raised | up to 11 m | none |

**Still not right in Full 3D world:**

* The yard wall's west corner (u -137, w 31) stands on the cliff edge, about 8 m above the drawn ground. The 30 m lattice cannot hold a narrower step there without raising the bay.
* The Dining Hall's west corner floats up to 1.9 m and the ruins 1.3 m. Both come from lattice interpolation.
* The yard floor sits about 4 m above the DEM median, which is 33.4 m; the model puts the yard at the cellhouse grade.

Terraces are offset in model metres, so they follow terrain exaggeration (`offsetM / k`); exaggeration other than 1 is not tested. Screenshots: `tmp/landmark-qa/alcatraz/before/` and `tmp/landmark-qa/alcatraz/after/` (far, near, street).

## Verification evidence

Screenshots read from `tmp/san-francisco/shots/alcatraz-island/` (1280 x 800; red rings are the OSM outlines, 10 m grid):

* First round, procedural, near, light: overview, facade (south-west front), roof, lighthouse, tower, ruins, back (north-east), yard, `--top` plan, close-ups, a 250 m shore view and a 700 m far-LOD shore view. Exported GLB (`glb/`): near light overview, lighthouse, tower; near dark facade and back; far light overview and tower; far dark overview and lighthouse.
* Fix round (`fix/`): south shore view at 420 m, near and far (procedural, and the exported GLB), far dark, a 250 m south-west mid view (procedural and GLB), yard-wall close-up and tower close-up.

Changes made because of what the renders and the independent review (PASS-WITH-NITS) showed:

1. First pass: the ruin read as a scaffold lattice (openings 1.7 x 1.7 m), so openings were narrowed to 1.25 m and tiers lowered; the yard-wall rail looked like a grey slab, so the wall went from 5.0 to 4.6 m and the rail to 0.7 m.
2. A faint dashed seam appeared where the end block meets the central block; touching masses now overlap by 3 cm along u, end pilasters by 6 cm, and equal-height roof slabs by 10 cm.
3. The ruin still read as a lattice from the front, so broken floor slabs hang off the inside of the long walls (near).
4. Review fixes: water tower top lowered to its true relation to the cellhouse roof (top 26.5 m to 20.6 m, legs 17 m to 11 m, footings unchanged); the yard wall, a long featureless slab from the south, gained buttress piers, a pale coping line and a darker grey `wall` tone; the ruin went from the cellhouse tan to a dark burnt grey and its chimney from 13.4 m to 14.9 m, moved clear of the walls; the cellhouse palette moved from cream (`#d6c0a2`) to weathered grey-beige (`#a39e93`) after an interim lighter grey still rendered near white under the viewer's lights.

No holes, flipped faces, floating parts or z-fighting were visible from the views listed; the ruin remains the weakest element.

Tests (`node --test src/peregrine/landmarks/san-francisco/alcatraz-island/alcatraz-island.test.js`, about 0.2 s, 17 tests): outline area, centroid origin and the 135.95 degree bearing; lighthouse top, taper, base and lit lantern; water tower top (20.6 m, 4-6 m above the cellhouse roof), footing depth, six legs, tank diameter vs the mapped ring and open frame; cellhouse length, roof heights, monitors and outline coverage; window planes and pilasters; open ruins, 14.9 m chimney and gable; yard wall face, buttress pier, coping and rail; nothing below -3 m; far silhouette and cost; GLB round trip.
