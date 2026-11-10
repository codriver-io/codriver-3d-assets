# Colonial Dorchester — St. George's bell tower

Original procedural model of the standing brick bell-tower ruin at Colonial Dorchester State Historic Site, near Summerville. It represents the open roofless shaft as it survives, with round-arched openings, corner pilasters, surviving cornice returns and an eroded raised centre. The vanished church is not reconstructed.

## Sources and dimensions

- [South Carolina State Parks](https://southcarolinaparks.com/colonial-dorchester/history-and-interpretation): church built 1719, tower added 1751; present surviving ruin.
- [NRHP Old Dorchester nomination, 1969](https://npgallery.nps.gov/GetAsset/a1bc3cc7-136a-4bbf-82a5-dc38bc4312ad/): checked complete four-page record. Its 50 × 30 ft church and 15 × 5 ft chancel refer to the vanished church, **not this tower**, and are not used to scale the shaft. It supplies no tower height or plan measurement.
- [HABS SC-189 record](https://tile.loc.gov/storage-services/master/pnp/habshaer/sc/sc0200/sc0239/data/sc0239data.pdf): checked the record; no numerical tower dimensions. The 1940 photograph confirms the older ruin but the two modern views govern the model.
- [OSM node 357110002](https://www.openstreetmap.org/node/357110002), `historic=ruins`, Saint George Church Ruins: placement only. API snapshot 2026-11-09. © OpenStreetMap contributors, ODbL 1.0.
- [Vitugglan, bell tower exterior](https://commons.wikimedia.org/wiki/File:St_georges_belltower_dorchester_sc_12-30-11.jpg), 2011, CC BY-SA 4.0.
- [Vitugglan, alternate exterior](https://commons.wikimedia.org/wiki/File:St_georges_belltower_dorchester_sc_alt_view_12-30-11.jpg), 2011, CC BY-SA 4.0. Both file descriptions and licences checked with Commons imageinfo/file data, then the actual photographs visually checked: same raised-centre roofless tower, arched apertures and corner cornice remnants. Reference images remain in ignored scratch, not redistributed.

| Feature | Model | Status |
| --- | ---: | --- |
| Shaft plan | 5.3 × 5.3 m | Estimated from photo proportions; no published tower plan found |
| Surviving raised top | 12.2 m | Estimated, not a sourced survey height |
| Wall thickness | 0.78 m | Estimated from visible reveals |
| Plain-elevation door arch | 1.85 × 3.50 m | Estimated |
| Plain-elevation upper opening | 0.98 × 2.70 m, sill 5.15 m | Estimated |
| Side-elevation large arch | 1.65 × 3.85 m, sill 4.70 m | Estimated |
| Corner cornice returns | 9.45–10.10 m | Estimated |
| Front bearing | 270° | Estimated from conventional west-tower arrangement; not verified by two mapped control points |

## Frame, footprint and foundation

Origin `[-80.1707518,32.9490043]` comes from OSM's single ruins node. This is the only mapped control point; neither the square outline nor orientation is claimed to be surveyed or mapped. `footprintless: true` follows the existing registry convention, and `OSM_WAYS = []`. `footprint.js` contains an explicitly **authored** estimated ring to describe the rigid foundation, not an OSM way or provider replacement boundary. No generic provider building removal is authorized by this asset.

Local metres, +X east, +Y up, +Z south; y=0 is the masonry toe at local grade. Estimated bearing is baked into the source; no additional geographic rotation is required. No sea-level height, terrain DEM or Mercator scale is baked in. A host must determine a rigid footing datum and independently verify location/orientation and terrain before integration.

## Modeling decisions and omissions

Four thick masonry walls retain real ground and upper arch openings, inner faces and an open shaft. There is no roof, ceiling, replacement spire or invented bell. The upper outline is uneven and locally stepped, matching the surviving raised-centre remnant instead of a complete original crown. Sparse original weathering patches and short isolated mortar-course fragments partition the outside wall caps on a single plane, without backing faces or shallow overlays. Near retains four low-contrast patches and four short course fragments per face; far keeps only one patch and one fragment per face. The same three materials, openings, wall thickness, eroded top, pilasters and cornice survive in both LODs. Brick colours are muted brown-red with grey-tan mortar. No brick textures or photograph tracing; individual brick courses are omitted.

The fort, nave foundations, cemetery, trees, historic lettering and former iron straps are omitted. Dimensions, exact erosion pattern and orientation remain estimates; there is no host integration evidence. No contributor licence terms have been accepted by an agent.

## Costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 1,490 | 3 | 24,560 |
| Far | 1,002 | 3 | 19,400 |

The weight-only review replaced the dense brick tessellation (29,616 / 6,208 triangles) with sparse weathering inlays, reducing near triangles by 95% and far by 84%. Placement, proportions, orientation, eroded top profiles, arch outlines and support geometry were unchanged; exported near/far bounds compare exactly equal to the previous version and both still use three materials/draws.

Final `qa-metrics` has no flags: no below-grade parts, no coplanar/layered candidates, no back-face sweep hits and matching LOD bounds. Metrics: `tmp/landmark-qa/colonial-dorchester-weight-metrics.json`. The single new exported contact sheet is `tmp/landmark-qa/sheets/colonial-weight-fix/colonial-dorchester-bell-tower.jpg`, using padded scratch bounds to show the full top and base. It compares the retained roofless shaft, eroded crown, arches and far silhouette with the verified reference photograph. Heights, plan and orientation remain estimates.

Cityscape: **not tested**. Full 3D world: **not tested**. The standalone library viewer cannot establish either host mode.

The previous batch passed the complete 419-viewer browser suite and 32 source/GLB/LOD/theme cases. This weight-only revision is validated separately by geometry metrics, the single new contact sheet and refreshed exported-GLB thumbnail, followed by passing `pnpm build` and `pnpm check`; no host integration is claimed. Byte counts above include the final licence metadata stamp.
