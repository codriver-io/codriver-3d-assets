# The Wheel at ICON Park — Orlando Eye

Original procedural model of the 2015 observation wheel at 8401 International Drive, Orlando. The catalog ID retains the ICON Park name; Merlin restored the Orlando Eye brand in 2024. No images, meshes or textures are distributed.

## Sources and dimensions

| Item | Model | Evidence |
| --- | --- | --- |
| Overall height | 122 m (near AC caps reach 122.28 m) | [Official height](https://support.theorlandoeye.com/hc/en-us/articles/115002890851-How-tall-is-The-Orlando-Eye), 400 feet / 122 m |
| Capsules / radial spoke stations | 30 / 30 paired across rim depth | [Official facts PDF](https://www.theorlandoeye.com/media/nkylmsvm/the-orlando-eye-teacherresourceguide-grades3-5_new.pdf) |
| Main support legs | Eight | Same official facts PDF |
| Public opening | May 4, 2015 | [Official history](https://www.theorlandoeye.com/explore/the-orlando-eye/history/) (dossier also mentions April 29 first passenger) |
| Rim radius / hub elevation | 56.5 / 61.5 m | Estimated from overall silhouette and clearance |
| Capsule orbit / body | 58 m / 4.6 × 5 × 3.8 m | Estimated from [official daytime detail](https://www.theorlandoeye.com/explore/) |
| Foundations / axle | Feet u=±23,±28 m; west v=8,10 m, east v=-16,-19 m / 10.8 m | Photographic estimates |

[Steveo89, Orlando Eye.jpg](https://commons.wikimedia.org/wiki/File:Orlando_Eye.jpg), CC BY-SA 4.0, night aerial reference only. Official Merlin daytime detail and overhead purple sunset are copyright reserved, retained as reference-only in ignored `tmp/top-cities/the-wheel-icon-park/refs/2.jpg` and `3.jpg`; no redistribution. Source provenance is in the catalog.

## Frame and provider ownership

Real metres, +X east, +Y up, +Z south; local grade is y=0. Origin [-81.468199, 28.4432359] comes from the bounds centre of [OSM attraction way 331551657](https://www.openstreetmap.org/way/331551657). Two east-edge control points [-81.4680190,28.4429462] and [-81.4680269,28.4435288] establish the wheel-plane bearing 179.3168902113° (southward). This rotation is baked into each geometry; no host rotation is required.

The attraction outline measures about 65 m along the ground, whereas the raised wheel and capsules sweep approximately 120 m. Its north/south overhang is intentional and does not claim the neighboring buildings. The site way is tagged tourism=Attraction, without building or building:part. The adjoining SEA LIFE / Madame Tussauds building (331551654) is not modeled or masked. FOOTPRINTS records the attraction ring only; OSM_WAYS contains 331551657. The previous symmetric western foundation offsets placed three feet inside SEA LIFE way 331551654. Revised western offsets fit the real mapped open pockets; all footing corners and low leg surfaces clear the exact ring in both LODs. The adjacent outline is retained only in the landmark-specific test helper, never added to OSM_WAYS or FOOTPRINTS. Terrain fit still requires app review.

## Geometry and materials

Double white rim, thirty paired radial members, three circumferential tension ties per rim plane, near-only inter-spoke and cross-rim webs. Eight separately founded inclined legs converge on the axle. Thirty chamfered capsules stay upright; glass panes and white mullions partition surfaces without coplanar overlays. Far keeps every capsule and primary support, dropping fine cross-braces, mullions and rooftop AC boxes. Blue/pink named light/glow rim materials use white day colours. Glazing is opaque to keep six merged material draws and avoid sorting. Low boarding deck has two grade-access steps; ticket buildings, aquarium, landscaping, interiors and underground footings are outside scope.

## Reviewed provider intersection fix

Western foot axle offsets narrowed from 16/19 m to 8/10 m while retaining u=±23/±28 m and all eight connected legs. The mapped aquarium boundary, rather than a guessed circular spread, constrains their positions; reference-only aerial refs/3.jpg guides the support arrangement. No aquarium roof is authored and no unrelated extrusion is suppressed. A regression checks full footing corners and low leg triangles against way 331551654, and all member ends still meet their named supports. Capsule/rim geometry and export costs are unchanged.

## Review-fix verification (2026-10-12)

Inspected exported GLB six-view near/light and far/light sheets plus far/dark facade, entrance and detail sheets in `tmp/top-cities/shots/the-wheel-icon-park/review-fix/`, named `the-wheel-icon-park-glb-<lod>-<theme>-sheet.jpg`. These are the first look-fix round after the independent b4b review; no app captures or runtime changes were made.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 29,172 | 6 | 1,042,756 | 1018.32 |
| Far | 8,204 | 6 | 367,284 | 358.68 |

The three owned landmark suites pass **17/17**; all nine owned registry conformance checks pass. The required combined run is **474/477**, with unrelated failures in the-alamo (stale GLB bounds), edificio-metropolis (catalog readiness) and high-museum-of-art (near triangle budget). Log: `tmp/top-cities/skyview-atlanta/review-fix-tests.log`. Deterministic metrics for all three: `tmp/top-cities/skyview-atlanta/review-fix-metrics.json`, all budgets clear and no QA issues. Depth table generation and `--check` pass, with **zero dropped cycle edges**. The initial catalog run was blocked by another worker's missing Edificio Metrópolis document; later `node scripts/asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` were blocked by another worker's unregistered `/models/buildings/high-museum-of-art-far.glb`. No unrelated record was changed.

Cityscape and Full 3D world: the previous independent app review found FIX defects; these revised exports are **not tested in app yet**. The lead recaptures both modes and requests independent re-review. Provider lifecycle, regional-to-street transitions, DEM refinement and footing residuals remain separate integration gates. No app server, application bundle build, deployment or git write was performed.
