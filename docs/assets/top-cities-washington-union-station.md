# Washington Union Station, Washington, D.C.

Original procedural model of Daniel Burnham's 1907 Beaux-Arts station as a driver sees it from Massachusetts Avenue and Columbus Plaza. Source: `src/peregrine/landmarks/top-cities/washington-union-station/`; exports `public/models/buildings/washington-union-station-{near,far}.glb` and `washington-union-station.json`. No scans, photos, textures or third-party meshes ship.

At 100 m the model shows the long white front, the central pavilion with its three portals between six free-standing Corinthian columns, six statues on the attic, the arcaded wings with raised end pavilions and the grey barrel-vaulted Main Hall roof rising behind. At 800 m the pale 190 m slab, the taller central block and the vault remain.

## Sources and dimensions

OSM way [67100178](https://www.openstreetmap.org/way/67100178) (station outline), elevator part 478728802 and six statue nodes (Prometheus, Thales, Themis, Apollo, Ceres, Archimedes) from the 2026-10-14 dossier plus one shared-helper Overpass query (`tmp/top-cities/washington-union-station/extra.json`). Main Hall size from the [Union Station Redevelopment Corporation](https://www.usrcdc.com/?p=334555); history and Arch of Constantine model from [Wikipedia](https://en.wikipedia.org/wiki/Washington_Union_Station).

| Dimension | Model | Basis |
| --- | --- | --- |
| Facade length | 192.8 m | OSM outline (rotated rectangle, edges agree to 0.1 deg) |
| Facade bearing / front faces | 105.5 deg / 195.5 deg (SSW) | OSM long edges; baked into the GLB |
| Station depth | 122 m (head house to rear concourse) | OSM outline |
| Column bays | six columns at u = -26.75, -20.2, -7.25, 5.55, 18.3, 25.05 m | OSM statue nodes and the outline's projecting plinths |
| Main Hall plan / ceiling | 62 x 36 m vault footprint; ceiling 29.3 m | 219 x 120 ft x 96 ft quoted; plan shortened to sit behind the 58 m pavilion (estimate) |
| Vault crown | 30.5 m (30.7 m with ribs) | ceiling 29.3 m plus roof shell (estimate) |
| Wing cornice / parapet | 14.2 / 15.5 m | photographs (estimate) |
| Pavilion entablature / attic top | 17.6-20.2 / 25.2 m | photographs (estimate) |
| Portals | centre 10.0 x 14.2 m, sides 9.4 x 13.2 m, two small outer niches | photographs (estimate) |
| Statues | about 5 m on 1.1 m pedestals | photographs; robed figures with a flared hem, pinched waist, broad shoulders, narrow neck, 0.48 m head and a raised arm (both LODs) |
| Rear concourse | flat shell, 7.25 m | OSM `height` tag |

## Modelling

Plan frame: `u` along the facade, `v` toward the front; the plan is rotated 15.5 deg once in `geometry.js` (`plan()`), and the origin is the centre of the mapped rectangle, so the model sits inside its footprint. The pavilion front is one extruded outline whose three portals are real 4.6 m recesses (jambs and soffit), with the glazed hall wall set back inside and a mullion grille; archivolts, entablature, attic and cornice follow. Columns are fluted (24 sides near, 8 far) with capitals, plinths and projecting entablature blocks, each carrying a statue. Wings are arcades of arched doors over rectangular windows between pilasters under a cornice and parapet. The vault is a segmental barrel (rise 8.5 m over 36 m) with standing-seam ribs (near), gable end walls with a raised archivolt and a thermal window (`glow`, lit at night). The rear concourse extrudes the mapped outline at 7.25 m with two skylight strips.

Materials: `stone`, `trim`, `base`, `roof`, `tar`, `glass`, `glow` (portal and arcade glazing: dark by day, amber at night). Mullions are `glass` so no stone/glow material cycle exists (depth-layer check reports none).

## Approximations

Estimated heights and portal sizes (above), the exact Main Hall placement (the hall is drawn centred behind the pavilion), the wing arcade rhythm, statue forms, and the rear concourse (a plain shell). Columbus Fountain, the three flagpoles and the plaza lie 70-110 m in front of the building, outside the mapped outline, and are not modelled. Interior, inscriptions, flags and the parking deck are omitted. Near LOD is 7.5 k triangles, 7 draws, 323 KB; far is 2.8 k triangles, 7 draws, 153 KB (no ribs, mullions, sills, archivolts, statue attributes; 8-sided columns). Far keeps every wing bay's upper window and the 31 rear-wall windows as separate quads, and the statues' raised arms.

## Verification

Looked at (all under `tmp/top-cities/shots/washington-union-station/`): procedural near light contact sheet `a/` and `b/` (overview, facade, roof, back, entrance, detail), procedural far dark `b/`, and the exported GLBs in near light and far dark `c/` (overview, facade, detail, back, roof, plan), compared with the dossier photographs (front facade, oblique street view, Main Hall panorama). Changes made after looking: lowered and narrowed the wing arches, added upper-window sills, added vault ribs, pulled the end pavilions back to the mapped line (they overshot the outline by about 1 m) and moved the mullions to `glass` to remove a stone/glow depth cycle. Footprint rings were checked by the test (bounding box inside the outline) and in the plan view. Cityscape and Full 3D world: **not tested yet, integration is checked separately**.

### Review fixes (g3a, 2026-10-15)

The independent review (FIX, 4/5) found the far LOD blanking the wings' upper windows and the rear concourse wall, and the attic statues barely reading against the entablature. Changed: the wing upper windows are now emitted in both LODs (sills stay near-only); the rear concourse windows are one row of outward-facing quads at the near 6 m bays in both LODs, following the slightly skewed rear wall (the near row had half its quads facing inward, which the back-face sweep counted); the statues got a deeper silhouette (hem 1.08 m, waist 0.62 m, shoulders 0.98 m, neck 0.22 m, head radius 0.48 m) and keep their raised arm in far. The skylight boxes the metrics flagged as 176 m window bands were left as they are. Costs before → after: near 7,173 → 7,501 tris (7 draws, 318 → 323 KB); far 2,361 → 2,783 tris (7 draws, 139 → 153 KB). Looked at the exported GLB near and far sheets (`tmp/next-200/fix/g3a/washington-union-station/sheet-{near,far}/`): the far wings and back now show their window rhythm and the six figures read as figures from the detail view. Depth layers: 0 cycle edges.

