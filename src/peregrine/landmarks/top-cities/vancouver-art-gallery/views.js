import { ANGLE } from './vancouver-art-gallery-site.js';
const c=Math.cos(ANGLE),s=Math.sin(ANGLE);
const w=([u,y,v])=>[u*c-v*s,y,u*s+v*c];
const view=(eye,target)=>[w(eye),w(target)];
export const VIEWS = {
  overview:view([83,63,-104],[-2,12,6]),
  facade:view([-2,14,-115],[-2,12,-15]),
  back:view([65,38,115],[-8,12,18]),
  roof:view([28,137,35],[-4,7,15]),
  entrance:view([23,9,-63],[-2,9,-25]),
  dome:view([27,36,-42],[-2,22,-5.6]),
  plan:view([-2,160,17],[-2,0,17]),
};
