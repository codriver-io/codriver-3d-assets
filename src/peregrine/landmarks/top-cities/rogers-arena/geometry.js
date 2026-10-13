import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RINGS, DRUM } from './rogers-arena-site.js';
import { GLYPHS } from './rogers-arena-sign.js';

// Original metres-based arena model. Geometry follows the OSM edges directly:
// +X east, +Y up, +Z south; no second host rotation or DEM elevation.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const buckets = new Map();
  function quad(mat, pts, normal) {
    if (!buckets.has(mat)) buckets.set(mat, { p: [], ix: [] });
    const a = buckets.get(mat), k = a.p.length / 3;
    a.p.push(...pts.flat());
    const u = new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0]));
    const v = new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0]));
    if (u.cross(v).dot(new THREE.Vector3(...normal)) > 0) a.ix.push(k,k+1,k+2,k,k+2,k+3);
    else a.ix.push(k,k+2,k+1,k,k+3,k+2);
  }
  function cap(mat, ring, y) {
    for (const ix of THREE.ShapeUtils.triangulateShape(ring.map(p => new THREE.Vector2(...p)), [])) {
      const pts = ix.map(i => [ring[i][0], y, ring[i][1]]);
      // Degenerate fourth point is avoided by emitting the triangle directly.
      if (!buckets.has(mat)) buckets.set(mat,{p:[],ix:[]});
      const a = buckets.get(mat), k = a.p.length/3;
      a.p.push(...pts.flat());
      const u = new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0]));
      const v = new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0]));
      a.ix.push(...(u.cross(v).y > 0 ? [k,k+1,k+2] : [k,k+2,k+1]));
    }
  }
  function frame(a,c,ring) {
    const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
    const len=Math.hypot(c[0]-a[0],c[1]-a[1]), ux=(c[0]-a[0])/len, uz=(c[1]-a[1])/len;
    return {a, len, ux, uz, nx: Math.sign(area)*uz, nz: -Math.sign(area)*ux, angle:-Math.atan2(uz,ux)};
  }
  function patch(mat,f,s0,s1,y0,y1,inset=0) {
    const p=(s,y)=>[f.a[0]+f.ux*s-f.nx*inset,y,f.a[1]+f.uz*s-f.nz*inset];
    quad(mat,[p(s0,y0),p(s1,y0),p(s1,y1),p(s0,y1)],[f.nx,0,f.nz]);
  }
  const outer=RINGS[0], bowl=RINGS[1];
  // Partition the actual exterior into facade panels. Glazing replaces a wall
  // panel rather than sitting over a tinted extrusion: no coplanar overlays.
  outer.forEach((a,i)=>{
    const c=outer[(i+1)%outer.length], f=frame(a,c,outer);
    const east=f.nx>0.9 && a[0]>70, south=f.nz>0.9 && a[1]>40;
    const north=f.nz<-0.3 && a[1]<-35, service=!east && !south && !north;
    const count=Math.max(1,Math.ceil(f.len/(near?3.6:6.5))), pitch=f.len/count;
    const rows=[0,1,4.8,7.0,10.6,13,16.6,18.4,21.3,22];
    for(let j=0;j<count;j++) {
      const s0=j*pitch,s1=(j+1)*pitch, sc=(s0+s1)/2;
      const blue=east && sc>25 && sc<38;
      for(let r=0;r<rows.length-1;r++) {
        const y0=rows[r],y1=rows[r+1];
        let mat='stone';
        if(blue) mat='blue';
        else if(north && r>=1 && r<=6) mat=r===3?'louvre':'glass';
        else if(east && r>=1 && r<=4) mat=r%2?'glass':'glow';
        else if((east||south) && (r===2||r===4||r===6) && j%3!==0) mat='glass';
        else if(service && ((r===1&&j%4===1)||(r===4&&j%3===1))) mat='glass';
        else if(north&&r>=7) mat='louvre';
        const pad=mat==='glass'||mat==='glow' ? (near?0.20:0.30) : 0;
        if(pad) {
          patch('frame',f,s0,s0+pad,y0,y1);patch('frame',f,s1-pad,s1,y0,y1);
          patch('frame',f,s0+pad,s1-pad,y0,y0+pad);patch('frame',f,s0+pad,s1-pad,y1-pad,y1);
          patch(mat,f,s0+pad,s1-pad,y0+pad,y1-pad);
          // Near-only intermediate mullion, separated face strip in the plane.
        } else patch(mat,f,s0,s1,y0,y1);
      }
      // Glazed frontage has strong vertical pilasters, supported from grade.
      if(north && near && j%2===0) b.box('frame',[a[0]+f.ux*sc+f.nx*0.25,11,a[1]+f.uz*sc+f.nz*0.25],[0.65,22,0.6],f.angle);
    }
    if(east) {
      // A blue name tower continues above the east entrance front, as in the
      // current southeast photograph. It is rooted in the facade, not floating.
      const p=(s,o,y)=>[a[0]+f.ux*s+f.nx*o,y,a[1]+f.uz*s+f.nz*o];
      b.box('blue',p(31.5,-4.2,26.5),[12,9,8.0],f.angle);
      function letters(text,y,cell) {
        const width=(text.length*6-1)*cell;
        [...text].forEach((ch,k)=>GLYPHS[ch].forEach((row,r)=>{
          for(let col=0;col<5;col++) if(row[col]==='1') {
            const s=31.5+width/2-(k*6+col+0.5)*cell;
            // Name is on the tower front; planes are 0.25 m clear of its face.
            patch('sign',f,s-cell*0.45,s+cell*0.45,y+(6-r)*cell,y+(7-r)*cell,-0.3);
          }
        }));
      }
      letters('ROGERS',27.5,0.24); letters('ARENA',25.5,0.24);
      // Entrance doors remain individual bays in both LODs.
      for(let s=4;s<f.len-2;s+=near?3:6) if(s<24||s>39) {
        patch('glass',f,s,s+2.0,0.25,3.2,-0.16);
        if(near) patch('frame',f,s+0.96,s+1.08,0.25,3.2,-0.22);
      }
    }
  });
  cap('stone',outer,22);

  // Rounded-rectangle bowl with a genuine shallow arched roof. The radial
  // loft shares the exact mapped rim with the cladding and has no skirt gaps.
  const center=[13,-8], levels=near?10:5;
  const rim=[];
  bowl.forEach((p,i)=>{
    const q=bowl[(i+1)%bowl.length], steps=Math.max(1,Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/(near?4:9)));
    for(let k=0;k<steps;k++) rim.push([p[0]+(q[0]-p[0])*k/steps,p[1]+(q[1]-p[1])*k/steps]);
    const f=frame(p,q,bowl);
    patch('louvre',f,0,f.len,22,25.5);
    patch('roof',f,0,f.len,25.5,26);
    if(near) for(let y=22.25;y<25.4;y+=0.36) patch('frame',f,0,f.len,y,y+0.07,-0.16);
  });
  const at=(r,p)=>[center[0]+(p[0]-center[0])*r,26+9*(1-r*r),center[1]+(p[1]-center[1])*r];
  // Shared ring vertices make the membrane smooth and avoid degenerate
  // centre quads (a duplicate apex would produce zero-length normals).
  const rp=[center[0],35,center[1]], ri=[], M=rim.length;
  const index=(k,j)=>k===0?0:1+(k-1)*M+(j%M);
  for(let k=1;k<=levels;k++) for(const p of rim) rp.push(...at(k/levels,p));
  const triangle=(i,j,k)=>{
    const A=rp.slice(i*3,i*3+3),B=rp.slice(j*3,j*3+3),C=rp.slice(k*3,k*3+3);
    const ny=(B[2]-A[2])*(C[0]-A[0])-(B[0]-A[0])*(C[2]-A[2]);
    ri.push(...(ny>0?[i,j,k]:[i,k,j]));
  };
  for(let j=0;j<M;j++) triangle(0,index(1,j),index(1,j+1));
  for(let k=1;k<levels;k++) for(let j=0;j<M;j++) {
    triangle(index(k,j),index(k+1,j),index(k+1,j+1));
    triangle(index(k,j),index(k+1,j+1),index(k,j+1));
  }
  const membrane=new THREE.BufferGeometry();membrane.setAttribute('position',new THREE.Float32BufferAttribute(rp,3));membrane.setIndex(ri);membrane.computeVertexNormals();b.put(membrane,'roof');


  // Tall entrance rotunda at the northern end: glazed drum below a ribbed
  // metal upper storey and a flat cap. Faceting is deliberately coarse in far.
  const n=near?48:24, circle=[];
  for(let i=0;i<n;i++) circle.push([DRUM.x+DRUM.r*Math.cos(i*2*Math.PI/n),DRUM.z+DRUM.r*Math.sin(i*2*Math.PI/n)]);
  circle.forEach((a,i)=>{
    const c=circle[(i+1)%n], f=frame(a,c,circle);
    patch('stone',f,0,f.len,0,4.5);
    for(const [y0,y1] of [[4.5,8.0],[8.0,11.5],[11.5,15],[15,18.5],[18.5,22]]) {
      const p=near?0.14:0.25;
      patch('frame',f,0,p,y0,y1); patch('frame',f,f.len-p,f.len,y0,y1);
      patch('frame',f,p,f.len-p,y0,y0+p);patch('frame',f,p,f.len-p,y1-p,y1);
      patch('glass',f,p,f.len-p,y0+p,y1-p);
    }
    patch('louvre',f,0,f.len,22,31.4);
    patch('roof',f,0,f.len,31.4,32);
    if(near) for(let y=22.4;y<31.3;y+=0.45) patch('frame',f,0,f.len,y,y+0.07,-0.16);
  });
  cap('roof',circle,32);
  // Roof plant on the solid east annex, beneath the arena crown.
  for(const [x,z,w,d] of [[69,-2,6,7],[67,34,8,5]]) {
    b.box('louvre',[x,23.2,z],[w,2.4,d]);
    b.box('roof',[x,24.55,z],[w+0.2,0.3,d+0.2]);
  }
  for(const [mat,a] of buckets) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.ix);g.computeVertexNormals();b.put(g,mat);
  }
  return b.finish();
}
