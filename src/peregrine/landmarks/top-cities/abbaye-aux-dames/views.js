import { toWorld, CHURCH_V as V, conventPoint } from './abbaye-aux-dames-plan.js';
const church=(u,y,v)=>toWorld(u,y,v+V);
const convent=(u,y,v)=>toWorld(...conventPoint(u,y,v));
// Original local cameras; orientation is already baked into the model.
export const VIEWS = {
  overview: [toWorld(-150,100,175),toWorld(0,12,8)],
  facade: [church(-102,19,0),church(-22,17,0)],
  roof: [toWorld(0,320,0),toWorld(0,0,0)],
  apse: [church(116,38,35),church(30,14,0)],
  street: [church(-58,7,46),church(-4,14,0)],
  portal: [church(-47,6.5,0),church(-24,5.8,0)],
  tower: [church(-48,36,24),church(-20,26,7.8)],
  turret: [church(5,27,35),church(-17,23,11)],
  cloister: [convent(36,16,-70),convent(36,10,28)],
  arcade: [convent(32,3,-10),convent(8,3,-5)],
};
