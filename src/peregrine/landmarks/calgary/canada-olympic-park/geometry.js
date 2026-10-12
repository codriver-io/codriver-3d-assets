import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { landingHills, inrun, supports, tower90, tower70, tower50, hut38 } from './canada-olympic-park-parts.js';
import * as THREE from 'three';
import { hillHeight, WORLD_SHIFT, JUMPS, TOWER90, TOWER70, TOWER50, inrunProfile, axes, deckY, girderDepth } from './canada-olympic-park-plan.js';
import { coarseHeight } from './canada-olympic-park-dem.js';

// Canada Olympic Park ski jumps, original procedural model. near adds the stairways, trestle bracing, the lattice mast
// and the Olympic rings; far keeps the towers, both inrun girders on their profiles, the pier and trestle legs (the open
// space under the inruns) and the glazed bands, in four materials.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  const footing=(x,z)=>(ctx.near?hillHeight(x,z):Math.min(hillHeight(x,z),coarseHeight(x,z)))-1;
  // Keep every Cityscape position/normal/index. The layer's existing offset
  // metadata composes world footing depths and rigid assembly levels once.
  let worldY = (x,y,z) => y;
  const put = b.put;
  b.put = (g,material,...args) => {
    const p=g.attributes.position;
    g.setAttribute('terrainOffset',new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>worldY(p.getX(i),p.getY(i),p.getZ(i))-p.getY(i)),1));
    put(g,material,...args);
  };
  for (const key of ['k114', 'k89', 'k63', 'k38']) {
    const jump=JUMPS[key],profile=inrunProfile(jump),{d}=axes(jump.bearing),shift=WORLD_SHIFT[key];
    worldY=(x,y,z)=>y+shift;
    inrun(b, ctx, key);
    worldY=(x,y,z)=>{
      const u=profile.uT+(x-jump.takeOff[0])*d[0]+(z-jump.takeOff[1])*d[1];
      const top=deckY(profile,u)-girderDepth(jump,profile,u),foot=footing(x,z);
      return foot+y/top*(top+shift-foot);
    };
    supports(b, ctx, key);
  }
  // Both world LODs expose the native DEM hillside. Bury the Cityscape grass
  // beneath both displayed TINs, with room for interpolation across triangles;
  // an above-ground skin in near would make the whole hillside pop at 500 m.
  worldY=(x,y,z)=>Math.min(hillHeight(x,z),coarseHeight(x,z))-3;
  landingHills(b, ctx);
  for(const [key,tower,build] of [['k114',TOWER90,tower90],['k89',TOWER70,tower70],['k63',TOWER50,tower50]]) {
    const shift=WORLD_SHIFT[key];
    worldY=(x,y,z)=>y>=tower.base?y+shift:footing(x,z)+(y/tower.base)*(tower.base+shift-footing(x,z));
    build(b,ctx);
  }
  const jump=JUMPS.k38,profile=inrunProfile(jump),shift=WORLD_SHIFT.k38,top=profile.startY-2.2;
  worldY=(x,y,z)=>y>=top?y+shift:footing(x,z)+y/top*(top+shift-footing(x,z));
  hut38(b,ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) {
    const g=o.geometry,p=g.attributes.position,offsets=g.attributes.terrainOffset;
    // Reorder vertices to compact equal offsets into metadata runs. Rounding
    // to 1 mm keeps the near/far byte budgets and is below DEM precision.
    const values=Array.from({length:p.count},(_,i)=>Math.round(offsets.getX(i)*1000)/1000);
    const order=Array.from({length:p.count},(_,i)=>i).sort((a,b)=>values[a]-values[b]),inverse=new Uint32Array(p.count);
    order.forEach((old,i)=>inverse[old]=i);
    g.deleteAttribute('bridgeLift');g.deleteAttribute('terrainOffset');
    for(const attr of Object.values(g.attributes)){const before=attr.array.slice();for(let i=0;i<order.length;i++)for(let j=0;j<attr.itemSize;j++)attr.array[i*attr.itemSize+j]=before[order[i]*attr.itemSize+j];}
    for(let i=0;i<g.index.count;i++)g.index.array[i]=inverse[g.index.array[i]];
    const runs=[];for(let start=0;start<order.length;){const value=values[order[start]];let end=start+1;while(end<order.length&&values[order[end]]===value)end++;if(value)runs.push([start,end-start,value]);start=end;}
    o.userData.terrainOffsets=runs;
  } });
  return model;
}
