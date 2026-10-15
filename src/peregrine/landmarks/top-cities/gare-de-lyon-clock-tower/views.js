import { ROTATION } from './gare-de-lyon-clock-tower-site.js';
const p=([u,y,v])=>[u*Math.cos(ROTATION)+v*Math.sin(ROTATION),y,-u*Math.sin(ROTATION)+v*Math.cos(ROTATION)];
const view=(a,b)=>[p(a),p(b)];
export const VIEWS = {
  overview:view([-185,135,-230],[12,24,45]),
  facade:view([0,35,-180],[0,25,-20]),
  back:view([170,110,315],[30,20,105]),
  roof:view([15,355,80],[15,0,80]),
  street:view([-88,9,-105],[-20,25,-20]),
  detail:view([-73,53,-80],[-37.3,47,-25.6]),
};
