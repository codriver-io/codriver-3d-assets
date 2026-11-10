import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, FOUNTAIN_RING } from './footprint.js';

export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),angle=SPEC.rotationDeg*Math.PI/180,C=Math.cos(angle),S=Math.sin(angle);
  const local=([lng,lat])=>{const x=(lng-SPEC.origin[0])*111319.49079327358*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-lat)*111319.49079327358;return [x*C-z*S,x*S+z*C];};
  const plan=FOOTPRINTS[0].slice(0,-1).map(local);
  const put=(g,m)=>{g.rotateY(angle);b.put(g,m);};
  const box=(m,p,d)=>{const g=new THREE.BoxGeometry(...d);g.translate(...p);put(g,m);};
  const shape=(poly)=>{const s=new THREE.Shape(poly[0].map(p=>new THREE.Vector2(...p)));for(const h of poly.slice(1))s.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(...p))));return s;};
  const rect=(x,y,w,h)=>[[x-w/2,y],[x+w/2,y],[x+w/2,y+h],[x-w/2,y+h],[x-w/2,y]];
  function arch(x,y,w,h){const r=w/2,p=[[x-r,y],[x+r,y],[x+r,y+h-r]];for(let i=1,N=near?16:8;i<=N;i++){const a=i*Math.PI/N;p.push([x+r*Math.cos(a),y+h-r+r*Math.sin(a)]);}p.push([x-r,y]);return p;}
  function outward(g){const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();return g;}
  // Hip roof and the broad east gable are joined into one surface: the sampled
  // original roof planes are clipped to the mapped outline, never stacked.
  function roofY(u,v){
    const hip=4.7+Math.max(0,Math.min((u+18.3)*.48,(20.3-u)*.48,(v+14.1)*.48,(13.8-v)*.48,4.1));
    const front=(u>=-7&&v>=-6.5&&v<=13.8)?5.0+5.3*Math.max(0,1-Math.abs(v-3.65)/10.15):0;
    return Math.max(hip,front);
  }
  function wall(A,B,{front=false,clerestory=false}={}){
    const dx=B[0]-A[0],dz=B[1]-A[1],L=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx),x0=L/2,ops=[];
    const tx=(g,m)=>{g.rotateY(ang);g.translate(A[0],0,A[1]);put(g,m);};
    const cap=(p,m,depth=.80)=>{const g=outward(new THREE.ShapeGeometry(shape(p)));g.translate(0,0,depth);tx(g,m);};
    const solid=(p,m,depth=0,thickness=.9)=>{const raw=new THREE.ExtrudeGeometry(shape(p),{depth:thickness,bevelEnabled:false}),p0=raw.attributes.position,n0=raw.attributes.normal,ps=[],ns=[];for(let i=0;i<p0.count;i+=3){const sill=ops.some(o=>Math.abs(p0.getY(i)-o.y)<.01);if(n0.getZ(i)>.99||(n0.getY(i)>.1&&p0.getY(i)>4.4&&!sill))continue;for(let j=0;j<3;j++){ps.push(p0.getX(i+j),p0.getY(i+j),p0.getZ(i+j));ns.push(n0.getX(i+j),n0.getY(i+j),n0.getZ(i+j));}}raw.dispose();const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(ns,3));g.translate(0,0,depth);tx(g,m);};
    if(front){
      for(const [d,w,h] of [[-7.3,2.45,3.8],[-3.35,1.10,3.8],[0,2.9,4.25],[3.35,1.10,3.8],[7.3,2.45,3.8]]){
        ops.push({r:rect(x0+d,.18,w,h),x:x0+d,y:.18,w,h});const upperY=Math.abs(d)>6?5.0:5.12,upperH=Math.abs(d)>6?1.05:1.25;ops.push({r:rect(x0+d,upperY,1.15,upperH),x:x0+d,y:upperY,w:1.15,h:upperH});
      }
    }else if(clerestory){ops.push({r:arch(x0,10.35,2.4,1.5),x:x0,y:10.35,w:2.4,h:1.5});}
    else if(L>4){const count=Math.max(1,Math.floor(L/(near?4.2:5.6)));for(let i=0;i<count;i++){const x=(i+.5)*L/count,w=Math.min(1.65,L/count*.55);ops.push({r:rect(x,1.0,w,2.75),x,y:1,w,h:2.75});}}
    const base=clerestory?8.8:0,outline=[[0,base],[L,base]],cuts=new Set([0,L]);
    for(let s=near?1:2;s<L;s+=near?1:2)cuts.add(s);if(front)cuts.add(L/2);
    for(const s of [...cuts].sort((a,c)=>c-a)){const u=A[0]+dx*s/L,v=A[1]+dz*s/L,y=clerestory?10.9+1.4*(1-Math.abs(s-L/2)/(L/2)):roofY(u,v)-.05;outline.push([s,y]);}
    outline.push([0,base]);solid([outline,...ops.map(o=>o.r)],'brick');
    for(const o of ops){const cols=near?2:1,rows=near?3:2;
      for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
        const w=o.w/cols,h=o.h/rows,x=o.x-o.w/2+(col+.5)*w,y=o.y+row*h,gap=near?.055:.075,outer=[rect(x,y,w,h)],inner=[rect(x,y+gap,w-2*gap,h-2*gap)];
        for(const p of polygonClipping.intersection([o.r],inner))cap(p,'glass');
        for(const p of polygonClipping.intersection([o.r],polygonClipping.difference(outer,inner)))cap(p,'frame');
      }
    }
    if(front){
      // Smaller proud brick relief gable and four attached pilasters, with a
      // real central transom opening. No City Hall lettering is modelled.
      const p=[[x0-4.3,4.40],[x0+4.3,4.40],[x0+4.3,6.95],[x0,8.65],[x0-4.3,6.95],[x0-4.3,4.40]];
      solid([p,...[-3.35,0,3.35].map(d=>rect(x0+d,5.12,1.15,1.25))],'brick',-.22,.25);
      for(const d of [-4.05,-1.85,1.85,4.05])solid([rect(x0+d,.05,.45,4.4)],'brick',-.30,.36);
    }
  }
  for(let i=0;i<plan.length;i++){
    const A=plan[i],B=plan[(i+1)%plan.length],L=Math.hypot(B[0]-A[0],B[1]-A[1]);
    if(A[0]>19.4&&B[0]>19.4)continue;
    wall(A,B);
  }
  wall([20.15,-6.5],[20.15,13.8],{front:true});
  const footprint=[plan.concat([plan[0]])],step=near?.8:1.8;
  for(let u=-19;u<21;u+=step)for(let v=-15;v<15;v+=step){
    const cell=[[[u,v],[u+step,v],[u+step,v+step],[u,v+step],[u,v]]];
    for(const p of polygonClipping.intersection(footprint,cell)){
      const g=new THREE.ShapeGeometry(shape(p.map(r=>r.map(([u,v])=>[u,-v]))));g.rotateX(-Math.PI/2);const pos=g.attributes.position;
      for(let i=0;i<pos.count;i++)pos.setY(i,roofY(pos.getX(i),pos.getZ(i)));g.computeVertexNormals();put(g,'roof');
    }
  }
  // Raised rear clerestory, visible above the entrance gable from the highway.
  wall([-1,-4],[-1,6],{clerestory:true});wall([-9,6],[-9,-4],{clerestory:true});
  for(const v of [-4,6])box('brick',[-5,9.85,v],[8,2.1,.48]);
  const poly=(pts,m,n)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();if(new THREE.Vector3().fromBufferAttribute(g.attributes.normal,0).dot(new THREE.Vector3(...n))<0){const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();}put(g,m);};
  poly([[-9,10.9,-4],[-1,10.9,-4],[-1,12.3,1],[-9,12.3,1]],'roof',[0,1,-1]);
  poly([[-1,10.9,6],[-9,10.9,6],[-9,12.3,1],[-1,12.3,1]],'roof',[0,1,1]);
  // Mapped small south canopy is an open supported roof, separate from City Hall.
  for(const u of [1.7,5.6])for(const v of [13.7,17.8])box('brick',[u,1.75,v],[.38,3.5,.38]);
  poly([[1.36,3.5,13.36],[1.36,3.5,18.17],[3.65,4.45,18.17],[3.65,4.45,13.36]],'roof',[-1,1,0]);
  poly([[5.95,3.5,18.17],[5.95,3.5,13.36],[3.65,4.45,13.36],[3.65,4.45,18.17]],'roof',[1,1,0]);
  // Separate mapped fountain: low brick basin, muted water and four curved seats.
  const fp=FOUNTAIN_RING.slice(0,-1).map(local),fc=[fp.reduce((s,p)=>s+p[0],0)/fp.length,fp.reduce((s,p)=>s+p[1],0)/fp.length],N=near?64:32;
  function annulus(ri,ro,y0,y1,a0=0,a1=2*Math.PI,material='brick'){
    const n=Math.max(3,Math.ceil(N*(a1-a0)/(2*Math.PI))),P=(a,r,y)=>[fc[0]+Math.cos(a)*r,y,fc[1]+Math.sin(a)*r];
    for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n,c=a0+(a1-a0)*(i+1)/n;
      poly([P(a,ri,y1),P(a,ro,y1),P(c,ro,y1),P(c,ri,y1)],material,[0,1,0]);
      poly([P(a,ro,y0),P(c,ro,y0),P(c,ro,y1),P(a,ro,y1)],material,[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
      poly([P(c,ri,y0),P(a,ri,y0),P(a,ri,y1),P(c,ri,y1)],material,[-Math.cos((a+c)/2),0,-Math.sin((a+c)/2)]);
    }
    if(a1-a0<6)for(const [a,norm] of [[a0,[Math.sin(a0),0,-Math.cos(a0)]],[a1,[-Math.sin(a1),0,Math.cos(a1)]]])poly([P(a,ri,y0),P(a,ro,y0),P(a,ro,y1),P(a,ri,y1)],material,norm);
  }
  annulus(2.19,2.55,0,.68);
  let g=new THREE.CircleGeometry(2.19,N);g.rotateX(-Math.PI/2);g.translate(fc[0],.43,fc[1]);put(g,'water');
  annulus(2.55,6.0,0,.04,0,2*Math.PI,'stone');
  for(let i=0;i<4;i++)annulus(4.25,4.7,.04,.60,i*Math.PI/2+.22,(i+1)*Math.PI/2-.22);
  return b.finish();
}
