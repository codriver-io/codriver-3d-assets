import { sitePoint } from './san-fernando-cathedral-parts.js';
const p = (a, y, s) => sitePoint(a, y, s).toArray();
// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south); a is west along the nave from the east front on Main Plaza, s north.
export const VIEWS = {
  overview: [p(-48, 30, 38), p(20, 9, 0)],
  facade: [p(-42, 11, 0), p(0, 12, 0)],
  roof: [p(14, 78, -20), p(25, 6, 0)],
  back: [p(92, 20, -22), p(25, 9, 0)],
  street: [p(-17, 1.7, 22), p(4, 12, 0)],
  detail: [p(-13, 15, 11), p(0, 17, 0)],
  dome: [p(68, 24, -26), p(45.8, 14, 0.8)],
};
