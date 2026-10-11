# Basilique-cathédrale Notre-Dame de Québec

Asset `notre-dame-de-quebec`, 16 rue De Buade, Vieux-Québec. Original procedural model of the primatial cathedral of Canada as it stands in 2026: the
church rebuilt after the 1759 siege and again after the fire of 22 December 1922 (works finished 1930), behind Thomas Baillairgé's Neoclassical west front
of 1843-44. Only the mapped cathedral outline (OSM way 103862161 and its building parts) is replaced. The attached Séminaire, the Anglican Cathédrale
Sainte-Trinité, the Hôtel de Ville and the Place de l'Hôtel-de-Ville itself are neither drawn nor removed. Contract:
[3d-quebec-landmarks.md](../quebec-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs.

## Identity and what a driver sees

From the Place de l'Hôtel-de-Ville and rue De Buade (100 m) the cathedral is its **asymmetric west front**: a light grey stone screen with a pedimented
centre bay between two towers, the **south tower finished** with a tall octagonal louvred belfry, a flared dark cap and two stacked arcaded lanterns
under a cross, the **north tower stopped** under a low hipped roof (of Baillairgé's two planned towers only the north one was built, and without its spire because
the foundations were too weak; the belfry on the south tower is the older one, rebuilt by Jean Baillairgé about 1771 with its second lantern). Behind the
screen the **long nave** runs east under a steep copper-green roof, flanked by low dark aisle roofs and ending in a half-round apse and a cluster of
sacristy blocks. From 800 m the recognisable parts are the belfry and the long green roof. The model draws exactly that, plus the facade articulation
(pilasters, great blind arch, stained-glass window, portal, oculi, quoins) that makes the front read as Baillairgé's.

## Sources and dimension table

The plan, the nave axis and the part footprints come from the lead's dossier of OSM way 103862161 (`building=cathedral`, 3 levels, roof colour green)
and its `building:part` ways (shared Overpass helper, 2026-10-04). History and the one-finished-tower fact come from French Wikipedia (Baillairgé 1843-44:
"des deux tours prévues, seule la tour nord est construite, mais amputée de son clocher"; the clocher with its second lanternon rebuilt by Jean Baillairgé about 1771).
**No published height was found** (French, English and Italian Wikipedia and Wikidata carry none; the Répertoire du patrimoine culturel du Québec,
Parks Canada and the parish site could not be read by script). Every height below is therefore **estimated from photographs**: a pinhole camera was fitted to
the frontal photograph (Adam Bishop, below) using the mapped 27.7 m width of the west front and the north tower's width, the model was rendered with that camera and its
tower, belfry and cross heights were raised until they approached the photograph; the second photograph (Judicieux) cross-checked the order of the stages. The fit is weakly
constrained (the camera's distance, pitch and focal length trade off): rendered with the fitted camera, the final belfry still sits about 10 to 15 % lower in the image than in
the photograph (taken at face value the cross would be near 57 m), so 52.3 m is a compromise. Expect ±10 % (about ±5 m at the cross), and a little less for the facade.

| Item | Model | Basis |
| --- | --- | --- |
| Outline | 91 m east-west by 52 m north-south (church body 64 x 33 m, west front 27 m wide) | OSM, sourced |
| Nave axis | bearing 91.3 deg, baked in (`rotationDeg` 1.3) | OSM: nave roof part long edges 91.4 and 92.5 deg; west wall 1.3 deg off north; sourced |
| West front screen | 3.2 m in front of the towers, side bays 27.3 m overall; centre bay 12.6 m wide | OSM front block; bay split from photographs |
| Side bays, cornice | 8.6 m (cornice to 9.2) | estimated |
| Centre bay, entablature / pediment base / apex | 12.8 / 13.4 / 16.5 m | estimated |
| Attic, cross block, small cross tip | 20.2 / 24.6 / 28.3 m | estimated |
| North tower | 8.6 x 8.1 m, masonry 32.2 m, hipped roof apex 34.6 m (about 1:1.5 under the 52.3 m belfry cross; raised from 26.4 / 28.8 m after the street photograph, where the unfinished tower stands near 1:1.3 and part of that is perspective) | OSM part 396802387 (8.4 m square); heights estimated |
| South tower | 8.4 x 8.2 m square base to 14.6 m, octagonal shaft (7.8 m across flats) 14.6 to 27.0 m, flared cap to 30.7 m | OSM part 396940757; heights estimated |
| Belfry lanterns and cross | lantern 1 30.7 to 37.3 m (4.0 m across flats), dome to 40.5 m, lantern 2 to 44.3 m, dome to 47.0 m, **cross tip 52.3 m** | OSM dome part 396940758 for the lantern; heights estimated |
| Nave | 12.9 m wide, eaves 16.5 m, ridge 23.0 m (about 45 deg) | OSM part 396802386 (12.9 m); heights estimated |
| Aisles | outer walls 12.0 m, lean-to roofs rising to 15.0 m | OSM outline (9.7 and 10.4 m wide); heights estimated |
| Apse | half-round, radius 6.45 m, conch roof continuing the nave pitch | OSM part 396802386's rounded east end; sourced |
| East blocks | chevet shell 11 m, north-east chapel 12 m (hip to 16 m), south-east block 12.5 m (hip to 15.7 m) | OSM parts 396940760 and 396802487 (4 levels); heights estimated |

## Materials

Seven names, the same in `PALETTES.light` and `.dark`, plus the seam colour: `stone` (grey wall), `trim` (paler dressed stone: cornices, pilasters,
quoins, window surrounds), `copper` (verdigris green, darker and greyer than first drawn, about 0.7 of the first colour: linear 0.13 / 0.20 / 0.16, `#657d6f` by day and `#44584f` at night; nave, apse, chapel and chevet roofs), `seam` (darker standing seams and the ridge cap, `#587163` / `#35463d`),
`slate` (dark brown-grey: aisle roofs, tower hips, the belfry cap and lanterns, the south-east block), `glass` (dark windows), `glow` (the great
stained-glass window: bluish by day, lit warm at night, drawn unshaded), `metal` (crosses). The real facade is floodlit at night; only the
stained-glass window is self-lit here.

## Modelling decisions

* **West front first.** The screen is stone boxes with trim entablatures, a stone pediment with raking cornice and oculus, volutes stepping from the side bays
  to the centre bay, four pilasters, the great blind arch round the stained-glass window, the portal, tall arched windows with sills and keystones in each
  side bay, an attic and a small cross-bearing block. The centre bay is 12.6 m wide, wider than the 10.3 m gap between the tower bases, because the
  frontal photograph shows the pediment overlapping the towers; the volutes and the tower windows were moved to clear each other after the first render.
* **Towers.** North: quoined square masonry, string courses, three storeys of arched windows and an oculus on the west and north faces, a trim cornice, a low
  slate hip. South: square base under a low hip with a flat deck, an octagonal shaft built as a faceted prism (flat shading) with eight louvred arches
  (large on the cardinal faces, narrow on the diagonals), slender corner pilasters, a faceted lathe cap, two arcaded lanterns under faceted domes and a cross.
* **Nave and aisles.** The nave is a box under one closed gable solid with a half-cone continuing the roof round the apse (and a soffit ring so the eaves
  are closed from below); near adds 54 standing seams as flat quads 5 cm proud. Aisles are single closed solids (wall, end caps, lean-to roof): a few
  triangles each, with two storeys of arched windows between pilasters and a plinth and eaves cornice.
* **East end.** The outline's remaining parts (ambulatory under a flat slate roof, chevet shell and its polygonal apse, the north-east chapel, the
  south-east block and its small annex, the vestibule bump on the north flank) are simple blocks with hips and rectangular window rows, kept 0.4 m inside the
  mapped corners; they replace the provider extrusion of the same outline.
* **Rotation baked once** (1.3 deg) from the mapped nave axis; `rotationDeg` records it. Nothing is rotated by the layer.
* **Far LOD** (1.4 k triangles against 5.6 k) keeps every mass, both tower roofs, the belfry with its arcades, the pediment, the portal and the stained glass,
  and drops rings, sills, keystones, quoins, pilasters, seams, urns and the second row of aisle windows.

## Approximations and limits

* All heights, roof pitches, window sizes and rhythm and the facade proportions are read from photographs and a fitted pinhole camera, not surveyed.
* The east end is mapped only as rough OSM outlines and one or two photographs; the sacristy blocks are plain, their roofs and heights guessed from the
  storey counts (4 levels). The south-east block may be read by a local as part of the Séminaire; it is in the cathedral's mapped outline, so it is drawn.
* Not modelled: the parvis steps and the wrought-iron railings in front of the facade (outside the outline), statues, the stone coursing and carved
  ornament, the crypt, the Séminaire, the street. The stone trims, sills and cornices stay within 0.3 m of the mapped outline (measured on every vertex); nothing else leaves it.
* The nave roof is a dark grey-green verdigris (the cathedral's `roof:colour`); OSM tags the nave part itself dark brown, so a darker green could still be argued.

## Costs and verification

| | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| Near | 5 790 | 8 | 281 KB (287,976 bytes) |
| Far | 1 388 | 8 | 91 KB (92,888 bytes) |

The budgets are 60 k / 14 / 2.5 MB and 12 k / 8 / 500 KB. `qa-metrics.mjs`: 0 % back-face hits over 224 outside-in rays, nothing below grade, no coplanar
flags (the ground-level bottoms are dropped, and the plinth and entablatures end 0.2 m inside the screen's stone instead of on its back plane). `notre-dame-de-quebec.test.js` (14 tests, well under a second) pins the
belfry at the south tower axis and the north tower 17.7 m lower (1:1.5), the open belfry arches and lanterns, the stained-glass window, the open portal, the proud pediment and
pilaster by raycast, the nave ridge and aisle heights, the apse, the outline containment and the far silhouette.

Screenshots judged (all in ignored `tmp/quebec/shots/notre-dame-de-quebec/`): procedural near light `street`, `facade`, `overview`, `nw`, `top` (red outline rings), `tower`,
`nave`, `east`, `back`; **exported GLB** near light `roof`, `back`, `nave`, `east`; exported near dark `facade`, `overview`, `belfry`, `east`; exported far dark
`overview`, `facade`, `tower`, `back`; exported far light `distance` (330 m). Compared with Adam Bishop's frontal photograph and Judicieux's north-west view.
What changed because of them: the towers, belfry and cross were raised (belfry cross from 46 to 52 m, north tower apex from 26.6 to 28.8 m, then to 34.6 m in the quality pass with its windows, oculus and string course restaged), the octagon widened and the
lanterns slimmed after rendering the model through the fitted photo camera, the side-bay cornice lowered 0.4 m; the centre bay was widened from 10.3 to 12.6 m and the attic narrowed (the pediment spans about 13 m in the photograph), the volutes
shortened and the tower windows moved clear of them, a blind arch, quoins, sills, keystones and the octagon's corner pilasters were added, two outline bumps that the plan
view showed uncovered (the north vestibule and the chevet bump) were filled, and the chapel and chevet corners were pulled in after the outline test measured them 1.6 m out.

## Terrain notes (Full 3D world)

The public Terrarium DEM (zoom 15, bilinear, 2026-10-04) gives 44.3 to 49.5 m under the footprint (median 47.8 m): the Upper Town rises about 4 m from the facade's
north end to the south-east and falls slowly to the north (39 to 42 m at 90 m north of the cathedral, 54 m at 90 m south). There is **no cliff within 100 m**, so the
site is a gentle slope, not the Cap Diamant edge. The default 60 m disc would take its lowest sample (about 39 m) and sink the basilica about 8 m, so `spec.terrainPad` is
the outline held at its own median DEM with an 8 m feather: expect the north end of the front (about 3 m under the pad) on a short fill and the south-east end (about
2 m over it) cut, as on the levelled site it has in reality. No terrace is declared; if the app shows the north-west corner standing on a visible bulge, add a terrace
ring there. Cityscape ignores the pad. **Cityscape and Full 3D world: not tested yet, integration is checked separately.**

## References

* Wikipédia, [Basilique-cathédrale Notre-Dame de Québec](https://fr.wikipedia.org/wiki/Basilique-cath%C3%A9drale_Notre-Dame_de_Qu%C3%A9bec): history, Baillairgé's front, the tower.
* OSM [way 103862161](https://www.openstreetmap.org/way/103862161) and its building parts, © OpenStreetMap contributors, ODbL 1.0.
* Photos (Wikimedia Commons, compared only, never shipped): Adam Bishop, *Notre Dame de Quebec Cathedral Basilica* (CC BY-SA 4.0); Judicieux, *Basilique-cathédrale Notre-Dame de Québec, sept. 2016*
  (CC BY-SA 4.0); EgorovaSvetlana, *View from 15 Rue des Jardins* (CC BY-SA 4.0); Wilfredo Rafael Rodriguez Hernandez, *Intérieur … 45* (CC0, interior proportions only).
* DEM: Terrarium elevation tiles (zoom 15), measurement only.
