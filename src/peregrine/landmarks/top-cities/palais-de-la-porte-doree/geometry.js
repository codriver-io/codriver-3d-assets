import * as THREE from'three';import clipping from'polygon-clipping';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./palais-de-la-porte-doree-parts.js';
const source=local(FOOTPRINTS[0],SPEC.origin),A=source[27],B=source[0],length=Math.hypot(B[0]-A[0],B[1]-A[1]),D=[(B[0]-A[0])/length,(B[1]-A[1])/length],N=[D[1],-D[0]];export const WIDTH=length;export const point=(u,v,y)=>[A[0]+D[0]*u+N[0]*v,y,A[1]+D[1]*u+N[1]*v];
export const COLUMNS=Array.from({length:26},(_,i)=>({u:1.2+i*(length-2.4)/25,v:1.05}));
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),uv=source.map(p=>[D[0]*(p[0]-A[0])+D[1]*(p[1]-A[1]),N[0]*(p[0]-A[0])+N[1]*(p[1]-A[1])]),base=simplify(source,.2),convert=p=>p.map(([u,v])=>{const q=point(u,v,0);return[q[0],q[2]];}),rect=(u,v,w,d)=>convert([[u-w/2,v-d/2],[u+w/2,v-d/2],[u+w/2,v+d/2],[u-w/2,v+d/2]]),solid=(mat,u,v,y,w,d,h)=>{const p=rect(u,v,w,d);s.shell(p,y+h/2,{bottom:y-h/2,windows:false,wall:mat,capTop:false});s.cap(p,y+h/2,mat);};
 s.shell(base,3.2,{windows:false,wall:'stone'});
 const body=clipping.difference([uv],[[[-10,-10],[length+10,-10],[length+10,3],[-10,3],[-10,-10]]]);for(const p of body)s.shell(convert(p[0]),16.2,{bottom:3.2,pitch:near?3.5:13/3,bay:near?3:8,band:2.2,mullion:near?1.2:2.5,wall:'stone',glass:'glass',skipSide:(a,c)=>[a,c].every(q=>Math.abs(N[0]*(q[0]-A[0])+N[1]*(q[1]-A[1])-3)<.01)});
 // Original grouped human and animal silhouettes, not copied sculpture.
 // One connected head/torso/limb outline per figure; physical 0.30 m relief.
 const human=[[-.55,0],[-.2,0],[-.05,1],[.2,0],[.55,0],[.3,1.35],[.32,1.95],[.85,2.3],[1.05,2.75],[.82,2.85],[.6,2.5],[.23,2.28],[.2,2.55],[.38,2.7],[.4,3.05],[.2,3.3],[-.2,3.3],[-.4,3.05],[-.38,2.7],[-.2,2.55],[-.23,2.28],[-.7,2.05],[-1.15,2.2],[-1.25,1.98],[-.75,1.72],[-.32,1.92],[-.3,1.35]];
 const animal=[[-2,1.6],[-1.7,1.9],[.6,1.8],[1.1,2.3],[1.5,2.6],[1.6,2.2],[2,2],[1.9,1.7],[1.25,1.6],[.9,.8],[.8,0],[.55,0],[.5,1],[-.8,.9],[-1.2,0],[-1.45,0],[-1.2,1.1],[-1.8,1.2],[-2.2,1.9]];
 const backing=[[0,3.2],[length/2-4,3.2],[length/2-4,8],[length/2+4,8],[length/2+4,3.2],[length,3.2],[length,16.2],[0,16.2]];
 const figures=[];const polygon=(p,depth,mat,holes=[])=>{const all=[...p,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(p.map(v=>new THREE.Vector2(...v)),holes.map(h=>h.map(v=>new THREE.Vector2(...v)))))s.tri(mat,...t.map(i=>point(all[i][0],depth,all[i][1])));};
 const figure=(outline,u,y,scale=1,mirror=1)=>{const p=outline.map(([x,h])=>[u+x*scale*mirror,y+h*scale]);figures.push(p);polygon(p,2.7,'relief');for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];s.quad('relief',point(a[0],3,a[1]),point(c[0],3,c[1]),point(c[0],2.7,c[1]),point(a[0],2.7,a[1]));}};
 for(let bay=0;bay<6;bay++){const u=(bay+.5)*length/6;figure(human,u-2,10.3,1,bay%2?-1:1);figure(human,u+1.4,9.8,.85,bay%2?1:-1);figure(animal,u,6.2,.9,bay%2?-1:1);}
 polygon(backing,3,'stone',figures);
 s.quad('glass',point(length/2-4,2.9,3.2),point(length/2+4,2.9,3.2),point(length/2+4,2.9,8),point(length/2-4,2.9,8));
 for(const c of COLUMNS){solid('frame',c.u,c.v,9.7,.62,.72,13);if(near){for(const y of[5,8.2,11.4,14.6])solid('stone',c.u,c.v,y,.635,.735,.06);}}
 // Entablature directly bears on every column,central bay rises in two steps.
 for(const [lo,hi,top]of[[0,length/2-12,17.4],[length/2-12,length/2+12,18.5],[length/2+12,length,17.4]])solid('roof',(lo+hi)/2,2, (16.2+top)/2,hi-lo,4,top-16.2);

 // Twelve contiguous entrance treads,all ground overlay surfaces>=0.10m.
 for(let i=0;i<12;i++){const h=.12+(i+1)*(3.2-.12)/12;solid('stone',length/2,-7.2+(i+.5)*.6,h/2,14,.6,h);}
 for(let row=0;row<3;row++)for(let col=0;col<7;col++)solid('glass',10+col*(length-20)/6,17+row*16,16.55,5,4,.7);
 const m=s.finish();m.userData.identity='26 open portico columns and broad stepped entrance under central raised canopy';return m;}
