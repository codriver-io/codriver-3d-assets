# Parc des Princes — Paris

Oval concrete stadium with fifty repeated cantilever fins, a sagging roof ring and a genuine open football bowl.

## Sources and rights

- [IESF engineering account:50 concrete cantilevers and28 m roof](https://www.iesf.fr/offres/doc_inline_src/752/2-Stades_en_France.pdf)
- [Ville de Paris:current1972 exterior and2016 internal renovation; Emmanuel Nguyen Ngoc aerial photo,ARR](https://www.paris.fr/pages/le-parc-des-princes-des-courses-cyclistes-au-temple-du-football-33335)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Parc_des_Princes)
- [OSM way 87946639: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/87946639)
- [OSM way 35470731: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/35470731)
- [Reference photograph: File:Boulevard Périphérique vu depuis Avenue Parc Princes - Paris XVI (FR75) - 2022-05-28 - 2.jpg — Chabe01 — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Boulevard_P%C3%A9riph%C3%A9rique_vu_depuis_Avenue_Parc_Princes_-_Paris_XVI_(FR75)_-_2022-05-28_-_2.jpg)
- [Reference photograph: Le Parc des princes aerial exterior — Emmanuel Nguyen Ngoc / Ville de Paris — All rights reserved; no reuse licence stated; comparison only](https://cdn.paris.fr/paris/2021/04/01/huge-972e08739d71bcd7e6f09fc218af16d1.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/parc-des-princes/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Canopy outer edge | 28 | Published engineering description |
| Fin crest | 36 | Photo estimate; OSM48 m not adopted |
| Portiques | 50 | Published engineering description |
| Mapped envelope | about251×191 | Mapped, rotated elliptic envelope |
| Turf and field margin | 0.12 | Authored above-grade datum |
| Seating tiers | 2 | Published/current exterior geometry |

Origin `[2.2530714905413247, 48.84143411337006]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The literal outer and inner OSM rings establish the stadium and its open roof aperture. Fifty closed,tapered portiques reach grade and contact the canopy at their inner tips. The roof is a closed annular shell,not a solid oval lid. Two stepped seating tiers surround the mapped football field; field margin and turf are adjoining surfaces0.12 m above grade,without paint overlays. Both LODs retain every structural fin; far coarsens seating and ring samples. The historical1932/1953 stadium photos were rejected. The current2022 roadside exterior confirms the1972 structural version; the Ville de Paris aerial illustrates the same exterior before2016 seating changes,which are not copied. No club imagery,branding,lettering or neighbouring Jean-Bouin stadium.

1972 Taillibert stadium exterior, validated against2022 road view; aerial reference predates2016 interior refit, so seating is simplified to muted unbranded blue. Fifty concrete cantilever portiques and open mapped roof aperture retained. Engineering source gives roof28 m; fin crest36 m is a photo estimate; OSM48 m is inconsistent and not adopted. No road underpass, branding, lettering, field paint or surrounding plaza.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16506 | 6 | 318028 |
| far | 4856 | 6 | 111068 |

Deterministic metrics: `tmp/france/parc-des-princes/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/parc-des-princes.jpg`. Mapped orientation/top check: `tmp/france/shots/parc-des-princes/parc-des-princes-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Second look: corrected a field-margin triangulation that overlapped the turf at grazing angles. A robust polygon difference now partitions the two ground surfaces,and regression rays reject concrete over the pitch; seating tread/riser normals and all canopy-tip contacts are also pinned.

## Independent review follow-up — 2026-11-10

Nit: darkened the concourse opening material to a muted shadow colour and reduced horizontal infill from four tiers to three, so the exterior reads as open concrete. Preserved all fifty fins, the open bowl and field clearance; reduced near/far triangles by 400/200. Kept the tested exterior plane after a deeper setback exposed seat back faces.

Fresh exported comparison: `tmp/france/fixes/sheets/parc-des-princes.jpg`; deterministic metrics `tmp/france/fixes/parc-des-princes-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
