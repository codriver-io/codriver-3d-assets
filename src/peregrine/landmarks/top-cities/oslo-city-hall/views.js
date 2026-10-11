import { world, EAST_U, WEST_U, MID_U } from './oslo-city-hall-plan.js';

const W = (u, y, v) => world(u, y, v);

// Cameras in model metres after the footprint rotation. Harbour is -v, plaza is +v.
export const VIEWS = {
  overview: [W(-28, 36, -78), W(-6, 26, 28)],
  facade: [W(-8, 16, -62), W(-8, 22, 8)],
  plaza: [W(-6, 18, 148), W(-8, 28, 48)],
  roof: [W(36, 150, -10), W(-8, 24, 32)],
  street: [W(28, 3.2, -42), W(EAST_U, 42, 36)],
  clock: [W(EAST_U, 50, 8), W(EAST_U, 50, 40)],
  courtyard: [W(MID_U, 12, 92), W(MID_U, 18, 48)],
};
