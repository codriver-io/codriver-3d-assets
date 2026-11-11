# Pyramid of Cestius — Rome

Original procedural exterior of the restored Pyramid of Cestius: steep four-sided marble pyramid, mapped square base, sharp summit and restrained marble-block coursing partitioned into the faces.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Pyramid_of_Cestius)
- [OSM way/432946457](https://www.openstreetmap.org/way/432946457)
- [Italian national tourism — marble pyramid, about 36 m high and 30 m base](https://www.italia.it/en/lazio/rome/pyramid-cestius)
- [Sir John Soane museum — actual height about 36.5 m, historical grade differs](https://collections.soane.org/OBJECT5613)
- [File:Piramide di Caio Cestio 06.jpg — Nicholas Gemini; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Piramide_di_Caio_Cestio_06.jpg)
- [File:Piramide Cestia.jpg — Livioandronico2013; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Piramide_Cestia.jpg)
- [File:Piazzale Ostiense Piramide porta san Paolo.jpg — Blackcat; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Piazzale_Ostiense_Piramide_porta_san_Paolo.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Summit | 36.4 | OSM height tag; Italian heritage descriptions about 36–36.5 m |
| Square base | about 29.5 | Exact OSM ring; published figures 29.5–29.6 m |
| Local foundation lip | 0.2 | Estimated within owned envelope |
| Marble course pitch | 0.82 near / 1.65 far | Photo-based coarsening, not a masonry survey |

Origin: [12.480869157142857,41.87646435714286]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 65.56239044162018 degrees is baked from the controls [[12.4809426,41.876272],[12.4810909,41.876515]]; the host must not rotate again. Footprint ownership: 432946457. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Current restored pale-marble exterior. Four smooth slopes meet at a single supported apex. Marble seams are disjoint partitions of the sloping faces, not layered quads. Inscriptions, fenced worksite, adjacent Aurelian wall, Porta San Paolo, landscaping and inaccessible burial chamber are excluded. Published heights vary from about 36 to 37 m; adopted 36.4 m follows the mapped tag and Italian heritage convention and is treated as an estimate. After unmodified dossier Overpass retries timed out, the bounded OSM map API supplied the exact building ring; original API response and provenance remain in ignored scratch.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3732 | 2 | 69244 |
| far | 1188 | 2 | 26028 |

Metrics: `tmp/batch/pyramid-cestius/metrics.json`, no flags. Contact sheet: `tmp/batch/final/pyramid-cestius.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/pyramid-cestius/pyramid-cestius-procedural-near-light-top.png`. The current restored exterior is checked against modern photos 3, 4 and 6; historic engravings and the interior photo were excluded. All four slopes and the mapped base align in the red-ring plan. The fine masonry is restrained and far keeps the same steep silhouette. An enlarged bound avoids automatic camera clipping. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.
