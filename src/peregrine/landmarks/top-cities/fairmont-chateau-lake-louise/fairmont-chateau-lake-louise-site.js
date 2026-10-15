import { FOOTPRINTS } from './footprint.js';
// Spherical metric constants, same local frame as Mercator divided by origin stretch.
const R=6378137,lat=51.41768*Math.PI/180;
export const local=([lng,la])=>[(lng+116.21705)*Math.PI/180*R*Math.cos(lat),-R*(Math.log(Math.tan(Math.PI/4+la*Math.PI/360))-Math.log(Math.tan(Math.PI/4+lat/2)))*Math.cos(lat)];
export const RING=FOOTPRINTS[0].slice(0,-1).map(local);
const seq=(a,c)=>RING.slice(a,c+1);
export const WINGS=[
 {name:'Painter',ring:[...seq(55,65)],eave:28.5,a:[-109,-41.8],c:[-65.5,-37.5],width:12,top:36,copper:true},
 {name:'Barott',ring:[RING[65],RING[55],RING[54],RING[42],RING[41],RING[78],RING[77]],eave:31.5,a:[-45.75,-28.95],c:[.45,15.95],width:20,corners:[RING[55],RING[54],RING[41],RING[77]],top:40,copper:true},
 {name:'Glacier',ring:seq(42,54),eave:31.5,a:[-2,28],c:[6,71],width:24,top:39,copper:false},
 {name:'Mount Temple',ring:[...seq(0,24),[112,-31]],eave:22,a:[125,-26],c:[176,5],width:31,top:31,copper:true},
 {name:'Fitness',ring:seq(66,77),eave:10,a:[-58,-64],c:[-38,-42],width:19,top:15,copper:false},
];
export function roofFrame(wing){const dx=wing.c[0]-wing.a[0],dz=wing.c[1]-wing.a[1],L=Math.hypot(dx,dz),u=[dx/L,dz/L],v=[-u[1],u[0]];return {L,u,v,at:(t,y,d)=>[wing.a[0]+u[0]*t+v[0]*d,y,wing.a[1]+u[1]*t+v[1]*d]};}
