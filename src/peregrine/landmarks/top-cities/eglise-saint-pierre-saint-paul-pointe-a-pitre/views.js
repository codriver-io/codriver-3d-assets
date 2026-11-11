import { SPEC } from './config.js';
const v=([x,y,z])=>[x*Math.cos(SPEC.rotation)+z*Math.sin(SPEC.rotation),y,-x*Math.sin(SPEC.rotation)+z*Math.cos(SPEC.rotation)];
export const VIEWS={overview:[v([-105,60,100]),v([0,15,0])],facade:[v([-100,13,0]),v([-28,12,0])],back:[v([100,45,-75]),v([20,17,0])],roof:[[0,150,0],[0,10,0]],street:[v([-85,1.7,20]),v([-28,12,0])],detail:[v([75,35,-55]),v([30,27,-9])]};
