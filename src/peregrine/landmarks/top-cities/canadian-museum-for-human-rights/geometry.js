import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, inside } from './canadian-museum-for-human-rights-site.js';

// Original freeform reconstruction. Mapped polygons establish the geographic
// orientation directly; no rotation or Mercator scale remains for the host.
const P = ([x,z], y) => [x,y,z];
const mix = (a,b,t) => a.map((v,i)=>v+(b[i]-v)*t);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
class Surface {
  p=[];
  tri(a,b,c,toward) {
    const av=new THREE.Vector3(...a), bv=new THREE.Vector3(...b), cv=new THREE.Vector3(...c);
    const n=bv.clone().sub(av).cross(cv.clone().sub(av));
    if(n.lengthSq()<1e-10)return;
    if(n.dot(new THREE.Vector3(...toward).sub(av))<0)[b,c]=[c,b];
    this.p.push(...a,...b,...c);
  }
  quad(a,b,c,d,toward){this.tri(a,b,c,toward);this.tri(a,c,d,toward);}
  geometry(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.computeVertexNormals();const indexed=mergeVertices(g,1e-5);g.dispose();return indexed;}
}
const CELLS = [
  [1381564361,30,'grass','west'], [1381564358,14,'roof','west'],
  [1381564359,17,'grass','sw'], [1381564360,16,'grass','south'],
  [1382370277,24,'roof','southeast'], [295122849,18,'roof'],
  [308812811,57,'roof'], [308812812,57,'roof'], [308812813,63,'roof'],
  [308812815,38,'roof'], [1381564357,48,'roof'], [308812814,54,'glassDeep'],
  [1381564362,45,'roof'], [250706846,5,'roof'], [1383041214,16,'roof'],
];
const topAt = (c,p) => {
  const [id,h,,slope]=c;
  if(!slope)return h;
  const t=slope==='west' ? (p[0]+75)/55 : slope==='sw' ? (76-p[1])/46 : slope==='south' ? (78-p[1])/38 : (51-p[1])/24;
  return 1+(h-1)*Math.pow(clamp(t,0,1),0.8);
};
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), surfaces=new Map();
  const fold=near?{}:{stoneWarm:'stone',glassDeep:'glass',glassPale:'glass'};
  const surf=(m)=>{m=fold[m]||m;if(!surfaces.has(m))surfaces.set(m,new Surface());return surfaces.get(m);};
  const tri=(m,...args)=>surf(m).tri(...args),quad=(m,...args)=>surf(m).quad(...args);
  const bar=(m,a,c,w,d=w)=>b.bar(fold[m]||m,a,c,w,d);
  const envelope=PARTS[131229325];
  const cloudRing=PARTS[131229326];
  // Low gallery core under the cloud. Taller limestone cells hide its rear.
  const cells=[...CELLS,[131229326,18,'roof']];
  for(const c of cells) {
    const ring=PARTS[c[0]], h=(p)=>topAt(c,p);
    const area=ring.reduce((s,a,i)=>{const q=ring[(i+1)%ring.length];return s+a[0]*q[1]-q[0]*a[1];},0),sign=Math.sign(area);
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],e=ring[(i+1)%ring.length],dx=e[0]-a[0],dz=e[1]-a[1],len=Math.hypot(dx,dz);
      const out=[sign*dz/len,-sign*dx/len], nx=out[0],nz=out[1];
      const ns=Math.max(1,Math.ceil(len/(near?4:10)));
      for(let s=0;s<ns;s++) {
        const A=mix(a,e,s/ns),B=mix(a,e,(s+1)/ns),mid=mix(A,B,.5),outside=[mid[0]+nx*.12,mid[1]+nz*.12];
        const inward=[mid[0]-nx*.12,mid[1]-nz*.12];
        // Overlapping OSM parts can share an outward facade, too. The higher
        // cell owns that face above the lower top; adjacent cells own neither
        // buried wall. Check both sides so coincident outlines cannot flicker.
        const nb=cells.filter(o=>o!==c&&(inside(outside,PARTS[o[0]])||inside(inward,PARTS[o[0]])));
        const low=nb.length?Math.max(...nb.map(o=>topAt(o,mid))):0;
        const hA=h(A),hB=h(B);if(low>=Math.max(hA,hB)-.05)continue;
        const rows=Math.max(1,Math.ceil((Math.max(hA,hB)-low)/(near?.68:2.8)));
        const toward=[mid[0]+nx*30,(low+Math.max(hA,hB))/2,mid[1]+nz*30];
        for(let j=0;j<rows;j++) {
          const t0=j/rows,t1=(j+1)/rows,loA=Math.min(low,hA),loB=Math.min(low,hB);
          const yA=loA+(hA-loA)*t0,yB=loB+(hB-loB)*t0,YA=loA+(hA-loA)*t1,YB=loB+(hB-loB)*t1;
          const m=near&&(j+c[0])%7===0?'stoneWarm':'stone';
          quad(m,P(A,yA),P(B,yB),P(B,YB),P(A,YA),toward);
        }
      }
    }
    // Warped roofs, triangulated without a fan across the concave polygons.
    const faces=THREE.ShapeUtils.triangulateShape(ring.map(q=>new THREE.Vector2(...q)),[]);
    for(const f of faces) {
      const vs=f.map(i=>ring[i]), n=c[3]?(near?6:3):1;
      const at=(i,j)=>mix(mix(vs[0],vs[1],i/n),vs[2],j/n/(1-i/n||1));
      for(let i=0;i<n;i++)for(let j=0;j<n-i;j++) {
        const a=at(i,j),d=at(i+1,j),e=at(i,j+1);
        const draw=(a,d,e)=>{
          const mid=[(a[0]+d[0]+e[0])/3,(a[1]+d[1]+e[1])/3];
          if(cells.some(o=>o!==c&&inside(mid,PARTS[o[0]])&&topAt(o,mid)>=h(mid)-.03))return;
          tri(c[2],P(a,h(a)),P(d,h(d)),P(e,h(e)),[mid[0],120,mid[1]]);
        };
        draw(a,d,e);if(j<n-i-1)draw(d,at(i+1,j+1),e);
      }
    }
  }

  // Four overlapping, planar-panel glass shells, not concentric bowls. Each
  // shell has its own diagonal lip and turns back into a glazed roof plane.
  // The main curved plan remains the OSM south-facing cloud envelope.
  const frontArc=[[-27.5,-20.8],[-28.1,-3],[-27.7,7],[-24.9,16],[-19.7,23.2],[-12.3,30.4],[-.3,37.7],[6.8,39.7],[25.5,39.9],[38.6,36.4],[48.5,27.6],[56.6,5.2],[59.7,.7]];
  const arc=(s)=>{
    const f=clamp(s,0,1)*(frontArc.length-1),i=Math.min(frontArc.length-2,Math.floor(f));
    return mix(frontArc[i],frontArc[i+1],f-i);
  };
  const radial=(q,scale,y)=>[17+(q[0]-17)*scale,y,8+(q[1]-8)*scale];
  // The lip rises to the east; angular peaks belong to individual sheets.
  const shells=[
    {from:0,to:1,base:[24,20,26],lip:[37,33,43],roof:[38,36,44],r0:.84,r1:.982,r2:.74,mat:'glass'},
    {from:0,to:.71,base:[35,32,38],lip:[53,56,46],roof:[58,60,54],r0:.88,r1:.965,r2:.43,mat:'glassPale'},
    {from:.24,to:.96,base:[34,32,44],lip:[45,53,61],roof:[54,60,62],r0:.90,r1:.995,r2:.48,mat:'glass'},
    {from:.66,to:1,base:[43,44,41],lip:[57,64,61],roof:[60,64,58],r0:.91,r1:.962,r2:.30,mat:'glassDeep'},
  ];
  const profile=(v,t)=>t<.5?v[0]+(v[1]-v[0])*t*2:v[1]+(v[2]-v[1])*(t-.5)*2;
  const shellPoint=(sh,s,t,roof=false,off=0)=>{
    const q=arc(sh.from+(sh.to-sh.from)*s);
    const y0=profile(roof?sh.lip:sh.base,s),y1=profile(roof?sh.roof:sh.lip,s);
    const r0=roof?sh.r1:sh.r0,r1=roof?sh.r2:sh.r1;
    const p=radial(q,r0+(r1-r0)*t,y0+(y1-y0)*t);
    // Mullions stand off the actual faceted panel normals; roof ribs are
    // vertically offset and facade ribs radially offset, never coplanar.
    if(roof)p[1]+=off;
    else {const dx=p[0]-17,dz=p[2]-8,len=Math.hypot(dx,dz);p[0]+=dx/len*off;p[2]+=dz/len*off;}
    return p;
  };
  for(const [k,sh] of shells.entries()) {
    const N=near?Math.ceil(64*(sh.to-sh.from)):Math.ceil(22*(sh.to-sh.from)),R=near?6:3;
    for(const isRoof of [false,true])for(let i=0;i<N;i++)for(let j=0;j<R;j++) {
      const s=i/N,S=(i+1)/N,t=j/R,T=(j+1)/R;
      const a=shellPoint(sh,s,t,isRoof),d=shellPoint(sh,S,t,isRoof),e=shellPoint(sh,S,T,isRoof),f=shellPoint(sh,s,T,isRoof);
      const mid=mix(a,e,.5),toward=isRoof?[mid[0],120,mid[2]]:[17+(mid[0]-17)*5,mid[1],8+(mid[2]-8)*5];
      const m=near&&(i+j*3+k)%29===0?'glassPale':sh.mat;
      quad(m,a,d,e,f,toward);
      const ds=.065/N,dt=.005;
      quad('frame',shellPoint(sh,s,t,isRoof,.18),shellPoint(sh,S,t,isRoof,.18),shellPoint(sh,S,t+dt,isRoof,.18),shellPoint(sh,s,t+dt,isRoof,.18),toward);
      quad('frame',shellPoint(sh,s,t,isRoof,.185),shellPoint(sh,s+ds,t,isRoof,.185),shellPoint(sh,s+ds,T,isRoof,.185),shellPoint(sh,s,T,isRoof,.185),toward);
    }
    // Close ends and inner edges down into the gallery roof volume. These
    // are glass returns: a fold does not expose a flat limestone deck.
    for(const s of [0,1]) {
      const a=shellPoint(sh,s,0),d=shellPoint(sh,s,1),e=shellPoint(sh,s,1,true),f=[e[0],18,e[2]];
      quad(sh.mat,a,d,e,f,[17+(d[0]-17)*6,45,8+(d[2]-8)*6]);
    }
    for(let i=0;i<N;i++) {
      const a=shellPoint(sh,i/N,1,true),d=shellPoint(sh,(i+1)/N,1,true);
      quad(sh.mat,a,d,[d[0],18,d[2]],[a[0],18,a[2]],[17,45,8]);
    }
  }
  // Under the overlapping shells, the whole cloud roof is glazing. This
  // watertight core stops holes on the back/underside without a pale deck.
  const coreRing=cloudRing.map(q=>radial(q,.80,34));
  const coreFaces=THREE.ShapeUtils.triangulateShape(coreRing.map(q=>new THREE.Vector2(q[0],q[2])),[]);
  for(const f of coreFaces)tri('glass',...f.map(i=>coreRing[i]),[17,120,8]);
  for(let i=0;i<coreRing.length;i++){
    const a=coreRing[i],d=coreRing[(i+1)%coreRing.length],toward=[17+(a[0]-17)*8,28,8+(a[2]-8)*8];
    quad('glass',a,d,[d[0],18,d[2]],[a[0],18,a[2]],toward);
  }

  // Tower of Hope: a continuous irregular hexagonal crystal, tapering from
  // its gallery support to the slender lattice crown without any shelf tiers.
  const towerRing=PARTS[306556703],ctr=[19.15,8.15];
  const stages=[[18,1],[55,1],[75,.78],[90,.45],[100,.30]];
  const towerPoint=(i,y,s,off=0)=>{
    const q=towerRing[(i+towerRing.length)%towerRing.length],dx=q[0]-ctr[0],dz=q[1]-ctr[1],l=Math.hypot(dx,dz);
    return [ctr[0]+dx*s+dx/l*off,y,ctr[1]+dz*s+dz/l*off];
  };
  const scaleAt=y=>{const k=Math.min(stages.length-2,stages.findIndex((p,i)=>i<stages.length-1&&stages[i+1][0]>=y));const [a,A]=stages[k],[d,D]=stages[k+1];return A+(D-A)*(y-a)/(d-a);};
  for(let k=0;k<stages.length-1;k++) {
    const [y0,s0]=stages[k],[y1,s1]=stages[k+1],n=near?Math.ceil((y1-y0)/3):Math.ceil((y1-y0)/7);
    for(let i=0;i<towerRing.length;i++) {
      const A=towerPoint(i,y0,s0),D=towerPoint(i+1,y0,s0),E=towerPoint(i+1,y1,s1),F=towerPoint(i,y1,s1);
      const towards=[ctr[0]+(A[0]-ctr[0])*10,(y0+y1)/2,ctr[1]+(A[2]-ctr[1])*10];
      quad(k<2?'glassDeep':'towerClear',A,D,E,F,towards);
      // The long ribs are continuous, never rings that widen at a new tier.
      bar('glow',towerPoint(i,y0,s0,.13),towerPoint(i,y1,s1,.13),near?.16:.19);
      for(let j=1;j<n;j++) {
        const t=j/n,y=y0+(y1-y0)*t,s=s0+(s1-s0)*t;
        bar('frame',towerPoint(i,y,s,.14),towerPoint(i+1,y,s,.14),.1);
        if(k>0)bar('frame',towerPoint(i,y-(y1-y0)/n,scaleAt(y-(y1-y0)/n),.15),towerPoint(i+1,y,s,.15),near?.09:.13);
      }
      if(near&&k<2)for(const t of [.33,.66])bar('frame',mix(A,D,t),mix(F,E,t),.075);
    }
  }
  const cap=towerRing.map((_,i)=>towerPoint(i,100,.30));
  for(let i=1;i<cap.length-1;i++)tri('towerClear',cap[0],cap[i],cap[i+1],[ctr[0],110,ctr[1]]);
  // Staggered glazing beneath the open-looking crown: faceted opaque strips
  // stop at different levels while the clear envelope and ribs keep 100 m.
  for(let i=0;i<towerRing.length;i++){
    const top=[94,97,96,99,95,98][i],a=towerPoint(i,90,.45,.055),d=towerPoint(i+1,90,.45,.055),e=towerPoint(i+1,top,scaleAt(top),.055),f=towerPoint(i,top,scaleAt(top),.055);
    quad('glassPale',a,d,e,f,[ctr[0]+(a[0]-ctr[0])*10,95,ctr[1]+(a[2]-ctr[1])*10]);
  }

  // Broad straight flight between the west and southwest limestone roots.
  // The stair rectangle is an authored approach footprint, not an OSM way.
  const toe=[-53,39],landing=[-16,24],run=Math.hypot(landing[0]-toe[0],landing[1]-toe[1]),normal=[-(landing[1]-toe[1])/run,(landing[0]-toe[0])/run],width=11.5;
  const stairPoint=(t,side,y)=>{const q=mix(toe,landing,t);return [q[0]+normal[0]*side*width/2,y,q[1]+normal[1]*side*width/2];};
  const steps=near?80:25,rise=16;
  for(let i=0;i<steps;i++) {
    const t=i/steps,T=(i+1)/steps,y=rise*(i+1)/steps;
    quad('stoneWarm',stairPoint(t,-1,y),stairPoint(T,-1,y),stairPoint(T,1,y),stairPoint(t,1,y),[0,120,0]);
    quad('stone',stairPoint(t,-1,rise*i/steps),stairPoint(t,1,rise*i/steps),stairPoint(t,1,y),stairPoint(t,-1,y),[-100,y,80]);
    for(const side of [-1,1])quad('stone',stairPoint(t,side,0),stairPoint(T,side,0),stairPoint(T,side,y),stairPoint(t,side,y),[toe[0]+normal[0]*side*80,y,toe[1]+normal[1]*side*80]);
  }
  // Slender parapets connect to the treads; both LODs retain the straight run.
  for(const side of [-1,1])bar('stone',stairPoint(0,side,.55),stairPoint(1,side,16.55),.3,.4);

  // Offset south-facing entrance strip and door mullions on the low podium.
  const entranceA=[10.15,47.88],entranceB=[18.13,51.55];
  quad('glow',P(entranceA,.3),P(entranceB,.3),P(entranceB,4.6),P(entranceA,4.6),[10,2,65]);
  if(near)for(let t=.15;t<1;t+=.22){const q=mix(entranceA,entranceB,t);bar('frame',P([q[0]-.05,q[1]+.08],.3),P([q[0]-.05,q[1]+.08],4.6),.11);}
  for(const [m,s] of surfaces)if(s.p.length)b.put(s.geometry(),m);
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh&&o.material.name==='towerClear'){o.material.transparent=true;o.material.opacity=.24;o.material.roughness=.22;o.material.metalness=.12;}if(o.isMesh&&o.material.name.startsWith('glass')){o.material.roughness=.3;o.material.metalness=.24;}});
  return model;
}
