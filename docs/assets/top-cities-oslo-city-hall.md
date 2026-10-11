# Oslo City Hall — Oslo rådhus

Original procedural exterior of **Oslo rådhus** at Rådhusplassen 1. Arnstein Arneberg and Magnus Poulsson, inaugurated 15 May 1950. Dark brown-red Hovin brick, two unequal towers with flat parapet tops, a flat harbour roof set behind a brick parapet, a large clock on the east tower and an astronomical clock on the courtyard. Asset ID `oslo-city-hall`.

## Sources and rights

Consulted 2026-10-08:

- [Oslo Byleksikon — Rådhuset](https://www.oslobyleksikon.no/side/R%C3%A5dhuset) and the [English page](https://oslobyleksikon.no/index.php?title=City_Hall): east tower 66 m, west tower 63 m because the street is higher on the west; concrete with Hovin brick; site about 4,900 m² and floor area about 39,700 m²; east-tower carillon of 49 bells; south clock face 8.6 m, minute hand 5.72 m; astronomical clock 5 m on the middle facade facing the city.
- [Wikipedia — Oslo City Hall](https://en.wikipedia.org/wiki/Oslo_City_Hall): functionalism, 1931–1950, height 66 m, bricks about 27.5×13×8.5 cm. The 1916–18 competition scheme was a medieval one-tower design; the built building is the later functionalist redesign.
- [Lokalhistoriewiki — Oslo rådhus](https://lokalhistoriewiki.no/Oslo_r%C3%A5dhus): the same heights; the carillon (Olsen Nauen, 1999) is the largest in the Nordics. St. Hallvard stands over the courtyard entrance and is not modelled as a figure.
- OSM way [24900009](https://www.openstreetmap.org/way/24900009): `building:colour=#841F27`, `building:material=brick`, `height=66`, `start_date=1950-05-15`. The wing (way 621514223) is tagged 27 m. The roof part (way 503263073) is tagged a gable of 0.3 m at 27.4 m, colour `#614545`.
- [Harbour view](https://commons.wikimedia.org/wiki/File:2018-05-27_Oslo_R%C3%A5dhus_(1).jpg), Ole Brastad, **CC BY 2.0**: west tower with the slot, east tower with the clock below a recessed crown, a flat harbour roof behind a brick parapet, stone colonnade.
- [North courtyard panorama](https://commons.wikimedia.org/wiki/File:Oslo_r%C3%A5dhus_City_Hall_Norway_Main_Entrance_Inngang_borgg%C3%A5rd_Fridtjof_Nansens_plass_Morning_sunlight_Shadows_Blue_skye_Sett_paving_Restaurants_outdoor_tables_Astronomical_clock_Stairs_etc_Distorted_panorama_2020-09-02_IMG_9673.jpg), Wolfmann, **CC BY-SA 4.0**: the U, the stairs, and the astronomical clock.
- [Courtyard relief](https://commons.wikimedia.org/wiki/File:Beautiful_fa%C3%A7ade_of_the_Oslo_City_Hall_(Oslo_r%C3%A5dhus)_(29252400354).jpg), Jorge Láscar, **CC BY 2.0**: the clock seen from below the courtyard wall.

Interior photographs in the dossier were not used. No photos, textures or third-party meshes are shipped. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Frame and dimensions

Real metres, **+X east, +Y up, +Z south**. Origin `[10.73358, 59.91176]`. The harbour facade runs at about **114.9°**; its outward normal, toward the fjord, is about **204.9°**. That rotation is baked into the GLB. `y=0` is local plaza grade. No sea level, DEM or Mercator stretch is baked in. `padM` is 120 m. There is no `terrainPad`.

| Feature | Dimension | Evidence |
| --- | --- | --- |
| East tower | 66 m | Byleksikon, Wikipedia, OSM `height=66` |
| West tower | 63 m | Byleksikon. OSM only says about 20 levels |
| South clock face | 8.6 m diameter | Byleksikon. Centre at 50 m is estimated |
| Minute hand | 5.72 m published | Byleksikon. The published length includes the tail; the modelled tip stays inside the dial |
| Astronomical clock | 5 m | Byleksikon, on the courtyard facade. Height on the wall is estimated |
| Harbour parapet | 27 m | OSM wing height. The roof sits behind it |
| Harbour roof | 25.05 m | **Estimated.** Flat copper plane, inset so the street sees brick |
| Courtyard link | 32.6 m | **Estimated** from the tagged ten storeys against the wing's eight |
| Window grid, colonnade, relief bars, stair prisms | — | **Estimated** from the photographs and the stair polygons |

## Geometry and materials

Editable folder: `src/peregrine/landmarks/top-cities/oslo-city-hall/`. `geometry.js` builds the hall in the facade frame and rotates it onto east/up/south. Build:

```sh
pnpm build:top-cities-landmarks oslo-city-hall --no-check
```

The harbour wing is a brick block to 24.9 m, a flat copper roof at 25.05 m, and a brick parapet to 27 m that hides the roof from the street. The two towers rise on the courtyard side of that wing and stay brick to the top: the west one is 63 m and has a tall slot; the east one is 66 m, with the 8.6 m clock on its south face below a recessed loggia. Both crowns are a band of dark vertical openings, then blank brick and a thin stone cornice. A lower link closes the U and carries the entrance, a relief, and the 5 m astronomical clock. Stone piers stand in front of the harbour base. The north stairs are inset prisms of the mapped stair parts, not one bounding box.

Six materials, same names in day and night: `brick`, `stone`, `copper`, `glass`, `glow`, `brass`. `glow` is the clock face (unshaded; warmer at night). Copper is a colour only; the shared builder does not set a separate metalness. Day brick is `#5a2e26` and night brick is `#3e241e`. The stored day hex is darker than the photographed brown-red because the QA sheet's ACES exposure 1.2 lifts midtones.

## Verification and costs

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 15,000 | 6 | 811,976 | 793 |
| Far | 4,914 | 6 | 268,660 | 262 |

Both are inside the building caps (60k / 14 / 2.5 MB near; 12k / 8 / 500 KB far). Near and far bounds match (about 102 × 66 × 122 m). The tallest vertex is the east crown at 66 m. Nothing sits below grade. The furthest vertex is a colonnade pier 0.88 m outside the union of the mapped rings.

Sheets in ignored `tmp/top-cities/shots/oslo-city-hall/`:

1. `oslo-city-hall-procedural-near-light-sheet.jpg` (first look): the two towers, the slot, the clock and the U were recognisable, but the brick was too bright, the copper too mint, the harbour relief was a flat gold panel, and the hip was almost a lid.
2. The same sheet after the second look of the first build, plus `oslo-city-hall-procedural-near-light-plan.png`: darker brick and copper, and the relief replaced by raised bars. That pass still used a copper hip (eave 21.2 m, ridge 27.4 m). The plan sits on the red OSM rings, including the north stairs. Compared with Brastad's harbour view and Wolfmann's courtyard panorama.
3. Exported GLBs: `oslo-city-hall-glb-near-light-sheet.jpg`, `oslo-city-hall-glb-near-dark-sheet.jpg`, `oslo-city-hall-glb-far-light-sheet.jpg`, `oslo-city-hall-glb-far-dark-sheet.jpg`.
4. Review fix, `tmp/landmark-qa/sheets/oslo-city-hall.jpg`: the hip is gone, the street view meets the brick parapet, both tower tops are flat brick with a dark loggia under blank brick, and the east clock sits below that crown. Far keeps the same silhouette. QA metrics reported no issues (0 coplanar pairs, 0% back-face).

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** The site is a level waterfront plaza. The west street is less than 2 m higher than the east, which is why the towers are published at different heights; the model keeps both shafts from y=0 and should stay flat in Full 3D world.

## Approximations

OSM calls the roof a 0.3 m brown gable at 27.4 m. The harbour photograph is a flat roof behind a brick parapet, so the parapet is the mapped 27 m and a thin copper plane sits at 25.05 m, hidden from the street. The east tower's small green lantern is not modelled; both crowns are flat brick. The courtyard link height, storey grid, colonnade count, loggia spacing and relief are not surveyed. The relief stands in for the harbour sculpture and for St. Hallvard; it is not a figure. Clock hands are a fixed pose. The swan fountain, lettering, Nobel ceremony fittings, interiors and the neighbouring blocks are omitted. The tiny east-tower tip and nub in OSM are not modelled as needles.
