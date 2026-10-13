# Charles Bridge — Prague, Czech Republic

Original, texture-free procedural model of the surviving sandstone pedestrian bridge across the Vltava, begun in 1357 and completed in 1402. It includes sixteen open vaults, fifteen cutwater piers, thirty Baroque sculpture groups, gas lamps, the Gothic Old Town Bridge Tower, the taller Lesser Town Bridge Tower and smaller Judith Tower, and the pointed gate between the western towers. Neighbouring houses, churches and Prague Castle are excluded. This is a free-standing bridge with no road layer or lane paint.

## Sources and frame

The dossier is `tmp/top-cities/charles-bridge/`: `osm.json`, `facts.txt`, `refs-sheet.jpg` and `refs/SOURCES.txt`. The bridge polygon is OSM way **119016167**. The Old Town tower is **839278890**, Lesser Town tower **839278891**, Judith Tower **389652950**, and connecting gate **460016966**. All modeled building and roof parts are listed in `OSM_WAYS` (25 IDs). The shared Overpass helper timed out twice; two small OSM API map extracts recovered the missing tower geometry (`west-map.osm`, `east-tower-map.osm`). No direct Overpass or Nominatim calls were made.

- [Prague City Tourism: bridge dimensions, construction and material](https://prague.eu/en/objevujte/charles-bridge-karluv-most/).
- [Prague City Tourism: Old Town tower and roof/gallery dimensions](https://prague.eu/en/objevujte/old-town-bridge-tower-staromestska-mostecka-vez/).
- [City of Prague: Lesser Town / Judith tower heights and pointed connecting gate](https://virtualni.praha.eu/towers/bridge-towers-of-lesser-town).
- [Charles Bridge history and statue ensemble](https://en.wikipedia.org/wiki/Charles_Bridge).
- [Mapped bridge outline](https://www.openstreetmap.org/way/119016167).

Origin **[14.41025, 50.08667]**, axes east/up/south, units metres. Rotation is baked into the vertices; the longitudinal curve comes from opposite-edge controls on the mapped bridge, rather than one straight rectangular extrusion. Representative eastward axis bearing is approximately 103.8°. Tower rotations follow their own mapped wall edges. The rigid support datum is **y=0**, the illustrative pedestrian paving and bank-tower footing datum **y=12 m**; no sea level, terrain or Mercator stretch is baked in.

| Dimension / feature | Source or interpretation | Authored value |
| --- | --- | --- |
| Overall bridge length | Tourism office: 515.76 m | Approximately 515.5 m east-west model envelope including western gateway; mapped main deck station length 502.49 m |
| Width | Tourism office: 9.5 m | 9.5 m outer slab, with parapets within it |
| Arches / piers | 16 vaults; city heritage account: 15 piers | 16 open transverse apertures / 15 piers in both LODs |
| Major arch openings | Tourism office: unequal 16.62–23.38 m spans | Most authored openings about 21–24 m; the visible partial western land opening is shortened by the mapped outline; not a reconstruction of surveyed vault dimensions |
| Statue groups | Historical ensemble: 30 | 15 per side; original grouped human silhouettes |
| Old Town tower | Tourism office: approximately 47 m; roof/gallery approximately 18 m | Roof/finial envelope approximately 47 m above the local bank; model top 59.045 m |
| Lesser Town tower | City of Prague: 43.5 m | 43.5 m roof/finial envelope above local bank |
| Judith tower | City of Prague: 29.3 m | 29.3 m roof/finial envelope above local bank |
| Deck, springing, arch rise | Photographic estimates, not altitude/survey | Paving 12 m; springing 2.8 m; elliptical rise 8.05 m |
| Cutwater caps, lamps, roof widths, sculpture details | Photographic estimates | Parametric solid forms, separately retained in near/far |

## Geometry and placement envelope

`charles-bridge-site.js` contains literal mapped controls and metric transforms. `geometry.js` authors solid spandrels with genuine transverse empty arches, grade-reaching piers and attached triangular cutwater caps, continuous paving and stone parapets, connected statue plinths, robe/head/arm/cross silhouettes, and gas lamps. Tower walls have pointed pedestrian passage cutouts and real discrete window apertures with dark backing inside the wall thickness in both LODs. Steep hipped saddle roofs, paired ridge finials, four corner turrets on each tall tower, small cornices, and the western gate battlements preserve the distinctive skyline.

Near uses 24 arch segments and more figurative relief. Far uses ten arch segments, lower-sided figures, fewer lamps and no tiny corner ashlar relief. It retains all sixteen arches, thirty statue-group locations, three roofs, pointed gateways and separate window apertures. No photographic texture, scan, third-party mesh, extra package or runtime code is imported.

Overlapping tower wall, corbel, roof and turret footprints are combined into five masks: bridge, Lesser Town compound tower, Judith compound tower, connecting gate, and Old Town compound tower. Tiny turret rings below the registry's 4 m² floor are contained in their mapped compound envelopes; their exact IDs remain listed. No neighbouring houses are claimed. The largest estimated cutwater/landing projection outside the mapped mask is **2.56 m**, bounded by a 3 m envelope test; this is river-side solid geometry, not ownership of another building. Bank terrain pads reference the three compound tower footprints, with two bank samples and a median datum, rather than a disc flattening the river corridor.

## Exports and measured costs

Build: `pnpm build:top-cities-landmarks charles-bridge --no-check`.

| Variant | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 25,940 | 8 | 1,620,856 | 1,583 |
| Far | 11,172 | 8 | 744,612 | 727 |

These are the exported default scene costs, with normals, indices and ordinary named materials; no textures/decoders or free-standing `_BRIDGELIFT` bytes. Both are well below the bridge caps. Counts do not establish Tesla hardware performance.

Stone colours are muted grey-brown sandstone; towers are darker weathered stone, roofs charcoal slate, figures dark grey, paving pale warm grey. Night uses dimmer blue-grey stone and warm self-lit `lamp` material. The references remain ignored scratch files: A.Savin, Wikipedia / Free Art License (two 2016 bridge views), Peter K Burian / CC BY-SA 4.0 (2015 river view), Z. Broz / public-domain historic postcard, and Jorge Franganillo / CC BY 2.0 (`refs/5.jpg`, Lesser Town tower street view). Titles, authors, licences and checked page links are in the catalog. All delivered geometry is original; geographic data © OpenStreetMap contributors, ODbL 1.0.

## Verification evidence

Actually inspected the reference sheet and `refs/5.jpg`, procedural near/light sheet, and exported sheets in `tmp/top-cities/shots/charles-bridge/`:

- `near-light/charles-bridge-glb-near-light-sheet.jpg`: overview, both sides, roof, pedestrian deck, low underside, Old Town tower, western towers and statue detail.
- `far-dark/charles-bridge-glb-far-dark-sheet.jpg`: the same nine views in far/night.
- `far-light/charles-bridge-glb-far-light-sheet.jpg`: overview, deck, underside and Old Town tower.
- `near-dark/charles-bridge-glb-near-dark-sheet.jpg`: overview, deck, underside and both tower groups.
- `export-reference-comparison.jpg`: these four exported sheets beside the dossier photos.

The first sheet led to correcting a missing western pier and replacing surface window patches with true openings retained in far. Contact/footprint tests caught a start-station projection error, corrected before the final exported sheets. Depth QA exposed opposite material ordering at the west tower/gate and tiny arch-band intersections; contiguous tower stone and same-material voussoirs removed those cycles rather than dropping depth edges. Facade cameras were widened to show both bridge ends.

Nine landmark tests exercise actual arch negative space, grounded piers, statue/pedestal contacts, measured paving and tower heights, window holes, open tower passages, named deck/parapet terminal supports with a deliberate free-end negative case, mapped envelopes and exported GLB round trips. The focused landmark run takes approximately 0.6 seconds. Deterministic GLB QA reports zero coplanar pairs, zero back-face hits in its sweep, no layered-face issues and no removable lift bytes. Depth regeneration and check pass with zero cycle edges dropped. The required combined conformance command passes all 600 tests (including nine Charles Bridge tests); catalog validation and local `pnpm assets:preview` pass.

## Separate integration gates and limitations

| Environment / case | Status |
| --- | --- |
| Procedural and exported near/far, light/dark | Verified locally |
| Cityscape app placement / provider replacement / shared runtime shading | Not tested yet; integration is checked separately |
| Full 3D world / bank-to-water datum / individual footing residuals / terrain pads | Not tested yet; integration is checked separately |
| Road fitting, HD lanes, route/car/traffic/camera heights | N/A: pedestrian-only, free-standing |
| Mode/theme/LOD lifecycle, reanchor, late terrain, load failure | Not tested in the app |
| Independent reference/app re-review | Pending lead |

Statues are simplified silhouettes rather than individual named sculpture replicas. Tower sculptural relief, parapet masonry, roof tiles, weathering and lighting are selective approximations. The western land vault and historical span-by-span dimensions need special attention in independent review. No shared runtime/source file was edited; the permitted generated `depth-layers.js` was regenerated for this ID and must be regenerated for all IDs by the lead before its commit. No git writes, dev/app servers or online deployments were performed.
