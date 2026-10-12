import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, DESIGN } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// The mapped serrated plan is expressed in tower axes, then rotated once.
const c = Math.cos(DESIGN.angle), s = Math.sin(DESIGN.angle);
export const world = ([x, y, z]) => [x*c-z*s,y,x*s+z*c];
export const PLAN = FOOTPRINTS[0].map(([lng,lat]) => {
  const x=(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),z=-(lat-SPEC.origin[1])*111320;
  return [x*c+z*s,-x*s+z*c];
});
// Photo-estimated stepped shoulders; the central face continues to the roof.
export const TIERS = [
  { y0:0,y1:250,ring:PLAN },
  { y0:250,y1:258,ring:PLAN.map(([x,z])=>[Math.max(-22,Math.min(22,x)),Math.max(-22,Math.min(22,z))]) },
  { y0:258,y1:264,ring:PLAN.map(([x,z])=>[Math.max(-20,Math.min(20,x)),Math.max(-20,Math.min(20,z))]) },
  { y0:264,y1:DESIGN.roof,ring:[[-17,-17],[17,-17],[17,17],[-17,17]] },
];

export function create({detail='near'}={}) {
  const far=detail==='far',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),batches=new Map();
  function quad(mat,a,d,e,f){
    const list=batches.get(mat)||[];batches.set(mat,list);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([a,d,e,f].map(world).flat(),3));
    g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();list.push(g);
  }
  function cap(mat,ring,y,hole){
    const contour=ring.map(p=>new THREE.Vector2(...p)),holes=hole?[hole.map(p=>new THREE.Vector2(...p))]:[],pts=[...ring,...(hole||[])];
    const faces=THREE.ShapeUtils.triangulateShape(contour,holes),g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flatMap(([x,z])=>world([x,y,z])),3));
    g.setIndex(faces.flatMap(t=>{const [a,d,e]=t.map(i=>pts[i]);return (d[0]-a[0])*(e[1]-a[1])-(d[1]-a[1])*(e[0]-a[0])>0?[t[0],t[2],t[1]]:t;}));
    g.computeVertexNormals();b.put(g,mat);
  }
  // Glass cells replace the wall surface, with no background wall or overlay.
  // Far retains separate windows and piers, grouped two storeys per cell.
  for(let ti=0;ti<TIERS.length;ti++){
    const {ring,y0,y1}=TIERS[ti];
    for(let i=0;i<ring.length;i++){
      const a=ring[i],d=ring[(i+1)%ring.length],dx=d[0]-a[0],dz=d[1]-a[1],len=Math.hypot(dx,dz);
      if(len<0.05)continue;
      const cols=Math.max(1,Math.round(len/(far?4.3:2.25))),cell=len/cols,border=far?0.65:0.38;
      const wall=(mat,u0,u1,lo,hi)=>{
        if(u1-u0<0.01||hi-lo<0.01)return;
        const p=u=>[a[0]+dx*u/len,a[1]+dz*u/len],p0=p(u0),p1=p(u1);
        quad(mat,[p0[0],lo,p0[1]],[p0[0],hi,p0[1]],[p1[0],hi,p1[1]],[p1[0],lo,p1[1]]);
      };
      for(let k=0;k<cols;k++){
        const u0=k*cell,u1=(k+1)*cell,wa=u0+border,wb=u1-border;
        wall('granite',u0,wa,y0,y1);wall('granite',wb,u1,y0,y1);
        let last=y0;
        if(y0===0){wall('granite',wa,wb,0,1);wall('glass',wa,wb,1,6.5);last=6.5;}
        for(let row=0;row<DESIGN.floors;row+=far?2:1){
          const lo=DESIGN.floor0+row*DESIGN.pitch+0.65,hi=Math.min(lo+DESIGN.pitch*(far?2:1)-1.15,DESIGN.roof-0.7),low=Math.max(lo,y0),high=Math.min(hi,y1);
          if(high<=low)continue;
          wall('spandrel',wa,wb,last,low);
          wall((row*7+k*11+i*17)%13<3?'glow':'glass',wa,wb,low,high);last=high;
        }
        wall(ti===3?'granite':'spandrel',wa,wb,last,y1);
      }
    }
    cap(ti===TIERS.length-1?'roof':'granite',ring,y1,TIERS[ti+1]?.ring);
  }
  // Entry portal jambs and lintel stay within the mapped northern arm.
  if(!far){
    for(const x of [-4.6,4.6])b.box('granite',world([x,3,-24.65]),[0.65,6,0.65],-DESIGN.angle);
    b.box('granite',world([0,6.25,-24.55]),[10,0.5,0.7],-DESIGN.angle);
  }
  for(const [mat,list]of batches)for(const g of list)b.put(g,mat);

  // Open gilded cage, never a solid pyramid. Named index ranges permit testing
  // every member's actual endpoint against its support while excluding itself.
  const members=[],beltY=[DESIGN.roof,277.5,285,292.5,300,DESIGN.pyramidTop];
  const half=y=>DESIGN.crownHalf*(DESIGN.pyramidTop-y)/(DESIGN.pyramidTop-DESIGN.roof)+0.48;
  const point=(side,t,y)=>{const h=half(y),r=[[-h,-h],[h,-h],[h,h],[-h,h]],a=r[side],d=r[(side+1)%4];return[a[0]+(d[0]-a[0])*t,y,a[1]+(d[1]-a[1])*t];};
  let start=0;
  const beam=(id,a,d,width,supports)=>{
    b.bar('light',world(a),world(d),width,width);
    members.push({id,a:world(a),b:world(d),indexStart:start,indexCount:36,supports});start+=36;
  };
  for(let level=0;level<beltY.length;level++)for(let side=0;side<4;side++)
    beam(`belt-${level}-${side}`,point(side,0,beltY[level]),point(side,1,beltY[level]),level===0?0.65:0.34,level===0?['roof','roof']:[`rib-${side}-0`,`rib-${(side+1)%4}-0`]);
  const n=far?4:8;
  for(let side=0;side<4;side++)for(let k=0;k<n;k++)
    beam(`rib-${side}-${k}`,point(side,k/n,beltY[0]),point(side,k/n,beltY.at(-1)),k===0?0.48:0.19,[`belt-0-${side}`,`belt-5-${side}`]);
  for(let side=0;side<4;side++)for(let level=0;level<5;level++)for(let k=0;k<(far?2:4);k++){
    const cells=far?2:4;
    beam(`brace-${side}-${level}-${k}-a`,point(side,k/cells,beltY[level]),point(side,(k+1)/cells,beltY[level+1]),far?0.17:0.12,[`belt-${level}-${side}`,`belt-${level+1}-${side}`]);
    if(!far)beam(`brace-${side}-${level}-${k}-b`,point(side,(k+1)/cells,beltY[level]),point(side,k/cells,beltY[level+1]),0.12,[`belt-${level}-${side}`,`belt-${level+1}-${side}`]);
  }
  const spire=new THREE.CylinderGeometry(0.04,0.78,312-305.4,4,1);spire.rotateY(Math.PI/4);spire.translate(0,(312+305.4)/2,0);spire.rotateY(-DESIGN.angle);b.put(spire,'light');
  const root=b.finish();
  // Preserve index order for support tests, weld duplicate vertices without
  // changing faces, and keep authoring diagnostics out of the runtime GLB.
  for(const mesh of root.children){const old=mesh.geometry;mesh.geometry=mergeVertices(old,1e-5);old.dispose();}
  Object.defineProperty(root.userData,'crownMembers',{value:members,enumerable:false});
  return root;
}
