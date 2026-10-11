import { PROFILE as p } from './pont-laviolette-profile.js';
import { h, MAIN_S, TIP_S, CREST_S, TRUSS_START, TRUSS_END, BRIDGE_START, BRIDGE_END, TRUSS_PIER_S } from './pont-laviolette-structure.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written as (station along the A-55 from the north-west end, lateral + south-west, height above high
// water) so they follow the bridge's 130.1 degree axis. Upstream is south-west (+d).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const [MN, MS] = MAIN_S;

export const VIEWS = {
  // From the Trois-Rivières shore downstream, low over the water: the arch, the S-curved anchor spans
  // and the trusses running away to Bécancour (photograph 1's angle).
  overview: [pt(MN - 650, -520, 25), pt(CREST_S + 150, 0, 45)],
  // Broadside from upstream (south-west): the whole arch-and-truss silhouette (photograph 3).
  facade: [pt(CREST_S, 1250, 30), pt(CREST_S, 0, 55)],
  // From above the north main pier looking along the deck towards the crown.
  roof: [pt(MN - 260, -150, 170), pt(CREST_S, 0, 60)],
  // A driver southbound in the right lane, entering the through-trusses at pier N5.
  deck: [pt(TRUSS_START - 60, 5.6, h(TRUSS_START - 60) + 1.6), pt(TRUSS_START + 80, 4, h(TRUSS_START + 80) + 6)],
  // Under the deck at the north main pier: the V of the lower chords on the pin bearings.
  underside: [pt(MN - 70, -75, 12), pt(MN, 0, 35)],
  // The north main pier and the arch springing, close, from downstream at deck height.
  tower: [pt(MN - 40, -110, 55), pt(TIP_S[0] + 20, 0, 60)],
  // Driving through the arch under the hangers, northbound.
  span: [pt(TIP_S[1] + 40, -3.9, h(TIP_S[1]) + 1.6), pt(CREST_S - 60, -3.9, h(CREST_S) + 18)],
  // The south approach: plate girders, then the precast spans down to the Bécancour shore.
  approach: [pt(TRUSS_END + 200, 260, 22), pt(BRIDGE_END - 300, 0, 8)],
  // The north abutment and the start of the climb from the approach road.
  abutment: [pt(BRIDGE_START - 80, -60, 12), pt(BRIDGE_START + 250, 0, 6)],
  // At night (use with the dark theme).
  night: [pt(CREST_S - 900, -1100, 60), pt(CREST_S, 0, 55)],
};
export const PIER_S = TRUSS_PIER_S;
