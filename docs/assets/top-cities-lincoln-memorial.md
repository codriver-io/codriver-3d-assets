# Lincoln Memorial, Washington

Original procedural model of Henry Bacon’s 1922 memorial, as seen from the east approach and surrounding roads. Source lives in `src/peregrine/landmarks/top-cities/lincoln-memorial/`; runtime exports are `public/models/buildings/lincoln-memorial-{near,far}.glb` and `lincoln-memorial.json`. No scans, photos, textures or third-party meshes ship.

At 100 m the model shows the column rhythm, doorway, fluted shafts, two stair flights, tripod urns and garland attic. At 800 m the pale rectangular temple, recessed roof tier and broad terrace remain recognisable. Seated Lincoln is a deliberately simplified figure inside the open chamber, not a detailed portrait.

## Sources and dimensions

Primary sources checked 2026-10-05: [NPS statistics](https://www.nps.gov/linc/learn/historyculture/lincoln-memorial-building-statistics.htm), [NPS exterior features](https://www.nps.gov/linc/learn/historyculture/exterior-features.htm), and [OSM memorial outline](https://www.openstreetmap.org/way/398769543). The prepared OSM dossier is dated 2026-10-04; its main outline was verified through the shared Overpass helper.

| Dimension | Model | Basis |
| --- | --- | --- |
| Highest point above terrace-foot grade | 30.1752 m | NPS 99 ft |
| Colonnade north–south / east–west envelope | 57.404 / 36.1188 m | NPS 188 ft 4 in / 118 ft 6 in |
| Doric height / base diameter | 13.4112 / 2.2606 m | NPS 44 ft / 7 ft 5 in |
| Column count | 36 exterior + 2 entrance | NPS |
| Shaft flutes | 20 near; omitted far | NPS; original concave profile |
| Platform rise | 2.439 m, 3 steps | NPS 8 ft, 3 steps; rounding |
| Retaining-wall rise | 4.3 m | NPS 14 ft; rounding to mapped tag |
| Tripod feature | 3.3528 m over its cap | NPS nominal 11 ft; simplified profile |
| Statue / pedestal | about 5.79 / 3.048 m | NPS 19 / 10 ft; stylised figure |
| Chamber walls, cornice tier split, roof ridges | Estimated | Photos and mapped parts |
| Steps: 16 upper / 23 lower near | Estimated | Model segmentation, not a survey count |

Reference photos were used only for comparison in ignored scratch:

- [East facade](https://commons.wikimedia.org/wiki/File:Lincoln_Memorial_east_side.JPG), Martin Falbisoner, CC BY-SA 3.0.
- [East aerial](https://commons.wikimedia.org/wiki/File:Aerial_view_of_Lincoln_Memorial_-_east_side_EDIT.jpeg), Carol M. Highsmith, edit UpstateNYer, public domain. This one extra photo clarified the roof well and three skylights.
- [Statue and inscription wall](https://commons.wikimedia.org/wiki/File:The_Lincoln_Memorial_Statue,_with_inscription_in_background.jpg), MC BSU, public domain; dossier licence.

The dossier’s six-photo sheet was read once; the catalog provenance lists all six titles, authors and licences, including comparison-only historic banknote and undercroft images. None is a texture source.

## Geographic frame and replacement

Metres, +X east, +Y up, +Z south. Origin `[-77.0501717, 38.8892721]` is the centre of the mapped main outline. Controls on OSM way 398769543’s west edge are `[-77.0503862,38.8895317]` and `[-77.0503866,38.8890127]`: the north–south edge is approximately 180.034371° clockwise from north. The front faces 90.034371°. A −0.034371° Y rotation is baked into the source and GLB; the host must not rotate again.

`y=0` is flat grade at the retaining-wall foot. The model stands rigidly on that plane. The terrace follows mapped horseshoe way 443679934; rings and IDs include all memorial building parts/columns in the dossier, including the eastern stairs and overhanging roof. Temporary construction cabin 1551348210, east of the stairs, is excluded. The NPS colonnade is approximately 3% narrower than the OSM main outline; published structural dimensions take priority, with the provider outline retained for replacement.

The explicit median terrain pad uses the owned rings and reference points on both terrace sides and the eastern approach, with a 7 m feather. It is intended to avoid a lowest-sample river depression; no DEM values have been sampled or baked. Cityscape **not tested yet, integration is checked separately**. Full 3D world **not tested yet, integration is checked separately**. No runtime, road, terrain gate or shared file was changed.

## Geometry and materials

Seven material batches in each LOD: pale marble `stone`, warmer relief/cornice `trim`, pink-grey `granite`, `turf`, subdued skylight `roof`, mullion `bronze`, and self-lit chamber ceiling `glow`. Day/night palettes have identical keys. The night view reduces stone brightness and preserves warm interior ceiling light.

Near has tapered shafts with shallow entasis and twenty concave flutes, Doric echinus and square abacus, eight simplified interior columns, merged wreath medallions, palmette suggestions and shallow garland/eagle-wing reliefs. The stair treads, platform and cornices are geometry. The cella is hollow, leaving a real central doorway and free-standing peristyle gaps. Three gabled skylights sit in the attic well. Far keeps all exterior columns, doorway, statue, roof tiers and garlands; it removes flutes/wreaths/palmettes and coarsens stairs and skylight framing.

Approximations: no readable state names, speeches or dedication inscription; no murals, exact carved eagles/lions, individual column drum joints, undercroft exhibits, surrounding pool/plaza, or temporary visitor/construction structures. Urn carving and interior Ionic capitals are simplified. The chamber is an exterior-view approximation. Palmettes and wreaths suggest ornament without replicating carved figures. Costs are exported-scene metrics, not Tesla hardware measurements.

## Verification evidence

Read `tmp/top-cities/lincoln-memorial/refs-sheet.jpg` and `refs/7-aerial.jpeg`, then judged the initial procedural near/light sheet in `tmp/top-cities/shots/lincoln-memorial/lincoln-memorial-procedural-near-light-sheet.jpg`. That review led to removing duplicate attic faces, replacing the full roof-walk slab with a perimeter walk, and restoring square-capital undersides. Geometry tests additionally pinned outward roof winding.

Read the exported near/far and light/dark comparison beside the facade, aerial and statue references in `tmp/top-cities/shots/lincoln-memorial/lincoln-memorial-export-reference-sheet.jpg`. Rows show overview, facade, back, roof, street entrance, relief detail and mapped plan. The four corresponding `lincoln-memorial-glb-{near,far}-{light,dark}-sheet.jpg` files retain larger tiles. Every LOD/theme was judged from both sides, above, at the entrance and close to the cornice. The final audit corrected the short-side column rows to eight including corners, adjusted the measured rotation sign, separated the upper stair fill from its tread faces, and closed the entablature soffits and attic rim. Final QA reports zero different-material coplanar pairs and zero back-facing first hits over 406 deterministic rays. The source/GLB round-trip and silhouette checks are part of the focused conformance command below.

| Export | Triangles | Draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 36,704 | 7 | 948 |
| Far | 7,192 | 7 | 254 |

All 108 tests in the specified two-file command pass (five landmark-specific tests); `node scripts/asset-catalog.mjs` passes with 164 entries and 280 variants. Focused tests observe the exterior and entrance columns by raycast, doorway clearance, recessed statue, cella floor, upward roof normals, three roof ridges, mapped containment and identical LOD bounds. Independent review and application integration remain separate coordinator checks.

## Rebuild and check

```sh
pnpm build:top-cities-landmarks lincoln-memorial --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/lincoln-memorial/lincoln-memorial.test.js
node scripts/asset-catalog.mjs
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids lincoln-memorial --out tmp/top-cities/lincoln-memorial/qa-metrics.json
node .agents/skills/build-3d-city/scripts/shot.mjs lincoln-memorial --source glb --detail far --theme dark --sheet --out tmp/top-cities/shots/lincoln-memorial
```
