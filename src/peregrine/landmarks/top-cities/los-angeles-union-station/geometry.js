import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { CANOPY_FOOTPRINTS } from './footprint.js';

// Station facade axes measured from the mapped west wall. Rotation is baked once.
export function sitePoint(u,y,v) {
  const a=-10*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
  return new THREE.Vector3(c*(u+100)+s*(v+85),y,-s*(u+100)+c*(v+85));
}
export function create({detail='near'}={}) {
  const near=detail==='near',segments=near?16:8;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const box=(m,x0,x1,y0,y1,z0,z1)=>b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  function arch(c,w,bottom,top) {
    const r=w/2,spring=top-r,pts=[[c-r,bottom],[c+r,bottom],[c+r,spring]];
    for(let i=1;i<=segments;i++){const a=i*Math.PI/segments;pts.push([c+r*Math.cos(a),spring+r*Math.sin(a)]);}
    return pts;
  }
  // Actual wall holes, with glass recessed 0.55m and mullions in the reveal.
  // In an x wall the horizontal coordinate is -v; in a z wall it is u.
  function wall(axis,face,start,end,height,holes=[],facing=-1,y0=0) {
    const shape=new THREE.Shape([[start,y0],[end,y0],[end,height],[start,height]].map(p=>new THREE.Vector2(...p)));
    for(const h of holes)shape.holes.push(new THREE.Path(h.points.map(p=>new THREE.Vector2(...p))));
    const g=new THREE.ExtrudeGeometry(shape,{depth:.8,bevelEnabled:false,curveSegments:1});
    if(axis==='x'){g.rotateY(Math.PI/2);g.translate(face+(facing<0?0:-.8),0,0);}
    else g.translate(0,0,face+(facing<0?0:-.8));
    b.put(g,'stucco');
    const coords=(a,y,d)=>axis==='x'?[face+d,y,-a]:[a,y,face+d];
    for(const h of holes) {
      if(h.open)continue;
      const pane=new THREE.ShapeGeometry(new THREE.Shape(h.points.map(p=>new THREE.Vector2(...p))));
      if(facing<0){const ix=pane.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];pane.computeVertexNormals();}
      if(axis==='x'){pane.rotateY(Math.PI/2);pane.translate(face+(facing<0?.55:-.55),0,0);}
      else pane.translate(0,0,face+(facing<0?.55:-.55));
      b.put(pane,h.lit?'glow':'glass');
      if(!h.rect) {
        const lo=h.points[0][0],hi=h.points[1][0],bot=h.points[0][1],top=Math.max(...h.points.map(p=>p[1]));
        const shape=new THREE.Shape(arch((lo+hi)/2,hi-lo+1.0,Math.max(0,bot-.45),top+.5).map(p=>new THREE.Vector2(...p)));
        shape.holes.push(new THREE.Path(h.points.map(p=>new THREE.Vector2(...p))));
        const trim=new THREE.ShapeGeometry(shape);
        if(facing<0){const ix=trim.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];trim.computeVertexNormals();}
        if(axis==='x'){trim.rotateY(Math.PI/2);trim.translate(face+(facing<0?-.25:.25),0,0);}
        else trim.translate(0,0,face+(facing<0?-.25:.25));
        b.put(trim,'trim');
      }
      if(near && !h.rect) {
        const lo=h.points[0][0],hi=h.points[1][0],bot=h.points[0][1],top=Math.max(...h.points.map(p=>p[1]));
        const r=(hi-lo)/2,spring=top-r,d=facing<0?.22:-.22;
        for(const a of [lo+r*.5,lo+r,lo+r*1.5]) {
          const endY=spring+Math.sqrt(Math.max(0,r*r-(a-(lo+hi)/2)**2));
          b.bar('bronze',coords(a,bot,d),coords(a,endY,d),.1,.1);
        }
        for(const y of [bot+2,spring-.3])b.bar('bronze',coords(lo,y,d),coords(hi,y,d),.12,.12);
      }
    }
  }
  function hall(x0,x1,z0,z1,h,west=[],east=[],south=[],north=[],base=0) {
    wall('x',x0,-z1,-z0,h,west,-1,base);wall('x',x1,-z1,-z0,h,east,1,base);
    wall('z',z0,x0+.8,x1-.8,h,north,-1,base);wall('z',z1,x0+.8,x1-.8,h,south,1,base);
  }
  const openings=(cs,w,bot,top,lit=true)=>cs.map(c=>({points:arch(c,w,bot,top),lit}));
  function hip(x0,x1,z0,z1,y,rise) {
    y+=.22;
    const alongX=x1-x0>z1-z0,half=Math.min(x1-x0,z1-z0)/2;
    const a=[x0,y,z0],c=[x1,y,z0],d=[x1,y,z1],e=[x0,y,z1];
    const p=alongX?[x0+half,y+rise,(z0+z1)/2]:[(x0+x1)/2,y+rise,z0+half];
    const q=alongX?[x1-half,y+rise,(z0+z1)/2]:[(x0+x1)/2,y+rise,z1-half];
    const fs=alongX?[[a,c,q,p],[c,d,q],[d,e,p,q],[e,a,p]]:[[a,c,p],[c,d,q,p],[d,e,q],[e,a,p,q]],pos=[];
    for(const f of fs)for(let i=1;i<f.length-1;i++) {
      let tri=[f[0],f[i],f[i+1]],vs=tri.map(p=>new THREE.Vector3(...p));
      if(vs[1].clone().sub(vs[0]).cross(vs[2].clone().sub(vs[0])).y<0)tri=[tri[0],tri[2],tri[1]];
      pos.push(...tri.flat());
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,'roof');
    box('stucco',x0,x1,y-.22,y,z0,z1);
    if(near) {
      if(new THREE.Vector3(...p).distanceTo(new THREE.Vector3(...q))>.01)b.bar('roof',p,q,.22,.22);
      // Sparse tile courses: sculpted same-material ridges, supported along each slope.
      for(let t=.15;t<.96;t+=.15) {
        const lerp=(a,c)=>new THREE.Vector3(...a).lerp(new THREE.Vector3(...c),t).toArray();
        if(alongX){b.bar('roof',lerp(a,p),lerp(c,q),.07,.07);b.bar('roof',lerp(e,p),lerp(d,q),.07,.07);}
        else {b.bar('roof',lerp(a,p),lerp(e,q),.07,.07);b.bar('roof',lerp(c,p),lerp(d,q),.07,.07);}
      }
    }
  }
  // Ticket hall: photo-calibrated 17.5m exterior eave; three 43-foot west arches.
  hall(-148.5,-117.8,-142.8,-98.3,17.5,openings([106,120.5,135],6.9,1,14.1),openings([106,120.5,135],6.9,1,14.1));
  hip(-148.9,-117.4,-143.2,-98.1,17.5,3.2);
  hall(-141.3,-126.6,-172.8,-142.8,8,openings([148,156,164],2.4,1.1,5.1));
  hip(-141.6,-126.3,-173,-143.1,8,2.2);
  // East passenger concourse, deliberately lower than the historic headhouse.
  hall(-64.1,-.1,-172.8,-28.3,6.6,
    openings([36,49,62,76,90,105,120,135,150,164],2.7,.8,4.7,false),
    openings([36,49,62,76,90,105,120,135,150,164],2.7,.8,4.7,false),
    openings([-55,-43,-31,-19,-7],3,.8,4.7,false),openings([-55,-43,-31,-19,-7],3,.8,4.7,false));
  hip(-64.3,.1,-173,-28.1,6.6,1.8);
  // Entry vestibule on Alameda; a single large entrance south of the clock tower.
  hall(-152.3,-127.2,-98.3,-67.4,14.5,openings([79.5],7.4,0.4,12.9));
  hip(-152.6,-126.9,-98.6,-67.1,14.5,3);
  // Waiting room runs east-west, between the north and south patios.
  hall(-117.5,-64.1,-100.4,-73.5,15.4,[],[],openings([-108,-95,-82,-70],4.7,1,10.2),openings([-108,-95,-82,-70],4.7,1,10.2));
  hip(-117.8,-63.8,-100.7,-73.2,15.4,3.1);
  // Fred Harvey range and the south patio's genuinely open arcade.
  hall(-144.2,-129.4,-33.3,8.4,8.5,openings([-1,10,21,29],3.5,1,6.7),openings([-1,10,21,29],3.5,1,6.7));
  hip(-144.5,-129.1,-33.6,8.7,8.5,2.3);
  hall(-128.6,-117.1,-33.3,4.6,6.3,[],openings([0,10,20,29],3,.3,5));
  hip(-128.9,-116.8,-33.6,4.8,6.3,1.4);
  hall(-152,-111.4,-43.3,-33.7,7,[],[],openings([-145,-136,-127,-118],3.8,.3,5.5));
  hip(-152.3,-111.1,-43.6,-33.4,7,1.3);
  const arcade=cs=>cs.map(c=>({points:arch(c,3.6,0,5.5),open:true}));
  hall(-111,-73.6,-38.5,-29.5,7,[],[],arcade([-106,-98,-90,-82]),arcade([-106,-98,-90,-82]));
  hip(-111.3,-73.3,-38.8,-29.2,7,1.3);
  hall(-73.6,-64.1,-41.4,-28.3,7);
  hip(-73.9,-63.8,-41.7,-28,7,1.3);
  // The separate OSM roof ways are canopies, not five-metre solid buildings.
  // Reconstruct their complete roof rings with columns grounded at local y=0.
  const canopyRings=CANOPY_FOOTPRINTS.map(r=>r.map(([lng,lat])=>{
    const dx=(lng+118.23525)*111319.49*Math.cos(34.05515*Math.PI/180),dz=-(lat-34.05515)*111319.49,a=-10*Math.PI/180;
    return [Math.cos(a)*dx-Math.sin(a)*dz,Math.sin(a)*dx+Math.cos(a)*dz];
  }));
  for(const ring of canopyRings) {
    const shape=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));
    const roof=new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:false,curveSegments:1});
    roof.rotateX(-Math.PI/2);roof.translate(0,4.6,0);b.put(roof,'stucco');
  }
  for(const z of [-29,-17,-5,7,19,31,43,49])for(const x of [-149,-145])box('stucco',x-.22,x+.22,0,4.6,z-.22,z+.22);
  for(const z of [-65,-55,-45])for(const x of [-140,-129])box('stucco',x-.25,x+.25,0,4.6,z-.25,z+.25);
  // North counterpart: preserve the mapped overhang past the wing, supported to grade.
  for(const z of [-146,-158,-170,-182,-194,-207,-210])for(const x of [-146.5,-142.4])box('stucco',x-.22,x+.22,0,4.6,z-.22,z+.22);
  // Tower: slim square shaft, projecting shoulder, open-windowed lantern and tile cap.
  const tx=-147.3,tz=-92.1;
  box('stucco',tx-4,tx+4,0,31.3,tz-4,tz+4);
  box('stucco',tx-4.25,tx+4.25,31.3,32.1,tz-4.25,tz+4.25);
  // Paired through-arches on every face: sky remains visible through the lantern in both LODs.
  const vent=c=>[-1.05,1.05].map(d=>({points:arch(c+d,1.4,32.5,35.3),open:true}));
  hall(tx-3.1667,tx+3.1667,tz-3.1667,tz+3.1667,35.7,vent(-tz),vent(-tz),vent(tx),vent(tx),32.1);
  box('stucco',tx-3.5,tx+3.5,35.7,36.1,tz-3.5,tz+3.5);
  hip(tx-3.75,tx+3.75,tz-3.75,tz+3.75,36.1,1.13);
  b.bar('bronze',[tx,37.4,tz],[tx,38.71,tz],.1,.1);
  // Four clocks: 12ft dial diameter. Bronze marks stand clear of the white shaft.
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2,coord=(u,y)=>[tx+u*Math.cos(a)+4.23*Math.sin(a),y,tz-u*Math.sin(a)+4.23*Math.cos(a)];
    for(let i=0;i<12;i++) {
      const a=i*Math.PI/6,r1=i%3===0?1.31:1.5,r2=1.8288;
      b.bar('bronze',coord(Math.sin(a)*r1,29.25+Math.cos(a)*r1),coord(Math.sin(a)*r2,29.25+Math.cos(a)*r2),near?.13:.19,.12);
    }
    const hub=new THREE.SphereGeometry(.19,near?8:6,near?6:4);hub.translate(...coord(0,29.25));b.put(hub,'bronze');
    b.bar('bronze',coord(0,29.25),coord(-.9,30.2),.16,.14);
    b.bar('bronze',coord(0,29.25),coord(.35,27.8),.13,.14);
  }
  for(const v of [-142.1,-128,-113.5,-99.2])box('stucco',-149.1,-148.4,0,17.0,v-.33,v+.33);
  // Palms within the two authored patio rings; each frond meets its grounded trunk.
  function palm(x,z,h) {
    b.bar('trunk',[x,0,z],[x,h,z],near?.32:.4,near?.32:.4,0,true);
    const n=near?9:5;
    for(let i=0;i<n;i++) {
      const a=i*2*Math.PI/n,r=3.9,p0=[x,h,z],p1=[x+Math.cos(a)*r*.55,h+.6,z+Math.sin(a)*r*.55],p2=[x+Math.cos(a)*r,h-1.4,z+Math.sin(a)*r];
      const n0=-Math.sin(a)*.6,n1=Math.cos(a)*.6;
      const pos=[...p0,p1[0]+n0,p1[1],p1[2]+n1,...p2,...p0,...p2,p1[0]-n0,p1[1],p1[2]-n1],rev=[];
      for(let j=0;j<pos.length;j+=9)rev.push(...pos.slice(j,j+3),...pos.slice(j+6,j+9),...pos.slice(j+3,j+6));
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...pos,...rev],3));g.computeVertexNormals();b.put(g,'foliage');
    }
  }
  for(const [x,z,h] of [[-108,-120,15],[-93,-120,16],[-78,-120,14],[-102,-55,14],[-88,-55,16],[-75,-55,15]])palm(x,z,h);
  const model=b.finish();
  for(const mesh of model.children){mesh.geometry.deleteAttribute('bridgeLift');mesh.geometry.translate(100,0,85);mesh.geometry.rotateY(-10*Math.PI/180);mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  return model;
}
