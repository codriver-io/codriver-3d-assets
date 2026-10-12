import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PODIUM, ANNEX, ENTRY, geographic, point, quad, flatRoof, SHAFT_ANGLE, CROWN_ANGLE } from './adam-toren-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const supports = new Map(), members = [];
  // These named meshes are the actual submitted support geometries before material merging.
  // Keep the audit outside userData so GLB extras do not duplicate vertex arrays.
  function solid(name, mat, xyz, size, angle = SHAFT_ANGLE) {
    const g = new THREE.BoxGeometry(...size); g.rotateY(angle); g.translate(...point(...xyz, angle));
    supports.set(name, new THREE.Mesh(g.clone(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })));
    b.put(g, mat);
  }
  function member(name, mat, a, c, width, depth, terminalSupports, angle = SHAFT_ANGLE) {
    const A = point(...a, angle), C = point(...c, angle), va = new THREE.Vector3(...A), vc = new THREE.Vector3(...C), dir = vc.clone().sub(va);
    const g = new THREE.BoxGeometry(width, dir.length(), depth);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize()));
    g.translate(...va.add(vc).multiplyScalar(0.5).toArray());
    supports.set(name, new THREE.Mesh(g.clone(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })));
    b.put(g, mat); members.push({ name, ends: [A,C], supports: terminalSupports });
  }
  // Panel skins are tessellated rather than overlaid: glass, frame and bevels share edges,
  // never coplanar area. All faces have deliberately verified outward winding.
  function gridFace(at, normal, width, y0, y1, columns, rows, seed = 0) {
    const pitch = width / columns, rise = (y1-y0)/rows, rim = near ? 0.18 : 0.25;
    const Q = (mat,u0,a,u1,c,off=0) => quad(b,mat,[at(u0,a,off),at(u1,a,off),at(u1,c,off),at(u0,c,off)],normal);
    for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
      const u=-width/2+col*pitch, a=y0+row*rise, c=a+rise, v=u+pitch;
      Q('frame',u,a,v,a+rim); Q('frame',u,c-rim,v,c);
      Q('frame',u,a+rim,u+rim,c-rim); Q('frame',v-rim,a+rim,v,c-rim);
      const mat = (row*17+col*11+seed)%19===0 ? 'glow' : 'glass';
      Q(mat,u+rim,a+rim,v-rim,c-rim,near?-0.17:0);
      if(near) {
        for(const [lo,hi] of [[u+rim,v-rim]]) {
          quad(b,'frame',[at(lo,a+rim),at(hi,a+rim),at(hi,a+rim,-0.17),at(lo,a+rim,-0.17)],[0,1,0]);
          quad(b,'frame',[at(lo,c-rim),at(hi,c-rim),at(hi,c-rim,-0.17),at(lo,c-rim,-0.17)],[0,-1,0]);
        }
        const left=at(u+rim,a+rim), right=at(v-rim,a+rim), tangent=right.map((v,i)=>v-left[i]);
        quad(b,'frame',[at(u+rim,a+rim),at(u+rim,c-rim),at(u+rim,c-rim,-0.17),at(u+rim,a+rim,-0.17)],tangent);
        quad(b,'frame',[at(v-rim,a+rim),at(v-rim,c-rim),at(v-rim,c-rim,-0.17),at(v-rim,a+rim,-0.17)],tangent.map(v=>-v));
      }
    }
  }
  function rectangularSkin(half,y0,y1,columns,rows,angle=SHAFT_ANGLE) {
    for(let face=0;face<4;face++) {
      const theta=angle+face*Math.PI/2;
      const at=(u,y,off=0)=>point(u,y,half+off,theta);
      const normal=point(0,0,1,theta);
      gridFace(at,normal,half*2,y0,y1,columns,rows,face*5);
    }
  }
  function mappedPodium(ring,y0,y1) {
    const p=ring.map(geographic), area=p.reduce((s,[x,z],i)=>{const q=p[(i+1)%p.length];return s+x*q[1]-z*q[0]},0), sign=area>0?1:-1;
    for(let i=0;i<p.length;i++) {
      const a=p[i],c=p[(i+1)%p.length], dx=c[0]-a[0],dz=c[1]-a[1], len=Math.hypot(dx,dz);
      if(len<0.08) continue;
      const normal=[sign*dz/len,0,-sign*dx/len];
      const at=(u,y,off=0)=>[a[0]+dx*(u/len+0.5)+normal[0]*off,y,a[1]+dz*(u/len+0.5)+normal[2]*off];
      gridFace(at,normal,len,y0,y1,Math.max(1,Math.round(len/(near?2.5:5))),near?2:1,i);
    }
    flatRoof(b,ring,y1,'roof');
  }
  mappedPodium(PODIUM,0,7); mappedPodium(ANNEX,7,10); mappedPodium(ENTRY,0,3);
  // The slab ends at its support, and the roof of the lower podium meets the annex.
  solid('foundation','concrete',[0,0.7,-0.3],[24.9,1.4,24.9]);
  solid('shaft-slab','concrete',[0,9.8,-0.3],[25.2,0.4,25.2]);
  solid('core','frame',[0,4.9,-0.3],[9.5,9.8,9.5]);
  // Four V-shaped concrete supports are the tower's conspicuous open base.
  for(let f=0;f<4;f++) {
    const angle=SHAFT_ANGLE+f*Math.PI/2;
    for(const s of [-1,1]) member(`V-${f}-${s}`,'concrete',[s*2.7,1.4,11.1],[s*10.7,9.6,11.1],2.3,2.5,['foundation','shaft-slab'],angle);
  }
  rectangularSkin(12.5,10,64,near?14:7,near?18:9);
  solid('shaft-roof','roof',[0,64.25,0],[25,0.5,25]);
  // 22 m restaurant: two continuous circular glazed levels, beneath the rotated crown.
  const sectors=near?40:20, radius=10.9;
  for(let i=0;i<sectors;i++) for(let row=0;row<2;row++) {
    const a=i/sectors*Math.PI*2,c=(i+1)/sectors*Math.PI*2;
    const y0=64.5+row*2.75,y1=y0+2.75;
    quad(b,(i+row)%13===0?'glow':'glass',[[Math.cos(a)*radius,y0,Math.sin(a)*radius],[Math.cos(c)*radius,y0,Math.sin(c)*radius],[Math.cos(c)*radius,y1,Math.sin(c)*radius],[Math.cos(a)*radius,y1,Math.sin(a)*radius]],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
  }
  solid('crown-soffit','concrete',[0,70.1,0],[32.4,0.3,32.4],CROWN_ANGLE);
  // The square crown leans gently outward, unlike the shaft. Glass panels retain bays far away.
  for(let f=0;f<4;f++) {
    const angle=CROWN_ANGLE+f*Math.PI/2;
    gridFace((u,y,off=0)=>point(u,y,15.55+(y-70.25)*0.12+off,angle),point(0,0,1,angle),31.1,70.25,74.65,near?14:7,1,f+7);
  }
  solid('lookout-deck','concrete',[0,74.85,0],[32.4,0.4,32.4],CROWN_ANGLE);
  // Rail posts, horizontal rails and swing members all terminate on explicit named supports.
  const railN=near?12:6;
  for(let f=0;f<4;f++) {
    const angle=CROWN_ANGLE+f*Math.PI/2;
    for(let i=0;i<=railN;i++) solid(`post-${f}-${i}`,'steel',[-15.75+31.5*i/railN,75.65,15.75],[0.11,1.4,0.11],angle);
    for(let i=0;i<railN;i++) member(`rail-${f}-${i}`,'steel',[-15.75+31.5*i/railN,76.3,15.75],[-15.75+31.5*(i+1)/railN,76.3,15.75],0.09,0.09,[`post-${f}-${i}`,`post-${f}-${i+1}`],angle);
  }
  solid('roof-house','concrete',[0,77.2,-0.4],[10.7,4.3,10.7]);
  // Two sloping white wind shields reproduce the butterfly roof profile around the mast.
  for(const z of [-4.7,4.7]) {
    const shape=new THREE.Shape();
    const poly=[[-5.35,79.2],[0,80.2],[5.35,83],[5.35,78.9],[-5.35,78.9]];
    shape.moveTo(...poly[0]);for(const v of poly.slice(1))shape.lineTo(...v);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:0.2,bevelEnabled:false,steps:1});
    g.translate(0,0,z-0.1);g.rotateY(SHAFT_ANGLE);b.put(g,'concrete');
  }
  solid('mast','concrete' ,[0,88.05,0],[1.8,21.9,1.8]); // penetrates the roof house: 77.1–99 m
  // Three Amsterdam crosses, cut as isolated dark bars well proud of the pale mast.
  if(near) for(const y of [94.4,95.9,97.4]) for(const s of [-1,1]) b.bar('steel',point(-0.32,y-0.35*s,0.91),point(0.32,y+0.35*s,0.91),0.13,0.15);
  for(const x of [-3.4,0,3.4]) {
    solid(`swing-foot-${x}`,'steel',[x,75.17,12.2],[0.8,0.24,3.9],CROWN_ANGLE);
    member(`swing-leg-${x}`,'steel',[x,75.2,10.5],[x,81.2,13.9],0.28,0.28,[`swing-foot-${x}`,'swing-top'],CROWN_ANGLE);
    member(`swing-back-${x}`,'steel',[x,75.2,14],[x,81.2,13.9],0.23,0.23,[`swing-foot-${x}`,'swing-top'],CROWN_ANGLE);
  }
  solid('swing-top','steel',[0,81.2,13.9],[7.15,0.35,0.4],CROWN_ANGLE);
  for(const x of [-1.7,1.7]) {
    solid(`seat-${x}`,'red',[x,77.1,16.6],[2.3,0.22,0.9],CROWN_ANGLE);
    solid(`seat-back-${x}`,'red',[x,77.6,16.9],[2.3,0.9,0.18],CROWN_ANGLE);
    for(const dx of [-0.9,0.9]) member(`swing-hanger-${x}-${dx}`,'steel',[x+dx,81.1,13.9],[x+dx,77.18,16.6],0.075,0.075,['swing-top',`seat-${x}`],CROWN_ANGLE);
  }
  const root=b.finish(); root.contactAudit={ supports, members };
  root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift')});
  return root;
}
