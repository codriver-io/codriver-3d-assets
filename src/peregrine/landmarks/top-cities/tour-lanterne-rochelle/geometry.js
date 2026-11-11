import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,cyl,wall,put,near,lathe}=k;
 const n=near?48:32,windows=[{a:.14,y0:6,y1:8,w:.9},{a:2.0,y0:10,y1:12,w:1.0},{a:3.7,y0:16,y1:18,w:.65},{a:5.15,y0:6,y1:8,w:.7}];
 const angles=[...Array.from({length:n},(_,i)=>i*Math.PI*2/n),...windows.flatMap(o=>[o.a-o.w/18,o.a+o.w/18])].sort((a,b)=>a-b);angles.push(angles[0]+Math.PI*2);
 const ys=[0,6,8,10,12,16,18,21.5];
 for(let j=0;j<ys.length-1;j++)for(let i=0;i<angles.length-1;i++){
  const a=angles[i],b=angles[i+1],mid=(a+b)/2,y=(ys[j]+ys[j+1])/2;
  const mat=windows.some(o=>y>o.y0&&y<o.y1&&Math.abs(mid-o.a)<o.w/18+.00001)?'glass':'plaster';
  const p=(a,y)=>[9*Math.sin(a),y,9*Math.cos(a)];k.poly(mat,[p(a,ys[j]),p(b,ys[j]),p(b,ys[j+1]),p(a,ys[j+1])],[0,1,2,0,2,3]);
 }
 cyl('plaster',0,0,9,9,0,.35,n);cyl('plaster',0,0,9.5,9.5,21.5,22.3,n);
 function gallery(r,y0,h,count){
  cyl('plaster',0,0,r,r,y0,y0+.35,near?48:32);
  for(let i=0;i<count;i++){const a=i*Math.PI*2/count;box('plaster',(r-.2)*Math.sin(a),y0+.35+h/2,(r-.2)*Math.cos(a),.24,h,.24);}
  cyl('plaster',0,0,r+.05,r+.05,y0+.35+h-.1,y0+.35+h+.15,near?48:32);
 }
 gallery(9.5,22.0,.95,near?48:32);
 for(let i=0;i<(near?48:32);i++){const a=i*Math.PI*2/(near?48:32),g=new THREE.BoxGeometry(.45,.7,.6);g.rotateY(a);g.translate(9.02*Math.sin(a),21.25,9.02*Math.cos(a));put(g,'plaster');}
 // Geometric radial taper of the octagonal shaft only; unrelated to terrain placement.
 const rawPut=k.b.put;k.b.put=(g,mat,...rest)=>{const p=g.attributes.position;for(let i=0;i<p.count;i++){const f=1.12-.24*(p.getY(i)-23.3)/(37.9-23.3);p.setX(i,p.getX(i)*f);p.setZ(i,p.getZ(i)*f);}g.computeVertexNormals();rawPut(g,mat,...rest);};
 // Tapered octagonal stone shaft with the small true Gothic lancets.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,r=5.45,w=2*r*Math.tan(Math.PI/8);
  wall('plaster',w,23.3,37.9,.65,(r-.65)*Math.sin(a),(r-.65)*Math.cos(a),a,i%2===0?[{u:0,y:26.0,w:1.0,h:3.5,arch:true,mat:'shadow'}]:[]);
  // Thin engaged corner shafts, never unsupported members.
  const rr=r/Math.cos(Math.PI/8);cyl('plaster',rr*Math.sin(a+Math.PI/8),rr*Math.cos(a+Math.PI/8),.15,.15,23.3,37.9,near?8:5);
 }
 k.b.put=rawPut;
 gallery(5.65,37.9,.8,near?32:24);
 cyl('plaster',0,0,5.1,.08,39.15,57.5,8);cyl('plaster',0,0,.08,.08,57.5,58,6);
 // Sparse connected crockets and face ribs follow the long needle in both LODs.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  for(let y=41;y<56;y+=near?1.7:3.4){const r=5.1*(57.5-y)/(57.5-39.15);const g=new THREE.BoxGeometry(.27,.28,.35);g.rotateY(a);g.translate(r*Math.sin(a),y,r*Math.cos(a));put(g,'plaster');}
 }
 // The projecting neo-Gothic lantern is a glazed bay, not omitted from its namesake tower.
 box('plaster',0,23.2,6.4,3.05,.35,2.8);
 wall('plaster',2.8,23.35,30.4,.35,0,7.25,0,[{u:0,y:24,w:1.8,h:5.6,arch:true,mat:'glass'}]);
 for(const s of [-1,1])wall('plaster',2.0,23.35,30.4,.35,s*1.1,6.4,s*Math.PI/2,[{u:0,y:24,w:1.05,h:5.4,arch:true,mat:'glass'}]);
 box('plaster',0,30.45,6.4,3.05,.3,2.8);
 cyl('plaster',0,6.4,2.0,0,30.6,33.5,4);
 for(const x of [-1.3,1.3])for(const z of [5.2,7.6]){cyl('plaster',x,z,.19,.19,29.8,32.3,6);cyl('plaster',x,z,.35,0,32.3,34,6);}
 // Small attached stair turret at the opposite side of the lower gallery.
 cyl('plaster',5.8,0,1.05,1.05,23.3,28.5,near?16:10);cyl('plaster',5.8,0,1.35,.03,28.5,36.5,near?16:10);
 return k.finish();
}
