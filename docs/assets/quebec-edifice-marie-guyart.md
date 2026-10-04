# Édifice Marie-Guyart (Québec)

Stable asset ID: `edifice-marie-guyart`. An original procedural model of the **Édifice Marie-Guyart ("Complexe G"), 675 boulevard René-Lévesque Est** (1037 rue De La Chevrotière): the 132 m office tower, Québec City's tallest building, and the low government complex it stands beside. Part of the [Québec landmarks](../quebec-landmarks.md); source in `src/peregrine/landmarks/quebec/edifice-marie-guyart/`.

## Identity and what a driver sees

Built 1967 to 1972 (Gauthier, Guité, Roy, Fiset et Deschamps; Édouard Fiset), brutalist, entirely concrete and clad in precast panels, with Vierendeel beams. Four blocks: the 31-level tower, and the Saint-Amable, Louis-Alexandre-Taschereau and René-Lévesque wings, three 4-level "basilaires" round a sunken court. The tower houses the Observatoire de la Capitale on its top floor. Modelled as it stands today; interiors, the court, the plaza and the skyways are not modelled.

At 800 m (far): a slender-looking pale slab with alternating light and dark horizontal bands, four paler corner piers that stand above the roof, a dark crown band under it and a thin mast, the low wings beside it. At 100 m (near): on every face a continuous dark ribbon of glass above a row of small square windows in protruding precast frames (10 bays on the 42 m faces, 12 on the 47 m faces) between wide, plain, windowless corner shafts that stand 1 m proud of the window frames, a glazed ground storey set back under the overhanging floors, and a dark glazed belvedere floor under the roof; on the roof a penthouse and a lattice mast with a thin whip to 177 m. Seen at a grazing angle the square windows become the narrow vertical slots of the oblique photographs.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 27372377](https://www.openstreetmap.org/way/27372377) | The tower outline (42 m by 47 m, 1 989 m² including its jogs), `height=132`, `building:levels=31`, `building:roof=flat`, architect |
| [OSM way 38947693](https://www.openstreetmap.org/way/38947693) and its nine `building:part` ways 1495832340 to 1495832348 | The outline of the low complex and its parts: three 4-level wings (south 138 m by 27 m, east, north) and six 5-level cores |
| [Wikipedia, Édifice Marie-Guyart](https://en.wikipedia.org/wiki/%C3%89difice_Marie-Guyart) | 33 storeys, 132 m, 1972, brutalist, tallest building in the city |
| [Wikipédia, Édifice Marie-Guyart](https://fr.wikipedia.org/wiki/%C3%89difice_Marie-Guyart) | Roof 132 m and spire 177 m, 33 floors, 12 elevators, 1967 to 1972 |
| [Répertoire du patrimoine culturel du Québec](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=170046&type=bien) | Cruciform tower plan, ground floor entirely glazed and set back from the upper storeys, Vierendeel beams expressed as window bands alternating with protruding precast panels on all four elevations, glazed belvedere at the top, wings of four storeys with two cantilevered storeys on the public sides and one on the court sides (steel panels below, concrete panels above), skyways at the angles |
| [Société québécoise des infrastructures](https://www.sqi.gouv.qc.ca/expertises/gestion-immobiliere/registre-des-immeubles-patrimoniaux/edifice-marie-guyart) | Four blocks, precast panels on concrete, bracing in the corners that holds the mechanical shafts, "fenêtres en bandeau et fenêtres carrées percées dans les panneaux" |
| [Observatoire de la Capitale](https://observatoire-capitale.com/en/) | The observation floor |

OSM geometry comes from the dossier extract in the ignored `tmp/quebec/edifice-marie-guyart/osm.json` (one query through the shared Overpass helper, 2026-10-04), © OpenStreetMap contributors, ODbL 1.0. Terrain: the public Terrarium DEM (zoom 15) read for measurement only; nothing is shipped.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/quebec/edifice-marie-guyart/refs/` to compare, never committed: "Édifice Marie-Guyart (Complexe G)" (Quintin Soloviev and Hayden Soloviev, CC BY 4.0), "Quebec-Marie-Guyart.JPG" (Gilbert Bochenek, public domain), "Québec - Édifice Marie-Guyart 20241030.jpg" (Pymouss, CC BY-SA 4.0, contact-sheet only), "Edifice Marie-Guyart 02.JPG" (Jeangagnon, CC BY-SA 3.0), "EdificeMarieGuyart.JPG" (Datch78, public domain). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` the plaza level at the foot of the tower. Origin `[-71.217564, 46.808054]`, the area centroid of the tower outline. The tower grid runs 60.74° east of north and the base grid 60.14° (length-weighted fits to the mapped edges; the two differ by half a degree, within OSM drawing accuracy, so each keeps its own). In each grid `u` runs along that bearing and `v` 90° clockwise of it (toward 150.7°, south-south-east). Both are baked into the geometry: the host must not rotate the model. The tower's entrance face looks north-north-west (330.7°) toward boulevard René-Lévesque. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Roof | 132 m | **Sourced**: OSM `height=132`, both Wikipedias |
| Mast tip | 177 m | **Sourced**: fr.wikipedia "flèche 177 m"; lattice height (22 m) and whip estimated |
| Levels | 31 (a 5.4 m ground storey and 30 floors) | **Sourced** count (OSM); the split is estimated |
| Plan | 42.0 m by 47.1 m, rectangle | **Mapped** (OSM: 42.1 m by 47.2 m); RPCQ calls it cruciform, the mapped envelope is a rectangle |
| Storey pitch | 4.16 m; crown band 1.8 m (5.4 + 30 × 4.16 = 130.2) | Estimated from the photographs (about 30 window rows) |
| Corner piers | 6.0 m wide (was 4.2 m, which read as thin edge strips), plain and windowless, on the mapped envelope and 1 m proud of the window frames, 1.5 m above the roof | Corner bracing and shafts are **sourced** (SQI); width and cap height estimated |
| Window grid | 1.6 m wide by 1.35 m high windows in 3.05 m bays; frames 0.6 m proud of the field, glass 0.15 m behind the field; ribbon 1.2 m high | Estimated from photographs |
| Ground storey | Glass set back 2.5 m, columns about every 7 m | Glazed and set back **sourced** (RPCQ); depth, columns estimated |
| Belvedere | Top floor: one band of glass 3.6 m high, mullions on the bay lines | **Sourced** (glazed belvedere); size estimated |
| Penthouse | 22 m by 14 m, 4.2 m high, with a louvre band | Estimated from the aerial photograph |
| Wings | 15.6 m (4.8 m ground storey, three of 3.6 m); upper two storeys cantilevered 1.5 m; plan 138 m by 27 m (south), 28 m by 64 m (east), 53 m by 18 m (north) | Plan and 4 levels **mapped**; heights and the 1.5 m cantilever estimated |
| Cores | Five levels, 19.2 m | Plan and 5 levels **mapped**; height estimated |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `concrete` | Precast panels, frames, corner piers, crown band, wing cantilevers, cores (a grey-taupe, linear about 0.30 / 0.27 / 0.22; it was a cream `#cdc6b5` / `#77746c`) | `#958e81` | `#555049` |
| `glass` | Ribbons, window rows, lobby, belvedere, ground-storey glazing | `#2c3742` | `#1a222b` |
| `glow` | Lit windows, unshaded: dark glass by day, warm light at night | `#2c3742` | `#ffcf86` |
| `roof` | Flat roofs, penthouse roof | `#8d8e8a` | `#4d4f50` |
| `metal` | Mast, steel panels of the wings' lower storeys | `#7a8085` | `#555b60` |

About a third of the windows and ribbons glow at night (a deterministic hash), the lobby 70 %, the belvedere 60 %; the wings' ribbons about a quarter.

## Modelling decisions

- **All four faces carry the same grid.** The first build gave the two 47 m faces a different grid of narrow slot windows between fins, from reading oblique photographs. The RPCQ and SQI descriptions say the four elevations alternate window bands with protruding precast panels, and the slots in the photographs are the square windows at a grazing angle, so the model was changed to one grid on all faces (11 bays on the 42 m faces, 13 on the 47 m faces; 10 and 12 once the corner shafts were widened to 6 m).
- **Layers instead of holes.** Each face is a concrete field (1.6 m behind the envelope) with glass 1.45 m behind the envelope and the frames 1 m behind it (the corner piers and the crown band stand on the envelope), built from merged quads: ribbon and window glass as continuous strips, frames as sill and lintel bars across the field plus a pier between windows with its two reveals, the soffit and top of each frame band. No glass pane has a hole in it, nothing coplanar overlaps (qa-metrics: 0 coplanar pairs, 0 % back faces), and the reveals give the depth the app's normal-based shading can show.
- **Set-back ground storey.** Dark glass 3.5 m behind the corner piers (2.5 m behind the window frames above), a header, the soffit under the overhang and columns; the corner piers run to the ground as the shafts do.
- **Belvedere and crown.** The top floor is one glazed band with slim mullions, under a 1.8 m crown band; the four corner piers rise 1.5 m above the roof deck, the penthouse and mast stand on it.
- **Base from the mapped parts.** Each wing and core is a flat-roofed box on its mapped rectangle (jogs under a metre merged); a wall exists only where nothing taller touches it. Wing walls have the cantilevered precast storeys with two ribbons, the soffit, and set-back steel and glass storeys with columns, closed with end caps where a wall ends against another volume. Cores are blank concrete with one band of louvres.
- **Far LOD.** Same plan, corner piers, crown band, lobby, belvedere, roofs, penthouse, mast legs and whip and base boxes, with a ribbon strip and a narrower window strip per floor (no frames or piers), lit bays in pairs, and per wing three ribbon strips and a ground strip: 1.5 k triangles, 5 draws.

## Approximations and gaps

- The RPCQ plan is "cruciform"; only the rectangular envelope is mapped, so the model is a rectangle whose 6 m corner shafts stand on the mapped envelope, with the windows set 1 m back between them. If the real corners step in, the silhouette from above differs by a few metres at the corners.
- Which face is which is not mapped: every face gets the same grid, but the real faces may differ in detail (door positions, mechanical louvres). Floor pitch, window size and proportions are read from oblique and low-angle photographs.
- The wings' cantilever is applied on every side; the sources give two cantilevered storeys on the public sides and one on the court sides. Wing heights and the position of the roof units are estimates.
- Not modelled: the plaza, stairs and pergola, the sunken court, the skyways, signage and flags, roof dishes and aviation lights, the Hector-Fabre building and other neighbours. The mast is a schematic lattice with a whip, its sections and antennas are not read.
- Concrete colour is a warm light grey between the photographs' sunlit and shaded tones; the app shades each face from its normal (0.66 to 1.0 of it).

## Costs and verification

```sh
pnpm build:quebec-landmarks edifice-marie-guyart --no-check
node --test src/peregrine/landmarks/quebec/quebec.test.js src/peregrine/landmarks/quebec/edifice-marie-guyart/edifice-marie-guyart.test.js
node scripts/asset-catalog.mjs
```

| Export | Bytes | Triangles | Draws |
| --- | ---: | ---: | ---: |
| `public/models/buildings/edifice-marie-guyart-near.glb` | 961 940 | 18 018 | 5 |
| `public/models/buildings/edifice-marie-guyart-far.glb` | 80 272 | 1 394 | 5 |

Both are far inside the building budgets (60 000 / 14 / 2.5 MB near, 12 000 / 8 / 500 KB far). `qa-metrics.mjs`: near and far OK, 0 coplanar overlapping pairs, 0 % back-face hits, minimum y 0, top 177 m. No Tesla timing was measured.

`edifice-marie-guyart.test.js` pins: roof deck at 132 m, mast tip at 177 m, nothing below grade; the crown band on the mapped envelope and the 42.0 m by 47.1 m widths by ray; on all four faces the glass 45 cm behind the frames, the concrete field 60 cm behind them, the frames 1 m behind the corner shafts and a window row of 10 (42 m faces) or 12 (47 m faces) alternating windows and piers; the 6 m plain corner shafts on the envelope; the ground storey glazed 3.5 m behind the corner shafts with them running to the ground; the corner piers 1.5 m over the roof and the field clear; the belvedere glass under the crown band; penthouse roof 4.2 m over the main roof, the mast legs and whip, near and far; wing roofs at 15.6 m and core roofs at 19.2 m round an open court; the wings' cantilever 1.5 m over the set-back storeys; every vertex within 1.2 m of a mapped ring; far bounds within 1.5 m of near; a lit-window share between 8 and 66 % of the glass area.

Screenshots looked at (`shot.mjs`, output in the ignored `tmp/quebec/shots/edifice-marie-guyart/it1` to `it4`):

- `it1` (eight views, procedural, near, light): silhouette, mast and base read at a glance. Changed because of it: the camera presets (the first ones were far from the building).
- `it2` (street, corner, overview, base, crown, approach, plan; near and far): compared with the photographs "Edifice Marie-Guyart 02", "EdificeMarieGuyart" and the entrance-side view. The 47 m faces carried narrow slots, which looked right against one photograph; the plan view confirmed both outlines sit inside the red OSM rings. Changed after reading the RPCQ and SQI descriptions: one grid on all four faces, a set-back glazed ground storey, a belvedere floor and the cantilevered wings.
- `it3` (street, corner, base, east after the rebuild): the grid now matches the oblique photographs on both visible faces; the wings read as stacked cantilevers.
- `it5` (exported GLB, near, light, from the south-south-east at street level, field of view 55°): compared with "Quebec-Marie-Guyart.JPG", where a blank pale block with a band of louvres stands in front of the tower beside a cantilevered wing: that block is the 5-level core at the west end of the long wing, and the model reproduces the arrangement (core, wing ribbons, tower behind), with the louvre band on the core's long faces.
- `it4` (exported GLBs: facade, corner, base, crown, entrance, court, river in near and light; approach and river in far and dark; approach and street in near and dark): identical to the procedural source in outline, colour and lit-window share. Far reads as the same slab with dark ribbon bands; at night the tower is a dark slab with scattered warm windows and a lit belvedere. Not compared: a true plaza-level photograph of the ground storey (it is hidden behind stairs and a pergola in the photographs), and any photograph of the rooftop plant beyond the two oblique aerials.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately.**
- Full 3D world (terrain): **not tested yet, integration is checked separately.** The Colline Parlementaire is nearly level under the buildings but not around them. The Terrarium DEM (zoom 15, 5 m samples inside the mapped rings) gives 89.8 to 91.2 m under the tower (median 90.0) and 87 to 93 m under the whole base (median 90.0, 10th to 90th percentile 89 to 92 m), while the ground falls to 82 m 110 m north of the tower and the lowest sample in a 130 m disc (needed to reach the far wing corners, 138 m out) is 79 m. The default disc takes the lowest sample, so it would sink the complex by about 11 m. `spec.terrainPad` therefore holds the tower outline and the base outline at the median DEM of the tower outline (about 90 m, local `y = 0`) with a 10 m feather. Expect in the app: the tower on level ground, the north wing up to 3 m of fill and the south end of the long wing up to 3 m of cut inside the base outline; the model is rigid and stays at `y = 0`. If the fill or cut is visible, the cure is a terrace ring for the wing concerned at an offset. This is an expectation from a coarse DEM, not a measurement in the app.
- Failed load, LOD switch and reanchoring are handled by the shared building layer and covered by its own tests, not re-tested here.
