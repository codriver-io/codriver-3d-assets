// Cameras in east/up/south metres. Downhill is +u, about bearing 120°.
import { world, CROWN, archNode } from './holmenkollbakken-plan.js';

const cam = (eu, ev, ey, tu, tv, ty) => [world(eu, ev, ey), world(tu, tv, ty)];
const lip = archNode(0.5, true);

export const VIEWS = {
  overview: cam(168, 62, 42, 24, 0, 62),
  facade: cam(196, 4, 14, 36, 0, 58),
  roof: cam(24, 18, 310, 16, 0, 40),
  side: cam(-16, 72, 78, -36, 0, 96),
  back: cam(-118, 22, 48, -46, 0, 100),
  detail: cam(46, 20, lip.y - 2, lip.u, 0, lip.y - 8),
};
