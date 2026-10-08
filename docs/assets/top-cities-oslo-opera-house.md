# Oslo Opera House — Operahuset

Original procedural exterior of **Operahuset** at Kirsten Flagstads plass 1, Bjørvika, Oslo. Snøhetta, opened 12 April 2008. This is the white marble house that rises out of the fjord so people walk up onto the roof, not the earlier opera venues and not the oak interior. Asset ID `oslo-opera-house`.

## Sources and rights

Consulted 2026-10-08:

- [Wikipedia — Oslo Opera House](https://en.wikipedia.org/wiki/Oslo_Opera_House): Snøhetta, 2008, Carrara marble and white granite, glass foyer, white aluminium fly tower with a Løvaas & Wagle relief, lobby glazing about 15 m tall.
- [Store norske leksikon — Operahuset i Bjørvika](https://snl.no/Operahuset_i_Bj%C3%B8rvika) and [Den Norske Opera & Ballett](https://www.operaen.no/): identity and address.
- [NTNU / Statsbygg project paper](https://www.ntnu.edu/documents/1261865083/1263544276/paper_opera_eng.pdf/d42ea5b5-02aa-4013-afcf-de981cde8809): gross area 38,500 m², footprint 15,590 m², length including the plaza 242 m, building length 207 m, width 110 m, maximum ceiling over the stage 54 m, stage about 16 m below sea level. Wikipedia's 49,000 m² floor area is a different definition and was not used to rescale the plan.
- OSM ways listed below. The main outline, the glass foyer and the main-stage part carry the plan. `height=35` on the main stage is the exterior figure used here. A toilet block 25 m clear of the house is not part of the model.
- [Oslo - Opera House.jpg](https://commons.wikimedia.org/wiki/File:Oslo_-_Opera_House.jpg) and [Oslo - Opera House - 2026.jpg](https://commons.wikimedia.org/wiki/File:Oslo_-_Opera_House_-_2026.jpg), Jorge Franganillo, **CC BY 4.0**: waterfront massing, the rising plane and the roof joint grid.
- [Oslo Opera House 2023 2.jpg](https://commons.wikimedia.org/wiki/File:Oslo_Opera_House_2023_2.jpg), kallerna, **CC BY-SA 4.0**: the thin marble plane cutting across the glass, with glass above and below it.
- [Employees of the Oslo Opera begin arriving at work.jpg](https://commons.wikimedia.org/wiki/File:Employees_of_the_Oslo_Opera_begin_arriving_at_work.jpg), WmCheez, **CC BY-SA 4.0**: the side ramp at dusk.

The dossier also includes two interior photographs of the oak wave wall. Those are not the fly tower. The tower is white aluminium. No photos, textures or third-party meshes are shipped. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Frame and dimensions

Real metres, **+X east, +Y up, +Z south**. Origin `[10.7526853526, 59.9074989430]` is the area centroid of way 810259696. The long water edge runs at about **116°**. The foyer faces the fjord at about **206°**. That rotation is baked into the GLB. `y=0` is local quay grade. No sea level, DEM or Mercator stretch is baked in.

| Feature | Dimension | Evidence |
| --- | --- | --- |
| Outline along the facade axis | about 241 m | OSM way 810259696. Published length including the plaza is 242 m |
| Outline across that axis | about 124 m | OSM. The published width of 110 m is a different cut |
| Glass front | about 100 m | OSM way 397360403 |
| Fly tower plan | about 24 × 30 m | OSM way 397360407, `height=35` |
| Exterior crown | 35 m | OSM. Not the 54 m interior clear height |
| Implied exterior from 54 − 16 | about 38 m | Statsbygg, stage below sea level. The model follows the tagged 35 m |
| Lobby glazing | about 15 m of glass | Wikipedia. Placement on the wall is estimated |
| Blade, folds, cantilever, joints, mullions, tower relief | — | **Estimated** from the photographs |

## Geometry and materials

Editable folder: `src/peregrine/landmarks/top-cities/oslo-opera-house/`. `geometry.js` builds the house. `oslo-opera-house-mesh.js` clips the plaza, ear-cuts it and keeps crease normals unwelded. Build:

```sh
pnpm build:top-cities-landmarks oslo-opera-house --no-check
```

The public carpet is a low marble plane from the water to a crease, then a steeper west ramp. In front of the foyer a thin marble blade rises from that crease, crosses the glass (low on the west, high on the east) and narrows to a point over the east quay. The foyer wall is a dark blue-green glass plane about 15 m tall that leans about 4.6 m out over the fjord, with steel mullions, warm floor bands and white diagonal columns proud of the glass. A short dark opening marks the entrance. Inland of the glass the side halls, the stage link and the east wing meet as one stepped block, and the 35 m aluminium fly tower rises out of it. Near adds a shallow staggered relief and the marble joint grid. Far keeps the same shell, a coarser joint grid, the foyer lines and a light tower panel.

Eight materials, same names in day and night: `marble`, `joint`, `granite`, `aluminium`, `glass`, `light`, `steel`, `void`. `light` is the warm foyer bands (unshaded; amber at night). Day glass is a deep blue-green (`#1c4552`); night glass is near-black (`#071820`). The tower stays shaded aluminium, paler at night, not a lamp.

## Verification and costs

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 13,907 | 8 | 1,027,512 | 1003 |
| Far | 3,111 | 8 | 216,788 | 212 |

Both are inside the building caps (60k / 14 / 2.5 MB near; 12k / 8 / 500 KB far). Near and far bounds match. Far keeps the foyer mullions, diagonals, a coarse slab joint and a light tower panel so the glass and the ramps stay legible.

Sheets in ignored `tmp/top-cities/shots/oslo-opera-house/`:

1. `iteration-1/`: the first mass was a ramp that stopped at the bottom of a flat glass band, and the east wing stepped outside the footprint.
2. `iteration-2/`: the blade crossed the glass, but it floated above a black gap and the joint bars chorded off the slope.
3. `iteration-3/`: the leading edge stays down on the plaza and lifts toward the east. Compared with Franganillo's waterfront view and kallerna's foyer view.
4. `final/` and `final-door/`: the exported GLBs. The lobby glass now runs to the plaza, with an 8 m door about 2.6 m tall. Judged against the same two photographs, plus the north joint photo and the dusk side ramp.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** The site is flat reclaimed quay beside the fjord. `padM` is 142 m, just past the outline. A median `terrainPad` (feather 8 m, three on-building refs) is declared so a water sample in the default disc cannot sink the house. That pad is proposed, not exercised in the app.

## Approximations

Fold heights, blade thickness, the 4.6 m glass lean, the cantilever and the joint module are estimates. The real tower relief is a fine woven aluminium pattern; the near model is a shallow staggered panel, and far is a coarser panel plus four grooves. The inland block closes the gaps between the mapped parts but is still a simplified step, not a surveyed roof plan. The oak interior, seats, lettering, flags and the Barcode buildings next door are omitted.
