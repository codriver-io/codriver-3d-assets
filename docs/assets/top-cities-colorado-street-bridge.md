# Colorado Street Bridge — Pasadena

Original procedural model of the 1913 reinforced-concrete Beaux-Arts bridge carrying Colorado Boulevard over the Arroyo Seco. The model depicts its restored historic architecture, including the safety railing visible in the dossier's 2019 roadway photo; temporary chain-link fencing is omitted. No photograph, texture, scan or traced mesh ships.

Build: `pnpm build:top-cities-landmarks colorado-street-bridge --no-check`.
Inspect: `/asset-preview.html?asset=colorado-street-bridge&view=overview`.

## Sources and dimensions

- [NPS heritage description](https://www.nps.gov/places/colorado-street-bridge.htm): concrete open-spandrel construction, curved path, 28 ft road, 5 ft sidewalks, balusters and multi-globe cast-iron standards.
- [City of Pasadena, 2019 historical resource technical report](https://www.cityofpasadena.net/commissions/wp-content/uploads/sites/31/HRTR-Colorado-Street-Bridge_11072019.pdf), pp. 14–23: 1,467.5 ft length and 148.5 ft height; nine major parabolic arches, six 113 ft, two 151.5 ft and one 223 ft; terminal abutments have small arched openings. These more specific span dimensions take precedence over the generic eleven-arch / 233 ft descriptions in summaries. The generator has eleven structural bays: nine major rib pairs and two pierced abutment groups, the latter with three small openings apiece.
- [OSM bridge outline 1188175312](https://www.openstreetmap.org/way/1188175312) and [road 17043345](https://www.openstreetmap.org/way/17043345). The dossier `osm.json` contains all approaches; exact way IDs and coordinates are retained in `colorado-street-bridge-alignment.js` (ODbL 1.0).
- Reference photographs (licences checked; comparison only, ignored dossier): Kleaphotographer, [sunset view from park](https://commons.wikimedia.org/wiki/File:Colorado_street_bridge_sunset_view_from_park.jpg), CC BY-SA 4.0; cmglee, [roadway facing west](https://commons.wikimedia.org/wiki/File:Cmglee_Pasadena_Colorado_Street_Bridge_roadway_facing_west.jpg), CC BY-SA 4.0; Bobak Ha'Eri, [aerial view](https://commons.wikimedia.org/wiki/File:2010-1101-06-ColoradoStBridge.jpg), CC BY 3.0. Additional comparisons: Kleaphotographer, [night lights](https://commons.wikimedia.org/wiki/File:Colorado_street_bridge_night_lights.jpg), CC BY-SA 4.0; Mike Dillon, [side elevation, 2005](https://commons.wikimedia.org/wiki/File:Pasadena_Colorado_Street_Bridge_2005.jpg), CC BY-SA 3.0. The historic 1920 photo was only contact-sheet context.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Structural length | 447.294 m | 1,467.5 ft, city report |
| Deck / roadway / each walk | 11.5824 / 8.5344 / 1.524 m | 38 / 28 / 5 ft, NPS |
| Deck height above flat datum | 45.2628 m | 148.5 ft, city report; actual datum is maximum arroyo clearance |
| Largest clear span | 67.9704 m | 223 ft, city report; differs from 233 ft in Wikipedia |
| Other clear spans | six 34.4424 m, two 46.1772 m | City report |
| Pier longitudinal width | 3 m | Estimated |
| End groups | 28.1574 m each | Residual from sourced total, estimated allocation |
| Rib thickness / rib centrelines | 1.6 m / ±4.35 m | Photographic estimate |
| Main arch spring / crown | 1.6 / 41.9628 m | Estimated |
| Smaller arch springs | 9 or 18 m | Estimated; unmodeled valley is flat in source |
| Lamp standards / top | ~5.5 m / 50.99 m | Estimated five-globe silhouette |

## Frame, approaches and terrain

Local metres east/up/south about `[-118.16414,34.14486]`. Rotation is already exported. The full mapped alignment includes 1,312.893 m of connecting roads, with the 447.294 m structure at stations 427.505–874.799. Its long S-shaped transition follows the mapped roadway, rather than an invented straight bridge. The OSM road's bridge tag includes pavement beyond the structural ends; the structural envelope is placed 22 m inside that tagged start. The exact longitudinal placement and pier ordering remain estimates requiring survey data. The source outline has a northeastern historic ramp extension; the generator models the current drivable fork instead of extruding that entire outline. No nearby buildings or the Ventura Freeway are owned.

Cityscape: the runtime roadway interpolates the two live approach grades with +0.10 m clearance across the entire alignment. There are no authored grade ramps or embankment walls. Every arch, pier, spandrel, abutment and footing belongs to the `substructure` material group, which the landmark layer hides in Cityscape on load, mode change and road sync. Only the road, raised walks, parapets, railing, alcoves and lamps remain above the flat ground. The reusable GLBs retain their original arroyo-floor datum (45.2628 m authoring deck); the shared surface fitting translates the road to the live runtime grade. This keeps authoring clearance distinct from the flat renderer's datum.

Full 3D world retains `bank-fit`, explicit endpoint ground controls, and a landmark-local world marker on the shared profile. The road follows the bank-interpolated datum with 0.12 m clearance; outside the structural span a terrain-delta callback prevents approach pavement sinking below the centreline DEM. The callback is shared by the fitted GLB, HD overlay and navigation API. Source attachment weights interpolate between fixed feet (local y=0) and the deck (y=45.2628 m), so supports reach their own DEM while their tops meet the road. Removing the earth meshes also removes the world-far brown approach wedges. No valley or corridor is flattened.

Both modes retain the landing width/colour tapers, the mapped eastern fork, rigid deck width and shared HD pavement/paint path. Authored double centre paint is a fallback; actual provider lane paint remains the accepted source where available.

## Modeling and verification

Paired parabolic ribs, transverse struts, tapered paired pier blades with stepped bases, arched upper spandrel lintels and slender columns preserve open space in both LODs. Moulded parapet coping, safety rail with near picket infill, semicircular overlooks and five-globe standards supply the driver-scale identity. Far keeps both rib rows, every main opening, coarse lintels, rail silhouette and three-globe lamp clusters. Small board-form joints, temporary fencing and exact post profiles are approximated or omitted.

Review correction g19ar (2026-10-15): removed the 40 m flat-map embankments and their world-far wedges; flattened Cityscape to live approach grade +0.10 m; split all below-deck structure into a reversible visibility group; deepened the upper arcade into semicircular heads (8 segments near, 6 far) and adjusted its columns to meet the spring line. The curved deck, paired main arch ribs, safety railing, overlooks and globe standards remain. The far lower safety rail is raised 0.11 m within its posts so its underside clears the coping underside by more than the far depth threshold. Both rail ends retain their endpoint posts.

| Export | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | ---: | ---: |
| Near | 58,970 / 16 / 2,863,788 | 57,404 / 15 / 2,805,128 |
| Far | 21,136 / 5 / 1,029,592 | 22,320 / 5 / 1,106,300 |

Exported near/light and far/dark sheets: `tmp/top-cities/shots/colorado-street-bridge/review-g19ar-glb/`. These show both faces, deck, underside and arcade detail. The near arcade has visibly open round heads, and far retains those openings with its coarse six-segment curve. The extra far segments account for its small triangle/byte increase; both variants remain within all bridge budgets.

## App evidence and validation

Both external landings and structural abutments are captured in both driving directions in near LOD, plus a forced-far overview in each mode. Provider: Protomaps; world uses Terrarium at zoom 15. Supersedes the original `app-final/` evidence and its Cityscape height table, which described the rejected 45 m flat-map approach ramps.

Cityscape: **verified locally**, both ends and both driving directions, near and forced far. All seven sampled road stations (0, 12, START, midpoint, END, L−12, L) return exactly +0.10 m above ground; both headings agree and crossing headings return null. The opened approach sheet confirms the curved roadway is flush with the flat map and the former walls are absent.

Full 3D world: **verified locally** with the same 18-capture matrix. Heights above query ground at those stations are 0.12000, 0.15832, 14.76887, 32.09823, 2.65205, 0.12000 and 0.12000 m. Both travel headings agree; crossing headings return null. At 270 near footing vertices, local DEM residuals range from −0.0000075 to +0.0000152 m. These are floating-point fitting residuals, not survey precision. The opened world approach sheet confirms the main arch/deck relationship and the absence of earth wedges at the landings. All captures are active with the requested LOD; world terrain is active throughout.

HD lane/paint verification remains **not tested** because this slot's optional `/osm-lanes` requests return 503; the existing shared overlay and paint ownership path is preserved, with authored centre stripes as fallback. The fallback near stripes are 0.11 m above pavement; far omits them. Neither surveyed deck/arch geometry nor Tesla hardware performance is established by these local checks. Temporary chain-link fencing and exact pier ordering remain approximations. Live paired navigation/congestion and hardware are not tested.

Final correction checks: landmark tests 11/11 and registry tests filtered to `colorado-street-bridge` 3/3 passed. `node scripts/asset-catalog.mjs` validated 425 entries / 806 variants; `pnpm assets:preview` built the local catalog. Depth layers regenerated with zero cycle edges; `--check` passed. Shared depth-layer output is excluded from this landmark commit: regenerate the Colorado entry after integration. No shared bridge runtime module was changed. The rebuilt app bundle is local QA output and is excluded from the commit.
