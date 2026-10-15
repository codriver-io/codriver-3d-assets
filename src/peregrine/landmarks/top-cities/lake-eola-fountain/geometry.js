import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Closed revolved profiles; seams partition the skin instead of overlaying it.
// Near-radial plan, hexagonal plinth vertex points east. No runtime rotation.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const n = near ? 48 : 24;
  function revolve(profile, material, segments = n, ribs = false) {
    const groups = new Map();
    const add = (mat, a, c, d) => {
      if (!groups.has(mat)) groups.set(mat, []);
      groups.get(mat).push(...a, ...c, ...d);
    };
    const angles = ribs ? Array.from({length: segments}, (_, i) => [i*2*Math.PI/segments,(i+0.91)*2*Math.PI/segments]).flat() : Array.from({length:segments},(_,i)=>i*2*Math.PI/segments);
    const at = ([r,y], a) => [r*Math.cos(a),y,r*Math.sin(a)];
    for(let j=0;j<angles.length;j++) {
      const a=angles[j],c=j===angles.length-1?2*Math.PI:angles[j+1];
      for(let k=0;k<profile.length-1;k++) {
        const mat=ribs && j%2===1?'frame':typeof material==='function'?material(k):material;
        const p=at(profile[k],a),q=at(profile[k],c),r=at(profile[k+1],a),s=at(profile[k+1],c);
        add(mat,p,r,q);add(mat,q,r,s);
      }
    }
    for(const [mat,positions] of groups) {
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(g,mat);
    }
  }
  function cylinder(mat,r,y0,y1,s=n) {
    const g=new THREE.CylinderGeometry(r,r,y1-y0,s);g.translate(0,(y0+y1)/2,0);b.put(g,mat);
  }
  cylinder('concrete',8.8,0,0.35,6);
  // Open undercroft with water visible between concrete support piers.
  for(let i=0;i<24;i++) {
    const a=i*Math.PI/12,r=7.6;
    b.box('concrete',[r*Math.cos(a),0.65,r*Math.sin(a)],[0.32,0.8,0.32],-a);
  }
  revolve([[0,0.95],[9.144,0.95],[9.144,1.15],[0,1.15]],'concrete');
  revolve([[0,1.15],[9,1.15],[8.8,1.6],[8.15,2.35],[7,2.95],[5.5,3.35],[3.15,3.55],[0,3.55]],'panel',near?32:24,true);
  // Integral light band divides the drum skin, with no background overlay.
  revolve([[0,3.55],[3.15,3.55],[3.15,3.8],[3.15,4.15],[3.15,4.55],[0,4.55]],k=>k===2?'glow':'frame');
  revolve([[0,4.55],[3.65,4.55],[3.4,4.85],[2.7,5.3],[1.5,5.55],[0,5.55]],'panel',near?24:16,true);
  revolve([[0,5.55],[1.5,5.55],[1.5,5.95],[0,5.95]],'frame');
  revolve([[0,5.95],[1.9,5.95],[1.6,6.2],[0.5,6.45],[0,6.45]],'light',near?24:16);
  // A representative low static spray phase preserves visibility of the dome.
  revolve([[0,6.45],[0.75,6.45],[0.7,9],[0.8,12],[0.95,13.8],[0.15,15],[0,15]],'water',near?12:8);
  const jets=near?24:12,steps=near?13:7;
  for(let i=0;i<jets;i++) {
    const a=i*2*Math.PI/jets;
    const pts=Array.from({length:steps},(_,k)=>{
      const t=k/(steps-1),r=8.75+2.05*t;
      return new THREE.Vector3(r*Math.cos(a),1.2+3.6*t-4.72*t*t,r*Math.sin(a));
    });
    const curve=new THREE.CatmullRomCurve3(pts);
    b.put(new THREE.TubeGeometry(curve,near?12:6,near?0.055:0.075,near?4:3,false),'water');
    for(const p of [pts[0],pts.at(-1)]) {
      const cap=new THREE.SphereGeometry(near?0.055:0.075,near?6:4,3);cap.translate(...p.toArray());b.put(cap,'water');
    }
  }
  return b.finish();
}
