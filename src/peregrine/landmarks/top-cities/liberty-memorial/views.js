import { worldPoint } from './liberty-memorial-parts.js';
const view = (e,t) => [worldPoint(...e),worldPoint(...t)];
export const VIEWS = {
 overview:view([120,105,150],[0,25,8]), facade:view([0,19,160],[0,31,0]),
 back:view([-65,50,-145],[0,24,0]), roof:view([35,180,80],[0,5,10]),
 entrance:view([22,5,76],[0,4,44]), detail:view([18,64,26],[0,64,0]), hall:view([80,20,38],[55,12,0]),
};
