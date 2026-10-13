# Bank of America Corporate Center · Charlotte

Original texture-free procedural model of the 1992 César Pelli / HKS tower at 100 North Tryon Street. Its identity is the stepped granite shaft, closely spaced vertical piers and a pointed open aluminium rod lantern. Both LODs retain the six mapped setbacks, window rows/bays, granite entrance base and four nested open rod tiers. Founders Hall, Belk Theater, the plaza and public sculpture are outside this asset and its ownership.

## Dimensions and sources

| Feature | Model | Authority |
| --- | --- | --- |
| Architectural tip | 265.5 m | [CTBUH](https://www.skyscrapercenter.com/building/bank-of-america-corporate-center/711), 871 feet |
| Storeys / completion | 60 / 1992 | CTBUH; [structural engineer Walter P Moore](https://www.walterpmoore.com/projects/bank-america-corporate-center) |
| Metal crown | 30.5 m, from 235 m roof to tip | Walter P Moore: 100-foot crown of silver rods |
| Base plan | About 49 m square, projected 69 m east/south envelope | OSM outline 341587198 and part 341587200 |
| Setbacks | 42, 161, 177, 208, 224, 235 m | OSM building-part tags; mapped, not independently surveyed |
| Window bay / floor pitch | About 2.35 / 3.85 m near; 5.8 / 7.7 m far | Photograph estimates, coarse separate far panes |
| Crown rod counts | 224 near / 112 far | Estimated; actual rod counts were not sourced |
| Origin / base | [-80.84223,35.22731], local y=0 | Dossier origin, rigid flat-map grade |

The facade consultant [Curtainwall Design Consulting](https://www.cdc-usa.com/projects/bank-america-corporate-center-formerly-nationsbank-corporate-center) describes warm beige granite, reflective glass and an agate granite base. The palette follows that account and the street photograph, rather than exaggerating rose saturation. Night uses dimmer stone/glass, a sparse deterministic selection of warm office panes and a pale illuminated crown; changing event colours are not simulated.

## Geography and ownership

The six metre-space plans are derived from OSM geographic vertices, so rotation is baked once into both GLBs. Shaft control points relative to origin are (-29.67,-1.75) and (2.14,-30.05) metres east/south: the edge runs approximately 48.3° clockwise from north. The southwest facade faces about 228.3°. No host rotation, absolute altitude, DEM height or Mercator scale is exported.

Owned provider ways: 341587198, 341587200, 341587199, 341587201, 341587202, 341587204, 766639185, 341587207, 341587210, 766639186 and 341587214. All eleven exact rings are exported in footprint.js, including crown building parts. Adjacent Founders Hall (380092603) and Belk Theater (502718738) are explicitly excluded.

The foundation is the mapped first tier at y=0. A 51 m pad is declared, covering this compact level tower site; its DEM behavior still needs application testing. Crown rods are decorative cantilevers rooted in the roof slab, with intentionally free pointed tips. Outer rods follow the mapped roof perimeter with an inward seating offset. Open collar rings meet the rod tiers. The model has no suspended walkway, structural cable or bridge contract.

## Construction and approximations

The editable generator is self-contained and imports only local modules, assetBuilder and Three.js. Facades are tessellated into disjoint stone/piers, spandrels and glass cells, with no full solid wall under window quads. Their flush junctions are deliberate: fine recesses would add triangles and layered faces at automotive depth precision. No texture or photograph ships. Setback ledges are triangulated as annuli around the next tier, eliminating concealed coincident roof faces. Crown geometry uses slender silver cylinders, pointed tips and four open collars; far halves the rod count without replacing the lantern by a solid volume.

Approximations: precise crown rod section and supports, facade recesses, granite courses, entrance portal detailing, upper mechanical equipment, individual office lighting and material roughness. Lobby murals, interior marble, signage, Founders Hall, theater, plaza and statue are omitted. Actual device performance is unmeasured.

Reference-only images in ignored tmp/top-cities/bank-of-america-corporate-center/refs/: architectural model by Alexisrael (CC BY-SA 3.0); night crown by Alex Drake (public domain); Founders Hall and street facade by Kiran891 (CC BY-SA 4.0). Titles, licence and Commons links are recorded in the catalog. Geographic data © OpenStreetMap contributors, ODbL 1.0. The procedural mesh is original work for Codriver.

## Verification

Repeatable export: `pnpm build:top-cities-landmarks bank-of-america-corporate-center --no-check`.
| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| near | 31,504 | 6 | 1,444,320 | 1,410 |
| far | 8,764 | 6 | 412,648 | 403 |

Checks: the required top-cities conformance + landmark command passed 633/633 tests; the eleven landmark tests pass in under one second. The catalog validation passes. Both depth-table generation and `--check` pass, with zero cycle edges dropped. Deterministic `qa-metrics.mjs --ids bank-of-america-corporate-center` reports no issues: zero coplanar overlap, zero layered faces, zero outside-in back-face hits, no unused bridge lift data and identical near/far bounds. Evidence: `tmp/top-cities/bank-of-america-corporate-center/focused-tests.log` and `metrics.json`.

Images judged against the reference photographs:

- `tmp/top-cities/bank-of-america-corporate-center/refs-sheet.jpg`: daylight street facade, model/photo overview, night crown and the excluded Founders Hall.
- `tmp/top-cities/shots/bank-of-america-corporate-center/export-reference-contact-sheet.jpg`: final EXPORTED GLBs beside daylight and night photos, near/far light/dark, opposite facades, crown detail, roof, top plan and entrances.
- The four `bank-of-america-corporate-center-glb-{near,far}-{light,dark}-sheet.jpg` files in that same folder; light sheets include overview/back/roof/crown/entrance/street, dark sheets overview/crown/entrance.
- `bank-of-america-corporate-center-glb-near-light-top.png` in that folder: mapped base and crown alignment.

Changes prompted by inspection: reduced dark agate from the entire 42 m first tier to the entrance zone; strengthened vertical window rhythm by narrowing spandrels; darker silver in daylight to keep rods visible; outer rods seated inside the mapped roof edge; separate rows on short far upper tiers so the windows cannot become tall stripes; removed concealed cylinder/cone caps to lower costs without changing visible silhouette. Final contact sheet shows the open collar-and-rod lantern in both LODs and its night illumination. Exact collar configuration and facade relief remain approximations for independent review. A transient missing Parthenon documentation file initially interrupted global catalog loading, then resolved; final shared checks pass.

Cityscape: **not tested yet, integration is checked separately**.
Full 3D world: **not tested yet, integration is checked separately**.
Asset inspection establishes source/export geometry only. Runtime replacement, shared material shading, terrain footing, mode transitions and lifecycle checks remain for the lead and independent reviewer.
