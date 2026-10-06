import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PIER, HOTEL, TERMINAL, SAILS } from './canada-place-site.js';

// Fabric surfaces are authored from a ruled catenary family, not third-party meshes.
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function prism(mat,ring,bottom,top) {
    const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:top-bottom,bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,bottom,0);b.put(g,mat);
  }
  function surface(mat,points,indices) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat);
  }
  function quad(mat,a,c,d,e) {surface(mat,[a,c,d,e],[0,1,2,0,2,3]);}
  function line(mat,a,c,w=.18){b.bar(mat,a,c,w,w);}
  // Dock datum is rigid. No seafloor, retaining terrain, ships or neighboring towers.
  prism('concrete',PIER,0,7.8);
  prism('concrete',HOTEL,7.65,14.8);
  prism('concrete',TERMINAL,7.65,13.1);
  // Cruise terminal piers, glazing and long cornices follow each actual mapped edge.
  for (const [ring,base,top] of [[PIER,0,7.8],[HOTEL,7.8,14.8],[TERMINAL,8,13.1]]) {
    for(let i=0;i<ring.length;i++){
      const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      if(len<26)continue;
      // Determine polygon exterior by its signed area (x/z frame).
      const area=ring.reduce((s,p,j)=>s+p[0]*ring[(j+1)%ring.length][1]-ring[(j+1)%ring.length][0]*p[1],0);
      const nx=(area>0?dz:-dz)/len,nz=(area>0?-dx:dx)/len;
      const at=(u,y,o=.18)=>[a[0]+dx*u+nx*o,y,a[1]+dz*u+nz*o];
      const n=Math.ceil(len/(near?4.5:10));
      for(let j=0;j<n;j++) {
        const lo=(j+.13)/n,hi=(j+.86)/n;
        const p=[at(lo,base+1.1),at(hi,base+1.1),at(hi,top-1.25),at(lo,top-1.25)];
        if(area>0)p.reverse();quad('glass',...p);
        if(near)line('trim',at(j/n,base+.2,.38),at(j/n,top-.2,.38),.28);
      }
      line('trim',at(0,top-.4,.3),at(1,top-.4,.3),.38);
      if(near&&ring===PIER){line('steel',at(0,8.8,.05),at(1,8.8,.05),.12);for(let j=0;j<=n;j++)line('steel',at(j/n,7.7,.05),at(j/n,8.8,.05),.09);}
    }
  }
  // Five connected thin tensile saddles; no opaque curtains below the membrane.
  for(const [bay,ring] of SAILS.entries()) {
    prism('concrete',ring,7.65,17.65);
    const area=ring.reduce((s,p,j)=>s+p[0]*ring[(j+1)%ring.length][1]-ring[(j+1)%ring.length][0]*p[1],0);
    for(const [a,c] of [[ring[0],ring[1]],[ring[2],ring[3]]]) {
      const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),n=near?5:2;
      const nx=(area>0?dz:-dz)/len,nz=(area>0?-dx:dx)/len;
      const at=(u,y,o=.2)=>[a[0]+dx*u+nx*o,y,a[1]+dz*u+nz*o];
      for(const [y0,y1] of [[10.1,13.8],[15,16.7]])for(let j=0;j<n;j++){
        const ps=[at((j+.08)/n,y0),at((j+.92)/n,y0),at((j+.92)/n,y1),at((j+.08)/n,y1)];
        // Opposite edges have opposite orientation: choose geometric normal toward offset.
        const normal=new THREE.Vector3().crossVectors(new THREE.Vector3(...ps[1]).sub(new THREE.Vector3(...ps[0])),new THREE.Vector3(...ps[2]).sub(new THREE.Vector3(...ps[0])));
        if(normal.x*nx+normal.z*nz<0)ps.reverse();quad('glass',...ps);
      }
      line('trim',at(0,14.35,.38),at(1,14.35,.38),.6);
      line('trim',at(0,17.5,.38),at(1,17.5,.38),.6);
      if(near)for(let j=0;j<=n;j++)line('trim',at(j/n,8.2,.34),at(j/n,17.5,.34),.38);
    }
    const [a,c,d,e]=ring,nu=near?26:10,nv=near?32:12;
    const p=(u,v,dy=0)=>{
      const x=(1-u)*((1-v)*c[0]+v*d[0])+u*((1-v)*a[0]+v*e[0]);
      const z=(1-u)*((1-v)*c[1]+v*d[1])+u*((1-v)*a[1]+v*e[1]);
      const across=4*v*(1-v), valley=.42;
      // The first shore edge is low; subsequent bays meet the preceding mast ridge.
      // Each longitudinal edge sags deeply then rises to an exposed mast.
      const rise=u<valley?(bay===0?0:Math.pow((valley-u)/valley,2)):Math.pow((u-valley)/(1-valley),2);
      const y=18+27*rise*(1-.55*across)+6*4*u*(1-u)*across;
      return [x,y+dy,z];
    };
    const points=[],ids=[],stride=nv+1;
    for(const dy of [0,-.15])for(let u=0;u<=nu;u++)for(let v=0;v<=nv;v++)points.push(p(u/nu,v/nv,dy));
    const layer=(nu+1)*stride;
    for(let u=0;u<nu;u++)for(let v=0;v<nv;v++){
      const i=u*stride+v,j=i+stride;
      // u points NE, v points ESE; reverse below for outward top normals.
      ids.push(i,j,i+1,i+1,j,j+1,layer+i,layer+i+1,layer+j,layer+i+1,layer+j+1,layer+j);
    }
    // Perimeter closes thickness: the fabric remains visible from underneath.
    for(let u=0;u<nu;u++)for(const v of [0,nv]){const i=u*stride+v,j=i+stride;if(v===0)ids.push(i,layer+i,j,j,layer+i,layer+j);else ids.push(i,j,layer+i,j,layer+j,layer+i);}
    for(let v=0;v<nv;v++)for(const u of [0,nu]){const i=u*stride+v,j=i+1;if(u===nu)ids.push(i,j,layer+i,j,layer+j,layer+i);else ids.push(i,layer+i,j,j,layer+i,layer+j);}
    for(let i=0;i<ids.length;i+=3)[ids[i+1],ids[i+2]]=[ids[i+2],ids[i+1]];
    surface('fabric',points,ids);
    for(const v of [0,1]) {
      const peak=p(1,v);line('steel',[peak[0],17.6,peak[2]], [peak[0],46.35,peak[2]],near?.28:.36);
      // Fabric is carried by exposed mast tips and follows curved edge cables.
      const count=near?26:10;for(let u=0;u<count;u++)line('trim',p(u/count,v,.16),p((u+1)/count,v,.16),.16);
    }
    // Transverse catenary edging and seam ribs help the thin fabric read at close range.
    for(let v=0;v<nv;v++)line('trim',p(1,v/nv,.16),p(1,(v+1)/nv,.16),.14);
    if(near)for(const v of [.2,.4,.6,.8])for(let u=0;u<nu;u++)line('trim',p(u/nu,v,.09),p((u+1)/nu,v,.09),.065);
  }
  // A pale rounded FlyOver / former IMAX end hall replaces the dark flat wedge.
  // The broad original terminal outline is retained below the taller oval drum.
  const hallCx=72,hallCz=-31,rx=25,rz=18,hn=near?48:24;
  const hallRing=Array.from({length:hn},(_,i)=>{const a=2*Math.PI*i/hn;return [hallCx+rx*Math.cos(a),hallCz+rz*Math.sin(a)];});
  prism('trim',hallRing,7.65,27.4);
  const dome=new THREE.SphereGeometry(1,hn,near?12:6,0,Math.PI*2,0,Math.PI/2);
  dome.scale(rx,5.6,rz);dome.translate(hallCx,27.4,hallCz);b.put(dome,'trim');
  for(let j=0;j<hn;j++){
    const a=hallRing[j],c=hallRing[(j+1)%hn];
    line('concrete',[a[0]*1.002-hallCx*.002,26.1,a[1]*1.002-hallCz*.002],[c[0]*1.002-hallCx*.002,26.1,c[1]*1.002-hallCz*.002],.45);
    if(near)line('concrete',[a[0],7.7,a[1]],[a[0],26.5,a[1]],.24);
  }
  // Podium steps are nested within the mapped hotel envelope.
  const podiumCenter=[-132,69];
  function insetRing(scale){return HOTEL.map(([x,z])=>[podiumCenter[0]+(x-podiumCenter[0])*scale,podiumCenter[1]+(z-podiumCenter[1])*scale]);}
  function facadeBand(ring,base,top,mat='glass',offset=.2){
    const signed=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
    for(let i=0;i<ring.length;i++){
      const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.01)continue;
      const nx=(signed>0?dz:-dz)/len,nz=(signed>0?-dx:dx)/len;
      const pts=[[a[0]+offset*nx,base,a[1]+offset*nz],[c[0]+offset*nx,base,c[1]+offset*nz],[c[0]+offset*nx,top,c[1]+offset*nz],[a[0]+offset*nx,top,a[1]+offset*nz]];
      if(signed>0)pts.reverse();quad(mat,...pts);
    }
  }
  for(const [scale,base,top]of [[.94,14.65,20.2],[.80,20.05,25.5]]) {
    const r=insetRing(scale);prism('concrete',r,base,top);
    facadeBand(r,base+.85,top-1.2);
    facadeBand(r,top-.65,top-.1,'trim',.24);
  }
  // Pan Pacific hotel: flattened convex harbour bow, rounded rear corners,
  // broad pale horizontal spandrels and recessed dark hotel-room panes.
  const cx=-146,cz=75,angle=-18.5*Math.PI/180,w=65,depth=31;
  const tf=(x,y,z)=>[cx+Math.cos(angle)*x+Math.sin(angle)*z,y,cz-Math.sin(angle)*x+Math.cos(angle)*z];
  const fn=near?32:16,front=[];
  for(let i=0;i<=fn;i++){const a=-Math.PI/2+Math.PI*i/fn;front.push([w/2*Math.sin(a),-depth/2-9*Math.cos(a)]);}
  const local=[...front,[w/2,depth/2-3]];
  for(let i=1;i<=4;i++){const a=i*Math.PI/8;local.push([w/2-3+3*Math.cos(a),depth/2-3+3*Math.sin(a)]);}
  local.push([-w/2+3,depth/2]);
  for(let i=1;i<=4;i++){const a=Math.PI/2+i*Math.PI/8;local.push([-w/2+3+3*Math.cos(a),depth/2-3+3*Math.sin(a)]);}
  const towerRing=local.map(([x,z])=>{const p=tf(x,0,z);return[p[0],p[2]];});
  prism('glass',towerRing,25.35,77.6);
  const floors=18;
  for(let row=0;row<=floors;row++)facadeBand(towerRing,25.45+row*52.0/floors,26.85+row*52.0/floors,'concrete',.22);
  // Curve-aware mullions, window glow and banding survive both LODs.
  for(let j=0;j<=fn;j+=near?2:1){const p=tf(front[j][0],0,front[j][1]);line('trim',[p[0],25.4,p[2]],[p[0],77.4,p[2]],.32);}
  for(const side of [-1,1])for(let j=0;j<=6;j++)line('trim',tf(side*(w/2+.12),25.4,-depth/2+j*depth/6),tf(side*(w/2+.12),77.4,-depth/2+j*depth/6),.35);
  for(let j=0;j<=14;j++)line('trim',tf(-w/2+3+j*(w-6)/14,25.4,depth/2+.12),tf(-w/2+3+j*(w-6)/14,77.4,depth/2+.12),.35);
  for(let row=0;row<18;row++)for(let j=1;j<fn;j++)if((row*7+j)%(near?17:37)===0){
    const a=front[j-1],c=front[j],y=27.25+row*52/18;
    const dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),offset=.32;
    const aa=tf(a[0]+dz/l*offset,y,a[1]-dx/l*offset),cc=tf(c[0]+dz/l*offset,y,c[1]-dx/l*offset);
    quad('glow',cc,aa,[aa[0],y+1,aa[2]],[cc[0],y+1,cc[2]]);
  }
  prism('concrete',towerRing,77.45,78.4);
  facadeBand(towerRing,77.8,78.3,'trim',.35);
  // Rounded equipment crown on the roof, retained at the sourced 81.5 m top.
  const cap=new THREE.SphereGeometry(8.4,near?24:12,near?10:6,0,Math.PI*2,0,Math.PI/2);cap.scale(1,3.1/8.4,1);cap.translate(-152,78.4,86.5);b.put(cap,'roof');
  b.box('roof',[-152,78.5,86.5],[13,1,13],angle);
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
