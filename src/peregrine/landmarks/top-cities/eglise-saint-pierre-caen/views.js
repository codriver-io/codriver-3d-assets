import {world} from './eglise-saint-pierre-caen-kit.js';
const view=(eye,target)=>[world(eye),world(target)];
export const VIEWS={
 overview:view([-108,78,112],[4,30,-7]),
 facade:view([-165,48,12],[-15,35,-6]),
 back:view([112,53,-83],[20,23,-9]),
 roof:view([20,170,50],[8,8,-8]),
 entrance:view([-62,10,-8],[-21,12,-9.4]),
 tower:view([-49,51,61],[-11.2,46,3.9]),
 chevet:view([72,15,34],[33,13,-8]),
};
