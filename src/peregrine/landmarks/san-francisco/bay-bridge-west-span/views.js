import { PROFILE as p, S, h } from './bay-bridge-west-span-profile.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target],
// written as (station, lateral, height) so they follow the bridge's 40.3 degree bearing. Lateral is
// positive to the right of eastward travel (south-east); negative is the north side (the city side).
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const dk = (s, d, up) => pt(s, d, h(s) + up);

export const VIEWS = {
  // From the Embarcadero side (north-west), the classic view: both suspension spans and W4.
  overview: [pt(S.W2 - 250, -950, 150), pt(S.W4 - 150, 0, 75)],
  // Side elevation from the north: towers, cables, the central anchorage.
  facade: [pt(S.W4, -900, 60), pt(S.W4, 0, 75)],
  // From above, looking down the upper deck.
  roof: [pt(S.W3 - 120, -60, 230), pt(S.W3 + 200, 0, 80)],
  // A driver westbound on the upper deck approaching tower W3.
  deck: [dk(S.W4 - 120, -2, 1.6), dk(S.W3, -2, 30)],
  // Under the truss at the water, looking along the lower chords and the wind bracing.
  underside: [pt(S.W2 + 180, 40, 8), pt(S.W2 + 360, 0, 60)],
  // Close on tower W3: battered legs, X bracing, the deck strut and the portal gallery.
  tower: [pt(S.W3 - 140, -150, 95), pt(S.W3, 0, 95)],
  // The central anchorage W4 and the cables landing on its housings.
  anchorage: [pt(S.W4 - 160, -120, 110), pt(S.W4, 0, 75)],
  // The lower (eastbound) deck inside the truss.
  lower: [dk(S.W4 + 60, 2, -9 + 1.6), dk(S.W5, 2, -9 + 4)],
  // San Francisco approach: the viaduct ramp, the anchorage and the approach truss to W1.
  approach: [pt(S.SFA - 300, -260, 70), pt(S.SFA + 80, 0, 30)],
  // Yerba Buena Island end: the side span down to W7 and the tunnel portal.
  island: [pt(S.W7 + 150, -300, 70), pt(S.W7, 0, 25)],
};
