import { world } from './altare-della-patria-parts.js';
const view=(eye,target)=>[world(eye),world(target)];
export const VIEWS={
  overview:view([155,115,-210],[-7,32,10]),
  facade:view([-7,48,-250],[-7,34,18]),
  roof:view([110,230,145],[-7,25,20]),
  back:view([120,80,250],[0,31,38]),
  street:view([-65,18,-180],[-7,35,15]),
  detail:view([2,65,-25],[-7,52,37]),
  quadriga:view([89,90,-26],[38,64,37]),
};
