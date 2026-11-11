import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './uga-arch-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,prism,ellipse,loft,cyl,sphere,face,flush}=t;
 for(const x of[-1.25,0,1.25]){prism(rect(.4464,.3302,x,0),0,.48,'iron');prism(rect(.44,.33,x,0),.48,.54,'iron');cyl('iron',x,0,.18,.54,.60,.15,near?20:12);
 const n=near?48:24,ring=Array.from({length:n},(_,i)=>{const a=i*2*Math.PI/n,r=.115+.009*Math.cos(12*a);return[x+r*Math.cos(a),r*Math.sin(a)];});loft([ring,ring.map(([X,z])=>[x+(X-x)*.86,z*.86])],[.60,2.14],'iron');cyl('iron',x,0,.15,2.14,2.21,.17,near?16:8);prism(rect(.33,.32,x,0),2.21,2.28,'iron');}
 b.box('iron',[0,2.375,0],[2.9464,.19,.24]);
 // Closed thin elliptical arch rib; genuine void below, no filled semicircular panel.
 const n=near?40:24,outer=[],inner=[];for(let i=0;i<=n;i++){const a=i*Math.PI/n;outer.push([1.4*Math.cos(a),2.47+.8828*Math.sin(a)]);inner.push([1.34*Math.cos(a),2.47+.8228*Math.sin(a)]);}for(let i=0;i<n;i++){for(const z of[-.055,.055])face('iron',[[...outer[i],z],[...outer[i+1],z],[...inner[i+1],z],[...inner[i],z]],[0,0,Math.sign(z)]);for(const[ring,sign]of[[outer,1],[inner,-1]])face('iron',[[...ring[i],-.055],[...ring[i],.055],[...ring[i+1],.055],[...ring[i+1],-.055]],[sign*ring[i][0],sign*(ring[i][1]-2.47),0]);}
 // Paired scrolls contact the beam and arch spring, with attached stylised cast leaves.
 for(const side of[-1,1]){const pts=[],segments=near?28:14;for(let i=0;i<=segments;i++){const q=i/segments,a=-Math.PI/2+q*Math.PI*2,r=.25*(1-q*.82);pts.push([side*(1.10+r*Math.cos(a)),2.72+r*Math.sin(a),0]);}b.bar('iron',[side*1.1,2.47,0],pts[0],.035);for(let i=0;i<segments;i++)b.bar('iron',pts[i],pts[i+1],.032);for(let j=0;j<3;j++){const x=side*(.72+j*.13),y=2.52+j*.08;face('iron',[[x,y,-.035],[x-side*.16,y+.08,-.035],[x-side*.12,y+.18,-.035]],[0,0,-1]);face('iron',[[x,y,.035],[x-side*.16,y+.08,.035],[x-side*.12,y+.18,.035]],[0,0,1]);b.bar('iron',[x,y,0],[side*1.0,2.51,0],.027);}}
 for(const x of[-1.32,1.32]){cyl('iron',x,0,.075,2.47,2.59,.11,near?12:6);sphere('lamp',x,2.73,0,.15);}
 return flush(Math.PI/12);
}
