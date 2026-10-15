import { sitePoint } from './geometry.js';
const view=(a,t)=>[sitePoint(...a).toArray(),sitePoint(...t).toArray()];
export const VIEWS={
  overview:view([-290,160,95],[-75,12,-80]),
  facade:view([-290,32,-90],[-133,17,-98]),
  back:view([165,95,-160],[-65,10,-85]),
  roof:view([-100,310,-70],[-75,0,-85]),
  street:view([-225,6,-117],[-145,17,-110]),
  detail:view([-183,32,-68],[-147.3,31.5,-92.1]),
};
