import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, ANGLE } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Architectural frame u east, v south, unskewed by the measured east wall.
// Original texture-free geometry, not traced mesh or captured imagery.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', seg = near ? 24 : 8;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const contacts = [];
  const box = (mat,x0,x1,y0,y1,z0,z1) => b.box(mat,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  const cylinder = (mat,x,z,r,y0,y1,segments=seg) => {
    const g = new THREE.CylinderGeometry(r,r,y1-y0,segments);g.translate(x,(y0+y1)/2,z);b.put(g,mat);
  };
  const ring = (mat,x,z,r0,r1,y0,y1,n=seg,a0=0,length=Math.PI*2) => {
    const s = new THREE.Shape();s.absarc(0,0,r1,a0,a0+length,false);
    if(length < Math.PI*2-.01) { s.lineTo(r0*Math.cos(a0+length),r0*Math.sin(a0+length));s.absarc(0,0,r0,a0+length,a0,true);s.closePath(); }
    else { const h = new THREE.Path();h.absarc(0,0,r0,0,Math.PI*2,true);s.holes.push(h); }
    const g = new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false,curveSegments:n});g.rotateX(-Math.PI/2);g.translate(x,y0,z);b.put(g,mat);
  };
  // A real masonry wall with recessed window holes: no dark decals over a solid box.
  // local x runs along a face, local z points outward.
  const wall = (cx,cz,length,bottom,top,angle,windows=[],mat='ochre') => {
    const shape = new THREE.Shape([[-length/2,bottom],[length/2,bottom],[length/2,top],[-length/2,top]].map(p=>new THREE.Vector2(...p)));
    const place = (g) => g.rotateY(angle).translate(cx,0,cz);
    for(const [x,y,w,h] of windows) {
      const hole = new THREE.Path();hole.moveTo(x-w/2,y);hole.lineTo(x+w/2,y);hole.lineTo(x+w/2,y+h);hole.lineTo(x-w/2,y+h);hole.closePath();shape.holes.push(hole);
      b.put(place(new THREE.PlaneGeometry(w,h).translate(x,y+h/2,near?-.28:-.58)),'window');
      if(near) {
        for(const dx of [-w/2,w/2])b.put(place(new THREE.BoxGeometry(.13,h+.26,.18).translate(x+dx,y+h/2,.18)),'cream');
        b.put(place(new THREE.BoxGeometry(w+.42,.22,.22).translate(x,y+h+.12,.18)),'cream');
        for(const yy of [.33,.66])b.put(place(new THREE.BoxGeometry(w,.055,.07).translate(x,y+yy*h,-.21)),'metal');
        b.put(place(new THREE.BoxGeometry(.07,h,.07).translate(x,y+h/2,-.21)),'metal');
      }
    }
    b.put(place(new THREE.ExtrudeGeometry(shape,{depth:.8,bevelEnabled:false}).translate(0,0,-.8)),mat);
  };
  const rows = (length,yValues,step=5.1) => {
    const out=[];for(let x=-length/2+2.4;x<length/2-1.7;x+=step)for(const y of yValues)out.push([x,y,1.35,2.25]);return out;
  };
  // Low structural foundation keeps the historic terrace rigid, not a terrain hill.
  box('stone',-36.6,10.35,0,3.2,-51.4,52.1);
  box('garden',-25.65,-1.1,3.2,3.26,-41.85,37.1);
  box('cream',-25.65,-1.1,3.26,3.36,-2.3,-.9);
  box('cream',-14.6,-13.1,3.26,3.36,-41.85,37.1);
  // Main west wing. The entrance is left open between the twin turrets.
  const frontWindows=[];
  for(let v=-38;v<=17;v+=5.1)if(Math.abs(v)>11)for(const y of [4.35,8.4])frontWindows.push([v+11, y,1.6,2.5]);
  frontWindows.push([11,7.7,6.3,3.8]);
  wall(-37,-11,62,3.2,12.25,-Math.PI/2,frontWindows);
  wall(-26,-11,62,3.2,11.5,Math.PI/2,rows(62,[4.25,8.1]));
  box('ochre',-37,-26,3.2,11.7,-42,-41.2);
  box('ochre',-37,-26,3.2,11.7,19.2,20);
  
  // Cream horizontal courses on the facade; continuous pale eave in the photos.
  for(const [y,h] of [[7.65,.22],[11.6,.25],[12.18,.25]])for(const [v0,v1] of [[-41.8,-12],[-5,5],[12,19.8]])box('cream',-37.36,-36.8,y,y+h,v0,v1);
  // A low hipped red tiled roof, behind the cream parapet rather than a tall gable.
  const hip = (x0,x1,z0,z1,y,rise) => {
    const a=(x0+x1)/2,d=Math.min(2.5,(z1-z0)/4);
    const pts=[[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1],[a,y+rise,z0+d],[a,y+rise,z1-d]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]);g.computeVertexNormals();b.put(g,'roof');
  };
  hip(-36.85,-26.15,-41.9,20.05,12.5,.7);
  // The east wing and the north and south return wings enclose an OPEN garden.
  wall(10.25,2.5,97,3.2,12.1,Math.PI/2,rows(97,[4.3,8.55]));
  wall(-1.0,-2.3,87.6,3.2,11.5,-Math.PI/2,rows(87.6,[4.35,8.1]));
  
  hip(-.8,10.05,-45.9,50.85,12.15,.5);
  wall(-20.55,-51.25,53.7,3.2,11.65,Math.PI,rows(53.7,[4.3,8.4]));
  wall(-13.9,-42.25,24,3.2,10.4,0,rows(24,[4.3,7.6]));
  box('roof',-47.4,6.3,11.6,11.9,-51.1,-42.45);
  hip(-47.4,6.3,-51.1,-42.45,11.95,.5);
  wall(-7.55,51.75,35.6,3.2,8.4,0,rows(35.6,[4.25]));
  wall(-13.8,37.7,24.4,3.2,8.4,Math.PI,rows(24.4,[4.25]));
  box('roof',-25.6,9.8,8.4,8.7,38.1,51.4);
  hip(-25.6,9.8,38.1,51.4,8.75,1.3);
  for(const [x0,x1,y,z0,z1] of [[-47.4,6.3,11.7,-51.5,-50.95],[-1,10,12,-45.9,50.9]]) {
    if(z1-z0>50)for(let z=z0+.8;z<z1;z+=1.7)box('ochre',9.55,10.25,y,y+.72,z,z+.72);
    else for(let x=x0+.3;x<x1;x+=1.7)box('ochre',x,x+.72,y,y+.72,z0,z1);
  }
  // Two mapped cylindrical east corner watchtowers: preserved weathered stone.
  for(const [x,z] of [[9.6,-49.4],[10.0,54.1]]) {
    cylinder('stone',x,z,2.65,0,11.3);
    cylinder('stone',x,z,3.1,11.3,11.65);
    ring('stone',x,z,2.25,3.05,11.65,13.1);
    for(let i=0;i<12;i++)ring('stone',x,z,2.25,3.05,13.1,14.0,near?5:1,i*Math.PI/6,.29);
    if(near)for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
      const g=new THREE.PlaneGeometry(.5,1.6);g.rotateY(a);g.translate(x+2.77*Math.sin(a),8.8,z+2.77*Math.cos(a));b.put(g,'metal');
    }
  }
  // Paired ochre entry turrets with real open crenellated parapets and white caps.
  for(const v of [-8.5,8.5]) {
    cylinder('ochre',-37.2,v,3.15,3.2,12.45);
    cylinder('cream',-37.2,v,3.34,11.55,11.78);
    cylinder('cream',-37.2,v,3.39,12.45,12.72);
    ring('ochre',-37.2,v,2.65,3.32,12.72,13.75);
    for(let i=0;i<14;i++){
      const a=i*2*Math.PI/14;
      ring('ochre',-37.2,v,2.65,3.32,13.75,14.45,near?4:1,a,.27);
      ring('cream',-37.2,v,2.60,3.38,14.45,14.6,near?4:1,a,.27);
    }
    for(const a of [-Math.PI/2-.67,-Math.PI/2,-Math.PI/2+.67]) {
      const g=new THREE.PlaneGeometry(.8,2.75);g.rotateY(a);g.translate(-37.2+3.28*Math.sin(a),9.75,v+3.28*Math.cos(a));b.put(g,'window');
    }
  }
  // Historic doorway, supported balcony and canopy between the paired towers.
  box('ochre',-36.95,-34.7,7.8,13.1,-5.2,-3.2);
  box('ochre',-36.95,-34.7,7.8,13.1,3.2,5.2);
  box('ochre',-36.95,-34.7,11.5,13.1,-3.2,3.2);
  box('metal',-35.9,-35.7,7.7,11.5,-3.15,3.15);
  box('cream',-41.4,-34.7,7.4,7.8,-5.0,5.0);
  box('ochre',-39.8,-35.0,11.55,11.88,-3.45,3.45);
  for(const v of [-3.3,3.3])box('ochre',-39.6,-39.12,7.8,11.6,v-.22,v+.22);
  // A lower central drum and two mirrored stair flights: concrete treads meet landings.
  cylinder('ochre',-44.7,0,2.45,0,4.4);
  cylinder('cream',-44.7,0,2.65,4.4,4.63);
  ring('ochre',-44.7,0,2.1,2.55,4.63,6.25,near?16:6,-.15,Math.PI+.3);
  cylinder('cream',-44.7,0,3.8,6.25,6.55);
  for(let i=0;i<20;i++)ring('cream',-44.7,0,3.45,3.8,6.55,6.95,near?3:1,i*Math.PI/10,.17);
  for(const v of [-1.9,1.9])box('ochre',-47.35,-46.9,4.63,6.25,v-.2,v+.2);
  for(const s of [-1,1]) {
    const n=near?24:12;
    for(let i=0;i<n;i++) {
      const t=i/n,v=s*(17.5-13.1*t),dy=3.2+4.2*(i+1)/n,depth=13.1/n;
      box('stone',-44.1,-40.15,0,dy,Math.min(v,v-s*depth),Math.max(v,v-s*depth));
    }
    // Solid parapets alongside the scissor stair, with a cream top coping.
    const poly = new THREE.Shape([[s*17.5,0],[s*4.4,0],[s*4.4,8.2],[s*17.5,4.0]].map(p=>new THREE.Vector2(...p)));
    const g=new THREE.ExtrudeGeometry(poly,{depth:.5,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-44.55,0,0);b.put(g,'ochre');
    b.bar('cream',[-44.33,4.03,s*17.5],[-44.33,8.23,s*4.4],.20,.25);
    contacts.push({name:'stair coping '+s,a:[-44.33,4.03,s*17.5],b:[-44.33,8.23,s*4.4],material:'ochre',reach:.34});
  }
  // Plaza entry stairs begin at grade, not at an unsupported boundary.
  for(let i=0;i<(near?16:8);i++) {
    const n=near?16:8,x=-50.1+5.1*i/n;
    box('stone',x,x+5.1/n,0,3.2*(i+1)/n,-3.2,3.2);
  }
  for(const [z0,z1] of [[-41.5,-4.2],[4.2,20.5]])box('ochre',-49.4,-48.7,0,2.3,z0,z1);
  // Modern glass butterfly pavilion at the southwest plaza-side garden.
  // Closed glass shell and supported transverse ribs; translucent appearance is stylised opaque.
  box('stone',-49,-26.7,0,.4,24.0,49.0);
  // Individual opaque panes share existing materials; no hidden full glass wall behind them.
  const pane=(mat,pts,normal)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
    const flip=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0]))).dot(new THREE.Vector3(...normal))<0;
    g.setIndex(flip?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,mat);};
  const bayCount=near?8:4,rowsCount=near?3:2;
  for(const x of [-49,-26.7])for(let i=0;i<bayCount;i++)for(let j=0;j<rowsCount;j++){
    const z0=24.3+24.4*i/bayCount,z1=24.3+24.4*(i+1)/bayCount,y0=.4+5.8*j/rowsCount,y1=.4+5.8*(j+1)/rowsCount;
    const low=(i+j)%3===0?y0+.18:y0;
    pane('glass',[[x,low,z0],[x,low,z1],[x,y1,z1],[x,y1,z0]],[x<-38?-1:1,0,0]);
    // Thin dark lower strips suggest reflected panes without a new material/draw.
    if((i+j)%3===0)pane('window',[[x,y0,z0],[x,y0,z1],[x,y0+.18,z1],[x,y0+.18,z0]],[x<-38?-1:1,0,0]);
  }
  for(const z of [24.3,48.7])for(let i=0;i<bayCount;i++){
    const x0=-49+22.3*i/bayCount,x1=-49+22.3*(i+1)/bayCount;
    const roofY=x=>6.2+2.1*(1-Math.abs(x+37.85)/11.15);
    pane('glass',[[x0,.4,z],[x1,.4,z],[x1,roofY(x1),z],[x0,roofY(x0),z]],[0,0,z<30?-1:1]);
  }
  for(const [x0,x1] of [[-49,-37.85],[-37.85,-26.7]])for(let i=0;i<4;i++){
    const z0=24.3+6.1*i,z1=z0+6.1,roofY=x=>6.2+2.1*(1-Math.abs(x+37.85)/11.15);
    pane('glass',[[x0,roofY(x0),z0],[x1,roofY(x1),z0],[x1,roofY(x1),z1],[x0,roofY(x0),z1]],[0,1,0]);
  }
  // Mullions are at least 10 cm proud near; far embeds them in the pane planes.
  for(const x of [-49,-26.7]){
    const outer=near?(x<-38?-.18:.18):0;
    for(const z of [27.1,33.3,39.6,45.9])box('metal',x+outer-.07,x+outer+.07,.4,6.2,z-.07,z+.07);
    for(let j=1;j<rowsCount;j++){const y=.4+5.8*j/rowsCount;for(const [z0,z1] of [[24.5,29.8],[30.7,36.05],[36.95,42.3],[43.2,48.5]])box('metal',x+outer-.07,x+outer+.07,y-.07,y+.07,z0,z1);}
  }
  for(const z of [24.3,48.7])for(let i=1;i<bayCount;i++){
    const x=-49+22.3*i/bayCount,y=6.2+2.1*(1-Math.abs(x+37.85)/11.15),d=near?(z<30?-.18:.18):0;
    box('metal',x-.07,x+.07,.4,y,z+d-.07,z+d+.07);
  }
  // Structural end curbs, vertical frames and roof ribs (steel ends touch masonry pylons).
  for(const z of [24.0,30.25,36.5,42.75,49.0]) {
    for(const x of [-49,-26.7])box('cream',x-.25,x+.25,.4,6.4,z-.27,z+.27);
    b.bar('metal',[-49,6.25,z],[-37.85,8.5,z],.16,.20);
    b.bar('metal',[-37.85,8.5,z],[-26.7,6.25,z],.16,.20);
    box('cream',-38.1,-37.6,8.23,8.55,z-.3,z+.3);
    contacts.push({name:'pavilion west rib '+z,a:[-49,6.25,z],b:[-37.85,8.5,z],material:'cream',reach:.3});
    contacts.push({name:'pavilion east rib '+z,a:[-37.85,8.5,z],b:[-26.7,6.25,z],material:'cream',reach:.3});
  }
  // The sphere enclosure at the ticket entrance; a stone sphere stands within its frame.
  cylinder('stone',-47.0,20.6,3.05,0,.4,near?32:16);
  const shell=new THREE.SphereGeometry(3.0,near?28:14,near?16:8,0,Math.PI*2,.3,Math.PI-.6);shell.scale(1,1.12,1);shell.translate(-47,3.22,20.6);b.put(shell,'glass');
  for(const a of [0,Math.PI/3,2*Math.PI/3]){
    const hoop=new THREE.TorusGeometry(3.12,.09,4,near?40:20);hoop.rotateY(a);hoop.translate(-47,3.28,20.6);b.put(hoop,'metal');
  }
  cylinder('stone',-47,20.6,.78,.4,.55,12);
  const sphere=new THREE.SphereGeometry(.85,near?16:8,near?10:6);sphere.translate(-47,1.38,20.6);b.put(sphere,'stone');
  // Detached OSM east service annexes, individually owned: original simple low roofs.
  for(const ring of FOOTPRINTS.slice(1)) {
    const points=ring.slice(0,-1).map(([lng,lat])=>{
      const x=(lng-SPEC.origin[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-lat)*111319.49;
      return new THREE.Vector2(x*Math.cos(ANGLE)-z*Math.sin(ANGLE),x*Math.sin(ANGLE)+z*Math.cos(ANGLE));
    });
    const s=new THREE.Shape(points.map(p=>new THREE.Vector2(p.x,-p.y)));
    const body=new THREE.ExtrudeGeometry(s,{depth:5.6,bevelEnabled:false});body.rotateX(-Math.PI/2);b.put(body,'ochre');
    const cap=new THREE.ExtrudeGeometry(s,{depth:.22,bevelEnabled:false});cap.rotateX(-Math.PI/2);cap.translate(0,5.6,0);b.put(cap,'roof');
  }
  const root=b.finish();
  root.userData.contacts=contacts;
  root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ANGLE);const g=mergeVertices(o.geometry,1e-5);o.geometry.dispose();o.geometry=g;
    // Remove invisible flat-grade bottoms, which otherwise overlap foundation surfaces.
    const p=g.attributes.position,idx=g.index,keep=[];for(let i=0;i<idx.count;i+=3){const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)];if(!ids.every(j=>Math.abs(p.getY(j))<1e-5))keep.push(...ids);}g.setIndex(keep);
    g.computeBoundingBox();g.computeBoundingSphere();}});
  return root;
}
