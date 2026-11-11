import { SPEC } from './config.js';
const v=([x,y,z])=>[x*Math.cos(SPEC.rotation)+z*Math.sin(SPEC.rotation),y,-x*Math.sin(SPEC.rotation)+z*Math.cos(SPEC.rotation)];
export const VIEWS={overview:[v([-90,47,80]),v([0,12,0])],facade:[v([-85,15,0]),v([-19,14,0])],back:[v([90,45,-70]),v([0,12,0])],roof:[[0,130,0],[0,10,0]],street:[v([-75,1.7,20]),v([-19,13,0])],detail:[v([-65,26,30]),v([-19,17,0])]};
