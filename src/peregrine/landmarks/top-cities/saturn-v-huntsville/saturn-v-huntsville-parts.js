import * as THREE from 'three';

const TAU = Math.PI * 2;
// All painting is assigned to shell facets, never a second coincident cylindrical skin.
function shell(b, y0, y1, r0, r1, n, paint, cx=0, cz=0, inside=false) {
  const cells = new Map();
  for (let i=0; i<n; i++) {
    const a=i*TAU/n, c=(i+1)*TAU/n;
    const mat=typeof paint==='function' ? paint((a+c)/2) : paint;
    if (!cells.has(mat)) cells.set(mat, {p:[], ix:[]});
    const t=cells.get(mat), k=t.p.length/3;
    t.p.push(cx+r0*Math.sin(a),y0,cz+r0*Math.cos(a), cx+r0*Math.sin(c),y0,cz+r0*Math.cos(c), cx+r1*Math.sin(c),y1,cz+r1*Math.cos(c), cx+r1*Math.sin(a),y1,cz+r1*Math.cos(a));
    t.ix.push(...(inside?[k,k+2,k+1,k,k+3,k+2]:[k,k+1,k+2,k,k+2,k+3]));
  }
  for (const [mat,t] of cells) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(t.p,3));g.setIndex(t.ix);g.computeVertexNormals();b.put(g,mat);
  }
}
function disc(b, y, radius, n, mat, cx=0, cz=0, down=false) {
  const g=new THREE.CircleGeometry(radius,n);g.rotateX(down?Math.PI/2:-Math.PI/2);g.translate(cx,y,cz);b.put(g,mat);
}
const roll = a => Math.floor((a+Math.PI/8)/(Math.PI/4))%2===0 ? 'black':'white';
const quarterRoll = a => Math.floor((a+Math.PI/8)/(Math.PI/4))%2===0 ? 'black':'white';
export const SUPPORTS = [0,1,2,3].map(i => {
  const a=Math.PI/4+i*Math.PI/2;
  return { name: 'display-pier-'+i, toe:[6.0*Math.sin(a),0.65,6.0*Math.cos(a)], head:[4.7*Math.sin(a),8,4.7*Math.cos(a)] };
});
export const ESCAPE_LEGS = [0,1,2,3].map(i => {
  const a=Math.PI/4+i*Math.PI/2;
  return { foot:[0.6*Math.sin(a),102,0.6*Math.cos(a)], head:[0.34*Math.sin(a),104.4,0.34*Math.cos(a)] };
});
export function buildSupport(b, near) {
  b.box('support',[0,0.3,0],[16,0.6,16]);
  for (const p of SUPPORTS) b.bar('support',p.toe,p.head,1.8,2.2);
  // Five hollow F-1 bell mouths, each physically joining the thrust plate at y=8.
  const engines=[[0,0],[-2.25,-2.25],[2.25,-2.25],[-2.25,2.25],[2.25,2.25]];
  for (const [x,z] of engines) {
    const n=near?24:12;
    shell(b,4.3,6.4,1.48,0.76,n,'metal',x,z);
    shell(b,6.4,8,0.76,0.55,n,'metal',x,z);
    shell(b,4.3,6.4,1.35,0.63,n,'metal',x,z,true);
    shell(b,6.4,7.2,0.63,0.42,n,'metal',x,z,true);
    disc(b,7.2,0.42,n,'black',x,z,true);
    const ring=new THREE.RingGeometry(1.35,1.48,n);ring.rotateX(Math.PI/2);ring.translate(x,4.3,z);b.put(ring,'metal');
  }
}
export function buildRocket(b, near) {
  const n=near?96:32;
  const profile=[
    [8,5.03],[18,5.03],[18.2,5.08],[25,5.08],[25.2,5.03],
    [38,5.03],[38.2,5.08],[44,5.08],[44.2,5.03],[46,5.03],
    [46.3,5.08],[49,5.08],[49.2,5.03],[67,5.03],[67.3,5.08],[70,5.08],
    [76,3.3],[86.7,3.3],[87,3.36],[88,3.36],[88.2,3.3],
    [89.6,2.922],[93,1.95],[99,1.95],[102,0.65],
  ];
  for(let j=1;j<profile.length;j++) {
    const [y0,r0]=profile[j-1], [y1,r1]=profile[j], y=(y0+y1)/2;
    let paint='white';
    if(y<18 || (y>38 && y<44)) paint=roll;
    if(y>46.3 && y<49) paint='black';
    if(y>70 && y<76) paint=quarterRoll;
    if(y>88.2 && y<90) paint='black';
    if(y>93 && y<99) paint=roll;
    shell(b,y0,y1,r0,r1,n,paint);
  }
  disc(b,8,5.03,n,'white',0,0,true);disc(b,102,0.65,n,'white');
  // Four aerodynamic fins as closed thin prisms, not hanging panels.
  for(let i=0;i<4;i++) {
    const shape=new THREE.Shape();shape.moveTo(4.65,8.2);shape.lineTo(8.1,8.2);shape.lineTo(8.1,10.1);shape.lineTo(4.65,14.2);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:0.16,bevelEnabled:false});g.translate(0,0,-0.08);g.rotateY(Math.PI/4+i*Math.PI/2);b.put(g,'white');
  }
  // Physical corrugations around insulation/interstage regions, same paint as parent.
  if(near) for(const [lo,hi,r,painting] of [[8,18,5.03,roll],[18.3,25,5.08,()=> 'white'],[38.3,44,5.08,roll],[46.4,49,5.08,()=> 'black'],[67.4,70,5.08,()=> 'white']]) {
    for(let i=0;i<96;i++) {
      const a=i*TAU/96, x=(r+0.025)*Math.sin(a),z=(r+0.025)*Math.cos(a);
      b.bar(painting(a),[x,lo,z],[x,hi,z],0.055,0.055);
    }
  }
  // The open four-leg escape tower, with crossing bracing and its slender motor.
  for(const leg of ESCAPE_LEGS) b.bar('metal',leg.foot,leg.head,near?0.12:0.16);
  for(let i=0;i<4;i++) {
    const a=ESCAPE_LEGS[i],c=ESCAPE_LEGS[(i+1)%4];
    b.bar('metal',a.foot,c.head,near?0.07:0.1);
  }
  shell(b,104.4,110.7,0.34,0.27,near?16:8,'white');
  shell(b,110.7,111,0.27,0,near?16:8,'white');
  disc(b,104.4,0.34,near?16:8,'white',0,0,true);
  lettering(b,near);
}
// Compact original stroke glyphs: recognizable USA, rather than a texture or font dependency.
const GLYPHS={U:[[0,1,0,0],[0,0,1,0],[1,0,1,1]],S:[[1,1,0,1],[0,1,0,0.5],[0,0.5,1,0.5],[1,0.5,1,0],[1,0,0,0]],A:[[0,0,0.5,1],[0.5,1,1,0],[0.25,0.5,0.75,0.5]]};
function lettering(b,near) {
  for(let side=0;side<4;side++) {
    const a=side*Math.PI/2+Math.PI/8;
    const r=5.03+(near?0.16:0.55), c=Math.cos(a),s=Math.sin(a);
    for(let j=0;j<3;j++) for(const [x0,y0,x1,y1] of GLYPHS['USA'[j]]) {
      const q=(x,y)=>[(x-0.5)*c+r*s,16.3-j*2.45+y*1.9,-(x-0.5)*s+r*c];
      b.bar('red',q(x0,y0),q(x1,y1),0.16,0.11);
    }
    // Flag stripes and canton; no overlapping red/blue layers.
    for(let j=0;j<7;j++) {
      const y=29.7+j*0.22;
      const offset=(j>3)?0.85:0;
      b.box('red',[(offset/2)*c+r*s,y,-(offset/2)*s+r*c],[2.2-offset,0.10,0.10],a);
    }
    b.box('blue',[-0.68*c+r*s,30.84,0.68*s+r*c],[0.85,0.79,0.1],a);
  }
}
