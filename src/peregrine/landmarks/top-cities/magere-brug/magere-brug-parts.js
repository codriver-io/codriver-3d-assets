import {Vector3} from 'three';
export const START=-41.55,END=39.35,DECK=2.6,HINGE=5.95;
export const ANGLE=17*Math.PI/180;
// Station east-northeast; transverse positive south-southeast, right-handed.
export const point=(s,y,d)=>[s*Math.cos(ANGLE)+d*Math.sin(ANGLE),y,-s*Math.sin(ANGLE)+d*Math.cos(ANGLE)];
export const vector=(s,y,d)=>new Vector3(...point(s,y,d));
export const ARCHES = [
 [-39.8,-33.2],[-32.15,-26.4],[-25.4,-19.6],[-18.55,-12.75],[-11.7,-6.5],
 [6.5,12.55],[13.6,19.7],[20.75,26.85],[27.9,37.65],
];
