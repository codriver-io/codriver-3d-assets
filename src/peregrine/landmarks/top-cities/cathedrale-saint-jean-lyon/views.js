import { toWorld } from './cathedrale-saint-jean-lyon-kit.js';
const view=(eye,target)=>[toWorld(...eye),toWorld(...target)];
export const VIEWS = {
 overview: view([-103,73,110],[0,19,4]),
 facade: view([-122,25,4],[-43,22,4]),
 roof: view([-32,153,85],[0,14,4]),
 east: view([113,48,77],[15,20,4]),
 north: view([11,40,-119],[0,19,4]),
 street: view([-97,5.5,35],[-40,18,4]),
 portal: view([-78,10,11],[-43,11,4]),
 rose: view([-72,25,4],[-43,24.2,4]),
};
