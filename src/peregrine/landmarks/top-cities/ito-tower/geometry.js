import polygonClipping from 'polygon-clipping';
import {parts} from './ito-tower-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;
const A=[[-19.793,-47.477],[11.591,-54.045],[12.686,-37.992],[-17.963,-17.743]],B=[[-17.963,-17.743],[12.686,-37.992],[15.74,8.807],[-16.235,10.833]],C=[[15.74,8.807],[17.699,38.952],[-14.426,39.041],[-16.235,10.833]],L=[[-55.244,-38.315],[-55.618,-36],[-52.421,-35.443],[-51.917,-37.536],[-39.994,-39.117],[-39.94,-38.215],[-23.955,-39.284],[-24.03,-40.519],[-19.405,-40.82],[-18.317,-24.523],[-49.455,-22.575],[-47.156,12.903],[-16.235,10.833],[-14.65,35.579],[-71.86,36.147],[-76.833,-34.319],[-55.142,-38.939]];const opts={pitch:2.6,fraction:.94,sill:.43,roof:'roof'};
 function band(r,y0,y1){prism('stone',r,y0,y1,{...opts,rows:Math.max(1,Math.round((y1-y0)/3.8))});}
 function pierced(r,h,lo,hi,z0,z1){band(r,0,lo);band(r,hi,h);for(const cut of [[[-200,-200],[200,-200],[200,z0],[-200,z0]],[[-200,z1],[200,z1],[200,200],[-200,200]]]){const clipped=polygonClipping.intersection([r],[cut]);for(const q of clipped)band(q[0].slice(0,-1),lo,hi);}}
 band(A,0,26);band(L,0,26);pierced(B,66,30,52,-17,-5);pierced(C,100,77,88,20,30);
 
 return p.finish();
}
