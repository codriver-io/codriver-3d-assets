// Basilique Notre-Dame-du-Cap, 626 rue Notre-Dame Est, Cap-de-la-Madeleine, Trois-Rivieres, Quebec. Adrien Dufresne, built 1955-64 (one of
// Canada's five national shrines). Sourced: 258 ft (78.6 m) from the ground to the cross, an octagonal plan extended by four transept arms
// under a pyramidal copper roof carrying a lantern, a monumental portal inscribed in a parabolic arch with a 7.3 m statue of Mary, two
// covered ramps (galleries) ending in small pavilions, stained glass by Jan Tillemans, a rectangular sacristy beside the choir. Mapped (OSM
// way 66794334): the outline, whose facade and axis run at 48/228 deg; the basilica faces south-west (228 deg), toward the plaza and the
// Petit Sanctuaire. See docs/3d-quebec-notre-dame-du-cap.md.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the public Terrarium DEM (zoom 15, bilinear, checked 2026-10-04) is a levelled river-bank terrace: 10.1 to 12.2 m
// under the outline (median 11.0, 10th to 90th percentile 10.9 to 11.2), 9.8 m lowest in a 62 m disc. The default disc would take that lowest
// sample and sink the basilica about 1.2 m, so the pad is the outline held at its own median DEM with a short feather; the bank only starts to
// fall (to 6 m) 60 to 90 m to the south-east, outside the pad.
const TERRAIN_PAD = { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0], datum: 'median', featherM: 8 };

export const SPEC = {
  id: 'notre-dame-du-cap', name: 'Basilique Notre-Dame-du-Cap', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-04)
  origin: [-72.4971941, 46.3682209], // area centroid of the mapped outline (OSM way 66794334)
  height: 78.6, // m to the tip of the cross on the lantern spire (258 ft, published)
  padM: 62, // unused while terrainPad is set
  frontageBearing: 228, // the portal looks south-west onto the plaza
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
  // Model facts the geometry, tests and docs share (metres). The model is authored in the BUILDING frame (x to the viewer's right in
  // front of the portal, z toward the portal, origin on the axis of the octagon) and turned by -axisDeg onto the mapped outline.
  axisDeg: 48, // the axis (portal to choir) runs along bearing 48 deg; the portal faces 228 deg
  anchor: [1.1, -0.8], // local metres (east, south) of the octagon centre
  octApothem: 26.5, wallTop: 19.5, gableApex: 29, gableHalf: 7.5, roofTop: 58, lanternHalf: 4.0, lanternTop: 64.6, spireTip: 73.2, crossTip: 78.6,
  portalZ: 40, towerBaseHalf: 12, towerTopHalf: 5.2, towerTop: 36, archHalf: 8, archApex: 24.5, floorY: 2.2,
  choirZ: -41.5, galleryZ: [30.5, 36.5], pavilionX: [27, 36.5], galleryTop: 5.3, statueHeight: 7.3,
};

export const PALETTES = {
  light: {
    stone: '#c3beb1', stoneDark: '#a29d91', plaster: '#e5e2d9', copper: '#5f8279', copperDark: '#2f3d39', copperMid: '#4a655e',
    glow: '#47658b', wood: '#8a6038', dark: '#2d3033', glass: '#50626d', roofFlat: '#6c8176', metal: '#3b3d3c',
  },
  dark: {
    stone: '#7a7e83', stoneDark: '#666a70', plaster: '#8e9197', copper: '#425d55', copperDark: '#28332f', copperMid: '#364a44',
    glow: '#e7b667', wood: '#5b4129', dark: '#16191b', glass: '#34424b', roofFlat: '#44564d', metal: '#2c2e2d',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the plaza in front of the portal stair (about 11 m above sea level on the public DEM: 10.1 to 12.2 m under the outline, median 11.0); the portal floor is 2.2 m above it, the galleries 0.6 m. The terrace, the bank to the St. Lawrence and the plaza are not modelled. Full 3D world uses an explicit terrain pad (terrainPad): the outline held at its median DEM with an 8 m feather.',
  attribution: 'Original procedural mesh. Mapped outline (way 66794334) and axis bearing © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 258 ft (78.6 m) to the cross, the octagonal plan with four transept arms, the pyramidal copper roof with a lantern and spire, the parabolic portal arch with a 7.3 m statue, the two covered galleries ending in edicules, the sacristy, the mapped outline and axis. Estimated from photographs and the outline (no other published dimension was found): the octagon apothem (26.5 m), the eaves (19.5 m), gable apexes (30 m), the portal tower (24 m wide at the base, 36 m to the crown), the arch size (16 m wide, 24.5 m to the apex), the lantern and spire heights, the gallery and pavilion sizes, window and rose positions and the roof patchwork. The diagonal gables follow the photographs; the back of the building is inferred from the outline. Interior, ornament, lettering, the Petit Sanctuaire, the Pavillon des visiteurs and the plaza are not modelled.',
};
