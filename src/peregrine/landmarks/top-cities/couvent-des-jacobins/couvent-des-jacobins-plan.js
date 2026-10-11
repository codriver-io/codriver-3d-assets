// Control points: 1.4397352,43.6035367 → 1.4400419,43.6035720 on the long north wall.
export const THETA = Math.atan2(3.929396,24.723);
export const TOWER = {u:16.5,v:-13.4,flat:3.65};
export const BAY_U = [-35.7,-26.3,-16.9,-7.5,1.9,11.3,20.7];
export const toWorld = (u,y,v) => [u*Math.cos(THETA)+v*Math.sin(THETA),y,-u*Math.sin(THETA)+v*Math.cos(THETA)];
