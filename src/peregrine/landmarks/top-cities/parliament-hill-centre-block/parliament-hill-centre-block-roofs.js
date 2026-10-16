// Photo-estimated complete roof volumes. u runs along the south facade, v toward the lawn.
// OSM splits each slope into independent parts; these envelopes join both pitches at a ridge.
export const WINGS = [
  { id:'front-west', bounds:[-43.1,-5,-23.9,-11.77], h:29, rise:9, material:'slate' },
  { id:'front-east', bounds:[5,42.6,-23.9,-11.77], h:29, rise:9, material:'slate' },
  { id:'west-front', bounds:[-66.59,-43.1,-11.3,.5], h:27, rise:7, material:'slate' },
  { id:'east-front', bounds:[42.6,66.94,-10.65,-.25], h:27, rise:7, material:'slate' },
  { id:'west-return', bounds:[-66.59,-60.25,-31.1,-11.3], h:27, rise:7, material:'copper' },
  { id:'east-return', bounds:[61.8,66.94,-32.72,-10.65], h:27, rise:7, material:'copper' },
  { id:'commons', bounds:[-65.35,-42.7,-63.2,-23.9], h:30, rise:10, material:'copper' },
  { id:'senate', bounds:[45.2,61.8,-64.15,-20.08], h:30, rise:10.7, material:'copper' },
  { id:'rear', bounds:[-42.8,42.7,-71.82,-61.5], h:29, rise:9, material:'copper' },
];
export const COURTS = [
  { id:'west-court', bounds:[-42.7,-11.8,-61.5,-23.9], h:20.5, rise:4.5, material:'copper' },
  { id:'hall-of-honour', bounds:[-11.8,11.8,-61.5,-23.9], h:21.5, rise:5.5, material:'copper' },
  { id:'east-court', bounds:[11.8,45.2,-61.5,-23.9], h:20.5, rise:4.5, material:'copper' },
];
export const REPLACED_PARTS = new Set([
  947988693,947988694,947988695,947988696,947988697,947988698,947988699,947988700,
  947988701,947988702,947988703,947988705,947988706,947988707,947988708,947988709,
  947988718,947988724,947988725,947988726,947988727,947988730,947988731,947988733,
  947988734,947988735,947988736,947988737,947988738,947988739,
]);
export const rectangle=([u0,u1,v0,v1])=>[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
export const roofPart=p=>({...p, ring:rectangle(p.bounds), min:0, roof:'complete-hip'});

export function completeRoof(k,p){
  const [u0,u1,v0,v1]=p.bounds,u=(u0+u1)/2,v=(v0+v1)/2,w=u1-u0,d=v1-v0;
  const alongU=w>d,short=Math.min(w,d),end=Math.min(short*.46,Math.max(w,d)*.22);
  // Steep lower mansard, shallow upper pitch and a genuine long, narrow ridge.
  const shoulder=rectangle([u0+end*.6,u1-end*.6,v0+end*.6,v1-end*.6]);
  const ridge=alongU?rectangle([u0+end,u1-end,v-.12,v+.12]):rectangle([u-.12,u+.12,v0+end,v1-end]);
  k.loft(p.material,rectangle(p.bounds),shoulder,p.h-p.rise,p.h-p.rise*.22);
  k.loft(p.material,shoulder,ridge,p.h-p.rise*.22,p.h);
}
