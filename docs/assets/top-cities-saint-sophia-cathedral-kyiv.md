# Saint Sophia Cathedral, Kyiv

Original procedural model of the present-day Ukrainian Baroque exterior of the
11th-century cathedral and the separate Sophia Square bell tower, Kyiv, Ukraine.
The white gallery walls, green copper roof field, stepped group of thirteen green
and gold shells, central gilded dome, medieval brick apse patches and tall pale
blue-and-white tower establish the identity. The model does not represent the
unplastered medieval reconstruction or the entire monastery precinct.

Sources inspected on 2026-10-13:

- [Saint Sophia Cathedral](https://en.wikipedia.org/wiki/Saint_Sophia_Cathedral,_Kyiv), published dimensions, history and four-tier tower description.
- [OSM cathedral outline](https://www.openstreetmap.org/way/27830282) and [bell tower](https://www.openstreetmap.org/way/27830522), plus all 60 associated building parts in the dossier extract.
- [Cathedral overall view, Rbrechko, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:80-391-0151_Kyiv_St.Sophia%27s_Cathedral_RB_18_2_(cropped).jpg).
- [Exposed apse detail, Wildcatjane, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Софійський_собор12.jpg).
- [Belfry exterior, Guillaume Speurt, CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Belfry_of_Saint_Sofia_in_Kiev_(8162387327).jpg).
- [Bell gallery interior, Сарапулов, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Софіївська_дзвіниця_11.JPG).

Reference images stay in ignored `tmp/top-cities/saint-sophia-cathedral-kyiv/refs/`;
no external meshes, photographic textures or reference photos ship. The geometry
is original procedural authoring; mapped plan data remains ODbL attributed.

| Dimension | Model / reference | Basis |
| --- | --- | --- |
| Highest tower cross | 76 m | Published tower description, also OSM top part |
| Bell tower tier tops | 13 / 27 / 38 / 51 m | OSM building-part heights |
| Bell tower gold roof/lantern | 51–71.5 m | OSM roof envelope plus photo-estimated profile split |
| Cathedral central cross | 32 m | OSM way 434573147 height |
| Six outer cross tips | 25.5 m | Six mapped OSM top parts |
| Central pear shell | 18.5–27.9 m; 9.4 m maximum diameter | Photo-estimated redistribution of shell/lantern within the fixed 32 m cross height; mapped lower roof part ends at 24.2 m |
| Six secondary pear shells | 14.6–22.1 m; 6.5 m maximum diameter | Photo-estimated shell/lantern redistribution within fixed 25.5 m cross heights; mapped lower roof parts end at 19 m |
| Four smaller green shells | 11.4–15 m | OSM 15 m parts; eave/profile estimated |
| Two low peripheral caps | 8.5–10.5 m | Estimated chapel forms to preserve thirteen-shell composition |
| Published cathedral length / width | 41.7 / 54.6 m | Wikipedia; historical dimensions, not forced onto the modern mapped outer gallery/support envelope |
| Tower horizontal centre | +62.1 east, 7.15 north of anchor | OSM plan |
| Cathedral plan orientation | 36° Three.js yaw; local +X bearing 54° | Mapped NE–SW gallery edges |
| Tower plan orientation | 30.5° yaw; facade normal bearing 59.5° | Mapped lower-tier edge/control points |

Frame: origin `[30.5144, 50.4528]`, real metres, east/up/south. Cathedral yaw and
tower's independent yaw are baked in positions; the root has no rotation. Local
`y=0` is an unsurveyed rigid precinct grade, with no DEM/absolute altitude baked.
Two bounded median-datum pad rings describe the cathedral and detached tower.
Their shared terrain footing and lattice coverage need separate app verification.
All 62 owned ways are listed individually; the two complete parent rings cover
the associated parts, including tiny cross-top triangles below the conformance
test’s 4 m² minimum ring area. Refectory,
Metropolitan's House, enclosing walls, surrounding monastery buildings and roads
remain provider-owned; no courtyard-spanning foundation slab is authored.

The mesh uses seven merged material draws: off-white stucco, muted green roofs,
warm gilding, pale blue tower panels, dark window recess indicators, weathered
brick and grey-brown footing. Near adds drum pilasters, rosette silhouettes and
brick courses; far retains individual arched windows, all domes, lanterns,
crosses, curved gallery frontons and genuinely pierced bell-tower tiers.
Carvings, apse brickwork, roof seams and interior bell machinery are simplified.
Thirteen shells are a stylized composition: the published thirteen-dome count
refers to the original church, while the mapped/photo modern roof is more complex.

Export: `pnpm build:top-cities-landmarks saint-sophia-cathedral-kyiv --no-check`.

The b10b review's pitched-roof/fronton correction remains in the geometry.
The fx45a re-review still found the central gold and six secondary green domes
broad and squat. This dome-only revision narrows their maximum radii from
6.55 / 4.45 m to 4.70 / 3.25 m and narrows the supporting drums with them.
Shell heights increase from 8.8 / 7.2 m to 9.4 / 7.5 m. The broad shoulder now
sits at 55% of shell height (5.17 / 4.125 m above the drum), then contracts
steeply to a neck of 17% maximum radius beneath the lantern. Both LODs use
the same eleven profile rings. Shortened lantern allocations preserve every
32 / 25.5 m cathedral cross tip; the separate 76 m tower retains its profile.
These diameter/profile subdivisions are photo estimates, not surveyed dimensions.

Before export, the dossier's Rbrechko side photograph (`refs/5.jpg`) was compared
with the source `sideReference` and `detail` renders and a same-height orthographic
shell elevation. The comparison aligns shell eave-to-neck height to 300 pixels;
it compares silhouette proportions, not a photogrammetric metre calibration.
Evidence: `tmp/top-cities/saint-sophia-cathedral-kyiv/side-reference-matched-shell-height.jpg`.
The raised shoulder and narrower neck follow the visible pear form; the simplified
straight profile segments and lantern/cross subdivisions remain approximations.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 28,008 | 7 | 936,952 | 915.0 |
| Far | 10,532 | 7 | 404,320 | 394.8 |

Before fx45a: near 27,336 / 7 / 924,856 bytes (903.2 KiB);
far 10,252 / 7 / 399,284 bytes (389.9 KiB).

Fresh exported GLB sheets are in
`tmp/top-cities/shots/saint-sophia-cathedral-kyiv/fx45a-domes/{near,far}/`, named
`saint-sophia-cathedral-kyiv-glb-{near,far}-light-sheet.jpg`.
Overview, facade, rear, dome detail and reference side were inspected in both
LODs: the narrowed shells, raised shoulders, pinched necks and cross tips survive
the export. One geometry/look-fix iteration was used. The matched-side comparison
was completed before exporting; the sheets then verified the GLB round trip.

All 634 requested registry/landmark tests pass (including ten landmark tests),
with observable rays checking all seven shell diameters,
height-to-width proportions, raised shoulders, narrow drums and pinched necks in
both LODs, plus cross tips, thirteen shells, tower openings, bell support and
apse windows. Depth generation/check has zero dropped cycle edges; the catalog
validates 336 records / 658 GLB variants and assets:preview builds successfully.
The far-night detail/reference sheet was also inspected. Complete final status are recorded in `tmp/top-cities/saint-sophia-cathedral-kyiv/fx45a-domes-report.md`.

Cityscape: **not tested for this revision**. Full 3D world: **not tested for this
revision**. Updated app captures and independent re-review remain with the lead.
Existing ownership covers 62 ways/two parent rings; the reviewer reported no
provider overlap. Carving, roof ornaments and the stylized thirteen-shell
composition remain approximations. No app server, runtime bundle, git write or
deployment was performed.
