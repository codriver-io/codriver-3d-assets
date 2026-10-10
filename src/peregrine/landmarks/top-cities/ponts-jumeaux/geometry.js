import * as THREE from 'three';
import { assetBuilder, bridgeBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { HERITAGE, NORTH, SOUTH, ARCHES, PANEL, PANEL_FRAME, WING_FRAME } from './ponts-jumeaux-profile.js';

// Map every authored surface into the same east/up/south frame as navigation.
function point(profile,s,d,y){const p=profile.bridgePoint(s,d,y);return [p.x,p.y,p.z];}
function placed(g,profile,face=0){const p=g.attributes.position;for(let i=0;i<p.count;i++){const q=profile.bridgePoint(p.getX(i),p.getZ(i)+face,p.getY(i));p.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();return g;}
function prism(b,polygon,d,depth,mat,profile=HERITAGE,lift=0){
 const sh=new THREE.Shape();polygon.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();
 const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:1});g.translate(0,0,d);b.put(placed(g,profile),mat,0,lift);
}
function block(b,s,d,y,length,width,height,mat='stone',profile=HERITAGE,lift=0){
 const p=profile.bridgePoint(s,d,y);b.box(mat,[p.x,p.y,p.z],[length,height,width],-Math.atan2(p.tz,p.tx),0,lift);
}
function heritage(detail){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),n=near?64:20,L=HERITAGE.BRIDGE_LENGTH;
 const bottom=[[0,0]];
 for(const a of ARCHES.slice(0,1)){bottom.push([a.s-a.half,0],[a.s-a.half,a.spring]);for(let i=1;i<=n;i++){const t=Math.PI*(1-i/n);bottom.push([a.s+a.half*Math.cos(t),a.spring+a.rise*Math.sin(t)]);}bottom.push([a.s+a.half,0]);}
 bottom.push([L,0],[L,4.45],[0,4.45]);
 prism(b,bottom,-4,8,'brick');
 // Pale stone arch bands with individual radial voussoirs and a taller keystone.
 for(const a of ARCHES.slice(0,1))for(const d of [-4.12,4]){
  const seg=near?32:12;
  for(let i=0;i<seg;i++){
   const t0=i*Math.PI/seg+(near?0.003:0),t1=(i+1)*Math.PI/seg-(near?0.003:0),ring=0.53;
   const at=(t,r)=>[a.s+(a.half+r)*Math.cos(t),a.spring+(a.rise+r)*Math.sin(t)];
   prism(b,[at(t0,0),at(t1,0),at(t1,ring),at(t0,ring)],d,.12,'stone');
  }
  block(b,a.s,d+.06,a.spring+a.rise+.37,.58,.19,.74);
  for(const side of [-1,1])for(let y=.27;y<3.95;y+=.46){
   const s=a.s+side*(a.half+.78),wide=near&&Math.floor(y/.46)%2?1.0:.7;
   block(b,s,d+.02,y,wide,.16,.42);
  }
 }
 // Base courses stop at both navigable openings; no false canal floor.
 const solid=[[0,ARCHES[0].s-ARCHES[0].half],[ARCHES[0].s+ARCHES[0].half,HERITAGE.BRIDGE_LENGTH]];
 for(const [a,c] of solid)for(const d of [-4.05,3.95])block(b,(a+c)/2,d,.25,c-a,.3,.5);
 // Projecting cornice and a low parapet share the basin wall coping datum.
 block(b,L/2,0,4.53,L,8.4,.16);
 block(b,L/2,0,4.68,L,8.08,.14);
 for(const d of [-3.77,3.77]){
  block(b,L/2,d,4.93,L,.44,.36,'brick');block(b,L/2,d,5.16,L,.48,.14);
 }
 // Plain merged brick faces avoid sub-pixel mortar striping at road distances.
 // Lucas's white panel is a shallow architectural relief, not a traced sculpture.
 const panelBlock=(b,s,d,y,length,width,height,mat='stone')=>block(b,s,d,y,length,width,height,mat,PANEL_FRAME);
 const panelPrism=(...args)=>prism(...args,PANEL_FRAME);
 const P=PANEL_FRAME.BRIDGE_LENGTH;
 prism(b,[[0,0],[P,0],[P,5.10],[0,5.10]],-.55,1.10,'brick',PANEL_FRAME);
 block(b,P/2,0,5.19,P,.98,.08,'stone',PANEL_FRAME);
 block(b,P/2,.62,3.78,P,.18,.20,'stone',PANEL_FRAME);
 const a=PANEL.s-PANEL.length/2,c=PANEL.s+PANEL.length/2,y=PANEL.bottom,h=PANEL.height;
 panelBlock(b,PANEL.s,0.7,y+h/2,PANEL.length+.55,.36,h+.35);
 panelBlock(b,PANEL.s,0.93,y+h/2,PANEL.length,.16,h,'marble');
 panelBlock(b,PANEL.s,0.87,y-.16,PANEL.length+1,.67,.22);
 // Faceted landscape/boat shapes and raised drapery retain the broad visual rhythm.
 const mat=near?'relief':'marble';
 panelPrism(b,[[a+.2,y+.2],[c-.2,y+.2],[c-.3,y+.75],[c-2,y+1.4],[c-3.5,y+1.05],[c-5,y+1.5],[a+6,y+.85],[a+3,y+1.35],[a+.3,y+.8]], 0.99,.13,mat);
 panelPrism(b,[[PANEL.s-2.0,y+.65],[PANEL.s-1.75,y+2.45],[PANEL.s+1.7,y+2.45],[PANEL.s+2.1,y+.65],[PANEL.s+.7,y+.45]], 1.02,.17,'marble');
 for(let i=0;i<(near?9:4);i++){
  const x=PANEL.s-1.65+i*3.3/(near?8:3),top=y+2.38;
  panelPrism(b,[[x,top],[x+.12,top-.3],[PANEL.s+(x-PANEL.s)*.55,y+.65],[PANEL.s+(x-PANEL.s)*.55-.13,y+.75]], 1.19,.08,mat);
 }
 // One shallow continuous crowd/landscape mass rather than freestanding pawns.
 // Broad shoulders and drapery make an original relief rhythm at both LODs.
 const ridge=near?[[.3,.55],[1.2,.8],[2.1,1.0],[2.7,1.45],[3.2,1.58],[3.7,1.12],[4.3,.9],[5.1,1.42],[5.6,1.5],[6.2,1.06],[7.3,.78],[8.2,1.28],[8.7,1.37],[9.4,.95],[10.6,.85],[11.7,1.4],[12.2,1.5],[13,1.1],[14,1.0],[15.3,1.42],[15.9,1.52],[16.6,1.04],[17.6,.78],[18.4,.5]]:[[.3,.55],[2.9,1.55],[4.2,.9],[5.5,1.5],[7.3,.78],[8.6,1.37],[10.6,.85],[12,1.5],[14,1.0],[15.7,1.5],[18.4,.5]];
 panelPrism(b,[[a+.2,y+.22],[c-.2,y+.22],...ridge.slice().reverse().map(([x,z])=>[a+x*PANEL.length/18.7,y+z])],1.17,.13,'marble');
 if(near){
  // Shallow faceted shoulders are joined by the common mass below; no separate heads.
  for(const [x,top] of [[2.9,1.55],[5.5,1.45],[8.6,1.32],[12,1.45],[15.7,1.45]]){
   const rim=[[a+x-.8,y+.3,1.301],[a+x+.8,y+.3,1.301],[a+x+.55,y+top-.28,1.301],[a+x,y+top,1.301],[a+x-.5,y+top-.27,1.301]];
   const centre=[a+x,y+.72,1.55],positions=[],indices=[];
   for(let i=0;i<rim.length;i++){positions.push(...rim[i],...rim[(i+1)%rim.length],...centre);indices.push(i*3,i*3+1,i*3+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);b.put(placed(g,PANEL_FRAME),'marble',0,0);
  }
 }
 // A sail and boat at the left, low plough forms on the right.
 panelPrism(b,[[a+2.1,y+.8],[a+3.7,y+2.35],[a+3.7,y+.8]], 1.13,.10,'marble');
 panelPrism(b,[[a+1.0,y+.4],[a+4.4,y+.4],[a+4.05,y+.7],[a+1.4,y+.7]], 1.29,.12,'marble');
 // Modest central crest above the panel, integrated with the parapet.
 panelBlock(b,PANEL.s,0.54,4.97,.7,.35,.45,'stone');
 panelPrism(b,[[PANEL.s-.24,5.17],[PANEL.s+.24,5.17],[PANEL.s+.2,4.89],[PANEL.s,4.78],[PANEL.s-.2,4.89]], 0.65,.13,'marble');
 const W=WING_FRAME.BRIDGE_LENGTH;
 prism(b,[[0,0],[W,0],[W,5.10],[0,5.10]],-.55,1.1,'brick',WING_FRAME);
 block(b,W/2,0,5.19,W,.98,.08,'stone',WING_FRAME);
 const out=b.finish();out.children.forEach(m=>m.name='heritage-'+m.name);return out;
}
function boulevard(profile,detail){
 const b=bridgeBuilder(profile,detail),a=profile.structureStart,c=profile.structureEnd;
 const half=profile.halfWidth;
 // Dense sampling keeps the fallback roadway below the actual HD overlay.
 profile.meshStep=2;
 b.strip('asphalt',0,profile.BRIDGE_LENGTH,-half+1.25,half-1.25,-.065,.17);
 // Only structural fascias and curbs on the bridge. Approaches do not become a wall.
 for(const d of [-half+.52,half-.52]){
  b.strip('stone',a,c,d-.49,d+.49,.12,.38);
  b.strip('brick',a,c,d-.22,d+.22,.76,.54);
  b.strip('stone',a,c,d-.24,d+.24,1.03,.08);
  // Continuous low brick support meets the thin stone cap.
  b.strip('brick',a,c,d-.22,d+.22,.95,.19);
 }
 for(const d of [-half+.16,half-.16])b.strip('stone',a,c,d-.15,d+.15,-.16,.52);
 if(profile===SOUTH){
  const arch=ARCHES[1],ab=assetBuilder({...SPEC,palette:PALETTES.light},detail),n=detail==='near'?56:18;
  const a=profile.structureStart,c=profile.ALIGNMENT[profile.ALIGNMENT.findIndex(v=>v.s>a)].s;
  const lower=[[a,0],[arch.s-arch.half,0],[arch.s-arch.half,arch.spring]];
  for(let i=1;i<=n;i++){const t=Math.PI*(1-i/n);lower.push([arch.s+arch.half*Math.cos(t),arch.spring+arch.rise*Math.sin(t)]);}
  lower.push([arch.s+arch.half,0],[c,0],[c,3.95],[a,3.95]);prism(ab,lower,-half,2*half,'brick',profile);
  for(const d of [-half-.12,half]){
   block(ab,arch.s,d+.06,arch.spring+arch.rise+.31,.56,.18,.62,'stone',profile);
   const seg=detail==='near'?30:12;
   for(let i=0;i<seg;i++){
    const t=i*Math.PI/seg+.002,u=(i+1)*Math.PI/seg-.002,at=(v,r)=>[arch.s+(arch.half+r)*Math.cos(v),arch.spring+(arch.rise+r)*Math.sin(v)];
    prism(ab,[at(t,0),at(u,0),at(u,.5),at(t,.5)],d,.12,'stone',profile);
   }
   for(const side of [-1,1])for(let y=.25;y<3.65;y+=.45)block(ab,arch.s+side*(arch.half+.7),d+.04,y,.75,.2,.40,'stone',profile);

  }
  const arches=ab.finish();
  for(const mesh of arches.children){b.put(mesh.geometry,mesh.material.name,0,y=>Math.max(0,Math.min(1,y/4.2)));mesh.material.dispose();}
 }
 // Grounded abutments: the historic south masonry already supports its first end.
 for(const s of profile===SOUTH?[c-1.0]:[a+1.0,c-1.0])for(const d of [-half+.6,half-.6])b.box('stone',s,d,1.7,2.0,1.2,3.4,0,y=>Math.max(0,Math.min(1,y/3.4)));
 const out=b.finish();out.children.forEach(m=>m.name=profile.part+'-'+m.name);return out;
}
export function create({detail='near'}={}){
 const root=new THREE.Group();root.name=SPEC.name;
 for(const g of [heritage(detail),boulevard(NORTH,detail),boulevard(SOUTH,detail)])root.add(...[...g.children]);
 // Ground-contact bottoms are buried and would overlap the masonry base courses.
 for(const mesh of root.children){const g=mesh.geometry,p=g.attributes.position,idx=g.index,kept=[];for(let i=0;i<idx.count;i+=3){const tri=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)];if(!tri.every(v=>Math.abs(p.getY(v))<.001))kept.push(...tri);}g.setIndex(kept);}
 root.userData={landmark:SPEC.id,origin:SPEC.origin,units:'metres',detail,triangles:root.children.reduce((n,m)=>n+m.geometry.index.count/3,0),drawCalls:root.children.length};
 return root;
}
