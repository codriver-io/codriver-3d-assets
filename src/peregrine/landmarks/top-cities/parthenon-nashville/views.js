import { plan } from './geometry.js';
export const VIEWS = {
  overview: [plan(85,44,82), plan(0,8,0)],
  facade: [plan(86,15,0), plan(31,10,0)],
  back: [plan(-82,23,-46), plan(-5,9,0)],
  roof: [plan(40,110,45), plan(0,7,0)],
  street: [plan(46,3,38), plan(12,9,0)],
  detail: [plan(56,22,12), plan(34.7,15.6,0)],
};
