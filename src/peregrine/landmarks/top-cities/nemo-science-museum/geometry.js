import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
import { meshKit, clip, slab } from './nemo-science-museum-mesh.js';
// Geographic conversion is local and self-contained; real metres east/up/south.
export const mapped = p => [(p[0]-SPEC.origin[0])*111319.49079327358*Math.cos(SPEC.origin[1]*Math.PI/180),0,-(p[1]-SPEC.origin[1])*111319.49079327358];
export const OUTLINE = FOOTPRINTS[OSM_WAYS.indexOf(57856769)].slice(0,-1).map(mapped);
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export const roofHeight = z => z>=-30 ? 13.0+(40-z)*8.7/70 : 22.0+(-30-z)*8.57/42;
const crest=z=>roofHeight(z)+2;
const yAt=(p,y)=>[p[0],y,p[2]];
// The photographed shell has two separate rising wings, divided by a deep slot.
const SOUTH=clip(OUTLINE,2,-26,false), NORTH=clip(OUTLINE,2,-31);
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=meshKit(b);
  const face=k.face;
  function hull(ring,north) {
    let station=0;
    for(let j=0;j<ring.length;j++) {
      const a=ring[j],c=ring[(j+1)%ring.length],dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz);
      if(L<0.01)continue;
      // Ring has positive signed x/z area; outward is its right side.
      const n=[dz/L,0,-dx/L];
      const base=p=>north?[p[0]*0.76,4.2,-31+(p[2]+31)*0.83]:[p[0]*0.87,0,p[2]];
      const point=(u,v,inset=0)=>{
        const p=lerp(a,c,u/L),q=lerp(base(p),yAt(p,crest(p[2])),v);
        return q.map((x,i)=>x-n[i]*inset);
      };
      const cols=[0,L],pitch=near?0.9:4.5;
      for(let s=Math.ceil(station/pitch)*pitch;s<station+L;s+=pitch)cols.push(s-station);
      const windows=[];
      // Sparse clusters of square ventilation/window bays; never continuous bands.
      if(Math.abs(n[0])>0.65)for(let s=10;s<230;s+=15.5) {
        const w=2.5,lo=Math.max(0,s-station),hi=Math.min(L,s+w-station);
        if(hi>lo){windows.push([lo,hi]);cols.push(lo,hi);}
      }
      cols.sort((u,v)=>u-v);
      const rows=[0,0.24,0.31,0.53,0.60,0.77,0.84,1];
      rows.sort((u,v)=>u-v);
      for(let u=0;u<cols.length-1;u++)for(let v=0;v<rows.length-1;v++) {
        const l=cols[u],r=cols[u+1],lo=rows[v],hi=rows[v+1];if(r-l<1e-7||hi-lo<1e-7)continue;
        const mid=(lo+hi)/2,win=windows.some(([x,y])=>(l+r)/2>x&&(l+r)/2<y)&&((mid>0.24&&mid<0.31)||(mid>0.53&&mid<0.60)||(mid>0.77&&mid<0.84));
        const vs=[point(l,lo),point(r,lo),point(r,hi),point(l,hi)];
        if(win) {
          const inset=vs.map(p=>p.map((x,i)=>x-n[i]*0.22));face('glass',inset,n);
          for(let t=0;t<4;t++) {const next=(t+1)%4;const e=vs[next].map((x,i)=>x-vs[t][i]),d=inset[t].map((x,i)=>x-vs[t][i]);face('copper',[vs[t],vs[next],inset[next],inset[t]],[e[1]*d[2]-e[2]*d[1],e[2]*d[0]-e[0]*d[2],e[0]*d[1]-e[1]*d[0]]);}
        } else {
          const mat=near&&((Math.floor((station+l)/0.9)*17+v*11)%9===0)?'patina':'copper';
          // Narrow dark seams occupy their own strips on the panel plane: no overlay.
          if(near&&r-l>0.12) {
            const h=0.018;face('joints',[point(l,lo),point(l+h,lo),point(l+h,hi),point(l,hi)],n);
            face(mat,[point(l+h,lo),point(r,lo),point(r,hi),point(l+h,hi)],n);
          } else face(mat,vs,n);
        }
      }
      station+=L;
      if(north) {const aa=base(a),cc=base(c);face('glass',[yAt(aa,0),yAt(cc,0),cc,aa],n);}
    }
    // Roof terrace: cross-sectional bands are separate physical treads, with
    // planted side strips. No continuous ramp lies coplanar beneath the stairs.
    const min=Math.min(...ring.map(p=>p[2])),max=Math.max(...ring.map(p=>p[2]));
    const count=north?(near?24:12):(near?52:26),cuts=Array.from({length:count+1},(_,i)=>min+(max-min)*i/count);
    for(let i=0;i<count;i++) {
      const z0=cuts[i],z1=cuts[i+1],h=roofHeight(z0),poly=slab(ring,2,z0,z1);
      const bands=[[-100,-13,'planting'],[-13,11,'terrace'],[11,100,'planting']];
      if(north&&z0<-39&&z0>-64) {
        bands.splice(1,1,[-13,-11,'planting'],[-11,8,'glass'],[8,11,'planting']);
      }
      for(const [lo,hi,mat] of bands)face(mat,slab(poly,0,lo,hi).map(p=>yAt(p,h)),[0,1,0]);
      if(i<count-1) {
        const cut=slab(ring,2,z1-0.00001,z1+0.00001),xs=cut.map(p=>p[0]);
        if(xs.length) {const l=Math.min(...xs),r=Math.max(...xs),h2=roofHeight(cuts[i+1]);face('terrace',[[l,h,z1],[r,h,z1],[r,h2,z1],[l,h2,z1]],[0,0,1]);}
      }
    }
    // Copper lip is closed inboard and on top, above the public roof.
    for(let j=0;j<ring.length;j++) {
      const a=ring[j],c=ring[(j+1)%ring.length],dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz);if(L<0.01)continue;
      const n=[dz/L,0,-dx/L],inset=p=>[p[0]-n[0]*0.5,p[1],p[2]-n[2]*0.5];
      const aa=yAt(a,crest(a[2])),cc=yAt(c,crest(c[2]));
      face('copper',[aa,cc,inset(cc),inset(aa)],[0,1,0]);
      face('copper',[inset(yAt(a,roofHeight(a[2]))),inset(yAt(c,roofHeight(c[2]))),inset(cc),inset(aa)],n.map(v=>-v));
    }
  }
  hull(SOUTH,false);hull(NORTH,true);
  // Recessed glazed cross-link in the full-depth shell slot.
  b.box('glass',[-3,10,-28.5],[30,20,4.9]);
  // Conservatory at the head of the public stairs, white sloping canopy.
  const pavilion=[[-15,22.1,-18],[10,22.1,-18],[10,25.7,-32],[-15,25.7,-32]];
  face('roof',pavilion,[0,1,0.25]);
  face('glass',[[-15,19.6,-18],[10,19.6,-18],pavilion[1],pavilion[0]],[0,0,1]);
  face('glass',[pavilion[0],pavilion[3],[-15,21.4,-32],[-15,19.6,-18]],[-1,0,0]);
  face('glass',[pavilion[1],pavilion[2],[10,21.4,-32],[10,19.6,-18]],[1,0,0]);
  face('glass',[pavilion[3],pavilion[2],[10,21.4,-32],[-15,21.4,-32]],[0,0,-1]);
  // Brick access/services tower at the southwest stair head, within OSM part.
  const chimney=FOOTPRINTS[OSM_WAYS.indexOf(1390692769)].slice(0,-1).map(mapped);
  face('brick',chimney.map(p=>yAt(p,22.4)),[0,1,0]);
  for(let i=0;i<chimney.length;i++){const a=chimney[i],c=chimney[(i+1)%chimney.length];face('brick',[a,c,yAt(c,22.4),yAt(a,22.4)],[c[2]-a[2],0,a[0]-c[0]]);}
  k.finish();return b.finish();
}
