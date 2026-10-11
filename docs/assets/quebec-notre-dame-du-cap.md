# Basilique Notre-Dame-du-Cap

Asset `notre-dame-du-cap`, 626 rue Notre-Dame Est, Cap-de-la-Madeleine, Trois-Rivières. Original procedural model of Adrien Dufresne's national shrine (built 1955-64,
consecrated 1964), one of Canada's five national shrines, on the north bank of the St. Lawrence. Only the mapped basilica outline (OSM way 66794334) is replaced.
The Pavillon des visiteurs (way 66794339), the Maison Notre-Dame-du-Rosaire (way 66793187), the Accueil (way 1377055154) and the Petit Sanctuaire (the 1720 stone
church across the plaza) are neither drawn nor removed. Contract: [3d-quebec-landmarks.md](../quebec-landmarks.md). No scan, traced mesh, photograph or texture is in
the repository or the GLBs.

## Identity and what a driver sees

From the plaza (100 m) the basilica is a **wide light-grey stone portal**: a tower that tapers from 24 m at its foot to 10 m at its crown, cut by a **parabolic arch**
nearly as tall as the tower's two thirds, framing a pale tympanum with the 7.3 m statue of Mary above three wooden doors, reached by a broad stair; the crown is a
belfry stage of five louvred lancets under five pointed gablets. Behind it rises a **steep, dark verdigris-patched copper roof**: an octagonal pyramid with eight small
triangular glazed dormers, carrying a louvred lantern, a spire and a cross, 78.6 m above the plaza. Two **diagonal gables** with a rose and three mitre windows flank the
tower; two low **colonnaded galleries** (covered ramps) run out to a small pavilion with a green pyramidal roof at each end. From 800 m the recognisable parts are the
dark pyramid, the lantern and the cross over the pale portal. The architect's inspiration was Dom Bellot ("dombellotisme": geometric ornament, raw materials).
The plan is an octagon extended by four transept arms; a rectangular sacristy adjoins the choir at the back. The portal faces south-west (bearing 228 deg), toward the
Petit Sanctuaire; the river lies behind to the south-east.

## Sources and dimension table

The outline and its axis come from the lead's dossier of OSM way 66794334 (`building=church`, `basilica=minor`, capacity 1930, Wikidata Q2886971; shared Overpass helper,
2026-10-04). The facts come from French Wikipedia, the Répertoire du patrimoine culturel du Québec (RPCQ) and the sanctuary's own page (references below). No published
dimension other than the heights quoted was found, so the plan and every other size are **estimated** from the outline and four Commons photographs: the outline gives the
portal width (25.5 m), the 82 m length from portal to choir wall, the gallery positions and the 52-56 m width across the octagon, and the photographs (a frontal view and a
corner view from the portal's front-left) give the proportions between tower, arch, roofs, lantern and cross.

| Part | Value | Basis |
| --- | --- | --- |
| Height, ground to the cross | 78.6 m (258 ft) | **sourced** (French Wikipedia) |
| Height, floor to the dome inside | 38.1 m (125 ft) | sourced, not modelled (no interior) |
| Statue of Mary on the facade | 7.3 m (24 ft), by Paul Gingras | **sourced**; modelled 7.3 m, base at 11.9 m |
| Plan | octagon extended by four transept arms, pyramidal copper roof with a lantern | **sourced** (RPCQ) |
| Portal | monumental portal inscribed in a parabolic arch; transept gables with a rose and mitre windows | **sourced** (RPCQ) |
| Galleries | two covered ramps ending in edicules; rectangular sacristy beside the choir | **sourced** (RPCQ) |
| Axis | portal to choir along bearing 48 deg, portal facing 228 deg; baked into the GLB | mapped (OSM edges 48, 138, 228, 318 deg) |
| Origin | area centroid of the outline, -72.4971941, 46.3682209; octagon centre 1.1 m east, 0.8 m north of it | mapped |
| Octagon | apothem 26.5 m (53 m across the flats), walls to 19.5 m | estimated from the outline (diagonal gable lines) and photographs |
| Roof | pyramid from the 19.5 m eaves to 58 m, 59 deg pitch; belt course at 38.2 m; eight dormers 4.6 m wide at 41.3 m | estimated from photographs |
| Diagonal gables (4) | 15 m wide, apex 29 m, rose 5.8 m across centred at 15.9 m, three mitre windows | estimated from photographs |
| Side and choir faces | plain walls with three tall stained-glass lancets each | estimated (photographs show no gable there) |
| Portal tower | 24 m wide at the foot, 10.4 m at the 36 m crown; front plane 40 m from the octagon centre | outline width 25.5 m; heights estimated |
| Arch | 16 m wide at the springing, apex 24.5 m, framed band 1.5 m wide, tympanum set back 3.2 m | estimated from photographs |
| Doors | central pointed 3.1 m x 6.0 m under a frame, two 1.8 m x 4.7 m, tall statue pillars between | estimated |
| Stair | 17 m wide, 12 steps to the portal floor at 2.2 m | estimated |
| Belfry stage | five louvred lancets at 30.4-32.4 m, slit windows at 26-28 m, five crown gablets to 38.3 m | estimated |
| Lantern, spire, cross | lantern 58 to 64.6 m (8 m across), spire to 73.2 m, cross to 78.6 m (5.4 m) | cross top sourced, rest estimated |
| Galleries | 6 m deep, glazed back wall, 7 columns each, flat copper roof at 5.3 m, floor at 0.6 m | estimated |
| Pavilions | 9.5 m x 9 m, walls to 7 m, pyramidal roof to 14.6 m, pointed door | estimated |
| Choir and sacristy | 31 m x 15.5 m, 11 m high, flat roof | outline for the plan; height estimated |

## Materials

Twelve named materials, the same keys in the light and the dark palette: `stone` and `stoneDark` (light warm grey; trims, joints and cornices), `plaster` (the pale
tympanum and the gallery entablature), `copper` and `copperDark` (verdigris and the dark slate-green of the roof, in streaks; the light tone is `#5f8279` by day, about 20 % darker than the first pastel mint), `copperMid` (far only: the area-weighted mean of the two near tones, `#4a655e` by day and `#364a44` at night), `glow` (the stained glass: a day blue, a lit
amber at night, drawn unshaded), `wood` (doors), `dark` (louvres, slits, doorways), `glass` (the glazed gallery wall and the sacristy windows), `roofFlat` (gallery and
sacristy roofs) and `metal` (the cross). Far merges `stoneDark` into `stone`, `wood` and `glass` into `dark` and `roofFlat` into `copperDark` and paints the pyramid in `copperMid`: eight draws.

## Modelling decisions

* **Everything is authored in the building frame** (x to the viewer's right in front of the portal, z toward the portal, origin on the octagon's axis) and turned by -48 deg onto
  the mapped outline when added, so the rotation is baked once; the octagon is a regular prism whose faces are the eight "facets", each rotated a multiple of 45 deg.
* **The roof is eight faces of patch rows**: 30 rows by 10 columns per face near, merged where neighbouring patches share a colour. The value noise is stretched about 5:1 down the fall line (and the occasional flips are whole six-row runs), so the patches are streaks that follow the slope and converge on the lantern, not square cells (a test measures it: 0.71 of sample pairs 3 m apart agree along the fall line against 0.54 across it). Far paints each face as one `copperMid` polygon, the near mean, so the roof does not change tone at the level-of-detail swap (the first far roof was mostly near-black with light ribs). Gable and dormer roofs are tetrahedra that sit on a face (their fourth side is the roof itself), which costs three triangles each.
* **The portal tower is one extrusion** of a tapering trapezoid with the parabolic arch cut through it (depth 25 m, the back cap dropped); the tympanum is a separate plaster
  face 3.2 m back, so the arch has real jambs, a floor and a visible recess; doors, frame, pillars, the statue (a lathe), the arch band and the ashlar courses sit on those
  planes at 0.07-0.15 m; no two surfaces share a plane.
* **Windows are flat polygons** a little proud of the wall (lancets with an unequal-arch outline, roses as a disc, a stone ring and four spokes), never boxes.
* **Negative space kept in far**: the arch recess, the open colonnades over the glazed wall, the pavilions and the gap between galleries and octagon.
* **Which faces carry gables** follows the photographs and RPCQ ("pignons des bras de transept: une rosace et des fenêtres en mitre"): the four diagonal faces. The side
  faces and the choir face are plain walls under the roof, with tall stained-glass windows (the user's brief: windows "in the walls under the roof").
* Left-right symmetry is assumed for the tower, galleries and pavilions (the photographs show it); the mapped outline draws the left gallery thinner and a skewed pavilion.

## Approximations and limits

Heights other than the cross are read from photographs (about 10 %, 3-4 m on the roof). The tower's depth behind the arch, the back of the building and the sacristy are inferred
from the outline. Not modelled: the interior, ornament and lettering (the studs on the tympanum, the statues in the pillars' niches, the halo), stair railings, stone coursing on
the octagon walls, the louvre slats, the roof's individual scales, the bells, the lamps and the plaza. The model is a visual approximation, not a survey. The symmetric galleries
and pavilions stand up to 3.8 m outside the mapped outline on the left (the stair 4.7 m outside at the front); there is no other provider geometry there to remove or fight.

## Costs and verification

| | triangles | draws | KB |
| --- | --- | --- | --- |
| near | 4 389 | 11 | 195 |
| far | 1 074 | 8 | 63 |

Budgets: building near <= 60 000 / 14 / 2.5 MB, far <= 12 000 / 8 / 500 KB. `qa-metrics.mjs`: no coplanar overlaps, 0 % back-face hits on 183 outside-in rays, nothing
below grade, far bounds equal to near.

Screenshots judged (ignored `tmp/quebec/shots/notre-dame-du-cap/`): procedural near light `overview`, `facade`, `portal`, `roof`, `top`, `back`, `transept`, `gallery`, `corner`,
`lantern`, and a plan with the red outline; **exported GLB** near light `facade`, `corner`, `roof`, `lantern`, `overview`, `transept`; near dark `facade`, `corner`, `roof`, `back`;
far dark `facade`, `corner`, `overview`, `back`; far light `overview`, `facade`, `gallery`, `roof`. Compared with the frontal photograph (Saffron Blaze, `Madeline Du Cap`),
the corner view of the portal and roof (Saffron Blaze, `Basilique Notre-Dame du Cap`) and the aerial (Inphasis). What changed because of them: the first rendering already read as the basilica; the
roof was too pale and too regular, so the patches became horizontal blotches on a darker base; the corner photograph showed a belt course and eight triangular dormers (added), a much
deeper arch recess (1.8 to 3.2 m), taller statue pillars (7.2 to 8.6 m), a wider lantern (7.2 to 8 m) with a slimmer spire, gables narrower (17 to 15 m) and lower (30 to 29 m), and five
crown gablets over the five louvres; the side facets show a plain roof plane beside the rose gable, so the side and choir gables were removed; the plan view put the model on the red
outline, with the stair and the left gallery standing outside it.

Review fix (regions batch): the roof patches were axis-aligned square cells ("digital camouflage"), the far roof was near-black against a mid-light near roof, and the light patches were about 20 % too pale. They are now fall-line streaks, a one-colour far roof at the near mean, and a darker turquoise-grey light tone. Near was 4 087 / 11 / 198 KB and far 1 106 / 7 / 63 KB before it. Checked on the `qa-sheet.mjs` contact sheet.

Tests (`notre-dame-du-cap.test.js`, 11 tests, about 0.5 s): cross at 78.6 m, grade, far envelope; octagon walls at the apothem on four faces; the tower's taper, the arch open to the
tympanum and closed above 24.5 m, the doors, the statue's extent, the crown; stair rise; roof height by ray at three points, lantern, spire, cross; roses and dormer glass;
colonnade open between columns and a flat roof at 5.3 m; the pavilion apex; the choir block; outline containment (95 % of the vertices above 6 m inside, 4 m worst overhang, 5 m
anywhere); the roof streaks follow the fall line, the far roof is `copperMid` between the two near tones and at their area-weighted mean, and the light copper is darker than the first version. The tests also caught a NaN in the first outline check (the ring's closing vertex repeats the first) and, with the metrics script, a coplanar plinth cap and degenerate lathe
triangles, all fixed.

## Terrain notes (Full 3D world)

The public Terrarium DEM (zoom 15, bilinear, 2026-10-04) is a levelled terrace: 10.1 to 12.2 m under the outline (median 11.0 m, 10th to 90th percentile 10.9 to 11.2 m), 9.8 m at the
lowest in a 62 m disc around the origin, and it falls towards the river only 60 to 90 m to the south-east (to 6-7 m at 90 m). The default disc would take its lowest sample and sink the
basilica about 1.2 m, so `spec.terrainPad` is the outline held at its own median DEM with an 8 m feather: expect a very small cut and fill (the median is within about 0.3 m of the
ground under the portal). No cliff, no terrace needed. Cityscape ignores the pad. **Cityscape and Full 3D world: not tested yet, integration is checked separately.**

## References

* Wikipédia, [Basilique Notre-Dame-du-Cap](https://fr.wikipedia.org/wiki/Basilique_Notre-Dame-du-Cap): 258 pieds à la croix, 125 pieds sous le dôme, statue de 24 pieds, 1954-1965.
* Répertoire du patrimoine culturel du Québec, [Basilique Notre-Dame-du-Cap](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=156291&type=bien): plan octogonal, quatre bras de transept, portail dans un arc parabolique, rampes terminées par des édicules, sacristie rectangulaire.
* Sanctuaire Notre-Dame-du-Cap, [La basilique](https://www.sanctuaire-ndc.ca/decouvre/decouvre-la-basilique/): statue de 7,3 m de Paul Gingras, vitraux du père Jan Tillemans.
* OSM [way 66794334](https://www.openstreetmap.org/way/66794334), © OpenStreetMap contributors, ODbL 1.0.
* Photos (Wikimedia Commons, compared only, never shipped): Saffron Blaze, *Madeline Du Cap* and *Basilique Notre-Dame du Cap* (CC BY-SA 3.0); Inphasis, *Notre-Dame-du-Cap Basilica @ Trois-Rivières, Quebec* (CC BY-SA 4.0);
  Tango7174, *TroisRivieres NDduCap1* (CC BY-SA 4.0).
* DEM: Terrarium elevation tiles (zoom 15), measurement only.
