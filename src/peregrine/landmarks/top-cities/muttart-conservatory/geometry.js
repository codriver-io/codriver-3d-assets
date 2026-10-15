import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Two OSM control points on Tropical's NE edge give bearing 135.4 degrees.
// Using its mapped vertices bakes that orientation once, with no host rotation.
const R = 6378137, rad = Math.PI / 180;
export const local = ([lng, lat]) => [(lng-SPEC.origin[0])*rad*R*Math.cos(SPEC.origin[1]*rad), -(lat-SPEC.origin[1])*rad*R];
const indices = [[0,1,4,7], [0,1,3,5], [0,2,4,5], [0,2,4,5], [0,1,2,3]];
export const PYRAMIDS = [
  { name: 'Tropical', ring: 1, height:24, divisions:16 },
  { name: 'Arid', ring: 2, height:18, divisions:12 },
  { name: 'Feature', ring: 3, height:18, divisions:12 },
  { name: 'Temperate', ring: 4, height:24, divisions:16 },
  { name: 'Foyer', ring: 5, height:4, divisions:4 },
].map((p,i) => {
  const outer=indices[i].map(j=>local(FOOTPRINTS[p.ring][j]));
  const center=outer.reduce((a,c)=>a.map((v,k)=>v+c[k]/4),[0,0]);
  const base=i===4?null:(p.height===24?26:19.5);
  const side=Math.hypot(outer[1][0]-outer[0][0],outer[1][1]-outer[0][1]);
  return {...p, baseM:base, outer, corners:outer.map(c=>c.map((v,k)=>center[k]+(v-center[k])*(base?base/side:1)))};
});

export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail), batches=new Map();
  const V=(p)=>new THREE.Vector3(...p);
  function polygon(mat, points, faces) {
    if(!batches.has(mat))batches.set(mat,{p:[],i:[]});
    const a=batches.get(mat), off=a.p.length/3;
    a.p.push(...points.flat()); a.i.push(...faces.map(i=>i+off));
  }
  function tri(mat, points){polygon(mat,points,[0,1,2]);}
  function prism(ring, top, side, roof) {
    const v=ring.slice(0,-1).map(local), shape=v.map(([x,z])=>new THREE.Vector2(x,z));
    for(const t of THREE.ShapeUtils.triangulateShape(shape,[])){
      let a=t.map(i=>[...v[i]]); // top faces are counterclockwise viewed from above.
      const p=a.map(([x,z])=>[x,top,z]);
      if(V(p[1]).sub(V(p[0])).cross(V(p[2]).sub(V(p[0]))).y<0)p.reverse();
      tri(roof,p); tri(side,p.map(([x,,z])=>[x,0,z]).reverse());
    }
    const area=v.reduce((s,p,i)=>{const q=v[(i+1)%v.length];return s+p[0]*q[1]-q[0]*p[1];},0);
    for(let i=0;i<v.length;i++){
      const a=v[i],c=v[(i+1)%v.length],q=[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]];
      polygon(side,q,area>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);
    }
  }
  // Complete mapped service foundation; only the small central link is raised
  // into a grass-covered berm. The surrounding park remains host-owned.
  prism(FOOTPRINTS[0],0.8,'concrete','concrete');
  const bermOuter=[[0,-22],[22,0],[0,22],[-22,0]], bermInner=[[0,-11],[11,0],[0,11],[-11,0]];
  for(let i=0;i<4;i++){
    if(i===2)continue; // Southwest cut opens the recessed entrance and approach.
    const j=(i+1)%4,pts=[bermOuter[i],bermInner[i],bermInner[j],bermOuter[j]].map(([x,z],k)=>[x,k===0||k===3?.8:1.75,z]);
    polygon('roof',pts,[0,1,2,0,2,3]);
    tri('roof',[[0,1.75,0],[bermInner[j][0],1.75,bermInner[j][1]],[bermInner[i][0],1.75,bermInner[i][1]]]);
  }
  for(const p of PYRAMIDS){
    const cx=p.corners.reduce((s,c)=>s+c[0],0)/4, cz=p.corners.reduce((s,c)=>s+c[1],0)/4;
    const base=0.8, apex=[cx,p.height,cz];
    const n=detail==='near'?p.divisions:p.divisions/2;
    for(let f=0;f<4;f++){
      let a=[p.corners[f][0],base,p.corners[f][1]], c=[p.corners[(f+1)%4][0],base,p.corners[(f+1)%4][1]];
      const normal=V(c).sub(V(a)).cross(V(apex).sub(V(a)));
      if(normal.x*((a[0]+c[0])/2-cx)+normal.z*((a[2]+c[2])/2-cz)<0)[a,c]=[c,a];
      const point=(i,j)=>a.map((v,k)=>v+(c[k]-v)*i/n+(apex[k]-v)*j/n);
      function cell(points,variant=false){
        // Exact in-plane offsets keep thin diagonals and stronger horizontal
        // aluminium rails without stacked faces or broad dark tile borders.
        const vv=points.map(V),normal=vv[1].clone().sub(vv[0]).cross(vv[2].clone().sub(vv[0])).normalize();
        const edgeWidth=(a,c)=>Math.abs(a.y-c.y)<1e-5?(detail==='near'?.06:.07):(detail==='near'?.023:.028);
        const inner=vv.map((v,i)=>{
          const prev=vv[(i+2)%3],next=vv[(i+1)%3];
          const a=normal.clone().cross(v.clone().sub(prev).normalize()),c=normal.clone().cross(next.clone().sub(v).normalize());
          const dot=a.dot(c),wa=edgeWidth(prev,v),wc=edgeWidth(v,next),den=1-dot*dot;
          return v.clone().addScaledVector(a,(wa-dot*wc)/den).addScaledVector(c,(wc-dot*wa)/den).toArray();
        });
        const glass=((f%2)^variant)?'glassShade':'glass';
        function clip(poly, y, above){
          const result=[];
          for(let i=0;i<poly.length;i++){
            const a=poly[i],c=poly[(i+1)%poly.length],ia=above?a[1]>=y:a[1]<=y,ic=above?c[1]>=y:c[1]<=y;
            if(ia)result.push(a);
            if(ia!==ic){const t=(y-a[1])/(c[1]-a[1]);result.push(a.map((v,k)=>v+(c[k]-v)*t));}
          }
          return result;
        }
        function fan(mat,poly){for(let i=1;i<poly.length-1;i++)tri(mat,[poly[0],poly[i],poly[i+1]]);}
        if(p.name==='Foyer')tri(glass,inner);
        else {
          const low=base+(p.height-base)*0.78,high=base+(p.height-base)*0.83;
          fan(glass,clip(inner,low,false));
          fan('vent',clip(clip(inner,low,true),high,false));
          fan(glass,clip(inner,high,true));
        }
        polygon('frame',[...points,...inner],[0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5]);
      }
      for(let j=0;j<n;j++)for(let i=0;i<n-j;i++){
        cell([point(i,j),point(i+1,j),point(i,j+1)],(i+2*j)%7===0);
        if(i+j<n-1)cell([point(i+1,j),point(i+1,j+1),point(i,j+1)],(i+2*j)%7===0);
      }
    }
  }
  // Recessed southwest entrance vestibule, connected to the low service base.
  // Door opening is formed from separate wall jambs and a lintel, not a glass
  // overlay on an opaque wall. This small volume stays inside the main outer.
  const angle=Math.PI/4, co=Math.cos(angle), si=Math.sin(angle);
  const at=(u,y,v)=>[-4+u*co-v*si,y,4+u*si+v*co];
  const box=(mat,u,y,v,w,h,d)=>b.box(mat,at(u,y,v),[w,h,d],-angle);
  box('roof',0,2.65,0,8.5,0.3,7);
  box('concrete',-4.05,1.65,0,0.4,1.7,7);
  box('concrete',4.05,1.65,0,0.4,1.7,7);
  box('concrete',-3.7,1.65,3.3,1.1,1.7,0.4);
  box('concrete',3.7,1.65,3.3,1.1,1.7,0.4);
  box('concrete',0,2.4,3.3,6.3,0.2,0.4);
  box('glassShade',0,1.55,3.05,6.3,1.5,0.08);
  box('frame',0,1.55,3.15,0.08,1.5,0.12);
  for(const [mat,a] of batches){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.i);g.computeVertexNormals();b.put(g,mat);
  }
  const group=b.finish();
  // Pale silver-blue glazing survives the shared opaque vertex-shaded app
  // path. Two close tones suggest reflections without a random tile palette.
  group.traverse(o=>{if(o.isMesh&&['glass','glassShade'].includes(o.material.name)){
    o.material.transparent=false;o.material.opacity=1;o.material.roughness=0.12;o.material.metalness=0.25;
  }});
  return group;
}
