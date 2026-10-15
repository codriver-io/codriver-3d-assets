import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { mapped, bowl, hall, centre, top, sill, bottom, resample, scaled } from './rogers-place-shape.js';

// Original analytic loft: the drifting-snow steel ribbons, oil-drop plan and Ford Hall.
export function create({ detail='near' }={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),buckets=new Map();
  function quad(mat,a,c,d,e,out) {
    if(!buckets.has(mat))buckets.set(mat,{p:[],i:[]});
    const g=buckets.get(mat),o=g.p.length/3;
    const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));
    g.p.push(...a,...c,...d,...e);
    if(n.dot(new THREE.Vector3(...out))>=0)g.i.push(o,o+1,o+2,o,o+2,o+3);else g.i.push(o,o+2,o+1,o,o+3,o+2);
  }
  const pos=(p,y,r=1)=>{const a=scaled(p,r);return [a[0],y,a[1]];};
  const ring=resample(mapped,near?3.6:7.5);
  // Eight disjoint surfaces at each station: no stacked skin faces or dark overlays.
  // A recessed curved reveal divides the silver cladding; the upper glazed eye narrows at its ends.
  function levels(p) {
    const h=top(p),scoop=Math.exp(-(((p[0]+56)/27)**2)-(((p[1]-64)/32)**2));
    const lo=Math.min(bottom(p)-3*scoop,h-11);
    const upper=h-4.2;
    const base=upper-4.1;
    const wave=Math.max(lo+.3,Math.min(upper-4.1,base*(1-scoop)+10*scoop));
    const second=wave+3+(upper-wave-3)*.52;
    return [sill(p),lo,wave,wave+3,second,second+.3,upper,h-.7,h];
  }
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],c=ring[(i+1)%ring.length],A=levels(a),C=levels(c),out=[c[1]-a[1],0,a[0]-c[0]];
    // mapped ring winds clockwise in x/z; outward normal is corrected from ring centre below.
    
    // For the concave hall edge use signed polygon orientation rather than a radial normal.
    const area=mapped.reduce((s,p,j)=>{const q=mapped[(j+1)%mapped.length];return s+p[0]*q[1]-q[0]*p[1];},0);
    if(area<0){out[0]*=-1;out[2]*=-1;}
    const radii=[.988,1,1,.999,.99,.989,.965,.965,.98];
    const mats=['glass','silver','shadow','silver','seam','highlight','glass','silver'];
    for(let j=0;j<8;j++) {
      const r0=radii[j],r1=radii[j+1];
      // Split the broad metal skin vertically to let vertex normals bend gently.
      const metal=j===1||j===3||j===5;
      const sub=metal?(near?4:2):1;
      if(j===0 && (a[1]+c[1])/2 < 45) {
        quad('silver',pos(a,A[0],.988),pos(c,C[0],.988),pos(c,C[1],1),pos(a,A[1],1),out);continue;
      }
      if(j===0) {
        const width=Math.hypot(c[0]-a[0],c[1]-a[1]),f=Math.min(.16,width/3)/width;
        const edge=[a[0]+(c[0]-a[0])*f,a[1]+(c[1]-a[1])*f],E=levels(edge),rows=near?4:3;
        for(let row=0;row<rows;row++) {
          const t=row/rows,u=(row+1)/rows,dy=.10;
          const v=(p,L,w)=>pos(p,L[0]+(L[1]-L[0])*w,.988+.012*w);
          quad('frame',v(a,A,t),v(edge,E,t),v(edge,E,u),v(a,A,u),out);
          const va=v(edge,E,t),vc=v(c,C,t),vd=v(c,C,u),ve=v(edge,E,u);
          quad('frame',va,vc,[vc[0],vc[1]+dy,vc[2]],[va[0],va[1]+dy,va[2]],out);
          quad('glass',[va[0],va[1]+dy,va[2]],[vc[0],vc[1]+dy,vc[2]],vd,ve,out);
        }
        continue;
      }
      const cuts=Array.from({length:sub+1},(_,k)=>k/sub);
      // Three adjoining 0.3 m panel seams follow the same drifting shell, in both LODs.
      const seam0=.52,seam1=Math.min(.92,seam0+.3/Math.max(.8,((A[j+1]-A[j])+(C[j+1]-C[j]))/2));
      if(metal)cuts.push(seam0,seam1);
      cuts.sort((a,c)=>a-c);
      for(let k=0;k<cuts.length-1;k++) {
        const t=cuts[k],u=cuts[k+1];if(u-t<1e-7)continue;
        const mat=metal&&t>=seam0-1e-7&&u<=seam1+1e-7?'seam':mats[j];
        quad(mat,pos(a,A[j]+(A[j+1]-A[j])*t,r0+(r1-r0)*t),pos(c,C[j]+(C[j+1]-C[j])*t,r0+(r1-r0)*t),pos(c,C[j]+(C[j+1]-C[j])*u,r0+(r1-r0)*u),pos(a,A[j]+(A[j+1]-A[j])*u,r0+(r1-r0)*u),out);
      }
    }
    // Triangular upper clerestory: thin diagonal members seated on both steel lips.
    if(near&&A[7]-A[6]>1.5) b.bar('frame',pos(a,A[6]-.12,.965),pos(c,C[7]+.12,.965),.14);

  }
  // Bowl roof: shallow compound dome, 43 m crown, pale membrane. Shared rim with steel skin.
  const rim=resample(bowl,near?4.2:8),K=near?10:5;
  const roofPoint=(p,r)=>{const q=scaled(p,.98),cx=centre[0]-10,cz=centre[1]+22;
    // The off-centre crown and drifting crest twist the silver skin down toward Ford Hall.
    const drift=4*Math.sin(Math.PI*r),t=Math.atan2(p[1]-centre[1],p[0]-centre[0]);
    return [cx+(q[0]-cx)*r+drift*Math.sin(t),top(p)+(43-top(p))*Math.pow(Math.cos(Math.PI*r/2),.9),cz+(q[1]-cz)*r];};
  for(let k=0;k<K;k++)for(let j=0;j<rim.length;j++) {
    const a=rim[j],c=rim[(j+1)%rim.length];
    quad(k>=K-2?'silver':'roof',roofPoint(a,k/K),roofPoint(c,k/K),roofPoint(c,(k+1)/K),roofPoint(a,(k+1)/K),[0,1,0]);
  }
  // Ford Hall canopy follows the exact south-east lobe. The bottom stays 8 m above 104 Avenue.
  const hh=hall.map(p=>scaled(p,.98)),tris=THREE.ShapeUtils.triangulateShape(hh.map(p=>new THREE.Vector2(...p)),[]);
  for(const [i,j,k]of tris)quad('roof',pos(hall[i],top(hall[i]),.98),pos(hall[j],top(hall[j]),.98),pos(hall[k],top(hall[k]),.98),pos(hall[k],top(hall[k]),.98),[0,1,0]);
  // Flat, continuous soffit across the road, bounded by grounded end masses, not columns in traffic.
  for(const [i,j,k]of tris)quad('shadow',pos(hall[i],8,.988),pos(hall[j],8,.988),pos(hall[k],8,.988),pos(hall[k],8,.988),[0,-1,0]);
  // Deep north service portals and south entrance doors, with restrained dark-grey metal frames.
  for(let x=-18;x<=30;x+=12) {
    b.box('shadow',[x,2.7,-65.7],[8,5.4,.4]);
    if(near)for(let y=.8;y<5;y+=.65)b.box('frame',[x,y,-65.95],[7.6,.08,.12]);
  }
  // Pixel lettering removed: the shell and recessed swoosh carry the arena identity.

  for(const [mat,g]of buckets) {
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(g.p,3));geo.setIndex(g.i);
    const smooth=mergeVertices(geo,1e-4);smooth.computeVertexNormals();b.put(smooth,mat);geo.dispose();
  }
  return b.finish();
}
