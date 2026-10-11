import { SPEC } from './config.js';
const a = SPEC.rotationDeg * Math.PI / 180;
const p = ([x,y,z]) => [Math.cos(a)*x+Math.sin(a)*z,y,-Math.sin(a)*x+Math.cos(a)*z];
const view = (e,t) => [p(e),p(t)];
export const VIEWS = {
  overview: view([115,90,165],[0,20,0]),
  facade: view([0,24,145],[0,25,46]),
  roof: view([100,165,40],[0,10,0]),
  back: view([-95,65,-130],[0,18,-13]),
  street: view([-35,5,112],[0,22,45]),
  detail: view([37,40,88],[14,38,44]),
  plan: view([0,225,0.01],[0,0,0]),
};
