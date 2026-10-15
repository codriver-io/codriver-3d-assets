import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { TAU, frame, perimeter as P, aperture as A, hub, roofPoint as R } from './arena-nationala-frame.js';

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), n=near?160:80;
  const fold=m=>!near&&m==='yellow'?'upper':!near&&m==='paint'?'concrete':m;
  const contacts=[];
  function quad(m,a,c,d,e,want) {
    const cross=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));
    const flip=cross.dot(new THREE.Vector3(...want))<0,g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));
    g.setIndex(flip?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,fold(m));
  }
  const bar=(m,a,c,w,d=w)=>b.bar(fold(m),a,c,w,d);
  function ring(m,f,y,g,h,facing='out',count=n) {
    for(let i=0;i<count;i++) {
      const t=TAU*i/count,s=TAU*(i+1)/count,dir=P((t+s)/2,1,0);
      quad(m,P(t,f,y),P(s,f,y),P(s,g,h),P(t,g,h),facing==='up'?[0,1,0]:facing==='down'?[0,-1,0]:facing==='in'?dir.map(v=>-v):dir);
    }
  }
  function torus(m,at,radius,count=80) {
    // Closed low-poly elliptical/polyline torus; no disconnected rail ends.
    const sides=near?6:3;
    for(let i=0;i<count;i++)for(let k=0;k<sides;k++) {
      const t=TAU*i/count,s=TAU*(i+1)/count,a=TAU*k/sides,c=TAU*(k+1)/sides;
      const pt=(q,v)=>{const p=at(q),rad=new THREE.Vector3(p[0],0,p[2]).normalize();return [p[0]+radius*Math.cos(v)*rad.x,p[1]+radius*Math.sin(v),p[2]+radius*Math.cos(v)*rad.z];};
      quad(m,pt(t,a),pt(s,a),pt(s,c),pt(t,c),[Math.cos((t+s)/2)*Math.cos((a+c)/2),Math.sin((a+c)/2),Math.sin((t+s)/2)*Math.cos((a+c)/2)]);
    }
  }
  // Bounded structural apron, not the surrounding landscaped berm.
  ring('concrete',.995,0,.995,.65);ring('concrete',.995,.65,.60,.65,'up');
  // Facade is recessed behind its tall outer columns, with separate glazed gate bays.
  ring('shadow',.89,.65,.89,10.5);ring('concrete',.89,10.5,.91,12.2);
  ring('concrete',.91,12.2,.91,16.2);ring('seats',.91,16.2,.91,21.6);
  ring('concrete',.91,21.6,.91,27.5);ring('concrete',.91,27.5,.89,31);
  ring('concrete',.89,31,.82,31,'up');ring('concrete',.82,31,.82,29,'in');
  // Two concourse ledges terminate in the piers. Red fascia is an exterior identity detail.
  for(const y of [11,22]) {
    ring('concrete',.91,y,.975,y,'down');ring('concrete',.975,y,.975,y+.65);
    ring('concrete',.975,y+.65,.91,y+.65,'up');
  }
  // Continuous lower arcade cap supports every short pier and narrow louvre.
  ring('concrete',.91,34,.975,34,'down');ring('concrete',.975,34,.975,34.6);
  ring('concrete',.975,34.6,.91,34.6,'up');
  // Ground gates retain their own bay rhythm at far rather than one continuous bright stripe.
  for(let i=0;i<80;i++) {
    const t=TAU*i/80,s=TAU*(i+1)/80;
    if(i%4!==3)quad('glow',P(t+.008,.893,1),P(s-.008,.893,1),P(s-.008,.893,8.6),P(t+.008,.893,8.6),P((t+s)/2,1,0));
  }
  // 80 alternating tall/short concrete piers; another 80 narrow louvres near.
  for(let i=0;i<80;i++) {
    const t=TAU*i/80,h=i%2===0?54.7:34.5;
    bar('concrete',P(t,.965,.65),P(t,.965,h),1.55,1.7);
    if(near)bar('concrete',P(t+TAU/160,.965,.65),P(t+TAU/160,.965,34.5),.45,.75);
  }
  // Lower red/yellow, upper blue/yellow seating, with open aisles and a hospitality gap.
  function seatBowl(r0,r1,y0,y1,rows,upper) {
    const sectors=near?120:40;
    for(let j=0;j<rows;j++) {
      const f=j/rows,g=(j+1)/rows, r=r0+(r1-r0)*f,q=r0+(r1-r0)*g,y=y0+(y1-y0)*f,h=y0+(y1-y0)*g;
      for(let i=0;i<sectors;i++) {
        const t=TAU*i/sectors,s=TAU*(i+1)/sectors;
        const seat=upper?'upper':'seats',m=i%(sectors/20)===0?'concrete':near&&(i*17+j*31)%13<3?'yellow':seat;
        // Far keeps 3° aisles rather than widening them to a whole coarse 9° sector.
        const parts=!near&&m==='concrete'?[[t,t+TAU/120,'concrete'],[t+TAU/120,s,seat]]:[[t,s,m]];
        for(const [a,c,material] of parts) {
          quad(material,P(a,r,y),P(c,r,y),P(c,q,y),P(a,q,y),[0,1,0]);
          quad(material,P(a,q,y),P(c,q,y),P(c,q,h),P(a,q,h),P((a+c)/2,-1,0));
        }
      }
    }
  }
  seatBowl(.48,.69,1.5,15.5,near?12:3,false);
  ring('concrete',.69,15.5,.72,15.5,'up');ring('shadow',.72,15.5,.72,19);
  seatBowl(.72,.865,19,33.5,near?12:3,true);
  ring('concrete',.865,33.5,.89,33.5,'up');ring('concrete',.865,33.5,.865,31,'in');
  // A rounded playing-field apron fills under the seating and 105 × 68 m pitch.
  const floor=new THREE.CircleGeometry(1,near?80:40);floor.rotateX(-Math.PI/2);floor.scale(52,1,72);floor.translate(0,.7,0);b.put(floor,'shadow');
  const pitch=new THREE.PlaneGeometry(68,105);pitch.rotateX(-Math.PI/2);pitch.rotateY(3.1*Math.PI/180);pitch.translate(0,.8,0);b.put(pitch,'turf');
  if(near) {
    const line=(u,v,x,z)=>quad('paint',frame(u,.95,v),frame(x,.95,z),frame(x+.16,.95,z+.16),frame(u+.16,.95,v+.16),[0,1,0]);
    for(const x of [-34,34])line(x,-52.5,x,52.5);
    for(const z of [-52.5,0,52.5])line(-34,z,34,z);
    for(const z of [-52.5,52.5]) {const end=z>0?36:-36;line(-20.16,z,-20.16,end);line(20.16,z,20.16,end);line(-20.16,end,20.16,end);}
    const circle=new THREE.RingGeometry(9.05,9.23,40);circle.rotateX(-Math.PI/2);circle.translate(0,.96,0);b.put(circle,'paint');
  }
  // 40 scalloped membrane bays: outer boundary lower than the compression ring.
  const angular=near?4:2,radial=near?8:2;
  for(let i=0;i<40*angular;i++)for(let j=0;j<radial;j++) {
    const t=TAU*i/(40*angular),s=TAU*(i+1)/(40*angular),r=j/radial,q=(j+1)/radial;
    quad('roof',R(t,r),R(s,r),R(s,q),R(t,q),[0,1,0]);
    quad('roof',R(t,r,true),R(s,r,true),R(s,q,true),R(t,q,true),[0,-1,0]);
  }
  for(let i=0;i<40*angular;i++) {
    const t=TAU*i/(40*angular),s=TAU*(i+1)/(40*angular);
    quad('roof',R(t,0,true),R(s,0,true),R(s,0),R(t,0),P(t,1,0));
    quad('roof',R(t,1),R(s,1),R(s,1,true),R(t,1,true),P(t,-1,0));
  }
  // Recessed upper-tier backing: the scallops frame a dark void from the road.
  // Top edge meets the actual LOD fabric triangles, rather than piercing the roof.
  const backR=.17,lo=Math.floor(backR*radial)/radial,hi=lo+1/radial;
  const backTop=t=>new THREE.Vector3(...R(t,lo,true)).lerp(new THREE.Vector3(...R(t,hi,true)),(backR-lo)*radial).toArray();
  for(let i=0;i<40*angular;i++) {
    const t=TAU*i/(40*angular),s=TAU*(i+1)/(40*angular),a=backTop(t),c=backTop(s);
    quad('shadow',[a[0],31,a[2]],[c[0],31,c[2]],c,a,P((t+s)/2,1,0));
  }
  torus('concrete',t=>P(t,.965,54.4),.6,near?80:40);
  torus('concrete',t=>A(t,44),.6,near?80:40);
  // The inner tension ring is carried by all 40 radial stays. Ends are pinned by tests
  // against ring tubes, piers and the storage hub, excluding the cable material.
  for(let i=0;i<40;i++) {
    const t=TAU*i/40,a=P(t,.965,54.4),c=A(t,44),steps=near?8:2;
    let last=a;
    for(let j=1;j<=steps;j++) {
      const f=j/steps,p=[a[0]*(1-f)+c[0]*f,54.4*(1-f)+44*f-1.8*Math.sin(Math.PI*f),a[2]*(1-f)+c[2]*f];
      bar('steel',last,p,near?.19:.26);last=p;
    }
    // Inward retraction lines are attached to the inner ring and the central package.
    bar('steel',c,hub(t),near?.13:.20);
    contacts.push({name:'radial-stay-'+i,ends:[a,c],supports:['outer-compression-ring','inner-tension-ring']});
    contacts.push({name:'retraction-line-'+i,ends:[c,hub(t)],supports:['inner-tension-ring','central-storage-package']});
    if(near) {
      const ends=[A(t,43.75),A(t+.018,43.75)];bar('lamp',...ends,.32);
      contacts.push({name:'floodlight-'+i,ends,supports:['inner-tension-ring','inner-tension-ring']});
    }
  }
  // Folded retractable central fabric and the four-sided video cube: no closed canopy.
  const pod=new THREE.CylinderGeometry(5.7,5.1,2.4,near?40:20);pod.translate(0,46.5,0);b.put(pod,'roof');
  b.box('shadow',[0,41.9,0],[7.8,5.4,7.8]);
  for(const x of [-2.5,2.5]) {
    const ends=[[x,44.6,0],[x,45.3,0]];bar('steel',...ends,.24);
    contacts.push({name:'video-hanger-'+x,ends,supports:['video-cube','central-storage-package']});
  }
  const root=b.finish();root.userData.contacts=contacts;
  // Weld the fabric to smooth its original cushion surfaces without softening columns.
  const mesh=root.children.find(o=>o.material.name==='roof');mesh.geometry.deleteAttribute('normal');
  const welded=mergeVertices(mesh.geometry,.0001);mesh.geometry.dispose();mesh.geometry=welded;welded.computeVertexNormals();welded.computeBoundingBox();welded.computeBoundingSphere();
  return root;
}
