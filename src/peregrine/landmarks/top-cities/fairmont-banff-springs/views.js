import { world } from './fairmont-banff-springs-parts.js';
const camera=(u,y,v,tu=0,ty=24,tv=0)=>[world(u,y,v),world(tu,ty,tv)];
export const VIEWS={
 overview: camera(220,150,-310,45,20,10),
 facade: camera(0,60,-230,0,28,0),
 back: camera(20,70,245,5,22,5),
 roof: camera(160,300,-150,50,0,5),
 entrance: camera(10,9,-95,0,23,-25),
 detail: camera(45,61,-93,0,43,-15),
};
