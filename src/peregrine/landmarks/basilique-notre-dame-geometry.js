import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { NOTRE_DAME, NOTRE_DAME_PALETTES } from './basilique-notre-dame-config.js';

// Original, texture-free exterior. The three portico openings are geometry,
// not black rectangles. All components are merged by material before export.
export function createNotreDame({ detail = 'near' } = {}) {
  const b = assetBuilder(NOTRE_DAME, detail), near = detail === 'near';
  const box = (m,x,y,z,w,h,d) => b.box(m,[x,y,z],[w,h,d]);
  const beam = (m,a,c,w) => b.bar(m,a,c,w);
  function polygon(points, material, depth, z) {
    const s = new THREE.Shape(points.map(([x,y]) => new THREE.Vector2(x,y)));
    const g = new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,steps:1,curveSegments:near?10:4});
    g.translate(0,0,z); b.put(g,material);
  }
  function archPoints(x,y,w,h) {
    const r=w/2, rise=w*0.8, spring=y+h-rise, points=[[x-r,y],[x+r,y],[x+r,spring]];
    const n=near?12:4;
    for(let i=1;i<=n;i++) {const u=r-r*i/n; points.push([x+u,spring+rise*Math.sqrt(1-((u+r)/(2*r))**2)/Math.sqrt(0.75)]);}
    for(let i=1;i<=n;i++) {const u=-r*i/n; points.push([x+u,spring+rise*Math.sqrt(1-((u-r)/(2*r))**2)/Math.sqrt(0.75)]);}
    return points;
  }
  function arch(x,y,z,w,h,{fill='glass',rim=0.3,depth=0.22,side=0}={}) {
    if(!near) {
      // Far: two flat fans replace the extruded reveal. The dark opening sits 5 cm behind the
      // stone surround's plane and the paler surround fan 10 cm; no raised rim, no thickness.
      if(!fill)return;
      const fan=(points,dz,material)=>{
        const f=new THREE.ShapeGeometry(new THREE.Shape(points.map(p=>new THREE.Vector2(...p))));
        f.rotateY(Math.PI); f.translate(2*x,0,z+dz); if(side)f.rotateY(side); b.put(f,material);
      };
      fan(archPoints(x,y,w+rim*2,h+rim),0.10,'concrete');
      fan(archPoints(x,y+rim,w,h-rim),0.05,fill);
      return;
    }
    const outer = new THREE.Shape(archPoints(x,y,w+rim*2,h+rim).map(p=>new THREE.Vector2(...p)));
    outer.holes.push(new THREE.Path(archPoints(x,y+rim,w,h-rim).map(p=>new THREE.Vector2(...p))));
    const g = new THREE.ExtrudeGeometry(outer,{depth,bevelEnabled:false,steps:1});
    g.translate(0,0,z); if(side)g.rotateY(side); b.put(g,'concrete');
    if(fill) {
      const f=new THREE.ShapeGeometry(new THREE.Shape(archPoints(x,y+rim,w,h-rim).map(p=>new THREE.Vector2(...p))));
      f.rotateY(Math.PI); f.translate(2*x,0,z+0.05); if(side)f.rotateY(side); b.put(f,fill);
    }
  }
  function roof(x,z,w,d,eave,ridge) {
    polygon([[x-w/2,eave],[x,eave+ridge],[x+w/2,eave]],'roof',d,z);
  }
  function pinnacle(x,z,top=66,base=59.3,keepFar=false) {
    if(!near) {
      if(!keepFar)return;
      const g=new THREE.CylinderGeometry(0.1,0.82,top-base,4,1);g.translate(x,(top+base)/2,z);b.put(g,'stone');return;
    }
    const shaft=new THREE.CylinderGeometry(0.58,0.82,top-base-2,8);
    shaft.translate(x,(top+base-2)/2,z);b.put(shaft,'stone');
    box('concrete',x,top-2.1,z,1.5,0.3,1.5);
    const tip=new THREE.ConeGeometry(0.75,2.1,8);tip.translate(x,top-1.05,z);b.put(tip,'concrete');
  }
  function crenels(x,z,w,d,y) {
    box('concrete',x,y,z,w,0.5,d);
    if(!near)return;
    for(let u=-w/2+0.65;u<w/2;u+=2.1) for(const v of [-d/2+0.45,d/2-0.45])box('stone',x+u,y+0.8,z+v,1.1,1.2,0.85);
    if(d>2)for(let v=-d/2+2;v<d/2-1;v+=2.1)for(const u of [-w/2+0.45,w/2-0.45])box('stone',x+u,y+0.8,z+v,0.85,1.2,1.1);
  }
  function rose(x,y,z,r) {
    const disc=new THREE.CircleGeometry(r,near?32:16);disc.rotateY(Math.PI);disc.translate(x,y,z+0.06);b.put(disc,'iron');
    if(!near)return;
    const ring=new THREE.TorusGeometry(r+0.16,0.2,4,32);ring.translate(x,y,z);b.put(ring,'concrete');
    for(let i=0;i<12;i++){const a=i*Math.PI/6;beam('stone',[x,y,z-0.02],[x+Math.sin(a)*r,y+Math.cos(a)*r,z-0.02],0.09);}
  }
  function towerCornice(x,y) {
    // One continuous slab including the pilaster collars. Overlaid boxes left
    // almost coincident top faces at every corner of the old cornices.
    if(!near){box('concrete',x,y,6.2,10.85,0.4,11.75);return;}
    const outline=[[-5.425,0.325],[-3.875,0.325],[-3.875,0.45],[3.875,0.45],[3.875,0.325],[5.425,0.325],[5.425,1.875],[5.35,1.875],[5.35,10.525],[5.425,10.525],[5.425,12.075],[3.875,12.075],[3.875,11.95],[-3.875,11.95],[-3.875,12.075],[-5.425,12.075],[-5.425,10.525],[-5.35,10.525],[-5.35,1.875],[-5.425,1.875]];
    const shape=new THREE.Shape(outline.map(([u,v])=>new THREE.Vector2(x+u,-v)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:0.4,bevelEnabled:false});
    g.rotateX(-Math.PI/2);g.translate(0,y-0.2,0);b.put(g,'concrete');
  }
  // Main rectangle and restrained, low-pitched metal roof; façade masks its ridge.
  box('stone',0,13.5,44,40,27,65);
  roof(0,11.5,40.6,65.5,27,5.4);
  box('concrete',0,27,44,41,0.5,65);
  // Façade screen with physically open, recessed triple Gothic portico.
  const wall=new THREE.Shape([[-10.7,0.65],[10.7,0.65],[10.7,35],[-10.7,35]].map(p=>new THREE.Vector2(...p)));
  for(const x of [-7,0,7])wall.holes.push(new THREE.Path(archPoints(x,0.95,5.55,14.5).map(p=>new THREE.Vector2(...p))));
  const wg=new THREE.ExtrudeGeometry(wall,{depth:1.55,bevelEnabled:false});wg.translate(0,0,0.7);b.put(wg,'stone');
  box('stone',0,8.5,5.2,21,16,1.2);
  for(const x of [-7,0,7]) {
    arch(x,0.95,0.36,5.55,14.5,{fill:null,rim:0.3});
    arch(x,1,4.3,4.6,10.4,{fill:'iron'});
    if(near) for(const dx of [-1.1,1.1])box('museum',x+dx,4.8,4.2,1.7,6.8,0.13);
    arch(x,19,0.38,5.2,11.7,{fill:'museum',rim:0.4});
    // Three statuary niches: simplified silhouettes, no sculptural replication.
    if(near){
      const figure=new THREE.CylinderGeometry(0.25,0.52,2.6,8);figure.translate(x,26.3,0.27);b.put(figure,'concrete');
      const head=new THREE.SphereGeometry(0.37,8,6);head.translate(x,28,0.27);b.put(head,'concrete');
      box('concrete',x,24.65,0.3,1.5,0.45,0.9);
    }
    if(near)for(const dx of [-1.8,0,1.8]) {box('concrete',x+dx,21.35,0.16,0.14,4.3,0.24); arch(x+dx,19.3,0.15,1.35,4.9,{fill:null,rim:0.12,depth:0.1});}
  }
  for(const y of [1,15.9,17.4,33.9])box('concrete',0,y,0.6,19.95,0.4,2.1);
  crenels(0,1.45,21.4,1.8,35);
  box('concrete',0,37.1,1.25,0.36,3.5,0.4);box('concrete',0,37.65,1.25,1.8,0.34,0.4);
  // Shallow steps lie on the building side of the street, never a plaza slab.
  for(let i=0;i<3;i++)box('stone',0,0.15+i*0.25,2.2-i*0.35,20.5,0.3+i*0.5,4.1-i*0.7);
  for(const x of [-15.4,15.4]) {
    box('stone',x,30,6.2,10.2,60,11);
    // Horizontal courses end at the openings instead of crossing the glass.
    for(const y of [1,6.8,17.4,31.4,46.2,59.4])towerCornice(x,y);
    for(const u of [-4.65,4.65])for(const v of [1.1,11.3]) {
      box('stone',x+u,29.7,v,1.2,59.4,1.2);
      if(near)box('concrete',x+u,35.5,v,1.55,0.4,1.55);
      pinnacle(x+u,v,66,59.3,true);
    }
    crenels(x,6.2,10.8,11.6,60);
    for(const [y,h,w,fill] of [[6.9,7.8,2.5,'glass'],[20.1,8.8,2.8,'glass'],[34.8,7,3.4,'iron'],[47,10,4.1,'iron']]) {
      arch(x,y,0.43,w,h,{fill});
      box('concrete',x,y+(h-w*.8)/2,0.25,0.19,h-w*.8,0.2);
      if(near && fill==='iron')for(let a=y+0.7;a<y+h-w*.75;a+=0.7)box('museum',x,a,0.17,w-0.2,0.16,0.35);
      // Corresponding external side face; tower's square section remains clear.
      const side=x>0?-Math.PI/2:Math.PI/2;
      arch(x>0?6.2:-6.2,y,-20.75,w,h,{fill,side});
    }
    rose(x,44,0.32,1.45);
    for(const [y,h,w] of [[34.8,7,3.4],[47,10,4.1]]) {
      arch(x>0?-6.2:6.2,y,10.1,w,h,{fill:'iron',side:x>0?Math.PI/2:-Math.PI/2});
      arch(-x,y,-11.98,w,h,{fill:'iron',side:Math.PI});
    }
  }
  // Eight repeating nave bays, paired pointed openings and buttress pinnacles.
  for(const side of [-1,1]) {
    for(let i=0;i<8;i++) {
      const z=16.2+i*7.7;
      for(const [y,h] of [[4.1,7.8],[15.4,9.2]]) {
        arch(side>0?z:-z,y,-20.3,3.8,h,{side:-side*Math.PI/2});
        if(near) {const g=new THREE.BoxGeometry(0.15,h-3,0.22);g.translate(side>0?z:-z,y+(h-3)/2,-20.38);g.rotateY(-side*Math.PI/2);b.put(g,'concrete');}
      }
      box('stone',side*20.2,13.6,z+3.65,1,27.2,1.15);
      if(near)box('concrete',side*20.2,27.4,z+3.65,1.5,0.5,1.6);
      pinnacle(side*20.2,z+3.65,30.2,27.5);
    }
    for(const y of [3.2,13.5,26.2])box('concrete',side*20.03,y,45,0.35,0.3,66);
  }
  // Rear chapel/sacristy complex within the same OSM building footprint.
  box('stone',0,11.5,89.8,40,23,25.6);
  roof(0,76.7,22,27,23,6.8);
  for(const x of [-15.5,15.5])roof(x,77,9,26,23,1.9);
  const rearRing=[[-20.55,77],[-20.61,104.31],[8.99,109.42],[9.02,106.69],[10.23,106.77],[10.2,103.24],[20.46,103.28],[20.46,77]];
  const rearShape=new THREE.Shape(rearRing.map(([u,v])=>new THREE.Vector2(u,-v)));
  const rearWall=new THREE.ExtrudeGeometry(rearShape,{depth:20,bevelEnabled:false});rearWall.rotateX(-Math.PI/2);
  // The roof owns the horizontal top face; do not stack it on a stone cap.
  const rearIndex=[],normals=rearWall.attributes.normal;
  for(let i=0;i<normals.count;i+=3)if(normals.getY(i)<0.99)rearIndex.push(i,i+1,i+2);
  rearWall.setIndex(rearIndex);b.put(rearWall,'stone');
  const rearRoof=new THREE.ShapeGeometry(rearShape);rearRoof.rotateX(-Math.PI/2);rearRoof.translate(0,20,0);b.put(rearRoof,'roof');
  // The mapped back wall is oblique to the nave, rather than a circular apse.
  const slope=5.11/29.6, rearAngle=Math.atan(slope), c=Math.cos(rearAngle), s=Math.sin(rearAngle), plane=-(107.87+0.2)*c;
  for(const x of [-14,-7,0,7])arch((s*plane-x)/c,9,plane,2.8,8,{side:Math.PI-rearAngle});
  for(const side of [-1,1])for(const z of [82,90,98]) {
    arch(side>0?z:-z,6,-20.3,2.8,6,{side:-side*Math.PI/2});
    arch(side>0?z:-z,14,-20.3,2.8,6,{side:-side*Math.PI/2});
  }
  // The mapped small west-side porch is distinct from the adjacent seminary.
  box('stone',-22.6,3.1,39.8,5.1,6.2,5.4);roof(-22.6,37.1,5.4,5.4,6.2,1.8);
  if(near) {
    // Roof seams and three roof lights: broad rhythm without textures.
    for(let z=13;z<76;z+=3.9)for(const s of [-1,1])beam('museum',[0,32.57,z],[s*20.25,27.17,z],0.1);
    for(const z of [50,60,70]) {box('museum',0,32.4,z,3.2,0.5,3.2);roof(0,z-1.65,3.5,3.3,32.6,0.55);}
    for(let y=2.2;y<59;y+=1.5)for(const x of [-15.4,15.4])box('museum',x,y,0.59,8.7,0.035,0.06);
  }
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(NOTRE_DAME.rotation);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();o.material.color.set(NOTRE_DAME_PALETTES.light[o.material.name]);});
  return root;
}
