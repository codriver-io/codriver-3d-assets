# Cathédrale Saint-Jean, Lyon

Asset `cathedrale-saint-jean-lyon` represents the present exterior of the Primatiale Saint-Jean-Baptiste-et-Saint-Étienne, Place Saint-Jean, Vieux Lyon, France. This is an original procedural, texture-free model. The west screen, three portals and large rose identify the building from the square; the four spireless square towers, long buttressed nave and lower Romanesque apse identify it from the Saône. Fourvière hill, the neighbouring Manécanterie, palace, cathedral interiors and temporary light-festival projections are outside the model.

## Sources and dimensions

Sources checked on 15 October 2026: the [official cathedral site](https://cathedrale-lyon.fr/) (the dossier’s primatiale.fr redirects here), [French architectural description and dimensions](https://fr.wikipedia.org/wiki/Primatiale_Saint-Jean_de_Lyon), and the supplied OSM extract, especially [cathedral way 136200148](https://www.openstreetmap.org/way/136200148). The architectural description distinguishes the four unspired towers and the triangular west gable. Interior dimensions are context, not measurements of the larger outer envelope.

| Feature | Value used | Basis |
| --- | --- | --- |
| Highest tower roofs | 44 m | Published maximum tower height |
| Internal length / choir length | 80 / 20 m | Published context; not substituted for the OSM exterior envelope |
| Interior nave width / three naves | 13.3 / 26 m | Published context |
| Interior vaults, nave / choir | 32.5 / 24.3 m | Published context, exterior roof stages estimated above them |
| Main nave exterior eaves / ridge | 33.8 / 41.1 m | Photo estimate |
| West screen width | 34 m | Mapped outline and photo proportion |
| West gable apex / ornament tip | 43.15 / 44 m | Photo estimate, kept within the published overall ceiling |
| West tower bodies / shallow caps | 36.5 / 38 m | Photo estimate |
| Eastern tower bodies / caps | 42.15 / 44 m | Photo estimate anchored to published maximum |
| Rose diameter | 8.4 m | Photo estimate |
| Choir / apse eaves and roof | 26.9 / 31.8 m | Photo estimate |
| Low chapel eaves / ridges | 13.6 / 18 m | Photo estimate |

Five dossier photographs were examined: `Saint-Jean de Lyon.jpg` — Jordane Prestrot, CC BY-SA 3.0; `007. Photo prise depuis les toits de la Basilique Notre-Dame de Fourvière.JPG` — Otourly, CC BY-SA 3.0; `Lyon 05 - Primatiale Saint-Jean - PA00117785 - Face.JPG` — Xavier Caré / Wikimedia Commons, CC BY-SA 4.0; `Three sights Lyon.JPG` — Chris 73, CC BY-SA 3.0; and `Cath. St Jean (3).JPG` — Gonedelyon, CC BY-SA 3.0. The Xavier Caré file page and licence were checked directly. Exact title/author/licence/URLs are recorded in the catalog provenance and dossier `refs/SOURCES.txt`. Photos stay in ignored scratch and supply visual comparison only; no photo, mesh, scan or texture is redistributed with the asset.

## Geographic frame and ownership

Origin `[4.8275,45.76075]`, real metres, +X east, +Y up, +Z south; y=0 is the rigid local pavement. Authoring u points toward the river and v toward the south aisle. A `rotateY(-23°)` is baked into every exported mesh, giving west frontage bearing 293°. Do not rotate it again in the host.

Mapped control points `[4.8269300,45.7607376]` and `[4.8270233,45.7607089]`, along the south edge of west tower way 1461797216, give approximately 113.8° toward the choir; the opposite edge agrees to within a degree. The neighbouring long footprint edges agree with the adopted 113° axis. The outline is not a rectangle: northern and southern chapels step in plan, and the western entrance jambs project ahead of recessed portals. The source preserves those principal steps. The first southern flyer leans longitudinally toward its mapped pier to clear the sacristy notch.

Replacement rings include the cathedral way 136200148, the separately mapped tower ways 1461797216, 1461797217 and 1461797218, and attached sacristy 125802931. The southern east tower is covered by the cathedral outline; no independent part is present in the dossier. No additional Overpass calls were required. Every authored vertex in both LODs passes the 0.8 m provider-envelope tolerance. The mapped rings are replacement masks, not a plaza pad, and do not own the palace, Manécanterie, roads or adjacent service buildings.

`padM=54` covers this approximately level cathedral site. The immediate pavement is assumed to vary less than 2 m; this is not a DEM survey. No altitude, terrain exaggeration, Mercator stretch, hill or broad plaza is baked into geometry.

## Procedural design and materials

Self-contained authoring lives in config, footprint, geometry, views and two prefixed helper modules. Six merged materials: warm pale limestone `stone`, lighter mouldings `trim`, muted brown-grey `roof`, shadow `recess`, subdued `glass` and dark reddish timber `door`. Night uses the same six keys with dimmed colours; festival projection and invented glowing windows are omitted.

Visible masonry walls have cut-outs with window infill behind the surface. The facade has three pointed portal recesses, nested arch mouldings, simplified stone tympana, red doors, triangular canopies with small geometric rosettes, a recessed blind-arcade gallery, circular balustrade motifs, a clock and a large petalled rose. The flanking upper wings and the high central gable remain thin and spireless. Near includes small grouped figure/canopy forms, clock ticks, belfry louvres, extra arch subdivisions and crockets. Carved portraits and medieval narrative reliefs are represented sparingly; the exterior is visibly less intricate than a photographic reconstruction.

Six distinct clerestory bays and lower aisle openings remain separate in both LODs. Closed flying masonry arches span above the aisle roofs and touch the nave walls and tall outer piers. Square eastern belfries retain paired tall openings and a lower paired arcade stage; their roofs are shallow hipped caps, not spires. The stepped choir and faceted apse have tall lower lancets and smaller paired upper openings. The south-east chapel and thin sacristy are mapped additions, without neighbouring building mass.

Far keeps the same silhouette, all four towers, the west gable, three portals, rose, separate nave windows, lower apse, chapel steps and every flying-arch station. Far walls and frames use outward-facing surfaces with inset infill to reduce cost; near retains thick masonry reveals. Geometry is merged by material. No imported application terrain, runtime layer, external mesh library or texture is required.

## Export and verification

Repeatable export: `pnpm build:top-cities-landmarks cathedrale-saint-jean-lyon --no-check`.

| LOD | Exported triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 24038 | 6 | 1227228 | 1198.46 |
| Far | 8571 | 6 | 352936 | 344.66 |

These are default-scene export costs, not measured hardware performance. Both LODs have identical bounds, approximately 84.20 × 44 × 66.11 m after geographic rotation, with minimum y equal to zero within float precision. Both have substantial byte, triangle and draw headroom.

Visual evidence examined under `tmp/top-cities/shots/cathedrale-saint-jean-lyon/`:

- `first/cathedrale-saint-jean-lyon-glb-near-light-sheet.jpg`: first exported overview, west facade, roof, east apse, north side, street, portals and rose.
- `final/reference-export-comparison.jpg`: front, aerial and river references above near/light, near/dark, far/light and far/dark GLB rows, each showing facade, roof, opposite side and portal detail.
- `final/cathedrale-saint-jean-lyon-glb-near-light-sheet.jpg`: final eight-view export inspection, including street and north-side views.
- The matching final `glb-{near,far}-{light,dark}-sheet.jpg` files provide full eight-view sheets. `glb-near-light-top.png` records mapped footprint alignment.

The first inspection prompted deeper portal treatment and a recessed gallery, replacing an excessively blank lower screen. Mechanical checks exposed intersecting window/clock trim and tower bands; removing the cyclic layers yielded zero dropped material edges. Footprint tests led to a northern aisle notch, a narrower west southern chapel, a moved southern buttress pier and a tighter apse. The second inspection revealed bottom-cap normals smoothing the hipped tower roofs into dark bowls; splitting the cap vertices fixed the roof shading, and final exported images were refreshed and compared against the photos. All final stage dimensions and main features remain visible in far. Small tracery and sculpture remain deliberately simplified; the frontal stone screen has substantially less carving than the real building.

Final mechanical QA reports no issues: zero coplanar pairs/area, zero unresolved layered faces after generated depth ordering, zero back-face hits in the 500-ray sweep (369 actual hits), no below-grade geometry beyond floating-point round-off and no removable attributes. Depth regeneration reports zero cycle edges; `--check` passes. Eight landmark-specific tests pass, pinning tower heights and broad tops, the rose and portals by raycast, choir/nave roof steps, the air under flyers, all-vertex footprint containment, both LOD budgets and silhouette. Every flyer is checked against named wall/pier support surfaces excluding the member, with a shortened/free-end negative case.

The exact requested combined test command passes all 838 tests (including eight Saint-Jean tests), as recorded in the dossier’s `tests-final.txt`. `node scripts/asset-catalog.mjs` passes: 406 records / 790 GLB variants, recorded in `catalog-final.txt`. Initial catalog checks briefly encountered other builders’ missing documents; the final shared catalog check has no failures. `SPEC.ready=true` establishes asset export readiness, not independent reviewer acceptance or application terrain certification. The depth table was the only shared generated source touched.

| Integration evidence | Status |
| --- | --- |
| Cityscape | Not tested yet; integration is checked separately |
| Full 3D world | Not tested yet; integration is checked separately |
| Terrain footing/pad edges, provider replacement and lifecycle | Not tested; coordinator app validation remains |
| Independent reviewer acceptance | Pending coordinator review |

Inspector cameras: `overview`, `facade`, `roof`, `east`, `north`, `street`, `portal`, `rose`, all registered as `/asset-preview.html?asset=cathedrale-saint-jean-lyon&view=<key>`. No shared app runtime, registry or bundle was changed, and no application server or deployment was started.
