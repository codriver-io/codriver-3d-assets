# Tour CMA CGM — Marseille

Curving147 m port tower with two pale glass wings converging at a waist around a dark recessed central seam.

## Sources and rights

- [Operator:147 m,33 floors,completed2010](https://www.cma-cgm.com/news/1122/cma-cgm-pays-tribute-to-zaha-hadid-architect-of-cma-cgm-tower?cat=corporateinformation)
- [Architect:142.8 m curving tower;different roof/coordinate description](https://www.zha.com/projects/architecture/cma-cgm-headquarters?disclaimer=true)
- [Identity and published dimensions](https://fr.wikipedia.org/wiki/Tour_CMA-CGM)
- [OSM way 202481439: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/202481439)
- [Reference photograph: Fichier:Digue du Fort Saint-Jean, Marseille - panoramio (1).jpg — Patrick Nouhailler's… — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Digue_du_Fort_Saint-Jean,_Marseille_-_panoramio_(1).jpg)
- [Reference photograph: Completed tower exterior002 — Hufton + Crow — All rights reserved; comparison-only](https://www.huftonandcrow.com/projects/gallery/cma-cgm-headquarters/)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-cma-cgm/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall | 147 | Operator;architect142.8/OSM145 discrepancies |
| Floor courses | 33 | Operator;OSM34 |
| Converging waist | 38 | Photo estimate |
| Base-to-shaft transition | 58 | Photo estimate |
| Mapped base length | about85 | OSM plan and two control points |

Origin `[5.36587188, 43.3150886]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The literal mapped base and two far-separated controls establish the building bearing. A geographic loft joins that flared base to a narrower rounded upper shaft with nearly straight outer walls above the curved foot,with two pale blue glass wings converging through a38 m waist and separating above it. The central dark seam is recessed into the actual section,not applied as a decal. Horizontal slab courses and narrow vertical grids follow the bent skin;far preserves the same changing section,central notch and142.8–147 m stepped crown with coarser panes. Operator147 m overall takes precedence over architect142.8 m and mapped145 m;these datums are not fully reconciled,so fine vertical levels remain estimates. Completed coastal panorama and photographer close exterior confirm the2010 building;interior construction photos rejected. No lettering,CMA trademark,connected low office wing,motorway or provider pavement is included.

Operator147 m overall adopted; architect142.8 m and OSM145 m differ by datum/roof definition,documented estimates. Ground ring follows OSM;upper60 m-class shaft and142.8–147 m crown and37 m waist levels are photo-calibrated lofts.33 upper courses reflect operator floors versus34 mapped levels. No logo,lettering,adjacent wing or motorway.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 21406 | 4 | 386104 |
| far | 5806 | 4 | 118736 |

Deterministic metrics: `tmp/france/tour-cma-cgm/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-cma-cgm.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-cma-cgm/tour-cma-cgm-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

