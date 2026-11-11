# BT Tower — London

BT Tower in its current bare-gallery configuration: slender glazed shaft, exposed communications galleries, stacked observation/restaurant drum, white upper cap and open lattice antenna above the Museum Telephone Exchange podium.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/BT_Tower)
- [BT archive: history, tower profile and 158 m restaurant floor](https://www.bt.com/bt-plc/assets/documents/about-bt/our-history/bt-archives/information-sheets-and-timelines/bt-tower.pdf)
- [London Museum: tower history and current bare-gallery exterior](https://www.londonmuseum.org.uk/collections/london-stories/bt-tower-formerly-futuristic-landmark/)
- [OSM provider footprint / building part 5022282](https://www.openstreetmap.org/way/5022282)
- [OSM provider footprint / building part 192156426](https://www.openstreetmap.org/way/192156426)
- [OSM provider footprint / building part 331901546](https://www.openstreetmap.org/way/331901546)
- [OSM provider footprint / building part 331901547](https://www.openstreetmap.org/way/331901547)
- [OSM provider footprint / building part 331901548](https://www.openstreetmap.org/way/331901548)
- [OSM provider footprint / building part 331901549](https://www.openstreetmap.org/way/331901549)
- [OSM provider footprint / building part 331901551](https://www.openstreetmap.org/way/331901551)
- [OSM provider footprint / building part 331901552](https://www.openstreetmap.org/way/331901552)
- [OSM provider footprint / building part 331901553](https://www.openstreetmap.org/way/331901553)
- [OSM provider footprint / building part 192156427](https://www.openstreetmap.org/way/192156427)
- [OSM provider footprint / building part 331903528](https://www.openstreetmap.org/way/331903528)
- [OSM provider footprint / building part 331903529](https://www.openstreetmap.org/way/331903529)
- [OSM provider footprint / building part 331903530](https://www.openstreetmap.org/way/331903530)
- [OSM provider footprint / building part 331903531](https://www.openstreetmap.org/way/331903531)
- [OSM provider footprint / building part 331904806](https://www.openstreetmap.org/way/331904806)
- [OSM provider footprint / building part 331904913](https://www.openstreetmap.org/way/331904913)
- [File:1350342 II BT COMMUNICATION TOWER, CLEVELAND MEWS Camden London 20250612 0003.jpg — Tilman2007; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:1350342_II_BT_COMMUNICATION_TOWER,_CLEVELAND_MEWS_Camden_London_20250612_0003.jpg)
- [File:London - View from London Eye - BT Tower - panoramio.jpg — giggel; CC BY 3.0; comparison only](https://commons.wikimedia.org/wiki/File:London_-_View_from_London_Eye_-_BT_Tower_-_panoramio.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/bt-tower-london/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.1409212,51.5202424,-0.1368788,51.5227576.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest antenna | 189 m | Published BT total; OSM 188.4 m differs by 0.6 m |
| Main structure / cap | 177 m | Published structure height |
| Widest gallery diameter | 20 m | OSM 313 m² widest gallery, photo corroboration |
| Shaft glazing | 24–100 m | Mapped building part 331903529 |
| Restaurant / observation drum | 144–166 m | Mapped part 331903528; widest floor at 158 m in BT archive |
| Exchange podium levels | 6 / 10 / 12 / 18 m | OSM part heights; facade openings estimated |

Origin `[-0.138804,51.521442]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

The tower centre comes from the mapped circular way 5022282. Exchange frontage controls [-0.1383866,51.5212396] and [-0.139104,51.5209266] establish its 55° street skew; exact mapped rings are converted directly into the exported east/south frame. Rotation is already baked and must not be applied by the host.

## Model and foundation

The circular shaft uses adjacent glazing and pale structural strips, followed by exposed concrete core and projecting communication galleries. The broad restaurant drum, narrow neck, white cap and antenna remain in far. Bare modern communications galleries omit the microwave dishes visible in historic photographs. The full mapped telephone-exchange outline is modeled at its part heights because its provider footprint contains the tower base; separate neighbouring offices remain outside ownership. Window rows are coplanar partitions, not layered quads. Every lattice antenna leg runs from the supported cap to a terminal supported by the top mast; diagonal ends meet legs in both LODs. Local y=0 is a rigid foundation with no surrounding plaza or terrain surface.

Published 189 m total and OSM 188.4 m disagree slightly; 189 m is used. Main structure 177 m, gallery diameters/levels follow mapped parts. Equipment-ring thickness, antenna lattice, exchange facade bays and roof details are photo estimates. Modern dish-free exterior; proposed hotel conversion is not modeled. No lettering or brand display graphics.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 18197 | 6 | 220668 |
| far | 5065 | 6 | 72192 |

Deterministic QA: `tmp/batch/bt-tower-london-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/bt-tower-london.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/bt-tower-london/bt-tower-london-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/bt-tower-london/bt-tower-london-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

The automatic contact sheet cropped the upper tower on the first look; final framing uses `tmp/batch/bt-tower-london-bounds.json` and a padded, rights-checked reference image. The final head/cap/antenna, wider restaurant tiers, cylindrical shaft and bare communications-gallery voids match the modern references. The small podium windows initially overlapped because jamb widths used facade fractions; corrected to metre-based widths and checked with zero depth cycles. Two looks; final far/night keeps the full tower and mapped exchange skew. Antenna tests check each brace/leg terminal against its named support geometry and deliberately detached negative controls.

Post-delivery far-window audit: the lower24–100 m glazed shaft now has0.70 m adjoining metal row divisions in far, replacing the0.40 m hairlines that weakened at road scale. Ten coarse rows, the full silhouette and triangle count remain; near geometry is unchanged. A side-ray regression pins repeated horizontal divisions and bounded glass runs, and updated exported contact/far-night sheets were inspected with zero deterministic flags or depth cycles.

Independent-review revision: Far office bays and rows are grouped more coarsely while retaining visible horizontal transoms;18-sided shaft/gallery shells preserve the rounded silhouette. Sub-pixel exchange mullions are reduced; all near geometry is unchanged.

Far cost: 8681 → 5065 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/bt-tower-london.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
