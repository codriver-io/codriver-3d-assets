import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { at, MASTS } from './stade-de-france-site.js';

// Each closed radial profile sweeps the mapped outer and inner outlines;
// ordered profile edges face outwards, including the underside of the floating disk.
export function create({detail='near'}={}) {
  const near=detail==='near', n=near?108:36;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function ring(mat,profile,wave=0) {
    const pos=[],idx=[];
    for(let i=0;i<n;i++) {
      const t=i*2*Math.PI/n,tn=(i+1)*2*Math.PI/n;
      for(let j=0;j<profile.length;j++) {
        const a=profile[j],c=profile[(j+1)%profile.length],off=pos.length/3;
        if((mat==='roof'||mat==='glazing') && a[0]===.185 && c[0]===.185)continue;
        pos.push(...at(a[0],a[1]+wave*Math.cos(2*t),t),...at(c[0],c[1]+wave*Math.cos(2*t),t),...at(c[0],c[1]+wave*Math.cos(2*tn),tn),...at(a[0],a[1]+wave*Math.cos(2*tn),tn));
        idx.push(off,off+1,off+2,off,off+2,off+3);
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat);
  }
  // Concrete concourses stand behind open bays; the upper seating rim is 4 m below the soffit.
  ring('concrete',[[.20,0],[.73,0],[.73,1],[.20,1]]);
  ring('recess',[[.64,1],[.66,1],[.66,23],[.64,23]]);
  for(const y of [9,17,24])ring('concrete',[[y===24?.745:.65,y],[.78,y],[.78,y+1],[y===24?.745:.65,y+1]]);
  // Three separate terraced seating tiers. Each is a closed stepped section, never a solid disk.
  for(const [f0,f1,y0,y1,rows] of [[.02,.34,1,11,near?14:4],[.37,.51,13,18,near?7:2],[.54,.73,20,28,near?12:4]]) {
    const p=[[f0,y0-1]];
    for(let i=0;i<rows;i++) { const f=f0+(f1-f0)*i/rows,fn=f0+(f1-f0)*(i+1)/rows,y=y0+(y1-y0)*(i+1)/rows;p.push([f,y],[fn,y]); }
    p.push([f1,y1-1]);ring('seats',p.reverse());
  }
  ring('concrete',[[.745,26],[.78,26],[.78,29],[.745,29]]);
  // Opaque main annulus and adjoining translucent inner strip: no overlapping faces.
  ring('roof',[[.185,33.4],[1,33.4],[1,35],[.185,35]]);
  ring('glazing',[[0,33.4],[.185,33.4],[.185,35],[0,35]]);
  // Widely spaced underside channels from the exterior photographs, not a corrugated dome.
  if(near)for(const f of [.38,.59,.80])ring('stay',[[f-.002,33.0],[f+.002,33.0],[f+.002,33.4],[f-.002,33.4]]);
  const contacts=[];
  for(let i=0;i<MASTS.length;i++) {
    const [x,z]=MASTS[i],t=Math.atan2(z,x);
    const g=new THREE.CylinderGeometry(.18,.9,50,near?8:5,1);g.translate(x,25,z);b.put(g,'mast');
    // Four stays meet the needle below its pointed tip and terminate inside the roof slab.
    for(const [f,dt] of [[.03,-.075],[.03,.075],[.98,-.075],[.98,.075]]) {
      const a=[x,48.8,z],c=at(f,34.6,t+dt);
      b.bar('stay',a,c,near?.16:.22,undefined,0,true);
      contacts.push({name:`needle-${i+1}-stay-${f}-${dt}`,ends:[{point:a,support:'mast'},{point:c,support:f<.185?'glazing':'roof'}]});
    }
    // Structural piers and eighteen broad stair flights reach the upper concourse.
    const pier=at(.765,0,t);b.bar('concrete',pier,at(.765,28,t),1.8);
    const a=at(.93,.2,t+.10),c=at(.765,24.5,t+.10),dir=new THREE.Vector3(c[0]-a[0],0,c[2]-a[2]).normalize();
    const across=new THREE.Vector3(-dir.z,0,dir.x),len=Math.hypot(c[0]-a[0],c[2]-a[2]),steps=near?24:10;
    // Continuous stepped slab, with its underside closing against grade and concourse.
    const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(len,23.3);shape.lineTo(len,24.5);
    for(let k=steps-1;k>=0;k--){shape.lineTo(len*k/steps,.2+24.3*(k+1)/steps);shape.lineTo(len*k/steps,.2+24.3*k/steps);}
    shape.closePath();
    const stair=new THREE.ExtrudeGeometry(shape,{depth:5.2,bevelEnabled:false,steps:1});stair.translate(0,0,-2.6);
    stair.applyMatrix4(new THREE.Matrix4().makeBasis(dir,new THREE.Vector3(0,1,0),across));stair.translate(a[0],0,a[2]);b.put(stair,'concrete');
    for(const q of [.35,.70]){const p=a.map((v,j)=>v+(c[j]-v)*q);b.bar('concrete',[p[0],0,p[2]],p,1.3);}
    contacts.push({name:`stair-${i+1}`,ends:[{point:a,support:'ground'},{point:c,support:'concrete'}]});
  }
  // Slender entrance-level columns and distinct bays survive both LODs.
  for(let i=0;i<(near?108:54);i++) {
    const t=i*2*Math.PI/(near?108:54);b.bar('concrete',at(.765,0,t),at(.765,26,t),near?.75:1.0);
  }
  // Flat display pitch; sunken excavation is deliberately not cut into the host terrain.
  b.box('field',[0,.15,0],[70,.3,105],-10*Math.PI/180);
  if(near)for(let i=0;i<36;i++) {
    const t=i*2*Math.PI/36;b.box('light',at(.01,33.0,t),[1.6,.8,1.2]);
  }
  const root=b.finish();root.userData.contacts=contacts;return root;
}
