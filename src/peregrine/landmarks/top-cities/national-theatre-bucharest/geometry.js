import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './national-theatre-bucharest-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const ellipse=(cx,cz,rx,rz,n)=>Array.from({length:n},(_,j)=>[cx+rx*Math.cos(j*2*Math.PI/n),cz+rz*Math.sin(j*2*Math.PI/n)].map(v=>Math.round(v*1e5)/1e5)),stage=rect(43,-17,46,30),upper=ellipse(43,0,25,28,near?64:32),hat=polygonClipping.intersection([LOCAL_RINGS[0]],[[[3,-25],[100,-25],[100,100],[3,100],[3,-25]]]),annex=polygonClipping.intersection([LOCAL_RINGS[0]],[[[-100,-100],[3.3,-100],[3.3,100],[-100,100],[-100,-100]]]);
 const capPoly=(mat,poly,height,up=1)=>{const p=poly[0].slice(0,-1).map(v=>new THREE.Vector2(...v)),hs=poly.slice(1).map(r=>r.slice(0,-1).map(v=>new THREE.Vector2(...v))),a=[...p,...hs.flat()];for(const t of THREE.ShapeUtils.triangulateShape(p,hs))face(mat,t.map(j=>[a[j].x,typeof height==='function'?height(a[j].x,a[j].y):height,a[j].y]),[0,up,0]);};
 for(const poly of annex){poly[0].forEach((a,i)=>{const f=frame(poly[0],i),step=near?1.6:3.2,n=Math.max(1,Math.round(f.l/step)),w=f.l/n;for(let j=0;j<n;j++)for(let k=0;k<9;k++){const x=(f.p((j+.5)*w,0))[0],mat=f.out[2]>.5&&x>-30?((j+k)%3===0?'red':(j+k)%3===1?'stone':'glass'):(k%2?'stone':'glass');patch(mat,f,j*w,(j+1)*w,k*18.5/9,(k+1)*18.5/9);}});capPoly('roof',poly,18.5);}
 const rear=polygonClipping.difference([LOCAL_RINGS[0]],...hat,...annex,[stage]);for(const p of rear){walls(p[0].slice(0,-1),0,12.5,'stone',[[3,5],[7,9]],near?6:12,'glass',.3);capPoly('roof',p,12.5);}
 // Curved entrance wall has exact door edge stations in both LODs.
 const angles=new Set(Array.from({length:near?64:32},(_,j)=>j*2*Math.PI/(near?64:32)));for(const x of [33,38,43,48,53])for(const dx of [-1.2,1.2])angles.add(Math.acos((x+dx-43)/30));const foyer=[...angles].sort((a,b)=>a-b).map(a=>[43+30*Math.cos(a),Math.sin(a)<=0?15+40*Math.sin(a):Math.sin(a)<=.6?15+(40/.6)*Math.sin(a):55-20*(Math.sin(a)-.6)]),foyerTop=x=>15.5+2.2*((x-43)/30)**2;
 foyer.forEach((a,i)=>{const c=foyer[(i+1)%foyer.length],f=frame(foyer,i),x=(a[0]+c[0])/2,z=(a[1]+c[1])/2,front=z>40,door=front&&[33,38,43,48,53].some(d=>Math.abs(x-d)<1.21);patch(door?'glass':front?'stone':'glass',f,0,f.l,0,4.8);if(front){for(const [lo,hi,mat]of [[4.8,5,'stone2'],[5,8,'stone'],[8,8.2,'stone2'],[8.2,12,'stone'],[12,12.2,'stone2'],[12.2,14.8,'stone']])patch(mat,f,0,f.l,lo,hi);face('stone',[f.p(0,14.8),f.p(f.l,14.8),f.p(f.l,foyerTop(c[0])),f.p(0,foyerTop(a[0]))],f.out);}else{patch('stone',f,0,f.l,4.8,6);patch('glass',f,0,f.l,6,14);face('stone',[f.p(0,14),f.p(f.l,14),f.p(f.l,foyerTop(c[0])),f.p(0,foyerTop(a[0]))],f.out);}});
 for(const p of polygonClipping.difference([foyer],[upper],[stage]))capPoly('roof',p,(x)=>foyerTop(x));
 walls(upper,0,24,'stone',[[21.8,22.6]],near?4:8,'glass',.38);for(const p of polygonClipping.difference([upper],[stage]))capPoly('roof',p,24);
 const canopyY=(x,z)=>20.2+1.35*((x-43)/40)**2+.35*((z-15)/53)**2;
 const cut=polygonClipping.difference(hat,[upper],[stage]).map(p=>p.map(r=>r.map(p=>p.map(v=>Math.round(v*1e5)/1e5))));for(const poly of cut){for(let x=0;x<84;x+=near?2:4)for(let z=-28;z<72;z+=near?2:4){const d=near?2:4;for(const cell of polygonClipping.intersection(poly,[[[x,z],[x+d,z],[x+d,z+d],[x,z+d],[x,z]]])){capPoly('red',cell,canopyY);capPoly('under',cell,(x,z)=>canopyY(x,z)-1.4,-1);}}poly.forEach((r,k)=>r.slice(0,-1).forEach((a,i)=>{const c=r[(i+1)%(r.length-1)],f=frame(r.slice(0,-1),i);if(k)f.out=f.out.map(v=>-v);face('red',[[a[0],canopyY(...a)-1.4,a[1]],[c[0],canopyY(...c)-1.4,c[1]],[c[0],canopyY(...c),c[1]],[a[0],canopyY(...a),a[1]]],f.out);}));}
 // Load-carrying fins have actual arch voids and warped contact caps.
 for(const x of [11,75]){const s=new THREE.Shape();s.moveTo(-9,0);s.lineTo(-4.5,0);s.lineTo(-4.5,8);for(let j=1;j<=(near?16:8);j++){const a=Math.PI-j*Math.PI/(near?16:8);s.lineTo(4.5*Math.cos(a),8+4.5*Math.sin(a));}s.lineTo(4.5,0);s.lineTo(9,0);s.lineTo(9,20);s.lineTo(-9,20);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:4,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-2,0,0);g.rotateY((x<43?1:-1)*Math.PI/9);g.translate(x,0,35);const p=g.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>19.9)p.setY(i,canopyY(p.getX(i),p.getZ(i))-1.4);g.computeVertexNormals();b.put(g,'stone');}
 // Pale fly-tower panels terminate at a shallow bowed crown, rather than a flat box.
 const top=x=>37.2+1.4*((x-43)/23)**2;stage.forEach((a,i)=>{const f=frame(stage,i),n=Math.max(1,Math.round(f.l/(near?5:10))),step=f.l/n;for(let k=0;k<10;k++)for(let j=0;j<n;j++)patch((j*3+k)%7===0?'stone2':'stone',f,j*step,(j+1)*step,k*3.68,(k+1)*3.68);for(let j=0;j<n;j++){const a=f.p(j*step,36.8),c=f.p((j+1)*step,36.8);face('stone',[a,c,[c[0],top(c[0]),c[2]],[a[0],top(a[0]),a[2]]],f.out);}});
 for(let j=0;j<(near?16:8);j++){const a=20+j*46/(near?16:8),c=20+(j+1)*46/(near?16:8);face('roof',[[a,top(a),-32],[c,top(c),-32],[c,top(c),-2],[a,top(a),-2]],[0,1,0]);}
 // Rooftop outdoor amphitheatre: terraced semicircular seats around an open stage.
 for(let k=0;k<4;k++){const inner=13+k*1.5,outer=inner+1.5,lo=24,hi=24+(k+1)*.45,n=near?32:16;for(let j=0;j<n;j++){const a=j*Math.PI/n,c=(j+1)*Math.PI/n,P=(r,t,y)=>[43+r*Math.cos(t),y,3+r*.9*Math.sin(t)];face('stone',[P(inner,a,hi),P(outer,a,hi),P(outer,c,hi),P(inner,c,hi)],[0,1,0]);face('stone',[P(outer,a,lo),P(outer,c,lo),P(outer,c,hi),P(outer,a,hi)],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);}}
 for(const x of [22.8,27.1])block(x,9,1.7,4.4,24,27,'red','red');

return finish();
}
