import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE, PARTS } from './catedral-de-la-almudena-plan.js';

// Original parametric exterior. All coordinates below are building u/up/v metres;
// rotation is applied to the geometry, so the exported GLB is already east/up/south.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', sides = near ? 12 : 6;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g,mat) => { g.rotateY(-ANGLE); b.put(g,mat); };
  const box = (mat,u,y,v,w,h,d) => { const g=new THREE.BoxGeometry(w,h,d); g.translate(u,y,v); put(g,mat); };
  const cyl = (mat,u,v,y0,y1,r0,r1=r0,n=sides) => {
    const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(u,(y0+y1)/2,v);put(g,mat);
  };
  const prism = (mat,ring,y0,y1) => {
    const shape=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,bevelEnabled:false,curveSegments:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,mat);
  };
  const quad=(mat,pts,normal) => {
    const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])),new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));
    if(n.dot(new THREE.Vector3(...normal))<0) pts=[pts[3],pts[2],pts[1],pts[0]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,mat);
  };
  const roof=(u0,u1,v0,v1,y0,y1,alongV=true,mat='roof') => {
    const mid=alongV?(u0+u1)/2:(v0+v1)/2;
    if(alongV) {
      quad(mat,[[u0,y0,v0],[mid,y1,v0],[mid,y1,v1],[u0,y0,v1]],[0,1,0]);
      quad(mat,[[mid,y1,v0],[u1,y0,v0],[u1,y0,v1],[mid,y1,v1]],[0,1,0]);
      prism('stone',[[u0,v0],[u1,v0],[u1,v0+.2],[u0,v0+.2]],y0,y0+.1);
      for(const v of [v0,v1]){
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([u0,y0,v,mid,y1,v,u1,y0,v],3));
        g.setIndex(v===v0?[0,2,1]:[0,1,2]);g.computeVertexNormals();put(g,'stone');
      }
    } else {
      quad(mat,[[u0,y0,v0],[u1,y0,v0],[u1,y1,mid],[u0,y1,mid]],[0,1,0]);
      quad(mat,[[u0,y1,mid],[u1,y1,mid],[u1,y0,v1],[u0,y0,v1]],[0,1,0]);
      for(const u of [u0,u1]){
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([u,y0,v0,u,y1,mid,u,y0,v1],3));
        g.setIndex(u===u0?[0,1,2]:[0,2,1]);g.computeVertexNormals();put(g,'stone');
      }
    }
  };
  const hip=(ring,y0,y1) => {
    const u=ring.reduce((s,p)=>s+p[0],0)/ring.length,v=ring.reduce((s,p)=>s+p[1],0)/ring.length;
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length];
      const g=new THREE.BufferGeometry();const ar=[[a[0],y0,a[1]],[c[0],y0,c[1]],[u,y1,v]];
      const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...ar[1]).sub(new THREE.Vector3(...ar[0])),new THREE.Vector3(...ar[2]).sub(new THREE.Vector3(...ar[0])));
      g.setAttribute('position',new THREE.Float32BufferAttribute(ar.flat(),3));g.setIndex(n.y>0?[0,1,2]:[0,2,1]);g.computeVertexNormals();put(g,'roof');
    }
  };
  // Window surfaces have only their visible side. They sit 20 cm proud of the
  // backing wall and never share a plane with a surround or a cornice.
  const window=(axis,t,face,y,w,h,mat='glass',out=1) => {
    const p=axis==='u'?[[face,y-h/2,t-w/2],[face,y+h/2,t-w/2],[face,y+h/2,t+w/2],[face,y-h/2,t+w/2]]:
      [[t-w/2,y-h/2,face],[t+w/2,y-h/2,face],[t+w/2,y+h/2,face],[t-w/2,y+h/2,face]];
    quad(mat,p,axis==='u'?[out,0,0]:[0,0,out]);
  };
  // Face-local reliefs are disjoint from glazing. Far uses the same flat
  // stone/glass mosaic, rather than stacking a trim overlay over a window.
  const facePolygon=(mat,origin,tangent,normal,pts) => {
    const positions=pts.map(([t,y])=>[origin[0]+tangent[0]*t,y,origin[1]+tangent[1]*t]);
    const idx=THREE.ShapeUtils.triangulateShape(pts.map(p=>new THREE.Vector2(...p)),[]).flat();
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions.flat(),3));g.setIndex(idx);g.computeVertexNormals();
    if(g.attributes.normal.getX(0)*normal[0]+g.attributes.normal.getZ(0)*normal[1]<0){g.setIndex(idx.map((q,k)=>k%3===1?idx[k+1]:k%3===2?idx[k-1]:q));g.computeVertexNormals();}
    put(g,mat);
  };
  const frame=(axis,t,face,y,w,h,out=1,pediment=false) => {
    const origin=axis==='u'?[face,t]:[t,face],tan=axis==='u'?[0,1]:[1,0],n=axis==='u'?[out,0]:[0,out];
    const border=near?.22:.18;
    for(const side of [-1,1])facePolygon('trim',origin,tan,n,[[side*w/2,y-h/2-border],[side*(w/2+border),y-h/2-border],[side*(w/2+border),y+h/2+border],[side*w/2,y+h/2+border]]);
    for(const side of [-1,1])facePolygon('trim',origin,tan,n,[[-w/2,y+side*h/2],[w/2,y+side*h/2],[w/2+border,y+side*(h/2+border)],[-w/2-border,y+side*(h/2+border)]]);
    if(pediment)facePolygon('trim',origin,tan,n,[[-w/2-.4,y+h/2+.36],[0,y+h/2+1.05],[w/2+.4,y+h/2+.36]]);
  };
  const bar=(mat,from,to,width,depth=width) => {
    const a=new THREE.Vector3(...from),c=new THREE.Vector3(...to),dir=c.clone().sub(a);
    const g=new THREE.BoxGeometry(width,dir.length(),depth);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,mat);
  };
  const archPoints=(r,bottom,spring,steps=near?12:6) => {
    const pts=[[-r,bottom],[r,bottom],[r,spring]];
    for(let k=1;k<=steps;k++){const a=Math.PI*k/steps;pts.push([r*Math.cos(a),spring+r*Math.sin(a)]);}
    return pts;
  };
  const ringDisc=(mat,axis,t,face,y,r) => {
    const n=near?20:10,positions=[axis==='u'?face:t,y,axis==='u'?t:face],idx=[];
    for(let i=0;i<n;i++){const a=2*Math.PI*i/n,tt=t+Math.sin(a)*r,yy=y+Math.cos(a)*r;positions.push(axis==='u'?face:tt,yy,axis==='u'?tt:face);}
    for(let i=0;i<n;i++)idx.push(0,i+1,(i+1)%n+1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(idx);g.computeVertexNormals();
    // Make the circle face outward; no duplicate two-sided coplanar surfaces.
    const normal=g.attributes.normal; const want=axis==='u'?1:-1;
    if((axis==='u'?normal.getX(0):normal.getZ(0))*want<0){g.setIndex(idx.map((v,i)=>i%3===1?idx[i+1]:i%3===2?idx[i-1]:v));g.computeVertexNormals();}
    put(g,mat);
  };
  const statue=(u,v,y,h=2.5) => {
    // A draped torso, shoulders, head and planted plinth, rather than a spike.
    box('trim',u,y+.18,v,.8,.36,.8);
    cyl('trim',u,v,y+.3,y+h*(near?.66:.78),.46,near?.28:.38,near?7:4);
    if(near)box('trim',u,y+h*.69,v,.88,.46,.45);
    cyl('trim',u,v,y+h*.78,y+h,.27,.24,near?8:5);
  };
  const cross=(u,v,y0,y1,mat='gold') => {
    box(mat,u,(y0+y1)/2,v,.18,y1-y0,.18);
    box(mat,u,y1-.7,v,1.35,.16,.18);
  };
  const column=(u,v,y0,y1,r=.45) => {
    box('trim',u,y0+.18,v,r*2.5,.36,r*2.5);
    cyl('trim',u,v,y0+.25,y1-.35,r,r*.86,near?12:5);
    box('trim',u,y1-.2,v,r*2.7,.4,r*2.7);
  };
  const cornice=(u,v,y,w,d) => {
    box('stone',u,y,v,w,.55,d);
    if(near)box('stone',u,y-.45,v,w-.2,.3,d-.2);
  };

  // High exterior masonry uses actual pierced oculi, as in the Fernando
  // overview. Far inlays the broad frame into the wall and recesses the pane;
  // near adds a 20cm projecting surround, capitals and cornice orders.
  const clerestory=(ring,y0,y1,windowY,r=1.5,pitch=5.6,exposed=()=>true,farDivision='trim') => {
    const winding=Math.sign(ring.reduce((sum,p,i)=>{const q=ring[(i+1)%ring.length];return sum+p[0]*q[1]-q[0]*p[1];},0));
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length],du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv);
      const tangent=[du/len,dv/len],normal=[winding*dv/len,-winding*du/len];
      const surface=(g,offset=0) => {
        const p=g.attributes.position;
        for(let k=0;k<p.count;k++){const t=p.getX(k),y=p.getY(k),z=p.getZ(k)+offset;p.setXYZ(k,a[0]+tangent[0]*t+normal[0]*z,y,a[1]+tangent[1]*t+normal[1]*z);}
        const idx=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,k)=>k);g.computeVertexNormals();
        if(tangent[0]*normal[1]-tangent[1]*normal[0]<0){g.setIndex(idx.map((q,k)=>k%3===1?idx[k+1]:k%3===2?idx[k-1]:q));g.computeVertexNormals();}
        return g;
      };
      const count=exposed(i)&&len>2*(r+.5)?Math.max(1,Math.floor(len/pitch)):0,border=near?.28:.25,n=near?16:6;
      const wall=new THREE.Shape();wall.moveTo(0,y0);wall.lineTo(len,y0);wall.lineTo(len,y1);wall.lineTo(0,y1);wall.closePath();
      for(let k=0;k<count;k++) {
        const t=(k+.5)*len/count,outer=r+border;
        const hole=new THREE.Path();hole.absarc(t,windowY,near?r:outer,0,Math.PI*2,true);wall.holes.push(hole);
        const frame=new THREE.Shape();frame.absarc(t,windowY,outer,0,Math.PI*2,false);
        const opening=new THREE.Path();opening.absarc(t,windowY,r,0,Math.PI*2,true);frame.holes.push(opening);
        const surround=near?new THREE.ExtrudeGeometry(frame,{depth:.24,bevelEnabled:false,curveSegments:n/2}):new THREE.ShapeGeometry(frame,n/2);
        if(near)surround.translate(0,0,-.04);put(surface(surround),'trim');
        const pane=new THREE.Shape();pane.absarc(t,windowY,r,0,Math.PI*2,false);put(surface(new THREE.ShapeGeometry(pane,n/2),-.12),'glass');
      }
      if(!near&&exposed(i)&&count)for(let k=0;k<=count;k++) {
        const t=.35+(len-.7)*k/Math.max(1,count),bottom=Math.max(y0,12);
        const recess=new THREE.Path();recess.moveTo(t-.3,bottom);recess.lineTo(t-.3,y1-.3);recess.lineTo(t+.3,y1-.3);recess.lineTo(t+.3,bottom);recess.closePath();wall.holes.push(recess);
      }
      put(surface(new THREE.ShapeGeometry(wall,n/2)),'stone');
      if(!exposed(i)||!count)continue;
      // Divisions rise from the side-aisle roof to the cornice. The far relief
      // is one shallow masonry plane; neither order crosses an opening.
      const divisions=Math.max(1,count);
      for(let k=0;k<=divisions;k++) {
        const t=.35+(len-.7)*k/divisions,org=[a[0]+tangent[0]*t,a[1]+tangent[1]*t],bottom=Math.max(y0,12),top=y1-(near?1.1:.3);
        if(near){
          const shaft=new THREE.BoxGeometry(.6,top-bottom,.32);shaft.translate(t,(top+bottom)/2,.12);put(surface(shaft),'stone');
          facePolygon('trim',[org[0]+normal[0]*.20,org[1]+normal[1]*.20],tangent,normal,[[-.5,y1-1.1],[.5,y1-1.1],[.5,y1-.625],[-.5,y1-.625]]);
        } else facePolygon(farDivision,org,tangent,normal,[[-.3,bottom],[.3,bottom],[.3,top],[-.3,top]]);
      }
      for(const [y,h,offset] of near?[[y1-.45,.35,.28],[y1-1.1,.24,.18]]:[[y1-.45,.45,.08]]) {
        facePolygon('stone',[a[0]+normal[0]*offset,a[1]+normal[1]*offset],tangent,normal,[[0,y-h/2],[len,y-h/2],[len,y+h/2],[0,y+h/2]]);
      }
    }
    const lid=new THREE.ShapeGeometry(new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v))));lid.rotateX(-Math.PI/2);lid.translate(0,y1,0);put(lid,'stone');
  };

  // Lower side aisles, radial south chapels and the two palace-facing wings.
  const low=PARTS.filter(p=>p.h<=13);
  for(const p of low) {
    const y0=p.h===13?12.45:9.9;
    prism('stone',p.ring,0,y0);
    if(p.roof==='pyramidal'||p.roof==='hipped')hip(p.ring,y0,p.h);
    else prism('roof',p.ring,y0,p.h);
    // Separate small windows on every long outward wall, preserved at far.
    for(let i=0;i<p.ring.length;i++) {
      const a=p.ring[i],c=p.ring[(i+1)%p.ring.length],du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv);
      if(len<9)continue;
      const count=Math.max(1,Math.floor(len/5.2));
      const winding=Math.sign(p.ring.reduce((sum,q,k)=>{const a=p.ring[(k+p.ring.length-1)%p.ring.length];return sum+a[0]*q[1]-q[0]*a[1];},0));
      const nx=winding*dv/len,nz=-winding*du/len;
      if(len>20){
        for(const y of [5.9,10.9])facePolygon('trim',[a[0]+nx*.24,a[1]+nz*.24],[du/len,dv/len],[nx,nz],[[0,y-.12],[len,y-.12],[len,y+.12],[0,y+.12]]);
        for(let k=0;k<=count;k++){const t=k/count;facePolygon('trim',[a[0]+du*t+nx*.24,a[1]+dv*t+nz*.24],[du/len,dv/len],[nx,nz],[[-.18,.4],[.18,.4],[.18,y0-.1],[-.18,y0-.1]]);}
      }
      for(let k=0;k<count;k++){
        const t=(k+.5)/count,u=a[0]+du*t,v=a[1]+dv*t,ww=near?1.05:.95;
        for(const y of [3.3,8.7]) {
          const dx=du/len*ww/2,dz=dv/len*ww/2,oo=.20;
          quad('glass',[[u-dx+nx*oo,y-1.1,v-dz+nz*oo],[u+dx+nx*oo,y-1.1,v+dz+nz*oo],[u+dx+nx*oo,y+1.1,v+dz+nz*oo],[u-dx+nx*oo,y+1.1,v-dz+nz*oo]],[nx,0,nz]);
          const org=[u+nx*oo,v+nz*oo],tan=[du/len,dv/len],normal=[nx,nz],r=ww/2,e=.18;
          for(const side of [-1,1])facePolygon('trim',org,tan,normal,[[side*r,y-1.28],[side*(r+e),y-1.28],[side*(r+e),y+1.28],[side*r,y+1.28]]);
          for(const side of [-1,1])facePolygon('trim',org,tan,normal,[[-r-e,y+side*1.1],[r+e,y+side*1.1],[r+e,y+side*1.28],[-r-e,y+side*1.28]]);
          if(y===3.3)facePolygon('trim',org,tan,normal,[[-r-.4,4.72],[0,5.28],[r+.4,4.72]]);

        }
      }
    }
  }
  // East service/museum ranges around the two mapped courts; courts stay open.
  for(const [u0,u1,v0,v1] of [[35.2,41.4,-47.4,-14.8],[41.4,67.4,-47.4,-40.7],[60.4,67.4,-40.7,-14.8],[41.4,60.4,-21.8,-14.8]]){
    box('stone',(u0+u1)/2,6.1,(v0+v1)/2,u1-u0,12.2,v1-v0);
    box('roof',(u0+u1)/2,12.45,(v0+v1)/2,u1-u0,.5,v1-v0);
    for(let v=v0+3;v<v1-1;v+=5)for(const y of [3.3,8.7]){window('u',v,u1+.2,y,1.05,2.2);frame('u',v,u1+.2,y,1.05,2.2,1,y===3.3);}
    for(const y of [5.9,11.6])box('stone',(u0+u1)/2,y,(v0+v1)/2,u1-u0+.12,.3,v1-v0+.12);
  }
  // Stepped stone string courses on the low wings. Their
  // projection stays inside the outer mask; no string course crosses glass.
  for(const [u0,u1] of [[-65.5,-20.1],[20.8,67.0]]) {
    for(const y of [5.8,10.5,12.35])box('stone',(u0+u1)/2,y,-56.9,u1-u0,.3,.48);
  }
  // Cruciform high nave, transepts and choir. Mapped 25.8m ridges.
  for(const p of PARTS.filter(p=>[337694410,337694411,337694412,337694415].includes(p.id))) {
    const us=p.ring.map(q=>q[0]),vs=p.ring.map(q=>q[1]),u0=Math.min(...us)+.22,u1=Math.max(...us)-.22,v0=Math.min(...vs)+.18,v1=Math.max(...vs)-.18;
    const alongV=p.id===337694410||p.id===337694415;
    const choir=p.id===337694415;
    clerestory(choir?p.ring:[[u0,v0],[u1,v0],[u1,v1],[u0,v1]],0,22,18.3,1.5,5.6,i=>!choir&&(alongV?i%2===1:i%2===0));
    if(choir)hip(p.ring,22,25.8);else roof(u0,u1,v0,v1,22,25.8,alongV);
    if(!choir)cornice((u0+u1)/2,(v0+v1)/2,21.8,u1-u0+.4,v1-v0+.4);
    // Broad disjoint triangular cornice follows the end gables in both LODs.
    const half=(alongV?u1-u0:v1-v0)/2;
    for(const face of choir?[]:alongV?[v0,v1]:[u0,u1]) {
      const out=face===(alongV?v0:u0)?-1:1;
      const org=alongV?[(u0+u1)/2,face+out*(near?.22:.08)]:[face+out*(near?.22:.08),(v0+v1)/2];
      facePolygon('trim',org,alongV?[1,0]:[0,1],alongV?[0,out]:[out,0],[[-half,22.05],[0,25.8],[half,22.05],[half-.65,22.05],[0,25.25],[-half+.65,22.05]]);
    }
  }
  // South polygonal apse and the radial stone flying buttress fins.
  const apse=PARTS.find(p=>p.id===337884242);
  // At curved apse corners the coarse LOD merges shaft stone into its wall
  // mosaic; this avoids a reciprocal depth layer with the adjoining facet.
  clerestory(apse.ring,11.7,23,18.3,1.4,5.8,i=>i<14,'stone');
  for(const p of PARTS.filter(p=>[337880738,337884243,337884246,337884247].includes(p.id))) {
    prism('stone',p.ring,11.8,18.2);
    const g=new THREE.BufferGeometry(),positions=[],indices=[];
    const vs=p.ring.map(q=>q[1]),lo=Math.min(...vs),hi=Math.max(...vs);
    for(const q of p.ring)positions.push(q[0],21-(q[1]-lo)/(hi-lo)*7,q[1]);
    const shape=p.ring.map(q=>new THREE.Vector2(...q));
    for(const t of THREE.ShapeUtils.triangulateShape(shape,[]))indices.push(...t.reverse());
    g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'stone');
  }
  // Crossing: a panelled square podium, taller octagonal drum, and shallow
  // slate cap, proportioned against Fernando overview and Elena facade refs.
  clerestory(PARTS.find(p=>p.id===337694409).ring,0,29,25.6,1.15,5.8);
  box('stone',1,31.7,-1.6,23.8,5.4,23.8);
  cornice(1,-1.6,29.2,24.3,24.3);cornice(1,-1.6,34.6,24.3,24.3);
  for(const out of [-1,1]) {
    for(const v of [-9,-1.6,5.8]){window('u',v,1+out*12.1,31.1,2.05,2.65,'glass',out);frame('u',v,1+out*12.1,31.1,2.05,2.65,out,true);}
    for(const u of [-7,1,9]){window('v',u,-1.6+out*12.1,31.1,2.05,2.65,'glass',out);frame('v',u,-1.6+out*12.1,31.1,2.05,2.65,out,true);}
    for(const t of [-10.1,-4,4,10.1]){
      box('stone',1+out*12,31.8,-1.6+t,.35,5.1,.42);
      box('stone',1+t,31.8,-1.6+out*12,.42,5.1,.35);
    }
  }
  const drumR=11.65,drumY0=34.9,drumY1=49.3;
  cyl('stone',1,-1.6,drumY0,drumY1,drumR,drumR,8);
  for(let i=0;i<8;i++){
    const a=(i+.5)*Math.PI/4,nx=Math.sin(a),nz=Math.cos(a),tan=[Math.cos(a),-Math.sin(a)],origin=[1+nx*10.97,-1.6+nz*10.97];
    const r=2.7,spring=42.7,bottom=36.4,steps=near?14:6;
    // Three independent panes leave actual stone-colored mullion gaps.
    for(const [lo,hi] of [[-r,-.95],[-.72,.72],[.95,r]]){
      const pts=[[lo,bottom],[hi,bottom]];
      for(let k=0;k<=steps;k++){const t=hi+(lo-hi)*k/steps;pts.push([t,spring+Math.sqrt(Math.max(0,r*r-t*t))]);}
      facePolygon('glass',origin,tan,[nx,nz],pts);
    }
    const outer=r+.4;
    for(let k=0;k<steps;k++){
      const a0=Math.PI*k/steps,a1=Math.PI*(k+1)/steps;
      facePolygon('stone',origin,tan,[nx,nz],[[r*Math.cos(a0),spring+r*Math.sin(a0)],[outer*Math.cos(a0),spring+outer*Math.sin(a0)],[outer*Math.cos(a1),spring+outer*Math.sin(a1)],[r*Math.cos(a1),spring+r*Math.sin(a1)]]);
    }
    for(const side of [-1,1])facePolygon('stone',origin,tan,[nx,nz],[[side*r,bottom-.3],[side*outer,bottom-.3],[side*outer,spring],[side*r,spring]]);
    const ca=i*Math.PI/4,cu=1+Math.sin(ca)*11.65,cv=-1.6+Math.cos(ca)*11.65;
    box('stone',cu,41.8,cv,.9,13.6,.9);
    box('stone',cu,48.4,cv,1.4,.65,1.4);
    // Raised thermal-window gables and keystone; no beam ends in mid-air.
    const point=(t,y)=>[origin[0]+tan[0]*t,y,origin[1]+tan[1]*t];
    facePolygon('stone',origin,tan,[nx,nz],[[-3.35,45.8],[0,48.9],[3.35,45.8],[2.7,45.8],[0,48.2],[-2.7,45.8]]);
    facePolygon('stone',origin,tan,[nx,nz],[[-.36,45.1],[.36,45.1],[.45,46.2],[-.45,46.2]]);
    if(near){bar('stone',point(-3.35,45.8),point(0,48.9),.22);bar('stone',point(0,48.9),point(3.35,45.8),.22);}
  }
  cyl('stone',1,-1.6,48.9,49.8,11.9,11.9,8);
  const profile=[[11.45,49.7],[11.5,50.8],[11.05,52.7],[9.85,54.9],[8.0,57.0],[5.6,58.8],[2.6,60.2]];
  const shell=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),near?32:16);shell.translate(1,0,-1.6);put(shell,'roof');
  if(near)for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    for(let k=1;k<profile.length;k++){
      const [r0,y0]=profile[k-1],[r1,y1]=profile[k];
      bar('roof',[1+r0*Math.sin(a),y0,-1.6+r0*Math.cos(a)],[1+r1*Math.sin(a),y1,-1.6+r1*Math.cos(a)],near?.14:.1);
    }
  }
  // Twelve apostles occupy supported plinths around the crossing roof.
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6;statue(1+11.5*Math.sin(a),-1.6+11.5*Math.cos(a),34.4,near?3.1:2.9);
  }
  // Slate lantern with tall separated panes and tapering needle, then the cross.
  cyl('roof',1,-1.6,59.9,60.5,2.65,2.65,8);
  cyl('roof',1,-1.6,60.4,61.1,3.15,2.7,8);
  cyl('roof',1,-1.6,61,65.7,2.15,2.15,8);
  for(let i=0;i<8;i++){
    const a=(i+.5)*Math.PI/4,nx=Math.sin(a),nz=Math.cos(a),u=1+2.05*nx,v=-1.6+2.05*nz;
    quad('glass',[[u-.48*Math.cos(a),61.7,v+.48*Math.sin(a)],[u+.48*Math.cos(a),61.7,v-.48*Math.sin(a)],[u+.48*Math.cos(a),64.9,v-.48*Math.sin(a)],[u-.48*Math.cos(a),64.9,v+.48*Math.sin(a)]],[nx,0,nz]);
  }
  cyl('roof',1,-1.6,65.5,66.3,2.75,2.6,8);
  cyl('roof',1,-1.6,66.2,70.5,2.6,.12,8);
  cyl('gold',1,-1.6,70.45,71.2,.32,.32,8);
  cross(1,-1.6,71.15,73);

  // Main facade: recessed bronze doors behind two separate column orders.
  box('stone',.8,13.2,-56.8,24.4,26.4,3.0);
  for(const u of [-6,.8,7.6])window('v',u,-58.51,4.5,3.2,7.2,'bronze',-1);
  for(const u of [-7.7,-3.6,.8,5.2,9.3]){
    column(u,-60.7,0,11.8,.48);
    column(u,-60.7,14.3,25.5,.45);
    if(near){box('trim',u,25.05,-60.7,1.2,.4,.78);}
  }
  for(const y of [12.25,13.7,25.8,26.4])cornice(.8,-60.1,y,24.6,3.1);
  for(const y of [14.35,27.2]){
    box('stone',.8,y,-61.25,24.2,.28,.25);
    const count=near?30:16;
    for(let i=0;i<count;i++)box('stone',-11+23.6*i/(count-1),y-.45,-61.25,.17,.9,.2);
  }
  for(const u of [-7,-3,.8,4.6,8.5]){window('v',u,-58.51,19.6,1.45,4.7,'glass',-1);frame('v',u,-58.51,19.6,1.45,4.7,-1,u===.8);}
  // Palace-facing attic: an extruded, curved broken pediment with an
  // actual arched niche, curved shoulders, volutes and supported sculptures.
  const attic=new THREE.Shape();
  attic.moveTo(-11.2,26.8);attic.lineTo(12.8,26.8);attic.lineTo(12.8,28.1);
  attic.bezierCurveTo(9.4,28.1,7.5,30.2,5.6,33.4);attic.lineTo(5.6,35.7);
  attic.bezierCurveTo(5.6,37.6,4.2,38.2,3.0,37.4);
  attic.bezierCurveTo(3.8,39.1,2.7,40.1,.8,40.1);
  attic.bezierCurveTo(-1.1,40.1,-2.2,39.1,-1.4,37.4);
  attic.bezierCurveTo(-2.6,38.2,-4.0,37.6,-4.0,35.7);attic.lineTo(-4.0,33.4);
  attic.bezierCurveTo(-5.9,30.2,-7.8,28.1,-11.2,28.1);attic.closePath();
  const niche=new THREE.Path();niche.moveTo(-.65,28.2);niche.lineTo(2.25,28.2);niche.lineTo(2.25,34.2);niche.absarc(.8,34.2,1.45,0,Math.PI,false);niche.lineTo(-.65,28.2);attic.holes.push(niche);
  const ag=new THREE.ExtrudeGeometry(attic,{depth:1.2,bevelEnabled:false,curveSegments:near?10:4});ag.translate(0,0,-60.9);put(ag,'stone');
  facePolygon('bronze',[.8,-59.95],[1,0],[0,-1],archPoints(1.45,28.2,34.2));
  // Niche statue's planted pedestal enters the bottom sill, with torso and head
  // projected into the opening; simplified drapery remains readable at far.
  statue(.8,-60.4,28.05,6.7);
  for(const u of [-2.1,3.7])column(u,-61,27.0,36.3,.32);
  const archR=1.8,archY=34.2;
  for(let k=0;k<(near?14:8);k++){
    const a0=Math.PI*k/(near?14:8),a1=Math.PI*(k+1)/(near?14:8);
    facePolygon('stone',[.8,-61.13],[1,0],[0,-1],[[archR*Math.cos(a0),archY+archR*Math.sin(a0)],[(archR+.38)*Math.cos(a0),archY+(archR+.38)*Math.sin(a0)],[(archR+.38)*Math.cos(a1),archY+(archR+.38)*Math.sin(a1)],[archR*Math.cos(a1),archY+archR*Math.sin(a1)]]);
  }
  for(const side of [-1,1]){
    const scroll=new THREE.CubicBezierCurve3(new THREE.Vector3(.8+side*10.9,28.2,-61.1),new THREE.Vector3(.8+side*7.3,28.1,-61.1),new THREE.Vector3(.8+side*6.8,31.1,-61.1),new THREE.Vector3(.8+side*4.8,33.5,-61.1));
    put(new THREE.TubeGeometry(scroll,near?14:5,.25,near?6:4,false),'stone');
    const volute=[];const count=near?24:8;
    for(let k=0;k<=count;k++){const a=k/count*Math.PI*1.7,r=.86-.51*k/count;volute.push(new THREE.Vector3(.8+side*(3.9+r*Math.cos(a)),36.75+r*Math.sin(a),-61.1));}
    put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(volute),count,.22,near?6:4,false),'stone');
    // Seated saints on the curved shoulders: knees, draped lap, torso, head.
    const u=.8+side*7.3;box('trim',u,29.2,-60.55,1.6,.4,1.0);
    box('trim',u,29.65,-60.85,1.2,.8,.7);cyl('trim',u,-60.4,29.6,31.55,.58,.37,near?7:4);
    cyl('trim',u,-60.4,31.6,32.25,.31,.28,near?8:5);
    bar('trim',[u+side*.4,31,-60.5],[u+side*.75,30.1,-60.95],.32);
  }
  for(const u of [-10.4,12])statue(u,-60.3,26.8,3.4);
  box('stone',.8,40.05,-60.3,1.4,.35,1.2);cyl('stone',.8,-60.3,40.15,41.5,.45,.12,near?8:5);

  // Twin towers: 7m squares, true open bell chambers, bells, cornices and
  // three-stage slate spires. All four belfry faces retain negative space at far.
  for(const u of [-15.22,16.69]) {
    const v=-58.25,w=6.25;
    box('stone',u,15,v,w,30,6.1);
    cornice(u,v,13.1,6.65,6.45);cornice(u,v,26.5,6.65,6.45);
    window('v',u,v-3.25,7.4,1.5,4.1,'glass',-1);
    window('v',u,v-3.25,20.1,1.2,3.4,'glass',-1);
    frame('v',u,v-3.25,7.4,1.5,4.1,-1);frame('v',u,v-3.25,20.1,1.2,3.4,-1);
    for(const du of [-2.8,2.8])box('stone',u+du,15,v-3.08,.35,29.7,.28);
    ringDisc('stone','v',u,v-3.3,23.1,1.25);
    window('v',u,v-3.25,28.0,.65,1.6,'glass',-1);
    const pier=1.12,edge=w/2-pier/2;
    for(const du of [-edge,edge])for(const dv of [-edge,edge]) {
      box('stone',u+du,36.4,v+dv,pier,12.8,pier);
      if(near){column(u+du*.92,v+dv*.92,30.3,42.2,.25);}
    }
    // Real arched stone heads, spanning the corner piers without closing chamber.
    const r=1.85,cy=39.3,steps=near?12:6;
    for(let face=0;face<4;face++) {
      const angle=face*Math.PI/2,nx=Math.sin(angle),nz=Math.cos(angle),tangent=[Math.cos(angle),-Math.sin(angle)];
      for(let k=0;k<steps;k++) {
        const a0=k*Math.PI/steps,a1=(k+1)*Math.PI/steps;
        const pts=[[r*Math.cos(a0),cy+r*Math.sin(a0)],[(r+.5)*Math.cos(a0),cy+(r+.5)*Math.sin(a0)],[(r+.5)*Math.cos(a1),cy+(r+.5)*Math.sin(a1)],[r*Math.cos(a1),cy+r*Math.sin(a1)]];
        quad('stone',pts.map(([t,y])=>[u+nx*3.14+tangent[0]*t,y,v+nz*3.14+tangent[1]*t]),[nx,0,nz]);
      }
    }
    cornice(u,v,42.7,6.7,6.6);
    box('stone',u,44,v,5.6,2.3,5.5);
    cornice(u,v,45.3,6.2,6.1);
    // Bell body hangs from a beam that is seated in the two corner piers.
    box('bronze',u,40.8,v,4.5,.35,.3);
    for(const du of [-2.25,2.25])box('stone',u+du,40.8,v,.35,.45,5.65);
    cyl('bronze',u,v,35.7,38.2,.95,.48,near?12:6);
    cyl('bronze',u,v,38,40.9,.15,.15,near?8:4);
    const square=(r)=>[[u-r,v-r],[u+r,v-r],[u+r,v+r],[u-r,v+r]];
    hip(square(2.85),45.3,50.8);
    box('roof',u,51.45,v,2.3,1.4,2.3);
    hip(square(1.8),52.1,53.6);
    cyl('roof',u,v,53.6,57.7,1.35,.08,4);
    cyl('gold',u,v,57.7,58.4,.27,.27,near?10:6);
    cross(u,v,58.25,60);
    for(const dv of [-3.02,3.02]){
      box('stone',u,32,v+dv,3.8,.35,.22);
      for(let i=0;i<(near?9:5);i++)box('stone',u-1.7+3.4*i/((near?9:5)-1),31.5,v+dv,.12,1,.18);
    }
  }
  // Side transept pediments and pilasters at the road-facing entrance.
  for(const [u,v,w,out] of [[34.85,-1.9,12.8,1],[-34.5,-1.9,12.8,-1]]) {
    for(const vv of [v-5,v+5])box('stone',u,11.4,vv,.8,22.8,.8);
    window('u',v,u+out*.45,8.2,3.3,8,'bronze',out);
    frame('u',v,u+out*.45,8.2,3.3,8,out,true);
    for(const vv of [v-3.7,v+3.7]){window('u',vv,u+out*.45,18.4,1.6,3.6,'glass',out);frame('u',vv,u+out*.45,18.4,1.6,3.6,out);}
    facePolygon('stone',[u+out*.45,v],[0,1],[out,0],[[-6.5,23],[0,27.5],[6.5,23],[5.4,23],[0,26.7],[-5.4,23]]);
    box('stone',u,22.2,v,.9,.8,w+.5);
    statue(u,v-6.15,22.5,2.2);statue(u,v+6.15,22.5,2.2);
  }
  // Finite, supported rail posts and sculptural plinths along the wings.
  for(const [u0,u1] of [[-65,-20],[21,67]]) {
    box('stone',(u0+u1)/2,13.35,-53.5,u1-u0,.4,.65);
    for(let u=u0+.8;u<u1;u+=near?1.5:3)box('stone',u,12.95,-53.5,.3,.8,.4);
  }
  const root=b.finish();
  // Extruded plan/attic fronts repeat identical position/normal vertices. Weld
  // those only; hard edges and all window/ornament silhouettes stay intact.
  for(const mesh of root.children){const previous=mesh.geometry;mesh.geometry=mergeVertices(previous,1e-5);previous.dispose();}
  return root;
}
