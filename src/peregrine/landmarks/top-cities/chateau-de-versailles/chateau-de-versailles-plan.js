import { PALACE_RINGS } from "./footprint.js";
// Spherical projection at origin (same metric convention as facade/geo.js).
const R=6378137,rad=Math.PI/180,lat0=48.8047*rad,k=1/Math.cos(lat0),c=Math.cos(22*rad),s=Math.sin(22*rad);
export const world=(u,y,v)=>[c*u-s*v,y,s*u+c*v];
export const local=([lng,lat])=>{
 const x=R*(lng-2.1203)*rad/k,z=-R*(Math.log(Math.tan(Math.PI/4+lat*rad/2))-Math.log(Math.tan(Math.PI/4+lat0/2)))/k;
 return [c*x+s*z,-s*x+c*z];
};
export const RINGS=PALACE_RINGS.map(r=>r.slice(0,-1).map(local));
export const COURTS={marble:[30,-9],royal:[85,-9],honour:[185,-9]};
export const CHAPEL={u:111.4,v:-84.15,width:22.2,length:32.4,eaves:30.7,top:44};
