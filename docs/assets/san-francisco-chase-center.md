# Chase Center (San Francisco)

Landmark id `chase-center`. Original procedural model of Chase Center, 1 Warriors Way (Third Street at 16th Street), Mission Bay, home of the Golden State Warriors and the Golden State Valkyries. It follows the [San Francisco landmark contract](../san-francisco-landmarks.md) and the asset catalog.

## What is modelled, and which version

The arena as it stands since it opened on 6 September 2019 (Manica Architecture, design architect; Kendall/Heaton Associates, architect of record; Magnusson Klemencic Associates, structure). Only the arena building is modelled: the two Uber headquarters towers beside it, the 450 South Street garage, the Thrive City pavilions to the east (Che Fico, the stair terrace) and the Seeing Spheres sculpture are separate buildings or outdoor art and are not in the footprint.

A driver sees, and the model has:

- the white aluminium-panel **drum** wrapping the west, north and south: three stacked horizontal bands (a lower band that flares out to a stepped ledge, a middle band, and a top band that leans in under the roof visor), each separated by a dark shadow gap, with the panels' staggered dark slots drawn as small dashes on the two big bands;
- a dark timber-toned **base** under the drum (recessed 4.5 m under the skin lip, also round the two return walls) with three glazed entrance bays (west entrance, box office, north shop side);
- the **glass front** (the "prow") on the east: a curtain wall that leans outward as it rises over a glazed lobby, with a mullion and transom grid, two lit bands of floors (`glow`), white lobby columns about every 11.5 m;
- the **roof visor** over the front: a timber soffit about 29 m up, white round columns standing between the glass top and the soffit, and a white fascia that tapers into the drum at both ends;
- the gently domed **roof** with a 0.8 m parapet ring, twelve radial ribs, four lit skylight bands, sixteen plant units and a central plant block that tops out at the mapped 38.1 m;
- the **CHASE CENTER** sign on the glass in its southern half, drawn letter by letter as unshaded `sign` geometry, with a plain blue octagon (`logo`) between the two words.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Height | 38.1 m (125 ft), highest point | OSM `height` tag on way 579646390 |
| Plan | the whole arena, 66 vertices, about 160 m x 157 m, 1.96 ha | OSM way 579646390 (retrieved 2026-10-01, ODbL 1.0) |
| Address, opening, capacity | 1 Warriors Way, 6 Sep 2019, 18,064 | OSM tags, [Wikipedia](https://en.wikipedia.org/wiki/Chase_Center) |
| Architects, structure | Manica; Kendall/Heaton; Magnusson Klemencic | Wikipedia |
| Orientation of the glass front | faces east (about bearing 92 degrees) toward Terry A. Francois Boulevard and Bayfront Park | the mapped notch edges, OSM entrance node on the east arc, the Seeing Spheres node, five photographs |
| Surface of the drum | white aluminium panels in horizontal bands | photographs (below) |

The brief's starting note described "vertical aluminium fins". The photographs show the opposite: **horizontal bands of flat white panels** with short dark slots, so the drum is built that way.

Photographs used to compare (kept in the ignored `tmp/san-francisco/chase-center/refs/`): Commons 'Chase Center 2019.jpg' (Willowcharter, CC BY-SA 4.0), 'Chase Center - July 2019 (7605).jpg' and 'Chase Center - February 2019 (1943).jpg' (Gregory Varnum, CC BY-SA 4.0), 'Chase Center skin (29905972037).jpg', 'Chase Center 3rd (43829975765).jpg' and 'Chase Center (51775242989).jpg' (Dale Cruse, CC BY 2.0).

## Dimensions: sourced against estimated

| Dimension | Model | Status |
| --- | --- | --- |
| Crown height | 38.1 m | sourced (OSM tag) |
| Plan | 155.9 m east-west x 158.6 m north-south | mapped |
| Origin | [-122.3873962, 37.7678739]: area centroid of the mapped outline | mapped |
| Visor (roof edge) | on the mapped outline | mapped |
| Rim height / dome | rim 36.0 m (parapet to 36.8 m) rising to a 37.1 m dome surface; plant block to 38.1 m | rim and dome estimated, crown sourced |
| Base wall | 0 - 6.5 m, 4.5 m inside the outline | estimated |
| Lower band | 6.5 - 17.5 m, flaring from 2.5 m to 0.8 m inside the outline, 1.2 m ledge | estimated |
| Middle band | 17.5 - 29 m, 2.0 m to 0.9 m inside | estimated |
| Top band | 29 - 36 m, leaning in 2.7 m to the rim | estimated |
| Glass front | glazing from 6.5 m to 26 m, top overhangs base by 3.5 m, 9.5 - 14 m inside the roof edge | estimated |
| Visor depth beyond the glass top | 6.5 m at the ends, 10.5 m in the middle | estimated |
| Soffit / column heights | soffit 29 m, columns 26 - 29.4 m, lobby columns 0 - 7.2 m, about 11.5 m apart | estimated |
| Sign | 2.4 m letters, about 29 m long, centred 22 % of the way up the glass from its south end, centre height 17 m | estimated |
| Mullions / transoms | every 3.1 m / at 10.5, 14, 17.5, 21, 24 m | estimated |

**Datum.** `y = 0` is the street and plaza level round the arena; the published 38.1 m is taken as height over it. The terrain pad (`padM` 95) covers the mapped outline.

## Materials

`skin` (white panels), `skin_dark` (shadow gaps under the ledges and visor lip, the panel slots, the plant block and some roof units), `roof`, `glass` (blue curtain wall), `glow` (lit floors, lobby, entrance bays and roof skylights: drawn unshaded, so its day colour is a deep blue chosen to match the shaded glass, warm at night), `steel` (mullions, transoms and roof ribs), `timber` (soffit), `base` (dark timber base), `sign` (self-lit letters), `logo` (blue octagon). Light and dark palettes name the same keys. Far merges the roof into `skin` and drops `steel` and `logo`. The day glass is `#4a7ba6` and the day `glow` `#275a85`.

## Modelling decisions

- **The plan is the OSM outline.** Everything is a radial inset of the mapped vertices (`chase-center-plan.js`), so the model sits in its footprint by construction. The outline is the roof visor's edge; the drum bands and the base are tucked inside it. Two short mapped edges where the radius drops by more than 10 m separate the glass prow from the drum; they are drawn as the white return walls where the prow's ends meet the drum. At the south end the visor is cut diagonally into the drum, as in the photographs; at the north end the drum bulges beyond the prow.
- **One shell, four chains.** Drum, north return, prow and south return share one set of profile rows, so there are no holes or overlapping surfaces; horizontal steps (ledges, soffits) are zero-height row pairs. Every quad is oriented against its intended facing, and the normals are smoothed along each chain only.
- **Dashes, not fins.** The staggered dark slots are single hinged quads (2 triangles each): the top edge sits on the panel and the bottom edge stands 0.14 m proud, so each faces out and up and is visible from the street and from above. About 700 of them, near only. They replaced 12-triangle boxes (8.4 k triangles, now 1.4 k).
- **Banded return walls.** The notch edges run almost radially, so a radial inset only slides a wall along itself. The drum-profile part of each return wall (about 60 % of the north edge, 34 % of the south edge) is therefore inset along the mitre of its two edges, which gives it the drum's ledge, shadow gaps, slots and recessed base; the remaining short transition wall joins it to the glass end. The south split is placed past the glass end's inset or the inset ring folds back on itself (found by the inside-out sweep); wall orientation is taken from the mapped edge, not the inset one.
- **Roof.** The dome is the rim ring scaled toward the origin, rising to 37.1 m; a 0.8 m parapet runs round the rim; ribs, skylights and plant units are boxes sitting on the dome (embedded 0.15 - 0.3 m, tops clamped under 38.1 m). Far has the parapet and the central block.
- **Sign.** Letters are boxes placed one by one on the leaning glass, 0.3 m proud, so the sign follows the curve. The octagon is plain.
- **Not modelled.** The Seeing Spheres (outside the mapped arena), Thrive City, the Uber towers, the white cantilevered terraces north of the glass front, interior, seating, roof equipment.
- **Far.** The same chains with every second vertex, no slots, mullions, transoms or upper columns; the sign is one lit bar; the lit floors, lobby columns, ledges, visor and soffit stay so the entrance front and the stepped drum read at 800 m and at night.

## Approximations and weaknesses

- All heights inside 38.1 m, the band profile, the glass lean and the visor depth are estimates from photographs; the true bands are a twisting, nautilus-like panel surface rather than three clean frusta.
- The return walls are plain flat white walls; the real junctions are more complex (terraces, stair, pavilion).
- The roof structure (ribs, skylights, plant units) is plausible but invented: the real roof layout is not published or visible in the photographs.
- The glass is a flat opaque deep blue with slightly lighter lit bands; the real wall is a mirror that reflects sky and street. The transition walls between the glass ends and the banded return pieces are small, plain and partly folded.
- The slot dashes are sub-pixel beyond about 100 m.
- Cityscape and Full 3D world are not tested; the model is a rigid structure on local `y = 0`.

## Costs

| Detail | Triangles | Draw calls | Size |
| --- | --- | --- | --- |
| near | 8,996 | 10 | 371,924 bytes (363.2 KiB) |
| far | 1,413 | 7 | 56,256 bytes (54.9 KiB) |

Budgets for a building: near 60,000 triangles / 14 draws / 2.5 MB, far 12,000 / 8 / 500 KB (the contract test counts bytes: 2,500,000 and 500,000). Sizes here are exact bytes, with KiB (1,024 bytes) in brackets; the build script prints KiB.

Fix round 2 (independent review, PASS-WITH-NITS): near went from 13,078 triangles / 595 KiB to 8,996 / 363 KiB (slots to single quads, roof structure and banded return walls added); far from 1,125 / 45 KiB to 1,413 / 55 KiB (parapet and central block).

## Verification evidence

Rendered with `node tmp/san-francisco/shot.mjs chase-center` (headless GPU Chromium, red footprint ring, 10 m grid) in `tmp/san-francisco/shots/chase-center/`, procedural source and the exported GLBs, near and far, light and dark:

- Looked at: `overview` (south-east, compared to Willowcharter's photograph), `facade` (straight on from the east), `street` (plaza level), `sign`, `visor` (under the soffit), `west` (the drum from Third Street), `roof`, a north-east aerial, the south-end underside, a drum close-up and the plan view (`--top`), in `chase-center-glb-*` for the exported files.
- What changed because of it: the first pass drew the drum as vertical fins (the brief's guess) and the photographs said horizontal bands; the first glass wall had slanted mullions (positions were by arc length at each height, now by fraction of the chain); a dropped vertex index left the west wall 1.3 m outside the outline (found by the containment test); the visor lip shadow gap was too thick (0.9 m, now 0.6 m); the glass bands were too contrasting by day; the base and soffit shared one brown (now `base` and `timber`); the logo octagon was mis-rotated; the panel slots and entrance bays were built on a mirrored (left-handed) basis, so their boxes were inside out (found by the front-face-versus-double-sided ray sweep, fixed by reversing the tangent); the night glass was too dark; the far model now keeps the lit bands.
- Automated: a ray sweep from 2,592 outside directions (and 2,160 from the plaza under the visor and round the drum) compares front-face-only hits with double-sided hits, so any inside-out face would show; none remain, and a smaller version of the sweep is in the test file. `chase-center.test.js` pins the 38.1 m crown, the plan size, containment in the OSM outline, the three bands and the 1.2 m ledge, the base, the leaning glass front 52-70 m east, the timber soffit, the open lobby columns, the sign's size, height and place, the roof's parapet, ribs, skylights and 38.1 m plant block, the banded north return wall, no zero-area triangles, a 1,000-ray front-versus-double-sided sweep and the far silhouette.
- Fix round 2: re-rendered the exported GLBs from the plaza (north-east and south-east ends), a high east aerial, the street view, the roof (light, dark, far) and the far overview, and looked at them. Changes made because of them: the day `glow` is drawn unshaded and had read pale next to the shaded glass, so it is now a deep blue near the glass tone; the roof gained structure; the north return wall was a plain slab on a protruding base and is now banded and recessed; a first attempt that inset the return pieces radially produced no ledge (the edge is radial) and a mitred one folded the south end (caught by the inside-out sweep: 0 mismatches after moving the split).
- Cityscape: **not tested**. Full 3D world: **not tested**.
