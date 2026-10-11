# Rijksmuseum

Cuypers' museum building on Museumstraat, Amsterdam, as it stands: the 1885 brick front with the passage through it, the two north spires, and the Museumplein elevation after the 2013 courtyards were glazed. Cityscape placement and Full 3D world are not tested yet; integration is checked separately. The site is flat, so there is no terrain pad (`padM` 100 m covers the outline).

## Sources

The dossier's contact sheet is paintings from the collection. Massing comes from the OpenStreetMap outline (way 431070185) and its `building:part` ways, the 3DBAG heights on those parts, and two exterior photographs: Derbrauni, *North facade of the Rijksmuseum Amsterdam 01* (CC BY 4.0), and C messier, *Rijksmuseum 2022* (CC BY-SA 4.0). The 1885 figures are from [nl.wikipedia.org/wiki/Rijksmuseumgebouw](https://nl.wikipedia.org/wiki/Rijksmuseumgebouw): greatest length 135.54 m, greatest width 33.64 m, towers 52.90 m, opened 13 July 1885, designed by P. J. H. Cuypers from 1876, with a passage through the middle wing and two courtyards. That 33.64 m is the central range, not the depth of the whole footprint.

## Dimensions

| Measure | Model | Source | Status |
| --- | --- | --- | --- |
| Origin | 4.8851455, 52.3600098 | Centroid of way 431070185 | mapped |
| Frontage | 39.32° | Bearing of the two north-tower centroids (ways 749429998, 749429999), 30.84 m apart | mapped |
| Length along the street | about 137 m | 135.54 m at delivery, 1885 | modelled to the footprint, a few metres longer than the 1885 figure |
| North towers | 54 m, wall at 34 m | 3DBAG `height` 54 and `roof:height` 20; 1885 figure 52.90 m | tagged height, not the 1885 figure |
| Gallery ridges | 27 m, eaves at 19 m | tagged `height` 27, `roof:height` 8 | tagged |
| Corner pavilions | 38 m | tagged | tagged |
| South turrets | 43 m | tagged | tagged |
| Passage arch | 10.2 m wide, spring 1.15 m, crown 6.25 m | none published; about half the bay in the photographs | estimated |
| Courtyard glass | peak about 22.4 m | 2013 atria; no published ridge | estimated, kept under the 27 m slate |
| Asian pavilion | 7 m, inscribed in way 517791046 | tagged height; the ring is not a rectangle | height tagged, plan inset |

## Materials

`brick` #8a4a3a by day and #4f2a22 at night, `stone` #efe4d2, `plinth` #8e8a82, `slate` #3c4450, `glass` #4a5560 by day and #8ea0ae at night (a faint cool tone on the roof panes), `light` #3c342c by day and #ffc27a at night (unshaded), `metal` #d9c48a for the near needles, `clock` #14161a, `white` #f3f0e8 for the Asian pavilion. Stone stays pale. Far drops `metal` (the needle is slate) and keeps the clock dials, so the far model is 8 draws.

## Modelling

The mesh is authored in building axes, +u from the west tower toward the east tower and +v toward Museumplein, then baked into east/up/south. Grade is y = 0. The passage is a gap about half the central bay, ringed by a stone archivolt, so a ray at street level misses from Stadhouderskade through to Museumplein. Above the north arch, a tall arched window with mullions sits under a crow-stepped gable. The Museumplein front does not repeat that gable: the arch sits under a horizontal arcade, and a continuous slate roof runs to a rectangular glass lantern on the ridge. The long Museumplein slopes carry segmented blue-grey glass with slate mullions. Each north tower has a clock dial, stone bands and an upper arched row; the spire is a hip, a lantern, corner pinnacles and a slender needle, the same outline on both LODs. Ledges are buried about 8 cm into the wall. Dormers and the lantern cresting posts are near only.

## Approximations

The arch width and springing are judged from the photographs, not from a measured drawing: half the bay, not the full gap between the towers. The north window is a simplified tracery pattern (mullions, a transom, an oculus), not the full Cuypers stonework. The south arcade is a row of arches, not the carved window band. Each spire is a hip, a lantern, four pinnacles and a needle; near adds cresting posts, not the iron filigree. One stone finial stands in for the north gable sculpture. The 17 m part tagged on the passage axis is a split plinth 1.35 m high, because a wall there would close the arch the photograph shows open. Neighbours outside the outline (Teekenschool, the villa, the entrance building) are not in the model or the footprint list.

## Cost

| LOD | Triangles | Draws | GLB |
| --- | --- | --- | --- |
| near | 4295 | 9 | 235 KB |
| far | 2622 | 8 | 146 KB |

Budgets are 60 000 / 14 / 2.5 MB near and 12 000 / 8 / 500 KB far.

## Verification

Looked at `tmp/top-cities/shots/rijksmuseum/` against the two photographs. The first sheet showed a plinth across the arch and a stone slab filling the opening; the plinth was split at the jambs and the soffit was cut down to a ceiling. A review then found the opening filling the whole bay, a blank gable, no Museumplein roof glass, and far spires as plain pyramids. The opening is now half the bay with a continuous stone ring, and the north gable has the arched window and crow steps. A second review found the Museumplein gable was invented, the towers lacked clocks, the roof glass read white, and the brick was too red. The south front is now the arcade and continuous slate roof with a rectangular lantern, the towers carry dials and the stepped spire on both LODs, the glass is blue-grey, and the brick is the deeper brown-red. The Asian pavilion's box was outside its ring and was inscribed in way 517791046. `node --test` on `top-cities.test.js` and `rijksmuseum.test.js`, and `node scripts/asset-catalog.mjs`. Cityscape and Full 3D world were not opened.
