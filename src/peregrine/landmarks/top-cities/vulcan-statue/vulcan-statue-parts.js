import * as THREE from 'three';
import { SPEC } from './config.js';

// Original metric sculpture, authored as variable-section volumes, not a reference mesh.
// Component names and contact metadata survive here for observable support tests.
const ANGLE = -SPEC.frontageBearing * Math.PI / 180;
export const worldPoint = ([x,y,z]) => [x*Math.cos(ANGLE)+z*Math.sin(ANGLE), y, -x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];
export function authoredParts(detail = 'near') {
  const near = detail === 'near', parts = [], sides = near ? 14 : 8;
  let sculpture = false;
  function add(name, material, geometry, contacts) {
    if(sculpture) { geometry.scale(-1,1,1); const ix=geometry.index; if(ix)for(let i=0;i<ix.count;i+=3){const q=ix.getX(i+1);ix.setX(i+1,ix.getX(i+2));ix.setX(i+2,q);} }
    geometry.rotateY(ANGLE);
    if(material==='stone'||material==='trim')geometry=geometry.toNonIndexed();
    geometry.computeVertexNormals();
    parts.push({ name, material, geometry, contacts: contacts?.map(([point,support])=>[worldPoint(sculpture?[-point[0],point[1],point[2]]:point), support]) });
  }
  function box(name, mat, c, s) { const g=new THREE.BoxGeometry(...s);g.translate(...c);add(name,mat,g); }
  function ellipsoid(name,c,s,mat='iron') {
    const g=new THREE.SphereGeometry(1, near?16:8, near?10:5);g.scale(...s);g.translate(...c);add(name,mat,g);
  }
  // Elliptical cross sections along arbitrary paths. [x,y,z, half-width, half-depth].
  function loft(name,mat,rows,n=sides,caps=true) {
    const pos=[],idx=[];
    rows.forEach(([x,y,z,rx,rz],k)=>{
      const before=rows[Math.max(0,k-1)],after=rows[Math.min(rows.length-1,k+1)];
      const t=new THREE.Vector3(after[0]-before[0],after[1]-before[1],after[2]-before[2]).normalize();
      const u=new THREE.Vector3(t.y,-t.x,0).normalize(),v=new THREE.Vector3().crossVectors(u,t).normalize();
      for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pos.push(x+u.x*rx*Math.cos(a)+v.x*rz*Math.sin(a),y+u.y*rx*Math.cos(a)+v.y*rz*Math.sin(a),z+u.z*rx*Math.cos(a)+v.z*rz*Math.sin(a));}
    });
    for(let k=1;k<rows.length;k++)for(let i=0;i<n;i++){const j=(i+1)%n,a=(k-1)*n+i,b=(k-1)*n+j,c=k*n+i,d=k*n+j;idx.push(a,c,b,b,c,d);}
    if(caps){const a=pos.length/3;pos.push(...rows[0].slice(0,3),...rows.at(-1).slice(0,3));for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(a,i,j,a+1,(rows.length-1)*n+j,(rows.length-1)*n+i);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);add(name,mat,g);
  }
  function beam(name,a,b,width,depth,contacts,mat='iron'){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av),g=new THREE.BoxGeometry(width,d.length(),depth??width);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());add(name,mat,g,contacts);
  }
  // Octagonal stacked pedestal. Local north/south shaft faces follow two OSM control points.
  // Stone courses are actual slight changes in the surface, all one material.
  const shaftRows=[[0,.65,0,3.25,3.25],[0,2.4,0,3.1,3.1]];
  if(near) for(let y=2.8,i=0;y<36.5;i++){const r=3.1-(y-2.4)*.013;shaftRows.push([0,y,0,r,r],[0,y+.07,0,r-.028,r-.028]);y += [.46,.61,.53,.68,.49,.57][i%6];}
  else shaftRows.push([0,30.3,0,2.74,2.74]);
  shaftRows.push([0,37.25,0,2.65,2.65]);
  // Octagon rotates 22.5 degrees to put flat cardinal facets on the mapped faces.
  function octagon(name,mat,rows){
    const pos=[],idx=[],n=8;
    for(let row=0;row<rows.length;row++)for(let i=0;i<n;i++){const [y,r]=rows[row],a=(i+.5)*Math.PI/4;
      // Connected rough-cut facets catch slightly different light without texture
      // or material overlays; foundation, deck and far silhouette stay exact.
      const rough=near&&name==='tower'&&row>1&&row<rows.length-1;
      const rr=r+(rough?.035*Math.sin(Math.floor(row/2)*2.3+i*1.7):0);
      pos.push(Math.sin(a)*rr,y+(rough?.018*Math.sin(Math.floor(row/2)+i*2.1):0),Math.cos(a)*rr);
    }
    for(let k=1;k<rows.length;k++)for(let i=0;i<n;i++){const j=(i+1)%n,a=(k-1)*n+i,b=(k-1)*n+j,c=k*n+i,d=k*n+j;idx.push(a,b,c,b,d,c);}
    for(let i=1;i<n-1;i++)idx.push(0,i+1,i,(rows.length-1)*n,(rows.length-1)*n+i,(rows.length-1)*n+i+1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);add(name,mat,g);
  }
  octagon('foundation','stone',[[0,4.3],[.65,4.3]]);
  octagon('tower','stone',shaftRows.map(r=>[r[1],r[3]]));
  octagon('capstone','trim',[[37.25,2.65],[37.45,2.83],[SPEC.pedestalM,2.83]]);
  // Continuous octagonal observation ledge is sandstone on a visible supported soffit.
  // It merges into the shaft; no opposite material layers on the masonry.
  octagon('balcony-deck','stone',[[30.05,2.75],[30.45,4.45],[30.75,4.45]]);
  const balcony=[];
  for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;balcony.push([Math.sin(a)*4.27,30.76,Math.cos(a)*4.27]);}
  for(let i=0;i<8;i++){
    const q=balcony[i],r=balcony[(i+1)%8];
    beam('post-'+i,q,[q[0],32.0,q[2]],.12,.12,[[q,'balcony-deck'],[[q[0],32,q[2]],'rail-'+i]]);
    for(const [level,key] of [[32,'rail'],[31.36,'midrail']]) beam(key+'-'+i,[q[0],level,q[2]],[r[0],level,r[2]],.12,.12,[[[q[0],level,q[2]],'post-'+i],[[r[0],level,r[2]],'post-'+((i+1)%8)]]);
    if(near)for(let k=1;k<5;k++){const t=k/5,x=q[0]+(r[0]-q[0])*t,z=q[2]+(r[2]-q[2])*t;
      beam('picket-'+i+'-'+k,[x,30.76,z],[x,32,z],.055,.055,[[[x,30.76,z],'balcony-deck'],[[x,32,z],'rail-'+i]]);}
    const a=[q[0]/4.27*2.6,28.65,q[2]/4.27*2.6],b=[q[0],30.56,q[2]];
    beam('bracket-'+i,a,b,.16,.21,[[a,'tower'],[b,'balcony-deck']]);
  }
  // Elevator sits at the mapped detached footprint, 8.34m south of the pedestal.
  // Two concrete piers with the dark glazing between them; glass is a face of its own volume.
  box('elevator-west','trim',[-1.22,19.5,8.34],[.60,39,2.4]);
  box('elevator-east','trim',[1.22,19.5,8.34],[.60,39,2.4]);
  const crossLevels=[.35,7.4,14.8,22.2,30.6];
  for(let i=0;i<crossLevels.length;i++){const low=crossLevels[i]+.14,high=i+1<crossLevels.length?crossLevels[i+1]-.14:38.2;box('elevator-glass-'+i,'glass',[0,(low+high)/2,8.34],[1.84,high-low,2.0]);}
  box('elevator-cap','trim',[0,38.6,8.34],[1.84,.8,2.4]);
  for(const y of [0.35,7.4,14.8,22.2,30.6])box('elevator-cross-'+y,'trim',[0,y,8.34],[1.84,.28,2.4]);
  // Access catwalk joins tower balcony and elevator. All ends enter their named supports.
  const a=[0,30.57,4.2],c=[0,30.57,7.5];
  beam('access-deck',a,c,1.7,.32,[[a,'balcony-deck'],[c,'elevator-glass-3']]);
  for(const x of [-.79,.79]){
    const key=x<0?'west':'east';
    for(const z of [4.2,5.85,7.5])beam('access-post-'+key+'-'+z,[x,30.7,z],[x,31.9,z],.1,.1,[[[x,30.7,z],'access-deck'],[[x,31.9,z],'access-rail-'+key]]);
    beam('access-rail-'+key,[x,31.9,4.2],[x,31.9,7.5],.11,.11,[[[x,31.9,4.2],'access-post-'+key+'-4.2'],[[x,31.9,7.5],'access-post-'+key+'-7.5']]);
    if(near)beam('access-diagonal-'+key,[x,30.75,4.2],[x,31.85,7.5],.08,.08,[[[x,30.75,4.2],'access-post-'+key+'-4.2'],[[x,31.85,7.5],'access-post-'+key+'-7.5']]);
  }
  // Masonry slit windows are modest openings rather than tall dark stripes.
  // Faces are at least 12cm in front of a facet; far drops the three small slits.
  if(near)for(const y of [8,16.5,24])box('slit-'+y,'recess',[0,y,-2.9+(y-2.4)*.012],[.23,1.1,.13]);
  box('door','recess',[0,1.32,-3.05],[.85,1.9,.18]);
  // Statue coordinates are relative to the top of its pedestal.
  const S=SPEC.pedestalM; sculpture = true;
  const sr=(rows)=>rows.map(([x,y,z,rx,rz])=>[x,y+S,z,rx,rz]);
  const ep=(name,c,s)=>ellipsoid(name,[c[0],c[1]+S,c[2]],s);
  // Feet and calf/thigh continuous profiles, with an open gap between the legs.
  ep('left-foot',[-.95,.28,-.28],[.54,.28,1.08]);
  ep('right-foot',[1.05,.27,-.32],[.54,.27,1.0]);
  loft('left-leg','iron',sr([[-.95,.35,.0,.39,.47],[-1.05,1.1,.15,.43,.48],[-1.03,2,.25,.60,.65],[-.85,2.8,.18,.48,.48],[-.95,3.6,.1,.67,.77],[-.85,4.8,0,.80,.78],[-.72,5.6,0,.77,.8]]));
  loft('right-leg','iron',sr([[1.05,.32,0,.4,.47],[.95,1.15,.08,.47,.5],[.90,2.1,.16,.59,.65],[.78,2.85,.14,.46,.48],[.68,3.7,.14,.67,.72],[.72,4.9,.12,.78,.77],[.75,5.6,.1,.8,.8]]));
  loft('torso','iron',sr([[0,4.8,.12,1.20,.70],[0,5.6,.12,1.51,.8],[.05,6.5,.1,1.34,.77],[.1,7.5,.02,1.13,.7],[0,8.3,0,1.25,.75],[-.12,9.3,0,1.80,.83],[-.2,10.05,.03,1.76,.74],[-.15,10.55,.03,1.02,.55],[-.1,10.85,.05,.5,.43]]));
  // The apron is a broad front volume with the asymmetric scalloped leather hem.
  const apron=new THREE.Shape();apron.moveTo(-1.17,8.0);apron.lineTo(1.19,8.0);apron.lineTo(1.55,5.05);apron.lineTo(.95,4.65);apron.lineTo(.1,4.95);apron.lineTo(-.65,4.58);apron.lineTo(-1.56,4.92);apron.closePath();
  const ag=new THREE.ExtrudeGeometry(apron,{depth:.26,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.10,bevelThickness:.10});ag.translate(0,S,-1.07);add('apron','iron',ag);
  // Torso muscular volume and the single diagonal apron strap.
  ep('pectoral-left',[-.82,9.65,-.56],[.90,.59,.24]);ep('pectoral-right',[.77,9.4,-.58],[.81,.55,.22]);
  beam('apron-strap',[1.19,S+10.16,-.65],[-.25,S+7.8,-.8],.21,.18,[[[1.19,S+10.16,-.65],'torso'],[[-.25,S+7.8,-.8],'torso']]);
  // Raised right arm: shoulder, bicep, elbow and narrowing forearm are a continuous sculpted loft.
  loft('raised-arm','iron',sr([[-1.6,10.05,0,.7,.67],[-2.35,11.1,-.05,.57,.60],[-3.1,12.35,-.07,.42,.45],[-3.55,13.3,-.12,.42,.45],[-4.12,14.3,-.18,.30,.33],[-4.48,14.95,-.2,.26,.3]]));
  ep('raised-hand',[-4.55,15.15,-.2],[.35,.48,.34]);
  // Spear point (not a long spear staff) gripped in the raised hand, with a sharp blade.
  beam('spear-neck',[-4.5,S+14.95,-.2],[-4.95,S+15.8,-.2],.14,.18,[[[-4.5,S+14.95,-.2],'raised-hand'],[[-4.95,S+15.8,-.2],'spear-blade']]);
  const blade=new THREE.Shape();blade.moveTo(-4.72,15.68);blade.lineTo(-5.84,17.0688);blade.lineTo(-5.38,15.63);blade.lineTo(-4.96,15.81);blade.closePath();
  const bg=new THREE.ExtrudeGeometry(blade,{depth:.11,bevelEnabled:false});bg.translate(0,S,-.255);add('spear-blade','iron',bg);
  // Opposite arm is bent outward/down to the hammer. Keep the gap at the waist.
  loft('hammer-arm','iron',sr([[1.49,9.8,.07,.64,.62],[2.13,9.18,.04,.52,.53],[2.57,8.5,-.1,.4,.42],[2.9,8.1,-.35,.32,.35]]));
  ep('hammer-hand',[2.9,8.0,-.40],[.37,.44,.39]);
  box('anvil-stump','iron',[2.0,S+1.9,.44],[1.25,3.8,1.15]);
  box('anvil-foot','iron',[2.0,S+3.84,.44],[1.1,.26,1.0]);
  box('anvil-waist','iron',[2.0,S+4.13,.44],[.6,.33,.7]);
  box('anvil-face','iron',[2.10,S+4.5,.38],[1.58,.41,.88]);
  // Distinctive anvil horn, tapered to a pointed nose, facing left.
  loft('anvil-horn','iron',[[.1,S+4.52,.38,.02,.02],[.7,S+4.52,.38,.25,.3],[1.7,S+4.52,.38,.33,.39]],near?10:6);
  beam('hammer-handle',[2.85,S+7.95,-.4],[2.20,S+4.93,.15],.18,.18,[[[2.85,S+7.95,-.4],'hammer-hand'],[[2.20,S+4.93,.15],'hammer-head']]);
  box('hammer-head','iron',[2.22,S+4.85,.18],[.95,.38,.62]);
  // Head: neck, cheek, skull and chin sections, with a projecting nose and beard.
  loft('head','iron',sr([[-.1,10.42,.07,.50,.47],[-.14,10.92,0,.62,.65],[-.13,11.45,.01,.82,.73],[-.05,12.03,.03,.83,.74],[.02,12.48,.08,.76,.66],[.02,12.72,.12,.44,.45],[.02,12.83,.12,.08,.1]]));
  ep('nose',[-.16,11.93,-.76],[.20,.34,.28]);
  loft('beard','iron',sr([[-.12,10.55,-.50,.18,.25],[-.17,10.9,-.63,.48,.36],[-.16,11.38,-.69,.63,.24],[-.13,11.62,-.64,.60,.23]]),near?12:8);
  ep('brow-left',[-.47,12.12,-.62],[.29,.13,.15]);ep('brow-right',[.25,12.12,-.64],[.28,.13,.15]);
  if(near){
    for(let i=0;i<18;i++){const a=i*Math.PI*2/18;ep('hair-curl-'+i,[Math.sin(a)*.73,12.38+.15*Math.sin(i*2),.10+Math.cos(a)*.60],[.22,.25,.22]);}
    for(let i=0;i<7;i++)ep('beard-curl-'+i,[-.63+i*.16,11.03+.08*Math.sin(i*3),-.82],[.13,.35,.12]);
    for(let i=0;i<4;i++)ep('finger-'+i,[-4.52+i*.07,15.12+i*.09,-.47],[.115,.14,.11]);
  }
  return parts;
}
