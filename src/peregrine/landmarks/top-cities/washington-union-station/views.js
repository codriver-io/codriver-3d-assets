// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). Plan frame: u along the facade, v to the front.
import { PLAN } from './config.js';
const A = PLAN.angleDeg * Math.PI / 180;
const L = (u, y, v) => [u * Math.cos(A) - v * Math.sin(A) - PLAN.shiftX, y, u * Math.sin(A) + v * Math.cos(A) - PLAN.shiftZ];
export const VIEWS = {
  overview: [L(70, 70, 190), L(0, 12, 0)],
  facade: [L(0, 14, 135), L(0, 11, 0)],
  roof: [L(-60, 110, 90), L(0, 15, -10)],
  back: [L(-80, 40, -200), L(0, 8, -40)],
  entrance: [L(-6, 6, 62), L(-1, 13, 28)],
  detail: [L(38, 18, 52), L(14, 17, 29)],
  plan: [L(0, 330, 1), L(0, 0, -30)],
};
