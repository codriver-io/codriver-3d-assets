import { MILLS,point } from './zaanse-schans-windmills-site.js';
const kat=MILLS[2],sheep=MILLS[4];
export const VIEWS={
 overview:[[-365,70,-4],[0,7,-4]],
 facade:[[-205,32,-10],[0,9,-10]],
 back:[[125,60,-100],[0,8,-10]],
 roof:[[10,350,-15],[0,0,-15]],
 street:[point(kat,26,3.5,52),point(kat,0,12,0)],
 detail:[point(sheep,19,18,45),point(sheep,0,13,0)],
};
