import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, WHEEL_ANGLE } from './config.js';

// A wheel-specific authoring graph records each member and its two named
// supports. It is also used to check contacts on actual triangle surfaces.
export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  // Published diameter includes the rim tube. Keep every radial attachment
  // on its centreline, while height and diameter set the hub datum.
  const rimTube=.2,r=SPEC.diameter/2-rimTube,h=SPEC.hubHeight, parts=[],members=[];
  const radialScale=r/28.58,hubRadius=1.65*radialScale,spokeRoot=1.5*radialScale;
  const add=(name,g,mat='lattice')=>{parts.push({name,geometry:g.clone()});b.put(g,mat);};
  const box=(name,at,size,mat='lattice')=>{const g=new THREE.BoxGeometry(...size);g.translate(...at);add(name,g,mat);};
  const beam=(name,a,c,width,ends,mat='lattice',sides=near?6:4)=>{
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
    const g=near ? new THREE.CylinderGeometry(width,width,d.length(),sides,1,false) : new THREE.BoxGeometry(width*2,d.length(),width*2);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray());add(name,g,mat);
    members.push({name,a,c,ends,width});
  };
  const cylinder=(name,at,radius,length,mat='lattice')=>{
    const g=new THREE.CylinderGeometry(radius,radius,length,near?24:12,1,false);
    g.rotateX(Math.PI/2);g.translate(...at);add(name,g,mat);
  };
  const p=(a,radius=r,v=0)=>[Math.sin(a)*radius,h+Math.cos(a)*radius,v];
  const ring=(name,radius,v,tube,mat='lattice')=>{
    const g=new THREE.TorusGeometry(radius,tube,near?6:4,near?168:63);
    g.translate(0,h,v);add(name,g,mat);
  };
  // Six steep tubular legs, three on each axle side. Feet and hub axle are
  // physically connected, with no unsupported truncated bars at the border.
  for(const side of [-1,1])for(const u of [-12,0,12]) {
    const v=side*(u===0?10:7.8),name=`foot-${side}-${u}`;
    box(name,[u,.3,v],[2.8,.6,2.8],'concrete');
    beam(`leg-${side}-${u}`,[u,.55,v],[0,h,side*2.35],.55,[name,'hub']);
  }
  cylinder('hub',[0,h,0],hubRadius,5.6);
  for(const v of [-2.95,2.95])cylinder(`hub-cap-${v}`,[0,h,v],1.8*radialScale,.3);

  // Two trussed rims, 21 radial trusses / 42 capsule attachment stations.
  for(const v of [-1,1])ring(`rim-${v}`,r,v,rimTube);
  for(let i=0;i<SPEC.cabins;i++) {
    const a=i*2*Math.PI/SPEC.cabins,next=(i+1)*2*Math.PI/SPEC.cabins;
    beam(`rim-tie-${i}`,p(a,r,-1),p(a,r,1),.12,['rim--1','rim-1']);
    if(near)beam(`rim-web-${i}`,p(a,r,-1),p(next,r,1),.055,['rim--1','rim-1']);
    if(i%2===0) {
      for(const v of [-1,1]) {
        // Deep paired chords with connected zigzag webs, visible from the
        // front and axle side. Far keeps both chords and two coarse bays.
        const spread=.032, offsets=[-spread,spread];
        for(const da of offsets)beam(`spoke-${i}-${v}-${da}`,p(a+da,spokeRoot,v),p(a+da,r,v),near?.13:.14,['hub',`rim-${v}`]);
        const bays=near?8:2;
        for(let j=0;j<bays;j++) {
          const ra=spokeRoot+j*(r-spokeRoot)/bays,rb=spokeRoot+(j+1)*(r-spokeRoot)/bays;
          const left=`spoke-${i}-${v}-${-spread}`,right=`spoke-${i}-${v}-${spread}`;
          beam(`spoke-web-${i}-${v}-${j}`,p(a+(j%2?spread:-spread),ra,v),p(a+(j%2?-spread:spread),rb,v),near?.07:.09,j%2?[right,left]:[left,right]);
        }
      }
    }
    const [u,y]=p(a),roofY=y-.55,baseY=y-2.4;
    // Upright chamfered capsules, no animation, no transparent draw sorting.
    // Roof and sill are disjoint slabs; the glazing has individual flat panes.
    const outline=[[-.85,-1.05],[.85,-1.05],[1.1,-.8],[1.1,.8],[.85,1.05],[-.85,1.05],[-1.1,.8],[-1.1,-.8]];
    const cap=(name,y0,thick)=>{
      const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,z)));
      const g=new THREE.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:false,steps:1});
      g.rotateX(Math.PI/2);g.translate(u,y0+thick/2,0);add(name,g);
    };
    cap(`cabin-roof-${i}`,roofY,.22);cap(`cabin-floor-${i}`,baseY,.32);
    const low=baseY+.16,high=roofY-.11;
    const pts=[],idx=[];
    for(let j=0;j<8;j++) {
      const q=outline[j],s=outline[(j+1)%8],n=pts.length/3;
      // Closed convex wall panels use outward winding. No underlying box.
      pts.push(u+q[0],low,q[1],u+s[0],low,s[1],u+q[0],high,q[1],u+s[0],high,s[1]);
      idx.push(n,n+2,n+1,n+1,n+2,n+3);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);g.computeVertexNormals();add(`cabin-glass-${i}`,g,'glass');
    for(const v of [-.82,.82])beam(`hanger-${i}-${v}`,[u,y,v],[u,roofY+.06,v],.07,[`rim-tie-${i}`,`cabin-roof-${i}`]);
    if(near)for(const [du,v] of [[-.85,-1.05],[.85,-1.05],[-.85,1.05],[.85,1.05]])
      beam(`mullion-${i}-${du}-${v}`,[u+du,low-.05,v],[u+du,high+.05,v],.055,[`cabin-floor-${i}`,`cabin-roof-${i}`]);
    // Low-profile light heads project outside the truss instead of occupying
    // its surface. Static pale-blue night lamps retain the wheel silhouette.
    for(const v of (near?[-1.23,1.23]:[1.23]))box(`lamp-${i}-${v}`,p(a,r,v),[.14,.14,.12],'glow');
  }
  // Street references show a low loading area, not a multi-storey stair.
  // Access grade is independent of the operator's wheel dimensions.
  const deckY=SPEC.boardingDeckHeight;
  box('loading-deck',[0,deckY-.15,0],[12,.3,5],'iron');
  for(const u of [-5,5])for(const v of [-2,2]) {
    const name=`deck-foot-${u}-${v}`;box(name,[u,.15,v],[1,.3,1],'concrete');
    beam(`deck-pier-${u}-${v}`,[u,.25,v],[u,deckY-.1,v],.16,[name,'loading-deck'],'iron');
  }
  // Solid connected stair wedges are cheaper and safer than floating treads.
  const n=near?6:4,run=2.4,rise=deckY/n;
  for(let i=0;i<n;i++)box(`step-${i}`,[8.5,(i+1)*rise/2,2.5+run-(i+.5)*run/n],[2.5,(i+1)*rise,run/n],'iron');
  box('stair-landing',[8,deckY-.15,1.3],[4,.3,2.4],'iron');
  for(const v of [-2.35,2.35]) {
    for(const u of [-5.8,0,5.8])beam(`deck-post-${u}-${v}`,[u,deckY-.02,v],[u,deckY+1.1,v],.06,['loading-deck',`deck-rail-${v}`],'iron');
    beam(`deck-rail-${v}`,[-5.8,deckY+1.05,v],[5.8,deckY+1.05,v],.06,[`deck-post--5.8-${v}`,`deck-post-5.8-${v}`],'iron');
  }
  for(const u of [7.3,9.7]) {
    const z0=2.5+run-.17,z1=2.65;
    for(const [z,y,key] of [[z0,.3,'low'],[z1,deckY,'high']])
      beam(`stair-post-${u}-${key}`,[u,y-.05,z],[u,y+1,z],.06,[key==='low'?'step-0':`step-${n-1}`,`stair-rail-${u}`],'iron');
    beam(`stair-rail-${u}`,[u,1.3,z0],[u,deckY+1,z1],.06,[`stair-post-${u}-low`,`stair-post-${u}-high`],'iron');
  }
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(WHEEL_ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  for(const part of parts)part.geometry.rotateY(WHEEL_ANGLE);
  // Source-only contact graph; the exporter serialises metadata, not this
  // audit mesh graph (kept non-enumerable to avoid needless GLB metadata).
  Object.defineProperty(root,'contactGraph',{value:{parts,members}});
  root.userData.cabins=SPEC.cabins;root.userData.cabinsUpright=true;
  return root;
}
