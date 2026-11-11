# Tour métallique de Fourvière — Lyon

Open tapered four-leg iron lattice tower with square observation deck,broadcast equipment and pale modern antenna.

## Sources and rights

- [Ville de Lyon:86 m historic tower,broadcast relay since1953](https://mairie2.lyon.fr/lieu/moderne-17eme-18eme/tour-metallique)
- [Lyon tourism:85 m historical tower](https://www.visiterlyon.com/decouvrir/sites-et-monuments/contemporain/la-tour-metallique)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Metallic_tower_of_Fourvière)
- [OSM way 45144233: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/45144233)
- [Reference photograph: File:Lyon - Tour métallique de Fourvière, septembre 2015.jpg — Yann Caradec from Paris, France — CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Lyon_-_Tour_m%C3%A9tallique_de_Fourvi%C3%A8re,_septembre_2015.jpg)
- [Reference photograph: File:Tour métallique (Lyon, 2026, de nuit).jpg — Corentin Eustacchi — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Tour_m%C3%A9tallique_(Lyon,_2026,_de_nuit).jpg)
- [Reference photograph: File:Tour métallique (Lyon, 2026, 2).jpg — Corentin Eustacchi — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Tour_m%C3%A9tallique_(Lyon,_2026,_2).jpg)
- [Reference photograph: File:Lyon Emetteur TV 02.jpg — GIRAUD Patrick on fr.wikipedia — CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Lyon_Emetteur_TV_02.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-metallique-fourviere/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Modern antenna crest | 101 | Contemporary secondary source; estimate |
| Historic ironwork | 85.9 | Historical height; City rounds86,office85 |
| Observation deck | 76 | Photo estimate |
| Mapped base | about19×19 | OSM controls |
| Rigid base | 6 | Photo estimate |
| Square shaft top | 5 | Photo estimate |

Origin `[4.82234713, 45.76390407]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The mapped cross-shaped base and two of its controls establish the tower bearing. Four distinctly tapered legs and eight vertical stages of real crossed webs leave open air through the entire shaft. Every web touches the physical leg geometry in both LODs;shortened-web negative controls check the contact test. The square observation platform,sheathed technical cabin,upper open pedestal and pale antenna distinguish the current broadcast version from its1894 appearance. Three simplified dishes touch short steel brackets. Modern101 m overall and historic85.9 m ironwork describe different versions;the actual deck/taper dimensions are photo estimates. Base service wings,stairs and neighbouring buildings excluded; hill altitude is not included in y. Four current exterior images,including2026 day/night,show the same antenna version.

Current101 m includes the TV antenna; historical85.9 m ironwork height versus City86 m/office85 m rounded figures documented. Footprint supplied by mapped base;plinth6 m,deck76–79 m and tapered width profile are photo estimates. Four legs bear on rigid0 m base,no hill elevation baked. Adjacent service buildings excluded.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3266 | 6 | 58984 |
| far | 1994 | 6 | 41748 |

Deterministic metrics: `tmp/france/tour-metallique-fourviere/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-metallique-fourviere.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-metallique-fourviere/tour-metallique-fourviere-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Nit: added four grouped pale broadcast panels physically seated on the existing upper steel pedestal, strengthening the modern equipment silhouette while retaining the open lattice and 101 m mast. Added only 48 triangles in each LOD, with no extra draw call.

Fresh exported comparison: `tmp/france/fixes/sheets/tour-metallique-fourviere.jpg`; deterministic metrics `tmp/france/fixes/tour-metallique-fourviere-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
