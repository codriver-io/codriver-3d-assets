import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './moulin-neuf-terrebonne-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const theta=Math.atan2(LOCAL_RINGS[0][3][1]-LOCAL_RINGS[0][0][1],LOCAL_RINGS[0][3][0]-LOCAL_RINGS[0][0][0]);
const rings=LOCAL_RINGS.map(r=>r.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)])),R=rings[0],A=rings[1];
const us=R.map(p=>p[0]),vs=R.map(p=>p[1]),lo=Math.min(...us),hi=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs),L=hi-lo,W=v1-v0;
function arch(x,w,h){const n=near?12:8,sp=h-w/2,r=[[x-w/2,.03],[x+w/2,.03]];for(let i=0;i<=n;i++){const a=i*Math.PI/n;r.push([x+Math.cos(a)*w/2,sp+Math.sin(a)*w/2]);}return r;}
// Closed wall shells, including reveals around real voids. The culverts pass through the basement.
function wall(axis,plane,s0,s1,holes,sign){const outer=[[s0,0],[s1,0],[s1,3.4],[s0,3.4]],all=[...outer,...holes.flat()],xyz=(s,y,p)=>axis==='u'?[s,y,p]:[p,y,s],out=axis==='u'?[0,0,sign]:[sign,0,0],inner=plane-sign*.45;
 const tris=THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p))));
 for(const t of tris){face('stone',t.map(i=>xyz(all[i][0],all[i][1],plane)),out);face('stone',t.map(i=>xyz(all[i][0],all[i][1],inner)),out.map(v=>-v));}
 for(const h of holes)for(let i=0;i<h.length;i++){const a=h[i],c=h[(i+1)%h.length],mid=[(a[0]+c[0])/2,(a[1]+c[1])/2],cent=h.reduce((s,p)=>[s[0]+p[0]/h.length,s[1]+p[1]/h.length],[0,0]),n=axis==='u'?[cent[0]-mid[0],cent[1]-mid[1],0]:[0,cent[1]-mid[1],cent[0]-mid[0]];face('stone',[xyz(a[0],a[1],plane),xyz(c[0],c[1],plane),xyz(c[0],c[1],inner),xyz(a[0],a[1],inner)],n);}
}
const holes=[-.32,0,.32].map(k=>arch(k*L,2.6,2.1));wall('u',v0,lo,hi,holes,-1);wall('u',v1,lo,hi,holes,1);wall('v',lo,v0,v1,[arch(0,4.4,2.8)],-1);wall('v',hi,v0,v1,[arch(0,4.4,2.8)],1);
solid(R,3.4,11.1,'stone','stone',{bottom:4.1,top:10.9,dy:3.2,h:2.1,pitch:near?4.1:6.3,ratio:.3});
const roof=rect((lo+hi)/2,(v0+v1)/2,W,L,Math.PI/2);gable(roof,11.1,16.1,'roof');
// Chimneys rise out of the end gables, grounded in the masonry rather than perched above air.
for(const u of [lo+1.6,hi-1.6]){solid(rect(u,0,2.5,1.5),9.5,18,'stone','trim');solid(rect(u,0,2.9,1.9),18,18.3,'trim');}
for(const u of [-L/6,L/6]){solid(rect(u,0,1.4,1.2),15,18,'stone','trim');solid(rect(u,0,1.65,1.45),18,18.3,'trim');}
// Paired rows of dormers retain coarse separate attic bays at distance.
const count=near?9:5;for(let j=0;j<count;j++){const u=lo+4+(L-8)*(j+.5)/count;for(const sign of [-1,1]){const v=sign*4.8,r=rect(u,v,1.45,1.6);solid(r,12.2,14.2,'roof','roof',{minWallLen:.5,bottom:12.6,top:14.1,dy:1,h:1.1,pitch:1.4,ratio:.65});gable(r,14.2,14.9,'roof');}}
// Small eastern annex, with muted red framed gallery linking the two mapped envelopes.
solid(A,0,8.9,'stone','roof',{bottom:1.3,top:8.2,dy:3.3,h:2,pitch:near?3.8:6,ratio:.34});
const au=A.map(p=>p[0]),av=A.map(p=>p[1]),a0=Math.min(...au),a1=Math.max(...au),c=(Math.min(...av)+Math.max(...av))/2,aw=Math.max(...av)-Math.min(...av);gable(rect((a0+a1)/2,c,aw,a1-a0,Math.PI/2),8.9,12.8,'roof');
function edgeU(r,v,high){const xs=[];for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length];if((v>=Math.min(a[1],b[1]))&&(v<=Math.max(a[1],b[1]))&&Math.abs(b[1]-a[1])>1e-7)xs.push(a[0]+(v-a[1])*(b[0]-a[0])/(b[1]-a[1]));}return high?Math.max(...xs):Math.min(...xs);}
const vLo=Math.max(c-aw*.4,v0+.2),vHi=Math.min(c+aw*.4,v1-.2),link=[[edgeU(R,vLo,true),vLo],[edgeU(A,vLo,false),vLo],[edgeU(A,vHi,false),vHi],[edgeU(R,vHi,true),vHi]];solid(link,3.4,10.6,'red','roof',{bottom:3.8,top:10.4,dy:3.1,h:2.65,pitch:near?2.2:3.5,ratio:.86});for(const v of [c-aw*.35,c+aw*.35])solid(rect((hi+a0)/2,v,.55,.55),0,3.4,'red');
return finish(-theta);

}
