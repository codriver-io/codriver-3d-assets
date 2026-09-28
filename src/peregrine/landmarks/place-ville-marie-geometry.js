import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { PLACE_VILLE_MARIE as PVM, PVM_RING_SITE, PVM_PALETTES, pvmSite } from './place-ville-marie-config.js';

// Authoring only: imported by the exporter and local inspector, never the map.
export function createPlaceVilleMarie({ detail = 'near' } = {}) {
  const b = assetBuilder(PVM, detail), near = detail === 'near';
  const box = (mat, u,y,v, w,h,d) => b.box(mat,pvmSite(u,y,v),[w,h,d],-PVM.siteAngle);
  const put = (g,mat) => { g.rotateY(-PVM.siteAngle); b.put(g,mat); };
  const prism = (outline,base,height,mat) => {
    const shape = new THREE.Shape(outline.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g = new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2); g.translate(0,base,0); put(g,mat);
  };
  const cross = (half,wing) => [[-wing,-half],[wing,-half],[wing,-wing],[half,-wing],[half,wing],[wing,wing],[wing,half],[-wing,half],[-wing,wing],[-half,wing],[-half,-wing],[-wing,-wing]];
  // Grounded banking-hall base. Four low quadrants retain the glazed recesses
  // between wings; the tower is deliberately not the square OSM base extrusion.
  box('stone',0,0.35,0,90,0.7,90);
  prism(cross(42.6,11.5),0.7,15.8,'glass');
  for (const u of [-28.3,28.3]) for (const v of [-28.3,28.3]) {
    box('glass',u,3.1,v,30,4.8,30);
    box('concrete',u,9.6,v,33.2,8.2,33.2);
    box('roof',u,13.85,v,33.5,0.3,33.5);
    // Repeated truncated skylight pyramids are characteristic of the halls.
    for (const du of [-10,0,10]) for (const dv of [-10,0,10]) {
      const g = new THREE.CylinderGeometry(2.4,4.6,1.6,4,1,false); g.rotateY(Math.PI/4); g.translate(u+du,14.8,v+dv); put(g,'concrete');
      box('glass',u+du,15.64,v+dv,3.35,0.08,3.35);
    }
    if (near) for (let offset=-12;offset<=12;offset+=6) {
      box('lattice',u+offset,3.1,v+14.9,0.22,4.8,0.26);
      box('lattice',u+14.9,3.1,v+offset,0.26,4.8,0.22);
    }
  }
  // Full-height cruciform, not four disconnected slabs. Crown set back above
  // the wing roofs, as in PCF's elevation. Vertical dimensions are estimates
  // within the sourced 188.1 m envelope.
  const outline = cross(43,12.5), start=16, top=181.7;
  prism(outline,23.5,150.7,'glass');
  prism(outline,start,7.5,'museum');
  prism(outline,174.2,7.5,'museum');
  prism(outline,181.7,0.6,'lattice');
  box('roof',0,184,0,21,3.4,21);
  box('glass',0,186.5,0,17.5,1.6,17.5);
  box('lattice',0,187.75,0,23,0.7,23);
  // Facade: forty stacked office bands and thin aluminium mullions. All
  // faces are batched by material. Far LOD retains every floor band as quads.
  const quad = (a,c,d,e,mat) => {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([a,c,d,e].flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,mat);
  };
  for(let edge=0;edge<outline.length;edge++){
    const a=outline[edge],c=outline[(edge+1)%outline.length],du=c[0]-a[0],dv=c[1]-a[1],length=Math.hypot(du,dv),nx=dv/length,nz=-du/length;
    const pt=(t,y,offset=0.12)=>[a[0]+du*t+nx*offset,y,a[1]+dv*t+nz*offset];
    for(let floor=0;floor<=40;floor++){
      const y=23.5+floor*3.7675;
      quad(pt(0,y),pt(0,y+0.92),pt(1,y+0.92),pt(1,y),'museum');
    }
    const bays=Math.round(length/(near?1.78:3.56));
    for(let i=0;i<=bays;i++){
      const t=i/bays,u=a[0]+du*t+nx*0.13,v=a[1]+dv*t+nz*0.13;
      box('lattice',u,(start+top)/2,v,du?0.17:0.36,top-start,du?0.36:0.17);
    }
    // Deterministic restrained warm windows, no lights/transparency.
    if(near) for(let floor=2;floor<39;floor++)for(let bay=0;bay<bays;bay++)if((floor*17+bay*11+edge*7)%29===0){
      const y=24.6+floor*3.7675;
      quad(pt((bay+0.12)/bays,y,0.16),pt((bay+0.12)/bays,y+2.55,0.16),pt((bay+0.88)/bays,y+2.55,0.16),pt((bay+0.88)/bays,y,0.16),'iron');
    }
  }
  // Rooftop gyrophare: compact mast and four emissive apertures. No beams,
  // spotlights, bloom, animation loop or extra effects pass.
  box('rail',0,189,0,1.2,1.8,1.2);
  box('rail',0,190.2,0,3.4,0.9,3.4);
  box('steel',0,190.2,0,3.5,0.35,3.5);
  box('roof',0,190.9,0,4,0.4,4);
  // A narrow, owned plaza connection from the banking hall toward the ring.
  // Stays clear of 2/3, 4 and 5 PVM, which are left to the map provider.
  box('stone',-53,0.9,33,14,1.8,73);
  box('stone',-59.5,0.9,76,27,1.8,23);
  box('concrete',-53,1.82,33,14,0.08,73);
  box('concrete',-59.5,1.82,76,27,0.08,23);
  if(near) {
    for(let u=-59;u<-46;u+=6)box('stone',u,1.87,33,0.13,0.015,72);
    for(let v=0;v<69;v+=6)box('stone',-53,1.87,v,13,0.015,0.13);
    for(const v of [8,32,56])box('concrete',-58,2.15,v,1.5,0.55,5);
  }
  const [ru,rv]=PVM_RING_SITE;
  // Cathcart stairs rise from grade to the esplanade, with solid underfill.
  for(let i=0;i<9;i++)box('concrete',ru-9+i*1.5,(i+1)*0.1,rv,1.5,(i+1)*0.2,23);
  const tube=PVM.ring.tubeRadius,r=PVM.ring.diameter/2-tube;
  const ring = new THREE.TorusGeometry(r,tube,near?10:6,near?128:64);
  // Torus starts in XY. Its horizontal axis follows the mapped gap (site v)
  // and its plane normal follows McGill College (site u).
  ring.rotateY(Math.PI/2);ring.translate(ru,PVM.ring.centerHeight,rv);put(ring,'paint');
  for(const face of [-1,1]) {
    const light = new THREE.TorusGeometry(r,0.06,4,near?128:64);
    light.rotateY(Math.PI/2);light.translate(ru+face*0.45,PVM.ring.centerHeight,rv);put(light,'iron');
  }
  // Short lateral anchors stop at the actual 30 m gap; no invented towers.
  for(const side of [-1,1])box('rail',ru,18.5,rv+side*15.15,0.28,0.32,0.5);
  const root=b.finish();
  root.userData.elevationDatum=PVM.datum;
  root.traverse(o=>{if(!o.isMesh)return;
    o.geometry.deleteAttribute('bridgeLift');
    o.material.color.set(PVM_PALETTES.light[o.material.name]);
    if(['paint','lattice'].includes(o.material.name)){o.material.metalness=0.45;o.material.roughness=0.5;}
    if(['iron','steel'].includes(o.material.name)){o.material.emissive.set(PVM_PALETTES.light[o.material.name]);o.material.emissiveIntensity=o.material.name==='steel'?0.45:0.12;}
  });
  return root;
}
