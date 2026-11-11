import { SPEC } from './config.js';
const v=([x,y,z])=>[x*Math.cos(SPEC.rotation)+z*Math.sin(SPEC.rotation),y,-x*Math.sin(SPEC.rotation)+z*Math.cos(SPEC.rotation)];
export const VIEWS={overview:[v([-110,66,100]),v([0,26,0])],facade:[v([-120,29,0]),v([-31,29,0])],back:[v([110,50,-80]),v([0,24,0])],roof:[[0,170,0],[0,20,0]],street:[v([-100,1.7,25]),v([-31,29,0])],detail:[v([-75,37,35]),v([-31,37,0])]};
