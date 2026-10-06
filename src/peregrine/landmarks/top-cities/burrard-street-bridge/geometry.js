import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, PIERS, MAIN, HALF, DECK } from './burrard-street-bridge-profile.js';

/** Original metric geometry in the mapped station/lateral frame. No photographs or textures. */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = bridgeBuilder({ ...p, meshStep: near ? 6 : 16 }, detail);
  const L = p.BRIDGE_LENGTH, split = (MAIN[0] + MAIN[1]) / 2;
  const ck = s => near && s > split ? 1 : 0, h = s => p.deckHeight(s);
  const mat = m => near ? m : ({ mosaic: 'glass', paint: 'concrete', yellow: 'concrete' }[m] || m);
  const put = (g, m, s, lift = 1) => b.put(g, mat(m), ck(s), lift);
  function place(g, m, s, lift = 1) {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const q = p.bridgePoint(pos.getX(i), pos.getZ(i), pos.getY(i));
      pos.setXYZ(i, q.x, q.y, q.z);
    }
    g.computeVertexNormals(); put(g, m, s, lift);
  }
  const box = (m,s,d,y,along,across,tall,lift=1) => b.box(mat(m),s,d,y,along,across,tall,ck(s),lift);
  const member = (m,a,c,w,t=w,lift=1) => b.beam(mat(m),a,c,w,t,ck((a[0]+c[0])/2),lift);
  function strip(m,a,c,l,r,off=0,thick=0) {
    const cuts = near && a < split && c > split ? [a,split,c] : [a,c];
    for(let i=1;i<cuts.length;i++) b.strip(mat(m),cuts[i-1],cuts[i],l,r,off,thick,ck(cuts[i-1]));
  }
  function cylinder(m,s,d,y,r0,r1,tall,sides=near?8:5) {
    const g = new THREE.CylinderGeometry(r1,r0,tall,near?sides:Math.min(4,sides)); g.translate(s,y,d); place(g,m,s);
  }
  function extrude(shape,s,depth,m,lift=1) {
    // Shape x=-lateral, y=height. Rotation keeps outward winding intact.
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?8:4});
    g.rotateY(Math.PI/2);g.translate(s-depth/2,0,0);place(g,m,s,lift);
  }
  function rect(x0,y0,x1,y1) {
    const s=new THREE.Shape();s.moveTo(x0,y0);s.lineTo(x1,y0);s.lineTo(x1,y1);s.lineTo(x0,y1);s.closePath();return s;
  }
  // Fallback roadway: four vehicle lanes, protected 2.5 m cycleways, 2.6 m footways.
  strip('concrete',0,L,-HALF,HALF,-0.18,0.92);
  strip('asphalt',0,L,-6.8,6.8,0);
  for(const sign of [-1,1]) {
    const band=(a,c)=>sign>0?[a,c]:[-c,-a];
    strip('asphalt',0,L,...band(7.3,9.8),0.02);
    strip('concrete',0,L,...band(6.85,7.3),0.5,0.65);
    strip('concrete',0,L,...band(10.0,12.6),0.16,0.32);
    strip('stone',0,L,...band(12.85,13.35),0.35,0.5);
    strip('concrete',0,L,...band(12.78,13.42),1.23,0.16);
    for(let s=1;s<L-1;s+=near?1.7:12) box('stone',s,sign*13.08,h(s)+0.72,0.26,0.34,0.82);
    strip('steel',0,L,...band(13.07,13.13),2.65,0.07);
    for(let s=2;s<L-2;s+=near?3:16) member('steel',[s,sign*13.1,h(s)+1.23],[s,sign*13.1,h(s)+2.65],0.065);
    if(near) for(let s=2;s<L-2;s+=1.2) {
      const g=new THREE.PlaneGeometry(0.022,1.28);g.translate(s,h(s)+1.93,sign*13.11);
      const back=g.clone();back.rotateY(Math.PI);back.translate(2*s,0,2*sign*13.11);
      place(g,'steel',s);place(back,'steel',s);
    }
  }
  if(near) {
    strip('yellow',0,L,-0.18,-0.06,0.05);strip('yellow',0,L,0.06,0.18,0.05);
    for(let s=3;s<L-3;s+=12) for(const d of [-3.4,3.4]) strip('paint',s,Math.min(s+3,L),d-0.06,d+0.06,0.035);
    for(const d of [-6.55,6.55]) strip('paint',0,L,d-0.07,d+0.07,0.04);
  }
  // Marine pier feet remain planted; designated shafts stretch during road/terrain fitting.
  function pier(s,portal=false) {
    const top=h(s)-7.2,foot=1.1;
    box('stone',s,0,foot/2,portal?8:6.6,portal?29.3:25.5,foot,0);
    for(const d of [-10.5,10.5]) {
      const g=new THREE.CylinderGeometry(1,1.22,top-foot,4);
      g.rotateY(Math.PI/4);g.scale(portal?3.4:2.7,1,portal?3.6:2.8);g.translate(s,(top+foot)/2,d);
      place(g,'stone',s,y=>Math.max(0,Math.min(1,(y-foot)/(top-foot))));
    }
    box('concrete',s,0,top-0.2,portal?7.3:5.6,25.8,1.65);
    for(const d of [-10.3,10.3]) box('steel',s,d,top+0.9,2.3,1.8,1.0);
  }
  PIERS.forEach((s,i)=>pier(s,i===2||i===3));
  // Four Warren deck-truss spans; top chords meet the slab, open webs survive far LOD.
  for(const i of [0,1,3,4]) {
    const a=PIERS[i]+1.5,c=PIERS[i+1]-1.5,n=near?10:6;
    for(const d of [-10.3,10.3]) {
      const at=(s,off)=>[s,d,h(s)+off];
      member('steel',at(a,-1.25),at(c,-1.25),0.65,0.7);
      member('steel',at(a,-6.45),at(c,-6.45),0.65,0.7);
      for(let k=0;k<n;k++) {
        const s=a+(c-a)*k/n,t=a+(c-a)*(k+1)/n;
        member('steel',at(s,k%2?-1.25:-6.45),at(t,k%2?-6.45:-1.25),0.36);
        if(near) member('steel',at(s,-1.25),at(s,-6.45),0.28);
      }
    }
    if(near) for(let s=a;s<c;s+=6) {
      member('steel',[s,-10.5,h(s)-1.3],[s,10.5,h(s)-1.3],0.35,0.65);
      member('steel',[s,-10.3,h(s)-6.45],[Math.min(s+6,c),10.3,h(s)-6.45],0.2);
    }
  }
  // Main Parker / polygonal Pratt through-truss, between monumental portals.
  const N=12,chord=k=>DECK+0.9+12.2*Math.sin(Math.PI*k/N)**0.68;
  for(const d of [-10.2,10.2]) for(let k=0;k<N;k++) {
    const s=MAIN[0]+(MAIN[1]-MAIN[0])*k/N,t=MAIN[0]+(MAIN[1]-MAIN[0])*(k+1)/N;
    const lo=DECK-0.55,top=chord(k),next=chord(k+1);
    member('steel',[s,d,top],[t,d,next],0.62,0.7);
    member('steel',[s,d,lo],[t,d,lo],0.65,0.85);
    if(k>0) member('steel',[s,d,lo],[s,d,top],0.45,0.55);
    const A=k<N/2?[s,d,top]:[s,d,lo],B=k<N/2?[t,d,lo]:[t,d,next];
    member('steel',A,B,0.36,0.46);
    if(near) {
      for(const dd of [-0.26,0.26]) member('steel',[s,d+dd,top],[t,d+dd,next],0.12);
      box('steel',s,d,top,1.1,0.18,0.9);
      for(let r=1;r<=4;r++) {
        const u=r/5,rs=s+(t-s)*u,ry=top+(next-top)*u;
        cylinder('steel',rs,d+Math.sign(d)*0.4,ry+0.18,0.085,0.085,0.1,5);
      }
    }
  }
  for(let k=1;k<N;k++) {
    const s=MAIN[0]+(MAIN[1]-MAIN[0])*k/N,y=chord(k);
    member('steel',[s,-10.2,y],[s,10.2,y],0.37,0.5);
    if(near&&k<N-1) {
      const t=MAIN[0]+(MAIN[1]-MAIN[0])*(k+1)/N;
      member('steel',[s,-10.2,y],[t,10.2,chord(k+1)],0.2);
      member('steel',[s,10.2,y],[t,-10.2,chord(k+1)],0.2);
    }
    member('steel',[s,-10.2,y-2.4],[s,-7.9,y],0.28);
    member('steel',[s,10.2,y-2.4],[s,7.9,y],0.28);
  }
  // Art Deco portals: pedestrian arches, overhead galleries, tiled roofs, mosaic friezes,
  // bronze lantern cages and carved ship figureheads with stylized busts.
  for(const s of MAIN) {
    for(const sign of [-1,1]) {
      const a=sign>0?-15.2:9.0,c=sign>0?-9.0:15.2,shape=rect(a,0.9,c,DECK+14.8),cx=(a+c)/2;
      const hole=new THREE.Path();hole.moveTo(cx-1.4,DECK+0.13);hole.lineTo(cx-1.4,DECK+4.3);
      hole.absarc(cx,DECK+4.3,1.4,Math.PI,0,true);hole.lineTo(cx+1.4,DECK+0.13);hole.closePath();shape.holes.push(hole);
      extrude(shape,s,4.8,'stone',y=>Math.min(1,Math.max(0,y/DECK)));
      box('concrete',s,sign*12.1,DECK+13.7,5.3,6.7,0.46);
      box('stone',s,sign*12.1,DECK+15.1,4.5,4.0,0.7);
      for(const face of [-1,1]) {
        const ss=s+face*2.65,d=sign*12.1;
        box('stone',ss-face*0.05,d,DECK+11.6,0.42,2.0,4.4);
        cylinder('lamp',ss+face*0.25,d,DECK+11.5,0.51,0.51,2.25);
        cylinder('roof',ss+face*0.25,d,DECK+10.15,0.17,0.65,0.5);
        cylinder('roof',ss+face*0.25,d,DECK+12.9,0.65,0.17,0.5);
        if(near) {
          for(let k=0;k<8;k++) {
            const theta=k*Math.PI/4,x=ss+face*0.25+Math.cos(theta)*0.54,z=d+Math.sin(theta)*0.54;
            member('roof',[x,z,DECK+10.35],[x,z,DECK+12.65],0.055);
          }
          for(const yy of [10.75,11.4,12.05]) cylinder('roof',ss+face*0.25,d,DECK+yy,0.59,0.59,0.065);
        }
        const prow=new THREE.ConeGeometry(1.25,2.1,near?6:4);prow.rotateZ(Math.PI);prow.scale(0.7,1,0.8);prow.translate(ss,DECK+7.1,d);place(prow,'concrete',s);
        box('concrete',ss,d,DECK+7.95,0.75,1.1,0.38);
        cylinder('concrete',ss,d,DECK+8.48,0.38,0.27,0.86,6);
        const head=new THREE.SphereGeometry(0.24,near?8:5,near?5:3);head.scale(0.82,1.05,1);head.translate(ss,DECK+9.1,d);place(head,'concrete',s);
        if(near) for(let rib=-2;rib<=2;rib++) member('stone',[ss+face*0.76,d+rib*0.2,DECK+7.8],[ss+face*0.5,d,DECK+6.2],0.065);
      }
      cylinder('roof',s,sign*12.1,DECK+15.65,0.43,0.55,0.42);
      cylinder('lamp',s,sign*12.1,DECK+16.15,0.45,0.27,0.65);
    }
    box('stone',s,0,DECK+9.45,4.2,20.6,4.4);
    box('concrete',s,0,DECK+7.2,4.55,20.3,0.55);
    box('concrete',s,0,DECK+11.78,4.65,20.6,0.33);
    const roof=new THREE.Shape();roof.moveTo(s-2.65,DECK+12.0);roof.lineTo(s,DECK+13.15);roof.lineTo(s+2.65,DECK+12.0);roof.closePath();
    const rg=new THREE.ExtrudeGeometry(roof,{depth:20.7,bevelEnabled:false});rg.translate(0,0,-10.35);place(rg,'roof',s);
    if(near) for(let d=-10.2;d<10.25;d+=0.32) {
      member('roof',[s-2.64,d,DECK+12.06],[s,d,DECK+13.21],0.12);
      member('roof',[s,d,DECK+13.21],[s+2.64,d,DECK+12.06],0.12);
    }
    for(const face of [-1,1]) {
      const ss=s+face*2.22;
      for(const d of [-8,-5,-3,3,5,8]) {
        box('glass',ss,d,DECK+9.3,0.16,1.15,1.6);
        if(near) {
          box('roof',ss+face*0.1,d,DECK+9.3,0.10,0.07,1.66);
          box('roof',ss+face*0.1,d,DECK+9.3,0.10,1.2,0.07);
        }
      }
      box('mosaic',ss,0,DECK+10.82,0.15,19.0,0.95);
      if(near) for(let d=-9.2;d<9.3;d+=0.46) for(let row=0;row<2;row++)
        if((Math.round(d/0.46)+row)%2===0) box('glass',ss+face*0.13,d,DECK+10.59+row*0.45,0.06,0.4,0.4);
      for(const d of [-9,-6,-2,2,6,9]) {
        box('concrete',ss+face*0.14,d,DECK+10.0,0.45,0.35,3.0);
        if(near) box('concrete',ss+face*0.22,d,DECK+11.35,0.38,0.6,0.4);
      }
      const shield=new THREE.Shape();shield.moveTo(-0.8,DECK+10.4);shield.lineTo(0.8,DECK+10.4);shield.lineTo(0.7,DECK+8.95);shield.lineTo(0,DECK+8.6);shield.lineTo(-0.7,DECK+8.95);shield.closePath();
      extrude(shield,ss+face*0.25,0.18,'concrete');
      box('mosaic',ss+face*0.38,0,DECK+9.7,0.10,1.2,0.9);
      if(near) for(let d=-9;d<=9;d+=0.8) box('concrete',ss+face*0.07,d,DECK+7.85,0.3,0.36,0.32);
    }
  }
  // Approach trestles: repeated caps/legs and girders, no solid mass under the bridge.
  for(const [a,c] of [[12,PIERS[0]-6],[PIERS[5]+6,L-10]]) {
    for(const d of [-9.8,0,9.8]) strip('stone',a,c,d-0.45,d+0.45,-1.15,1.0);
    for(let s=a+17;s<c-8;s+=23) {
      const top=h(s)-1.8;if(top<1.0) continue;
      box('concrete',s,0,top,1.5,25.8,1.0);
      for(const d of [-10.4,0,10.4]) box('stone',s,d,(top+0.2)/2,1.4,1.5,top-0.2,y=>Math.max(0,Math.min(1,(y-0.2)/top)));
    }
  }
  for(let s=12;s<865;s+=near?22:66) for(const sign of [-1,1]) {
    if(MAIN.some(t=>Math.abs(t-s)<6)) continue;
    const d=sign*12.95,y=h(s);
    cylinder('roof',s,d,y+1.44,0.20,0.12,0.5);
    member('roof',[s,d,y+1.4],[s,d,y+4.8],0.11);
    cylinder('lamp',s,d,y+4.82,0.18,0.18,0.52,6);
    cylinder('roof',s,d,y+5.18,0.35,0.08,0.22,6);
  }
  return b.finish();
}
