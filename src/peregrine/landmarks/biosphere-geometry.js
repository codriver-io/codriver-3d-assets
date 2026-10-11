import * as THREE from 'three';
import { BIOSPHERE } from './montreal-profiles.js';
import { assetBuilder } from './asset-geometry.js';

/** Open double-layer geodesic shell, as it stands after the acrylic skin was
 * lost, with the Minirail station piercing it. Frequencies, museum volumes and
 * the station are visual approximations, not scans. */
export function createBiosphere({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder(BIOSPHERE,detail),radius=BIOSPHERE.diameter/2,cy=BIOSPHERE.height-radius;

  // The lattice is thousands of members, so every strut is an open prism with no
  // end caps (3-4 sides, smooth normals, 2 vertices per side), all in one mesh.
  const lattice={position:[],normal:[],index:[]};
  const strut=(a,c,r,sides)=>{
    const d=new THREE.Vector3(c[0]-a[0],c[1]-a[1],c[2]-a[2]),length=d.length();
    if(length<1e-5)return;
    d.divideScalar(length);
    // Overshoot both ends so struts meeting at a node overlap instead of leaving a gap.
    const s=new THREE.Vector3(...a).addScaledVector(d,-r),e=new THREE.Vector3(...c).addScaledVector(d,r);
    const u=new THREE.Vector3().crossVectors(d,Math.abs(d.y)>0.9?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0)).normalize();
    const v=new THREE.Vector3().crossVectors(d,u),base=lattice.position.length/3; // u x v = d: the winding below faces outward
    for(let i=0;i<sides;i++){
      const t=i*Math.PI*2/sides+Math.PI/2,cos=Math.cos(t),sin=Math.sin(t),nx=u.x*cos+v.x*sin,ny=u.y*cos+v.y*sin,nz=u.z*cos+v.z*sin;
      lattice.position.push(s.x+nx*r,s.y+ny*r,s.z+nz*r,e.x+nx*r,e.y+ny*r,e.z+nz*r);
      lattice.normal.push(nx,ny,nz,nx,ny,nz);
    }
    for(let i=0;i<sides;i++){
      const p0=base+i*2,p1=base+(i+1)%sides*2;
      lattice.index.push(p0,p1,p0+1,p1,p1+1,p0+1);
    }
  };

  const clip=(a,c)=>{
    if(a[1]<0 && c[1]<0)return null;
    const v=[a.slice(),c.slice()];
    for(let i=0;i<2;i++)if(v[i][1]<0){const p=v[i],q=v[1-i],t=-p[1]/(q[1]-p[1]);v[i]=p.map((x,j)=>x+(q[j]-x)*t);}
    return v;
  };
  const shell=(r,frequency,width,sides)=>{
    const g=new THREE.IcosahedronGeometry(r,frequency-1);
    // Put one icosahedral vertex at the apex, avoiding a latitude/longitude
    // grid that would collapse into a star of poles instead of geodesic cells.
    const top=new THREE.Vector3(0,1,(1+Math.sqrt(5))/2).normalize();
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(top,new THREE.Vector3(0,1,0)));
    const p=g.attributes.position,seen=new Set(),nodes=new Map();
    const key=v=>v.map(n=>Math.round(n*1e5)).join(',');
    for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){
      const a=[p.getX(i+j),p.getY(i+j)+cy,p.getZ(i+j)],k=(j+1)%3,c=[p.getX(i+k),p.getY(i+k)+cy,p.getZ(i+k)];
      nodes.set(key(a),a);nodes.set(key(c),c);
      const id=[key(a),key(c)].sort().join(':');if(seen.has(id))continue;seen.add(id);
      const pair=clip(a,c);if(pair)strut(...pair,width,sides);
    }
    g.dispose();return [...nodes.values()].filter(v=>v[1]>=0);
  };
  const outer=shell(radius,near?16:8,near?0.11:0.16,3);
  if(near){
    // A coarser, thinner inner layer: its members lie under every other outer
    // member, so it only shows as parallax. One radial tie per inner node to the
    // nearest outer node gives the pair its depth.
    const inner=shell(radius-2,8,0.06,3);
    for(const p of inner){
      let best=outer[0],bestD=Infinity;
      for(const q of outer){const d=(q[0]-p[0])**2+(q[1]-p[1])**2+(q[2]-p[2])**2;if(d<bestD){bestD=d;best=q;}}
      strut(p,best,0.05,3);
    }
  }
  const baseR=Math.sqrt(radius*radius-cy*cy);
  for(let i=0;i<96;i++){
    const a=i*Math.PI/48,c=(i+1)*Math.PI/48;
    strut([Math.cos(a)*baseR,0.18,Math.sin(a)*baseR],[Math.cos(c)*baseR,0.18,Math.sin(c)*baseR],0.15,3);
    if(near && i%4===0)b.box('concrete',[Math.cos(a)*baseR,-0.1,Math.sin(a)*baseR],[1.25,0.5,1.25],0,0,0);
  }
  {
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(lattice.position,3));
    g.setAttribute('normal',new THREE.Float32BufferAttribute(lattice.normal,3));
    g.setIndex(lattice.index);b.put(g,'lattice',0,0);
  }

  // The pavilion occupies the lower shell; leaving open air above matters.
  const angle=-0.42,cosA=Math.cos(angle),sinA=Math.sin(angle);
  const local=(x,y,z)=>[x*cosA+z*sinA,y,-x*sinA+z*cosA];
  const box=(mat,x,y,z,w,h,d)=>b.box(mat,local(x,y,z),[w,h,d],angle,0,0);
  const slab=(mat,x,y,z,w,h,d,pitch)=>{ // yawed box tilted about its width axis
    const g=new THREE.BoxGeometry(w,h,d);g.rotateX(pitch);g.rotateY(angle);g.translate(...local(x,y,z));b.put(g,mat,0,0);
  };
  const post=(mat,a,c,w)=>b.bar(mat,local(...a),local(...c),w,w,0,false,0);
  box('concrete',0,0.1,0,46,0.4,40);
  box('museum',-5,7,1,25,14,24);
  box('glass',10,8.2,-3,12,16.4,17);
  box('museum',-8,17,-3,18,6,16);
  box('roof',-8,20.15,-3,19,0.35,17);
  box('roof',-5,14.15,1,26,0.35,25);
  box('roof',10,16.6,-3,13,0.4,18);
  box('glass',-4,3.4,16,27,6.6,6);
  box('roof',-4,6.9,17,29,0.4,8);
  box('museum',17,4,8,6,8,13);
  // Minirail station and ramp: a plain deck on two side trusses that pierce the
  // lattice and end on a pair of piers outside it (north-east side, local -z).
  const deckX=-2,deckW=8,topY=17.5,ramp=[-32,-45],drop=2.7,pitch=Math.atan2(drop,ramp[0]-ramp[1]);
  box('concrete',deckX,topY-0.4,-25,deckW,0.8,14); // station deck, z -18..-32
  slab('concrete',deckX,topY-0.4-drop/2,(ramp[0]+ramp[1])/2,deckW,0.8,Math.hypot(ramp[0]-ramp[1],drop),-pitch);
  box('glass',deckX,topY+1.6,-25,deckW+0.4,3.2,12);
  box('roof',deckX,topY+3.4,-25,deckW+1.4,0.4,13.4);
  const trussY=z=>topY-0.9-(z<ramp[0]?Math.min(1,(ramp[0]-z)/(ramp[0]-ramp[1]))*drop:0),depth=2.4;
  for(const x of [deckX-deckW/2+0.4,deckX+deckW/2-0.4]){
    const stations=near?[-18,-25,-32,-38.5,-45]:[-18,-32,-45];
    for(let i=1;i<stations.length;i++){
      const z0=stations[i-1],z1=stations[i];
      post('rail',[x,trussY(z0),z0],[x,trussY(z1),z1],0.45);
      post('rail',[x,trussY(z0)-depth,z0],[x,trussY(z1)-depth,z1],0.45);
      if(near){
        post('rail',[x,trussY(z1)-depth,z1],[x,trussY(z1),z1],0.3);
        post('rail',[x,trussY(z0)-depth,z0],[x,trussY(z1),z1],0.3);
      }
    }
    if(near)post('rail',[x,trussY(-18)-depth,-18],[x,trussY(-18),-18],0.3);
    for(const z of [-19,-32,-43.5])post('rail',[x,0,z],[x,trussY(z)-depth,z],near?0.9:1.1);
  }
  if(near){
    for(let y=2;y<=12;y+=3.5){
      box('glass',-5,y,13.05,23,1.7,0.08);
      for(let x=-15;x<=5;x+=4)box('concrete',x,y,13.13,0.16,2.6,0.14);
    }
    for(let x=-16;x<=8;x+=3)box('lattice',x,3.5,19.1,0.1,6.5,0.1);
    for(let y=4;y<=15;y+=4)box('lattice',10,y,5.55,12,0.12,0.12);
    for(let x=5;x<=15;x+=2.5)box('lattice',x,8.2,5.55,0.12,16,0.12);
    // External stairs/terraces remain below the shell's equator.
    for(let i=0;i<10;i++)box('concrete',-17,0.2+i*0.22,18-i*0.42,5,0.3,0.6);
  }
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');}); // free-standing: nothing fits it to a road
  return model;
}
