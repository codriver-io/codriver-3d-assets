# Opéra Bastille and Colonne de Juillet — Paris

Original texture-free procedural model, authored 2026-10-15. Carlos Ott's 1989 opera and the detached July Column share a geographic frame, not a plaza mesh. Editable source: `src/peregrine/landmarks/top-cities/opera-bastille/`. Export: `pnpm build:top-cities-landmarks opera-bastille --no-check`.

The [official Paris Opera description](https://www.operadeparis.fr/en/about/theaters-and-workshops/bastille-opera) establishes Carlos Ott, inauguration on 13 July 1989, metal/glass/stone and a Lanhélin granite entrance porch facing the column. [CMN history](https://www.colonne-de-juillet.fr/decouvrir/histoire-de-la-colonne-de-juillet) establishes the column's revolutionary memorial identity and 1840 inauguration. [CMN symbolism](https://www.colonne-de-juillet.fr/decouvrir/une-colonne-chargee-de-symboles) identifies the winged Genius and three inscription registers. The [City of Paris](https://www.paris.fr/pages/a-chacun-sa-tour-de-la-bastille-34384) rounds the full monument to 50 m; [French Wikipedia](https://fr.wikipedia.org/wiki/Colonne_de_Juillet) gives 50.52 m. The brief's 47 m is approximate; this model uses the full 50.52 m assembled height rather than treating that approximation as a shaft measurement. OSM has a conflicting older 46.3 m total tag; it controls placement, not the chosen total height.

## Frame and dimensions

Real metres: east/up/south, origin `[2.37056,48.85194]`, rigid flat local grade at y=0. No DEM, sea-level elevation or latitude stretch baked in; rotation is already exported. Mapped control points on the 50 m fly tower: approximately `[2.370589,48.852412]` and `[2.370862,48.852095]` establish the southeast axis at roughly 150°. The granite porch tangent is bearing 60°, with its outward normal toward 330°.

| Feature | Value | Basis |
| --- | ---: | --- |
| Opera fly tower | 50 m | Dossier OSM way 253222117 height |
| Other opera volumes | 13–47 m | Mapped building-part heights, dossier |
| Low outline infill/service wing | 4.5 m | Estimated where individual parts are absent |
| Column center from origin | x=-104.109, z=-136.494 m | Mapped way 227757683 |
| Column full height | 50.52 m | Published full-monument dimension above |
| Column shaft diameter | about 4.03 m at base | Published traditional measurement; slight taper photo-estimated |
| Porch outer width/top | 22 m / 26 m | Estimated from reference photographs |
| Porch stair landing | 5 m | OSM front steps plus photographic proportion; simplified |
| Column round base radius | 8.8 m | Mapped outer envelope, photograph-proportioned tiers |
| Capital, balcony, statue | 40.5–50.52 m | Photo-proportioned, original abstraction |

The opera outer way 78149064 and column outer way 227757683 form the two disconnected terrain rings. Exact stair-side replacement rings from ways 255526605 and 255526600 supplement the parent opera outline: their projections extend outside the parent mask and can leave provider slivers beside the entrance. Every provider part ID remains in `OSM_WAYS`; nearby apartment houses and connecting roads are not owned. Mapped substantial volumes are recorded in `opera-bastille-parts.js`.

## Geometry and materials

The exterior height-field shell removes hidden vertical faces and higher roof coverage, dissolving roof fragments before export. The Place de la Bastille front has a continuous reflective blue-grey curtain wall across its upper roughly 60%, with restrained stepped lower opaque panels, pale base and cornice bands. Glass is opaque reflective architectural glazing rather than alpha-blended interior glass: this preserves the same appearance in the runtime's shared unlit/vertex-shaded path. Near glass has reduced roughness and moderate metalness for the standalone PBR viewer.

The square granite portal encloses dark gridded glass recessed six metres behind its centre plane. The shell is cut away there, with connected jamb, head and sill reveals; no glass overlays an opaque slab. Near has a coarse entrance mullion grid; far keeps one dark entrance quad. The beam touches both named piers, and connected stair treads meet its landing. Mapped ramp polygons are not extruded as podium blocks. The main roof retains the cylindrical/cubic 50/47/44 m stepping, with brighter pale-metal upper walls and roofs; three small 40 m roof-plant volumes merge into their 36 m supporting mass. Other roof and rear dimensions remain estimates where not mapped.

Both LODs tile facade panes and mullions without overlapping surfaces. Side/rear near panels are coarser, and far retains separate horizontal rows and vertical bays with shared continuous mullion strips to reduce cost. The July Column, its bronze shaft/base/capital, balcony and gilded winged Genius geometry and palette are unchanged by the review fixes. Sculpture and inscription details remain original abstractions; no textures, interiors, road surfaces or external meshes are included.

Two bounded median-datum terrain rings support opera and column without flattening connecting roads. Cityscape and Full 3D world visual placement were checked independently in the app on scratch runtime build recorded below. This verifies the captured flat site, not terrain arrival, origin shifts, failed-load restoration or a full lifecycle/DEM residual audit; those remain separately gated.

## References and visual evidence

Ignored dossier sheet `tmp/top-cities/opera-bastille/refs-sheet.jpg` was personally inspected, especially the 2022 Arthur Weidmann facade (CC BY-SA 4.0), 1989 Jüppsche facade (CC BY-SA 2.0), Aleksandr Zykov side colonnade (CC BY-SA 2.0), Chabe01 column detail (CC BY-SA 4.0), and Roman SUZUKI night base (CC BY 3.0). Full titles, licence credits and source links are retained in the catalog record. Reference photographs stay in ignored scratch; none are committed or embedded.

Review correction (g6b): restored the glass curtain wall, cut and glazed the recessed entrance, brightened the layered roof and merged three small plant volumes, removed block-shaped stair infill, extended the provider mask with exact projecting stair-side rings, and coarsened facade tessellation without changing the monument. Two look/fix rounds used exported GLB sheets; the final evidence is under `tmp/next-200/fix/g6b/opera-bastille/`. `reference-comparison.jpg` places near/far facade, entrance and roof exports alongside the original photos; `final/near`, `final/far`, and `final/night` contain the export sheets. Full details, measured costs, check outcomes and remaining scope are in the accompanying `FIX-REPORT.md`.

| Export | Before triangles/draws/KiB | After triangles/draws/bytes/KiB |
| --- | --- | --- |
| near | 45,329 / 7 / 1,614 | 23,980 / 7 / 741,892 / 725 |
| far | 10,961 / 7 / 437 | 6,378 / 7 / 261,500 / 255 |

Final geometry QA passes with no issue flags, zero layered/coplanar area, zero back-face hits, no extra bridge attributes and no far rhythm flags. Depth regeneration/check reports zero cycle edges dropped. Five landmark tests pass, including rays pinning the upper glass wall and the recessed glazed entrance in both LODs. The requested full top-cities conformance run reports 804 tests / 802 pass / 2 unrelated Palais Bourbon failures (tiny footprint and absent manifest); the final opera-focused conformance selection passes. Catalog validation and ignored local preview generation are recorded in the fix report. Independent re-review remains the acceptance gate.

The larger white building immediately north of the stair approach is retained neighbouring cadastral fabric (ways 120588999/78148948), outside the opera replacement envelope; nearby historic buildings also appear in the reference photos. It is not flattened or deleted to clear the view.

## Palette follow-up — g6br

The g6br review found the light curtain wall rendered navy and the stone darker than neighbouring provider buildings. The light palette now uses silver-blue-grey glass `#a1b7c3`, near-white stone `#e3e6e2`, brighter frame `#f1f3ef` and silver-grey granite `#8a9397`. The fly-tower/stage-house roofs already use frame, so the brighter frame also lifts their stepped tops. The dark palette rises coherently to glass `#708ea1`, stone `#8a9ba3`, frame `#b4c0c5` and granite `#5d6e77`, while preserving a subdued night appearance. The column's bronze/base/gold colours are unchanged.

This pass changes material colours only. It preserves all geometry, the recessed entrance, stair contacts, window rhythm, footprint/provider ownership and terrain supports. The optional glazed roof pavilions need new supported roof geometry and are deferred; the review's porch-widening and ground-floor-colonnade suggestions are outside this palette-only follow-up.

One look/fix round inspected all four exported GLB contact sheets (`near-light`, `far-light`, `near-dark`, `far-dark`) under `tmp/next-200/fix/g6br/opera-bastille/`, covering facade, back, roof and street. `references.jpg` retains the reference sheet alongside them, and `reference-comparison.jpg` juxtaposes the 2022/1989 photographs with both LODs in both themes. The facade now reads pale silver-blue, and the layered upper volumes remain near-white by day and dimmer blue-grey at night. These are standalone GLB checks: current-palette Cityscape and Full 3D world captures remain pending lead recapture; prior g6b app evidence does not verify the new palette.

| Export | Before triangles / draws / bytes / KiB | After triangles / draws / bytes / KiB |
| --- | --- | --- |
| near | 23,980 / 7 / 741,892 / 724.50 | 23,980 / 7 / 741,880 / 724.49 |
| far | 6,378 / 7 / 261,500 / 255.37 | 6,378 / 7 / 261,488 / 255.36 |

Fresh metrics have no issue flags, layered/coplanar faces, back-face hits or far rhythm flags. Depth regeneration and check pass with zero cycle edges dropped. Validation logs and remaining integration scope are recorded in `tmp/next-200/fix/g6br/opera-bastille/FIX-REPORT.md`.
