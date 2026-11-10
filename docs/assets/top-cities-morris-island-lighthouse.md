# Morris Island Lighthouse, Folly Beach

Original procedural interpretation of the surviving 1876 lighthouse, modern circular sheet-pile cofferdam and above-water masonry foundation. No reference images, textures, meshes, lettering or logos are shipped.

## Sources and dimensions

- [SC Department of Archives and History: 1876 tower, NRHP summary (height conflict)](https://www.nationalregister.sc.gov/charleston/S10817710119/index.htm)
- [Taylor Marine: foundation stabilization, 72 ft cofferdam](https://taylormarineconstruction.com/wp-content/uploads/2019/04/the-morris-island-lighthouse-phase-one-foundation-stabilization-project.pdf)
- [Save the Light: history and current preservation](https://savethelight.org/about/lighthouse-history/)
- [OSM tower 1528926180](https://www.openstreetmap.org/way/1528926180)
- [Morris Island Light · AlpineWhiteMavic, 2018 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Morris_Island_Light.jpg)
- [Morris Island Light, April 2014 · Niagara (CC BY-SA 3.0)](https://commons.wikimedia.org/wiki/File:Morris_Island_Light,_April_2014.jpg)

| Feature | Metres | Basis |
| --- | ---: | --- |
| Cofferdam diameter | 21.946 | Sourced: contractor's 72 ft PZ-40 sheet-pile cofferdam |
| Overall tip | 49.07 | Estimated: adopted 161 ft commonly published overall; SCDAH summary says 150 ft, not treated as agreement |
| Shaft lower / upper diameter | 9.9 / 5.08 | Estimated from photographs; SCDAH's stated 16 ft 8 in base conflicts with taper/proportions and appears to describe upper diameter |
| Shaft top / gallery / lantern eave | 39.7 / 42.94 / 48.02 | Estimated from aerial photograph |
| Exposed cofferdam / masonry base top | 1.65 / 3.1 | Estimated waterline exposure; tide varies |

The 2018 aerial is verified as this tower by its band pattern, damaged coatings, gallery supports and circular sheet-pile enclosure, not the modern triangular Charleston Light. The 2014 ground photo depicts the same banded tapered brick tower; each Commons file page was checked for its author and license. Photographs stay in ignored local scratch only.

## Frame and foundation

Origin `[-79.8836273,32.6953667]`, centre of OSM tower way **1528926180**. Cofferdam/protective ring is **926973307**. Metres, +X east, +Y up, +Z south. Local `y=0` is an estimated calm water surface at the cofferdam, not an absolute tidal or sea-level datum. No submerged piles, DEM, bathymetry or Mercator scale is baked in. The building ring is about 5 m across, much narrower than the photographic exterior; it is retained as source evidence while the original procedural shaft uses a labeled estimate. OSM ring north/south controls `[-79.8836319,32.6953891]` / `[-79.8836283,32.6953442]` fix the centre and geographic position. Round geometry needs no additional rotation; windows are approximately oriented south. The 72 ft protection ring is modeled at its sourced diameter rather than overstating OSM survey precision. Host replacement must own the tower and protection ring only.

The visible foundation is a rigid filled cofferdam and masonry plinth; hidden timber piles, concrete grillage and later micropiles are omitted. A host selects its water surface datum and places this model rigidly. The near sheet-pile ribs have no seabed extensions; no surrounding water plane is part of the asset.

## Modeling decisions and omissions

The taper, faded brick-brown/cream band order, corbelled black gallery and open lantern define the silhouette. Bands replace adjacent shaft surfaces rather than cover a second cylinder. Shaft window facets are cut out and replaced with inset glazing. Far keeps both windows, galleries, support brackets, posts and rail contacts, using half the circumferential segments and omitting sheet-pile corrugations. Both LODs preserve height and foundation bounds. No historic keeper's house, submerged foundation, dock or small damage marks; coating weathering is represented by muted colors, without patchwork or textures. Slight real lean is omitted because it is not surveyed.

## Measured cost and evidence

near: 5,376 triangles / 6 draws / 91,888 bytes; far: 2,808 triangles / 6 draws / 54,704 bytes. No remaining qa-metrics flags. Final contact sheet: `tmp/landmark-qa/sheets/morris-island-lighthouse.jpg`; metrics: `tmp/chs4/morris-metrics.json`. The shared automatic camera fit clips tall towers, so the final sheet uses `--bounds tmp/chs4/morris-framing.json` to show the complete oblique silhouettes. Export: `node scripts/build-top-cities-landmarks.mjs morris-island-lighthouse` through the shared meshopt/quantization codec. QA metrics and final contact sheet are local evidence under `tmp/landmark-qa/`. Browser inspection compares exported near/far, facade/back/roof/street/detail and light/dark materials. This is library verification only.

**Cityscape: not tested / Full 3D world: not tested.** No host application is present. Product permission/ownership acceptance remains a human maintainer check; no legal acceptance or signature was generated.
