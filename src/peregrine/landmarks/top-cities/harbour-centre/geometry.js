import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RINGS } from './harbour-centre-map.js';
import { world, box, prism, band, surface, windowWall } from './harbour-centre-mesh.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),n=near?96:32;
  // Low retail hall, office podium, and the mapped stepped Spencer building.
  prism(b,'concrete',RINGS[1371268997],0,12.7);
  prism(b,'concrete',RINGS[139571552],12.65,26);
  prism(b,'heritage',RINGS[363385359],12.6,43);
  prism(b,'heritage',RINGS[363385360],12.6,47);
  // Exterior windows along mapped podium edges (ignore short wall jogs).
  for(const [id,top,mat,rows] of [[139571552,25,'concrete',4],[143682595,42,'heritage',7]]) {
    const source=RINGS[id];
    const area=source.reduce((s,p,i)=>{const q=source[(i+1)%source.length];return s+p[0]*q[1]-q[0]*p[1];},0);
    const ring=area>0?source:[...source].reverse();
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      if(len<7)continue;
      // Normalize mapped ring winding so all inset windows face the street.
      windowWall(b,{a,c,lo:3,hi:top,cols:Math.max(1,Math.round(len/(mat==='heritage'?6.5:4))),rows,near:false,material:mat,border:mat==='heritage'?.9:.55,verticalBorder:mat==='heritage'?.75:.8});
      if(near&&mat==='heritage') {
        const du=(c[0]-a[0])/len,dv=(c[1]-a[1])/len;
        for(let s=0;s<len;s+=len/Math.max(1,Math.round(len/6.5))) {
          const p=[a[0]+du*s+dv*.25,25,a[1]+dv*s-du*.25];
          box(b,'heritage',p,[.85,38,.85]);
        }
      }
    }
  }
  // Spencer's parapet, inset clerestory, and small roof housings.
  box(b,'heritage',[16,46.65,54.8],[62,.7,.5]);
  box(b,'shadow',[22,47.55,46],[12,1.1,6]);
  if(near)for(let u=-13;u<49;u+=4.6)box(b,'sill',[u,47.15,54.7],[.7,1.1,.65]);
  // Original office tower: 28 rows, ten bays on all four faces, precast recessed reveals.
  const tower=[[-4.9,-17.85],[30.25,-17.85],[30.25,17.3],[-4.9,17.3]];
  if(!near)prism(b,'concrete',tower,13,116);
  else {
    prism(b,'concrete',tower,13,13.3);
    prism(b,'concrete',tower,114.5,116);
  }
  for(let i=0;i<4;i++)windowWall(b,{a:tower[i],c:tower[(i+1)%4],lo:13.3,hi:114.5,cols:10,rows:28,near,border:.55,verticalBorder:.82});
  // Lookout concrete core projects over the SW office face and rises into the bowl.
  box(b,'concrete',[0,71,0],[9.5,142,9.1]);
  // Twin dark exterior glass tracks, a central spine and their tall side cheeks.
  for(const v of [-1.85,1.85])box(b,'glass',[-4.91,66,v],[.45,128,2.65]);
  for(const v of [-3.48,0,3.48])box(b,'sill',[-5.26,65.8,v],[.72,129.3,.48]);
  for(const v of [-1.85,1.85]) {
    const y=v<0?81:105;
    box(b,'glass',[-6.05,y,v],[2.1,3.7,2.6]);
    box(b,'metal',[-6.06,y-1.82,v],[2.15,.24,2.65]);
    box(b,'metal',[-6.06,y+1.82,v],[2.15,.24,2.65]);
    if(near)for(const z of [-1.2,0,1.2])box(b,'metal',[-7.13,y,v+z],[.14,3.6,.12]);
  }
  if(near)for(let y=5;y<128;y+=3.6)for(const v of [-1.85,1.85])box(b,'metal',[-5.19,y,v],[.18,.12,2.55]);
  // The flying saucer: lower bowl, two splayed glazing levels, thick pale eaves.
  band(b,'concrete',[[0,128],[5.6,128],[8.3,130.3],[12.6,132.2],[14.7,133.3]],n);
  band(b,'sill',[[14.7,133.3],[15.9,133.7],[16.2,134.2]],n);
  band(b,'glass',[[16.2,134.2],[17.4,138.2]],n);
  band(b,'sill',[[17.4,138.2],[17.85,138.4],[17.85,139.6],[17.1,139.9]],n);
  band(b,'glass',[[17.1,139.9],[18.4,145.0]],n);
  band(b,'sill',[[18.4,145.0],[19.25,145.1],[19.25,147.2],[18.9,148]],n);
  band(b,'concrete',[[18.9,148],[15.8,149.2],[7.6,150.2],[5.2,150.2]],n);
  band(b,'concrete',[[5.2,150.2],[5.2,153.7],[0,153.7]],n);
  // Thin mullions follow the actual sloping glass; underside radial ribs meet the core.
  const count=near?96:24;
  for(let i=0;i<count;i++) {
    const a=i*2*Math.PI/count,cs=Math.cos(a),sn=Math.sin(a);
    for(const [r0,y0,r1,y1] of [[16.24,134.2,17.44,138.2],[17.14,139.9,18.44,145]])b.bar('metal',world([r0*cs,y0,r0*sn]),world([r1*cs,y1,r1*sn]),near?.12:.18);
  }
  if(near)for(let i=0;i<24;i++) {
    const a=i*Math.PI/12,cs=Math.cos(a),sn=Math.sin(a);
    b.bar('shadow',world([5.2*cs,128,5.2*sn]),world([14.6*cs,133.2,14.6*sn]),.2,.28);
  }
  // Broadcast mast with three characteristic collars / dish aerials and a small Canadian flag.
  band(b,'metal',[[.5,153.65],[.5,158],[.25,171],[.14,177.1],[0,177.1]],near?16:8);
  for(const y of [160,167.5,173.5]) {
    band(b,'sill',[[.26,y-.25],[1.12,y-.25],[1.12,y+.25],[.26,y+.25]],near?32:12);
    if(near)for(const u of [-1,1])box(b,'metal',[u, y+.7,0],[.15,1.6,.15]);
  }
  surface(b,'red',[[.15,175.2,0],[2.9,175.1,.18],[2.9,176.6,.18],[.15,176.7,0]],[0,0,1]);
  surface(b,'red',[[.15,175.2,-.06],[2.9,175.1,.12],[2.9,176.6,.12],[.15,176.7,-.06]],[0,0,-1]);
  // Simple geometric crest on the lift head, plus near podium roof clerestory strips.
  box(b,'glow',[-5.67,119.1,0],[.18,3.8,2.9]);
  if(near)for(let u=35;u<49;u+=1.6)box(b,'glass',[u,26.7,-5],[.8,1.5,23]);
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return model;
}
