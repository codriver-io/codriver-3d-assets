import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { uv, local, area, clip, inset, prism } from './gratte-ciel-villeurbanne-mesh.js';

// Original photographic elevation reconstruction, constrained by mapped plan rings.
export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const quad=(mat,pts)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,mat);};
  function windows(r,y0,y1,tower=false) {
    const sign=Math.sign(area(r));
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv);
      if(L<2.7)continue;
      const nx=sign*dv/L,nz=-sign*du/L;
      const point=(t,y,d)=>{const [x,z]=uv(a[0]+du*t+nx*d,a[1]+dv*t+nz*d);return [x,y,z];};
      const bays=Math.max(1,Math.floor(L/(near?3.1:4))),floors=[];
      for(let y=7.7;y<y1-.8;y+=3.05)if(y>y0+.5)floors.push(y);
      for(let f=0;f<floors.length;f+=near?1:2){const y=floors[f],wh=near?1.5:Math.min(4.1,y1-y-.4);
        for(let j=0;j<bays;j++){
          const t=(j+.5)/bays,half=Math.min(.67,L/bays*.25)/L;
          const mat=(j+f+i)%7===0?'light':'glass';
          quad(mat,[point(t-half,y,.085),point(t+half,y,.085),point(t+half,y+wh,.085),point(t-half,y+wh,.085)].reverse());
          if(near){
            quad('frame',[point(t-.035/L,y+.02,.13),point(t+.035/L,y+.02,.13),point(t+.035/L,y+wh,.13),point(t-.035/L,y+wh,.13)].reverse());
            quad('trim',[point(t-half-.02/L,y-.15,.16),point(t+half+.02/L,y-.15,.16),point(t+half+.02/L,y-.02,.16),point(t-half-.02/L,y-.02,.16)].reverse());
          }
        }
      }
      // Rear stair pylons have continuous glazing, rather than apartment windows.
      if((tower&&L>9&&L<22)||(!tower&&L>6&&L<13&&Math.abs(du)>Math.abs(dv)*2)) {
        const half=Math.min(2.5,L*.23)/L,lo=Math.max(6.35,y0+.22),hi=y1-.6;
        if(hi-lo>3){
          quad('glass',[point(.5-half,lo,.20),point(.5+half,lo,.20),point(.5+half,hi,.20),point(.5-half,hi,.20)].reverse());
          for(const t of (near?[.5-half,.5,.5+half]:[.5])) b.bar('metal',point(t,lo,.28),point(t,hi,.28),near?.13:.22,.16);
          for(let y=lo+1.4;y<hi;y+=near?1.5:9)b.bar('metal',point(.5-half,y,.29),point(.5+half,y,.29),near?.10:.18,.12);
        }
      }
    }
  }
  function volume(r,y0,y1,tower=false) {
    if(r.length<3||Math.abs(area(r))<1)return;
    b.put(prism(r,y0,y1),'stucco');windows(r,y0,y1,tower);
    const rr=inset(r,.28);if(near)b.put(prism(rr,y1+.035,y1+.085),'roof');
    if((near&&y1>20)||tower){
      for(let i=0;i<rr.length;i++){
        const a=rr[i],c=rr[(i+1)%rr.length];
        const [x,z]=uv(...a),[xx,zz]=uv(...c);
        // Low coping and open guard rail, kept inside the owned outline.
        const L=Math.hypot(xx-x,zz-z); if(L<.3)continue;
        if(near&&y1<64){
          quad('metal',[[x,y1+.62,z],[xx,y1+.62,zz],[xx,y1+.68,zz],[x,y1+.68,z]].reverse());
          const N=Math.ceil(L/4);for(let j=0;j<N;j++){const t=j/N,dt=.035/L;quad('metal',[[x+(xx-x)*(t-dt),y1+.05,z+(zz-z)*(t-dt)],[x+(xx-x)*(t+dt),y1+.05,z+(zz-z)*(t+dt)],[x+(xx-x)*(t+dt),y1+.68,z+(zz-z)*(t+dt)],[x+(xx-x)*(t-dt),y1+.68,z+(zz-z)*(t-dt)]].reverse());}
        }
      }
    }
  }
  const rings=FOOTPRINTS.map(r=>{const q=r.slice(0,-1).map(local);return area(q)<0?q.reverse():q;});
  for(let k=0;k<4;k++){
    const r=rings[k],side=k===0||k===2?-1:1;
    volume(r,0,6.2);volume(r,6.2,23.4);
    const front=Math.min(...r.map(p=>side*p[0]));
    for(const [lo,hi,offset] of [[23.4,26.5,2.8],[26.5,29.55,5.1],[29.55,32.6,7.4]])volume(clip(r,0,side*(front+offset),side<0),lo,hi);
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);if(L<8)continue;
      const s=Math.sign(area(r)),nx=s*(c[1]-a[1])/L,nz=-s*(c[0]-a[0])/L,N=Math.floor(L/4.8);
      for(let j=0;j<N;j++){const t=(j+.5)/N,u=a[0]+(c[0]-a[0])*t,v=a[1]+(c[1]-a[1])*t;
        const [x,z]=uv(u+nx*.10,v+nz*.10),ang=SPEC.gridAngle-Math.atan2(c[1]-a[1],c[0]-a[0]);
        if(near)b.box('glass',[x,2.5,z],[L/N-.7,3.3,.14],ang);
        else {const h=(L/N-.7)/2,tx=Math.cos(ang),tz=-Math.sin(ang);quad('glass',[[x-tx*h,.85,z-tz*h],[x+tx*h,.85,z+tz*h],[x+tx*h,4.15,z+tz*h],[x-tx*h,4.15,z-tz*h]].reverse());}
      }
    }
  }
  const towers=[rings[4],clip(rings[3],1,-140,true)];
  for(let i=0;i<towers.length;i++){
    const r=towers[i];
    const levels=i===0?[[0,44,0],[44,56,.7],[56,62.2,1.5],[62.2,64.3,2.3]]:[[32.6,44,0],[44,56,.7],[56,62.2,1.5],[62.2,64.3,2.3]];
    for(const [lo,hi,d] of levels)volume(d?inset(r,d):r,lo,hi,true);
    const crown=inset(r,2.55);
    for(let j=0;j<crown.length;j++){
      const a=crown[j],c=crown[(j+1)%crown.length],[x,z]=uv(...a),[xx,zz]=uv(...c);
      b.bar('metal',[x,64.94,z],[xx,64.94,zz],.12);
      const N=Math.max(1,Math.ceil(Math.hypot(xx-x,zz-z)/(near?.9:2.5)));
      for(let n=0;n<N;n++){const t=n/N;b.bar('metal',[x+(xx-x)*t,64.2,z+(zz-z)*t],[x+(xx-x)*t,64.94,z+(zz-z)*t],.08);}
    }
  }
  return b.finish();
}
