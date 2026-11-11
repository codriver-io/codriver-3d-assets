import * as THREE from'three';import polygonClipping from'polygon-clipping';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{OPENING,PITCH}from'./parc-des-princes-plan.js';import{local,simplify,surfaces}from'./parc-des-princes-parts.js';
const outer=simplify(local(FOOTPRINTS[0],SPEC.origin),.3),inner=simplify(local(OPENING,SPEC.origin),.25),field=simplify(local(PITCH,SPEC.origin),.05);
function rayRing(p,t){const d=[Math.cos(t),Math.sin(t)];let best=Infinity;for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],v=[c[0]-a[0],c[1]-a[1]],den=d[0]*v[1]-d[1]*v[0];if(Math.abs(den)<1e-9)continue;const r=(a[0]*v[1]-a[1]*v[0])/den,u=(a[0]*d[1]-a[1]*d[0])/den;if(r>0&&u>=0&&u<=1)best=Math.min(best,r);}if(!Number.isFinite(best))throw Error('ring does not surround origin');return d.map(v=>v*best);}
export function portiques(){return Array.from({length:50},(_,i)=>{const t=2*Math.PI*i/50,o=rayRing(outer,t),p=rayRing(inner,t),r=Math.hypot(...o),ri=Math.hypot(...p);return{angle:t,outer:o,tip:[...p],r,ri};});}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),n=near?100:50,ops=[],ips=[];
 for(let i=0;i<n;i++){const t=2*Math.PI*i/n;ops.push(rayRing(outer,t));ips.push(rayRing(inner,t));}
 const xyz=(p,y,k=1)=>[p[0]*k,y,p[1]*k],mix=(a,c,t)=>a.map((v,i)=>v+(c[i]-v)*t);
 for(let i=0;i<n;i++){const j=(i+1)%n,o=ops[i],q=ops[j],a=ips[i],c=ips[j];
  // Closed ring canopy: inner edge is the literal mapped aperture.
  s.quad('roof',xyz(o,28,.965),xyz(a,27),xyz(c,27),xyz(q,28,.965));
  s.quad('roof',xyz(o,27.2,.965),xyz(q,27.2,.965),xyz(c,26.2),xyz(a,26.2));
  s.quad('concrete',xyz(o,28,.965),xyz(q,28,.965),xyz(q,27.2,.965),xyz(o,27.2,.965));
  s.quad('concrete',xyz(a,27),xyz(a,26.2),xyz(c,26.2),xyz(c,27));
  // Opaque concourse facade and separate dark openings; no logos.
  const levels=[0,8,16,24];for(let k=0;k<levels.length-1;k++){const y=levels[k],h=levels[k+1];s.quad('concrete',xyz(o,y,.88),xyz(o,y+.65,.88),xyz(q,y+.65,.88),xyz(q,y,.88));s.quad('glass',xyz(o,y+.65,.88),xyz(o,h,.88),xyz(q,h,.88),xyz(q,y+.65,.88));}
  // Two seating tiers separated by a wider neutral circulation tread.
  const rows=near?32:12,profile=[];for(let k=0;k<=rows;k++){let f=k/rows;if(f<.5)profile.push([f*.96,1+f*20]);else profile.push([.56+(f-.5)*.88,11+(f-.5)*26]);}
  profile.splice(Math.floor(rows/2),0,[.48,11]);
  for(let k=0;k<profile.length-1;k++){const[t0,y0]=profile[k],[t1,y1]=profile[k+1],p0=mix(a.map(v=>v*.93),o.map(v=>v*.88),t0),p1=mix(a.map(v=>v*.93),o.map(v=>v*.88),t1),q0=mix(c.map(v=>v*.93),q.map(v=>v*.88),t0),q1=mix(c.map(v=>v*.93),q.map(v=>v*.88),t1);const mat=Math.abs(y1-y0)<.001?'concrete':'seat';s.quad(mat,xyz(p0,y0),xyz(q0,y0),xyz(q1,y0),xyz(p1,y0));s.quad('seat',xyz(p1,y0),xyz(q1,y0),xyz(q1,y1),xyz(p1,y1));}
 }
 // The turf and surrounding field margin are adjoining planar partitions,
 // both >=0.10 m over grade, with no layered field-paint decal.
 const margin=ips.map(p=>p.map(v=>v*.93)),closed=p=>[...p,p[0]];
 for(const poly of polygonClipping.difference([closed(margin)],[closed(field)])){
  const rings=poly.map(r=>r.slice(0,-1)),all=rings.flat(),shape=rings[0].map(p=>new THREE.Vector2(...p)),holes=rings.slice(1).map(r=>r.map(p=>new THREE.Vector2(...p)));
  for(const t of THREE.ShapeUtils.triangulateShape(shape,holes))s.tri('concrete',...t.slice().reverse().map(i=>xyz(all[i],.12)));
 }
 s.cap(field,.12,'grass');
 // Each portique is one closed, tapered concrete member from grade to the
 // canopy tip; tangent extrusion gives it actual thickness in both LODs.
 for(const p of portiques()){
  const points=[[p.r*.88,0],[p.r*.92,0],[p.r*.985,28],[p.r,36],[p.ri,27],[p.ri,25.8],[p.r*.94,24]],shape=new THREE.Shape(points.map(v=>new THREE.Vector2(...v))),g=new THREE.ExtrudeGeometry(shape,{depth:near?1.6:1.9,bevelEnabled:false,steps:1,curveSegments:1});g.translate(0,0,near?-.8:-.95);g.rotateY(-p.angle);b.put(g,'rib');
 }
 const model=s.finish();model.userData.identity='50 concrete cantilever fins around an open two-tier football bowl';return model;
}
