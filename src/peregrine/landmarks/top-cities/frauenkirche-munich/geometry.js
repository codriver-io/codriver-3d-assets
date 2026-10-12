import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { parts } from './frauenkirche-munich-parts.js';
export const ANGLE = 1.154*Math.PI/180;
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=parts(b,near);
  const ring=[[-37.2,-19.7],[35.6,-19.7],[47.6,-15.6],[51.5,-11.1],[55.4,-6.2],[55.4,7.2],[49.5,16.1],[36,19.7],[-37.2,19.7]];
  k.shell(ring,0,30,(i,a,c)=>{
    const len=Math.hypot(c[0]-a[0],c[1]-a[1]);
    if(i===8)return [];
    const count=len>60?9:len>12?2:1;
    return Array.from({length:count},(_,j)=>({x:len*(j+.5)/count,y:4,w:len>60?3.8:Math.min(3.8,len*.4),h:22,div:4}));
  });
  // Narrow carved stone eave; each band's underside is enclosed by the wall top.
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length];
    b.bar('trim',[a[0],29.5,a[1]],[c[0],29.5,c[1]],.65,.65);
  }
  // Main roof slopes, west gable and five-sided eastern hip.
  k.polygon([[-37.2,30,-19.7],[-37.2,60,0],[35.6,60,0],[35.6,30,-19.7]],'roof');
  k.polygon([[-37.2,30,19.7],[36,30,19.7],[35.6,60,0],[-37.2,60,0]],'roof');
  k.polygon([[-37.2,30,-19.7],[-37.2,30,19.7],[-37.2,60,0]],'brick');
  for(let i=1;i<7;i++)k.polygon([[... [ring[i][0],30,ring[i][1]]],[35.6,60,0],[ring[i+1][0],30,ring[i+1][1]]],'roof');
  // West inter-tower front and its lower entrance, large central Gothic light.
  k.wall([-53.5,4.45],[-53.5,-4.45],0,30,[{x:4.45,y:1,w:4.8,h:7,mat:'recess'},{x:4.45,y:11,w:5.0,h:17,div:4}]);
  k.polygon([[-53.5,30,4.45],[-53.5,30,-4.45],[-37.2,60,0]],'roof');
  k.polygon([[-53.5,30,-4.45],[-37.2,30,-4.45],[-37.2,60,0]],'roof');
  k.polygon([[-53.5,30,4.45],[-37.2,60,0],[-37.2,30,4.45]],'roof');
  for(const z of [-12.05,12.05]) {
    const dy=z>0?-.12:0,x=-45.35;
    // Battered square tiers and pale string courses, no exterior flying buttresses.
    for(let tier=0;tier<5;tier++){
      const y0=tier*12,y1=(tier+1)*12,w=16.1-tier*.26,d=15.1-tier*.20;
      const r=[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
      k.shell(r,y0,y1-.65,(i,a,c)=>{
        const len=Math.hypot(c[0]-a[0],c[1]-a[1]);
        return tier===0?[{x:len/2,y:3,w:2.2,h:5.3}]:tier===2?[{x:len/2,y:y0+3,w:1.8,h:4.3}]:[];
      });
      k.polygon(r.map(([xx,zz])=>[xx,y1,zz]).reverse(),'brick');
      // Ring course uses separate face strips rather than boxes overlapping tower faces.
      for(let i=0;i<4;i++){
        const a=r[i],c=r[(i+1)%4],w0=Math.hypot(c[0]-a[0],c[1]-a[1]);
        k.wall(a,c,y1-.65,y1,[],'trim');
        if(near)for(const f of [.10,.18,.82,.90]) {
          const px=a[0]+(c[0]-a[0])*f,pz=a[1]+(c[1]-a[1])*f;
          b.bar('brick',[px,y0+.7,pz],[px,y1-.8,pz],.28);
        }
      }
    }
    const oct=Array.from({length:8},(_,i)=>{const t=-Math.PI*3/4+i*Math.PI/4;return [x+Math.cos(t)*8.1,z+Math.sin(t)*8.1];});
    k.shell(oct,60,69.4,(i,a,c)=>[{x:Math.hypot(c[0]-a[0],c[1]-a[1])/2,y:64,w:3.8,h:3.8,round:true,mat:'clock'}]);
    k.shell(oct,70.1,84.1,(i,a,c)=>[{x:Math.hypot(c[0]-a[0],c[1]-a[1])/2,y:72,w:3.1,h:11.4,mat:'recess'}]);
    k.shell(oct,85,89.4+dy,(i,a,c)=>{const len=Math.hypot(c[0]-a[0],c[1]-a[1]);return [.27,.73].map(f=>({x:len*f,y:85.5,w:1.15,h:2.7,mat:'recess'}));});
    for(let i=0;i<8;i++){
      const a=oct[i],c=oct[(i+1)%8],mid=[(a[0]+c[0])/2,(a[1]+c[1])/2];
      k.wall(a,c,69.4,70.1,[],'trim'); k.wall(a,c,84.1,85.0,[],'trim'); k.wall(a,c,89.4+dy,90.7+dy,[],'trim');
      const len=Math.hypot(c[0]-a[0],c[1]-a[1]),nx=(c[1]-a[1])/len,nz=-(c[0]-a[0])/len;
      const clock=new THREE.CircleGeometry(1.25,near?24:12);clock.rotateY(Math.atan2(nx,nz));clock.translate(mid[0]-nx*.18,64,mid[1]-nz*.18);k.put(clock,'recess');
      if(near){b.bar('clock',[mid[0]-nx*.10,64,mid[1]-nz*.10],[mid[0]-nx*.10,65,mid[1]-nz*.10],.13);b.bar('clock',[mid[0]-nx*.10,64,mid[1]-nz*.10],[mid[0]+(c[0]-a[0])*.1-nx*.10,64.3,mid[1]+(c[1]-a[1])*.1-nz*.10],.13);}
    }
    k.dome(x,z,dy);
  }
  // Northern sacristy follows the mapped narrow L-shaped extension.
  const ann=[[14.0,-25.5],[36.8,-25.5],[51.6,-20.3],[56.7,-15.2],[51.4,-10.6],[47.6,-15.6],[35.6,-19.7],[14,-19.7]];
  k.shell(ann,0,15,(i,a,c)=>{const len=Math.hypot(c[0]-a[0],c[1]-a[1]);return len>8?[{x:len/2,y:3,w:2,h:7}]:[];});
  const sacristyRoof=new THREE.ShapeGeometry(new THREE.Shape(ann.map(([x,z])=>new THREE.Vector2(x,-z))));
  const ap=sacristyRoof.attributes.position;
  for(let i=0;i<ap.count;i++){const x=ap.getX(i),z=-ap.getY(i);ap.setXYZ(i,x,22-Math.max(0,-z-19.7)*7/5.8,z);}
  k.put(sacristyRoof,'roof');
  // Repeated tiny roof dormers: three rows, same arrangement in far as coarse prisms.
  for(const side of [-1,1])for(let row=0;row<3;row++)for(let j=0;j<9;j++){
    const x=-30+j*7.6,z=side*(5.5+row*5.6),y=60-Math.abs(z)*30/19.7;
    const w=near?.8:.65;
    b.box('roof',[x,y+.35,z],[w,.7,1]);
  }
  const root=b.finish();
  // Explicit baked local-to-east/up/south orientation; no host rotation required.
  root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
