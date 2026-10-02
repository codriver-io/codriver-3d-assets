import { PROFILE as p, PIER_S, SPANS, C0 } from './reconciliation-bridge-profile.js';
import { panelS } from './reconciliation-bridge-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written in (station along the roadway, lateral, height) so they follow the bridge's 209 degree
// bearing: station runs north to south, lateral is positive to the right of travel (west, upstream).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d); return [q.x, y, q.z]; };

export const VIEWS = {
  // Three-quarter view from the downtown (south-west) bank: both camelback spans, the pier and the sidewalks.
  overview: [pt(PIER_S + 95, 85, 26), pt(PIER_S, 0, 4)],
  // Side elevation from upstream (west): the two eight-panel Parker trusses, the classic photograph.
  facade: [pt(PIER_S, 120, 4), pt(PIER_S, 0, 4.5)],
  // From above: deck, kerbs, sidewalks outside the trusses, the struts and top lateral bracing.
  roof: [pt(PIER_S - 40, 45, 70), pt(PIER_S, 0, 0)],
  // What a driver sees heading south into downtown in the right-hand lane: the portal and the laced struts.
  deck: [pt(SPANS[0][0] - 25, 1.8 + C0, 1.6), pt(PIER_S, 1.8 + C0, 4.5)],
  // From the river, low and downstream (east): pier, floor beams, bearings and the underside of the deck.
  underside: [pt(PIER_S - 22, -38, -2), pt(PIER_S, 0, -0.5)],
  // Close on the north portal: laced portal girder, knee braces clear of the carriageway, end posts and shoes.
  tower: [pt(SPANS[0][0] - 14, -9, 7), pt(panelS(0, 1), C0, 5.5)],
  // Downstream elevation from the east bank at the north end: the camelback outline in perspective.
  east: [pt(SPANS[0][0] - 30, -60, 10), pt(PIER_S + 10, 0, 5)],
};
