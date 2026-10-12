# Buckingham Palace — London

Original procedural, texture-free building model of the present palace: Aston Webb's pale Portland-stone east front (1913), the royal balcony, three pedimented bays, flagpole, open quadrangle and older Nash garden wings. The Victoria Memorial, perimeter gates, freestanding gate lodges, gardens and Royal Mews are separate and are not modeled or owned.

## Sources and rights

- [Royal Collection Trust, History of the East Wing](https://www.rct.uk/visit/buckingham-palace/history-of-the-east-wing-of-buckingham-palace): Blore's 1847–1849 east wing closed the horseshoe court and introduced the central balcony; the present facade is Webb's 1913 remodeling.
- [Wikipedia, Buckingham Palace](https://en.wikipedia.org/wiki/Buckingham_Palace): published frontage 108 m, depth 120 m and height 24 m; Portland stone east facade. These are architectural dimensions, not a claim that the entire modern mapped ancillary envelope fits that rectangle.
- [OSM relation 5208404](https://www.openstreetmap.org/relation/5208404), outer way 348343214 and 18 building-part ways from the dossier: placement, plan, heights and floor counts. Derived geographic data © OpenStreetMap contributors, ODbL 1.0. The dossier lacked outer-way coordinates, so a single-object OSM API request supplied its nodes after the shared Overpass helper failed.
- Dossier Commons references, inspected together at `tmp/top-cities/buckingham-palace/refs-sheet.jpg`: *Buckingham Palace Garden Party in 2024*, Tony Hisgett, CC BY 2.0; *Buckingham Palace aerial view 2016*, SAC Matthew 'Gerry' Gerrard RAF/© MoD Crown Copyright 2016, OGL v1.0; *Buckingham Palace June 2017*, *Buckingham Palace at Dusk*, *Buckingham Palace 001* and *002*, MrsEllacott, CC BY-SA 4.0. Each original file page is linked in the catalog; the garden, aerial and 001 license pages were checked directly.

All geometry is original procedural work; photographs are visual references only and remain in ignored scratch. No photograph, texture, scan or downloaded mesh is shipped.

## Dimensions and geographic frame

| Element | Model | Basis |
| --- | --- | --- |
| East frontage | approximately 108 m | published 108 m; mapped front way 1226754902 |
| Principal roofline | approximately 24 m | published 24 m; OSM front height 24 m |
| Main palace depth | approximately 123 m | OSM main ranges; published core depth 120 m |
| Older ranges | 6–24 m | mapped part height tags; chapel estimated 12 m |
| Flagpole tip | 33 m above local grade | estimated from reference proportions |
| East-front windows | 39 bays, three rows | photographic approximation of repeated bays |
| Central pediment | 19 m wide, apex 24 m | photographic estimate |
| Music Room roof | low curved dome, approximately 21.7 m | mapped curved part and photographic estimate |

Origin `[-0.14194, 51.50083]` is the scaffold's nearby structural anchor, not a claimed footprint centroid. Coordinates are real metres, +X east, +Y up, +Z south; y=0 is rigid local flat-map grade. The facade edge from `[-0.1421985, 51.5017631]` to `[-0.141345, 51.5009548]` runs approximately 147 degrees from north, placing the outward east-front normal at 57 degrees. Rotation −57 degrees is baked once into the geometry and GLBs. The host must not rotate it again.

`footprint.js` includes the main outer ring and every modeled building part, including the low wings and rear chapel; `OSM_WAYS` contains the relation, outer way and all 18 parts. Courtyard negative space remains open in the authored geometry. Provider hole handling still requires an app check. A 1.6 m horizontal envelope tolerance permits projecting cornices and windows. The model keeps rigid foundations; no absolute altitude, DEM or Mercator stretch is baked in. `padM: 150` is an unverified flat-site placement hint, not terrain certification.

## Modeling and approximations

Mapped part outlines provide the stepped massing instead of an enclosing box. The east front has three discrete window rows, separated storeys, projecting giant-order pilasters, a central columned portico and balcony, corner and central triangular pediments, open roof balustrade, rusticated lower-storey joints and three arch-shaped gate surfaces. The garden front keeps the curved Music Room bay, a low dome, tan older wings and chimney groups.

The subdued palette separates Portland stone, older warm stone, pale trim, gray lead roofs and dark window glass. Selected first-floor windows become warm in the dark theme through the `glow` material. Floodlighting is simplified, not a calibrated reconstruction. Relief is a small geometric shield with paired heraldic supporters, not a detailed sculpture. The flag is a neutral muted red rectangle, not a historically precise Royal Standard or weather animation. Roof pitches and interior roof equipment are simplified to flat lead roofs and parapets; neither interiors nor temporary restoration scaffolding are modeled. The forecourt gates are deliberately excluded; entrance arches on the facade are dark surfaces rather than traversable interiors.

Far keeps the same bounds, open courtyard, balcony, three pediments, flagpole, individual roof-balustrade openings and all east-front bays. Secondary rear windows use a coarser discrete grid; near-only muntins, frames, relief and chimney pots are removed. Both variants use eight merged material draws.

## Export costs and verification

| LOD | Default-scene triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 16,200 | 8 | 823,176 | 803.9 |
| Far | 6,072 | 8 | 311,208 | 303.9 |

Export: `pnpm build:top-cities-landmarks buckingham-palace --no-check`. Both GLBs are self-contained, texture-free and within the building budgets. No removable bridge attributes remain. The bounds of near and far are identical.

I inspected the original reference sheet and the first procedural near/light sheet. It exposed the plain Music Room bay and overly dense detail on hidden connecting walls. The geometry checks also found reversed parapet normals and buried windows; those faces were reversed and windows hidden by adjoining ranges were removed. A curved low Music Room roof and separate curved-bay windows were added. A final support audit extended roof balusters to their cornices and added explicit corner posts for each roof rail; fresh exported sheets were then inspected. Material ordering was corrected by giving far windows the same front/back ordering as near windows and unifying intersecting pilaster/cornice trim.

Final exported evidence inspected:

- `tmp/top-cities/shots/buckingham-palace/reference-export-contact.jpg`: reference photographs next to exported near/light, far/light, near/dark and far/dark facade, overview, garden and central-detail views.
- `tmp/top-cities/shots/buckingham-palace/buckingham-palace-glb-near-light-sheet.jpg`: overview, facade, roof/plan, garden, street and balcony detail; confirms orientation against red mapped footprint rings.
- `tmp/top-cities/shots/buckingham-palace/buckingham-palace-glb-far-dark-sheet.jpg`: the same views at far/night; confirms surviving roofline, balustrade and discrete window rhythm.
- Additional final near/dark and far/light sheets in the same directory were included in the combined comparison.

Twelve focused tests pin the front width, roofline, supported flagpole, courtyard sky opening, discrete windows, mapped envelope and balcony/column/cornice support contacts in both LODs; a deliberately raised cornice endpoint proves the contact assertion can fail. Geometry metrics report no unresolved issues. Depth regeneration reports zero dropped cycle edges; `--check` passes.

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. No app server, provider replacement, terrain datum, lattice coverage, delayed load, driving, mode switch or hardware test was run by this builder. `SPEC.ready = true` means the authored exports and catalog are ready for the lead's integration and independent review, not that either runtime mode is verified.

Shared-validation exception: the requested combined registry/landmark test run passed all Buckingham Palace cases but failed the unrelated `high-museum-of-art` near budget (76,308 triangles versus 60,000) and an `adam-toren` spec/catalog readiness mismatch while that builder was in progress (479 of 481 cases passed). The catalog-wide command was retried and failed because another builder had not yet created `docs/3d-top-cities-fairmont-hotel-vancouver.md`. An isolated scratch catalog containing the unchanged Buckingham Palace record, source, documentation, manifest and GLB links passed `loadAssetCatalog`; no other builder files were changed. The lead should repeat shared validation after those builds settle.

## Independent-review correction, 2026-10-12

Added shallow alternating triangular/segmental stone crowns with heavier first-floor jambs and sills outside the central portico in near. Crowns use closed shallow solids in the existing trim material; far window grid, roof balustrade and palace silhouette remain unchanged. Removed duplicate arc endpoints so the segmental solids have no degenerate support-test triangles.

Inspected exported near/light and far/dark sheets at `tmp/top-cities/shots/buckingham-palace/review-fix-final/buckingham-palace-glb-{near-light,far-dark}-sheet.jpg` against the dossier references and b6a review. The sheets show the corrected feature, opposite facades and complete main silhouette; ornament remains a photographic approximation. No more than two look-fix rounds were used.

Current validation supersedes earlier concurrent-build exceptions: the combined registry and four-landmark run passes **506/506 tests**, including the graded-lawn and pointed-dormer regressions. Exported geometry QA reports all four on budget with no issues. Depth regeneration/check passes with **zero dropped cycle edges**; the shared generated table may be overwritten by concurrent workers, so the lead regenerates all IDs before commit. `node scripts/asset-catalog.mjs` validates 286 records / 560 GLB variants and `pnpm assets:preview` builds the ignored local catalog.

Cityscape and Full 3D world remain **not tested by this correction worker**. The independent review inspected pre-correction app captures, but new unobstructed app shots, shared runtime shading, provider ownership and Jefferson's graded perimeter/terrain-pad contact are the lead's required recapture and re-review gates.
