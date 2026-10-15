# Lake Eola fountain

Original procedural model of the 1957 Linton E. Allen Memorial Fountain, Orlando, Florida, in its post-2011 lighting state. The subject is the broad green dome in the lake; the Chinese pagoda on shore is a different structure and was excluded from the dossier references used for geometry. No external model, photograph or texture ships.

## Sources and dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Permanent outer rim diameter | 18.288 m / 60 ft | [Orange County Regional History Center](https://www.thehistorycenter.org/eola-fountain/), construction account |
| Date and form | 1957, green domed fountain on concrete blocks | [Smithsonian inventory](https://www.si.edu/object/linton-e-allen-memorial-fountain-sculpture:siris_ari_335305) |
| Structure crown height | 6.45 m | Estimated from photos, relative to the published diameter |
| Main dome | Radius 9 m, rises from 1.15 to 3.55 m | Photo estimate |
| Upper tiers | Radius 3.65 m to 5.55 m; radius 1.9 m to 6.45 m | Photo estimate |
| Spray height | 15 m | Representative low phase, estimated; historical peak is 75 ft per History Center |
| Surrounding lake | Basemap water only | Contextual teal disc removed after app review |
| Anchor | -81.37291941578947, 28.543637715789476 | Centroid of OSM fountain way 45775179 vertices |

Photographs studied: [Lake Eola and Orlando Skyline seen in 2024](https://commons.wikimedia.org/wiki/File:Lake_Eola_and_Orlando_Skyline_seen_in_2024.jpg), JER3L1337, CC BY 4.0; [Lake eola fountain](https://commons.wikimedia.org/wiki/File:Lake_eola_fountain.jpg), sun dazed, CC BY-SA 2.0. These remain under ignored `tmp/top-cities/lake-eola-fountain/refs/`. The dossier sheet also includes the separate pagoda; that image was not used as the fountain geometry reference.

## Frame and ownership

Metres, +X east / +Y up / +Z south. Local y=0 is the flat lake surface and rigid footing datum. No sea level, underwater depth, DEM or latitude stretch is baked in. The shared Overpass helper query for fountains, buildings and building parts within 95 m is saved in `tmp/top-cities/lake-eola-fountain/fountain-osm.json`. It returned fountain amenity way 45775179 and no buildings/parts. `FOOTPRINTS` retains this exact amenity ring; only the falling spray intentionally extends outside it. There are no neighboring building masks to add.

Mapped east edge (-81.3728220, 28.5436312) and west edge (-81.3730161, 28.5436289) establish the near east-west diameter, about 89 degrees compass bearing. The nearly round structure has no surveyed front. The estimated hexagonal base has a point east; rotation is already authored and the host must not rotate it. `padM=14` encloses the structure and falling sprays; world lake datum and terrain behavior still require app verification.

## Geometry and approximations

A shallow hexagonal base carries 24 piers, with open spaces beneath the broad circular rim. The broad green ribbed dome, raised central drum and two successively smaller domed tiers form the distinctive silhouette. Dark seams divide the actual surface rather than overlaying it. The light ring partitions the upper drum skin. The far model keeps all tiers and undercroft openings, reduces radial segments and halves the peripheral spray count. Six merged material draws in each LOD.

The dome panels use subdued green; concrete is pale grey-beige. Night has a dim green body, blue drum light and lilac crown. The chosen lighting is one representative combination, not an animation of the choreographed show. Jets are opaque closed stylized static geometry; the central plume is 1.5 m wide at its base and flares to 1.9 m near its crown, in pale white. Fine plumbing, access equipment, internal machinery, underwater 60-ft pilings, shoreline and lake animation are omitted. Rib/pier count and shallow hexagonal base are estimates, not surveyed construction details.

## Verification

Exported contact sheets and checks were completed on 2026-10-15. Cityscape and Full 3D world visual app verification is recorded in the review repair section below. Independent re-review remains pending.

## Export costs and evidence

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 6536 | 6 | 329100 | 321.4 |
| far | 2872 | 6 | 183304 | 179.0 |

Both variants have approximately 21.7 × 15 × 21.7 m bounds, including falling spray (near/far difference below 3 cm). The permanent rim is 18.288 m diameter. Building budget: near 60k triangles / 14 draws / 2.5 MB, far 12k / 8 / 500 KB.

Judged these ignored images against the two fountain reference photographs (not the pagoda):

- `tmp/top-cities/shots/lake-eola-fountain/reference-glb-comparison.jpg`: reference photos above exported near/far, light/dark overviews side by side.
- `tmp/top-cities/shots/lake-eola-fountain/lake-eola-fountain-glb-near-light-sheet.jpg`: overview, low facade, opposite side, above, crown detail.
- `tmp/top-cities/shots/lake-eola-fountain/lake-eola-fountain-glb-near-dark-sheet.jpg`: overview, low facade, above and detail.
- `tmp/top-cities/shots/lake-eola-fountain/lake-eola-fountain-glb-far-light-sheet.jpg` and `lake-eola-fountain-glb-far-dark-sheet.jpg`: the same four views, preserving the canopy steps and undercroft openings.
- `tmp/top-cities/shots/lake-eola-fountain/lake-eola-fountain-procedural-near-light-sheet.jpg`: procedural overview/facade/roof matches export.

The first sheet looked too pale and the pier feet were outside the estimated hexagon on some bearings. Darkened the green panel palette, moved all piers to radius 7.6 m so each foot meets the hexagonal base, and changed the static peripheral sprays to terminate at the lake surface. Final sheets retain the shallow broad dome, raised upper tiers and concrete undercroft in both LODs. Static water remains a deliberate stylization rather than a simulation.

Validation completed:

- Required combined command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/lake-eola-fountain/lake-eola-fountain.test.js` — 833 passed, zero failed; all seven landmark-specific tests passed in about 0.14 seconds alone.
- `node scripts/asset-catalog.mjs` — passed, 406 entries / 782 GLB variants. Earlier transient missing Wrigley/Capitol Records documentation from other workers resolved before the final check.
- `pnpm assets:preview` — passed, local inspector built into ignored `tmp/champlain-preview/`.
- `node scripts/landmark-depth-layers.mjs --ids lake-eola-fountain` and `--check` — passed; no material cycle edges dropped; cycles report empty.
- `.agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids lake-eola-fountain --out tmp/top-cities/lake-eola-fountain/qa-metrics.json` — no issues; zero backface hits (166 rays), zero coplanar and layered faces, no below-grade geometry or removable attributes.

The tests observe the published rim diameter, three canopy levels, full spray height, structural footprint containment and matching far silhouette. Every pier's foot and head is measured against the named hexagonal foundation and circular rim triangle surfaces with the pier excluded; deliberately shortened endpoints fail the contact predicate. A radial ray between piers verifies real open space beneath the dome. No structural beam/cable/walkway ends are present.

## Review repair g12ar (2026-10-15)

Removed the entire 25 m contextual teal disc and its unused palette entries, so the fountain now sits on the basemap lake. Extended the hexagonal foundation down to y=0 to keep its foot on the water datum after removing that disc. Widened and lightened the existing central plume at negligible triangle cost; retained the peripheral arcs and 15 m spray apex. No provider overlap was reported; exact OSM amenity way 45775179 and its ring are unchanged.

Judged exported near/light and far/dark contact sheets in `tmp/top-cities/shots/lake-eola-fountain/g12ar/`: overview, low facade, above and crown detail. The teal pad is absent, all three canopy levels remain, and white spray reads more broadly. Six material draws replace seven. Both owned landmark test files pass all 18 tests; the plume-independent canopy raycasts continue to verify the actual tier surfaces. Depth generation/check has no cycles, and focused geometry metrics report no issues (`tmp/top-cities/wrigley-building/g12ar-metrics.json`).

Cityscape: **verified visually** in local far/near/street app captures. Full 3D world: **verified visually** in the same views with Terrarium terrain enabled. The white rim meets the lake without the former teal disc, the green canopy remains visible, and no duplicate provider building appears. App screenshots are under `tmp/top-cities/shots/wrigley-building/g12ar/app/{city,world}/lake-eola-fountain-*.png`; the shared location holds both repaired assets. Reports show active models and expected LODs. Repeated terrain arrival/eviction, origin shifts, failed-load restoration and device performance were not tested; this is visual verification of the repair, not a general terrain rollout certification.

App captures used an isolated `/tmp/codriver-g12ar-slot-i` copy and scratch-only renderer bundle (source stamp `1e97b2922e20`), with Cityscape 3302/3303 and world 3304/3305. Shared `public/peregrine.js` was not rebuilt. `node scripts/asset-catalog.mjs` passed (406 entries / 800 GLBs), and `pnpm assets:preview` built the ignored local inspector. Captures have expected unauthenticated account/CORS errors but both landmark models loaded. No git writes, deployment or shared-tree app server was used.
