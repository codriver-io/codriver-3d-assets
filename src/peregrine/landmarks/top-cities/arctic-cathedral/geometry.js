import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BAYS, xyz, ROT, prism, quad } from './arctic-cathedral-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, mat) => { g.rotateY(ROT); b.put(g, mat); };
  const box = (mat,x,y,z,w,h,d) => { const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);put(g,mat); };
  const bar = (mat,a,c,w,d=w) => b.bar(mat,xyz(...a),xyz(...c),w,d);
  for (const [i,bay] of BAYS.entries()) {
    const {s0,s1,w0,w1,h0,h1}=bay, lean=i===0?-0.6:0;
    const profile=(w,h)=>[[0.6-w,0],[0.6,h],[0.6+w,0],[0.6+w-0.48,0],[0.6,h-0.8],[0.6-w+0.48,0]];
    put(prism(profile(w0,h0),profile(w1,h1),s0,s1,lean),'shell');
    if (near) for (const sign of [-1,1]) {
      const p=(t,s,offset=0.18)=>{const k=(s-s0)/(s1-s0),w=w0+(w1-w0)*k,h=h0+(h1-h0)*k;return [0.6+sign*w*(1-t),h*t+offset,s+lean*t*(1-k)];};
      // Broad sheet courses, not a dense rectilinear grid.
      for(const t of [0.25,0.5,0.75])put(quad(p(t-0.0005,s0+0.2),p(t+0.0005,s0+0.2),p(t+0.0005,s1-0.2),p(t-0.0005,s1-0.2)),'seam');
    }
    if(i<BAYS.length-1){
      const next=BAYS[i+1],large=Math.max(h1,next.h0),small=Math.min(h1,next.h0);
      const wl=h1>=next.h0?w1:next.w0,ws=h1>=next.h0?next.w0:w1,s=(s1+next.s0)/2;
      for(const sign of [-1,1]){
        const ring=[[0.6+sign*(wl-0.55),0.2],[0.6,large-0.82],[0.6,small-0.8],[0.6+sign*(ws-0.5),0.2]];
        put(prism(ring,ring,s-0.11,s+0.11),'glass');
        bar('frame',[0.6+sign*(ws-0.5),0.2,s-0.18],[0.6,small-0.85,s-0.18],near?0.065:0.12);
        if(near)for(let t=0.14;t<0.95;t+=0.13)bar('frame',[0.6+sign*(ws-0.5)*(1-t),(small-0.85)*t,s-0.18],[0.6+sign*(wl-0.55)*(1-t),(large-0.82)*t,s-0.18],0.055);
      }
    }
  }
  // West glazing, structural cross and the two equivalent entrance doors.
  const west=[[-12.1,0.18],[0.6,33.5],[13.3,0.18]];
  put(prism(west,west,0.95,1.08),'glass');
  for(let x=-11.6;x<=12.8;x+=near?0.78:2.44){const top=33.5*(1-Math.abs(x-0.6)/12.7);if(top>0.6)bar('frame',[x,0.18,0.86],[x,top,0.86],near?0.055:0.1);}
  for(let y=3.8;y<31;y+=near?3.8:7.6){const w=12.7*(1-y/33.5);bar('frame',[0.6-w,y,0.86],[0.6+w,y,0.86],near?0.06:0.12);}
  box('shell',0.6,16.3,0.04,0.48,32.6,0.8);
  box('shell',0.6,25.7,0.04,8,0.48,0.8);
  box('shell',0.6,3.45,0.46,22,0.35,0.48);
  for(const x of [-8.8,9.9]){
    box('frame',x,1.45,0.72,2.7,2.6,0.12);
    box('glass',x,1.45,0.58,2.5,2.4,0.08);
    bar('shell',[x,0.25,0.5],[x,2.62,0.5],0.065);
    if(near)for(const dx of [-0.15,0.15])bar('edge',[x+dx,1.05,0.46],[x+dx,1.58,0.46],0.03);
  }
  // Original faceted colour field; not a traced reproduction of the mosaic artwork.
  const mosaicS=48,top=23.6,half=8.05,rows=near?34:10;
  const sample=(r,c)=>[0.6+half*(2*c-r)/rows,top*(1-r/rows)];
  const facet=(points,r,c)=>{
    const cx=points.reduce((a,p)=>a+p[0],0)/3,cy=points.reduce((a,p)=>a+p[1],0)/3;
    const inset=points.map(([x,y])=>[cx+(x-cx)*0.93,cy+(y-cy)*0.93]);
    const beam=Math.abs((cx-0.6)-(23.6-cy)*0.19)<(near?0.7:1.2)||Math.abs((cx-0.6)+(23.6-cy)*0.23)<0.5;
    const mat=beam||(r*17+c*11)%23===0?'glow':(r*7+c*3)%5<2?'light':'blue';
    put(prism(inset,inset,mosaicS,mosaicS+0.13),mat);
  };
  for(let r=0;r<rows;r++)for(let c=0;c<=r;c++){
    facet([sample(r,c),sample(r+1,c),sample(r+1,c+1)],r,c);
    if(c<r)facet([sample(r,c),sample(r+1,c+1),sample(r,c+1)],r,c+61);
  }
  const backing=[[0.6-half,0],[0.6,top],[0.6+half,0]];
  put(prism(backing,backing,mosaicS-0.1,mosaicS-0.055),'frame');
  for(const sign of [-1,1])bar('shell',[0.6+sign*half,0.1,mosaicS+0.18],[0.6,top,mosaicS+0.18],0.16);
  // Mapped low sacristy protrudes from the mosaic end.
  box('shell',0.6,2.5,50.75,10.15,5,4.1);
  box(near?'edge':'shell',0.6,5.05,50.75,10.35,0.1,4.15);
  for(const x of [-3.6,-1.5,2.7,4.8])box('glass',x,2.3,52.86,1.3,1.4,0.07);
  return b.finish();
}
