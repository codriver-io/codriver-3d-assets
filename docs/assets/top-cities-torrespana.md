# Torrespaña — Madrid

Original Torrespaña broadcasting tower with its long concrete shaft, broad dark cylindrical equipment head, circular dishes, five narrowing aerial galleries and striped upper mast.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Torrespaña)
- [OSM way/309746187](https://www.openstreetmap.org/way/309746187)
- [OSM way/309746182](https://www.openstreetmap.org/way/309746182)
- [OSM way/309746192](https://www.openstreetmap.org/way/309746192)
- [OSM way/309746193](https://www.openstreetmap.org/way/309746193)
- [OSM way/309746194](https://www.openstreetmap.org/way/309746194)
- [OSM way/320006583](https://www.openstreetmap.org/way/320006583)
- [OSM way/320006584](https://www.openstreetmap.org/way/320006584)
- [OSM way/320014038](https://www.openstreetmap.org/way/320014038)
- [OSM way/320014039](https://www.openstreetmap.org/way/320014039)
- [OSM way/320014040](https://www.openstreetmap.org/way/320014040)
- [OSM way/320014041](https://www.openstreetmap.org/way/320014041)
- [OSM way/320014042](https://www.openstreetmap.org/way/320014042)
- [OSM way/320014043](https://www.openstreetmap.org/way/320014043)
- [Madrid tourism:29.5m foundation;220m alternative height](https://www.esmadrid.com/informacion-turistica/torrespana-el-piruli)
- [Madrid technical agreement lists231m](https://agenciatributaria.madrid.es/UnidadesDescentralizadas/JuntaDeGobierno/1.%20Acuerdos%20Transparencia/2023/1.%20Ficheros/Relaci%C3%B3n%20de%20Acuerdos.pdf)
- [UPM telecommunications history:231m including antenna](https://www.etsist.upm.es/estaticos/ingeniatic/index.php/multimedia/imagenes%3Ftask%3DpreviousPhoto%26photo_id%3D14.html)
- [File:Torrespaña Según la perspectiva.jpg — Gregorio Puga Bailón from Murcia, Spain; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Torrespa%C3%B1a_Seg%C3%BAn_la_perspectiva.jpg)
- [File:El Piruli and neighbourhood.jpg — Xauxa Håkan Svensson; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:El_Piruli_and_neighbourhood.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Total to antenna tip | 231 | Madrid technical agreement/UPM; published232 and tourism220 disagree |
| Main shaft top | 132.7 | OSMbuildingpart309746193 |
| Main projecting gallery | radius12;137.9–142.1 high | OSM309746187 |
| Upper gallery decks | 154.7,157.7,163.7,167.7,173.1 | Mapped building parts |
| Upper structural core | 180 | OSM309746182 |
| Foundation disc | diameter29.5,2 high | Madrid tourism; above-grade thickness estimated0.4 |

Origin: [-3.6641960328125,40.420516389062485]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 11.7772834396209 degrees is baked from the controls [[-3.6641881,40.4204736],[-3.6641818,40.4204746]]; the host must not rotate again. Footprint ownership: 309746187, 309746182, 309746192, 309746193, 309746194, 320006583, 320006584, 320014038, 320014039, 320014040, 320014041, 320014042, 320014043. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Adopts231m overall as an estimate from the municipal technical list and university account; the232m article height and220m tourism height are retained as conflicting source values, not silently reconciled. All thirteen mapped tower/part ways are listed; unrelated studio buildings are excluded. The circular29.5m foundation projection is authored from the published diameter, not an additional mapped building. Main gallery glazing is a dark ring with separate equipment panels; no broadcast logos or lettering. Dish count, exact aerial attachments and mast stripe divisions are photo estimates. Thin secondary antennas are reduced in far but all five gallery levels remain. Rigid y0 grade, not sealevel.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7152 | 6 | 84404 |
| far | 4340 | 6 | 57524 |

Metrics: `tmp/batch/torrespana/metrics.json`, no flags. Contact sheet: `tmp/batch/final/torrespana.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/torrespana/torrespana-procedural-near-light-top.png`. The main head/shaft proportions, circular dishes, five gallery rings and antenna silhouette were compared with both skyline and roadside photos. Full231m framing uses explicit enlarged bounds; far retains each major gallery and head. Small equipment and mounting details remain simplified. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

The authored29.5m foundation ring contains all thirteen nested mapped parts, so redundant internal footprint rings are omitted; every provider way remains in OSM_WAYS and the source references. The upper gallery equipment enclosures were added after the first comparison made the bare core look too pale.
