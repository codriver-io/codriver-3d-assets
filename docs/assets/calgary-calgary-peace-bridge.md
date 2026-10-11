# Peace Bridge, Calgary

Asset `calgary-peace-bridge`, Santiago Calatrava's pedestrian and cycle bridge over the Bow River between Eau Claire / downtown and Sunnyside (opened 24 March 2012). Original procedural model, free-standing (`kind: 'bridge'`, no road layer): it carries only people and bikes, so the Calgary layer draws it like a building, replaces the mapped bridge outline and never touches roads. Contract: [3d-calgary-landmarks.md](../calgary-landmarks.md). Source: `src/peregrine/landmarks/calgary/calgary-peace-bridge/`. Rebuild: `pnpm build:calgary-landmarks calgary-peace-bridge`.

## Identity and version

The bridge as it stands: a single 126 m tube-girder span with no pier in the river, a red-painted steel double helix wrapped round the deck, glazed leaves over the upper openings, abutments on both banks. A Calgarian knows it from the red braided lattice and the pale glazed crown; at night the roof is lit white. It is not a predecessor or a temporary structure (the construction photographs show the temporary bridge it was assembled on; they were used for massing only). Since 2022 some glass panels have been replaced by steel cables because of vandalism; the model shows the original glazed roof.

## Sources

- [Wikipedia](https://en.wikipedia.org/wiki/Peace_Bridge_(Calgary)): span length (tube girder) 126 m, out to out 130.6 m, total width 8 m, total height 5.85 m, inside width 6.2 m (3.7 m pedestrian, 2.5 m cycleway), helical steel structure with a glass roof, segregated bicycle and pedestrian traffic, no piers in the water, concrete abutments and deck, opened 2012.
- [Santiago Calatrava, project page](https://calatrava.com/projects/peace-bridge-calgary.html): 126 m long, 8 m wide, 5.85 m high; "a helix developed over an oval cross section with two clearly defined tangential radii"; the upper openings are filled with glazed leaves bent to the same shape as the exterior.
- [OSM way 1313657677](https://www.openstreetmap.org/way/1313657677) (`building=bridge`, `man_made=bridge`, `name=Peace Bridge`): the mapped outline, 120.6 x 7.25 m, centred on the origin; its axis fixes the bearing. [OSM way 158753074](https://www.openstreetmap.org/way/158753074) (`highway=cycleway`, `lanes=2`): the cycleway down the middle of the span, 5 nodes over 120.6 m on Mercator bearing 137.88 deg; its middle node is the model origin. Ways 1313657678 and 1313657681 are the two one-way footways either side; 1313657684/5/6 the unmarked crossings. Fetched through the shared queue by the lead (dossier `tmp/calgary/calgary-peace-bridge/osm.json`); ODbL.
- Photographs (Wikimedia Commons; downloaded to ignored `tmp/calgary/calgary-peace-bridge/refs/` only, to compare; none is in the repository or the GLB): Aurorachaseryyc, *Calgary Peace Bridge with Red Ball* (CC BY-SA 4.0); Ryan Quan, *The Peace Bridge in Calgary an HDR photo* (CC BY-SA 3.0); People talking, *Peace bridge pano* (CC BY-SA 4.0); Greenwood714, *CalgaryPeaceBridgeOct2010* and *PeaceBridgeCalgaryUnderConstruction* (CC BY-SA 3.0), Qyd, *Peace Bridge-temporary bridge* (CC BY-SA 3.0): the last three are construction views, used for massing only.

## Dimensions

Frame: local metres, +X east, +Y up, +Z south. The bridge is authored along its own axis (u along the span toward the south-east end, v across it to the right, y up) and rotated once onto bearing 137.88 deg. `y = 0` is the provider footway grade on the flat map.

| Quantity | Value in the model | Basis |
| --- | --- | --- |
| Tube girder | 126 m (end rings at u = +-63) | sourced (Wikipedia, Calatrava) |
| Out to out | 130.6 m (abutments reach u = +-65.3) | sourced; the 2.3 m beyond each end ring is the abutment landing |
| Total height | 5.85 m: crown 4.0 m over the walking surface, soffit 1.85 m under it | height sourced; the split estimated from the deck photographs |
| Inside width | 6.2 m deck, cycleway 2.5 m in the middle (white lines at +-1.25 m), 1.85 m of pedestrian way each side | sourced widths; the layout (cycleway in the middle) from the OSM ways |
| Tube outer width | 7.25 m | mapped outline (the architect and Wikipedia say 8 m overall; the extra 0.75 m is presumably deck edge, rail and light fittings, not modelled) |
| Axis, origin, outline | bearing 137.88 deg, origin mid-span, outline 120.6 x 7.25 m | mapped (OSM) |
| Ring section | ellipse 3.45 x 2.745 m (centre line), centre 1.125 m over the walking surface | estimated; Calatrava describes an oval of two tangential radii, an ellipse stands in for it |
| Tubes | strands 0.5 m near and 0.7 m far in diameter (radius 0.25 / 0.35 m; their centre line is inset 0.07 / 0.17 m inside the hoops' so their outer faces stay flush with the 7.25 x 5.85 m envelope), hoops 0.36 m, end rings 0.60 m | estimated; members of about 0.5-0.7 m in the photographs (the independent review found 0.34 m too thin to survive beyond about 200 m) |
| Helix | 6 right-handed + 6 left-handed strands, one turn per 37.8 m, braiding into diamonds 6.3 m long and about 3.2 m across at the ring | strand count and pitch estimated from the side and deck photographs |
| Hoops | 21 closed rings every 6.3 m, including the two end rings | estimated |
| Glazing | blue-grey panes in the diamonds on the glazed arc, 30 to 150 degrees round the ring (97 diamonds, 194 panes; five of the six diamond rows, down to the shoulders), a silver bar through each; below the rail the sides stay open | architect: glazed leaves in the upper openings; the photographs show glass all over the upper arch; layout estimated |
| Deck | 0.45 m slab, red steel girder 4 m wide under it, walking surface 5 cm over the footway grade | estimated |
| Rails | stainless top rail 1.1 m, mid rail, posts at every node plane | estimated |
| Abutments | 8 m wide, 2.7 m long from the end ring's inner face, to -2.9 m, with 0.9 m landing parapets | estimated (8 m from the architect's overall width) |

## Materials

`steel` the red double helix, hoops and the girder under the deck (`#d0212f` day, `#8f1f2c` night), `glow` the roof glazing (drawn unshaded: blue-grey `#8ba4b5` by day, like the sky the real glass reflects, so the wider glazed arc does not read as a white spine; warm white at night when the real roof is lit), `deck` the concrete walking surface, `concrete` abutments and parapets, `rail` stainless handrails, posts and the silver bars through the roof diamonds, `marking` white lane lines. Six materials, six draws near and five far (far drops the marking), same keys in light and dark.

## Modelling decisions

- **The double helix is the bridge.** Twelve smooth tubes (6-sided near, 4-sided far) run the full 126 m, six turning one way and six the other, sampled every metre near and every 2.4 m far so the curves read as smooth. They cross every 3.15 m along the span, and the crossings alternate between two staggered sets of six around the ring, which gives the braided diamonds. History of the section: the first draft used 0.42 m tubes, a pano comparison took them to 0.34 m, and the independent review (photographs 1 and 6 show members of about 0.5-0.7 m, and 0.34 m tubes dissolve into haze beyond about 200 m) took them to 0.5 m near and 0.7 m far. Because the hoops stay 0.36 m and the 7.25 x 5.85 m outline is mapped and sourced, the strands' centre line sits inside the hoops' (`ringPoint(..., inset)`, inset = strand radius - hoop radius), so every tube's outer face still lies on the same ellipse; the hoops are unchanged. Six radial segments near (the section reads, smooth normals) pay for the fatter tubes: near steel went from 35.3 k to 32.3 k triangles.
- **Hoops** at every other crossing plane (21, the two end rings heavier and drawn inward so they keep the 5.85 m envelope). Strands end in the end rings; nothing floats.
- **Roof glazing** only where the architect puts it: the upper openings, from 30 to 150 degrees round the ring (the first draft glazed only the 53 to 127 degree crown, a thin strip against the photographs' glass all over the upper arch). The sides below the shoulders stay open, so the deck, rails and lower lattice read from outside. Each pane is half of a diamond, shrunk (to 0.78 near, 0.72 far, since the strands are fatter) so its long edge lies on the silver bar through the diamond and its other edges stop clear of the red strands; near panes are double skinned (3 cm either side) so they show from inside and out, far panes are single.
- **Deck** is a slab with the red girder below, the white lines of the segregated 2.5 m cycleway and a dashed centre line (near only), and a stainless rail with posts at each node plane. It sits 5 cm over `y = 0` so it never z-fights the provider's footway line; markings stand 4 cm proud and are sunk 2 cm into the slab.
- **Abutments** are 8 m concrete masses under the end 2.6 m of the deck and its landing, with low parapets either side. On the flat Cityscape map they are under the ground; in Full 3D world they show where the terrain falls away toward the river.
- **Footprint**: the mapped outline (way 1313657677), because the provider may extrude `building=bridge` as a box. The tubes' outer faces coincide with its 7.25 m width. The tube is 5.4 m longer than the outline (126 m sourced against 120.6 m mapped): the ends and the abutments lie outside the ring, over water and bank where the provider draws nothing to remove.
- **Far LOD** keeps all twelve strands (4-sided), all 21 hoops (20 samples), the glazed roof and silver bars, the deck, girder, rails and abutments; it drops the lane markings, posts and mid rail. 9 248 triangles against 35 234 near, identical bounds.

## Placement

**Cityscape: not tested yet, integration is checked separately.** Expected: the deck walks at the provider footway's grade (5 cm over it), so the lower half of the tube ring (down to 1.9 m under the deck) is under the flat ground and only the crown and upper half of the helix show over the river, as with every flat-map bridge. Nothing is below -2.9 m.

**Full 3D world: not tested yet, integration is checked separately.** `SPEC.terrainPad` replaces the default disc. The river channel is lower than both banks, and the disc takes the lowest DEM sample under it, so one disc over the span would flatten both banks down to the river (Alcatraz sank 23 m that way). The pad is instead two small rings, one per abutment landing (62 to 80 m from mid-span, 16 m wide, 18 m long: past the abutment face because the app draws terrain on a lattice of about 30 m), levelled to the median DEM of both rings with a 12 m feather; nothing else is flattened and no water is raised. The deck spans the valley between them. The lead is to verify against the bank and riverbed DEM: if the two banks differ by more than the 5 cm the deck can absorb in the abutments (they reach 2.9 m down), the terraces option can hold one landing at an offset. The rings' vertices are in `config.js`; the test pins one ring per bank, 62 to 82 m from mid-span, none over the span.

## Approximations, honestly

The ring section is an ellipse where the architect describes an oval of two tangential radii; the strand count (6 + 6), pitch and tube sizes are read from photographs, not drawings; the crown height over the deck and the under-deck depth are estimates that sum to the sourced 5.85 m; the 8 m overall width is not modelled (7.25 m, the mapped outline); the glazing is opaque in the app (the layer ignores transparency), so the roof reads as blue-grey panels instead of clear glass; the tapered, closed end hoods seen in the night photograph are not modelled (the end rings are simply heavier); the abutment shape is a plain block; the deck is flat at footway grade, while the real deck is several metres over the water. No lighting beyond the `glow` roof. No Tesla hardware measurement.

## Verification evidence

Screenshots read (ignored `tmp/calgary/shots/calgary-peace-bridge/`, 1280 x 800, procedural `r1`, `r2` and exported GLB `g1`, `g2`), each against the Commons photographs above:

- Procedural, near, light, contact sheet of overview, facade, roof, deck, end and detail (`r1`): the red lattice reads as the double helix; the glass was invisible (the first pale glass colour matched the viewer's sky) and the tubes were too fat against *Peace bridge pano*. Changed: tubes from 0.42 to 0.34 m, glass to a more saturated aqua, panes enlarged.
- Second pass (`r2`): from the deck against *Calgary Peace Bridge with Red Ball* and the pano (arches receding, glazed crown, rails, central dashed line: matches); plan view with the footprint ring (the bridge runs north-west to south-east on the outline's bearing); abutment, end-on, side and low views. Numeric alignment is pinned in the test (tube inside the ring's 7.25 m, centred on the origin).
- Exported GLB near light and dark, far light and dark (`g1`, `g2`: overview, facade, end, abutment, deck, detail): the roof glows warm white in the dark palette like the night photograph (*HDR photo*); the far lattice and glass survive. Changed after these: panes anchored on the silver bars (they had floated 2 cm short), lane markings made sunk boxes instead of floating quads, coplanar contacts removed (girder ends, parapet feet, post feet).
- Review pass (members too thin, crown glazing too narrow, `glow` white by day): strands 0.25 / 0.35 m with 6 / 4 sides, glazing widened to five diamond rows, `glow` `#8ba4b5`; exported GLB sheet `tmp/landmark-qa/sheets/calgary-peace-bridge.jpg` read against the Commons photographs: the lattice reads as heavier tubes, the grey panes show between them in the plan view, nothing leaves the envelope or goes below -2.9 m.
- Tests: `calgary-peace-bridge.test.js` raycasts and measures: the mapped ring (centred, 120.6 x 7.25 m), 130.6 m out to out, 126 m tube, 5.85 m depth, 6.2 m deck, cycleway lines 2.5 m apart, 12 strand cross-sections (6 turning each way, read from the tube vertices) in both LODs, the strand radius and radial segments (0.25 m / 6 near, 0.35 m / 4 far) and the hoop envelope, the glazed arc (diamond rows at 30 to 150 degrees, blue-grey day colour), hoop planes by ray, glazed crown with open sides, 2.5 m of headroom over the walking lanes, no pier and nothing below -2.9 m, the two terrain-pad rings, no triangle wound against its normals, far silhouette and cost.

## Cost

Near 35 234 triangles, 6 draws, 735 800 bytes; far 9 248 triangles, 5 draws, 196 156 bytes (uncompressed GLB, scene mesh draws). Budgets: 120 000 / 40 / 4.5 MB and 30 000 / 10 / 1.2 MB.
