import { applyParisBuildingFrame } from './paris-building-placement.js';
import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { architecture } from './paris-architecture.js';
import { PARIS_HISTORIC_BY_ID as S, PARIS_HISTORIC_PALETTES } from './paris-historic-config.js';

// Editable common primitives; details are batched by material by assetBuilder.
function tools(id,detail){
  const spec=S[id],b=assetBuilder({...spec,palette:PARIS_HISTORIC_PALETTES.light},detail),near=detail==='near',a=architecture((g,m)=>b.put(g,m),near);
  const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
  const cyl=(m,x,y,z,r1,r2,h,n=near?12:8)=>{
    const g=new THREE.CylinderGeometry(r1,r2,h,n);g.translate(x,y,z);b.put(g,m);
  };
  const dome=(m,x,y,z,rx,ry,rz)=>{
    const g=new THREE.SphereGeometry(1,near?32:16,near?12:6,0,Math.PI*2,0,Math.PI/2);
    g.scale(rx,ry,rz);g.translate(x,y,z);b.put(g,m);
  };
  // Roof volumes are flat-shaded: one normal per face keeps ridges and breaks crisp instead of rounded.
  const flat=g=>{const n=g.toNonIndexed();n.computeVertexNormals();g.dispose();return n;};
  const gable=(m,x,y,z,w,h,d)=>{
    const pts=[],idx=[];
    for(const zz of [z-d/2,z+d/2])pts.push(x-w/2,y,zz,x+w/2,y,zz,x,y+h,zz);
    idx.push(0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);b.put(flat(g),m);
  };
  // True hip roof (equal pitch on all four faces) up to a short ridge.
  const hip=(m,x,y,z,w,d,h,{ridge=.9}={})=>{
    const inset=Math.min(w,d)/2-ridge,p=[],idx=[];
    for(const [yy,k] of [[0,0],[h,inset]])for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]])p.push(x+u*(w/2-k),y+yy,z+v*(d/2-k));
    for(let j=0;j<4;j++){const i=j,n=(j+1)%4;idx.push(i,i+4,n,n,i+4,n+4);}
    idx.push(4,7,5,5,7,6);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);b.put(flat(g),m);
  };
  // True mansard: steep lower slope (inset ins over brk of the height), shallow upper slope to a narrow ridge.
  const mansard=(m,x,y,z,w,d,h,{ins=3.2,brk=.8,ridge=.9}={})=>{
    const up=Math.max(0,Math.min(w,d)/2-ins-ridge),p=[],idx=[];
    for(const [yy,k] of [[0,0],[h*brk,ins],[h,ins+up]])for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]])p.push(x+u*(w/2-k),y+yy,z+v*(d/2-k));
    for(let l=0;l<2;l++)for(let j=0;j<4;j++){const i=l*4+j,n=l*4+(j+1)%4;idx.push(i,i+4,n,n,i+4,n+4);}
    idx.push(8,11,9,9,11,10);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);b.put(flat(g),m);
  };
  // Wall mass without the faces nobody can see. BoxGeometry face order: +x,-x,+y,-y,+z,-z.
  const slab=(m,x,y0,z,w,h,d,drop=[2,3])=>{
    const g=new THREE.BoxGeometry(w,h,d),P=g.attributes.position.array,N=g.attributes.normal.array,src=g.index.array,pos=[],nor=[],idx=[];
    let k=0;
    for(let f=0;f<6;f++){
      if(drop.includes(f))continue;
      for(let v=0;v<4;v++){const i=(f*4+v)*3;pos.push(P[i],P[i+1],P[i+2]);nor.push(N[i],N[i+1],N[i+2]);}
      for(let i=0;i<6;i++)idx.push(src[f*6+i]-f*4+k*4);
      k++;
    }
    const o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));o.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));o.setIndex(idx);
    o.translate(x,y0+h/2,z);g.dispose();b.put(o,m);
  };
  // Loft a (offset, y) polyline along stations {x,z,nx,nz} (n = unit rear normal). Normals follow the
  // profile segment (flat across it) and the station (smooth along a curve); `center` orients them outward.
  const loft=(m,st,prof,{center=[0,9]}={})=>{
    const pos=[],nor=[],idx=[];
    for(let k=0;k<prof.length-1;k++){
      const p=prof[k],q=prof[k+1];
      let no=q[1]-p[1],ny=-(q[0]-p[0]);
      if(no*((p[0]+q[0])/2-center[0])+ny*((p[1]+q[1])/2-center[1])<0){no=-no;ny=-ny;}
      const l=Math.hypot(no,ny)||1;no/=l;ny/=l;
      const base=pos.length/3;
      for(const s of st)for(const r of [p,q]){pos.push(s.x+s.nx*r[0],r[1],s.z+s.nz*r[0]);nor.push(s.nx*no,ny,s.nz*no);}
      const quads=[];
      for(let i=0;i<st.length-1;i++){const A=base+i*2,B=A+1,C=A+3,D=A+2;quads.push([A,B,C,A,C,D]);}
      // orient by the first quad against its outward normal
      const v=i=>new THREE.Vector3(pos[i*3],pos[i*3+1],pos[i*3+2]);
      const [A,B,C]=quads[0],n0=v(B).sub(v(A)).cross(v(C).sub(v(A)));
      const flip=n0.dot(new THREE.Vector3(nor[A*3],nor[A*3+1],nor[A*3+2]))<0;
      for(const q6 of quads){if(flip)idx.push(q6[0],q6[2],q6[1],q6[3],q6[5],q6[4]);else idx.push(...q6);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setIndex(idx);b.put(g,m);
  };
  // Flat panel anchored at its bottom centre, facing local +Z turned by yaw.
  const quad=(m,x,y,z,w,h,yaw=0)=>{const g=new THREE.PlaneGeometry(w,h);g.rotateY(yaw);g.translate(x,y+h/2,z);b.put(g,m);};
  // Window on a wall plane through (x,y,z) facing yaw. Layers stand off the wall by >= 5 cm:
  // pane +12 cm, mullions +13..19 cm, jambs/lintel up to +26..30 cm, sill +45 cm (near only).
  const win=(x,y,z,w,h,{yaw=0,arched=false,pointed=false,trim='stone',pane='glass',gap=.12,mullions=near,crown=false}={})=>{
    const L=(u,v,d)=>[x+u*Math.cos(yaw)+d*Math.sin(yaw),y+v,z-u*Math.sin(yaw)+d*Math.cos(yaw)];
    const part=(m,u,v,d,sw,sh,sd)=>b.box(m,L(u,v,d),[sw,sh,sd],yaw);
    if(arched||pointed)a.opening(pane,...L(0,0,gap),w,h,{yaw,pointed});else quad(pane,...L(0,0,gap),w,h,yaw);
    if(!near)return;
    const e=.22;
    for(const s of [-1,1])part(trim,s*(w/2+e/2),h*.43,.09,e,h*.86,.26);
    part(trim,0,-.15,.2,w+.7,.3,.5);
    if(arched&&!pointed)a.arch(trim,...L(0,h-w/2,.08),w,w/2,e,.25,yaw);
    else if(!arched)part(trim,0,h+.14,.1,w+.5,.28,.3);
    if(mullions){part(trim,0,h*.45,.16,.1,h*.9,.06);part(trim,0,h*.4,.16,w,.12,.06);}
    if(crown){const c=L(0,h+.5,.3);gable(trim,c[0],c[1],c[2],w+1.2,.9,.7);}
  };
  const windows=(x,z,count,span,levels=2,front=true)=>{
    for(let floor=0;floor<levels;floor++)for(let i=0;i<count;i++){
      const xx=x+(i-(count-1)/2)*span/(count-1||1);
      box('glass',xx,6+floor*7,z+(front?-.08:.08),near?2.1:2.8,near?4.2:4.8,.18);
      if(near){box('shade',xx,8.4+floor*7,z,2.7,.35,.55);box('shade',xx,3.55+floor*7,z,2.7,.3,.5);}
    }
  };
  return {spec,b,near,box,cyl,dome,gable,hip,mansard,slab,quad,win,loft,windows,a,finish:()=>{
    const root=b.finish();applyParisBuildingFrame(root,spec.id);
    root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
    root.userData.elevationDatum='Local y=0 is a rigid foundation plane at the host-selected ground datum; no DEM or sea-level height is baked.';
    return root;
  }};
}

function pantheon(t){
  const {box,cyl,dome,gable,slab,quad,win,near,a,b}=t;
  // East-west cruciform mass behind a deep hexastyle portico. The nave front wall is built in
  // piers so the three doors sit in real 3 m recesses instead of floating in front of the wall.
  box('steps',0,.8,0,79,1.6,101);
  box('stone',0,16,1.5,53,29,97);
  for(const [x,w] of [[-20.5,12],[-6,7],[6,7],[20.5,12]])box('stone',x,16,-48.5,w,29,3);
  box('stone',0,24,-48.5,53,13,3);
  for(const x of [-12,0,12])quad('glass',x,1.6,-47.12,5,15.4,Math.PI);
  box('stone',0,16,4,80,29,33);
  box('stone',0,31,0,56,2.4,103);
  box('stone',0,31,4,82.4,2.4,35);
  // Near-flat leaded roof of the cruciform arms behind a continuous parapet (no steep gables).
  const cross=[[-28,-51.5],[28,-51.5],[28,-13.5],[41.2,-13.5],[41.2,21.5],[28,21.5],[28,51.5],[-28,51.5],[-28,21.5],[-41.2,21.5],[-41.2,-13.5],[-28,-13.5]];
  const inside=(x,z)=>(Math.abs(x)<=28.01&&Math.abs(z)<=51.51)||(Math.abs(x)<=41.21&&z>=-13.51&&z<=21.51);
  const shape=new THREE.Shape(cross.map(([x,z])=>new THREE.Vector2(x,-z)));
  const roof=new THREE.ShapeGeometry(shape);roof.rotateX(-Math.PI/2);roof.translate(0,32.5,0);b.put(roof,'roof');
  for(let i=0;i<cross.length;i++){
    const [x0,z0]=cross[i],[x1,z1]=cross[(i+1)%cross.length],len=Math.hypot(x1-x0,z1-z0);
    let nx=-(z1-z0)/len,nz=(x1-x0)/len;const mx=(x0+x1)/2,mz=(z0+z1)/2;
    if(!inside(mx+nx*.4,mz+nz*.4)){nx=-nx;nz=-nz;}
    const cx=mx+nx*.35,cz=mz+nz*.35,alongX=Math.abs(z1-z0)<1e-6,L=len+.7;
    slab('stone',cx,32.2,cz,alongX?L:.7,1.3,alongX?.7:L,[2,3]);
    box('shade',mx+nx*.45,33.62,mz+nz*.45,alongX?L+.3:1.1,.25,alongX?1.1:L+.3);
  }
  // Blind sculpted panels flank the arms (the real walls have no windows), plus framed side doors.
  const panel=(x,y,z,w,h,yaw)=>win(x,y,z,w,h,{yaw,arched:false,pane:'shade',trim:'stone',mullions:false});
  for(const side of [-1,1]){
    const yaw=side*Math.PI/2;
    for(const z of near?[-40,-30,-20,30,40]:[-40,-20,40]){panel(side*26.5,4.2,z,4,4.8,yaw);panel(side*26.5,11.5,z,4,15,yaw);}
    if(near){
      for(const z of [-4,4,12]){panel(side*40,4.2,z,4.5,4.8,yaw);panel(side*40,11.5,z,4.5,15,yaw);}
      for(const z of [-34,34])win(side*26.5,1.7,z,3.2,8.4,{yaw,arched:false,trim:'stone',mullions:false});
    }
  }
  // Portico: front and rear ranks of six 2 m shafts, five on each return (22 columns), on a
  // stylobate with a ten-tread stair. Entablature and pediment sit on the front rank.
  slab('steps',0,0,-60,46,3.6,22,[3]);
  for(let i=0;i<10;i++)slab('steps',0,0,-71.325-.65*(9-i),46,(i+1)*.36,.65,[3,4]);
  const portico=[];
  for(const z of [-67.5,-52.5])for(let i=0;i<6;i++)portico.push([-20+i*8,z]);
  for(const x of [-20,20])for(let i=1;i<=5;i++)portico.push([x,-67.5+i*2.5]);
  for(const [x,z] of portico){
    a.column('stone',x,3.5,z,1.12,20);
    cyl('shade',x,23.8,z,near?1.75:1.5,1.3,near?.8:.55,near?12:8);
  }
  box('stone',0,24.2,-59.05,46,1.8,20.1);
  // Pediment: recessed tympanum in a raking cornice, apex 8.2 m above the entablature.
  gable('shade',0,24.9,-68.4,43.4,7.9,1.5);
  for(const s of [-1,1])a.bar('stone',[s*22.4,25.2,-69.2],[0,33.2,-69.2],.7);
  box('stone',0,25.25,-69.2,46,.5,1.4);
  if(near)for(let x=-17;x<=17;x+=2.5)a.column('stone',x,25.6,-69,.23,1.2+4.2*(1-Math.abs(x)/20));
  // Open-column drum, three stepped roof stages, oculus and lantern.
  cyl('stone',0,34,4,22,22,6,near?32:20);
  cyl('shade',0,41,4,17.5,17.5,11,near?32:20);
  for(let i=0;i<32;i++){
    const q=2*Math.PI*i/32;
    cyl('stone',Math.cos(q)*19.2,41,4+Math.sin(q)*19.2,.75,.8,11,near?8:6);
  }
  cyl('stone',0,47.5,4,21,21,2,near?32:20);
  cyl('shade',0,51.5,4,18.5,19,6,near?32:20);
  a.dome('roof',0,54,4,18.5,22,{ribs:near?24:12,ribMaterial:'shade'});
  cyl('stone',0,73,4,4.5,5.1,5,near?16:10);
  dome('roof',0,75.5,4,5.1,4.2,5.1);
  cyl('stone',0,79.5,4,1,1.1,5,near?10:6);
  // Rusticated courses and pilasters on the long sides (hidden spans inside the transept skipped).
  for(const side of [-1,1]){
    for(let z=-40;z<=40;z+=near?10:20)if(z+4<-14||z+4>22)box('shade',side*26.7,16,z+4,1,27,1.2);
    for(const y of [3,10,29])box('shade',side*27,y,0,.9,.5,98);
  }
}
function madeleine(t){
  const {box,gable,slab,quad,win,near,a}=t;
  // The central cella is recessed from a true continuous peristyle on a podium (top y=4).
  box('steps',0,2,0,43,4,99);
  for(const side of [-1,1])for(let i=0;i<14;i++)box('steps',0,(i+1)*4/28,side*(49.73+(13-i)*.44),43,(i+1)*4/14,.46);
  box('shade',0,14.3,0,27,20.6,79);
  for(const z of [-48,48])for(let i=0;i<8;i++)
    a.column('stone',-18+i*36/7,3.95,z,1,20.05);
  for(const x of [-18,18])for(let i=0;i<18;i++)
    a.column('stone',x,3.95,-43+i*86/17,1,20.05);
  // Entablature and a low gabled leaded roof (thin stone rim, ridge along the nave).
  box('stone',0,24.9,0,41,1.8,99.6);
  gable('roof',0,25.8,0,39.2,4.5,97.4);
  for(const side of [-1,1]){
    const zf=side*49.8;
    // Pediment: recessed tympanum under a raking cornice, apex ~7 m above the entablature.
    gable('shade',0,25.7,side*49.3,38.4,6.2,1.2);
    for(const s of [-1,1])a.bar('stone',[s*20.4,25.9,zf],[0,32.4,zf],.6);
    box('stone',0,26,side*50.1,41.4,.4,.8);
    // Three relief groups on the tympanum, each standing 40 cm off its recessed face.
    for(const [x,y,w,h] of [[0,28.9,4.6,4.2],[-9,27.9,5,2],[9,27.9,5,2]])box('stone',x,y,side*50.1,w,h,.4);
    for(const y of [24.3,25.1])box('shade',0,y,zf+side*.1,41.2,.22,.3);
  }
  // Cella door and shallow side niches: lighter than the cella wall, framed by stone.
  win(0,4.1,-39.5,7,14.9,{yaw:Math.PI,arched:true,pane:'roof',trim:'stone',mullions:false});
  if(near)for(let i=0;i<11;i++)for(const side of [-1,1])
    win(side*13.5,8,-34+i*6.8,2.4,8,{yaw:side*Math.PI/2,arched:true,pane:'steps',trim:'stone',mullions:false});
}

function hotel(t){
  const {box,cyl,near,a,gable,mansard,slab,quad,win}=t;
  // Open courtyard, two-storey wings and four projecting Renaissance pavilions. The wall masses
  // do not overlap and drop their hidden top/bottom faces (the mansards cover the tops).
  slab('stone',0,0,-37,148,20,22);
  for(const x of [-62,62])slab('stone',x,0,1,24,20,54,[2,3,4,5]);
  slab('stone',0,0,37,148,20,18);
  for(const [x,z,w,d] of [[0,-37,148,22],[-62,2,24,66],[62,2,24,66],[0,37,148,18]])mansard('slate',x,20,z,w,d,10);
  // Statues are near-only: they are sub-pixel in the far LOD.
  function statue(x,y,z,h=2){
    if(!near)return;
    cyl('stone',x,y+h*.43,z,h*.16,h*.21,h*.85,6);
    const g=new THREE.SphereGeometry(h*.17,8,5);a.place(g,'stone',x,y+h,z);
    a.bar('stone',[x-h*.25,y+h*.72,z],[x+h*.27,y+h*.55,z],h*.085);
    box('shade',x,y-.15,z,h*.6,.3,h*.55);
  }
  // Facade layers stand off their wall plane by >= 5 cm (see win()); coplanar stacks flicker.
  const front=Math.PI;
  for(const x of [-64,-32,32,64]){
    slab('stone',x,0,-43,17,27,20,[2,3,4]);mansard('roof',x,27,-43,19,22,11);
    for(const u of [-5.5,0,5.5])for(const y of [2,12,21])
      win(x+u,y,-53,2.8,y===21?4.6:6,{yaw:front,arched:y===21,trim:'shade',crown:y!==21});
    for(const u of [-8,8]){
      box('stone',x+u,15.025,-53.6,.85,23.05,1.2);
      // Tall chimney stacks define the pavilion's roof silhouette (one box each in far).
      box('stone',x+u,near?35:34.5,-43,1.7,near?11:10,2.9);
      if(near)box('shade',x+u,40.7,-43,2.2,.7,3.4);
    }
    slab('stone',x,27.5,-53,4.8,7,2);win(x,28,-54,3,5,{yaw:front,arched:true,trim:'shade'});
    gable('stone',x,34.5,-53,6,2.2,2);
    for(const y of [10.3,19.7,26.7])box('shade',x,y,-53.4,18,.6,1.2);
    for(const u of [-1,1])statue(x,38.1,-43+u*1.7,1.7);
  }
  // Central steep roof and clock frontispiece. Layers from the wall plane z=-51.5 outward:
  // niche +10 cm, clock rim +15 cm, face +24 cm, hands +30 cm, statue shelf +80 cm.
  const centralRoofTop=34;
  mansard('roof',0,20,-38,48,20,14,{ins:4});
  box('stone',0,25,-49.5,14,10,4);gable('stone',0,30,-49.5,14.6,5,4);
  a.clock(0,25.5,-51.5,3,{yaw:front,face:'clock',rim:'shade',hands:'roof'});
  a.opening('shade',0,30.5,-51.66,3,4,{yaw:front});statue(0,30.3,-52.3,3);
  for(const x of [-10,10])statue(x,21.9,-48.7,2.3);
  for(const x of [-16,16]){slab('stone',x,20.3,-48.2,5,8,2);win(x,21.5,-49.2,3.2,5,{yaw:front,arched:true,trim:'shade'});gable('stone',x,28.3,-48.2,6.6,2.4,2);}
  // Open octagonal campanile (hexagonal in far): two stacked arcades under bulbous slate caps,
  // topping out at ~51 m (Ville de Paris publishes 50 m), clearly over the central roof.
  const bx=0,bz=-38,sides=near?8:6;
  cyl('roof',bx,34,bz,4,4.8,4,sides);
  for(const [base,r,h] of [[36,3.6,5],[42.3,2.2,4.5]]){
    cyl('shade',bx,base,bz,r+.5,r+.5,.5,sides);
    for(let k=0;k<sides;k++){
      const angle=k*2*Math.PI/sides+Math.PI/sides,xx=r*Math.sin(angle),zz=bz+r*Math.cos(angle);
      if(near)a.column('stone',xx,base,zz,.27,h,6);else cyl('stone',xx,base+h/2,zz,.3,.3,h,5);
      if(near){
        const mid=angle+Math.PI/sides,apothem=r*Math.cos(Math.PI/sides);
        a.arch('shade',apothem*Math.sin(mid),base+h-.8,bz+apothem*Math.cos(mid),2*r*Math.sin(Math.PI/sides)-.5,.8,.18,.25,mid);
      }
    }
    cyl('roof',bx,base+h+.3,bz,r+.55,r+.55,.45,sides);
    a.dome('roof',0,base+h+.5,bz,r+.6,base===36?1.4:2.0,{ribs:near?8:0,ribMaterial:'shade'});
  }
  cyl('stone',bx,49.8,bz,.9,1.1,1,near?8:6);
  a.bar('gold',[0,50.3,bz],[0,51,bz],.14);
  // Lower facade: recessed door arches, rectangular upper windows, statue niches.
  for(let x=-69;x<=69;x+=near?5.3:10.6){
    if([-64,-32,32,64].some(p=>Math.abs(x-p)<9))continue;
    win(x,2,-48,2.7,6,{yaw:front,trim:'shade',crown:near});win(x,11.3,-48,2.7,6.5,{yaw:front,trim:'shade',crown:near});
    if(near&&Math.abs(x)>9){
      const nx=x+2.6;a.opening('shade',nx,12.1,-48.1,1.25,4.5,{yaw:front});
      a.arch('stone',nx,15.9,-48.1,1.4,.8,.19,.3,front);statue(nx,12.4,-48.5,2.8);
      box('shade',nx,11.9,-48.45,1.7,.45,.9);
    }
  }
  for(const x of [-21,0,21]){
    const w=x===0?4.2:6;
    a.opening('glass',x,.2,-48.12,w,9.2,{yaw:front});
    if(near){
      a.arch('stone',x,x===0?7.3:6.4,-49,w,x===0?2.1:3,.55,.65,front);
      for(const side of [-1,1])a.column('stone',x+side*(x===0?2.8:3.7),.3,-49,.32,8,6);
    }
  }
  // Base course in segments (it must not run across the doors); cornice and floor courses.
  for(const [x0,x1] of [[-73.5,-25.5],[-16.5,-3.5],[3.5,16.5],[25.5,73.5]])box('shade',(x0+x1)/2,1.2,-48.5,x1-x0,.3,1);
  for(const y of [9.7,10.5,18.9,20])box('shade',0,y,-48.5,147,y===20?.65:.3,1);
  if(near)a.balustrade('stone',0,20.4,-48.7,145);else box('stone',0,21,-48.7,145,1.2,.6);
  // The central ridge is a long narrow strip: keep the crest ornament and statues on it.
  const crestHalf=14.1,crestBays=near?26:0;
  a.bar('roof',[-crestHalf,centralRoofTop+.2,-38],[crestHalf,centralRoofTop+.2,-38],.06);
  if(crestBays)for(let i=0;i<=crestBays;i++){
    const x=-crestHalf+2*crestHalf*i/crestBays;
    a.bar('roof',[x,centralRoofTop-.05,-38],[x,centralRoofTop+1,-38],.065);
    a.bar('roof',[x-.45,centralRoofTop+.2,-38],[x+.45,centralRoofTop+.9,-38],.05);
  }
  for(const x of [-13,-10,-7.5,7.5,10,13])statue(x,centralRoofTop+.3,-38,1.6);
  // Side and rear ranges: far keeps one flat pane per window (no frames), near the full trims.
  for(const side of [-1,1])for(let z=-26;z<29;z+=6)for(const y of [3,11])win(side*74,y,z,2.8,5.5,{yaw:side*Math.PI/2,trim:'shade'});
  for(let x=-68;x<=68;x+=near?6:8)for(const y of [3,11])win(x,y,46,2.6,5.5,{yaw:0,trim:'shade'});
  for(const y of [10,18])box('shade',0,y,46.3,147,.4,.7);
}

function conciergerie(t){
  const {box,cyl,gable,hip,mansard,slab,quad,win,near,a}=t;
  // The river frontage is represented without extending into the Palace.
  slab('stone',0,0,-1,158,24,29);
  box('shade',0,24.4,-1,159,.7,30.2);
  hip('slate',0,24.75,-1,158,29,13);
  // Clock tower at eastern end; César, Argent and Bonbec on the river line. Round towers carry
  // tall, narrow slate cones (about twice the former height).
  const towers=[[-75,5.5,30,'round'],[-22,5.5,28,'round'],[2,5.2,28,'round'],[77,6,42,'square']];
  for(const [x,r,h,type] of towers){
    if(type==='square'){box('stone',x,h/2,-17,12,h,12);mansard('roof',x,h,-17,14,14,9,{ins:2,ridge:.8});}
    else{cyl('stone',x,h/2,-17,r,r,h,near?16:10);cyl('shade',x,h,-17,r+.8,r+.8,1,near?16:10);
      const coneH=x===-75?14:24,g=new THREE.ConeGeometry(r+.9,coneH,near?24:12);g.translate(x,h+coneH/2,-17);t.b.put(g,'roof');
      if(x===-75)for(let i=0;i<12;i++){const ang=i*Math.PI/6;box('stone',x+(r+.5)*Math.cos(ang),h+1,-17+(r+.5)*Math.sin(ang),.7,1.5,.7);}}
    if(near)for(let yy=9;yy<h-5;yy+=8)box('glass',x,yy,-17-r-.03,1.1,3,.15);
  }
  // Pointed windows on the river wall (z=-15.5), skipping the tower footprints and the gate.
  const clear=x=>towers.every(([tx,r])=>Math.abs(x-tx)>r+2.5);
  for(let x=-64;x<68;x+=near?8:16)if(clear(x))for(const y of [4,15])if(y>10||Math.abs(x+7)>5)win(x,y,-15.5,3,7.4,{yaw:Math.PI,pointed:true,trim:'shade'});
  for(const y of [3,12.5,23.5])box('shade',0,y,-15.7,155,.35,.4);
  // Famous gilded clock belongs on the square eastern Tour de l'Horloge (rim sunk 15 cm into the wall).
  a.clock(77,30,-23,2.1,{yaw:Math.PI,face:'clock',rim:'gold',hands:'roof'});
  for(const x of [73.7,80.3])a.column('stone',x,25.5,-23.4,.35,8);

  // Tall Gothic dormers rising from the eave, and a dark gate between the two central towers.
  for(let x=-66;x<70;x+=9)if(Math.abs(x+22)>7&&Math.abs(x-2)>7){
    slab('stone',x,24.75,-15.1,3.2,8,1.8,[3]);
    win(x,26.5,-16,1.6,4.6,{yaw:Math.PI,pointed:true,trim:'shade',mullions:false});
    gable('stone',x,32.75,-15.1,3.9,4.4,2);
  }
  quad('glass',-7,0,-15.62,5.4,10,Math.PI);
  if(near)for(let x=-67;x<70;x+=9)if(clear(x))box('stone',x,2.5,-15.75,1.1,5,.5);
}

function institut(t){
  const {box,cyl,dome,gable,mansard,slab,quad,win,loft,near,a}=t;
  // Two half-moon wings, each ONE continuous arc: stations follow the plan curve and every
  // surface (facade, cornice, courses, roof) is a ribbon between consecutive stations, so the
  // arc has no per-segment steps. Offsets run along the rear normal; front is negative.
  const K=near?14:8,half=8.5;
  const stations=side=>Array.from({length:K+1},(_,i)=>{
    const f=i/K,tx=side*57,tz=38*f,len=Math.hypot(tx,tz);
    return {x:side*(16+57*f),z:-9+19*f*f,nx:-side*tz/len,nz:side*tx/len};
  });
  const roof=[[-half,18],[-6.3,21.6],[-2,23.4],[2,23.4],[6.3,21.6],[half,18]];
  for(const side of [-1,1]){
    const st=stations(side),pt=(s,o)=>[s.x+s.nx*o,s.z+s.nz*o];
    loft('stone',st,[[-half,0],[-half,18]]);
    loft('stone',st,[[half,18],[half,0]]);
    loft('slate',st,roof,{center:[0,10]});
    loft('shade',st,[[-9.1,17],[-9.1,17.9],[-8.4,17.9],[-8.4,17]],{center:[-8.75,17.4]});
    if(near)for(const y of [9.35,17.0])loft('shade',st,[[-8.95,y],[-8.95,y+.3],[-8.45,y+.3],[-8.45,y]],{center:[-8.7,y+.15]});
    // Windows sit on each chord of the faceted front, aligned to that chord (two flat panes per chord in far).
    for(let i=0;i<K;i++){
      const [x0,z0]=pt(st[i],-half),[x1,z1]=pt(st[i+1],-half),dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz);
      const yaw=Math.atan2(side*dz/l,-side*dx/l);
      for(const fr of near?[.5]:[.27,.73])for(const y of [3,11])win(x0+dx*fr,y,z0+dz*fr,2.5,5.5,{yaw,arched:y===3,trim:'shade'});
    }
    // Close the open inner end against the chapel mass.
    const s=st[0],c=[[-half,0],[-half,18],[-6.3,21.6],[-2,23.4],[2,23.4],[6.3,21.6],[half,18],[half,0]];
    const pos=[],nor=[],idx=[];
    for(const [o,y] of c){pos.push(s.x+s.nx*o,y,s.z+s.nz*o);nor.push(-side,0,0);}
    for(let i=1;i<c.length-1;i++)idx.push(0,side>0?i:i+1,side>0?i+1:i);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setIndex(idx);t.b.put(g,'stone');
  }
  // End pavilions: steep mansards over rigid masses.
  for(const x of [-75,75]){
    slab('stone',x,0,8,19,24,23);mansard('slate',x,24,8,20,24,7,{ins:2.2,ridge:.8});
    for(const u of [-5,0,5])for(const y of [3,12])win(x+u,y,-3.5,2.6,6,{yaw:Math.PI,trim:'shade'});
  }
  // Chapelle: stepped mass (podium block, then a narrower attic) with cornices and pilasters.
  slab('stone',0,0,5,36,19.5,37,[2,3]);
  box('shade',0,19.8,5,37.4,.6,38.4);
  slab('stone',0,20.1,5,31,5.9,31,[2,3]);
  box('shade',0,25.7,5,32.8,.6,32.8);
  if(near){
    for(const side of [-1,1])for(let z=5;z<=22;z+=6)box('shade',side*18.2,9.5,z,.5,18.6,1.4);
    for(let x=-14;x<=14;x+=7)box('shade',x,9.5,23.7,1.4,18.6,.5);
    for(const x of [-10.5,-3.5,3.5,10.5])for(const y of [3,11])win(x,y,23.5,2.4,5.5,{yaw:0,arched:y===3,trim:'shade'});
  }
  // Portico on a low stylobate: six columns, entablature, pediment, door.
  box('steps',0,.6,-15.5,38.4,1.2,6.4);
  for(const x of [-15,-10,-5,5,10,15])a.column('stone',x,1.2,-15.5,.78,17.9);
  box('stone',0,20,-15.5,38,1.8,5);
  gable('stone',0,20.9,-17,35,5,2.3);
  box('clock',0,22.5,-18.2,2.5,2.5,.15);
  win(0,1.3,-13.5,7,14.9,{yaw:Math.PI,arched:true,trim:'shade'});
  // Arched drum, 44 m cupola.
  cyl('stone',0,27.4,5,15.5,15.5,14.8,near?28:16);
  for(let i=0;i<16;i++){const q=i*Math.PI*2/16;
    const x=Math.cos(q)*15.52,z=5+Math.sin(q)*15.52;
    cyl('stone',x,30,z,.55,.62,6,near?8:6);
    if(i%2===0)a.window(Math.cos(q)*15.7,25.5,5+Math.sin(q)*15.7,2.3,6,{yaw:Math.PI/2-q,stone:'shade'});
  }
  cyl('shade',0,34,5,16,16,2,near?28:16);
  a.dome('slate',0,35,5,15,8,{ribs:near?16:8,ribMaterial:'shade'});
  cyl('stone',0,42,5,2.2,2.6,2,near?12:8);
  dome('slate',0,43,5,2.6,1,2.6);
}

export function createParisHistoric(id,{detail='near'}={}){
  if(!S[id])throw new Error('Unknown Paris historic landmark: '+id);
  const t=tools(id,detail);
  ({'paris-pantheon':pantheon,'paris-hotel-de-ville':hotel,'paris-conciergerie':conciergerie,'paris-madeleine':madeleine,'paris-institut-de-france':institut})[id](t);
  return t.finish();
}
export const createPantheon=options=>createParisHistoric('paris-pantheon',options);
export const createHotelDeVille=options=>createParisHistoric('paris-hotel-de-ville',options);
export const createConciergerie=options=>createParisHistoric('paris-conciergerie',options);
export const createMadeleine=options=>createParisHistoric('paris-madeleine',options);
export const createInstitutDeFrance=options=>createParisHistoric('paris-institut-de-france',options);
