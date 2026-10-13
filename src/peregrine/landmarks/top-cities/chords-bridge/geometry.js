import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { LENGTH, SOUTH_RAMP, EAST_RAMP, MAST_STATION, heightAt, pointAt, mastAt, stations } from './chords-bridge-alignment.js';

// Closed longitudinal loft; profile runs clockwise viewed towards increasing station.
function strip(b,mat,ss,left,right,upper,lower,omit=[]){
 const pos=[],ix=[];
 for(const s of ss)for(const [d,y] of [[left,upper(s)],[right,upper(s)],[right,lower(s)],[left,lower(s)]])pos.push(...pointAt(s,d,y));
 for(let i=1;i<ss.length;i++)for(let k=0;k<4;k++){if(omit.includes(k))continue;const a=(i-1)*4+k,c=(i-1)*4+(k+1)%4,d=i*4+k,e=i*4+(k+1)%4;ix.push(a,c,d,c,e,d);}
 ix.push(0,2,1,0,3,2);const n=pos.length/3-4;ix.push(n,n+1,n+2,n,n+2,n+3);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),ss=stations(near?2.5:12),contacts=[];
 const member=(id,material,a,c,width,supportA,supportC,round=false)=>{b.bar(material,a,c,width,width,0,round);contacts.push({id,material,a,c,supportA,supportC});};
 const h=heightAt;
 // Continuous steel box deck: actual 14.82 m outer width, tapered thickness at grade toes.
 strip(b,'deck',ss,-7.41,7.41,h,s=>Math.max(0,h(s)-1.05));
 strip(b,'bed',ss,-7.05,2.5,s=>h(s)+.12,h,[2]);
 strip(b,'walk',ss,2.65,7.05,s=>h(s)+.12,h,[2]);
 contacts.push({id:'pedestrian-walk',material:'walk',a:pointAt(0,5,h(0)+.12),c:pointAt(LENGTH,5,h(LENGTH)+.12),supportA:'deck',supportC:'deck'});
 // Four continuous standard-gauge rails (1.435 m, as tagged by OSM).
 for(const track of [-4.85,.88])for(const side of [-1,1]){
  const d=track+side*.7175;
  strip(b,'rail',ss,d-.06,d+.06,s=>h(s)+.24,s=>h(s)+.12);
  contacts.push({id:`rail-${d}`,material:'rail',a:pointAt(0,d,h(0)+.12),c:pointAt(LENGTH,d,h(LENGTH)+.12),supportA:'bed',supportC:'bed'});
 }
 if(near)for(let s=1;s<LENGTH;s+=1.6)for(const track of [-4.85,.88]){
  member(`sleeper-${s}-${track}`,'fittings',pointAt(s,track-1,h(s)+.15),pointAt(s,track+1,h(s)+.15),.08,'bed','bed');
 }
 // Stone embankments and planted end bearings, not free suspended ramp tails.
 for(const [a,c] of [[0,SOUTH_RAMP],[LENGTH-EAST_RAMP,LENGTH]])strip(b,'stone',ss.filter(s=>s>=a&&s<=c),-7.2,7.2,s=>Math.max(0,h(s)-1.03),()=>0);
 // Triangular streamlined spar loft; lean and local section sizes are photo estimates.
 const pos=[],ix=[],n=near?48:24;
 const shape=y=>{const t=y/118;return .22+5.6*Math.sin(Math.PI*Math.pow(t,.73))};
 for(let i=0;i<=n;i++){
  const y=118*i/n,c=mastAt(y),w=shape(y),depth=1.4*(1-y/118)+.22;
  // Triangle long axis is southeast/northwest, aimed back towards the mast's lean.
  for(const [a,d] of [[-w*.55,-depth*.5],[w*.55,-depth*.5],[0,depth]])pos.push(c[0]+a*.68+d*.73,y,c[2]+a*.73-d*.68);
 }
 for(let i=1;i<=n;i++)for(let k=0;k<3;k++){const a=(i-1)*3+k,c=(i-1)*3+(k+1)%3,d=i*3+k,e=i*3+(k+1)%3;ix.push(a,c,d,c,e,d);}
 ix.push(0,2,1);ix.push(n*3,n*3+1,n*3+2);
 const mast=new THREE.BufferGeometry();mast.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));mast.setIndex(ix);mast.computeVertexNormals();b.put(mast,'tower');
 // 33 stays per arm = 66; both LODs retain the entire three-dimensional harp fan.
 for(const arm of [-1,1])for(let i=0;i<33;i++){
  const t=i/32,y=38+76*t,s=arm<0?MAST_STATION-14-131*t:MAST_STATION+14+(LENGTH-EAST_RAMP-MAST_STATION-18)*t;
  const c=mastAt(y),anchor=pointAt(s,6.65,h(s)+.08);
  // Cable enters the broad triangular spar's southeast surface.
  const d=1.4*(1-y/118)+.22,a=[c[0]+d*.73,y,c[2]-d*.68];
  member(`stay-${arm}-${i}`,'cable',a,anchor,near?.072:.085,'tower','deck',true);
 }
 // Glass-sided inner pedestrian path: no opaque guardwall hiding the cable fan.
 for(const d of [2.8,7.18,-7.18]){
  const posts=stations(near?3.3:10);
  for(let i=0;i<posts.length;i++){
   const s=posts[i];member(`post-${d}-${i}`,'fittings',pointAt(s,d,h(s)+.05),pointAt(s,d,h(s)+1.20),.045,'deck','rail',true);
  }
  strip(b,'rail',ss,d-.045,d+.045,s=>h(s)+1.29,s=>h(s)+1.20);
  contacts.push({id:`handrail-${d}`,material:'rail',a:pointAt(0,d,h(0)+1.24),c:pointAt(LENGTH,d,h(LENGTH)+1.24),supportA:'fittings',supportC:'fittings'});
  if(d>0){strip(b,'glass',ss,d-.025,d+.025,s=>h(s)+1.04,s=>h(s)+.18,[0,2]);contacts.push({id:`glass-${d}`,material:'glass',a:pointAt(0,d,h(0)+.6),c:pointAt(LENGTH,d,h(LENGTH)+.6),supportA:'fittings',supportC:'fittings'});}
 }
 // Continuous warm night band is inset below the deck lip to avoid large overlay faces.
 strip(b,'lamp',ss,7.35,7.43,s=>Math.max(.12,h(s)-.25),s=>Math.max(0,h(s)-.38));
 // Underdeck structural ribs terminate on the deck, never in mid-air.
 if(near)for(let s=SOUTH_RAMP+4;s<LENGTH-EAST_RAMP;s+=4){member(`rib-${s}`,'fittings',pointAt(s,-6.5,h(s)-.95),pointAt(s,6.5,h(s)-.95),.19,'deck','deck');}
 const model=b.finish();model.userData.contacts=contacts;return model;
}
