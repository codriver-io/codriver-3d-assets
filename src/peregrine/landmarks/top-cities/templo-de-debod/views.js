import { plan } from './geometry.js';
export const VIEWS = {
  overview: [plan(86,32,56),plan(24,2,2)],
  facade: [plan(88,7,.4),plan(16,2.8,.4)],
  back: [plan(-40,15,-27),plan(0,3,1)],
  roof: [plan(25,95,18),plan(25,0,2)],
  street: [plan(75,1.8,13),plan(31,2.8,.4)],
  detail: [plan(70,8,12),plan(59,3,.4)],
  sanctuary: [plan(26,8,20),plan(2,3,.5)],
};
