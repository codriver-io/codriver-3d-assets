import * as THREE from 'three';

// Repeated features merge by material. Near panes leave gaps for mullions;
// the far facade retains every bay and row as its own quad.
export function buildPalace(b, near) {
  const seg = near ? 20 : 12;
  function face(mat, points) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
    const ix = []; for (let i = 1; i < points.length - 1; i++) ix.push(0, i, i + 1);
    g.setIndex(ix); g.computeVertexNormals(); b.put(g, mat);
  }
  function box(mat, x0, x1, y0, y1, z0, z1) {
    b.box(mat, [(x0+x1)/2,(y0+y1)/2,(z0+z1)/2], [x1-x0,y1-y0,z1-z0]);
  }
  function cylinder(mat,x,y,z,r0,r1,h,n=seg) {
    const g = new THREE.CylinderGeometry(r1,r0,h,n,1,false); g.translate(x,y+h/2,z); b.put(g,mat);
  }
  function sphere(mat,x,y,z,r,sx=1,sy=1,sz=1) {
    const g = new THREE.SphereGeometry(r,near?10:6,near?6:4);g.scale(sx,sy,sz);g.translate(x,y,z);b.put(g,mat);
  }
  function hip(x0,x1,z0,z1,ye,yr,alongZ=true) {
    const cx=(x0+x1)/2,cz=(z0+z1)/2,w=Math.min(x1-x0,z1-z0)/2;
    const A=[x0,ye,z0],B=[x0,ye,z1],C=[x1,ye,z1],D=[x1,ye,z0];
    const E=alongZ?[cx,yr,z0+w]:[x0+w,yr,cz],F=alongZ?[cx,yr,z1-w]:[x1-w,yr,cz];
    if(alongZ){face('roof',[B,F,E,A]);face('roof',[C,F,B]);face('roof',[D,E,F,C]);face('roof',[A,E,D]);}
    else {face('roof',[B,E,A]);face('roof',[C,F,E,B]);face('roof',[D,F,C]);face('roof',[A,E,F,D]);}
  }
  const point=(axis,f,a,y)=>axis==='x'?[f,y,a]:[a,y,f];
  function panel(mat,axis,f,sign,a0,a1,y0,y1) {
    const q=[point(axis,f,a0,y0),point(axis,f,a1,y0),point(axis,f,a1,y1),point(axis,f,a0,y1)];
    if((axis==='x'&&sign>0)||(axis==='z'&&sign<0))q.reverse();face(mat,q);
  }
  function wallStrip(mat,axis,f,sign,a0,a1,y0,y1,depth=.25) {
    const inner=f-sign*.08,outer=f+sign*depth;
    if(axis==='x')box(mat,Math.min(inner,outer),Math.max(inner,outer),y0,y1,a0,a1);
    else box(mat,a0,a1,y0,y1,Math.min(inner,outer),Math.max(inner,outer));
  }
  function window(axis,f,sign,a,y,h,w=1.5,lit=false) {
    const fa=f+sign*(near?.23:.56),frame=f+sign*.34,mat=lit?'light':'glass';
    if(near){
      for(const [lo,hi] of [[a-w/2,a-.07],[a+.07,a+w/2]])for(const [yb,yt] of [[y,y+h*.48-.07],[y+h*.48+.07,y+h]])panel(mat,axis,fa,sign,lo,hi,yb,yt);
      panel('trim',axis,frame,sign,a-.07,a+.07,y,y+h);
      panel('trim',axis,frame,sign,a-w/2,a+w/2,y+h*.48-.07,y+h*.48+.07);
    }else { panel(mat,axis,fa,sign,a-w/2,a+w/2,y,y+h); return; }
    panel('trim',axis,fa,sign,a-w/2-.16,a-w/2,y-.15,y+h+.15);
    panel('trim',axis,fa,sign,a+w/2,a+w/2+.16,y-.15,y+h+.15);
    panel('trim',axis,fa,sign,a-w/2,a+w/2,y-.15,y);
    panel('trim',axis,fa,sign,a-w/2,a+w/2,y+h,y+h+.15);
    if(near)wallStrip('trim',axis,f,sign,a-w/2-.22,a+w/2+.22,y-.27,y-.15,.40);
  }
  function elevation(axis,f,sign,start,end,n,front=false) {
    const step=(end-start)/n;
    for(let i=0;i<n;i++){
      const a=start+step*(i+.5),central=front&&Math.abs(a)<12.0,ff=central?30.9:f;
      if(!central)window(axis,ff,sign,a,1.0,1.55,1.35);
      for(const [y,h] of [[5.4,3.9],[10.8,1.6],[16.0,3.9],[21.4,1.6]])window(axis,ff,sign,a,y,h,1.55,i%7===1&&y===16);
    }
    const spans=front?[[start,-12.6,f],[-12.6,12.6,30.9],[12.6,end,f]]:[[start,end,f]];
    for(const [a0,a1,ff] of spans){
      for(const [y,h] of [[4.35,.4],[13.5,.55],[24.35,.65]])wallStrip('trim',axis,ff,sign,a0,a1,y,y+h,near?.5:.62);
      for(let i=0;i<=n;i++){
        const a=start+step*i;if(a<a0+.2||a>a1-.2)continue;
        for(const [yb,yt]of [[4.9,13.4],[15.1,24.2]]){
          wallStrip('trim',axis,ff,sign,a-.28,a+.28,yb,yt,near?.3:.55);
          if(near){wallStrip('trim',axis,ff,sign,a-.40,a+.40,yt-.32,yt,.46);wallStrip('trim',axis,ff,sign,a-.38,a+.38,yb,yb+.32,.46);}
        }
      }
    }
    if(near)for(let y=.75;y<4.3;y+=.65)wallStrip('trim',axis,f,sign,start,end,y,y+.075,.12);
  }
  // Four outer ranges and central Citizens' Hall leave two courtyards open.
  box('stone',15.3,27.3,0,25,-40,40);
  box('stone',-28.7,-17.3,0,25,-40,40);
  box('stone',-17.3,15.3,0,25,-39.7,-28);
  box('stone',-17.3,15.3,0,25,28,38.5);
  box('stone',-17.3,15.3,0,25,-5.7,5.7);
  for(const x of [-15,9])box('stone',x-2.7,x+2.7,0,18,-28,28);
  for(const z of [-24,24])box('stone',-12.3,6.3,0,18,z-2.5,z+2.5);
  hip(15.3,27.3,-33.7,33.7,25,30,true);
  hip(-28.7,-17.3,-33.7,33.7,25,30,true);
  hip(-23,21,-39.7,-28,25,30,false);
  hip(-23,21,28,38.5,25,30,false);
  hip(-24,21,-5.7,5.7,25,30,false);
  for(const x of [-15,9])hip(x-2.7,x+2.7,-28,28,18,23,true);
  for(const z of [-24,24])hip(-12.3,6.3,z-2.5,z+2.5,18,23,false);
  for(const x of [-23,21])for(const z of [-33.7,33.7])hip(x-6.0,x+6.0,z-6.0,z+6.0,25,31,true);

  // Seven small arches: spandrels are tessellated to curved soffits and the
  // closed door planes are recessed 3.2 m behind the projecting front.
  box('stone',27.3,30.9,4.5,25,-12.6,12.6);
  const doors=Array.from({length:7},(_,i)=>(i-3)*3.4);let last=-12.6;
  for(const z of doors){
    box('stone',27.3,30.9,0,4.5,last,z-.9);last=z+.9;
    box('glass',27.48,27.7,0,2.8,z-.9,z+.9);
    const ns=near?10:6;
    for(let i=0;i<ns;i++){
      const a=Math.PI*i/ns,c=Math.PI*(i+1)/ns;
      const za=z+.9*Math.cos(a),zc=z+.9*Math.cos(c),ya=2.8+.9*Math.sin(a),yc=2.8+.9*Math.sin(c);
      face('stone',[[30.9,ya,za],[30.9,4.5,za],[30.9,4.5,zc],[30.9,yc,zc]]);
      face('stone',[[27.3,ya,za],[30.9,ya,za],[30.9,yc,zc],[27.3,yc,zc]]);
      face('glass',[[27.71,2.8,z],[27.71,yc,zc],[27.71,ya,za]]);
    }
  }
  box('stone',27.3,30.9,0,4.5,last,12.6);
  box('stone',-33.1,-28.7,0,25,-12.6,12.6);
  elevation('x',27.3,1,-39.1,39.1,23,true);
  elevation('x',-28.7,-1,-39.1,39.1,23);
  elevation('x',-33.1,-1,-12.0,12.0,7);
  elevation('z',-39.7,-1,-27.4,26.2,16);
  elevation('z',38.5,1,-17.1,15.1,10);
  elevation('z',40,1,-28.6,-17.4,3); elevation('z',40,1,15.4,27.2,3);
  for(const x of [-17.3,15.3])for(const [a0,a1]of [[-27,-6.3],[6.3,27]])for(let z=a0+2;z<a1;z+=3.7)for(const y of [6,11.5,17.5])window('x',x,x<0?1:-1,z,y,2.5,1.25);

  function figure(mat,x,y,z,h,relief=false){
    const d=relief?.42:.7;
    sphere(mat,x,y+h*.85,z,h*.12,d/.7,1,1);
    const g=new THREE.CylinderGeometry(h*.17,h*.25,h*.48,near?6:4);g.scale(d,1,1);g.translate(x,y+h*.50,z);b.put(g,mat);
    b.bar(mat,[x,y+h*.43,z-.16*h],[x,y,z-.23*h],h*.13,h*.17);
    b.bar(mat,[x,y+h*.43,z+.16*h],[x,y,z+.23*h],h*.13,h*.17);
    b.bar(mat,[x,y+h*.68,z],[x,y+h*.42,z-.37*h],h*.12,h*.15);
    b.bar(mat,[x,y+h*.68,z],[x,y+h*.50,z+.37*h],h*.12,h*.15);
  }
  function pediment(f,sign){
    const x=f+sign*.36;
    face('trim',sign>0?[[x,25,-12.8],[x,32,0],[x,25,12.8]]:[[x,25,12.8],[x,32,0],[x,25,-12.8]]);
    b.bar('trim',[x,25,-12.8],[x,32,0],.48,.60);b.bar('trim',[x,32,0],[x,25,12.8],.48,.60);
    wallStrip('trim','x',f,sign,-13.0,13.0,24.8,25.35,.65);
    for(const z of [-9,-6,-3,0,3,6,9])figure('trim',x+sign*.05,25.35,z,(1-Math.abs(z)/14)*3.8,true);
    face('roof',[[f-sign*4,29.6,0],[x,32,0],[x,25,-12.8]]);
    face('roof',[[x,25,12.8],[x,32,0],[f-sign*4,29.6,0]]);
  }
  pediment(30.9,1);pediment(-33.1,-1);
  for(const z of [-12.1,12.1]){box('stone',29.6,30.8,25,25.8,z-.6,z+.6);figure('bronze',30.2,25.8,z,2.7);}
  box('stone',29.4,30.6,31.1,32.25,-.6,.6);figure('bronze',30.0,32.25,0,2.5);
  // Atlas crouching under a globe; total six metres above its seat.
  box('stone',-33.2,-31.4,31.1,32,-.9,.9);figure('bronze',-32.3,32,0,3.3);
  sphere('bronze',-32.3,36.5,0,1.5);
  b.bar('bronze',[-32.3,33.8,-1.05],[-32.3,35.4,-1],.35,.4);
  b.bar('bronze',[-32.3,33.8,1.05],[-32.3,35.4,1],.35,.4);
  if(near){
    for(const z of [-33.7,-22,-15,15,22,33.7])for(const x of [-23,21]){
      box('stone',x-.55,x+.55,29.6,32.2,z-.55,z+.55);box('roof',x-.70,x+.70,32.05,32.45,z-.70,z+.70);
    }
    for(const f of [-28.7,27.3])for(const z of [-27,-18,18,27]){
      const x=f+(f>0?-1.9:1.9);box('trim',x-.6,x+.6,26.3,28.3,z-.6,z+.6);
      window('x',f>0?x+.6:x-.6,f>0?1:-1,z,26.55,1.35,.62);hip(x-.72,x+.72,z-.72,z+.72,28.3,28.9,true);
    }
  }
  // Open octagonal belfry, paired piers and broad domed cupola.
  const tx=21.0;
  cylinder('stone',tx,29.5,0,4.6,4.6,3.0,8);
  cylinder('trim',tx,32.2,0,4.95,4.95,.7,8);
  cylinder('trim',tx,41.8,0,4.95,4.95,.65,8);
  for(let i=0;i<8;i++){
    const a=Math.PI*(i+.5)/4,x=tx+4.25*Math.cos(a),z=4.25*Math.sin(a);
    cylinder('trim',x,32.85,z,.48,.43,7.9,near?8:5);cylinder('trim',x,40.65,z,.62,.62,1.2,near?8:5);
  }
  // Arched spandrels connect each pair of cupola piers to the cornice.
  for(let i=0;i<8;i++){
    const a=(i+.5)*Math.PI/4,c=(i+1.5)*Math.PI/4;
    const ax=tx+4.25*Math.cos(a),az=4.25*Math.sin(a),cx=tx+4.25*Math.cos(c),cz=4.25*Math.sin(c);
    const n=near?8:5;
    const p=(t,y)=>[ax+(cx-ax)*t,y,az+(cz-az)*t];
    for(let j=0;j<n;j++){
      const t=j/n,u=(j+1)/n,yt=39.25+1.6*Math.sqrt(Math.max(0,1-(2*t-1)**2)),yu=39.25+1.6*Math.sqrt(Math.max(0,1-(2*u-1)**2));
      // Clockwise wall direction around the tower requires outward winding.
      face('trim',[p(t,yt),p(t,41.95),p(u,41.95),p(u,yu)]);
      // Inward return provides the shaded thickness of the arched soffit.
      const inner=q=>[tx+(q[0]-tx)*.92,q[1],q[2]*.92];
      face('trim',[p(t,yt),p(u,yu),inner(p(u,yu)),inner(p(t,yt))]);
    }
  }
  const pierX=4.25*Math.cos(Math.PI/8),bellZ=4.25*Math.sin(Math.PI/8);
  box('trim',tx-pierX,tx+pierX,40.35,40.65,bellZ-.25,bellZ+.25);
  cylinder('bronze',tx,37.9,bellZ,.95,.35,1.6,near?10:6);
  b.bar('trim',[tx,39.3,bellZ],[tx,40.55,bellZ],.18,.18);
  for(const sign of [-1,1]){
    const x=tx+sign*4.62,y=35.6,r=1.25,pts=[];
    box('bronze',Math.min(tx+sign*4.1,x),Math.max(tx+sign*4.1,x),32.75,37.1,-1.38,1.38);
    for(let i=0;i<seg;i++){const a=i/seg*Math.PI*2;pts.push([x,y+r*Math.sin(a),r*Math.cos(a)]);}if(sign>0)pts.reverse();face('glass',pts);
    panel('gold','x',x+sign*.16,sign,-.08,.08,y-.05,y+.86);panel('gold','x',x+sign*.16,sign,-.06,.73,y-.08,y+.08);
    if(near)for(let i=0;i<12;i++){const a=i*Math.PI/6,z=1.05*Math.cos(a),h=y+1.05*Math.sin(a);panel('gold','x',x+sign*.16,sign,z-.06,z+.06,h-.06,h+.06);}
  }
  const profile=[[4.65,42.45],[4.6,43.1],[4.15,44.0],[3.3,45],[2.15,45.7],[1.0,46.1]];
  for(let j=0;j<profile.length-1;j++){
    const [r0,y0]=profile[j],[r1,y1]=profile[j+1];
    for(let i=0;i<seg;i++){
      const a=i/seg*Math.PI*2,c=(i+1)/seg*Math.PI*2;
      face('roof',[[tx+r0*Math.cos(a),y0,r0*Math.sin(a)],[tx+r1*Math.cos(a),y1,r1*Math.sin(a)],[tx+r1*Math.cos(c),y1,r1*Math.sin(c)],[tx+r0*Math.cos(c),y0,r0*Math.sin(c)]]);
    }
  }
  cylinder('roof',tx,46.0,0,1.1,.65,1.5,8);cylinder('gold',tx,47.4,0,.18,.12,3.1,near?8:5);
  // Golden sailing ship vane: original silhouette, no texture or lettering.
  box('gold',tx-.16,tx+.16,49.35,49.65,-1.35,1.35);
  for(const z of [-.8,0,.8]){
    b.bar('gold',[tx,49.55,z],[tx,50.7-Math.abs(z)*.4,z],.09,.09);
    panel('gold','x',tx+.08,1,z-.33,z+.31,49.85,50.55-Math.abs(z)*.3);panel('gold','x',tx-.08,-1,z-.33,z+.31,49.85,50.55-Math.abs(z)*.3);
  }
  b.bar('gold',[tx,50.5,0],[tx,51,0],.09,.09);
}
