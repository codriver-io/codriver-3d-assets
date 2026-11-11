import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './gas-south-arena-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,prism,wall,cap,loft,face,flush}=t,ring=[[-58.26882199520506,42.40220626625762],[-57.62046972135141,-23.55075956360481],[-12.291578862561511,-48.603805900721675],[-9.752867327596977,-78.01369170921822],[3.434592385372838,-76.96836688099131],[14.913290098543786,-72.96337945106978],[22.566530769942126,-68.31340461422283],[25.119623127295746,-77.70111285670167],[33.14972272367849,-74.77453150329627],[40.87515521059849,-70.6741665160167],[48.45716138509745,-63.6487431732747],[53.80932679579893,-78.86294501681333],[70.69184282152705,-64.53975084826573],[86.01201448926996,-42.54487431226583],[96.65944722022542,-20.39418879859351],[100.81102087487137,-0.8370178969490993],[102.61877018240993,20.78614300824436],[98.64803543233764,42.50514633326969],[78.38211698980172,29.09501405491091],[77.24341358003906,37.011285639685916],[73.80657711764123,49.88639729274273],[70.07600658629867,60.316741131233286],[39.862232374181275,46.304862204460875],[0.9414951223724621,70.13452734297493]],core=[[-58.26882199520506,42.40220626625762],[-57.62046972135141,-23.55075956360481],[-12.291578862561511,-48.603805900721675],[-10,-66],[22,-57],[53,-40],[61,-17],[60,23],[39.862232374181275,46.304862204460875],[0.9414951223724621,70.13452734297493]];
 const sg=Math.sign(ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0));
 ring.forEach((a,i)=>{const c=ring[(i+1)%ring.length],front=i>=10&&i<=21;wall(a,c,0,18.1,'brick',{floors:front?3:1,margin:front?.07:.42,base:.4,trim:front?'metal':null},sg);});cap(ring,18.1,'roof');
 prism(core,18.1,23,'stone',{floors:1,margin:.25,roof:'roof',bottom:false});
 const inner=core.map(([x,z])=>[2+(x-2)*.90,2+(z-2)*.90]);loft([core,inner],[23,29],'roof',{caps:false});cap(inner,29,'roof');
 for(const x of[-22,13])prism([[x-2,-27],[x+2,-27],[x,31]],29,31.5,'roof',{bottom:false});
 // Pale curved entrance cornice is a closed, supported strip rather than a detached sheet.
 const outer=ring.slice(11,18),inset=outer.map(([x,z])=>[25+(x-25)*.91,z*.91]);
 for(let i=0;i<outer.length-1;i++){const a=outer[i],c=outer[i+1],u=inset[i],v=inset[i+1];face('stone',[[a[0],18.5,a[1]],[c[0],18.5,c[1]],[v[0],18.5,v[1]],[u[0],18.5,u[1]]],[0,1,0]);face('stone',[[a[0],18.1,a[1]],[u[0],18.1,u[1]],[v[0],18.1,v[1]],[c[0],18.1,c[1]]],[0,-1,0]);for(const[p,q]of [[a,c],[v,u]])face('stone',[[p[0],18.1,p[1]],[q[0],18.1,q[1]],[q[0],18.5,q[1]],[p[0],18.5,p[1]]],[p[0]-25,0,p[1]]);}
 for(const i of[0,outer.length-1]){const a=outer[i],u=inset[i];face('stone',[[a[0],18.1,a[1]],[u[0],18.1,u[1]],[u[0],18.5,u[1]],[a[0],18.5,a[1]]],[i===0?-1:1,0,0]);}
 return flush(Math.PI/6);
}
