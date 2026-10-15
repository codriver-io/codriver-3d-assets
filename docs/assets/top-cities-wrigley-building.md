# Wrigley Building, Chicago

Original procedural reconstruction of the completed 1921/1924 two-tower complex at 400–410 North Michigan Avenue. Graham, Anderson, Probst & White's bright glazed terracotta, diagonal south clock tower, Giralda-inspired belfry and lantern, lower north block and two bridges over the pedestrian plaza establish the identity. Sources describe Renaissance details as well as the Spanish tower inspiration; this is a simplified architectural model of the present exterior.

Source: `src/peregrine/landmarks/top-cities/wrigley-building/`. Exports: `public/models/buildings/wrigley-building-{near,far}.glb` and `wrigley-building.json`. Build: `pnpm build:top-cities-landmarks wrigley-building --no-check`.

## Sources and dimensions

| Element | Value | Basis |
| --- | --- | --- |
| Architectural tip | 134 m | [CTBUH complex](https://www.skyscrapercenter.com/complex/417), rounded published height; OSM tower part says 133.5 m |
| Clock diameter, four faces | 5.97 m | 19 ft 7 in, [BLDG51 terra cotta collection](https://bldg51.com/2017/06/07/original-cream-colored-wrigley-building-ornamental-terra-cotta-fragment-joins-bldg-51-museum-collection/) |
| Construction | South 1921, north 1924 | [CTBUH south building](https://www.skyscrapercenter.com/chicago/wrigley-building/9018), [north addition](https://www.skyscrapercenter.com/building/wrigley-building-north-addition/13746), [Wikipedia](https://en.wikipedia.org/wiki/Wrigley_Building) |
| Main cornices | South 64 m; north 72 m | Estimated from reference photographs |
| North parapet cresting | Up to 77 m | Photo estimate; no invented central penthouse |
| South tower width/depth | 12 × 12.3 m | Measured mapped tower part, rounded |
| Tower control edge bearing | 34.12° true | OSM -87.6248041,41.889426 → -87.624721,41.8895173 |
| Clock centre | 104.2 m | Photo estimate |
| Belfry / octagonal drum / lantern cap | 109.5–119 / 119–121.5 / 130–132.2 m | Photo estimates; finial retains 134 m total |
| Enclosed bridges | Centres 9.6 and 49 m; width 5.3 and 4.1 m | Photo estimates; ~20 m spans including embedded ends |
| Main facade bays / floors | ~3.65 / 3.5 m | Photo estimates, adjusted to mapped face lengths |

Footprints: [OSM relation 17460539](https://www.openstreetmap.org/relation/17460539), parent ways 68831071 (north), 1271821350 (south), and every mapped part 686197572, 686197576, 686197567. Dossier geometry was reused; the shared Overpass helper failed to retrieve the missing parent outlines, so two individual OSM API `/way/id/full` requests supplied them. All five rings are recorded; two authored bridge projection rings cover the unmapped skybridge volumes. Adjacent Realtor Building, bridgehouses and River Plaza are excluded. Cornices extend at most 1.5 m beyond mapped walls.

Real metres, +X east, +Y up, +Z south, origin [-87.62486, 41.88971], y=0 at local grade. Rotation is already baked into the model. Southeast avenue frontage bearing 124°. The south tower uses its own mapped diagonal bearing; the northern block follows its irregular mapped perimeter.

Reference sheet `tmp/top-cities/wrigley-building/refs-sheet.jpg` was examined. Photographs and rights are enumerated individually in the catalog: Alvesgaspar (two 2016 photographs, CC BY-SA 4.0), Bex Walton (The Wrigley Building, CC BY 2.0), Diego Delso (Río Chicago, CC BY-SA 3.0), Pedro Szekely (Chicago, CC BY-SA 2.0), Dicklyon (Wrigley v Trump, CC BY-SA 4.0). None is redistributed in the model or repository. Meshes are original, texture free; OSM derived mapping is credited ODbL 1.0.

## Model and limitations

Mapped polygon blocks carry separate window quads, facade piers, stepped cornices, roofline finials and an avenue entrance arch. Near adds mullions and sills on the lower ten rows of each facade section and narrow facade relief. Far retains discrete windows at every floor with fewer horizontal bays, both bridges, all four clocks, pedimented north parapet cresting, and the open lantern. The belfry has corner and intermediate piers around a recessed dark core; the setback octagonal stage carries a taller eight-column lantern, with four belfry corner urns and a central stylised bell. Clock faces use mesh disks, dark rims, twelve geometric hour batons and hands rather than text or textures.

Six merged material draws in both LODs; roof stone and lantern capitals use the masonry material to avoid competing depth order at shared structural contacts. Dark mode has warm selected office windows and luminous clock dials. Fine terracotta motifs, human figures, inscriptions and Roman numeral letterforms are abstracted; the broad flat roofs and parapet ornament are estimated. Lighting is an approximation of the illuminated exterior, with no time-dependent clock animation or surveyed roof services. No Tesla hardware timing was measured.

## Costs and verification

| Detail | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 18,902 | 6 | 958,576 | 936.1 |
| Far | 6,034 | 6 | 288,444 | 281.7 |

Review repair g12ar (2026-10-15): raised daylight terracotta to near-white cream `#f2efe6`, reduced the window widths/heights and changed glass to mid-grey `#929a99`. Replaced the invented north rooftop boxes with roof-seated corner cresting and triangular pediments. Added the octagonal setback drum, larger belfry corner urns and a taller lantern while retaining the sourced 134 m total. Dropped upper-row mullion/sill quads and welded identical vertices within each material, retaining hard normals. Near GLB weight fell 18.8% despite the added crown geometry; far retains every floor's discrete window rhythm.

Judged exported near/light and far/dark sheets under `tmp/top-cities/shots/wrigley-building/g12ar/` (overview, back, roof, street, clock detail and plaza as applicable), compared with the existing reference sheet. White now dominates each facade; the clock tower has a distinct stepped crown, the north roof no longer has a tall invented office box, and the two supported bridges still span an open plaza. Ornamental details remain geometric approximations. The taller lantern is about 7.7 m between its supports; its cap and finial remain attached.

Both owned test files pass all 18 tests, including dimensions, clock faces, lantern/plaza openings, bridge support contacts, shortened-end rejection and footprint containment. Depth regeneration and check passed with zero material cycles; `qa-metrics.mjs` found no issues in either repaired model. Current metrics: `tmp/top-cities/wrigley-building/g12ar-metrics.json`.

Cityscape: **verified visually** in the local app, far/near/street. Full 3D world: **verified visually** in the local app, far/near/street with Terrarium terrain enabled. Current shared runtime shading shows pale white masonry and discrete mid-grey windows; there is no visible duplicate provider envelope or new ground seam. App evidence is under `tmp/top-cities/shots/wrigley-building/g12ar/app/{city,world}/wrigley-building-*.png`, with wider complete-tower views under `city-full/` and `world-full/`. Reports record each model active in the expected LOD. Repeated terrain arrival/eviction, origin shifts, failed-load restoration and device performance were not tested; these captures do not certify the broader terrain rollout. The asset stays rigid at local grade without baked DEM or Mercator stretch.

App captures used an isolated `/tmp/codriver-g12ar-slot-i` copy and scratch-only renderer bundle (source stamp `1e97b2922e20`), with Cityscape 3302/3303 and world 3304/3305. Shared `public/peregrine.js` was not rebuilt. `node scripts/asset-catalog.mjs` passed (406 entries / 800 GLBs), and `pnpm assets:preview` built the ignored local inspector. Captures have expected unauthenticated account/CORS errors but both landmark models loaded. No git writes, deployment or shared-tree app server was used.
