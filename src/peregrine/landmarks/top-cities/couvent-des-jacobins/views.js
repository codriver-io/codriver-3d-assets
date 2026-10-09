import {toWorld} from './couvent-des-jacobins-plan.js';
const view=(eye,target)=>[toWorld(...eye),toWorld(...target)];
export const VIEWS={
  overview:view([-102,75,113],[-2,14,-30]),
  facade:view([-91,26,40],[-39,16,1]),
  south:view([65,36,107],[0,15,0]),
  back:view([96,45,-85],[5,17,-31]),
  roof:view([-52,142,67],[-2,0,-38]),
  entrance:view([-64,5,9],[-40,7,.7]),
  tower:view([47,37,-47],[16.5,33,-13.4]),
  cloister:view([-25,9,-32],[-39,3.5,-30]),
};
