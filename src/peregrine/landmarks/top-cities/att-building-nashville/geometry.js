import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { Surface, localRing, cap, splitAtRidge, xyz } from './att-building-nashville-parts.js';

function positive(ring) {
  const area = ring.reduce((s,a,i) => { const c=ring[(i+1)%ring.length];return s+a[0]*c[1]-c[0]*a[1]; },0);
  return area>0 ? ring : ring.slice().reverse();
}
function clip(ring, axis, bound, sign) {
  const out=[];
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],c=ring[(i+1)%ring.length],inside=(a[axis]-bound)*sign>=-1e-8;
    if(inside)out.push(a);
    if(inside!==((c[axis]-bound)*sign>=-1e-8)) {
      const t=(bound-a[axis])/(c[axis]-a[axis]);out.push([a[0]+t*(c[0]-a[0]),a[1]+t*(c[1]-a[1])]);
    }
  }
  return out;
}

export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const m=Object.fromEntries(Object.keys(PALETTES.light).map(k=>[k,new Surface()]));
  const tower=positive(localRing(FOOTPRINTS[1])), base=positive(localRing(FOOTPRINTS[0]));
  // The facade is a tiled shell: glass replaces its stone opening, without a backing
  // face or proud decal. Every window has separate rows/bays even in far detail.
  function walls(ring,lo,hi,podium=false) {
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const subdivisions=near?3:1, bands=Math.max(1,Math.ceil(len/9.5));
      const count=podium?Math.max(1,Math.ceil(len/(near?2.5:5.5))):bands*subdivisions, rows=Math.ceil((hi-lo)/(podium?3:near?4:9));
      const point=(t,y)=>[a[0]+(c[0]-a[0])*t,y,a[1]+(c[1]-a[1])*t];
      const panel=(mat,t0,t1,y0,y1)=>{if(t1>t0&&y1>y0)m[mat].quad(point(t0,y0),point(t0,y1),point(t1,y1),point(t1,y0));};
      for(let j=0;j<count;j++)for(let k=0;k<rows;k++) {
        const t0=j/count,t1=(j+1)/count,y0=lo+(hi-lo)*k/rows,y1=lo+(hi-lo)*(k+1)/rows;
        const q=point((t0+t1)/2,(y0+y1)/2), au=Math.abs(q[0]);
        const stepped=au>25 ? 130 : au>18 ? 110 : au>10 ? 88 : 0;
        const stone=podium||q[1]<stepped;
        const trim=podium?'brick':stone?'stone':'metal';
        // Broad full-height piers group three near panes (one coarser far pane) into
        // vertical bands; subordinate mullions and thin spandrels avoid a checkerboard.
        const left=podium?.18/count:stone?(j%subdivisions===0?.95:.22)/len:(near?.065:.1)/len;
        const right=podium?.18/count:stone?(j%subdivisions===subdivisions-1?.95:.22)/len:(near?.065:.1)/len;
        const sill=podium?.7:stone?(near?(k%4===0?.45:.16):.32):.055;
        const l=t0+left,r=t1-right,low=y0+sill,high=y1-(stone?.12:.1);
        panel(trim,t0,l,y0,y1);panel(trim,r,t1,y0,y1);
        panel(trim,l,r,y0,low);panel(trim,l,r,high,y1);
        const seed=Math.sin((j+3+i*43)*12.9898+(k+7)*78.233)*43758.5453;
        const lit=!podium&&(seed-Math.floor(seed)<.055);
        panel(lit?'glow':'glass',l,r,low,high);
      }
    }
  }
  walls(base,0,6,true);cap(m.roof,base,6);
  walls(tower,6,138);cap(m.roof,tower,138);

  // Gabled crown: broad at the high ridge, narrowed by the chamfered plan at
  // the eaves. The exposed sloping face reads as the characteristic trapezoid.
  const crownHeight=(u,v)=>Math.max(138,161-23*Math.abs(v)/20);
  const halves=splitAtRidge(tower);
  const stepU=near?3:5.5,stepV=near?4:8,bar=near?.13:.2;
  for(const half of halves)for(let u=-34;u<34;u+=stepU)for(let v=-25;v<25;v+=stepV) {
    const us=[u,u+bar,u+stepU-bar,u+stepU],vs=[v,v+bar,v+stepV-bar,v+stepV];
    for(let x=0;x<3;x++)for(let z=0;z<3;z++) {
      let p=clip(half,0,us[x],1);p=clip(p,0,us[x+1],-1);p=clip(p,1,vs[z],1);p=clip(p,1,vs[z+1],-1);
      if(p.length>=3)cap(m[x===1&&z===1?'crown':'metal'],p,crownHeight);
    }
  }
  // Close the gable ends down to the occupied roof: no open crown shell.
  for(let i=0;i<tower.length;i++) {
    const a=tower[i],c=tower[(i+1)%tower.length];
    const pieces=a[1]*c[1]<0 ? [a,[a[0]+(c[0]-a[0])*(-a[1]/(c[1]-a[1])),0],c] : [a,c];
    for(let j=0;j<pieces.length-1;j++) {
      const p=pieces[j],q=pieces[j+1];
      m.glass.quad([p[0],138,p[1]],[p[0],crownHeight(...p),p[1]],[q[0],crownHeight(...q),q[1]],[q[0],138,q[1]]);
    }
  }
  function box(mat,u,v,lo,hi,w,d) { b.box(mat,xyz(u,(lo+hi)/2,v),[w,hi-lo,d],-(SPEC.planBearingDeg-90)*Math.PI/180); }
  // Continuous stone ridge screen and two stepped ears; tiers touch their
  // named lower support. Mast tips end exactly at the published 188 m.
  box('stone',0,0,158,164,55,5.1);
  for(const u of [-27.7,27.7]) {
    box('stone',u,0,138,166,4.6,4.6);
    box('stone',u,0,166,169,3.7,3.7);
    box('stone',u,0,169,173,2.9,2.9);
    box('metal',u,0,173,180,1.9,1.9);
    box('metal',u,0,180,188,.24,.24);
  }

  // Brick winter garden annex, the mapped polygon, with a glazed gable and
  // chamfered front corners. Its ridge runs toward the entrance (v axis).
  const garden=positive(localRing(FOOTPRINTS[5]));walls(garden,6,9,true);
  const gardenHeight=(u,v)=>9+7*Math.max(0,1-Math.abs(u-.4)/15);
  const gardenHalves=[clip(garden,0,.4,1),clip(garden,0,.4,-1)];
  for(const p of gardenHalves)cap(m.crown,p,gardenHeight);
  for(let i=0;i<garden.length;i++) {
    const a=garden[i],c=garden[(i+1)%garden.length];
    const pieces=(a[0]-.4)*(c[0]-.4)<0 ? [a,[.4,a[1]+(c[1]-a[1])*(.4-a[0])/(c[0]-a[0])],c] : [a,c];
    for(let j=0;j<pieces.length-1;j++) {
      const p=pieces[j],q=pieces[j+1];
      m.crown.quad([p[0],9,p[1]],[p[0],gardenHeight(...p),p[1]],[q[0],gardenHeight(...q),q[1]],[q[0],9,q[1]]);
    }
  }
  for(const index of [6,7]) {
    const p=positive(localRing(FOOTPRINTS[index]));walls(p,6,12,true);cap(m.roof,p,12);
  }
  // Roof plant is deliberately small and enclosed behind the ridge screen.
  if(near)box('roof',0,-3,151,154,10,3);
  for(const [name,surface] of Object.entries(m))if(surface.positions.length)b.put(surface.geometry(),name);
  const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return root;
}
