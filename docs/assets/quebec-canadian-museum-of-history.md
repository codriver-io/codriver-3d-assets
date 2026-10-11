# Canadian Museum of History (Gatineau)

`canadian-museum-of-history` · Douglas Cardinal, opened 1989 (as the Canadian Museum of Civilization) · 100 rue Laurier, Gatineau, on the Ottawa River facing Parliament Hill. Part of the [Québec landmarks](../quebec-landmarks.md); source in `src/peregrine/landmarks/quebec/canadian-museum-of-history/`.

## Identity and state modelled

The museum as it stands today, both wings, nothing else:

- the **public wing** (south, OSM way 68588595): the glass-fronted Grand Hall behind a colonnade of flared stone piers on its curved river front, under a thick, layered, wave-like stone cornice; verdigris copper domes (a long dome over the hall, the north rotunda, the 27 m west dome on its stone drum) and copper-roofed strips along the south-west side; lower stone lobes with ribbon windows to the west and south-west;
- the **curatorial wing** (north, way 68588601): a long, curving cascade of four stepped stone terraces (4.5, 8, 11.5 and 15 m) with a projecting lip on each, a low curved link at its south-east end, and a copper roof on the top terrace.

Buff Tyndall-type limestone and verdigris copper throughout. Recognisable at 800 m by the two pale, banded masses with green domes and the long curved colonnade; at 100 m by the flared piers in front of the lit glass hall and the layered cornice. The landscaping, the river wall, the plaza, the sculptures and the interior are not modelled.

## Sources

| Source | Used for |
| --- | --- |
| OSM way 68588595 (`building=public`, `height=27`, `building:levels=5`, `building:material=stone`) | public-wing outline and the 27 m overall height |
| OSM way 68588601 (`building=public`, `building:levels=5`, `roof:colour=grey`) | curatorial-wing outline |
| OSM building:parts 1043614694-98, 1043614700-07, 1043614710-13 (heights, `min_height`, `roof:shape`, `roof:height`) | how each wing is tiled into blocks: Grand Hall slab (704, 14 m), west drum (705, 18 m), domes (706 to 27 m, 698 14-20 m, 694 to 19 m), copper strips (697 to 15 m, 696 4-10 m), lobes (699, 700, 701, 702, 703, 707), curatorial terraces (713, 712, 711, 710). The glazed ring part 1043614709 (`building:material=glass`, `height=10`) gives the 10 m glazed ground floor |
| Wikipedia, Canadian Museum of History | Douglas Cardinal, opened 1989, 75,000 m2, about 30,000 m2 of Tyndall stone, copper roof of about 11,000 m2, cantilevered northern curatorial wing and southern public wing, glass-fronted Grand Hall |
| Wikimedia Commons photographs (see the catalog provenance), compared and not redistributed | colonnade proportions, cornice, domes and skirts, the entrance front, colours |
| Public DEM sample (Open-Meteo / Copernicus 90 m) | the terrain notes only: the site is not flat |

## Dimensions

| Dimension | Value | Basis |
| --- | --- | --- |
| Public wing outline | about 170 x 155 m, 16,430 m2 | sourced: OSM way |
| Curatorial wing outline | about 190 m long, 8,792 m2 | sourced: OSM way |
| Overall height | 27 m (crown of the west dome) | sourced: OSM `height=27`, the dome part's top |
| Grand Hall: glazed ground floor / cornice / roof | 0-10 m / 10-14 m / 14 m | sourced: OSM glass ring (10 m) and slab (`min_height=10`, `height=14`); the 4 m cornice is read as one 4 m band |
| West dome | drum 0-18 m, skirt 1.2 m, cap to 27 m; about 33 x 43 m | sourced: OSM parts 705 and 706 (the skirt/cap split is estimated) |
| Long dome | footprint about 27 x 105 m, 14 to 20 m: the stated 6 m rise as two overlapping ellipsoid lobes, crowns at 20 m, saddle about 18 m between them | sourced: OSM part 698 (`roof:shape=round`, `roof:height=6`); the 0.3 m skirt (its foot sunk 0.4 m into the roof deck, so no rim shows), the split into two lobes and their overlap estimated |
| North rotunda | stone drum 14 m, dome to 19 m | sourced: OSM part 694 |
| Copper strips (south-west side) | walls 14 m + 1 m roof; walls 9 m on a 4 m plinth + 1 m roof | sourced: OSM parts 697 and 696 |
| Curatorial terraces | 4.5, 8, 11.5, 15 m (walls 14 m + 1 m roof at the top) | sourced: OSM parts 713, 712, 711, 710 |
| Colonnade | about 25 piers at 6.4 m, flared from 2.0 m wide at the foot (1.7 m at the shaft) to 2.8 m at the cap, standing 0.3-0.5 m inside the outline; glass wall 2.3 m behind them | estimated from photographs (OSM has the arc, not the piers); the review asked for the foot width doubled from 1.0 m |
| Cornice | three bands (1.3 m each) whose projection drifts 0.3-1.1 m behind the outline over 17-31 m; the bands alternate about +-8 % in lightness (dark, light, mid; light, dark, mid on every other block) | estimated; the stone courses are 2.1 m |
| North glazed front | glass wall 2.3 m behind plain piers every 9.5 m | estimated |
| Copper roof area | about 12,000 m2 in plan (domes, strips and the top terrace) | cross-check: Wikipedia gives nearly 11,000 m2 |

## Materials

Nine names, same keys in light and dark: `stone`, `stoneLight` (piers, a light cornice band), `stoneDark` (courses, a dark cornice band), `roof` (flat grey roofs and the floors of stepped-in walls), `copper` (dome caps, strip roofs, top terrace: a dark patinated olive-green, `#495f4a` by day and `#2f4533` at night, about 35 % darker than the first pale-mint version), `copperDark` (dome skirts, `#344c38`), `glass` (ribbon windows), `glow` (the Grand Hall's glazing: a dark blue-grey glass by day, a warm lit hall at night, drawn unshaded), `frame` (mullions and transoms). Far folds `stoneLight`, `stoneDark`, `copperDark`, `glass` and `frame` into their neighbours: four draws.

## Modelling decisions

- **The plan is the mapped outline.** Nothing is rotated: every block is the OSM part polygon in real metres east/south of the origin (the area-weighted centroid of the two wings), so the orientation on the footprint is exact. The model stays inside the two mapped rings (checked by test, 0.8 m slack).
- **Blocks, exposed walls only.** Each OSM part is a block with a base, a top and a roof. A wall is drawn only where it stands above whatever is against it (a probe 0.9 m outside each edge asks the other blocks how high they are), so shared walls between neighbouring blocks never exist twice and nothing is coplanar.
- **Layered, wave-like bands.** Outer walls are courses of buff stone (2.1 m, two tones) under a cornice of three stacked bands on the tall blocks (a single projecting lip on the low terraces), each band's projection a sine of a different wavelength and the bands alternating about +-8 % in lightness (dark, light, mid on one block, light, dark, mid on the next), so the bands drift against each other along the curved outline. Waves are periodic over the outline so no seam cracks. A station facade steps in behind the outline only where both its intervals are exposed from the same height; everywhere else it tapers back to the mapped line, which closes the joints between blocks (the first version had 1 m slits where a tall block met a low one), and a wall that stands on a lower neighbour gets a floor strip.
- **The Grand Hall front.** Along the mapped NE arc the ground floor is a recessed glass wall (`glow`) with a mullion every 2.1 m and two transoms, in front of flared stone piers; the cornice rests on them over a soffit. The piers have no back face (the glass wall closes them) and a cap at their top. The north front uses the same system with plain piers. The ends of each run are closed by a stone face.
- **Domes.** A short vertical skirt (`copperDark`), then an ellipsoidal cap made by scaling the mapped footprint about its centroid, smooth-shaded. The long dome takes the stated 6 m rise (14 to 20 m) from the roof deck at once: its skirt is 0.3 m and its foot is sunk 0.4 m into the deck so no stone or dark rim shows, and the cap is two ellipsoid lobes (the footprint cut along its principal axis into two overlapping pieces, each scaled about its own centroid), crowning at 20 m with a saddle about 2 m lower between them, as the real two-lobed profile reads from the street. Strip roofs are a flat copper deck behind a 1.4 m chamfer rising 1 m.
- **Curatorial cascade.** The four nested OSM polygons are four stacked blocks, each with its lip; the top terrace is copper.
- **Far**: same outline (decimated at 0.7 m), no courses, one cornice band, no mullions or windows, piers kept (they are the negative space of the front), domes at 4 steps instead of 8.

## Approximations and what is missing

Stone is a flat tone: no rough-dressed Tyndall texture, no fossil pattern. The piers are flared prisms, not the sculpted, tapering blades of the real colonnade; the colonnade ends where OSM's slab ends, and the glass wall is a straight-faceted inset, not the real curved curtain wall. The long dome's two lobes are plain ellipsoid caps meeting in a saddle; the real roof has a more pronounced drum and lobe profile. The north entrance front is the same colonnade system, not the real cantilevered waves of stone over the entrance. The curatorial wing's copper roof is an estimate (OSM gives only a grey roof colour for that way). Every ribbon window on stone is an estimate; the real masonry is mostly blank. Not modelled: the tall stone shaft beside the west dome, the plaza and riverfront landscaping, sculptures, the Alexandra Bridge, signage and lettering. Night: only the Grand Hall glows; the real building is also floodlit.

## Cost

Near 18,249 triangles, 9 draws, 1,090 KB (was 18,159 / 9 / 1,088). Far 3,737 triangles, 4 draws, 225 KB (was 3,695 / 4 / 224) (budgets: 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Far is about a fifth of near in triangles; its bounding box matches near to within 0.5 m on every axis. `qa-metrics.mjs`: no issues, 0 coplanar overlaps, 0 % back-face hits.

## Verification evidence

Looked at, procedural source and the exported GLBs (`tmp/quebec/shots/canadian-museum-of-history/`, v1-v5 and glb1-glb2): plan view with the red OSM rings; overview, river facade, roof, entrance, rear, curatorial, colonnade detail, south-west and 1.7 m street views in near/light; the same in near/dark; far/light and far/dark overview and facade; the exported GLB near/far in light and dark; an 800 m view (fov 20) of the far GLB; the south-east nose and the curatorial top terrace from above. Compared against Rick Ligthelm's view of the river front, Wladyslaw's dusk views of the colonnade and the entrance front.

What the renders changed:

1. The first sheet read as the museum (piers, glass, domes, cascade) but the joints between lobes showed 1 m vertical slits and the cornice was faceted at 4 m: facade stepping now tapers to the outline at every block joint, a floor strip closes walls that stand on a lower neighbour, wall normals are smooth along the outline and stations are 3 m.
2. The wave read as flat: amplitudes raised (bands now drift 0.3-1.1 m behind the outline) and the body of the cornice stepped in 1.1 m.
3. The piers' open tops showed from above: caps added 5 cm under the soffit.
4. Flat roofs read nearly white in sun and the night stone was dull olive: `roof` greyed, dark stone lifted (the night photographs show floodlit cream stone).
5. The top terrace's copper roof stood at 16 m (15 m + a 1 m chamfer): walls cut to 14 m so the roof crowns at the mapped 15 m.

Review fix (regions batch): the copper was a pale mint plate and is now a dark patinated olive-green; the long dome read as a flat tray inside a stone rim and now rises the stated 6 m as two lobes from a sunk rim; the colonnade piers read as thin mullions and now have twice the foot width; the cornice bands alternate in lightness. Checked on the `qa-sheet.mjs` contact sheet (near and far, the reference photograph beside them).

`quebec.test.js` and `canadian-museum-of-history.test.js` pin: the 27 m crown and no part below grade; far envelope and budgets; every vertex inside the two mapped rings; 20 to 30 piers along the mapped arc with the lit glass wall 1.4-3.1 m behind the outline; the west and rotunda dome crowns at 27 and 19 m and the long dome as two copper crowns at 20 m with a saddle of 17 to 19.4 m between them, in both LODs; piers about 2 m wide at the foot; the cornice bands dark, light, mid; terrace decks at 4.5, 8, 11.5 and the copper roof at 15 m; the hall deck at 14 m; the cornice bands at different depths; near has three stone tones and far folds them; palette keys; no NaN.

## Terrain (Full 3D world) and integration

The site slopes to the Ottawa River and the two wings stand 80-200 m apart. The public DEM (Copernicus 90 m via Open-Meteo, a surface model that includes buildings and trees, so only indicative) reads 52 m at the river, 53-56 m on the public wing's north and west sides, 59-62 m at its south-east nose and 55-59 m under the curatorial wing: a spread of about 9 m across the 380 m, well over the 2 m threshold. The default 200 m disc would take the lowest sample and sink both wings, so `spec.terrainPad` holds both mapped outlines at the median DEM of their own vertices with a 14 m feather and lets the river bank fall away. Both wings share one datum; if the lead finds in the running app that the curatorial wing's ground sits several metres off the public wing's, give the curatorial ring its own terrace offset.

Cityscape (flat ground reference): not tested yet; integration is checked separately. Full 3D world (topography): not tested yet; expected: both wings flat at the median ground, the river bank outside the 14 m feathers untouched. The models are rigid on local `y = 0` (the perimeter level); no relief is baked in.
