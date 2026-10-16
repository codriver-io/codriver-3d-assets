import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { BLOCKS, ANGLE } from './pavillon-roger-gaudry-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const box=(m,u,y,v,w,h,d)=>b.box(m,[u,y,v],[w,h,d]);
  function quad(m,pts){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(pts[2].every((v,i)=>v===pts[3][i])?[0,1,2]:[0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,m);}
  function rect(m,x,y,w,h,d,a=0){const g=new THREE.PlaneGeometry(w,h);g.translate(x,y,d);g.rotateY(a);b.put(g,m);}
  function face(m,shape,d,a){const g=new THREE.ShapeGeometry(shape);g.translate(0,0,d);g.rotateY(a);b.put(g,m);}
  // Strip apertures have one reveal per bay, with separate glazed rows and recessed
  // masonry spandrels. No stacked surface overlays or per-window sash geometry.
  function wall(cx,d,a,len,low,high,{tower=false,slotPitch=4.25,slotWidth=1.4,entry=false,solarium=false}={}) {
    if(high-low<.1)return;
    const shape=new THREE.Shape();shape.moveTo(cx-len/2,low);shape.lineTo(cx+len/2,low);shape.lineTo(cx+len/2,high);shape.lineTo(cx-len/2,high);shape.closePath();
    const aperture=(x,bottom,top,w,depth,panes)=>{
      const left=x-w/2,right=x+w/2,p=new THREE.Path();
      p.moveTo(left,bottom);p.lineTo(left,top);p.lineTo(right,top);p.lineTo(right,bottom);p.closePath();shape.holes.push(p);
      const surface=(m,points)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();g.rotateY(a);b.put(g,m);};
      surface('brick',[[left,bottom,d],[left,bottom,d-depth],[left,top,d-depth],[left,top,d]]);
      surface('brick',[[right,top,d],[right,top,d-depth],[right,bottom,d-depth],[right,bottom,d]]);
      surface('brick',[[left,bottom,d-depth],[left,bottom,d],[right,bottom,d],[right,bottom,d-depth]]);
      surface('brick',[[left,top,d],[left,top,d-depth],[right,top,d-depth],[right,top,d]]);
      let y=bottom;
      for(const [lo,hi,mat] of panes){
        if(lo>y)rect('spandrel',x,(y+lo)/2,w,lo-y,d-depth,a);
        rect(mat,x,(lo+hi)/2,w,hi-lo,d-depth,a);y=hi;
      }
      if(y<top)rect('spandrel',x,(y+top)/2,w,top-y,d-depth,a);
    };
    if(tower){
      // Equal-width, deeply recessed slots remain legible with shared unlit shading.
      for(const x of [-slotPitch,0,slotPitch])
        aperture(cx+x,low+.25,high-.25,slotWidth,1.25,[[low+.25,high-.25,'glass']]);
    }else{
      const count=Math.floor((len-.8)/(solarium?(near?2.4:4.8):(near?3.2:6.4))),step=len/Math.max(1,count);
      for(let i=0;i<count;i++){
        const x=cx+(i-(count-1)/2)*step;
        if(entry&&Math.abs(x)<11)continue;
        const rows=[];
        const half=near||solarium?1.3:3.2, stepY=near||solarium?3.8:7.6;
        for(let y=Math.max(low+half+.7,half+1.4);y<high-half;y+=stepY)
          if(y-half>low&&y+half<high)rows.push([y-half,y+half,'glass']);
        if(rows.length)aperture(x,rows[0][0],rows.at(-1)[1],solarium?step-.45:1.45,near?.5:.6,rows);
      }
    }
    if(entry)for(const x of [-7,0,7]){
      aperture(x,1.2,7,2.5,.65,[[1.2,6,'bronze'],[6,7,'glass']]);
      aperture(x,9,24.5,1.8,.9,[[9,12.8,'glass'],[13.6,17.4,'glass'],[18.2,22,'glass'],[22.8,24.5,'glass']]);
    }
    face('brick',shape,d,a);
  }
  // Union cells omit internal walls; boundary segments merge before generating windows.
  const us=[...new Set(BLOCKS.flatMap(p=>p.slice(0,2)))].sort((a,b)=>a-b),vs=[...new Set(BLOCKS.flatMap(p=>p.slice(2,4)))].sort((a,b)=>a-b);
  const heights=us.slice(1).map((u,i)=>vs.slice(1).map((v,j)=>Math.max(0,...BLOCKS.filter(p=>(u+us[i])/2>p[0]&&(u+us[i])/2<p[1]&&(v+vs[j])/2>p[2]&&(v+vs[j])/2<p[3]).map(p=>p[4]))));
  const h=(i,j)=>heights[i]?.[j]||0,segments=[];
  for(let i=0;i<us.length-1;i++)for(let j=0;j<vs.length-1;j++){
    const top=h(i,j);if(!top)continue;
    const [u0,u1,v0,v1]=[us[i],us[i+1],vs[j],vs[j+1]];
    quad('roof',[[u0,top,v0],[u0,top,v1],[u1,top,v1],[u1,top,v0]]);
    for(const [adj,a,d,s0,s1] of [[h(i,j+1),0,v1,u0,u1],[h(i,j-1),Math.PI,-v0,-u1,-u0],[h(i+1,j),Math.PI/2,u1,-v1,-v0],[h(i-1,j),-Math.PI/2,-u0,v0,v1]])
      if(top>adj)segments.push({a,d,low:adj,top,s0,s1});
  }
  segments.sort((p,q)=>p.a-q.a||p.d-q.d||p.low-q.low||p.top-q.top||p.s0-q.s0);
  const merged=[];for(const p of segments){const last=merged.at(-1);if(last&&last.a===p.a&&last.d===p.d&&last.low===p.low&&last.top===p.top&&Math.abs(last.s1-p.s0)<.001)last.s1=p.s1;else merged.push({...p});}
  for(const p of merged){
    const len=p.s1-p.s0,c=(p.s0+p.s1)/2,base=p.low===0?.8:p.low;
    wall(c,p.d,p.a,len,base,p.top-.2,{solarium:p.top===7,entry:p.a===Math.PI&&p.d===14.5});
    if(p.low===0)rect('stone',c,.4,len,.8,p.d,p.a);
    rect('metal',c,p.top-.1,len,.2,p.d,p.a);
  }
  // Auditorium hip roof, subordinate to the central tower.
  quad('roof',[[-15,14,6],[-15,14,47],[0,22,39],[0,22,14]]);
  quad('roof',[[15,14,47],[15,14,6],[0,22,14],[0,22,39]]);
  quad('roof',[[-15,14,47],[15,14,47],[0,22,39],[0,22,39]]);
  quad('roof',[[15,14,6],[-15,14,6],[0,22,14],[0,22,14]]);
  // The crown occupies 20 m of the 46 m tower above the wings (43%).
  // Shaft fins and the crown's fluted piers all terminate on their named ledges.
  for(let f=0;f<4;f++){
    const a=f*Math.PI/2,w=f%2?16:14,d=f%2?7:8;
    wall(0,d,a,w,24,50,{tower:true});
    for(const x of [-w/2+1.1,w/2-1.1]) {
      const g=new THREE.BoxGeometry(.8,26,.9);g.translate(x,37,d+.45);g.rotateY(a);b.put(g,'brick');
    }
  }
  function ledge(y,w,d,innerW=0,innerD=0){
    const s=new THREE.Shape();s.moveTo(-w/2,-d/2);s.lineTo(w/2,-d/2);s.lineTo(w/2,d/2);s.lineTo(-w/2,d/2);s.closePath();
    if(innerW){const p=new THREE.Path();p.moveTo(-innerW/2,-innerD/2);p.lineTo(-innerW/2,innerD/2);p.lineTo(innerW/2,innerD/2);p.lineTo(innerW/2,-innerD/2);p.closePath();s.holes.push(p);}
    const g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);g.translate(0,y,0);b.put(g,'brick');
  }
  const stages=[[13,15,50,55,1.4],[11,13,55,60,1.3],[9,11,60,69.5,1.6]];
  ledge(50,15.8,17.8,13,15);
  for(let i=0;i<stages.length;i++){
    const [width,depth,low,high,slotWidth]=stages[i];
    for(let f=0;f<4;f++){
      const a=f*Math.PI/2,w=f%2?depth:width,d=(f%2?width:depth)/2;
      wall(0,d,a,w,low,high,{tower:true,slotPitch:w*.27,slotWidth});
      // Four continuous ribs rise out of each setback ledge, framing three slots.
      for(const x of [-w/2+.35,-w*.135,w*.135,w/2-.35]){
        const g=new THREE.BoxGeometry(.55,high-low,.45);g.translate(x,(low+high)/2,d+.225);g.rotateY(a);b.put(g,'brick');
      }
    }
    const next=stages[i+1];ledge(high,width+.9,depth+.9,next?.[0]||0,next?.[1]||0);
  }
  // Small supported metal finial; no dark cap slab or grey dome.
  box('metal',0,69.75,0,.12,.5,.12);
  // Ceremonial bronze doors, transoms, stone jambs and attached metal canopies.
  for(const u of [-7,0,7]){

    for(const x of [-1.7,1.7])box('stone',u+x,4.3,-14.85,.32,6.6,.7);
    box('stone',u,7.65,-14.85,3.9,.35,.7);
    box('metal',u,6.9,-15.05,3.6,.18,1.2);

  }
  for(let i=0;i<8;i++)box('stone',0,(i+1)*.1,-18+i*.48,23,(i+1)*.2,.5);
  for(const u of [-11,-3.5,3.5,11])box('brick',u,14.9,-14.85,.55,28.2,.7);
  // Cormier's rooftop water-tank/stair blocks break the broad horizontal wings.
  for(const u of [-82,83]){
    for(const [w,d,low,high] of [[15,16,24,32],[10,11,32,38],[6,8,38,42]]){
      for(let f=0;f<4;f++){const a=f*Math.PI/2,len=f%2?d:w,depth=f%2?w/2:d/2;const center=f%2?26*(f===1?1:-1):u*(f===0?1:-1);const offset=f%2?u*(f===1?1:-1):-26*(f===0?1:-1);wall(center,depth+offset,a,len,low,high);}
      quad('roof',[[u-w/2,high,-26-d/2],[u-w/2,high,-26+d/2],[u+w/2,high,-26+d/2],[u+w/2,high,-26-d/2]]);
    }
  }
  const root=b.finish();root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.rotateY(ANGLE);o.geometry.deleteAttribute('bridgeLift');o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
