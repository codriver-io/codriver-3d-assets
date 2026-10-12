import * as THREE from "three";
import { SPEC } from "./config.js";
export const PODIUM = [[4.9021137, 52.383697], [4.9021233, 52.3837356], [4.9020599, 52.3837415], [4.9018708, 52.3838981], [4.9018239, 52.3839369], [4.9019971, 52.3840154], [4.9020258, 52.3840285], [4.9020548, 52.3840416], [4.9020699, 52.3840294], [4.9020878, 52.3840133], [4.902125, 52.3839837], [4.9021423, 52.3839694], [4.9021459, 52.3839665], [4.902288, 52.3838495], [4.9022918, 52.383849], [4.9022817, 52.3838079], [4.9023473, 52.383802], [4.9023891, 52.3837674], [4.9024752, 52.3836961], [4.90259, 52.3836006], [4.9025589, 52.3835866], [4.9025417, 52.3835789], [4.9024107, 52.38352], [4.9023543, 52.3834946], [4.9022417, 52.383591], [4.902219, 52.3836098]];
export const ANNEX = [[4.9023543, 52.3834946], [4.9022417, 52.383591], [4.9024752, 52.3836961], [4.90259, 52.3836006], [4.9025589, 52.3835866], [4.9025417, 52.3835789], [4.9024107, 52.38352]];
export const ENTRY = [[4.9024903, 52.3838304], [4.9024835, 52.3838006], [4.902481, 52.3837896], [4.9023687, 52.3838], [4.9023473, 52.383802], [4.9022817, 52.3838079], [4.9022918, 52.383849]];
export const SHAFT_ANGLE = -9 * Math.PI / 180;
export const CROWN_ANGLE = -54 * Math.PI / 180;
export const geographic = ([lng,lat]) => [(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180), -(lat-SPEC.origin[1])*111320];
export function point(x,y,z,angle=SHAFT_ANGLE) { return [Math.cos(angle)*x+Math.sin(angle)*z,y,-Math.sin(angle)*x+Math.cos(angle)*z]; }
export function quad(b, mat, pts, normal) {
 const a=new THREE.Vector3(...pts[0]),c=new THREE.Vector3(...pts[1]),d=new THREE.Vector3(...pts[2]);
 if(c.sub(a).cross(d.sub(a)).dot(new THREE.Vector3(...normal))<0) pts=[pts[0],pts[3],pts[2],pts[1]];
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,mat);
}
export function flatRoof(b,ring,y,mat) {
 const p=ring.map(geographic),tri=THREE.ShapeUtils.triangulateShape(p.map(v=>new THREE.Vector2(...v)),[]);
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p.flatMap(([x,z])=>[x,y,z]),3));g.setIndex(tri.flatMap(([a,c,d])=>{const v=p[c],w=p[d],u=p[a];return ((v[0]-u[0])*(w[1]-u[1])-(v[1]-u[1])*(w[0]-u[0]))<0?[a,c,d]:[a,d,c]}));g.computeVertexNormals();b.put(g,mat);
}
