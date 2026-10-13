# Perot Museum of Nature and Science, Dallas

Original procedural model of Morphosis / Thom Mayne’s 2012 museum at 2201 North Field Street. Identity: a pale, horizontally striated precast-concrete cube above a recessed glass base, a diagonal glass escalator cartridge on the Woodall Rodgers facade, a triangular glazed atrium cut and a rolling landscaped plinth. Geometry is original and texture-free; no reference image or external mesh is exported.

## Sources, dimensions and geographic frame

- [Morphosis project description](https://www.morphosis-architects.com/projects/perot-museum-of-nature-and-science): cube of galleries above a landscaped base and a glass-encased 54-foot escalator. Search-index text was checked; the full site returned a fetch error.
- [CRSI case study](https://www.crsi.org/case-studies/perot-museum-of-nature-science/): six-story, 170-foot structure, precast facade and curved planted roof. Search-index text was checked; direct fetching returned 403.
- [Museum Wikipedia description](https://en.wikipedia.org/wiki/Perot_Museum_of_Nature_and_Science): 54-foot escalator within a 150-foot glass casing. The whole casing is modeled; the 54-foot dimension is not its exterior length.
- Provided OSM dossier `tmp/top-cities/perot-museum/osm.json`: [podium way 618964796](https://www.openstreetmap.org/way/618964796), [cube part 1188705976](https://www.openstreetmap.org/way/1188705976), [entrance roof 1188705975](https://www.openstreetmap.org/way/1188705975). © OpenStreetMap contributors, ODbL 1.0. The 44 m part tag is lower than the published overall height and was not used as the roof datum. Neighbouring Goldman Sachs offices are excluded.
- References inspected and licences checked: [Joe Mabel, panorama 02, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Perot_Museum_of_Nature_and_Science_pano_02.jpg), [Paul M. Budd, exterior of Escalator, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Perot_Museum_of_Nature_and_Science_exterior_of_Escalator.jpg), [ScheWo, southeast exterior, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:20230312_ScheWo_Perot_Museum_in_Dallas,_Texas,_exterior_view_from_southeast.jpg). Photos stay in ignored dossier storage. Unrelated plaque and interior photos in the dossier were excluded from exterior modeling.

| Feature | Value | Basis |
| --- | --- | --- |
| Overall roof height | 51.816 m | Published 170 feet, CRSI |
| Cube plan | 45.3 × 47.7 m | Mapped outline, not a published 52 m square |
| Concrete cube underside | 8 m | Photo estimate |
| Cartridge length | about 45.62 m | Approximation of published 150-foot casing |
| Cartridge section | 4.8 m wide × 6.7 m high | Photo estimate |
| Atrium cut, slots and panel relief | Parameterized | Photo estimates, not surveyed panels |
| Landscaped roof | about 0.8–7.5 m | Photo estimate and mapped footprint |
| Entrance canopy | 3.5 m | Estimated; simplified supported roof |
| Origin | [-96.80665, 32.78689] | Dossier anchor, near cube center |
| Facade outward bearing | 147° | Two mapped facade control points |

East/up/south metres, y=0 at local grade; geographic rotation is baked once. Southwest and southeast cube control points are [-96.8069692,32.7868135] and [-96.8065626,32.786592]. The three OSM rings retain exact coordinates. A fourth, explicitly authored ring covers the projected glass cartridge and its anchor/landing because OSM omits the overhang. All source vertices stay within the ring union plus 0.9 m for relief and frames. No terrain altitude or Mercator stretch is baked in.

## Model and LOD decisions

The facade is a closed, tessellated shell, with dense lower striations and broader upper panels. Adjacent lower panels share ridge heights, forming continuous horizontal runs with muted row-level contrast. Relief is part of the wall surface; it does not sit over a duplicate solid wall. Sparse narrow window slots replace wall cells, keeping the pale cube mostly solid. The front-right triangular atrium cut is glazed, and a tall concrete blade frames it. Both LODs keep this cut and the diagonal casing silhouette.

The cartridge is a closed inclined prism with separate coarse panes, perimeter bars, two long pane rows and transverse end caps. Its lower end is embedded in a concrete anchor; its upper underside meets a 3.8 m-wide inclined landing whose top follows the cartridge underside, with an inclined beam connected back into the concrete cube. The landing is inset 0.5 m from either glass side; the beam remains below the underside instead of crossing the upper glass. Glass is opaque, so interior escalator machinery is omitted. The green roof follows the mapped podium and uses a subdivided triangulated height field. The mapped entrance roof becomes a narrow canopy supported by four columns. Facade relief and roof subdivision are reduced in far; panes and framing remain separate. Seven merged material batches in both exports.

## Verification and costs

Build: `pnpm build:top-cities-landmarks perot-museum --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/perot-museum/perot-museum.test.js`. Tests assert measured roof and cube plan, complete footprint containment, glazed atrium by raycast, far silhouette, and actual end-cap/anchor/landing and cantilever-beam contact geometry in both LODs. A deliberately shortened frame end fails the support-distance criterion.

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 21,570 | 7 | 1,627 KiB (1,666,392 bytes) |
| Far | 6,156 | 7 | 462 KiB (472,984 bytes) |

`qa-metrics.mjs --ids perot-museum` reports no issues: no coplanar or unresolved layered faces, 0% backface hits, no removable lift attribute, no below-grade vertices and no far rhythm flags. Depth table generation and `--check` pass with zero material-cycle edges dropped. Catalog validation and local preview build pass. Landmark-specific tests pass in under one second. An intermediate combined conformance run passed all 601 tests. The final run passed 600/601: only `sixth-street-viaduct` failed its catalog/spec readiness consistency while another builder was in progress; all five Perot tests and all three Perot registry checks passed. An earlier CEC Palace readiness mismatch also cleared without modifying its files. Catalog validation passed again after final QA (336 entries, 604 variants). Screenshots inspected beside the photo sheet and southeast reference: `tmp/top-cities/shots/perot-museum/perot-museum-glb-{near,far}-{light,dark}-sheet.jpg`, comprising overview, facade, rear, roof, entrance and detail, plus `perot-museum-glb-near-light-top.png` and the combined `comparison-all.jpg` (photos followed by near light, far light, near dark, far dark).

The first exported sheet showed a chunky entrance wall and angular roof landscaping; it was changed to a column-supported canopy and a subdivided rolling roof. Upper panels were made broader, and the landing was shortened to sit beneath the cartridge end. The final comparison also restored the prominent upper horizontal window slot to both LODs. The facade, diagonal tube, recessed base and triangular atrium now read together. The contact-sheet check establishes exported asset appearance only; independent reviewer and app checks remain separate.

## Integration and limits

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Foundation is rigid at local grade; the lead must check DEM datum, complete pad coverage, entrance contacts, neighbour preservation, provider replacement, load-failure restoration and both-mode runtime shading. No app server, shared runtime edit, deployment or publication was performed. Only the allowed generated depth table is regenerated.

Detailed precast panel engraving, lobby/interior machinery, freeway, planted shrubs, stairs and exact terrain contours are omitted or simplified. The planted roof is muted olive; it is not photo-textured vegetation. Some narrow windows use representative rhythm rather than an as-built survey. Hardware performance is untested. Readiness describes the exported model, not terrain integration or public-release approval.

## Independent review b9a correction — 2026-10-13

Exposed horizontal landing stub and glass-crossing platform → inclined support beam beneath the cartridge and a smaller inclined landing inset from both glass sides. Checkerboard lower panels → shared ridge heights across adjacent columns, subdued colour and continuous horizontal relief rows; narrow slots preserved.

Fresh exported near/far light sheets inspected at `tmp/top-cities/shots/perot-museum/review-fix/perot-museum-glb-{near,far}-light-sheet.jpg`; far dark at `perot-museum-glb-far-dark-sheet.jpg` in the same folder. The entrance and detail views show the complete clean cartridge with support confined to its underside. Named geometry tests cover the review defects in both LODs, including free-end negative cases. Depth generation/check reports zero material cycles. Current exports still await lead app recapture and independent re-review in Cityscape and Full 3D world; previous b9 captures establish only the earlier reviewed appearance.

Validation after review fixes: all **11/11 landmark tests** and **6/6 scoped registry conformance checks** pass; the required combined registry run passed **628/629**, failing only Washington National Cathedral’s unrelated far byte cap. ID-scoped QA metrics report no issues or layered faces, and depth generation/check has zero dropped cycle edges. Shared catalog validation and local preview were attempted repeatedly but remain blocked by missing `docs/3d-top-cities-ut-tower.md`, owned by another builder; no unrelated files were changed.
