import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './jpmorgan-chase-tower-dallas-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,prism,wall,cap,face,flush}=t;
 const mapped=[[42.2169164980771,-0.03736361249316644],[41.875974871889724,6.643084079560058],[40.719019859922824,6.635369920072609],[36.90954558063414,6.619964756074705],[30.763800811881083,6.598256858691958],[29.326303401284402,8.41956570104711],[19.39435182394772,8.279775908126242],[18.2854310612725,10.209259042795711],[-3.6334736862120587,10.66119335475969],[-3.808627537293053,8.282015950963054],[-13.721768001030359,7.924891890474102],[-13.576216717529352,5.661760292331239],[-25.344021607320077,6.047570993037871],[-24.954101331020784,-28.19716455953091],[-25.050012478192233,-33.23638567447259],[-24.343769780104132,-36.24549696499232],[-8.245693541579003,-38.645475543942],[8.93873932896329,-38.80985663839507],[9.056932263519252,-33.197347847051006],[11.117699808474688,-32.915542169157234],[13.357351064330919,-32.70674118709044],[13.795527382013384,-38.84914947643427],[44.76571365607002,-35.96452047422142],[44.72166342068002,-11.780054655299672]];
 prism(mapped,0,176,'stone',{floors:44,margin:.20});
 // Two columns and a supported lintel leave a real through-opening in both LODs.
 prism(rect(21,40,-9.5,-14),176,204,'stone',{floors:7,bays:6,margin:.17});
 prism(rect(21,40,29.5,-14),176,204,'stone',{floors:7,bays:6,margin:.17});
 prism(rect(18,40,10,-14),200,204,'stone',{floors:1,bays:5,margin:.15});
 // Elliptic split crown: opaque glass is partitioned into adjoining panes, with no backing faces.
 const n=near?24:12,zs=[-34,6],height=x=>204+21*Math.sqrt(Math.max(0,1-(x/30)**2));
 for(const [left,right]of [[-30,-1.5],[1.5,30]])for(let i=0;i<n/2;i++){
  const x=left+(right-left)*i/(n/2),xx=left+(right-left)*(i+1)/(n/2),h=height(x),hh=height(xx),cx=10;
  for(const sign of[-1,1]){const z=sign===1?zs[1]:zs[0],out=[0,0,sign],rows=near?5:3;for(let j=0;j<rows;j++){const lo=204+(h-204)*j/rows,hi=204+(h-204)*(j+1)/rows,llo=204+(hh-204)*j/rows,hhi=204+(hh-204)*(j+1)/rows;const point=(u,v)=>[cx+x+(xx-x)*u,lo+(llo-lo)*u+((hi-lo)+(hhi-llo-hi+lo)*u)*v,z],patch=(mat,l,r,b,t)=>face(mat,[point(l,b),point(r,b),point(r,t),point(l,t)],out);patch('roof',0,1,0,.04);patch('roof',0,1,.96,1);patch('roof',0,.04,.04,.96);patch('roof',.96,1,.04,.96);patch('glass',.04,.96,.04,.96);}}
  face('roof',[[cx+x,h,zs[0]],[cx+xx,hh,zs[0]],[cx+xx,hh,zs[1]],[cx+x,h,zs[1]]],[0,1,0]);
 }
 for(const x of[-30,-1.5,1.5,30]){const cx=x+10,h=height(x);face('glass',[[cx,204,-34],[cx,204,6],[cx,h,6],[cx,h,-34]],[x<0?1:-1,0,0]);}
 return flush(Math.PI/4);
}
