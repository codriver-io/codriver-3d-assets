import * as THREE from 'three';

export function gardeKit(b,near) {
  const put=(g,mat)=>b.put(g,mat);
  const box=(mat,p,s,a=0)=>b.box(mat,p,s,a);
  const bar=(mat,a,c,w,d=w)=>b.bar(mat,a,c,w,d);
  const segments=near?12:6;
  function solid(points,depth,mat,face,plane,mode='closed') {
    const contour=points.map(([x,y])=>new THREE.Vector2(x,y));
    const triangles=THREE.ShapeUtils.triangulateShape(contour,[]);
    const vertices=[],normals=[],indices=[];
    const map=(q,y,d)=>face==='v+'?[q,y,plane-depth+d]:face==='v-'?[q,y,plane+depth-d]:face==='u+'?[plane-depth+d,y,q]:[plane+depth-d,y,q];
    const reverse=face==='v-'||face==='u+';
    function triangle(a,c,d) {
      if(reverse)[c,d]=[d,c];
      const va=new THREE.Vector3(...a),vc=new THREE.Vector3(...c),vd=new THREE.Vector3(...d);
      const n=vc.clone().sub(va).cross(vd.clone().sub(va)).normalize();
      const ix=vertices.length/3;vertices.push(...a,...c,...d);normals.push(...n.toArray(),...n.toArray(),...n.toArray());indices.push(ix,ix+1,ix+2);
    }
    for(const [a,c,d] of triangles) {
      triangle(map(...points[a],depth),map(...points[c],depth),map(...points[d],depth));
      if(mode!=='face')triangle(map(...points[d],0),map(...points[c],0),map(...points[a],0));
    }
    if(mode==='closed')for(let i=0;i<points.length;i++) {
      const j=(i+1)%points.length;
      triangle(map(...points[i],0),map(...points[j],0),map(...points[j],depth));
      triangle(map(...points[i],0),map(...points[j],depth),map(...points[i],depth));
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices);put(g,mat);
  }
  const rect=(x0,x1,y0,y1,d,mat,face,plane)=>{if(x1-x0>.0001&&y1-y0>.0001)solid([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],d,mat,face,plane,near?'closed':'face');};
  const edge=(w,y)=> {
    if(y < w.bottom-1e-6||y>w.spring+w.width/2+1e-6)return null;
    const r=w.width/2,dx=y<=w.spring?r:Math.sqrt(Math.max(0,r*r-(y-w.spring)**2));
    return [w.q-dx,w.q+dx];
  };
  function wall(face,plane,left,right,bottom,top,windows=[],depth=.65,plain=false) {
    const levels=new Set([bottom,top]);
    const period=near?1.08:2.16, pale=period*.63;
    if(!plain)for(let y=bottom;y<top;y+=period){levels.add(y);levels.add(Math.min(top,y+pale));levels.add(Math.min(top,y+period));}
    for(const w of windows){levels.add(w.bottom);levels.add(w.spring);for(let i=1;i<=segments/2;i++)levels.add(w.spring+w.width/2*Math.sin(i*Math.PI/segments));}
    const yy=[...levels].filter(y=>y>=bottom&&y<=top).sort((a,c)=>a-c);
    for(let i=1;i<yy.length;i++){
      const lo=yy[i-1],hi=yy[i],mid=(lo+hi)/2;
      if(hi-lo<1e-5)continue;
      const active=windows.filter(w=>edge(w,mid)).sort((a,c)=>a.q-c.q);
      const lows=active.map(w=>edge(w,lo)||[w.q,w.q]), highs=active.map(w=>edge(w,hi)||[w.q,w.q]);
      const mat=plain?'stone':((mid-bottom)%period<pale?'stone':'green');
      for(let j=0;j<=active.length;j++) {
        const a=j?lows[j-1][1]:left,c=j<active.length?lows[j][0]:right;
        const d=j?highs[j-1][1]:left,e=j<active.length?highs[j][0]:right;
        if(Math.max(c-a,e-d)>1e-5)solid([[a,lo],[c,lo],[e,hi],[d,hi]],depth,mat,face,plane,near?'shell':'face');
      }
    }
    const reveal=(a,c)=> {
      if(Math.hypot(c[0]-a[0],c[1]-a[1])<1e-5)return;
      const map=(q,y,d)=>face==='v+'?[q,y,plane-depth+d]:face==='v-'?[q,y,plane+depth-d]:face==='u+'?[plane-depth+d,y,q]:[plane+depth-d,y,q];
      const pts=[map(...a,0),map(...c,0),map(...c,depth),map(...a,depth)];
      const ix=face==='v-'||face==='u+'?[0,2,1,0,3,2]:[0,1,2,0,2,3];
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(ix);g.computeVertexNormals();put(g,'stone');
    };
    const outer=[[left,bottom],[right,bottom],[right,top],[left,top]];
    for(const j of [0,2])reveal(outer[j],outer[(j+1)%4]);
    for(const w of windows) {
      const r=w.width/2;
      const pts=[[w.q-r,w.bottom],[w.q+r,w.bottom],[w.q+r,w.spring]];
      for(let j=1;j<=segments/2;j++)pts.push([w.q+r*Math.cos(j*Math.PI/(segments/2)),w.spring+r*Math.sin(j*Math.PI/(segments/2))]);
      for(let j=0;j<pts.length;j++)if(pts[j][1]>=bottom&&pts[(j+1)%pts.length][1]<=top)reveal(pts[j],pts[(j+1)%pts.length]);
    }
  }
  function arch(face,plane,q,bottom,spring,width,thickness=.27,mat='trim',depth=.22,striped=false) {
    const r=width/2;
    rect(q-r-thickness,q-r,bottom,spring,depth,mat,face,plane);
    rect(q+r,q+r+thickness,bottom,spring,depth,mat,face,plane);
    for(let i=0;i<segments;i++) {
      const a=i*Math.PI/segments,c=(i+1)*Math.PI/segments;
      const pt=(t,rad)=>[q+Math.cos(t)*rad,spring+Math.sin(t)*rad];
      solid([pt(a,r),pt(a,r+thickness),pt(c,r+thickness),pt(c,r)],depth,striped&&i%2?'green':mat,face,plane,near?'closed':'face');
    }
  }
  function window(face,plane,w) {
    const r=w.width/2,pts=[[w.q-r,w.bottom],[w.q+r,w.bottom],[w.q+r,w.spring]];
    for(let i=1;i<=segments;i++)pts.push([w.q+r*Math.cos(i*Math.PI/segments),w.spring+r*Math.sin(i*Math.PI/segments)]);
    solid(pts,.12,'glass',face,plane,'face');
  }
  function lathe(mat,profile,u,v,sides=segments) {
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),sides);g.translate(u,0,v);put(g,mat);
  }
  function column(u,v,y0,y1,r=.24,mat='granite',sides=near?8:5) {
    const g=new THREE.CylinderGeometry(r*.87,r,y1-y0-.6,sides,1);g.translate(u,(y1+y0)/2,v);put(g,mat);
    box('trim',[u,y0+.15,v],[r*2.7,.3,r*2.7]);box('trim',[u,y1-.15,v],[r*2.7,.3,r*2.7]);
  }
  function roof(u0,u1,v0,v1,eave,ridge,mat='roof') {
    const mid=(v0+v1)/2;
    solid([[v0,eave],[v1,eave],[mid,ridge]],u1-u0,mat,'u+',u1);
  }
  function sphere(mat,u,y,v,sx,sy,sz) {
    const g=new THREE.SphereGeometry(1,near?10:6,near?8:4);g.scale(sx,sy,sz);g.translate(u,y,v);put(g,mat);
  }
  function cross(u,v,y,h,mat='gold') {box(mat,[u,y+h/2,v],[.16,h,.16]);box(mat,[u,y+h*.68,v],[h*.62,.16,.16]);}
  return {put,box,bar,wall,arch,window,lathe,column,roof,sphere,cross,solid,rect,near,segments};
}
