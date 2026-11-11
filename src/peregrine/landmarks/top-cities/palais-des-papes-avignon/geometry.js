import * as THREE from'three';import clipping from'polygon-clipping';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{COURTS}from'./palais-des-papes-avignon-plan.js';import{local,simplify,surfaces}from'./palais-des-papes-avignon-parts.js';
export const OUTER=simplify(local(FOOTPRINTS[0],SPEC.origin),.25),HOLES=COURTS.map(h=>simplify(local(h.ring,SPEC.origin),.15)),SPIRES=[[-48.2,2.9],[-45.8,-8.9]],TOWERS=[{name:'Trouillas',box:[62,-103,82,-83],height:50.5},{name:'Campane',box:[-44,-49,-29,-32],height:44.5},{name:'Saint-Jean',box:[15,-49,29,-35],height:37},{name:'Anges',box:[23,-12,39,5],height:39}];
const rect=([a,b,c,d])=>[[a,b],[c,b],[c,d],[a,d],[a,b]],base=[OUTER,...HOLES],clip=box=>clipping.intersection(base,[rect(box)]),towerPlans=TOWERS.map(t=>clip(t.box));
const chapelA=OUTER[21],chapelC=OUTER[22],chapelD=new THREE.Vector2(chapelC[0]-chapelA[0],chapelC[1]-chapelA[1]).normalize(),entranceD=new THREE.Vector2(SPIRES[0][0]-SPIRES[1][0],SPIRES[0][1]-SPIRES[1][1]).normalize();
export const chapelPoint=(u,y,depth=0)=>[chapelA[0]+chapelD.x*u+chapelD.y*depth,y,chapelA[1]+chapelD.y*u-chapelD.x*depth];
export const portalPoint=(u,y,depth=0)=>[-48.36+entranceD.x*u+entranceD.y*depth,y,-3+entranceD.y*u-entranceD.x*depth];
const pointed=(x,y,w,h)=>[[x-w/2,y],[x+w/2,y],[x+w/2,y+h*.72],[x+w*.3,y+h*.91],[x,y+h],[x-w*.3,y+h*.91],[x-w/2,y+h*.72]];
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),poly=(ring,holes,fn,mat)=>{const p=ring.map(v=>new THREE.Vector2(...v)),all=[...ring,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(p,holes.map(h=>h.map(v=>new THREE.Vector2(...v)))))s.tri(mat,...t.map(i=>fn(...all[i])));};
 function wall(input,top,inside=false){let p=input.slice();if(Math.sign(p.reduce((a,v,i)=>{const c=p[(i+1)%p.length];return a+v[0]*c[1]-c[0]*v[1];},0))!==(inside?-1:1))p.reverse();const height=(x,z)=>typeof top==='function'?top(x,z):top;
 for(let i=0;i<p.length;i++){
  const a=p[i],c=p[(i+1)%p.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.05)continue;const ha=height(...a),hc=height(...c),h=Math.min(ha,hc),fn=(x,y,depth=0)=>[a[0]+dx*(1-x/len)-dz/len*depth,y,a[1]+dz*(1-x/len)+dx/len*depth],outer=[[0,0],[len,0],[len,ha],[0,hc]],holes=[];
  const chapel=!inside&&[a,c].every(q=>Math.abs((q[0]-chapelA[0])*chapelD.y-(q[1]-chapelA[1])*chapelD.x)<.12)&&Math.min(a[1],c[1])>=9.5,
  entrance=!inside&&Math.min(a[0],c[0])<-44&&Math.max(a[1],c[1])>-7&&Math.min(a[1],c[1])<1;
  const toLocal=(q,mapper)=>{const v=mapper(q[0],q[1]);return[((c[0]-v[0])*dx+(c[1]-v[2])*dz)/len,q[1]];};
  if(chapel)for(const u of[3.9,10.15,16.4])holes.push(pointed(u,9.5,4.8,23).map(q=>toLocal(q,chapelPoint)));
  else if(entrance)holes.push(pointed(0,0,7,15.5).map(q=>toLocal(q,portalPoint)));
  else {const count=len>4?Math.max(1,Math.floor(len/(near?6:11))):0;for(let j=0;j<count;j++){const x=(j+.5)*len/count,w=Math.min(3,len/count*.5);for(const[lo,hh]of(h>34?[[3,8],[19,Math.min(13,h-21)]]:[[3,8],[h*.62,3.4]]))holes.push([[x-w/2,lo],[x+w/2,lo],[x+w/2,lo+hh*.7],[x,lo+hh],[x-w/2,lo+hh*.7]]);}}
  const clean=ring=>Math.hypot(ring[0][0]-ring.at(-1)[0],ring[0][1]-ring.at(-1)[1])<.001?ring.slice(0,-1):ring;
  const draw=(plans,mapper,mat)=>{for(const part of plans){const rings=part.map(clean);poly(rings[0],rings.slice(1),mapper,mat);}};
  draw(holes.length?clipping.difference([outer],...holes.map(q=>[q])):[[outer]],fn,'stone');
  for(const hole of holes)for(const part of clipping.intersection([outer],[hole])){
   const q=clean(part[0]),depth=chapel?1.1:entrance?1.8:.8;
   if(chapel){const windows=[3.9,10.15,16.4].map(u=>pointed(u,13,2.35,15).map(v=>toLocal(v,chapelPoint)));draw(clipping.difference([q],...windows.map(w=>[w])),(x,y)=>fn(x,y,depth),'stone');for(const w of windows)for(const inner of clipping.intersection([q],[w])){const r=clean(inner[0]);poly(r,[],(x,y)=>fn(x,y,1.5),'recess');for(let k=0;k<r.length;k++){const v=r[k],w=r[(k+1)%r.length];s.quad('edge',fn(...v,depth),fn(...w,depth),fn(...w,1.5),fn(...v,1.5));}}}
   else poly(q,[],(x,y)=>fn(x,y,depth),'recess');
   for(let k=0;k<q.length;k++){const v=q[k],w=q[(k+1)%q.length];if(entrance&&((Math.abs(v[0])<.01&&Math.abs(w[0])<.01)||(Math.abs(v[0]-len)<.01&&Math.abs(w[0]-len)<.01)))continue;s.quad('edge',fn(...v),fn(...w),fn(...w,depth),fn(...v,depth));}
  }
 }
 }
 function cap(p,top){p=p.map(r=>Math.hypot(r[0][0]-r.at(-1)[0],r[0][1]-r.at(-1)[1])<.001?r.slice(0,-1):r);const all=p.flat();for(const t of THREE.ShapeUtils.triangulateShape(p[0].map(v=>new THREE.Vector2(...v)),p.slice(1).map(r=>r.map(v=>new THREE.Vector2(...v)))))s.tri('roof',...t.slice().reverse().map(i=>[all[i][0],typeof top==='function'?top(...all[i]):top,all[i][1]]));}
 function volume(plans,top){for(const p of plans){wall(p[0],top);for(const h of p.slice(1))wall(h,top,true);cap(p,top);}}
 const regions=[{box:[-100,-130,100,-43],height:28},{box:[-100,-43,100,9.5],height:24},{box:[-100,9.5,100,80],height:(x,z)=>36+6*Math.max(0,1-Math.abs(z-36)/19)}];
 for(const r of regions){let plans=clip(r.box);for(const t of towerPlans)plans=clipping.difference(plans,...t);volume(plans,r.height);}
 for(let ti=0;ti<TOWERS.length;ti++)volume(towerPlans[ti],TOWERS[ti].height);
 function merlons(ring,y,skipTowers=false){for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),count=Math.max(1,Math.round(len/(near?2.1:3.4))),angle=-Math.atan2(c[1]-a[1],c[0]-a[0]);for(let j=0;j<count;j++){const t=(j+.5)/count,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;if(len<.01||skipTowers&&TOWERS.some(v=>x>=v.box[0]-.7&&x<=v.box[2]+.7&&z>=v.box[1]-.7&&z<=v.box[3]+.7))continue;b.box('edge',[x,y+.75,z],[len/count*.5,1.5,1.05],angle);}}}
 for(const r of regions.slice(0,2))for(const p of clip(r.box))merlons(p[0],r.height,true);
 for(let i=0;i<TOWERS.length;i++)for(const p of towerPlans[i])merlons(p[0],TOWERS[i].height);
 // Twin narrow stone needles remain distinct above the western entrance.
 for(const[x,z]of SPIRES){const g=new THREE.CylinderGeometry(1.45,1.45,35,near?8:6);g.translate(x,17.5,z);b.put(g,'stone');const q=new THREE.ConeGeometry(1.65,9,near?8:6);q.translate(x,39.5,z);b.put(q,'slate');}
 // Stacked masonry buttresses contact grade and the main western wall.
 for(let i=21;i<31;i++){const raw=local(FOOTPRINTS[0],SPEC.origin),a=raw[i],c=raw[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<10)continue;const n=Math.max(1,Math.round(len/7)),angle=-Math.atan2(c[1]-a[1],c[0]-a[0]);for(let j=0;j<n;j++){const t=(j+.5)/n,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;if((Math.abs((x-chapelA[0])*chapelD.y-(z-chapelA[1])*chapelD.x)<2&&z>=9.5&&z<=30)||(x<-44&&z>-8&&z<2))continue;if(TOWERS.some(v=>x>=v.box[0]-1&&x<=v.box[2]+1&&z>=v.box[1]-1&&z<=v.box[3]+1))continue;for(const[y,h,depth]of[[5,10,2.2],[15,10,1.7],[22,4,1.2]])b.box('stone',[x,y,z],[1.2,h,depth],angle);}}
 // Buttresses flank the three monumental bays rather than covering them.
 for(const u of[.9,7,13.2,19.5])for(const[y,h,depth]of[[7,14,2.2],[20,12,1.7],[31,10,1.2]])b.box('stone',chapelPoint(u,y,-depth*.35),[1.15,h,depth],-Math.atan2(chapelD.y,chapelD.x));
 const m=s.finish();m.userData.identity='Gothic fortress,52 m Trouillas,Campane,twin entrance needles and four genuine open courts';return m;}
