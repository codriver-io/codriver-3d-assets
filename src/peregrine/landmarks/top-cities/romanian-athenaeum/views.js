import { plan } from './geometry.js';
export const VIEWS = {
  overview: [plan(66,48,96),plan(0,12,-3)],
  facade: [plan(0,18,94),plan(0,14,1)],
  back: [plan(-63,35,-101),plan(0,11,-12)],
  roof: [plan(48,100,42),plan(0,12,-5)],
  street: [plan(22,3,69),plan(0,12,8)],
  detail: [plan(22,20,49),plan(0,17,8)],
  top: [[0,150,0],[0,0,0]],
};
