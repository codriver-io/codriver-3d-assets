import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
// Literal geographic conversion, WGS84 spherical local frame; no runtime imports.
const rad = Math.PI / 180, R = 6378137;
export const local = ([lng, lat]) => [(lng - SPEC.origin[0]) * rad * R * Math.cos(SPEC.origin[1] * rad), -(lat - SPEC.origin[1]) * rad * R];
function simplify(ring) {
  let pts = ring.map(local), changed = true;
  while (changed && pts.length > 4) { changed = false; for (let i = 0; i < pts.length; i++) {
    const a = pts[(i + pts.length - 1) % pts.length], p = pts[i], c = pts[(i + 1) % pts.length];
    const dist = Math.abs((c[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(c[1]-a[1])) / Math.hypot(c[0]-a[0],c[1]-a[1]);
    if (dist < 0.18) { pts.splice(i,1); changed=true; break; }
  }} return pts;
}
export const SOUTH = simplify(FOOTPRINTS[0]), NORTH = simplify(FOOTPRINTS[1]);
// OSM tower control points: -87.6248041,41.889426 to -87.624721,41.8895173.
export const TOWER = { x: 3.10, z: 23.15, bearing: 34.12, width: 12.0, depth: 12.3 };
const theta = 55.88 * rad;
export const towerPoint = (x,y,z) => [TOWER.x+x*Math.cos(theta)+z*Math.sin(theta),y,TOWER.z-x*Math.sin(theta)+z*Math.cos(theta)];
export const BRIDGES = [
  { y: 9.6, bottom: 7.3, top: 11.9, a: [-8, 16.5], c: [-8, -3.2], width: 5.3 },
  { y: 49, bottom: 47.2, top: 50.8, a: [-5.3, 15.8], c: [-5.3, -3.9], width: 4.1 },
];
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const box=(m,x,y,z,w,h,d,angle=0)=>b.box(m,[x,y,z],[w,h,d],angle);
  const tbox=(m,x,y,z,w,h,d)=>b.box(m,towerPoint(x,y,z),[w,h,d],theta);
  const prism=(ring,y0,y1,m='terra')=>{
    const s=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);b.put(g,m);
  };
  const scaled=(ring,f)=>{const c=ring.reduce((a,p)=>[a[0]+p[0]/ring.length,a[1]+p[1]/ring.length],[0,0]);return ring.map(p=>[c[0]+(p[0]-c[0])*f,c[1]+(p[1]-c[1])*f]);};
  // Exterior quads, with explicit outward normals and one consistent layer order.
  function panel(m,c,u,n,w,h) {
    const v=[...[-1,1].flatMap(s=>[-1,1].map(t=>[c[0]+u[0]*s*w/2,c[1]+t*h/2,c[2]+u[1]*s*w/2]))];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v.flat(),3));
    const cross=[-u[1],u[0]];g.setIndex(cross[0]*n[0]+cross[1]*n[1]>0?[0,2,1,1,2,3]:[0,1,2,1,3,2]);g.computeVertexNormals();b.put(g,m);
  }
  function edges(ring,fn){const area=ring.reduce((a,p,i)=>{const q=ring[(i+1)%ring.length];return a+p[0]*q[1]-q[0]*p[1];},0);ring.forEach((p,i)=>{const q=ring[(i+1)%ring.length],len=Math.hypot(q[0]-p[0],q[1]-p[1]),u=[(q[0]-p[0])/len,(q[1]-p[1])/len],n=area>0?[u[1],-u[0]]:[-u[1],u[0]];fn(p,u,n,len,i);});}
  function facade(ring,base,top,pitch=3.65,storey=3.5) {
    edges(ring,(p,u,n,len,ei)=>{
      if(len<3)return;const cols=Math.max(1,Math.floor(len/pitch)), step=len/cols;
      const rows=Math.floor((top-base)/storey);
      for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){
        if(!near && (j%2 && cols>5))continue;
        const s=step*(j+.5), y=base+(k+.5)*storey, w=Math.min(1.4,step*.47)*(near?1:1.08), h=storey*.59;
        const c=[p[0]+u[0]*s+n[0]*.18,y,p[1]+u[1]*s+n[1]*.18];
        panel((j+3*k+ei)%7===0?'glow':'glass',c,u,n,w,h);
        if(near && k<10){
          panel('trim',[c[0]+n[0]*.13,y-h/2-.14,c[2]+n[1]*.13],u,n,w+.3,.22);
          panel('metal',[c[0]+n[0]*.12,y-.14,c[2]+n[1]*.12],u,n,w,.075);
          panel('metal',[c[0]+n[0]*.12,y,c[2]+n[1]*.12],u,n,.055,h);
        }
      }
      if(near) for(let j=0;j<=cols;j++) {
        const s=step*j, angle=Math.atan2(-u[1],u[0]);
        if(s>1 && s<len-1) box('terra',p[0]+u[0]*s+n[0]*.14,(base+top)/2,p[1]+u[1]*s+n[1]*.14,.29,top-base,.42,angle);
      }
      // Continuous stone vertical piers at corners; paired capitals below the cornice.
      for(const s of [0.7,len-.7]) {const angle=Math.atan2(-u[1],u[0]);box('terra',p[0]+u[0]*s, (base+top)/2,p[1]+u[1]*s, .7,top-base,.7,angle);}
      if(near)for(let j=0;j<cols;j++){const s=step*(j+.5);box('trim',p[0]+u[0]*s+n[0]*.25,top+.25,p[1]+u[1]*s+n[1]*.25,.55,.55,.5);}
    });
  }
  // The two mapped, irregular blocks, with the pedestrian plaza left entirely open.
  for(const [ring,h] of [[SOUTH,64],[NORTH,72]]){
    prism(ring,0,h);facade(ring,7,h-2);
    for(const [y,thick,f] of [[1,.65,1.001],[7,.8,1.008],[h-7,.65,1.008],[h-1.5,.5,1.025],[h-.7,.45,1.028],[h,1.1,1.028]])prism(scaled(ring,f),y,y+thick,'terra');
    prism(scaled(ring,.965),h+1.1,h+1.25,'terra');
    // Base shopfronts and the tall Michigan Avenue entrance rhythm.
    facade(ring,1.5,6.5,4.6,5);
    edges(ring,(p,u,n,len)=>{if(len<5)return;for(let s=1.2;s<len;s+=near?3.5:7){box('trim',p[0]+u[0]*s,h+1.55,p[1]+u[1]*s,.45,.9,.45);}});
  }
  // The north cornice is crowned by corner cresting and pedimented parapets,
  // rather than a freestanding rooftop office box. All ornaments seat on the roof.
  edges(NORTH,(p,u,n,len)=>{
    if(len<5)return;
    const angle=Math.atan2(-u[1],u[0]);
    for(const s of [1.3,len-1.3]) {
      const x=p[0]+u[0]*s-n[0]*.35,z=p[1]+u[1]*s-n[1]*.35;
      box('terra',x,74.05,z,1.5,1.7,1.5,angle);
      box('terra',x,75.0,z,1.8,.4,1.8,angle);
      const g=new THREE.CylinderGeometry(.12,.65,1.5,near?8:5);g.translate(x,75.95,z);b.put(g,'terra');
    }
    if(len>12) {
      const x=p[0]+u[0]*len/2-n[0]*.25,z=p[1]+u[1]*len/2-n[1]*.25;
      box('terra',x,74.1,z,7,1.7,1,angle);
      // Triangular pediment extruded along the face normal, physically on parapet.
      const shape=new THREE.Shape([new THREE.Vector2(-3.5,74.95),new THREE.Vector2(3.5,74.95),new THREE.Vector2(0,77.0)]);
      const g=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false});
      g.rotateY(angle);g.translate(x-n[0]*.5,0,z-n[1]*.5);b.put(g,'terra');
    }
  });
  // Monumental Michigan Avenue doorway on the southeast-facing south block.
  {
    const edge=SOUTH.map((p,i)=>[p,SOUTH[(i+1)%SOUTH.length]]).find(([p,q])=>p[0]>-5 && q[0]>-5 && Math.abs(q[1]-p[1])>15);
    if(edge){const [p,q]=edge,len=Math.hypot(q[0]-p[0],q[1]-p[1]),u=[(q[0]-p[0])/len,(q[1]-p[1])/len],n=[-u[1],u[0]],cx=(p[0]+q[0])/2,cz=(p[1]+q[1])/2;
      // The mapped winding here faces northeast; correct the normal to point east.
      if(n[0]<0){n[0]*=-1;n[1]*=-1;}
      panel('glass',[cx+n[0]*.4,5.5,cz+n[1]*.4],u,n,4.5,10);
      for(const s of [-2.7,2.7])box('terra',cx+u[0]*s+n[0]*.5,5.3,cz+u[1]*s+n[1]*.5,1,10.6,1,Math.atan2(-u[1],u[0]));
      const shape=new THREE.Shape();shape.absarc(0,10.6,3.2,0,Math.PI,false);shape.lineTo(-2.3,10.6);shape.absarc(0,10.6,2.3,Math.PI,0,true);shape.closePath();
      const g=new THREE.ExtrudeGeometry(shape,{depth:.6,bevelEnabled:false,curveSegments:near?12:6});
      g.rotateY(Math.atan2(n[0],n[1]));g.translate(cx+n[0]*.3,0,cz+n[1]*.3);b.put(g,'terra');
    }
  }
  // The South tower is square on its measured diagonal bearing, not the city grid.
  tbox('terra',0,82.25,0,12,34.5,12.3);
  const tring=[[-6,-6.15],[6,-6.15],[6,6.15],[-6,6.15]].map(([x,z])=>{const p=towerPoint(x,0,z);return[p[0],p[2]];});
  facade(tring,66,98.5,3.4,3.6);
  for(const y of [66,98.8,109.0])tbox('terra',0,y,0,13,1.1,13.3);
  tbox('terra',0,104,0,12.4,9.2,12.7);
  // Four 19 ft 7 in clock faces, radial batons, and visible hands.
  for(let face=0;face<4;face++){
    const a=theta+face*Math.PI/2,n=[Math.sin(a),Math.cos(a)],u=[Math.cos(a),-Math.sin(a)];
    const center=[TOWER.x+n[0]*6.55,104.2,TOWER.z+n[1]*6.55];
    const disk=new THREE.CircleGeometry(2.985,near?48:24);disk.rotateY(a);disk.translate(...center);b.put(disk,'dial');
    const inner=new THREE.RingGeometry(2.83,2.96,near?48:24);inner.rotateY(a);inner.translate(center[0]+n[0]*.14,center[1],center[2]+n[1]*.14);b.put(inner,'metal');
    const rim=new THREE.RingGeometry(3.02,3.23,near?48:24);rim.rotateY(a);rim.translate(center[0]+n[0]*.15,center[1],center[2]+n[1]*.15);b.put(rim,'trim');
    for(let k=0;k<12;k++){
      const ang=k*Math.PI/6,r=2.48, sc=Math.sin(ang)*r, y=center[1]+Math.cos(ang)*r;
      panel('metal',[center[0]+u[0]*sc+n[0]*.17,y,center[2]+u[1]*sc+n[1]*.17],u,n,k%3===0?.17:.11,k%3===0?.54:.34);
    }
    const at=(s,y,off=.21)=>[center[0]+u[0]*s+n[0]*off,y,center[2]+u[1]*s+n[1]*off];
    b.bar('metal',at(0,104.2),at(.75,105.55),.18,.13);b.bar('metal',at(0,104.2),at(-1.7,105.35),.13,.1);
  }
  // Open belfry: corner piers and intermediate columns carry the entablature.
  for(const x of [-5.15,5.15])for(const z of [-5.3,5.3])tbox('terra',x,113.3,z,1.5,7.6,1.5);
  for(const f of [-1,1])for(const q of [-1.65,1.65]){tbox('terra',q,113.3,f*5.3,.6,7.6,.8);tbox('terra',f*5.15,113.3,q,.8,7.6,.6);}
  tbox('glass',0,113.2,0,8.6,6.4,8.6);
  tbox('terra',0,117.2,0,13.1,1.2,13.4);tbox('terra',0,118.4,0,11.2,1.2,11.5);
  const cyl=(m,r1,r0,h,x,y,z,seg=near?16:8)=>{const g=new THREE.CylinderGeometry(r1,r0,h,seg);g.translate(x,y,z);b.put(g,m);};
  // Giralda-inspired octagonal setback drum above the square belfry cornice.
  cyl('terra',4.45,4.85,2,TOWER.x,120,TOWER.z,8);
  cyl('terra',4.7,4.7,.5,TOWER.x,121.25,TOWER.z,8);
  // Slender, taller open lantern with eight columns seated on the octagonal drum.
  cyl('metal',.9,1.4,3.6,TOWER.x,123.3,TOWER.z);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,x=TOWER.x+3.5*Math.cos(a),z=TOWER.z+3.5*Math.sin(a);
    cyl('terra',.32,.42,7.7,x,125.35,z,near?8:5);
    cyl('terra',.55,.55,.45,x,121.725,z,8);
    cyl('terra',.55,.55,.45,x,128.975,z,8);
  }
  cyl('terra',4.25,4.25,.8,TOWER.x,129.6,TOWER.z);
  const profile=[[4.25,130],[3.7,130.4],[2.45,131],[1.45,131.6],[.6,132],[0,132.2]].map(p=>new THREE.Vector2(...p));
  const cap=new THREE.LatheGeometry(profile,near?24:12);cap.translate(TOWER.x,0,TOWER.z);b.put(cap,'terra');
  cyl('terra',.22,.6,.6,TOWER.x,132.35,TOWER.z,8);
  cyl('metal',.07,.16,1.5,TOWER.x,133.25,TOWER.z,6);
  // Four urn pinnacles stand on broad square pedestals at the belfry corners.
  for(const x of [-5.2,5.2])for(const z of [-5.35,5.35]){
    tbox('terra',x,118.5,z,1.2,1.4,1.2);
    const p=towerPoint(x,119.55,z);cyl('terra',.65,.35,.7,...p,near?10:6);
    const q=towerPoint(x,120.15,z);cyl('terra',0,.65,.5,...q,near?10:6);
  }
  // Two enclosed skybridges, embedded at each end in the named north/south blocks.
  for(const bridge of BRIDGES){const {a,c,y,width,bottom,top}=bridge,len=a[1]-c[1];
    box('terra',a[0],y,(a[1]+c[1])/2,width,top-bottom,len);
    for(const x of [a[0]-width/2,a[0]+width/2])for(let z=c[1]+1.3;z<a[1]-.6;z+=2.5){const n=[x<a[0]?-1:1,0];panel('glass',[x+n[0]*.18,y+.1,z],[0,1],n,1.5,2);}
    box('terra',a[0],top+.25,(a[1]+c[1])/2,width+.4,.5,len);
  }
  const root=b.finish();
  // Weld identical position/normal vertices in each material batch; preserve hard edges.
  for(const mesh of root.children){const original=mesh.geometry;mesh.geometry=mergeVertices(original,1e-5);original.dispose();}
  return root;
}
