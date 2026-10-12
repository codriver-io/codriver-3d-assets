import * as THREE from 'three';
import { FOOTPRINTS } from './footprint.js';
import { localRing } from './westerkerk-parts.js';

const FACES=['south','north','west','east'];
export function buildWesterkerk(k) {
  const {near}=k;
  // Main church: a longitudinal high nave crossed by TWO identical north/south transepts.
  const naveU=30.6,naveHalf=6.8,aisleHalf=14.75,u0=5.5,u1=55.7;
  const transepts=[18.55,42.5],tw=9.9;
  const win=(a,bottom,width,height,options={})=>({a,bottom,width,height,...options});
  for(const face of ['south','north']) {
    k.wall(face,29.65,aisleHalf,48.3,0,12.4,Array.from({length:6},(_,i)=>win(10.5+i*7.85,3.5,3.9,7.7)));
    k.surfaceBar(face,29.65,1.1,48.3,0.5,aisleHalf+0.25);
    k.surfaceBar(face,29.65,12.3,48.3,0.55,aisleHalf+0.25);
    // Clerestory bays between transepts, visible above the low aisle roof.
    for(const [a,width,ws] of [[8.7,6.4,[8.7]],[30.6,13.9,[26.9,34.3]],[51.9,7.6,[51.9]]]) {
      k.wall(face,a,naveHalf,width,15.2,9.8,ws.map(x=>win(x,17,3.5,6.8)));
      k.surfaceBar(face,a,25,width,0.45,naveHalf+0.25);
    }
  }
  // End elevations around the tower and at the eastern end.
  k.wall('east',0,53.8,29.3,0,12.4,[win(-8.5,3.5,3.9,7.7),win(9.3,3.5,3.9,7.7),win(0,1.2,3.2,6.3,{mat:'recess',mullions:false})]);
  k.wall('east',0,u1,13.6,12.4,12.6,[win(0,16,5,8)]);
  k.gable('east',0,u1+0.1,13.6,25,34);
  k.wall('west',-10.4,-u0,8,0,12.4,[win(-10.4,3.5,3.7,7.7)]);
  k.wall('west',10.4,-u0,8,0,12.4,[win(10.4,3.5,3.7,7.7)]);
  k.roof(naveU,0,50.2,13.6,25,34);
  // Lean-to aisle roofs: no slab over the nave windows.
  for(const s of [-1,1]) {
    const p=[[u0,12.4,s*aisleHalf],[53.8,12.4,s*aisleHalf],[u0,15.4,s*naveHalf],[53.8,15.4,s*naveHalf]];
    k.poly('roof',p,s>0?[0,1,2,1,3,2]:[0,2,1,1,2,3]);
  }
  for(const u of transepts) {
    for(const face of ['north','south']) {
      k.wall(face,u,aisleHalf,tw,12.4,12.6,[win(u,15.1,5.45,9.6)]);
      k.gable(face,u,aisleHalf+0.12,tw,25,33);
      k.window(face,u,28.4,0.9,1.5,aisleHalf+0.31,{mat:'recess',mullions:false});
      for(const sign of [-1,1]) {
        k.arc('stone',[u+sign*3.0,27.1,face==='south'?aisleHalf:-aisleHalf],0.65,0,Math.PI*1.8,0.24);
        k.surfaceBar(face,u+sign*3.0,26.2,1.9,0.4,aisleHalf+0.32);
      }
      k.surfaceBar(face,u,13.1,tw,0.55,aisleHalf+0.3);
      k.surfaceBar(face,u,25,tw,0.45,aisleHalf+0.3);
      // Profiled pilasters flanking each large transept window.
      for(const dx of [-tw/2+0.45,tw/2-0.45]) {
        const v=face==='south'?aisleHalf+0.22:-aisleHalf-0.22;
        k.box('stone',[u+dx,19.3,v],[0.6,12.1,0.48]);
        for(const y of [14,24.9])k.box('stone',[u+dx,y,v],[1.1,0.6,0.7]);
      }
      // Dutch Renaissance stepped/curved gable crest, short scroll wings and terminal urn.
      const v=face==='south'?aisleHalf:-aisleHalf;
      for(const s of [-1,1]) {
        k.box('stone',[u+s*1.65,31.1,v],[1.2,0.55,0.68]);
        k.arc('stone',[u+s*1.65,31.65,v],0.65,0,Math.PI*1.55,0.2);
      }
      k.box('stone',[u,33.1,v],[1.4,0.55,0.85]);
      k.cylinder('stone',u,v,33.35,0.45,0.25,0.18);
      k.ball('stone',u,34.05,v,0.4,[0.75,1.15,0.75]);
    }
    // Transverse roof ridges, approximately the OSM 33 m parts.
    const p=[[u-tw/2,25,-aisleHalf],[u-tw/2,25,aisleHalf],[u,33,-aisleHalf],[u,33,aisleHalf],[u+tw/2,25,-aisleHalf],[u+tw/2,25,aisleHalf]];
    k.poly('roof',p,[0,1,2,1,3,2,2,3,4,3,5,4]);
    k.bar('metal',p[2],p[3],0.15);
  }
  // Stone-banded brick piers on the mapped south nibs and unobstructed north-east bays.
  for(const s of [-1,1])for(let i=0;i<7;i++) {
    const u=4.8+i*7.94,v=s*15.35;
    if(s<0&&u<38)continue; // low irregular northern vestry owns this frontage
    k.box('brick',[u,6.05,v],[1.2,12.1,1.2]);
    for(const y of [0.8,4.8,8.9,12.2])k.box('stone',[u,y,v],[1.35,0.45,1.35]);
    k.box('stone',[u,13,v],[1.6,0.55,1.6]);
  }
  // Low northern vestry follows its mapped irregular outline, not a rectangular plaza pad.
  const north=localRing(FOOTPRINTS[6]);
  k.solid('brick',north,0,4.6);k.solid('roof',north,4.6,5);
  // The two attached houses at the tower are modeled; nearby kiosks stay provider-owned.
  for(const [index,h] of [[12,11.8],[13,10.4]]) {
    const ring=localRing(FOOTPRINTS[index]);const us=ring.map(p=>p[0]),vs=ring.map(p=>p[1]);
    const u=(Math.max(...us)+Math.min(...us))/2,v=(Math.max(...vs)+Math.min(...vs))/2;
    k.solid('brick',ring,0,h);
    const midU=(Math.min(...us)+Math.max(...us))/2,midV=(Math.min(...vs)+Math.max(...vs))/2;
    const roofShape=new THREE.BufferGeometry();const points=[];for(const [x,z] of ring.slice(0,-1))points.push(x,h,z);points.push(midU,h+2.2,midV);const n=points.length/3-1,idx=[];for(let i=0;i<n;i++)idx.push(i,n,(i+1)%n);roofShape.setAttribute('position',new THREE.Float32BufferAttribute(points,3));roofShape.setIndex(idx);roofShape.computeVertexNormals();k.put(roofShape,'roof');
    // Separate coarser rectangular panes on the attached houses, visible in both LODs.
    // Pane offset 52 cm clears the far depth threshold, with thin near mullions only.
    for(const face of ['west',v>0?'south':'north']) {
      const depth=(face==='west'?-Math.min(...us):Math.max(...vs.map(Math.abs)))+0.52;
      const center=face==='west'?midV:midU;
      for(let row=0;row<3;row++)for(const dx of [-2.1,0,2.1]) {
        const a=center+dx,y=2.05+row*3;
        k.surfaceBar(face,a,y,1.1,1.7,depth,'glass');
        if(near) {
          k.bar('stone',k.facePoint(face,a,y-0.85,depth+0.04),k.facePoint(face,a,y+0.85,depth+0.04),0.07);
          k.bar('stone',k.facePoint(face,a-0.55,y,depth+0.04),k.facePoint(face,a+0.55,y,depth+0.04),0.07);
        }
      }
    }
  }
  // Tower's weathered sandstone reads grey, distinct from the church's pale dressed bands.
  const tower={...k};for(const name of ['put','box','bar','cylinder','ball','arc','surfaceBar','squareLoft'])tower[name]=(...args)=>{if(args[0]==='stone')args[0]='metal';else if(args[0]==='pearl')args[0]='stone';return k[name](...args);};
  buildTower(tower);
}
function buildTower(k) {
  const {near}=k;
  // Brick shaft, with paired louvered belfry windows above the tall blind lower niches.
  for(const face of FACES) {
    const windows=[{a:0,bottom:6,width:3.4,height:15,mat:'stone',mullions:false},...[-1.55,1.55].map(a=>({a,bottom:29,width:2.05,height:8,mat:'recess',mullions:false}))];
    if(face==='west')windows.push({a:0,bottom:0.5,width:2.8,height:4.5,mat:'recess',mullions:false});
    k.wall(face,0,5.4,10.8,0,39.5,windows);
    for(const y of [1,23.2,27,39.3])k.surfaceBar(face,0,y,10.8,0.55,5.65);
    for(const a of [-4.9,4.9])k.surfaceBar(face,a,19.8,0.65,38.5,5.66);
    if(near)for(const a of [-1.55,1.55])for(let y=29.5;y<35.9;y+=0.6)k.surfaceBar(face,a,y,1.9,0.18,5.47,'metal');
  }
  k.box('stone',[0,39.75,0],[11.1,0.5,11.1]);
  balcony(k,40,10.8,1.45);
  // Solid stone stage with applied civic arms and corner columns.
  k.box('stone',[0,46.7,0],[8.2,10.8,8.2]);
  for(const face of FACES) {
    // Relieved central arch panel lies proud of the masonry, with a subdued blue surround.
    k.window(face,0,43,3.4,6.7,4.36,{mat:'metal',mullions:false});
    k.surfaceBar(face,0,46,1.85,3.1,4.65,'blue');
    k.surfaceBar(face,0,46,0.73,2.1,4.72,'recess');
    for(const y of [45.25,46,46.75])for(const s of [-1,1]){
      k.bar('pearl',k.facePoint(face,-0.25,y+s*0.24,4.77),k.facePoint(face,0.25,y-s*0.24,4.77),0.12);
    }
  }
  for(const x of [-3.65,3.65])for(const z of [-3.65,3.65]) {
    k.cylinder('metal',x,z,41.45,9.6,0.44);
    k.box('stone',[x,41.7,z],[1.05,0.5,1.05]);k.box('stone',[x,51,z],[1.2,0.6,1.2]);
  }
  k.box('stone',[0,51.7,0],[9.4,0.65,9.4]);
  k.box('metal',[0,52.18,0],[9.9,0.32,9.9]);
  openStage(k,52.34,63.05,7.2,true);
  k.box('stone',[0,63.38,0],[8.65,0.66,8.65]);
  balcony(k,63.71,7.3,1.15);
  openStage(k,64.86,72.2,4.9,false);
  k.box('stone',[0,72.5,0],[6.15,0.6,6.15]);
  k.squareLoft('metal',[[72.8,6.1],[73.35,5.5],[74,4.1],[74.8,3],[75.6,2.4],[76.2,2.4]]);
  k.box('stone',[0,76.2,0],[2.8,0.25,2.8]);
  // Maximilian's BLUE imperial crown: bulging cap, golden circlet, four crossing ribs, orb and vane.
  k.cylinder('gold',0,0,76.325,0.45,1.58);
  const crown=new THREE.SphereGeometry(1.65,near?20:12,near?12:6,0,Math.PI*2,0,Math.PI/2);
  crown.scale(1,1.55,1);crown.translate(0,76.75,0);k.put(crown,'blue');
  k.cylinder('blue',0,0,76.75,0.38,1.65);
  for(const face of ['z','x']) {
    const n=near?16:8;
    const p=[];for(let i=0;i<=n;i++){const t=Math.PI*i/n;const xyz=face==='z'?[1.7*Math.cos(t),76.78+2.58*Math.sin(t),0]:[0,76.78+2.58*Math.sin(t),1.7*Math.cos(t)];p.push(xyz);if(i)k.bar('gold',p[i-1],xyz,near?0.14:0.19);}
  }
  for(let i=0;i<(near?16:8);i++) {
    const t=i*Math.PI*2/(near?16:8),x=1.62*Math.cos(t),z=1.62*Math.sin(t);
    k.cylinder('gold',x,z,76.55,0.7,0.13,0.07);k.ball('pearl',x,77.28,z,0.14);
  }
  k.cylinder('gold',0,0,79.24,0.3,0.17);k.ball('gold',0,80.03,0,0.55);
  k.bar('metal',[0,80.3,0],[0,86.2,0],0.105);
  k.bar('gold',[-0.5,81.05,0],[0.5,81.05,0],0.11);
  k.bar('gold',[-0.65,82.4,-0.65],[0.65,82.4,0.65],0.08);
  // Original small rooster silhouette; overall highest point is 87 m, including its comb.
  k.ball('gold',0,86.3,0,0.4,[1.1,0.6,0.25]);
  k.ball('gold',-0.33,86.63,0,0.19,[0.55,1.9,0.55]);
  k.poly('gold',[[-0.43,86.83,0],[-0.29,87,0],[-0.21,86.83,0],[-0.55,86.73,0],[-0.25,86.7,0],[-0.57,86.67,0]],[0,1,2,3,4,5,2,1,0,5,4,3]);
  k.arc('gold',[0.34,86.35,0],0.36,-Math.PI/2,Math.PI/2,0.105);
}
function balcony(k,y,width,height) {
  k.box('stone',[0,y+0.18,0],[width+0.35,0.36,width+0.35]);
  for(const face of FACES) {
    const half=width/2-0.14,n=k.near?11:5;
    k.bar('stone',k.facePoint(face,-half,y+height,half),k.facePoint(face,half,y+height,half),0.26);
    for(let i=0;i<=n;i++) {
      const a=-half+(2*half)*i/n,[x,,z]=k.facePoint(face,a,y,half);
      k.cylinder('stone',x,z,y+0.35,height-0.35,0.12,0.1);
      if(k.near)k.ball('stone',x,y+height*0.55,z,0.17,[0.7,1.6,0.7]);
    }
  }
}
function openStage(k,bottom,top,width,clock) {
  const half=width/2,upper=top-0.25,r=width*0.215,spring=upper-r;
  for(const x of [-half,half])for(const z of [-half,half]) {
    k.cylinder('stone',x,z,bottom,upper-bottom,clock?0.43:0.31);
    for(const y of [bottom+0.2,upper-0.15])k.box('stone',[x,y,z],[clock?1.05:0.78,0.4,clock?1.05:0.78]);
  }
  // Twin semicircular openings and a central mullion on EVERY side; no opaque belfry box.
  for(const face of FACES) {
    const low=clock?bottom+3.75:bottom+0.75;
    k.bar('stone',k.facePoint(face,0,low,half),k.facePoint(face,0,spring,half),clock?0.32:0.22);
    for(const s of [-1,1]) {
      const center=k.facePoint(face,s*r,spring,half);
      k.arc('stone',center,r,0,Math.PI,clock?0.31:0.23,face==='north'||face==='south'?'z':'x');
    }
    if(clock) {
      k.surfaceBar(face,0,bottom+1.85,3.7,3.7,half+0.45,'brick');
      for(const dx of [-1.96,1.96])k.bar('stone',k.facePoint(face,dx,bottom-0.05,half+0.45),k.facePoint(face,dx,bottom+3.82,half+0.45),0.22);
      k.bar('stone',k.facePoint(face,-2,bottom-0.02,half+0.45),k.facePoint(face,2,bottom-0.02,half+0.45),0.22);
      k.bar('stone',k.facePoint(face,-2,bottom+3.8,half+0.45),k.facePoint(face,2,bottom+3.8,half+0.45),0.22);
      const c=k.facePoint(face,0,bottom+1.85,half+0.5);
      k.arc('gold',c,1.6,0,Math.PI*2,0.09,face==='north'||face==='south'?'z':'x');
      for(let i=0;i<12;i++) {
        const t=i*Math.PI/6;
        k.bar('gold',k.facePoint(face,1.34*Math.cos(t),bottom+1.85+1.34*Math.sin(t),half+0.56),k.facePoint(face,1.5*Math.cos(t),bottom+1.85+1.5*Math.sin(t),half+0.56),0.1);
      }
      k.bar('gold',c,k.facePoint(face,-0.95,bottom+2.15,half+0.55),0.11);
      k.bar('gold',c,k.facePoint(face,0.2,bottom+3.18,half+0.55),0.08);
      // Gold-edged pediment above the clock.
      for(const s of [-1,1])k.bar('stone',k.facePoint(face,s*2.05,bottom+3.83,half+0.5),k.facePoint(face,0,bottom+4.5,half+0.5),0.23);
    }
  }
  // One attached central bell under the roof, preserving the sightline through mid-stage.
  k.bar('metal',[0,top,0],[0,top-1.3,0],0.22);
  k.cylinder('gold',0,0,top-2.6,1.4,clock?0.8:0.46,clock?0.4:0.24);
  k.box('metal',[0,top-0.08,0],[width+0.6,0.16,width+0.6]);
}
