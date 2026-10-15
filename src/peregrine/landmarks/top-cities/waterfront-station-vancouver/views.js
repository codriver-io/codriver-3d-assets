import { localPoint } from './geometry.js';
const view=(eye,target)=>[localPoint(...eye),localPoint(...target)];
export const VIEWS = {
  overview: view([105,65,145],[0,9,8]),
  facade: view([2,18,185],[2,11,27]),
  street: view([-50,6,110],[0,10,30]),
  colonnade: view([8,9,68],[2,8,30]),
  rear: view([-75,48,-120],[0,9,0]),
  roof: view([5,175,55],[0,0,2]),
};
