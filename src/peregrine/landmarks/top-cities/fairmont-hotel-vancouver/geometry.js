import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { surfaces } from './fairmont-hotel-vancouver-mesh.js';
import { RINGS, TIERS, xyz, uv, U, V, difference } from './fairmont-hotel-vancouver-site.js';

export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), s=surfaces(b);
  // Unioned boundaries remove hidden overlapping slab walls; differences expose only terrace roofs.
  TIERS.forEach((tier,index)=>{
    for(const polygon of tier.plan)for(const ring of polygon)facade(ring,tier.y0,tier.y1);
    let upper=TIERS[index+1]?.plan??[[RINGS[360433185]]];
    if(tier.y1===60)upper=[...upper,[RINGS[361655262]],[RINGS[361655263]]];
    for(const poly of difference(tier.plan,upper))s.cap('roof',poly,tier.y1);
    if(near)for(const polygon of tier.plan)for(const ring of polygon)for(let i=0;i<ring.length-1;i++)b.bar('stone',[ring[i][0],tier.y1-.35,ring[i][1]],[ring[i+1][0],tier.y1-.35,ring[i+1][1]],near?.55:.4,.55);
  });
  const rr=RINGS[360433185].slice(0,-1).map(uv);
  const u0=Math.min(...rr.map(p=>p[0])),u1=Math.max(...rr.map(p=>p[0])),v0=Math.min(...rr.map(p=>p[1])),v1=Math.max(...rr.map(p=>p[1])),vc=(v0+v1)/2;
  const cs=[[u0,80,v0],[u1,80,v0],[u1,80,v1],[u0,80,v1]],r0=[u0+10,105,vc],r1=[u1-10,105,vc];
  for(const poly of [[cs[0],cs[1],r1,r0],[cs[2],cs[3],r0,r1],[cs[3],cs[0],r0],[cs[1],cs[2],r1]])s.face('copper',poly.map(p=>xyz(...p)),[0,1,0]);
  for(const id of [361655262,361655263])pyramid(RINGS[id],60,72);
  for(const id of [361655264,361655265])pyramid(RINGS[id],60,70);
  for(const side of [-1,1]){
    for(const u of [-12,-6,0,6,12])dormer(u,vc+side*8,86,2,3,side);
    for(const u of [-6,0,6])dormer(u,vc+side*4.5,94.3,1.6,2.4,side);
    // Panorama Roof ribbon: separate glazing between the lower dormers, tied into the copper slope.
    for(const [u,w]of [[-14,2],[-9,4],[-3,4],[3,4],[9,4],[14,2]])windowBlock(u,86.4,vc+side*6.9,w,1.8,4.4,side,[[88,90.1]],w-.4);
    // Central Renaissance stone frontispiece rising through the lower roof.
    const v=vc+side*10.2;
    windowBlock(0,79.7,v-side*1.2,5.2,3,12.8,side,[[82.5,84.5],[86.6,88.6],[90.1,92.1]],2);
    const n=[side*V[0],0,side*V[1]];
    // Renaissance frontispiece: tiered cornices, attached paired pilasters,
    // a shouldered stone pediment and a tall pointed copper coping.
    for(const [y,w] of [[81,6.3],[85,6.4],[89.1,5.8],[92.5,6.1]])block('stone',0,y,v, w,3.4,.36);
    for(const u of [-2.35,2.35])block('stone',u,80,v, .38,3.25,12.5);
    const ped=[[-3.05,92.5],[3.05,92.5],[3.05,93.1],[2.2,93.1],[2.2,94.1],[0,96.3],[-2.2,94.1],[-2.2,93.1],[-3.05,93.1]];
    const front=v+side*.5,back=v-side*2.8;
    for(const tri of THREE.ShapeUtils.triangulateShape(ped.map(p=>new THREE.Vector2(...p)),[])) {
      s.face('stone',tri.map(i=>xyz(...ped[i],front)),n);
      s.face('stone',tri.map(i=>xyz(...ped[i],back)),n.map(x=>-x));
    }
    for(let i=0;i<ped.length;i++){
      const a=ped[i],c=ped[(i+1)%ped.length];
      s.face(i>=3&&i<=5?'copper':'stone',[xyz(...a,front),xyz(...c,front),xyz(...c,back),xyz(...a,back)],[(c[1]-a[1])*U[0],a[0]-c[0],(c[1]-a[1])*U[1]]);
    }

  }
  // Stone chimney at its own mapped ring; architectural cap and short finial to published heights.
  const stack=RINGS[361647572].slice(0,-1),center=stack.reduce((p,q)=>[p[0]+q[0]/stack.length,p[1]+q[1]/stack.length],[0,0]);
  const oct=Array.from({length:8},(_,i)=>[center[0]+1.85*Math.cos(i*Math.PI/4),center[1]+1.85*Math.sin(i*Math.PI/4)]);oct.push(oct[0]);
  plainWalls(oct,102.8,110.64,'stone');s.cap('stone',[oct],110.64);
  for(let i=0;i<8;i++){const p=oct[i],q=oct[i+1],L=Math.hypot(q[0]-p[0],q[1]-p[1]),t=[(q[0]-p[0])/L,(q[1]-p[1])/L],n=[t[1],-t[0]];panel('glass',p,t,n,.3,L-.3,107.7,109.8,.60);}
  b.bar('bronze',[center[0],110.64,center[1]],[center[0],112.47,center[1]],.16);
  for(const u of [r0[0],r1[0]])b.bar('bronze',xyz(u,104.8,vc),xyz(u,108.2,vc),.16);
  for(const id of [361655262,361655263]){const pts=RINGS[id].slice(0,-1),p=pts.reduce((c,q)=>[c[0]+q[0]/pts.length,c[1]+q[1]/pts.length],[0,0]);b.bar('bronze',[p[0],71.8,p[1]],[p[0],75,p[1]],.14);}
  // Burrard entrance canopy and its two named ground supports, inside the mapped plan.
  block('bronze',-39.5,5.7,4,2.8,9,.45);
  for(const v of [.3,7.7])block('bronze',-40.5,0,v,.18,.18,5.7);
  // Crouching animal silhouettes, attached to stone brackets at the eaves.
  if(near)for(const u of [-17,-10,10,17])for(const side of [-1,1]){const v=side<0?-8:16.3;block('stone',u,77.5,v,.7,1.2,.6);block('stone',u,78,v+side*.25,.48,1.2,.55);block('stone',u,78.4,v+side*.75,.42,.5,.55);}
  s.flush();
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;old.deleteAttribute('bridgeLift');o.geometry=mergeVertices(old,1e-4);old.dispose();}});
  return root;

  function panel(mat,p,t,n,a,c,y0,y1,d=0){const at=(u,y)=>[p[0]+t[0]*u+n[0]*d,y,p[1]+t[1]*u+n[1]*d];s.face(mat,[at(a,y0),at(c,y0),at(c,y1),at(a,y1)],[n[0],0,n[1]]);}
  function facade(ring,y0,y1){
    for(let k=0;k<ring.length-1;k++){
      const p=ring[k],q=ring[k+1],L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<.01)continue;
      const t=[(q[0]-p[0])/L,(q[1]-p[1])/L],n=[t[1],-t[0]];
      const rows=y0===0?[4.8,11.5]:Array.from({length:16},(_,i)=>18.3+i*4.15).filter(y=>y-1.3>y0&&y+1.3<y1);
      const count=Math.max(1,Math.floor(L/(near?3.4:6.2))),pitch=L/count,openings=[];
      for(let row=0;row<rows.length;row++){
        if(!near&&row%2&&y1-y0>15)continue;
        for(let col=0;col<count;col++){
          if(L<3)continue;const y=rows[row],w=y0===0?Math.min(2.4,pitch*.60):Math.min(near?1.65:2.8,pitch*.55),a=pitch*(col+.5)-w/2,c=a+w,h=y0===0&&row===0?5.8:(near?2.45:3.2);
          openings.push({a,c,bottom:y-h/2,top:y+h/2,glow:(col*7+row*3+k)%5===0,arch:y0===0&&row===0});
        }
      }
      const front=y0===60&&n[0]*-V[0]+n[1]*-V[1]>.98&&L>30;
      if(front){for(let i=openings.length-1;i>=0;i--)if(openings[i].bottom<76&&openings[i].top>71.6)openings.splice(i,1);for(let i=0;i<7;i++){const mid=L/2+(i-3)*3.9;openings.push({a:mid-1.15,c:mid+1.15,bottom:71.6,top:76,arch:true,glow:false});}}
      // Walls are CUT around panes; glass is recessed, never overlaid on a wall.
      const ys=[...new Set([y0,y1,...openings.flatMap(o=>[o.bottom,o.top])])].sort((a,b)=>a-b);
      for(let i=0;i<ys.length-1;i++){const lo=ys[i],hi=ys[i+1],active=openings.filter(o=>o.bottom<=lo+.01&&o.top>=hi-.01).sort((a,b)=>a.a-b.a);let last=0;for(const o of active){panel('stone',p,t,n,last,o.a,lo,hi);last=o.c;}panel('stone',p,t,n,last,L,lo,hi);}
      for(const o of openings){
        const depth=near?.24:.60,at=(u,y,d)=>[p[0]+t[0]*u+n[0]*d,y,p[1]+t[1]*u+n[1]*d];
        const shape=[[o.a,o.bottom],[o.c,o.bottom]];
        if(o.arch){
          const radius=(o.c-o.a)/2,cy=o.top-radius,mid=(o.a+o.c)/2;shape.push([o.c,cy]);const steps=near?8:4;
          for(let i=1;i<=steps;i++)shape.push([mid+radius*Math.cos(Math.PI*i/steps),cy+radius*Math.sin(Math.PI*i/steps)]);
          for(let i=2;i<shape.length-1;i++)s.face('stone',[at(...shape[i],0),at(...shape[i+1],0),at(shape[i+1][0],o.top,0),at(shape[i][0],o.top,0)],[n[0],0,n[1]]);
        }else shape.push([o.c,o.top],[o.a,o.top]);
        s.face(o.glow?'glow':'glass',shape.map(([u,y])=>at(u,y,-depth)),[n[0],0,n[1]]);
        for(let i=0;i<shape.length;i++){const a=shape[i],c=shape[(i+1)%shape.length],du=c[0]-a[0],dy=c[1]-a[1];s.face('stone',[at(...a,0),at(...c,0),at(...c,-depth),at(...a,-depth)],[-dy*t[0],du,-dy*t[1]]);}
        if(near&&!o.arch)panel('stone',p,t,n,(o.a+o.c)/2-.055,(o.a+o.c)/2+.055,o.bottom,o.top,-.08);
      }
    }
  }
  function plainWalls(ring,y0,y1,mat){for(let i=0;i<ring.length-1;i++){const p=ring[i],q=ring[i+1];s.face(mat,[[p[0],y0,p[1]],[q[0],y0,q[1]],[q[0],y1,q[1]],[p[0],y1,p[1]]],[q[1]-p[1],0,p[0]-q[0]]);}}
  function pyramid(ring,base,top){const ps=ring.slice(0,-1),c=ps.reduce((p,q)=>[p[0]+q[0]/ps.length,p[1]+q[1]/ps.length],[0,0]);for(let i=0;i<ps.length;i++){const p=ps[i],q=ps[(i+1)%ps.length];s.face('copper',[[p[0],base,p[1]],[q[0],base,q[1]],[c[0],top,c[1]]],[0,1,0]);}}
  function block(mat,u,y,v,w,d,h){b.box(mat,xyz(u,y+h/2,v),[w,h,d],-Math.atan2(U[1],U[0]));}
  // A box with genuinely cut front windows and recessed glazing (no backing face).
  function windowBlock(u,y,v,w,d,h,side,rows,windowW){
    const vf=v+side*d/2,vb=v-side*d/2,left=u-w/2,right=u+w/2,a=u-windowW/2,c=u+windowW/2;
    const hint=[side*V[0],0,side*V[1]],rect=(x0,x1,lo,hi,depth,mat='stone')=>s.face(mat,[xyz(x0,lo,depth),xyz(x1,lo,depth),xyz(x1,hi,depth),xyz(x0,hi,depth)],hint);
    let previous=y;
    for(const [lo,hi]of rows){rect(left,right,previous,lo,vf);rect(left,a,lo,hi,vf);rect(c,right,lo,hi,vf);const inset=vf-side*(near?.24:.6);rect(a,c,lo,hi,inset,'glass');
      s.face('stone',[xyz(a,lo,vf),xyz(c,lo,vf),xyz(c,lo,inset),xyz(a,lo,inset)],[0,1,0]);
      s.face('stone',[xyz(a,hi,vf),xyz(c,hi,vf),xyz(c,hi,inset),xyz(a,hi,inset)],[0,-1,0]);
      s.face('stone',[xyz(a,lo,vf),xyz(a,hi,vf),xyz(a,hi,inset),xyz(a,lo,inset)],[U[0],0,U[1]]);
      s.face('stone',[xyz(c,lo,vf),xyz(c,hi,vf),xyz(c,hi,inset),xyz(c,lo,inset)],[-U[0],0,-U[1]]);previous=hi;
    }
    rect(left,right,previous,y+h,vf);
    s.face('stone',[xyz(left,y,vb),xyz(right,y,vb),xyz(right,y+h,vb),xyz(left,y+h,vb)],hint.map(v=>-v));
    for(const [x,sgn]of [[left,-1],[right,1]])s.face('stone',[xyz(x,y,vf),xyz(x,y,vb),xyz(x,y+h,vb),xyz(x,y+h,vf)],[sgn*U[0],0,sgn*U[1]]);
    s.face('stone',[xyz(left,y+h,vf),xyz(right,y+h,vf),xyz(right,y+h,vb),xyz(left,y+h,vb)],[0,1,0]);
  }
  function dormer(u,v,y,w,h,side){
    const d=2.8,back=v-side*d;windowBlock(u,y-.8,(v+back)/2,w,d,h+.8,side,[[y+.25,y+h*.75]],w*.58);
    const f=v+side*.12,n=[side*V[0],0,side*V[1]];

    for(const dir of [-1,1])s.face('copper',[xyz(u+dir*w*.6,y+h,v+side*.25),xyz(u,y+h+2.6,v+side*.25),xyz(u,y+h+2.6,back),xyz(u+dir*w*.6,y+h,back)],[0,1,0]);
    s.face('copper',[xyz(u-w*.6,y+h,f),xyz(u+w*.6,y+h,f),xyz(u,y+h+2.6,f)],n);
    block('stone',u,y+h-.16,v-side*.05,w*1.25,.6,.22);
  }
}
