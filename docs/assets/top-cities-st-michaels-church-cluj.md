# St. Michael’s Church Cluj — Cluj-Napoca

St Michael’s Gothic hall church has a broad steep russet nave roof, lower polygonal eastern apses, tall pointed traceried windows, repeated buttresses and a separate north Neo-Gothic clock tower with an octagonal dark spire and cross.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/St._Michael%27s_Church,_Cluj-Napoca)
- [Mapped relation/12141980; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/relation/12141980)
- [File:St. Michael's Church in Cluj-Napoca, Transylvania, Romania (1).jpg | Rosenborg BK Fan | CC0](https://commons.wikimedia.org/wiki/File:St._Michael%27s_Church_in_Cluj-Napoca,_Transylvania,_Romania_(1).jpg)
- [File:St. Michael's Church, Cluj-Napoca. Viewed from the north..jpg | Karex | CC BY-SA 3.0 ro](https://commons.wikimedia.org/wiki/File:St._Michael%27s_Church,_Cluj-Napoca._Viewed_from_the_north..jpg)
- [File:St Michael Cluj Napoca.jpg | Yerpo | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:St_Michael_Cluj_Napoca.jpg)
- [Parish: 76 m tower, 80 m with cross, 50×24 m nave and 20×10 m sanctuary](https://szmk.ro/egyhaz/ter/templomaink/szent-mihaly-templom/)
- [Municipal tourism: Gothic hall, north Neo-Gothic tower, 2016–2022 restoration and 80 m maximum](https://visitcluj.ro/tourist_spot/biserica-romano-catolica-sfantul-mihail-2/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/st-michaels-church-cluj/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tower / including cross | 76 / 80 | Parish primary source |
| Nave interior length / width | 50 / 24 | Parish and municipality; mapped outer plan is broader |
| Sanctuary interior length / width | 20 / 10 | Parish and municipality |
| Nave eaves / ridge | 24.8 / 37.3 | Photo estimates |
| Chancel ridge / clock stage / spire base | 34.1 / 48–59.3 / 59.3 | Photo estimates |

Parish documentation resolves the 76 versus 80 m figures: 76 m is the tower without the cross, 80 m includes it. OSM relation height=25 is treated as a coarse low church-body value, not the tower total. Nave eaves/ridge, chancel roof and belfry/clock-stage splits are photo estimates; published 50×24 m and 20×10 m dimensions refer to interior spaces, whereas the measured OSM exterior envelope includes wall thickness, side apses, buttresses and the north tower. Two mapped controls fix the baked bearing; individual roof ridges, aperture stations, sculptural simplifications and buttress sections are original approximations constrained to that exterior plan. Exterior comparison photos show the same current permanent structure; temporary vegetation, restoration scaffolding and the Matthias monument are excluded.

## Frame and ownership

Origin `[23.5895553, 46.76997155]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[23.5891933, 46.7697579], [23.5893147, 46.7697693]]`; rotationY `0.13625152914827823` radians. Exact provider ways: `[202294653, 892684482, 892684489]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only church relation 12141980’s stitched outer ways 202294653, 892684482 and 892684489 are owned. No surrounding square, statue group, trees, roads or churchyard paving is added.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Adjoining coursed stone cells are clipped around actual pointed window partitions. Lancet mullions and simplified tracery remain in both LODs; the open belfry is cut through independent tower faces. Clock circles are partitioned into the octagonal stone stage with hour marks and hands but no lettering. The slate spire terminates at 76 m and carries a 4 m cross; the smaller chancel fleche is kept distinct. The roof uses coarse muted tile colour cells, while the far model preserves steep ridges, lower apses, buttresses, clocks, spire and openings. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 12520 | 8 | 187868 |
| far | 4960 | 8 | 88540 |

Deterministic QA: no flags (`tmp/central-east/st-michaels-church-cluj/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/st-michaels-church-cluj.jpg`; source top over red OSM rings: `tmp/central-east/shots/st-michaels-church-cluj/`. First visual refinement reduced the coarse roof tile colour contrast to match the muted russet reference. Full near/far contact sheet against the restored exterior, red mapped footprint rings and dark exported far view inspected; buttresses, Gothic window groups, polygonal chancel, clocks, open belfry and both spires retained. Body/roof component heights remain documented photo estimates.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
