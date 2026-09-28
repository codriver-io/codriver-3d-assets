import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { ORATOIRE, ORATOIRE_PALETTES, ORATOIRE_FOOTPRINT, oratoireLocal } from './oratoire-saint-joseph-config.js';
import site from './oratoire-saint-joseph-site.js';

// Authoring only: no import from the runtime layer. Building coordinates u/right,
// v/rear are rotated into metric east/up/south once, before GLB export.
export function createOratoire({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...ORATOIRE, palette: ORATOIRE_PALETTES.light }, detail), near = detail === 'near';
  const box = (m, u, y, v, w, h, d) => b.box(m, [u, y, v], [w, h, d], 0, 0, 0);
  const put = (g, m) => b.put(g, m, 0, 0);
  function cylinder(m, u, v, bottom, top, radius, topRadius = radius, segments = near ? 32 : 16) {
    const g = new THREE.CylinderGeometry(topRadius, radius, top - bottom, segments);
    g.translate(u, (bottom + top) / 2, v); put(g, m);
  }
  function slab(ring, bottom, top, material = 'stone') {
    const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, -v)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: top - bottom, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, bottom, 0); put(g, material);
  }
  function pediment(u, v, width, base, peak, depth, material = 'trim') {
    const shape = new THREE.Shape([new THREE.Vector2(-width / 2, base), new THREE.Vector2(width / 2, base), new THREE.Vector2(0, peak)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }); g.translate(u, 0, v); put(g, material);
  }
  function arch(u, v, base, width, height, angle = 0) {
    const shape = new THREE.Shape(), r = width / 2;
    shape.moveTo(-r, 0); shape.lineTo(r, 0); shape.lineTo(r, height - r);
    shape.absarc(0, height - r, r, 0, Math.PI, false); shape.lineTo(-r, 0);
    const g = new THREE.ShapeGeometry(shape, near ? 8 : 4); g.rotateY(angle); g.translate(u, base, v); put(g, 'glass');
  }
  function stairs(u, start, end, y0, y1, width, count) {
    const n = near ? count : Math.max(6, Math.ceil(count / 3));
    for (let i = 0; i < n; i++) {
      const h = y0 + (y1 - y0) * (i + 1) / n;
      // Every tread has solid support to the local flat ground, no floating sheet.
      box('trim', u, (h - .35) / 2, start + (end - start) * (i + .5) / n, width, h + .35, (end - start) / n + .015);
    }
    for (const side of [-1, 1]) b.bar('stone', [u + side * width / 2, y0 + .8, start], [u + side * width / 2, y1 + .8, end], .65, .65, 0, false, 0);
  }
  // Compression: 24 m basilica floor above renderer ground (published exterior
  // 97 m is retained). Grounded foundation follows the basilica, not its roads.
  // Trim the mapped rear-west foundation corner where Kingston's centreline
  // approaches within 2.4 m of the historic footprint. Keep 4+ m for pavement.
  slab(ORATOIRE_FOOTPRINT.filter(([, v]) => v > -65).map(([u,v]) => [v > 30 ? Math.max(-28,u) : u, v]), -.4, ORATOIRE.floor);
  const crypt = site.ways.find(w => w.id === 132499526).points.map(p => oratoireLocal(...p));
  slab(crypt, -.4, 15); slab(crypt, 15, 15.55, 'trim');
  for (const u of [-10, -3.5, 3, 9.5, 16]) arch(u, -115.55, 3, 3, 9, Math.PI);
  // Pedestrian axis only: lawns/retaining terraces taper back to the map at the
  // lower stair. No new terrain or automobile surface is registered.
  slab([[-19,-200],[25,-200],[29,-120],[-23,-120]], -.35, .2, 'earth');
  const runs = [[-199.5,-187.9,0,2,32],[-162.4,-154.1,2,4,34],[-144.6,-132.8,4,6.5,40],[-128.8,-120.2,6.5,8,16]];
  for (let i=0;i<runs.length;i++) {
    const [start,end,low,high,count] = runs[i]; stairs(3,start,end,low,high,9,count);
    const next = runs[i+1]?.[0] ?? -115.3;
    box('trim',3,(high-.35)/2,(end+next)/2,9,high+.35,next-end);
  }
  // Continuous supported embankments, with landings at the same levels as the
  // stairs. Their narrow lateral extent avoids the west parking access.
  const slope=[[-200,0],[-187.9,2],[-162.4,2],[-154.1,4],[-144.6,4],[-132.8,6.5],[-128.8,6.5],[-120.2,8],[-115.3,8]];
  for(const u of [-10,16]) {
    const points=[[-200,-.35],[-115.3,-.35],...slope.toReversed()];
    const shape=new THREE.Shape(points.map(p=>new THREE.Vector2(...p)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:15,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(u+7.5,0,0);put(g,'earth');
  }
  // Rounded crypt ends and twin side flights lead to the main upper stair.
  for (const u of [-24,29]) stairs(u,-121,-93,8,15.55,5,42);
  box('trim',2,7.6,-90,29,15.9,9);
  stairs(2,-88.9,-61.4,15.55,24,17,61);
  box('trim',1.5,23.6,-59.1,37,.8,5);
  // Basilica: lower side aisles, tall nave, transepts, and east apse.
  box('stone',1,34,-29,41,20,56);
  box('stone',0,40,-18,37,32,76);
  box('stone',0,40,0,65,32,31);
  box('stone',0,34,27,37,20,25);
  cylinder('stone',0,29,24,51,14,14,near?32:16);
  for (const [u,v,w,d,y] of [[1,-29,42,57,44],[0,-18,38,77,56],[0,0,66,32,56],[0,27,38,26,44]]) box('trim',u,y,v,w,1,d);
  // Copper pitched roofs and pediments, not a sphere atop a box.
  pediment(0,-55,38,56.5,63,75,'copper');
  const transept = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-15.5,56.5),new THREE.Vector2(15.5,56.5),new THREE.Vector2(0,63)]),{depth:65,bevelEnabled:false});
  transept.rotateY(Math.PI/2);transept.translate(-32.5,0,0);put(transept,'copper');
  // Recessed portico: four free-standing Corinthian columns keep real gaps.
  box('stone',0,40,-53.5,37,32,2);
  for (const u of [-9,-3,3,9]) {
    cylinder('trim',u,-59,24,25,1.05); cylinder('stone',u,-59,25,41,1,.78,near?16:8);
    cylinder('trim',u,-59,41,42,1.2); box('trim',u,42.25,-59,2.5,.5,2.5);
  }
  for(const u of [-16.5,16.5]) box('stone',u,40,-59,4,32,5);
  box('trim',0,43,-59,36,1.6,5.5);
  box('stone',0,50,-57.6,28,12,2);
  arch(0,-58.7,45,16,10,Math.PI);
  for(const u of [-5,0,5]) box('trim',u,49,-58.85,.6,8,.35);
  pediment(0,-61.8,38,56.5,63,3);
  pediment(0,-61.9,31,57.2,61.3,.08,'stone');
  for (const u of [-9,-3,3,9]) arch(u,-57.15,24,3.5,13,Math.PI);
  // Four crossing turrets, their copper pyramids remain in both LODs.
  for(const u of [-24,24])for(const v of [-22,22]) {
    box('stone',u,44,v,7.5,40,7.5);box('trim',u,63.5,v,8.2,1,8.2);
    cylinder('copper',u,v,64,75,5.3,0,4);
    if(near)for(const dv of [-1.6,1.6])box('glass',u+dv,59,v-3.8,1,3,.08);
  }
  // Octagonal drum with continuous cornices and repeated narrow arched lights.
  cylinder('stone',0,0,57,75,21,21,8);
  for(const y of [58,60,73.8,75]) cylinder('trim',0,0,y,y+.65,21.6,21.6,8);
  for(let face=0;face<8;face++) {
    const a=(face+.5)*Math.PI/4, nx=Math.sin(a), nz=Math.cos(a), radius=21*Math.cos(Math.PI/8);
    for(const offset of [-5,-1.65,1.65,5]) {
      const u=nx*(radius+.15)+Math.cos(a)*offset,v=nz*(radius+.15)-Math.sin(a)*offset;
      arch(u,v,62,2.15,9,a);
    }
  }
  // Tall copper dome, explicitly lofted profile, 39 m spring diameter.
  const domeProfile=[[19.5,75.6],[19.35,81],[18.5,87],[16.8,94],[14.1,100],[10.5,105],[6.8,108.1],[3,110]];
  put(new THREE.LatheGeometry(domeProfile.map(p=>new THREE.Vector2(...p)),near?64:24),'copper');
  for(let rib=0;rib<8;rib++)for(let j=0;j<domeProfile.length-1;j++) {
    const a=rib*Math.PI/4, point=([r,y])=>[Math.sin(a)*(r+.12),y,Math.cos(a)*(r+.12)];
    b.bar('rib',point(domeProfile[j]),point(domeProfile[j+1]),near?.34:.45,.4,0,false,0);
  }
  cylinder('trim',0,0,109.8,110.6,3.1,3.1,8);
  // Open lantern: posts and roof; no opaque box filling the window voids.
  for(let i=0;i<8;i++) {const a=i*Math.PI/4;box('stone',Math.sin(a)*2.2,112,Math.cos(a)*2.2,.45,3,.45);}
  cylinder('rib',0,0,113.5,114,2.8,2.8,8);cylinder('copper',0,0,114,118,2.8,0,8);
  box('trim',0,119.3,0,.45,3.4,.45);box('trim',0,120,0,2.1,.45,.45);
  // Window rhythms, string courses and buttresses readable from access roads.
  if(near) {
    for(const side of [-1,1])for(const v of [-46,-36,-26]) {
      arch(side*21.55,v,29,2,9,side*Math.PI/2);
      box('trim',side*20.7,34,v+4,1,20,1.2);
    }
    for(const side of [-1,1])for(const v of [-10,0,10])arch(side*32.6,v,30,2.5,16,side*Math.PI/2);
    for(const v of [-47,-37,-27])for(const u of [-18.6,18.6])box('glass',u,51,v,.06,4,1.6);
  }
  const model=b.finish();
  model.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(ORATOIRE.rotation);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();o.material.color.set(ORATOIRE_PALETTES.light[o.material.name]);});
  model.userData.elevation='Local flat-map ground 0; basilica floor +24 m; cross +121 m. Compressed hillside, not sea-level altitude.';
  return model;
}
