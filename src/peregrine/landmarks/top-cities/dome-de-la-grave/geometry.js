import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';

const yaw = SPEC.rotationDeg * Math.PI / 180;
export function world(u,y,v) { return [Math.cos(yaw)*u+Math.sin(yaw)*v,y,-Math.sin(yaw)*u+Math.cos(yaw)*v]; }
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', n=near?64:32;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,mat)=>{g.rotateY(yaw);b.put(g,mat);};
  const box=(mat,u,y,v,w,h,d)=>put(new THREE.BoxGeometry(w,h,d).translate(u,y,v),mat);
  const bar=(mat,a,c,w)=>b.bar(mat,world(...a),world(...c),w);
  const cyl=(mat,r,y0,y1,u=0,v=0,seg=n)=>put(new THREE.CylinderGeometry(r,r,y1-y0,seg).translate(u,(y0+y1)/2,v),mat);
  const lathe=(mat,profile,segs=n)=>put(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segs),mat);
  function mappedPart(id,height,mat='brick') {
    const ring=FOOTPRINTS[OSM_WAYS.indexOf(id)],k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
    const points=ring.slice(0,-1).map(([lng,lat])=>new THREE.Vector2((lng-SPEC.origin[0])*k,(lat-SPEC.origin[1])*111320));
    const g=new THREE.ExtrudeGeometry(new THREE.Shape(points),{depth:height,bevelEnabled:false});
    g.rotateX(-Math.PI/2);b.put(g,mat);
  }
  mappedPart(219747752,19.3);mappedPart(869732616,13.6);
  box('copper',25.2,13.9,-7.7,15.5,0.65,11.8);
  lathe('trim',[[12.2,19.15],[12.85,19.15],[12.85,19.65],[12.55,20.15],[12,20.15]]);
  const r=12.05,bottom=20,top=37,windowBottom=26.25,spring=32.3,wh=0.112,archRise=1.4;
  function surface(mat,radius,t0,t1,lower,upper,segments) {
    const pos=[],idx=[];
    for(let i=0;i<=segments;i++){const t=t0+(t1-t0)*i/segments;for(const y of [lower(t),upper(t)])pos.push(radius*Math.sin(t),y,radius*Math.cos(t));}
    for(let i=0;i<segments;i++){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat);
  }
  // Eight arched apertures in the drum, rather than dark decals on an unbroken wall.
  for(let i=0;i<8;i++) {
    const t=i*Math.PI/4,archY=a=>spring+archRise*Math.sqrt(Math.max(0,1-((a-t)/wh)**2));
    surface('brick',r,t-wh,t+wh,()=>bottom,()=>windowBottom,near?8:4);
    surface('brick',r,t-wh,t+wh,archY,()=>top,near?12:6);
    surface('brick',r,t+wh,t+Math.PI/4-wh,()=>bottom,()=>top,near?6:3);
    surface('glass',r-0.2,t-wh,t+wh,()=>windowBottom,archY,near?12:6);
    for(const sign of [-1,1]) {
      const a=t+sign*(wh+0.014);
      bar('trim',[(r+0.09)*Math.sin(a),windowBottom-0.2,(r+0.09)*Math.cos(a)],[(r+0.09)*Math.sin(a),spring,(r+0.09)*Math.cos(a)],0.28);
    }
    const arc=[];for(let j=0;j<=(near?20:8);j++){const q=Math.PI*j/(near?20:8),a=t+wh*Math.cos(q);arc.push(new THREE.Vector3((r+0.11)*Math.sin(a),spring+archRise*Math.sin(q),(r+0.11)*Math.cos(a)));}
    put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arc),near?20:8,0.14,near?5:3,false),'trim');
    for(const offset of [-0.034,0.034]) {
      const q=t+Math.PI/8+offset,u=(r+0.12)*Math.sin(q),v=(r+0.12)*Math.cos(q);
      put(new THREE.BoxGeometry(0.48,14.9,0.22).rotateY(q).translate(u,28,v),'trim');
      put(new THREE.BoxGeometry(0.82,0.5,0.38).rotateY(q).translate(u,35.7,v),'stone');
      put(new THREE.BoxGeometry(0.68,0.45,0.35).rotateY(q).translate(u,20.9,v),'stone');
    }
    if(near)for(let y=27;y<33;y+=0.8){const a=t-wh+0.018,c=t+wh-0.018;bar('seam',[(r-0.10)*Math.sin(a),y,(r-0.10)*Math.cos(a)],[(r-0.10)*Math.sin(c),y,(r-0.10)*Math.cos(c)],0.06);}
    bar('seam',[(r-0.08)*Math.sin(t),windowBottom,(r-0.08)*Math.cos(t)],[(r-0.08)*Math.sin(t),spring+archRise-0.1,(r-0.08)*Math.cos(t)],near?0.07:0.11);
  }
  lathe('trim',[[11.95,36.3],[12.15,36.3],[12.15,36.75],[12.3,37.05],[12.3,37.6],[12.2,37.8],[12.1,37.85]]);
  // Elliptical copper hemisphere, raised meridian joints and near-only panel courses.
  const domeAt=t=>[12.2*Math.cos(t),37.65+11.55*Math.sin(t)];
  const profile=[];for(let j=0;j<=(near?24:12);j++)profile.push(domeAt(j/(near?24:12)*1.405));
  profile.push([1.95,49.05],[1.95,49.35],[0,49.35]);lathe('copper',profile);
  const seams=near?48:24;
  for(let i=0;i<seams;i++) {
    const a=i*Math.PI*2/seams,points=[];
    for(let j=0;j<=(near?24:12);j++){const [rr,y]=domeAt(j/(near?24:12)*1.405);points.push(new THREE.Vector3((rr+0.045)*Math.sin(a),y+0.035,(rr+0.045)*Math.cos(a)));}
    put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),near?24:12,near?0.045:0.055,near?4:3,false),'seam');
  }
  if(near)for(const t of [0.12,0.3,0.49,0.7,0.9,1.08,1.25]){const [rr,y]=domeAt(t);put(new THREE.TorusGeometry(rr+0.025,0.022,3,64).rotateX(Math.PI/2).translate(0,y+0.018,0),'seam');}
  // Lantern with recessed glazing, eight piers, balcony and copper cap.
  lathe('stone',[[0,49.05],[2.16,49.05],[2.16,49.45],[1.83,49.65],[1.83,50]]);
  cyl('light',1.45,49.55,53.15,0,0,near?24:12);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4,u=1.65*Math.sin(a),v=1.65*Math.cos(a);
    cyl('stone',0.16,49.5,53.15,u,v,near?8:5);box('stone',u,53,v,0.43,0.3,0.43);
    if(near)bar('seam',[2*Math.sin(a),49.45,2*Math.cos(a)],[2*Math.sin(a),50.1,2*Math.cos(a)],0.08);
  }
  lathe('stone',[[1.3,53.05],[1.99,53.05],[1.99,53.4],[1.83,53.55]]);
  lathe('copper',[[1.86,53.35],[1.7,53.65],[1.2,54],[0.6,54.22],[0,54.35]],near?32:16);
  put(new THREE.SphereGeometry(0.32,near?12:8,near?8:4).translate(0,54.62,0),'copper');
  box('stone',0,55.35,0,0.15,1.3,0.15);box('stone',0,55.55,0,0.95,0.16,0.16);
  if(near)for(const y of [49.65,50.05])put(new THREE.TorusGeometry(2,0.045,4,48).rotateX(Math.PI/2).translate(0,y,0),'seam');
  // Southeast facade on the mapped v=19.8 plane: six flat pilasters and tall door.
  for(const u of [-9.4,-7.2,-3.3,1.3,5.4,7.5]) {
    box('trim',u,9.65,19.92,0.75,16.7,0.37);
    box('stone',u,1.45,20.14,1.05,0.8,0.68);box('stone',u,17.75,20,1.05,0.55,0.6);
    if(near)box('stone',u,17.15,20.05,0.9,0.26,0.58);
  }
  box('stone',-1,0.38,20,5.4,0.76,1.5);
  box('glass',-1,7.1,19.96,3.2,12.65,0.13);
  for(const u of [-2.9,0.9])box('stone',u,7.1,20.11,0.42,12.6,0.42);
  box('stone',-1,13.45,20.13,4.55,0.45,0.48);box('seam',-1,7,20.06,0.10,12,0.08);
  function pediment(mat,center,width,y,rise,v,depth) {
    const s=new THREE.Shape([new THREE.Vector2(center-width/2,y),new THREE.Vector2(center+width/2,y),new THREE.Vector2(center,y+rise)]);
    put(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}).translate(0,0,v),mat);
  }
  pediment('stone',-1,5.2,13.7,1.6,19.92,0.55);
  box('trim',-1,18.75,19.97,20,1.2,0.7);box('stone',-1,19.4,20.15,20.1,0.36,0.7);
  pediment('stone',-1,20.1,19.55,4.4,18.8,1.1);pediment('trim',-1,18.3,19.75,3.75,19.95,0.13);
  bar('stone',[-11.1,19.6,20.14],[-1,24.02,20.14],0.3);bar('stone',[-1,24.02,20.14],[9.1,19.6,20.14],0.3);
  if(near)for(let row=0;row<3;row++)for(let k=-3+row;k<=3-row;k++)box('stone',-1+k*1.2,20.3+row*0.8,20.18,1.07,0.6,0.23);
  for(const u of [-5.25,3.6]) {
    put(new THREE.SphereGeometry(1,near?16:8,near?10:5).scale(0.62,1.05,0.1).translate(u,16.05,20.04),'stone');
  }
  // Fine facade courses suggest Toulouse brick without textures or one mesh per brick.
  if(near)for(let y=2.1;y<18;y+=0.35) {
    for(const [a,c] of [[-10.4,-3.2],[1.2,8.5]])box('trim',(a+c)/2,y,19.91,c-a,0.035,0.07);
  }
  // A modest base and cornice course follows the mapped chapel perimeter.
  {
    const ring=FOOTPRINTS[OSM_WAYS.indexOf(219747752)],k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
    for(let i=1;i<ring.length;i++)for(const y of [1.05,18.95]) {
      const xyz=([lng,lat])=>[(lng-SPEC.origin[0])*k,y,-(lat-SPEC.origin[1])*111320];
      b.bar('trim',xyz(ring[i-1]),xyz(ring[i]),0.18);
    }
  }
  for(const u of [-16.5,14.5]) {
    box('trim',u,19.55,6,4.2,0.4,8.3);
    for(const du of [-1.9,1.9]) {
      box('stone',u+du,21,6,0.26,0.25,8.3);
      for(let j=0;j<=(near?10:5);j++)box('stone',u+du,20.27,2.1+j*7.8/(near?10:5),0.24,1.25,0.25);
    }
    for(const v of [2,10]) {
      box('stone',u,21,v,3.8,0.25,0.26);
      for(let j=1;j<4;j++)box('stone',u-1.9+j*0.95,20.27,v,0.24,1.25,0.25);
    }
  }
  for(const u of [21,24,27,30])for(const y of [4.5,10]) {
    box('glass',u,y,-1,1.45,2.5,0.12);
    if(near){box('stone',u,y-1.3,-0.92,1.7,0.15,0.3);box('stone',u,y,-0.9,0.08,2.5,0.16);}
  }
  return b.finish();
}
