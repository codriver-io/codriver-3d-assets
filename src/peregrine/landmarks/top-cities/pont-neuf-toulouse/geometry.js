import {Shape,Path,ExtrudeGeometry,BufferGeometry,Float32BufferAttribute,CylinderGeometry,SphereGeometry} from 'three';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,START,END,PIERS,ARCHES,HALF,CENTER,ROAD_HALF,FLOOD_RADIUS,FLOOD_SURROUND_RADIUS,FLOOD_DROP,ARCH_BAND_SCALE} from './pont-neuf-toulouse-profile.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight,n=near?40:16;
 const chunk=s=>near?(s<(START+END)/2?0:1):0;
 const lift=y=>Math.max(0,Math.min(1,y/10));
 function place(g,mat,s=0,d=0,y=0,weight=lift){const a=g.attributes.position;for(let i=0;i<a.count;i++){const q=p.bridgePoint(s+a.getX(i),d+a.getZ(i),y+a.getY(i));a.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();b.put(g,mat,chunk(s),weight);}
 function prism(shape,mat,s,d,width,weight=lift){const g=new ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1,curveSegments:1});g.translate(0,0,-width/2);place(g,mat,s,d,0,weight);}
 function face(mat,pts,d,s){const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pts.flatMap(([x,y])=>b.xyz(x,d,y)),3));g.setIndex(d>CENTER?[0,1,2,0,2,3]:[0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,mat,chunk(s),lift);}
 const box=(mat,s,d,y,l,w,t,weight=1)=>b.box(mat,s,d,y,l,w,t,chunk(s),weight);
 const strip=(mat,l,r,off,t=0)=>{b.strip(mat,START,(START+END)/2,l,r,off,t,0);b.strip(mat,(START+END)/2,END,l,r,off,t,near?1:0);};
 b.strip('asphalt',0,p.BRIDGE_LENGTH,-ROAD_HALF,ROAD_HALF,0);
 strip('brick',CENTER-HALF,CENTER+HALF,-.12,.38);
 for(const side of [-1,1]){
  const d=CENTER+side*HALF;
  strip('walk',side<0?d:-(-ROAD_HALF),side<0?-ROAD_HALF:d,.18,.32);
  strip('brick',d-.24,d+.24,1.13,.92);
  strip('trim',d-.34,d+.34,1.34,.22);
  strip('trim',d-.40,d+.40,-.38,.25);
  if(near)for(let s=START+1;s<END;s+=1.7){if(PIERS.some(v=>Math.abs(v-s)<2.2))continue;box('joint',s,d+side*.27,h(s)+.7,.026,.07,.83);}
 }
 const archY=(arch,s)=>.25+(arch.peak-.25)*Math.sqrt(Math.max(0,1-((s-arch.mid)/(arch.width/2))**2));
 for(const arch of ARCHES){
  const {a,c,mid,width,peak}=arch,shape=new Shape();shape.moveTo(a-mid,h(a)-.5);
  for(let i=1;i<=n;i++){const s=a+(c-a)*i/n;shape.lineTo(s-mid,h(s)-.5);}
  for(let i=n;i>=0;i--){const s=a+(c-a)*i/n;shape.lineTo(s-mid,archY(arch,s));}shape.closePath();
  prism(shape,'brick',mid,CENTER,2*HALF);
  for(const side of [-1,1]){
   // Separate stone voussoirs form a true basket arch border with radial joints.
   for(let i=0;i<n;i++){const t0=Math.PI*i/n,t1=Math.PI*(i+1)/n,gap=near?.003:0;
    const inner=t=>[mid-width/2*Math.cos(t),.25+(peak-.25)*Math.sin(t)],outer=t=>[mid-(width/2+.68*ARCH_BAND_SCALE)*Math.cos(t),.25+(peak-.25+.85*ARCH_BAND_SCALE)*Math.sin(t)];
    const pts=[inner(t0+gap),inner(t1-gap),outer(t1-gap),outer(t0+gap)];
    const sh=new Shape();sh.moveTo(pts[0][0]-mid,pts[0][1]);pts.slice(1).forEach(q=>sh.lineTo(q[0]-mid,q[1]));sh.closePath();
    prism(sh,i%7===0?'trim':'stone',mid,CENTER+side*(HALF+.17),.32);
   }
   if(near){
    // Mortar joints clipped above the stone arch, never through the negative space.
    for(let s=a+.8;s<c-.4;s+=1.35){const e=Math.min(c-.2,s+1.30),bottom=Math.max(archY(arch,s),archY(arch,e))+1.25,top=Math.min(h(s),h(e))-.60;
     for(let y=Math.ceil(bottom/.32)*.32;y<top;y+=.32){if(PIERS.some(v=>Math.hypot((s+e)/2-v,y-(h(v)-FLOOD_DROP))<4.1))continue;face('joint',[[s,y],[e,y],[e,y+.018],[s,y+.018]],CENTER+side*(HALF+.055),s);
      const q=s+((Math.round(y/.32)%2)?.65:0);if(q+.02<e)face('joint',[[q,y],[q+.018,y],[q+.018,Math.min(top,y+.30)],[q,Math.min(top,y+.30)]],CENTER+side*(HALF+.058),s);
     }
    }
   }
  }
 }
 // Six pierced piers: the oculus is a full transverse tunnel, not a dark disc.
 for(let i=0;i<PIERS.length;i++){
  const s=PIERS[i],a=ARCHES[i].c,c=ARCHES[i+1].a,cy=h(s)-FLOOD_DROP,r=FLOOD_RADIUS;
  const sh=new Shape();sh.moveTo(a-s,0);sh.lineTo(c-s,0);sh.lineTo(c-s,h(c)-.5);sh.lineTo(a-s,h(a)-.5);sh.closePath();
  const hole=new Path();for(let k=0;k<=n;k++){const t=k/n*Math.PI*2,rr=r*(Math.sin(t)>.78?.92:1);const x=rr*Math.cos(t),y=cy+rr*Math.sin(t);k?hole.lineTo(x,y):hole.moveTo(x,y);}hole.closePath();sh.holes.push(hole);
  prism(sh,'brick',s,CENTER,2*HALF);
  for(const side of [-1,1]){
   // Faceted oversized rough-cut surrounds, visible on both facades.
   for(let k=0;k<n;k++){const t0=k/n*2*Math.PI,t1=(k+1)/n*2*Math.PI,gap=near?.007:0;
    const pt=(t,outer)=>{const rr=outer?FLOOD_SURROUND_RADIUS:r*(Math.sin(t)>.78?.92:1);return [rr*Math.cos(t),outer?Math.min(h(s)-.62,cy+rr*Math.sin(t)):cy+rr*Math.sin(t)];};
    const q=[pt(t0+gap,false),pt(t1-gap,false),pt(t1-gap,true),pt(t0+gap,true)],ring=new Shape();ring.moveTo(...q[0]);q.slice(1).forEach(v=>ring.lineTo(...v));ring.closePath();prism(ring,k%5===0?'trim':'stone',s,CENTER+side*(HALF+.20),.36);
   }
   // One attached, pointed loft: stepped ashlar base, shaft and a true pyramid.
   // Rear vertices penetrate the pier by 0.25 m; the roof ridge meets the flood sill.
   const nose=side>0?7.3:5.2,d=CENTER+side*HALF,w=Math.min(6.3,c-a-.3);
   const capBase=Math.max(.8,cy-r-1.40),capTop=cy-r-.03;
   const outline=[[-w/2,-side*.25],[w/2,-side*.25],[0,side*nose]];
   const levels=[[0,1],[.35,1],[.47,.94]];
   for(let y=1.02;y<capBase-.1;y+=.58){levels.push([y,.94],[y+.07,.98],[Math.min(y+.14,capBase-.02),.94]);}
   levels.push([capBase,.98]);
   // Four rising chaperon tiers preserve the pyramidal slope in both LODs.
   for(const t of [.25,.50,.75]){const y=capBase+(capTop-capBase)*t;levels.push([y,1-t+.045],[y+Math.min(.085,(capTop-capBase)*.055),1-t]);}
   const pos=[],idx=[];
   for(const [y,scale] of levels)for(const [x,z] of outline)pos.push(...b.xyz(s+x*scale,d+z*scale,y));
   for(let j=0;j<levels.length-1;j++)for(let k=0;k<3;k++){const a=j*3+k,c=j*3+(k+1)%3;idx.push(a,c,a+3,c,c+3,a+3);}
   // Apex sits at the rear face, rather than leaving a flat triangular lid.
   const apex=pos.length/3,last=(levels.length-1)*3;
   pos.push(...b.xyz(s,d-side*.25,capTop));
   for(let k=0;k<3;k++)idx.push(last+k,last+(k+1)%3,apex);
   idx.push(0,2,1);
   const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));
   g.setIndex(side<0?idx:idx.flatMap((_,k)=>k%3===0?[idx[k],idx[k+2],idx[k+1]]:[]));
   g.computeVertexNormals();b.put(g,'stone',chunk(s),lift);
   box('lamp',s,CENTER+side*(HALF-.2),h(s)-.15,1,.12,.12);
  }
 }
 // Low bank abutments contact the first/last arch, never cover the openings.
 for(const [a,c] of [[START,ARCHES[0].a],[ARCHES.at(-1).c,END]]){const shape=new Shape();shape.moveTo(0,0);shape.lineTo(c-a,0);shape.lineTo(c-a,h(c)-.5);shape.lineTo(0,h(a)-.5);shape.closePath();prism(shape,'brick',a,CENTER,2*HALF);}
 for(let s=START+6;s<END-3;s+=21)for(const side of [-1,1]){
  const d=CENTER+side*(HALF-.70),y=h(s)+.18;
  box('iron',s,d,y+.25,.30,.30,.5);box('iron',s,d,y+2.65,.11,.11,4.8);
  b.beam('iron',[s,d,y+4.8],[s+.52,d,y+5.25],.09,.09,chunk(s));
  const globe=new SphereGeometry(1,near?10:5,near?8:4);globe.scale(.23,.33,.23);place(globe,'lamp',s+.52,d,y+4.96,1);
  const cap=new CylinderGeometry(.04,.28,.24,near?10:5);place(cap,'iron',s+.52,d,y+5.38,1);
 }
 for(let s=0;s+3<p.BRIDGE_LENGTH;s+=9)b.strip('paint',s,s+3,-.05,.05,.025,0,chunk(s));
 // Local-datum bank fitting: footing 0, structural crown 1 at every station.
 const model=b.finish();model.traverse(o=>{if(!o.isMesh||!['stone','trim','brick','joint'].includes(o.material.name))return;const a=o.geometry.attributes.position,w=o.geometry.attributes.bridgeLift;for(let i=0;i<a.count;i++){const q=p.projectBridge(a.getX(i),a.getZ(i));w.setX(i,Math.max(0,Math.min(1,a.getY(i)/Math.max(.1,h(q.s)-.5))));}});return model;
}
