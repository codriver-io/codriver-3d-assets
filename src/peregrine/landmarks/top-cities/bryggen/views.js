// Inspector cameras in model metres. The quay is the water side (decreasing d).
import { toWorld } from './bryggen-site.js';

const eye = (u, d, y) => toWorld(u, d, y);
export const VIEWS = {
  overview: [eye(12, -78, 32), eye(-8, 2, 8)],
  facade: [eye(-6, -52, 8), eye(-6, 0, 7)],
  roof: [eye(-8, 8, 80), eye(-8, 2, 0)],
  street: [eye(26, -28, 2.4), eye(-18, -8, 7)],
  detail: [eye(-42, -22, 4.5), eye(-41, -9, 9)],
  back: [eye(-10, 42, 14), eye(-10, 2, 8)],
};
