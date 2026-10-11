import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, COURTYARDS } from './footprint.js';
import { world, local, CENTER, COLUMNS } from './capitole-de-toulouse-plan.js';

// Original mapped pierced block, profile-lofted marble columns, segmental
// pavilion pediments and supported stone statuary. Rotation is baked once.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', seg = near ? 12 : 6;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const material = mat => !near && mat === 'gold' ? 'stone' : mat;
  const put = (g, mat) => {
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++)p.setXYZ(i,...world(p.getX(i),p.getY(i),p.getZ(i)));
    g.computeVertexNormals();b.put(g,material(mat));
  };
  const box=(mat,u,y,v,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(u,y,v);put(g,mat);};
  const bar=(mat,a,c,w,d=w)=>{
    if(mat==='gold'){
      const dx=c[0]-a[0],dy=c[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len*w/2,ny=dx/len*w/2;
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([
        a[0]-nx,a[1]-ny,a[2],c[0]-nx,c[1]-ny,c[2],c[0]+nx,c[1]+ny,c[2],a[0]+nx,a[1]+ny,a[2]],3));
      g.setIndex([0,1,2,0,2,3]);put(g,mat);
    }else b.bar(material(mat),world(...a),world(...c),w,d);
  };
  const path=(pts,p=new THREE.Shape())=>{pts.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();return p;};
  const plan=path(FOOTPRINTS[0].map(local).map(([u,v])=>[u,-v]));
  for(const ring of COURTYARDS)plan.holes.push(path(ring.map(local).map(([u,v])=>[u,-v]),new THREE.Path()));
  for(const [mat,y,depth] of [['brick',0,18.4],['roof',18.39,0.2]]){
    const g=new THREE.ExtrudeGeometry(plan,{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,mat);
  }
  function hip(u0,u1,v0,v1,h){
    const pts=[[u0,18.58,v0],[u1,18.58,v0],[u1,18.58,v1],[u0,18.58,v1],[u0+2,h,(v0+v1)/2],[u1-2,h,(v0+v1)/2]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
    g.setIndex([0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0]);put(g,'roof');
  }
  for(const r of [[-39,-16,12.4,22.9,20.1],[11,34,6.5,22.7,20.1],[-13,8,12.6,25.1,20.7],[-48,-41,12.6,24.9,19.8],[37,49,7,24.9,19.8],[-36,-18,-26.8,-14.7,20.2],[-7,7,-27,-14.6,20.2],[20,30,-27,-14.7,20.2]])hip(...r);
  const front=(u,v)=>({u,v,tx:1,tz:0,nx:0,nz:1});
  function transformFace(g,f,t=0,y=0,off=0){
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i)+t,d=p.getZ(i)+off;
      p.setXYZ(i,f.u+f.tx*x+f.nx*d,p.getY(i)+y,f.v+f.tz*x+f.nz*d);
    }
    if(f.tx*f.nz-f.tz*f.nx<0){
      if(!g.index)g.setIndex(Array.from({length:p.count},(_,i)=>i));
      const idx=g.index.array;for(let i=0;i<idx.length;i+=3)[idx[i],idx[i+1]]=[idx[i+1],idx[i]];
    }
    return g;
  }
  const fb=(f,mat,t,y,w,h,d=0.16,off=0.2)=>{
    const skin=mat==='glass'||mat==='glow'||mat==='metal'||(mat==='stone'&&(!near&&d<=0.35||h<0.28||(w<0.4&&h<0.8)));
    put(transformFace(skin?new THREE.PlaneGeometry(w,h):new THREE.BoxGeometry(w,h,d),f,t,y,off+(skin?d/2:0)),mat);
  };
  const fs=(f,s,mat,t,y,off,depth)=>{
    const skin=mat==='glass'||mat==='glow'||mat==='stone';
    const g=skin?new THREE.ShapeGeometry(s):new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:seg});
    put(transformFace(g,f,t,y,off+(skin?depth:0)),mat);
  };
  const skin=(f,mat,t,y,w,h,off)=>put(transformFace(new THREE.PlaneGeometry(w,h),f,t,y,off),mat);
  function arch(w,h,r){
    const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h-r);
    for(let i=1;i<=(near?6:4);i++){const a=i*Math.PI/(near?6:4);s.lineTo(w/2*Math.cos(a),h-r+r*Math.sin(a));}
    s.lineTo(-w/2,0);s.closePath();return s;
  }
  function window(f,t,y,w,h,ground=false,lit=false){
    const r=ground?w/2:0.32,s=arch(w,h,r);
    if(!near){
      // Flat frame behind glass, rather than a triangulated annular reveal.
      // All row panes share each material batch; arch silhouettes remain.
      if(ground){
        fs(f,arch(w+0.42,h+0.35,r+0.12),'stone',t,y-0.12,0.11,0.12);
        fs(f,s,lit?'glow':'glass',t,y,0.27,0.1);
      }else{
        skin(f,'stone',t,y+h/2,w+0.42,h+0.35,0.23);
        skin(f,lit?'glow':'glass',t,y+h/2,w,h,0.37);
      }
      return;
    }
    const frame=arch(w+0.42,h+0.35,r+0.12);
    frame.holes.push(new THREE.Path(s.getPoints().map(p=>new THREE.Vector2(p.x,p.y+0.12))));
    fs(f,frame,'stone',t,y-0.12,0.23,0.2);fs(f,s,lit?'glow':'glass',t,y,0.27,0.1);
    fb(f,'stone',t,y-0.22,w+0.62,0.24,0.28,0.31);
    if(near){
      fb(f,'metal',t,y+h*0.45,0.065,h*0.9,0.06,0.41);
      for(const q of [0.3,0.6])fb(f,'metal',t,y+h*q,w,0.055,0.06,0.41);
      if(!ground){fb(f,'stone',t,y+h+0.22,0.38,0.42,0.27,0.38);fb(f,'stone',t,y+h+0.45,w*0.78,0.1,0.25,0.28);}
    }
  }
  function parapet(f,len){
    fb(f,'stone',0,18.55,len,0.38,0.55,0.12);fb(f,'stone',0,18.97,len+0.2,0.3,0.66,0.19);
    fb(f,'stone',0,20.25,len,0.32,0.48,0.16);
    for(let t=-len/2+0.32;t<len/2;t+=near?0.58:1.15){
      fb(f,'stone',t,19.61,0.2,1.08,0.3,0.17);if(near)fb(f,'stone',t,19.61,0.24,0.33,0.3,0.17);
    }
    if(near)for(let t=-len/2+0.2;t<len/2;t+=0.42)fb(f,'stone',t,18.25,0.16,0.2,0.3,0.18);
  }
  const panels=[{u:-47.3,v:25.52,w:9.8,n:3},{u:-28,v:23.68,w:25,n:9},{u:CENTER,v:25.94,w:20.7,n:3},{u:23.8,v:23.78,w:22.5,n:8},{u:42.0,v:25.58,w:9.2,n:3}];
  for(const p of panels){
    const f=front(p.u,p.v),pitch=p.w/p.n;
    for(const y of [0.3,1.1,1.95,2.8,3.65,4.5,5.35])fb(f,'stone',0,y,p.w,0.38,0.2,0.17);
    fb(f,'stone',0,6.05,p.w+0.3,0.4,0.45,0.16);fb(f,'stone',0,6.55,p.w+0.2,0.24,0.44,0.25);
    parapet(f,p.w);
    for(let i=0;i<p.n;i++){
      const t=-p.w/2+pitch*(i+0.5);
      window(f,t,0.6,Math.min(1.65,pitch*0.55),4.85,true);
      window(f,t,7.05,Math.min(1.7,pitch*0.56),5.05,false,true);
      if(p.u!==CENTER)window(f,t,14.05,Math.min(1.55,pitch*0.51),3.15);
    }
    if(p.u!==CENTER)for(let i=0;i<=p.n;i++){
      const t=-p.w/2+pitch*i;
      fb(f,'stone',t,12.35,0.57,11.4,0.2,0.17);fb(f,'stone',t,17.85,0.9,0.48,0.35,0.24);
      fb(f,'stone',t,6.85,0.9,0.35,0.32,0.24);if(near)fb(f,'stone',t,17.48,0.71,0.19,0.3,0.22);
    }
    for(const y of [6.85,7.65])fb(f,'metal',0,y,p.w,0.07,0.07,0.48);
    if(near)for(let t=-p.w/2;t<=p.w/2;t+=0.52){
      fb(f,'metal',t,7.25,0.045,0.8,0.055,0.48);
      const d=0.22,u=p.u+t,v=p.v+0.5;
      for(const [a,c] of [[[-d,7.25],[0,7.49]],[[0,7.49],[d,7.25]],[[d,7.25],[0,7.01]],[[0,7.01],[-d,7.25]]])bar('gold',[u+a[0],a[1],v],[u+c[0],c[1],v],0.035);
    }
  }
  function column(u){
    const rings=[[6.72,0.67],[7.06,0.67],[7.28,0.49],[16.88,0.42],[17.12,0.62],[17.45,0.64],[17.73,0.51]],ps=[],idx=[];
    for(const [y,r] of rings)for(let i=0;i<seg;i++)ps.push(u+r*Math.cos(i*2*Math.PI/seg),y,25.7+r*Math.sin(i*2*Math.PI/seg));
    for(let j=0;j<rings.length-1;j++)for(let i=0;i<seg;i++){
      const a=j*seg+i,c=j*seg+(i+1)%seg,d=(j+1)*seg+i,e=(j+1)*seg+(i+1)%seg;idx.push(a,d,c,c,d,e);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setIndex(idx);put(g,'marble');
    box('stone',u,6.72,25.7,1.25,0.23,1.23);box('stone',u,17.85,25.7,1.4,0.32,1.25);
    if(near)for(const dx of [-0.4,0.4]){const g=new THREE.TorusGeometry(0.21,0.095,4,8);g.translate(u+dx,17.4,26.26);put(g,'stone');}
  }
  COLUMNS.forEach(column);
  const cf=front(CENTER,25.96);
  for(const t of [-7.33,7.33])window(cf,t,14.05,1.65,3.15);
  fb(cf,'stone',0,18.4,21.0,0.44,0.82,0.19);fb(cf,'stone',0,19.02,21.0,0.25,0.84,0.22);
  fs(cf,path([[-10.3,0],[10.3,0],[0,3.6]]),'brick',0,19.2,0.12,0.45);
  bar('stone',[CENTER-10.4,19.2,26.3],[CENTER,23.02,26.3],0.37,0.55);
  bar('stone',[CENTER,23.02,26.3],[CENTER+10.4,19.2,26.3],0.37,0.55);box('stone',CENTER,19.2,26.3,21.1,0.34,0.55);
  function disk(u,y,v,r,mat){const g=new THREE.CylinderGeometry(r,r,0.12,near?24:12);g.rotateX(Math.PI/2);g.translate(u,y,v);put(g,mat);}
  disk(CENTER,16.08,26.07,1.13,'stone');disk(CENTER,16.08,26.19,0.86,'glass');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;bar('stone',[CENTER+0.62*Math.sin(a),16.08+0.62*Math.cos(a),26.28],[CENTER+0.77*Math.sin(a),16.08+0.77*Math.cos(a),26.28],near?0.06:0.085);}
  bar('stone',[CENTER,16.08,26.31],[CENTER-0.37,16.52,26.31],0.085);bar('stone',[CENTER,16.08,26.31],[CENTER+0.43,16.29,26.31],0.065);
  disk(CENTER,20.62,26.66,0.69,'stone');
  for(const side of [-1,1])for(let i=0;i<(near?6:3);i++){
    bar('stone',[CENTER+side*0.5,20.5,26.76],[CENTER+side*(1.2+i*0.22),20.24+i*0.17,26.76],0.12);
  }
  if(near){
    const alphabet={C:[[1,1,0,1],[0,1,0,0],[0,0,1,0]],A:[[0,0,0.5,1],[0.5,1,1,0],[0.25,0.4,0.75,0.4]],P:[[0,0,0,1],[0,1,1,1],[1,1,1,0.5],[1,0.5,0,0.5]],I:[[0,1,1,1],[0.5,1,0.5,0],[0,0,1,0]],T:[[0,1,1,1],[0.5,1,0.5,0]],O:[[0,0,0,1],[0,1,1,1],[1,1,1,0],[1,0,0,0]],L:[[0,1,0,0],[0,0,1,0]],U:[[0,1,0,0],[0,0,1,0],[1,0,1,1]],M:[[0,0,0,1],[0,1,0.5,0.4],[0.5,0.4,1,1],[1,1,1,0]]};
    [...'CAPITOLIUM'].forEach((c,i)=>{for(const [x,y,xx,yy] of alphabet[c])bar('gold',[CENTER-2.9+i*0.59+x*0.38,18.53+y*0.37,26.64],[CENTER-2.9+i*0.59+xx*0.38,18.53+yy*0.37,26.64],0.045);});
  }
  window(cf,0,0.4,3.3,4.9,true);
  for(const du of [-2,2])fb(cf,'stone',du,2.75,0.58,5.4,0.45,0.46);
  fb(cf,'stone',0,5.75,5.5,0.37,0.75,0.55);
  bar('stone',[CENTER-2.7,5.83,26.7],[CENTER,6.7,26.7],0.23,0.48);bar('stone',[CENTER,6.7,26.7],[CENTER+2.7,5.83,26.7],0.23,0.48);
  for(const p of [panels[0],panels[4]]){
    const f=front(p.u,p.v),s=new THREE.Shape(),half=p.w/2+0.3;s.moveTo(-half,0);s.lineTo(half,0);
    for(let i=1;i<=seg;i++){const a=i*Math.PI/seg;s.lineTo(half*Math.cos(a),2.05*Math.sin(a));}s.closePath();
    fs(f,s,'brick',0,19.2,0.13,0.42);
    for(let i=0;i<seg;i++){const a=i*Math.PI/seg,c=(i+1)*Math.PI/seg;bar('stone',[p.u+(half+0.08)*Math.cos(a),19.2+2.12*Math.sin(a),p.v+0.45],[p.u+(half+0.08)*Math.cos(c),19.2+2.12*Math.sin(c),p.v+0.45],0.4,0.43);}
    disk(p.u,20,p.v+0.69,0.57,'stone');
  }
  function statue(u,y,v,s=1){
    box('stone',u,y+0.11,v,0.76*s,0.22,0.64*s);
    const body=new THREE.CylinderGeometry(0.2*s,0.4*s,1.05*s,near?8:5);body.translate(u,y+0.22+0.525*s,v);put(body,'stone');
    const head=new THREE.SphereGeometry(0.23*s,near?8:5,near?6:4);head.translate(u,y+0.22+1.17*s,v);put(head,'stone');
    bar('stone',[u,y+0.85*s,v],[u+0.44*s,y+0.53*s,v],0.17*s);bar('stone',[u,y+0.85*s,v],[u-0.35*s,y+1.1*s,v],0.17*s);
  }
  for(const u of [-38,-17,12,33])statue(u,20.37,23.7,0.85);
  statue(CENTER,23.11,26,1.19);for(const du of [-7.2,7.2])statue(CENTER+du,20.82,26,1.05);
  for(const p of [panels[0],panels[4]]){
    statue(p.u,21.38,p.v+0.13,1.03);
    if(near)for(const du of [-1.85,1.85])statue(p.u+du,21.18,p.v+0.13,0.7);
  }
  // Rear/courtyard rhythm follows each real wall, leaving all three courts void.
  const rings=[FOOTPRINTS[0],...COURTYARDS];
  for(let ri=0;ri<rings.length;ri++){
    const pts=rings[ri].map(local);let area=0;
    for(let i=0;i<pts.length-1;i++)area+=pts[i][0]*pts[i+1][1]-pts[i+1][0]*pts[i][1];
    for(let i=0;i<pts.length-1;i++){
      const [u,v]=pts[i],[u1,v1]=pts[i+1],len=Math.hypot(u1-u,v1-v);
      if(len<6||(ri===0&&(v+v1)/2>21))continue;
      const tx=(u1-u)/len,tz=(v1-v)/len,sgn=(area>0?1:-1)*(ri===0?1:-1);
      const f={u:(u+u1)/2,v:(v+v1)/2,tx,tz,nx:sgn*tz,nz:-sgn*tx},n=Math.max(1,Math.round(len/3.6));
      if(!near){
        const rows={glass:[],glow:[]};
        for(const [y,h] of [[1.6,3.2],[7.6,4.2],[14.1,2.8]])for(let j=0;j<n;j++){
          const t=-len/2+len/n*(j+0.5),a=rows[y===7.6?'glow':'glass'];
          const at=(x,yy)=>[f.u+f.tx*x+f.nx*0.205,yy,f.v+f.tz*x+f.nz*0.205];
          const q=[at(t-0.7,y),at(t+0.7,y),at(t+0.7,y+h),at(t-0.7,y+h)];
          const order=f.tx*f.nz-f.tz*f.nx>0?[0,1,2,3]:[0,3,2,1];
          for(const k of order)a.push(...q[k]);
        }
        for(const [mat,positions] of Object.entries(rows)){
          const g=new THREE.BufferGeometry(),idx=[];
          for(let base=0;base<positions.length/3;base+=4)idx.push(base,base+1,base+2,base,base+2,base+3);
          g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(idx);put(g,mat);
        }
      }
      for(let j=0;near&&j<n;j++){
        const t=-len/2+len/n*(j+0.5);
        for(const [y,h] of [[1.6,3.2],[7.6,4.2],[14.1,2.8]]){
          fb(f,y===7.6?'glow':'glass',t,y+h/2,1.4,h,0.09,0.16);if(near)skin(f,'stone',t,y-0.13,1.7,0.22,0.31);
          if(near){for(const dx of [-0.84,0.84])skin(f,'stone',t+dx,y+h/2,0.19,h+0.24,0.27);skin(f,'stone',t,y+h+0.1,1.8,0.23,0.32);skin(f,'metal',t,y+h/2,0.055,h,0.29);}
        }
      }
      for(const y of [6.6,13.5,18.13])fb(f,'stone',0,y,len-0.12,ri===0?0.38:0.22,0.24,0.16);
      if(ri===0)for(const y of [0.8,2.3,3.8,5.3])fb(f,'stone',0,y,len-0.12,0.31,0.21,0.04);
    }
  }
  // Centre tricolour is hung from the first-floor balcony, geometry only.
  for(const [du,mat] of [[-0.7,'glass'],[0,'stone'],[0.7,'brick']])box(mat,CENTER+du,9.05,26.25,0.69,4.4,0.09);
  if(near)for(const u of [-47,-35,-23,20,31,42]){
    const v=u<10?24.1:23.9;bar('metal',[u,6.7,v],[u,9.35,v+0.7],0.055);
    for(const [dx,mat] of [[0.2,'glass'],[0.55,'stone'],[0.9,'brick']])box(mat,u+dx,8.9,v+0.6,0.35,0.85,0.045);
  }
  return b.finish();
}
