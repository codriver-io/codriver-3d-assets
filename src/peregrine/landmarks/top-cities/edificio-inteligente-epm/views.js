import { point } from './geometry.js';
const view=(eye,target)=>[point(...eye),point(...target)];
export const VIEWS = {
  overview: view([-155,105,155],[0,27,0]),
  facade: view([-205,50,1],[-4,29,0]),
  rear: view([170,80,-140],[0,28,0]),
  roof: view([-70,215,85],[0,20,0]),
  entrance: view([-105,7,2],[-3,12,0]),
  detail: view([-78,44,-55],[-26,40,-27]),
};
