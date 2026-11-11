import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './meyerson-symphony-center-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,prism,face,cap,wall,flush}=t;
 const ring=[[44.010308686871625,-30.312514114201115],[43.49640186157443,-15.571429350533634],[49.08272427435659,-15.400707666738008],[48.632391095850835,-2.3907541489010633],[51.40569486056769,4.44425016339466],[52.908960987982496,12.82721838012586],[52.62360624393781,35.227563203380114],[48.249672737140614,35.088503523088],[48.04563209533017,40.851069498163355],[-1.1795117868014486,39.3745215833901],[-1.0792649697688788,36.38913542639705],[3.223478734556714,36.5199774053402],[3.264045101111954,35.552990148340186],[0.15920149793852545,35.45506439250943],[0.4864962356962881,25.94296826917045],[-4.440480590595884,24.384998873633684],[-8.121465625909673,21.80602561523702],[-13.818823557693914,16.439271215744892],[-17.737043670973982,10.537429905356326],[-19.71247002455771,2.9574865171809304],[-20.078946672908383,-4.603552727217948],[-19.489587800373513,-9.335336432544965],[-18.27050219894021,-12.288152555375488],[-29.227898099508472,-33.88783361054892],[-49.512400705811714,-33.37579969441844],[-47.293451624479545,-52.03210226220293],[49.70064599375359,-49.11832429280038],[49.044456109679295,-30.158704558041038]],center=[17,-6];
 prism(ring,0,5,'stone',{floors:1,bays:0,margin:.12,base:.4});
 const upper=ring.map(([x,z])=>[center[0]+(x-center[0])*.84,center[1]+(z-center[1])*.84]);
 const signed=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0),sg=Math.sign(signed);
 // Ruled conoid faces: mullions adjoin glass instead of floating above an opaque backing.
 for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],u=upper[i],v=upper[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),cols=Math.max(1,Math.ceil(len/(near?2.5:5))),out=[sg*(c[1]-a[1]),.1,-sg*(c[0]-a[0])];
  const point=(s,t)=>[a[0]+(c[0]-a[0])*s+(u[0]+(v[0]-u[0])*s-a[0]-(c[0]-a[0])*s)*t,5+19*t,a[1]+(c[1]-a[1])*s+(u[1]+(v[1]-u[1])*s-a[1]-(c[1]-a[1])*s)*t];
  const patch=(mat,l,r,lo,hi)=>face(mat,[point(l,lo),point(r,lo),point(r,hi),point(l,hi)],out);
  if(i>=23||i<=1){patch('stone',0,1,0,1);continue;}
  const rows=near?4:3;for(let row=0;row<rows;row++){const lo=row/rows,hi=(row+1)/rows;patch('metal',0,1,lo,lo+.012);patch('metal',0,1,hi-.012,hi);for(let j=0;j<cols;j++){const l=j/cols,r=(j+1)/cols,p=.035/cols;patch('metal',l,l+p,lo+.012,hi-.012);patch('metal',r-p,r,lo+.012,hi-.012);patch('glass',l+p,r-p,lo+.012,hi-.012);}}
 }
 cap(upper,24,'roof');
 const hall=rect(37,55).map(([x,z])=>[15+x*Math.cos(26*Math.PI/180)+z*Math.sin(26*Math.PI/180),-7-x*Math.sin(26*Math.PI/180)+z*Math.cos(26*Math.PI/180)]);
 prism(hall,0,35,'stone',{roof:'stone'});
 // Portal piers planted at grade; the crosshead bears on both, and the opening remains empty.
 b.box('stone',[-18,12.25,-29],[4,24.5,4]);b.box('stone',[-18,12.25,18],[4,24.5,4]);b.box('stone',[-18,26,-5.5],[4,3,51]);
 return flush(Math.PI/4);
}
