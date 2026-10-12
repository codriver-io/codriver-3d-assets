import { plan } from './geometry.js';
// Cameras in exported east/up/south frame: building rotation baked once.
export const VIEWS = {
  overview: [plan(95,60,125),plan(0,19,0)],
  facade: [plan(0,21,122),plan(0,18,36)],
  back: [plan(-75,45,-110),plan(0,20,-20)],
  roof: [plan(58,135,68),plan(0,19,0)],
  street: [plan(16,1.7,107),plan(0,18,37)],
  detail: [plan(25,29,79),plan(0,25,39)],
  top: [[0,180,0],[0,0,0]],
};
