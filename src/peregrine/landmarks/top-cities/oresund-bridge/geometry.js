import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,L,A,B,WEST_TOWER as W,EAST_TOWER as E,HIGH_START,HIGH_END,DECK_H,CURVE,WIDTH,authoredLateral } from './oresund-bridge-profile.js';

// Ten paired cables on each side of each of the four independent pylons.
export const STAY_GROUPS=10, PYLON_LATERALS=[-14,14];
export const FAR_GROUPS=[0,2,4,6,9];
export const STRUCTURAL_PANELS=[A,HIGH_START,W,E,HIGH_END,B];
// 22 west / 27 east approach spans; the high bridge's 160/141 m
// side spans have an intermediate pier, while each tower pair stays open.
export const PIER_STATIONS=[A,...Array.from({length:21},(_,i)=>A+(HIGH_START-A)*(i+1)/22),HIGH_START,W-160,E+160,HIGH_END,...Array.from({length:26},(_,i)=>HIGH_END+(B-HIGH_END)*(i+1)/27),B];
export function stayEndpoints(tower,side,direction,i,pair=0){
  const distance=36+20*i,station=tower+direction*(distance+(pair-.5)*.75),y=85+12*i;
  return {top:[tower+direction*2.6,side*14+(pair-.5)*.75,y],bottom:[station,side*11.15+(pair-.5)*.35,p.deckHeight(station)+.27]};
}
export function create({detail='near',captureContacts=false}={}){
  const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight;
  const supports=new Map(),members=[];
  const chunk=s=>near?Math.max(0,Math.min(2,Math.floor(s/L*3))):0;
  const xyz=(s,d,y)=>b.xyz(s,authoredLateral(s,d),y);
  function put(g,mat,s,id=null,lift=1){
    if(id&&captureContacts)supports.set(id,g.clone());
    b.put(g,mat,chunk(s),lift);
  }
  function contact(id,a,c,sa,sc){if(captureContacts)members.push({id,a:new THREE.Vector3(...a),b:new THREE.Vector3(...c),supports:[sa,sc]});}
  function box(id,mat,s,d,y,len,width,height,lift=1){
    const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(len,height,width);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,id,lift);
  }
  function beam(id,mat,from,to,width,depth=width,sa=null,sc=null){
    const av=new THREE.Vector3(...xyz(...from)),bv=new THREE.Vector3(...xyz(...to)),axis=bv.clone().sub(av);
    const g=new THREE.BoxGeometry(width,axis.length(),depth);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.clone().add(bv).multiplyScalar(.5).toArray());
    put(g,mat,(from[0]+to[0])/2,id);if(sa)contact(id,av.toArray(),bv.toArray(),sa,sc);
  }
  function cable(id,from,to,sa,sc){
    const av=new THREE.Vector3(...xyz(...from)),bv=new THREE.Vector3(...xyz(...to)),axis=bv.clone().sub(av),radius=.115;
    const g=new THREE.CylinderGeometry(radius,radius,axis.length(),near?6:4,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.clone().add(bv).multiplyScalar(.5).toArray());
    put(g,'cable',from[0],null);contact(id,av.toArray(),bv.toArray(),sa,sc);
  }
  function stations(a,c,step=near?50:110){
    const ss=new Set([a,c]);for(let s=Math.ceil(a/step)*step;s<c;s+=step)ss.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)ss.add(q.s);
    for(const q of p.knots)if(q[0]>a&&q[0]<c)ss.add(q[0]);
    // Tighter sampling on the short grade connections keeps deck joins smooth.
    for(const [lo,hi] of [[0,A],[B,L]])for(let s=lo;s<hi;s+=near?10:25)if(s>a&&s<c)ss.add(s);
    for(const [lo,hi] of [[A,A+CURVE],[HIGH_START-CURVE,HIGH_START],[HIGH_END,HIGH_END+CURVE],[B-CURVE,B]])for(let s=lo;s<=hi;s+=50)if(s>a&&s<c)ss.add(s);
    return [...ss].sort((u,v)=>u-v);
  }
  function sweep(id,mat,a,c,ring){
    const ss=stations(a,c),pos=[],idx=[],n=ring(a).length;
    for(const s of ss)for(const [d,y] of ring(s))pos.push(...xyz(s,d,y));
    for(let k=1;k<ss.length;k++)for(let j=0;j<n;j++){const u=(k-1)*n+j,v=(k-1)*n+(j+1)%n,w=k*n+j,t=k*n+(j+1)%n;idx.push(u,v,w,v,t,w);}
    const end=(ss.length-1)*n;for(let j=1;j<n-1;j++)idx.push(0,j+1,j,end,end+j,end+j+1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,(a+c)/2,id);
  }
  function surface(id,mat,a,c,l,r,offset){
    const ss=stations(a,c),pos=[],idx=[];
    for(const s of ss)for(const d of [l,r])pos.push(...xyz(s,d,h(s)+offset));
    for(let k=1;k<ss.length;k++){const u=(k-1)*2,v=k*2;idx.push(u,u+1,v,u+1,v+1,v);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,(a+c)/2,id);
  }
  const slab=(l,r,offset,depth)=>(s)=>[[l,Math.max(0,h(s)+offset)],[r,Math.max(0,h(s)+offset)],[r,Math.max(0,h(s)+offset-depth)],[l,Math.max(0,h(s)+offset-depth)]];
  // Three longitudinal chunks; every seam shares station and cross-section.
  for(let k=0;k<3;k++){
    const a=k*L/3,c=(k+1)*L/3;
    sweep('road-slab-'+k,'concrete',Math.max(a,65),Math.min(c,L-65),slab(-WIDTH/2,WIDTH/2,-.15,.65));
    for(const [l,r] of p.ROAD_EDGES)surface(null,'asphalt',a,c,l,r,0);
    sweep('median-'+k,'concrete',a,c,slab(-.65,.65,.65,.8));
    for(const side of [-1,1]){
      const l=side<0?-11.75:10.65,r=side<0?-10.65:11.75;
      sweep('curb-'+side+'-'+k,'concrete',a,c,slab(l,r,.55,.75));
      for(const d of [side*.95,side*9.85])surface(null,'paint',a,c,d-.06,d+.06,.03);
    }
  }
  if(near)for(let s=8;s<L-6;s+=18)for(const side of [-1,1])surface(null,'paint',s,s+5,side*5.4-.055,side*5.4+.055,.03);
  // Open lower rail deck: floor, two girder planes and triangular web bays.
  for(let k=0;k<3;k++){
    const a=Math.max(A,k*L/3),c=Math.min(B,(k+1)*L/3);if(a>=c)continue;
    sweep('rail-floor-'+k,'steel',a,c,slab(-9.8,9.8,-8.8,.7));
    for(const side of [-1,1]){
      sweep('top-chord-'+side+'-'+k,'steel',a,c,slab(side*9.8-.45,side*9.8+.45,-.9,.7));
      sweep('bottom-chord-'+side+'-'+k,'steel',a,c,slab(side*9.8-.45,side*9.8+.45,-8.7,.8));
    }
    for(const centre of [-4.1,4.1]){
      surface('ballast-'+centre+'-'+k,'ballast',a,c,centre-1.5,centre+1.5,-8.45);
      for(const d of [centre-.7175,centre+.7175])sweep('track-'+d+'-'+k,'rail',a,c,slab(d-.075,d+.075,-8.28,.17));
    }
  }
  const structuralStep=near?14:28;
  for(let s=A;s<B-1e-5;){
    let t=Math.min(B,s+structuralStep);
    // Chords share continuous geometry at chunk boundaries; named support test uses the owning section.
    const c0=Math.max(0,Math.min(2,Math.floor((s+.001)/L*3))),c1=Math.max(0,Math.min(2,Math.floor((t-.001)/L*3)));
    if(c1!==c0)t=(c0+1)*L/3;
    for(const side of [-1,1]){
      const even=Math.floor((s-A)/structuralStep)%2===0,ya=even?-.95:-8.75,yb=even?-8.75:-.95;
      beam('web-'+side+'-'+s,'steel',[s,side*9.8,h(s)+ya],[t,side*9.8,h(t)+yb],near?.55:.7,near?.65:.8,(even?'top':'bottom')+'-chord-'+side+'-'+c0,(even?'bottom':'top')+'-chord-'+side+'-'+c0);
    }
    if(near&&Math.floor((s-A)/structuralStep)%2===0){
      beam('floor-beam-'+s,'steel',[s,-9.8,h(s)-8.9],[s,9.8,h(s)-8.9],.55,.65,'bottom-chord--1-'+c0,'bottom-chord-1-'+c0);
    }
    s=t;
  }
  // Repeated concrete single shafts and caps; no pier in the 490 m navigation span.
  for(const s of PIER_STATIONS){
    const top=h(s)-9.5,id='pier-'+s,weight=y=>Math.max(0,Math.min(1,y/top));
    box(id,'concrete',s,0,top/2,6,10.5,top,weight);
    const capHeight=Math.min(1.3,top);
    box('cap-'+s,'concrete',s,0,top-capHeight/2,7.5,20,capHeight,weight);
    if(near)for(const d of [-8.8,8.8])box(null,'steel',s,d,top+.12,1.8,1.2,.24);
  }
  // Each pentagonal leg is one closed loft including the crown: shared cap/side
  // vertices retain identical absolute-deck weights when terrain is fitted.
  for(const tower of [W,E])for(const side of [-1,1]){
    const id='pylon-'+tower+'-'+side,levels=[[0,9.6,6.2],[17,9.2,6],[45,8.2,5.6],[DECK_H,7.4,5.3],[132,6.2,4.6],[204,5.2,4]],pos=[],idx=[];
    for(const [y,len,width] of levels)for(const [u,v] of [[-len/2,-width/2],[len/2,-width/2],[len/2,width/2-.8],[0,width/2],[-len/2,width/2-.8]])pos.push(...b.xyz(tower+u,side*14+side*v,y));
    // Side-dependent winding is corrected below by the local signed lateral reflection.
    for(let k=1;k<levels.length;k++)for(let j=0;j<5;j++){const u=(k-1)*5+j,v=(k-1)*5+(j+1)%5,w=k*5+j,t=k*5+(j+1)%5;idx.push(u,w,v,v,w,t);}
    const end=(levels.length-1)*5;for(let j=1;j<4;j++)idx.push(0,j,j+1,end,end+j+1,end+j);
    if(side<0)for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'concrete',tower,id,y=>Math.min(1,y/45));
    box('pylon-foot-'+tower+'-'+side,'concrete',tower,side*14,1,12,9,2,0);
    if(near)for(let y=20;y<200;y+=4)for(const direction of [-1,1]){
      let j=1;while(levels[j][0]<y)j++;const lo=levels[j-1],hi=levels[j],t=(y-lo[0])/(hi[0]-lo[0]),len=lo[1]+t*(hi[1]-lo[1]),width=lo[2]+t*(hi[2]-lo[2]);
      box(null,'concrete',tower+direction*(len/2+.06),side*14,y,.11,width-.3,.055);
    }
    for(const direction of [-1,1])for(let i=0;i<STAY_GROUPS;i++){
      if(!near&&!FAR_GROUPS.includes(i))continue;
      for(let pair=0;pair<(near?2:1);pair++){
        const {top,bottom}=stayEndpoints(tower,side,direction,i,near?pair:.5),anchor='anchor-'+tower+'-'+side+'-'+direction+'-'+i+'-'+pair;
        box(anchor,'steel',bottom[0],bottom[1],bottom[2],1.3,.85,.7);
        cable('stay-'+anchor,top,bottom,id,anchor);
      }
    }
  }
  // Real crossbeams connect the legs around 45 m, below the rail deck.
  for(const tower of [W,E])beam('tower-crossbeam-'+tower,'concrete',[tower,-14,45],[tower,14,45],5.2,5.2,'pylon-'+tower+'--1','pylon-'+tower+'-1');
  // Parapet rails terminate at solid posts. Posts themselves stand on named curbs.
  for(const side of [-1,1]){
    const d=side*11.2;
    for(const s of [0,L])box('end-post-'+side+'-'+s,'concrete',s,d,h(s)+.85,.5,.5,1.6);
    for(let k=0;k<3;k++){
      const a=k*L/3,c=(k+1)*L/3;
      sweep('parapet-'+side+'-'+k,'rail',a,c,slab(d-.05,d+.05,1.2,.1));
    }
    contact('parapet-'+side,xyz(0,d,h(0)+1.15),xyz(L,d,h(L)+1.15),'end-post-'+side+'-0','end-post-'+side+'-'+L);
    if(near)for(let s=3;s<L-2;s+=12){
      const k=Math.min(2,Math.floor(s/L*3));beam('post-'+side+'-'+s,'rail',[s,d,h(s)+.5],[s,d,h(s)+1.2],.08,.08,'curb-'+side+'-'+k,'parapet-'+side+'-'+k);
    }
  }
  // Lower tracks and girders end in bearing/abutment blocks, never at a free cut.
  for(const s of [A,B]){
    box('abutment-'+s,'concrete',s,0,h(s)/2,7,23.5,h(s),y=>Math.min(1,y/h(s)));
    for(const centre of [-4.1,4.1])for(const d of [centre-.7175,centre+.7175])box('track-end-'+s+'-'+d.toFixed(4),'rail',s,d,h(s)-8.2,1,.3,.5);
  }
  for(const d of [-4.8175,-3.3825,3.3825,4.8175])contact('track-'+d,xyz(A,d,h(A)-8.3),xyz(B,d,h(B)-8.3),'track-end-'+A+'-'+d.toFixed(4),'track-end-'+B+'-'+d.toFixed(4));
  for(const side of [-1,1])for(const band of ['top','bottom'])contact(band+'-girder-'+side,xyz(A,side*9.8,h(A)+(band==='top'?-.95:-8.75)),xyz(B,side*9.8,h(B)+(band==='top'?-.95:-8.75)),'abutment-'+A,'abutment-'+B);
  const model=b.finish();
  if(captureContacts){model.userData.contactSupports=supports;model.userData.contactMembers=members;}
  return model;
}
