import {BufferGeometry,Float32BufferAttribute,Shape,ExtrudeGeometry,LatheGeometry,Vector2,SphereGeometry,CylinderGeometry,TorusGeometry} from 'three';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,START,END,PIERS,HALF,ROAD_HALF} from './arlington-memorial-bridge-profile.js';

// One station/lateral surface for structure, pavement and navigation. All repetitions merged by material/chunk.
export function create({detail='near'}={}){
  const near=detail==='near',b=bridgeBuilder(p,detail),h=p.deckHeight;
  const chunk=s=>near?Math.max(0,Math.min(3,Math.floor((s-START)/(END-START)*4))):0;
  function place(g,mat,s,d,y,lift=1){const a=g.attributes.position;for(let i=0;i<a.count;i++){const q=p.bridgePoint(s+a.getX(i),d+a.getZ(i),y+a.getY(i));a.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();b.put(g,mat,chunk(s),lift);}
  // Exposed ashlar joints are two-triangle face strips, not twelve-triangle solids.
  function joint(mat,a,c,w,depth,batch){const dx=c[0]-a[0],dy=c[2]-a[2],len=Math.hypot(dx,dy);if(len<.001)return;const ex=-dy/len*w/2,ey=dx/len*w/2;
    const g=new BufferGeometry(),pos=[];for(const [s,y] of [[a[0]-ex,a[2]-ey],[c[0]-ex,c[2]-ey],[c[0]+ex,c[2]+ey],[a[0]+ex,a[2]+ey]])pos.push(...b.xyz(s,a[1],y));
    g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(a[1]>0?[0,1,2,0,2,3]:[0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,mat,batch);
  }
  const box=(mat,s,d,y,l,w,t,lift=1)=>b.box(mat,s,d,y,l,w,t,chunk(s),lift);
  const sphere=(mat,s,d,y,scale)=>{const g=new SphereGeometry(1,near?8:5,near?6:4);g.scale(...scale);place(g,mat,s,d,y);};
  const strip=(mat,a,c,l,r,off,thick=0)=>{for(let s=a;s<c;){const end=Math.min(c,START+(chunk(s)+1)*(END-START)/4),e=end>s+.001?end:c;b.strip(mat,s,e,l,r,off,thick,chunk(s));s=e;}};
  strip('asphalt',0,p.BRIDGE_LENGTH,-ROAD_HALF,ROAD_HALF,0);
  strip('stone',START,END,-HALF,HALF,-.16,.42);
  for(const side of [-1,1]){
    strip('trim',START,END,side<0?-HALF:ROAD_HALF,side<0?-ROAD_HALF:HALF,.22,.40);
    strip('trim',START,END,side*HALF-.27,side*HALF+.27,1.47,.21);
    strip('stone',START,END,side*HALF-.25,side*HALF+.25,.48,.26);
    for(let s=START+.6;s<END-.6;s+=near?1.12:3.36){if(PIERS.some(v=>Math.abs(v-s)<4))continue;
      const g=new LatheGeometry([new Vector2(.16,0),new Vector2(.11,.18),new Vector2(.19,.40),new Vector2(.10,.65),new Vector2(.15,.82)],near?6:4);
      place(g,'trim',s,side*HALF,h(s)+.48);
    }
  }
  // The masonry is a closed full-width arch prism: open soffits survive both LODs.
  const supports=[START,...PIERS,END];
  for(let k=0;k<supports.length-1;k++){
    const river=k>0&&k<10,a=supports[k]+(k?5:0),c=supports[k+1]-(k<10?5:0),mid=(a+c)/2;
    const n=near?32:16,peak=Math.max(.10,Math.min(h(mid)-1.3,8.2)),rise=Math.min(6.8,Math.max(.1,peak-.2));
    const shape=new Shape();shape.moveTo(a-mid,h(a)-.56);
    for(let i=1;i<=n;i++){const s=a+(c-a)*i/n;shape.lineTo(s-mid,h(s)-.56);}
    for(let i=n;i>=0;i--){const t=i/n,s=a+(c-a)*t,y=Math.min(h(s)-.72,peak-rise*(2*t-1)**2);shape.lineTo(s-mid,Math.max(-.15,y));}
    shape.closePath();const g=new ExtrudeGeometry(shape,{depth:2*HALF,bevelEnabled:false,curveSegments:1,steps:1});g.translate(0,0,-HALF);
    place(g,k===5?'recess':'stone',mid,0,0,y=>Math.max(0,Math.min(1,(y+.2)/9.7)));
    if(near){
      // Ashlar bed and staggered head joints, clipped to the arch spandrel rather than across its opening.
      for(let u=a;u<c;u+=2.8){const v=Math.min(c,u+2.8),t=((u+v)/2-a)/(c-a),soffit=Math.min(h((u+v)/2)-.72,peak-rise*(2*t-1)**2);
        for(let y=Math.ceil((soffit+.18)/.7)*.7;y<h((u+v)/2)-.67;y+=.7)for(const side of [-1,1]){
          joint('recess',[u,side*(HALF+.07),y],[v,side*(HALF+.07),y],.025,.025,chunk(mid));
          const seam=u+((Math.round(y/.7)%2)?1.4:0);if(seam<v)joint('recess',[seam,side*(HALF+.07),y],[seam,side*(HALF+.07),Math.min(y+.65,h(seam)-.62)],.025,.025,chunk(mid));
        }
      }
      for(let i=1;i<n;i++){const t=i/n,s=a+(c-a)*t,y=Math.max(-.15,Math.min(h(s)-.72,peak-rise*(2*t-1)**2));for(const side of [-1,1])joint('recess',[s,side*(HALF+.055),y+.03],[s,side*(HALF+.055),Math.min(y+.64,h(s)-.62)],.025,.025,chunk(s));}
      if(river&&k!==5)for(const side of [-1,1]){box('trim',mid,side*(HALF+.13),h(mid)-1.22,1.1,.35,1.25);sphere('stone',mid,side*(HALF+.40),h(mid)-1.3,[.46,.50,.25]);sphere('trim',mid,side*(HALF+.57),h(mid)-1.50,[.28,.20,.15]);for(const dx of [-.44,.44])sphere('trim',mid+dx,side*(HALF+.43),h(mid)-1.10,[.22,.12,.12]);}
    }
  }
  for(let i=0;i<PIERS.length;i++){
    const s=PIERS[i],top=h(s)-.56;
    box('stone',s,0,top/2,10,2*HALF,top,y=>Math.max(0,Math.min(1,y/Math.max(.1,top))));
    for(const side of [-1,1]){
      const g=new CylinderGeometry(4.7,5.0,Math.max(.1,top),near?12:8);place(g,'stone',s,side*(HALF-.2),top/2,y=>Math.max(0,Math.min(1,y/Math.max(.1,top))));
      box('trim',s,side*HALF,h(s)+.93,7.5,.8,1.08);
      if(i>0&&i<9){const y=Math.max(2.2,h(s)-3.4),disc=new CylinderGeometry(1.829,1.829,.14,near?24:12);disc.rotateX(Math.PI/2);place(disc,'trim',s,side*(HALF+4.56),y);
        if(near){sphere('stone',s,side*(HALF+4.7),y,[.25,.72,.1]);for(const sign of [-1,1])b.beam('stone',[s,side*(HALF+4.73),y+.25],[s+sign*1.3,side*(HALF+4.73),y+.68],.35,.16,chunk(s));for(const dx of [-2.4,2.4])box('trim',s+dx,side*(HALF+4.55),y,.23,.16,2.8);}
      }
    }
  }
  for(let s=START+14;s<END-10;s+=near?25:50)for(const side of [-1,1]){const d=side*(ROAD_HALF+.48),y=h(s)+.22;box('iron',s,d,y+.27,.42,.42,.54);box('iron',s,d,y+2.3,.14,.14,4.1);sphere('lamp',s,d,y+4.52,[.29,.38,.29]);box('iron',s,d,y+4.93,.25,.25,.16);}
  // West-bank granite pylons, pilasters and perched eagles.
  for(const side of [-1,1]){const s=START+7,d=side*12,y=h(s)+.22;
    box('trim',s,d,y+.28,3.4,3.4,.56);box('stone',s,d,y+5.1,2.55,2.55,9.7);
    for(const dx of [-1.18,1.18])for(const dz of [-1.18,1.18])box('trim',s+dx,d+dz,y+5.05,.24,.24,9.55);
    box('trim',s,d,y+10.1,3.1,3.1,.5);sphere('stone',s,d,y+11.1,[.6,.85,.6]);
    for(const sign of [-1,1])b.beam('stone',[s+sign*.1,d,y+11.4],[s+sign*1.1,d,y+12.7],.45,.55,chunk(s));
    if(near){const g=new TorusGeometry(.58,.10,4,16);place(g,'trim',s,d+1.34,y+7.8);}
  }
  // East Arts of War: pedestals and original faceted horse/rider abstractions.
  for(const side of [-1,1]){const s=END-9,d=side*12,y=h(s)+.22;
    box('trim',s,d,y+.3,3.7,3.3,.6);box('stone',s,d,y+3.4,2.8,2.5,5.8);box('trim',s,d,y+6.4,3.25,2.95,.4);const base=y+6.6;
    sphere('gold',s,d,base+2.05,[1.32,.60,.50]);
    for(const dx of [-.85,.80])for(const dd of [-.34,.34])b.beam('gold',[s+dx,d+dd,base+.08],[s+dx-.15,d+dd,base+1.95],.18,.18,chunk(s));
    sphere('gold',s-.96,d,base+2.83,[.43,.93,.37]);sphere('gold',s-1.27,d,base+3.52,[.43,.36,.27]);b.beam('gold',[s+1.2,d,base+2.3],[s+1.68,d,base+1],.16,.16,chunk(s));
    sphere('gold',s+.1,d,base+3.32,[.40,.65,.28]);sphere('gold',s+.1,d,base+4.14,[.23,.29,.23]);b.beam('gold',[s+.1,d,base+3.5],[s-.85,d,base+3.7],.16,.16,chunk(s));
    sphere('gold',s+.95,d+.63,base+1.3,[.33,.92,.28]);sphere('gold',s+.95,d+.63,base+2.55,[.22,.27,.22]);
  }
  for(const d of [-.1,.1])strip('paint',0,p.BRIDGE_LENGTH,d-.04,d+.04,.025);
  if(near)for(const d of [-6.096,-3.048,3.048,6.096])for(let s=0;s+3<p.BRIDGE_LENGTH;s+=9)b.strip('paint',s,s+3,d-.045,d+.045,.025,0,chunk(s));
  return b.finish();
}
