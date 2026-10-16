# Pavillon Roger-Gaudry, Université de Montréal

Original texture-free procedural model of Ernest Cormier’s 1928–1943 principal pavilion, 2900 boulevard Édouard-Montpetit. This models the permanent exterior, not the neighbouring thermal plant, Metro exits or Direction des Immeubles. Reproduce with `pnpm build:top-cities-landmarks pavillon-roger-gaudry --no-check`.

## Sources and dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Architect / completion | Ernest Cormier / 1943 | [Parks Canada](https://www.pc.gc.ca/apps/dfhd/page_nhs_fra.aspx?i=84724&id=15416), construction 1928–1943 |
| Main wings | 24 m, six levels | [OSM way 4637289](https://www.openstreetmap.org/way/4637289) |
| Mapped long axis | approximately 284 m | OSM geographic envelope; model body 265 m plus mapped outer projections omitted |
| Tower envelope / shaft | 70 m / 14 × 16 m | Photographic estimate fitted to OSM tower 723263433; height not surveyed |
| Crown / lantern | Three setback stages, 50–55 / 55–60 / 60–69.5 m; finial to 70 m | Photographic estimate; final g22br correction, no cap slab or dome |
| Solariums / auditorium | 7 m / 14 m plus 22 m hip roof | Photographic estimates |

Tower height sources conflict: the [university exhibition](https://espaces.umontreal.ca/exposition/roger-gaudry/) describes over 80 m; its [2008 optometry ceremony booklet](https://opto.umontreal.ca/fileadmin2/optometrie/documents/ETUDES/collation/EOUMcollation08.pdf) describes a 52 m tower and 280 m building length. They may use different datums, but that cannot be established from these sources. The requested approximately 70 m envelope is retained explicitly as an estimate, not asserted as a sourced dimension.

Reference photographs actually inspected: [UdeM Roger Gaudry.jpg](https://commons.wikimedia.org/wiki/File:UdeM_Roger_Gaudry.jpg), Armanidesu, CC BY-SA 4.0 (front/tower); [Pavillon Roger-Gaudry II.jpg](https://commons.wikimedia.org/wiki/File:Pavillon_Roger-Gaudry_II.jpg), Funke, CC BY-SA 4.0 (crown detail); [Pavillon Roger Gaudry1963.jpg](https://commons.wikimedia.org/wiki/File:Pavillon_Roger_Gaudry1963.jpg), Université de Montréal Centrale de photographie, CC BY-SA 4.0 (aerial plan). Commons file-page licences checked. Historical aerial used for architectural organization, not present landscaping. Dossier photo 1 is Victoria Coach Station and was excluded. No reference photograph is distributed.

## Frame, ownership and foundation

Origin [-73.614915,45.502714] is the mapped tower centre. Real metres, east/up/south, rigid y=0. Local long-axis u follows bearing 20°, front faces 290°. Two tower control points [-73.6149676,45.5027984] and [-73.6150338,45.5026710] establish the approximately 20° bearing. Rotation is baked once. Exact OSM rings and replacement ways: 4637289 (complete pavilion), 723263433 (tower), 723540387 (dome). A fourth authored ring covers the projecting frontispiece, entrance stairs and canopies in the central court, without claiming another provider way. Orthogonalized massing simplifies small service jogs; the largest main-envelope residual is 0.87 m. Four open courts remove the provider’s solid-outline approximation.

The explicit footprint pad uses a median datum from three points along the spine with an 18 m feather. Geometry does not bend or encode mountain altitude. This is a placement policy declaration, not verified DEM integration. Slope transitions, terrain lattice coverage, refined datum, foundations and entrances require lead app QA.

## Model and visual decisions

The comb plan retains six projecting fingers, four low glazed solariums, four open courts, the auditorium hip roof and stepped rooftop water-tank/stair blocks. The tower is now articulated by three uninterrupted slots on each face, recessed 1.25 m between substantial brick piers. All three slots on every shaft face are 1.4 m wide. Corner fins project 0.90 m from 24 to 50 m; three ribbed setback stages continue from 50 to 69.5 m, with a supported finial to 70 m. The 20 m crown occupies 43% of the 46 m tower above the wing cornice. Buff setback ledges replace the black cap slab, and the grey dome is removed. Slots follow the photographs' continuous vertical architecture rather than the former punched-window grid; flanking grooves are intentionally simplified as narrow slots.

A 26 m-wide, 29 m-high projecting frontispiece rises 5 m above the wing cornice. Its triple bronze doors, 0.9 m-recessed tall upper glazing bands, projecting masonry fins, stone portal jambs, attached muted-metal canopies (1.2 m deep, half their previous depth) and continuous stairs establish the ceremonial entrance. The stair/canopy ownership ring now includes this complete authored projection; no additional provider building is covered. Exact provider ways remain 4637289, 723263433 and 723540387.

Wings use one recessed aperture per vertical bay rather than independent window holes. Separate glazed rows alternate with darker buff recessed spandrels, keeping the vertical grouping legible under shared unlit shading. Near uses six rows and half-metre reveals; far keeps coarser, separate two-storey panes with 0.6 m reveals. Repeated sash bars were removed. Seven merged materials use pale buff brick (#e2cf9f), grey granite, dark glass, muted metal/bronze, grey roofs (#a1a297) and buff spandrels. Night dims those same surfaces without invented floodlighting.

Omissions: interiors, brick mortar, ornamental relief sculptures, fine railings, mechanical equipment, landscaping, precise irregular service annexes and every individual window. Window spacing, rooftop profiles and the tower height remain estimates. The structural 265 m long axis omits small service projections from the approximately 284 m mapped envelope. Geometry remains rigid at y=0, with the explicit median foundation pad; no terrain heights or deformation are baked in.

## Review correction — 2026-10-15, g20br

The independent g20b review identified a generic office-like shaft, flat entrance, weak vertical wing rhythm, olive colours and excessive weight. Rebuilt the shaft and frontispiece, grouped the wing glazing, lightened brick/roofs and removed repeated sash/reveal costs. Two exported-GLB look passes were used: the first confirmed the tower slots and entrance silhouette; the second added the recessed buff spandrel contrast so the vertical wing bays survive unlit app shading.

| Detail | Before triangles / draws / KiB | After triangles / draws / bytes / KiB |
| --- | ---: | ---: |
| Near | 43,601 / 6 / 1,999.1 | 18,330 / 7 / 899,988 / 878.9 |
| Far | 10,653 / 6 / 387.4 | 7,190 / 7 / 341,052 / 333.1 |

Both exported bounds remain identical, with maximum y=70 m and no meaningful below-grade geometry. The additional draw is the recessed buff spandrel material, which preserves vertical grouping without a texture or overlapping facade overlay. Size reductions are 56% near and 14% far; triangle reductions are 58% near and 33% far.

Final exported evidence: `tmp/top-cities/shots/pavillon-roger-gaudry/review-fix-final/pavillon-roger-gaudry-glb-{near,far}-{light,dark}-sheet.jpg`. Daylight near includes overview, back, roof, street and tower detail; far and night include overview, street and tower detail. First-pass comparison lives in `review-fix-1/`. Dossier references inspected are 2.jpg and 4-front.jpg; unrelated photo 1 remains excluded.

Final metrics: `tmp/top-cities/pavillon-roger-gaudry/review-fix-metrics.json`. Focused tests measure actual continuous slot recession at three heights, 90 cm fin projection, raised frontispiece roof, recessed entrance glazing, wing roofs, courtyards, footprint containment, no below-grade geometry and identical LOD bounds. Canopy ends contact named stone supports in both LODs, with a deliberately shortened negative case. No test asserts SPEC.ready.

Cityscape: **not tested** after this correction. Full 3D world: **not tested** after this correction. The g20b review reported no exposed foundations, terrain pokes or pad edges in the previous world captures; that evidence does not certify the revised model. The lead recaptures both application modes, shared material shading and provider replacement after handoff. No app bundle, app server, runtime layer or deployment was changed by this fix.

Final checks: all 10 dedicated geometry tests and all 3 id-filtered registry conformance tests passed. Catalog validation passed with 425 entries / 836 GLB variants. Final QA reported zero layered faces, zero coplanar pairs, zero back-face hits, no below-grade geometry, no unsupported-member flags and no window-rhythm flags; depth regeneration/check passed with zero dropped cycle edges. Logs are `review-fix-own-tests.log`, `review-fix-conformance.log` and `review-fix-catalog.log` under the landmark dossier. The lead should regenerate all delivered depth entries together before committing, because concurrent shared-tree writers can replace the generated table.

## Final crown correction — 2026-10-15, g22br

The g22a reviewer found an under-scaled crown, disappearing outer shaft slots and toy-like canopies. The lead requested a tall stepped crown ending in a ribbed lantern, with the black cap slab and grey dome removed. Shaft termination moved from 56 to 50 m; three fluted setbacks use 13 × 15, 11 × 13 and 9 × 11 m bodies, at 50–55, 55–60 and 60–69.5 m respectively. Three deeply inset dark openings per face and continuous 45 cm-projecting ribs preserve the Art Deco vertical rhythm. Every rib begins on a buff ledge, and the metal finial touches the closed lantern roof. Shaft glazing remains 1.25 m recessed, but every slot is now 1.4 m wide; 90 cm shaft fins remain. Door canopies are now muted metal and 1.2 m deep. Wings, frontispiece, ownership rings and rigid median slope-pad policy are retained.

| Detail | Before triangles / draws / bytes / KiB | After triangles / draws / bytes / KiB |
| --- | ---: | ---: |
| Near | 18,330 / 7 / 899,988 / 878.9 | 18,688 / 7 / 927,744 / 906.0 |
| Far | 7,190 / 7 / 341,052 / 333.1 | 7,764 / 7 / 372,788 / 364.1 |

Exported-GLB evidence: `tmp/top-cities/shots/pavillon-roger-gaudry/g22br-1/pavillon-roger-gaudry-glb-near-light-sheet.jpg` (overview, back, roof, street and crown detail), plus far daylight and near/far night sheets in the same folder. Compared against dossier `refs/4-front.jpg` and `refs/2.jpg`. One geometry look pass was used; the stepped silhouette, dark slots and supported ribs read clearly in both LODs, with separate far wing window rows. Dedicated tests pin the widened shaft slots, crown setbacks/deep openings and every crown rib's ledge contact on all four faces in both LODs, including deliberately shortened negative cases. Finial support, unchanged 70 m envelope, courts, frontispiece, canopy supports, footprints and far silhouette are covered; tests never assert SPEC.ready.

Focused validation: 12 landmark tests and 3 id-filtered registry checks passed. Geometry QA (`tmp/top-cities/pavillon-roger-gaudry/g22br-metrics.json`) reports zero layered faces, coplanar pairs, back-face hits, below-grade geometry or member/window flags. Depth generation/check passes with zero dropped cycle edges. Asset catalog validation passed (425 entries / 838 GLB variants); `pnpm assets:preview` builds the ignored local catalog viewer.

Cityscape: **not tested** after g22br. Full 3D world: **not tested** after g22br. Lead recapture and independent re-review remain, including a downhill street view showing the slope, pad edge and foundation contact. No app servers were started and shared `public/peregrine.js` was not rebuilt; app evidence remains the lead's shared-tree responsibility.
