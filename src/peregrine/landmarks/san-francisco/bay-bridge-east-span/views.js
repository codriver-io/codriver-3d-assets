import { PROFILE as p, T1, W2, E2, SAS_W, PIERS, E16 } from './bay-bridge-east-span-profile.js';

// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south), each [eye, target].
// Written in (station, lateral, height) so they follow the alignment: lateral is positive to the right
// of eastbound travel (south); `dk` is a height above the deck at that station.
const pt = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
const dk = (s, d, up) => pt(s, d, p.deckHeight(s) + up);

export const VIEWS = {
  // From the south-west over the water: the tower, the cable fan and the Skyway curving away to Oakland.
  overview: [pt(T1 + 250, 1150, 330), pt(T1 + 330, 0, 45)],
  // Side elevation of the self-anchored span from the south (the bike path side): the classic photograph.
  facade: [pt(T1 + 120, 1050, 75), pt(T1 + 120, 0, 72)],
  // From above: twin decks, the crossbeams, the tower between them and the four cable planes.
  roof: [pt(T1 + 40, 160, 430), pt(T1 + 40, 0, 40)],
  // Driving eastbound off Yerba Buena Island toward the tower: the angled canopy of suspenders.
  deck: [dk(W2 + 25, 17, 1.6), pt(T1 + 30, 2, 95)],
  // Under the Skyway at the water: paired columns, pier tables and the haunched girders.
  underside: [pt(PIERS[2] - 40, 75, 6), pt(PIERS[5], 0, 30)],
  // The single tower close up: four pentagonal legs and the shear links.
  tower: [pt(T1 - 70, 95, 62), pt(T1, 0, 105)],
  // The Skyway from the north (westbound side), low over the bay.
  skyway: [pt(PIERS[6], -620, 30), pt(PIERS[6], 0, 30)],
  // The west end: the cable wrapped around the decks at W2 and the YBI transition ramp.
  west: [pt(W2 - 130, 170, 45), pt(W2 - 10, 0, 38)],
  // The east end: the last Skyway frame and the Oakland touchdown easing onto the road.
  east: [pt(E16 + 120, 240, 40), pt(E16 + 300, 0, 6)],
  // The main span from under the deck by the tower: crossbeams and the floating decks.
  structure: [pt(E2 - 120, 0, 18), pt(T1 + 40, 0, 50)],
};
