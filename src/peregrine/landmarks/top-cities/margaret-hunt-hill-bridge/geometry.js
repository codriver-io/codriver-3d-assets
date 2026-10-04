import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE, DECK_H, SPAN, DECK_HALF, ARCH_HALF, ARCH_BASE, STEEL_HEIGHT, ARCH_RADIUS, TOWER_S, CABLE_START, CABLE_END } from './margaret-hunt-hill-bridge-profile.js';

// Smoothly tapered, closed transverse tube. One sweep retains the open portal in both LODs.
export function archPoint(t) {
  const d = ARCH_HALF * (2*t-1);
  return { d, y: ARCH_BASE + (STEEL_HEIGHT-ARCH_RADIUS*.55) * (1-(d/ARCH_HALF)**2),
    r: ARCH_RADIUS * (0.55 + 0.45 * Math.abs(2*t-1)) };
}

export function create({ detail = 'near' } = {}) {
  const near=detail==='near', p=PROFILE, h=p.deckHeight, L=p.BRIDGE_LENGTH;
  const b=bridgeBuilder({ ...p, meshStep: near ? 2 : 4 },detail), xyz=b.xyz;
  const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const liftTo=top=>y=>clamp(y/top);
  // Closed tapered cylinders, avoiding open cable ends in low-angle views.
  function rod(mat,a,c,r0,r1=r0,sides=near?8:4,ck=0,lift=1) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),v=cv.clone().sub(av);
    const g=new THREE.CylinderGeometry(r1,r0,v.length(),sides,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray());b.put(g,mat,ck,lift);
  }
  function strips(mat,a,c,dl,dr,off,thickness=0) {
    for(let s=a;s<c-.001;){const next=Math.min(c,(Math.floor(s/(L/3))+1)*(L/3));
      b.strip(mat,s,next,dl,dr,off,thickness,chunk(s));s=next;}
  }
  // Raised slabs taper out as the ramps reach grade. Pavement remains exactly on the profile.
  let s0=0,s1=L;while(h(s0)<2.5)s0+=1;while(h(s1)<2.5)s1-=1;
  strips('concrete',s0,s1,-DECK_HALF,DECK_HALF,-.22,.65);
  strips('asphalt',0,L,-17.15,17.15,0);
  strips('concrete',0,L,-DECK_HALF,-17.15,.18,.18);
  strips('concrete',0,L,17.15,DECK_HALF,.18,.18);
  // Narrow solid barriers: stay spine in the median, edge Jersey barriers on the shoulders.
  for(const [a,c] of [[-DECK_HALF+.08,-DECK_HALF+.40],[DECK_HALF-.40,DECK_HALF-.08]])
    strips('steel',0,L,a,c,1.08,.93);
  strips('steel',0,L,-1.65,1.65,1.08,1.08);
  for(const d of [-16.9,16.9,-2.05,2.05])strips('paint',0,L,d-.065,d+.065,.035);
  if(near)for(let s=3;s<L-3;s+=12)for(const d of [-11.85,-6.95,6.95,11.85])
    b.strip('paint',s,Math.min(s+3,L),d-.06,d+.06,.035,0,chunk(s));

  // The centre spine and edge box girders carry paired transverse ribs (116 floor beams in reality).
  strips('steel',CABLE_START,CABLE_END,-1.5,1.5,-.92,1.4);
  for(const d of [-DECK_HALF+.8,DECK_HALF-.8])strips('steel',s0,s1,d-.55,d+.55,-.90,1.6);
  const ribs=near?116:29;
  for(let i=0;i<=ribs;i++) {
    const s=CABLE_START+(CABLE_END-CABLE_START)*i/ribs;
    b.box('steel',s,0,h(s)-1.35,.34,35.6,.85,chunk(s));
    if(near)for(const side of [-1,1])b.beam('steel',[s,side*1.4,h(s)-2.28],[s,side*17.5,h(s)-.92],.25,.25,chunk(s));
  }
  // Concrete approach bents: open shafts, caps in contact with the slab; no piers in the main spans.
  const piers=[CABLE_START,CABLE_END];
  for(let s=36;s<CABLE_START-15;s+=32)piers.push(s);
  for(let s=CABLE_END+32;s<L-20;s+=32)piers.push(s);
  for(const s of piers) {
    const top=h(s)-1.9;if(top<.7)continue;const ck=chunk(s);
    for(const d of [-11.8,11.8])rod('concrete',xyz(s,d,0),xyz(s,d,top-.45),1.25,1.0,near?10:5,ck,liftTo(top-.45));
    b.box('concrete',s,0,top,3.2,36.7,1.2,ck);
  }

  // The one white arch is across the roadway, not along the two cable-supported spans.
  for(const side of [-1,1])rod('concrete',xyz(TOWER_S,side*ARCH_HALF,0),xyz(TOWER_S,side*ARCH_HALF,ARCH_BASE+.05),2.4384,2.4384,near?16:8,1,0);
  {
    const segments=near?96:32,sides=near?12:6,pos=[],idx=[];
    for(let i=0;i<=segments;i++) {
      const t=i/segments,q=archPoint(t),dd=2*ARCH_HALF,dy=-4*(STEEL_HEIGHT-ARCH_RADIUS*.55)*(2*t-1),len=Math.hypot(dd,dy);
      for(let j=0;j<sides;j++) { const f=j/sides*2*Math.PI+Math.PI/2;
        pos.push(...xyz(TOWER_S+q.r*Math.cos(f),q.d+q.r*Math.sin(f)*dy/len,q.y-q.r*Math.sin(f)*dd/len)); }
      if(!i)continue;for(let j=0;j<sides;j++){const a=(i-1)*sides+j,c=(i-1)*sides+(j+1)%sides,u=i*sides+j,v=i*sides+(j+1)%sides;idx.push(a,u,c,c,u,v);}
    }
    for(let j=1;j<sides-1;j++)idx.push(0,j,j+1,segments*sides,segments*sides+j+1,segments*sides+j);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    // Lower legs stretch from their planted concrete bases; the upper arch follows the deck rigidly.
    b.put(g,'tower',1,y=>clamp((y-ARCH_BASE)/(DECK_H-ARCH_BASE)));
  }
  // 29 on each side, anchored to the deck centre. Opposite ordered arch attachments twist the web.
  // Samples include the complete web extents in far, while dropping alternate subpixel strands.
  for(const side of [-1,1])for(let i=0;i<29;i++) {
    if(!near&&i%2&&i!==28)continue;
    const u=i/28,t=.17+.66*(side>0?u:1-u),q=archPoint(t);
    const s=TOWER_S+side*(18+(SPAN-21)*u);
    const anchor=xyz(s,0,h(s)+1.08),arch=xyz(TOWER_S,q.d,q.y);
    rod('cable',anchor,arch,near?.0825:.12,near?.0825:.12,near?6:3,1);
    if(near)b.box('steel',s,0,h(s)+1.15,.52,.65,.28,chunk(s));
  }
  // White davit standards stand on the shoulder, clear of all three vehicle lanes.
  for(let s=CABLE_START+10;s<CABLE_END-5;s+=26)for(const side of [-1,1]) {
    const d=side*17.75,y=h(s);const ck=chunk(s);
    rod('tower',xyz(s,d,y+.18),xyz(s,d,y+8),.12,.09,near?6:3,ck);
    if(near) {b.beam('tower',[s,d,y+8],[s,d-side*1.6,y+8.4],.12,.12,ck);
      b.box('lamp',s,d-side*1.6,y+8.35,1,.42,.18,ck);}
  }
  return b.finish();
}
