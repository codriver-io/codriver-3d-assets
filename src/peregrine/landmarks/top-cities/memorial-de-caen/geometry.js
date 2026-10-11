import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MAIN_OUTLINE, CANOPY_OUTLINE, EAST, BACK, HEIGHT, ROOM, place } from './memorial-de-caen-plan.js';

// Coordinate convention here: u along the pale front east-southeast, v into the
// building north-northeast. Every point is converted to east/up/south before export.
function builder(detail) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  function tri(mat, a, c, d, toward) {
    const ab = c.map((x,i)=>x-a[i]), ac = d.map((x,i)=>x-a[i]);
    const n = [ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
    if(n.reduce((s,x,i)=>s+x*toward[i],0)<0) [c,d]=[d,c];
    if(!batches.has(mat))batches.set(mat,[]);
    batches.get(mat).push(...a,...c,...d);
  }
  const q = (m,a,c,d,e,n) => { tri(m,a,c,d,n);tri(m,a,d,e,n); };
  const wall = (m,u0,u1,y0,y1,v,n=[-BACK[0],0,-BACK[1]]) => q(m,place(u0,y0,v),place(u1,y0,v),place(u1,y1,v),place(u0,y1,v),n);
  const horizontal = (m,ring,y,up=1) => {
    const tris=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    for(const [a,c,d] of tris)tri(m,place(ring[a][0],y,ring[a][1]),place(ring[c][0],y,ring[c][1]),place(ring[d][0],y,ring[d][1]),[0,up,0]);
  };
  function extrusion(ring,y0,y1,wallMat,topMat,skip=[]) {
    let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    for(let i=0;i<ring.length;i++){
      if(skip.includes(i))continue;
      const a=ring[i],c=ring[(i+1)%ring.length];
      const nx=(c[1]-a[1])*Math.sign(area), nv=-(c[0]-a[0])*Math.sign(area);
      q(wallMat,place(a[0],y0,a[1]),place(c[0],y0,c[1]),place(c[0],y1,c[1]),place(a[0],y1,a[1]),[nx*EAST[0]+nv*BACK[0],0,nx*EAST[1]+nv*BACK[1]]);
    }
    if(topMat)horizontal(topMat,ring,y1);
    if(y0>0)horizontal(wallMat,ring,y0,-1);
  }
  function box(mat,u,y,v,w,h,d) { b.box(mat,place(u,y,v),[w,h,d],-Math.atan2(EAST[1],EAST[0])); }
  function finish() {
    for(const [mat,pos] of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,mat);}
    return b.finish();
  }
  return { ...b, tri,q,wall,horizontal,extrusion,box,finish };
}

const LEFT = [[0,0],[33.55,0],[33.75,3.2],[33.5,6.4],[34.05,9.4],[33.75,12],[34.1,15],[0,15]];
const RIGHT = [[38.1,0],[72,0],[72,15],[38.1,15],[37.8,12],[38.1,9.4],[37.65,6.4],[38.05,3.2]];
function edgeAt(side,y){
 const k=side==='left'?[[0,33.55],[3.2,33.75],[6.4,33.5],[9.4,34.05],[12,33.75],[15,34.1]]:[[0,38.1],[3.2,38.05],[6.4,37.65],[9.4,38.1],[12,37.8],[15,38.1]];
 for(let i=1;i<k.length;i++)if(y<=k[i][0])return k[i-1][1]+(k[i][1]-k[i-1][1])*(y-k[i-1][0])/(k[i][0]-k[i-1][0]);return k.at(-1)[1];
}

// Closed main slabs with a real four-metre fracture, not a black stripe on a box.
function mainSlab(b, section, back, near, side) {
  const n=section.length,front=near?.13:0;
  for(let i=0;i<n;i++){
    const a=section[i],c=section[(i+1)%n];
    const nu=c[1]-a[1],ny=-(c[0]-a[0]);
    if(ny>0 && Math.abs(nu)<1e-6)continue; // roof recess, capped below
    b.q('stone',place(a[0],a[1],front),place(c[0],c[1],front),place(c[0],c[1],back),place(a[0],a[1],back),[nu*EAST[0],ny,nu*EAST[1]]);
  }
  const tris=THREE.ShapeUtils.triangulateShape(section.map(p=>new THREE.Vector2(...p)),[]);
  for(const [i,j,k] of tris){
    b.tri(near?'joint':'stone',place(section[i][0],section[i][1],front),place(section[j][0],section[j][1],front),place(section[k][0],section[k][1],front),[-BACK[0],0,-BACK[1]]);
    b.tri('stone',place(section[i][0],section[i][1],back),place(section[j][0],section[j][1],back),place(section[k][0],section[k][1],back),[BACK[0],0,BACK[1]]);
  }
  const lo=side==='left'?0:38.1,hi=side==='left'?34.1:72;
  const outer=[[lo,front],[hi,front],[hi,back],[lo,back]];
  const inner=[[lo+.28,front+.28],[hi-.28,front+.28],[hi-.28,back-.28],[lo+.28,back-.28]];
  for(let i=0;i<4;i++){
    const j=(i+1)%4,a=outer[i],c=outer[j],d=inner[j],e=inner[i];
    b.q('stone',place(a[0],15,a[1]),place(c[0],15,c[1]),place(d[0],15,d[1]),place(e[0],15,e[1]),[0,1,0]);
    const mid=place((e[0]+d[0])/2,14.8,(e[1]+d[1])/2),center=place((lo+hi)/2,14.8,back/2);
    b.q('stone',place(e[0],14.55,e[1]),place(d[0],14.55,d[1]),place(d[0],15,d[1]),place(e[0],15,e[1]),[center[0]-mid[0],0,center[2]-mid[2]]);
  }
  b.horizontal('roof',inner,14.55);
  if(!near)return;
  // Individual stone courses form the street-visible rhythm without textures.
  // Quads stand 13 cm in front of the backing. Alternating bond and quiet tones.
  const ys=new Set([0,15,3.2,6.4,9.4,12]);for(let y=.75;y<15;y+=.75)ys.add(y);
  const levels=[...ys].sort((a,c)=>a-c);
  for(let j=0;j<levels.length-1;j++){
    const y0=levels[j]+.012,y1=levels[j+1]-.012;
    const low=Math.max(edgeAt(side,y0),edgeAt(side,y1)),high=Math.min(edgeAt(side,y0),edgeAt(side,y1));
    const xmin=side==='left'?0:low, xmax=side==='left'?high:72;
    const shift=j%2?.8:0;
    for(let u=Math.floor((xmin-shift)/1.6)*1.6+shift;u<xmax;u+=1.6){
      const a=Math.max(xmin,u)+.014,c=Math.min(xmax,u+1.6)-.014;if(c<=a)continue;
      const mat=(j*7+Math.round(u/1.6)*11)%9===0?'stoneWarm':'stone';
      b.wall(mat,a,c,y0,y1,0);
    }
  }
  // End returns and rear receive the same restrained stone courses.
  const u=side==='left'?0:72,norm=side==='left'?[-EAST[0],0,-EAST[1]]:[EAST[0],0,EAST[1]];
  const o=side==='left'?-.075:.075;
  for(let row=0,y=.018;y<14.98;y+=.75,row++){
    const y1=Math.min(14.98,y+.714),shift=row%2?.8:0;
    for(let v=.18;v<back-.02;v+=1.6){
      const c=Math.min(back-.02,v+1.57);
      b.q((row+Math.floor(v/1.6))%13===0?'stoneWarm':'stone',place(u+o,y,v),place(u+o,y,c),place(u+o,y1,c),place(u+o,y1,v),norm);
    }
    const x0=side==='left'?.02:Math.max(edgeAt(side,y),edgeAt(side,y1))+.02;
    const x1=side==='left'?Math.min(edgeAt(side,y),edgeAt(side,y1))-.02:71.98;
    for(let x=Math.floor((x0-shift)/1.6)*1.6+shift;x<x1;x+=1.6){
      const l=Math.max(x0,x)+.012,r=Math.min(x1,x+1.6)-.012;
      if(r>l)b.wall((row+Math.floor(x/1.6))%11===0?'stoneWarm':'stone',l,r,y,y1,back+.075,[BACK[0],0,BACK[1]]);
    }
  }

}

export function create({ detail='near' }={}) {
  const near=detail==='near',b=builder(detail);
  mainSlab(b,LEFT,52.9,near,'left');mainSlab(b,RIGHT,53.4,near,'right');
  // Foyer across the middle, set back from the breach and short of the roof.
  b.extrusion([[33.4,7.5],[38.35,7.5],[38.35,44.3],[33.4,44.3]],0,14.35,'metal','roof');
  // Continuous glass follows both broken jambs: no opaque middle band.
  // The dark foyer behind it is entirely occluded by this opaque blue skin.
  const glassY=[.2,3.2,6.4,9.4,12,14.7];
  for(let i=0;i<glassY.length-1;i++){
    const y0=glassY[i],y1=glassY[i+1];
    b.q('glass',place(edgeAt('left',y0),y0,6.9),place(edgeAt('right',y0),y0,6.9),place(edgeAt('right',y1),y1,6.9),place(edgeAt('left',y1),y1,6.9),[-BACK[0],0,-BACK[1]]);
  }
  for(let u=34.25;u<37.7;u+=near?.78:1.55)b.box('metal',u,7.45,6.79,.07,14.5,.14);
  // Entry doors remain locally lit at night, with thin transoms and frames.
  for(const [u0,u1] of [[34.32,34.96],[35.1,35.74],[35.88,36.52],[36.66,37.30]])b.wall('glow',u0,u1,.25,3.42,6.81);
  b.box('metal',35.9,3.55,6.75,3.6,.10,.18);
  // Plain stone rear closure joins the slab depths (52.9 and 53.4 m).
  // Its edges meet the existing jamb walls; no duplicate side faces.
  const rearY=[0,3.2,6.4,9.4,12,15];
  for(let i=0;i<rearY.length-1;i++){
    const y0=rearY[i],y1=rearY[i+1],l0=edgeAt('left',y0),l1=edgeAt('left',y1),r0=edgeAt('right',y0),r1=edgeAt('right',y1);
    b.q('stone',place(l0,y0,52.9),place(r0,y0,53.4),place(r1,y1,53.4),place(l1,y1,52.9),[BACK[0],0,BACK[1]]);
    b.q('stone',place(l0,y0,52.75),place(r0,y0,52.75),place(r1,y1,52.75),place(l1,y1,52.75),[-BACK[0],0,-BACK[1]]);
  }
  // Close the short rear roof pocket as stone; the front roof lights remain.
  b.horizontal('stone',[[edgeAt('left',14.65),43.9],[edgeAt('right',14.65),43.9],[edgeAt('right',14.65),52.75],[edgeAt('left',14.65),52.75]],14.65);
  b.q('stone',place(34.1,15,52.75),place(38.1,15,52.75),place(38.1,15,53.4),place(34.1,15,52.9),[0,1,0]);
  // Long roof lights stop before the entrance and the rear notch.
  const roofRing=[[34.35,8],[37.65,8],[37.65,43.9],[34.35,43.9]];
  b.horizontal('glass',roofRing,14.65);
  for(let v=8.2;v<43.7;v+=near?2.4:7.2)b.box('metal',36,14.72,v,3.3,.12,.1);
  // Mapped 2002 west wing: a narrow stepped gallery leading to a curved hall.
  const gallery=[...MAIN_OUTLINE.slice(18,36),...MAIN_OUTLINE.slice(79,101)];
  const hall=MAIN_OUTLINE.slice(35,80);
  b.extrusion(gallery,0,7.3,'stone','roof',[17]);
  b.extrusion(hall,0,8.1,'steel','softRoof',[hall.length-1]);
  // Close the height transition at the shared gallery / hall line only above gallery.
  const a=hall.at(-1),c=hall[0];
  b.q('steel',place(a[0],7.3,a[1]),place(c[0],7.3,c[1]),place(c[0],8.1,c[1]),place(a[0],8.1,a[1]),[EAST[0],0,EAST[1]]);
  // Setback ribbons of gallery glazing: merged panes and masonry fins.
  const frontage=MAIN_OUTLINE.slice(80,94);
  for(let i=0;i<frontage.length-1;i++){
    const a=frontage[i],c=frontage[i+1];if(Math.hypot(c[0]-a[0],c[1]-a[1])<2)continue;
    const v=(a[1]+c[1])/2-.075;
    b.wall('glass',Math.min(a[0],c[0])+.18,Math.max(a[0],c[0])-.18,1.3,5.9,v);
    if(near)b.box('stone',Math.min(a[0],c[0])+.12,3.6,v+.02,.18,5.1,.12);
  }
  // 2019 immersive room: contractor describes an 18 m frame, 8 m high,
  // enclosed by roughly 20 m curved matte-black, 4 m-high sheets. Centre is estimated.
  const seg=near?96:32,ring=[];
  for(let i=0;i<seg;i++){const t=i*2*Math.PI/seg;ring.push([ROOM.u+ROOM.radius*Math.cos(t),ROOM.v+ROOM.radius*Math.sin(t)]);}
  b.extrusion(ring,0,ROOM.height,'metal','roof');
  const rim=ring.map(([u,v])=>[ROOM.u+(u-ROOM.u)*.985,ROOM.v+(v-ROOM.v)*.985]);
  b.extrusion(rim,ROOM.height-.05,ROOM.height+.07,'metal','metal');
  if(near){
    // Broad curved sheet rhythm is dark and subdued; no visible fixings.
    for(let i=0;i<31;i++){
      const t=i*2*Math.PI/31,d=.006,rr=ROOM.radius+.065;
      const p=place(ROOM.u+rr*Math.cos(t-d),0.1,ROOM.v+rr*Math.sin(t-d)),q=place(ROOM.u+rr*Math.cos(t+d),0.1,ROOM.v+rr*Math.sin(t+d));
      b.q('steel',p,q,[q[0],3.88,q[2]],[p[0],3.88,p[2]],[Math.cos(t)*EAST[0]+Math.sin(t)*BACK[0],0,Math.cos(t)*EAST[1]+Math.sin(t)*BACK[1]]);
    }
  }
  // Entrance threshold beneath the mapped wall=no cover: low and unobtrusive.
  b.extrusion(CANOPY_OUTLINE,0,.15,'stone','stone');
  b.box('stone',36,.14,-2.7,4.5,.28,6);
  return b.finish();
}
