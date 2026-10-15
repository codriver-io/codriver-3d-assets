import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Author coordinates: x along the column row toward north, z toward the eastern city.
// The mapped 96.5143° rotation is baked into each primitive, not a runtime transform.
export function create({ detail='near' }={}) {
  const near=detail==='near', angle=SPEC.axisDeg*Math.PI/180;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const offsets={}, parts={};
  function put(g,mat,name) {
    // Far combines pale stone courses so close architectural undersides cannot
    // impose contradictory depth ordering on the shared runtime material path.
    if(!near&&mat==='trim')mat='stone';
    g.rotateY(angle);
    const start=offsets[mat]||0,count=g.index?g.index.count:g.attributes.position.count;
    if(name)parts[name]={mat,start,count};
    offsets[mat]=start+count;b.put(g,mat);
  }
  function box(mat,p,s,name,omit=[]) {
    const g=new THREE.BoxGeometry(...s);
    if(omit.length) {
      const idx=Array.from(g.index.array),keep=[];
      // Box groups +x,-x,+y,-y,+z,-z. Remove buried horizontal end faces.
      for(let f=0;f<6;f++)if(!omit.includes(f))keep.push(...idx.slice(f*6,f*6+6));
      g.setIndex(keep);
    }
    g.translate(...p);put(g,mat,name);
  }
  function bar(mat,p,q,w,d=w,name) {
    const av=new THREE.Vector3(...p),bv=new THREE.Vector3(...q),dv=bv.clone().sub(av);
    const g=new THREE.CylinderGeometry(w/2,d/2,dv.length(),near?6:4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dv.normalize()));
    g.translate(...av.add(bv).multiplyScalar(.5).toArray());put(g,mat,name);
  }
  function ell(mat,p,r,name) {
    const g=new THREE.SphereGeometry(1,near?8:5,near?5:3);g.scale(...r);g.translate(...p);put(g,mat,name);
  }
  function column(x,z,height,r,name,fluted=false) {
    const n=fluted&&near?40:near?8:5, verts=[],idx=[];
    const profile=near?[[0,r],[.12,r],[height*.90,r*.83],[height*.945,r*.82],[height*.97,r*.98],[height*.985,r*1.12]]:[[0,r],[height*.94,r*.83],[height*.985,r*1.12]];
    for(const [y,rr] of profile)for(let i=0;i<n;i++) {
      const a=2*Math.PI*i/n,groove=fluted&&near?1-.055*(1+Math.cos(a*20)):.99;
      verts.push(x+rr*groove*Math.cos(a),y,z+rr*groove*Math.sin(a));
    }
    for(let j=0;j<profile.length-1;j++)for(let i=0;i<n;i++) {
      const k=j*n+i,l=j*n+(i+1)%n;idx.push(k,k+n,l,l,k+n,l+n);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(idx);g.computeVertexNormals();put(g,'stone',name+'-shaft');
    box('trim',[x,height*.99,z],[r*2.55,height*.03,r*2.55],name+'-abacus');
  }
  function pediment(x,z,w,d,eave,rise,name) {
    const shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(0,rise);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,steps:1});
    g.translate(x,eave,z-d/2);put(g,'stone',name);
    // Sloped cornice edges follow the triangle, touching the roof rather than floating.
    for(const side of [-1,1])bar('trim',[x+side*w/2,eave,z+d/2+.08],[x,eave+rise,z+d/2+.08],.19,.19);
  }
  // Six massive dividing walls; twelve fluted Doric shafts in two rows.
  for(const [i,x] of SPEC.columns.entries()) {
    box('stone',[x,6.65,0],[i===0||i===5?2.5:1.8,13.3,6.9],`wall-${i}`,[3,2]);
    for(const side of [-1,1])column(x,side*4.25,13.5,.87,`column-${i}-${side}`,true);
    // Passage-side relief medallions and rectangular Hercules panels.
    for(const s of [-1,1]) {
      if((i===0&&s===-1)||(i===5&&s===1))continue;
      const face=x+s*(i===0||i===5?1.25:.9);
      const g=new THREE.CylinderGeometry(.74,.74,.13,near?20:10);g.rotateZ(Math.PI/2);g.translate(face+s*.12,10.75,0);put(g,'relief');
      box('relief',[face+s*.12,7.7,0],[.16,1.12,3.0]);
      if(near)for(let k=-2;k<=2;k++) {
        ell('trim',[face+s*.23,7.84,k*.51],[.08,.28,.16]);
        bar('trim',[face+s*.24,7.8,k*.51],[face+s*.24,7.3,k*.51+.15],.12,.12);
      }
    }
  }
  // A shallow architrave, triglyph/metope frieze and deeply projecting cornice.
  box('stone',[0,13.9,0],[32.45,.8,11.9],'architrave',[2]);
  box('trim',[0,14.43,0],[32.65,.26,12.05],undefined,[2]);
  box('stone',[0,15.12,0],[32.25,1.12,11.8],'frieze',[2]);
  for(const side of [-1,1]) {
    for(let k=0;k<24;k++) {
      const x=-15.5+k*31/23;
      box('trim',[x,15.12,side*6.02],[.37,1.05,.25]);
      if(near) {
        for(const dx of [-.095,.095])box('recess',[x+dx,15.12,side*6.18],[.035,.83,.065]);
        if(k<23) {
          const u=x+.67;
          ell('relief',[u,15.27,side*5.99],[.25,.3,.13]);
          for(const s of [-1,1])bar('relief',[u,15.25,side*6.01],[u+s*.38,14.82,side*6.01],.13,.15);
        }
      }
    }
  }
  box('trim',[0,15.9,0],[32.8,.44,12.2],undefined,[2]);
  box('stone',[0,16.32,0],[33.4,.4,12.5],undefined,[2]);
  box('trim',[0,16.66,0],[33.8,.28,12.7],'cornice');
  // Low attic wings rise in shallow steps toward the projecting central relief pedestal.
  for(const side of [-1,1]) {
    box('stone',[side*10.45-.55,17.88,0],[11.8,2.16,6.25],undefined,[3]);
    box('trim',[side*10.45-.55,19.08,0],[12.05,.24,6.55]);
    for(let k=0;k<5;k++)box('stone',[side*(5.25+k*1.95),17.05+.11*(4-k),side>0?4.28:-4.28],[1.95,.5+.22*(4-k),2.1]);
  }
  box('stone',[-.55,18.28,0],[9.1,2.96,11.8],'attic',[3]);
  box('trim',[-.55,19.88,0],[9.3,.24,12.1],'quadriga-pedestal');
  for(const side of [-1,1]) {
    box('relief',[-.55,18.47,side*6.01],[8.35,1.85,.18]);
    for(const y of [17.45,19.49])box('trim',[-.55,y,side*6.13],[8.7,.16,.2]);
    for(const x of [-4.85,3.75])box('trim',[x,18.47,side*6.13],[.16,2.12,.2]);
    // Triumph-of-Peace relief: grouped human silhouettes, no traced art/lettering.
    for(let k=0;k<(near?17:9);k++) {
      const x=-4.25+k*(near?.46:.9),z=side*6.18;
      ell('trim',[x,18.96,z],[.115,.14,.09]);
      bar('trim',[x,18.83,z],[x+.10*Math.sin(k),18.18,z],.16,.23);
      if(near)for(const s of [-1,1])bar('trim',[x,18.32,z],[x+s*.16,17.7,z],.1,.12);
    }
    if(near)for(let k=0;k<42;k++)box('trim',[-15.8+k*.77,16.04,side*6.28],[.25,.23,.26]);
  }
  // 1867–68 open portico wings. Their 10 m columns and pedimented east guardhouses
  // are lower than the gate; no continuous podium blocks the public passages.
  for(const side of [-1,1]) {
    const cx=side>0?24.85:-24.95, left=side>0?17.7:-32.05;
    for(let k=0;k<5;k++)for(const z of [-4.35,4.75])column(left+k*3.56,z,10,.44,`wing-${side}-${k}-${z}`);
    for(const x of [left,left+14.24])for(const z of [-1.3,1.75])column(x,z,10,.44,`wing-end-${side}-${x}-${z}`);
    box('stone',[cx,10.3,.12],[15.7,.6,10.5],`wing-beam-${side}`,[2]);
    box('trim',[cx,10.77,.12],[15.8,.34,10.65],undefined,[2]);
    // Very low hip-like profile; sandstone triangular end and subdued metal roof.
    pediment(cx,.12,15.7,10.5,10.94,1.02,`wing-roof-${side}`);
    const gx=side>0?25.15:-25.95;
    // Solid inner guardhouse, surrounded by a three-sided colonnade.
    box('stone',[gx,4.9,14.9],[8.05,9.8,13.2],`guardhouse-${side}`,[3,2]);
    for(const x of [gx-4.65,gx+4.65])for(let k=0;k<5;k++)column(x,8.1+k*3.55,10,.44,`house-col-${side}-${x}-${k}`);
    for(const dx of [-1.56,1.56])column(gx+dx,22.3,10,.44,`house-front-${side}-${dx}`);
    box('stone',[gx,10.3,14.5],[11.15,.6,17.35],`house-beam-${side}`,[2]);
    box('trim',[gx,10.77,14.5],[11.3,.34,17.45],undefined,[2]);
    pediment(gx,14.5,11.3,17.45,10.94,1.06,`house-roof-${side}`);
    for(const z of [10.7,15.5,19.7])for(const s of [-1,1])box('recess',[gx+s*4.10,5.9,z],[.14,2.0,1.05]);
    box('recess',[gx,2.3,21.57],[1.7,4.6,.15]);
    box('recess',[gx,7.4,21.57],[1.4,1.5,.15]);
    if(near) {
      box('trim',[gx,4.65,21.7],[2.1,.22,.3]);
      for(let y=1;y<9;y+=1.4)for(const s of [-1,1])box('relief',[gx+s*4.13,y,14.9],[.13,.035,12.7]);
    }
  }
  // Quadriga: four horses abreast, two-wheeled chariot and standing winged Victoria.
  // The whole group faces local +z = east. Dimensions are photo-based estimates.
  box('bronze',[-.55,20.11,0],[7.7,.22,5.0],'statue-base');
  for(let k=0;k<4;k++) {
    const x=-3.4+k*1.9;
    ell('bronze',[x,21.55,.7],[.48,.63,1.15],`horse-${k}-body`);
    ell('bronze',[x,22.26,1.46],[.35,.83,.42],`horse-${k}-neck`);
    ell('bronze',[x,22.9,1.78],[.28,.43,.5],`horse-${k}-head`);
    ell('bronze',[x,22.7,2.15],[.23,.24,.36]);
    for(const s of [-1,1]) {
      bar('bronze',[x+s*.24,22.99,1.65],[x+s*.23,23.52,1.56],.14,.11);
      // Three grounded legs, one raised foreleg, all joined at the haunch/shoulder.
      for(const end of [-1,1]) {
        const zz=end<0?-.10:1.35, toe=[x+s*.30,20.2,end<0?-.48:1.65];
        if(end===1&&s===1) {
          bar('bronze',[x+s*.3,21.48,zz],[x+s*.3,21.1,2.0],.23,.27);
          bar('bronze',[x+s*.3,21.1,2],[x+s*.3,20.65,2.2],.19,.21);
        } else {
          bar('bronze',[x+s*.3,21.48,zz],[x+s*.3,20.87,zz-.13],.23,.27);
          bar('bronze',[x+s*.3,20.87,zz-.13],toe,.18,.22,`horse-${k}-leg-${s}-${end}`);
          ell('bronze',[toe[0],20.26,toe[2]],[.16,.12,.24]);
        }
      }
    }
    bar('bronze',[x,21.65,-.25],[x,20.67,-.8],.17,.24);
    // Chariot draw pole/harness connects the horse group to the axle.
    bar('bronze',[x,21.3,.2],[x,21.05,-1.65],.11,.12);
  }
  box('bronze',[-.55,20.78,-1.55],[2.5,.28,2.05],'chariot-floor');
  ell('bronze',[-.55,21.25,-.89],[1.15,.58,.35],'chariot-shell');
  bar('bronze',[-2.0,20.9,-1.6],[.9,20.9,-1.6],.16,.18,'chariot-axle');
  for(const s of [-1,1]) {
    const g=new THREE.TorusGeometry(.66,.10,near?6:4,near?20:12);g.rotateY(Math.PI/2);g.translate(-.55+s*1.35,20.9,-1.6);put(g,'bronze',`chariot-wheel-${s}`);
    for(let k=0;k<(near?10:6);k++) {
      const a=k*2*Math.PI/(near?10:6);
      bar('bronze',[-.55+s*1.35,20.9,-1.6],[-.55+s*1.35,20.9+.64*Math.cos(a),-1.6+.64*Math.sin(a)],.065,.065);
    }
  }
  // Victoria stands securely inside the chariot: draped torso, head and broad wings.
  const dress=new THREE.CylinderGeometry(.30,.52,1.65,near?12:7);dress.translate(-.55,21.64,-1.55);put(dress,'bronze');
  ell('bronze',[-.55,22.5,-1.55],[.42,.48,.25]);
  ell('bronze',[-.55,23.18,-1.53],[.25,.32,.25]);
  for(const s of [-1,1]) {
    bar('bronze',[-.55+s*.27,22.6,-1.55],[-.55+s*.85,23.45,-1.8],.30,.37);
    bar('bronze',[-.55+s*.85,23.45,-1.8],[-.55+s*1.5,23.72,-2.0],.23,.31);
    for(let k=0;k<(near?5:3);k++)bar('bronze',[-.55+s*.45,22.72,-1.68],[-.55+s*(.84+k*.16),23.52-k*.2,-1.98],.12,.15);
    bar('bronze',[-.55+s*.30,22.52,-1.37],[-.55+s*.70,22.05,-.85],.14,.19);
  }
  // Victory staff, wreath, iron cross and eagle; top at the published 26 m.
  bar('bronze',[.15,22.05,-.85],[.15,25.15,-.85],.105,.12,'victory-staff');
  const wreath=new THREE.TorusGeometry(.42,.085,near?6:4,near?24:12);wreath.translate(.15,24.4,-.85);put(wreath,'bronze');
  box('bronze',[.15,24.4,-.85],[.10,.49,.13]);box('bronze',[.15,24.4,-.85],[.43,.1,.13]);
  ell('bronze',[.15,25.34,-.85],[.13,.22,.18]);
  ell('bronze',[.15,25.62,-.78],[.13,.14,.16]);
  for(const s of [-1,1]) {
    bar('bronze',[.15,25.30,-.85],[.15+s*.57,25.60,-.9],.18,.24);
    bar('bronze',[.15+s*.57,25.60,-.9],[.15+s*.85,25.94,-.9],.10,.14);
  }
  const model=b.finish();model.userData.parts=parts;
  return model;
}
